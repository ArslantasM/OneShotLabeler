'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Eye, EyeOff, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useTranslation, Language } from '@/lib/i18n';

interface Label {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  className: string;
}

interface ImageFile {
  id: string;
  file: File;
  url: string;
  labels: Label[];
  augmented?: boolean;
}

interface ImageLabelingProps {
  images: ImageFile[];
  currentIndex: number;
  onImageLabeled: (imageId: string, labels: Label[]) => void;
  onIndexChange: (index: number) => void;
  language?: Language;
}

export default function ImageLabeling({ 
  images, 
  currentIndex, 
  onImageLabeled, 
  onIndexChange,
  language = 'tr'
}: ImageLabelingProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const t = useTranslation(language);
  
  const currentImage = images[currentIndex];

  // Debounced canvas redraw
  const debouncedDrawCanvas = useCallback(
    debounce(() => {
      drawCanvas();
    }, 16), // ~60fps
    []
  );

  function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  }

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    if (!canvas || !offscreenCanvas || !currentImage) return;

    const ctx = canvas.getContext('2d');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    if (!ctx || !offscreenCtx) return;

    const img = new Image();
    img.onload = () => {
      setIsLoading(true);
      
      // Calculate scale to fit image in canvas
      const maxWidth = 800;
      const maxHeight = 600;
      const scaleX = maxWidth / img.width;
      const scaleY = maxHeight / img.height;
      const newScale = Math.min(scaleX, scaleY, 1);
      
      setScale(newScale);
      setImageSize({ width: img.width * newScale, height: img.height * newScale });
      
      canvas.width = img.width * newScale;
      canvas.height = img.height * newScale;
      offscreenCanvas.width = img.width * newScale;
      offscreenCanvas.height = img.height * newScale;
      
      // Draw on offscreen canvas first
      offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
      offscreenCtx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      
      // Draw existing labels on offscreen canvas
      if (showLabels) {
        currentImage.labels.forEach((label, index) => {
          offscreenCtx.strokeStyle = `hsl(${index * 137.5 % 360}, 70%, 50%)`;
          offscreenCtx.fillStyle = `hsla(${index * 137.5 % 360}, 70%, 50%, 0.2)`;
          offscreenCtx.lineWidth = 2;
          
          const x = label.x * newScale;
          const y = label.y * newScale;
          const width = label.width * newScale;
          const height = label.height * newScale;
          
          offscreenCtx.fillRect(x, y, width, height);
          offscreenCtx.strokeRect(x, y, width, height);
          
          // Draw label text
          offscreenCtx.fillStyle = `hsl(${index * 137.5 % 360}, 70%, 30%)`;
          offscreenCtx.font = '14px Inter, sans-serif';
          offscreenCtx.fillText(label.className, x, y - 5);
        });
      }
      
      // Copy from offscreen to main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenCanvas, 0, 0);
      
      // Draw current rectangle being drawn on main canvas
      if (currentRect && isDrawing) {
        ctx.strokeStyle = '#3b82f6';
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.lineWidth = 2;
        ctx.fillRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
        ctx.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
      }
      
      setIsLoading(false);
    };
    img.src = currentImage.url;
  }, [currentImage, showLabels, currentRect, isDrawing]);

  useEffect(() => {
    debouncedDrawCanvas();
  }, [debouncedDrawCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!newClassName.trim()) {
      alert('Lütfen önce bir sınıf adı girin!');
      return;
    }
    
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    const width = pos.x - startPos.x;
    const height = pos.y - startPos.y;
    
    const newRect = {
      x: width < 0 ? pos.x : startPos.x,
      y: height < 0 ? pos.y : startPos.y,
      width: Math.abs(width),
      height: Math.abs(height)
    };
    
    setCurrentRect(newRect);
    
    // Gerçek zamanlı çizim için canvas'ı güncelle
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mevcut canvas'ı temizle ve yeniden çiz
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Offscreen canvas'tan kopyala
        const offscreenCanvas = offscreenCanvasRef.current;
        if (offscreenCanvas) {
          ctx.drawImage(offscreenCanvas, 0, 0);
        }
        
        // Yeni dikdörtgeni çiz
        ctx.strokeStyle = '#3b82f6';
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.lineWidth = 2;
        ctx.fillRect(newRect.x, newRect.y, newRect.width, newRect.height);
        ctx.strokeRect(newRect.x, newRect.y, newRect.width, newRect.height);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentRect || !currentImage) return;
    
    if (currentRect.width > 10 && currentRect.height > 10) {
      const newLabel: Label = {
        id: Math.random().toString(36).substr(2, 9),
        x: currentRect.x / scale,
        y: currentRect.y / scale,
        width: currentRect.width / scale,
        height: currentRect.height / scale,
        className: newClassName.trim()
      };
      
      const updatedLabels = [...currentImage.labels, newLabel];
      onImageLabeled(currentImage.id, updatedLabels);
    }
    
    setIsDrawing(false);
    setCurrentRect(null);
  };

  const removeLabel = (labelId: string) => {
    if (!currentImage) return;
    const updatedLabels = currentImage.labels.filter(label => label.id !== labelId);
    onImageLabeled(currentImage.id, updatedLabels);
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  if (!currentImage) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">{t.noImages}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{t.labelingTitle}</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showLabels ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showLabels ? t.hideLabels : t.showLabels}</span>
          </button>
          <div className="text-sm text-slate-600">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">{currentImage.file.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentIndex === images.length - 1}
                  className="p-2 rounded-lg bg-white border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="border border-slate-300 rounded-lg cursor-crosshair max-w-full"
                  style={{ maxHeight: '600px' }}
                />
                <canvas
                  ref={offscreenCanvasRef}
                  style={{ display: 'none' }}
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-900/20 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Class Name Input */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Yeni Etiket Sınıfı
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Örn: araba, kişi, bina..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-text-dark"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
              <button
                onClick={() => setNewClassName('')}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Temizle
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Sınıf adını girdikten sonra görsel üzerinde dikdörtgen çizerek etiketleme yapabilirsiniz.
            </p>
          </div>
        </div>

        {/* Labels Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4">
              Etiketler ({currentImage.labels.length})
            </h3>
            
            {currentImage.labels.length === 0 ? (
              <p className="text-slate-500 text-sm">Henüz etiket eklenmedi.</p>
            ) : (
              <div className="space-y-2">
                {currentImage.labels.map((label, index) => (
                  <div
                    key={label.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: `hsl(${index * 137.5 % 360}, 70%, 50%)` }}
                      />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{label.className}</p>
                        <p className="text-xs text-slate-500">
                          {Math.round(label.width)} × {Math.round(label.height)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeLabel(label.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 mt-4">
            <h3 className="font-semibold text-slate-800 mb-4">İlerleme</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Etiketlenen Görseller</span>
                  <span>{images.filter(img => img.labels.length > 0).length} / {images.length}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(images.filter(img => img.labels.length > 0).length / images.length) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Toplam {images.reduce((sum, img) => sum + img.labels.length, 0)} etiket oluşturuldu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
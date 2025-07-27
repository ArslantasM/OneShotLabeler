'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, Eye, Settings } from 'lucide-react';
import Image from 'next/image';
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

interface AugmentationSettings {
  blur: { enabled: boolean; min: number; max: number; count: number };
  brightness: { enabled: boolean; min: number; max: number; count: number };
  contrast: { enabled: boolean; min: number; max: number; count: number };
  rotation: { enabled: boolean; min: number; max: number; count: number };
  noise: { enabled: boolean; min: number; max: number; count: number };
  flip: { enabled: boolean; horizontal: boolean; vertical: boolean; count: number };
  saturation: { enabled: boolean; min: number; max: number; count: number };
  hue: { enabled: boolean; min: number; max: number; count: number };
  gamma: { enabled: boolean; min: number; max: number; count: number };
  sharpen: { enabled: boolean; min: number; max: number; count: number };
  emboss: { enabled: boolean; min: number; max: number; count: number };
  sepia: { enabled: boolean; min: number; max: number; count: number };
}

interface ImageAugmentationProps {
  images: ImageFile[];
  onAugmentationComplete: (augmentedImages: ImageFile[]) => void;
  language?: Language;
}

export default function ImageAugmentation({ 
  images, 
  onAugmentationComplete,
  language = 'tr'
}: ImageAugmentationProps) {
  const labeledImages = images.filter(img => img.labels.length > 0);
  
  const t = useTranslation(language);

  const [settings, setSettings] = useState<AugmentationSettings>({
    blur: { enabled: false, min: 0, max: 5, count: 5 },
    brightness: { enabled: false, min: 0.5, max: 1.5, count: 5 },
    contrast: { enabled: false, min: 0.5, max: 1.5, count: 5 },
    rotation: { enabled: false, min: -15, max: 15, count: 5 },
    noise: { enabled: false, min: 0, max: 50, count: 5 },
    flip: { enabled: false, horizontal: true, vertical: false, count: 2 },
    saturation: { enabled: false, min: 0, max: 2, count: 5 },
    hue: { enabled: false, min: -180, max: 180, count: 5 },
    gamma: { enabled: false, min: 0.1, max: 3, count: 5 },
    sharpen: { enabled: false, min: 0, max: 2, count: 5 },
    emboss: { enabled: false, min: 0, max: 10, count: 5 },
    sepia: { enabled: false, min: 0, max: 1, count: 5 }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewSidebar, setShowPreviewSidebar] = useState(false);

  const updateSetting = (key: keyof AugmentationSettings, updates: Partial<AugmentationSettings[keyof AugmentationSettings]>) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
    }));
  };

  const applyAugmentation = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, img: HTMLImageElement, augType: string, value: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (augType) {
      case 'blur':
        ctx.filter = `blur(${value}px)`;
        break;
      case 'brightness':
        ctx.filter = `brightness(${value})`;
        break;
      case 'contrast':
        ctx.filter = `contrast(${value})`;
        break;
      case 'saturation':
        ctx.filter = `saturate(${value})`;
        break;
      case 'hue':
        ctx.filter = `hue-rotate(${value}deg)`;
        break;
      case 'sepia':
        ctx.filter = `sepia(${value})`;
        break;
      case 'rotation':
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((value * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        break;
      default:
        ctx.filter = 'none';
    }
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    if (augType === 'rotation') {
      ctx.restore();
    }
    
    if (augType === 'noise') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * value;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    ctx.filter = 'none';
  };

  const startAugmentation = async () => {
    if (labeledImages.length === 0) return;
    
    setIsProcessing(true);
    const augmentedImages: ImageFile[] = [];
    
    try {
      for (const image of labeledImages) {
        const img = document.createElement('img') as HTMLImageElement;
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = image.url;
        });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Her efekt için augmentation yap
        Object.entries(settings).forEach(([effectKey, effect]) => {
          if (effect.enabled && effectKey !== 'flip') {
            const count = (effect as any).count || 5;
            const step = ((effect as any).max - (effect as any).min) / count;
            
            for (let i = 0; i < count; i++) {
              const value = (effect as any).min + (step * i);
              applyAugmentation(canvas, ctx, img, effectKey, value);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  const augmentedFile = new File([blob], `${image.file.name.replace(/\.[^/.]+$/, '')}_${effectKey}_${i}.jpg`, { type: 'image/jpeg' });
                  const augmentedUrl = URL.createObjectURL(blob);
                  
                  augmentedImages.push({
                    id: `${image.id}_${effectKey}_${i}`,
                    file: augmentedFile,
                    url: augmentedUrl,
                    labels: image.labels,
                    augmented: true
                  });
                }
              }, 'image/jpeg', 0.9);
            }
          }
        });
        
        // Flip efektleri
        if (settings.flip.enabled) {
          if (settings.flip.horizontal) {
            ctx.scale(-1, 1);
            ctx.drawImage(img, -canvas.width, 0);
            ctx.scale(-1, 1);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const augmentedFile = new File([blob], `${image.file.name.replace(/\.[^/.]+$/, '')}_flip_h.jpg`, { type: 'image/jpeg' });
                const augmentedUrl = URL.createObjectURL(blob);
                
                augmentedImages.push({
                  id: `${image.id}_flip_h`,
                  file: augmentedFile,
                  url: augmentedUrl,
                  labels: image.labels,
                  augmented: true
                });
              }
            }, 'image/jpeg', 0.9);
          }
          
          if (settings.flip.vertical) {
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, -canvas.height);
            ctx.scale(1, -1);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const augmentedFile = new File([blob], `${image.file.name.replace(/\.[^/.]+$/, '')}_flip_v.jpg`, { type: 'image/jpeg' });
                const augmentedUrl = URL.createObjectURL(blob);
                
                augmentedImages.push({
                  id: `${image.id}_flip_v`,
                  file: augmentedFile,
                  url: augmentedUrl,
                  labels: image.labels,
                  augmented: true
                });
              }
            }, 'image/jpeg', 0.9);
          }
        }
      }
      
      onAugmentationComplete([...labeledImages, ...augmentedImages]);
    } catch (error) {
      console.error('Augmentation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      blur: { enabled: false, min: 0, max: 5, count: 5 },
      brightness: { enabled: false, min: 0.5, max: 1.5, count: 5 },
      contrast: { enabled: false, min: 0.5, max: 1.5, count: 5 },
      rotation: { enabled: false, min: -15, max: 15, count: 5 },
      noise: { enabled: false, min: 0, max: 50, count: 5 },
      flip: { enabled: false, horizontal: true, vertical: false, count: 2 },
      saturation: { enabled: false, min: 0, max: 2, count: 5 },
      hue: { enabled: false, min: -180, max: 180, count: 5 },
      gamma: { enabled: false, min: 0.1, max: 3, count: 5 },
      sharpen: { enabled: false, min: 0, max: 2, count: 5 },
      emboss: { enabled: false, min: 0, max: 10, count: 5 },
      sepia: { enabled: false, min: 0, max: 1, count: 5 }
    });
  };

  if (labeledImages.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-10 h-10 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Etiketlenmiş Görsel Bulunamadı</h3>
        <p className="text-slate-600">Augmentation işlemi için önce görsellerinizi etiketlemeniz gerekiyor.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.augmentationTitle}</h2>
          <p className="text-slate-600">{labeledImages.length} {t.augmentationSubtitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreviewSidebar(!showPreviewSidebar)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showPreviewSidebar ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPreviewSidebar ? t.previewClose : t.previewOpen}</span>
          </button>
          <button
            onClick={resetSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetSettings}</span>
          </button>
          <button
            onClick={startAugmentation}
            disabled={isProcessing}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
              isProcessing
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isProcessing ? t.processing : t.startAugmentation}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Blur */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.blur.enabled}
                  onChange={(e) => updateSetting('blur', { enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-medium text-slate-800">{t.blur}</span>
              </label>
            </div>
            {settings.blur.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Min</label>
                  <input
                    type="number"
                    value={settings.blur.min}
                    onChange={(e) => updateSetting('blur', { min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="0"
                    max="10"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={settings.blur.max}
                    onChange={(e) => updateSetting('blur', { max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="0"
                    max="10"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Adet</label>
                  <input
                    type="number"
                    value={settings.blur.count}
                    onChange={(e) => updateSetting('blur', { count: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Brightness */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.brightness.enabled}
                  onChange={(e) => updateSetting('brightness', { enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-medium text-slate-800">{t.brightness}</span>
              </label>
            </div>
            {settings.brightness.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Min</label>
                  <input
                    type="number"
                    value={settings.brightness.min}
                    onChange={(e) => updateSetting('brightness', { min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="0.1"
                    max="3"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={settings.brightness.max}
                    onChange={(e) => updateSetting('brightness', { max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="0.1"
                    max="3"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Adet</label>
                  <input
                    type="number"
                    value={settings.brightness.count}
                    onChange={(e) => updateSetting('brightness', { count: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contrast */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.contrast.enabled}
                  onChange={(e) => updateSetting('contrast', { enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-medium text-slate-800">{t.contrast}</span>
              </label>
            </div>
            {settings.contrast.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Min</label>
                  <input
                    type="number"
                    value={settings.contrast.min}
                    onChange={(e) => updateSetting('contrast', { min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="0.1"
                    max="3"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={settings.contrast.max}
                    onChange={(e) => updateSetting('contrast', { max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="0.1"
                    max="3"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Adet</label>
                  <input
                    type="number"
                    value={settings.contrast.count}
                    onChange={(e) => updateSetting('contrast', { count: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Rotation */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.rotation.enabled}
                  onChange={(e) => updateSetting('rotation', { enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-medium text-slate-800">{t.rotation}</span>
              </label>
            </div>
            {settings.rotation.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Min (derece)</label>
                  <input
                    type="number"
                    value={settings.rotation.min}
                    onChange={(e) => updateSetting('rotation', { min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="-180"
                    max="180"
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max (derece)</label>
                  <input
                    type="number"
                    value={settings.rotation.max}
                    onChange={(e) => updateSetting('rotation', { max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="-180"
                    max="180"
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Adet</label>
                  <input
                    type="number"
                    value={settings.rotation.count}
                    onChange={(e) => updateSetting('rotation', { count: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm input-text-dark"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Flip */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.flip.enabled}
                  onChange={(e) => updateSetting('flip', { enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-medium text-slate-800">{t.flip}</span>
              </label>
            </div>
            {settings.flip.enabled && (
              <div className="space-y-4">
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.flip.horizontal}
                      onChange={(e) => updateSetting('flip', { horizontal: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{t.horizontal}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.flip.vertical}
                      onChange={(e) => updateSetting('flip', { vertical: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{t.vertical}</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreviewSidebar && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Önizleme</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-2">Orijinal Görsel</h4>
                  <div className="relative w-full h-32 rounded-lg border border-slate-200 overflow-hidden">
                    <Image
                      src={labeledImages[0].url}
                      alt="Original"
                      fill
                      className="object-contain"
                      sizes="320px"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-2">Aktif Efektler</h4>
                  <p className="text-sm text-blue-700">
                    {Object.entries(settings).filter(([_, setting]) => setting.enabled).length} efekt aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
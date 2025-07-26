'use client';

import { useState, useEffect } from 'react';
import { Sliders, Play, Pause, RotateCcw, Download, Eye, Settings } from 'lucide-react';

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
  blur: { enabled: boolean; min: number; max: number; step: number };
  brightness: { enabled: boolean; min: number; max: number; step: number };
  contrast: { enabled: boolean; min: number; max: number; step: number };
  rotation: { enabled: boolean; min: number; max: number; step: number };
  noise: { enabled: boolean; min: number; max: number; step: number };
  flip: { enabled: boolean; horizontal: boolean; vertical: boolean };
}

interface ImageAugmentationProps {
  images: ImageFile[];
  onAugmentationComplete: (augmentedImages: ImageFile[]) => void;
}

export default function ImageAugmentation({ images, onAugmentationComplete }: ImageAugmentationProps) {
  const [settings, setSettings] = useState<AugmentationSettings>({
    blur: { enabled: false, min: 0, max: 5, step: 1 },
    brightness: { enabled: false, min: 0.5, max: 1.5, step: 0.1 },
    contrast: { enabled: false, min: 0.5, max: 1.5, step: 0.1 },
    rotation: { enabled: false, min: -15, max: 15, step: 5 },
    noise: { enabled: false, min: 0, max: 50, step: 10 },
    flip: { enabled: false, horizontal: true, vertical: false }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const labeledImages = images.filter(img => img.labels.length > 0 && !img.augmented);

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
        data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    ctx.filter = 'none';
  };

  const generatePreview = async () => {
    if (labeledImages.length === 0) return;
    
    const currentImage = labeledImages[selectedImageIndex];
    const img = new Image();
    
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = Math.min(img.width, 400);
      canvas.height = Math.min(img.height, 300);
      
      // Apply first enabled augmentation for preview
      const enabledAugs = Object.entries(settings).filter(([_, setting]) => setting.enabled);
      if (enabledAugs.length > 0) {
        const [augType, augSetting] = enabledAugs[0];
        if (augType !== 'flip') {
          const value = augSetting.min + (augSetting.max - augSetting.min) / 2;
          await applyAugmentation(canvas, ctx, img, augType, value);
        } else {
          ctx.save();
          if (augSetting.horizontal) {
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);
          }
          if (augSetting.vertical) {
            ctx.scale(1, -1);
            ctx.translate(0, -canvas.height);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      } else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      
      setPreviewImage(canvas.toDataURL());
    };
    
    img.src = currentImage.url;
  };

  useEffect(() => {
    generatePreview();
  }, [settings, selectedImageIndex, labeledImages]);

  const startAugmentation = async () => {
    if (labeledImages.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    const augmentedImages: ImageFile[] = [];
    const enabledAugmentations = Object.entries(settings).filter(([_, setting]) => setting.enabled);
    
    if (enabledAugmentations.length === 0) {
      alert('Lütfen en az bir augmentation seçeneği etkinleştirin!');
      setIsProcessing(false);
      return;
    }
    
    let totalOperations = 0;
    let completedOperations = 0;
    
    // Calculate total operations
    for (const image of labeledImages) {
      for (const [augType, augSetting] of enabledAugmentations) {
        if (augType === 'flip') {
          if (augSetting.horizontal) totalOperations++;
          if (augSetting.vertical) totalOperations++;
        } else {
          const steps = Math.ceil((augSetting.max - augSetting.min) / augSetting.step) + 1;
          totalOperations += steps;
        }
      }
    }
    
    for (const image of labeledImages) {
      const img = new Image();
      
      await new Promise<void>((resolve) => {
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve();
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          for (const [augType, augSetting] of enabledAugmentations) {
            if (augType === 'flip') {
              // Handle flip augmentation
              if (augSetting.horizontal) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.translate(-canvas.width, 0);
                ctx.drawImage(img, 0, 0);
                ctx.restore();
                
                const blob = await new Promise<Blob>((resolve) => {
                  canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
                });
                
                const file = new File([blob], `${image.file.name.split('.')[0]}_flip_h.jpg`, { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                
                // Adjust labels for horizontal flip
                const adjustedLabels = image.labels.map(label => ({
                  ...label,
                  x: img.width - label.x - label.width
                }));
                
                augmentedImages.push({
                  id: Math.random().toString(36).substr(2, 9),
                  file,
                  url,
                  labels: adjustedLabels,
                  augmented: true
                });
                
                completedOperations++;
                setProgress((completedOperations / totalOperations) * 100);
              }
              
              if (augSetting.vertical) {
                ctx.save();
                ctx.scale(1, -1);
                ctx.translate(0, -canvas.height);
                ctx.drawImage(img, 0, 0);
                ctx.restore();
                
                const blob = await new Promise<Blob>((resolve) => {
                  canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
                });
                
                const file = new File([blob], `${image.file.name.split('.')[0]}_flip_v.jpg`, { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                
                // Adjust labels for vertical flip
                const adjustedLabels = image.labels.map(label => ({
                  ...label,
                  y: img.height - label.y - label.height
                }));
                
                augmentedImages.push({
                  id: Math.random().toString(36).substr(2, 9),
                  file,
                  url,
                  labels: adjustedLabels,
                  augmented: true
                });
                
                completedOperations++;
                setProgress((completedOperations / totalOperations) * 100);
              }
            } else {
              // Handle other augmentations
              for (let value = augSetting.min; value <= augSetting.max; value += augSetting.step) {
                await applyAugmentation(canvas, ctx, img, augType, value);
                
                const blob = await new Promise<Blob>((resolve) => {
                  canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
                });
                
                const file = new File([blob], `${image.file.name.split('.')[0]}_${augType}_${value}.jpg`, { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                
                augmentedImages.push({
                  id: Math.random().toString(36).substr(2, 9),
                  file,
                  url,
                  labels: [...image.labels], // Copy original labels
                  augmented: true
                });
                
                completedOperations++;
                setProgress((completedOperations / totalOperations) * 100);
                
                // Small delay to prevent UI blocking
                await new Promise(resolve => setTimeout(resolve, 10));
              }
            }
          }
          
          resolve();
        };
        
        img.src = image.url;
      });
    }
    
    onAugmentationComplete(augmentedImages);
    setIsProcessing(false);
    setProgress(100);
  };

  const resetSettings = () => {
    setSettings({
      blur: { enabled: false, min: 0, max: 5, step: 1 },
      brightness: { enabled: false, min: 0.5, max: 1.5, step: 0.1 },
      contrast: { enabled: false, min: 0.5, max: 1.5, step: 0.1 },
      rotation: { enabled: false, min: -15, max: 15, step: 5 },
      noise: { enabled: false, min: 0, max: 50, step: 10 },
      flip: { enabled: false, horizontal: true, vertical: false }
    });
  };

  if (labeledImages.length === 0) {
    return (
      <div className="p-8 text-center">
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
          <h2 className="text-2xl font-bold text-slate-800">Veri Augmentation</h2>
          <p className="text-slate-600">{labeledImages.length} etiketlenmiş görsel için çeşitlendirme yapılacak</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={resetSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sıfırla</span>
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
            <span>{isProcessing ? 'İşleniyor...' : 'Augmentation Başlat'}</span>
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
                <span className="font-medium text-slate-800">Bulanıklaştırma (Blur)</span>
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={settings.blur.max}
                    onChange={(e) => updateSetting('blur', { max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Adım</label>
                  <input
                    type="number"
                    value={settings.blur.step}
                    onChange={(e) => updateSetting('blur', { step: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0.1"
                    max="2"
                    step="0.1"
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
                <span className="font-medium text-slate-800">Parlaklık (Brightness)</span>
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0.1"
                    max="2"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={settings.brightness.max}
                    onChange={(e) => updateSetting('brightness', { max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0.1"
                    max="2"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Adım</label>
                  <input
                    type="number"
                    value={settings.brightness.step}
                    onChange={(e) => updateSetting('brightness', { step: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0.1"
                    max="0.5"
                    step="0.1"
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
                <span className="font-medium text-slate-800">Kontrast (Contrast)</span>
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0.1"
                    max="2"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max</label>
                  <input
                    type="number"
                    value={settings.contrast.max}
                    onChange={(e) => updateSetting('contrast', { max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0.1"
                    max="2"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Adım</label>
                  <input
                    type="number"
                    value={settings.contrast.step}
                    onChange={(e) => updateSetting('contrast', { step: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="0.1"
                    max="0.5"
                    step="0.1"
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
                <span className="font-medium text-slate-800">Döndürme (Rotation)</span>
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="-180"
                    max="180"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Max (derece)</label>
                  <input
                    type="number"
                    value={settings.rotation.max}
                    onChange={(e) => updateSetting('rotation', { max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="-180"
                    max="180"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Adım</label>
                  <input
                    type="number"
                    value={settings.rotation.step}
                    onChange={(e) => updateSetting('rotation', { step: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    min="1"
                    max="45"
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
                <span className="font-medium text-slate-800">Çevirme (Flip)</span>
              </label>
            </div>
            {settings.flip.enabled && (
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.flip.horizontal}
                    onChange={(e) => updateSetting('flip', { horizontal: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Yatay</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.flip.vertical}
                    onChange={(e) => updateSetting('flip', { vertical: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Dikey</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 border border-slate-200 sticky top-24">
            <h3 className="font-semibold text-slate-800 mb-4">Önizleme</h3>
            
            {labeledImages.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-2">Görsel Seç</label>
                <select
                  value={selectedImageIndex}
                  onChange={(e) => setSelectedImageIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {labeledImages.map((image, index) => (
                    <option key={image.id} value={index}>
                      {image.file.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-full h-48 bg-slate-200 rounded-lg flex items-center justify-center">
                  <Eye className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>
            
            {isProcessing && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>İşleniyor...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="text-sm text-slate-600 space-y-2">
              <div className="flex justify-between">
                <span>Orijinal Görseller:</span>
                <span>{labeledImages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Etkin Augmentations:</span>
                <span>{Object.values(settings).filter(s => s.enabled).length}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Tahmini Çıktı:</span>
                <span>
                  {Object.entries(settings).reduce((total, [key, setting]) => {
                    if (!setting.enabled) return total;
                    if (key === 'flip') {
                      return total + (setting.horizontal ? 1 : 0) + (setting.vertical ? 1 : 0);
                    }
                    return total + Math.ceil((setting.max - setting.min) / setting.step) + 1;
                  }, 0) * labeledImages.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
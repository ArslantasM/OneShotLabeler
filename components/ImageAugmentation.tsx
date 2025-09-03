'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Eye, EyeOff, Settings, Zap } from 'lucide-react';
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

interface AdvancedAugmentationSettings {
  // Geometric Transformations
  rotation: { enabled: boolean; min: number; max: number; count: number };
  scaling: { enabled: boolean; min: number; max: number; count: number };
  translation: { enabled: boolean; minX: number; maxX: number; minY: number; maxY: number; count: number };
  flip: { enabled: boolean; horizontal: boolean; vertical: boolean; count: number };
  
  // Color Space Transformations
  brightness: { enabled: boolean; min: number; max: number; count: number };
  contrast: { enabled: boolean; min: number; max: number; count: number };
  saturation: { enabled: boolean; min: number; max: number; count: number };
  hue: { enabled: boolean; min: number; max: number; count: number };
  gamma: { enabled: boolean; min: number; max: number; count: number };
  
  // Noise and Filtering
  gaussianNoise: { enabled: boolean; mean: number; std: number; count: number };
  saltPepperNoise: { enabled: boolean; ratio: number; count: number };
  gaussianBlur: { enabled: boolean; min: number; max: number; count: number };
  sharpen: { enabled: boolean; strength: number; count: number };
  
  // Advanced Effects
  cutout: { enabled: boolean; holes: number; size: number; count: number };
  
  // Weather Effects
  rain: { enabled: boolean; intensity: number; count: number };
  snow: { enabled: boolean; intensity: number; count: number };
  fog: { enabled: boolean; intensity: number; count: number };
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
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPreviewEffect, setSelectedPreviewEffect] = useState<string>('');
  const [previewValue, setPreviewValue] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('geometric');
  const [canvasReady, setCanvasReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // İlk görseli yüklemek için yardımcı fonksiyon
  const loadInitialImage = useCallback(() => {
    if (!previewCanvasRef.current || !originalCanvasRef.current || labeledImages.length === 0 || imageLoaded) {
      return;
    }
    
    const previewCanvas = previewCanvasRef.current;
    const originalCanvas = originalCanvasRef.current;
    const previewCtx = previewCanvas.getContext('2d', { willReadFrequently: true });
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!previewCtx || !originalCtx) {
      return;
    }
    
    try {
      // Create a fresh blob URL from the file
      const firstImage = labeledImages[0];
      const freshBlob = new Blob([firstImage.file], { type: firstImage.file.type });
      const freshUrl = URL.createObjectURL(freshBlob);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        
        // Canvas boyutlarını ayarla
        previewCanvas.width = width;
        previewCanvas.height = height;
        originalCanvas.width = width;
        originalCanvas.height = height;
        
        // CSS boyutunu da ayarla
        previewCanvas.style.width = width + 'px';
        previewCanvas.style.height = height + 'px';
        originalCanvas.style.width = width + 'px';
        originalCanvas.style.height = height + 'px';
        
        // Her iki canvas'a da görseli çiz
        originalCtx.clearRect(0, 0, width, height);
        originalCtx.drawImage(img, 0, 0, width, height);
        
        previewCtx.clearRect(0, 0, width, height);
        previewCtx.drawImage(img, 0, 0, width, height);
        
        setImageLoaded(true);
        
        // Clean up the fresh URL
        URL.revokeObjectURL(freshUrl);
      };
      
      img.onerror = (error) => {
        console.error('İlk görsel yüklenirken hata:', error);
        URL.revokeObjectURL(freshUrl);
      };
      
      img.src = freshUrl;
    } catch (error) {
      console.error('İlk resim yükleme hatası:', error);
    }
  }, [labeledImages, imageLoaded]);

  // Canvas referanslarının hazır olup olmadığını kontrol et
  useEffect(() => {
    // Clear any existing timeout
    if (canvasCheckTimeoutRef.current) {
      clearTimeout(canvasCheckTimeoutRef.current);
    }

    const checkCanvasRefs = () => {
      const previewReady = !!previewCanvasRef.current;
      const originalReady = !!originalCanvasRef.current;
      const bothReady = previewReady && originalReady;
      
      if (bothReady !== canvasReady) {
        setCanvasReady(bothReady);
        return true; // State değişti
      } else {
        return false; // State değişmedi
      }
    };

    // Sadece showPreview true ise canvas kontrolü yap
    if (showPreview) {
      // İlk kontrol hemen yap
      const initialCheck = checkCanvasRefs();
      
      // Sonra da birkaç timeout ile kontrol et (canvas mount için zaman tanı)
      canvasCheckTimeoutRef.current = setTimeout(() => {
        checkCanvasRefs();
      }, 100);
      
      // Ek güvenlik için ikinci bir kontrol
      setTimeout(() => {
        checkCanvasRefs();
      }, 300);
    } else {
      // showPreview false ise canvas durumunu da sıfırla
      setCanvasReady(false);
      setImageLoaded(false);
    }
    
    return () => {
      if (canvasCheckTimeoutRef.current) {
        clearTimeout(canvasCheckTimeoutRef.current);
      }
    };
  }, [showPreview, labeledImages.length, canvasReady]);

  // Canvas hazır olduğunda ve gerekli koşullar sağlandığında ilk resmi yükle
  useEffect(() => {
    if (canvasReady && labeledImages.length > 0 && !imageLoaded) {
      loadInitialImage();
    }
  }, [canvasReady, labeledImages.length, imageLoaded, loadInitialImage]);
  
  const [settings, setSettings] = useState<AdvancedAugmentationSettings>({
    // Geometric Transformations
    rotation: { enabled: false, min: -30, max: 30, count: 5 },
    scaling: { enabled: false, min: 0.8, max: 1.2, count: 5 },
    translation: { enabled: false, minX: -20, maxX: 20, minY: -20, maxY: 20, count: 5 },
    flip: { enabled: false, horizontal: true, vertical: false, count: 2 },
    
    // Color Space Transformations
    brightness: { enabled: false, min: 0.7, max: 1.3, count: 5 },
    contrast: { enabled: false, min: 0.7, max: 1.3, count: 5 },
    saturation: { enabled: false, min: 0.5, max: 1.5, count: 5 },
    hue: { enabled: false, min: -30, max: 30, count: 5 },
    gamma: { enabled: false, min: 0.5, max: 2.0, count: 5 },
    
    // Noise and Filtering
    gaussianNoise: { enabled: false, mean: 0, std: 25, count: 5 },
    saltPepperNoise: { enabled: false, ratio: 0.05, count: 5 },
    gaussianBlur: { enabled: false, min: 1, max: 5, count: 5 },
    sharpen: { enabled: false, strength: 1.5, count: 5 },
    
    // Advanced Effects
    cutout: { enabled: false, holes: 3, size: 20, count: 5 },
    
    // Weather Effects
    rain: { enabled: false, intensity: 0.5, count: 3 },
    snow: { enabled: false, intensity: 0.3, count: 3 },
    fog: { enabled: false, intensity: 0.4, count: 3 }
  });

  const updateSetting = (key: string, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof AdvancedAugmentationSettings], ...updates }
    }));
  };

  // Get slider configuration for each effect type
  const getSliderConfig = (effectKey: string) => {
    const configs: Record<string, { min: number; max: number; step: number; unit?: string }> = {
      rotation: { min: -180, max: 180, step: 5, unit: '°' },
      scaling: { min: 0.5, max: 2.0, step: 0.1, unit: 'x' },
      translation: { min: -50, max: 50, step: 5, unit: 'px' },
      flip: { min: 0, max: 1, step: 1, unit: '' }, // 0=yatay, 1=dikey
      brightness: { min: 0.2, max: 2.0, step: 0.1 },
      contrast: { min: 0.2, max: 2.0, step: 0.1 },
      saturation: { min: 0.0, max: 2.0, step: 0.1 },
      hue: { min: -180, max: 180, step: 10, unit: '°' },
      gamma: { min: 0.2, max: 3.0, step: 0.1 },
      gaussianNoise: { min: 0, max: 50, step: 1 },
      saltPepperNoise: { min: 0.0, max: 0.2, step: 0.01 },
      gaussianBlur: { min: 0.5, max: 10, step: 0.5, unit: 'px' },
      sharpen: { min: 0.5, max: 3.0, step: 0.1 },
      cutout: { min: 5, max: 50, step: 5, unit: 'px' },
      rain: { min: 0.1, max: 1.0, step: 0.1 },
      snow: { min: 0.1, max: 1.0, step: 0.1 },
      fog: { min: 0.1, max: 1.0, step: 0.1 }
    };
    
    return configs[effectKey] || { min: 0, max: 1, step: 0.1 };
  };

  // Get effect title in Turkish
  const getEffectTitle = (effectKey: string) => {
    const titles: Record<string, string> = {
      rotation: 'Döndürme',
      scaling: 'Ölçeklendirme',
      translation: 'Öteleme',
      flip: 'Çevirme',
      brightness: 'Parlaklık',
      contrast: 'Kontrast',
      saturation: 'Doygunluk',
      hue: 'Renk Tonu',
      gamma: 'Gamma Düzeltme',
      gaussianNoise: 'Gaussian Gürültü',
      saltPepperNoise: 'Tuz-Biber Gürültü',
      gaussianBlur: 'Gaussian Bulanıklık',
      sharpen: 'Keskinleştirme',
      cutout: 'Kesme',
      rain: 'Yağmur Efekti',
      snow: 'Kar Efekti',
      fog: 'Sis Efekti'
    };
    
    return titles[effectKey] || effectKey;
  };

  // Advanced image processing functions
  const applyGaussianNoise = (imageData: ImageData, mean: number, std: number) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = gaussianRandom(mean, std);
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    return imageData;
  };

  const applySaltPepperNoise = (imageData: ImageData, ratio: number) => {
    const data = imageData.data;
    const numPixels = data.length / 4;
    const numNoisePixels = Math.floor(numPixels * ratio);
    
    for (let i = 0; i < numNoisePixels; i++) {
      const pixelIndex = Math.floor(Math.random() * numPixels) * 4;
      const value = Math.random() > 0.5 ? 255 : 0;
      data[pixelIndex] = value;
      data[pixelIndex + 1] = value;
      data[pixelIndex + 2] = value;
    }
    return imageData;
  };

  const applyCutout = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, holes: number, size: number) => {
    for (let i = 0; i < holes; i++) {
      const x = Math.random() * (canvas.width - size);
      const y = Math.random() * (canvas.height - size);
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, size, size);
    }
  };

  const applyWeatherEffect = (imageData: ImageData, effect: string, intensity: number) => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    switch (effect) {
      case 'rain':
        for (let i = 0; i < 1000 * intensity; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
          if (pixelIndex < data.length) {
            data[pixelIndex] = Math.min(255, data[pixelIndex] + 50);
            data[pixelIndex + 1] = Math.min(255, data[pixelIndex + 1] + 50);
            data[pixelIndex + 2] = Math.min(255, data[pixelIndex + 2] + 80);
          }
        }
        break;
      
      case 'snow':
        for (let i = 0; i < 500 * intensity; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
          if (pixelIndex < data.length) {
            data[pixelIndex] = 255;
            data[pixelIndex + 1] = 255;
            data[pixelIndex + 2] = 255;
          }
        }
        break;
        
      case 'fog':
        for (let i = 0; i < data.length; i += 4) {
          const fogValue = 255 * intensity;
          data[i] = data[i] * (1 - intensity) + fogValue * intensity;
          data[i + 1] = data[i + 1] * (1 - intensity) + fogValue * intensity;
          data[i + 2] = data[i + 2] * (1 - intensity) + fogValue * intensity;
        }
        break;
    }
    
    return imageData;
  };

  const gaussianRandom = (mean: number, std: number) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const applyPreviewEffect = useCallback((effectKey: string, value: number) => {
    if (!canvasReady || !imageLoaded) {
      return;
    }
    
    if (!previewCanvasRef.current || !originalCanvasRef.current || labeledImages.length === 0) {
      return;
    }
    
    const previewCanvas = previewCanvasRef.current;
    const originalCanvas = originalCanvasRef.current;
    const previewCtx = previewCanvas.getContext('2d', { willReadFrequently: true });
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!previewCtx || !originalCtx) {
      return;
    }

    try {
      // Create a fresh blob URL from the file
      const firstImage = labeledImages[0];
      const freshBlob = new Blob([firstImage.file], { type: firstImage.file.type });
      const freshUrl = URL.createObjectURL(freshBlob);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Canvas boyutunu ayarla
          const maxSize = 200;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          const width = img.width * scale;
          const height = img.height * scale;
          
          // Canvas boyutlarını ayarla
          previewCanvas.width = width;
          previewCanvas.height = height;
          originalCanvas.width = width;
          originalCanvas.height = height;
          
          // CSS boyutunu da ayarla
          previewCanvas.style.width = width + 'px';
          previewCanvas.style.height = height + 'px';
          originalCanvas.style.width = width + 'px';
          originalCanvas.style.height = height + 'px';
          
          // Orijinal resmi çiz
          originalCtx.clearRect(0, 0, width, height);
          originalCtx.drawImage(img, 0, 0, width, height);
          
          // Önizleme için efekt uygula
          previewCtx.clearRect(0, 0, width, height);
          previewCtx.filter = 'none';
          previewCtx.setTransform(1, 0, 0, 1, 0, 0);
          
          switch (effectKey) {
            case 'brightness':
              previewCtx.filter = `brightness(${value})`;
              previewCtx.drawImage(img, 0, 0, width, height);
              break;
            case 'contrast':
              previewCtx.filter = `contrast(${value})`;
              previewCtx.drawImage(img, 0, 0, width, height);
              break;
            case 'saturation':
              previewCtx.filter = `saturate(${value})`;
              previewCtx.drawImage(img, 0, 0, width, height);
              break;
            case 'hue':
              previewCtx.filter = `hue-rotate(${value}deg)`;
              previewCtx.drawImage(img, 0, 0, width, height);
              break;
            case 'gamma':
              const gammaValue = Math.pow(value, 1/2.2);
              previewCtx.filter = `brightness(${gammaValue}) contrast(${1.2 - (value - 1) * 0.2})`;
              previewCtx.drawImage(img, 0, 0, width, height);
              break;
            case 'gaussianBlur':
              previewCtx.filter = `blur(${value}px)`;
              previewCtx.drawImage(img, 0, 0, width, height);
              break;
            case 'rotation':
              previewCtx.save();
              previewCtx.translate(width / 2, height / 2);
              previewCtx.rotate((value * Math.PI) / 180);
              previewCtx.translate(-width / 2, -height / 2);
              previewCtx.drawImage(img, 0, 0, width, height);
              previewCtx.restore();
              break;
            case 'scaling':
              previewCtx.save();
              previewCtx.translate(width / 2, height / 2);
              previewCtx.scale(value, value);
              previewCtx.translate(-width / 2, -height / 2);
              previewCtx.drawImage(img, 0, 0, width, height);
              previewCtx.restore();
              break;
            case 'flip':
              previewCtx.save();
              if (value === 0) {
                // Yatay çevirme
                previewCtx.scale(-1, 1);
                previewCtx.drawImage(img, -width, 0, width, height);
              } else {
                // Dikey çevirme
                previewCtx.scale(1, -1);
                previewCtx.drawImage(img, 0, -height, width, height);
              }
              previewCtx.restore();
              break;
            default:
              previewCtx.filter = 'none';
              previewCtx.drawImage(img, 0, 0, width, height);
          }
          
          // Apply advanced effects
          if (['gaussianNoise', 'saltPepperNoise', 'rain', 'snow', 'fog'].includes(effectKey)) {
            // Önce normal resmi çiz
            previewCtx.filter = 'none';
            previewCtx.drawImage(img, 0, 0, width, height);
            const imageData = previewCtx.getImageData(0, 0, width, height);
            let processedData;
            
            switch (effectKey) {
              case 'gaussianNoise':
                processedData = applyGaussianNoise(imageData, 0, value);
                break;
              case 'saltPepperNoise':
                processedData = applySaltPepperNoise(imageData, value);
                break;
              case 'rain':
              case 'snow':
              case 'fog':
                processedData = applyWeatherEffect(imageData, effectKey, value);
                break;
              default:
                processedData = imageData;
            }
            
            previewCtx.putImageData(processedData, 0, 0);
          }
          
          if (effectKey === 'cutout') {
            previewCtx.filter = 'none';
            previewCtx.drawImage(img, 0, 0, width, height);
            applyCutout(previewCanvas, previewCtx, 3, value);
          }
          
          // Reset filter
          previewCtx.filter = 'none';
          
          // Clean up the fresh URL
          URL.revokeObjectURL(freshUrl);
        } catch (error) {
          console.error('Efekt uygulama hatası:', error);
          URL.revokeObjectURL(freshUrl);
        }
      };
      
      img.onerror = (error) => {
        console.error('Önizleme resmi yüklenemedi:', error);
        URL.revokeObjectURL(freshUrl);
      };
      
      img.src = freshUrl;
    } catch (error) {
      console.error('Önizleme efekti uygulama hatası:', error);
    }
  }, [labeledImages, canvasReady, imageLoaded]);

  useEffect(() => {
    if (selectedPreviewEffect && previewValue !== undefined && canvasReady && showPreview && imageLoaded) {
      const timeoutId = setTimeout(() => {
        applyPreviewEffect(selectedPreviewEffect, previewValue);
      }, 150);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedPreviewEffect, previewValue, canvasReady, showPreview, imageLoaded, applyPreviewEffect]);

  // Reset image loaded state when images change
  useEffect(() => {
    setImageLoaded(false);
    setCanvasReady(false); // Canvas durumunu da sıfırla
  }, [labeledImages.length]);

  const categories = {
    geometric: {
      title: 'Geometrik Dönüşümler',
      icon: '🔄',
      effects: ['rotation', 'scaling', 'translation', 'flip']
    },
    color: {
      title: 'Renk Dönüşümleri',
      icon: '🎨',
      effects: ['brightness', 'contrast', 'saturation', 'hue', 'gamma']
    },
    noise: {
      title: 'Gürültü ve Filtreleme',
      icon: '📶',
      effects: ['gaussianNoise', 'saltPepperNoise', 'gaussianBlur', 'sharpen']
    },
    advanced: {
      title: 'Gelişmiş Efektler',
      icon: '⚡',
      effects: ['cutout']
    },
    weather: {
      title: 'Hava Durumu',
      icon: '🌦️',
      effects: ['rain', 'snow', 'fog']
    }
  };

  const startAdvancedAugmentation = async () => {
    if (labeledImages.length === 0) return;
    
    // Etkin efektleri kontrol et
    const enabledEffects = Object.entries(settings).filter(([_, effect]) => effect.enabled);
    if (enabledEffects.length === 0) {
      alert('Lütfen en az bir efekt etkinleştirin!');
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    const augmentedImages: ImageFile[] = [];
    
    // Toplam işlem sayısını hesapla
    const totalOperations = labeledImages.length * enabledEffects.reduce((sum, [_, effect]) => sum + (effect.count || 1), 0);
    let completedOperations = 0;
    
    try {
      for (let imageIndex = 0; imageIndex < labeledImages.length; imageIndex++) {
        const image = labeledImages[imageIndex];
        
        // İlk progress güncellemesi
        const baseProgress = (imageIndex / labeledImages.length) * 100;
        setProcessingProgress(baseProgress);
        
        const img = document.createElement('img') as HTMLImageElement;
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Resim yükleme zaman aşımı'));
          }, 10000);
          
          img.onload = () => {
            clearTimeout(timeout);
            resolve(undefined);
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error(`Resim yüklenemedi: ${image.file.name}`));
          };
          
          // Blob URL yerine File object'ten yeni blob URL oluştur
          try {
            const freshBlob = new Blob([image.file], { type: image.file.type });
            const freshUrl = URL.createObjectURL(freshBlob);
            img.src = freshUrl;
            
            // Cleanup function
            img.onload = () => {
              clearTimeout(timeout);
              URL.revokeObjectURL(freshUrl);
              resolve(undefined);
            };
            
            img.onerror = () => {
              clearTimeout(timeout);
              URL.revokeObjectURL(freshUrl);
              reject(new Error(`Resim yüklenemedi: ${image.file.name}`));
            };
          } catch (blobError) {
            clearTimeout(timeout);
            reject(new Error(`Blob oluşturma hatası: ${blobError}`));
          }
        });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply each enabled effect
        for (const [effectKey, effect] of enabledEffects) {
          const count = effect.count || 1;
          
          for (let i = 0; i < count; i++) {
            try {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Apply the effect
              if (effectKey === 'flip') {
                if ((effect as any).horizontal) {
                  ctx.save();
                  ctx.scale(-1, 1);
                  ctx.drawImage(img, -canvas.width, 0);
                  ctx.restore();
                } else if ((effect as any).vertical) {
                  ctx.save();
                  ctx.scale(1, -1);
                  ctx.drawImage(img, 0, -canvas.height);
                  ctx.restore();
                }
              } else {
                // Apply filter effects
                let value;
                if ((effect as any).min !== undefined && (effect as any).max !== undefined) {
                  const step = ((effect as any).max - (effect as any).min) / count;
                  value = (effect as any).min + (step * i);
                } else {
                  value = (effect as any).intensity || (effect as any).std || (effect as any).strength || 1;
                }
                
                switch (effectKey) {
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
                  case 'gaussianBlur':
                    ctx.filter = `blur(${value}px)`;
                    break;
                  case 'rotation':
                    ctx.save();
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    ctx.rotate((value * Math.PI) / 180);
                    ctx.translate(-canvas.width / 2, -canvas.height / 2);
                    break;
                }
                
                ctx.drawImage(img, 0, 0);
                
                if (effectKey === 'rotation') {
                  ctx.restore();
                }
                
                // Apply advanced effects
                if (['gaussianNoise', 'saltPepperNoise', 'rain', 'snow', 'fog'].includes(effectKey)) {
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  let processedData;
                  
                  switch (effectKey) {
                    case 'gaussianNoise':
                      processedData = applyGaussianNoise(imageData, (effect as any).mean, value);
                      break;
                    case 'saltPepperNoise':
                      processedData = applySaltPepperNoise(imageData, (effect as any).ratio);
                      break;
                    case 'rain':
                    case 'snow':
                    case 'fog':
                      processedData = applyWeatherEffect(imageData, effectKey, (effect as any).intensity);
                      break;
                    default:
                      processedData = imageData;
                  }
                  
                  ctx.putImageData(processedData, 0, 0);
                }
                
                if (effectKey === 'cutout') {
                  applyCutout(canvas, ctx, (effect as any).holes, (effect as any).size);
                }
              }
              
              // Convert to blob and create new image
              const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, 'image/jpeg', 0.9);
              });
              
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
              
              // Her efekt tamamlandığında progress güncelle
              completedOperations++;
              const progress = (completedOperations / totalOperations) * 100;
              setProcessingProgress(Math.min(progress, 99)); // 99% max, 100% sadece tamamen bitince
              
            } catch (effectError) {
              console.error(`Efekt uygulama hatası (${effectKey}):`, effectError);
              completedOperations++;
              const progress = (completedOperations / totalOperations) * 100;
              setProcessingProgress(Math.min(progress, 99));
            }
          }
        }
      }
      
      console.log('Gelişmiş augmentation tamamlandı:', augmentedImages.length, 'yeni görsel oluşturuldu');
      setProcessingProgress(100); // İşlem tamamen bitti
      
      // Kısa bir gecikme ile callback çağır
      setTimeout(() => {
        onAugmentationComplete([...labeledImages, ...augmentedImages]);
      }, 500);
      
    } catch (error) {
      console.error('Augmentation hatası:', error);
      let errorMessage = 'Augmentation sırasında bir hata oluştu!';
      
      if (error instanceof Error) {
        if (error.message.includes('zaman aşımı')) {
          errorMessage += '\n\nResim yükleme çok uzun sürdü. Lütfen resim boyutlarını kontrol edin.';
        } else if (error.message.includes('ERR_FILE_NOT_FOUND')) {
          errorMessage += '\n\nResim dosyası bulunamadı. Lütfen resmi yeniden yükleyin.';
        } else if (error.message.includes('Blob')) {
          errorMessage += '\n\nResim işleme hatası. Dosya formatını kontrol edin.';
        } else {
          errorMessage += `\n\nDetay: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setProcessingProgress(0);
      }, 2000); // 2 saniye sonra progress'i sıfırla
    }
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
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            Gelişmiş Veri Augmentation
          </h2>
          <p className="text-slate-600">{labeledImages.length} etiketlenmiş görsel için profesyonel augmentation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showPreview ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPreview ? 'Önizlemeyi Gizle' : 'Önizlemeyi Göster'}</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sıfırla</span>
          </button>
          <button
            onClick={startAdvancedAugmentation}
            disabled={isProcessing}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
              isProcessing
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isProcessing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isProcessing ? 'İşleniyor...' : 'Augmentation Başlat'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mb-6 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium text-slate-800">Gelişmiş augmentation işleniyor...</span>
            </div>
            <span className="text-sm font-medium text-blue-600">{Math.round(processingProgress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-slate-600">
            {processingProgress < 10 && 'Başlatılıyor...'}
            {processingProgress >= 10 && processingProgress < 90 && 'İşleniyor...'}
            {processingProgress >= 90 && processingProgress < 100 && 'Tamamlanıyor...'}
            {processingProgress >= 100 && 'Tamamlandı!'}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 border border-slate-200 sticky top-4">
            <h3 className="font-semibold text-slate-800 mb-4">Efekt Kategorileri</h3>
            <div className="space-y-2">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeCategory === key
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-sm">{category.title}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Active Effects Summary */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Aktif Efektler</h4>
              <p className="text-sm text-green-700">
                {Object.entries(settings).filter(([_, setting]) => setting.enabled).length} efekt seçildi
              </p>
            </div>
          </div>
        </div>

        {/* Effects Panel */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {categories[activeCategory as keyof typeof categories]?.effects.map((effectKey) => {
              const effect = settings[effectKey as keyof AdvancedAugmentationSettings];
              return (
                <div key={effectKey} className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={effect.enabled}
                        onChange={(e) => updateSetting(effectKey, { enabled: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-800">
                        {getEffectTitle(effectKey)}
                      </span>
                    </label>
                    <button
                      onClick={() => {
                        const config = getSliderConfig(effectKey);
                        const midValue = (config.min + config.max) / 2;
                        
                        setSelectedPreviewEffect(effectKey);
                        setPreviewValue(midValue);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      Önizle
                    </button>
                  </div>
                  
                  {effect.enabled && (
                    <div className="space-y-4">
                      {effectKey === 'flip' ? (
                        <div className="flex space-x-6">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={(effect as any).horizontal}
                              onChange={(e) => updateSetting(effectKey, { horizontal: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-slate-700">Yatay</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={(effect as any).vertical}
                              onChange={(e) => updateSetting(effectKey, { vertical: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-slate-700">Dikey</span>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Min-Max Range Sliders */}
                          {(effect as any).min !== undefined && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Minimum Değer: {(effect as any).min.toFixed(1)}{getSliderConfig(effectKey).unit || ''}
                                </label>
                                <input
                                  type="range"
                                  min={getSliderConfig(effectKey).min}
                                  max={getSliderConfig(effectKey).max}
                                  step={getSliderConfig(effectKey).step}
                                  value={(effect as any).min}
                                  onChange={(e) => updateSetting(effectKey, { min: Number(e.target.value) })}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Maksimum Değer: {(effect as any).max.toFixed(1)}{getSliderConfig(effectKey).unit || ''}
                                </label>
                                <input
                                  type="range"
                                  min={getSliderConfig(effectKey).min}
                                  max={getSliderConfig(effectKey).max}
                                  step={getSliderConfig(effectKey).step}
                                  value={(effect as any).max}
                                  onChange={(e) => updateSetting(effectKey, { max: Number(e.target.value) })}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Single Value Effects */}
                          {(effect as any).intensity !== undefined && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Yoğunluk: {(effect as any).intensity.toFixed(1)}
                              </label>
                              <input
                                type="range"
                                min={getSliderConfig(effectKey).min}
                                max={getSliderConfig(effectKey).max}
                                step={getSliderConfig(effectKey).step}
                                value={(effect as any).intensity}
                                onChange={(e) => updateSetting(effectKey, { intensity: Number(e.target.value) })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                              />
                            </div>
                          )}
                          
                          {/* Special cases for noise effects */}
                          {effectKey === 'gaussianNoise' && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Ortalama: {(effect as any).mean}
                                </label>
                                <input
                                  type="range"
                                  min="-10"
                                  max="10"
                                  step="1"
                                  value={(effect as any).mean}
                                  onChange={(e) => updateSetting(effectKey, { mean: Number(e.target.value) })}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Standart Sapma: {(effect as any).std}
                                </label>
                                <input
                                  type="range"
                                  min="1"
                                  max="50"
                                  step="1"
                                  value={(effect as any).std}
                                  onChange={(e) => updateSetting(effectKey, { std: Number(e.target.value) })}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Special cases for other effects */}
                          {effectKey === 'saltPepperNoise' && (
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Oran: {((effect as any).ratio * 100).toFixed(1)}%
                              </label>
                              <input
                                type="range"
                                min="0.01"
                                max="0.2"
                                step="0.01"
                                value={(effect as any).ratio}
                                onChange={(e) => updateSetting(effectKey, { ratio: Number(e.target.value) })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                              />
                            </div>
                          )}
                          
                          {effectKey === 'cutout' && (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Delik Sayısı: {(effect as any).holes}
                                </label>
                                <input
                                  type="range"
                                  min="1"
                                  max="10"
                                  step="1"
                                  value={(effect as any).holes}
                                  onChange={(e) => updateSetting(effectKey, { holes: Number(e.target.value) })}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Delik Boyutu: {(effect as any).size}px
                                </label>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  step="5"
                                  value={(effect as any).size}
                                  onChange={(e) => updateSetting(effectKey, { size: Number(e.target.value) })}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Count slider for all effects */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Üretilecek Adet: {effect.count}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              step="1"
                              value={effect.count}
                              onChange={(e) => updateSetting(effectKey, { count: Number(e.target.value) })}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 border border-slate-200 sticky top-4">
              <h3 className="font-semibold text-slate-800 mb-4">Efekt Önizlemesi</h3>
              
              {selectedPreviewEffect && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {getEffectTitle(selectedPreviewEffect)}
                    </label>
                    <input
                      type="range"
                      min={getSliderConfig(selectedPreviewEffect).min}
                      max={getSliderConfig(selectedPreviewEffect).max}
                      step={getSliderConfig(selectedPreviewEffect).step}
                      value={previewValue}
                      onChange={(e) => setPreviewValue(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      {selectedPreviewEffect === 'flip' ? (
                        <>
                          <span>Yatay</span>
                          <span className="font-medium">
                            {previewValue === 0 ? 'Yatay' : 'Dikey'}
                          </span>
                          <span>Dikey</span>
                        </>
                      ) : (
                        <>
                          <span>{getSliderConfig(selectedPreviewEffect).min}{getSliderConfig(selectedPreviewEffect).unit || ''}</span>
                          <span className="font-medium">
                            {previewValue.toFixed(1)}{getSliderConfig(selectedPreviewEffect).unit || ''}
                          </span>
                          <span>{getSliderConfig(selectedPreviewEffect).max}{getSliderConfig(selectedPreviewEffect).unit || ''}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-600 font-medium mb-2 flex items-center justify-between">
                        <span>Orijinal</span>
                        <span className="text-green-600">✓ Hazır</span>
                      </div>
                      <canvas
                        key="original-canvas"
                        ref={originalCanvasRef}
                        className="border border-slate-200 rounded-lg bg-gray-50"
                        style={{ 
                          maxHeight: '200px', 
                          minHeight: '100px',
                          display: 'block'
                        }}
                      />
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-600 font-medium mb-2 flex items-center justify-between">
                        <span>Önizleme - {getEffectTitle(selectedPreviewEffect)}</span>
                        <span className="text-blue-600">✨ Efekt Uygulandı</span>
                      </div>
                      <canvas
                        key="preview-canvas"
                        ref={previewCanvasRef}
                        className="border border-blue-200 rounded-lg bg-gray-50"
                        style={{ 
                          maxHeight: '200px', 
                          minHeight: '100px',
                          display: 'block'
                        }}
                      />
                    </div>
                    

                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Ipucu:</strong> Slider'ı hareket ettirerek efektin canlı önizlemesini görün!
                    </p>
                  </div>
                </div>
              )}
              
              {!selectedPreviewEffect && (
                <div className="text-center text-slate-500 py-8">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm mb-4">Bir efekt seçin ve "Önizle" butonuna tıklayın</p>
                  
                  {labeledImages.length > 0 && (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          const config = getSliderConfig('brightness');
                          const midValue = (config.min + config.max) / 2;
                          setSelectedPreviewEffect('brightness');
                          setPreviewValue(midValue);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                      >
                        İlk Görseli Yükle ve Test Et
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Image as ImageIcon, Tag, Wand2, Package, ChevronRight, Settings, Eye, Trash2 } from 'lucide-react';
import ImageLabeling from '@/components/ImageLabeling';
import ImageAugmentation from '@/components/ImageAugmentation';
import DatasetExport from '@/components/DatasetExport';

interface ImageFile {
  id: string;
  file: File;
  url: string;
  labels: Label[];
  augmented?: boolean;
}

interface Label {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  className: string;
}

type Step = 'upload' | 'labeling' | 'augmentation' | 'export';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || 
      file.name.toLowerCase().endsWith('.tiff') ||
      file.name.toLowerCase().endsWith('.geotiff')
    );

    const newImages: ImageFile[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      labels: []
    }));

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff', '.geotiff']
    },
    multiple: true
  });

  const handleStepChange = (step: Step) => {
    setCurrentStep(step);
  };

  const handleImageLabeled = (imageId: string, labels: Label[]) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, labels } : img
    ));
  };

  const handleAugmentationComplete = (augmentedImages: ImageFile[]) => {
    setImages(prev => [...prev, ...augmentedImages]);
  };

  const getStepStatus = (step: Step) => {
    switch (step) {
      case 'upload':
        return images.length > 0 ? 'completed' : currentStep === 'upload' ? 'active' : 'pending';
      case 'labeling':
        const labeledCount = images.filter(img => img.labels.length > 0).length;
        if (currentStep === 'labeling') return 'active';
        return labeledCount === images.length && images.length > 0 ? 'completed' : 'pending';
      case 'augmentation':
        return currentStep === 'augmentation' ? 'active' : 'pending';
      case 'export':
        return currentStep === 'export' ? 'active' : 'pending';
      default:
        return 'pending';
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'upload':
        return images.length > 0;
      case 'labeling':
        return images.every(img => img.labels.length > 0);
      case 'augmentation':
        return true;
      case 'export':
        return true;
      default:
        return false;
    }
  };

  const getNextStep = (): Step => {
    switch (currentStep) {
      case 'upload': return 'labeling';
      case 'labeling': return 'augmentation';
      case 'augmentation': return 'export';
      default: return 'export';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">AI Veri Etiketleme Platformu</h1>
                <p className="text-sm text-slate-600">YOLO için görsel veri seti üretimi ve augmentation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                {images.length} görsel yüklendi
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          {[
            { key: 'upload', icon: Upload, title: 'Görsel Yükleme', desc: 'Görsellerinizi sisteme yükleyin' },
            { key: 'labeling', icon: Tag, title: 'Etiketleme', desc: 'Görselleri etiketleyin' },
            { key: 'augmentation', icon: Wand2, title: 'Augmentation', desc: 'Veri çeşitlendirme' },
            { key: 'export', icon: Package, title: 'Dışa Aktarma', desc: 'Veri setini indirin' }
          ].map((step, index) => {
            const status = getStepStatus(step.key as Step);
            return (
              <div key={step.key} className="flex items-center">
                <div 
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    status === 'active' ? 'scale-110' : ''
                  }`}
                  onClick={() => handleStepChange(step.key as Step)}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                    status === 'completed' 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                      : status === 'active'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <h3 className={`font-semibold text-sm ${
                      status === 'active' ? 'text-blue-600' : 'text-slate-700'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                  </div>
                </div>
                {index < 3 && (
                  <ChevronRight className="w-6 h-6 text-slate-300 mx-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {currentStep === 'upload' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Görsellerinizi Yükleyin</h2>
                <p className="text-slate-600">JPG, PNG, TIFF ve GeoTIFF formatlarını destekliyoruz</p>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {isDragActive ? 'Dosyaları buraya bırakın' : 'Dosyaları sürükleyin veya seçin'}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Birden fazla görsel dosyasını aynı anda yükleyebilirsiniz
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                    Dosya Seç
                  </button>
                </div>
              </div>

              {images.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Yüklenen Görseller ({images.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.file.name}
                          className="w-full h-24 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => {
                              setImages(prev => prev.filter(img => img.id !== image.id));
                              URL.revokeObjectURL(image.url);
                            }}
                            className="text-white hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 truncate">{image.file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'labeling' && (
            <ImageLabeling
              images={images}
              currentIndex={currentImageIndex}
              onImageLabeled={handleImageLabeled}
              onIndexChange={setCurrentImageIndex}
            />
          )}

          {currentStep === 'augmentation' && (
            <ImageAugmentation
              images={images}
              onAugmentationComplete={handleAugmentationComplete}
            />
          )}

          {currentStep === 'export' && (
            <DatasetExport
              images={images}
              onExportComplete={() => {
                // Cleanup
                images.forEach(img => URL.revokeObjectURL(img.url));
                setImages([]);
                setCurrentStep('upload');
              }}
            />
          )}
        </div>

        {/* Navigation */}
        {currentStep !== 'upload' && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                const steps: Step[] = ['upload', 'labeling', 'augmentation', 'export'];
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1]);
                }
              }}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
            >
              Önceki Adım
            </button>
            
            {currentStep !== 'export' && (
              <button
                onClick={() => setCurrentStep(getNextStep())}
                disabled={!canProceedToNext()}
                className={`px-6 py-3 rounded-xl transition-colors ${
                  canProceedToNext()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Sonraki Adım
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
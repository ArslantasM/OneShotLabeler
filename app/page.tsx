'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Settings, Download } from 'lucide-react';
import ImageLabeling from '@/components/ImageLabeling';
import ImageAugmentation from '@/components/ImageAugmentation';
import DatasetExport from '@/components/DatasetExport';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation, Language } from '@/lib/i18n';

interface ImageFile {
  id: string;
  file: File;
  url: string;
  labels: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    className: string;
  }>;
  augmented?: boolean;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'labeling' | 'augmentation' | 'export'>('upload');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [language, setLanguage] = useState<Language>('tr');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslation(language);

  // Memory cleanup
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [images]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    setIsLoading(true);
    setError(null);

    try {
      // Clean up existing URLs before creating new ones
      images.forEach(image => {
        URL.revokeObjectURL(image.url);
      });

      const newImages: ImageFile[] = Array.from(files).map((file, index) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`Invalid file type: ${file.type}`);
        }
        
        const url = URL.createObjectURL(file);
        console.log('Created new URL for', file.name, ':', url);
        
        return {
          id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          url,
          labels: []
        };
      });

      console.log('Uploaded', newImages.length, 'new images');
      setImages(newImages);
      setCurrentImageIndex(0);
      setCurrentStep('labeling');
    } catch (err) {
      console.error('File upload error:', err);
      setError(`Dosya yükleme sırasında bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLabeled = (imageId: string, labels: Array<{ id: string; x: number; y: number; width: number; height: number; className: string }>) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, labels } : img
    ));
  };

  const handleIndexChange = (newIndex: number) => {
    console.log('Index changing from', currentImageIndex, 'to', newIndex);
    setCurrentImageIndex(newIndex);
  };

  const handleAugmentationComplete = (augmentedImages: ImageFile[]) => {
    setImages(augmentedImages);
    setCurrentStep('export');
  };

  const labeledImages = images.filter(img => img.labels.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
                <p className="text-sm text-slate-600">{t.subtitle}</p>
              </div>
            </div>
            <LanguageSwitcher 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-600' : 'text-slate-400'}`}>
              <Upload className="w-5 h-5" />
              <span className="font-medium">{t.uploadTitle}</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'labeling' ? 'text-blue-600' : 'text-slate-400'}`}>
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">{t.labelingTitle}</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'augmentation' ? 'text-blue-600' : 'text-slate-400'}`}>
              <Settings className="w-5 h-5" />
              <span className="font-medium">{t.augmentationTitle}</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'export' ? 'text-blue-600' : 'text-slate-400'}`}>
              <Download className="w-5 h-5" />
              <span className="font-medium">{t.exportTitle}</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.uploadTitle}</h2>
              <p className="text-slate-600 mb-8">{t.uploadSubtitle}</p>
              
              <div className="max-w-md mx-auto">
                <label className="block w-full">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                    )}
                    <p className="text-slate-600 font-medium">{t.dragDrop}</p>
                    <p className="text-sm text-slate-500 mt-2">{t.supportedFormats}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'labeling' && images.length > 0 && (
          <ImageLabeling
            key={`labeling-${images[0]?.id}-${currentImageIndex}`}
            images={images}
            currentIndex={currentImageIndex}
            onImageLabeled={handleImageLabeled}
            onIndexChange={handleIndexChange}
            language={language}
          />
        )}

        {currentStep === 'augmentation' && labeledImages.length > 0 && (
          <ImageAugmentation
            images={labeledImages}
            onAugmentationComplete={handleAugmentationComplete}
            language={language}
          />
        )}

        {currentStep === 'export' && labeledImages.length > 0 && (
          <DatasetExport
            images={labeledImages}
          />
        )}

        {/* Navigation Buttons */}
        {currentStep !== 'upload' && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep('upload')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              ← Geri
            </button>
            
            {currentStep === 'labeling' && labeledImages.length > 0 && (
              <button
                onClick={() => setCurrentStep('augmentation')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Augmentation'a Geç →
              </button>
            )}
            
            {currentStep === 'augmentation' && (
              <button
                onClick={() => setCurrentStep('export')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export'a Geç →
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
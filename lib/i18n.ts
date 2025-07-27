export type Language = 'tr' | 'en';

export interface Translations {
  // Header
  title: string;
  subtitle: string;
  
  // Upload
  uploadTitle: string;
  uploadSubtitle: string;
  selectFiles: string;
  dragDrop: string;
  supportedFormats: string;
  
  // Labeling
  labelingTitle: string;
  classLabel: string;
  showLabels: string;
  hideLabels: string;
  nextImage: string;
  prevImage: string;
  noImages: string;
  
  // Augmentation
  augmentationTitle: string;
  augmentationSubtitle: string;
  previewOpen: string;
  previewClose: string;
  resetSettings: string;
  startAugmentation: string;
  processing: string;
  
  // Effects
  blur: string;
  brightness: string;
  contrast: string;
  rotation: string;
  noise: string;
  flip: string;
  saturation: string;
  hue: string;
  gamma: string;
  sharpen: string;
  emboss: string;
  sepia: string;
  
  // Settings
  min: string;
  max: string;
  count: string;
  horizontal: string;
  vertical: string;
  
  // Export
  exportTitle: string;
  exportSubtitle: string;
  format: string;
  trainRatio: string;
  valRatio: string;
  testRatio: string;
  downloadDataset: string;
  
  // Common
  enabled: string;
  disabled: string;
  loading: string;
  error: string;
  success: string;
}

export const translations: Record<Language, Translations> = {
  tr: {
    // Header
    title: 'OneShotLabeler - Veri Etiketleme Platformu',
    subtitle: 'YOLO için görsel veri seti üretimi ve augmentation',
    
    // Upload
    uploadTitle: 'Görsel Yükleme',
    uploadSubtitle: 'Etiketlemek istediğiniz görselleri yükleyin',
    selectFiles: 'Dosya Seç',
    dragDrop: 'Dosyaları buraya sürükleyin veya seçin',
    supportedFormats: 'Desteklenen formatlar: JPG, PNG, GIF, WebP',
    
    // Labeling
    labelingTitle: 'Görsel Etiketleme',
    classLabel: 'Yeni Etiket Sınıfı',
    showLabels: 'Etiketleri Göster',
    hideLabels: 'Etiketleri Gizle',
    nextImage: 'Sonraki',
    prevImage: 'Önceki',
    noImages: 'Etiketlenecek görsel bulunamadı.',
    
    // Augmentation
    augmentationTitle: 'Veri Augmentation',
    augmentationSubtitle: 'etiketlenmiş görsel için çeşitlendirme yapılacak',
    previewOpen: 'Önizleme Aç',
    previewClose: 'Önizleme Kapat',
    resetSettings: 'Sıfırla',
    startAugmentation: 'Augmentation Başlat',
    processing: 'İşleniyor...',
    
    // Effects
    blur: 'Bulanıklaştırma (Blur)',
    brightness: 'Parlaklık (Brightness)',
    contrast: 'Kontrast (Contrast)',
    rotation: 'Döndürme (Rotation)',
    noise: 'Gürültü (Noise)',
    flip: 'Çevirme (Flip)',
    saturation: 'Doygunluk (Saturation)',
    hue: 'Renk Tonu (Hue)',
    gamma: 'Gamma Düzeltme',
    sharpen: 'Keskinleştirme (Sharpen)',
    emboss: 'Kabartma (Emboss)',
    sepia: 'Sepia',
    
    // Settings
    min: 'Min',
    max: 'Max',
    count: 'Adet',
    horizontal: 'Yatay',
    vertical: 'Dikey',
    
    // Export
    exportTitle: 'Veri Seti Dışa Aktarma',
    exportSubtitle: 'Etiketlenmiş verilerinizi farklı formatlarda indirin',
    format: 'Format',
    trainRatio: 'Eğitim Oranı',
    valRatio: 'Doğrulama Oranı',
    testRatio: 'Test Oranı',
    downloadDataset: 'Veri Seti İndir',
    
    // Common
    enabled: 'Etkin',
    disabled: 'Devre Dışı',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı'
  },
  
  en: {
    // Header
    title: 'OneShotLabeler - Data Labeling Platform',
    subtitle: 'Visual dataset production and augmentation for YOLO',
    
    // Upload
    uploadTitle: 'Image Upload',
    uploadSubtitle: 'Upload images you want to label',
    selectFiles: 'Select Files',
    dragDrop: 'Drag files here or click to select',
    supportedFormats: 'Supported formats: JPG, PNG, GIF, WebP',
    
    // Labeling
    labelingTitle: 'Image Labeling',
    classLabel: 'New Label Class',
    showLabels: 'Show Labels',
    hideLabels: 'Hide Labels',
    nextImage: 'Next',
    prevImage: 'Previous',
    noImages: 'No images found to label.',
    
    // Augmentation
    augmentationTitle: 'Data Augmentation',
    augmentationSubtitle: 'labeled images will be augmented',
    previewOpen: 'Open Preview',
    previewClose: 'Close Preview',
    resetSettings: 'Reset',
    startAugmentation: 'Start Augmentation',
    processing: 'Processing...',
    
    // Effects
    blur: 'Blur',
    brightness: 'Brightness',
    contrast: 'Contrast',
    rotation: 'Rotation',
    noise: 'Noise',
    flip: 'Flip',
    saturation: 'Saturation',
    hue: 'Hue',
    gamma: 'Gamma Correction',
    sharpen: 'Sharpen',
    emboss: 'Emboss',
    sepia: 'Sepia',
    
    // Settings
    min: 'Min',
    max: 'Max',
    count: 'Count',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    
    // Export
    exportTitle: 'Dataset Export',
    exportSubtitle: 'Download your labeled data in different formats',
    format: 'Format',
    trainRatio: 'Training Ratio',
    valRatio: 'Validation Ratio',
    testRatio: 'Test Ratio',
    downloadDataset: 'Download Dataset',
    
    // Common
    enabled: 'Enabled',
    disabled: 'Disabled',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  }
};

export function useTranslation(language: Language = 'tr') {
  return translations[language];
} 
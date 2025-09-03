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
  placeholder: string;
  clear: string;
  delete: string;
  
  // Augmentation
  augmentationTitle: string;
  augmentationSubtitle: string;
  previewOpen: string;
  previewClose: string;
  resetSettings: string;
  startAugmentation: string;
  processing: string;
  noLabeledImages: string;
  noLabeledImagesDesc: string;
  
  // Effects Categories
  geometric: string;
  colorSpace: string;
  noiseFiltering: string;
  advancedEffects: string;
  weatherEffects: string;
  
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
  scaling: string;
  translation: string;
  gaussianNoise: string;
  saltPepperNoise: string;
  gaussianBlur: string;
  cutout: string;
  rain: string;
  snow: string;
  fog: string;
  
  // Effect Properties
  holes: string;
  size: string;
  intensity: string;
  mean: string;
  standardDeviation: string;
  ratio: string;
  
  // Settings
  min: string;
  max: string;
  count: string;
  flipHorizontal: string;
  flipVertical: string;
  enabled: string;
  disabled: string;
  preview: string;
  
  // Progress
  starting: string;
  completing: string;
  completed: string;
  
  // Preview
  effectPreview: string;
  original: string;
  ready: string;
  effectApplied: string;
  previewTip: string;
  selectEffect: string;
  loadFirstImage: string;
  canvasStatus: string;
  waiting: string;
  
  // Export
  exportTitle: string;
  exportSubtitle: string;
  exportFormat: string;
  trainRatio: string;
  valRatio: string;
  testRatio: string;
  downloadDataset: string;
  readyToExport: string;
  willDownloadAsZip: string;
  exporting: string;
  datasetSummary: string;
  totalImages: string;
  totalLabels: string;
  classCount: string;
  classes: string;
  splitPreview: string;
  training: string;
  validation: string;
  test: string;
  images: string;
  
  // Export Formats
  yoloFormat: string;
  yoloDesc: string;
  cocoFormat: string;
  cocoDesc: string;
  pascalFormat: string;
  pascalDesc: string;
  
  // Data Split
  dataSplit: string;
  trainPercent: string;
  valPercent: string;
  testPercent: string;
  total: string;
  mustBe100: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  warning: string;
  
  // Error Messages
  augmentationErrorMessage: string;
  imageLoadTimeout: string;
  fileNotFound: string;
  reloadImage: string;
  imageProcessError: string;
  checkFileFormat: string;
  enableOneEffect: string;
  
  // Success Messages
  exportSuccess: string;
  fileName: string;
  
  // Console/Debug Messages
  advancedAugmentationCompleted: string;
  newImagesCreated: string;
  effectApplicationError: string;
  augmentationProcessError: string;
  timeoutError: string;
  imageLoadingTooLong: string;
  checkImageSizes: string;
  fileNotFoundDesc: string;
  reloadImageDesc: string;
  imageProcessingError: string;
  checkFileFormatDesc: string;
  detailError: string;
  
  // Debug Status
  debugStatus: string;
  canvasRefs: string;
  canvasReady: string;
  yes: string;
  no: string;
  
  // Processing Status
  processingAdvancedAugmentation: string;
  
  // Progress Messages
  startingProcess: string;
  processingInProgress: string;
  completingProcess: string;
  processCompleted: string;
  
  // Flip Effect
  horizontal: string;
  vertical: string;
  
  // Active Effects
  activeEffects: string;
  effectsSelected: string;
  effectsCount: string;
  
  // Category Titles
  effectCategories: string;
  
  // README Content
  readmeTitle: string;
  datasetInfo: string;
  readmeFormat: string;
  createdDate: string;
  folderStructure: string;
  createdWith: string;
  
  // Compression Settings
  mediumCompression: string;
  speedSizeBalance: string;
  
  // Image Processing
  processingImage: string;
  skipErrorImage: string;
  extraProgressCoco: string;
  
  // Export Success Alert
  datasetExportedSuccessfully: string;
  
  // UI Labels
  efekt: string;
  hint: string;
  tip: string;
  loadFirstImageAndTest: string;
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
    placeholder: 'Örn: araba, kişi, bina...',
    clear: 'Temizle',
    delete: 'Sil',
    
    // Augmentation
    augmentationTitle: 'Gelişmiş Veri Augmentation',
    augmentationSubtitle: 'etiketlenmiş görsel için profesyonel augmentation',
    previewOpen: 'Önizlemeyi Göster',
    previewClose: 'Önizlemeyi Gizle',
    resetSettings: 'Sıfırla',
    startAugmentation: 'Augmentation Başlat',
    processing: 'İşleniyor...',
    noLabeledImages: 'Etiketlenmiş Görsel Bulunamadı',
    noLabeledImagesDesc: 'Augmentation işlemi için önce görsellerinizi etiketlemeniz gerekiyor.',
    
    // Effects Categories
    geometric: 'Geometrik Dönüşümler',
    colorSpace: 'Renk Dönüşümleri',
    noiseFiltering: 'Gürültü ve Filtreleme',
    advancedEffects: 'Gelişmiş Efektler',
    weatherEffects: 'Hava Durumu',
    
    // Effects
    blur: 'Bulanıklaştırma',
    brightness: 'Parlaklık',
    contrast: 'Kontrast',
    rotation: 'Döndürme',
    noise: 'Gürültü',
    flip: 'Çevirme',
    saturation: 'Doygunluk',
    hue: 'Renk Tonu',
    gamma: 'Gamma Düzeltme',
    sharpen: 'Keskinleştirme',
    emboss: 'Kabartma',
    sepia: 'Sepia',
    scaling: 'Ölçeklendirme',
    translation: 'Öteleme',
    gaussianNoise: 'Gaussian Gürültü',
    saltPepperNoise: 'Tuz-Biber Gürültü',
    gaussianBlur: 'Gaussian Bulanıklık',
    cutout: 'Kesme',
    rain: 'Yağmur Efekti',
    snow: 'Kar Efekti',
    fog: 'Sis Efekti',
    
    // Effect Properties
    holes: 'Delik Sayısı',
    size: 'Delik Boyutu',
    intensity: 'Yoğunluk',
    mean: 'Ortalama',
    standardDeviation: 'Standart Sapma',
    ratio: 'Oran',
    
    // Settings
    min: 'Min',
    max: 'Max',
    count: 'Üretilecek Adet',
    flipHorizontal: 'Yatay',
    flipVertical: 'Dikey',
    enabled: 'Etkin',
    disabled: 'Devre Dışı',
    preview: 'Önizle',
    
    // Progress
    starting: 'Başlatılıyor...',
    completing: 'Tamamlanıyor...',
    completed: 'Tamamlandı!',
    
    // Preview
    effectPreview: 'Efekt Önizlemesi',
    original: 'Orijinal',
    ready: 'Hazır',
    effectApplied: 'Efekt Uygulandı',
    previewTip: 'Slider\'ı hareket ettirerek efektin canlı önizlemesini görün!',
    selectEffect: 'Bir efekt seçin ve "Önizle" butonuna tıklayın',
    loadFirstImage: 'İlk Görseli Yükle ve Test Et',
    canvasStatus: 'Canvas Durumu',
    waiting: 'Bekleniyor',
    
    // Export
    exportTitle: 'Veri Seti Dışa Aktarma',
    exportSubtitle: 'Etiketlenmiş veri setinizi istediğiniz formatta indirin',
    exportFormat: 'Dışa Aktarma Formatı',
    trainRatio: 'Eğitim',
    valRatio: 'Doğrulama',
    testRatio: 'Test',
    downloadDataset: 'Veri Setini İndir',
    readyToExport: 'Dışa Aktarmaya Hazır',
    willDownloadAsZip: 'Veri setiniz ZIP dosyası olarak indirilecek',
    exporting: 'Dışa Aktarılıyor...',
    datasetSummary: 'Veri Seti Özeti',
    totalImages: 'Toplam Görsel',
    totalLabels: 'Toplam Etiket',
    classCount: 'Sınıf Sayısı',
    classes: 'Sınıflar',
    splitPreview: 'Bölünme Önizlemesi',
    training: 'Eğitim',
    validation: 'Doğrulama',
    test: 'Test',
    images: 'görsel',
    
    // Export Formats
    yoloFormat: 'YOLO',
    yoloDesc: 'YOLOv5/v8 için optimize edilmiş format',
    cocoFormat: 'COCO',
    cocoDesc: 'Microsoft COCO dataset formatı',
    pascalFormat: 'Pascal VOC',
    pascalDesc: 'Pascal VOC XML formatı',
    
    // Data Split
    dataSplit: 'Veri Bölünmesi',
    trainPercent: 'Eğitim (Train) %',
    valPercent: 'Doğrulama (Val) %',
    testPercent: 'Test %',
    total: 'Toplam',
    mustBe100: '⚠ Toplam 100% olmalıdır',
    
    // Common
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    warning: 'Uyarı',
    
    // Error Messages
    augmentationErrorMessage: 'Augmentation sırasında bir hata oluştu!',
    imageLoadTimeout: 'Resim yükleme çok uzun sürdü. Lütfen resim boyutlarını kontrol edin.',
    fileNotFound: 'Resim dosyası bulunamadı.',
    reloadImage: 'Lütfen resmi yeniden yükleyin.',
    imageProcessError: 'Resim işleme hatası.',
    checkFileFormat: 'Dosya formatını kontrol edin.',
    enableOneEffect: 'Lütfen en az bir efekt etkinleştirin!',
    
    // Success Messages
    exportSuccess: 'Veri seti başarıyla dışa aktarıldı!',
    fileName: 'Dosya adı',
    
    // Console/Debug Messages
    advancedAugmentationCompleted: 'Gelişmiş augmentation tamamlandı:',
    newImagesCreated: 'yeni görsel oluşturuldu',
    effectApplicationError: 'Efekt uygulama hatası',
    augmentationProcessError: 'Augmentation hatası:',
    timeoutError: 'zaman aşımı',
    imageLoadingTooLong: 'Resim yükleme çok uzun sürdü. Lütfen resim boyutlarını kontrol edin.',
    checkImageSizes: 'Lütfen resim boyutlarını kontrol edin.',
    fileNotFoundDesc: 'Resim dosyası bulunamadı. Lütfen resmi yeniden yükleyin.',
    reloadImageDesc: 'Lütfen resmi yeniden yükleyin.',
    imageProcessingError: 'Resim işleme hatası. Dosya formatını kontrol edin.',
    checkFileFormatDesc: 'Dosya formatını kontrol edin.',
    detailError: 'Detay:',
    
    // Debug Status
    debugStatus: 'Debug Durumu:',
    canvasRefs: 'Canvas Refs:',
    canvasReady: 'Canvas Hazır:',
    yes: 'Evet',
    no: 'Hayır',
    
    // Processing Status
    processingAdvancedAugmentation: 'Gelişmiş augmentation işleniyor...',
    
    // Progress Messages
    startingProcess: 'Başlatılıyor...',
    processingInProgress: 'İşleniyor...',
    completingProcess: 'Tamamlanıyor...',
    processCompleted: 'Tamamlandı!',
    
    // Flip Effect
    horizontal: 'Yatay',
    vertical: 'Dikey',
    
    // Active Effects
    activeEffects: 'Aktif Efektler',
    effectsSelected: 'efekt seçildi',
    effectsCount: 'efekt',
    
    // Category Titles
    effectCategories: 'Efekt Kategorileri',
    
    // README Content
    readmeTitle: 'AI Veri Etiketleme Platformu Dataset',
    datasetInfo: 'Dataset Bilgileri',
    readmeFormat: 'Format:',
    createdDate: 'Oluşturulma Tarihi:',
    folderStructure: 'Klasör Yapısı',
    createdWith: 'Bu dataset AI Veri Etiketleme Platformu kullanılarak oluşturulmuştur.',
    
    // Compression Settings
    mediumCompression: 'Orta seviye sıkıştırma',
    speedSizeBalance: 'hız vs boyut dengesi',
    
    // Image Processing
    processingImage: 'İşleniyor...',
    skipErrorImage: 'Hatalı resmi atla ve devam et',
    extraProgressCoco: 'COCO format için ekstra progress',
    
    // Export Success Alert
    datasetExportedSuccessfully: 'Veri seti başarıyla dışa aktarıldı!',
    
    // UI Labels
    efekt: 'efekt',
    hint: 'İpucu:',
    tip: 'Slider\'ı hareket ettirerek efektin canlı önizlemesini görün!',
    loadFirstImageAndTest: 'İlk Görseli Yükle ve Test Et',
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
    placeholder: 'e.g: car, person, building...',
    clear: 'Clear',
    delete: 'Delete',
    
    // Augmentation
    augmentationTitle: 'Advanced Data Augmentation',
    augmentationSubtitle: 'professional augmentation for labeled images',
    previewOpen: 'Show Preview',
    previewClose: 'Hide Preview',
    resetSettings: 'Reset',
    startAugmentation: 'Start Augmentation',
    processing: 'Processing...',
    noLabeledImages: 'No Labeled Images Found',
    noLabeledImagesDesc: 'You need to label your images first for augmentation process.',
    
    // Effects Categories
    geometric: 'Geometric Transformations',
    colorSpace: 'Color Transformations',
    noiseFiltering: 'Noise and Filtering',
    advancedEffects: 'Advanced Effects',
    weatherEffects: 'Weather Effects',
    
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
    scaling: 'Scaling',
    translation: 'Translation',
    gaussianNoise: 'Gaussian Noise',
    saltPepperNoise: 'Salt-Pepper Noise',
    gaussianBlur: 'Gaussian Blur',
    cutout: 'Cutout',
    rain: 'Rain Effect',
    snow: 'Snow Effect',
    fog: 'Fog Effect',
    
    // Effect Properties
    holes: 'Number of Holes',
    size: 'Hole Size',
    intensity: 'Intensity',
    mean: 'Mean',
    standardDeviation: 'Standard Deviation',
    ratio: 'Ratio',
    
    // Settings
    min: 'Min',
    max: 'Max',
    count: 'Count to Generate',
    flipHorizontal: 'Horizontal',
    flipVertical: 'Vertical',
    enabled: 'Enabled',
    disabled: 'Disabled',
    preview: 'Preview',
    
    // Progress
    starting: 'Starting...',
    completing: 'Completing...',
    completed: 'Completed!',
    
    // Preview
    effectPreview: 'Effect Preview',
    original: 'Original',
    ready: 'Ready',
    effectApplied: 'Effect Applied',
    previewTip: 'Move the slider to see live preview of the effect!',
    selectEffect: 'Select an effect and click "Preview" button',
    loadFirstImage: 'Load First Image and Test',
    canvasStatus: 'Canvas Status',
    waiting: 'Waiting',
    
    // Export
    exportTitle: 'Dataset Export',
    exportSubtitle: 'Download your labeled dataset in desired format',
    exportFormat: 'Export Format',
    trainRatio: 'Training',
    valRatio: 'Validation',
    testRatio: 'Test',
    downloadDataset: 'Download Dataset',
    readyToExport: 'Ready to Export',
    willDownloadAsZip: 'Your dataset will be downloaded as ZIP file',
    exporting: 'Exporting...',
    datasetSummary: 'Dataset Summary',
    totalImages: 'Total Images',
    totalLabels: 'Total Labels',
    classCount: 'Class Count',
    classes: 'Classes',
    splitPreview: 'Split Preview',
    training: 'Training',
    validation: 'Validation',
    test: 'Test',
    images: 'images',
    
    // Export Formats
    yoloFormat: 'YOLO',
    yoloDesc: 'Optimized format for YOLOv5/v8',
    cocoFormat: 'COCO',
    cocoDesc: 'Microsoft COCO dataset format',
    pascalFormat: 'Pascal VOC',
    pascalDesc: 'Pascal VOC XML format',
    
    // Data Split
    dataSplit: 'Data Split',
    trainPercent: 'Training (Train) %',
    valPercent: 'Validation (Val) %',
    testPercent: 'Test %',
    total: 'Total',
    mustBe100: '⚠ Total must be 100%',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    
    // Error Messages
    augmentationErrorMessage: 'An error occurred during augmentation!',
    imageLoadTimeout: 'Image loading took too long. Please check image sizes.',
    fileNotFound: 'Image file not found.',
    reloadImage: 'Please reload the image.',
    imageProcessError: 'Image processing error.',
    checkFileFormat: 'Check file format.',
    enableOneEffect: 'Please enable at least one effect!',
    
    // Success Messages
    exportSuccess: 'Dataset exported successfully!',
    fileName: 'File name',
    
    // Console/Debug Messages
    advancedAugmentationCompleted: 'Advanced augmentation completed:',
    newImagesCreated: 'new images created',
    effectApplicationError: 'Effect application error',
    augmentationProcessError: 'Augmentation error:',
    timeoutError: 'timeout',
    imageLoadingTooLong: 'Image loading took too long. Please check image sizes.',
    checkImageSizes: 'Please check image sizes.',
    fileNotFoundDesc: 'Image file not found. Please reload the image.',
    reloadImageDesc: 'Please reload the image.',
    imageProcessingError: 'Image processing error. Check file format.',
    checkFileFormatDesc: 'Check file format.',
    detailError: 'Detail:',
    
    // Debug Status
    debugStatus: 'Debug Status:',
    canvasRefs: 'Canvas Refs:',
    canvasReady: 'Canvas Ready:',
    yes: 'Yes',
    no: 'No',
    
    // Processing Status
    processingAdvancedAugmentation: 'Processing advanced augmentation...',
    
    // Progress Messages
    startingProcess: 'Starting...',
    processingInProgress: 'Processing...',
    completingProcess: 'Completing...',
    processCompleted: 'Completed!',
    
    // Flip Effect
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    
    // Active Effects
    activeEffects: 'Active Effects',
    effectsSelected: 'effects selected',
    effectsCount: 'effects',
    
    // Category Titles
    effectCategories: 'Effect Categories',
    
    // README Content
    readmeTitle: 'AI Data Labeling Platform Dataset',
    datasetInfo: 'Dataset Information',
    readmeFormat: 'Format:',
    createdDate: 'Creation Date:',
    folderStructure: 'Folder Structure',
    createdWith: 'This dataset was created using AI Data Labeling Platform.',
    
    // Compression Settings
    mediumCompression: 'Medium level compression',
    speedSizeBalance: 'speed vs size balance',
    
    // Image Processing
    processingImage: 'Processing...',
    skipErrorImage: 'Skip error image and continue',
    extraProgressCoco: 'Extra progress for COCO format',
    
    // Export Success Alert
    datasetExportedSuccessfully: 'Dataset exported successfully!',
    
    // UI Labels
    efekt: 'effect',
    hint: 'Hint:',
    tip: 'Move the slider to see live preview of the effect!',
    loadFirstImageAndTest: 'Load First Image and Test',
  }
};

export function useTranslation(language: Language = 'tr') {
  return translations[language];
} 
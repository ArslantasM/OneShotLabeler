'use client';

import { useState } from 'react';
import { Download, Package, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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

interface DatasetExportProps {
  images: ImageFile[];
  onExportComplete?: () => void;
}

type ExportFormat = 'yolo' | 'coco' | 'pascal';

export default function DatasetExport({ images, onExportComplete }: DatasetExportProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('yolo');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [splitRatio, setSplitRatio] = useState({ train: 70, val: 20, test: 10 });

  const labeledImages = images.filter(img => img.labels.length > 0);
  const totalImages = labeledImages.length;
  const totalLabels = labeledImages.reduce((sum, img) => sum + img.labels.length, 0);
  const uniqueClasses = Array.from(new Set(labeledImages.flatMap(img => img.labels.map(label => label.className))));

  const convertToYOLO = (image: ImageFile, imageWidth: number, imageHeight: number) => {
    return image.labels.map(label => {
      // YOLO format: class_id center_x center_y width height (normalized)
      const centerX = (label.x + label.width / 2) / imageWidth;
      const centerY = (label.y + label.height / 2) / imageHeight;
      const width = label.width / imageWidth;
      const height = label.height / imageHeight;
      const classId = uniqueClasses.indexOf(label.className);
      
      return `${classId} ${centerX.toFixed(6)} ${centerY.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`;
    }).join('\n');
  };

  const convertToCOCO = () => {
    const cocoData = {
      info: {
        description: "AI Veri Etiketleme Platformu Dataset",
        version: "1.0",
        year: new Date().getFullYear(),
        contributor: "AI Labeling Platform",
        date_created: new Date().toISOString()
      },
      licenses: [],
      images: [] as any[],
      annotations: [] as any[],
      categories: uniqueClasses.map((className, index) => ({
        id: index,
        name: className,
        supercategory: "object"
      }))
    };

    let annotationId = 1;
    labeledImages.forEach((image, imageIndex) => {
      cocoData.images.push({
        id: imageIndex,
        width: 0, // Will be set when processing
        height: 0, // Will be set when processing
        file_name: image.file.name
      });

      image.labels.forEach(label => {
        cocoData.annotations.push({
          id: annotationId++,
          image_id: imageIndex,
          category_id: uniqueClasses.indexOf(label.className),
          bbox: [label.x, label.y, label.width, label.height],
          area: label.width * label.height,
          iscrowd: 0
        });
      });
    });

    return JSON.stringify(cocoData, null, 2);
  };

  const convertToPascalVOC = (image: ImageFile, imageWidth: number, imageHeight: number) => {
    const fileName = image.file.name;
    const baseName = fileName.split('.')[0];
    
    let xml = `<?xml version="1.0"?>
<annotation>
  <folder>images</folder>
  <filename>${fileName}</filename>
  <path>${fileName}</path>
  <source>
    <database>AI Labeling Platform</database>
  </source>
  <size>
    <width>${imageWidth}</width>
    <height>${imageHeight}</height>
    <depth>3</depth>
  </size>
  <segmented>0</segmented>`;

    image.labels.forEach(label => {
      xml += `
  <object>
    <name>${label.className}</name>
    <pose>Unspecified</pose>
    <truncated>0</truncated>
    <difficult>0</difficult>
    <bndbox>
      <xmin>${Math.round(label.x)}</xmin>
      <ymin>${Math.round(label.y)}</ymin>
      <xmax>${Math.round(label.x + label.width)}</xmax>
      <ymax>${Math.round(label.y + label.height)}</ymax>
    </bndbox>
  </object>`;
    });

    xml += '\n</annotation>';
    return xml;
  };

  const splitDataset = (images: ImageFile[]) => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    const trainCount = Math.floor(shuffled.length * splitRatio.train / 100);
    const valCount = Math.floor(shuffled.length * splitRatio.val / 100);
    
    return {
      train: shuffled.slice(0, trainCount),
      val: shuffled.slice(trainCount, trainCount + valCount),
      test: shuffled.slice(trainCount + valCount)
    };
  };

  const exportDataset = async () => {
    if (labeledImages.length === 0) {
      alert('Dışa aktarılacak etiketlenmiş görsel bulunamadı!');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const zip = new JSZip();
      const splits = splitDataset(labeledImages);
      let processedCount = 0;

      // Create class names file
      if (exportFormat === 'yolo') {
        zip.file('classes.txt', uniqueClasses.join('\n'));
      }

      // Process each split
      for (const [splitName, splitImages] of Object.entries(splits)) {
        if (splitImages.length === 0) continue;

        const imagesFolder = zip.folder(`${splitName}/images`);
        const labelsFolder = exportFormat !== 'coco' ? zip.folder(`${splitName}/labels`) : null;

        for (const image of splitImages) {
          // Add image to zip
          const imageBlob = await fetch(image.url).then(r => r.blob());
          imagesFolder?.file(image.file.name, imageBlob);

          // Get image dimensions
          const img = document.createElement('img') as HTMLImageElement;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.src = image.url;
          });

          // Add labels based on format
          if (exportFormat === 'yolo') {
            const yoloLabels = convertToYOLO(image, img.width, img.height);
            const labelFileName = image.file.name.replace(/\.[^/.]+$/, '.txt');
            labelsFolder?.file(labelFileName, yoloLabels);
          } else if (exportFormat === 'pascal') {
            const xmlContent = convertToPascalVOC(image, img.width, img.height);
            const xmlFileName = image.file.name.replace(/\.[^/.]+$/, '.xml');
            labelsFolder?.file(xmlFileName, xmlContent);
          }

          processedCount++;
          setExportProgress((processedCount / totalImages) * 100);
        }

        // Add COCO annotation file for each split
        if (exportFormat === 'coco') {
          const cocoData = convertToCOCO();
          zip.file(`${splitName}/annotations.json`, cocoData);
        }
      }

      // Add dataset info
      const datasetInfo = {
        format: exportFormat,
        total_images: totalImages,
        total_labels: totalLabels,
        classes: uniqueClasses,
        split_ratio: splitRatio,
        created_at: new Date().toISOString(),
        splits: {
          train: splits.train.length,
          val: splits.val.length,
          test: splits.test.length
        }
      };

      zip.file('dataset_info.json', JSON.stringify(datasetInfo, null, 2));

      // Add README
      const readme = `# AI Veri Etiketleme Platformu Dataset

## Dataset Bilgileri
- Format: ${exportFormat.toUpperCase()}
- Toplam Görsel: ${totalImages}
- Toplam Etiket: ${totalLabels}
- Sınıf Sayısı: ${uniqueClasses.length}
- Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}

## Sınıflar
${uniqueClasses.map((cls, idx) => `${idx}: ${cls}`).join('\n')}

## Veri Bölünmesi
- Eğitim: ${splits.train.length} görsel (${splitRatio.train}%)
- Doğrulama: ${splits.val.length} görsel (${splitRatio.val}%)
- Test: ${splits.test.length} görsel (${splitRatio.test}%)

## Klasör Yapısı
${exportFormat === 'yolo' ? `
\`\`\`
dataset/
├── classes.txt
├── train/
│   ├── images/
│   └── labels/
├── val/
│   ├── images/
│   └── labels/
└── test/
    ├── images/
    └── labels/
\`\`\`
` : exportFormat === 'coco' ? `
\`\`\`
dataset/
├── train/
│   ├── images/
│   └── annotations.json
├── val/
│   ├── images/
│   └── annotations.json
└── test/
    ├── images/
    └── annotations.json
\`\`\`
` : `
\`\`\`
dataset/
├── train/
│   ├── images/
│   └── labels/
├── val/
│   ├── images/
│   └── labels/
└── test/
    ├── images/
    └── labels/
\`\`\`
`}

Bu dataset AI Veri Etiketleme Platformu kullanılarak oluşturulmuştur.
`;

      zip.file('README.md', readme);

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `dataset_${exportFormat}_${new Date().toISOString().split('T')[0]}.zip`);

      setExportProgress(100);
      setTimeout(() => {
        onExportComplete();
      }, 1000);

    } catch (error) {
      console.error('Export error:', error);
      alert('Dışa aktarma sırasında bir hata oluştu!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Veri Seti Dışa Aktarma</h2>
          <p className="text-slate-600">Etiketlenmiş veri setinizi istediğiniz formatta indirin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selection */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Dışa Aktarma Formatı</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  key: 'yolo', 
                  title: 'YOLO', 
                  desc: 'YOLOv5/v8 için optimize edilmiş format',
                  icon: Package 
                },
                { 
                  key: 'coco', 
                  title: 'COCO', 
                  desc: 'Microsoft COCO dataset formatı',
                  icon: FileText 
                },
                { 
                  key: 'pascal', 
                  title: 'Pascal VOC', 
                  desc: 'Pascal VOC XML formatı',
                  icon: FileText 
                }
              ].map((format) => (
                <div
                  key={format.key}
                  onClick={() => setExportFormat(format.key as ExportFormat)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    exportFormat === format.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <format.icon className={`w-5 h-5 ${
                      exportFormat === format.key ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                    <h4 className={`font-medium ${
                      exportFormat === format.key ? 'text-blue-800' : 'text-slate-800'
                    }`}>
                      {format.title}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600">{format.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dataset Split */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Veri Bölünmesi</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Eğitim (Train) %
                </label>
                <input
                  type="number"
                  value={splitRatio.train}
                  onChange={(e) => {
                    const train = Number(e.target.value);
                    const remaining = 100 - train;
                    const val = Math.round(remaining * 0.67);
                    const test = remaining - val;
                    setSplitRatio({ train, val, test });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg input-text-dark"
                  min="10"
                  max="90"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Doğrulama (Val) %
                </label>
                <input
                  type="number"
                  value={splitRatio.val}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const remaining = 100 - splitRatio.train - val;
                    setSplitRatio({ ...splitRatio, val, test: remaining });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg input-text-dark"
                  min="5"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Test %
                </label>
                <input
                  type="number"
                  value={splitRatio.test}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 input-text-dark"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                Toplam: {splitRatio.train + splitRatio.val + splitRatio.test}%
                {splitRatio.train + splitRatio.val + splitRatio.test !== 100 && (
                  <span className="text-red-600 ml-2">⚠ Toplam 100% olmalıdır</span>
                )}
              </p>
            </div>
          </div>

          {/* Export Button */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Dışa Aktarmaya Hazır</h3>
                <p className="text-slate-600">Veri setiniz ZIP dosyası olarak indirilecek</p>
              </div>
              <button
                onClick={exportDataset}
                disabled={isExporting || labeledImages.length === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  isExporting || labeledImages.length === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Download className="w-5 h-5" />
                <span>{isExporting ? 'Dışa Aktarılıyor...' : 'Veri Setini İndir'}</span>
              </button>
            </div>

            {isExporting && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>İşleniyor...</span>
                  <span>{Math.round(exportProgress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dataset Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-24">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Veri Seti Özeti</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Toplam Görsel</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{totalImages}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Toplam Etiket</span>
                </div>
                <span className="text-lg font-bold text-green-600">{totalLabels}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Sınıf Sayısı</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{uniqueClasses.length}</span>
              </div>
            </div>

            {/* Classes List */}
            <div className="mt-6">
              <h4 className="font-medium text-slate-800 mb-3">Sınıflar</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {uniqueClasses.map((className, index) => (
                  <div key={className} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{className}</span>
                    <span className="text-slate-500">
                      {labeledImages.reduce((count, img) => 
                        count + img.labels.filter(label => label.className === className).length, 0
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Preview */}
            <div className="mt-6">
              <h4 className="font-medium text-slate-800 mb-3">Bölünme Önizlemesi</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Eğitim:</span>
                  <span>{Math.floor(totalImages * splitRatio.train / 100)} görsel</span>
                </div>
                <div className="flex justify-between">
                  <span>Doğrulama:</span>
                  <span>{Math.floor(totalImages * splitRatio.val / 100)} görsel</span>
                </div>
                <div className="flex justify-between">
                  <span>Test:</span>
                  <span>{totalImages - Math.floor(totalImages * splitRatio.train / 100) - Math.floor(totalImages * splitRatio.val / 100)} görsel</span>
                </div>
              </div>
            </div>

            {labeledImages.length === 0 && (
              <div className="mt-6 p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-orange-800">Etiketlenmiş görsel bulunamadı</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
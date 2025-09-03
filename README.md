# OneShotLabeler - AI Veri Etiketleme Platformu

Hızlı ve verimli görsel veri etiketleme ve augmentation platformu. YOLO, COCO ve Pascal VOC formatlarında veri seti oluşturun.

## 🚀 Özellikler

### 📸 Görsel Etiketleme
- **Canvas Tabanlı Etiketleme:** HTML5 Canvas API ile gerçek zamanlı bounding box çizimi
- **Çoklu Görsel Desteği:** Birden fazla görseli aynı anda yükleme ve etiketleme
- **Sınıf Yönetimi:** Özel sınıf isimleri tanımlama ve yönetme
- **Gerçek Zamanlı Önizleme:** Çizim sırasında anlık görsel geri bildirim
- **Performans Optimizasyonu:** Offscreen canvas ile akıcı deneyim
- **Etiket Görünürlük Kontrolü:** Etiketleri göster/gizle özelliği
- **Görsel Gezinme:** İleri/geri butonları ile kolay geçiş

### 🔄 Gelişmiş Veri Augmentation
- **20+ Farklı Efekt:** Geometrik dönüşümler, renk efektleri, gürültü filtreleri, hava durumu efektleri
  - **Geometrik:** Rotation, Scaling, Translation, Flip (Yatay/Dikey)
  - **Renk:** Brightness, Contrast, Saturation, Hue, Gamma Correction
  - **Gürültü:** Gaussian Noise, Salt-Pepper Noise, Gaussian Blur, Sharpen
  - **Gelişmiş:** Cutout, Emboss, Sepia
  - **Hava Durumu:** Rain, Snow, Fog Effects
- **Akıllı Parametre Kontrolleri:** Her efekt için optimize edilmiş slider konfigürasyonları
- **Gerçek Zamanlı Önizleme:** Efektlerin canlı önizlemesi ve interaktif slider kontrolleri
- **Canvas Optimizasyonu:** willReadFrequently ile performans iyileştirmesi
- **Batch İşleme:** Tüm etiketlenmiş görseller için toplu augmentation
- **Progress Tracking:** Efekt bazlı ilerleme takibi ve detaylı durum göstergeleri
- **Blob URL Yönetimi:** Gelişmiş bellek yönetimi ve hata önleme
- **Kategori Sistemi:** Efektlerin mantıklı gruplara ayrılması

### 📦 Gelişmiş Veri Dışa Aktarma
- **Çoklu Format Desteği:** YOLO, COCO, Pascal VOC
- **Otomatik Klasör Yapısı:** Format standartlarına uygun dizin organizasyonu
- **COCO Format Optimizasyonu:** Split-specific image dimensions tracking
- **ZIP Arşivleme:** Gelişmiş sıkıştırma algoritmaları ile hızlı indirme
- **Split Oranları:** Train/Validation/Test ayrımı için özelleştirilebilir oranlar
- **Progress Tracking:** Gerçek zamanlı işlem durumu ve ilerleme göstergeleri
- **Hata Yönetimi:** Timeout, network ve dosya hatalarına özel mesajlar
- **Dataset Dokümantasyonu:** Otomatik README ve dataset_info.json oluşturma
- **Bellek Optimizasyonu:** Büyük dosyalar için gelişmiş bellek yönetimi

### 🌐 Kapsamlı Çoklu Dil Desteği
- **Türkçe ve İngilizce:** 130+ çeviri anahtarı ile tam arayüz çevirisi
- **Dinamik Dil Değişimi:** Sayfa yenilenmeden dil değiştirme
- **Dil Seçici:** Header'da kolay dil değiştirme
- **Kapsamlı Çeviri:** Tüm arayüz metinleri, hata mesajları ve debug çıktıları çevrildi
- **TypeScript Desteği:** Tip güvenli çeviri anahtarları
- **Console Mesajları:** Debug ve hata mesajları da çoklu dil destekli

### 🎨 Gelişmiş Kullanıcı Deneyimi
- **Drag & Drop:** Sürükle-bırak ile kolay dosya yükleme
- **Responsive Tasarım:** Mobil ve masaüstü uyumlu arayüz
- **Gelişmiş Progress Tracking:** Efekt bazlı ilerleme ve durum göstergeleri
- **Akıllı Error Handling:** Detaylı hata kategorileri ve çözüm önerileri
- **Canvas Yönetimi:** Gelişmiş canvas hazırlık kontrolü ve timeout mekanizmaları
- **Memory Management:** Otomatik blob URL temizleme ve bellek optimizasyonu
- **Modern UI:** Tailwind CSS ile şık ve modern arayüz
- **Interaktif Önizleme:** Slider kontrolü ile gerçek zamanlı efekt önizlemesi
- **Debug Araçları:** Canvas durumu ve işlem takibi için geliştirici araçları

## 🛠️ Teknolojiler

- **Frontend:** Next.js 13.5.11, React 18.2.0, TypeScript 5.2.2
- **Styling:** Tailwind CSS 3.3.3
- **Canvas API:** HTML5 Canvas for drawing and image processing
- **File Handling:** File API, Blob API, file-saver
- **Archiving:** jszip for ZIP creation
- **Icons:** Lucide React
- **Performance:** Next.js Image optimization, debouncing, offscreen canvas
- **Internationalization:** Custom i18n system for Turkish and English

## 📋 Gereksinimler

- Node.js 18.0.0 veya üzeri
- npm 9.0.0 veya üzeri
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)

## 🚀 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/oneshotlabeler/OneShotLabeler.git
cd OneShotLabeler
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 📖 Kullanım Kılavuzu

### 1. Görsel Yükleme
- Ana sayfada "Dosya Seç" butonuna tıklayın
- Desteklenen formatlar: JPG, PNG, GIF, WebP
- Birden fazla dosya seçebilirsiniz
- Drag & drop ile de dosya yükleyebilirsiniz

### 2. Görsel Etiketleme
- Yüklenen görseller arasında gezinin
- Canvas üzerinde mouse ile bounding box çizin
- Sınıf ismini girin (örn: "car", "person", "dog")
- Etiketleri göster/gizle butonu ile kontrol edin
- İleri/geri butonları ile görseller arasında geçiş yapın

### 3. Veri Augmentation
- Etiketlenmiş görseller için augmentation ayarlarını yapın
- İstediğiniz efektleri etkinleştirin
- Her efekt için min-max değerlerini belirleyin
- Her efekt için üretilecek veri adedini ayarlayın
- Önizleme kısmını kullanarak efektleri test edin
- "Augmentation Başlat" ile işlemi başlatın

### 4. Veri Dışa Aktarma
- İstediğiniz formatı seçin (YOLO, COCO, Pascal VOC)
- Train/Validation/Test oranlarını ayarlayın
- "Veri Seti İndir" butonuna tıklayın
- ZIP dosyası otomatik olarak indirilecektir

### 5. Dil Değiştirme
- Header'daki dil seçiciyi kullanın
- Türkçe ve İngilizce arasında geçiş yapın
- Değişiklik anında uygulanır

## 📁 Proje Yapısı

```
OneShotLabeler/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global stiller
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Ana sayfa
├── components/             # React bileşenleri
│   ├── ImageLabeling.tsx  # Etiketleme bileşeni
│   ├── ImageAugmentation.tsx # Augmentation bileşeni
│   ├── DatasetExport.tsx  # Dışa aktarma bileşeni
│   └── LanguageSwitcher.tsx # Dil değiştirici
├── lib/                   # Yardımcı kütüphaneler
│   └── i18n.ts           # Çoklu dil sistemi
├── public/                # Statik dosyalar
│   ├── favicon.ico        # Site ikonu
│   └── manifest.json      # PWA manifest
├── package.json           # Proje bağımlılıkları
├── next.config.js         # Next.js yapılandırması
├── tailwind.config.ts     # Tailwind CSS yapılandırması
├── README.md              # Türkçe dokümantasyon
├── README_eng.md          # İngilizce dokümantasyon
└── tsconfig.json          # TypeScript yapılandırması
```

## 🔧 Geliştirme

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## 🎯 Teknik Detaylar ve Optimizasyonlar

### Canvas Performans İyileştirmeleri
- **willReadFrequently Optimizasyonu:** Sık erişilen canvas contextleri için performans artışı
- **Canvas Hazırlık Kontrolü:** Çoklu timeout kontrolü ile güvenilir canvas erişimi
- **Blob URL Yönetimi:** Her işlem için fresh blob URL oluşturma ve temizleme
- **Offscreen Canvas:** UI blocking'i önlemek için arka plan işlemleri
- **Debouncing:** Canvas yeniden çizimlerini optimize etme

### Augmentation Motor İyileştirmeleri
- **Efekt Bazlı Progress:** Her efekt için ayrı ilerleme takibi
- **Hata Toleransı:** Başarısız efektleri atlayarak işleme devam etme
- **Bellek Optimizasyonu:** Büyük görseller için akıllı bellek yönetimi
- **Flip Efekti:** 0=yatay, 1=dikey değerleri ile scale transformation
- **Rotation Desteği:** -180° ile +180° arası tam rotasyon desteği

### Export Sistemi Geliştirmeleri
- **COCO Format:** Split-specific image dimensions tracking implementasyonu
- **Timeout Yönetimi:** Görsel yükleme için akıllı timeout mekanizmaları
- **Hata Kategorileri:** Timeout, network, file not found için özel mesajlar
- **Progress Optimizasyonu:** Gerçek zamanlı ilerleme güncellemeleri
- **Sıkıştırma:** Orta seviye sıkıştırma ile hız-boyut dengesi

### Güvenlik
- **Next.js Security Headers:** X-Frame-Options, X-Content-Type-Options
- **Input Validation:** Tüm kullanıcı girdileri doğrulanır
- **File Type Checking:** Sadece güvenli dosya türleri kabul edilir

### PWA Desteği
- **Manifest.json:** Uygulama meta verileri
- **Service Worker:** Offline çalışma desteği (gelecek)
- **Responsive Design:** Tüm cihazlarda uyumlu

### Çoklu Dil Sistemi
- **Custom i18n:** Basit ve etkili çeviri sistemi
- **TypeScript Support:** Tip güvenli çeviri anahtarları
- **Dynamic Language Switching:** Gerçek zamanlı dil değişimi

## 🌐 Çoklu Dil Desteği

Uygulama hem Türkçe hem İngilizce dil desteği sunar:

### Türkçe (Varsayılan)
- Tam Türkçe arayüz
- Türkçe hata mesajları
- Türkçe dokümantasyon

### İngilizce
- Tam İngilizce arayüz
- İngilizce hata mesajları
- İngilizce dokümantasyon

## 🐛 Çözülmüş Sorunlar ve İyileştirmeler

### Canvas ve Görsel İşleme
- ✅ **Canvas Hazırlık Kontrolü:** Sonsuz döngü sorunları çözüldü
- ✅ **Blob URL Yönetimi:** ERR_FILE_NOT_FOUND hataları giderildi
- ✅ **willReadFrequently:** Canvas performans uyarıları çözüldü
- ✅ **Flip ve Rotation Efektleri:** Çevirme ve döndürme işlemleri düzeltildi

### Augmentation Sistemi
- ✅ **Progress Bar:** Efekt bazlı ilerleme takibi implementasyonu
- ✅ **Hata Toleransı:** Başarısız görselleri atlayarak devam etme
- ✅ **Bellek Sızıntıları:** Comprehensive blob URL cleanup
- ✅ **Infinite Loop:** useEffect dependency optimizasyonları

### Export Sistemi
- ✅ **COCO Format:** Split-specific dimensions tracking
- ✅ **Boş ZIP Klasörleri:** COCO format export düzeltmeleri
- ✅ **Timeout İşleme:** Büyük dosyalar için gelişmiş timeout yönetimi
- ✅ **Hata Mesajları:** Detaylı hata kategorileri ve çözüm önerileri

### Çoklu Dil Sistemi
- ✅ **Kapsamlı Çeviri:** 130+ çeviri anahtarı ile tam kapsama
- ✅ **Console Mesajları:** Debug çıktıları da çevrildi
- ✅ **TypeScript Desteği:** Tip güvenli çeviri sistemi

## 🚧 Gelecek Özellikler

### Kısa Vadeli (v2.0)
- [ ] Keyboard shortcuts (Ctrl+Z undo, arrow keys navigation)
- [ ] Dark mode desteği
- [ ] Daha fazla augmentation efekti (Mosaic, CutMix, MixUp)
- [ ] Advanced filtering ve search
- [ ] Batch import/export iyileştirmeleri

### Orta Vadeli (v3.0)
- [ ] AI destekli otomatik etiketleme
- [ ] Cloud storage entegrasyonu (AWS S3, Google Cloud)
- [ ] API desteği ve RESTful endpoints
- [ ] Real-time collaboration ve takım çalışması
- [ ] Mobile app (React Native)
- [ ] Advanced analytics ve reporting

### Uzun Vadeli (v4.0+)
- [ ] Daha fazla dil desteği (Almanca, Fransızca, İspanyolca, Çince)
- [ ] Video annotation desteği
- [ ] 3D object detection
- [ ] Custom model training integration
- [ ] Enterprise features (SSO, audit logs)
- [ ] Plugin sistemi ve extensibility

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Katkıda Bulunanlar

- **Geliştirici:** Mustafa Barış Arslantaş
- **Tasarım:** Modern UI/UX principles
- **Test:** Community feedback

## 📞 İletişim

- **GitHub:** [OneShotLabeler Repository](https://github.com/ArslantasM/OneShotLabeler)
- **Email:** contact@oneshotlabeler.com
- **Website:** [oneshotlabeler.com](https://oneshotlabeler.com)

## 🙏 Teşekkürler

- Next.js ekibine harika framework için
- Tailwind CSS ekibine mükemmel CSS framework için
- Lucide ekibine güzel ikonlar için
- Tüm open source katkıda bulunanlara
- Makine öğrenmesi ve veri etiketleme alanına katkı sunan herkese

---

**OneShotLabeler v1.5** - Gelişmiş AI destekli veri etiketleme platformu ile makine öğrenmesi projelerinizi hızlandırın! 🚀

> **Son Güncelleme:** Kapsamlı augmentation sistemi, gelişmiş canvas yönetimi, çoklu dil desteği ve performans optimizasyonları ile tamamen yenilendi.

**Öne Çıkan Yenilikler:**
- 🎨 20+ augmentation efekti
- ⚡ Canvas performans optimizasyonları
- 🌐 130+ çeviri anahtarı ile tam çoklu dil desteği
- 🔧 Gelişmiş hata yönetimi ve debug araçları
- 📊 Efekt bazlı progress tracking
- 💾 Akıllı bellek yönetimi

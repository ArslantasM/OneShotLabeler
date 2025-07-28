# OneShotLabeler - AI Veri Etiketleme Platformu

Hızlı ve verimli görsel veri etiketleme ve augmentation platformu. YOLO, COCO ve Pascal VOC formatlarında veri seti oluşturun.

##  Özellikler

###  Görsel Etiketleme
- **Canvas Tabanlı Etiketleme:** HTML5 Canvas API ile gerçek zamanlı bounding box çizimi
- **Çoklu Görsel Desteği:** Birden fazla görseli aynı anda yükleme ve etiketleme
- **Sınıf Yönetimi:** Özel sınıf isimleri tanımlama ve yönetme
- **Gerçek Zamanlı Önizleme:** Çizim sırasında anlık görsel geri bildirim
- **Performans Optimizasyonu:** Offscreen canvas ile akıcı deneyim
- **Etiket Görünürlük Kontrolü:** Etiketleri göster/gizle özelliği
- **Görsel Gezinme:** İleri/geri butonları ile kolay geçiş

###  Veri Augmentation
- **12 Farklı Efekt:** Blur, Brightness, Contrast, Rotation, Noise, Flip, Saturation, Hue, Gamma, Sharpen, Emboss, Sepia
- **Min-Max Kontrolü:** Her efekt için özelleştirilebilir değer aralıkları
- **Adet Yönetimi:** Her efekt için ayrı ayrı üretilecek veri adedi belirleme
- **Gerçek Zamanlı Önizleme:** Efektlerin küçük örneklerde önizlemesi
- **Batch İşleme:** Tüm etiketlenmiş görseller için toplu augmentation
- **Önizleme Sidebar:** Aktif efektlerin gerçek zamanlı önizlemesi

###  Veri Dışa Aktarma
- **Çoklu Format Desteği:** YOLO, COCO, Pascal VOC
- **Otomatik Klasör Yapısı:** Format standartlarına uygun dizin organizasyonu
- **ZIP Arşivleme:** Tüm verileri tek dosyada indirme
- **Split Oranları:** Train/Validation/Test ayrımı için özelleştirilebilir oranlar
- **Progress Tracking:** İşlem durumu ve ilerleme göstergeleri

###  Çoklu Dil Desteği
- **Türkçe ve İngilizce:** Tam arayüz çevirisi
- **Dinamik Dil Değişimi:** Sayfa yenilenmeden dil değiştirme
- **Dil Seçici:** Header'da kolay dil değiştirme
- **Kapsamlı Çeviri:** Tüm arayüz metinleri çevrildi

###  Kullanıcı Deneyimi
- **Drag & Drop:** Sürükle-bırak ile kolay dosya yükleme
- **Responsive Tasarım:** Mobil ve masaüstü uyumlu arayüz
- **Progress Tracking:** İşlem durumu ve ilerleme göstergeleri
- **Error Handling:** Kullanıcı dostu hata mesajları
- **Memory Management:** Otomatik bellek temizleme ve optimizasyon
- **Modern UI:** Tailwind CSS ile şık ve modern arayüz

##  Teknolojiler

- **Frontend:** Next.js 13.5.11, React 18.2.0, TypeScript 5.2.2
- **Styling:** Tailwind CSS 3.3.3
- **Canvas API:** HTML5 Canvas for drawing and image processing
- **File Handling:** File API, Blob API, file-saver
- **Archiving:** jszip for ZIP creation
- **Icons:** Lucide React
- **Performance:** Next.js Image optimization, debouncing, offscreen canvas
- **Internationalization:** Custom i18n system for Turkish and English

##  Gereksinimler

- Node.js 18.0.0 veya üzeri
- npm 9.0.0 veya üzeri
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)

##  Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/your-username/OneShotLabeler.git
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

##  Proje Yapısı

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

##  Geliştirme

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

##  Teknik Detaylar

### Performans Optimizasyonları
- **Next.js Image Component:** Otomatik görsel optimizasyonu
- **Offscreen Canvas:** UI blocking'i önlemek için
- **Debouncing:** Canvas yeniden çizimlerini optimize etme
- **Memory Management:** URL.revokeObjectURL ile bellek temizleme
- **Bundle Splitting:** Webpack optimizasyonları

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

##  Çoklu Dil Desteği

Uygulama hem Türkçe hem İngilizce dil desteği sunar:

### Türkçe (Varsayılan)
- Tam Türkçe arayüz
- Türkçe hata mesajları
- Türkçe dokümantasyon

### İngilizce
- Tam İngilizce arayüz
- İngilizce hata mesajları
- İngilizce dokümantasyon

##  Bilinen Sorunlar

- Büyük dosyalar (>10MB) yavaş yüklenebilir
- Çok fazla augmentation efekti aynı anda kullanıldığında performans düşebilir
- Bazı eski tarayıcılarda canvas API desteği sınırlı olabilir

##  Gelecek Özellikler

- [ ] AI destekli otomatik etiketleme
- [ ] Daha fazla augmentation efekti
- [ ] Cloud storage entegrasyonu
- [ ] Takım çalışması özellikleri
- [ ] API desteği
- [ ] Mobile app
- [ ] Batch processing için queue sistemi
- [ ] Advanced filtering ve search
- [ ] Export formatları genişletme
- [ ] Real-time collaboration
- [ ] Daha fazla dil desteği (Almanca, Fransızca, İspanyolca)
- [ ] Dark mode desteği
- [ ] Keyboard shortcuts
- [ ] Undo/Redo özellikleri

##  Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

##  Katkıda Bulunanlar

- **Geliştirici:** OneShotLabeler Team
- **Tasarım:** Modern UI/UX principles
- **Test:** Community feedback

##  İletişim

- **GitHub:** [OneShotLabeler Repository](https://github.com/your-username/OneShotLabeler)
- **Email:** support@oneshotlabeler.com
- **Discord:** [OneShotLabeler Community](https://discord.gg/oneshotlabeler)

##  Teşekkürler

- Next.js ekibine harika framework için
- Tailwind CSS ekibine mükemmel CSS framework için
- Lucide ekibine güzel ikonlar için
- Tüm open source katkıda bulunanlara

---

**OneShotLabeler** - Veri etiketleme platformu ile makine öğrenmesi projelerinizi hızlandırın! 

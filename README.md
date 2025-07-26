# OneShotLabeler

Tek sayfalık görsel etiketleme ve veri artırma (augmentation) aracı. YOLO ve COCO veri formatlarını destekler, hızlı ve verimli veri seti oluşturma süreçleri için idealdir.

## Özellikler

-  Görsel etiketleme: Tek sayfada hızlı bounding box çizimi
-  Veri artırma: Dönme, ölçekleme, parlaklık gibi işlemlerle veri çeşitlendirme
-  Format uyumu: YOLO ve COCO formatlarında çıktı alma
-  Önizleme: Etiketlenmiş verinin görsel önizlemesi
-  Basit Arayüz: Hızlı kullanım için sade ve işlevsel UI

## Kurulum


npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Sonucu görmek için tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

`app/page.tsx` dosyasını değiştirerek sayfayı düzenlemeye başlayabilirsiniz. Dosyayı düzenledikçe sayfa otomatik olarak güncellenir.

Bu proje, özel bir Google Fontu olan Inter'i otomatik olarak optimize etmek ve yüklemek için [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) kullanır.

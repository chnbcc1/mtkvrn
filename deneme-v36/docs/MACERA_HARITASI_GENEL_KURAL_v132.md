# Matematik Evreni — Evrensel Harita Sisi v132

## Tüm bölümler için değişmeyen kural
- Oyun ilk açıldığında yalnızca Dedenin Evi açıktır. Sıradaki ve daha sonraki bölgeler kilitlidir ve görseldeki isimleri, numaraları ve yolları görünmemelidir.
- Bir önceki bölüm gerçek oyun kaydında tamamlandıktan sonra sonraki bölge açılır; harita her açıldığında aynı kayıtlar okunur.
- Açılmış bölgeler kalıcı olarak görünür kalır. Yeni Oyun ile sıfırlanır.
- Gelecekte eklenen dördüncü, beşinci vb. bölümler de aynı açılma ve sis kurallarını kullanır. Yeni bir bölge, bir diğerinin içindeki engel olarak gösterilmez.

## Görsel algoritma
- Ana görsel: `premium-map-approved-v130.avif` (değişmedi).
- `world-map-v132.js` içindeki `paintNaturalMist(canvas, revealPercent)` tek bir **şeffaf piksel tabanlı** atmosferik sis katmanı çizer.
- Büyük CSS elipsi/yuvarlak maske **yoktur**. Bulut önü düzensizdir; yumuşak geçiş, üç ölçekte gölge/renk dokusu ve sedefi-andıran açık yeşil/mavi tonlar kullanılır.
- Ana başlık ve pusulanın bulunduğu haritanın üst kısmı sisin dışındadır. Sağ alttaki özgün açıklama kartı korunur.
- Kilitli bölgeye ait numaraların görünmesini önlemek için yoğun sis bölgesinde alfa tamamen opaktır.
- iPhone performansı için 640×360 boyutunda bir kere çizilir; Canvas olmayan cihazlar için basit dikdörtgen olmayan geçişli CSS geri dönüşü vardır.

## Bölüm ekleme
`MTKWorldMap.registerChapter({id,name,after,x,y,rx,ry,fogStart,playable,route})` ile yeni bölüm veri listesine eklenir. `fogStart` sis perdesinin başlama yüzdesidir; özel bir kural yazılmasına gerek yoktur. Bölüm oynanabilir hâle gelince `configureChapter` ile etkinleştirilir, bitirilince `markChapterCompleted` ile kaydedilir.

## Testler
`node deneme-v36/tests/forest-obstacle-lane.test.cjs` şu durumları doğrular: Dedenin Evi ilk açılır; 2. bölgenin sayısı tamamen sis altında kalır; başlık açık kalır; Orman sonrası Gözlemevi kilit/açılma geçişi; ileride eklenen bölgeler; Yeni Oyun ile sıfırlama; mevcut yön ve zıplama mekaniği.

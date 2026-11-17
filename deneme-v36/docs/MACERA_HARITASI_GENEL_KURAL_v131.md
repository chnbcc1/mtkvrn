# Matematik Evreni — Harita ve Sis Kuralları (v131)

Bu kurallar **Dedenin Evi, Orman Patikası, Gözlemevi ve sonradan eklenecek bütün bölümler** için geçerlidir.

## Temel davranış
- Yeni oyunda yalnızca ilk bölge (Dedenin Evi) görünür.
- Bir bölgenin tamamlandığı **gerçek oyun kayıtlarıyla** doğrulanınca sıradaki bölge açılır.
- Bölge açılmadan önce adı, numarası, ikon/etiketi, yolu ve görseli **doğal, katmanlı atmosferik sisin altında** kalır.
- Önceden açılmış bölgeler görünmeye devam eder. Geçici sahne geçişleri veya kartların açılıp kapanması ilerlemeyi sıfırlamaz.
- Harita her sahnede aynı `MTKWorldMap` kütüphanesini ve `MTKGameUI.openMap` kartını kullanır.
- Yeni Oyun, kanonik oyun kayıtlarıyla birlikte `mathverse-v128-chapter-milestones` genişletme ilerlemesini de sıfırlar.
- Bu kural ormandaki tekil engellere uygulanmaz: onlar ayrı bölge sayılmaz.

## Yeni bir bölge eklenirken
1. Bölgeyi merkezî `assets/world-map-v131.js` bölüm veri listesine, veya her sahnede harita açılmadan önce çalışacak ortak bir kayıt dosyasından `MTKWorldMap.registerChapter({...})` çağrısıyla ekle.
2. `id`, `name`, `after` (önceki bölümün kimliği), `x`, `y`, `rx`, `ry`, `fogStart` (yüzde), `playable` ve `route` alanlarını doldur. Gerekirse `mapArt` ile daha geniş **onaylı** görsel sağla. Resim yeni görsel olsa da sis/ilerleme mantığı değişmez.
3. Bölüm oynanabilir hâle gelince `MTKWorldMap.configureChapter(id,{playable:true,route:"./yeni-bolum.html"})` kullan; bunun bütün sahnelerde aynı merkezi kayıttan yüklenmesini sağla.
4. Yeni bölüm gerçekten tamamlandığında `MTKWorldMap.markChapterCompleted(id)` çağır. Bu yöntem kilitli veya henüz oynanamaz bölümü tamamlandı diye işaretlemez.
5. Bir sonraki bölümün görünürlüğü `after` bağı ve kalıcı tamamlanma bilgisine göre otomatik hesaplanır.

## Görsel kural
- Temel onaylı resim `premium-map-approved-v130.avif` korunur.
- Tek bir evrensel sis katmanı kullanılır. Değişken `--mist-left` ilk kilitli bölgenin `fogStart` verisinden hesaplanır.
- Sis; yumuşak sınır, üst üste binen bulut hacimleri, derinlik tonları ve hafif hareket içerir. Kare/beyaz kutu şeklinde kapatma yapılmaz.
- Daha sonra bölümler eklenirken yalnızca yeni koordinat ve onaylı dünya görseli verilir; menü/oynanış veya sis motoru her seferinde yeniden yazılmaz.

## Test
`node tests/forest-obstacle-lane.test.cjs` testi yalnızca ilk iki bölümü değil, hayalî dördüncü ve beşinci bölümlerin aynı mantıkla açılmasını ve Yeni Oyun sıfırlamasını da denetler.

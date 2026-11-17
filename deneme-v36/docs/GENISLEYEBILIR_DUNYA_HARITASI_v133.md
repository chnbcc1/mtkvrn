# Matematik Evreni — Genişleyebilir Premium Dünya Haritası (v133)

## Ana karar

Bugünkü onaylı üç-bölgeli `premium-map-approved-v130.avif` **değişmeyecek**.
İlk harita parçasının dünya koordinatları: `x=0, y=0, w=1671, h=941`.
Ev, Orman, Gözlemevi ve orijinal başlık, sol alttaki profesör parşömeni, sağ alttaki açıklama kartı aynı kalır.

Yeni bölgelerin görselleri bağımsız, gelişigüzel resimler değil; **komşu harita parçasının kenarından devam eden** resimler olmalıdır.

## Sanat sürekliliği sözleşmesi

- Stil kimliği: `matematik-evreni-premium-3d-v1`.
- Referans: Kök haritanın orijinal yüksek çözünürlüklü görseli ve komşu parçanın **tam çözünürlüklü son 110 pikseli**.
- Birleşim: 90–140 piksel ortak kenar kullanılması önerilir; motor 24–200 pikseli kabul eder. Yeni parça, ortak kenarda aynı ağaçları, dalları, nehir/taş yolu ve ışık yönünü gerçekten eşleştirmelidir.
- Kamera/perspektif: Yukarıdan hafif açılı, üç boyutlu animasyon kalitesinde; ölçek tutarlı, golden-hour aydınlatma ve doygun yeşiller, sıcak altın yapraklar, turkuaz su ve bronz tabelalar.
- **Görsel üretim sonrası** kenar örtüşmesini gözle ve mümkünse piksel hizasıyla kontrol edin; sadece aynı prompt'u tekrar etmek tutarlılığı garanti etmez.
- Yeni parçaya ayrı bir “Matematik Evreni” başlığı, pusula, parşömen açıklaması, bölüm numarası veya harita ana çerçevesi **bastırmayın**. Bu içerikler yalnızca başlangıç görselinde mevcut; yeni bölge adları motorun açılan plaketleriyle gösterilir.
- Bölge yolları, köprüler ve nehirler yeni haritaya birleşim kenarından eksiksiz devam etmelidir.

## Teknik dünya modeli

Tüm oyun sahneleri ortak `assets/world-map-v133.js` ile
`assets/map-world-registry-v133.js` dosyasını yükler. Geliştirme sırasında sonraki
bölümler yalnızca **merkezî kayıt dosyasına** eklenir.

```js
MTKWorldMap.registerTile({
 id:"yeni-parca",afterTile:"origin",side:"right",overlap:110,
 w:1671,h:941,src:"./assets/onayli-yeni-harita.avif",
 styleKey:"matematik-evreni-premium-3d-v1"
});
MTKWorldMap.registerChapter({
 id:"yeni-bolum",name:"Bölüm adı sonradan onaylanacak",
 after:"observatory",tileId:"yeni-parca",
 localX:740,localY:490,rx:190,ry:83,
 fogPolygon:[[0,0],[1671,0],[1671,941],[0,941]],
 playable:false,route:null
});
```

Yeni parça `afterTile`, `side`, `overlap` ile ana haritaya geometrik olarak kenetlenir. `x/y` dünya koordinatları otomatik hesaplanır. Motor görsellerin birleşimini ortak kenarda yumuşak maske ile sağlar.

## Genel sis kuralı (bütün bölümler)

- Sis, **kameranın konumuna ya da hangi bölümde olduğumuza değil**, `progress().chapters[*].unlocked` kalıcı kaydına bağlıdır.
- Her bölgenin `fogPolygon` alanı (kendi parçasına göre koordinatlar) sisin sınırıdır. Bulutlar **yalnızca kilitli bölgenin çokgeni içine** çizilir.
- Kayıtlı bölüm açılınca sadece onun çokgenine ait sis kalkar. Diğer bölgelere, yollarına, numaralarına dokunulmaz.
- Yoğun sis merkezleri numara ve bölüm adlarını tamamen örter. Kenarlar doğal dalgalı yumuşak geçişlidir; oval/kutu maskesi yoktur.
- Mevcut kök parçada Orman ve Gözlemevi'nin çokgenleri ayrı ayrı tanımlanmıştır; Dedenin Evi başlangıçtan açık.
- Bölüm tamamlanınca `markChapterCompleted` veya (ilk iki bölümde) gerçek oyun kayıtları görünürlüğü açar. Geçmiş bölgeler kapanmaz; yalnızca Yeni Oyun ilerlemeyi sıfırlar.

## Kullanım / kamera

- Parmağı kaydırarak bütün dünyada gezinti.
- İki parmakla yakınlaştırma; ayrıca görünür + / − kontrolleri.
- Masaüstünde Ctrl + tekerlek veya + / − ile zoom.
- Zoom sırasında görsel orantısı ve koordinatlar korunur; yeni parça eklenince eski parça yeniden çizilmez.
- Üst menü, soru ve ayarlar sistemleri ortak yapıda kalır. Harita yine oyun üzerinde **kart** olarak açılır.

## Önemli sınır

Bu sürüm **henüz adı/görseli onaylanmamış bir dördüncü bölgeyi oyuna eklemiyor**.
Bunun yerine tüm bölümler için genişleme, parça eşleme, bölgesel sis ve gezinme
altyapısını hazırlıyor. Yeni bölge ilk kez onaylandığında merkezi kayıt dosyasına
tek bir parça ve bölge tanımı eklenecek.

## Test

`node deneme-v36/tests/forest-obstacle-lane.test.cjs`

Bu testler mevcut üç bölgeyi, kaydın korunmasını, iki yeni örnek harita parçası
ve iki farazî bölümün arka arkaya açılmasını, bölgesel sis sınırlarını,
parçaların kenar örtüşmesini ve zoom kontrol bağlantısını denetler.

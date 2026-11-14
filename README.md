# Matematik Evreni — Erdem ve Çiko

TÜBİTAK 4006 matematik macera oyunu.

## v72 — Keşif haritası ve organik engeller (15 Kasım 2026)

**Ana oyun:** https://chnbcc1.github.io/mtkvrn/deneme-v36/?v=72  
**Oyun dünyası haritası:** https://chnbcc1.github.io/mtkvrn/deneme-v36/map-v72.html?v=72  
**Orman bölümü (önizleme):** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v72-full.html?preview=1&v=72

### Harita
- Kart listesi kaldırılarak coğrafi yollar, dağlar, orman, dere, göl, ev ve gözlemevi olan kaydırmadan görülebilir bir oyun dünya haritası oluşturuldu.
- Keşfedilmeyen alanların üzerine sis yerleştirildi. Bölge isimleri, konum düğmeleri ve yollar, ilgili keşif yapılana kadar gizli kalır.
- İlk açılış yalnız Dedenin Evi; evin ipuçları tamamlanınca Orman Patikası; 21 orman engeli ve varış tamamlanınca Gözlemevi Girişi; gözlemevi girişindeki üç halka incelenince Gözlemevi İç Mekânı haritada görünür.
- **Gözlemevi İç Mekânı'nın oynanabilir sahnesi henüz yoktur.** Haritada keşfedilirse görünür fakat butonu devre dışıdır.

### Orman
- Beş farklı mini engel ayrı doğal dokulu SVG sprite olarak oluşturuldu: `assets/obstacle-v72-rock.svg`, `-log.svg`, `-mushroom.svg`, `-root.svg`, `-gap.svg`.
- Mini engellerin aynı çevreyle uyumlu düzensiz siluetleri, gölgeleri ve yaprak/yosun dokuları var; sahnede genişlik/yükseklikleri önceki çarpışma sistemiyle eşleşiyor.
- Görsel yüklenemezse önceki çizim otomatik olarak devreye girer; öğrencinin oyuna devam etmesi engellenmez.
- 21 ana matematik engeli, 29 mini zıplama engeli ve `mathverse-v68-forest-full` ilerleme kayıt anahtarı korunur.
- Mevcut 630 soruluk soru bankası ve oyun içi üç aşamalı yardım sistemi değiştirilmedi.

### Kontrol durumu
- Harita açılma koşulları 4 farklı yerel kayıt durumunda doğrulandı.
- Ana oyun → orman → harita bağlantıları ve JavaScript sözdizimi kontrol edildi.
- Gerçek iPhone üzerinde görsel, erişilebilirlik ve 21 engellik uçtan uca oynanış henüz ayrıca doğrulanmadı.

---

## v71 — Doğal orman ve belirgin zıplama engelleri (15 Kasım 2026)

**Oyunu aç:** https://chnbcc1.github.io/mtkvrn/deneme-v36/?v=71  
**Ormana doğrudan gir:** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v71-full.html?preview=1&v=71  
**Macera haritası:** https://chnbcc1.github.io/mtkvrn/deneme-v36/map-v71.html?v=71

- Ormanın her ikinci panelinde oluşan simetri/ayna yansıması kaldırıldı; görsel akışı yatay ve tek yönlü.
- Mevcut sinematik orman görselinin panelleri 300 px yumuşak geçişle birleştirildi; orta eksende yapay ağaç yansımaları kalmaz.
- Taş, kütük, toprak boşluğu, ağaç kökü ve mantar gibi 5 engel türü yerden belirgin yükselen, gölgeli ön plan objeleri olarak yeniden çizildi.
- Engellerin görünür en ve yüksekliği ile çarpışma ölçüleri eşleştirildi. Yön tuşuna basarken zıplama korunur; dikey hız mini engellere uyarlanmıştır.
- 21 ana matematik engeli ve 29 mini engel korunur. Önceki oyun ve soru ilerlemesi için yerel kayıt anahtarları değiştirilmedi.
- 29 mini engelin sıçrama simülasyonu ve sahne-kaynak JavaScript sözdizimi denetlendi.
- **Sınırlama:** Gerçek iPhone üzerinde baştan sona 21 engelin görsel ve dokunmatik testi henüz yapılmadı; farklı cihaz boyutlarında kontrol gereklidir.

---

## v70 — Tam orman macerası (14 Kasım 2026)

**Ana oyun:** https://chnbcc1.github.io/mtkvrn/deneme-v36/?v=70  
**Doğrudan Orman Patikası testi:** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v70-full.html?preview=1&v=70  
**Macera haritası:** https://chnbcc1.github.io/mtkvrn/deneme-v36/map-v70.html?v=70  
**Soru motoru:** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v70-quiz.html?v=70

### v70'te düzeltilenler
- Açılış ekranı daha sinematik tam ekran orman görüntüsüne ve orijinal Erdem–Çiko sprite portresine kavuştu; kayıtlı oyun için **Devam Et** ve **Yeni Oyun** ayrı.
- Tek kapsül üst menü ve ince ilerleme çubuğu; gereksiz bilgi kutusu kaldırıldı.
- 21 ana engel arası 560'tan 2240 dünya birimine (**4 kat**) çıkarıldı; 29 mini zıplama engeli korundu.
- Ormana daha uygun ayrıntılı oyun nesneleri atlası ve mini engel dokuları; eski yüksek çözünürlüklü orman arka planı korundu.
- 240 köklü, köprü, küp ve ölçü sorusu yeniden kuruldu; soru metinlerinde dört basamaklı sayılar ya da 2^15 benzeri yüksek kuvvetler yok.
- 630 farklı soru metni, kolay/orta/zor seviyeleri; dört şıklı seçim, ipucu → çözümlü benzer örnek → çözüm ve tekrar sınama korunuyor.
- **Önemli düzeltme:** v69 soru bankasını eski kurallarla yanlışlıkla tekrar dönüştürme hatası giderildi; yayımlanmış v70 soru içeriği olduğu gibi kullanılır.
- Eşdeğer köklü seçenekler ve "Seçenek 3" türü boş dolgu şıkları kaldırıldı.

### Doğrulama ve sınırlar
- 630 farklı soru kimliği ve metni, 910 çoktan seçmeli cevap aşaması; her aşamada dört ayrı şık ve doğru cevabın varlığı kodla doğrulandı.
- 30 köprü eşleştirmesinin her birinde tek doğru tahta çifti; 10 zor köprü görevinde 6 aşamalı düşünme akışı doğrulandı.
- 21 ana engel, 29 mini engel konum kontrolü ve dört kat mekânsal aralık doğrulandı.
- JavaScript sözdizimi kontrol edildi; GitHub Pages dağıtımı başarılı.
- **Gerçek iPhone üzerinde tüm ormanın baştan sona oynanışı, dokunma erişilebilirliği, kare hızı ve pedagojik dil uzmanı incelemesi hâlâ gereklidir.** Kod testleri bu testlerin yerine geçmez.
- Kaydı koruma: `mathverse-v68-forest-full` devam eder; Dedenin Evi verisi `mathverse-v40-investigation` korunur. Soru testinin yeni sürümünde önceki yarım cevaplar taşınmaz.

[Önceki v68 tam bölüm yerleşim planı](deneme-v36/ORMAN_PATIKASI_TAM_BOLUM_V68_YERLESIM.md)

---
## Oyna — Tam Orman Patikası v68

**Ana oyun (Dedenin Evi → Orman Patikası):** https://chnbcc1.github.io/mtkvrn/deneme-v36/?v=68  
**Tam 21 engelli orman:** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v68-full.html?v=68  
**Macera haritası:** https://chnbcc1.github.io/mtkvrn/deneme-v36/map-v68.html?v=68  
**Soru ekranı (doğrudan test):** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v68-quiz.html  
**Geliştirme ve yerleşim belgesi:** [Orman Patikası Tam Bölüm v68](deneme-v36/ORMAN_PATIKASI_TAM_BOLUM_V68_YERLESIM.md)

### 14 Kasım 2026 — v68 geliştirmeleri

- 21 matematik engelini kesintisiz uzun orman sahnesine yerleştiren oynanabilir bölüm.
- Aralarda 29 fiziksel mini engel: 6 kaya, 6 kütük, 6 kısa boşluk, 6 mantar ve 5 ağaç kökü.
- Yön tuşuna basarken zıplama; kısa sıçrayışlı geçitlerde çarpışma kilidi ve ipuçları.
- Erdem'in yürüyüş ve zıplama atlaslarında yere basma referansını alfa sınırı üzerinden hizalama; dinamik gölge.
- Kırık köprünün ahşap kalas, çivi, halat, korkuluk ve onarım animasyonu ile yeniden çizimi.
- Her fiziksel ana engelde uygulama içinde açılan A–D matematik sorusu; üç aşamalı hata yardımı ve pekiştirme.
- Önceden hazırlanmış 630 farklı üslü/köklü soru korunur; kolay/orta/zor başlangıçta seçilir.
- Kayıt anahtarı `mathverse-v68-forest-full`; orijinal `mathverse-v40-investigation` verisini değiştirmeden çalışır.

**Durum:** Kaynaklar GitHub'a aktarıldı ve yerleşim/zıplama simülasyonları kontrol edildi; gerçek iPhone üzerinde baştan sona oynanış testinin yapılması gerekiyor.

---

## 14 Kasım 2026 — v65 / v66 / v67

- `deneme-v36/forest-questions-v66.json`: 21 engel × 3 zorluk × 10 varyasyon = **630 farklı soru metni ve kimliği**.
- Gerçek zorluk ayrımı: **kolay** tek matematiksel kural, **orta** iki bağlantılı işlem, **zor** üç veya daha fazla bağlantılı adım/muhakeme.
- `deneme-v36/forest-v65-mcq.html`: A–D düğmeleriyle yanıt verme; sayı veya üs klavyesi gerekmez.
- Üslü ifadeler görsel üst simge olarak yazılır (ör. 3⁸), ham `3^8` biçimiyle bırakılmaz.
- 1. yanlışta ipucu; 2. yanlışta çözümlü benzer örnek; 3. yanlışta sorunun çözümü ve benzer soruyla yeniden sınama.
- F08 kırık köprü görevi: dört tahtanın kökleri tek tek sadeleştirilir, ardından uygun iki tahta seçilir. F21 eşleştirme: dört ayrı eşleştirme ve iki kural seçimi.
- Gidilen engel, yanlış deneme ve soru geçmişi tarayıcıda korunur; ana oyunun önceki `mathverse-v40-investigation` kaydı etkilenmez.
- `deneme-v36/forest-hd-v67-asset.js`: **1672×941 piksellik** yüksek ayrıntılı, WebP formatında sıkıştırılmış yeni sinematik orman görseli. Eski 640×360 arka plan artık v67 sahnesinde kullanılmıyor. `forest-v66-hd.svg` çevrimdışı yedek olarak duruyor.
- `deneme-v36/forest-v67.html` ve `deneme-v36/map-v67.html`: yüksek çözünürlüklü yeni orman resmi, mevcut hareket, zıplama, kaydetme ve harita bağlantıları korunarak ayrılmış sürüm.

### Test durumu / sınırlar

- 630 soru kimliği ve metni benzersiz; her zorlukta 210 soru bulunuyor.
- F08 için 30/30 kök sadeleştirme ve eşsiz doğru tahta çifti denetlendi.
- Soru seçeneklerinin dört farklı şık üretmesi, doğru seçeneğin bulunması ve üs yazımının HTML üst simgesi olması kod üzerinden denetlendi.
- **Gerçek iPhone üzerinde tüm engellerin oynanış ve erişilebilirlik testi yapılmadı.**
- Mevcut büyük orman sahnesinde **21 fiziksel engelin tümü henüz yerleştirilmedi**. Soru motoru ayrı deneme ekranındadır.
- Bazı çok aşamalı soruların pedagojik ve dil açısından öğretmen incelemesi devam etmelidir.
- Yeni yüksek çözünürlüklü sinematik görsel v67 orman sahnesine bağlanmıştır; farklı telefonlarda renk, kalite, animasyon ve performans testleri hâlâ yapılmalıdır.

## Önceki geliştirmeler
- v63: 21 engel/630 soru tasarımı.
- v62: Kırık köprü, kamera ve macera haritası.
- v45: Erdem ve Çiko sprite atlasları ve yürüyüş.

Öğrencilerin kişisel verilerini herkese açık GitHub deposuna eklemeyin.

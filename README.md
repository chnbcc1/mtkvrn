# Matematik Evreni — Erdem ve Çiko

TÜBİTAK 4006 matematik macera oyunu.

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

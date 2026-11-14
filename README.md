# Matematik Evreni — Erdem ve Çiko

TÜBİTAK 4006 matematik macera oyunu.

**Ana oyun:** https://chnbcc1.github.io/mtkvrn/  
**Dört şıklı soru denemesi (v65 / güncel 630 soru):** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v65-mcq.html?v=66  
**Yüksek çözünürlüklü orman (v66):** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v66.html?v=66  
**Güncel macera haritası:** https://chnbcc1.github.io/mtkvrn/deneme-v36/map-v66.html?v=66

## 14 Kasım 2026 — v65 / v66

- `deneme-v36/forest-questions-v66.json`: 21 engel × 3 zorluk × 10 varyasyon = **630 farklı soru metni ve kimliği**.
- Gerçek zorluk ayrımı: **kolay** tek matematiksel kural, **orta** iki bağlantılı işlem, **zor** üç veya daha fazla bağlantılı adım/muhakeme.
- `deneme-v36/forest-v65-mcq.html`: A–D düğmeleriyle yanıt verme; sayı veya üs klavyesi gerekmez.
- Üslü ifadeler görsel üst simge olarak yazılır (ör. 3⁸), ham `3^8` biçimiyle bırakılmaz.
- 1. yanlışta ipucu; 2. yanlışta çözümlü benzer örnek; 3. yanlışta sorunun çözümü ve benzer soruyla yeniden sınama.
- F08 kırık köprü görevi: dört tahtanın kökleri tek tek sadeleştirilir, ardından uygun iki tahta seçilir. F21 eşleştirme: dört ayrı eşleştirme ve iki kural seçimi.
- Gidilen engel, yanlış deneme ve soru geçmişi tarayıcıda korunur; ana oyunun önceki `mathverse-v40-investigation` kaydı etkilenmez.
- `deneme-v36/forest-v66-hd.svg`: eski 640×360 piksellik görüntü yerine **vektör çözünürlüğünde çizilen** orman arka planı.
- `deneme-v36/forest-v66.html` ve `deneme-v36/map-v66.html`: yeni orman resmi, mevcut hareket, zıplama, kaydetme ve harita bağlantıları korunarak ayrılmış sürüm.

### Test durumu / sınırlar

- 630 soru kimliği ve metni benzersiz; her zorlukta 210 soru bulunuyor.
- F08 için 30/30 kök sadeleştirme ve eşsiz doğru tahta çifti denetlendi.
- Soru seçeneklerinin dört farklı şık üretmesi, doğru seçeneğin bulunması ve üs yazımının HTML üst simgesi olması kod üzerinden denetlendi.
- **Gerçek iPhone üzerinde tüm engellerin oynanış ve erişilebilirlik testi yapılmadı.**
- Mevcut büyük orman sahnesinde **21 fiziksel engelin tümü henüz yerleştirilmedi**. Soru motoru ayrı deneme ekranındadır.
- Bazı çok aşamalı soruların pedagojik ve dil açısından öğretmen incelemesi devam etmelidir.
- Yeni HD orman SVG bir çizimdir; fotoğrafik dokuların birebir kopyası değildir.

## Önceki geliştirmeler
- v63: 21 engel/630 soru tasarımı.
- v62: Kırık köprü, kamera ve macera haritası.
- v45: Erdem ve Çiko sprite atlasları ve yürüyüş.

Öğrencilerin kişisel verilerini herkese açık GitHub deposuna eklemeyin.

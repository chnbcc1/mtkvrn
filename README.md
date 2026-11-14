# Matematik Evreni – Erdem ve Çiko

TÜBİTAK 4006 matematik macera oyunu.

**Ana oyun:** https://chnbcc1.github.io/mtkvrn/  
**v64 soru denemesi:** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v64-question-lab.html?v=64  
**Orman sahnesi (v62):** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v62.html?v=62

## v64 – 14 Kasım 2026

- MAT.9.1.1 için 21 engel × 3 zorluk × 10 soru = **630 ayrı soru kimliği** olan JSON kaynak dosyası depoya aktarıldı: `deneme-v36/forest-questions-v63.json`.
- **21 engelli soru deneme ekranı** eklendi: `deneme-v36/forest-v64-question-lab.html`.
- Macera başında tek seferlik zorluk seçimi, soru havuzundan seçim, tekrar oynama geçmişi, aynı soruya kaldığı yerden dönme ve çözülen engelde isteğe bağlı benzer soru çözme eklendi.
- Kırık köprüde dört kökü sadeleştirmeden doğru tahta çifti kabul edilmiyor; eşleştirme görevinde dört çift ve iki yazılı işlem alanı bulunuyor.
- Soru ekranı ilerleme için **ayrı** `mathverse-v64-forest-question-run` ve `mathverse-v64-forest-question-history` kayıtlarını kullanıyor. Var olan `mathverse-v40-investigation` kaydını değiştirmiyor.

### Açık kalan işler ve doğrulama

- Bu, **soru motoru/arayüz denemesidir**; 21 engelin tamamı henüz mevcut orman platform sahnesine fiziksel olarak yerleştirilmedi.
- Soru bankasında 630 ayrı kimlik fakat **492 farklı soru metni** bulunuyor; farklı zorluk düzeyleri arasındaki 138 tekrar redaksiyon gerektiriyor.
- Yazılı matematiksel gerekçeler otomatik olarak tam doğrulanmıyor; bu cevapların öğretmen incelemesi gerekiyor.
- JavaScript sözdizimi kontrol edildi; GitHub Pages iş akışı başarıyla tamamlandı. Gerçek iPhone dokunmatik uçtan uca testi yapılmadı.

## Önceki sürümler

- **v63:** 21 engel ve soru havuzu tasarımı.
- **v62:** Yüksek çözünürlüklü orman arka planı, kırık köprü, kaydedilen konum, macera haritası, iOS uzun basma düzeltmesi.
- **v45:** Erdem ve Çiko için yürüyüş / kanat çırpma atlasları, sabit çizim boyutları ve yönlü zıplama.
- [v35 arşiv sayfası](archive/v35-index.html).

Öğrenci kişisel verilerini herkese açık GitHub deposuna eklemeyin.

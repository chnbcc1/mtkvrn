# F03 Sis Türbini — 5 plaketli ana sahne v198

- **Kapsam:** Üçüncü ARAŞTIRMA görevi (F03); küçük fiziksel zıplama engelleriyle karıştırılmaz.
- **İncelenen onaylı sorular:** `forest-questions-v147.json` içindeki 30 F03 sorusu (10 kolay, 10 orta, 10 zor); toplam 114 dinamik sayısal etiket. Bir soruda en fazla **5** etiket kullanılır.
- **Kullanıcı tarafından seçilen yeni ana sahne:** `assets/f03-five-plaques-v198.avif` (1213×1297, 5 boş veri plaketi; sayısal değer ve metin görsele gömülmemiştir).
- **Görsel yerleşim:** Dikey üst %50, yatay sol %50; aynı dikey görsel yatayda değişmeden kullanılır, gerekiyorsa yalnız alt/üst kenardan kırpılır.
- **Dinamik sayılar:** `assets/f03-approved-v197.js` içinde onaylı sorudaki `visual.labels` alanından alınır. Beş plaketin içine ayrı DOM metni olarak, kısa ankraj açıklamasıyla yerleştirilir; soru içeriği değiştirilmez.
- **Karakterler:** `assets/erdem-ciko-onayli-v180.png` tam onaylı şeffaf referans dosyası yeniden çizilmeksizin sahnenin sol-alt boşluğuna ayrı `<img>` katmanı olarak eklenir. F02 ve diğer sahneler değişmez.
- **Güvenlik:** Yeni ana görsel yüklenemezse eski çalışan quiz görseli geri gösterilir. Eski F03 görseli arşiv gibi depoda korunur.
- **Doğrulama:** `tests/f03-approved-v197.test.cjs` veri bütünlüğü, 30 soruya 114 etiketin beş plaket üzerinden kayıpsız dağıtılması, plaket çakışmaması ve örnek iki yönlü ekran kırpma sınırlarını denetler.
- **Cihaz kontrolü:** Otomatik testler gerçek iPhone gözlemi değildir; dikey/yatay ekranın fiilen görünümü sonraki kullanıcı ekran görüntüleriyle doğrulanacaktır.

Bu belge yalnız güncel F03 uygulamasını kaydeder; PROJE_ANAYASASI'ndaki kesin kuralları değiştirmez.

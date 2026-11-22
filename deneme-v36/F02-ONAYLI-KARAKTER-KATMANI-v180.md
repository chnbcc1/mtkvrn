# F02 v180 — Onaylı Erdem ve Çiko katmanları

**Durum:** İki özgün ikili görsel dosyası GitHub `main` dalına yüklendi. Oyun onaylı karakter PNG'sini ve karakter içermeyen F02 sahnesini ayrı katmanlar hâlinde kullanır. Dosyalardan herhangi biri yüklenemezse önceki F02 görseline güvenli dönüş yapılır.

GitHub deposunun `deneme-v36/assets/` klasöründe bulunan görseller:
- `erdem-ciko-onayli-v180.png` — Önceden onaylanan `Erdem_Ciko_Onayli_Seffaf.png` dosyasının aynen korunmuş kopyası. SHA-256: `b0e1a903b1bc0171785eebaa6b50a41900c7fa17f5d7d471509583ac4229eba5`
- `f02-background-no-characters-v180.webp` — Sadece boş etiketli enerji merdiveni arka planı; Erdem ya da Çiko bu arka planda çizili değildir.

Oyun `f02-approved-v165.js` içinde iki dosyanın yüklenmesini birlikte doğrular. Her ikisi varsa:
1. Arka plan yalnızca bir kez çizilir.
2. Onaylı PNG'deki Erdem ve Çiko, alfa saydamlığı korunarak ayrı bir görsel katmanıyla konumlandırılır.
3. Bütün sayılar / üsler / oranlar farklı DOM elemanlarından, o sorunun kendi verileriyle yerleştirilir.
4. Dikey üst %50 / yatay sol %50 görsel alanı ve soru/şıklar için kalan yarı korunur.

Bu görsellerin yeni karakter tasviriyle tekrar üretilmesi veya sayıları görüntünün piksellerine gömmek yasaktır.

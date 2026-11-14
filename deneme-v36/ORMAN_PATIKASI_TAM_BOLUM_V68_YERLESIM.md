# Orman Patikası · Tam Bölüm Yerleşim Planı (v68)

**TÜBİTAK 4006 Matematik Evreni — Erdem ve Çiko**  
**Tarih:** 14 Kasım 2026  
**Oynanabilir sahne:** https://chnbcc1.github.io/mtkvrn/deneme-v36/forest-v68-full.html?v=68  
**Giriş:** https://chnbcc1.github.io/mtkvrn/deneme-v36/?v=68

## Tasarım kararı

- Tek yatay kamera ile ormanda **21 ana matematik engeli** yer alır.
- Soru çözülen ana engel açılır, aradaki mini engeller **ZIPLA** tuşuyla fiziksel olarak geçilir.
- 21 soru engelinin her birinde 3 zorluk × 10 varyasyon vardır; soru bankası `forest-questions-v66.json` dosyasında 630 kayıt içerir.
- Üç hata aşaması: ipucu → çözümlü benzer örnek → mevcut soru çözümü ve zorunlu yeni pekiştirme.
- Oyun esnasında zorluk değiştirilemez. Yeniden başlatma ve tekrar seçimi geçmiş soru havuzuna bağlıdır.

## Sıralı harita

| Sıra | Soru kimliği | Ana fiziksel engel | Dünya x | Sonraki engel arasındaki mini engeller |
|---:|:---:|---|---:|---|
| 1 | F01 | Sarmaşık duvarı | 820 | Devrilmiş kütük + Küçük boşluk |
| 2 | F02 | Işıklı taş basamaklar | 1380 | Kaya kümesi |
| 3 | F03 | Sis türbini | 1940 | Küçük boşluk + Mantar platformu |
| 4 | F04 | Katmanlı ışık geçidi | 2500 | Ağaç kökü |
| 5 | F05 | Ters güç kristalleri | 3060 | Mantar platformu + Kaya kümesi |
| 6 | F06 | Mantar adaları | 3620 | Devrilmiş kütük |
| 7 | F07 | Kare taş platform | 4180 | Köprü yaklaşımı boş bırakıldı |
| 8 | F08 | Kırık köprü | 4740 | Küçük boşluk |
| 9 | F09 | Kopmuş halat | 5300 | Ağaç kökü + Devrilmiş kütük |
| 10 | F10 | Işıklı dikdörtgen platform | 5860 | Mantar platformu |
| 11 | F11 | Şelale kapakları | 6420 | Devrilmiş kütük + Küçük boşluk |
| 12 | F12 | İkiye ayrılan patika | 6980 | Kaya kümesi |
| 13 | F13 | Küp biçimli taş kilit | 7540 | Küçük boşluk + Mantar platformu |
| 14 | F14 | Dişli çark | 8100 | Ağaç kökü |
| 15 | F21 | Üslü-köklü gösterim geçidi | 8660 | Mantar platformu + Kaya kümesi |
| 16 | F15 | Eşlenik aynalar | 9220 | Devrilmiş kütük |
| 17 | F16 | Yanıltıcı yazıt | 9780 | Kaya kümesi + Ağaç kökü |
| 18 | F17 | Mavi toz istasyonu | 10340 | Küçük boşluk |
| 19 | F18 | Sinyal tekrarlayıcısı | 10900 | Ağaç kökü + Devrilmiş kütük |
| 20 | F19 | Taş platform desteği | 11460 | Mantar platformu |
| 21 | F20 | Gözlemevinin üç halkalı kapısı | 12020 | Bölüm bitişi |

> Not: Matematik müfredatı sırasına göre F21 üslü-köklü eşleştirme görevi F14 ile F15 arasındadır. F20 üç halkalı gözlemevi kapısı finalde yer alır.

## Başlangıç, köprü ve bitiş

- Erdem başlangıcı: x ≈ 330; ilk eğitim taşı x ≈ 505
- F08 köprü görevi: x = 4740; dere sol kenarı x = 4658; sağ kenarı x = 4873
- Köprü açıldıktan sonra 2,1 saniyelik kalas/halat onarım animasyonu tamamlanır; onarım bitmeden geçiş engellenir
- Gözlemevi bitiş kapısı: x ≈ 12555; bitiş ancak 21 soru engelinin tümü açıldıktan sonra etkinleşir
- Dünya toplam genişliği: 13040 oyun birimi

## Mini platform engelleri

Toplam 29 mini engel. Dağılım: kaya 6, kütük 6, boşluk 6, mantar 6, kök 5.

- Havada veya yeterli yükseklikteyken geçilir, aksi hâlde Erdem engelin önünde durur; ölüm/ilerleme sıfırlama yoktur
- Aynı anda yön tuşu ve zıplama çalışır
- Zıplama ilk hızı –590, yerçekimi 1150 oyun birimi/s²; tüm 29 mini engelin tek sıçrayışla aşılabilirliği sayısal modelde sınandı

## Ayak teması ve grafik

- Erdem'in atlas karelerindeki en alttaki görünür piksel ölçülür ve her kare aynı yer referansına çizilir
- Gölge sabit yer çizgisinde kalır, sıçrayış yüksekliğine göre yumuşar/küçülür
- v67 sinematik orman görseli korunur ve geniş oyun dünyasına yansıtmalı döşenir
- Köprü sahnesinde ahşap kalaslar, tahtadaki çiviler, korkuluk dikmeleri, halatlar, yarık ve dere ayrıntıları çizilir

## Kontrol ve sınırlar

- 21 ana engelin koordinatları ve 29 mini engelin yerleşimi doğrulandı; sonraki soru engelinin kilit konumuyla tehlike çakışması yok
- 29 mini engel için zıplama-fizik simülasyonu başarılı
- JavaScript sözdizimi kontrolü ve GitHub dosya bütünlüğü kontrolü yapıldı
- **Gerçek iPhone Safari'de 21 engelin baştan sona etkileşimli testini henüz yapmadık**; görsel taşmalar, kare hızı, engel çarpışmaları ve ses/ekran okuyucu kontrolleri ayrıca doğrulanmalı
- Nihai pedagojik soru metni onayı bu tam bölüm oynanışından sonra yapılacaktır

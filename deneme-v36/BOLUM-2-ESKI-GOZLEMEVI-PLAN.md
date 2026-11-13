# Matematik Evreni — Bölüm 2: Eski Gözlemevi

**Durum (v60):** Bölüm 1'den geçiş, giriş sahnesi ve kayıt alanı hazır. Gözlemevi henüz oynanabilir bir sahne değildir. Bu belge yeni bölümün uygulanacak görevlerini tanımlar.

## Hikâye akışı

- Bölüm 1'de Erdem atlas üzerinde eski gözlemevinin yanındaki üç halkayı bulur. Yanlış bölge seçimi yoktur.
- "Eski gözlemevine git" seçilince Bölüm 2 giriş anlatısı açılır. Erdem ve Çiko tepeye çıkan patikaya yönelir.
- Üç halka, mavi toz ve dedenin araştırma defteri arasındaki ilişki ilerledikçe araştırılır; hikâyenin sonucu peşinen açıklanmaz.

## Sahne sırası ve sabit kimlikler

| Kimlik | Bölge | Planlanan etkileşim |
|---|---|---|
| `forest-path` | Orman patikası | Yol gösteren izler, hareket ve keşif alanı |
| `outer-gate` | Gözlemevi girişi | Kapı ve üç halka işareti; nesneye sabit büyüteç |
| `main-hall` | Ana salon | Araştırma notları, anlaşılır kısa Erdem düşünceleri |
| `observing-room` | Gözlem odası | Düşünme ve bağlam temelli matematik bulmacası |

Bölgeler v60 oyun kodunda `OBSERVATORY_CHAPTER.sections` altında `planned` durumundadır. Bu, sahnelerin şimdiden oynanabildiği anlamına gelmez.

## Teknik hazırlık

- Mevcut kayıt anahtarı `mathverse-v40-investigation` korunur.
- `gameOver` Bölüm 1 atlas keşfinin tamamlandığını temsil eder; `chapter2EntrySeen` giriş anlatısının açıldığını kaydeder.
- Yeni araştırmaya başla işlemi `chapter2EntrySeen` değerini de temizler.
- Geçiş hem atlas ekranından hem Erdem'in notlarından açılabilir.
- Erdem ve Çiko'nun yüksek çözünürlüklü atlasları ve mevcut yürüme/zıplama/uçuş sistemleri korunur.
- İncelenen nesnelerin büyüteçleri dünyadaki nesne koordinatlarına sabitlenir, karakterlerin arkasında çizilir.
- Gerçek sahneler geliştirildiğinde sahne çizimi, çarpışma, kamera, ipucu kaydı ve geçişler ayrı sınanmalıdır.

## Oynanabilir sürüme geçiş için kabul testleri

1. Bahçe ipuçları, atlas kararı ve mevcut kullanıcı kayıtları bozulmamalı.
2. Giriş ve oyun içinde "Açılış konuşmasını yeniden dinle" düğmesi bulunmamalı.
3. "Dedesinin orada olup olmadığını henüz bilmiyor." ifadesi arayüzde bulunmamalı.
4. Atlas seçim gerektirmeden eski gözlemevini göstermeli; bölüm geçişi yalnızca atlas keşfinden sonra açılmalı.
5. iPhone'da safe-area, ekran kaydırma, dikey kullanım ve modal düğmeleri sınanmalı.
6. Yeni mekânın oynanabilir olduğuna dair durum yalnızca sahne ve etkileşimler tamamlandığında verilmeli.

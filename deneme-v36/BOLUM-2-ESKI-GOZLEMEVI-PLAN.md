# Matematik Evreni — Bölüm 2: Eski Gözlemevi

**Durum (v61):** Bölüm 1'den orman patikasına geçiş ve **orman patikasının ilk oynanabilir taslağı** tamamlandı. Ölçme problemi çözülerek dere geçiliyor ve gözlemevi kapısına ulaşılıyor. Gözlemevinin iç mekânları henüz oynanabilir değildir.

## Hikâye akışı

- Bölüm 1'de Erdem atlas üzerinde eski gözlemevinin yanındaki üç halkayı bulur. Yanlış bölge seçimi yoktur.
- "Eski gözlemevine git" seçilince Bölüm 2 giriş anlatısı açılır. Erdem ve Çiko tepeye çıkan patikaya yönelir.
- Üç halka, mavi toz ve dedenin araştırma defteri arasındaki ilişki ilerledikçe araştırılır; hikâyenin sonucu peşinen açıklanmaz.

## Sahne sırası ve sabit kimlikler

| Kimlik | Bölge | Planlanan etkileşim |
|---|---|---|
| `forest-path` | Orman patikası | **v61 oynanabilir**: sağ/sol hareket, zıplama, sabit büyüteç, üç zorlukta köprü hesabı ve kayıt |
| `outer-gate` | Gözlemevi girişi | **v61 ön inceleme**: kapı ve üç halka; v62'de tam oynanabilir kapı bulmacası |
| `main-hall` | Ana salon | Araştırma notları, anlaşılır kısa Erdem düşünceleri |
| `observing-room` | Gözlem odası | Düşünme ve bağlam temelli matematik bulmacası |

Bölgeler v60 oyun kodunda `OBSERVATORY_CHAPTER.sections` altında `planned` durumundadır. Bu, sahnelerin şimdiden oynanabildiği anlamına gelmez.

## Teknik hazırlık

- Mevcut kayıt anahtarı `mathverse-v40-investigation` korunur.
- `gameOver` Bölüm 1 atlas keşfinin tamamlandığını temsil eder; `chapter2EntrySeen` geçişin başlatıldığını kaydeder.
- `chapter2` nesnesi `stage`, `x`, `puzzleSolved`, `difficulty`, `reachedGate` alanlarını tutar. Bölüm 1'in kayıt işlevi var olan bölüm 2 alanlarını korur.
- Yeni araştırmaya başla işlemi `chapter2EntrySeen` değerini de temizler.
- Geçiş hem atlas ekranından hem Erdem'in notlarından `forest-v61.html` sayfasına açılır.
- Erdem ve Çiko'nun yüksek çözünürlüklü atlasları ve mevcut yürüme/zıplama/uçuş sistemleri korunur.
- İncelenen nesnelerin büyüteçleri dünyadaki nesne koordinatlarına sabitlenir, karakterlerin arkasında çizilir.
- v61 orman görselleri kodla çizilmiş ilk prototip çevredir; nihai resimlendirme ve kamera/çarpışma performansı iPhone üzerinde test edilmelidir.
- v62'de kapıdaki üç halka sembolünü daha ayrıntılı keşif ve yeni matematik etkileşimine bağla. v63'te iç mekânlar ve sonraki kazanım görevleri eklenmeli.

## Oynanabilir sürüme geçiş için kabul testleri

1. Bahçe ipuçları, atlas kararı ve mevcut kullanıcı kayıtları bozulmamalı.
2. Giriş ve oyun içinde "Açılış konuşmasını yeniden dinle" düğmesi bulunmamalı.
3. "Dedesinin orada olup olmadığını henüz bilmiyor." ifadesi arayüzde bulunmamalı.
4. Atlas seçim gerektirmeden eski gözlemevini göstermeli; bölüm geçişi yalnızca atlas keşfinden sonra açılmalı.
5. iPhone'da safe-area, ekran kaydırma, dikey kullanım ve modal düğmeleri sınanmalı.
6. Yeni mekânın oynanabilir olduğuna dair durum yalnızca sahne ve etkileşimler tamamlandığında verilmeli.

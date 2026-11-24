# Matematik Evreni — PROJE ANAYASASI (onaylı kararlar)
> Kapsam: TÜBİTAK 4006 Matematik Evreni / Erdem-Çiko oyunu.
> Statü: Kullanıcının önceki sohbetlerde açıkça verdiği kuralların ortak başvuru kaydı.
> Amaç: Yeni sohbetlerde eski kararların kaybolmasını ve yanlışlıkla yeniden yorumlanmasını önlemek.
> Son derleme: 23.11.2026. Bu dosya oyunun yayımlandığını veya bütün kuralların kodda eksiksiz uygulandığını iddia etmez.

## 0. Çalışmaya başlamadan yapılacak ZORUNLU kontroller
1. **Bu dosyayı oku.** Yeni sohbet, uzun süreli geliştirme, yeni sahne, soru, engel, tasarım veya yayın öncesinde en başta oku.
2. GitHub `chnbcc1/mtkvrn` deposunun güncel **main** dalını ve düzenlenecek gerçek dosyaları incele. Eski sürümden veya sohbet hafızasından kod tahmin etme.
3. Kullanıcının son isteğini bu dosyayla karşılaştır. Çelişki varsa kullanıcıdan gelen açık yeni talep geçerlidir; değişen kuralı bu dosyada ayrıca güncelle. Sessizce yeni kural uydurma.
4. Soruları, referans karakter görsellerini ve sahne kurallarını birbirinden ayrı incele. Onaylanmamış görseli, karakteri veya sahne türünü “onaylı” diye sunma.
5. Yalnız istenen bölümü değiştir; çalışan oyun, soru bankası, zıplama mekaniği, ekran geçişleri ve öğrenci kayıtlarını koru. Test ederek doğrula.
6. GitHub değişikliği, otomatik test ve GitHub Pages yayını ayrı ayrı doğrulanmadan “yayımlandı / tamamlandı” deme. iPhone üzerindeki gerçek görünüm ancak cihaz ekran görüntüsü veya gerçek testle doğrulanabilir.

## 1. EN ÖNEMLİ KURAL — iki farklı engel/görev sınıfı
### A. Küçük FİZİKSEL ZIPLAMA ENGELLERİ
- Yolun üstündeki kütük, kaya, kök, mantar öbeği ve yarık/çukur benzeri küçük nesneler.
- Erdem zamanında zıplayarak üzerinden geçer; Çiko kendi animasyonunu sürdürür.
- **Bu nesnelerde matematik sorusu açılmaz.** Bunları 21 araştırma/görev ekranıyla asla karıştırma.
- Onaylanmış çarpışma, hareket ve zıplama fiziğini rastgele değiştirme.

### B. ARAŞTIRMA / MATEMATİK GÖREVLERİ
- Ormandaki ayrı **21 araştırma görevi**; matematik soruları, ipuçları, çözümler ve ilgili sahne görselleri burada kullanılır.
- Görev sorularının kabul edilen veri kaynağı mevcut `deneme-v36/forest-questions-v147.json` (630 soruluk veri havuzu); yeni soru uydurup mevcut onaylı sorunun yerine koyma.
- Görevdeki matematiksel ifadeler, sayısal veriler, oranlar, seçenekler **görselin içine gömülmez**; ilgili sorunun veri alanından ayrı HTML/katman olarak çizilir.
- Oyundaki `F01/F02/F03...` sırası **araştırma/görev sırasını** belirtir; küçük fiziksel zıplama engeli sırası değildir.
- Onaylı araştırma sırası başlangıcı: `F01 Sarmaşık Duvarı`, `F02 Işıklı Taş Basamaklar`, `F03 Sis Türbini`. **F03 üçüncü araştırma görevidir; üçüncü fiziksel engel değil.**
- Önemli: Eski kod veya dokümanlarda “ana matematik engeli” denmesi, bu iki ayrı oyun mekaniğini birleştirme yetkisi vermez. Kod farklı davranıyorsa uygulama-tasarım uyuşmazlığı olarak raporla.

## 2. Erdem ve Çiko — kesin kimlik kuralı
- Onaylı karakter görünümü, renkleri, oranları ve ölçeği korunacak; her engel için tekrar çizilmeyecek, stil değiştirilmeyecek.
- Depodaki doğrulanmış onaylı kaynak: `deneme-v36/assets/erdem-ciko-onayli-v180.png`. Gerekli şeffaf katman/ayrılmış sprite'lar için güncel dosyaları incele; ayrılmış bir kaynak gerçekten yoksa varmış gibi davranma.
- Soru sahnesi **önce karakter olmadan** üretilir. Erdem ve Çiko için bilinçli boş alan ayrılır.
- Ardından karakterler onaylı referans katmanlarından, yerleri/ölçekleri korunarak sahneye **ayrı katman** olarak yerleştirilir.
- Erdem ve Çiko'yu arka plan görseliyle birlikte yeniden üretme. “Benziyor” yeterli değil; mümkün olduğunca aynı kaynağı kullan.

## 3. GÖRSEL EKRAN YERLEŞİMİ
- **DİKEY (portrait):** Sahneli soru ekranının **üst %50'si görsel**, alt %50 soru + şıklar / yardımcı araçlar.
- **YATAY (landscape):** **SOL %50 görsel**, sağ %50 soru + şıklar / yardımcı araçlar. **Yatayda üst %50 değil.**
- **TEK ANA SAHNE KURALI (24.11.2026 kullanıcı onayı):** Her araştırma görevi için önce dikey ekranda kullanılacak **tek ana sahne görseli** hazırlanır. Yatay için farklı sahne veya yeniden çizilmiş kompozisyon üretilmez; **dikey için üretilmiş aynı görüntü** kullanılır. Yatayın sol %50'lik görsel çerçevesine orantılı sığdırılır; gerekiyorsa **yalnızca üstünden veya altından bir miktar kırpılır**. Görsel yatayda gerilmez, yeniden oluşturulmaz, filtre/makine/arka plan nesnelerinin şekli ve konumu değiştirilmez. İki konumda da aynı sahne kimliği korunur. Yan yana iki taslak, başlık, cevap şablonu veya büyük infografik olarak tek görsel üretme; oyuna takılabilen *yalnız sahne görseli* üret.
- Görselin içine soru, cevap, sonuç, üs, kesir, değer, plaket sayıları, “F03 Zor”, “Sis Türbini” başlığı gibi statik metin yerleştirme. Gerekli konumsal boş plaketler ve veri ankrajları önceden tasarlanabilir; değerler sonradan dinamik yazılır.
- Görselin en-boy oranı korunur; görüntü **esnetilmez**. Dikey ana görüntü yataya uyarlanırken sadece **üst veya alt kısmından gerekli kadar kırpma** yapılabilir; kritik türbin/filtre/veri alanları ve Erdem-Çiko için ayrılan boş yerler kesilmez. Sağdan/soldan kırpma, yapay genişletme ve yeni sahne oluşturma yapılmaz. Ana sahne hazırlanırken bu iki kullanımın güvenli kırpma payları önceden tasarlanır. Kısa/uzun sorular ekrana uyarlanacak; gerekli çok uzun metinler için kontrollü kaydırma olabilir.
- Yüksek kaliteli, oyunun mevcut sinematik orman ve altın çerçeve kimliğine uyumlu sahne; Erdem/Çiko'yu kapatmayan 3B engel/makine arka planda.
- Görsel üretimi sırası: (1) doğrulanmış görev ve onaylı mevcut soruları oku, (2) dikey üst %50 için Erdem/Çiko'suz **tek ana sahneyi** üret, iki yön için kritik unsurların ve karakter boşluklarının korunacağını kontrol et, (3) yatay sol %50 için **aynı sahneyi sadece gerekirse üstten/alttan kırparak** kullan, **yeniden çizme/üretme**, (4) onaylı Erdem ve Çiko referanslarını ayrı katman olarak iki yerleşime de uygula, (5) soru verilerini ayrı katmanla bağla, (6) iki ekranda gerçek iPhone testi yap.

## 4. F03 — ÜÇÜNCÜ ARAŞTIRMA GÖREVİ
- **Adı: Sis Türbini.** Sis miktarının giriş, filtre(ler), çıkış dönüşümünü konu edinen sorular. `deneme-v36/forest-questions-v147.json` içinde `obstacleId: F03` ile doğrulandı.
- Var olan F03 makine illüstrasyonu: `deneme-v36/assets/quiz-f03-machine-v145.js`; sahne geliştirmeden önce gerçek mevcut görsel/HTML bağlantıları incelenecek.
- Kullanıcı yeni sahnede ilk aşamada Erdem/Çiko istemiyor. Karakterlerin sonradan eklenebileceği boş alanlar bırakılacak.
- **Kaya/kütük** gibi zıplama engellerini yanlışlıkla “3. Engel” başlıklı F03 görselinin yerine üretme. Bu hata önceki taslaklarda yaşandı ve kabul edilmedi.
- Dikey üst %50, yatay sol %50 görsel. **F03 Sis Türbini için de dikey ana görselin aynısı yatayda kullanılacak; sadece üst/alt kırpma serbest, ikinci bir türbin sahnesi üretmek yasak.** Bu görseller sadece makine/sahne olacak, soru/şıklar oyun arayüzünde yer alacak.
- Yeni F03 taslağı kullanıcı açıkça onaylamadan onaylı final sahne olarak kaydedilmez veya canlıya bağlanmaz.
- **23.11.2026 açık kullanıcı onayı — F03 v198:** Kullanıcı beş boş plaketli yeni dikey Sis Türbini sahnesini oyuna bağlamayı ve Erdem–Çiko'nun onaylı şeffaf referans katmanını eklemeyi istedi. Güncel onaylı sahne `deneme-v36/assets/f03-five-plaques-v198.avif`; en çok beş etiket kullanan 30 F03 sorusunun 114 sayısal verisi ayrı DOM etiketleriyle yerleştirilir. Erdem–Çiko görseli `erdem-ciko-onayli-v180.png` kaynağından yeniden çizilmeden üst katman olarak kullanılır. Bu onay, yukarıda belirtilen karakter olmadan ilk taslak aşamasının sonrasıdır; diğer görevlerin referansları ve 630 soruluk banka değişmez.

- **23.11.2026 F03 soru dili ve öğretici ipuçları onayı:** F03'te girişten filtreye ve gözlem tüpüne ilerleyişin sırası açıkça belirtilir. Ardışık süzme, birbirinden bağımsız iki paralel boru ve ana borudan ayrılan kol farklı matematiksel durumlar olarak anlatılır. Onaylı örnek: `2¹² → 1/4 → 1/8 → 1/2 = 64` sorusu kullanıcının verdiği tam cümleyle korunur. Sadece F03'e ait 30 sorunun **dili** ve bu sorulara ait açıklama/ipucu metinleri güncellenebilir; 630 soru sayısı, soru matematiği, doğru cevaplar ve A–D seçenekleri korunur. 1. yanlışta soruya özgü kavramsal ipucu, 2. yanlışta nihai cevabı söylemeyen gerçek ara işlem, 3. yanlışta sorunun kendi verileriyle tam ve kontrol edilmiş çözüm verilir. Kök/alan gibi alakasız genel yönlendirmeler F03'te kullanılmaz.

- **23.11.2026 — Üslü ifadelerde taban çeşitliliği (yeni kullanıcı talebi):** Sorular yalnızca ikinin kuvvetleriyle sınırlı kalmayacak. İlgili matematik konusuna uygun olarak 3, 4, 5, 6 gibi tabanların kuvvetleri de farklı varyasyonlarda kullanılacak. Üs gösterimi soru metninde, görsel değer katmanında, benzer örnekte ve çözümde uyumlu olacak. Giriş değeri değiştiğinde bütün paylar, doğru cevap, dört seçenek ve çözümler matematiksel olarak birlikte yeniden kontrol edilir. F03'te bu çeşitlilik uygulandı; diğer araştırma görevleri kendi soru/yerleşim testlerinden geçirilmeden topluca değiştirilmez.
- **23.11.2026 — Benzer soru sonrası durum:** Üçüncü yanlıştan sonra tam çözüm görülür; yeni benzer soru ayrı alıştırmadır. Benzer soru başarıyla tamamlanınca önceki sorunun işaretli cevapları bir daha gösterilmez; “Benzer soru tamamlandı” sayfasından ormana dönme veya yeni alıştırma başlatma seçilir. Benzer sorudaki yanlışlar eski görevin yanlış sayısına eklenmez. Bu davranış F03 ile sınırlı kalmamalı, benzer soru kullanan diğer görevlerde de tutarlı olmalıdır.

## 5. Defter / soru ekranı (kabul edilmiş davranış)
- Matematik defteri not almayı, silgiyi, el ile aşağı kaydırmayı, geri/ileri almayı ve kâğıdı temizlemeyi destekler.
- Kareli, çizgili ve boş kâğıt arasında değiştirirken çizilmiş işlemler korunur; defter uzun kaydırılabilir yüzeydir.
- Açık adaçayı yeşili kâğıt, kullanıcının özgün sarmaşık kenarları, net görüntü. Görseller keyfî şekilde değiştirilmez.
- Yatayda not defteri soru metni, oyun sorusunun gerçek hesaplanan puntolarıyla eşleşir; sağ altta geri al / ileri al / çöp dikey grubu; sol tarafta kalem/silgi/el/zemin/zoom araçları.
- İlgili kod: `deneme-v36/assets/math-notebook-v187.js`, kademeli CSS v191–v196 ve `forest-v70-quiz.html`. Sabit dosya adı sürüm numarası güncellense de eski kod anlamına gelmez.

## 6. GÜNCEL VERİ / KARAR ÖNCELİĞİ
1. Kullanıcının **son açık talimatı ve son onayladığı ekran görüntüsü**.
2. Bu `PROJE_ANAYASASI.md` içindeki yazılı kesin kurallar.
3. Onaylı sorular, onaylı referans görselleri ve GitHub'daki doğrulanmış güncel uygulama.
4. Eski README'ler, önceki sürüm notları ve sohbet özetleri yardımcı kaynak; birbirleriyle çelişebilir.
- Bir hata varsa “önceki kararı değiştirdik” varsayma. Önce doğrula, sonra düzelt.
- Yanlış üretilmiş taslakları **onaylı** olarak işaretleme ve onaylı dosyaların üzerine yazma.

## 7. Yeni sohbet başlatırken / sohbet sonunda
**Yeni sohbet başlangıç komutu:**
`Matematik Evreni'ne kaldığımız yerden devam. chnbcc1/mtkvrn GitHub deposundaki deneme-v36/docs/PROJE_ANAYASASI.md dosyasını ÖNCE oku. Güncel main'i ve ilgili dosyaları kontrol et. Onaylı kuralları değiştirme. Şu anda çalıştığımız konu: ...`

**Her oturum sonunda kısa devir kaydı tutulur:**
- Son onaylı karar
- Son doğrulanmış GitHub commit'i ve dosya adları
- Onaylanmamış taslaklar (net yaz)
- Testlerin gerçek durumu (kod / GitHub Actions / Pages / iPhone)
- Bir sonraki iş ve değişmeyecek kısıtlar

**Kural değişirse:** Eski cümleyi sessizce silip yerine başka karar koyma. Kararın nedenini, yeni onayı ve tarihi kısa değişiklik kaydıyla ekle.

## 8. Proje kuralı değişiklik günlüğü
- **23.11.2026 — Üslü taban çeşitliliği ve alıştırma geçişi.** Kullanıcı yalnız 2 tabanlı kuvvetlerin tekrar etmemesini, 3/4/5/6 gibi tabanlar kullanılmasını, yeni benzer soru çözülünce eski sorunun doğru işaretli olarak geri gelmemesini, örnek ve ipuçlarının akıcı Türkçeyle soruya ve görsele uygun olmasını istedi. F03 soruları matematiksel olarak doğrulanarak çeşitlendirildi; beş plaketli onaylı sahne ve onaylı karakter referansları korundu.
- **23.11.2026 — F03 matematik dili ve kademeli ipucu düzeltmesi.** Kullanıcı 2¹² birimlik sis sorusunun açık ardışık geçiş metnini aynen onayladı ve benzer F03 sorularına uygulanmasını istedi. Her F03 sorusunun ipuçları kendi akışına ve sayısal verilerine göre yazılır. 3. yanlışta tam çözüm gösterilir; eski yanlış soru, benzer soru doğru çözüldüğünde sanki kendisi doğru çözülmüş gibi işaretlenmez. Bu izin yalnız F03 metinleri ve pedagojik açıklamaları için önceki 'soru bankası değişmez' kuralının dar istisnasıdır.
- **23.11.2026 — F03 beş plaketli sahne onayı.** Kullanıcı eski 12 plaket yerine beş plaketi yeterli bulup yeni sahnenin F03 görevine eklenmesini ve aynı onaylı Erdem–Çiko görsel katmanının uygulanmasını istedi. Yeni görüntü tek dikey ana görsel kuralını korur; sayılar ayrı katmanla yazılır. GitHub doğrulama testi ve Pages yayını ayrıca kontrol edilir.
- **24.11.2026 — Tek ana sahne kararı.** Kullanıcı, dikey görev görselinin yatayda da aynen kullanılmasını; yalnızca üstten/alttan gerektiği kadar kırpılmasını onayladı. Eskiden yazılı olan iki bağımsız kompozisyon ve tamamen kırpmasız yerleşim kuralları bu karara göre güncellendi. Erdem/Çiko ayrı referans katmanı, dinamik sayılar ve dikey üst %50 / yatay sol %50 değişmedi.
- **23.11.2026 — İlk ana kural derlemesi.** Küçük zıplama engelleri / 21 araştırma görevi ayrımı ve F03 bağlamı yeniden doğrulandı. Dikey/yatay %50 yerleşim ve onaylı Erdem/Çiko referansı eklendi. Bu belge kodu veya soru bankasını değiştirmez.


## 9. Stüdyo ses kimliği ve geliştirme kuralları (24.11.2026)
- Kullanıcı Erdem ve Çiko'nun görsel referansları gibi bütün oyun boyunca tutarlı, kendilerine özgü referans sesleri olmasını onayladı. Henüz kesin ses kaydı veya model onaylanmadı; aday sesler onaylı diye sunulmaz.
- Ses efektleri, konuşma, ortam ve müzik ayrı kanallarda yönetilir. Ücretli API veya zorunlu abonelik kullanılmaz. Kullanılan dış seslerin lisansı doğrulanır; yerel seslendirme ve özgün ses üretimi önceliklidir.
- Ses laboratuvarı v11 `ses.html` dosyasında yerel ön izleme ve ayrı ses profilleri sağlar. Ana oyuna henüz bağlanmamıştır; sentetik efektler ve tarayıcıdaki yerel Türkçe sesler taslaktır. Onaylanmış karakter referansları, soru bankası ve ana oyun dalı değiştirilmez.
- Devir kaydı: v9 canlı ayar paneli kullanıcı tarafından başarılı olarak bildirildi. v10 animasyon ekleri ve v11 ses laboratuvarı GitHub test dalına kaydedildi; v10/v11 tarayıcı ve telefon testi bekliyor. Sırada görsel engel ve sayısal koordinat editörleri ile otomatik testler.


## 10. Animasyon stüdyosu ve eğilme (24.11.2026)
- Animasyon stüdyosu bağımsızdır; fizik ve engel editörleri ortak gerçek orman testini kullanır. Yakınlaştırma gerçek karakter ölçeğinden ayrıdır.
- Eğilme, eğilmiş bekleme, eğilerek sağ/sol yürüme, eğilmiş sağ/sol dönüş ve doğrulma ayrı hareketler olarak hazırlanır. Erdem'in onaylı kimliği korunur; gövde dikey sıkıştırılmaz. Fiziksel eğilme engelleri matematik sorusu açmaz.
- v18 özel animasyon kütüphanesi `animasyon-yeni.html`: PNG ve sprite sheet içe aktarma, kare süreleri ve dönüşümler, IndexedDB yerel taslak kaydı. Henüz gerçek oyun motoruna bağlanmadı; kullanıcı tarafından oluşturulacak hareketler ve yeni görseller test/onay bekler. Main ve soru bankası korunur.

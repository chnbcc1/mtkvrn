# Matematik Evreni – Erdem ve Çiko (v58 deneme)

## v58 (13 Kasım 2026) — sabit büyüteçli keşif
- Hareket ederek karakterlerin önüne geçen **“İNCELE”** yazısı kaldırıldı.
- İncelenebilir nesneye yaklaşınca onun dünya koordinatına bağlı küçük, dokunulabilir bir **büyüteç** belirir.
- Büyütece dokunmak mevcut inceleme penceresini açar; klavyede E tuşuyla inceleme desteği korunur.
- Büyüteç HTML üzerinde dolaşmaz, oyun sahnesine çizilir; kamera ilerlediğinde nesneye bağlı olarak hareket eder.
- Büyüteç Erdem ve Çiko'dan **önce** çizildiği için karakterlerin üzerini kapatmaz.
- Büyütecin merkezi sabittir; dikkat çekmek için yalnızca küçük bir ışık halkası nabız gibi parlar. Azaltılmış hareket tercihinde parlama sabit kalır.
- v57 yüksek çözünürlüklü Erdem/Çiko animasyonları ve kayıtlı oyun ilerlemesi korunmuştur.
- Kontrol: GitHub'a yazma, okunabilirlik ve JavaScript sözdizimi doğrulandı. iPhone üzerinde dokunma testi ayrıca yapılmalıdır.



## v57 (13 Kasım 2026) — yüksek çözünürlüklü animasyonlar
- Mobil videoda Erdem ve Çiko'nun arka plana kıyasla bulanık görünmesinin kaynağı belirlendi: eski Erdem atlasının 140×218 kareleri aşırı sıkıştırılmış, Çiko atlası ise yalnızca 64×64 karelerden oluşuyordu.
- **Erdem:** Orijinal üretim görsellerinden şeffaf 1.040×2.025 atlas (18 kare, her biri 260×405 px) hazırlandı. Kaynak AVIF 280.902 bayt; v56'daki 140×218 / düşük kalite atlasın yerini alır.
- **Çiko:** Orijinal görsellerden 1.152×576 atlas (18 kare, her biri 192×192 px) hazırlandı. Kaynak AVIF 106.464 bayt; 64px eski karelerin yerini alır.
- Eski animasyonlar yalnızca yeni HD görsellerin çözülememesi durumunda geri dönüş olarak tutulur.
- Çizim çözünürlüğü Retina ekranlar için en fazla 3× cihaz piksel oranına yükseltildi. Karakterlerin oyun içindeki fiziksel boyutları ve hızları değiştirilmedi.
- Çiko'nun ön/arka uçuşu, Erdem'in yürüme/zıplama/dönüş kareleri ve oyun kayıtları korunur.
- Kayıt anahtarı değişmedi. Kod sözdizimi ve kaynak dosya bütünlüğü kontrol edildi; iPhone'daki görsel performans ayrıca doğrulanmalıdır.



## v56 (13 Kasım 2026)
- Erdem'in kullanıcı tarafından oluşturulan **18 yeni 3D karakter sprite görseli** oyuna bağlandı: 8 yürüyüş karesi (sağ-sol adımlar), 6 zıplama aşaması ve 4 yön değiştirme pozu.
- Görseller tek bir AVIF atlası olarak `erdem-v56-atlas.js` içinde dağıtılıyor. 4 sütun x 5 satırlık düzen; her kare eşit kaynak dikdörtgeninden çizilir.
- Yürüyüş döngüsü, saniyeye sabitlenmek yerine karakterin ilerlediği mesafeye bağlıdır: 27 dünya biriminde bir kare, 252 birim/saniye hızda yaklaşık 1,17 tam yürüyüş döngüsü/saniye ve yaklaşık 2,3 adım/saniye.
- Ayak tabanı şeffaf görselde ölçülerek her yürüyüş pozunda aynı zemine hizalanır. Hareket sırasında karakterin eni değiştirilmez.
- Zıplama yükseliş, zirve ve iniş durumuna göre altı ayrı görseli kullanır.
- Yön değiştirmede dört dönüş pozu kullanılır; iki yöne dönerken animasyon aynalanır, geçiş sırasında yatay sıkıştırma yapılmaz.
- Çiko'nun v55 uçuş görselleri, ön/arka geçişleri ve uçuş temposu korunur; oyuncunun kayıtlı ilerlemesi silinmez.
- Yeni Erdem görselleri yüklenemezse eski tam-vücut 3D sprite'larına otomatik geri dönüş uygulanır.
- **Doğrulama:** GitHub içerik ve JavaScript sözdizimi kontrolü yapıldı. Telefon üzerinde gerçek zamanlı görüntüleme ile son kalite henüz doğrulanmadı.

## v55 (13 Kasım 2026)
- Çiko'nun kullanıcı tarafından üretilen **18 yeni sprite görseli** oyuna entegre edildi: sekiz kanat çırpma, altı dikey uçuş, dört yön değiştirme karesi.
- Bu görseller 6 sütun x 3 satırdan oluşan tek bir şeffaf, sıkıştırılmış AVIF atlasında yayımlandı (`chiko-v55-atlas.js`).
- Oyun kanat çırpma, yükselme ve dönüş durumuna göre ayrı kareler seçer; tüm kareler aynı ölçekte çizilir.
- Kanat çırpma temposu normal hareket sırasında yaklaşık 1,9 döngü/s, dururken 1,5 döngü/s, yükselirken 2,35 döngü/s olarak ayarlandı.
- Çiko Erdem'in önünden ve arkasından uçmaya devam eder; kuş görselleri yüklenmezse eski sprite'lara geri döner.
- Kullanıcı kayıtları korunur. Kod bütünlüğü ve JavaScript sözdizimi doğrulandı; canlı cihazda görsel kontrol hâlâ gereklidir.



## v53 (13 Kasım 2026)
- v52 video incelemesi: Çubuk bacak sorunu giderilmiş, ancak geniş adımlar, yerden kopan botlar ve bazı karelerde çift/soluk karakter görüntüsü devam ediyor.
- İki farklı tam-vücut kareyi yarı şeffaf üst üste koyan geçişler kaldırıldı; karakter artık net, tek tam-vücut 3D görüntüsüyle çiziliyor.
- Ayak tabanları her sprite'ın görünür son pikselinden ölçülerek zemin çizgisine göre hizalanıyor.
- Yürüyüş karelerinin oynatım hızı yeniden düzenlendi.
- İnceleme düğmesi hem Çiko hem de Erdem ile çakışmadan konumlandırılıyor.
- Çiko'nun Erdem'in önünden/arkasından geçen serbest uçuşu ve oyuncu kayıtları korunuyor.
- **Bilinen eksik:** Mevcut altı 3D yürüyüş görseli doğal sağ-sol bacak döngüsü için yeterli değil. Yeni, tutarlı sağ/sol pozlu 3D görseller olmadan bu sorun tam çözülmüş sayılmamalıdır.
- GitHub kod/sözdizimi kontrolleri tamamlandı; gerçek telefonda görsel doğrulama gereklidir.

## v52 (13 Kasım 2026)
- **Acil görsel düzeltme:** v51'de Erdem'e yapıştırılmış çubuk bacak, çizilmiş bot ve kesilmiş üst gövde yöntemi tamamen kaldırıldı.
- Orijinal 3D karakterin baş, gövde, iki bacak, ayakkabı ve çantası her karede bütün olarak korunur.
- Orijinal tam-vücut altı yürüyüş pozundan altı ara görüntü üretilerek 12 karelik daha yumuşak bir raster geçişi oluşturuldu.
- Zıplamada dört ayrı tam-vücut poz kullanılır. Çiko'nun serbest ön/arka uçuş rotası ve kayıtlar korunur.
- **Henüz tamamlanmayan konu:** İkinci ayağın bağımsız öne geçtiği gerçek, yeni 3D hareket pozları bu geçici onarımda üretilmedi. Yürüyüş döngüsünün anatomik doğruluğu ayrıca yeniden çalışılmalıdır.
- Kodun okunarak doğrulanması ile JavaScript sözdizimi kontrolleri yapıldı; cihazda görsel animasyon testi gerekir.



## v51 (13 Kasım 2026)
- Hatalı tek-bacak yürüyüş görsellerinin ve ters çevrilmiş alt-gövde hilesinin yerine, oyun açılırken şeffaf kanvasta oluşturulan **12 yeni yürüyüş karesi** devreye alındı.
- Erdem'in tanınan yüzü, saçı, gözlüğü, kıyafeti ve çantası mevcut orijinal görsel kaynaktan korunurken, sağ/sol bacak ve botlar ayrı, zıt fazlarda hareket ettirildi.
- Kalkış, yükselme, tepe ve iniş için 4 yeni zıplama pozu oluşturuldu; adım atış hızına bağlı ilerleme ve ortak ayak taban çizgisi kullanıldı.
- Önceki Çiko ön/arka serbest uçuşu, okunabilir HUD ve kullanıcı ilerlemesi korunmuştur.
- Bunlar yüksek çözünürlüklü 3D yeniden render değil; program tarafından orijinal üst gövde ve çizim katmanlarıyla oluşturulan yeni 2D raster animasyon kareleridir.
- **Kontrol:** GitHub kod bütünlüğü ve JavaScript sözdizimi doğrulandı; mobil cihazdaki görsel sonuç ayrıca test edilmelidir.



## v50 (13 Kasım 2026)
- Çiko'nun Erdem'in kafasına sabitlendiği hareket kaldırıldı: yumuşak takipli, yavaş döngülü sağ-sol ve yukarı-aşağı serbest uçuş eklendi.
- Çiko önde uçarken Erdem'in ön katmanında, arkaya geçtiğinde arka katmanda çizilir. Sadece yanında değil, önünden ve arkasından geçebilir.
- Çiko yön değiştirebilir ve kanat çırpışına ilave hafif kanat hareketi ve yatış eklendi; gövdesi yatay esnetilmez.
- İncele balonu, Çiko'ya çok yaklaştığında yana/aşağı taşınır.
- Erdem'in yürüyüş kare değişimi yavaşlatıldı, yön dönüşünde küçük ağırlık aktarma ve zıplamada kalkış/yükselme/tepe/iniş ayrımı eklendi.
- Kaydedilmiş oyun ilerlemesi korunur.

**Animasyon notu:** Erdem'in mevcut 6 kaynak yürüyüş resmi tek bacak ağırlıklı olduğundan doğal karşıt bacak ve kol hareketinin tam çözümü için gerçek ikinci adım görselleri gerekir. Bu sürüm mevcut görsellerin çizim ve zamanlamasını iyileştirir.



## v49 (13 Kasım 2026)
- Erdem'in yürüyüşü 12 adımlık sağ-sol bacak döngüsüne dönüştürüldü (alt gövde ikinci yarım döngüde karşıt pozda çizilir).
- Yürüme karelerinin ayak uçları ortak zemin çizgisine hizalandı; fazladan yapay yukarı-aşağı sallanma kaldırıldı.
- Yön değiştirmede kısa yavaşlama/dönüş geçişi eklendi; karakteri yatay sıkıştırmadan çevrilir.
- Çiko'nun baş üzerindeki yatay konumu sabitlendi. Yöne göre sağ-sol ters çevrilmesi kaldırıldı.
- Kanat hareketleri ileri-geri kare sıralamasıyla yumuşatıldı, hareket hızı düşürüldü.
- Önceki kullanıcı ilerlemesi ve v46 mobil üst ekran düzeni korunmuştur.

Not: Bunlar mevcut 2B sprite'larla uygulanan hareket düzeltmeleridir; yeni 3B rig veya elle çizilmiş karşıt kol pozları içermez.



## v48 (13 Kasım 2026)
- Çiko'nun yerleşimi Erdem'in başının tam üstüne sabitlendi; yatay takip gecikmesi ve yana kaçma kaldırıldı.
- Yürüyüş, yön değiştirme ve zıplama sırasında baş üstü mesafesi korunuyor; yalnızca hafif uçuş salınımı var.
- Yerel oyun ilerlemesi ve önceki animasyon/kontrol düzenlemeleri korundu.


## v47 (13 Kasım 2026)
- Erdem'in farklı pozlarına uygulanan değişken kırpma alanları kaldırıldı; altı yürüyüş karesi ortak 220 × 343 piksel kaynak çerçevesiyle çiziliyor.
- Yatay sıkışma/genişleme sorununun ana nedeni giderildi; kafa ve gövde aynı ölçekte kalıyor, yalnızca uzuvların pozları değişiyor.
- Çiko'nun altı kanat karesi de ortak sabit kaynak çerçevesiyle çiziliyor.
- v46'daki yavaşlatılmış yürüyüş ve okunabilir mobil üst bilgi alanları korundu.


Dedenin Evi için 100% ücretsiz, tek HTML mobil keşif prototipi.

## v46 (13 Kasım 2026)
- Mobil ekranda üst bilgi ve yönlendirme alanları güvenli bölgeye indirildi, kontrastları artırıldı.
- Erdem'in altı kareli yürüyüş döngüsü yaklaşık 22'den 8 kare değişimi/saniyeye düşürüldü (252 birim/sn hızda).
- Yürüme, zıplama ve yere inişte yatay esneme kaldırılarak karakterin genişliği sabitlendi.
- Çiko ve önceki oyun ilerlemesi sistemi korundu.

## Önceki v41 yenilikleri
- Erdem'in başlangıcı çiçekli ön plandan toprak yola alındı; ayak hizası güncellendi
- Konuşma portresinde tam boy sprite yerine yüz kadrajı kullanıldı
- Erdem ve Çiko için 6 ana poz + 6 ara hareket pozu: 12 karelik animasyon döngüsü
- Dokunmatik/yön tuşlarına yumuşak hızlanma ve yavaşlama
- Çiko'nun takip hareketinde yay-sönümleme, yumuşak dönüş ve uçuş yönü
- Doğal, kısa açılış konuşmaları ve kanıtlara dayalı araştırma metinleri
- İlk gözlemler ve açık çalışma odası, sabit not zinciri olmadan serbestçe keşfedilebilir

Yerel kayıt anahtarı **mathverse-v40-investigation** aynıdır. v40 ilerlemesi v41'de kullanılmaya devam edilir.

**Pilot uyarısı:** Öğretmen onayındaki matematik soruları henüz oyun içine alınmamıştır. Animasyonlar yeniden üretilmiş 12 karelik 2D hareketlerdir; tam 3D karakter rig animasyonları değildir.

https://chnbcc1.github.io/mtkvrn/deneme-v36/

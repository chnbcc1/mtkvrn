# Matematik Evreni – Erdem ve Çiko (v52 deneme)

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

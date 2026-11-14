# Orman Patikası v63 — 21 Engellik Soru Havuzu

## Kapsam
- 9. sınıf matematik **MAT.9.1.1** (üslü ve köklü gösterimler).
- 20 mevcut engelin yanına **F21: Üslü-Köklü Gösterim Geçidi** eklendi.
- Planlanan oynama sırası: F01–F14 → F21 → F15–F20 (gösterim eşleştirme, aynalı tünelden önce).
- Her engel için **10 kolay + 10 orta + 10 zor = 30** ayrı soru; toplam **630** soru.
- 630 soruluk kaynak JSON, tekrar algoritması ve otomatik kontrol dosyaları bu geliştirme görüşmesinde ayrı bir ZIP paketi olarak üretildi. **Bu depodaki oynanabilir orman sahnelerine henüz bağlanmadılar.**

## F21: Üslü-Köklü Gösterim Geçidi
Erdem ve Çiko, bir orman yarığının önünde dörder taşlık iki sıra ile karşılaşır. Bir sırada üslü gösterimler, diğerinde köklü veya sayısal eşdeğerler bulunur.

Örnek:
- 2^(1/2) ↔ √2
- 3^(3/2) ↔ 3√3
- 8^(2/3) ↔ 4
- 16^(3/4) ↔ 8

Öğrenci dört çifti eşler **ve en az iki eşdeğerliğin ara işlemini gösterir**. Hesap yapmadan taşları deneyerek geçiş yapılamaz. Dört doğru eşleştirme sonrası platformlar yükselir.

## Soru seçimi ve tekrar
- Zorluk oyun başında bir kez seçilir; engelin üzerinde değiştirilmez.
- Her **engel + zorluk** kombinasyonunda 10 soruluk bağımsız havuz bulunur.
- Yeni bir oynayışta önceki gösterilmiş sorular hariç tutularak rastgele seçim yapılır. Aynı oyun kaldığı yerden açıldığında çözülememiş soru aynı kalır.
- Bir engel tamamlandıktan sonra isteğe bağlı **Benzer soru çöz** açılır. Alıştırma ana engeli değiştirmez ve sorular geçmişte görüldü olarak kaydedilir.
- 10 varyasyonun tamamı kullanıldığında tekrarsızlık matematiksel olarak sürdürülemez; yeni havuz döngüsünde son soru hemen yeniden seçilmez.

## Kabul testleri
1. Her 21 engelin üç zorluk düzeyinde ayrı ayrı 10 özgün soru.
2. Toplam 630 benzersiz soru kimliği.
3. F08 köprüde hesaplama tamamlanmadan tahta deneme/yerleştirme yok.
4. F21'de dört farklı doğru eşleştirme ve iki işlem basamağı şartı.
5. Benzer soru çözümü ana soru çözümünün yerini almıyor.
6. Kullanıcı tekrar oynadığında havuz tükenmedikçe gösterilmiş sorular yinelenmiyor.
7. Var olan **mathverse-v40-investigation** ilerleme kaydı bozulmuyor.
8. iPhone dokunmatik testleri ve soru yanıtı doğrulama uçtan uca yapıldıktan sonra oynanabilir 21-engel sürümü yayımlanır.

Bu belge soru havuzu **uygulama tasarımıdır**, yayımlanmış oynanabilir 21-engel özelliği değildir.

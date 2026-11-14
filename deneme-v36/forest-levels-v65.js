(function(){
"use strict";
const pow=(a,b)=>Math.pow(a,b),rad=(a,b)=>a===1?"√"+b:a+"√"+b;
function enrich(original){
 if(original?.contentVersion==="v66")return original;
 const q={...original,interaction:{...(original.interaction||{})}},i=q.variant||1,d=q.difficulty,h=d==="zor",e=d==="kolay";
 const A=i+2,B=2+i%3,R=[2,3,5,7][i%4],m=2+i%4;
 let p,ans,sol,hint;
 if(e){ 
  // The original easy items remain single-rule, with a targeted clarification of the instruction.
  if(q.obstacleId==="F12")q.prompt+=" Uzunlukların karelerini hesaplayarak karar ver.";
  if(q.obstacleId==="F15"){const a=2+i,b=2+i%3;q.prompt="Eşlenik aynaların üzerindeki ("+a+"+√"+b+") ve ("+a+"−√"+b+") değerlerini çarparsak sonuç kaç olur?";q.correctAnswer=String(a*a-b);q.solution="("+a+"+√"+b+")("+a+"−√"+b+")="+a+"²−"+b+"="+(a*a-b);q.hint="Eşleniklerin çarpımı iki karenin farkıdır.";q.inputType="number";q.interaction={};}
  return q;
 }
 const go=(prompt,answer,solution,help,type)=>{
  q.prompt=prompt;q.correctAnswer=String(answer);q.solution=solution;q.hint=help;q.inputType=type||"number";q.interaction={};
  q.cognitiveSteps=h?3:2;q.difficultyNote=h?"Üç bağlantılı işlem ve muhakeme":"İki bağlantılı işlem";
  return q;
 };
 switch(q.obstacleId){
 case "F01":{
  const start=A,turn=h?4+i%3:2+i%3;
  if(!h){const removed=start*2;return go("Ormandaki "+start+" sarmaşık filizi "+turn+" kez iki katına çıkıyor. Ardından "+removed+" filiz kuruyor. Sağlam kalan filiz sayısı kaçtır?",start*pow(2,turn)-removed,start+"×2"+sup(turn)+"−"+removed+"="+(start*pow(2,turn)-removed),"Önce üslü büyümeyi bul, sonra kuruyan filizleri çıkar.");}
  const after=start*pow(2,turn),removed=after/4,answer=(after-removed)*2;
  return go("Başlangıçta "+start+" sarmaşık filizi var. "+turn+" büyüme döngüsünde her seferinde iki katına çıkıyor. Filizlerin dörtte biri kuruyor; kalanlar bir kez daha iki katına çıkıyor. Son sayı kaçtır?",answer,start+"×2"+sup(turn)+"="+after+"; dörtte biri "+removed+" kurur; ("+after+"−"+removed+")×2="+answer,"İlk büyümeyi hesapla, kalan dörtte üçünü bul, son kez ikiyle çarp.");
 }
 case "F02":{
  const x=2+i%2,a=2+i%4,b=2+(i+1)%3,c=1+i%2,total=pow(x,a+b);
  if(!h)return go("Geçitte "+x+sup(a)+" sıra, her sırada "+x+sup(b)+" ışıklı taş var. "+pow(x,c)+" taş sönüyor. Kaç taş yanık kalır?",total-pow(x,c),x+sup(a)+"×"+x+sup(b)+"="+x+sup(a+b)+"="+total+"; "+total+"−"+pow(x,c)+"="+(total-pow(x,c)),"Önce aynı tabanlı kuvvetleri çarp, sonra sönenleri çıkar.");
  const extra=pow(x,a),broken=pow(x,c),res=total+extra-broken;
  return go("Geçitte "+x+sup(a)+" sıra ve her sırada "+x+sup(b)+" taş var. Girişe ayrıca "+x+sup(a)+" taş ekleniyor, arızada "+x+sup(c)+" taş sönüyor. Son durumda yanan taş sayısı kaçtır?",res,x+sup(a+b)+"+"+x+sup(a)+"−"+x+sup(c)+"="+res,"Kuvvetlerin çarpımını toplayıp eklenen ve sönen taşları sırayla değerlendir.");
 }
 case "F03":{
  const x=2+i%2,a=5+i,b=2+i%2,total=pow(x,a-b);
  if(!h)return go("Sis türbininin enerjisi "+x+sup(a)+" birimdir. Her darbe "+x+sup(b)+" birim harcar. İlk iki darbeden sonra kaç darbe daha yapılabilir?",total-2,x+sup(a)+"÷"+x+sup(b)+"="+total+"; "+total+"−2="+(total-2),"Toplam darbe sayısını üsleri çıkararak bul, kullanılan iki darbeyi düş.");
  const wasted=pow(x,a-2),usable=pow(x,a)-wasted,answer=usable/pow(x,b);
  return go("Türbin "+x+sup(a)+" enerjiyle başlıyor. Enerjinin "+pow(x,a-2)+" birimi boşa harcanıyor. Kalan her "+x+sup(b)+" enerji birimi bir darbeyi çalıştırıyor. Kaç tam darbe yapılabilir?",answer,"("+pow(x,a)+"−"+wasted+")÷"+pow(x,b)+"="+answer,"Önce kaybı çıkar, ardından darbe başına enerjiye böl.");
 }
 case "F04":{
  const x=2+i%2,stages=3+i%2,arms=2+i%2,total=pow(x,stages*arms),closed=i+1;
  if(!h)return go("Işık geçidinde "+stages+" ardışık aşamanın her birinde "+x+sup(arms)+" seçenek bulunuyor. Oluşan yollardan "+closed+" tanesi kapanıyor. Açık yol sayısı kaçtır?",total-closed,"("+x+sup(arms)+")"+sup(stages)+"−"+closed+"="+total+"−"+closed+"="+(total-closed),"Kuvvetin kuvvetinde üsleri çarp, ardından kapanan yolları çıkar.");
  const extra=pow(x,stages*arms),removed=i+1,ans=2*extra-removed;
  return go("Geçitte birbirinin aynısı iki kanat var. Her kanatta "+stages+" aşama bulunuyor ve her aşama "+x+sup(arms)+" seçeneğe ayrılıyor. Kanatların toplam "+removed+" yolu kapatılıyor. Kaç açık yol kalır?",ans,"2×("+x+sup(arms)+")"+sup(stages)+"−"+removed+"="+ans,"Önce bir kanadın tüm yol sayısını hesapla, iki kanadı topla ve kapananları çıkar.");
 }
 case "F05":{
  const base=2+i%2,init=pow(base,3+i%3)*(i+1),neg=2,plus=3,net=init*pow(base,plus-neg);
  if(!h)return go("Fener "+init+" enerjiyle yanıyor. İlk kristal enerjiyi "+base+sup(-neg)+" ile, ikinci kristal "+base+sup(plus)+" ile çarpıyor. Son enerji kaçtır?",net,init+"×"+base+sup(-neg)+"×"+base+sup(plus)+"="+net,"Negatif üs bölme etkisi yapar; iki katsayının çarpımını hesapla.");
  const extra=pow(base,2),result=init*pow(base,-3)*pow(base,4)-extra;
  return go("Fenerin ilk enerjisi "+init+" birimdir. Art arda "+base+sup(-3)+" ve "+base+sup(4)+" etkileri uygulanıyor. Ardından "+extra+" birim enerji kayboluyor. Son enerji kaçtır?",result,init+"×"+base+sup(-3)+"×"+base+sup(4)+"−"+extra+"="+result,"Üslerin toplamını bul, başlangıç enerjisiyle çarp ve kaybı çıkar.");
 }
 case "F06":{
  const x=2+i%3,k=2+i%4,val=pow(x,k);
  if(!h)return go("Mantar adalarında her nesilde mantar sayısı "+x+" katına çıkıyor. Başlangıçta 2 mantar bulunuyor. "+k+" nesilden sonra mantarların "+val+" tanesi toplanıyor. Kaç mantar kalır?",val,"2×"+x+sup(k)+"−"+val+"="+val,"Önce geometrik artışı hesapla; toplananları çıkar.");
  const first=pow(x,k),second=pow(x,k+1),taken=first,remaining=first+second-taken;
  return go("A adasında başlangıçta 1, B adasında başlangıçta "+x+" mantar var. Her nesilde ikisi de "+x+" kat büyüyor. "+k+" nesil sonra A adasındaki mantarların tamamı toplanıyor. Geriye kaç mantar kalır?",remaining,"A="+first+", B="+second+"; A toplanınca "+remaining+" kalır.","İki adanın başlangıçları farklı; iki büyümeyi ayrı hesapla.");
 }
 case "F07":{
  const a=2+i,b=1+i%3,r=R;
  if(!h)return go("Yan yana duran iki ayrı kare taşın alanları "+(a*a*r)+" m² ve "+(b*b*r)+" m²'dir. İki karenin çevre uzunlukları toplamını en sade köklü biçimde bul.",rad(4*(a+b),r),"Kenarlar "+rad(a,r)+" ve "+rad(b,r)+" m; çevrelerin toplamı "+rad(4*(a+b),r)+" m.","İlk iş her karenin bir kenarını alanın karekökünden bul.","radical");
  const c=b+1,ans=4*a+3*c;
  return go("Ormanda alanı "+(a*a*r)+" m² olan kare platformun dört kenarı ve alanı "+(c*c*r)+" m² olan diğer platformun yalnız üç kenarı ışık şeridiyle kaplanacak. Toplam şerit uzunluğu kaç metredir? Köklü biçimde yaz.",rad(ans,r),"Kenarlar "+rad(a,r)+" ve "+rad(c,r)+"; 4×"+rad(a,r)+"+3×"+rad(c,r)+"="+rad(ans,r),"Önce iki alanın karekökünü sadeleştir; gerekli kenar sayılarını çarpıp benzer kökleri topla.","radical");
 }
 case "F08":{
  q.prompt = (h?"ZOR – Dört kökü önce ayrı ayrı sadeleştir. Sonra açıklığa uyan iki tahtayı matematiksel olarak belirle. ":"ORTA – Dört kökü sadeleştirdikten sonra uygun tahta çiftini seç. ")+q.prompt;
  q.cognitiveSteps=h?3:2;return q;
 }
 case "F09":{
  const a=5+i,b=2+i%3,c=1+i%2,r=R;
  if(!h)return go("Makarada "+rad(a,r)+" m halat vardı. "+rad(b,r)+" m kullanıldı. Sonra depodan "+rad(c,r)+" m daha eklendi. Son uzunluk kaç metredir?",rad(a-b+c,r),rad(a,r)+"−"+rad(b,r)+"+"+rad(c,r)+"="+rad(a-b+c,r),"Benzer köklerin katsayılarıyla işlem yap; kök içini değiştirme.","radical");
  const d=1+(i+1)%3;
  return go("Kopmuş halatın "+rad(a,r)+" metresi kullanıma hazır. Önce "+rad(b,r)+" m kesiliyor, sonra "+rad(c,r)+" m ekleniyor, son olarak "+rad(d,r)+" m yeniden kesiliyor. Kalanı en sade köklü biçimde yaz.",rad(a-b+c-d,r),rad(a,r)+"−"+rad(b,r)+"+"+rad(c,r)+"−"+rad(d,r)+"="+rad(a-b+c-d,r),"Bütün kökler aynı türde; önce işaretleri, sonra katsayıları hesapla.","radical");
 }
 case "F10":{
  const a=2+i%4,b=3+i%3,r=R,area=a*b*r;
  if(!h)return go("Dikdörtgen platformun iki kenarı √"+(a*a*r)+" m ve √"+(b*b*r)+" m. Bu alanın "+r+" m²'si söndürülüyor. Aydınlık kalan alan kaç m² olur?",area-r,rad(a,r)+"×"+rad(b,r)+"="+area+"; "+area+"−"+r+"="+(area-r),"Köklerin çarpımını hesaplayıp kapatılan alanı çıkar.");
  const cut=2*r,more=r*(a+1);
  return go("Kenarları √"+(a*a*r)+" m ve √"+(b*b*r)+" m olan dikdörtgen platforma "+more+" m² ekleniyor, ardından "+cut+" m² söndürülüyor. Son aydınlık alan kaç m² olur?",area+more-cut,rad(a,r)+"×"+rad(b,r)+"="+area+"; "+area+"+"+more+"−"+cut+"="+(area+more-cut),"Köklü kenarları sadeleştir, dikdörtgen alanını bul, eklenen ve çıkarılanı işle.");
 }
 case "F11":{
  const a=6+i,b=1+i%3,r=R;
  if(!h)return go("Şelale deposunda √"+(a*a*r)+" litre su var; her kanal √"+r+" litre alıyor. Kanallardan "+b+" tanesi arızalıysa kullanılabilir kanal sayısı kaçtır?",a-b,"√"+(a*a*r)+"÷√"+r+"−"+b+"="+(a-b),"Depoyu kanal kapasitesine böl; arızalı kanalları çıkar.");
  const ext=2+i%2,broken=1+i%2;
  return go("Depoda √"+(a*a*r)+" litre, yedek depoda √"+(ext*ext*r)+" litre su bulunuyor. Her kanal √"+r+" litre taşıyor. "+broken+" kanal kapanırsa tam kapasite çalışan kanal sayısı kaç olur?",a+ext-broken,"("+rad(a,r)+"+"+rad(ext,r)+")÷√"+r+"−"+broken+"="+(a+ext-broken),"İki depoyu önce aynı kök türünde birleştirip kapasiteye böl.");
 }
 case "F12":{
  const a=3+i,b=2+i,ri=2,s=3;
  if(!h){const left=a*a*ri,right=b*b*s;return go("Sol yol "+rad(a,ri)+" km, sağ yol "+rad(b,s)+" km'dir. Önce iki uzunluğun karesini hesapla, sonra kısa yolu seç.",left<right?"Sol":"Sağ","Sol²="+left+" ve Sağ²="+right+"; "+(left<right?"sol":"sağ")+" yol daha kısadır.","Pozitif uzunlukları karşılaştırırken karelerini kullan.","choice-direction");}
  const c=a+b+(i%2===0?1:-1),sum=a+b,answer=sum<c?"Sol":"Sağ";
  return go("Sol yolda önce "+rad(a,ri)+" km, sonra "+rad(b,ri)+" km yürünür. Sağ yolun tamamı "+rad(c,ri)+" km'dir. Toplamları sadeleştirip hangi yolun daha kısa olduğunu belirle.",answer,"Sol="+rad(sum,ri)+", sağ="+rad(c,ri)+"; kısa yol "+answer.toLowerCase()+".","Aynı köklü uzunlukları topla; sonra katsayıları karşılaştır.","choice-direction");
 }
 case "F13":{
  const a=4+i,b=a-2;
  if(!h)return go("Bir küpün hacmi "+pow(a,3)+" dm³, diğerinin "+pow(b,3)+" dm³'tür. Kenar uzunluklarının farkı kaç desimetredir?",2,"∛"+pow(a,3)+"−∛"+pow(b,3)+"="+a+"−"+b+"=2","Önce iki küpün kenarlarını küpkök alarak hesapla.");
  return go("Bir küpün hacmi "+pow(a,3)+" dm³, diğerinin "+pow(b,3)+" dm³'tür. Birinci küpün hacmi 8 katına çıkarılıyor. Yeni kenar ile ikinci küpün kenarı arasındaki fark kaç desimetre olur?",2*a-b,"∛(8×"+pow(a,3)+")−∛"+pow(b,3)+"="+2*a+"−"+b+"="+(2*a-b),"Hacim 8 katına çıkarsa kenar 2 katına çıkar; ikinci küpün kenarını çıkar.");
 }
 case "F14":{
  const a=2+i;
  if(!h)return go("Dişli çarkın dönüş kodu ("+a+sup(2)+")"+sup("3/2")+" şeklinde. Kodun değeri bulunuyor ve "+a+" kademe çıkarılıyor. Kaç kademe kalır?",pow(a,3)-a,"("+a+sup(2)+")"+sup("3/2")+"="+a+sup(3)+"="+pow(a,3)+"; "+pow(a,3)+"−"+a+"="+(pow(a,3)-a),"Önce kesirli üssü karekökle ilişkilendir; ardından çıkar.");
  return go("Dişli çarkın ayarı ("+a+sup(3)+")"+sup("2/3")+"×"+a+sup(-1)+"×"+a+sup(2)+" olarak gösteriliyor. Kaç kademe çalışır?",pow(a,3),"("+a+sup(3)+")"+sup("2/3")+"="+a+sup(2)+"; "+a+sup("2−1+2")+"="+a+sup(3)+"="+pow(a,3),"Önce küpkök ve kareyi uygula, sonra negatif üssü diğer üslerle birleştir.");
 }
 case "F15":{
  const a=4+i,b=2+i%3,c=1+i%4;
  if(!h)return go("Eşlenik aynalarda ("+a+"+√"+b+")("+a+"−√"+b+") işlemi yapılıyor. Sonuca "+c+" eklenirse sayı kaç olur?",a*a-b+c,a+sup(2)+"−"+b+"+"+c+"="+(a*a-b+c),"Eşleniklerin çarpımı karelerin farkıdır.");
  const t=a-2;
  return go("Büyük aynada ("+a+"+√"+b+")("+a+"−√"+b+"), küçük aynada ("+t+"+√"+b+")("+t+"−√"+b+") değeri var. Büyükten küçüğü çıkarırsan kaç elde edilir?",a*a-t*t,"("+a+sup(2)+"−"+b+")−("+t+sup(2)+"−"+b+")="+(a*a-t*t),"İki eşlenik çarpımı ayrı ayrı sadeleştir; sonra farklarını al.");
 }
 case "F16":{
  const n=i+1,a=3*n,b=4*n,right=7*n,left=5*n;
  if(!h)return go("Yazıtta √("+pow(a,2)+"+"+pow(b,2)+")=√"+pow(a,2)+"+√"+pow(b,2)+" yazıyor. Sağ taraf, sol taraftan kaç fazladır?",right-left,"Sol="+left+", sağ="+right+"; fark "+(right-left)+".","Karekök, toplama işlemi üzerine dağıtılmaz.");
  const added=n+2;
  return go("Yazıttaki √("+pow(a,2)+"+"+pow(b,2)+")=√"+pow(a,2)+"+√"+pow(b,2)+" iddiasını incele. Yanlış sağ taraftan "+added+" birim daha eksiltilse bile iki taraf arasındaki farkın mutlak değeri kaç birim olur?",Math.abs(right-added-left),"Sol="+left+", sağ="+right+"; sağdan "+added+" çıkarılırsa "+(right-added)+" olur; iki tarafın farkı "+Math.abs(right-added-left)+".","Sol ve sağı ayrı hesaplayıp yapılan düzeltmeden sonra kalan farkı bul.");
 }
 case "F17":{
  const a=2+i%3,b=3+i%4,expo=3+i%2,raw=a*b;
  const fmt=(x,y)=>sci(x*Math.pow(10,y));
  if(!h){const val=raw*Math.pow(10,2-expo)/2;return go("Her yaprakta "+a+"×10"+sup(-expo)+" g toz var. "+b+"×10"+sup(2)+" yaprak toplanıyor. Toplam tozun yarısı deneyde kullanılıyor. Kalan kütle hangi bilimsel gösterimdir?",sci(val),"Toplam "+sci(2*val)+" g; yarısı "+sci(val)+" g kalır.","Önce bilimsel gösterimle çarp, sonra ikiye böl.","scientific");}
  const val=a*b*Math.pow(10,2-expo)/4;
  return go("Her yaprakta "+a+"×10"+sup(-expo)+" g mavi toz var. "+b+"×10"+sup(2)+" yaprağın tozu toplanıyor. Tozun dörtte biri dökülüyor; kalan miktar üç eşit deneye paylaştırılıyor. Bir deneyde kaç gram toz bulunur? Bilimsel gösterimle yaz.",sci(val),"Toplam "+sci(4*val)+" g; dörtte üçü korunur, üçe bölününce "+sci(val)+" g kalır.","Önce tozların toplamını hesapla; dörtte üçünü bul ve üçe böl.","scientific");
 }
 case "F18":{
  const a=2+i%4,b=a,ex=6+i%3;
  if(!h)return go("İki istasyonun her biri "+a+"×10"+sup(ex)+" sinyal gönderiyor. Toplam sinyal "+b+"×10"+sup(2)+" kutuya eşit bölünüyor. Her kutuya kaç sinyal düşer? Bilimsel gösterimle yaz.",sci(2*Math.pow(10,ex-2)),"2×"+a+"×10"+sup(ex)+"÷("+b+"×10"+sup(2)+")="+sci(2*Math.pow(10,ex-2)),"İki istasyonu topla, sonra kutu sayısına böl.","scientific");
  return go("Üç tekrarlayıcı, her biri "+a+"×10"+sup(ex)+" sinyal gönderiyor. Sinyallerin üçte biri bozuluyor. Sağlam kalanlar "+b+"×10"+sup(2)+" alıcıya eşit dağıtılıyor. Alıcı başına sinyali bilimsel gösterimle bul.",sci(2*Math.pow(10,ex-2)),"3×"+a+"×10"+sup(ex)+"×(2/3)÷("+b+"×10"+sup(2)+")="+sci(2*Math.pow(10,ex-2)),"Üç katını bul, üçte birini çıkar, sonra alıcılara böl.","scientific");
 }
 case "F19":{
  const side=5+i,area=side*side+2;
  if(!h)return go("Kare platformun alanı "+area+" m². Bir kenarını tam metre uzunluğunda ve kısa gelmeyen bir kirişle kapatacaksın. Kirişe ayrıca 1 m güvenlik payı eklersen toplam kaç metre gerekir?",side+2,side+sup(2)+"<"+area+"<"+(side+1)+sup(2)+"; en kısa kiriş "+(side+1)+" m, payla "+(side+2)+" m.","Alanı ardışık tam kareler arasında bul; üst tam sayıya bir metre ekle.");
  const more=2,answer=side+3;
  return go("Alanı "+area+" m² olan kare platforma kısa gelmeyecek en küçük tam metrelik kiriş seçiliyor. Kirişin her ucuna 1 m destek eklenecek. Toplam destekli uzunluk kaç metredir?",answer,side+sup(2)+"<"+area+"<"+(side+1)+sup(2)+"; "+(side+1)+"+1+1="+answer,"Önce kökten büyük ilk tam sayıyı bul, sonra iki uca destek ekle.");
 }
 case "F20":{
  const a=2+i,b=3+i%4,c=1+i%3,r=R;
  if(!h)return go("Gözlemevi kapısına "+rad(a,r)+", "+rad(b,r)+" ve "+rad(c,r)+" metrelik üç kablo takılıyor. Bağlantı sırasında "+rad(c,r)+" m kablo artıyor. Kullanılan uzunluğu sade köklü biçimde yaz.",rad(a+b,r),rad(a,r)+"+"+rad(b,r)+"+"+rad(c,r)+"−"+rad(c,r)+"="+rad(a+b,r),"Önce aynı kök türündeki üç kabloyu topla, sonra artan kabloyu çıkar.","radical");
  return go("Üç kapı halkasında √"+(a*a*r)+", √"+(b*b*r)+" ve √"+(c*c*r)+" m kablo gerekiyor. Önce hepsi takılıyor, sonra "+rad(c+1,r)+" m'si çıkarılıp bir halka tamamen yenileniyor. Geriye kaç metre kablo kalır?",rad(a+b-1,r),rad(a,r)+"+"+rad(b,r)+"+"+rad(c,r)+"−"+rad(c+1,r)+"="+rad(a+b-1,r),"Önce her kökü sadeleştir, üç kabloyu topla, çıkarılanı düş.","radical");
 }
 case "F21":{
  q.prompt=(h?"ZOR – Negatif ve kesirli üsleri köklü gösterime dönüştür; dört farklı eşleştirme yap. ":"ORTA – Kesirli üsleri kök derecesi ve kuvvet ile çöz; dört eşleştirme yap. ")+q.prompt;
  q.cognitiveSteps=h?3:2;return q;
 }
 }
 return q;
}
function sup(exp){return "^("+String(exp)+")"}
function sci(num){if(!num)return "0";let power=Math.floor(Math.log10(Math.abs(num))+1e-10),mant=num/Math.pow(10,power);if(mant>=10-1e-9){mant/=10;power++}mant=Math.round(mant*1e8)/1e8;return String(mant).replace(".",",")+"×10^"+power}
window.FOREST_LEVELS_V65=enrich;
})();
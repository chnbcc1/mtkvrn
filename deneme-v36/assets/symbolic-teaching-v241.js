/* v241 — source-grounded symbolic teaching and numbered steps. */
(function(root){
"use strict";
const digits="⁰¹²³⁴⁵⁶⁷⁸⁹", sup=n=>String(n).replace(/[-0-9]/g,x=>x==="-"?"⁻":digits[Number(x)]);
const pow=(b,e)=>String(b)+sup(e);
const unsup=s=>Number([...s].map(c=>c==="⁻"?"-":digits.indexOf(c)).join(""));
const parse=s=>{const m=String(s).match(/^\s*(\d+)([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?:\s|$)/u);return m?[+m[1],unsup(m[2])]:null};
const expOf=(b,n)=>{if(!Number.isInteger(n)||n<1||b<2)return null;let e=0;while(n>1&&n%b===0){n/=b;e++}return n===1?e:null};
const baseOf=(b)=>{for(let x=2;x<b;x++){const e=expOf(x,b);if(e!==null)return [x,e]}return [b,1]};
const quotientRule="Tabanları aynı olan üslü sayılar bölünürken üsleri çıkarılır.";
const productRule="Tabanları aynı olan üslü sayılar çarpılırken üsleri toplanır.";
const powerRule="Bir üslü sayının kuvveti alınırken üsler çarpılır.";
const rootRule="Kökün derecesine uygun tam kuvvet çarpanını ayır. Aynı derecedeki köklerde çarpım ve bölüm kök içinde yapılabilir.";
const divisor=s=>{s=String(s).replace(/\s/g,"");if(/^÷\d+$/.test(s))return +s.slice(1);if(/^1\/\d+$/.test(s))return +s.slice(2);const m=s.match(/^×(\d+)⁻([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/u);if(m)return (+m[1])**unsup(m[2]);throw Error("F03 oran "+s)};
function divide(b,e,d){
 let k=expOf(b,d),prefix=[];
 if(k===null){const [x,m]=baseOf(b);k=expOf(x,d);if(k===null)throw Error("Ortak taban yok "+b+"/"+d);prefix=[pow(b,e)+" = "+pow(x,m*e)];b=x;e*=m;}
 return {b,e:e-k,rows:[...prefix,pow(b,e)+"/"+pow(b,k)+" = "+b+"^("+e+"−"+k+")",b+"^("+e+"−"+k+") = "+pow(b,e-k)],den:d===b?null:String(d)+" = "+pow(b,k)};
}
function f03(q){
 const l=q.visual.labels.map(x=>x.value),a=q.visual.labels.map(x=>x.anchor),steps=[],first=[quotientRule,productRule],second=[quotientRule];let result;
 const divStep=(b,e,d,title)=>{const z=divide(b,e,d);return {b:z.b,e:z.e,text:[title+":",...(z.den?[z.den]:[]),...z.rows].join("\n")}};
 if(a[0]==="A borusu"){
  const [b,e]=parse(l[0]),[c,f]=parse(l[1]),x=divStep(b,e,divisor(l[2]),"A borusundan geçen sis"),y=divStep(c,f,divisor(l[3]),"B borusundan geçen sis");result=x.b**x.e+y.b**y.e;
  first.push("A ve B boruları bağımsızdır. Her kolda aynı tabana getirip üsleri çıkar, en son iki kolu topla.");
  second.push(x.text,"B kolundaki oranı aynı kuralla uygula ve iki sonucu topla.");
  steps.push(x.text,y.text,"İki kolun toplamı:\n"+pow(x.b,x.e)+" + "+pow(y.b,y.e)+" = "+(x.b**x.e)+" + "+(y.b**y.e)+"\n"+(x.b**x.e)+" + "+(y.b**y.e)+" = "+result);
 }else if(a[1]==="ayrılan"){
  const [b,e]=parse(l[0]),x=divStep(b,e,divisor(l[1]),"Yan kola ayrılan sis");result=b**e-x.b**x.e;
  first.push("Yan kola ayrılan miktarı üslü bölme ile bul. Ana hatta kalan için başlangıçtan çıkar; mümkünse ortak kuvveti ayır.");
  second.push(x.text,"Ana hatta kalan miktarı başlangıçtan bu kuvveti çıkararak bul.");
  steps.push(x.text);
  if(b===x.b){steps.push("Ortak kuvveti parantezine alalım:\n"+pow(b,e)+" − "+pow(b,x.e)+" = "+pow(b,x.e)+" · ("+pow(b,e-x.e)+" − 1)\n"+pow(b,x.e)+" · ("+pow(b,e-x.e)+" − 1) = "+pow(b,x.e)+" · "+(b**(e-x.e)-1));}
  steps.push("Son değeri hesaplayalım:\n"+(b**e)+" − "+(x.b**x.e)+" = "+result);
 }else{
  let [b,e]=parse(l[0]);const initial=pow(b,e);
  const ds=a[1]==="filtre_sayısı"?Array(Number(l[1])).fill(divisor(l[2])):l.slice(1).map(divisor);
  first.push("Her aşamada yalnız o aşamaya ulaşan sis kullanılır. Bölünen sayıyı ve böleni aynı tabanın kuvveti olarak yaz.");
  const x=divide(b,e,ds[0]);if(ds.length>1)second.push(divStep(b,e,ds[0],"İlk geçiş").text,"Kalan geçişlerde de bölenlerin üslerini sırayla çıkar. Son kuvvetin değerini en son hesapla.");
  else second.push("Bölme işlemini aynı tabanda kur:\n"+pow(x.b,x.e+(expOf(x.b,ds[0])||0))+"/"+pow(x.b,expOf(x.b,ds[0])),"Payın üssünden paydanın üssünü çıkar. Sonucu kendin hesapla.");
  steps.push("Başlangıç miktarını üslü biçimde tutalım:\n"+initial);
  for(let i=0;i<ds.length;i++){const title=a[0]==="çıkış"?"Gözlem tüpüne aktarılan sis":i===ds.length-1&&/gözlem|tüp/.test(a.at(-1))?"Son aktarım":(i+1)+". geçiş";const z=divStep(b,e,ds[i],title);steps.push(z.text);b=z.b;e=z.e;}
  result=b**e;steps.push("Son kuvvetin sayısal değerini bulalım:\n"+pow(b,e)+" = "+result);
 }
 if(String(result)!==q.correctAnswer)throw Error(q.id+" hesap "+result+" ≠ "+q.correctAnswer);
 return {first,second,solution:[quotientRule, ...steps,"Sonuç: "+result+" birim sis."]};
}
function algebra(q){
 const l=q.visual.labels.map(x=>x.value),total=Number(String(l.at(-1)).match(/\d+/)?.[0]);
 if(q.obstacleId==="F06"&&l[0].includes("ⁿ")){
  const v=total*2/11,ans=2*v;if(String(ans)!==q.correctAnswer)throw Error(q.id);
  return {first:[productRule,quotientRule,"Üç adanın toplamını yaz. Ortak çarpan 2ⁿ olsun."],second:["B adasını ve C adasını 2ⁿ cinsinden yaz:\n2ⁿ⁺¹ = 2ⁿ · 2\n2ⁿ⁻¹ = 2ⁿ/2","Üç terimi 2ⁿ parantezine alıp denklemi çöz."],solution:["Üç adanın toplamı:\n3 · 2ⁿ + 2ⁿ⁺¹ + 2ⁿ⁻¹ = "+total,productRule+"\n2ⁿ⁺¹ = 2ⁿ · 2",quotientRule+"\n2ⁿ⁻¹ = 2ⁿ/2","Ortak çarpanı ayır:\n2ⁿ · (3 + 2 + 1/2) = "+total+"\n2ⁿ · (11/2) = "+total,"Her iki tarafı 2/11 ile çarp:\n2ⁿ = "+total+" · 2/11\n2ⁿ = "+v,"B adasının miktarı:\n2ⁿ⁺¹ = 2ⁿ · 2\n"+v+" · 2 = "+ans]};
 }
 if(q.obstacleId==="F13"&&l[0].includes("ⁿ")){
  const v=total*2/15,ans=4*v;if(String(ans)!==q.correctAnswer)throw Error(q.id);
  return {first:[productRule,quotientRule,"Dört yüzün toplamında ortak 2ⁿ çarpanını ayır. En büyük üs en çok işareti gösterir."],second:["Kuvvetleri 2ⁿ cinsinden aç:\n2ⁿ⁻¹ = 2ⁿ/2\n2ⁿ⁺¹ = 2ⁿ · 2\n2ⁿ⁺² = 2ⁿ · 4","Toplamı ortak çarpanla yaz ve 2ⁿ değerini bul."],solution:[productRule,quotientRule,"Dört yüzün toplamı:\n2ⁿ⁻¹ + 2ⁿ + 2ⁿ⁺¹ + 2ⁿ⁺² = "+total,"Ortak çarpanı ayır:\n2ⁿ · (1/2 + 1 + 2 + 4) = "+total+"\n2ⁿ · (15/2) = "+total,"Her iki tarafı 2/15 ile çarp:\n2ⁿ = "+total+" · 2/15\n2ⁿ = "+v,"En büyük kuvvet:\n2ⁿ⁺² = 2ⁿ · 4\n"+v+" · 4 = "+ans]};
 }
 return null;
}
function exactPower(q){
 const l=q.visual.labels.map(x=>String(x.value)),topic=q.topic.toLocaleLowerCase("tr");
 let expr=null,answerMode="value";
 if(q.obstacleId==="F14"&&q.difficulty==="zor"){expr=l[0];answerMode=q.id==="F14-Z-01"?"slot":"exponent";}
 else if(q.obstacleId==="F14"&&q.difficulty==="orta"){
  if(l[0].includes("÷")||l[0].includes("×")||l[0].includes("·"))expr=l[0];else if(parse(l[0])&&/^\d+$/.test(l[1]))expr=l[0]+" ÷ "+l[1];
  answerMode=/^[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+$/.test(q.correctAnswer)?"exponent":"auto";
 }else if(q.obstacleId==="F09"&&q.difficulty==="kolay"&&/bölme/.test(topic))expr=l[0].replace(/\s*m$/,"")+" ÷ "+l[1];
 else if(q.obstacleId==="F05"&&(/sıfırıncı|üslerin toplamı|negatif üs ile çarpma/.test(topic)))expr=l[0]+" · "+l[1];
 else if(q.obstacleId==="F17"&&q.difficulty==="kolay"&&/üs kurallarıyla çarpma/.test(topic))expr=l[0]+" · "+l[1].replace(/\s*g$/,"");
 else if(q.obstacleId==="F10"&&q.difficulty==="kolay"&&/dizilim/.test(topic))expr=l[0]+" · "+l[1];
 if(!expr)return null;
 const s=expr.replace(/\s/g,"").replace(/[()]/g,"").replace(/×/g,"·");
 if(!/^\d+[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*(?:[·÷]\d+[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)+$/u.test(s))return null;
 const terms=[...s.matchAll(/([·÷]?)(\d+)([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)/gu)].map(m=>({op:m[1],b:+m[2],e:m[3]?unsup(m[3]):1}));
 let base=baseOf(terms[0].b)[0];if(!terms.every(t=>expOf(base,t.b)!==null))return null;
 const changes=terms.map(t=>({...t,k:expOf(base,t.b)*t.e})),exponent=changes.reduce((v,t)=>v+(t.op==="÷"?-t.k:t.k),0),v=base**exponent;
 const ans=String(q.correctAnswer),frac=exponent<0?"1/"+base**(-exponent):String(v);
 if(answerMode==="slot"){const slot=l.find(x=>x.startsWith(ans.split(".")[0]+":"));const p=slot&&parse(slot.split(":")[1].trim());if(!p||p[0]**p[1]!==v)return null;}
 else if(answerMode==="exponent"){if(ans!==String(exponent))return null;}
 else if(![String(v),frac,pow(base,exponent),String(exponent)].includes(ans)){const equivalent=parse(ans);if(!equivalent||equivalent[0]**equivalent[1]!==v)return null;}
 const normalized=changes.map(t=>(t.op?" "+t.op+" ":"")+pow(base,t.k)).join("");
 const arithmetic=changes.map(t=>(t.op?(t.op==="÷"?"−":"+"):"")+(t.k<0?"("+t.k+")":t.k)).join("");
 const conversions=changes.filter(t=>t.b!==base).map(t=>pow(t.b,t.e)+" = "+pow(base,t.k));
 const final=answerMode==="exponent"?"İstenen üs: "+exponent:answerMode==="slot"?"Bu değer "+ans+" ile eşleşir.":parse(ans)&&ans!==pow(base,exponent)?pow(base,exponent)+" = "+ans:pow(base,exponent)+" = "+frac;
 return {first:[productRule,quotientRule,powerRule,"Bütün çarpanları mümkünse "+base+" tabanında yaz; işlem işaretlerine göre üsleri birleştir."],second:[powerRule,...(conversions.length?["Tabanları eşitleyelim:\n"+conversions.join("\n")]:["Tabanlar zaten eşit."]), "Üs işlemini kur:\n"+arithmetic,"İşlemi tamamlayıp sorunun istediği gösterimi seç."],solution:[productRule,quotientRule,...(conversions.length?[powerRule+"\n"+conversions.join("\n")]:[]),"İfadeyi aynı tabanda yaz:\n"+normalized,"Üsleri birleştir:\n"+normalized+" = "+base+"^("+arithmetic+")\n"+base+"^("+arithmetic+") = "+pow(base,exponent),final]};
}
function rootWork(q){
 const raw=q.visual.labels.map(l=>String(l.value)).join(" ");const out=[],seen=new Set();
 for(const m of raw.matchAll(/([√∛∜])(?:\((\d+)\)|(\d+))/gu)){
  const sym=m[1],n=+(m[2]||m[3]),degree={"√":2,"∛":3,"∜":4}[sym],key=sym+n;if(seen.has(key)||n<1)continue;seen.add(key);
  if(degree===4&&Number.isInteger(Math.sqrt(n))){
   const k=Math.sqrt(n);out.push(key+" = √"+k);
   let d=Math.floor(Math.sqrt(k));while(d>1&&k%(d*d))d--;if(d>1)out.push("√"+k+" = √("+d+"² · "+k/(d*d)+")\n√"+k+" = "+(k===d*d?d:d+"√"+k/(d*d)));continue;
  }
  let d=Math.floor(n**(1/degree)+1e-8);while(d>1&&n%d**degree)d--;if(d>1){const rem=n/d**degree;out.push(key+" = "+sym+"("+pow(d,degree)+" · "+rem+")\n"+key+" = "+(rem===1?d:d+sym+rem));}
 }
 for(const m of raw.matchAll(/([√∛∜])\((\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)\)/gu)){
  const sym=m[1],b=+m[2],e=unsup(m[3]),n={"√":2,"∛":3,"∜":4}[sym];
  if(e%n===0&&!seen.has(m[0])){seen.add(m[0]);out.push(m[0]+" = "+b+"^("+e+"/"+n+")\n"+m[0]+" = "+pow(b,e/n));}
 }
 return out;
}
function supplemental(q){
 const topic=String(q.topic).toLocaleLowerCase("tr"),raw=q.visual.labels.map(l=>String(l.value)).join(" "),hasRoot=/[√∛∜]/.test(raw),hasPower=/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵃ]|\^/.test(raw);
 if(!hasRoot&&!hasPower)return null;
 const rules=[],prep=[];
 if(hasRoot){
  rules.push(rootRule);
  if(/eşlenik/.test(topic))rules.push("Eşlenik çarpımında (a+b) · (a−b) = a²−b² özdeşliği kullanılır.");
  if(/topla|fark|çıkar|karşılaştır|örtüş|birleş|çevre/.test(topic))rules.push("Kök derecesi ve kök içi aynı olan ifadelerde yalnız katsayılar toplanır veya çıkarılır.");
  if(/kare|alan/.test(topic))rules.push("Katsayılı köklü ifadenin karesinde katsayının da karesi alınır; kökün derecesi korunarak sadeleştirilir.");
  const rw=rootWork(q);if(rw.length)prep.push("Verilen kökleri derecelerine göre sadeleştirelim:\n"+rw.join("\n"));
  if(/eşleştir|şifre/.test(topic))rules.push("Kökün derecesi ile kuvvetin üssünü ilişkilendir; örneğin √(a²) = |a|.");
 }
 if(hasPower&&!hasRoot){
  if(/çarp|büyü|katman|debi|süre|yüz|bilimsel|diz|üs|kuvvet/.test(topic))rules.push(productRule);
  if(/böl|oran|kesir|pay|azal|negatif|üs|kuvvet|parça/.test(topic))rules.push(quotientRule);
  if(/negatif|sıfır/.test(topic))rules.push("Sıfırdan farklı a için a⁻ⁿ = 1/aⁿ ve a⁰ = 1.");
  if(/topla|fark|çıkar|karşılaştır|toplam/.test(topic))rules.push("Toplama ve çıkarmada üsler doğrudan birleştirilmez; uygun olduğunda ortak kuvvet parantezine alınır.");
  if(/bilimsel/.test(topic))rules.push("10'un kuvvetlerini eşitle, katsayıları topla veya çıkar; sonunda katsayıyı 1 ile 10 arasına getir (10 hariç).");
  const seen=new Set(),conversions=[];
  for(const m of raw.matchAll(/(\d+)([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/gu)){
   const b=+m[1],e=unsup(m[2]),[x,k]=baseOf(b);if(x!==b&&!seen.has(m[0])){seen.add(m[0]);conversions.push(m[0]+" = "+pow(x,k*e));}
  }
  if(conversions.length&&/üs|kuvvet|böl|çarp|oran|kesir|pay|bilimsel|azal|parça|fark|topla/.test(topic))prep.push(powerRule+"\n"+conversions.join("\n"));
 }
 if(!rules.length)return null;
 return {rules:[...new Set(rules)],prep};
}

function simplePower(q){
 const labels=q.visual.labels.map(x=>String(x.value)),topic=String(q.topic).toLocaleLowerCase("tr");
 if(q.obstacleId==="F01"||q.obstacleId==="F02")return null;
 if(q.obstacleId==="F05"&&labels.length===1){
  const p=parse(labels[0]);if(!p||p[1]>=0)return null;const [b,e]=p,den=b**(-e),result="1/"+den;
  if(q.correctAnswer!==result)return null;
  return {first:["Negatif üs işaretin negatif olduğu anlamına gelmez. Sıfırdan farklı a için a⁻ⁿ = 1/aⁿ."],second:["Verilen "+labels[0]+" ifadesinde üssün işaretini değiştirerek kuvveti paydada yaz. Pay 1 olmalı."],solution:["Negatif üs kuralı:\na⁻ⁿ = 1/aⁿ","Verilen ifadeyi dönüştür:\n"+labels[0]+" = 1/"+pow(b,-e),"Paydadaki kuvveti hesapla:\n"+labels[0]+" = "+result]};
 }
 if(labels.length!==2||!labels.every(x=>/^\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+(?:\s*(?:m|L|cm))?$/u.test(x)))return null;
 const [p,z]=labels.map(parse);if(!p||!z)return null;const [b,e]=p,[c,f]=z;
 const addition=/topla|birlikte|sayma/.test(topic),subtraction=/fark|çıkar|eksik/.test(topic);if(addition===subtraction)return null;
 const sign=addition?"+":"−",ans=addition?b**e+c**f:b**e-c**f;if(String(ans)!==q.correctAnswer)return null;
 const base=baseOf(b)[0],k=expOf(base,b)*e,j=expOf(base,c);if(j===null)return null;const v=j*f,small=Math.min(k,v);
 const original=pow(b,e)+" "+sign+" "+pow(c,f),same=pow(base,k)+" "+sign+" "+pow(base,v),inner=pow(base,k-small)+" "+sign+" "+pow(base,v-small),coefficient=base**(k-small)+(addition?1:-1)*base**(v-small);
 return {first:["Toplama ve çıkarmada üsler doğrudan birleştirilmez.","Tabanları eşitle; ortak olan en küçük kuvveti parantez dışına al."],second:["İfadeleri aynı tabanda yaz:\n"+original+" = "+same,"Ortak kuvveti ayırırken her terimin üssünden ortak üssü çıkar. Parantezi ve çarpımı kendin tamamla."],solution:["Toplama ve çıkarmada üsler birleştirilmez; ortak çarpan kullanılır.","Tabanları eşitleyelim:\n"+original+" = "+same,"Ortak kuvveti ayıralım:\n"+same+" = "+pow(base,small)+" · ("+inner+")","Parantezi hesaplayalım:\n"+pow(base,small)+" · ("+inner+") = "+pow(base,small)+" · "+coefficient,"Sonuç:\n"+base**small+" · "+coefficient+" = "+ans]};
}


function exactRoot(q){
 if(!["F07","F09","F10","F19"].includes(q.obstacleId))return null;
 const t=String(q.topic).toLocaleLowerCase("tr"),l=q.visual.labels.map(x=>String(x.value));
 function parseRoot(s){const z=s.trim().match(/^(\d*)([√∛∜])(?:\((\d+)\)|(\d+))(?:\s*(?:m|cm|birim))?$/u);return z?{c:Number(z[1]||1),s:z[2],n:Number(z[3]||z[4]),d:{"√":2,"∛":3,"∜":4}[z[2]]}:null;}
 const fmt=(c,s,n)=>n===1?String(c):(c===1?"":c===0?"0":String(c))+s+n;
 const value=x=>x.c*x.n**(1/x.d);
 function valid(expr){const ans=String(q.correctAnswer).trim().replace(/\s*(?:m²|cm²|m|cm|birim|taş)$/u,"");const p=parseRoot(expr),z=parseRoot(ans);const a=p?value(p):Number(expr),b=z?value(z):Number(ans);return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b));}
 const x=parseRoot(l[0]),y=parseRoot(l[1]||"");if(!x)return null;
 const r=x.s+x.n,A=fmt(x.c,x.s,x.n);
 let c,formula,rule,method,steps;
 if(q.obstacleId==="F07"&&/karesi/.test(t)&&l.length===1){
  if(x.d!==2&&x.d!==4)return null;
  const n=x.d===2?x.n:Math.sqrt(x.n);if(!Number.isInteger(n))return null;
  c=x.c*x.c*n;if(!valid(String(c)))return null;
  const square=x.d===2?String(x.n):"√"+x.n;
  rule="Çarpımın karesi alınırken her çarpanın karesi alınır. Kök derecesi ile üs sadeleştirilir.";
  method="Karenin alanı için kenar uzunluğunun karesini al. Katsayının karesini ve köklü kısmın karesini ayrı hesapla.";
  steps=["Alanı kenarın karesi olarak yaz:\n("+A+")²", "Çarpımın karesini dağıt:\n("+A+")² = "+x.c+"² · ("+r+")²","Köklü kısmın karesi:\n("+r+")² = "+square,...(x.d===4?["Karekökü sadeleştir:\n"+square+" = "+n]:[]),"Alanı hesapla:\n"+x.c+"² · "+n+" = "+(x.c*x.c)+" · "+n+"\n"+(x.c*x.c)+" · "+n+" = "+c];
 }else if(q.obstacleId==="F07"&&/çevre/.test(t)&&l.length===1){
  c=4*x.c;formula="4 · "+A;rule="Köklü ifadeyi tam sayıyla çarparken katsayı çarpılır, köklü kısım değişmez.";method="Karenin dört eşit kenarı vardır. Bir kenarı dörtle çarp.";steps=[method+"\n"+formula,"Katsayıları çarp:\n"+formula+" = (4 · "+x.c+") · "+r+"\n(4 · "+x.c+") · "+r+" = "+fmt(c,x.s,x.n)];if(!valid(fmt(c,x.s,x.n)))return null;
 }else{
  if(!y)return null;const z=l.length>=3?parseRoot(l[2]):null;
  if(x.d!==y.d||x.n!==y.n||z&&(z.d!==x.d||z.n!==x.n))return null;
  const B=fmt(y.c,y.s,y.n);
  if(q.obstacleId==="F10"&&/çevre/.test(t)&&l.length===2){c=2*(x.c+y.c);formula="2 · ("+A+" + "+B+")";method="Dikdörtgenin çevresi için uzun ve kısa kenarı topla, toplamın iki katını al.";steps=[method+"\n"+formula,"Ortak köklü kısmı ayır:\n"+formula+" = 2 · ("+x.c+" + "+y.c+") · "+r,"\n2 · ("+x.c+" + "+y.c+") · "+r+" = "+fmt(c,x.s,x.n)];}
  else if(q.obstacleId==="F10"&&/kenar uzunluğu farkı/.test(t)&&l.length===2){c=2*(x.c-y.c);formula="2 · ("+A+" − "+B+")";method="İki uzun kenarın toplamından iki kısa kenarın toplamını çıkar.";steps=[method+"\n"+formula,"Köklü kısım ortak:\n"+formula+" = 2 · ("+x.c+" − "+y.c+") · "+r,"\n2 · ("+x.c+" − "+y.c+") · "+r+" = "+fmt(c,x.s,x.n)];}
  else if(q.obstacleId==="F09"&&/paylaştırma/.test(t)&&/^\d+ eş parça$/.test(l[2]||"")){const n=Number(l[2].split(" ")[0]);c=(x.c-y.c)/n;formula="("+A+" − "+B+") ÷ "+n;method="Önce kesilen kısmı çıkar, kalan uzunluğu eş parçalara böl.";steps=[method+"\n"+formula,"Ortak köklü kısmı ayır:\n"+formula+" = ("+x.c+" − "+y.c+") · "+r+" ÷ "+n,"Katsayıyı böl:\n"+(x.c-y.c)+" · "+r+" ÷ "+n+" = "+fmt(c,x.s,x.n)];}
  else if((q.obstacleId==="F09"||q.obstacleId==="F19")&&z&&l.length===3&&/birleş|örtüş|destek toplamı/.test(t)){c=x.c+y.c-z.c;const C=fmt(z.c,z.s,z.n);formula=A+" + "+B+" − "+C;method="İki uzunluğu topla; ortak veya belirtilen çıkarılacak kısmı yalnız bir kez çıkar.";steps=[method+"\n"+formula,"Ortak köklü kısmı ayır:\n"+formula+" = ("+x.c+" + "+y.c+" − "+z.c+") · "+r,"\n("+x.c+" + "+y.c+" − "+z.c+") · "+r+" = "+fmt(c,x.s,x.n)];}
  else if(l.length===2&&/topla|fark|çıkar/.test(t)){const subtract=/fark|çıkar/.test(t),op=subtract?"−":"+";c=subtract?x.c-y.c:x.c+y.c;formula=A+" "+op+" "+B;method=subtract?"Aynı köklü uzunlukların farkını bul.":"Aynı köklü uzunlukları topla.";steps=[method+"\n"+formula,"Köklü kısmı ortak çarpan olarak yaz:\n"+formula+" = ("+x.c+" "+op+" "+y.c+") · "+r,"\n("+x.c+" "+op+" "+y.c+") · "+r+" = "+fmt(c,x.s,x.n)];}
  else return null;
  if(!Number.isInteger(c)||c<1||!valid(fmt(c,x.s,x.n)))return null;
  rule="Kök derecesi ve kök içi aynıysa toplama ve çıkarmada yalnız katsayılar işleme girer. Tam sayıyla çarpma veya bölmede de katsayı işlem görür.";
 }
 return {first:[rule,method],second:[rule,formula?"İşlemi kur:\n"+formula:"Kenarın karesini kur:\n("+A+")²","Köklü kısmı ve katsayıyı ayrı değerlendir; sonucu kendin tamamla."],solution:[rule,...steps,"Sonuç: "+q.correctAnswer]};
}

function guide(q){return q.obstacleId==="F03"?f03(q):algebra(q)||exactPower(q)||simplePower(q)||exactRoot(q);}
function apply(bank){return {...bank,questions:bank.questions.map(q=>{const g=guide(q);return g?{...q,symbolicGuideV241:g,...(q.obstacleId==="F03"?{f03Guide:g,hint:g.first.join("\n"),solution:g.solution.join("\n")}: {})}:q})};}
function groups(items){
 const out=[];
 for(const item of items){for(const part of String(item??"").split("\n").map(s=>s.trim()).filter(Boolean)){
   const clean=part.replace(/^\d+\.\s*(?:Adım\s*[:.–-]?\s*|(?=[A-ZÇĞİÖŞÜ]))/u,"");
   const math=/^[\d(√∛∜a-zA-Zⁿᵃ⁻+−]/u.test(clean)&&(/[=÷·×]/u.test(clean)||/^\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/u.test(clean))&&!/[a-zçğıöşü]{3,}/iu.test(clean);
   if(math&&out.length)out[out.length-1].push(clean);else out.push([clean]);
 }}
 return out;
}
const api={apply,guide,supplemental,groups};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKSymbolicV241=api;
})(typeof window!=="undefined"?window:globalThis);

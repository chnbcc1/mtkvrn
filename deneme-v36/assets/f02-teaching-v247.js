/* v238: approved F02 easy-question corrections, source bank remains intact. */
(function(root){
"use strict";
const changedAnswers=new Set(["F02-K-01","F02-K-04"]);
const changes=new Set(["F02-K-01","F02-K-02","F02-K-03","F02-K-04","F02-K-05","F02-K-06","F02-K-08","F02-K-09"]);
const power=s=>{const m=String(s).match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/u);if(!m)throw Error("F02 üslü ifade: "+s);return Number(m[1])**Number([...m[2]].map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));};
function revise(q){
 if(!changes.has(q.id)||q.f02Revision==="v238")return q;
 const labels=q.visual.labels.map(l=>({...l}));
 let prompt=q.prompt,options=q.options.slice(),correctAnswer=q.correctAnswer,solution="",hint="",workedExample;
 if(changedAnswers.has(q.id)){
  const replacement=q.id==="F02-K-01"?"4²":"2³";
  const old=labels[1].value;labels[1].value=replacement;
  prompt=prompt.replace(labels[0].value+" ve "+old,labels[0].value+" ve "+replacement);
  const a=power(labels[0].value),b=power(replacement);
  correctAnswer=String(a+b);
  options=q.id==="F02-K-01"?["16","25","9","32"]:["33","25","17","40"];
  solution="Birinci basamağın gücü:\n"+labels[0].value+" = "+a+"\nİkinci basamağın gücü:\n"+replacement+" = "+b+"\nToplam güç:\n"+a+" + "+b+" = "+correctAnswer+"\n";
  hint="İki basamağın üslü güç değerlerini ayrı ayrı hesapla ve topla.";
  workedExample={question:"İki taş basamağın güç levhalarında 4² ve 2¹ yazıyor. Toplam güç kaç birimdir?",solution:"4² = 16\n2¹ = 2\n16 + 2 = 18"};
 }else if(labels[0].anchor==="basamak_sayısı"){
  const n=Number(labels[0].value),v=power(labels[1].value);
  prompt=prompt.replace(/^Yan yana /u,"");
  solution="Bir basamağın enerjisi:\n"+labels[1].value+" = "+v+"\n"+n+" basamağın toplam enerjisi:\n"+n+" · "+v+" = "+(n*v);
  hint="Bir basamağın enerjisini hesapla. Bu değeri basamak sayısıyla çarp.";
  const other=q.id==="F02-K-03"?{n:4,p:"2¹"}:{n:3,p:"2³"};
  workedExample={question:other.n+" taş basamak vardır ve her birindeki enerji "+other.p+" birimdir. Toplam enerji kaç birimdir?",solution:other.p+" = "+power(other.p)+"\n"+other.n+" · "+power(other.p)+" = "+(other.n*power(other.p))};
 }else{
  const a=power(labels[0].value),b=power(labels[1].value);
  prompt=prompt.replace("Hasarlı taşın açılması için","Hasarlı taşın çalışması için");
  solution="Giriş basamağındaki enerji:\n"+labels[0].value+" = "+a+"\nHasarlı taşın çalışması için harcanan enerji:\n"+labels[1].value+" = "+b+"\nKalan enerji:\n"+a+" − "+b+" = "+(a-b);
  hint="Girişteki ve hasarlı taşın çalışması için harcanan enerjiyi ayrı hesapla; harcananı girişten çıkar.";
  const other=q.id==="F02-K-05"?["4²","2³"]:["2⁵","2¹"];
  workedExample={question:"Giriş basamağında "+other[0]+" güç birimi depolanmış. Hasarlı taşın çalışması için "+other[1]+" birim harcanırsa kaç birim kalır?",solution:other[0]+" = "+power(other[0])+"\n"+other[1]+" = "+power(other[1])+"\n"+power(other[0])+" − "+power(other[1])+" = "+(power(other[0])-power(other[1]))};
 }
 if(new Set(options).size!==4||!options.includes(correctAnswer))throw Error(q.id+" seçenekler");
 return {...q,prompt,options,correctAnswer,solution,hint,workedExample,visual:{...q.visual,labels},f02Revision:"v238"};
}
function apply(bank){if(bank.questions?.length!==630)throw Error("F02 kaynak banka");return {...bank,questions:bank.questions.map(original=>{const q=revise(original),g=symbolicGuide(q);return g?{...q,symbolicGuideV241:g,f02SymbolicGuideV245:true}:q;})};}
function migrateRun(run){if(!run||run.f02Revision==="v238")return run;const id=run.remediationId||run.practiceId||run.activeId;if(changedAnswers.has(id)&&!run.awaiting&&!run.stageCorrect)Object.assign(run,{stage:0,wrong:0,wrongChoices:[],revealed:false,helpView:false,feedback:""});run.f02Revision="v238";return run;}

function symbolicGuide(q){
 if(q?.obstacleId!=="F02")return null;
 const m=Object.fromEntries(q.visual.labels.map(l=>[l.anchor,String(l.value)]));
 const digits="⁰¹²³⁴⁵⁶⁷⁸⁹",sup=e=>String(e).replace(/[-0-9]/g,c=>c==="-"?"⁻":digits[+c]),pw=(b,e)=>String(b)+sup(e);
 const productRule="Tabanları aynı olan üslü sayılar çarpılırken üsleri toplanır.",quotientRule="Tabanları aynı olan üslü sayılar bölünürken üsleri çıkarılır.",powerRule="Bir üslü sayının kuvveti alınırken üsler çarpılır.";
 const factors=n=>{if(!Number.isSafeInteger(n)||n<1)throw Error(q.id+" çarpan "+n);const out={};for(let p=2;p*p<=n;p++)while(n%p===0){out[p]=(out[p]||0)+1;n/=p;}if(n>1)out[n]=(out[n]||0)+1;return out;};
 const fmt=f=>Object.entries(f).filter(([,e])=>e>0).map(([b,e])=>e===1?b:pw(b,e)).join(" · ")||"1";
 const val=f=>Object.entries(f).reduce((v,[b,e])=>v*Number(b)**e,1);
 const change=(f,g,sign)=>{const r={...f};for(const [p,e] of Object.entries(g))r[p]=(r[p]||0)+sign*e;return r;};
 const pterm=s=>{const z=String(s).match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/u);if(!z)throw Error(q.id+" üslü ifade "+s);const b=+z[1],e=Number([...z[2]].map(c=>digits.indexOf(c)).join(""));return {b,e,f:Object.fromEntries(Object.entries(factors(b)).map(([p,k])=>[p,k*e])),text:s};};
 const term=k=>pterm(m[k]),par=s=>s.includes(" · ")?"("+s+")":s;
 const rows=[],first=[],second=[],add=(...s)=>rows.push(...s),hint=(a,b)=>{first.push(a);second.push(b);};
 const signed=(ts,render=t=>t.text)=>ts.map((t,i)=>(i?(t.sign===-1?" − ":" + "):(t.sign===-1?"−":""))+render(t)).join("");
 const value=t=>val(t.f),neg=t=>({...t,sign:-1});
 function normalize(t){const c=fmt(t.f);if(c===t.text)return c;
  if(t.b&&t.e>1){const base=factors(t.b),b=fmt(base);if(Object.keys(base).length===1&&Object.values(base)[0]>1){const [p,k]=Object.entries(base)[0];add(powerRule,t.text+" = ("+pw(p,k)+")"+sup(t.e),"("+pw(p,k)+")"+sup(t.e)+" = "+p+"^("+k+"·"+t.e+")",p+"^("+k+"·"+t.e+") = "+pw(p,k*t.e));return c;}
   if(Object.keys(base).length>1){add("Çarpımın kuvveti alınırken her çarpanın kuvveti alınır.",t.text+" = ("+b+")"+sup(t.e),"("+b+")"+sup(t.e)+" = "+c);return c;}
  }return c;
 }
 function product(f,g){const c=change(f,g,1);const middle=Object.entries(c).filter(([,e])=>e>0).map(([p,e])=>f[p]>0&&g[p]>0?p+"^("+f[p]+"+"+g[p]+")":e===1?p:pw(p,e)).join(" · ");add(productRule,par(fmt(f))+" · "+par(fmt(g))+" = "+middle,middle+" = "+fmt(c));return c;}
 function part(t,d,title){const g=factors(d),f=change(t.f,g,-1);if(Object.values(f).some(e=>e<0))throw Error(q.id+" kesir sonucu tam sayı değil");
  add(title+":",t.text+" · 1/"+d+" = "+t.text+"/"+d);
  const nt=normalize(t),den=fmt(g);if(String(d)!==den)add(d+" = "+den);
  const exp=Object.entries(t.f).map(([p,e])=>g[p]?p+"^("+e+"−"+g[p]+")":e===1?p:pw(p,e)).join(" · ");
  add(quotientRule,par(nt)+"/"+par(den)+" = "+exp);
  if(Object.values(f).some(e=>e===0)){const z=Object.entries(f).map(([p,e])=>e===1?p:pw(p,e)).join(" · ");add(exp+" = "+z,"Sıfırdan farklı bir sayının sıfırıncı kuvveti 1'dir.",z+" = "+fmt(f));}else add(exp+" = "+fmt(f));
  return {f,text:fmt(f)};
 }
 // v246: after the last exponent operation, evaluate numerical terms and add/subtract.
 // Factoring remains necessary for the unknown-exponent equation branch below.
 function sum(ts,title){
  const expr=signed(ts),numbers=signed(ts,t=>String(value(t))),ans=ts.reduce((n,t)=>n+(t.sign||1)*value(t),0);
  add(title+":",expr,"Üslü sayıların değerlerini bulup toplama veya çıkarma işlemini yapalım.",expr+" = "+numbers,numbers+" = "+ans);
  return ans;
 }
 function setupSum(ts,title){hint(title+" Üslü sayıların değerlerini hesapla; toplama veya çıkarmada üsleri birleştirme.","İşlemi kur:\n"+signed(ts)+"\nÜslü sayıların değerlerini bul ve işlemi kendin tamamla.");}
 // Hint never evaluates the last operation or supplies the answer. Show denominator as a power when it is a pure prime power.
 const hintDiv=(t,d)=>{const g=factors(d),den=fmt(g),num=fmt(t.f);return t.text+"/"+d+(num!==t.text||den!==String(d)?" = "+par(num)+"/"+par(den):"");};
 let ans;
 if(m.basamak_sayısı){const t=term("her_basamak"),n=+m.basamak_sayısı,g=factors(n),expr=n+" · "+t.text,share=Object.keys(g).some(p=>t.f[p]>0);
  hint("Her basamakta "+t.text+" enerji var. "+n+" basamağın enerjisini bulmak için çarp."+(share?" Çarpanları aynı tabanda yaz.":""),"İşlemi kur:\n"+expr+(share?"\nAynı tabanda çarparken üsleri topla.":""));add("Basamak sayısı ile bir basamağın enerjisini çarpalım:",expr);
  if(share){normalize(t);if(String(n)!==fmt(g))add(n+" = "+fmt(g));const c=product(g,t.f);ans=val(c);add(fmt(c)+" = "+ans);}else{ans=n*value(t);add(expr+" = "+ans);}
 }else if(m.giriş&&m.hasarlı_taş){const ts=[term("giriş"),neg(term("hasarlı_taş"))];setupSum(ts,"Harcanan enerjiyi girişteki enerjiden çıkar.");ans=sum(ts,"Kalan enerji");
 }else if(m["ilk enerji"]){const a=term("ilk enerji"),b=term("uyarı"),d=+m["kapı tüketimi"].split("/")[1],e=+m["uyarı kullanımı"].split("/")[1];
  hint("Kapı için birinci gücü "+d+" ile, lamba için ikinci gücü "+e+" ile böl. Aynı tabanda bölme yaparken üsleri çıkar.","Harcanan güçleri üslü biçimde bul:\n"+hintDiv(a,d)+"\n"+hintDiv(b,e)+"\nHer harcamayı kendi gücünden çıkar; kalanları topla.");
  const x=part(a,d,"Kapıyı açmak için harcanan güç"),y=part(b,e,"Lambaya harcanan güç");ans=sum([a,neg(x),b,neg(y)],"İki basamakta kalan toplam güç");
 }else if(m["çalışma oranları"]){const a=term("ilk"),b=term("orta"),c=term("son"),r=m["çalışma oranları"].split(",").map(s=>s.trim());if(r.join(",")!=="1,1/4,1/2")throw Error(q.id+" oran");
  hint("İlk basamağın tümü, ikincinin dörtte biri ve üçüncünün yarısı çalışıyor. Bölmede tabanları eşitleyip üsleri çıkar.","Çalışan enerjiler:\n"+a.text+"\n"+hintDiv(b,4)+"\n"+hintDiv(c,2)+"\nBölmeleri üslü biçimde yap; üç miktarı topla.");
  const x=part(b,4,"İkinci basamağın çalışan enerjisi"),y=part(c,2,"Üçüncü basamağın çalışan enerjisi");ans=sum([a,x,y],"Üç basamağın çalışan toplam enerjisi");
 }else if(m.sol&&m.harcama){const ts=[term("sol"),term("sağ"),neg(term("harcama"))];setupSum(ts,"İki basamağın güçlerini topla; kapının harcadığı gücü çıkar.");ans=sum(ts,"Kapıdan sonra kalan güç");
 }else if(m["ilk basamak levhası"]||m["güç sayacı"]){const a=m["ilk basamak levhası"]||m["ilk basamak"],b=m["orta basamak levhası"]||m["orta basamak"],c=m["son basamak levhası"]||m["son basamak"],total=Number((m["üst sayaç"]||m["güç sayacı"]).match(/\d+/)[0]),v=total/21;
  if(b!==a+"⁺²"||c!==a+"⁺⁴"||!Number.isInteger(v))throw Error(q.id+" ortak çarpan");
  hint("İkinci ve üçüncü kuvveti ilk kuvvetin katı biçiminde yaz. Aynı tabanda çarpma yapılırken üsler toplanır.","Toplam denklem:\n"+a+" + "+b+" + "+c+" = "+total+"\n"+b+" = "+a+" · 2²\n"+c+" = "+a+" · 2⁴\nOrtak kuvveti parantezin dışına al.");
  add("Üç basamağın toplamını denklemle yazalım:",a+" + "+b+" + "+c+" = "+total,productRule,b+" = "+a+" · 2²",c+" = "+a+" · 2⁴","Ortak kuvveti parantezin dışına alalım:",a+" · (1 + 2² + 2⁴) = "+total,a+" · (1 + 4 + 16) = "+total,a+" · 21 = "+total,"Denklemin iki tarafını 21'e bölelim:",a+" = "+total+"/21",a+" = "+v);
  ans=v;if(/ortadaki/i.test(q.prompt)){ans=4*v;const vf=factors(v);add("Ortadaki basamağın gücü:",b+" = "+a+" · 2²",a+" = "+fmt(vf));const c=product(vf,factors(4));add(fmt(c)+" = "+ans);}
 }else if(m["basamak 4"]){const ts=[term("basamak 3"),term("basamak 4"),neg(term("basamak 1")),neg(term("basamak 2"))];setupSum(ts,"Son iki basamağın toplamından ilk iki basamağın toplamını çıkar.");ans=sum(ts,"Son iki basamak ile ilk iki basamak arasındaki fark");
 }else if(m.aktarım){const a=term("alt basamak"),b=term("üst basamak"),d=+m.aktarım.split("/")[1];
  hint("Toplam enerjinin dörtte birini bulmak için iki basamağın her birini "+d+" ile bölüp sonuçları topla. Aynı tabanda bölmede üsleri çıkar.","Önce şu iki bölmeyi üslü biçimde yap:\n"+hintDiv(a,d)+"\n"+hintDiv(b,d)+"\nBulduğun iki miktarı topla.");
  add("Toplamın belirtilen payını her basamağa ayrı uygulayabiliriz:","("+a.text+" + "+b.text+")/"+d+" = "+a.text+"/"+d+" + "+b.text+"/"+d);
  const x=part(a,d,"Alt basamaktan aktarılan enerji"),y=part(b,d,"Üst basamaktan aktarılan enerji");ans=sum([x,y],"Toplam aktarılan enerji");
 }else if(m.basamak_1||m.basamak_A){const keys=m.basamak_1?["basamak_1","basamak_2"]:["basamak_A","basamak_B","basamak_C"],ts=keys.map(term);setupSum(ts,"Basamaklardaki güçleri topla.");ans=sum(ts,"Basamakların toplam gücü");
 }else throw Error(q.id+" çözüm türü");
 if(String(ans)!==String(q.correctAnswer))throw Error(q.id+" hesaplanan "+ans+" beklenen "+q.correctAnswer);
 add("Sonuç: "+ans+" birim.");
 return {first,second,solution:rows};
}
function detailedSolution(q){return symbolicGuide(q)?.solution||null;}

const api={version:"v247",apply,revise,migrateRun,detailedSolution,symbolicGuide};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKF02RevisionV238=api;
})(typeof window!=="undefined"?window:globalThis);

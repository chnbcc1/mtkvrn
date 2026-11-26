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
function apply(bank){if(bank.questions?.length!==630)throw Error("F02 kaynak banka");return {...bank,questions:bank.questions.map(revise)};}
function migrateRun(run){if(!run||run.f02Revision==="v238")return run;const id=run.remediationId||run.practiceId||run.activeId;if(changedAnswers.has(id)&&!run.awaiting&&!run.stageCorrect)Object.assign(run,{stage:0,wrong:0,wrongChoices:[],revealed:false,helpView:false,feedback:""});run.f02Revision="v238";return run;}

function detailedSolution(q){
 if(q?.obstacleId!=="F02")return null;
 const m=Object.fromEntries(q.visual.labels.map(l=>[l.anchor,String(l.value)]));
 const rows=[];const add=(...s)=>rows.push(...s);
 const calc=(key,title)=>{const p=m[key],v=power(p);const match=p.match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/u);const exponent=Number([...match[2]].map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));add(title+":",p+" = "+(exponent>1?Array(exponent).fill(match[1]).join(" · ")+" = ":"")+v);return v;};
 const portion=(v,key,title)=>{const [n,d]=m[key].split("/").map(Number);if(n!==1||!Number.isInteger(d)||d<1)throw Error(q.id+" oran");const result=v/d;add(title+":",v+" · "+m[key]+" = "+result);return result;};
 let ans;
 if(m["basamak_sayısı"]){
  const v=calc("her_basamak","Bir basamağın enerjisini hesaplayalım"),n=Number(m["basamak_sayısı"]);ans=n*v;add("Her basamak eşit enerjiye sahip. Basamak sayısıyla çarpalım:",n+" · "+v+" = "+ans);
 }else if(m["giriş"]&&m["hasarlı_taş"]){
  const a=calc("giriş","Girişte depolanan enerji"),b=calc("hasarlı_taş","Hasarlı taşın çalışması için harcanan enerji");ans=a-b;add("Harcanan enerjiyi başlangıç miktarından çıkaralım:",a+" − "+b+" = "+ans);
 }else if(m["ilk enerji"]){
  const a=calc("ilk enerji","Birinci basamakta depolanan güç"),x=portion(a,"kapı tüketimi","Kapıyı açmak için harcanan güç");add("Birinci basamakta kalan güç:",a+" − "+x+" = "+(a-x));
  const b=calc("uyarı","İkinci basamakta depolanan güç"),y=portion(b,"uyarı kullanımı","Uyarı lambası için harcanan güç");add("İkinci basamakta kalan güç:",b+" − "+y+" = "+(b-y));ans=a-x+b-y;add("İki basamakta kalan güçleri toplayalım:",(a-x)+" + "+(b-y)+" = "+ans);
 }else if(m["çalışma oranları"]){
  const a=calc("ilk","Birinci basamak tamamen çalışıyor"),b=calc("orta","İkinci basamağın toplam enerjisi"),z=calc("son","Üçüncü basamağın toplam enerjisi");
  const ratios=m["çalışma oranları"].split(",").map(x=>x.trim());if(ratios.join(",")!=="1,1/4,1/2")throw Error(q.id+" oran");
  add("İkinci basamağın dörtte biri çalışıyor:",b+" · 1/4 = "+b/4,"Üçüncü basamağın yarısı çalışıyor:",z+" · 1/2 = "+z/2);ans=a+b/4+z/2;add("Yalnızca çalışan enerjileri toplayalım:",a+" + "+b/4+" + "+z/2+" = "+ans);
 }else if(m["sol"]&&m["harcama"]){
  const a=calc("sol","Birinci basamağın gücü"),b=calc("sağ","İkinci basamağın gücü"),v=calc("harcama","Kapı için tüketilen güç");add("Başlangıçtaki toplam güç:",a+" + "+b+" = "+(a+b));ans=a+b-v;add("Kapı için tüketilen gücü toplamdan çıkaralım:",(a+b)+" − "+v+" = "+ans);
 }else if(m["ilk basamak levhası"]||m["güç sayacı"]){
  const first=m["ilk basamak levhası"]||m["ilk basamak"],second=m["orta basamak levhası"]||m["orta basamak"],third=m["son basamak levhası"]||m["son basamak"];
  const total=Number((m["üst sayaç"]||m["güç sayacı"]).match(/\d+/)[0]);const v=total/21;
  if(second!==first+"⁺²"||third!==first+"⁺⁴"||!Number.isInteger(v))throw Error(q.id+" ortak çarpan");
  add("Üç basamağın toplam enerjisini denklemle yazalım:",first+" + "+second+" + "+third+" = "+total,"Tabanları aynı olan üslü sayılar çarpılırken üsleri toplanır. İkinci ve üçüncü ifadeyi ilk kuvvet cinsinden açalım:",second+" = "+first+" · 2²",third+" = "+first+" · 2⁴","Denklemde yerlerine yazalım:",first+" + "+first+" · 4 + "+first+" · 16 = "+total,"Ortak kuvveti parantezine alalım:",first+" · (1 + 4 + 16) = "+total,first+" · 21 = "+total,"Denklemin iki tarafını 21'e bölelim:",first+" = "+total+"/21",first+" = "+v);
  ans=v;if(/ortadaki/i.test(q.prompt)){ans=4*v;add("Ortadaki basamağın enerjisi ilk basamağın dört katıdır:",second+" = "+first+" · 2²",v+" · 4 = "+ans);}
 }else if(m["basamak 4"]){
  const n=[1,2,3,4].map(i=>calc("basamak "+i,i+". basamağın enerjisi"));const first=n[0]+n[1],last=n[2]+n[3];ans=last-first;add("İlk iki basamağın toplamı:",n[0]+" + "+n[1]+" = "+first,"Son iki basamağın toplamı:",n[2]+" + "+n[3]+" = "+last,"Son iki basamağın toplamından ilk ikisinin toplamını çıkaralım:",last+" − "+first+" = "+ans);
 }else if(m["aktarım"]){
  const a=calc("alt basamak","Alt basamağın enerjisi"),b=calc("üst basamak","Üst basamağın enerjisi");add("İki basamağın toplam enerjisi:",a+" + "+b+" = "+(a+b));ans=portion(a+b,"aktarım","Yedek lambalara aktarılan enerji");
 }else if(m["basamak_1"]||m["basamak_A"]){
  const keys=m["basamak_1"]?["basamak_1","basamak_2"]:["basamak_A","basamak_B","basamak_C"];const n=keys.map((k,i)=>calc(k,(i+1)+". basamağın gücü"));ans=n.reduce((a,b)=>a+b,0);add("Basamaklar birlikte çalıştığı için güçlerini toplayalım:",n.join(" + ")+" = "+ans);
 }else throw Error(q.id+" çözüm türü");
 if(String(ans)!==q.correctAnswer)throw Error(q.id+" hesaplanan "+ans+" beklenen "+q.correctAnswer);
 add("Sonuç: "+ans+" birim.");return rows;
}

const api={apply,revise,migrateRun,detailedSolution};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKF02RevisionV238=api;
})(typeof window!=="undefined"?window:globalThis);

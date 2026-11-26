/* v229: user-authorized F01 wording and K09 correction, applied to the immutable approved source bank. */
(function(root){const api=(function build(){
 const version="f01-v229";
 const captions={"ilk_dal":"1. gün","büyüme":"Her gün","gün":"Hedef gün","sol_dal":"Sol kol","sağ_dal":"Sağ kol","bugün":"Bugün","gelişim":"Her gün","sabah":"Sabah","akşam_büyüme":"Akşam","sol ilk gün":"Sol 1. gün","sağ ilk gün":"Sağ 1. gün","sol büyüme":"Sol / gün","sağ büyüme":"Sağ / gün","sol kol":"Sol kol","sağ kol":"Sağ kol","sol korunma":"Sol korunan","sağ korunma":"Sağ korunan","dökülen":"Dökülen","sol sarmaşık kolu":"Sol kol","sağ sarmaşık kolu":"Sağ kol","iki kolun ortak sayacı":"Toplam","toplam":"Toplam","kol A":"Sol kol","kol B":"Orta kol","kol C":"Sağ kol","sol geçit":"Aktarılan pay","sol kopan":"Sol kopan","sağ kopan":"Sağ kopan"};
 function language(s){return String(s).replace(/Sarmaşık duvarında iki koldaki/gu,"Duvardaki sarmaşığın iki kolundaki").replace(/Sarmaşık duvarında sol kolda/gu,"Duvardaki sarmaşığın sol kolunda").replace(/Sarmaşık duvarında/gu,"Duvardaki sarmaşıkta").replace(/Duvarın sol sarmaşık kolunda/gu,"Duvardaki sarmaşığın sol kolunda").replace(/sağ sarmaşık kolunda/gu,"sağ kolunda").replace(/Duvarın sol kolunda/gu,"Duvardaki sarmaşığın sol kolunda").replace(/Duvarın iki kolunda/gu,"Duvardaki sarmaşığın iki kolunda").replace(/^Sol sarmaşık kolunda/u,"Duvardaki sarmaşığın sol kolunda").replace(/^Üç sarmaşık kolundaki tomurcuk sayıları /u,"Duvardaki sarmaşığın sol, orta ve sağ kollarındaki tomurcuk sayıları sırasıyla ").replace(/^Bir sarmaşık dalında/u,"Duvardaki sarmaşığın bir kolunda").replace(/Duvardaki sarmaşığın iki kolunda sırasıyla/gu,"Duvardaki sarmaşığın sol ve sağ kollarında sırasıyla").replace(/Duvardaki sarmaşığın iki kolundaki/gu,"Duvardaki sarmaşığın sol ve sağ kollarındaki").replace(/Sol kol her yeni gün (\d+), sağ kol ise (\d+) katına çıkıyor/gu,"Tomurcuk sayısı her yeni gün sol kolda $1, sağ kolda $2 katına çıkıyor").replace(/Sol kol her gün iki, sağ kol üç katına çıkıyor/gu,"Tomurcuk sayısı her gün sol kolda iki, sağ kolda üç katına çıkıyor");}
 const replacement={
 prompt:"Duvardaki sarmaşıkta sabah 3² tomurcuk vardır. Akşama kadar tomurcuk sayısı 3³ katına çıkıyor. Akşamki tomurcuk sayısının üslü sayı gösterimi aşağıdakilerden hangisidir?",
 correctAnswer:"3⁵",options:["3⁵","3⁶","3⁴","3⁹"],topic:"Aynı tabanlı üslü ifadeleri çarpma",
 solution:"Sabah 3² tomurcuk vardır. Akşama kadar 3³ katına çıkar: 3² · 3³ = 3²⁺³ = 3⁵. Aynı tabanlı kuvvetler çarpılırken taban korunur, üsler toplanır.",
 hint:"Tabanları aynı olan kuvvetleri çarparken tabanı koru ve üsleri topla.",
 workedExample:{question:"Duvardaki sarmaşıkta 2³ tomurcuk vardır. Sayı 2⁴ katına çıkarsa sonuç 2'nin hangi kuvvetidir?",solution:"2³ · 2⁴ = 2³⁺⁴ = 2⁷."},
 f01Guide:{first:["Tabanları aynı olan kuvvetleri çarparken tabanı koru ve üsleri topla.","Sabahki miktar ile büyüme çarpanının tabanları 3'tür."],second:["3² · 3³ işleminde taban 3 olarak kalır.","Yeni üssü bulmak için 2 ile 3'ü topla. Sonucu üslü biçimde seçeneklerle karşılaştır."],solution:"Sabah 3² tomurcuk vardır. Akşama kadar 3³ katına çıkar: 3² · 3³ = 3²⁺³ = 3⁵. Aynı tabanlı kuvvetler çarpılırken taban korunur, üsler toplanır."}
 };
 const lossVersion="f01-loss-v231",lossIds=["F01-O-02","F01-O-05","F01-O-08"];
 function reviseLoss(q){
  const [left,right,leftFraction,rightFraction]=q.visual.labels;
  if(leftFraction.anchor!=="sol korunma"||rightFraction.anchor!=="sağ korunma")throw Error("Kopan tomurcuk kaynak verisi: "+q.id);
  const power=s=>{const m=s.match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/u);return Number(m[1])**Number([...m[2]].map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""))};
  const denominator=s=>Number(s.split("/")[1]);
  const a=power(left.value),b=power(right.value),x=denominator(leftFraction.value),y=denominator(rightFraction.value);
  const lostA=a/x,lostB=b/y,remainingA=a-lostA,remainingB=b-lostB,answer=remainingA+remainingB;
  const prompt=q.prompt.replace(/korunuyor\./u,"kopuyor.").replace(/Korunan toplam tomurcuk sayısı kaçtır\?/u,"Geriye kalan toplam tomurcuk sayısı kaçtır?");
  const hint="Önce "+left.value+" ve "+right.value+" üslü ifadelerinin değerlerini hesapla. Kopan tomurcukları başlangıç miktarlarından çıkarmalısın.";
  const solution="Sol kol: "+left.value+" = "+a+". Kopan: "+a+" ÷ "+x+" = "+lostA+", kalan: "+a+" − "+lostA+" = "+remainingA+". Sağ kol: "+right.value+" = "+b+". Kopan: "+b+" ÷ "+y+" = "+lostB+", kalan: "+b+" − "+lostB+" = "+remainingB+". Geriye kalan toplam: "+remainingA+" + "+remainingB+" = "+answer+" tomurcuk.";
  const distractors=[lostA+lostB,a+b-lostA,a+b-lostB].filter((n,i,all)=>n!==answer&&all.indexOf(n)===i);
  for(let offset=1;distractors.length<3;offset++)if(!distractors.includes(answer+offset))distractors.push(answer+offset);
  const correctIndex=q.options.indexOf(q.correctAnswer),options=q.options.map((_,i)=>String(i===correctIndex?answer:distractors.shift()));
  return {...q,prompt,correctAnswer:String(answer),options,hint,solution,visual:{...q.visual,labels:[left,right,{...leftFraction,anchor:"sol kopan"},{...rightFraction,anchor:"sağ kopan"}]},workedExample:{question:"Duvardaki sarmaşığın sol kolunda 4², sağ kolunda 8² tomurcuk vardır. Soldakilerin yarısı ve sağdakilerin dörtte biri kopuyor. Geriye kalan toplam tomurcuk sayısı kaçtır?",solution:"4² = 16 ve 8² = 64. Solda 16 − 8 = 8, sağda 64 − 16 = 48 tomurcuk kalır. Toplam 8 + 48 = 56."},f01Guide:{first:[hint,"Kopan oranlar, geriye kalan oranlar değildir. Her koldaki kopan miktarı bul ve kendi başlangıç miktarından çıkar."],second:["Sol kolda başlangıçta "+left.value+" = "+a+" tomurcuk var. "+a+" ÷ "+x+" = "+lostA+" tomurcuk kopar.","Solda kalan miktarı çıkarma ile bul. Sağ kolda da "+right.value+" değerini hesaplayıp "+rightFraction.value+" oranında kopan tomurcukları çıkar. İki kalan miktarı topla."],solution}};
 }
 function revise(q){
  if(q.obstacleId!=="F01")return q;
  if(q.f01Revision===version)return q;
  let n={...q,prompt:language(q.prompt),f01Revision:version};
  if(q.workedExample)n.workedExample={...q.workedExample,question:language(q.workedExample.question)};
  if(q.id==="F01-K-09"){
   if(q.correctAnswer!=="45"||!q.prompt.includes("kuzey dalında"))throw Error("F01-K-09 kaynak sürümü beklenenden farklı");
   n={...n,...replacement,visual:{...q.visual,labels:[{anchor:"sabah",value:"3²"},{anchor:"akşam_büyüme",value:"×3³"}]}};
  }
  if(lossIds.includes(q.id))n=reviseLoss(n);
  return n;
 }
 function apply(bank){
  if(bank?.schema!=="forest-question-bank-v147"||bank.questions?.length!==630||bank.questions.filter(q=>q.obstacleId==="F01").length!==30)throw Error("F01 düzeltmesi için kaynak banka doğrulanamadı");
  return {...bank,questions:bank.questions.map(revise)};
 }
 function label(q,l){
  if(q.obstacleId!=="F01")return {};
  const caption=captions[l.anchor];if(!caption)throw Error("F01 levha açıklaması eksik: "+l.anchor);
  const displayValue=String(l.value).replace(/^Toplam:\s*/u,"").replace(/\s*\/\s*gün$/u,"").replace(/^her gün\s*/iu,"");
  return {caption,displayValue,...(l.anchor==="akşam_büyüme"?{forceStack:true}:{})};
 }
 function migrateRun(run){
  if(!run)return run;
  const oldQuestion=run.f01Revision!==version,oldLoss=run.f01LossRevision!==lossVersion;
  if(!oldQuestion&&!oldLoss)return run;
  const id=run.remediationId||run.practiceId||run.activeId;
  // Do not revoke earned completion or change accumulated task errors.
  if(((oldQuestion&&id==="F01-K-09")||(oldLoss&&lossIds.includes(id)))&&!run.awaiting&&!run.stageCorrect){
   Object.assign(run,{stage:0,wrong:0,wrongChoices:[],revealed:false,helpView:false,feedback:""});
  }
  run.f01Revision=version;run.f01LossRevision=lossVersion;return run;
 }
 return {version,lossVersion,apply,revise,label,migrateRun};
})();if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKF01RevisionV229=api;})(typeof window!=="undefined"?window:globalThis);

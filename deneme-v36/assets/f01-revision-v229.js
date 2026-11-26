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
 function hardGuide(q){
 if(q.obstacleId!=="F01"||q.difficulty!=="zor")return q;
 const data=Object.fromEntries(q.visual.labels.map(l=>[l.anchor,l.value]));
 const sup=n=>String(n).replace(/[-0-9]/g,c=>c==="-"?"⁻":"⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(c)]);
 const pow=(s)=>{const m=s.replace(/\s/g,"").match(/^(?:(\d+)·)?(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/u);if(!m)throw Error(q.id+" power");return Number(m[1]||1)*Number(m[2])**Number([...m[3]].map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));};
 const frac=s=>{const m=s.match(/^1\/(\d+)$/);if(!m)throw Error(q.id+" fraction");return Number(m[1]);};
 let first,second,steps,answer,example;
 const left=data["sol kol"]||data["sol sarmaşık kolu"],right=data["sağ kol"]||data["sağ sarmaşık kolu"];
 if(left?.includes("ⁿ")&&right?.includes("ⁿ")){
  const parse=s=>{const m=s.match(/^(\d+)ⁿ(?:([⁺⁻])([⁰¹²³⁴⁵⁶⁷⁸⁹]+))?$/u);if(!m)throw Error(q.id+" exponent");return [Number(m[1]),(m[2]==="⁻"?-1:1)*Number([...(m[3]||"")].map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""))]};
  const [b,x]=parse(left),[b2,y]=parse(right),sum=Number((data.toplam||data["iki kolun ortak sayacı"]).replace(/^Toplam:\s*/,""));
  if(b!==b2||b<=1)throw Error(q.id+" base");
  const common=b+"ⁿ",den=b**Math.max(0,-x,-y),num=b**(x+Math.max(0,-x,-y))+b**(y+Math.max(0,-x,-y)),value=sum*den/num;
  let remaining=value,n=0;while(remaining>1&&remaining%b===0){remaining/=b;n++;}if(remaining!==1)throw Error(q.id+" non-integral power");
  answer=n;
  const exp=k=>k===0?common:k>0?common+" · "+b+(k===1?"":sup(k)):common+"/"+b+(-k===1?"":sup(-k));
  const coefficient=k=>k===0?"1":k>0?String(b**k):"1/"+b**(-k);
  const c1=coefficient(x),c2=coefficient(y),c=den===1?String(num):num+"/"+den;
  const equation=left+" + "+right+" = "+sum;
  const expanded=exp(x)+" + "+exp(y)+" = "+sum;
  const factored=common+" · ("+c1+" + "+c2+") = "+sum;
  first=["Tabanları aynı olan üslü sayılar çarpılırken üsleri toplanır, bölünürken çıkarılır.","Her iki terimi "+common+" cinsinden yaz ve ortak çarpanı parantez dışına al."];
  second=["Verilen denklem:\n"+equation,"Üslü ifade kuralını uygula:\n"+(x!==0?left+" = "+exp(x)+"\n":"")+(y!==0?right+" = "+exp(y)+"\n":"")+expanded,"Ortak çarpanı ayır:\n"+factored,"Parantezi hesapla. Denklemin iki tarafında aynı işlemi yaparak "+common+" ifadesini yalnız bırak. Sonra tabanları eşitle."];
  steps=["Verilen denklem:",equation,"Üslü ifadeleri açalım:",...(x!==0?[left+" = "+exp(x)]:[]),...(y!==0?[right+" = "+exp(y)]:[]),"Denklemde yerine yazalım:",expanded,"Ortak çarpanı parantez dışına alalım:",factored];
  if(den>1){steps.push("Paydaları eşitleyelim:",b+" = "+(b*den)+"/"+den,common+" · ("+(b**(x+Math.max(0,-x,-y)))+"/"+den+" + "+(b**(y+Math.max(0,-x,-y)))+"/"+den+") = "+sum);}
  steps.push(common+" · "+(den===1?c:"("+c+")")+" = "+sum,den===1?"Her iki tarafı "+num+" sayısına bölelim:":"Her iki tarafı "+den+"/"+num+" ile çarpalım:",common+" = "+(den===1?sum+" ÷ "+num:sum+" · "+den+"/"+num),common+" = "+value,"Tabanları eşitleyelim:",value+" = "+b+sup(n),common+" = "+b+sup(n),"Tabanlar eşit olduğu için üsler eşittir:","n = "+n);
 }else if(data["kol A"]){
  const p=[data["kol A"],data["kol B"],data["kol C"]],v=p.map(pow),sum=v.reduce((a,b)=>a+b,0),d=frac(data["sol geçit"]);answer=sum/d;
  first=["Her kolun üslü ifadesini ayrı ayrı hesapla.","Üç miktarı topla; aktarılan pay toplamın 1/"+d+" kadarıdır."];
  second=["İlk kol:\n"+p[0]+" = "+v[0],"Diğer iki kolu aynı biçimde hesapla, üçünü topla ve toplamı "+d+" sayısına böl."];
  steps=["Her kolun tomurcuk sayısını hesaplayalım:",...p.map((s,i)=>s+" = "+v[i]),"Üç kolun toplamı:",v.join(" + ")+" = "+sum,"Toplamın 1/"+d+" kadarı aktarıldığı için "+d+" sayısına bölelim:",sum+" ÷ "+d+" = "+answer,"Sol geçide aktarılan: "+answer+" tomurcuk."];
 }else if(data["sol kopan"]&&data["sağ kopan"]){
  const l=pow(left),r=pow(right),dl=frac(data["sol kopan"]),dr=frac(data["sağ kopan"]),kl=l/dl,kr=r/dr,rl=l-kl,rr=r-kr;answer=Math.abs(rl-rr);
  first=["İki kolun üslü başlangıç sayılarını ayrı ayrı hesapla.","Her koldan kendi kopan miktarını çıkar. Son olarak kalanların farkını bul."];
  second=["Sol kol başlangıcı:\n"+left+" = "+l,"Solda kopan:\n"+l+" ÷ "+dl+" = "+kl,"Sağ kola da aynı yöntemi uygula; kalanları bulduktan sonra büyük miktardan küçüğü çıkar."];
  steps=["Sol kol başlangıcı:",left+" = "+l,"Solda kopan:",l+" ÷ "+dl+" = "+kl,"Solda kalan:",l+" − "+kl+" = "+rl,"Sağ kol başlangıcı:",right+" = "+r,"Sağda kopan:",r+" ÷ "+dr+" = "+kr,"Sağda kalan:",r+" − "+kr+" = "+rr,"Kalanlar arasındaki fark için büyük sayıdan küçüğü çıkaralım:",Math.max(rl,rr)+" − "+Math.min(rl,rr)+" = "+answer,"Fark: "+answer+" tomurcuk."];
 }else throw Error(q.id+" unsupported hard type");
 if(String(answer)!==q.correctAnswer)throw Error(q.id+" computed answer mismatch "+answer);
 const solution=steps.join("\n");
 return {...q,hint:first[0],solution,f01Guide:{first,second,solution},f01AlgebraRevision:"v233"};
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
  if(n.difficulty==="zor")n=hardGuide(n);
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

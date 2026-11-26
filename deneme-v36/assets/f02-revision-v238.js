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
const api={apply,revise,migrateRun};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKF02RevisionV238=api;
})(typeof window!=="undefined"?window:globalThis);

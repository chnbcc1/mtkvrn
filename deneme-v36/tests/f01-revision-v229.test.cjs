const assert=require('node:assert/strict');
const R=require('../assets/f01-revision-v229.js'),P=require('../assets/scene-plan-v214.js'),T=require('../assets/plaque-text-v216.js'),teaching=require('../assets/teaching-v219.js'),bank=require('../forest-questions-v147.json');
console.log('PASS v229',(function checks(R,P,T,teaching,bank,check){
 const revised=R.apply(bank);let labels=0,fitChecks=0,fallbacks=0,math=0;
 const pow=(s,n)=>{let x=String(s).replace(/\s+/g,"").replace(/^Toplam:/,"").replace(/^hergün/i,"").replace(/^×/,"").replace(/\/gün$/,"");const m=x.match(/^(?:(\d+)[·×])?(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻]+)$/);if(m){const exp=m[3].replace(/ⁿ/g,String(n)).replace(/⁺/g,"+").replace(/⁻/g,"-").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,c=>String("⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)));const parts=exp.match(/^(\d+)(?:([+-])(\d+))?$/);check(parts,"power parse "+x);return Number(m[1]||1)*Number(m[2])**(Number(parts[1])+(parts[2]==="-"?-1:1)*Number(parts[3]||0))}if(/^\d+\/\d+$/.test(x)){const [a,b]=x.split("/").map(Number);return a/b}return Number(x)};
 for(let i=0;i<bank.questions.length;i++){
  const q=revised.questions[i],old=bank.questions[i];if(q.obstacleId!=="F01"){check(JSON.stringify(q)===JSON.stringify(old),q.id);continue}
  check(!/kuzey dalında|Sarmaşık duvarında|Duvarın sol sarmaşık kolunda|sağ sarmaşık kolunda/.test(q.prompt),q.id+" wording");
  if(!["F01-K-09","F01-O-02","F01-O-05","F01-O-08"].includes(q.id)){check(q.correctAnswer===old.correctAnswer&&JSON.stringify(q.options)===JSON.stringify(old.options)&&JSON.stringify(q.visual)===JSON.stringify(old.visual),q.id+" math preserved");}
  const data=Object.fromEntries(q.visual.labels.map(l=>[l.anchor,l.value])),v=k=>pow(data[k]);let answer;
  if("ilk_dal" in data)answer=v("ilk_dal")*v("büyüme")**(v("gün")-1);
  else if("sol_dal" in data)answer=v("sol_dal")+v("sağ_dal");
  else if("bugün" in data)answer=v("bugün")/v("gelişim");
  else if("sabah" in data)answer=pow(q.correctAnswer)===v("sabah")*v("akşam_büyüme")?q.correctAnswer:null;
  else if("sol ilk gün" in data)answer=v("sol ilk gün")*v("sol büyüme")**(v("gün")-1)+v("sağ ilk gün")*v("sağ büyüme")**(v("gün")-1);
  else if("sol korunma" in data)answer=v("sol kol")*v("sol korunma")+v("sağ kol")*v("sağ korunma");
  else if("dökülen" in data)answer=v("sol kol")+v("sağ kol")-v("dökülen");
  else if("sol kopan" in data){const a=v("sol kol")*(1-v("sol kopan")),b=v("sağ kol")*(1-v("sağ kopan"));answer=q.difficulty==="orta"?a+b:Math.abs(a-b);}
  else if("kol A" in data)answer=(v("kol A")+v("kol B")+v("kol C"))*v("sol geçit");
  else {const x=data["sol kol"]||data["sol sarmaşık kolu"],y=data["sağ kol"]||data["sağ sarmaşık kolu"],sum=pow(data.toplam||data["iki kolun ortak sayacı"]);const ns=q.options.map(Number).filter(n=>pow(x,n)+pow(y,n)===sum);check(ns.length===1,q.id+" unique equation");answer=ns[0]}
  check(String(answer)===q.correctAnswer&&q.options.includes(q.correctAnswer)&&new Set(q.options).size===4,q.id+" computed answer "+answer);math++;
  check(teaching.workedExample(q,revised.questions)?.id!==q.id&&!!teaching.workedExample(q,revised.questions),q.id+" example");
  const plan=P.plan(q);check(plan?.labels.length===q.visual.labels.length,q.id+" plan");for(const l of plan.labels){check(l.caption&&l.displayValue&&l.value===q.visual.labels.find(x=>x.anchor===l.anchor).value,q.id+" caption");labels++;for(const plane of [160,195,320,390,430,600]){const measure=(s,size)=>[...s].length*size*.56;const f=T.fitCaption(l.caption,l.displayValue,l.box[2]*plane/100,l.box[3]*plane/100,measure,{maxSize:Math.max(12,Math.min(32,plane*.075))});check(f&&f.size>=0&&f.lines.length>=1,q.id+" fit");if(!f.readable)fallbacks++;fitChecks++}}
 }
 for(const [id,answer] of [["F01-O-02","50"],["F01-O-05","68"],["F01-O-08","66"]]){const q=revised.questions.find(x=>x.id===id);check(q.correctAnswer===answer&&!/korun/i.test(JSON.stringify(q)),id+" loss revision");const run=R.migrateRun({activeId:id,f01Revision:R.version,wrong:2,wrongChoices:["41"],taskWrong:2});check(run.wrong===0&&run.taskWrong===2&&run.f01LossRevision===R.lossVersion,id+" migration");}
 const k=revised.questions.find(q=>q.id==="F01-K-09");check(k.correctAnswer==="3⁵"&&k.f01Guide.solution===k.solution&&k.options.filter(x=>pow(x)===243).length===1,"K09 rule");
 const pending=R.migrateRun({activeId:k.id,wrong:2,wrongChoices:["45"],taskWrong:2});check(pending.wrong===0&&!pending.wrongChoices.length&&pending.taskWrong===2,"pending migration");const earned=R.migrateRun({activeId:k.id,stageCorrect:true,awaiting:true,taskWrong:3});check(earned.stageCorrect&&earned.awaiting&&earned.taskWrong===3,"earned retained");check(R.apply(revised).questions.every((q,i)=>q===revised.questions[i]),"idempotent");
 return {math,labels,fitChecks,fallbacks,unchanged:600};
})(R,P,T,teaching,bank,(x,m)=>assert.ok(x,m)));

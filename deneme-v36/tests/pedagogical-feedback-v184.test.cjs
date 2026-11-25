"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.join(__dirname,"..");
const source=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
assert.equal(bank.questions.length,630,"Keep the original 630 approved questions");
const start=source.indexOf("function f01Growth(q){");
const end=source.indexOf("function reportSolved(obs){",start);
assert(start>=0&&end>start,"Pedagogical code block not found");
const scope={window:{MTKF02ApprovedV165:{guide:()=>null}},bank};
vm.runInNewContext(source.slice(start,end)+"\nthis.exports={f01Growth,f01Guide,teachingHint,teachingSecondHint,teachingSolutionSteps,teachingRule};",scope);
const p=scope.exports;
for(const [id,expected] of [["F01-K-02","30"],["F01-K-05","34"],["F01-K-08","25"]]){
 const q=bank.questions.find(q=>q.id===id);
 assert(q&&q.correctAnswer===expected,id+" variant preserved");
 const guide=p.f01Guide(q);
 assert(guide&&guide.solution.includes(expected),id+" new exponent base must be understood by pedagogical solver");
 assert(!/NaN|undefined/.test(JSON.stringify(guide)),id+" faulty computation");
}
const growth=bank.questions.find(q=>q.id==="F01-O-07");
assert(growth&&growth.correctAnswer==="43");
const hint1=p.teachingHint(growth,growth.hint);
const hint2=p.teachingSecondHint(growth,growth.hint);
const steps=p.teachingSolutionSteps(growth,{prompt:growth.prompt,answer:growth.correctAnswer,hint:growth.hint,solution:growth.solution});
assert(hint1.length>=3&&hint2.length>=3,"Hints must have three instructional actions");
assert(!hint1.join(" ").includes("= 43")&&!hint2.join(" ").includes("= 43"),"Hint cannot reveal final result");
assert(steps.length>=6,"Three-day growth needs multiple explained stages");
const explanation=steps.join("\n");
for(const token of ["4","3","8","9","16","27","43","− 1 = 2","başlangıç"])assert(explanation.includes(token),"Missing growth explanation: "+token);
for(const id of ["F02-K-01","F05-K-01","F07-K-01","F15-K-01","F18-K-01","F20-K-01","F21-K-01"]){
 const q=bank.questions.find(x=>x.id===id);
 const s={prompt:q.prompt,answer:q.correctAnswer,hint:q.hint,solution:q.solution};
 const h1=p.teachingHint(q,q.hint),h2=p.teachingSecondHint(q,q.hint),sol=p.teachingSolutionSteps(q,s);
 assert(h1.length>=2&&h2.length>=2&&sol.length>=4,id+" help not sufficiently detailed");
 assert(sol.join(" ").includes(q.correctAnswer),id+" correct answer missing");
 assert(!/undefined|NaN/.test(sol.join(" ")),id+" invalid numerical explanation");
}
for(const q of bank.questions){
 const s={prompt:q.prompt,answer:q.correctAnswer,hint:q.hint,solution:q.solution};
 const all=p.teachingSolutionSteps(q,s);
 assert(all.length>=4&&all.every(v=>typeof v==="string"&&v.length>8),q.id+" missing pedagogical steps");
 assert(!/undefined|NaN/.test(all.join(" ")),q.id+" invalid explanation");
}
/* F03: all 30 questions have exact-data guidance, not unrelated area/root tips.
   First wrong: concept; second wrong: safe first step; third wrong: full verified solution. */
const f03=bank.questions.filter(q=>q.obstacleId==="F03");
assert.equal(f03.length,30,"Keep every F03 question");
for(const q of f03){
 const guide=q.f03Guide, s={prompt:q.prompt,answer:q.correctAnswer,hint:q.hint,solution:q.solution};
 assert(guide?.first?.length===3&&guide?.second?.length===3&&guide?.solution?.length>=4,q.id+" missing three-stage F03 guide");
 const a=p.teachingHint(q,q.hint),b=p.teachingSecondHint(q,q.hint),c=p.teachingSolutionSteps(q,s);
 assert.equal(a.join("|"),guide.first.join("|"),q.id+" first hint must be question-specific");
 assert.equal(b.join("|"),guide.second.join("|"),q.id+" second hint must show the real first calculation");
 assert.equal(c.join("|"),guide.solution.join("|"),q.id+" third hint must use a complete F03 solution");
 assert(a.join(" ").includes(q.visual.labels[0].value.replace(/ birim$/,"")),q.id+" first hint must cite the entry value");
 assert(c.join(" ").includes(q.correctAnswer),q.id+" wrong answer on final stage");
 assert(!/Karede alan|Kökün karesini|Kök içindeki/.test([...a,...b,...c].join(" ")),q.id+" irrelevant mathematical hint");
 assert(!b.join(" ").includes("Doğru sonuç"),q.id+" second wrong cannot disclose the result");
}
assert(bank.questions.some(q=>q.id==="F03-O-02"&&q.correctAnswer==="206"),"Parallel 3^5 and 5^4 example must be recomputed");
assert(bank.questions.some(q=>q.id==="F03-Z-09"&&q.correctAnswer==="6"),"6^5 and successive sixths must compute correctly");
assert(bank.questions.find(q=>q.id==="F03-K-06").prompt.includes("2⁸"),"Use exponents for the 256-unit output question");
assert(source.includes('function startSimilarQuestion(obs,q){'),"Starting a similar task must retain the current question identity");
assert(source.includes('btn("Engeli aç",()=>reportSolved(obs))'),"Successful embedded tasks need a direct open action");
assert(!source.includes('✓ Benzer soru tamamlandı.'),"Remove the extra similar-question completion screen");
assert(bank.questions.find(q=>q.id==="F03-O-07").prompt==="Sis türbinine 2¹² birim sis giriyor. Bu sisin tamamı önce 1. filtreden geçiyor; çıkan miktarın 1/4’ü bir sonraki aşamaya aktarılıyor. Bu miktarın 1/8’i 2. filtreden geçiyor. Son olarak çıkan sisin yarısı gözlem tüpüne yönlendiriliyor. Gözlem tüpüne kaç birim sis ulaşır?");
assert(source.includes('btn("Benzer soru çöz",()=>startSimilarQuestion(obs,q),true)'),"All successful questions must offer the next similar question");
assert(!source.includes('Yeni benzer soru çöz'),"Use the exact approved two-button wording");
assert(!source.includes('function finishSimilarQuestion(){'),"Unused completion screen logic must be removed");
assert(!source.includes('rowButton("Ana göreve dön"'),"No return to previously failed question");
assert(!source.includes('if(q?.obstacleId==="F03")run.activeId=run.remediationId;'),"Remove F03-only stale-answer workaround");
assert(source.includes('solutionCard.appendChild(mathText("p","mtk-teaching-step",explanation))'),"Solution must be rendered as scrollable structured paragraphs");
console.log("PASS v184: 630 unchanged source questions receive detailed pedagogical feedback; F01 growth solution verified.");

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
assert(source.includes('solutionCard.appendChild(mathText("p","mtk-teaching-step",explanation))'),"Solution must be rendered as scrollable structured paragraphs");
console.log("PASS v184: 630 unchanged source questions receive detailed pedagogical feedback; F01 growth solution verified.");

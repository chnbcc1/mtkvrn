"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
const questions=bank.questions;
const get=id=>questions.find(q=>q.id===id);
assert.equal(questions.length,630,"Keep all 630 questions");
assert.equal(bank.obstacles.length,21,"Keep 21 research tasks");
for(const task of bank.obstacles){
 const subset=questions.filter(q=>q.obstacleId===task.id);
 for(const difficulty of ["kolay","orta","zor"])
  assert.equal(subset.filter(q=>q.difficulty===difficulty).length,10,task.id+" "+difficulty);
}
for(const q of questions){
 assert.equal(q.options.length,4,q.id+" options count");
 assert.equal(new Set(q.options).size,4,q.id+" unique options");
 assert(q.options.includes(q.correctAnswer),q.id+" correct answer in A-D");
 assert.equal(q.visual?.bakedIntoImage,false,q.id+" must keep live numbers");
 assert(q.workedExample?.question&&q.workedExample?.solution,q.id+" needs a worked example");
}
const bases=new Set(),rootDegree=new Set();
for(const q of questions){
 for(const m of q.prompt.matchAll(/(\d+)[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g))bases.add(m[1]);
 if(q.prompt.includes("√"))rootDegree.add(2);
 if(q.prompt.includes("∛"))rootDegree.add(3);
 if(q.prompt.includes("∜"))rootDegree.add(4);
}
for(const base of ["2","3","4","5","6","8"])assert(bases.has(base),"Missing exponent base "+base);
for(const degree of [2,3,4])assert(rootDegree.has(degree),"Missing root degree "+degree);
assert(questions.filter(q=>q.prompt.includes("∛")).length>=7,"Too few cube-root exercises");
assert(questions.filter(q=>q.prompt.includes("∜")).length>=20,"Too few fourth-root exercises");
const math=[
 ["F02-K-01","18"],["F04-K-01","18"],["F05-K-01","1/5"],
 ["F06-K-01","36"],["F08-K-01","20"],["F11-K-01","18"],
 ["F13-K-01","100"],["F14-K-01","54"],["F17-K-01","81"],
 ["F16-K-01","∛64 = 4"],["F16-K-02","∜81 = 3"],
 ["F16-K-03","∛216 = 6"],["F16-K-04","∜256 = 4"],
 ["F16-K-05","∛125 = 5"],["F16-K-06","∜625 = 5"],
 ["F01-K-02","30"],["F01-K-05","34"],["F01-K-08","25"]
];
for(const [id,answer] of math)assert.equal(get(id)?.correctAnswer,answer,id+" arithmetic changed");
for(const q of questions.filter(q=>q.interaction?.kind==="matching_unmatched")){
 const d=q.interaction;
 assert.equal(d.radicalItems.length,5,q.id+" five roots");
 assert.equal(d.exponentItems.length,5,q.id+" five powers");
 assert.equal(d.pairs.length,4,q.id+" four pairs");
 const a=new Set(d.radicalItems),b=new Set(d.exponentItems);
 for(const item of d.pairs){
  assert(a.has(item.radical)&&b.has(item.exponent),q.id+" mismatched interactive reference");
 }
 assert(a.has(d.unmatchedRadical)&&b.has(d.unmatchedExponent),q.id+" unmatched labels must be available");
}
const vine=get("F01-K-05");
assert(vine.visual.labels[0].value==="5²"&&vine.visual.labels[1].value==="3²","F01 must show alternative bases on the plaques");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
assert(quiz.includes('const power=text.match(/^(\\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/)'),"F01 must parse variable exponent bases");
const rootMatch=get("F21-K-01");
assert(rootMatch.interaction.pairs.some(x=>x.radical==="∛729"&&x.exponent==="3²"),"Cube root matching 9");
assert(rootMatch.interaction.pairs.some(x=>x.radical==="∜4096"&&x.exponent==="2³"),"Fourth root matching 8");
const mediumMatch=get("F21-O-01");
assert(mediumMatch.interaction.pairs.some(x=>x.radical==="∛(2⁹)"&&x.exponent==="2³"),"Generalized cube root exponent");
assert(mediumMatch.interaction.pairs.some(x=>x.radical==="∜(3⁸)"&&x.exponent==="3²"),"Generalized fourth root exponent");
const f03=get("F03-O-07");
assert.equal(f03.correctAnswer,"64","Preserve the approved F03 exemplar's result");
assert(f03.prompt.includes("Sis türbinine 2¹² birim sis giriyor."),"Preserve the approved F03 wording");
const f02store=["F02-O-02","F02-O-05","F02-O-08"];
for(const id of f02store)assert(get(id).prompt.includes("ikinci basamağında ise"),id+" has two independent stored amounts");
console.log("PASS power/root diversity: 630 structurally valid questions, mixed 2/3/4/5/6/8 bases, square/cube/fourth roots, F21 pair integrity, F02/F03 scenes.");

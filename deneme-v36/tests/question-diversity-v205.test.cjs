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
// Verify all 120 interactive F21 pairs numerically (not just string references).
const supers="⁰¹²³⁴⁵⁶⁷⁸⁹";
const supersNum=str=>Number([...str].map(c=>supers.indexOf(c)).join(""));
const powerValue=str=>{
 const m=String(str).trim().match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/);
 if(m)return Number(m[1])**supersNum(m[2]);
 if(/^\d+$/.test(str.trim()))return Number(str.trim());
 throw Error("Unknown exponent value: "+str);
};
const radicalValue=str=>{
 const d=str[0]==="√"?2:str[0]==="∛"?3:str[0]==="∜"?4:null;
 assert(d,"Invalid radical: "+str);
 let body=str.slice(1).trim();
 if(body.startsWith("(")&&body.endsWith(")"))body=body.slice(1,-1);
 let n;
 if(body.includes(" · ")){const pieces=body.split(" · ");n=pieces.map(powerValue).reduce((a,b)=>a*b,1);}
 else if(body.includes(" ÷ ")){const pieces=body.split(" ÷ ");n=powerValue(pieces[0])/powerValue(pieces[1]);}
 else n=powerValue(body);
 return n**(1/d);
};
let checkedMatches=0;
for(const q of questions.filter(q=>q.obstacleId==="F21")){
 for(const pair of q.interaction.pairs){
  const x=radicalValue(pair.radical),y=powerValue(pair.exponent);
  assert(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)/Math.max(1,Math.abs(y))<1e-9,q.id+" incorrect numerical pair "+pair.radical+" vs "+pair.exponent+" ("+x+" vs "+y+")");
  checkedMatches++;
 }
}
assert.equal(checkedMatches,120,"Validate all 30*4 actual matches");
const vine=get("F01-K-05");
assert(vine.visual.labels[0].value==="5²"&&vine.visual.labels[1].value==="3²","F01 must show alternative bases on the plaques");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
assert(quiz.includes('const power=text.match(/^(\\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/)'),"F01 must parse variable exponent bases");
// Every one of the 30 interactive matching questions must use at least one
// cube or fourth root without losing any of its original five-by-five connections.
for(const q of questions.filter(q=>q.obstacleId==="F21")){
 const radicals=q.interaction.radicalItems;
 assert(radicals.some(x=>x.startsWith("∛")||x.startsWith("∜")),q.id+" missing varied root degree");
 assert(radicals.every(x=>x.length<=13),q.id+" root expression overflows mobile plaques");
}
for(const diff of ["kolay","orta","zor"]){
 const f01=questions.filter(q=>q.obstacleId==="F01"&&q.difficulty===diff);
 assert.equal(f01.length,10);
 const powers=new Set(f01.flatMap(q=>[...q.prompt.matchAll(/(\d+)[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g)].map(x=>x[1])));
 assert([...powers].some(base=>base!=="2"),"F01 "+diff+" must not use only powers of two");
}
const vineMedium=questions.filter(q=>q.obstacleId==="F01"&&q.difficulty==="orta");
assert(vineMedium.some(q=>q.prompt.includes("5²")),"F01 medium has 5-based powers");
assert(questions.filter(q=>q.obstacleId==="F16"&&q.difficulty==="orta").some(q=>q.prompt.includes("∛")),"F16 medium needs actual cube-root computations");
assert(questions.filter(q=>q.obstacleId==="F16"&&q.difficulty==="zor").some(q=>q.prompt.includes("∜")),"F16 advanced needs fourth roots");
assert(questions.filter(q=>q.obstacleId==="F20"&&q.difficulty==="orta").some(q=>q.visual.labels.some(x=>x.value.includes("∛"))),"F20 rings need visible cube roots");
// This is a BANK-WIDE rule: every mathematically suitable research area
// must show varied bases or root degrees, not only F01 or one selected example.
const exponentTopics=["F01","F02","F03","F04","F05","F06","F08","F11","F13","F14","F17"];
for(const obstacle of exponentTopics){
 const related=questions.filter(q=>q.obstacleId===obstacle);
 const found=new Set();
 for(const q of related){
  const text=q.prompt+" "+q.visual.labels.map(v=>v.value).join(" ");
  for(const m of text.matchAll(/(\d+)[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g))found.add(m[1]);
 }
 assert(found.size>=2,obstacle+" needs several exponent bases across its question set");
 assert([...found].some(v=>v!=="2"),obstacle+" cannot rely only on powers of two");
}
const radicalTopics=["F07","F09","F10","F12","F15","F16","F19","F20","F21"];
for(const obstacle of radicalTopics){
 const related=questions.filter(q=>q.obstacleId===obstacle);
 const text=related.map(q=>q.prompt+" "+q.visual.labels.map(v=>v.value).join(" ")+(q.interaction?.radicalItems||[]).join(" ")).join(" ");
 const degrees=["√","∛","∜"].filter(t=>text.includes(t));
 assert(degrees.length>=2,obstacle+" needs varied root degrees across its question set");
}
const science=questions.filter(q=>q.obstacleId==="F18");
assert(science.every(q=>q.prompt.includes("10")||q.visual.labels.some(v=>v.value.includes("10"))),"Scientific notation must retain its mathematically necessary base 10");
const f03=get("F03-O-07");
assert.equal(f03.correctAnswer,"64","Preserve the approved F03 exemplar's result");
assert(f03.prompt.includes("Sis türbinine 2¹² birim sis giriyor."),"Preserve the approved F03 wording");
const f02store=["F02-O-02","F02-O-05","F02-O-08"];
for(const id of f02store)assert(get(id).prompt.includes("ikinci basamağında ise"),id+" has two independent stored amounts");
console.log("PASS power/root diversity: 630 structurally valid questions, mixed 2/3/4/5/6/8 bases, square/cube/fourth roots, F21 pair integrity, F02/F03 scenes.");

// 25.11.2026: multiple independent bases at EVERY appropriate difficulty.
// 4 and 8 alone are equivalent powers of 2, so do not count as independent variation.
for(const obstacle of exponentTopics){
 for(const difficulty of ["kolay","orta","zor"]){
  const qs=questions.filter(q=>q.obstacleId===obstacle&&q.difficulty===difficulty);
  const independent=qs.filter(q=>/(?:^|[^\\d])(?:3|5|6|7|9|25|27|125)[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿᵃ]/.test(q.prompt+" "+q.visual.labels.map(v=>v.value).join(" ")));
  assert(independent.length>=2,obstacle+" "+difficulty+" needs multiple independent-base questions, not just the first example");
 }
}
const verifiedAnswers={"F04-K-02":"50","F06-K-04":"50","F17-K-04":"675","F02-O-04":"144","F04-Z-04":"243","F05-Z-06":"39","F08-Z-02":"333","F11-Z-04":"130","F13-Z-06":"63","F14-Z-08":"9","F17-Z-06":"879/4","F07-O-01":"15∛4","F09-Z-01":"12∛3","F10-Z-01":"18∛2","F15-K-04":"16 − ∛9","F19-Z-01":"7","F20-Z-01":"2 – 3 – 7"};
for(const [id,answer] of Object.entries(verifiedAnswers))assert.equal(get(id).correctAnswer,answer,id+" arithmetic regression");
for(const obstacle of ["F07","F09","F10","F12","F15","F16","F19","F20","F21"]){
 const qs=questions.filter(q=>q.obstacleId===obstacle);
 assert(qs.some(q=>(q.prompt+" "+q.visual.labels.map(v=>v.value).join(" ")+(q.interaction?.radicalItems||[]).join(" ")).includes("∛")),obstacle+" needs genuine cube-root practice");
}
console.log("PASS per-difficulty independent bases and genuine cube-root coverage");

// v210: exercise guidance uses current data and repeat attempts start unpaired.
const hintStart=quiz.indexOf("function concreteHint(q)");
const hintEnd=quiz.indexOf("function teachingSecondHint(q");
const exampleStart=quiz.indexOf("function example(q)");
const exampleEnd=quiz.indexOf("function workedSteps(q)");
assert(hintStart>=0&&hintEnd>hintStart&&exampleStart>=0&&exampleEnd>exampleStart);
const helpers=new Function("bank","hydrate",quiz.slice(hintStart,hintEnd)+quiz.slice(exampleStart,exampleEnd)+";return {concreteHint,example};")(bank,q=>q);
assert(helpers.concreteHint(get("F04-K-02")).includes("5 × 5"));
assert(helpers.concreteHint(get("F09-Z-01")).includes("24 = 8 × 3"));
for(const q of questions){
 const h=helpers.concreteHint(q),e=helpers.example(q);
 assert(typeof h==="string"&&!h.includes("NaN"),q.id+" hint");
 assert(e&&e.prompt&&e.solution&&!/^çözülmüş benzer örnek$/iu.test(e.prompt),q.id+" example");
}
assert(quiz.includes("delete run.matchingById[currentId()]"));
console.log("PASS v210 hints and examples across 630 questions");

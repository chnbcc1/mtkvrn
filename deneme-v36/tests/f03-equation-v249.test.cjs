"use strict";
const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json"),f01=require("../assets/f01-revision-v229.js"),f02=require("../assets/f02-teaching-v249.js"),sym=require("../assets/symbolic-teaching-v249.js"),plan=require("../assets/scene-plan-v249.js"),teach=require("../assets/teaching-v219.js");
const prev=require("../assets/symbolic-teaching-v248.js").apply(require("../assets/f02-teaching-v248.js").apply(f01.apply(bank)));
const current=sym.apply(f02.apply(f01.apply(bank))),hard=current.questions.filter(q=>q.obstacleId==="F03"&&q.difficulty==="zor"),eq=hard.filter(q=>q.f03EquationV249);
assert.equal(current.questions.length,630);assert.equal(hard.length,10);assert.equal(eq.length,7);
const expected=["13","8","3","2","9","5","7"];assert.deepEqual(eq.map(q=>q.correctAnswer),expected);
for(let i=0;i<630;i++){const q=current.questions[i];assert.equal(q.id,prev.questions[i].id);if(!q.f03EquationV249)assert.deepEqual(q,prev.questions[i]);}
for(const q of eq){const g=q.symbolicGuideV241,p=plan.plan(q),ex=teach.workedExample(q,current.questions);assert.equal(p.labels.length,5);assert.equal(p.labels[4].caption,"Çıkış");assert(q.options.includes(q.correctAnswer)&&new Set(q.options).size===4);assert.deepEqual(sym.plainHints(q,1,[]),g.first);assert.deepEqual(sym.plainHints(q,2,[]),g.second);assert(ex&&ex.id!==q.id&&hard.some(o=>o.id===ex.id&&o.correctAnswer!==q.correctAnswer));assert(g.solution.at(-1).endsWith(" = "+q.correctAnswer));}
assert.equal(sym.migrateRun({activeId:"F03-Z-04",wrong:2,wrongChoices:["16"],taskWrong:2}).wrong,0);
assert.equal(sym.migrateRun({activeId:"F03-Z-04",awaiting:true,stageCorrect:true}).stageCorrect,true);
console.log("v249: seven equation variants, 623 unchanged records, five labels and example routes verified.");

"use strict";
const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json"),f01=require("../assets/f01-revision-v229.js"),f02=require("../assets/f02-teaching-v254.js"),sym=require("../assets/symbolic-teaching-v254.js"),plan=require("../assets/scene-plan-v254.js"),teach=require("../assets/teaching-v254.js");
const old=require("../assets/symbolic-teaching-v253.js").apply(require("../assets/f02-teaching-v253.js").apply(f01.apply(bank))),eff=sym.apply(f02.apply(f01.apply(bank))),hard=eff.questions.filter(q=>q.obstacleId==="F04"&&q.difficulty==="zor");
assert.equal(eff.questions.length,630);assert.equal(hard.length,10);assert.equal(hard.filter(q=>q.f04VariableV254).length,6);
assert.deepEqual(hard.map(q=>q.correctAnswer),["120","351","84","135","8","5","3","4","5","3"]);
for(let i=0;i<630;i++){const q=eff.questions[i],o=old.questions[i];assert.equal(q.id,o.id);if(!q.f04HardV254)assert.deepEqual(q,o);}
for(const q of hard){const g=q.symbolicGuideV241,p=plan.plan(q),ex=teach.workedExample(q,eff.questions);assert.equal(p.labels.length,q.f04VariableV254?5:4);assert(q.options.includes(q.correctAnswer)&&new Set(q.options).size===4);assert.deepEqual(sym.plainHints(q,1,[]),g.first);assert.deepEqual(sym.plainHints(q,2,[]),g.second);assert(ex&&hard.some(z=>z.id===ex.id&&z.correctAnswer!==q.correctAnswer&&z.f04VariableV254===q.f04VariableV254));}
assert.equal(sym.migrateRun({activeId:"F04-Z-05",wrong:2,taskWrong:2}).wrong,0);
console.log("v254: F04 hard diversity, six variable questions, 621 unchanged records.");

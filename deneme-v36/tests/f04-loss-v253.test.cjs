"use strict";
const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json"),f01=require("../assets/f01-revision-v229.js"),f02=require("../assets/f02-teaching-v253.js"),sym=require("../assets/symbolic-teaching-v253.js"),plan=require("../assets/scene-plan-v253.js"),oldPlan=require("../assets/scene-plan-v252.js"),teach=require("../assets/teaching-v253.js");
const old=require("../assets/symbolic-teaching-v252.js").apply(require("../assets/f02-teaching-v252.js").apply(f01.apply(bank))),eff=sym.apply(f02.apply(f01.apply(bank)));
assert.equal(eff.questions.length,630);
const changed=eff.questions.filter((q,i)=>JSON.stringify(q)!==JSON.stringify(old.questions[i]));assert.equal(changed.length,14);
for(let i=0;i<630;i++){const q=eff.questions[i],o=old.questions[i];assert.equal(q.id,o.id);assert.equal(q.prompt,o.prompt);assert.equal(q.correctAnswer,o.correctAnswer);assert.deepEqual(q.options,o.options);assert.deepEqual(q.visual,o.visual);assert.deepEqual(plan.plan(q),oldPlan.plan(o));}
for(const q of changed){const g=q.symbolicGuideV241;assert.equal(q.obstacleId,"F04");assert(g.first.at(-1).includes("çıkar"));assert(g.second.at(-1).includes("çıkar"));assert(g.solution.at(-2).includes(" − ")&&g.solution.at(-2).endsWith(" = "+q.correctAnswer));assert(!g.second.some(s=>new RegExp("= "+q.correctAnswer+"(?:$|\\n)").test(s)));assert.deepEqual(sym.plainHints(q,1,[]),g.first);assert.deepEqual(sym.plainHints(q,2,[]),g.second);assert(changed.some(p=>p.id===teach.workedExample(q,eff.questions)?.id));}
const ex=changed.find(q=>q.id==="F04-O-01").symbolicGuideV241;assert(ex.solution.includes("4 + 8 + 0 = 12"));assert(ex.solution.includes("48 − 12 = 36"));
console.log("v253: 14 loss-first guides, 616 unchanged records, all choices and scenes preserved.");

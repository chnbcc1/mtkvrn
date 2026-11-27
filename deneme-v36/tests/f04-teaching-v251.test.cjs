"use strict";
const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json"),f01=require("../assets/f01-revision-v229.js"),f02=require("../assets/f02-teaching-v251.js"),sym=require("../assets/symbolic-teaching-v251.js"),plan=require("../assets/scene-plan-v251.js"),oldPlan=require("../assets/scene-plan-v250.js"),teach=require("../assets/teaching-v219.js");
const old=require("../assets/symbolic-teaching-v250.js").apply(require("../assets/f02-teaching-v250.js").apply(f01.apply(bank))),eff=sym.apply(f02.apply(f01.apply(bank))),qs=eff.questions.filter(q=>q.obstacleId==="F04");
assert.equal(qs.length,30);assert.equal(eff.questions.length,630);
for(let i=0;i<630;i++){const q=eff.questions[i],o=old.questions[i];assert.equal(q.id,o.id);assert.equal(q.correctAnswer,o.correctAnswer);assert.deepEqual(q.options,o.options);assert.deepEqual(q.visual,o.visual);assert.deepEqual(plan.plan(q),oldPlan.plan(o));if(q.obstacleId!=="F04")assert.deepEqual(q,o);}
for(const q of qs){const g=q.symbolicGuideV241;assert(g.first.length&&g.second.length>=2);assert(g.solution.at(-1).startsWith("Sonuç: "+q.correctAnswer+" "));assert.deepEqual(sym.plainHints(q,1,[]),g.first);assert.deepEqual(sym.plainHints(q,2,[]),g.second);assert(!g.second.some(s=>new RegExp("= "+q.correctAnswer+"(?:$|\\n)").test(s)));const ex=teach.workedExample(q,eff.questions);assert(ex&&qs.some(p=>p.id===ex.id&&p.correctAnswer!==q.correctAnswer));}
for(const id of ["F04-K-03","F04-K-06","F04-K-09"])assert(qs.find(q=>q.id===id).prompt.endsWith("toplam yanan ışık sayısı kaçtır?"));
assert(qs.find(q=>q.id==="F04-K-04").symbolicGuideV241.solution.includes("3¹ · 3³ = 3^(1+3)"));
console.log("v251: all 30 F04 guides, examples, 3 prompts, 630 answers and layouts verified.");

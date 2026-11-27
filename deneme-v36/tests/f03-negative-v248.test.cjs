"use strict";
const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json");
const f01=require("../assets/f01-revision-v229.js"),f02=require("../assets/f02-teaching-v248.js"),sym=require("../assets/symbolic-teaching-v248.js"),scene=require("../assets/scene-plan-v214.js"),teach=require("../assets/teaching-v219.js");
const old=require("../assets/symbolic-teaching-v247.js").apply(require("../assets/f02-teaching-v247.js").apply(f01.apply(bank)));
const eff=sym.apply(f02.apply(f01.apply(bank))),hard=eff.questions.filter(q=>q.f03NegativeV248);
assert.equal(eff.questions.length,630);assert.equal(hard.length,10);
for(let i=0;i<eff.questions.length;i++){const q=eff.questions[i],o=old.questions[i];assert.equal(q.id,o.id);assert.equal(q.correctAnswer,o.correctAnswer);assert.deepEqual(q.options,o.options);if(!q.f03NegativeV248)assert.deepEqual(q,o);}
for(const q of hard){const g=q.symbolicGuideV241;assert.equal((q.prompt.match(/ katı/g)||[]).length,4);assert(q.visual.labels.slice(1).every(l=>/^× \d+⁻[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/.test(l.value)&&q.prompt.includes(l.value.slice(2)+" katı")));assert(g.first.includes("Tabanları aynı olan üslü sayılar çarpılırken üsleri toplanır."));assert.equal(g.solution.at(-1),"Sonuç: "+q.correctAnswer+" birim sis.");assert.deepEqual(sym.plainHints(q,1,[]),g.first);assert.deepEqual(sym.plainHints(q,2,[]),g.second);assert.equal(scene.plan(q).labels.length,5);const ex=teach.workedExample(q,eff.questions);assert(!ex||hard.some(p=>p.id===ex.id));}
console.log("v248: 10 F03 hard questions, labels, hints, solutions, examples, all 630 answers preserved.");

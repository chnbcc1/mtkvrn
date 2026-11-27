"use strict";
const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json");
const f01=require("../assets/f01-revision-v229.js"),f02=require("../assets/f02-revision-v238.js"),sym=require("../assets/symbolic-teaching-v241.js"),fmt=require("../assets/step-format-v232.js"),teach=require("../assets/teaching-v219.js");
const effective=sym.apply(f02.apply(f01.apply(bank))),qs=effective.questions.filter(q=>q.obstacleId==="F02");
assert.equal(effective.questions.length,630);assert.equal(qs.length,30);
for(const q of qs){const g=q.symbolicGuideV241;assert(q.f02SymbolicGuideV245&&g,q.id);assert(q.options.includes(q.correctAnswer));assert.equal(g.solution.at(-1),"Sonuç: "+q.correctAnswer+" birim.");assert.deepEqual(sym.plainHints(q,1,["ESKİ"]),g.first);assert.deepEqual(sym.plainHints(q,2,["ESKİ"]),g.second);assert.deepEqual(f02.detailedSolution(q),g.solution);const ex=teach.workedExample(q,effective.questions);assert(!ex||qs.some(p=>p.id===ex.id&&p.f02SymbolicGuideV245));for(const s of [...g.first,...g.second,...g.solution])if(/\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]*\/\d/.test(s))assert(fmt.instructionalHTML(s).includes("mtk-math-frac"),q.id+" "+s);}
const g=qs.find(q=>q.id==="F02-O-08").symbolicGuideV241;assert(g.solution.includes("2⁷/2² = 2^(7−2)"));assert(!g.solution.slice(0,g.solution.indexOf("2^(7−2) = 2⁵")).some(s=>s.includes("128")));
const mixed=qs.find(q=>q.id==="F02-O-04").symbolicGuideV241;assert(mixed.solution.includes("(2 · 3)² = 2² · 3²"));
console.log("F02 v245: 30 active questions, both hints, full solutions and example route verified.");

const simple=qs.find(q=>q.id==="F02-O-01").symbolicGuideV241;
assert(simple.solution.includes("2² + 2 + 2³ = 4 + 2 + 8"));assert(simple.solution.includes("4 + 2 + 8 = 14"));
for(const q of qs.filter(q=>!q.visual.labels.some(l=>l.anchor==="güç sayacı"||l.anchor==="ilk basamak levhası")))assert(!/ortak (?:çarpan|kuvvet)|parantezin dışına/i.test([...q.symbolicGuideV241.first,...q.symbolicGuideV241.second,...q.symbolicGuideV241.solution].join(" ")),q.id);
for(const q of qs.filter(q=>q.visual.labels.some(l=>l.anchor==="güç sayacı"||l.anchor==="ilk basamak levhası")))assert(q.symbolicGuideV241.solution.some(s=>/ortak kuvvet/i.test(s)),q.id);
for(const q of effective.questions.filter(q=>q.obstacleId==="F03"&&q.visual.labels.some(l=>l.anchor==="ayrılan")))assert(!/ortak kuvvet|parantez/i.test(q.symbolicGuideV241.solution.join(" ")),q.id);
assert(effective.questions.find(q=>q.id==="F08-K-01").symbolicGuideV241.solution.includes("25 − 5 = 20"));
assert(effective.questions.find(q=>q.id==="F06-Z-01").symbolicGuideV241.solution.some(s=>/Ortak çarpan/.test(s)));
console.log("v246: numeric final sums/differences simplified; unknown and radical rules preserved.");

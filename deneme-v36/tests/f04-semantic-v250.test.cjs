"use strict";
const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json"),f01=require("../assets/f01-revision-v229.js"),f02=require("../assets/f02-teaching-v250.js"),sym=require("../assets/symbolic-teaching-v250.js"),oldPlan=require("../assets/scene-plan-v249.js"),plan=require("../assets/scene-plan-v250.js"),layout=require("../assets/scene-layout-v218.js");
const previous=require("../assets/symbolic-teaching-v249.js").apply(require("../assets/f02-teaching-v249.js").apply(f01.apply(bank)));
const current=sym.apply(f02.apply(f01.apply(bank)));
assert.deepEqual(current,previous);assert.equal(current.questions.length,630);let n=0;
for(const q of current.questions){const p=plan.plan(q),o=oldPlan.plan(q);if(q.obstacleId!=="F04"){assert.deepEqual(p,o);continue;}n++;assert.equal(p.file,o.file);assert.equal(p.character,o.character);assert.equal(p.labels[0].slot,0);assert.equal(new Set(p.labels.map(l=>l.slot)).size,p.labels.length);assert(p.labels.every(l=>l.caption&&l.value===l.displayValue));
for(const l of q.visual.labels){const m=String(l.value).match(/^(\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?: lamba)?;\s*(sönük|kapanan|yanan):?\s*(\d+\/\d+)$/u);if(m){assert.equal(p.labels[0].value,m[1]);assert.equal(p.labels.find(x=>x.anchor===l.anchor).value,m[3]);}else assert(p.labels.some(x=>x.anchor===l.anchor&&x.value===String(l.value)));}
for(const [w,h] of [[355,273],[390,300],[375,260],[400,180]]){const g=layout.sceneGeometry(w,h,1024,1024,plan.scenes.F04.boxes,"F04");assert(p.labels.every(l=>{const b=layout.project(l.box,g);return b.left>=0&&b.top>=0&&b.left+b.width<=w+1e-6&&b.top+b.height<=h+1e-6;}));}}
assert.equal(n,30);console.log("v250: 30 semantic F04 plaque plans, 630 unchanged questions, 600 unchanged other plans.");

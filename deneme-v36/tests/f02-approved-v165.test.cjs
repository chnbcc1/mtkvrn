"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/f02-approved-v165.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
const image=fs.readFileSync(path.join(root,"assets/f02-approved-v165.avif"));
assert(image.length>25_000&&image.length<180_000,"Approved F02 art missing or corrupted");
assert(image.toString("ascii",4,12).includes("ftypavif"),"F02 art is not the approved AVIF image");
assert.equal(bank.questions.length,630,"Never replace or alter approved question pool");
assert(!bank.questions.some(q=>q.followUp),"Unapproved inline follow-ups must not return");
new vm.Script(source);new vm.Script(ui);
const document={
  createElement:tag=>({tagName:tag,style:{},setAttribute(){},appendChild(){},classList:{add(){}}}),
  getElementById:()=>null,
  head:{appendChild(){}}
};
const scope={window:{},document,console};
vm.runInNewContext(source,scope);
const f02=scope.window.MTKF02ApprovedV165;
assert(f02&&typeof f02.render==="function"&&typeof f02.guide==="function"&&typeof f02.plan==="function");
const records=bank.questions.filter(q=>q.obstacleId==="F02");
assert.equal(records.length,30);
for(const d of ["kolay","orta","zor"])assert.equal(records.filter(q=>q.difficulty===d).length,10);
const allowed=new Set(["top","one","two","three","four"]);
for(const q of records){
  const plan=f02.plan(q);
  assert(plan&&plan.length>0&&plan.length<=5,q.id+" has invalid plaque plan");
  assert.equal(new Set(plan.map(p=>p.slot)).size,plan.length,q.id+" repeats a plaque");
  assert(plan.every(p=>allowed.has(p.slot)),q.id+" contains unknown plaque");
  const shown=plan.map(p=>p.value).join(" ");
  for(const l of q.visual.labels){
    assert(shown.includes(String(l.value)),q.id+" dropped "+l.anchor+"="+l.value);
  }
  const explanation=f02.guide(q);
  assert(explanation,q.id+" has no teaching explanation");
  assert.equal(explanation.first.length,2,q.id+" must have two first-hint steps");
  assert.equal(explanation.second.length,2,q.id+" must have two second-hint steps");
  assert(explanation.first.join(" ").length>50&&explanation.second.join(" ").length>40,q.id+" has non-teaching hints");
  assert.notEqual(explanation.first.join(" "),explanation.second.join(" "),q.id+" repeats hints");
  assert.equal(explanation.solution,String(q.solution||""),q.id+" changed approved solution");
  assert(q.options.includes(q.correctAnswer),q.id+" missing approved answer");
  assert.equal(q.visual.bakedIntoImage,false,q.id+" burned numbers into scene");
}
for(const q of records.filter(q=>q.visual.labels.some(e=>e.anchor==="basamak_sayısı"))){
 const count=Number(q.visual.labels.find(e=>e.anchor==="basamak_sayısı").value);
 assert.equal(f02.plan(q).length,count+1,"All live steps plus counter must be visible");
}
for(const q of records.filter(q=>q.visual.labels.some(e=>e.anchor==="basamak 4"))){
 assert.equal(f02.plan(q).length,4,"Four numeric steps must occupy four plaques");
 assert.equal(f02.plan(q).filter(e=>e.slot==="top").length,0,"No invented values in unused counter");
}
assert(ui.includes('window.MTKF02ApprovedV165?.render(visual,q)'),"F02 renderer must be mounted before legacy art");
assert(ui.includes("window.MTKF02ApprovedV165?.enhance(frame,q)"),"F02 must apply full-frame responsive layout");
assert(quiz.includes('f02-approved-v165.js?v=167'),"Quiz must load the current F02 renderer without stale iPhone cache");
 const energyExample=records.find(q=>q.id==="F02-O-06");
 const stepGuide=f02.guide(energyExample);
 const narration=stepGuide.first.join(" ")+stepGuide.second.join(" ");
 assert(narration.includes("1. basamak")&&narration.includes("2. basamak"),"Pedagogical hints must use ordinal steps");
 assert(!/sol basamak|sağ basamak|sol ve sağ basamak/i.test(narration),"Do not label the stair sequence as left and right");
 const labels=f02.plan(energyExample);
 assert(labels.some(x=>x.anchor==="1. basamak")&&labels.some(x=>x.anchor==="2. basamak"),"Dynamic plaque labels must describe first and second steps");
 assert(f02.positions.top.y>16&&f02.positions.one.y>65&&f02.positions.two.y>53,"Plaque labels must be centered vertically below decorative diamonds");
 assert(source.includes('mtk-help-foot')&&source.includes('mtk-help-body .mtk-teaching-step'),"F02 help card must have fixed controls and compact scrollable teaching steps");
 assert(source.includes('top:60.8%!important')&&source.includes('width:95.2%!important'),"F02 help card must cover all the lower question/answer region");
assert(source.includes('document.head.appendChild(ownCss)'),"F02 styles must take precedence over generic nth-child button positions");
assert(source.includes('scene.style.width="100%";scene.style.height="100%"'),"F02 scene must fit the viewport instead of cropping Çiko");
assert(!source.includes('Math.max(w,h*ratio)'),"Never draw an oversized F02 scene then crop it");
assert(source.includes('grid-template-columns:repeat(2,minmax(0,1fr))!important'),"F02 choices must use two contained columns");
assert(source.includes('position:static!important')&&source.includes('inset:auto!important'),"F02 choices must reset absolute per-answer positions");
assert(source.includes('object-fit:fill!important'),"F02 art and dynamic labels must share exactly one fully visible scaling box");
assert(source.includes('left:52%!important;top:63%!important'),"F02 landscape options must be inside the right panel");
assert(quiz.includes("window.MTKF02ApprovedV165?.guide(q)"),"Hint system must use approved F02 teaching steps");
assert(quiz.includes('!["F01","F02"].includes(q.obstacleId)'),"Second wrong may not display unrelated practice");
assert(source.includes("width:50%")&&source.includes("height:100%"),"F02 needs landscape left image/right question");
assert(source.includes("mtk-help-mode")&&source.includes("mtk-answer-help-card"),"F02 full-panel hints must not crowd the answers");
console.log("PASS F02 v165: 30 approved questions, five reusable plaques, pedagogical steps, responsive art, 630-question bank preserved.");

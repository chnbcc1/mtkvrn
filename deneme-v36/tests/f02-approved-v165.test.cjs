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
  assert(explanation.first.join(" ").length>75&&explanation.second.join(" ").length>65,q.id+" has non-teaching hints");
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
assert(quiz.includes('f02-approved-v165.js?v=165'),"Quiz must load selected F02 renderer");
assert(quiz.includes("window.MTKF02ApprovedV165?.guide(q)"),"Hint system must use approved F02 teaching steps");
assert(quiz.includes('!["F01","F02"].includes(q.obstacleId)'),"Second wrong may not display unrelated practice");
assert(source.includes("width:50%")&&source.includes("height:100%"),"F02 needs landscape left image/right question");
assert(source.includes("mtk-help-mode")&&source.includes("mtk-answer-help-card"),"F02 full-panel hints must not crowd the answers");
console.log("PASS F02 v165: 30 approved questions, five reusable plaques, pedagogical steps, responsive art, 630-question bank preserved.");

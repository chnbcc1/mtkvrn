"use strict";
// Current F03 research screen: source questions and live overlays, without the
// superseded v157 experiment that altered the approved character composition.
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const ui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
const frames=fs.readFileSync(path.join(root,"assets/quiz-approved-frames-v145.js"),"utf8");
const media=fs.readFileSync(path.join(root,"assets/quiz-f03-machine-v145.js"),"utf8");
new vm.Script(ui);
assert.equal(bank.questions.length,630);
assert.equal(bank.obstacles.length,21);
assert(quiz.includes('forest-questions-v147.json?v=160'),"Use the latest approved bank");
assert(quiz.includes('approved-quiz-ui-v145.js?v=160'),"Load the current renderer");
assert(!quiz.includes('research-layout-v157.js'),"Do not re-enable experimental F03 actor crops");
assert(!quiz.includes('research-layout-v157.css'),"Old F03 crop CSS must stay inactive");
assert(frames.includes('"portrait"')&&frames.includes('"landscape"'),"Approved character frames stay intact");
assert(media.includes('MTK_QUIZ_MEDIA_V145'),"Original F03 visual object must be present");
assert(ui.includes("isF03")&&ui.includes("MTK_QUIZ_MEDIA_V145"),"F03 must use the approved object layer");
assert(ui.includes('tag(visual,item.value,leftFor(item.anchor,i))'),"F03 figures must update from each new question");
assert(ui.includes("mtk-question-region")&&ui.includes("choiceGrid"),"Question and A–D stay real DOM elements");
const variants=bank.questions.filter(q=>q.obstacleId==="F03");
assert.equal(variants.length,30,"Ten approved F03 questions at each difficulty");
for(const level of ["kolay","orta","zor"]){
 const items=variants.filter(q=>q.difficulty===level);
 assert.equal(items.length,10);
 for(const q of items){
  assert(q.visual&&q.visual.bakedIntoImage===false,q.id+" cannot bake values into artwork");
  assert(Array.isArray(q.visual.labels)&&q.visual.labels.length>=2&&q.visual.labels.length<=5,q.id+" needs dynamic labels");
  assert.equal(q.options.length,4);
  assert(q.options.includes(q.correctAnswer));
 }
}
console.log("PASS F03: 30 source-approved questions, updated DOM labels, approved Erdem/Ciko frames, no obsolete v157 crop enabled.");
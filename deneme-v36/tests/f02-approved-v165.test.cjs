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
assert(quiz.includes('f02-approved-v165.js?v=169'),"Quiz must load the current F02 renderer without stale iPhone cache");
assert(quiz.includes('forest-questions-v147.json?v=169'),"Quiz must refresh corrected source question wording");
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
const ratioCase=records.find(q=>q.id==="F02-O-08");
const ratioPlan=f02.plan(ratioCase);
assert.equal(ratioPlan.length,4,"One source energy, one warning energy and two separate usage ratios must be visible");
assert.equal(ratioPlan.filter(x=>x.slot==="top").length,0,"Usage ratios must not look like a worked answer in the top summary plaque");
assert(ratioPlan.some(x=>x.value==="Kapı: 1/4")&&ratioPlan.some(x=>x.value==="Lamba: 1/4"),"The consumption ratios must match the revised question, as separate givens");
for(const [id,startExp,warningExp,expected] of [
 ["F02-O-02","2⁵","2⁴","20"],
 ["F02-O-05","2⁶","2⁵","40"],
 ["F02-O-08","2⁷","2⁶","80"]
]){
 const q=records.find(x=>x.id===id);
 assert(q&&q.prompt.includes(startExp)&&q.prompt.includes(warningExp+" birimin dörtte biri"),id+" must not reveal an intermediate result");
 assert.equal(q.correctAnswer,expected,id+" correct answer changed");
 assert.equal(q.visual.labels.find(x=>x.anchor==="uyarı").value,warningExp,id+" visual warning energy mismatch");
 assert.equal(q.visual.labels.find(x=>x.anchor==="uyarı kullanımı").value,"1/4",id+" visual warning ratio mismatch");
 const power=t=>Number([...t.slice(1)].map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));
 const total=2**power(startExp),warn=2**power(warningExp);
 assert.equal(total-total/4-warn/4,Number(expected),id+" revised math is incorrect");
 assert.notEqual(warn,total/4,id+" leaked the answer to the first step through the warning power");
 assert(f02.guide(q).first.join(" ").includes("dörtte biri"),id+" first hint must match revised fraction");
 assert(f02.guide(q).second.join(" ").includes(warn+" ÷ 4"),id+" worked intermediate hint must match the new data");
}

assert(source.includes('mtk-f02-practice-controls')&&source.includes('mtk-f02-practice-mode'),"The return-to-main-task button must have a dedicated non-overlapping row");
assert(source.includes('flex:1 1 auto!important')&&source.includes('flex:0 0 auto!important'),"Practice question must scroll independently of fixed return button");
assert(source.includes('padding:5px 8px 3px 8px!important')&&source.includes('text-indent:0!important'),"Each source question needs inset text to preserve all initial letters");
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

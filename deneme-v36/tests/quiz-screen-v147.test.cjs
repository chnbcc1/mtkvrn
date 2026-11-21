"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const ui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const art=fs.readFileSync(path.join(root,"assets/quiz-approved-frames-v145.js"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
const script=html.match(/<script>([\s\S]+?)<\/script><\/body>/)?.[1];
assert(script,"Quiz script missing");
new vm.Script(script,{filename:"forest-v70-quiz.html"});
new vm.Script(ui,{filename:"approved-quiz-ui-v145.js"});
assert.equal(bank.schema,"forest-question-bank-v147");
assert.equal(bank.questions.length,630);
assert.equal(bank.obstacles.length,21);
assert.equal(bank.playOrder.length,21);
assert.equal(bank.questionsPerObstaclePerDifficulty,10);
assert(art.includes("MTK_QUIZ_FRAMES_V145"),"Original approved Erdem and Ciko template must be retained");
for(const difficulty of ["kolay","orta","zor"]){
 const questions=bank.questions.filter(q=>q.difficulty===difficulty);
 assert.equal(questions.length,210,difficulty+" must have 210 approved questions");
 for(const id of bank.playOrder)assert.equal(questions.filter(q=>q.obstacleId===id).length,10,id+" "+difficulty);
}
for(const q of bank.questions){
 assert.equal(q.options.length,4,q.id+" needs 4 options");
 assert(q.options.includes(q.correctAnswer),q.id+" answer must be in options");
 assert(q.fixedChoiceOrder,q.id+" must preserve A-D key from source ZIP");
 assert(q.contentVersion==="v147-approved-packs");
 assert(q.visual?.bakedIntoImage===false);
 assert(q.prompt&&q.solution&&q.hint);
}
assert(html.includes("forest-questions-v147.json"),"Quiz must load only the new approved bank");
assert(html.includes('item.contentVersion!=="v147-approved-packs"'),"The game accepts only the 630 approved records");
assert(html.includes("run.matchingById")===false,"Persistent matching state belongs to the UI renderer");
assert(html.includes("mount(app,q,s,choices,run,save)"));
assert(html.includes("mount(app,q,s,doneChoices,run,save)"));
assert(html.includes("q.workedExample"),"Second-wrong worked example must come from the approved ZIP");
assert(ui.includes("mtk-scene-labels"),"Use exact uploaded dynamic labels");
assert(ui.includes("matchingBoard(visual,q,choices,run,save)"),"F21 touch matching must work");
assert(ui.includes("frame.appendChild(extra)"),"Hints must overlay all four answer choices");
assert(html.includes("Soruyu göster")&&html.includes("Benzer soru çöz"),"Hints return to original question; one approved practice action remains");
assert(ui.includes("aspect-ratio:941/1672")&&ui.includes("aspect-ratio:1672/941"),"Approved portrait and landscape layouts remain");
const f03=bank.questions.find(q=>q.id==="F03-Z-01");
assert(f03.prompt.includes("2¹³ birim sis giriyor"));
assert.deepEqual(f03.options,["16","8","4","32"]);
assert.equal(f03.correctAnswer,"4");
assert.equal(f03.visual.labels.length,5);
const matching=bank.questions.filter(q=>q.interaction?.kind==="matching_unmatched");
assert.equal(matching.length,30,"10 matching variants per difficulty");
for(const q of matching){
 assert.equal(q.interaction.radicalItems.length,5);
 assert.equal(q.interaction.exponentItems.length,5);
 assert.equal(q.interaction.pairs.length,4);
 assert.equal(q.interaction.requiredPairs,4);
}
assert(!html.includes("Kaynak paketteki benzer soru"),"The unapproved inline follow-up must not be shown");
assert(!html.includes("Başka bir onaylı soruyu çöz"),"The duplicate practice action must be removed");
assert(ui.includes("mtk-help-mode")&&ui.includes("mtk-answer-help-card"),"Hint must cover, not erase, four choices");
/* F01: no vague reused hints; all 30 approved variants need two real learning steps
   and a final dynamically verified explanation. */
const lessonBegin=script.indexOf('function f01Growth(q){');
const lessonEnd=script.indexOf('function example(q){',lessonBegin);
assert(lessonBegin>=0&&lessonEnd>lessonBegin,"F01 teaching methods must be present");
const lesson={};
vm.runInNewContext(script.slice(lessonBegin,lessonEnd),lesson);
const vines=bank.questions.filter(q=>q.obstacleId==="F01");
assert.equal(vines.length,30);
for(const q of vines){
 const guide=lesson.f01Guide(q);
 assert(guide,q.id+" has no tailored hint");
 assert(guide.first.length>=2&&guide.second.length>=2,q.id+" needs different progressive explanations");
 assert(guide.first.join(" ").length>=65&&guide.second.join(" ").length>=55,q.id+" needs a useful worked learning path");
 assert(guide.solution.length>=22,q.id+" needs a computed solution matching the approved answer");
}
const f01art=fs.readFileSync(path.join(root,"assets/f01-approved-v159.js"),"utf8");
assert(f01art.includes("top:54.4%!important")&&f01art.includes("height:42.0%!important"),"F01 help must cover both question text and all four answers");
assert(ui.includes("mtk-help-foot")&&ui.includes("mtk-help-body"),"Navigation controls must stay visible when the hint scrolls");
assert(ui.includes("mtk-inline-hint-trigger")&&ui.includes("text.appendChild(extra)"),"Closed hint control must sit inside the question panel, not over answer A");
/* F02 v172: the picture gets half the portrait frame, not 60%+.
   Hint and practice buttons must not consume the question-scroll viewport. */
const f02=fs.readFileSync(path.join(root,"assets/f02-approved-v165.js"),"utf8");
new vm.Script(f02);
const f02Css=[...f02.matchAll(/style\\.textContent(?:\\+)?="((?:\\\\.|[^"\\\\])*)";/g)]
 .map(m=>JSON.parse('"'+m[1]+'"')).join("\n");
assert(f02Css.includes("F02 v172: portrait 50/50 split"),"F02 half-screen split missing");
assert(/\\.mtk-visual-region\\s*\\{[^}]*height:50%!important/s.test(f02Css),"F02 picture must occupy exactly half the portrait height");
assert(/\\.mtk-f02-toolbar-mode>\\.mtk-question-region\\s*\\{[^}]*height:21\\.6%!important/s.test(f02Css),"F02 practice text needs its own scroll area");
assert(/\\.mtk-f02-practice-controls\\s*\\{[^}]*top:73\\.1%!important/s.test(f02Css),"F02 buttons must occupy an independent row");
assert(/\\.choiceGrid\\s*\\{[^}]*top:81\\.8%!important/s.test(f02Css),"F02 choices must remain below the independent toolbar");
assert(f02.includes("frame.appendChild(inlineControls)"),"Hint/return buttons cannot remain inside the question text box");
assert(f02.includes("İpucunu göster")&&f02.includes("Ana göreve dön"),"Both navigation controls must be recognized");
assert(html.includes("f02-approved-v165.js?v=172"),"F02 v172 must be loaded by the quiz");
console.log("PASS v147: exactly 630 user-approved questions, source hints/answers, approved layouts, F03 and F21 matching.");

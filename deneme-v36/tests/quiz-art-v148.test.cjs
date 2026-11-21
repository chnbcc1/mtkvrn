"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const forest=fs.readFileSync(path.join(root,"forest-v113-full.html"),"utf8");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const menu=fs.readFileSync(path.join(root,"menu-v116.html"),"utf8");
const ui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const art=fs.readFileSync(path.join(root,"assets/quiz-research-objects-v148.js"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
new vm.Script(ui);
new vm.Script(art);
const scope={window:{}};vm.runInNewContext(art,scope);
const assets=scope.window.MTK_RESEARCH_OBJECTS_V148;
assert(assets?.F01&&assets?.F02,"Both approved objects must be embedded");
for(const [key,src] of Object.entries(assets)){
  assert(/^data:image\/webp;base64,/.test(src),"Portable alpha WebP required: "+key);
  const bytes=Buffer.from(src.slice("data:image/webp;base64,".length),"base64");
  assert(bytes.length>50_000,"Asset unexpectedly compressed or missing: "+key);
  assert.equal(bytes.subarray(0,4).toString(),"RIFF");
  assert.equal(bytes.subarray(8,12).toString(),"WEBP");
}
assert.equal(bank.questions.length,630,"Approved question bank must remain intact");
for(const id of ["F01","F02"]){
  const list=bank.questions.filter(q=>q.obstacleId===id);
  assert.equal(list.length,30,id+" must have 10 easy, medium and hard questions");
  for(const diff of ["kolay","orta","zor"])assert.equal(list.filter(q=>q.difficulty===diff).length,10);
  for(const q of list){
    assert(q.visual?.bakedIntoImage===false,q.id+" may not bake mathematical values into art");
    assert(Array.isArray(q.visual?.labels)&&q.visual.labels.length>=2&&q.visual.labels.length<=5,q.id+" missing plaque data");
  }
}
assert(/renderResearchObject\(visual,q(?:,text)?\)/.test(ui),"3D asset integration must run before the old placeholder");
assert(ui.includes("mtk-research-object"),"Reusable object layer missing");
assert(ui.includes("mtk-research-value"),"Dynamic label layer missing");
assert(ui.includes('label.textContent=String(item.value??"")'),"Values must come from question data");
assert(ui.includes('p.mini?" small-plaque"'),"Small plaques must not receive generic badge CSS");
assert(quiz.includes("quiz-research-objects-v148.js?v=148"),"Quiz must load new assets");
assert(/approved-quiz-ui-v145\.js\?v=(148|149|150|151|152|153|154|155|156)/.test(quiz),"Quiz must load updated positioning code");
assert(quiz.includes("forest-questions-v147.json?v=147"),"Approved data must remain the source");
assert(/forest-v70-quiz\.html\?v=(148|149|150|151|152|153|154|155|156)/.test(forest),"Forest needs current question UI");
assert(/forest-v113-full\.html\?v=(148|149|150|151|152|153|154|155|156)/.test(home),"Home needs current forest page");
assert(/forest-v113-full\.html\?resume=1&v=(148|149|150|151|152|153|154|155|156)/.test(menu),"Menu needs current forest page");
assert(ui.includes("aspect-ratio:941/1672")&&ui.includes("aspect-ratio:1672/941"),"Both approved orientation frames must be retained");
console.log("PASS F01/F02 v148: 2 real 3D assets, semantic plaque overlays, 60 approved questions, portrait/landscape, 630 preserved.");

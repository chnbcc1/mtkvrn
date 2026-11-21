"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const gameUI=fs.readFileSync(path.join(root,"assets/game-ui-v133.js"),"utf8");
const menu=fs.readFileSync(path.join(root,"menu-v116.html"),"utf8");
const forest=fs.readFileSync(path.join(root,"forest-v113-full.html"),"utf8");
const house=fs.readFileSync(path.join(root,"index.html"),"utf8");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
new vm.Script(gameUI);
const quizCode=quiz.match(/<script>([\s\S]+?)<\/script><\/body>/)?.[1];
assert(quizCode,"Quiz inline code is available");
new vm.Script(quizCode);
function storage(initial){
 const m=new Map(Object.entries(initial));
 return {
  getItem:k=>m.get(k)??null,
  setItem:(k,v)=>m.set(k,String(v)),
  removeItem:k=>m.delete(k),
  key:i=>[...m.keys()][i]??null,
  get length(){return m.size},
  dump:()=>Object.fromEntries(m)
 };
}
function context(saved){
 const localStorage=storage(saved),window={};
 const box={window,localStorage,console};
 vm.runInNewContext(gameUI,box);
 return {localStorage,ui:window.MTKGameUI};
}
const prefs='{"sound":false,"vibration":true}';
const fresh={
 "mathverse-v40-investigation":JSON.stringify({complete:true,visitedStudy:true,chapter2:{stage:"forest-path"},activeScene:"forest-path"}),
 "mathverse-v68-forest-full":JSON.stringify({token:"old-session",solvedIds:["F01"],x:500}),
 "mathverse-v128-chapter-milestones":JSON.stringify({at:"some-point"}),
 "mathverse-v147-quiz-old-session-F01-orta":JSON.stringify({wrong:3,revealed:true}),
 "mathverse-v147-quiz-old-session-F02-zor":JSON.stringify({wrong:2}),
 "mathverse-v147-choice-run":JSON.stringify({wrong:3,revealed:true}),
 "mathverse-v147-choice-history":JSON.stringify({seen:["F01"]}),
 "mathverse-v70-quiz-test":JSON.stringify({wrong:2}),
 "mathverse-v65-choice-run":JSON.stringify({wrong:1}),
 "mathverse-v116-settings":prefs
};
{
 const {ui,localStorage}=context(fresh);
 assert.equal(ui.resetProgress("game"),true);
 const data=localStorage.dump();
 assert.deepEqual(Object.keys(data),["mathverse-v116-settings"],"Full reset removes all current and legacy progress, not preferences");
 assert.equal(data["mathverse-v116-settings"],prefs,"Sound/vibration preferences are preserved");
}
{
 const {ui,localStorage}=context(fresh);
 assert.equal(ui.resetProgress("chapter","forest"),true);
 const data=localStorage.dump();
 assert(!data["mathverse-v68-forest-full"]);
 assert(!data["mathverse-v147-quiz-old-session-F01-orta"],"Reveal state must not reopen after chapter restart");
 assert(!data["mathverse-v147-choice-run"]);
 assert(!data["mathverse-v147-choice-history"]);
 assert(!data["mathverse-v128-chapter-milestones"]);
 const home=JSON.parse(data["mathverse-v40-investigation"]);
 assert.equal(home.complete,true,"The completed house chapter is preserved when only forest resets");
 assert.equal(home.chapter2,undefined,"Forest restart clears the home chapter pointer");
 assert.equal(home.activeScene,"home");
 assert.equal(data["mathverse-v116-settings"],prefs);
}
{
 const {ui,localStorage}=context(fresh);
 assert.equal(ui.resetProgress("chapter","home"),true);
 const data=localStorage.dump();
 assert(!data["mathverse-v40-investigation"]);
 assert(data["mathverse-v68-forest-full"],"Home-only restart does not clear forest");
}
assert(menu.includes("window.MTKGameUI.resetProgress('game')"),"Main menu New Game uses full reset");
assert(menu.includes("menuRestartChapter"),"Main menu chapter button is wired");
assert(forest.includes("suppressForestExitSave=true"),"Forest exit must not restore a deleted save");
assert(forest.includes("event.persisted&&!$(\"#quizOverlay\").hidden)closeQuiz()"),"Restoring an old iPhone browser tab must dismiss its stale quiz overlay");
assert(forest.includes("resetProgress(all?'game':'chapter','forest')"));
assert(house.includes("window.MTKGameUI?.resetProgress('game')"),"Home restart uses identical reset");
assert(house.includes("suppressProgressSave=true"),"Home exit must not restore a deleted save");
assert(menu.includes("game-ui-v133.js?v=152")&&forest.includes("game-ui-v133.js?v=152")&&house.includes("game-ui-v133.js?v=152"),"iPhone must use current reset code in all chapters");
assert(quizCode.includes("if(standalone&&!preview){location.replace(\"./menu-v116.html?v=152\");return}"),"Direct historical quiz links open the main menu");
assert(quizCode.includes("const saved=preview?null:read(RUN_KEY)"),"Explicit standalone previews must not restore wrong/revealed state");
assert(quiz.includes("mathverse-v147-quiz-"),"Current quiz storage key is covered");
assert.equal(bank.questions.length,630);
assert.equal(bank.obstacles.length,21);
assert(gameUI.includes("mathverse-v147-choice-history"));
console.log("PASS v152: new game, forest chapter restart, home restart, old direct-quiz redirect, no stale wrong answers; original 630 questions preserved.");

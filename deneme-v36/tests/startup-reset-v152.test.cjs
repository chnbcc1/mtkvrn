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
assert(quizCode.includes('const FRESH_ATTEMPT=EMBED&&new URLSearchParams(location.search).get("fresh")==="1";'),"Only explicit legacy preview links may request a forced fresh session");
assert(quizCode.includes("const saved=(preview||FRESH_ATTEMPT)?null:read(RUN_KEY)"),"Ordinary in-game reentry must restore question while explicitly fresh preview can reset");
assert(forest.includes('const qs=new URLSearchParams({embedded:"1",obstacle:id,difficulty,session:RUN_TOKEN})'),"In-game magnifier must reopen its existing unfinished question");
assert(!forest.includes('embedded:"1",fresh:"1"'),"In-game magnifier must not force a fresh question on every click");
const freshLine=quizCode.match(/const FRESH_ATTEMPT=[^\n]+;/)?.[0];
const savedLine=quizCode.match(/const saved=\(preview\|\|FRESH_ATTEMPT\)\?null:read\(RUN_KEY\);/)?.[0];
assert(freshLine&&savedLine);
for(const [search,expectFresh] of [["?embedded=1&fresh=1",true],["?embedded=1",false],["?fresh=1",false]]){
 const state=vm.runInNewContext('const EMBED=new URLSearchParams(location.search).get("embedded")==="1";'+freshLine+'const preview=false;const RUN_KEY="existing";const read=()=>({wrong:3,revealed:true});'+savedLine+'({fresh:FRESH_ATTEMPT,saved})',{location:{search},URLSearchParams});
 assert.equal(state.fresh,expectFresh);
 if(expectFresh)assert.equal(state.saved,null,"New magnifier attempt must not show the third-error solution");
 else assert.equal(state.saved.wrong,3,"Existing session remains resumable when not requesting fresh");
}
assert(quiz.includes("mathverse-v147-quiz-"),"Current quiz storage key is covered");
assert.equal(bank.questions.length,630);
assert.equal(bank.obstacles.length,21);
assert(forest.includes('$("#quizOverlay").dataset.preparing="1"'),"A cold quiz iframe may briefly preload without showing old HTML");
assert(forest.includes('#quizOverlay[data-preparing="1"] .quizWrap{opacity:0!important;pointer-events:none!important}'),"Preloading iframe must stay paintable on WebKit, rather than invisible");
assert(forest.includes('quizRevealTimer=setTimeout(revealQuizIfMounted,450)'),"Cold magnifier must have a short reveal safety net");
assert(forest.includes('function revealQuizIfMounted()'),"Magnifier reveal fallback must exist");
assert(forest.includes('clearTimeout(quizRevealTimer)'),"Closing or finishing a question must cancel recovery timer");
assert(forest.includes('forest-v70-quiz.html?v=160'),"Forest loads repaired embedded question route");
assert(forest.includes('d.event==="ready"||d.event==="load-error"'),"Parent must reveal only after its child signals readiness or error");
assert(forest.includes('$("#quizOverlay").removeAttribute("data-preparing")'),"Parent must reveal the finished quiz");
assert(quizCode.includes("function announceQuizVisualReady()"),"Iframe announces when approved art is ready");
assert(quizCode.includes('pictures.map(decode)'),"Both the approved frame and research object must decode before reveal");
assert(quizCode.includes('announceQuizVisualReady();'),"Iframe actually sends readiness signal");
assert(quizCode.includes("Promise.race([imagesReady,safetyLimit])"),"WebKit image decode cannot indefinitely prevent showing the approved frame");
assert(quizCode.includes("setTimeout(resolve,650)"),"Image decode must have a short fallback");
assert(!quizCode.includes('requestAnimationFrame(()=>requestAnimationFrame(()=>send("ready")))'),"Hidden iframe animations must not block readiness in WebKit");

assert(gameUI.includes("mathverse-v147-choice-history"));
console.log("PASS v152/v156: full/chapter restart, same unfinished in-game question after leaving, explicit fresh previews, original 630 questions preserved.");

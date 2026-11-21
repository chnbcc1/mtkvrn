"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const forest=fs.readFileSync(path.join(root,"forest-v113-full.html"),"utf8");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
assert.equal(bank.questions.length,630);
assert.equal(bank.obstacles.length,21);
assert(quiz.includes('fetch(BANK_URL,{cache:"force-cache"})'),"Immutable approved bank should use browser cache");
assert(quiz.includes('const saved=(preview||FRESH_ATTEMPT)?null:read(RUN_KEY)'),"Ordinary in-game reentry must restore same question");
assert(!forest.includes('embedded:"1",fresh:"1"'),"Magnifier must not discard question on reentry");
assert(forest.includes('const qs=new URLSearchParams({embedded:"1",obstacle:id,difficulty,session:RUN_TOKEN})'));
assert(forest.includes('warmUpcomingQuiz();'),"Prepare the upcoming gate while walking");
assert(!forest.includes('quizRevealTimer=setTimeout(revealQuizIfMounted,2200)'),"Do not wait 2.2s for question");
assert(forest.includes('#quizOverlay[hidden]{display:block!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}'),"The prewarmed iframe stays laid out without blocking forest controls");

assert(forest.includes('quizRevealTimer=setTimeout(revealQuizIfMounted,450)'),"Cold-iframe safety wait must be short");
const start=forest.indexOf("let quizRevealTimer=null;"),end=forest.indexOf('$("#quizClose").onclick=closeQuiz;',start);
assert(start>=0&&end>start,"Warm-up and quiz opening logic must exist");
const source=forest.slice(start,end);
new vm.Script(source);
const writes=[];
const frame={
 _src:"about:blank",
 set src(v){this._src=String(v);writes.push(String(v))},
 get src(){return this._src},
 contentDocument:{body:{classList:{contains:()=>true}},querySelector:()=>({})}
};
const overlay={hidden:true,dataset:{},removeAttribute(k){if(k==="data-preparing")delete this.dataset.preparing}};
const title={textContent:""};
const nodes={"#quizFrame":frame,"#quizOverlay":overlay,"#quizTitle":title};
const timers=[],cleared=[],state={last:7};
const context={
 RUN_TOKEN:"fixed-session-2026",difficulty:"orta",SOLVED:new Set(),
 GATES:[{id:"F01",index:0,icon:"🌿",label:"Sarmaşık"},{id:"F02",index:1,icon:"💎",label:"Basamak"}],
 started:true,introDone:true,modalOpen:false,quizActiveId:null,requested:0,activePointers:{clear(){}},
 updatePress(){},save(){},last:7,
 $:(selector)=>{assert(nodes[selector],"Unknown selector "+selector);return nodes[selector]},
 URLSearchParams,clearTimeout:(id)=>cleared.push(id),setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length}
};
const api=vm.runInNewContext(source+";({warmUpcomingQuiz,prepareQuiz,openQuiz,closeQuiz,getPrepared:()=>quizPrepared})",context);
api.warmUpcomingQuiz();
assert.equal(writes.length,1,"The upcoming obstacle should load before the magnifier click");
assert(writes[0].includes("obstacle=F01")&&writes[0].includes("v=167"));
assert(!writes[0].includes("fresh="),"No fresh reset is allowed for an unfinished question");
api.getPrepared().ready=true;
api.openQuiz("F01");
assert.equal(overlay.hidden,false);
assert.equal(writes.length,1,"Prewarmed F01 opens without navigation or refetch");
assert.equal(context.quizActiveId,"F01");
assert.equal(context.modalOpen,true);
assert.equal(overlay.dataset.preparing,undefined,"Ready question appears immediately");
api.closeQuiz();
assert.equal(overlay.hidden,true);
assert.equal(context.quizActiveId,null);
assert.equal(writes.length,1,"Patikaya dön keeps the existing iframe and question");
api.openQuiz("F01");
assert.equal(writes.length,1,"Returning to the same F01 must not choose a new question");
assert.equal(frame.src,writes[0],"Question URL remains identical after reopening");
api.closeQuiz();
context.SOLVED.add("F01");
api.warmUpcomingQuiz();
assert.equal(writes.length,2,"After completing F01, F02 is prepared in the background");
assert(writes[1].includes("obstacle=F02"));
api.openQuiz("F02");
assert.equal(writes.length,2,"F02 click should reuse the already preparing iframe");
assert.equal(timers.at(-1).ms,450,"Cold reveal fallback must be much shorter than 2.2 seconds");
console.log("PASS v156: 630 approved questions, prewarmed F01, immediate magnifier, same question after Patikaya dön, next gate prefetch, 450ms safety wait.");

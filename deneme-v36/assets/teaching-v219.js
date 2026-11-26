/* v219: source-grounded examples and staged question feedback state. */
(function(root){
const api=(function buildAPI(){
"use strict";
const text=v=>String(v??"").trim();
const norm=v=>text(v).toLocaleLowerCase("tr").replace(/\s+/g," ");
const labels=q=>(q?.visual?.labels||[]).map(l=>({anchor:text(l.anchor),value:text(l.value)}));
const labelKey=q=>labels(q).map(l=>norm(l.value)).sort().join("|");
const signature=q=>norm(q?.prompt)+"|"+labelKey(q);
function eligible(q,p){
 return !!p&&p.id!==q.id&&p.obstacleId===q.obstacleId&&p.difficulty===q.difficulty&&p.contentVersion==="v147-approved-packs"&&!!text(p.prompt)&&!!text(p.solution)&&signature(p)!==signature(q)&&labelKey(p)!==labelKey(q);
}
function similar(q,questions,{avoidAnswer=false,exclude=[]}={}){
 const pool=questions.filter(p=>eligible(q,p)&&!exclude.includes(p.id)&&(!avoidAnswer||norm(q.correctAnswer)!==norm(p.correctAnswer)));
 const algebra=q.f01AlgebraRevision==="v233"&&labels(q).some(l=>l.value.includes("ⁿ"));
 const related=pool.filter(p=>algebra? p.f01AlgebraRevision==="v233"&&labels(p).some(l=>l.value.includes("ⁿ")):p.topic===q.topic);
 const choice=related.length?related:pool;
 return choice.length?choice[(Number(q.variant)||0)%choice.length]:null;
}
function workedExample(q,questions){
 // Use a genuinely different source question and show its own scene labels.
 // A same-answer exercise can unintentionally reveal the current answer.
 const p=similar(q,questions,{avoidAnswer:true});
 if(!p)return null;
 return {id:p.id,prompt:p.prompt,solution:solution(p),labels:labels(p).map(l=>p.obstacleId==="F01"&&l.anchor==="sol geçit"?{...l,anchor:"aktarılan pay"}:l),sourceVerified:true};
}
function f16Solution(q){
 if(q.id!=="F16-Z-01")return null;
 const expected=["A: √18 + √8 = 4√2","B: √75 − √12 = √63","C: (√5 + √2)(√5 − √2) = 3","D: √48 ÷ √3 = 8"];
 if(labels(q).map(x=>x.value).join("|")!==expected.join("|")||q.correctAnswer!=="C levhası")return null;
 return "A: √18 + √8 = 3√2 + 2√2 = 5√2; levhada 4√2 yazdığı için yanlış. B: √75 − √12 = 5√3 − 2√3 = 3√3; √63 ile eşit değildir, yanlış. C: (√5 + √2)(√5 − √2) = 5 − 2 = 3; doğru. D: √48 ÷ √3 = √16 = 4; levhada 8 yazdığı için yanlış. Doğru cevap C levhasıdır.";
}
function solution(q){return f16Solution(q)||text(q.solution);}
function duplicateReport(questions){
 const seen=new Map(),duplicates=[];
 for(const q of questions){const key=q.obstacleId+"|"+q.difficulty+"|"+signature(q);if(seen.has(key))duplicates.push({id:q.id,original:seen.get(key)});else seen.set(key,q.id);}
 return duplicates;
}
function initial(id){return {id,wrong:0,wrongChoices:[],stageCorrect:false,revealed:false,helpView:false};}
function answer(state,q,choice,{practice=false}={}){
 if(state.id!==q.id||state.stageCorrect||state.revealed||!q.options.includes(choice)||state.wrongChoices.includes(choice))return {state,taskWrongDelta:0,kind:"ignored"};
 if(choice===q.correctAnswer)return {state:{...state,stageCorrect:true,helpView:false},taskWrongDelta:0,kind:"correct"};
 const wrong=state.wrong+1;
 return {state:{...state,wrong,wrongChoices:[...state.wrongChoices,choice],revealed:wrong>=3,helpView:true},taskWrongDelta:practice?0:1,kind:wrong===1?"hint":wrong===2?"example":"solution"};
}
return Object.freeze({labels,labelKey,signature,eligible,similar,workedExample,solution,duplicateReport,initial,answer});
})();
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKTeachingV219=api;
})(typeof window!=="undefined"?window:globalThis);

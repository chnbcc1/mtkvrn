const assert=require('node:assert/strict');
const api=require('../assets/teaching-v219.js');
const bank=require('../forest-questions-v147.json');
const stats=(function runTests(api,b,check){
 const qs=b.questions;check(qs.length===630,"630");
 let examples=0,states=0,practiceChecks=0,sourceFields=0;
 for(const q of qs){
  check(q.options?.length===4&&new Set(q.options).size===4&&q.options.includes(q.correctAnswer)&&q.hint?.trim()&&q.solution?.trim(),q.id+" fields");sourceFields++;
  const p=api.workedExample(q,qs);
  if(p){const source=qs.find(x=>x.id===p.id);check(api.eligible(q,source)&&source.correctAnswer!==q.correctAnswer&&p.prompt===source.prompt&&p.solution===source.solution&&JSON.stringify(p.labels)===JSON.stringify(api.labels(source)),q.id+" example");examples++}
  const s=api.similar(q,qs);check(api.eligible(q,s),q.id+" similar");
  let st=api.initial(q.id);
  const wrong=q.options.filter(x=>x!==q.correctAnswer);
  for(let i=0;i<3;i++){
   const r=api.answer(st,q,wrong[i]);check(r.kind===["hint","example","solution"][i]&&r.taskWrongDelta===1&&r.state.wrong===i+1&&r.state.revealed===(i===2),q.id+" progression");states++;
   const duplicate=api.answer(r.state,q,wrong[i]);check(duplicate.kind==="ignored"&&duplicate.taskWrongDelta===0,q.id+" duplicate");st=r.state;
  }
  check(api.answer(st,q,q.correctAnswer).kind==="ignored",q.id+" revealed");
  let fresh=api.initial(s.id);check(fresh.wrong===0&&!fresh.revealed&&!fresh.stageCorrect,q.id+" reset");
  let r=api.answer(fresh,s,s.options.find(v=>v!==s.correctAnswer),{practice:true});
  check(r.taskWrongDelta===0&&r.state.wrong===1,q.id+" practice");practiceChecks++;
  check(api.answer(r.state,s,s.correctAnswer,{practice:true}).kind==="correct",q.id+" practice success");
  check(api.answer(api.initial(q.id),q,q.correctAnswer).kind==="correct",q.id+" correct");
 }
 const fixed=api.solution(qs.find(q=>q.id==="F16-Z-01"));
 check(fixed.includes("levhada 4√2")&&fixed.includes("Doğru cevap C levhasıdır"),"F16 explanation");
 return {sourceFields,examples,states,practiceChecks,duplicates:api.duplicateReport(qs),placeholder:qs.filter(q=>/^çözülmüş benzer örnek$/iu.test(q.workedExample?.question||"")).length};
})(api,bank,(v,m)=>assert.ok(v,m));
console.log('PASS v219 feedback data',JSON.stringify(stats));

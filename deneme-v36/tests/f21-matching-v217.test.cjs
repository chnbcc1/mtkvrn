const assert=require('node:assert/strict');
const api=require('../assets/f21-matching-v217.js');
const bank=require('../forest-questions-v147.json');
const stats=(function runTests(api,bank,check){
  const qs=bank.questions.filter(q=>q.obstacleId==="F21");check(qs.length===30,"30 F21");
  for(const level of ["kolay","orta","zor"])check(qs.filter(q=>q.difficulty===level).length===10,level);
  let correct=0,wrong=0,restored=0;
  for(const q of qs){
    const d=q.interaction,m=api.create(q);check(!!m,q.id);
    check(q.visual.labels.map(l=>l.value).join("|")===[...d.radicalItems,...d.exponentItems].join("|"),q.id+" labels");
    check(m.remaining()===null&&!m.snapshot().ready,q.id+" locked");
    for(const r of d.radicalItems)for(const e of d.exponentItems){
      if(d.pairs.some(p=>p.radical===r&&p.exponent===e))continue;
      const bad=api.create(q);bad.activate("radical",r);check(bad.activate("exponent",e).kind==="wrong"&&bad.snapshot().count===0,q.id+" wrong");wrong++;
    }
    for(const [i,p] of d.pairs.entries()){
      const first=i%2?"exponent":"radical",second=i%2?"radical":"exponent";
      check(m.activate(first,p[first]).kind==="selected",q.id+" select");
      check(m.activate(second,p[second]).kind===(i===3?"ready":"paired"),q.id+" pair");
      check(m.pairIndex("radical",p.radical)===i&&m.pairIndex("exponent",p.exponent)===i,q.id+" color");
      check(m.activate(first,p[first]).kind==="ignored",q.id+" reuse");
      check(m.snapshot().ready===(i===3),q.id+" unlock");correct++;
      const resumed=api.create(q,{pairs:[...m.snapshot().pairs,[d.unmatchedRadical,d.unmatchedExponent]]});
      check(JSON.stringify(resumed.snapshot().pairs)===JSON.stringify(m.snapshot().pairs),q.id+" restore");restored++;
    }
    check(m.remaining().radical===d.unmatchedRadical&&m.remaining().exponent===d.unmatchedExponent,q.id+" unmatched");
    const fresh=api.create(q);check(fresh.snapshot().count===0,q.id+" reset");
    const v=d.radicalItems[0];fresh.activate("radical",v);check(fresh.activate("radical",v).kind==="deselected",q.id+" deselect");
  }
  return {questions:qs.length,correct,wrong,restored};
})(api,bank,(v,m)=>assert.ok(v,m));
console.log('PASS v217 matching state',JSON.stringify(stats));

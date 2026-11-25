const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json");
const layout=require("../assets/scene-plan-v213.js");
const ids=["F01","F02","F03","F21"];
let questions=0,labels=0;
assert.equal(bank.questions.length,630);
for(const id of ids){
 const group=bank.questions.filter(q=>q.obstacleId===id);
 assert.equal(group.length,30,id);
 for(const q of group){
  const p=layout.plan(q);assert(p,q.id);
  assert.equal(p.labels.length,q.visual.labels.length,q.id);
  assert.equal(new Set(p.labels.map(x=>x.slot)).size,p.labels.length,q.id);
  for(let i=0;i<p.labels.length;i++){
   const l=p.labels[i],v=q.visual.labels[i];assert.equal(l.anchor,v.anchor);assert.equal(l.value,v.value);
   const [x,y,w,h]=l.box;assert(w>0&&h>0&&x-w/2>=0&&y-h/2>=0&&x+w/2<=100&&y+h/2<=100,q.id);
  }
  if(id==="F21"){assert(p.matching);assert.equal(q.interaction.pairs.length,4);assert.equal(p.labels.length,10);assert.equal(q.interaction.radicalItems.length,5);assert.equal(q.interaction.exponentItems.length,5);for(let i=0;i<10;i++){assert.equal(p.labels[i].value,[...q.interaction.radicalItems,...q.interaction.exponentItems][i]);assert.equal(p.labels[i].slot,i);}}
  questions++;labels+=p.labels.length;
 }
}
assert.equal(questions,120);assert.equal(labels,610);
console.log("PASS v213: 120 questions and 610 unchanged labels with unique valid slots");

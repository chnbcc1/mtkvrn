const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json");
const layout=require("../assets/scene-plan-v214.js");
assert.equal(bank.questions.length,630);
assert.equal(bank.playOrder.length,21);
assert.equal(Object.keys(layout.scenes).length,21);
assert.equal(new Set(Object.values(layout.scenes).map(s=>s.file)).size,21);
let questions=0,labels=0,patterns=0;
for(const id of bank.playOrder){
 const group=bank.questions.filter(q=>q.obstacleId===id),s=layout.scenes[id],keys=new Set();
 assert.equal(group.length,30,id);
 for(const difficulty of ["kolay","orta","zor"])assert.equal(group.filter(q=>q.difficulty===difficulty).length,10,id);
 for(const q of group){
  const p=layout.plan(q);assert(p,q.id);keys.add(q.visual.labels.map(l=>l.anchor).join("|"));
  assert.equal(p.file,s.file,q.id);
  assert.equal(p.character,"erdem-ciko-onayli-v180.png",q.id);
  assert.equal(p.labels.length,q.visual.labels.length,q.id);
  assert.equal(new Set(p.labels.map(x=>x.slot)).size,p.labels.length,q.id);
  for(let i=0;i<p.labels.length;i++){
   const l=p.labels[i],v=q.visual.labels[i];assert.equal(l.anchor,v.anchor,q.id);assert.equal(l.value,v.value,q.id);
   const [x,y,w,h]=l.box;assert(l.box.every(Number.isFinite)&&w>0&&h>0&&x-w/2>=0&&y-h/2>=0&&x+w/2<=100&&y+h/2<=100,q.id);
   for(let j=0;j<i;j++){const [a,b,c,d]=p.labels[j].box;assert(Math.abs(x-a)>=(w+c)/2-1e-9||Math.abs(y-b)>=(h+d)/2-1e-9,q.id+" overlapping label boxes");}
  }
  if(id==="F21"){assert(p.matching,q.id);assert.equal(q.interaction.pairs.length,4,q.id);assert.equal(p.labels.length,10,q.id);assert.equal(q.interaction.radicalItems.length,5);assert.equal(q.interaction.exponentItems.length,5);for(let i=0;i<10;i++){assert.equal(p.labels[i].value,[...q.interaction.radicalItems,...q.interaction.exponentItems][i]);assert.equal(p.labels[i].slot,i);}}
  if(id==="F07"&&p.labels.some(l=>l.slot===1))assert.equal(p.labels.find(l=>l.slot===1).rotation,-90,q.id);
  questions++;labels+=p.labels.length;
 }
 assert.equal(keys.size,Object.keys(s.patterns).length,id);patterns+=keys.size;
}
assert.equal(questions,630);assert.equal(labels,2081);assert.equal(patterns,172);
assert.equal(layout.plan({obstacleId:"F01",visual:{labels:[{anchor:"unknown",value:"1"}]}}),null);
console.log("PASS v214: 21 distinct scenes, 630 questions, 2081 unchanged labels, 172 layouts; unique, bounded, non-overlapping boxes");

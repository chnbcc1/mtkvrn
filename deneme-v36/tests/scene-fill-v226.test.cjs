const assert=require('node:assert/strict');
const L=require('../assets/scene-layout-v218.js'), C=require('../assets/character-layer-v215.js'), P=require('../assets/scene-plan-v214.js'), bank=require('../forest-questions-v147.json');
const sizes=[[320,568],[390,844],[430,932],[390,650],[844,390],[932,430],[568,320],[1024,768],[1024,600],[1440,500]];
let count=0,labels=0,characters=0,ambient=0;
for(const q of bank.questions){
 const spec=P.scenes[q.obstacleId],plan=P.plan(q);
 assert.ok(plan,q.id);
 for(const [w,h] of sizes){
  const [,,vw,vh]=L.split(w,h).visual,g=L.sceneGeometry(vw,vh,1254,1254,spec.boxes,q.obstacleId);
  assert.ok(g.cropTop===0&&g.x>=-.001&&g.width<=vw+.001&&Math.abs(g.width-g.height)<.001&&g.visibleFraction+.00001>=g.minBottom,q.id);
  if(g.ambient)ambient++;
  const boxes=spec.boxes.map(b=>L.project(b,g));
  for(const box of boxes){assert.ok(box.top+box.height<=vh+.001&&box.left>=-.001&&box.left+box.width<=vw+.001,q.id);labels++;}
  for(const aspect of [.6,.8,1,1.4]){
   const r=C.placement(vw,vh,aspect,boxes);
   assert.ok(r&&r.width>0&&r.left>=0&&r.top>=0&&r.top+r.height<=vh+.001,q.id);
   assert.ok(!boxes.some(b=>r.left+r.width>b.left+.001&&r.left<b.left+b.width-.001&&r.top+r.height>b.top+.001&&r.top<b.top+b.height-.001),q.id);
   characters++;
  }
  count++;
 }
}
assert.equal(count,6300);assert.equal(characters,25200);
console.log('PASS v226', {count,labels,characters,ambient});

const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json");
const layout=require("../assets/scene-plan-v214.js");
const ch=require("../assets/character-layer-v215.js");
async function main(){
 assert.equal(ch.IDS.length,21);
 assert.equal(new Set(ch.IDS).size,21);
 assert.equal(bank.questions.length,630);
 for(const q of bank.questions){
  const p=ch.plan(q.obstacleId),l=layout.plan(q);
  assert(p&&l&&ch.fits(p,l.labels),q.id);
  assert.equal(p.source,"./assets/erdem-ciko-onayli-v180.png?v=180");
  assert.equal(p.width,23.4);assert.equal(p.height,22);
 }
 assert.equal(ch.plan("unknown"),null);
 const q=bank.questions[0],l=layout.plan(q);
 let current=null,removed=0;
 const plane={isConnected:true,querySelector:()=>current,appendChild:i=>{current=i}};
 function fakeDoc(success){
  return {createElement:()=>{const i={style:{},naturalWidth:800,naturalHeight:600,remove(){removed++;current=null;}};Object.defineProperty(i,"src",{set(v){i.path=v;success?i.onload():i.onerror();}});return i;}};
 }
 const img=await ch.mount(plane,q.obstacleId,l,{documentRef:fakeDoc(true)});
 assert(img);assert.equal(img.path,ch.REFERENCE);assert.equal(img.style.objectFit,"contain");assert.equal(img.style.filter,"none");assert.equal(img.style.pointerEvents,"none");
 await ch.mount(plane,q.obstacleId,l,{documentRef:fakeDoc(true)});assert.equal(removed,1);
 const before=current;assert.equal(await ch.mount(plane,q.obstacleId,l,{documentRef:fakeDoc(false)}),null);assert.equal(current,before);
 plane.isConnected=false;assert.equal(await ch.mount(plane,q.obstacleId,l,{documentRef:fakeDoc(true)}),null);
 assert.equal(await ch.mount(plane,q.obstacleId,{...l,character:"wrong.png"},{documentRef:fakeDoc(true)}),null);
 console.log("PASS v215: 630 layouts without character/label box overlap; exact source, aspect-fit, replace and failure behavior");
}
module.exports=main();

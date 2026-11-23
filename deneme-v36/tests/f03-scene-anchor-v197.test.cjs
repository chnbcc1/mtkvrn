"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/f03-scene-v197.js"),"utf8");
const data=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
const context={window:{},document:{},requestAnimationFrame:()=>{}};
vm.runInNewContext(source,context,{filename:"f03-scene-v197.js"});
const scene=context.window.MTKF03SceneV197;
assert(scene?.render&&scene?.plan,"F03 module exports scene renderer and pure placement planner");
assert(scene.image.endsWith("f03-portrait-master-v197.avif"),"Portrait master remains single source");
assert.equal(scene.natural.width,1213);assert.equal(scene.natural.height,1297);
const questions=data.questions.filter(q=>q.obstacleId==="F03");
assert.equal(questions.length,30);
for(const diff of ["kolay","orta","zor"])assert.equal(questions.filter(q=>q.difficulty===diff).length,10);
let count=0;
for(const q of questions){
 const labels=q.visual?.labels||[],placed=scene.plan(labels);
 assert.equal(placed.length,labels.length,"All labels mapped for "+q.id);
 const slots=placed.map(p=>p.slot);
 assert.equal(new Set(slots).size,slots.length,"Placard collision in "+q.id);
 for(let i=0;i<placed.length;i++){
  const p=placed[i];
  assert.equal(p.value,String(labels[i].value),"Preserve value "+q.id);
  assert(p.x>0&&p.x<100&&p.y>0&&p.y<100&&p.w>0&&p.w<24,"Geometry "+q.id);
 }
 count+=placed.length;
}
assert.equal(count,114,"Expected 114 numeric labels");
const check=(anchor,expected)=>assert.equal(scene.chooseSlot(anchor),expected,"Wrong plaque for "+anchor);
check("giriş","inputA");check("A borusu","inputA");check("B borusu","inputB");
check("filtre_1","filter1");check("2. filtre","filter2");check("üçüncü filtre","filter3");
check("gözlem tüpü kolu","tube1");check("tüp payı","tube1");check("ana hat","turbine");
assert(source.includes("Math.max(w/NATURAL.width,h/NATURAL.height)"),"Crop vertical only with portrait master");
console.log("PASS F03: 30 questions, 114 values, no plaque collisions.");

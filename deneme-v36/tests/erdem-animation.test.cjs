/* Regression guard for the unified Erdem animation.
   Run: node deneme-v36/tests/erdem-animation.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const versions=fs.readdirSync(root).map(x=>/^(?:erdem-animation-v)(\d+)\.js$/.exec(x)).filter(Boolean).map(m=>Number(m[1]));
assert(versions.length,"Missing Erdem animation module");
const version=Math.max(...versions);
const assetName="erdem-animation-v"+version+".js";
// Scene versions may increase for geometry, levels or UI without changing
// the ONE shared Erdem animation version.
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const sceneVersion=Number(home.match(/<title>v(\d+)/)?.[1]);
assert(Number.isInteger(sceneVersion)&&sceneVersion>=version,"Invalid scene version");
const forestName="forest-v"+sceneVersion+"-full.html";
const mapName="map-v"+sceneVersion+".html";
const asset=fs.readFileSync(path.join(root,assetName),"utf8");
const forest=fs.readFileSync(path.join(root,forestName),"utf8");
const map=fs.readFileSync(path.join(root,mapName),"utf8");
class ImageMock{
 constructor(){this.naturalWidth=0;this.naturalHeight=0;this.complete=false}
 set src(value){
  this.naturalWidth=1040;this.naturalHeight=2025;this.complete=true;
  if(this.onload)this.onload();
 }
}
const window={ERDEM_V57_HD_ATLAS:"test-data",ERDEM_V83_HD_ATLAS:"test-data"};
vm.runInNewContext(asset,{window,Image:ImageMock,Math,Number,Object,Array});
const anim=window.MTK_ERDEM_ANIMATION;
assert.equal(anim.version,version);
const poses=[
 {state:"idle"},
 ...Array.from({length:8},(_,i)=>({state:"walk",distance:i*27})),
 ...Array.from({length:6},(_,i)=>({state:"jump",jumpImpulse:560,jumpAge:[.04,.19,.39,.56,.79,.96][i]*.875})),
 ...Array.from({length:4},(_,i)=>({state:"turn",turnProgress:i*.065,turnPause:i===3}))
];
const sizes=[];
for(const state of poses){
 let call,scale;
 const ctx={
  save(){},restore(){},translate(){},
  scale(...args){scale=args},
  drawImage(...args){call=args}
 };
 assert(anim.draw(ctx,{...state,width:165,height:257,x:70,y:200,face:1}));
 assert(call,"Missing sprite frame");
 sizes.push(call.slice(-4));
 assert.equal(scale[1],1,"Vertically squashed character");
}
const ref=sizes[0];
for(const s of sizes){
 for(let i=0;i<4;i++)assert(Math.abs(s[i]-ref[i])<1e-9,"Animation size/sole position pulsed across frames");
}
assert.equal(anim.selectFrame({state:"idle"}),14);
for(let i=0;i<8;i++)assert.equal(anim.selectFrame({state:"walk",distance:i*27}),i);
for(let i=0;i<6;i++)assert.equal(anim.selectFrame({state:"jump",jumpImpulse:560,jumpAge:[.04,.19,.39,.56,.79,.96][i]*.875}),i+8);
assert(home.includes(assetName+"?v="+version),"Home uses different animation");
assert(forest.includes(assetName+"?v="+version),"Forest uses different animation");
assert(home.includes(forestName),"Home not linked to current forest");
assert(map.includes(forestName),"Map not linked to current forest");
assert(home.includes("hero.dy=-505;"),"House jump height changed");
assert(forest.includes("vy=-560;jumpStartClock=clock"),"Forest jump height changed");
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"),"Forest jump length changed");
const metrics=JSON.parse(fs.readFileSync(path.join(root,"assets/erdem-v83-atlas-metrics.json"),"utf8"));
assert.equal(metrics.frames.length,18,"Atlas must contain 18 authored poses");
for(const pose of metrics.frames){
 assert(Math.abs(pose.encoded.head-123)<=2,"Head dimensions changed in frame "+pose.frame);
 if(pose.state!=="jump")assert(Math.abs(pose.encoded.body_height-360)<=3,"Standing/walking height changed in frame "+pose.frame);
}
console.log("PASS: "+poses.length+" idle/walk/jump/turn poses have identical size and sole anchor; shared scenes and physics preserved (v"+version+").");

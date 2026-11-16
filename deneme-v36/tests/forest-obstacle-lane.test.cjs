/* v109: enlarge approved v108 root 50% about original center; collision/physics unchanged.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert.equal(version,109);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const artwork=fs.readFileSync(path.join(root,"forest-obstacle-art-v98.js"),"utf8");
new vm.Script(artwork);
const mushroomLoader=fs.readFileSync(path.join(root,"forest-mushroom-art-v102.js"),"utf8");
new vm.Script(mushroomLoader);
assert(mushroomLoader.includes("MTK_V102_MUSHROOM_OBSTACLE"));
assert(mushroomLoader.includes("./assets/forest-mushroom-v102.avif?v=102"));
const mushroomAVIF=fs.readFileSync(path.join(root,"assets/forest-mushroom-v102.avif"));
assert.equal(mushroomAVIF.toString("ascii",4,12),"ftypavif");
assert(mushroomAVIF.length>30000);
const mushroomIspe=mushroomAVIF.indexOf(Buffer.from("ispe"));
assert(mushroomIspe>0);
assert.equal(mushroomAVIF.readUInt32BE(mushroomIspe+8),434);
assert.equal(mushroomAVIF.readUInt32BE(mushroomIspe+12),733);
const logLoader=fs.readFileSync(path.join(root,"forest-log-art-v105.js"),"utf8");
new vm.Script(logLoader);
assert(logLoader.includes("MTK_V105_LOG_OBSTACLE"));
assert(logLoader.includes("./assets/forest-log-v105.avif?v=105"));
const logAvif=fs.readFileSync(path.join(root,"assets/forest-log-v105.avif"));
assert.equal(logAvif.toString("ascii",4,12),"ftypavif","Log art must be AVIF");
assert(logAvif.length>50000,"Log art unexpectedly small");
const logIspe=logAvif.indexOf(Buffer.from("ispe"));
assert(logIspe>0,"Log AVIF dimensions missing");
assert.equal(logAvif.readUInt32BE(logIspe+8),434);
assert.equal(logAvif.readUInt32BE(logIspe+12),741);
const rockLoader=fs.readFileSync(path.join(root,"forest-rock-art-v106.js"),"utf8");
new vm.Script(rockLoader);
assert(rockLoader.includes("MTK_V106_ROCK_OBSTACLE"));
assert(rockLoader.includes("./assets/forest-rock-v106.avif?v=106"));
const rockAvif=fs.readFileSync(path.join(root,"assets/forest-rock-v106.avif"));
assert.equal(rockAvif.toString("ascii",4,12),"ftypavif","Rock artwork must be AVIF");
assert(rockAvif.length>35000,"Rock artwork unexpectedly small");
const rockIspe=rockAvif.indexOf(Buffer.from("ispe"));
assert(rockIspe>0,"Rock AVIF dimensions missing");
assert.equal(rockAvif.readUInt32BE(rockIspe+8),434);
assert.equal(rockAvif.readUInt32BE(rockIspe+12),741);
const rootLoader=fs.readFileSync(path.join(root,"forest-root-art-v108.js"),"utf8");
new vm.Script(rootLoader);
assert(rootLoader.includes("MTK_V108_ROOT_OBSTACLE"));
assert(rootLoader.includes("./assets/forest-root-v108.avif?v=108"));
const rootAvif=fs.readFileSync(path.join(root,"assets/forest-root-v108.avif"));
assert.equal(rootAvif.toString("ascii",4,12),"ftypavif","Root art must be AVIF");
assert(rootAvif.length>40000,"Root image unexpectedly small");
const rootIspe=rootAvif.indexOf(Buffer.from("ispe"));
assert(rootIspe>0,"Root AVIF dimensions missing");
assert.equal(rootAvif.readUInt32BE(rootIspe+8),434);
assert.equal(rootAvif.readUInt32BE(rootIspe+12),672);
const inline=forest.match(/<script>\s*('use strict';[\s\S]*?)<\/script>/);
assert(inline,"Missing playable forest script");
new vm.Script(inline[1]);
// v98 reads new native high-definition artwork rather than scaled old sprites.
const avif=fs.readFileSync(path.join(root,"assets/forest-obstacles-v98.avif"));
assert.equal(avif.toString("ascii",4,12),"ftypavif","High resolution art not AVIF");
assert(avif.length>75000,"Premium source is unexpectedly tiny"); // Modern AVIF compression retains full 2170x724 canvas.
const ispe=avif.indexOf(Buffer.from("ispe"));
assert(ispe>0,"AVIF image size metadata missing");
assert.equal(avif.readUInt32BE(ispe+8),2170,"Five source frames must be 434 pixels each");
assert.equal(avif.readUInt32BE(ispe+12),724,"Premium source frame height mismatch");
assert(artwork.includes('["log","rock","root","mushroom","gap"]'));
assert(artwork.includes("frameWidth=434,frameHeight=724"));
assert(artwork.includes("./assets/forest-obstacles-v98.avif?v=98"));
assert(forest.includes("const spriteAspect=120/205;"),"Premium obstacle aspect was changed");
assert(forest.includes("const drawScale=1.92;"),"v98 visual size must be 80% of v95");
assert(!forest.includes("drawObstacleNearRims"),"v96 rendering must not leak into v98");
const defs=forest.slice(forest.indexOf("const ORDER=["),forest.indexOf("const SOLVED=new Set();"));
const {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,PHOTO_PATH_LANE,GATES}=new Function(
 "GROUND","RAVINE_LEFT","RAVINE_RIGHT",
 defs+"\nreturn {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,PHOTO_PATH_LANE,GATES};"
)(760,19298,19513);
assert.equal(HAZARDS.length,63);
assert.equal(GATES.length,21);
assert.deepEqual([PATH_LANE.far,PATH_LANE.near],[735,848]);
assert.deepEqual([PHOTO_PATH_LANE.far,PHOTO_PATH_LANE.near],[714,819]);
const from=forest.indexOf("const OBSTACLE_CLEARANCE=");
const to=forest.indexOf("drawMini=function(h){",from);
assert(from>0&&to>from);
const kinds=["log","rock","root","mushroom","gap"];
const loaded=(photo)=>new Function("GROUND","PATH_LANE","PHOTO_PATH_LANE","FOREST_PHOTO_READY","obstacleArt",
 forest.slice(from,to)+"\nreturn {OBSTACLE_CLEARANCE,obstacleGeometry};"
)(760,PATH_LANE,PHOTO_PATH_LANE,()=>photo,{frameWidth:120,frameHeight:205});
const forPhoto=loaded(true),forFallback=loaded(false);
for(const kind of kinds){
 const def=HAZARD_GEOMETRY[kind];
 assert(def.w>=88&&def.w<=98,"Existing leap width changed");
 assert(def.height<=62,"Existing collider height changed");
 assert(HAZARDS.some(h=>h.type===kind),"Missing obstacle: "+kind);
 for(const [name,geometry,lane] of [["photo",forPhoto,PHOTO_PATH_LANE],["fallback",forFallback,PATH_LANE]]){
  const box=geometry.obstacleGeometry({type:kind,x:500,w:def.w,height:def.height,laneY:760});
  const depth=lane.near-lane.far;
  if(kind==="root"){
   const oldTop=lane.far-12,oldBottom=lane.near+10;
   const oldHeight=oldBottom-oldTop,oldWidth=oldHeight*(434/672);
   const centerY=(oldTop+oldBottom)/2;
   assert(Math.abs(box.dh-oldHeight*1.5)<1e-8,name+" root height not 150% of v108");
   assert(Math.abs(box.dw-oldWidth*1.5)<1e-8,name+" root width not 150% of v108");
   assert(Math.abs((box.top+box.bottom)/2-centerY)<1e-8,name+" root vertical center moved");
   assert(Math.abs(box.top-(centerY-oldHeight*.75))<1e-8,name+" root top not equally extended");
   assert(Math.abs(box.bottom-(centerY+oldHeight*.75))<1e-8,name+" root bottom not equally extended");
   assert(Math.abs(box.dw-box.dh*(434/672))<1e-8,name+" root photo aspect changed");
   assert(Math.abs(box.dy+760-box.top)<1e-8,name+" root render origin moved");
   assert(Math.abs(box.dx+box.dw/2-def.w/2)<1e-8,name+" root horizontal center moved");
  }else if(kind==="mushroom"){
   // Compare against the existing v103 geometry, keeping the exact center fixed.
   const oldHeight=(depth+12)*1.20;
   const oldWidth=oldHeight*(434/733);
   const oldCenterY=lane.near-oldHeight/2;
   const newHeight=oldHeight*1.20;
   const newWidth=oldWidth*1.20;
   assert(Math.abs(box.dh-newHeight)<1e-8,name+" mushroom not 20% taller than v103");
   assert(Math.abs(box.dw-newWidth)<1e-8,name+" mushroom not 20% wider than v103");
   assert(Math.abs((box.top+box.bottom)/2-oldCenterY)<1e-8,name+" mushroom Y center moved");
   assert(Math.abs(box.top-(oldCenterY-newHeight/2))<1e-8,name+" mushroom top scaling wrong");
   assert(Math.abs(box.bottom-(oldCenterY+newHeight/2))<1e-8,name+" mushroom bottom scaling wrong");
   assert(Math.abs(box.dy+760-box.top)<1e-8,name+" mushroom world placement changed");
   assert(Math.abs(box.dx+box.dw/2-def.w/2)<1e-8,name+" mushroom X center moved");
  }else{
   const margin=depth*.46;
   assert(Math.abs(box.top-(lane.far-margin))<1e-8,name+" art top not centered");
   assert(Math.abs(box.bottom-(lane.near+margin))<1e-8,name+" art bottom not centered");
   assert(Math.abs(box.dy+760-(lane.far-margin))<1e-8,name+" render y shifted");
   assert(Math.abs(box.dh-depth*1.92)<1e-8,name+" legacy art height mismatch");
   assert(Math.abs(box.dw-box.dh*(120/205))<1e-8,name+" legacy aspect distorted");
   assert(Math.abs(box.dw-.8*(depth*2.40*(120/205)))<1e-8,name+" legacy width changed");
   assert(Math.abs(box.dx+box.dw/2-def.w/2)<1e-8,name+" legacy x center moved");
   assert(Math.abs(box.dy+box.dh/2-(lane.far+lane.near)/2+760)<1e-8,name+" legacy y center moved");
  }
  assert.equal(box.left,500);assert.equal(box.right,500+def.w);
 }
 // Exact original fixed leap, checked at four phone frame rates.
 const clearance=forPhoto.OBSTACLE_CLEARANCE[kind];
 for(const dt of [1/120,1/60,1/30,.036]){
  let x=-14,y=760,vy=-560,passed=false;
  for(let i=0;i<Math.ceil(1.2/dt);i++){
   if(y<760||vy!==0){vy+=1280*dt;y=Math.min(760,y+vy*dt);if(y>=760)vy=0}
   let target=x+(y<759.8?422:245)*dt;
   if(target>x&&target>-12&&target<def.w+12&&y>760-clearance)target=-14;
   x=target;if(x>=def.w+12){passed=true;break}
   if(y>=760&&i>0)break;
  }
  assert(passed,"Existing jump cannot clear "+kind+" at "+dt+" seconds");
 }
}
assert(forest.includes('forest-obstacle-art-v98.js?v=98'));
assert(forest.includes('MTK_V98_3D_OBSTACLES'));
assert(forest.includes('MTK_V102_MUSHROOM_OBSTACLE'));
assert(forest.includes('MTK_V105_LOG_OBSTACLE'));
assert(forest.includes('MTK_V106_ROCK_OBSTACLE'));
assert(forest.includes('forest-rock-art-v106.js?v=106'));
assert(forest.includes('}else if(h.type==="rock"){'));
assert(forest.includes('forest-root-art-v108.js?v=108'));
assert(forest.includes('const rootArt=window.MTK_V108_ROOT_OBSTACLE;'));
assert(forest.includes('}else if(h.type==="root"){'));
assert(forest.includes('ctx.drawImage(rootArt.image,m.dx,m.dy,m.dw,m.dh)'));
assert(forest.includes('ctx.drawImage(rockArt.image,m.dx,m.dy,m.dw,m.dh)'));
assert(forest.includes('forest-log-art-v105.js?v=105'));
assert(forest.includes('}else if(h.type==="log"){'));
assert(forest.includes('ctx.drawImage(logArt.image,m.dx,m.dy,m.dw,m.dh)'));
assert(forest.includes('forest-mushroom-art-v102.js?v=102'));
assert(forest.includes("sprite.frameWidth,sprite.frameHeight,m.dx,m.dy,m.dw,m.dh"));
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v109-full.html?v=109"));
assert(map.includes("forest-v109-full.html"));
assert(!forest.includes("for(const row of laneRows)"));
assert(!forest.includes("scenicScatter()"));
assert(forest.includes("map-v109.html?from=forest"),"Map route must follow v109");
assert(!forest.includes('ctx.createRadialGradient(sx,sy'),"Dark shadow gradient remains");
assert(!forest.includes("ctx.ellipse(sx,sy"),"Dark oval or loading oval remains");
console.log("PASS v109: new premium 2170x724 AVIF atlas, v95 geometry with 80% scale and 120:205 preserved at 192% lane-height (80% of v95), centered, 63 jumpable hazards, unchanged Erdem animation.");

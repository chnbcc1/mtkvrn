/* v101: Restore v98 geometry and artwork; remove ONLY painted oval shadows.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert.equal(version,101);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const artwork=fs.readFileSync(path.join(root,"forest-obstacle-art-v98.js"),"utf8");
new vm.Script(artwork);
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
  // Obstacle art is 20% smaller than the approved v95 baseline, while remaining centered.
  const depth=lane.near-lane.far;
  const margin=depth*.46;
  assert(Math.abs(box.top-(lane.far-margin))<1e-8,name+" art top not centered");
  assert(Math.abs(box.bottom-(lane.near+margin))<1e-8,name+" art bottom not centered");
  assert(Math.abs(box.dy+760-(lane.far-margin))<1e-8,name+" render y shifted");
  assert(Math.abs(box.dh-depth*1.92)<1e-8,name+" height should be 80% of v95");
  assert(Math.abs(box.dw-box.dh*(120/205))<1e-8,name+" source image aspect 120:205 was distorted");
   assert(Math.abs(box.dw-.8*(depth*2.40*(120/205)))<1e-8,name+" width should be 80% of v95");
  assert(Math.abs(box.dx+box.dw/2-def.w/2)<1e-8,name+" X center moved");
  assert(Math.abs(box.dy+box.dh/2-(lane.far+lane.near)/2+760)<1e-8,name+" Y center moved");
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
assert(forest.includes("sprite.frameWidth,sprite.frameHeight,m.dx,m.dy,m.dw,m.dh"));
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v101-full.html?v=98"));
assert(map.includes("forest-v101-full.html"));
assert(!forest.includes("for(const row of laneRows)"));
assert(!forest.includes("scenicScatter()"));
assert(forest.includes("map-v101.html?from=forest"),"Map route must follow v101");
assert(!forest.includes('ctx.createRadialGradient(sx,sy'),"Dark shadow gradient remains");
assert(!forest.includes("ctx.ellipse(sx,sy"),"Dark oval or loading oval remains");
console.log("PASS v101: new premium 2170x724 AVIF atlas, v95 geometry with 80% scale and 120:205 preserved at 192% lane-height (80% of v95), centered, 63 jumpable hazards, unchanged Erdem animation.");

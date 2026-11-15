/* v96: all premium hazards fit the photographic road and collide at their visible bounds.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert.equal(version,96);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const artwork=fs.readFileSync(path.join(root,"forest-obstacle-art-v96.js"),"utf8");
new vm.Script(artwork);
const inline=forest.match(/<script>\s*('use strict';[\s\S]*?)<\/script>/);
assert(inline,"Missing playable forest script");
new vm.Script(inline[1]);
const avif=fs.readFileSync(path.join(root,"assets/forest-obstacles-v95.avif"));
assert.equal(avif.toString("ascii",4,12),"ftypavif");
assert(avif.length>100000,"Premium image not found");
const ispe=avif.indexOf(Buffer.from("ispe"));
assert(ispe>0);
assert.equal(avif.readUInt32BE(ispe+8),2170);
assert.equal(avif.readUInt32BE(ispe+12),724);
assert(artwork.includes("frameWidth=434,frameHeight=724"));
assert(artwork.includes('["log","rock","root","mushroom","gap"]'));
const defs=forest.slice(forest.indexOf("const ORDER=["),forest.indexOf("const SOLVED=new Set();"));
const {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,PHOTO_PATH_LANE,GATES}=new Function(
 "GROUND","RAVINE_LEFT","RAVINE_RIGHT",
 defs+"\nreturn {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,PHOTO_PATH_LANE,GATES};"
)(760,19298,19513);
assert.equal(HAZARDS.length,63);
assert.equal(GATES.length,21);
assert.deepEqual([PATH_LANE.far,PATH_LANE.near],[735,848]);
assert.deepEqual([PHOTO_PATH_LANE.far,PHOTO_PATH_LANE.near],[714,819]);
assert.deepEqual(HAZARD_GEOMETRY.log,{w:96,height:50});
const from=forest.indexOf("const OBSTACLE_CLEARANCE=");
const to=forest.indexOf("drawMini=function(h){",from);
assert(from>0&&to>from);
const loaded=(photo)=>new Function("GROUND","PATH_LANE","PHOTO_PATH_LANE","FOREST_PHOTO_READY","obstacleArt",
 forest.slice(from,to)+"\nreturn {OBSTACLE_CLEARANCE,obstacleGeometry};"
)(760,PATH_LANE,PHOTO_PATH_LANE,()=>photo,{frameWidth:434,frameHeight:724});
const forPhoto=loaded(true),forFallback=loaded(false);
const kinds=["log","rock","root","mushroom","gap"];
for(const kind of kinds){
 const def=HAZARD_GEOMETRY[kind];
 assert(HAZARDS.some(h=>h.type===kind),"Missing "+kind);
 for(const [name,geometry,lane] of [["photo",forPhoto,PHOTO_PATH_LANE],["fallback",forFallback,PATH_LANE]]){
  const box=geometry.obstacleGeometry({type:kind,x:500,w:def.w,height:def.height,laneY:760});
  const depth=lane.near-lane.far;
  const width=depth*(434/724);
  assert.equal(box.top,lane.far,name+" top edge");
  assert.equal(box.bottom,lane.near,name+" bottom edge");
  assert.equal(box.dy,lane.far-760,name+" top draw offset");
  assert.equal(box.dh,depth,name+" road coverage");
  assert(Math.abs(box.dw-width)<1e-8,name+" aspect changed");
  assert(Math.abs(box.dx+(box.dw-def.w)/2)<1e-8,name+" obstacle X-center moved");
  assert(Math.abs(box.left-(500+box.dx))<1e-8,name+" collider left mismatch");
  assert(Math.abs(box.right-(box.left+box.dw))<1e-8,name+" collider right mismatch");
  assert(Math.abs((box.left+box.right)/2-(500+def.w/2))<1e-8,name+" world center moved");
  // At all supported phone frame rates, the ORIGINAL jump must clear
  // the newly aligned obstacle collision box. No physics changes allowed.
  for(const dt of [1/120,1/60,1/30,.036]){
   const start=box.left-12,end=box.right+12,clearance=geometry.OBSTACLE_CLEARANCE[kind];
   let x=start-2,y=760,vy=-560,passed=false;
   for(let i=0;i<Math.ceil(1.2/dt);i++){
    if(y<760||vy!==0){vy+=1280*dt;y=Math.min(760,y+vy*dt);if(y>=760)vy=0}
    let target=x+(y<759.8?422:245)*dt;
    if(target>start&&target<end&&y>760-clearance)target=start-2;
    x=target;if(x>=end){passed=true;break}
    if(y>=760&&i>0)break;
   }
   assert(passed,name+" "+kind+" jump fails at "+dt);
  }
 }
}
assert(forest.includes("const drawHeight=roadDepth;"));
assert(!forest.includes("const drawScale=2.40;"));
assert(forest.includes("left:h.x+dx,right:h.x+dx+drawWidth"));
assert(forest.includes("for(const h of HAZARDS)drawMini(h);"));
assert(forest.includes("drawObstacleNearRims();"));
assert(forest.includes("if(heroY<GROUND-2||!obstacleArt?.ready)return"));
assert(forest.includes('forest-obstacle-art-v96.js?v=96'));
assert(forest.includes("sprite.frameWidth,sprite.frameHeight,m.dx,m.dy,m.dw,m.dh"));
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v96-full.html?v=96"));
assert(map.includes("forest-v96-full.html"));
assert(forest.includes("map-v96.html?from=forest"));
assert(!forest.includes("map-v94.html"));
console.log("PASS v96: road-bound art, correct visible collision, preserved centers/physics, depth-aware drawing and routes.");
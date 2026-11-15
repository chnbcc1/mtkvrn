/* v94: 3D obstacles are doubled in width and height versus v92, preserving source aspect and jump physics.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert.equal(version,94);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const artwork=fs.readFileSync(path.join(root,"forest-obstacle-art-v94.js"),"utf8");
new vm.Script(artwork);
const inline=forest.match(/<script>\s*('use strict';[\s\S]*?)<\/script>/);
assert(inline,"Missing playable forest script");
new vm.Script(inline[1]);
const match=artwork.match(/image\.src="data:image\/avif;base64,([A-Za-z0-9+/=]+)";/);
assert(match,"The new 3D art must be embedded and available without external hosting");
const avif=Buffer.from(match[1],"base64");
assert.equal(avif.toString("ascii",4,12),"ftypavif","Not an AVIF file");
const ispe=avif.indexOf(Buffer.from("ispe"));
assert(ispe>0,"AVIF image size metadata missing");
assert.equal(avif.readUInt32BE(ispe+8),600,"Five source frames need 120 pixels each");
assert.equal(avif.readUInt32BE(ispe+12),205,"Source frame height changed");
assert(artwork.includes('["log","rock","root","mushroom","gap"]'));
assert(artwork.includes("frameWidth=120,frameHeight=205"));
assert(artwork.includes("const targetScale=4"),"Missing high-density texture rebuild");
assert(artwork.includes("art.frameWidth=frameWidth*targetScale"),"Source frame not upscaled");
assert(artwork.includes("hiContext.getImageData"),"Missing subtle sharpness restoration");
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
  // Obstacle art doubles in both axes from v92, while remaining centered.
  const depth=lane.near-lane.far;
  const margin=depth*.70;
  assert(Math.abs(box.top-(lane.far-margin))<1e-8,name+" art top not centered");
  assert(Math.abs(box.bottom-(lane.near+margin))<1e-8,name+" art bottom not centered");
  assert(Math.abs(box.dy+760-(lane.far-margin))<1e-8,name+" render y shifted");
  assert(Math.abs(box.dh-depth*2.40)<1e-8,name+" height is not 240%");
  assert(Math.abs(box.dw-box.dh*(120/205))<1e-8,name+" source image aspect 120:205 was distorted");
   assert(Math.abs(box.dw-2*(depth*1.20*(120/205)))<1e-8,name+" width did not double from v92");
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
assert(forest.includes('forest-obstacle-art-v94.js?v=94'));
assert(forest.includes('MTK_V94_3D_OBSTACLES'));
assert(forest.includes("sprite.frameWidth,sprite.frameHeight,m.dx,m.dy,m.dw,m.dh"));
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v94-full.html?v=94"));
assert(map.includes("forest-v94-full.html"));
assert(!forest.includes("for(const row of laneRows)"));
assert(!forest.includes("scenicScatter()"));
console.log("PASS v94: enhanced 4x rendering, native sprite aspect 120:205 preserved at 240% lane-height (double v92), centered, 63 jumpable hazards, unchanged Erdem animation.");

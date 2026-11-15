/* v89 forest-perspective obstacle and jump regression.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert.equal(version,89,"Expected v89 scene version");
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const artwork=fs.readFileSync(path.join(root,"forest-obstacle-art-v89.js"),"utf8");
const sourceArt=fs.readFileSync(path.join(root,"forest-obstacle-art-v85.js"),"utf8");
new vm.Script(artwork);
const inline=forest.match(/<script>\s*('use strict';[\s\S]*?)<\/script>/);
assert(inline,"Missing playable forest script");
new vm.Script(inline[1]);
// The data URIs contain a semicolon ("image/webp;base64"); evaluate this
// repo-owned literal rather than incorrectly splitting at the first ';'.
const context={window:{}};
vm.runInNewContext(sourceArt,context);
const original=context.window.MTK_V85_ROAD_OBSTACLES;
assert(original,"Original high-res obstacle art missing");
const kinds=["log","rock","root","mushroom","gap"];
for(const kind of kinds){
 assert(original[kind]?.startsWith("data:image/webp;base64,"),"High-res "+kind+" missing");
 assert(original[kind].length>12000,"Original "+kind+" art is severely downsampled");
}
assert(artwork.includes("MTK_V85_ROAD_OBSTACLES"),"Sprites must come from original 2.5D source");
assert(artwork.includes("MTK_V89_PERSPECTIVE_OBSTACLES"));
assert(!artwork.includes("ctx.rotate("),"No upright sprite rotation");
assert(forest.includes('forest-obstacle-art-v89.js?v=89'));
assert(!forest.includes('forest-obstacle-art-v88.js?v=88'));
const defs=forest.slice(forest.indexOf("const ORDER=["),forest.indexOf("const SOLVED=new Set();"));
const {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,PHOTO_PATH_LANE,GATES}=new Function(
 "GROUND","RAVINE_LEFT","RAVINE_RIGHT",
 defs+"\nreturn {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,PHOTO_PATH_LANE,GATES};"
)(760,19298,19513);
assert.equal(PATH_LANE.far,735);
assert.equal(PATH_LANE.near,848);
assert.equal(PHOTO_PATH_LANE.far,714);
assert.equal(PHOTO_PATH_LANE.near,819);
assert.equal(HAZARDS.length,63);
assert.equal(GATES.length,21);
const from=forest.indexOf("const OBSTACLE_CLEARANCE=");
const to=forest.indexOf("drawMini=function(h){",from);
assert(from>=0&&to>from,"Missing shared visual / collider geometry");
function loadGeometry(isPhoto){
 return new Function("GROUND","PATH_LANE","PHOTO_PATH_LANE","FOREST_PHOTO_READY",
  forest.slice(from,to)+"\nreturn {OBSTACLE_CLEARANCE,obstacleGeometry};"
 )(760,PATH_LANE,PHOTO_PATH_LANE,()=>isPhoto);
}
const day=loadGeometry(true),fallback=loadGeometry(false);
for(const kind of kinds){
 const geometry=HAZARD_GEOMETRY[kind];
 assert(geometry?.w>=88&&geometry.w<=98,"Don't increase leap distance: "+kind);
 assert(geometry.height<=62,"Don't increase old obstacle collider height");
 assert(HAZARDS.some(h=>h.type===kind),"Missing hazard "+kind);
 for(const [label,data,path] of [["photo",day,PHOTO_PATH_LANE],["fallback",fallback,PATH_LANE]]){
  const h={type:kind,x:500,w:geometry.w,height:geometry.height,laneY:760};
  const m=data.obstacleGeometry(h);
  assert.equal(m.top,path.far,"Wrong "+label+" upper road edge "+kind);
  assert.equal(m.bottom,path.near,"Wrong "+label+" lower road edge "+kind);
  assert.equal(m.dh,path.near-path.far);
  assert.equal(m.dy,path.far-760);
  assert.equal(m.dy+m.dh,path.near-760);
  assert.equal(m.dw,geometry.w+10,"Obstacles should be readable, not thin posts");
  assert.equal(m.left,500);
  assert.equal(m.right,500+geometry.w);
 }
 const clearance=day.OBSTACLE_CLEARANCE[kind];
 for(const dt of [1/120,1/60,1/30,.036]){
  let x=-14,y=760,vy=-560,passed=false,blocked=0;
  for(let i=0;i<Math.ceil(1.1/dt);i++){
   if(y<760||vy!==0){vy+=1280*dt;y=Math.min(760,y+vy*dt);if(y>=760)vy=0}
   let target=x+(y<759.8?422:245)*dt;
   if(target>x&&target>-12&&target<geometry.w+12&&y>760-clearance){target=-14;blocked++}
   x=target;
   if(x>=geometry.w+12){passed=true;break}
   if(y>=760&&i>0)break;
  }
  assert(passed,"Jump fails "+kind+" at "+dt+" seconds/frame");
  assert(blocked>0,"Obstacle doesn't block grounded character: "+kind);
 }
}
for(let i=1;i<HAZARDS.length;i++)
 assert(HAZARDS[i].x>HAZARDS[i-1].x+HAZARDS[i-1].w+35);
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v89-full.html?v=89"));
assert(map.includes("forest-v89-full.html"));
assert(!forest.includes("for(const row of laneRows)"),"Stacked sprites forbidden");
assert(!forest.includes("scenicScatter()"),"Green stamps forbidden");
console.log("PASS v89: sharp source art; 63 photo-grounded hazards; photo y714..819 and fallback y735..848; original jump and Erdem unchanged.");

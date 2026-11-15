/* v88 forest longways obstacle regression.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert.equal(version,88,"Expected the v88 game release");
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const assetSource=fs.readFileSync(path.join(root,"forest-obstacle-art-v88.js"),"utf8");
const webp=fs.readFileSync(path.join(root,"assets/forest-obstacles-v88.webp"));
assert.equal(webp.toString("ascii",0,4),"RIFF");
assert.equal(webp.toString("ascii",8,12),"WEBP");
assert.equal(webp.toString("ascii",12,16),"VP8X");
assert.equal(webp.readUIntLE(24,3)+1,300,"Spritesheet must be 5x60px");
assert.equal(webp.readUIntLE(27,3)+1,85,"Spritesheet depth dimension changed");
new vm.Script(assetSource);
const inline=forest.match(/<script>\s*('use strict';[\s\S]*?)<\/script>/);
assert(inline,"Missing forest gameplay script");
new vm.Script(inline[1]);
const defs=forest.slice(forest.indexOf("const ORDER=["),forest.indexOf("const SOLVED=new Set();"));
const {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,GATES}=new Function(
 "GROUND","RAVINE_LEFT","RAVINE_RIGHT",
 defs+"\nreturn {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,GATES};"
)(760,19298,19513);
assert.equal(PATH_LANE.far,735,"Wrong road upper edge");
assert.equal(PATH_LANE.near,848,"Wrong road lower edge");
assert.equal(PATH_LANE.near-PATH_LANE.far,113);
assert.equal(HAZARDS.length,63);
assert.equal(GATES.length,21);
const from=forest.indexOf("const OBSTACLE_CLEARANCE=");
const to=forest.indexOf("drawMini=function(h){",from);
assert(from>0&&to>from,"Cannot isolate obstacle geometry");
const {OBSTACLE_CLEARANCE,obstacleGeometry}=new Function(
 "GROUND","PATH_LANE",forest.slice(from,to)+"\nreturn {OBSTACLE_CLEARANCE,obstacleGeometry};"
)(760,PATH_LANE);
const kinds=["log","rock","root","mushroom","gap"];
for(const kind of kinds){
 const h=HAZARD_GEOMETRY[kind];assert(h,"Missing "+kind);
 assert(h.w>=88&&h.w<=98,"Horizontal jump distance changed: "+kind);
 assert(h.height<=62,"Obstacles' collider height changed");
 assert(HAZARDS.some(x=>x.type===kind),"No "+kind+" hazard");
 const geom=obstacleGeometry({type:kind,x:400,w:h.w,height:h.height,laneY:760});
 assert.equal(geom.top,735);
 assert.equal(geom.bottom,848);
 assert.equal(geom.dy,-25);
 assert.equal(geom.dh,113);
 assert.equal(geom.dy+geom.dh,88);
 assert.equal(geom.left,400);
 assert.equal(geom.right-geom.left,h.w);
 assert.equal(geom.dw,h.w-12,"Obstacle must be visually narrow along X");
 assert(geom.clearance>=29&&geom.clearance<=65);
}
assert(forest.includes('forest-obstacle-art-v88.js?v=88'));
assert(forest.includes('MTK_V88_ROAD_OBSTACLES'));
assert(assetSource.includes('assets/forest-obstacles-v88.webp?v=88'));
assert(assetSource.includes('cellWidth:60,cellHeight:85'));
assert(!assetSource.includes('rotate('),"No runtime sprite rotation is allowed");
assert(forest.includes('sprite.cellWidth,sprite.cellHeight,m.dx,m.dy,m.dw,m.dh'));
assert(!forest.includes('scenicScatter()'),"Stamped grass has returned");
assert(!forest.includes('for(const row of laneRows)'),"Stacked obstacle art returned");
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v"+version+"-full.html?v="+version));
assert(map.includes("forest-v"+version+"-full.html"));
for(let i=1;i<HAZARDS.length;i++)
 assert(HAZARDS[i].x>HAZARDS[i-1].x+HAZARDS[i-1].w+35,
  "Obstacle overlap or missing preparation distance at "+i);
for(const kind of kinds){
 const h=HAZARD_GEOMETRY[kind],clearance=OBSTACLE_CLEARANCE[kind];
 for(const dt of [1/120,1/60,1/30,.036]){
  let x=-14,y=760,vy=-560,passed=false,stalled=0;
  for(let i=0;i<Math.ceil(1.1/dt);i++){
   if(y<760||vy!==0){vy+=1280*dt;y=Math.min(760,y+vy*dt);if(y>=760)vy=0}
   let target=x+(y<759.8?422:245)*dt;
   if(target>x&&target>-12&&target<h.w+12&&y>760-clearance){
    target=-14;stalled++;
   }
   x=target;if(x>=h.w+12){passed=true;break}
   if(y>=760&&i>0)break;
  }
  assert(passed,"Approved jump cannot cross "+kind+" at "+dt+" sec/frame");
  assert(stalled>0,"Grounded player is not blocked by "+kind);
 }
}
console.log("PASS v88: New binary atlas; 63 full-depth obstacles touch y735 and y848; 5 kinds jumpable at 4 frame rates; Erdem unchanged.");

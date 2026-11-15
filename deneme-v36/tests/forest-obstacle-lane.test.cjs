/* v85 one-piece forest-path obstacle regression tests.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs
   Visual path DEPTH is 113 units; forward jump width is only 88..98.
   A single transparent perspective image spans both road edges.
*/
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert(Number.isInteger(version)&&version>=85);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const config=forest.slice(forest.indexOf("const ORDER=["),forest.indexOf("const SOLVED=new Set();"));
assert(config.startsWith("const ORDER=["),"Could not isolate road hazard definitions");
const {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,GATES}=new Function(
 "GROUND","RAVINE_LEFT","RAVINE_RIGHT",
 config+"\nreturn {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,GATES};"
)(760,19298,19513);
assert.equal(HAZARDS.length,63,"Keep all 63 obstacles");
assert.equal(GATES.length,21,"Keep all 21 mathematics gates");
assert.equal(PATH_LANE.far,735);
assert.equal(PATH_LANE.near,848);
assert.equal(PATH_LANE.near-PATH_LANE.far,113,"Incorrect road depth");
const kinds=["rock","log","root","mushroom","gap"];
for(const kind of kinds){
 const h=HAZARD_GEOMETRY[kind];
 assert(h,"Missing "+kind);
 assert(h.w>=80&&h.w<=100,"Forward jump width is too long: "+kind);
 assert(h.height<=62,"Obstacle height was increased: "+kind);
 assert(HAZARDS.some(x=>x.type===kind),"Unused obstacle type: "+kind);
}
const renderStart=forest.indexOf("function obstacleGeometry(h){");
const renderEnd=forest.indexOf("drawMini=function(h){",renderStart);
assert(renderStart>=0&&renderEnd>renderStart);
const geomSource=forest.slice(renderStart,renderEnd);
const obstacleGeometry=new Function("PATH_LANE",geomSource+"return obstacleGeometry;")(PATH_LANE);
for(const [type,shape] of Object.entries(HAZARD_GEOMETRY)){
 const m=obstacleGeometry({x:400,type,w:shape.w,height:shape.height,laneY:760});
 assert.equal(m.dw,shape.w,"Image and collider differ: "+type);
 assert.equal(m.right-m.left,shape.w,"Collider too wide: "+type);
 assert(760+m.dy<=PATH_LANE.far,"Image fails to reach far edge: "+type);
 assert(760+m.dy+m.dh>=PATH_LANE.near,"Image fails to reach near edge: "+type);
 assert.equal(m.dh,121,"Road-depth image draw must be 113+8 units");
}
assert(forest.includes("ctx.drawImage(img,m.dx,m.dy,m.dw,m.dh)"),
 "New single-piece image should be drawn exactly once");
assert(!forest.includes("for(const row of laneRows)"),
 "Regression: old stacked/triple-image obstacles returned");
assert(!forest.includes("const bed=ctx.createLinearGradient"),
 "Regression: blocky road panels returned");
assert(forest.includes("forest-obstacle-art-v85.js?v=85"),
 "New sprite bundle must be loaded first");
const assetText=fs.readFileSync(path.join(root,"forest-obstacle-art-v85.js"),"utf8");
const window={};
vm.runInNewContext(assetText,{window});
const images=window.MTK_V85_ROAD_OBSTACLES;
assert(images,"Missing new transparent images");
for(const kind of kinds){
 const uri=images[kind];
 assert(uri?.startsWith("data:image/webp;base64,"),"Missing new WebP sprite: "+kind);
 const data=Buffer.from(uri.split(",")[1],"base64");
 assert(data.length>1000,"Truncated image "+kind);
 assert.equal(data.toString("ascii",0,4),"RIFF","Invalid WebP image "+kind);
 assert.equal(data.toString("ascii",8,12),"WEBP","Invalid WebP image "+kind);
}
for(let i=1;i<HAZARDS.length;i++){
 assert(HAZARDS[i].x>HAZARDS[i-1].x+HAZARDS[i-1].w+35,
  "Hazards overlap at "+i);
}
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v"+version+"-full.html?v="+version));
assert(map.includes("forest-v"+version+"-full.html"));
const GROUND=760;
for(const kind of kinds){
 const h=HAZARD_GEOMETRY[kind],clearance=kind==="gap"?29:Math.max(34,h.height-8);
 for(const dt of [1/120,1/60,1/30,.036]){
  const start=-12,end=h.w+12;
  let x=start-2,y=GROUND,vy=-560,passed=false,stalled=0;
  for(let i=0;i<Math.ceil(1.1/dt);i++){
   if(y<GROUND||vy!==0){
    vy+=1280*dt;y=Math.min(GROUND,y+vy*dt);if(y>=GROUND)vy=0;
   }
   let target=x+(y<GROUND-.2?422:245)*dt;
   if(target>x&&target>start&&target<end&&y>GROUND-clearance){
    target=start-2;stalled++;
   }
   x=target;
   if(x>=end){passed=true;break}
   if(y>=GROUND&&i>0)break;
  }
  assert(passed,"Existing Erdem jump cannot clear "+kind+" at dt="+dt);
  assert(stalled>=1,"Obstacle did not block initial grounded character");
 }
}
console.log("PASS v"+version+": 5 standalone transparent sprites, 63 obstacles cover 113-unit road depth, 88..98-unit forward jumps pass at 4 frame rates, Erdem untouched.");

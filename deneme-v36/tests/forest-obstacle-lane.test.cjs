/* Road-spanning forest obstacle regression suite.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs
   Keeps obstacles visually across the lane yet passable with the already
   approved six-frame v83 Erdem jump height and v78 jump distance.
*/
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert(Number.isInteger(version)&&version>=84);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const config=forest.slice(forest.indexOf("const ORDER=["),forest.indexOf("const SOLVED=new Set();"));
assert(config.startsWith("const ORDER=["),"Could not isolate hazard definitions");
const {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,GATES}=new Function(
 "GROUND","RAVINE_LEFT","RAVINE_RIGHT",
 config+"\nreturn {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,GATES};"
)(760,19298,19513);
assert.equal(HAZARDS.length,63,"Expected every forest obstacle");
assert.equal(GATES.length,21,"Preserve 21 math gates");
assert.equal(PATH_LANE.far,735,"Missing far edge of the dirt road");
assert.equal(PATH_LANE.near,848,"Missing near edge of the dirt road");
assert(forest.includes("for(const row of laneRows)"),"Back/middle/front rows missing");
assert(forest.includes('ctx.moveTo(0,far);ctx.lineTo(m.dw,far);'),
 "Road-spanning gap is broken");
assert(forest.includes("const geom=obstacleGeometry(h),footRadius=12"),
 "Collider must share the rendered hazard geometry");
const kinds=["rock","log","root","mushroom","gap"];
for(const kind of kinds){
 const shape=HAZARD_GEOMETRY[kind];
 assert(shape,"Missing obstacle type "+kind);
 assert(shape.w>=200&&shape.w<=220,"Obstacle width out of safe band "+kind);
 assert(shape.height<=62,"Obstacle became too tall "+kind);
 assert(HAZARDS.some(h=>h.type===kind),"Missing "+kind+" obstacles in level");
}
for(let i=1;i<HAZARDS.length;i++){
 assert(HAZARDS[i].x>HAZARDS[i-1].x+HAZARDS[i-1].w+35,
  "Obstacles overlap or have no run-up space near "+i);
}
// Keep existing approved physics and character pipeline unchanged.
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v"+version+"-full.html?v="+version));
assert(map.includes("forest-v"+version+"-full.html"));
// Discrete, collision-aware jump test: front to back of each obstacle at
// four frame times, including capped slow mobile frames (36ms).
const GROUND=760;
for(const kind of kinds){
 const h=HAZARD_GEOMETRY[kind];
 const clearance=kind==="gap"?29:Math.max(34,h.height-8);
 for(const dt of [1/120,1/60,1/30,.036]){
  const start=-12,end=h.w+12;
  let x=start-2,y=GROUND,vy=-560,passed=false,stalled=0;
  for(let i=0;i<Math.ceil(1.1/dt);i++){
   if(y<GROUND||vy!==0){
    vy+=1280*dt;
    y=Math.min(GROUND,y+vy*dt);
    if(y>=GROUND)vy=0;
   }
   let target=x+(y<GROUND-.2?422:245)*dt;
   if(target>x&&target>start&&target<end&&y>GROUND-clearance){
    target=start-2;stalled++;
   }
   x=target;
   if(x>=end){passed=true;break}
   if(y>=GROUND&&i>0)break;
  }
  assert(passed,"Jump cannot clear "+kind+" at "+dt+"s/frame");
  assert(stalled>=1,"Obstacle did not block initial unraised character");
 }
}
console.log("PASS: "+HAZARDS.length+" complete-width hazards cross the whole path; 5 kinds remain jumpable at 4 frame rates; Erdem physics and animation unchanged (v"+version+").");

/* v86 horizontal forest barriers and grassy-overlay regression test.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const version=Number(home.match(/<title>v(\d+)/)?.[1]);
assert(Number.isInteger(version)&&version>=86);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const sourceAsset=fs.readFileSync(path.join(root,"forest-obstacle-art-v85.js"),"utf8");
const horizontalAsset=fs.readFileSync(path.join(root,"forest-obstacle-art-v86.js"),"utf8");
// Parse both game and art module to detect syntax errors before publishing.
new vm.Script(horizontalAsset);
const inline=forest.match(/<script>\s*('use strict';[\s\S]*?)<\/script>/);
assert(inline,"Missing forest gameplay script");
new vm.Script(inline[1]);
const config=forest.slice(forest.indexOf("const ORDER=["),forest.indexOf("const SOLVED=new Set();"));
assert(config.startsWith("const ORDER=["));
const {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,GATES}=new Function(
 "GROUND","RAVINE_LEFT","RAVINE_RIGHT",
 config+"\nreturn {HAZARDS,HAZARD_GEOMETRY,PATH_LANE,GATES};"
)(760,19298,19513);
assert.equal(HAZARDS.length,63,"All 63 obstacles must be present");
assert.equal(GATES.length,21,"Do not change the 21 math gate tasks");
assert.equal(PATH_LANE.near-PATH_LANE.far,113,"Road depth changed");
const kinds=["rock","log","root","mushroom","gap"];
const from=forest.indexOf("const OBSTACLE_DRAW_HEIGHT=");
const to=forest.indexOf("drawMini=function(h){",from);
assert(from>=0&&to>from,"Cannot isolate shared obstacle dimensions");
const {OBSTACLE_DRAW_HEIGHT,OBSTACLE_CLEARANCE,obstacleGeometry}=new Function(
 "GROUND",forest.slice(from,to)+"\nreturn {OBSTACLE_DRAW_HEIGHT,OBSTACLE_CLEARANCE,obstacleGeometry};"
)(760);
for(const kind of kinds){
 const h=HAZARD_GEOMETRY[kind];
 assert(h&&h.w>=80&&h.w<=100,"Forward collision width must stay jumpable: "+kind);
 assert(h.height<=62,"Do not increase the collision body itself");
 assert(HAZARDS.some(x=>x.type===kind),"Missing obstacle type: "+kind);
 const m=obstacleGeometry({type:kind,x:400,w:h.w,height:h.height,laneY:760});
 assert.equal(m.left,400);
 assert.equal(m.right-m.left,h.w,"Collision differs from approved v85 width");
 assert.equal(m.dw,h.w+24,"Visual asset is not broad and horizontal");
 assert(m.dh>=56&&m.dh<=79,"Visual height out of requested moderate range");
 assert.equal(m.dy+m.dh,14,"Object base must be near Erdem's feet (y774), not y848");
 assert(m.dy<=-42,"Obstacles should visibly rise above the path");
 assert(m.clearance>=29&&m.clearance<=65,"Unexpected collision height");
}
assert(forest.includes('forest-obstacle-art-v85.js?v=85'));
assert(forest.includes('forest-obstacle-art-v86.js?v=86'));
assert(horizontalAsset.includes("ctx.rotate(-Math.PI/2)"),"Log/root/gap must use horizontal assets");
assert(horizontalAsset.includes('kind==="mushroom"'),"Mushroom caps must remain upright");
assert(horizontalAsset.includes("art[kind]=can"),"One cached sprite per obstacle kind");
assert(!forest.includes("scenicScatter()"),"Flat stamped green grass returned");
assert(!forest.includes("for(const row of laneRows)"),"Three-row obstacle stacking returned");
assert(!forest.includes("ctx.drawImage(img,m.dx,m.dy,m.dw,m.dh)"),"Old vertical sprites returned");
assert(forest.includes("ctx.drawImage(art,m.dx,m.dy,m.dw,m.dh)"));
assert(sourceAsset.includes("window.MTK_V85_ROAD_OBSTACLES="));
assert(forest.includes("vy=-560;jumpStartClock=clock"));
assert(forest.includes("horizontalSpeed=heroY<GROUND-.2?422:245"));
assert(forest.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("erdem-animation-v83.js?v=83"));
assert(home.includes("forest-v"+version+"-full.html?v="+version));
assert(map.includes("forest-v"+version+"-full.html"));
for(let i=1;i<HAZARDS.length;i++){
 assert(HAZARDS[i].x>HAZARDS[i-1].x+HAZARDS[i-1].w+35,
 "Obstacles overlap or leave no jump preparation room at "+i);
}
// Replay horizontal collision at slow/normal/fast mobile frame intervals,
// without altering the approved jumping impulse or gravity.
for(const kind of kinds){
 const h=HAZARD_GEOMETRY[kind],clearance=OBSTACLE_CLEARANCE[kind];
 for(const dt of [1/120,1/60,1/30,.036]){
  const start=-12,end=h.w+12;
  let x=start-2,y=760,vy=-560,passed=false,stalled=0;
  for(let i=0;i<Math.ceil(1.1/dt);i++){
   if(y<760||vy!==0){
    vy+=1280*dt;y=Math.min(760,y+vy*dt);if(y>=760)vy=0;
   }
   let target=x+(y<759.8?422:245)*dt;
   if(target>x&&target>start&&target<end&&y>760-clearance){
    target=start-2;stalled++;
   }
   x=target;
   if(x>=end){passed=true;break}
   if(y>=760&&i>0)break;
  }
  assert(passed,"Approved jump cannot clear "+kind+" at frame dt "+dt);
  assert(stalled>0,"Grounded character should be stopped by "+kind);
 }
}
console.log("PASS v"+version+": 63 horizontally oriented, raised, low barriers; primitive grass removed; 5 obstacle types crossed at four frame speeds; Erdem untouched.");

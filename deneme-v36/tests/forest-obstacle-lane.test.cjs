/* v115: integrate high-resolution Dedenin Evi image while preserving bridge depth, static stream, physics.
   Run: node deneme-v36/tests/forest-obstacle-lane.test.cjs */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const homeVersion=Number(home.match(/<title>v(\d+)/)?.[1]);
assert.equal(homeVersion,127);
// The home artwork was updated independently; the forest scene remains v113.
const version=Number(home.match(/forest-v(\d+)-full\.html/)?.[1]);
assert.equal(version,113);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const sharedUIJS=fs.readFileSync(path.join(root,"assets/game-ui-v127.js"),"utf8");
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
const gapLoader=fs.readFileSync(path.join(root,"forest-gap-art-v110.js"),"utf8");
new vm.Script(gapLoader);
assert(gapLoader.includes("MTK_V110_GAP_OBSTACLE"));
assert(gapLoader.includes("./assets/forest-gap-v110.avif?v=110"));
const gapAvif=fs.readFileSync(path.join(root,"assets/forest-gap-v110.avif"));
assert.equal(gapAvif.toString("ascii",4,12),"ftypavif","Gap art must be AVIF");
assert(gapAvif.length>35000,"Gap art unexpectedly small");
const gapIspe=gapAvif.indexOf(Buffer.from("ispe"));
assert(gapIspe>0,"Gap AVIF dimensions missing");
assert.equal(gapAvif.readUInt32BE(gapIspe+8),434);
assert.equal(gapAvif.readUInt32BE(gapIspe+12),741);

// v111 premium bridge visual integration (original 2.1s timing and colliders unchanged).
const bridgeLoader=fs.readFileSync(path.join(root,"forest-bridge-art-v111.js"),"utf8");
new vm.Script(bridgeLoader);
assert(bridgeLoader.includes("MTK_V111_BRIDGE_ART"));
for(const [name,w,h] of [["broken",960,720],["restored",960,720],["plank",177,480]]){
 const asset=fs.readFileSync(path.join(root,"assets/forest-bridge-"+name+"-v111.avif"));
 assert.equal(asset.toString("ascii",4,12),"ftypavif",name+" asset is not AVIF");
 assert(asset.length>15000,name+" asset too small");
 const ispe=asset.indexOf(Buffer.from("ispe"));
 assert(ispe>0,name+" AVIF dimensions missing");
 assert.equal(asset.readUInt32BE(ispe+8),w,name+" width mismatch");
 assert.equal(asset.readUInt32BE(ispe+12),h,name+" height mismatch");
}
assert(forest.includes('forest-bridge-art-v111.js?v=111'));
assert(forest.includes('const art=window.MTK_V111_BRIDGE_ART;'));
assert(forest.includes('ctx.drawImage(art.broken.image,bridgeX,bridgeY,bridgeWidth,bridgeHeight)'));
assert(forest.includes('ctx.drawImage(art.restored.image,bridgeX,bridgeY,bridgeWidth,bridgeHeight)'));
assert(forest.includes('ctx.drawImage(art.plank.image,i*slotWidth+1,-54+drop,slotWidth-2,58)'));
assert(forest.includes('const count=8,slotWidth=span/count'));
assert(!forest.includes('const rippleShift='),"River animation must stay removed");
assert(!forest.includes('const left=worldX(RAVINE_LEFT),right=worldX(RAVINE_RIGHT),yy=worldY(738);'),"Old primitive river is still drawn");
assert(!forest.includes('ctx.drawImage(propAtlas,3*362,1*362,362,362,-46,-279'),"Old 2D bridge overlay remains");
assert(forest.includes('bridgeProgress=Math.min(1,(clock-bridgeBuildStart)/2.1)'),"Repair animation speed changed");

const railLoader=fs.readFileSync(path.join(root,"forest-bridge-front-v112.js"),"utf8");
new vm.Script(railLoader);
assert(railLoader.includes("MTK_V112_BRIDGE_FRONT"));
assert(railLoader.includes("./assets/forest-bridge-front-v112.avif?v=112"));
const railFile=fs.readFileSync(path.join(root,"assets/forest-bridge-front-v112.avif"));
assert.equal(railFile.toString("ascii",4,12),"ftypavif");
assert(railFile.length>30000);
const frontIspe=railFile.indexOf(Buffer.from("ispe"));
assert(frontIspe>0);
assert.equal(railFile.readUInt32BE(frontIspe+8),960);
assert.equal(railFile.readUInt32BE(frontIspe+12),720);
assert(forest.includes('forest-bridge-front-v112.js?v=112'));
const lastRender=forest.slice(forest.lastIndexOf("render=function(){"),forest.indexOf("function nextBlocked(",forest.lastIndexOf("render=function(){")));
assert(lastRender.includes("heroSprite();\n drawBridgeFrontRail();\n if(ahead)birdSprite();"),"Rail must paint after Erdem");
assert(forest.includes("bridgeProgress=Math.min(1,(clock-bridgeBuildStart)/2.1)"));
assert(!forest.includes("const rippleShift="));
assert(!forest.includes("clock*22"));
const bgFile=fs.readFileSync(path.join(root,"assets/dedemin-evi-background-v113.webp"));
assert.equal(bgFile.toString("ascii",0,4),"RIFF");
assert.equal(bgFile.toString("ascii",8,12),"WEBP");
assert(bgFile.length>400000,"Clean house background is unexpectedly small");
assert.equal(bgFile.toString("ascii",12,16),"VP8 ","Home image must be a standard VP8 WebP");
assert.equal(bgFile.toString("hex",23,26),"9d012a","Home WebP must contain a valid frame header");
assert.equal(bgFile.readUInt16LE(26)&0x3fff,1672,"Home background width must match original world");
assert.equal(bgFile.readUInt16LE(28)&0x3fff,941,"Home background height must match original world");
assert.equal(require("node:crypto").createHash("sha256").update(bgFile).digest("hex"),
 "466e777f792b913390e9ad4c390eae245ee6f3edfff2bb15a09d12fac7d5f4df",
 "Home background differs from clean recovered original source");
assert(!home.includes("dedemin-evi-background-v112.webp"),"Broken original background reference still present");
// v114: recovered and completed Grandpa's House artwork, stored as compact AVIF.
const bgV114=fs.readFileSync(path.join(root,"assets/dedemin-evi-background-v114.avif"));
assert(bgV114.length>45000,"Completed house background unexpectedly small");
assert.equal(bgV114.toString("ascii",4,12),"ftypavif","Completed background must be AVIF");
assert.equal(require("node:crypto").createHash("sha256").update(bgV114).digest("hex"),
 "179ec790ebadd81368439521fbd437acccf940f9371e010d30406de787ee038c",
 "Completed house artwork differs from approved recovered image");
// v115: high-resolution, higher-quality Dedenin Evi background only; gameplay and forest remain unchanged.
const bgV115=fs.readFileSync(path.join(root,"assets/dedemin-evi-background-v115.avif"));
assert(bgV115.length>350000,"Higher-quality house background unexpectedly small");
assert.equal(bgV115.toString("ascii",4,12),"ftypavif","New house background must be AVIF");
assert.equal(require("node:crypto").createHash("sha256").update(bgV115).digest("hex"),
 "45f214be2932b1dd0a8b4bc2628798d31f276069bc629a3ae37854009f02286f",
 "v115 house artwork differs from approved high-quality image");
assert(home.includes("./assets/dedemin-evi-background-v115.avif?v=115"));
assert(!home.includes("./assets/dedemin-evi-background-v114.avif?v=114"));
assert(!home.includes("./assets/dedemin-evi-background-v113.webp?v=113"));
assert(!home.includes("background:'data:image/webp;base64,"));
assert(home.includes("const sourceX=Math.max(0,Math.min(img.naturalWidth-1,cameraX/W*img.naturalWidth));"));
assert(home.includes("const sourceW=Math.min(img.naturalWidth-sourceX,viewportW/(baseScale*W)*img.naturalWidth);"));
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
  }else if(kind==="gap"){
   // The new fissure overlaps the pictured road edges by 12 / 10 units.
   // Keep v109's visual width, X center and untouched leap/collision dimensions.
   const v109Width=depth*1.92*(120/205);
   assert(Math.abs(box.top-(lane.far-12))<1e-8,name+" gap top not beyond far road edge");
   assert(Math.abs(box.bottom-(lane.near+10))<1e-8,name+" gap bottom not beyond near road edge");
   assert(Math.abs(box.dh-(depth+22))<1e-8,name+" gap height incorrect");
   assert(Math.abs(box.dw-v109Width)<1e-8,name+" gap width must match v109");
   assert(Math.abs(box.dy+760-box.top)<1e-8,name+" gap render origin moved");
   assert(Math.abs(box.dx+box.dw/2-def.w/2)<1e-8,name+" gap horizontal center moved");
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
assert(forest.includes('forest-gap-art-v110.js?v=110'));
assert(forest.includes('const gapArt=window.MTK_V110_GAP_OBSTACLE;'));
assert(forest.includes('}else if(h.type==="gap"){'));
assert(forest.includes('ctx.drawImage(gapArt.image,m.dx,m.dy,m.dw,m.dh)'));
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
assert(home.includes("forest-v113-full.html?v=127"));
assert(map.includes("forest-v113-full.html"));
assert(!forest.includes("for(const row of laneRows)"));
assert(!forest.includes("scenicScatter()"));
assert(forest.includes("window.MTKGameUI.openMap({") && forest.includes("from:\'forest\'"),"Forest map should open as an in-game card");
assert(!forest.includes('ctx.createRadialGradient(sx,sy'),"Dark shadow gradient remains");
assert(!forest.includes("ctx.ellipse(sx,sy"),"Dark oval or loading oval remains");
console.log("PASS v115: new premium 2170x724 AVIF atlas, v95 geometry with 80% scale and 120:205 preserved at 192% lane-height (80% of v95), centered, 63 jumpable hazards, unchanged Erdem animation.");

// v116: responsive title menu, real save-aware navigation and platform preferences.
const menuV116=fs.readFileSync(path.join(root,"menu-v116.html"),"utf8");
const settingsV116=fs.readFileSync(path.join(root,"settings-v116.js"),"utf8");
assert(menuV116.includes("menu-v116-landscape.avif"));
assert(menuV116.includes("menu-v116-portrait.avif"));
for (const control of ['id="start"','id="resume"','id="chapters"','id="settings"']) assert(menuV116.includes(control));
assert(menuV116.includes("mathverse-v40-investigation"));
assert(menuV116.includes("mathverse-v68-forest-full"));
assert(menuV116.includes("function resetAndStart()"));
assert(menuV116.includes("function resumeGame()"));
assert(settingsV116.includes("mathverse-v116-settings"));
assert(settingsV116.includes("navigator.vibrate"));
assert(home.includes("homeX:Math.round(hero.x)"));
assert(home.includes("get('autostart')==='1'"));
assert(forest.includes("function recordForestExit()"));

/* v117 selected forest top HUD regression checks. */
const forestHudArt=fs.readFileSync(path.join(root,"assets/forest-hud-v117.avif"));
assert.equal(forestHudArt.toString("ascii",4,12),"ftypavif");
assert(forestHudArt.length>30000 && forestHudArt.length<250000,"Optimized HUD asset size");
assert(forest.includes("hud-v75 hud-v117"),"New wood HUD mounted in existing forest scene");
assert(forest.includes("forest-hud-v117.avif?v=117"),"HUD image version pinned");
assert(forest.includes('id="settingsBtn"'),"HUD settings action present");
assert(sharedUIJS.includes("window.MTKPrefs?.update({sound:"),"Saved sound toggle in shared settings");
assert(sharedUIJS.includes("window.MTKPrefs?.update({vibration:"),"Saved vibration toggle in shared settings");
assert(forest.includes('done+"/21 ENGEL"'),"HUD progress must be live, not artwork-only");
assert(menuV116.includes("forest-v113-full.html?resume=1&v=127"),"Menu links to latest forest HUD");
console.log("PASS v117: Forest top HUD artwork, dynamic progress, working controls and responsive touch targets");

// v118: landscape display must include the road and Erdem's feet (not just forest sky).
const resizeV118 = forest.match(/function resize\(\)\{([^}]+)\}/)?.[1] || '';
assert(resizeV118.includes('scale=vw>vh?vh/H:Math.max(vh/H,vw/1450)'), 'Landscape camera must fit the entire scene height');
const H118=941, GROUND118=760;
for(const [width,height] of [[844,390],[1024,480],[1280,720],[1536,610],[1920,1080]]){
 const scaled=height/H118;
 const groundScreenY=GROUND118*scaled;
 const heroHeadY=(GROUND118-360)*scaled;
 assert(groundScreenY<height-35, 'Ground clipped in landscape '+width+'x'+height);
 assert(heroHeadY>65, 'Hero hidden under HUD in landscape '+width+'x'+height);
}
assert(forest.includes('@media(orientation:landscape) and (max-height:800px)'), 'Short-screen landscape HUD rule missing');
assert(forest.includes('height:clamp(74px,17vh,118px)'), 'Landscape HUD is too tall');
assert(forest.includes("visualViewport.addEventListener('resize',resize)"), 'Browser toolbar resize needs a redraw');

// v119: screenshots showed blurred HUD icons, a stretched landscape hint,
// and hard-to-reach quiz choices on short landscape viewports.
assert(forest.includes('backdrop-filter:none;-webkit-backdrop-filter:none;filter:none;'), 'HUD controls must not blur the illustrated icons');
assert(forest.includes('bottom:auto;min-height:0;max-height:none;'), 'Landscape hint must not stretch from top to bottom');
assert(forest.includes('top:calc(env(safe-area-inset-top) + clamp(78px,19vh,124px))'), 'Compact landscape toast positioning missing');
assert(forest.includes('#quizOverlay .quizWrap{\n  height:100%;max-height:100%;min-height:0'), 'Quiz dialog must fit the mobile viewport');
assert(forest.includes('forest-v70-quiz.html?v=119&'), 'Quiz iframe URL must invalidate old styles');
const quizV119=fs.readFileSync(path.join(root,'forest-v70-quiz.html'),'utf8');
assert(quizV119.includes('grid-template-columns:repeat(2,minmax(0,1fr))'), 'Landscape answers must display in two columns');
assert(quizV119.includes('-webkit-overflow-scrolling:touch'), 'Landscape quiz scrolling must be enabled');
console.log('PASS v119: sharp HUD icons, compact hints, scrollable two-column landscape quiz');

// v121: native panorama art with no screenshot crop seams or image distortion.
const landscapeSVG=fs.readFileSync(path.join(root,"assets/forest-hud-landscape-v121.svg"),"utf8");
assert(landscapeSVG.includes('viewBox="0 0 1920 254"'),"Landscape HUD must be authored at a truly wide native aspect");
assert(landscapeSVG.includes('ORMAN PATİKASI') && landscapeSVG.includes('NOTLAR') && landscapeSVG.includes('HARİTA') && landscapeSVG.includes('AYARLAR'),"New HUD missing labels");
assert(forest.includes('forest-hud-landscape-v122.avif?v=122'),"High-resolution landscape artwork was not integrated");
assert(!forest.includes('hud-v120-artparts'),"Do not splice the old HUD into independent fragments");
assert(forest.includes('aspect-ratio:2172 / 362'),"High-resolution landscape artwork aspect ratio must be preserved");
assert(forest.includes('object-fit:contain;object-position:center'),"Landscape art must not stretch to fill the box");
assert(forest.includes('height:auto;aspect-ratio:2172 / 362'),"Do not force an incorrect HUD height");
assert(forest.includes('width:clamp(80px,11vw,110px)'),"Large landscape directional buttons must remain");
assert(forest.includes('width:clamp(135px,18vw,182px)'),"Large landscape jump button must remain");
assert(forest.includes('scale=vw>vh?vh/H:Math.max(vh/H,vw/1450)'),"Landscape camera / jump area changed");
// v122: verify new artwork is a real AVIF with its native full-resolution dimensions.
const landscapeHiRes=fs.readFileSync(path.join(root,'assets/forest-hud-landscape-v122.avif'));
assert.equal(landscapeHiRes.toString('ascii',4,12),'ftypavif','Landscape file must be AVIF');
assert(landscapeHiRes.length>120000,'Illustrated landscape source unexpectedly low-detail/small');
const ispe122=landscapeHiRes.indexOf(Buffer.from('ispe'));
assert(ispe122>0,'AVIF image properties missing');
assert.equal(landscapeHiRes.readUInt32BE(ispe122+8),2172);
assert.equal(landscapeHiRes.readUInt32BE(ispe122+12),362);
assert(forest.includes('hud-v122-landscape-art'),'v122 artwork CSS/markup missing');
assert(forest.includes('class="hud-v117-art" src="./assets/forest-hud-v117.avif?v=117"'),'Portrait original HUD must be kept');
assert(!forest.includes('class="hud-v121-landscape-art"'),'Old low-detail vector should no longer be shown');
console.log("PASS v122: Premium 2172x362 landscape AVIF, portrait unchanged, responsive controls and game physics preserved");

// v123: redundant examine button gone; native magnifier keeps the only entry point.
assert(!forest.includes('id="examine"'), 'Redundant fixed examine button must be removed');
assert(!forest.includes('$("#examine")'), 'No event listener or update may target removed examine button');
assert(forest.includes("canvas.addEventListener('pointerup',e=>{"), 'Magnifier tap must still use canvas hit testing');
assert(forest.includes('if(Math.hypot(sx-px,sy-py)<64){e.preventDefault();interact()}'), 'Magnifier must trigger existing interact action');
assert(forest.includes('gate.label+" · büyütece dokun"'), 'Hint must direct pupils to magnifier');
assert(forest.includes('width:min(790px,calc(100vw - 30px),150dvh)'), 'Landscape HUD should use compact dimensions');
assert(forest.includes('background:rgba(10,44,55,.36)'), 'Controls must be semi-transparent in both orientations');
assert(forest.includes('width:clamp(54px,15vw,62px)'), 'Portrait controls must be modestly smaller');
assert(forest.includes('width:clamp(68px,9.5vw,88px)'), 'Landscape controls must be modestly smaller');
assert(forest.includes('width:clamp(118px,15.5vw,150px)'), 'Landscape jump button must be modestly smaller');
assert(forest.includes('scale=vw>vh?vh/H:Math.max(vh/H,vw/1450)'), 'Keep the v118 camera that fits the road');
console.log('PASS v123: magnifier-only inspection, compact landscape HUD, smaller glass controls in portrait and landscape');

// v124: settings, notes and map must fit viewport without vertical scroll.
assert(forest.includes("$('#modal').dataset.panel=eyebrow==='AYARLAR'?'settings':''"),'Only Settings panel should be available; notes removed');
assert(forest.includes('grid-template-rows:auto minmax(0,1fr) auto'), 'No-scroll responsive panel grid missing');
assert(forest.includes('#modal[data-panel="settings"] .paper,#modal[data-panel="notes"] .paper'), 'Separate premium panel styles missing');
assert(forest.includes('height:min(500px,calc(100dvh - 18px'), 'Modal height must fit dynamic viewport');
assert(forest.includes('overflow:hidden;'), 'Modal contents must not scroll');
assert(sharedUIJS.includes('İlerleme otomatik kaydedilir'), 'Global settings information label missing');
assert(sharedUIJS.includes('const version="127"'), 'Shared settings should display current release');
assert(!forest.includes('id="journal"'), 'Forest note button must be removed');
assert(map.includes('class="mapShell"') && map.includes('class="mapStage"') && map.includes('class="mapFooter"'), 'Premium map layout must have header/stage/footer');
assert(map.includes('height:100dvh;min-height:0;') && map.includes('overflow-x:auto;overflow-y:hidden;touch-action:pan-x'), 'Map page must block vertical scrolling but retain horizontal panning');
assert(map.includes('grid-template-areas:"head head" "map foot"'), 'Landscape map needs side-by-side mission panel');
assert(map.includes('grid-template-areas:"progress" "go" "legend"'), 'Portrait map footer must fit without scrolling');
assert(map.includes('map-pin forest') && map.includes('centerMap()'), 'Interactive map pins and centering must be preserved');
assert(forest.includes('background:rgba(10,44,55,.36)'), 'v123 glass movement controls must be preserved');
assert(forest.includes('if(Math.hypot(sx-px,sy-py)<64){e.preventDefault();interact()}'), 'In-world magnifier interaction must remain');
console.log('PASS v124: premium viewport-fitted settings/notes/map, horizontal map panning, saved progress and controls preserved');

// v125: all playable chapters share controls, wood/gold HUD theme and premium panels.
const sharedUICSS=fs.readFileSync(path.join(root,'assets/game-ui-v127.css'),'utf8');
const sharedUniversalCSS=fs.readFileSync(path.join(root,'assets/universal-hud-v127.css'),'utf8');
assert(home.includes('class="hud hud-v75 hud-v117 mtk-ui-hud mtk-illustrated-hud"'), 'House must use illustrated HUD');
assert(forest.includes('class="hud hud-v75 hud-v117 mtk-ui-hud mtk-illustrated-hud"'), 'Forest must share same HUD class');
assert(home.includes('class="controls mtk-ui-controls"') && forest.includes('class="controls mtk-ui-controls"'), 'Both chapter controls must share their styling');
for(const scene of [home,forest,map,menuV116])assert(scene.includes('assets/game-ui-v127.css?v=127'), 'All scene and menu pages need the shared visual system');
for(const scene of [home,forest,menuV116])assert(scene.includes('assets/game-ui-v127.js?v=127'), 'Main menu and playable scenes need shared settings logic');
assert(home.includes('id="homeMapBtn"') && home.includes('id="homeSettingsBtn"'), 'House needs map and settings buttons');
assert(home.includes('window.MTKGameUI.settingsMarkup(\'home\',p)') && forest.includes('window.MTKGameUI.settingsMarkup(\'forest\',p)') && menuV116.includes('window.MTKGameUI.settingsMarkup(\'menu\',p)'), 'Settings must come from one shared implementation');
assert(!home.includes('id="journalBtn"') && !home.includes('homeNotesCompact'), 'House notes must be removed');
assert(home.includes("else delete $('#info').dataset.mtkPanel"), 'Long story panels must remain scrollable and must not inherit notes layout');
assert(sharedUICSS.includes('#info:is([data-mtk-panel="settings"],[data-mtk-panel="notes"])'), 'Global panel layout must target only Settings and Notes');
assert(sharedUICSS.includes('background:var(--mtk-glass)!important'), 'Global transparent gamepad controls missing');
assert(sharedUniversalCSS.includes('.mtk-illustrated-hud'), 'Both chapters must use universal illustrated HUD CSS');
assert(sharedUICSS.includes('#info:is([data-mtk-panel="settings"],[data-mtk-panel="notes"]) .modalPanel'), 'House premium scroll-free cards missing');
assert(sharedUICSS.includes('.mtk-ui-dialog'), 'Title menu cards must use global panel theme');
assert(home.includes('window.MTKGameUI.openMap({') && home.includes("from:'home'"), 'House map must open an in-game sheet');
assert(forest.includes('forest-hud-landscape-v122.avif?v=122'), 'Preserve existing high-resolution forest HUD artwork');
assert(forest.includes('const horizontalSpeed=heroY<GROUND-.2?422:245'), 'Forest movement physics must remain untouched');
console.log('PASS v126: shared illustrated HUD, notes removed, origin-aware navigation and compact confirmations');

// v126: the same native artwork and interaction map must work in every scene.
for(const chapter of [home,forest]){
 assert(chapter.includes('forest-hud-v117.avif?v=117'), 'Portrait must reuse selected forest HUD');
 assert(chapter.includes('forest-hud-landscape-v122.avif?v=122'), 'Landscape must reuse high-res forest HUD');
 assert(chapter.includes('assets/universal-hud-v127.css?v=127'), 'Both chapters need shared HUD responsive sizing');
 assert(chapter.includes('id="pikoBtn"'), 'Chiko remains accessible after deleting notebook');
}
assert(!home.includes('journalBtn') && !forest.includes('id="journal"') && !forest.includes('function journal()'), 'Notebook interactions must be removed');
assert(sharedUniversalCSS.includes('.mtk-illustrated-hud[data-chapter="home"] .mtk-chapter-label'), 'House title should replace only baked chapter lettering');
assert(sharedUniversalCSS.includes('.mtk-illustrated-hud #pikoBtn .mtk-chiko-frame'), 'Real Chiko sprite must fill illustrated icon');
assert(menuV116.includes('data-size="confirmation"') && menuV116.includes("dataset.size=title==='Yeni oyun başlatılsın mı?'"), 'New game confirmation must be content-height');
assert(map.includes('function backToSource()') && map.includes('if(source==="home")return location.assign(dest.home)') && map.includes('if(source==="forest")return location.assign(dest.forest)'), 'Map back must respect opener');
assert(map.includes('dest={home:"./?scene=home&autostart=1&v=127"'), 'Standalone map home destination must skip title screen');
assert(map.includes('document.getElementById("continue").addEventListener("click",()=>go(mission[3]))'), 'Mission navigation must preserve selected chapter');
console.log('PASS v126: source-aware map back, house auto-start, compact confirmation and common responsive illustrated HUD');

// v127: an in-scene map card replaces page navigation; rotation resizes canvas.
for(const chapter of [home,forest]){
 assert(chapter.includes('window.MTKGameUI.openMap({'), 'Map must open a sheet in both chapters');
 assert(chapter.includes('window.MTKGameUI.mountChiko();'), 'Both chapters must mount the genuine Chiko sprite');
 assert(chapter.includes('window.visualViewport?.addEventListener(\'resize\',syncViewport)'), 'Both chapters must follow iOS visual viewport orientation changes');
 assert(chapter.includes('new ResizeObserver(resize).observe('), 'Both chapters must watch real game/canvas dimensions');
 assert(!chapter.includes('title="Çiko">🦜</button>'), 'Generic bird placeholder must be removed');
}
assert(home.includes('gameViewport.getBoundingClientRect()'), 'House canvas dimensions must come from rendered viewport');
assert(home.includes("canvas.style.width='100%';canvas.style.height='100%'"), 'House canvas must resize automatically in CSS');
assert(forest.includes('canvas.getBoundingClientRect()'), 'Forest canvas must follow real viewport');
assert(!home.includes('location.assign(\'./map-v113.html?from=home&v=127\')'), 'House must not navigate to a map page on HUD click');
assert(!forest.includes('home=function(){recordForestExit();location.assign'), 'Forest must not navigate to map page');
assert(sharedUIJS.includes('window.MTKGameUI=Object.freeze({version,settingsMarkup,bindSettings,notesProgress,mountChiko,openMap})'), 'Shared map modal and Chiko sprite integration missing');
assert(sharedUIJS.includes('event.origin!==location.origin||event.source!==frame.contentWindow'), 'Map iframe messages must be same-origin and from the correct frame');
assert(sharedUIJS.includes('frame.src="./map-v113.html?embedded=1&from="'), 'Map must load in its own same-page frame');
assert(sharedUIJS.includes('if((from==="home"&&region==="home")||(from==="forest"&&region==="forest")){close();return}'), 'Selecting current region should only close map');
assert(sharedUICSS.includes('.mtk-map-layer')&&sharedUICSS.includes('.mtk-map-sheet'), 'Shared premium map panel styles must exist');
assert(map.includes('if(embedded){tellParent("mtk-map-navigate",region);return;}'), 'Embedded map must message parent rather than navigate');
assert(map.includes('if(embedded){tellParent("mtk-map-close");return;}'), 'Embedded map back button should close its card');
assert(map.includes('body.mtk-embedded-map')&&map.includes('grid-template-areas:"map foot"'), 'Map must fit landscape dialog viewport');
assert(sharedUniversalCSS.includes('background-size:600% 300%'), 'Genuine Chiko atlas cropping must use 6×3 layout');
assert(!sharedUniversalCSS.includes('content:"ÇİKO"'), 'Old floating sticker label must not return');
console.log('PASS v127: native Chiko atlas, portrait/landscape rotations, same-page interactive map card');

assert(home.includes('viewportH*.84-ground*baseScale'), 'Landscape camera should keep Erdem on the visible walking lane');

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
assert.equal(homeVersion,134);
// The home artwork was updated independently; the forest scene remains v113.
const version=Number(home.match(/forest-v(\d+)-full\.html/)?.[1]);
assert.equal(version,113);
const forest=fs.readFileSync(path.join(root,"forest-v"+version+"-full.html"),"utf8");
const map=fs.readFileSync(path.join(root,"map-v"+version+".html"),"utf8");
const sharedUIJS=fs.readFileSync(path.join(root,"assets/game-ui-v131.js"),"utf8");
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
assert(home.includes("forest-v113-full.html?v=133"));
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



// v135 — the newly approved text-free map and two independent premium fog layers.
const originalArt=fs.readFileSync(path.join(root,"assets/premium-map-approved-v130.avif"));
const premiumBase=fs.readFileSync(path.join(root,"assets/mtkv135-base-map.webp"));
const fogForest=fs.readFileSync(path.join(root,"assets/mtkv135-forest-fog-lock.webp"));
const fogObservatory=fs.readFileSync(path.join(root,"assets/mtkv135-observatory-fog-lock.webp"));
const worldJS=fs.readFileSync(path.join(root,"assets/world-map-v133.js"),"utf8");
const sharedJS=fs.readFileSync(path.join(root,"assets/game-ui-v133.js"),"utf8");
const sharedCSS=fs.readFileSync(path.join(root,"assets/unified-ui-v133.css"),"utf8");
const hudArt=fs.readFileSync(path.join(root,"assets/hud-shell-v129.svg"),"utf8");
const worldRegistry=fs.readFileSync(path.join(root,"assets/map-world-registry-v133.js"),"utf8");
const menu=menuV116;
new vm.Script(worldJS);new vm.Script(sharedJS);
assert(originalArt.length>100000,"Previous approved illustration stays archived unchanged");
assert(premiumBase.length>100000,"New full-resolution picture is preserved");
for(const picture of [premiumBase,fogForest,fogObservatory]){
 assert.equal(picture.toString("ascii",0,4),"RIFF","Image must use WebP");
 assert.equal(picture.toString("ascii",8,12),"WEBP","Image must decode as WebP");
}
assert(worldJS.includes("mtkv135-base-map.webp?v=135"),"New banner-free artwork must load");
assert(worldJS.includes("mtkv135-forest-fog-lock.webp?v=135"),"Forest uses its own premium fog/lock");
assert(worldJS.includes("mtkv135-observatory-fog-lock.webp?v=135"),"Observatory uses its own premium fog/lock");

assert(!worldJS.includes("world-map-v129.svg"),"Old flat-map asset must be removed from gameplay");
assert(!worldJS.includes("Işıklı Taş"),"Forest obstacle must never become a map region");
assert(!worldJS.includes("Keşfedilen Bölgeler")&&!worldJS.includes("bölge sayısı"),"No discovered-region counter");
assert(!worldJS.includes("Profesörün ipuçları")&&!worldJS.includes("21 matematik engeli"),"No chapter subtitles");
assert(worldJS.includes("const W=1671,H=941"),"Interactive coordinates use source artwork geometry");
assert(worldJS.includes("const chapters=[")&&worldJS.includes('id:"observatory"'),"Only the three main named regions are initial map chapters");
assert(!worldJS.includes('id:"gate"')&&!worldJS.includes('id:"inside"'),"Observatory is ONE map region, not multiple chapters");
assert(worldJS.includes('const tiles=[')&&worldJS.includes('const chapters=['),"All chapters and art tiles use one world registry");
assert(worldJS.includes('function registerTile(')&&worldJS.includes('function registerChapter('),"World can grow by adding approved tiles and their chapters");
assert(worldJS.includes('fogPolygon:[[600,0]')&&worldJS.includes('fogPolygon:[[1180,0]'),"Approved shared-boundary region polygons remain unchanged");
assert(worldJS.includes('const locked=state.chapters.filter(c=>!c.unlocked&&c.tileId===tile.id)'),"Only locked polygons on each tile receive fog");
assert(worldJS.includes('paintRegionMist(fog,tile,[c])')&&worldJS.includes('const premiumSrc=tile.id===ROOT_TILE?PREMIUM_REGION_LAYERS[c.id]:null'),"Each locked chapter gets independent fog");
assert(worldJS.includes('image.style.maskImage=gradient')&&worldJS.includes('image.style.webkitMaskImage=gradient'),"Joined artwork softens just the shared overlap");
assert(worldJS.includes('function zoomTo(')&&worldJS.includes('e.touches.length===2'),"Pinch to zoom remains");
assert(!worldJS.includes('host.append(tools)'),"Removed on-screen zoom buttons");
assert(sharedCSS.includes('@media (orientation:landscape)'),"Map labels compact on landscape");
assert(!worldJS.includes('Işıklı Taş'),"Obstacle is not a separate map chapter");
assert(sharedCSS.includes('.mtk-cinematic-fog{')&&sharedCSS.includes('border-radius:0!important'),"Fog must be edge-less per-tile canvas");
assert(!sharedCSS.includes('ellipse 125% 106%')&&!sharedCSS.includes('border-radius:44% 0 0 29%'),"Reject the old pasted-on white egg");
assert(sharedCSS.includes(".mtk-cinematic-legend{"),"Status explanation stays as separate readable UI");
assert(sharedCSS.includes(".mtk-cinematic-viewport")&&sharedCSS.includes("overflow-y:auto!important"),"Zoomed world can pan without scrolling the surrounding card");
assert(sharedCSS.includes('@import url("./unified-ui-v129.css?v=129")'),"Existing game controls and story/question card behavior must remain");
assert(sharedJS.includes('window.MTKWorldMap.mount(body,'),"Map opens in-game card without another page");
assert(!sharedJS.includes('createElement("iframe")'),"Map uses no iframe");
for(const chapter of [home,forest]){
 assert(chapter.includes('class="mtk-hud-shell"'),"Existing universal chapter HUD retained");
 assert(chapter.includes("hud-shell-v129.svg?v=133"),"Shared HUD illustration retained");
 assert(chapter.includes("assets/world-map-v133.js?v=136"),"All chapters use the single expanding map engine");
 assert(chapter.includes("assets/game-ui-v133.js?v=133"),"Shared navigation and modal code retained");
 assert(chapter.includes("assets/unified-ui-v133.css?v=136"),"All panels use unified responsive styles");
 assert(chapter.includes("window.MTKGameUI.openMap({"),"Map opens from inside game");
}
assert(menu.includes("world-map-v133.js?v=136"),"Title-screen shares global fog registry");
for(const scene of [home,forest,menu]) assert(scene.includes("map-world-registry-v133.js?v=133"),"All scenes load the same expansion manifest");
assert(menu.includes("localStorage.removeItem('mathverse-v128-chapter-milestones')"),"New Game resets all later expansions");
assert(home.includes("localStorage.removeItem('mathverse-v128-chapter-milestones')"),"In-home reset clears expansion progress");
assert(forest.includes('$("#progressFill")?.parentElement'),"Forest score update still present");
assert(forest.includes("const horizontalSpeed=heroY<GROUND-.2?422:245"),"Forest movement/physics preserved");
assert(home.includes("hero.dy=-505"),"House movement/physics preserved");

// Progression is based on actual saves and no later region is visible early.
const memory=new Map();
const context={window:{},localStorage:{
 getItem:key=>memory.get(key)||null,
 setItem:(key,val)=>memory.set(key,String(val))
}};
vm.runInNewContext(worldJS,context);
const atlas=context.window.MTKWorldMap;
const stage=id=>atlas.progress().chapters.find(c=>c.id===id);
assert.deepEqual(Array.from(atlas.progress().discovered),["home"],"At new game ONLY Dedenin Evi is visible");
assert(!stage("forest").unlocked&&!stage("observatory").unlocked);
memory.set("mathverse-v40-investigation",JSON.stringify({complete:true,visitedStudy:false}));
assert(!stage("forest").unlocked,"Reaching half of house investigation must not unlock forest");
memory.set("mathverse-v40-investigation",JSON.stringify({complete:true,visitedStudy:true}));
assert(stage("forest").unlocked&&!stage("observatory").unlocked,"Forest appears only after full house completion");
assert.deepEqual(Array.from(atlas.progress().discovered),["home","forest"]);
memory.set("mathverse-v68-forest-full",JSON.stringify({solvedIds:Array.from({length:20},(_,i)=>i+1),reachedGate:true}));
assert(!stage("observatory").unlocked,"20 out of 21 forest obstacles does NOT unlock the observatory");
memory.set("mathverse-v68-forest-full",JSON.stringify({solvedIds:Array.from({length:21},(_,i)=>i+1),reachedGate:false}));
assert(!stage("observatory").unlocked,"All obstacles without reaching final destination should not unlock observatory");
memory.set("mathverse-v68-forest-full",JSON.stringify({solvedIds:Array.from({length:21},(_,i)=>i+1),reachedGate:true}));
assert(stage("observatory").unlocked&&stage("home").unlocked,"Observatory unlock reveals all prior zones permanently");
assert.deepEqual(Array.from(atlas.progress().discovered),["home","forest","observatory"]);
assert(atlas.registerTile({id:"expansion-east",afterTile:"origin",side:"right",overlap:110,w:1671,h:941,
 src:"./assets/future-east.avif",styleKey:"matematik-evreni-premium-3d-v1"}),"Next premium image joins first world tile");
const east=atlas.tiles().find(t=>t.id==="expansion-east");
assert.equal(east.x,1561,"First shared edge overlaps exactly 110 px");
assert(!atlas.registerTile({id:"bad",afterTile:"origin",side:"right",overlap:110,w:1671,h:941,
 src:"./assets/mismatch.avif",styleKey:"other-art-style"}),"Mismatched artwork style must be rejected");
assert(atlas.registerChapter({id:"future-planet",name:"Yeni Bölge",tileId:"expansion-east",localX:620,localY:470,
 rx:170,ry:83,after:"observatory"}),"Fourth chapter can join the approved world without replacing initial artwork");
assert(!stage("future-planet").unlocked,"Fourth chapter stays misted until observatory is completed");
assert(!atlas.markChapterCompleted("observatory"),"Unimplemented stage cannot be completed");
assert(atlas.configureChapter("observatory",{playable:true,route:"./observatory.html"}),"New stage can activate through common API");
assert(atlas.markChapterCompleted("observatory"),"Completing observatory unlocks fourth region");
assert(stage("future-planet").unlocked,"Fourth chapter opens and earlier chapter never closes");
assert(atlas.registerTile({id:"expansion-east-two",afterTile:"expansion-east",side:"right",overlap:110,w:1671,h:941,
 src:"./assets/future-east-two.avif",styleKey:"matematik-evreni-premium-3d-v1"}),"Fifth region can use the same seam rules");
assert.equal(atlas.tiles().find(t=>t.id==="expansion-east-two").x,3122,"Successive tiles reuse the same global coordinates");
assert(atlas.registerChapter({id:"planet-two",name:"Yeni Macera",tileId:"expansion-east-two",localX:580,localY:560,
 after:"future-planet",playable:true,route:"./planet-two.html"}),"Fifth stage registered once for the whole game");
assert(!stage("planet-two").unlocked,"Fifth stage remains misted until fourth finished");
assert(atlas.configureChapter("future-planet",{playable:true,route:"./planet-one.html"}));
assert(atlas.markChapterCompleted("future-planet"),"Fourth stage completion persists");
assert(stage("planet-two").unlocked,"Fifth stage automatically unlocks with no new fog code");
const forestFog=atlas.chapters().find(c=>c.id==="forest"),
      observatoryFog=atlas.chapters().find(c=>c.id==="observatory");
assert(atlas.fogOpacityAt(326,401,[forestFog],326,401)<.001,"Home remains entirely clear");
assert(atlas.fogOpacityAt(754,588,[forestFog],754,588)>.99,"Locked forest nameplate is hidden");
assert(atlas.fogOpacityAt(1430,495,[observatoryFog],1430,495)>.99,"Locked observatory nameplate is hidden");
assert(atlas.fogOpacityAt(760,588,[observatoryFog],760,588)<.001,"Unlocking forest does not fog it again");
assert(atlas.fogOpacityAt(1105,150,[forestFog,observatoryFog],1105,150)>.80,"Adjacent locked regions must not leave a transparent seam");
const sampleFuture=atlas.chapters().find(c=>c.id==="future-planet");
assert(atlas.fogOpacityAt(620,470,[{...sampleFuture,tileX:east.x,tileY:east.y}],east.x+620,470)>.99,
 "Locked chapter on ANY new art tile must receive its own fog");
memory.clear(); // New Game = reset canonical save stores.
assert.deepEqual(Array.from(atlas.progress().discovered),["home"],"New Game returns visibility to the house only");
assert(sharedJS.includes("if(from===region)"),"Card navigation is universal across every chapter");
assert(sharedCSS.includes(".mtk-map-camera-tools{display:none!important}"),"Legacy buttons hidden");
assert(sharedCSS.includes("mtk-cinematic-stage-plaque"),"New imagery tiles can show stage names without redrawing art");
assert(worldRegistry.includes("NEW_TILES=[]")&&worldRegistry.includes("NEW_CHAPTERS=[]"),"Future artwork is not invented in this release");
const other={window:{MTKWorldMap:atlas}};
vm.runInNewContext(worldRegistry,other);
assert.equal(other.window.MTKWorldRegistry.tileCount,3,"One original + two sample extension tiles in regression sandbox");
const quizChiko=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
assert(quizChiko.includes("run.taskWrong=(run.taskWrong||0)+1"),"Collect task-level wrong answers");
assert(quizChiko.includes("wrongCount:Math.max(0"),"Quiz reports mistakes to main game");
assert(forest.includes("TASK_WRONG_COUNTS[gate.id]=wrongCount"),"Task results persist");
assert(forest.includes("chikoReactionGroup(")&&forest.includes("chikoReaction(wrongCount)"),"3 success reaction categories");
assert(forest.includes('chikoSpeak("Engeli geçmek için zıpla!","collision"'),"Only collision suggests jumping");
assert(forest.includes('chikoSpeak("Burayı araştırmalıyız!","research"'),"Research arrival prompts");
assert(forest.includes('positionChikoSpeech();'),"Bubble follows bird");
assert(forest.includes('id="chikoSpeech"')&&forest.includes('.hint,#hint{display:none!important}'),"Old helper banner removed");
console.log("PASS v136: compact map labels, zoom gestures, Chiko collision/research/completion speech.");

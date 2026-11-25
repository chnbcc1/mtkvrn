const assert=require('node:assert/strict');
const api=require('../assets/scene-layout-v218.js');
const {scenes}=require('../assets/scene-plan-v214.js');
const {SLOT}=require('../assets/character-layer-v215.js');
const bank=require('../forest-questions-v147.json');
const stats=(function runTests(api,bank,scenes,character,check){
 const sizes=[[320,568],[390,844],[430,932],[768,1024],[568,320],[844,390],[932,430],[1024,768]];
 let frames=0,labels=0,cropChecks=0,fallback=0;
 const near=(a,b)=>Math.abs(a-b)<1e-6;
 const inside=(b,w,h)=>b.left>=-1e-6&&b.top>=-1e-6&&b.left+b.width<=w+1e-6&&b.top+b.height<=h+1e-6;
 check(bank.questions.length===630&&Object.keys(scenes).length===21,"630/21");
 for(const q of bank.questions){
  const s=scenes[q.obstacleId],slots=s.patterns[q.visual.labels.map(l=>l.anchor).join("|")],band=api.protectedBand(s.boxes,character);
  check(!!band&&slots?.length===q.visual.labels.length,q.id);
  for(const [w,h] of sizes){
   const f=api.split(w,h),[x,y,vw,vh]=f.visual,[qx,qy,qw,qh]=f.question;
   check(near(vw*vh,w*h/2)&&near(qw*qh,w*h/2),q.id+" half");
   check(f.orientation==="portrait"?x===0&&y===0&&qx===0&&qy===vh:x===0&&y===0&&qx===vw&&qy===0,q.id+" position");
   const g=api.geometry(vw,vh,1000,1000,{orientation:f.orientation,band});
   check(g.fit==="contain"&&near(g.width,g.height)&&g.cropTop===0&&g.cropBottom===0,q.id+" no unverified crop");
   frames++;
   const c=[character.left+character.width/2,100-character.bottom-character.height/2,character.width,character.height];
   check(inside(api.project(c,g),vw,vh),q.id+" character");
   for(const slot of slots){check(inside(api.project(s.boxes[slot],g),vw,vh),q.id+" label");labels++}
   // Simulate approved crop bands for the geometry algorithm ONLY; this is
   // not a declaration that the actual source artwork has safe crop areas.
   const cropped=api.geometry(vw,vh,1000,1000,{orientation:f.orientation,band,verifiedCropBand:band});
   check(near(cropped.width,cropped.height)&&cropped.x>=-1e-6&&cropped.x+cropped.width<=vw+1e-6,q.id+" no stretch or side crop");
   for(const b of [...s.boxes,c])check(inside(api.project(b,cropped),vw,vh),q.id+" protected");
   if(f.orientation==="portrait")check(cropped.fit==="contain",q.id+" portrait");
   if(cropped.fit==="vertical-crop")cropChecks++;else fallback++;
  }
 }
 check(api.geometry(0,100,100,100)===null,"zero");
 const wide=api.geometry(500,300,1000,1000,{orientation:"landscape",band:[20,80],verifiedCropBand:[20,80]});
 check(wide.fit==="vertical-crop"&&near(wide.width,500)&&near(wide.cropTop,100)&&near(wide.cropBottom,100),"synthetic crop");
 return {questions:bank.questions.length,scenes:Object.keys(scenes).length,sizes:sizes.length,frames,labels,cropChecks,fallback};
})(api,bank,scenes,SLOT,(v,m)=>assert.ok(v,m));
console.log('PASS v218 geometry',JSON.stringify(stats));

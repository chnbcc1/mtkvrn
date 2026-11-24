/* Matematik Evreni — single Erdem character animation module v83.
   Regression fix: never resize characters per pose. The old pixel-derived
   head/height ratios ranged from 0.82 to 1.25 and made Erdem shrink when
   starting to walk, taking off and about to land.

   One atlas, one frame chooser, one renderer across playable chapters.
   Every frame uses precisely the same destination width, height and ground
   anchor. Only the depicted limb pose changes. Scene-specific jump physics
   (distance, gravity, height) are not modified by this module.
*/
(function(global){
 "use strict";
 const COLS=4, CELL_WIDTH=260, CELL_HEIGHT=405;
 const DRAW_WIDTH=165, DRAW_HEIGHT=257;
 const SOLE_OFFSET=11, FOOT_ANCHOR=(CELL_HEIGHT-SOLE_OFFSET)/CELL_HEIGHT;
 const JUMP_KEYS=Object.freeze([.08,.30,.48,.65,.92,1]);
 let loaded=false;
 const atlas=new Image();
 atlas.decoding="async";
 // Identical approved 18 poses. The lossless WebP is pixel-verified,
 // original AVIF remains fallback; legacy scenes retain their own source.
 const sources=[
  global.ERDEM_V83_HD_ATLAS,
  "./assets/erdem-v83-hd-atlas-v183.webp?v=183",
  "./assets/erdem-v83-hd-atlas-v182.avif?v=183"
 ].filter(Boolean);
 let sourceIndex=0;
 function loadNext(){if(sourceIndex<sources.length)atlas.src=sources[sourceIndex++];}
 atlas.onload=()=>{
  loaded=atlas.naturalWidth>=COLS*CELL_WIDTH&&atlas.naturalHeight>=5*CELL_HEIGHT;
  if(!loaded)loadNext();
 };
 atlas.onerror=()=>{loaded=false;loadNext()};
 loadNext();
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const num=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;
 function selectFrame(o){
  if(o.state==="jump"){
   const impulse=Math.max(1,num(o.jumpImpulse,505));
   const age=Math.max(0,num(o.jumpAge,0));
   const phase=clamp(age/(2*impulse/1280),0,1);
   // First/last crouch poses are intentionally brief; the middle poses
   // show a full-sized, readable character throughout the flight.
   for(let i=0;i<JUMP_KEYS.length;i++)if(phase<JUMP_KEYS[i])return 8+i;
   return 13;
  }
  if(o.state==="turn"){
   return 14+(o.turnPause?3:clamp(Math.floor(num(o.turnProgress,0)/.065),0,2));
  }
  if(o.state==="walk")return Math.floor(Math.max(0,num(o.distance,0))/27)%8;
  return 14;
 }
 function frameGeometry(o){
  const width=Math.max(1,num(o.width,DRAW_WIDTH));
  const height=Math.max(1,num(o.height,DRAW_HEIGHT));
  return {width,height,footAnchor:FOOT_ANCHOR};
 }
 function draw(ctx,o){
  if(!loaded)return false;
  const frame=Number.isInteger(o.testFrame)&&o.testFrame>=0&&o.testFrame<18?o.testFrame:selectFrame(o);
  const {width,height}=frameGeometry(o);
  const face=o.state==="turn"&&o.turnFace?o.turnFace:o.face;
  ctx.save();
  ctx.translate(num(o.x,0),num(o.y,0));
  ctx.scale(Number(face)<0?-1:1,1);
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality="high";
  // No runtime alpha scanning, per-frame image scaling, crop modulation,
  // interpolation or changing pivot. Prevents size/position pulsation.
  try{
   ctx.drawImage(atlas,(frame%COLS)*CELL_WIDTH,Math.floor(frame/COLS)*CELL_HEIGHT,
    CELL_WIDTH,CELL_HEIGHT,-width/2,-height*FOOT_ANCHOR,width,height);
   ctx.restore();
   return true;
  }catch(error){
   ctx.restore();loaded=false;loadNext();return false;
  }
 }
 global.MTK_ERDEM_ANIMATION=Object.freeze({
  version:83,draw,selectFrame,frameGeometry,
  defaultSize(scale=1){
   const s=Math.max(0,num(scale,1));
   return {width:DRAW_WIDTH*s,height:DRAW_HEIGHT*s};
  },
  getDiagnostics(){
   return {loaded,version:83,frameScale:Array(18).fill(1),
    frameFootAnchor:Array(18).fill(FOOT_ANCHOR),
    sizePolicy:"fixed across idle/walk/jump/turn",jumpFrames:[8,9,10,11,12,13]};
  }
 });
})(window);

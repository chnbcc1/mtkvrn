/* Matematik Evreni — Erdem unified character animation v81.
   All playable scenes use the same atlas, frame timing, head-size
   calibration, foot anchor and proportional scaling. Physics belongs
   to each scene so already-approved jump distances remain unchanged. */
(function(global){
 "use strict";
 const atlas=new Image();
 atlas.decoding="async";
 const COLUMNS=4,ROWS=5,CELL_W=260,CELL_H=405,FRAME_COUNT=18;
 const metrics=Array.from({length:FRAME_COUNT},()=>({foot:CELL_H-11,head:0,scale:1}));
 let loaded=false,referenceHead=0;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function median(numbers){
  const a=numbers.filter(n=>Number.isFinite(n)&&n>0).sort((x,y)=>x-y);
  return a.length?a[Math.floor(a.length/2)]:0;
 }
 function calibrate(){
  if(!atlas.naturalWidth||atlas.naturalWidth<COLUMNS*CELL_W||atlas.naturalHeight<ROWS*CELL_H)return;
  // Data-URI artwork is same-origin; read a single cell at a time to
  // avoid a multi-megabyte full-atlas pixel buffer on mobile Safari.
  try{
   const scratch=document.createElement("canvas");
   scratch.width=CELL_W;scratch.height=CELL_H;
   const c=scratch.getContext("2d",{willReadFrequently:true});
   if(!c)throw Error("No 2D canvas");
   for(let frame=0;frame<FRAME_COUNT;frame++){
    c.clearRect(0,0,CELL_W,CELL_H);
    c.drawImage(atlas,(frame%COLUMNS)*CELL_W,Math.floor(frame/COLUMNS)*CELL_H,CELL_W,CELL_H,0,0,CELL_W,CELL_H);
    const a=c.getImageData(0,0,CELL_W,CELL_H).data;
    let top=CELL_H,bottom=-1;
    for(let y=0;y<CELL_H;y++){
     let hasAlpha=false;
     for(let x=18;x<CELL_W-18;x+=2){
      if(a[(y*CELL_W+x)*4+3]>100){hasAlpha=true;break}
     }
     if(hasAlpha){if(top===CELL_H)top=y;bottom=y}
    }
    if(bottom<=top)continue;
    metrics[frame].foot=bottom;
    const h=bottom-top+1;
    const headWidths=[];
    // Measure a band through Erdem's hair and face, not his
    // extended legs or crouched total body height.
    const y0=Math.max(0,Math.floor(top+h*.09));
    const y1=Math.min(CELL_H-1,Math.ceil(top+h*.29));
    for(let y=y0;y<=y1;y+=2){
     let first=-1,last=-1;
     for(let x=18;x<CELL_W-18;x++){
      if(a[(y*CELL_W+x)*4+3]>120){
       if(first<0)first=x;
       last=x;
      }
     }
     if(first>=0&&last-first>14)headWidths.push(last-first+1);
    }
    headWidths.sort((a,b)=>a-b);
    if(headWidths.length)metrics[frame].head=headWidths[Math.floor((headWidths.length-1)*.70)];
   }
   referenceHead=median([0,1,2,3,4,5,6,7,14].map(i=>metrics[i].head));
   // Normalize ALL 18 poses, including idle and walking. Adjust upward
   // and downward, unlike v80 which only enlarged smaller jump frames.
   // The same ratio is applied to both axes; never squeeze the body.
   if(referenceHead){
    for(const m of metrics){
     m.scale=m.head?clamp(referenceHead/m.head,.82,1.25):1;
    }
   }
  }catch(e){
   // On browsers without readable AVIF pixels, use the same original,
   // fixed-size rendering in every scene rather than per-scene hacks.
   for(const m of metrics){m.foot=CELL_H-11;m.scale=1}
  }
 }
 atlas.onload=()=>{loaded=true;calibrate()};
 atlas.onerror=()=>{loaded=false};
 if(global.ERDEM_V57_HD_ATLAS)atlas.src=global.ERDEM_V57_HD_ATLAS;
 if(atlas.complete&&atlas.naturalWidth){loaded=true;calibrate()}
 function selectFrame(o){
  if(o.state==="jump"){
   // Exactly the same six poses throughout both chapters. Progress is
   // relative to that chapter's existing jump duration, not its height.
   const impulse=Number(o.jumpImpulse)||505;
   const totalDuration=2*impulse/1280;
   const phase=clamp((Number(o.jumpAge)||0)/totalDuration,0,.99999);
   return 8+Math.min(5,Math.floor(phase*6));
  }
  if(o.state==="turn"){
   return 14+(o.turnPause?3:Math.min(2,Math.floor((Number(o.turnProgress)||0)/.065)));
  }
  if(o.state==="walk")return Math.floor(Math.max(0,Number(o.distance)||0)/27)%8;
  return 14;
 }
 function draw(ctx,o){
  if(!loaded||!atlas.naturalWidth)return false;
  const frame=selectFrame(o),m=metrics[frame];
  const w=(Number(o.width)||165)*m.scale,h=(Number(o.height)||257)*m.scale;
  const facing=o.state==="turn"&&o.turnFace?o.turnFace:(o.face||1);
  ctx.save();
  ctx.translate(Number(o.x)||0,Number(o.y)||0);
  ctx.scale(facing<0?-1:1,1);
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality="high";
  ctx.drawImage(atlas,(frame%COLUMNS)*CELL_W,Math.floor(frame/COLUMNS)*CELL_H,CELL_W,CELL_H,
   -w/2,-h*(m.foot/CELL_H),w,h);
  ctx.restore();
  return true;
 }
 global.MTK_ERDEM_ANIMATION=Object.freeze({
  version:81,draw,selectFrame,
  defaultSize(scale=1){return {width:165*scale,height:257*scale}},
  getDiagnostics(){return {loaded,referenceHead,scaleByFrame:metrics.map(m=>m.scale)}}
 });
})(window);

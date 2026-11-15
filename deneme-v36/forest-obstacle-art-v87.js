/* v87: tightly cropped high-detail natural obstacle silhouettes.
   Corrects v86's rotation anchor that clipped the top half of textures.
   One true sprite per obstacle, no stacked tile copies or grass stamps. */
(function(global){
 "use strict";
 const KINDS=["log","rock","root","mushroom","gap"];
 const sprites=Object.create(null);
 global.MTK_V87_OBSTACLE_ART=sprites;
 const sources=global.MTK_V85_ROAD_OBSTACLES||{};
 function canvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return c}
 function tight(can,padding=4){
  const c=can.getContext("2d",{willReadFrequently:true});
  try{
   const w=can.width,h=can.height,pixels=c.getImageData(0,0,w,h).data;
   let x0=w,y0=h,x1=-1,y1=-1;
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    if(pixels[(y*w+x)*4+3]<35)continue;
    x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);
   }
   if(x1<=x0||y1<=y0)return can;
   x0=Math.max(0,x0-padding);x1=Math.min(w-1,x1+padding);
   y0=Math.max(0,y0-padding);y1=Math.min(h-1,y1+padding);
   const out=canvas(x1-x0+1,y1-y0+1);
   out.getContext("2d").drawImage(can,x0,y0,out.width,out.height,0,0,out.width,out.height);
   return out;
  }catch(e){return can}
 }
 function build(kind,img){
  const stage=canvas(560,270),ctx=stage.getContext("2d");
  if(!ctx)return;
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  if(kind==="mushroom"){
   // Keep all caps upright in one wide, seamless forest-floor cluster.
   const sw=img.naturalWidth,sh=img.naturalHeight;
   ctx.drawImage(img,0,Math.floor(sh*.22),sw,Math.ceil(sh*.78),8,91,188,165);
   ctx.drawImage(img,0,Math.floor(sh*.10),sw,Math.ceil(sh*.90),155,36,236,220);
   ctx.drawImage(img,0,Math.floor(sh*.24),sw,Math.ceil(sh*.76),370,95,177,161);
  }else{
   // Rotate at the stage center, not at v86's off-canvas y=13.
   const src=canvas(img.naturalWidth,img.naturalHeight);
   src.getContext("2d").drawImage(img,0,0);
   const cut=tight(src,0),wid=530,ht=205;
   ctx.save();ctx.translate(stage.width/2,stage.height/2);
   ctx.rotate(-Math.PI/2);
   ctx.drawImage(cut,-ht/2,-wid/2,ht,wid);
   ctx.restore();
  }
  sprites[kind]=tight(stage,4);
 }
 for(const kind of KINDS){
  if(!sources[kind])continue;
  const img=new Image();img.decoding="async";
  img.onload=()=>build(kind,img);
  img.src=sources[kind];
  if(img.complete&&img.naturalWidth)build(kind,img);
 }
})(window);

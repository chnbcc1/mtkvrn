/* v86: single horizontal obstacle cutouts, generated once from the existing
   high-detail transparent source art. No stacked repeated sprite rows.
   Canvas sources preserve the art style and avoid external network loads. */
(function(global){
"use strict";
const TYPES=["log","rock","root","mushroom","gap"];
const source=global.MTK_V85_ROAD_OBSTACLES||{};
const art=Object.create(null);
global.MTK_V86_OBSTACLE_ART=art;
const W=384,H=180;
function shade(ctx){
 const shadow=ctx.createRadialGradient(W/2,H-13,3,W/2,H-13,W*.46);
 shadow.addColorStop(0,"rgba(24,30,19,.26)");
 shadow.addColorStop(1,"rgba(24,30,19,0)");
 ctx.fillStyle=shadow;
 ctx.beginPath();ctx.ellipse(W/2,H-13,W*.47,11,0,0,Math.PI*2);ctx.fill();
}
function drawRotated(ctx,img,width=344,height=118){
 // Rotate a continuous source obstacle, NOT the character or the scene.
 ctx.save();ctx.translate(W/2,H-17-height*.49);ctx.rotate(-Math.PI/2);
 ctx.drawImage(img,-height/2,-width/2,height,width);
 ctx.restore();
}
function build(kind,img){
 const can=document.createElement("canvas");
 can.width=W;can.height=H;
 const ctx=can.getContext("2d");
 if(!ctx)return;
 ctx.imageSmoothingEnabled=true;
 ctx.imageSmoothingQuality="high";
 shade(ctx);
 if(kind==="log")drawRotated(ctx,img,352,122);
 else if(kind==="root")drawRotated(ctx,img,354,124);
 else if(kind==="gap")drawRotated(ctx,img,357,116);
 else if(kind==="rock"){
   // Rocks need to remain upright; a wide low ridge is a single object.
   ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,12,35,360,130);
 }else if(kind==="mushroom"){
   // One cohesive low mushroom cluster assembled in a single offscreen
   // sprite. Tops stay UP, unlike rotating the vertical v85 mushroom.
   const sw=img.naturalWidth,sh=img.naturalHeight;
   ctx.drawImage(img,0,Math.floor(sh*.34),sw,Math.ceil(sh*.66),
     8,65,135,99);
   ctx.drawImage(img,0,Math.floor(sh*.15),sw,Math.ceil(sh*.85),
     115,23,159,142);
   ctx.drawImage(img,0,Math.floor(sh*.28),sw,Math.ceil(sh*.72),
     258,61,119,103);
 }
 // This object is drawn ONCE in the level, with a transparent background.
 art[kind]=can;
}
for(const kind of TYPES){
 const src=source[kind];if(!src)continue;
 const img=new Image();img.decoding="async";
 img.onload=()=>build(kind,img);
 img.src=src;
 if(img.complete&&img.naturalWidth)build(kind,img);
}
})(window);

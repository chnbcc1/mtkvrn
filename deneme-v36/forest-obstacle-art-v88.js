/* v88 — newly illustrated, pre-rotated obstacle assets from one verified WebP atlas.
   Unlike v86-v87, no canvas rotation, scaling, alpha scanning or sprite
   reconstruction at runtime. Layout owns the one road-spanning transform. */
(function(global){
 "use strict";
 const image=new Image();
 image.decoding="async";
 const sprite={
  image,
  src:"./assets/forest-obstacles-v88.webp?v=88",
  cellWidth:60,cellHeight:85,
  kinds:Object.freeze(["log","rock","root","mushroom","gap"]),
  ready:false,
  frameIndex(type){return this.kinds.indexOf(type)}
 };
 global.MTK_V88_ROAD_OBSTACLES=sprite;
 image.onload=()=>{sprite.ready=image.naturalWidth===300&&image.naturalHeight===85};
 image.onerror=()=>{sprite.ready=false};
 image.src=sprite.src;
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

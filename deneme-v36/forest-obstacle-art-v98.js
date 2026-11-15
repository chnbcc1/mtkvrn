/* v98: Native premium high-definition forest obstacles.
   Five vertically oriented transparent 434x724 frames generated from the
   approved premium concept and composited as a 2170x724 AVIF atlas.
   Positions, sizes and collision volumes are not changed by this file. */
(function(global){
 "use strict";
 const image=new Image();
 image.decoding="async";
 const kinds=Object.freeze(["log","rock","root","mushroom","gap"]);
 const frameWidth=434,frameHeight=724;
 const art={image,kinds,frameWidth,frameHeight,ready:false,
  frameIndex(type){return kinds.indexOf(type)}
 };
 global.MTK_V98_3D_OBSTACLES=art;
 image.onload=()=>{art.ready=image.naturalWidth===frameWidth*5&&image.naturalHeight===frameHeight};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-obstacles-v98.avif?v=98";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

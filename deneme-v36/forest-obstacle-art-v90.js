/* v90: newly generated 3D forest obstacle sprites.
   One high-quality transparent 5-column AVIF atlas, no rotation,
   no tiling and no alteration to Erdem's motion. */
(function(global){
 "use strict";
 const image=new Image();
 image.decoding="async";
 const kinds=Object.freeze(["log","rock","root","mushroom","gap"]);
 const frameWidth=140,frameHeight=245;
 const art={image,kinds,frameWidth,frameHeight,ready:false,
  frameIndex(type){return kinds.indexOf(type)}};
 global.MTK_V90_3D_OBSTACLES=art;
 image.onload=()=>{art.ready=image.naturalWidth===700&&image.naturalHeight===245};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-obstacles-v90.avif?v=90";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

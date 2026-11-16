/* v110: selected transparent warm-earth chasm sprite, isolated from all other obstacles. */
(function(global){
 "use strict";
 const image=new Image();image.decoding="async";
 const art={image,ready:false};
 global.MTK_V110_GAP_OBSTACLE=art;
 image.onload=()=>{art.ready=image.naturalWidth===434&&image.naturalHeight===741};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-gap-v110.avif?v=110";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

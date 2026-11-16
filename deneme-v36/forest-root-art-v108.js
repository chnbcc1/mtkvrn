/* v108: root obstacle is the exact approved uploaded photo with white removed.
   Original visual lane boundaries, collision and other obstacle art unchanged. */
(function(global){
 "use strict";
 const image=new Image(); image.decoding="async";
 const art={image,ready:false};
 global.MTK_V108_ROOT_OBSTACLE=art;
 image.onload=()=>{art.ready=image.naturalWidth===434&&image.naturalHeight===672};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-root-v108.avif?v=108";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

/* v102: isolated ten-mushroom cutout, all other sprites remain v98. */
(function(global){
 "use strict";
 const image=new Image();image.decoding="async";
 const art={image,ready:false};
 global.MTK_V102_MUSHROOM_OBSTACLE=art;
 image.onload=()=>{art.ready=image.naturalWidth===434&&image.naturalHeight===733};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-mushroom-v102.avif?v=102";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

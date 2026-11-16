/* v107: approved root barrier, transparent AVIF; other obstacles unchanged. */
(function(global){
 "use strict";
 const image=new Image();image.decoding="async";
 const art={image,ready:false};
 global.MTK_V107_ROOT_OBSTACLE=art;
 image.onload=()=>{art.ready=image.naturalWidth===434&&image.naturalHeight===741};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-root-v107.avif?v=107";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

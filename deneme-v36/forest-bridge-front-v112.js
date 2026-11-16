/* v112 isolated front railing from the approved v111 repaired bridge art. */
(function(global){
 "use strict";
 const image=new Image();image.decoding="async";
 const art={image,ready:false};global.MTK_V112_BRIDGE_FRONT=art;
 image.onload=()=>{art.ready=image.naturalWidth===960&&image.naturalHeight===720};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-bridge-front-v112.avif?v=112";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

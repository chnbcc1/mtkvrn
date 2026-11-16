/* v105: selected old knotty partially dried log obstacle; transparent background.
   Only the log picture changes. Positions, collision geometry and physics stay v104. */
(function(global){
 "use strict";
 const image=new Image();
 image.decoding="async";
 const art={image,ready:false};
 global.MTK_V105_LOG_OBSTACLE=art;
 image.onload=()=>{art.ready=image.naturalWidth===434&&image.naturalHeight===741};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-log-v105.avif?v=105";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

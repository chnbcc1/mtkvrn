/* v106: approved transparent road-rock pile.
   Render the replacement rock art without changing legacy rock geometry or physics. */
(function(global){
 "use strict";
 const image=new Image();
 image.decoding="async";
 const art={image,ready:false};
 global.MTK_V106_ROCK_OBSTACLE=art;
 image.onload=()=>{art.ready=image.naturalWidth===434&&image.naturalHeight===741};
 image.onerror=()=>{art.ready=false};
 image.src="./assets/forest-rock-v106.avif?v=106";
 if(image.complete&&image.naturalWidth)image.onload();
})(window);

/* v111: three approved bridge asset images loaded once without changing game mechanics. */
(function(global){
 "use strict";
 const art={};global.MTK_V111_BRIDGE_ART=art;
 for(const [name,w,h] of [["broken",960,720],["restored",960,720],["plank",177,480]]){
  const image=new Image();image.decoding="async";
  const item={image,ready:false};art[name]=item;
  image.onload=()=>{item.ready=image.naturalWidth===w&&image.naturalHeight===h};
  image.onerror=()=>{item.ready=false};
  image.src="./assets/forest-bridge-"+name+"-v111.avif?v=111";
  if(image.complete&&image.naturalWidth)image.onload();
 }
})(window);

/* v89 — true road-perspective sprites.
   The high-resolution transparent images are the original individually
   illustrated 2.5D obstacles (v85). Unlike v88's severely downsampled
   60x85 column atlas, each source keeps its own detailed 128–150x224 image.
   They are authored with a narrow far end and wide near end, so do not
   rotate, repeat, flatten or draw several copies in one obstacle. */
(function(global){
 "use strict";
 const original=global.MTK_V85_ROAD_OBSTACLES||{};
 const sources=Object.create(null);
 const states=Object.create(null);
 const names=["log","rock","root","mushroom","gap"];
 for(const kind of names){
  const image=new Image();
  image.decoding="async";
  states[kind]={image,ready:false};
  image.onload=()=>{states[kind].ready=true};
  image.onerror=()=>{states[kind].ready=false};
  image.src=original[kind]||"";
  if(image.complete&&image.naturalWidth)states[kind].ready=true;
 }
 global.MTK_V89_PERSPECTIVE_OBSTACLES=Object.freeze({
  get(kind){const state=states[kind];return state?.ready?state.image:null},
  kinds:Object.freeze(names),
  sourceVersion:85,version:89
 });
})(window);

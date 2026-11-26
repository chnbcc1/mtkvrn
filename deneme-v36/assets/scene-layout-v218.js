/* v218: staged shared scene plane and 50/50 layout; no live activation. */
(function(root){
const api=(function buildAPI(){
"use strict";
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const finite=(...n)=>n.every(Number.isFinite);
function split(w,h,orientation=w>h?"landscape":"portrait"){
 if(!finite(w,h)||w<=0||h<=0||!["portrait","landscape"].includes(orientation))return null;
 return orientation==="portrait"?{orientation,visual:[0,0,w,h/2],question:[0,h/2,w,h/2]}:{orientation,visual:[0,0,w/2,h],question:[w/2,0,w/2,h]};
}
// All plaques, including inactive slots, and the reserved character rectangle
// remain visible. Verified image-specific safe crop limits are additional constraints.
function protectedBand(boxes,character){
 if(!Array.isArray(boxes)||!boxes.length||!character)return null;
 const {left,bottom,width,height}=character;
 if(!finite(left,bottom,width,height)||left<0||bottom<0||width<=0||height<=0||left+width>100||bottom+height>100)return null;
 if(boxes.some(b=>!Array.isArray(b)||b.length!==4||!finite(...b)||b[2]<=0||b[3]<=0||b[0]-b[2]/2<0||b[0]+b[2]/2>100||b[1]-b[3]/2<0||b[1]+b[3]/2>100))return null;
 const top=Math.min(100-bottom-height,...boxes.map(b=>b[1]-b[3]/2));
 const end=Math.max(100-bottom,...boxes.map(b=>b[1]+b[3]/2));
 return [Math.max(0,top-1),Math.min(100,end+1)];
}
function geometry(w,h,iw,ih,{orientation="portrait",band=[0,100],verifiedCropBand=null}={}){
 if(!finite(w,h,iw,ih)||Math.min(w,h,iw,ih)<=0||!["portrait","landscape"].includes(orientation))return null;
 const contain=Math.min(w/iw,h/ih);
 let scale=contain,y=(h-ih*scale)/2;
 // A crop is only possible vertically, only in landscape, and only with
 // an explicitly image-verified band. Unverified assets use contain.
 if(orientation==="landscape"&&Array.isArray(verifiedCropBand)&&verifiedCropBand.length===2&&finite(...verifiedCropBand,...band)&&verifiedCropBand[0]>=0&&verifiedCropBand[1]<=100&&verifiedCropBand[0]<verifiedCropBand[1]){
  const lo=Math.min(band[0],verifiedCropBand[0])/100,hi=Math.max(band[1],verifiedCropBand[1])/100;
  if(lo>=0&&hi<=1&&hi>lo){
   scale=Math.min(w/iw,h/(ih*(hi-lo)));
   if(scale>contain+1e-8){
    const ph=ih*scale;
    const minY=Math.max(h-ph,-lo*ph),maxY=Math.min(0,h-hi*ph);
    y=clamp((h-ph)/2,minY,Math.max(minY,maxY));
   }else{scale=contain;y=(h-ih*scale)/2;}
  }
 }
 const width=iw*scale,height=ih*scale,x=(w-width)/2;
 return {x,y,width,height,scale,cropTop:Math.max(0,-y),cropBottom:Math.max(0,y+height-h),fit:height>h+1e-7?"vertical-crop":"contain"};
}
// v226: original artwork only. Fill width, anchor top, crop bottom only.
// Reviewed per-scene foreground limits protect machinery and all plaque slots.
const SAFE_BOTTOM=Object.freeze({F01:74,F02:81,F03:72,F04:77,F05:84,F06:86,F07:83,F08:82,F09:77,F10:78,F11:82,F12:78,F13:77,F14:80,F15:79,F16:78,F17:78,F18:80,F19:83,F20:83,F21:76});
function sceneGeometry(w,h,iw,ih,boxes,id){
 if(!finite(w,h,iw,ih)||Math.min(w,h,iw,ih)<=0||!Array.isArray(boxes)||!boxes.length)return null;
 const minBottom=Math.min(100,Math.max(SAFE_BOTTOM[id]||100,...boxes.map(b=>b[1]+b[3]/2+1.5)))/100;
 const scale=Math.min(w/iw,h/(ih*minBottom));
 const width=iw*scale,height=ih*scale,x=(w-width)/2,y=0;
 return {x,y,width,height,scale,cropTop:0,cropBottom:Math.max(0,height-h),fit:Math.abs(width-w)<1e-6?"width-fill":"protected-fill",ambient:width<w-1e-6||height<h-1e-6,visibleFraction:Math.min(1,h/height),minBottom};
}
function project(box,g){const [x,y,w,h]=box;return {left:g.x+(x-w/2)*g.width/100,top:g.y+(y-h/2)*g.height/100,width:w*g.width/100,height:h*g.height/100};}
function shell(container,{documentRef=typeof document!=="undefined"?document:null,orientation=null}={}){
 if(!container||!documentRef)return null;
 const el=documentRef.createElement("section"),visual=documentRef.createElement("div"),question=documentRef.createElement("div"),content=documentRef.createElement("div"),readout=documentRef.createElement("div"),choices=documentRef.createElement("div"),actions=documentRef.createElement("div");
 el.className="mtk-scene-shell-v218";
 Object.assign(el.style,{position:"relative",display:"grid",width:"100%",height:"100%",minWidth:"0",minHeight:"0",overflow:"hidden",boxSizing:"border-box"});
 Object.assign(visual.style,{position:"relative",overflow:"hidden",minWidth:"0",minHeight:"0",background:"#123d32"});
 visual.setAttribute("aria-label","Araştırma görseli");
 Object.assign(question.style,{display:"flex",flexDirection:"column",minWidth:"0",minHeight:"0",overflowY:"auto",overflowX:"hidden",boxSizing:"border-box",padding:"8px",gap:"8px",background:"#fff6df",color:"#33291b",touchAction:"pan-y",WebkitOverflowScrolling:"touch"});
 question.setAttribute("aria-label","Soru ve seçenekler");question.tabIndex=0;
 for(const part of [content,readout,choices,actions])Object.assign(part.style,{minWidth:"0",flex:"0 0 auto"});
 for(const part of [choices,actions])Object.assign(part.style,{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"6px"});
 const navigation=documentRef.createElement("div");navigation.className="mtk-trail-navigation-v237";navigation.hidden=true;question.append(navigation,content,choices,readout,actions);el.append(visual,question);container.append(el);
 let mode="portrait",callback=null;
 function refresh(){
  const w=el.clientWidth,h=el.clientHeight,p=split(w,h,orientation||((typeof matchMedia==="function")?matchMedia("(orientation:landscape)").matches?"landscape":"portrait":w>h?"landscape":"portrait"));
  if(!p)return null;
  mode=p.orientation;el.dataset.orientation=mode;
  el.style.gridTemplateColumns=mode==="landscape"?"minmax(0,1fr) minmax(0,1fr)":"minmax(0,1fr)";
  el.style.gridTemplateRows=mode==="portrait"?"minmax(0,1fr) minmax(0,1fr)":"minmax(0,1fr)";
  callback?.(mode);return p;
 }
 const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(refresh):null;observer?.observe(el);
 if(typeof window!=="undefined")window.addEventListener("resize",refresh);
 refresh();
 return {element:el,visual,question,navigation,content,readout,choices,actions,refresh,get orientation(){return mode},onLayout(fn){callback=fn;refresh()},destroy(){observer?.disconnect();if(typeof window!=="undefined")window.removeEventListener("resize",refresh);callback=null;el.remove()}};
}
function loadImage(documentRef,src){
 return new Promise(resolve=>{
  const img=documentRef.createElement("img");
  img.onload=()=>resolve(img.naturalWidth&&img.naturalHeight?img:null);
  img.onerror=()=>resolve(null);img.decoding="async";img.draggable=false;img.src=src;
 });
}
// Detached shell is not useful for pixel measurements: caller must attach it
// first. This function never removes an existing live game or changes its DOM.
async function mountScene({q,ui,sceneAPI,characterAPI,plaqueAPI,matchingAPI,specialAPI,run,save,onWrong,verifiedCropBand=null,documentRef=typeof document!=="undefined"?document:null}={}){
 const plan=sceneAPI?.plan(q),spec=sceneAPI?.scenes?.[q?.obstacleId],character=characterAPI?.plan(q?.obstacleId);
 if(!ui?.element?.isConnected||!documentRef||!plan||!spec||!character||!plaqueAPI)return null;
 if(!/^[a-z0-9-]+\.webp$/i.test(plan.file))return null;
 const band=protectedBand(spec.boxes,character);if(!band)return null;
 const image=await loadImage(documentRef,"./assets/"+plan.file);
 if(!image||!ui.element.isConnected)return null;
 const plane=documentRef.createElement("div");plane.className="mtk-master-plane-v218";
 Object.assign(plane.style,{position:"absolute",visibility:"hidden",overflow:"visible",isolation:"isolate"});
 image.alt="Araştırma görevinin onaylı ana sahnesi";
 Object.assign(image.style,{position:"absolute",inset:"0",width:"100%",height:"100%",objectFit:"contain",pointerEvents:"none",userSelect:"none",zIndex:"0"});
 plane.append(image);ui.visual.append(plane);
 const clean=[];let closed=false;let char=null;const ambient=documentRef.createElement("div");
 Object.assign(ambient.style,{position:"absolute",inset:"0",backgroundImage:"url(\"./assets/"+plan.file+"\")",backgroundSize:"cover",backgroundPosition:"center bottom",filter:"blur(12px) brightness(.72)",transform:"scale(1.09)",pointerEvents:"none",zIndex:"0"});
 ui.visual.insertBefore(ambient,plane);plane.style.zIndex="1";
 const overlay=documentRef.createElement("div");overlay.className="mtk-character-overlay-v226";Object.assign(overlay.style,{position:"absolute",inset:"0",pointerEvents:"none",zIndex:"2",visibility:"hidden"});ui.visual.append(overlay);
 function refresh(){
  const g=sceneGeometry(ui.visual.clientWidth,ui.visual.clientHeight,image.naturalWidth,image.naturalHeight,spec.boxes,q.obstacleId);
  if(!g)return null;
  Object.assign(plane.style,{left:g.x+"px",top:g.y+"px",width:g.width+"px",height:g.height+"px"});ambient.hidden=!g.ambient;
  if(char){const boxes=spec.boxes.map(b=>project(b,g));characterAPI.place(char,ui.visual.clientWidth,ui.visual.clientHeight,boxes);}
  return g;
 }
 function destroy(){if(closed)return;closed=true;ui.onLayout(null);clean.forEach(f=>f());plane.remove();ambient.remove();overlay.remove()}
 try{
  if(!refresh()){destroy();return null}
  char=await characterAPI.mountOverlay(overlay,q.obstacleId,plan,{documentRef});
  if(!char||closed||!ui.element.isConnected){destroy();return null}
  const special= specialAPI?.ids?.includes(q.obstacleId)?specialAPI.mount({q,plane,readout:ui.readout,documentRef}):null;
  if(specialAPI?.ids?.includes(q.obstacleId)&&!special){destroy();return null}
  if(special)clean.push(()=>special.destroy());
  if(plan.matching){
   const match=matchingAPI?.mount({q,plan,plane,readout:ui.readout,choices:ui.choices,run,save,plaqueAPI,documentRef,onWrong});
   if(!match){destroy();return null}clean.push(()=>match.destroy());
  }else if(q.obstacleId==="F02"||q.obstacleId==="F03"||!special?.description?.diagramOnly){
   // F03 question text contains every given. Never duplicate it below the choices.
   const panel=q.obstacleId==="F03"?null:plaqueAPI.mountReadout(ui.readout,plan.labels,{documentRef});
   if(!panel&&q.obstacleId!=="F03"){destroy();return null}if(panel)clean.push(()=>panel.destroy());
   for(const label of plan.labels){
    const view=plaqueAPI.mount(plane,label,{documentRef,onFit:(l,r)=>panel?.update(l,r)});
    if(!view){destroy();return null}clean.push(()=>view.destroy());
   }
  }
  ui.onLayout(refresh);plane.style.visibility="visible";overlay.style.visibility="visible";
  return {plane,character:char,refresh,destroy,plan,band};
 }catch(e){destroy();return null}
}
return Object.freeze({split,protectedBand,geometry,sceneGeometry,SAFE_BOTTOM,project,shell,mountScene});
})();
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKSceneLayoutV218=api;
})(typeof window!=="undefined"?window:globalThis);

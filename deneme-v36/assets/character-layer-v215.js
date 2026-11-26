/* v215: exact approved reference, shared scale and a reserved foreground slot.
   Staging module; do not activate before scene assets and visual tests are ready. */
(function(root){
"use strict";
const REFERENCE="./assets/erdem-ciko-onayli-v180.png?v=180";
const IDS=Object.freeze(["F01","F02","F03","F04","F05","F06","F07","F08","F09","F10","F11","F12","F13","F14","F21","F15","F16","F17","F18","F19","F20"]);
/* Percent of the square master plane, not of the whole viewport.
   Use F03's existing 23.4% width as the initial shared width.
   Max-height avoids overlapping plaques; contain preserves the PNG proportions.
   These are provisional until the original PNG is decoded in a real browser. */
const SLOT=Object.freeze({left:3,bottom:3,width:23.4,height:22});
function plan(id){return IDS.includes(id)?{source:REFERENCE,...SLOT}:null;}
function fits(p,labels){
 if(!p)return false;
 const l=p.left,r=l+p.width,b=100-p.bottom,t=b-p.height;
 return l>=0&&t>=0&&r<=100&&b<=100&&labels.every(v=>{
  const [x,y,w,h]=v.box;
  return r<=x-w/2||l>=x+w/2||b<=y-h/2||t>=y+h/2;
 });
}
function mount(plane,id,layout,{documentRef=typeof document!=="undefined"?document:null}={}){
 const p=plan(id);
 if(!plane||!documentRef||!layout||layout.character!=="erdem-ciko-onayli-v180.png"||!fits(p,layout.labels||[]))return Promise.resolve(null);
 return new Promise(resolve=>{
  const img=documentRef.createElement("img");
  img.className="mtk-approved-character-v215";
  img.alt="Erdem ve Çiko – onaylı karakter referansı";
  img.draggable=false;img.decoding="async";
  Object.assign(img.style,{position:"absolute",left:p.left+"%",bottom:p.bottom+"%",width:p.width+"%",height:p.height+"%",maxWidth:"none",maxHeight:"none",objectFit:"contain",objectPosition:"left bottom",pointerEvents:"none",userSelect:"none",zIndex:"2",filter:"none",transform:"none"});
  img.onload=()=>{
   if(!img.naturalWidth||!img.naturalHeight||plane.isConnected===false){resolve(null);return;}
   /* Only replace our own layer, never another asset, never the question DOM. */
   plane.querySelector(".mtk-approved-character-v215")?.remove();
   plane.appendChild(img);resolve(img);
  };
  img.onerror=()=>resolve(null);
  img.src=p.source;
 });
}
// v226: crop transparent margins for layout only; the original PNG is unchanged.
function alphaBounds(img,doc){
 const w=img.naturalWidth,h=img.naturalHeight;
 try{
  const canvas=doc.createElement("canvas");canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(img,0,0);
  const data=ctx.getImageData(0,0,w,h).data;
  let left=w,top=h,right=-1,bottom=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>0){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y)}
  if(right>=left&&bottom>=top)return {left,top,width:right-left+1,height:bottom-top+1};
 }catch(e){}
 return {left:0,top:0,width:w,height:h};
}
// Actual opaque extent (not transparent PNG canvas) is the size target.
// Keep the left-bottom anchor, and reduce only if a plaque would be obscured.
function placement(w,h,aspect,boxes=[]){
 if(![w,h,aspect].every(Number.isFinite)||Math.min(w,h,aspect)<=0)return null;
 const left=w*.025,bottom=h*.025,pad=Math.max(3,Math.min(w,h)*.008);
 let width=Math.min(w*.255,h*.46*aspect,w-left);
 function rect(size){return {left,top:h-bottom-size/aspect,width:size,height:size/aspect}}
 function safe(r){return boxes.every(b=>r.left+r.width+pad<=b.left||r.left>=b.left+b.width+pad||r.top+r.height+pad<=b.top||r.top>=b.top+b.height+pad)}
 if(!safe(rect(width))){let lo=0,hi=width;for(let i=0;i<22;i++){const mid=(lo+hi)/2;if(safe(rect(mid)))lo=mid;else hi=mid}width=lo;}
 return rect(width);
}
function place(layer,w,h,boxes){
 const b=layer?.bounds;if(!b)return null;
 const r=placement(w,h,b.width/b.height,boxes);if(!r)return null;
 const scale=r.width/b.width;
 Object.assign(layer.wrapper.style,{left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px"});
 Object.assign(layer.image.style,{left:(-b.left*scale)+"px",top:(-b.top*scale)+"px",width:(layer.image.naturalWidth*scale)+"px",height:(layer.image.naturalHeight*scale)+"px"});
 return r;
}
function mountOverlay(overlay,id,layout,{documentRef=typeof document!=="undefined"?document:null}={}){
 if(!overlay||!documentRef||!plan(id)||layout.character!=="erdem-ciko-onayli-v180.png")return Promise.resolve(null);
 return new Promise(resolve=>{
  const img=documentRef.createElement("img");img.className="mtk-approved-character-v215";img.alt="Erdem ve Çiko – onaylı karakter referansı";img.draggable=false;img.decoding="async";
  Object.assign(img.style,{position:"absolute",maxWidth:"none",maxHeight:"none",pointerEvents:"none",userSelect:"none",filter:"none"});
  img.onload=()=>{if(!img.naturalWidth||!img.naturalHeight||!overlay.isConnected){resolve(null);return}
   const bounds=alphaBounds(img,documentRef),wrapper=documentRef.createElement("div");Object.assign(wrapper.style,{position:"absolute",overflow:"hidden",pointerEvents:"none"});wrapper.append(img);overlay.append(wrapper);resolve({image:img,wrapper,bounds,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight})};
  img.onerror=()=>resolve(null);img.src=REFERENCE;
 });
}
const api=Object.freeze({plan,fits,mount,alphaBounds,placement,place,mountOverlay,REFERENCE,IDS,SLOT});
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKCharacterLayerV215=api;
})(typeof window!=="undefined"?window:globalThis);

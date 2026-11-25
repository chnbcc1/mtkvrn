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
const api=Object.freeze({plan,fits,mount,REFERENCE,IDS,SLOT});
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKCharacterLayerV215=api;
})(typeof window!=="undefined"?window:globalThis);

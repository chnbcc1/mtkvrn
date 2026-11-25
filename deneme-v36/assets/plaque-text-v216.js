/* v216 — staged plaque text fitting. No question values are rewritten. */
(function(root){
"use strict";
const MIN_READABLE=11,LINE=1.24,MAX_LINES=3;
function candidates(value){
 const s=String(value??"");
 const out=[[s]],seen=new Set([s]);
 // Split only at explicit data separators or before an arithmetic operator;
 // never split a number, exponent, radical, fraction, or parenthesized term.
 const breaks=[];let depth=0;
 for(let i=0;i<s.length;i++){
  const c=s[i];if(c==="(")depth++;if(c===")")depth=Math.max(0,depth-1);
  if(depth!==0)continue;
  if(c===";"||c===","&&/\s/.test(s[i+1]||""))breaks.push(i+1);
  else if(/[+−=]/.test(c)&&i>0&&s[i-1]===" ")breaks.push(i);
 }
 function add(points){
  let start=0,lines=[];for(const i of [...points,s.length]){lines.push(s.slice(start,i).trim());start=i;}
  if(lines.some(x=>!x)||lines.length>MAX_LINES)return;
  const k=lines.join("\n");if(!seen.has(k)){seen.add(k);out.push(lines);}
 }
 for(let i=0;i<breaks.length;i++){add([breaks[i]]);for(let j=i+1;j<breaks.length;j++)add([breaks[i],breaks[j]]);}
 return out;
}
function fit(value,width,height,measure,{maxSize=32,minReadable=MIN_READABLE}={}){
 if(!(width>0&&height>0)||typeof measure!=="function")return null;
 const w=width*.92,h=height*.88;let best=null;
 for(const lines of candidates(value)){
  let lo=0,hi=Math.min(maxSize,h/(LINE*lines.length));
  for(let i=0;i<20;i++){const mid=(lo+hi)/2;
   if(lines.every(s=>measure(s,mid)<=w))lo=mid;else hi=mid;
  }
  const size=Math.floor(lo*10)/10;
  if(!best||size>best.size||size===best.size&&lines.length<best.lines.length)best={lines,size};
 }
 return {...best,readable:best.size>=minReadable,width:w,height:h,lineHeight:LINE};
}
function mount(plane,label,{documentRef=typeof document!=="undefined"?document:null,matching=false,onActivate=null}={}){
 if(!plane||!documentRef||!label||!Array.isArray(label.box))return null;
 const el=documentRef.createElement(matching?"button":"span");
 if(matching)el.type="button";
 const span=documentRef.createElement("span");
 const [x,y,w,h]=label.box,rot=label.rotation||0;
 const color=matching?"#302515":"#fff4d5";
 el.className="mtk-plaque-v216";el.dataset.slot=String(label.slot);el.dataset.anchor=label.anchor;
 el.setAttribute("aria-label",label.anchor+": "+label.value);
 Object.assign(el.style,{position:"absolute",left:x+"%",top:y+"%",width:w+"%",height:h+"%",transform:"translate(-50%,-50%)",display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box",padding:"0",border:"0",background:"transparent",color,zIndex:"3",overflow:"visible",fontFamily:"Arial, system-ui, sans-serif",fontWeight:"700",textAlign:"center",cursor:matching?"pointer":"default",pointerEvents:matching?"auto":"none"});
 Object.assign(span.style,{display:"block",flex:"none",textAlign:"center",whiteSpace:"pre",lineHeight:String(LINE),transform:rot?"rotate("+rot+"deg)":"none",textShadow:matching?"none":"0 1px 2px #000"});
 el.appendChild(span);plane.appendChild(el);
 const ctx=documentRef.createElement("canvas").getContext("2d");
 function refresh(){
  if(!ctx)return null;
  const rect=el.getBoundingClientRect();
  const ww=rot?rect.height:rect.width,hh=rot?rect.width:rect.height;
  const measure=(s,size)=>{ctx.font="700 "+size+"px Arial, system-ui, sans-serif";return ctx.measureText(s).width;};
  const r=fit(label.value,ww,hh,measure,{maxSize:Math.max(12,Math.min(32,plane.clientWidth*.075))});
  if(!r)return null;
  span.style.fontSize=r.size+"px";span.textContent=r.lines.join("\n");
  el.dataset.readable=String(r.readable);
  return r;
 }
 let observer=null;
 if(typeof ResizeObserver!=="undefined"){observer=new ResizeObserver(refresh);observer.observe(plane);}
 if(documentRef.fonts?.ready)documentRef.fonts.ready.then(()=>{if(el.isConnected)refresh();});
 if(matching&&typeof onActivate==="function")el.addEventListener("click",()=>onActivate(label));
 refresh();
 return {element:el,refresh,destroy(){observer?.disconnect();el.remove();}};
}
const api=Object.freeze({candidates,fit,mount,MIN_READABLE,LINE});
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKPlaqueTextV216=api;
})(typeof window!=="undefined"?window:globalThis);

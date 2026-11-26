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
  else if(/[+−=×÷·]/.test(c)&&i>0&&s[i-1]===" ")breaks.push(i);
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
// v229: a meaningful caption is fitted together with its original value.
function fitCaption(caption,value,width,height,measure,{maxSize=32}={}){
 const w=width*.92,h=height*.88;
 const one=fit(caption+": "+value,width,height,measure,{maxSize,minReadable:11});
 let lo=0,hi=Math.min(maxSize,h/1.13);
 // Two distinct lines: gold semantic caption and larger cream value.
 for(let i=0;i<22;i++){const mid=(lo+hi)/2,small=Math.min(15,mid*.82);if(measure(caption,small)<=w&&measure(value,mid)<=w&&(small+mid)*1.10<=h)lo=mid;else hi=mid}
 const size=Math.floor(lo*10)/10,captionSize=Math.min(15,Math.floor(size*.82*10)/10);
 const stacked={size,captionSize,caption,value,lines:[caption,value],width:w,height:h,readable:captionSize>=10&&size>=11,stacked:true};
 if(one.readable&&(!stacked.readable||one.size>=stacked.size*.9))return {...one,stacked:false,caption,value};
 return stacked.readable||size>=one.size?stacked:{...one,stacked:false,caption,value};
}
function mount(plane,label,{documentRef=typeof document!=="undefined"?document:null,matching=false,onActivate=null,onFit=null}={}){
 if(!plane||!documentRef||!label||!Array.isArray(label.box))return null;
 const el=documentRef.createElement(matching?"button":"span");
 if(matching)el.type="button";
 const span=documentRef.createElement("span");
 // Avoid baseline-dependent offsets: the whole multiline block is centered.
 const [x,y,w,h]=label.box,rot=label.rotation||0;
 const color=matching?"#302515":"#fff4d5";
 el.className="mtk-plaque-v216";el.dataset.slot=String(label.slot);el.dataset.anchor=label.anchor;
 el.setAttribute("aria-label",(label.caption||label.anchor)+": "+(label.displayValue||label.value));
 Object.assign(el.style,{position:"absolute",left:x+"%",top:y+"%",width:w+"%",height:h+"%",transform:"translate(-50%,-50%)",display:"flex",alignItems:"center",justifyContent:"center",boxSizing:"border-box",padding:"0",border:"0",background:"transparent",color,zIndex:"3",overflow:"visible",fontFamily:"Arial, system-ui, sans-serif",fontWeight:"700",textAlign:"center",cursor:matching?"pointer":"default",pointerEvents:matching?"auto":"none"});
 Object.assign(span.style,{display:"block",flex:"none",textAlign:"center",whiteSpace:"pre",lineHeight:String(LINE),fontVariantNumeric:"lining-nums tabular-nums",transform:rot?"rotate("+rot+"deg)":"none",textShadow:matching?"none":"0 1px 2px #000"});
 el.appendChild(span);plane.appendChild(el);
 const ctx=documentRef.createElement("canvas").getContext("2d");
 function refresh(){
  if(!ctx)return null;
  const rect=el.getBoundingClientRect();
  // Fit the actual tilted F07 plate, not its axis-aligned bounding rectangle.
  const tilted=rot&&Math.abs(Math.abs(rot)-90)>1;
  const ww=tilted?rect.height*.80:rot?rect.height:rect.width;
  const hh=tilted?rect.width*.45:rot?rect.width:rect.height;
  const measure=(s,size)=>{ctx.font="700 "+size+"px Arial, system-ui, sans-serif";return ctx.measureText(s).width;};
  const opts={maxSize:Math.max(12,Math.min(32,plane.clientWidth*.075))};
  const r=label.caption?fitCaption(label.caption,label.displayValue??label.value,ww,hh,measure,opts):fit(label.value,ww,hh,measure,opts);
  if(!r)return null;
  span.style.fontSize=r.size+"px";span.style.lineHeight=r.stacked?"1.10":String(LINE);span.textContent=r.lines.join("\n");
  if(r.stacked){const heading=documentRef.createElement("span"),value=documentRef.createElement("span");heading.textContent=r.caption;value.textContent=r.value;Object.assign(heading.style,{display:"block",fontSize:r.captionSize+"px",color:"#f1d397",lineHeight:"1.10"});Object.assign(value.style,{display:"block",fontSize:r.size+"px",lineHeight:"1.10"});span.replaceChildren(heading,value)}
  el.dataset.readable=String(r.readable);
  if(typeof onFit==="function")onFit(label,r);
  return r;
 }
 let observer=null;
 if(typeof ResizeObserver!=="undefined"){observer=new ResizeObserver(refresh);observer.observe(plane);}
 if(documentRef.fonts?.ready)documentRef.fonts.ready.then(()=>{if(el.isConnected)refresh();});
 if(matching&&typeof onActivate==="function")el.addEventListener("click",()=>onActivate(label));
 refresh();
 return {element:el,refresh,destroy(){observer?.disconnect();el.remove();}};
}
/* A readout outside the artwork: keep source expressions intact when the
   plaque cannot display them at the provisional readable size. */
function unreadableRows(labels,results){
 return labels.filter(l=>results.get(l.slot)?.readable===false).map(l=>({slot:l.slot,anchor:l.caption||String(l.anchor).replace(/_/g," "),value:String(l.displayValue??l.value)}));
}
function mountReadout(container,labels,{documentRef=typeof document!=="undefined"?document:null}={}){
 if(!container||!documentRef)return null;
 const results=new Map();
 const panel=documentRef.createElement("section"),heading=documentRef.createElement("div"),list=documentRef.createElement("dl");
 panel.className="mtk-plaque-readout-v216";panel.hidden=true;
 panel.setAttribute("aria-label","Görselde küçük kalan soru verileri");
 heading.textContent="Görseldeki veriler";
 Object.assign(heading.style,{fontWeight:"700",marginBottom:"4px"});
 Object.assign(panel.style,{fontSize:"14px",lineHeight:"1.45",padding:"8px",border:"1px solid currentColor",borderRadius:"8px",maxWidth:"100%",boxSizing:"border-box"});
 Object.assign(list.style,{margin:"0",display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.2fr)",gap:"4px 8px"});
 panel.append(heading,list);container.appendChild(panel);
 function update(label,result){
  results.set(label.slot,result);
  const rows=unreadableRows(labels,results);
  list.replaceChildren();panel.hidden=rows.length===0;
  for(const row of rows){const k=documentRef.createElement("dt"),v=documentRef.createElement("dd");k.textContent=row.anchor;v.textContent=row.value;Object.assign(k.style,{overflowWrap:"anywhere"});Object.assign(v.style,{margin:"0",fontWeight:"700",whiteSpace:"normal",overflowWrap:"anywhere"});list.append(k,v);}
 }
 return {element:panel,update,destroy(){panel.remove();}};
}
const api=Object.freeze({candidates,fit,fitCaption,mount,unreadableRows,mountReadout,MIN_READABLE,LINE});
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKPlaqueTextV216=api;
})(typeof window!=="undefined"?window:globalThis);

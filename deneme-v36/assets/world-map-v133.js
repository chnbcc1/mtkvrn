/* Matematik Evreni v133 — seamless expanding world, chapter-specific atmospheric fog.
   Single illustration. Never display unreached regions, roads, names or labels.
   Unlock logic depends exclusively on actual canonical game progress. */
(function(){
"use strict";
const SAVE="mathverse-v40-investigation",FOREST="mathverse-v68-forest-full";
const EXTRA="mathverse-v128-chapter-milestones";
const W=1671,H=941;
const ROOT_TILE="origin";
const STYLE_KEY="matematik-evreni-premium-3d-v1";
const art="./assets/premium-map-approved-v130.avif?v=130";
// The same full-resolution approved artwork is retained. Mist reveals it by stage metadata.
// Approved world illustration: its pixels, three landmarks and story text stay unchanged.
// Future illustrations attach with a shared, visually matched 90–140px edge strip.
const tiles=[{id:ROOT_TILE,src:art,x:0,y:0,w:W,h:H,overlap:0,side:null,styleKey:STYLE_KEY}];
const chapters=[
 {id:"home",name:"Dedenin Evi",icon:"🏡",x:326,y:401,rx:169,ry:76,after:null,tileId:ROOT_TILE,playable:true,route:"./?scene=home&autostart=1&v=133"},
 {id:"forest",name:"Orman Patikası",icon:"🌲",x:754,y:588,rx:190,ry:83,after:"home",tileId:ROOT_TILE,fogPolygon:[[545,170],[1115,160],[1235,415],[1140,670],[1110,941],[465,941],[505,750],[565,510]],playable:true,route:"./forest-v113-full.html?resume=1&v=133"},
 {id:"observatory",name:"Gözlemevi",icon:"🔭",x:1430,y:495,rx:194,ry:83,after:"forest",tileId:ROOT_TILE,fogPolygon:[[1140,175],[1671,155],[1671,941],[1060,941],[1045,720],[1140,475]],playable:false,route:null}
];
function read(key){try{return JSON.parse(localStorage.getItem(key)||"null")||{}}catch(_){return {}}}
function progress(){
 const house=read(SAVE),forest=read(FOREST),extra=read(EXTRA);
 const houseDone=Boolean(house.complete&&house.visitedStudy);
 const solved=Array.isArray(forest.solvedIds)?new Set(forest.solvedIds).size:0;
 const forestDone=Boolean(houseDone&&forest.reachedGate&&solved>=21);
 const done=new Set([
  ...(houseDone?["home"]:[]),
  ...(forestDone?["forest"]:[]),
  ...(Array.isArray(extra.completed)?extra.completed:[])
 ]);
 function revealed(stage,seen=new Set()){
  if(!stage||seen.has(stage.id))return false;
  if(stage.after===null)return true;
  seen.add(stage.id);
  const previous=chapters.find(c=>c.id===stage.after);
  return Boolean(previous&&done.has(previous.id)&&revealed(previous,seen));
 }
 const status=chapters.map(c=>({...c,unlocked:revealed(c),complete:done.has(c.id)&&revealed(c)}));
 const discovered=status.filter(c=>c.unlocked);
 return {chapters:status,discovered:discovered.map(c=>c.id),solved,
   houseDone,forestDone,furthest:discovered.length-1};
}
function registerTile(def){
 if(!def||typeof def!=="object"||typeof def.id!=="string"||!/^[a-z0-9-]{2,35}$/.test(def.id)||tiles.some(t=>t.id===def.id))return false;
 const parent=tiles.find(t=>t.id===def.afterTile);
 const side=def.side,overlap=Number(def.overlap??110);
 if(!parent||!["right","left","top","bottom"].includes(side)||!Number.isFinite(overlap)||overlap<24||overlap>200)return false;
 if(typeof def.src!=="string"||!/^\.\/assets\/[a-z0-9_\-./]+\.(avif|webp|png|jpe?g)(?:\?v=\d+)?$/i.test(def.src))return false;
 if(def.styleKey!==STYLE_KEY)return false;
 const w=Number(def.w),h=Number(def.h),offset=Number(def.offset||0);
 if(!Number.isFinite(w)||!Number.isFinite(h)||!Number.isFinite(offset)||w<500||w>4096||h<400||h>2500)return false;
 if(Math.abs(w/h-parent.w/parent.h)>.34)return false;
 let x=parent.x,y=parent.y;
 if(side==="right") {x+=parent.w-overlap;y+=offset}
 if(side==="left") {x-=w-overlap;y+=offset}
 if(side==="bottom"){y+=parent.h-overlap;x+=offset}
 if(side==="top")  {y-=h-overlap;x+=offset}
 const next={id:def.id,src:def.src,x,y,w,h,afterTile:parent.id,side,overlap,styleKey:STYLE_KEY};
 // No accidental covering of earlier chapters or disconnected / floating tiles.
 if(tiles.some(t=>Math.max(0,Math.min(next.x+next.w,t.x+t.w)-Math.max(next.x,t.x))*
                    Math.max(0,Math.min(next.y+next.h,t.y+t.h)-Math.max(next.y,t.y))>overlap*Math.max(h,w)*1.35))return false;
 tiles.push(next);return true;
}
function worldBounds(){
 return {minX:Math.min(...tiles.map(t=>t.x)),minY:Math.min(...tiles.map(t=>t.y)),
 maxX:Math.max(...tiles.map(t=>t.x+t.w)),maxY:Math.max(...tiles.map(t=>t.y+t.h))};
}
function polygonIsValid(poly,w,h){
 return Array.isArray(poly)&&poly.length>=3&&poly.length<=40&&
 poly.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&p[0]>=0&&p[0]<=w&&p[1]>=0&&p[1]<=h);
}
function registerChapter(c){
 if(!c||typeof c.id!=="string"||!/^[a-z0-9-]{2,35}$/.test(c.id)||chapters.some(t=>t.id===c.id))return false;
 if(!c.after||!chapters.some(t=>t.id===c.after)||typeof c.name!=="string"||!c.name.trim())return false;
 const tile=tiles.find(t=>t.id===(c.tileId||ROOT_TILE));
 if(!tile)return false;
 const x=Number.isFinite(c.localX)?tile.x+c.localX:c.x,
       y=Number.isFinite(c.localY)?tile.y+c.localY:c.y;
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<tile.x||x>tile.x+tile.w||y<tile.y||y>tile.y+tile.h)return false;
 const fogPolygon=c.fogPolygon||
   [[0,0],[tile.w,0],[tile.w,tile.h],[0,tile.h]];
 if(!polygonIsValid(fogPolygon,tile.w,tile.h))return false;
 chapters.push({icon:"✦",playable:false,route:null,rx:95,ry:65,...c,x,y,
   tileId:tile.id,fogPolygon});return true;
}
function configureChapter(id,options){
 // Future chapter implementations may activate their own region without editing map rendering.
 const chapter=chapters.find(c=>c.id===id);if(!chapter||!options||typeof options!=="object")return false;
 if(Object.prototype.hasOwnProperty.call(options,"route")){
  if(options.route!==null&&(typeof options.route!=="string"||!options.route.startsWith("./")))return false;
  chapter.route=options.route;
 }
 if(typeof options.playable==="boolean")chapter.playable=options.playable;
 if(typeof options.mapArt==="string"&&options.mapArt.startsWith("./assets/"))chapter.mapArt=options.mapArt;
 return true;
}
function markChapterCompleted(id){
 if(["home","forest"].includes(id))return false;
 const chapter=chapters.find(c=>c.id===id);
 if(!chapter?.playable)return false;
 if(!chapters.some(c=>c.id===id&&progress().chapters.find(x=>x.id===id)?.unlocked))return false;
 const previous=read(EXTRA),done=new Set(Array.isArray(previous.completed)?previous.completed:[]);
 done.add(id);localStorage.setItem(EXTRA,JSON.stringify({...previous,completed:[...done]}));return true;
}
function element(tag,cls,text){
 const e=document.createElement(tag);
 if(cls)e.className=cls;if(text!==undefined)e.textContent=text;
 return e;
}

/* REGION-SPECIFIC FOG ENGINE.
  Fog is clipped to actual chapter polygons in each map tile. This means the
  same future artwork can hide chapter 4 while chapters 1–3 remain visible.
  Per-region opacity near its nameplate rises to 1: numbers cannot show through.
  The irregular boundary and global-coordinate cloud noise prevent box seams. */
function smoothstep(v){v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)}
function regionSignedDistance(x,y,polygon){
 let inside=false,minSq=Infinity;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const p=polygon[i],q=polygon[j],dx=q[0]-p[0],dy=q[1]-p[1];
  if((p[1]>y)!==(q[1]>y)&&x<(q[0]-p[0])*(y-p[1])/(q[1]-p[1])+p[0])inside=!inside;
  const t=Math.max(0,Math.min(1,((x-p[0])*dx+(y-p[1])*dy)/(dx*dx+dy*dy||1)));
  const xx=x-(p[0]+t*dx),yy=y-(p[1]+t*dy);
  minSq=Math.min(minSq,xx*xx+yy*yy);
 }
 return Math.sqrt(minSq)*(inside?1:-1);
}
function hashNoise(x,y,seed){
 let n=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+seed)|0;
 n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;
}
function noiseAt(x,y,scale,seed){
 const fx=x/scale,fy=y/scale,ix=Math.floor(fx),iy=Math.floor(fy);
 const u=smoothstep(fx-ix),v=smoothstep(fy-iy);
 const a=hashNoise(ix,iy,seed),b=hashNoise(ix+1,iy,seed),
       c=hashNoise(ix,iy+1,seed),d=hashNoise(ix+1,iy+1,seed);
 return (a+(b-a)*u)*(1-v)+(c+(d-c)*u)*v;
}
function fogOpacityAt(x,y,regions,globalX=x,globalY=y){
 let alpha=0;
 for(const c of regions){
  const poly=c.fogPolygon;
  if(!poly)continue;
  const raw=regionSignedDistance(x,y,poly);
  const wander=10*Math.sin(globalY*.021+Math.sin(globalX*.005)*2)+
               7*Math.sin(globalY*.054+globalX*.018);
  const feather=smoothstep((raw+wander+15)/61);
  if(feather<=0)continue;
  const density=.86+.12*noiseAt(globalX,globalY,295,193);
  let value=feather*density;
  const cx=c.x-(c.tileX||0),cy=c.y-(c.tileY||0);
  // Opaque, soft-edged mist around the painted label, not a pasted white patch.
  const near=Math.hypot((x-cx)/(c.rx+42),(y-cy)/(c.ry+38));
  const cover=smoothstep((1.56-near)/.68);
  value=Math.max(value,feather*cover);
  alpha=Math.max(alpha,value);
 }
 return Math.max(0,Math.min(1,alpha));
}
function paintRegionMist(canvas,tile,locked){
 const ctx=canvas.getContext?.("2d");
 if(!ctx)return false;
 const cols=Math.round(Math.min(700,Math.max(340,tile.w*.37)));
 const rows=Math.round(cols*tile.h/tile.w);
 canvas.width=cols;canvas.height=rows;
 const frame=ctx.createImageData(cols,rows),p=frame.data;
 const stages=locked.map(c=>({...c,tileX:tile.x,tileY:tile.y}));
 for(let py=0;py<rows;py++){
  const y=(py+.5)*tile.h/rows;
  for(let px=0;px<cols;px++){
   const x=(px+.5)*tile.w/cols,k=(py*cols+px)*4;
   const gx=tile.x+x,gy=tile.y+y;
   const alpha=fogOpacityAt(x,y,stages,gx,gy);
   if(alpha<=.002){p[k+3]=0;continue}
   const low=noiseAt(gx,gy,395,17),mid=noiseAt(gx,gy,145,87),
         fine=noiseAt(gx,gy,51,229);
   const depth=.50*low+.36*mid+.14*fine;
   // Luminous valley mist with subtle shadows, never flat white rectangles.
   p[k]=Math.round(190+42*depth);
   p[k+1]=Math.round(208+33*depth);
   p[k+2]=Math.round(201+45*depth);
   p[k+3]=Math.round(alpha*255);
  }
 }
 ctx.putImageData(frame,0,0);return true;
}

function mount(host,{from="home",onNavigate=()=>{},onClose=()=>{}}={}){
 if(!host)throw new Error("Map host is required");
 host.replaceChildren();
 const state=progress(),opened=state.chapters.filter(c=>c.unlocked);
 const bounds=worldBounds(),worldW=bounds.maxX-bounds.minX,worldH=bounds.maxY-bounds.minY;
 const selected=opened.find(c=>c.id===from)||opened[opened.length-1]||state.chapters[0];
 const viewport=element("div","mtk-cinematic-viewport");
 viewport.setAttribute("role","region");
 viewport.setAttribute("aria-label","Genişleyen macera haritası; kaydırılabilir ve yakınlaştırılabilir");
 viewport.tabIndex=0;
 const world=element("div","mtk-cinematic-world");
 const placement=(el,x,y,w,h)=>{
  el.style.left=(x-bounds.minX)/worldW*100+"%";
  el.style.top=(y-bounds.minY)/worldH*100+"%";
  el.style.width=w/worldW*100+"%";el.style.height=h/worldH*100+"%";
 };
 // Continuous world coordinates: a tile never gets stretched to fit a new area.
 for(const tile of tiles){
  const image=element("img","mtk-cinematic-art mtk-cinematic-tile");
  image.src=tile.src;image.alt=tile.id===ROOT_TILE
    ?"Onaylanan macera haritası: Dedenin Evi, Orman Patikası, Gözlemevi"
    :"Yeni keşif bölgesinin mevcut haritayla birleşen manzarası";
  image.dataset.tileId=tile.id;image.draggable=false;
  placement(image,tile.x,tile.y,tile.w,tile.h);
  if(tile.overlap){
   const amount=100*tile.overlap/(["left","right"].includes(tile.side)?tile.w:tile.h);
   const dir=tile.side;
   const fade=dir==="right"?"to right":dir==="left"?"to left":dir==="bottom"?"to bottom":"to top";
   const gradient="linear-gradient("+fade+",transparent 0%,#000 "+amount.toFixed(2)+"%,#000 100%)";
   image.style.maskImage=gradient;image.style.webkitMaskImage=gradient;
  }
  image.addEventListener("error",()=>{image.dataset.loadFailed="true"});
  world.append(image);
 }
 // Each locked region owns its fog shape. Unlocking removes ONLY its region,
 // not the haze on any later, undiscovered region on the same or a new tile.
 for(const tile of tiles){
  const locked=state.chapters.filter(c=>!c.unlocked&&c.tileId===tile.id);
  if(!locked.length)continue;
  const fog=element("canvas","mtk-cinematic-fog");
  fog.dataset.tileId=tile.id;fog.setAttribute("aria-hidden","true");
  placement(fog,tile.x,tile.y,tile.w,tile.h);
  try{
   if(!paintRegionMist(fog,tile,locked))fog.classList.add("mtk-cinematic-fog-fallback");
  }catch(_){fog.classList.add("mtk-cinematic-fog-fallback")}
  world.append(fog);
 }
 // Preserve the approved illustration's original bottom-right legend,
 // above any fog. The original artwork is never redrawn or regenerated.
 const homeTile=tiles.find(t=>t.id===ROOT_TILE);
 if(state.chapters.some(c=>!c.unlocked&&c.tileId===ROOT_TILE)&&homeTile){
  const legend=element("img","mtk-cinematic-legend-preserve");
  legend.src=art;legend.alt="";legend.draggable=false;
  legend.setAttribute("aria-hidden","true");
  placement(legend,homeTile.x,homeTile.y,homeTile.w,homeTile.h);
  world.append(legend);
 }
 for(const c of opened){
  const b=element("button","mtk-cinematic-hotspot");
  b.type="button";b.dataset.chapterId=c.id;
  placement(b,c.x-c.rx,c.y-c.ry,c.rx*2,c.ry*2);
  // Hotspots are positioned by their center; see CSS translate(0,0).
  b.setAttribute("aria-label",c.name+(c.complete?" tamamlandı":c.id===selected.id?" mevcut bölüm":" açıldı"));
  b.title=c.name;
  b.addEventListener("click",()=>{
   if(c.id===from){onClose();return}
   if(c.playable&&c.route){onNavigate(c.id);return}
   const old=world.querySelector(".mtk-cinematic-notice");old?.remove();
   const notice=element("div","mtk-cinematic-notice",c.name+" macerası sonraki sürümlerde oynanabilecek.");
   world.append(notice);requestAnimationFrame(()=>notice.classList.add("is-visible"));
  });
  if(c.tileId!==ROOT_TILE){
   // New scenery tiles do not bake nameplates into the environment image.
   const plaque=element("span","mtk-cinematic-stage-plaque",c.icon+" "+c.name);
   plaque.setAttribute("aria-hidden","true");b.append(plaque);
  }
  if(c.complete){
   const check=element("span","mtk-cinematic-done","✓");
   check.setAttribute("aria-hidden","true");b.append(check);
  }
  world.append(b);
 }
 const observatory=state.chapters.find(c=>c.id==="observatory");
 if(observatory?.unlocked){
  const badge=element("span","mtk-cinematic-observatory-open","✦");
  placement(badge,1437-24,421-24,48,48);
  badge.setAttribute("aria-label","Gözlemevi keşfedildi");
  world.append(badge);
 }
 viewport.append(world);host.append(viewport);
 // A zoom is measured against the original approved 941px-high map tile.
 // It never changes the original image's proportions or coordinates.
 let zoom=1,scale=1,destroyed=false,firstLayout=true;
 function layout(recenter=false){
  if(destroyed||!viewport.isConnected)return;
  const vh=viewport.clientHeight,vw=viewport.clientWidth;
  if(!vh||!vw)return;
  scale=vh/H*zoom;
  world.style.width=Math.round(worldW*scale)+"px";
  world.style.height=Math.round(worldH*scale)+"px";
  viewport.style.justifyContent=worldW*scale<vw?"center":"flex-start";
  if(recenter||firstLayout){
   firstLayout=false;
   viewport.scrollLeft=Math.max(0,(selected.x-bounds.minX)*scale-vw*.48);
   viewport.scrollTop=Math.max(0,(selected.y-bounds.minY)*scale-vh*.52);
  }
 }
 function zoomTo(next,clientX,clientY){
  if(destroyed)return;
  const z=Math.min(3.2,Math.max(1,next));
  if(Math.abs(z-zoom)<.001)return;
  const rect=viewport.getBoundingClientRect();
  const px=(clientX??(rect.left+rect.width/2))-rect.left;
  const py=(clientY??(rect.top+rect.height/2))-rect.top;
  const wx=(viewport.scrollLeft+px)/scale,wy=(viewport.scrollTop+py)/scale;
  zoom=z;layout(false);
  viewport.scrollLeft=Math.max(0,wx*scale-px);
  viewport.scrollTop=Math.max(0,wy*scale-py);
 }
 const tools=element("div","mtk-map-camera-tools");
 for(const [label,symbol,multiplier] of [["Uzaklaştır","−",1/1.24],["Yakınlaştır","+",1.24]]){
  const btn=element("button","mtk-map-zoom-button",symbol);
  btn.type="button";btn.setAttribute("aria-label",label);
  btn.addEventListener("click",()=>zoomTo(zoom*multiplier));
  tools.append(btn);
 }
 host.append(tools);
 viewport.addEventListener("wheel",e=>{
  if(!e.ctrlKey&&!e.metaKey)return;
  e.preventDefault();zoomTo(zoom*(e.deltaY<0?1.13:1/1.13),e.clientX,e.clientY);
 },{passive:false});
 viewport.addEventListener("keydown",e=>{
  if(e.key==="+"||e.key==="="){e.preventDefault();zoomTo(zoom*1.24)}
  else if(e.key==="-"){e.preventDefault();zoomTo(zoom/1.24)}
  else if(e.key==="ArrowRight")viewport.scrollLeft+=70;
  else if(e.key==="ArrowLeft")viewport.scrollLeft-=70;
 });
 const distance=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
 let pinch=null;
 viewport.addEventListener("touchstart",e=>{
  if(e.touches.length===2){
   pinch={startDistance:distance(e.touches[0],e.touches[1]),startZoom:zoom};
  }
 },{passive:true});
 viewport.addEventListener("touchmove",e=>{
  if(e.touches.length===2&&pinch){
   e.preventDefault();
   const centerX=(e.touches[0].clientX+e.touches[1].clientX)/2;
   const centerY=(e.touches[0].clientY+e.touches[1].clientY)/2;
   zoomTo(pinch.startZoom*distance(e.touches[0],e.touches[1])/
     Math.max(1,pinch.startDistance),centerX,centerY);
  }
 },{passive:false});
 viewport.addEventListener("touchend",e=>{if(e.touches.length<2)pinch=null});
 viewport.addEventListener("touchcancel",()=>{pinch=null});
 let drag=null;
 viewport.addEventListener("pointerdown",e=>{
  if(e.pointerType!=="mouse"||e.button!==0||e.target.closest("button"))return;
  drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
  try{viewport.setPointerCapture(e.pointerId)}catch(_){}
 });
 viewport.addEventListener("pointermove",e=>{
  if(!drag)return;
  viewport.scrollLeft=drag.left-(e.clientX-drag.x);
  viewport.scrollTop=drag.top-(e.clientY-drag.y);
 });
 viewport.addEventListener("pointerup",()=>{drag=null});
 viewport.addEventListener("pointercancel",()=>{drag=null});
 const observer=window.ResizeObserver?new ResizeObserver(()=>requestAnimationFrame(()=>layout(true))):null;
 if(observer)observer.observe(viewport);
 requestAnimationFrame(()=>layout(true));
 return {close(){destroyed=true;observer?.disconnect()},progress:state,chapters:state.chapters,
  tiles:tiles.map(t=>({...t})),zoomTo};
}
window.MTKWorldMap=Object.freeze({mount,progress,registerTile,registerChapter,configureChapter,markChapterCompleted,fogOpacityAt,worldBounds,tiles:()=>tiles.map(x=>({...x})),chapters:()=>chapters.map(x=>({...x}))});
})();

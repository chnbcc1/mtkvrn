/* Matematik Evreni v131 — universal progression-driven cinematic fog.
   Single illustration. Never display unreached regions, roads, names or labels.
   Unlock logic depends exclusively on actual canonical game progress. */
(function(){
"use strict";
const SAVE="mathverse-v40-investigation",FOREST="mathverse-v68-forest-full";
const EXTRA="mathverse-v128-chapter-milestones";
const W=1671,H=941;
const art="./assets/premium-map-approved-v130.avif?v=130";
// The same full-resolution approved artwork is retained. Mist reveals it by stage metadata.
const chapters=[
 {id:"home",name:"Dedenin Evi",icon:"🏡",x:326,y:401,rx:169,ry:76,after:null,fogStart:0,playable:true,route:"./?scene=home&autostart=1&v=131"},
 {id:"forest",name:"Orman Patikası",icon:"🌲",x:754,y:588,rx:190,ry:83,after:"home",fogStart:35.7,playable:true,route:"./forest-v113-full.html?resume=1&v=131"},
 {id:"observatory",name:"Gözlemevi",icon:"🔭",x:1430,y:495,rx:194,ry:83,after:"forest",fogStart:65,playable:false,route:null}
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
function registerChapter(c){
 if(!c||typeof c.id!=="string"||!/^[a-z0-9-]{2,35}$/.test(c.id)||chapters.some(t=>t.id===c.id))return false;
 if(!c.after||!chapters.some(t=>t.id===c.after)||typeof c.name!=="string"||!c.name.trim())return false;
 if(!Number.isFinite(c.x)||!Number.isFinite(c.y)||c.x<0||c.x>W||c.y<0||c.y>H)return false;
 // New chapters use the identical visibility algorithm, regardless of level.
 const fogStart=Number.isFinite(c.fogStart)?c.fogStart:Math.max(1,Math.min(98,100*(c.x-(c.rx||95))/W));
 chapters.push({icon:"✦",playable:false,route:null,rx:95,ry:65,...c,fogStart});return true;
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
function mount(host,{from="home",onNavigate=()=>{},onClose=()=>{}}={}){
 if(!host)throw new Error("Map host is required");
 host.replaceChildren();
 const state=progress(),opened=state.chapters.filter(c=>c.unlocked);
 const selected=opened.find(c=>c.id===from)||opened[opened.length-1]||state.chapters[0];
 const viewport=element("div","mtk-cinematic-viewport");
 viewport.setAttribute("role","region");
 viewport.setAttribute("aria-label","Macera haritası; sağa ve sola kaydırılabilir");
 viewport.tabIndex=0;
 const world=element("div","mtk-cinematic-world");
 const background=element("img","mtk-cinematic-art");
 // Newly explored regions may supply a bigger approved world illustration.
 // It is selected by the SAME region registry, without chapter-specific code.
 const activeArt=[...opened].reverse().find(c=>c.mapArt)?.mapArt||art;
 background.src=activeArt;background.alt="Matematik Evreni'nin onaylanmış macera haritası: Dedenin Evi, Orman Patikası ve Gözlemevi";
 background.draggable=false;world.append(background);
 // UNIVERSAL FOG POLICY: only chapters whose predecessor has been completed can
 // appear. The first locked chapter marks the start of a single cinematic cloud bank.
 // New chapters supply fogStart metadata; no code per region or scene.
 const firstLocked=state.chapters.find(c=>!c.unlocked);
 if(firstLocked){
  const revealEdge=Number.isFinite(firstLocked.fogStart)
    ?Math.max(0,Math.min(99.9,firstLocked.fogStart))
    :Math.max(0,Math.min(99.9,(firstLocked.x-(firstLocked.rx||95))/W*100));
  const fog=element("div","mtk-cinematic-fog");
  fog.style.setProperty("--mist-left",revealEdge+"%");
  fog.setAttribute("aria-hidden","true");
  // Layered cloud strata and intermittent wisps give depth without rectangular masks.
  for(let i=0;i<9;i++){
    const cloud=element("span","mtk-cinematic-wisp");
    cloud.style.setProperty("--wisp-i",String(i));
    cloud.style.setProperty("--cloud-depth",String(i%3));
    fog.append(cloud);
  }
  world.append(fog);
  // Restore the original illustrated legend unobstructed, without artificial cards.
  const legend=element("img","mtk-cinematic-legend-preserve");
  legend.src=activeArt;legend.alt="";legend.draggable=false;
  legend.setAttribute("aria-hidden","true");world.append(legend);
 }
 // One unobtrusive accessible tap zone per DISCOVERED region only.
 // Region names / captions are already painted in the approved image.
 for(const c of opened){
  const b=element("button","mtk-cinematic-hotspot");
  b.type="button";b.dataset.chapterId=c.id;
  b.style.left=c.x/W*100+"%";b.style.top=c.y/H*100+"%";
  b.style.width=(c.rx*2/W*100)+"%";b.style.height=(c.ry*2/H*100)+"%";
  b.setAttribute("aria-label",c.name+(c.complete?" tamamlandı":c.id===selected.id?" mevcut bölüm":" açıldı"));
  b.title=c.name;b.addEventListener("click",()=>{
   if(c.id===from){onClose();return}
   if(c.playable&&c.route){onNavigate(c.id);return}
   const note=element("div","mtk-cinematic-notice","Gözlemevi macerası ilerleyen sürümlerde açılacak.");
   const old=world.querySelector(".mtk-cinematic-notice");old?.remove();
   world.append(note);
   requestAnimationFrame(()=>{note.classList.add("is-visible")});
  });
  if(c.complete){
   const check=element("span","mtk-cinematic-done","✓");
   check.setAttribute("aria-hidden","true");b.append(check);
  }
  world.append(b);
 }
 if(state.chapters.find(c=>c.id==="observatory")?.unlocked){
   // The source illustration has a fixed lock drawn beside the observatory.
   // When genuinely unlocked, a glowing gold completion/progression medallion
   // covers only that lock; no new artificial chapter-name card is inserted.
   const medallion=element("span","mtk-cinematic-observatory-open","✦");
   medallion.style.left=(1437/W*100)+"%";medallion.style.top=(421/H*100)+"%";
   medallion.setAttribute("aria-label","Gözlemevi keşfedildi");
   world.append(medallion);
 }
 viewport.append(world);host.append(viewport);
 let destroyed=false;
 function adapt(){
  if(destroyed||!viewport.isConnected)return;
  const h=viewport.clientHeight,wd=viewport.clientWidth;
  if(!h||!wd)return;
  const mapWidth=Math.round(h*(W/H));
  world.style.width=mapWidth+"px";world.style.height=h+"px";
  viewport.style.justifyContent=mapWidth<wd?"center":"flex-start";
  const target=opened.find(c=>c.id===from)||opened[opened.length-1]||state.chapters[0];
  viewport.scrollLeft=Math.max(0,Math.min(mapWidth-wd,Math.round(target.x/W*mapWidth-wd*.62)));
 }
 const obs=window.ResizeObserver?new ResizeObserver(()=>requestAnimationFrame(adapt)):null;
 if(obs)obs.observe(viewport);
 requestAnimationFrame(adapt);
 return {close(){destroyed=true;obs?.disconnect()},progress:state,chapters:state.chapters};
}
window.MTKWorldMap=Object.freeze({mount,progress,registerChapter,configureChapter,markChapterCompleted,chapters:()=>chapters.map(x=>({...x}))});
})();

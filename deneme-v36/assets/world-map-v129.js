/* Matematik Evreni v128 | expandable atlas with progression-bound fog. */
(function(){
"use strict";
const SAVE="mathverse-v40-investigation",FOREST="mathverse-v68-forest-full",EXTRA="mathverse-v128-chapter-milestones";
const WORLD_W=2400,WORLD_H=1180;
const chapters=[
 {id:"home",name:"Dedenin Evi",subtitle:"Profesörün ipuçları",icon:"🏡",x:340,y:414,after:null,playable:true,route:"./?scene=home&autostart=1&v=129"},
 {id:"forest",name:"Orman Patikası",subtitle:"21 matematik engeli",icon:"🌲",x:835,y:698,after:"home",playable:true,route:"./forest-v113-full.html?resume=1&v=129"},
 {id:"gate",name:"Gözlemevi Girişi",subtitle:"Kayıp izlerin eşiği",icon:"🔭",x:1155,y:574,after:"forest",playable:true,route:"./forest-v113-full.html?resume=1&focus=gate&v=129"},
 {id:"inside",name:"Gözlemevi",subtitle:"Henüz oynanabilir değil",icon:"🔮",x:1790,y:545,after:"gate",playable:false},
 {id:"future-1",name:"Yeni Keşif",subtitle:"Yakında yeni maceralar",icon:"✦",x:2115,y:888,after:"inside",playable:false,future:true}
];
function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")||{}}catch(_){return {}}}
function progress(){
 const a=read(SAVE),b=read(FOREST),custom=read(EXTRA);
 const solved=Array.isArray(b.solvedIds)?new Set(b.solvedIds).size:0;
 const homeDone=!!(a.complete&&a.visitedStudy);
 const forestDone=!!(homeDone&&b.reachedGate&&solved>=21);
 const gateDone=!!(forestDone&&b.gateInspected);
 const customDone=new Set(Array.isArray(custom.completed)?custom.completed:[]);
 const completed=new Set([...(homeDone?["home"]:[]),...(forestDone?["forest"]:[]),...(gateDone?["gate"]:[]),...customDone]);
 function unlocked(c,seen=new Set()){
  if(!c||seen.has(c.id))return false;
  if(!c.after)return true;
  seen.add(c.id);
  const predecessor=chapters.find(x=>x.id===c.after);
  return !!(predecessor&&completed.has(predecessor.id)&&unlocked(predecessor,seen));
 }
 return {chapters:chapters.map(c=>({...c,unlocked:unlocked(c),complete:completed.has(c.id)&&unlocked(c)})),solved};
}
function markChapterCompleted(id){
 if(!chapters.some(x=>x.id===id)||["home","forest","gate"].includes(id))return false;
 const p=progress();if(!p.chapters.some(x=>x.id===id&&x.unlocked))return false;
 const previous=read(EXTRA),completed=new Set(previous.completed||[]);
 completed.add(id);localStorage.setItem(EXTRA,JSON.stringify({...previous,completed:[...completed]}));return true;
}
function registerChapter(def){
 if(!def||typeof def.id!=="string"||!/^[a-z0-9-]{2,32}$/.test(def.id)||chapters.some(c=>c.id===def.id))return false;
 if(!def.name||!def.after||!chapters.some(c=>c.id===def.after))return false;
 if(!Number.isFinite(def.x)||!Number.isFinite(def.y)||def.x<70||def.y<80||def.x>WORLD_W-60||def.y>WORLD_H-60)return false;
 chapters.push({...def,icon:def.icon||"✦",subtitle:def.subtitle||"",playable:!!def.route});return true;
}
function element(tag,cls,value){
 const e=document.createElement(tag);if(cls)e.className=cls;if(value!=null)e.textContent=value;return e
}
function svgNode(tag,attr){
 const e=document.createElementNS("http://www.w3.org/2000/svg",tag);
 for(const [k,v] of Object.entries(attr))e.setAttribute(k,String(v));return e;
}
function mount(host,{from="home",onNavigate=()=>{},onClose=()=>{}}={}){
 if(!host)throw new Error("Map host required");
 host.replaceChildren();
 const data=progress(),all=data.chapters;
 let choice=all.find(c=>c.id===from&&c.unlocked)||[...all].reverse().find(c=>c.unlocked&&c.playable)||all[0];
 const top=element("div","mtk-atlas-intro"),left=element("div","mtk-atlas-intro-copy");
 left.append(element("strong","","MACERA HARİTASI"),element("small","","Dedenin Evi'nden başlayan izleri takip et · Yeni bölümler sisin ardında"));
 const counter=element("span","mtk-atlas-count",all.filter(c=>c.unlocked&&!c.future).length+"/"+all.filter(c=>!c.future).length+" keşif");
 top.append(left,counter);
 const viewport=element("div","mtk-atlas-viewport");
 viewport.setAttribute("role","region");viewport.setAttribute("aria-label","Yatay kaydırılabilir macera haritası");viewport.tabIndex=0;
 const world=element("div","mtk-atlas-world"),bg=document.createElement("img");
 bg.src="./assets/world-map-v129.svg?v=129";bg.alt="Dedenin Evi sol üstte, orman patikası, taş geçit, gözlemevi ve turkuaz gölden oluşan ayrıntılı macera haritası";
 bg.draggable=false;bg.className="mtk-atlas-art";world.append(bg);
 const trails=svgNode("svg",{viewBox:"0 0 "+WORLD_W+" "+WORLD_H,preserveAspectRatio:"none","aria-hidden":"true",class:"mtk-atlas-trails"});
 for(let i=1;i<all.length;i++){
  const previous=all[i-1],current=all[i];if(!previous.unlocked||!current.unlocked)continue;
  const mid=(previous.x+current.x)/2;
  const path="M"+previous.x+" "+previous.y+" C"+mid+" "+(previous.y-125)+" "+mid+" "+(current.y+125)+" "+current.x+" "+current.y;
  trails.append(svgNode("path",{d:path,fill:"none",stroke:"#284d3d","stroke-width":30,"stroke-linecap":"round",opacity:".56"}));
  trails.append(svgNode("path",{d:path,fill:"none",stroke:"#fae7a8","stroke-width":13,"stroke-linecap":"round","stroke-dasharray":"3 31",opacity:".96"}));
 }
 world.append(trails);
 // One continuous atmospheric fog boundary instead of overlapping white bubbles.
 // It moves to the next locked chapter as earlier chapters are completed.
 const firstUnknown=all.find(c=>!c.unlocked);
 if(firstUnknown){
  const fog=element("div","mtk-atlas-fog");
  const edge=Math.max(0,Math.min(95,100*(firstUnknown.x-180)/WORLD_W));
  fog.style.left=edge+"%";fog.style.width=(100-edge)+"%";
  fog.append(element("span","mtk-atlas-fog-symbol","✧"),element("b","",firstUnknown.future?"YENİ UFUKLAR":"KEŞFEDİLMEMİŞ TOPRAKLAR"));
  fog.setAttribute("aria-hidden","true");
  world.append(fog);
 }
 for(const c of all.filter(x=>x.unlocked)){
  const marker=element("button","mtk-atlas-marker"+(c.complete?" is-complete":"")+(c.id===choice.id?" is-selected":""));
  marker.type="button";marker.style.left=100*c.x/WORLD_W+"%";marker.style.top=100*c.y/WORLD_H+"%";
  marker.disabled=!c.playable;marker.dataset.region=c.id;
  marker.setAttribute("aria-label",c.name+(c.complete?" tamamlandı":""));
  marker.append(element("span","mtk-atlas-medal",c.icon),element("span","mtk-atlas-marker-title",c.name),element("span","mtk-atlas-marker-index",String(all.indexOf(c)+1)));
  if(c.complete)marker.append(element("span","mtk-atlas-check","✓"));
  if(!c.playable){marker.classList.add("is-unavailable");marker.title="Bu bölümün oynanışı henüz hazırlanmadı"}
  marker.addEventListener("click",()=>select(c));world.append(marker);
 }
 viewport.append(world);
 const foot=element("div","mtk-atlas-footer"),desc=element("div","mtk-atlas-chapter-desc"),command=element("button","mtk-atlas-cta");
 command.type="button";
 const footHint=element("div","mtk-atlas-swipe","‹ Haritayı sağa veya sola sürükleyerek keşfet ›");
 foot.append(desc,command);host.append(top,viewport,footHint,foot);
 function renderSelected(){
  desc.replaceChildren();desc.append(element("strong","",choice.icon+" "+choice.name),element("span","",choice.subtitle||"Macera devam ediyor"));
  command.textContent=choice.playable?(choice.id===from?"Haritayı kapat":"Bu bölüme git"):"Yakında";
  command.disabled=!choice.playable;
  world.querySelectorAll(".mtk-atlas-marker").forEach(el=>el.classList.toggle("is-selected",el.dataset.region===choice.id));
 }
 function select(chapter){choice=chapter;renderSelected()}
 command.addEventListener("click",()=>{if(choice.id===from){onClose();return}if(choice.playable)onNavigate(choice.id)});
 renderSelected();
 const center=()=>{
  const height=Math.max(1,viewport.clientHeight);
  // Preserve the artist's 2600:1260 aspect ratio at every orientation.
  world.style.height=height+"px";
  world.style.width=Math.round(height*WORLD_W/WORLD_H)+"px";
  const scale=world.getBoundingClientRect().width/WORLD_W;
  viewport.scrollLeft=Math.max(0,Math.min(world.scrollWidth-viewport.clientWidth,choice.x*scale-viewport.clientWidth*.4));
 };
 const observer=window.ResizeObserver?new ResizeObserver(()=>requestAnimationFrame(center)):null;
 if(observer)observer.observe(viewport);
 requestAnimationFrame(center);
 return {close(){observer?.disconnect()},progress:data,chapters:all};
}
window.MTKWorldMap=Object.freeze({mount,progress,registerChapter,markChapterCompleted,chapters:()=>chapters.map(x=>({...x}))});
})();

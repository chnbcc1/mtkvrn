/* F03 Sis Türbini — one approved portrait master in both orientations.
   Values are DOM labels; image never contains fixed numeric data. */
(function(){
"use strict";
const IMAGE="./assets/f03-portrait-master-v197.avif";
const NATURAL={width:1213,height:1297};
const SLOTS=Object.freeze({
 inputA:{x:13.3,y:26.1,w:17.0},inputB:{x:13.3,y:34.8,w:17.0},
 turbine:{x:63.8,y:30.1,w:15.8},
 filter1:{x:35.2,y:55.4,w:10.0},filter2:{x:45.9,y:55.4,w:10.0},filter3:{x:56.1,y:55.4,w:10.0},
 tube1:{x:79.1,y:49.7,w:10.1},tube2:{x:89.4,y:49.7,w:10.1},
 tank1:{x:55.0,y:74.3,w:8.6},tank2:{x:65.3,y:74.3,w:8.6},
 tank3:{x:75.5,y:74.3,w:8.6},tank4:{x:85.8,y:74.3,w:8.6}
});
const CSS='body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-visual-region.mtk-f03-visual{overflow:hidden!important;background:#14544d!important}'+
'body.mtk-approved-active .mtk-frame .mtk-f03-stage{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;overflow:hidden!important;isolation:isolate!important}'+
'body.mtk-approved-active .mtk-frame .mtk-f03-image-box{position:absolute!important;left:50%;top:50%;transform:translate(-50%,-50%);overflow:visible!important;pointer-events:none!important}'+
'body.mtk-approved-active .mtk-frame .mtk-f03-image{display:block!important;width:100%!important;height:100%!important;position:absolute!important;inset:0!important;object-fit:fill!important;object-position:center!important;pointer-events:none!important;user-select:none!important}'+
'body.mtk-approved-active .mtk-frame .mtk-f03-value{position:absolute!important;z-index:6!important;transform:translate(-50%,-50%)!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;box-sizing:border-box!important;padding:0 1px!important;margin:0!important;font-family:system-ui,-apple-system,"Segoe UI",sans-serif!important;font-weight:900!important;line-height:1.05!important;letter-spacing:-.02em!important;color:#fff6d8!important;text-shadow:0 1px 1px #092a25,0 0 3px #072922,0 1px 4px #001d1a!important;white-space:nowrap!important;overflow:visible!important;pointer-events:none!important}';
const EL=(tag,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;return x};
function normalizeAnchor(value){return String(value||"").toLocaleLowerCase("tr").replaceAll("_"," ").replace(/\s+/g," ").trim()}
function chooseSlot(anchor){
 const a=normalizeAnchor(anchor);
 if(/^a borusu/.test(a)||/^(giriş|türbin giriş vanası)/.test(a))return "inputA";
 if(/^b borusu/.test(a))return "inputB";
 if(/^filtre sayısı/.test(a))return "turbine";
 if(/^her filtre/.test(a))return "filter1";
 if(/^(a geçirgenliği|1\. filtre|filtre 1|birinci filtre)/.test(a))return "filter1";
 if(/^(b geçirgenliği|2\. filtre|filtre 2|ikinci filtre)/.test(a))return "filter2";
 if(/^(3\. filtre|filtre 3|üçüncü filtre)/.test(a))return "filter3";
 if(/^(çıkış|ana hat)/.test(a))return "turbine";
 if(/^(tüpe|tüp payı|gözlem|ayrılan)/.test(a))return "tube1";
 return null;
}
const FALLBACK=["inputB","filter3","tube2","tank1","tank2","tank3","tank4"];
function plan(labels){
 const used=new Set(),placements=[];
 for(const {anchor,value} of (Array.isArray(labels)?labels:[])){
  let slot=chooseSlot(anchor);
  if(!slot||used.has(slot))slot=FALLBACK.find(s=>!used.has(s))||Object.keys(SLOTS).find(s=>!used.has(s));
  if(!slot)continue;
  used.add(slot);placements.push({anchor:String(anchor||""),value:String(value??""),slot,...SLOTS[slot]});
 }
 return placements;
}
let active=null,ro=null;
function layout(){
 const state=active;if(!state||!state.stage.isConnected)return;
 const w=state.stage.clientWidth,h=state.stage.clientHeight;
 if(w<=0||h<=0)return;
 const scale=Math.max(w/NATURAL.width,h/NATURAL.height);
 const iw=NATURAL.width*scale,ih=NATURAL.height*scale;
 state.box.style.width=iw+"px";state.box.style.height=ih+"px";
 const ctx=state.ctx;
 for(const {node,point} of state.points){
  const maxW=iw*point.w/100-5;
  let font=Math.max(9,Math.min(18,iw*.0168));
  if(point.value.length>7)font=Math.min(font,iw*.0135);
  if(ctx){while(font>8){ctx.font="900 "+font+"px system-ui";if(ctx.measureText(point.value).width<=maxW)break;font-=.5}}
  node.style.fontSize=Math.max(8,font)+"px";
 }
}
function render(visual,q){
 if(!visual||q?.obstacleId!=="F03")return false;
 if(ro){ro.disconnect();ro=null}
 visual.replaceChildren();visual.classList.add("mtk-f03-visual");
 const stage=EL("div","mtk-f03-stage"),box=EL("div","mtk-f03-image-box");
 const img=EL("img","mtk-f03-image");
 img.alt="Sis türbini; iki giriş, üç filtre, iki gözlem tüpü ve dört toplama haznesi. Erdem ve Çiko için sol-alt alan boş.";
 img.src=IMAGE;img.decoding="async";img.loading="eager";box.appendChild(img);
 const points=[];
 for(const point of plan(q.visual?.labels)){
  const item=EL("span","mtk-f03-value");
  item.textContent=point.value;item.title=point.anchor;
  item.setAttribute("aria-label",point.anchor+": "+point.value);
  item.dataset.anchor=normalizeAnchor(point.anchor);item.dataset.plaque=point.slot;
  item.style.left=point.x+"%";item.style.top=point.y+"%";item.style.width=point.w+"%";
  box.appendChild(item);points.push({node:item,point});
 }
 stage.appendChild(box);visual.appendChild(stage);
 if(!document.getElementById("mtk-f03-scene-style-v197")){
  const sheet=EL("style");sheet.id="mtk-f03-scene-style-v197";sheet.textContent=CSS;document.head.appendChild(sheet);
 }
 let ctx=null;try{ctx=document.createElement("canvas").getContext("2d")}catch(_){}
 active={stage,box,points,ctx};requestAnimationFrame(layout);
 if("ResizeObserver" in window){ro=new ResizeObserver(layout);ro.observe(stage)}
 return true;
}
window.MTKF03SceneV197=Object.freeze({render,plan,chooseSlot,normalizeAnchor,slots:SLOTS,image:IMAGE,natural:NATURAL,version:"197"});
})();

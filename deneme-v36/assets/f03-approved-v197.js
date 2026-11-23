/* Matematik Evreni — F03 Sis Türbini / v197
   ONE user-selected portrait master scene. Landscape shows the SAME source,
   cropped only vertically. All values remain separate DOM labels. No characters. */
(()=>{"use strict";
 const MASTER="./assets/f03-sis-turbini-master-v197.avif?v=197";
 const WIDTH=1213,HEIGHT=1297;
 const STYLE_ID="mtk-f03-approved-v197-style";
 // Plaques measured at the CENTER of the original 1213x1297 scene.
 // Coordinates and sizes are expressed in native pixels and converted to %.
 const PLAQUES=Object.freeze({
   input_a: [158,333,176,65],
   input_b: [158,441,176,64],
   main: [754,382,173,65],
   filter_1: [414,703,114,50],
   filter_2: [541,703,114,50],
   filter_3: [668,703,114,50],
   tube_a: [934,632,111,52],
   tube_b: [1063,633,111,52],
   output_1: [650,944,112,52],
   output_2: [775,944,112,52],
   output_3: [900,944,112,52],
   output_4: [1024,944,112,52]
 });
 const FALLBACK=["input_a","input_b","filter_1","filter_2","filter_3","main","tube_a","tube_b","output_1","output_2","output_3","output_4"];
 const style=String.raw`
 body.mtk-approved-active .mtk-frame.mtk-f03-v197 .mtk-f03-scene{
   position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
   overflow:hidden!important;container-type:inline-size!important;
   background:#164b40!important;isolation:isolate!important;
   pointer-events:none!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v197 .mtk-f03-plane{
   box-sizing:border-box!important;position:absolute!important;left:0!important;top:0!important;
   width:100%!important;height:auto!important;aspect-ratio:1213 / 1297!important;
   overflow:visible!important;max-width:none!important;max-height:none!important;
   transform:none!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v197 .mtk-f03-background{
   display:block!important;position:absolute!important;inset:0!important;
   width:100%!important;height:100%!important;max-width:none!important;
   object-fit:fill!important;user-select:none!important;
   border:0!important;pointer-events:none!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v197 .mtk-f03-label{
   position:absolute!important;box-sizing:border-box!important;z-index:3!important;
   transform:translate(-50%,-50%)!important;
   display:flex!important;align-items:center!important;justify-content:center!important;
   margin:0!important;padding:1px 2px!important;overflow:hidden!important;
   color:#fff6d9!important;text-align:center!important;
   font:850 clamp(8px,2.35cqw,18px)/1.07 system-ui,-apple-system,sans-serif!important;
   text-shadow:0 1px 2px #002e20,0 0 2px #002e20!important;
   white-space:normal!important;word-break:normal!important;overflow-wrap:anywhere!important;
   letter-spacing:normal!important;pointer-events:none!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v197 .mtk-f03-label.long{
   font-size:clamp(8px,2.14cqw,16px)!important;
 }
 @media(orientation:landscape){
   body.mtk-approved-active .mtk-frame.mtk-f03-v197 .mtk-f03-plane{
     /* SAME master art: the viewport clips only top/bottom. */
     width:100%!important;height:auto!important;aspect-ratio:1213 / 1297!important;
   }
 }
`;
 function normalize(anchor){
   return String(anchor||"").toLocaleLowerCase("tr").replace(/_/g," ").replace(/\s+/g," ").trim();
 }
 function preferred(anchor,q){
   const a=normalize(anchor);
   if(/\ba borusu\b|\ba hattı\b|\ba giriş\b/.test(a))return "input_a";
   if(/\bb borusu\b|\bb hattı\b|\bb giriş\b/.test(a))return "input_b";
   if(/\ba geçirgenliği/.test(a))return "filter_1";
   if(/\bb geçirgenliği/.test(a))return "filter_2";
   if(/filtre sayısı|filtre sayisi/.test(a))return "main";
   if(/her filtre/.test(a))return "filter_1";
   if(/birinci filtre|1\.\s*filtre|filtre\s*1\b/.test(a))return "filter_1";
   if(/ikinci filtre|2\.\s*filtre|filtre\s*2\b/.test(a))return "filter_2";
   if(/üçüncü filtre|3\.\s*filtre|filtre\s*3\b/.test(a))return "filter_3";
   if(/türbin giriş|giriş vanası|giriş\b/.test(a))return "input_a";
   if(/ana hat|çıkış\b/.test(a))return "main";
   if(/tüp payı/.test(a)&&/dört eşit hazne/i.test(String(q?.prompt||"")))return "output_1";
   if(/tüp payı|gözlem|tüpe|tüp(e|ü| )|ayrılan|kolu/.test(a))return "tube_a";
   return null;
 }
 function plan(q){
   if(String(q?.obstacleId||"")!=="F03")return [];
   const entries=Array.isArray(q.visual?.labels)?q.visual.labels:[];
   const used=new Set();
   return entries.map(entry=>{
     const preferredSlot=preferred(entry.anchor,q);
     let slot=preferredSlot&&!used.has(preferredSlot)?preferredSlot:null;
     if(!slot)slot=FALLBACK.find(key=>!used.has(key))||null;
     if(!slot)return null;
     used.add(slot);
     const [x,y,w,h]=PLAQUES[slot];
     return {slot,x,y,w,h,anchor:String(entry.anchor??""),value:String(entry.value??"")};
   }).filter(Boolean);
 }
 function enhance(frame,q){
   if(!frame||q?.obstacleId!=="F03")return false;
   const visual=frame.querySelector(".mtk-visual-region");
   if(!visual)return false;
   if(!document.getElementById(STYLE_ID)){
     const sheet=document.createElement("style");sheet.id=STYLE_ID;sheet.textContent=style;document.head.appendChild(sheet);
   }
   const prior=[...visual.childNodes];
   const scene=document.createElement("div");scene.className="mtk-f03-scene";scene.setAttribute("aria-label","Sis türbini ve soruya göre değişen miktar levhaları");
   const plane=document.createElement("div");plane.className="mtk-f03-plane";
   const img=document.createElement("img");img.className="mtk-f03-background";
   img.alt="Ormanda, iki giriş borusu ve üç filtresi bulunan sis türbini; gözlem tüpleri ve dört toplama haznesi";
   img.draggable=false;img.decoding="async";plane.appendChild(img);
   const labels=plan(q);
   for(const item of labels){
     const e=document.createElement("span");
     e.className="mtk-f03-label"+(item.value.length>7?" long":"");
     e.style.left=(100*item.x/WIDTH).toFixed(4)+"%";
     e.style.top=(100*item.y/HEIGHT).toFixed(4)+"%";
     e.style.width=(100*item.w/WIDTH).toFixed(4)+"%";
     e.style.height=(100*item.h/HEIGHT).toFixed(4)+"%";
     e.dataset.slot=item.slot;e.dataset.anchor=item.anchor;
     e.title=item.anchor;e.setAttribute("aria-label",item.anchor+": "+item.value);
     e.textContent=item.value;
     plane.appendChild(e);
   }
   scene.appendChild(plane);
   frame.classList.add("mtk-f03-v197");
   visual.replaceChildren(scene);
   // Offline/corrupt-image fallback: do not leave the student with a blank task.
   img.onerror=()=>{if(!scene.isConnected)return;visual.replaceChildren(...prior);frame.classList.remove("mtk-f03-v197")};
   img.src=MASTER;
   return true;
 }
 window.MTKF03ApprovedV197=Object.freeze({enhance,plan,PLAQUES,version:"197",source:MASTER});
})();
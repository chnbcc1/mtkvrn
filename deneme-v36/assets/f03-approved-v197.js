/* Matematik Evreni — F03 Sis Türbini / five-plaque master v198.
   Approved portrait scene shared by portrait and landscape. Live DOM numbers.
   Exact approved Erdem–Çiko transparent PNG stays a separate layer. */
(()=>{"use strict";
 const MASTER="./assets/f03-five-plaques-v198.avif?v=198";
 const CHARACTER_REFERENCE="./assets/erdem-ciko-onayli-v180.png?v=180";
 const WIDTH=1213,HEIGHT=1297,STYLE_ID="mtk-f03-five-v202-style";
 // Text box centers INSIDE the five blank green plaques (native master pixels).
 const PLAQUES=Object.freeze({
   input_a:[190,390,184,56],
   input_b:[190,525,184,56],
   filter_1:[532,837,189,54],
   filter_2:[769,837,189,54],
   filter_3:[1011,837,189,54]
 });
 const ORDER=["input_a","filter_1","filter_2","filter_3","input_b"];
 const style=String.raw`
 body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-scene{
   position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
   overflow:hidden!important;container-type:inline-size!important;
   isolation:isolate!important;background:#164b40!important;
   pointer-events:none!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-plane{
   position:absolute!important;box-sizing:border-box!important;left:0!important;top:0!important;
   width:100%!important;height:auto!important;aspect-ratio:1213 / 1297!important;
   max-width:none!important;max-height:none!important;overflow:visible!important;
   transform:none!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-background{
   position:absolute!important;display:block!important;inset:0!important;
   width:100%!important;height:100%!important;max-width:none!important;object-fit:fill!important;
   border:0!important;user-select:none!important;pointer-events:none!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-character{
   display:block!important;position:absolute!important;z-index:2!important;
   left:2%!important;top:49.9%!important;width:23.4%!important;height:auto!important;
   max-width:none!important;max-height:none!important;object-fit:contain!important;
   user-select:none!important;pointer-events:none!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-label{
   display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;
   gap:0!important;position:absolute!important;box-sizing:border-box!important;z-index:3!important;
   transform:translate(-50%,-50%)!important;margin:0!important;padding:0 2px!important;
   border:0!important;background:none!important;color:#fff8e8!important;text-align:center!important;
   white-space:nowrap!important;overflow:hidden!important;pointer-events:none!important;
   text-shadow:0 1px 2px #002e20,0 0 2px #002e20!important;
   font-family:system-ui,-apple-system,"Segoe UI",sans-serif!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-label-caption{
   display:block!important;max-width:100%!important;font-weight:700!important;
   font-size:clamp(6px,1.30cqw,12px)!important;line-height:1.05!important;
   overflow:hidden!important;text-overflow:clip!important;white-space:nowrap!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-label-value{
   display:block!important;max-width:100%!important;font-weight:850!important;
   font-size:clamp(9px,2.35cqw,20px)!important;line-height:1.05!important;
   white-space:nowrap!important;
 }
 body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-label.long .mtk-f03-label-value{
   font-size:clamp(8px,2cqw,17px)!important;
 }
 @media(orientation:landscape){
   body.mtk-approved-active .mtk-frame.mtk-f03-v198 .mtk-f03-plane{
     /* EXACT portrait master: same ratio; only the TOP/BOTTOM may be clipped. */
     width:100%!important;height:auto!important;aspect-ratio:1213 / 1297!important;
   }
 }
 `;
 function normalize(anchor){
   return String(anchor||"").toLocaleLowerCase("tr").replace(/_/g," ").replace(/\s+/g," ").trim();
 }
 function preferred(anchor){
   const a=normalize(anchor);
   if(/^(a borusu|a hattı|a giriş)/.test(a))return "input_a";
   if(/^(b borusu|b hattı|b giriş)/.test(a))return "input_b";
   if(/a geçirgenliği|^(birinci filtre|1\. filtre|filtre 1|filtre 1\b)/.test(a))return "filter_1";
   if(/b geçirgenliği|^(ikinci filtre|2\. filtre|filtre 2|filtre 2\b)/.test(a))return "filter_2";
   if(/^(üçüncü filtre|3\. filtre|filtre 3|filtre 3\b)/.test(a))return "filter_3";
   if(/filtre sayısı|filtre sayisi/.test(a))return "filter_2";
   if(/her filtre/.test(a))return "filter_1";
   if(/tüp|gözlem|ayrılan|kolu/.test(a))return "filter_3";
   if(/ana hat|çıkış/.test(a))return "filter_2";
   if(/türbin giriş|giriş/.test(a))return "input_a";
   return null;
 }
 function caption(anchor){
   const a=normalize(anchor);
   if(/a geçirgenliği/.test(a))return "A filtresi";
   if(/b geçirgenliği/.test(a))return "B filtresi";
   if(/a borusu/.test(a))return "A borusu";
   if(/b borusu/.test(a))return "B borusu";
   if(/filtre sayısı/.test(a))return "Filtre sayısı";
   if(/her filtre/.test(a))return "Her filtre";
   if(/birinci filtre|1\. filtre|filtre 1/.test(a))return "1. filtre";
   if(/ikinci filtre|2\. filtre|filtre 2/.test(a))return "2. filtre";
   if(/üçüncü filtre|3\. filtre|filtre 3/.test(a))return "3. filtre";
   if(/gözlem/.test(a))return "Gözlem";
   if(/tüp/.test(a))return "Tüp payı";
   if(/ayrılan/.test(a))return "Ayrılan";
   if(/ana hat/.test(a))return "Ana hat";
   if(/çıkış/.test(a))return "Çıkış";
   if(/giriş/.test(a))return "Giriş";
   return String(anchor||"").slice(0,18);
 }
 function plan(q){
   if(String(q?.obstacleId||"")!=="F03")return [];
   const entries=Array.isArray(q.visual?.labels)?q.visual.labels:[];
   const used=new Set();
   return entries.map(entry=>{
     const wanted=preferred(entry.anchor);
     const slot=wanted&&!used.has(wanted)?wanted:ORDER.find(key=>!used.has(key));
     if(!slot)return null;
     used.add(slot);
     const [x,y,w,h]=PLAQUES[slot];
     return {slot,x,y,w,h,anchor:String(entry.anchor??""),value:String(entry.value??""),caption:caption(entry.anchor)};
   }).filter(Boolean);
 }
 function enhance(frame,q){
   if(!frame||q?.obstacleId!=="F03")return false;
   const visual=frame.querySelector(".mtk-visual-region");
   if(!visual)return false;
   if(!document.getElementById(STYLE_ID)){
     const sheet=document.createElement("style");sheet.id=STYLE_ID;sheet.textContent=style;document.head.appendChild(sheet);
   }
   const previous=[...visual.childNodes];
   const scene=document.createElement("div");scene.className="mtk-f03-scene";
   scene.setAttribute("aria-label","Sis türbini, beş veri levhası, Erdem ve Çiko");
   const plane=document.createElement("div");plane.className="mtk-f03-plane";
   const img=document.createElement("img");img.className="mtk-f03-background";
   img.alt="Beş boş plaketli sis türbini, orman ve şelale";
   img.draggable=false;img.decoding="async";plane.appendChild(img);
   const character=document.createElement("img");character.className="mtk-f03-character";
   character.alt="Onaylı şeffaf referanstan Erdem ve Çiko";
   character.draggable=false;character.decoding="async";
   character.onerror=()=>character.remove();character.src=CHARACTER_REFERENCE;
   plane.appendChild(character);
   for(const item of plan(q)){
     const box=document.createElement("span");box.className="mtk-f03-label"+(item.value.length>7?" long":"");
     box.style.left=(100*item.x/WIDTH).toFixed(4)+"%";
     box.style.top=(100*item.y/HEIGHT).toFixed(4)+"%";
     box.style.width=(100*item.w/WIDTH).toFixed(4)+"%";
     box.style.height=(100*item.h/HEIGHT).toFixed(4)+"%";
     box.dataset.slot=item.slot;box.dataset.anchor=item.anchor;
     box.title=item.anchor;box.setAttribute("aria-label",item.anchor+": "+item.value);
     const heading=document.createElement("small");heading.className="mtk-f03-label-caption";heading.textContent=item.caption;
     const value=document.createElement("strong");value.className="mtk-f03-label-value";value.textContent=item.value;
     box.append(heading,value);plane.appendChild(box);
   }
   scene.appendChild(plane);frame.classList.add("mtk-f03-v198");visual.replaceChildren(scene);
   // Missing scene? Restore the original playable quiz without altering its data.
   img.onerror=()=>{if(!scene.isConnected)return;visual.replaceChildren(...previous);frame.classList.remove("mtk-f03-v198")};
   img.src=MASTER;
   return true;
 }
 window.MTKF03ApprovedV197=Object.freeze({enhance,plan,PLAQUES,source:MASTER,character:CHARACTER_REFERENCE,version:"202"});
})();
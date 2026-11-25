/* F04 approved single master: four light layers and five blank plaques.
   No values baked into art. Use the original approved character PNG separately.
   The legacy playable view remains until both image assets load successfully. */
(()=>{"use strict";
 const MASTER="./assets/f04-light-gate-v211.webp?v=211";
 const CHARACTER="./assets/erdem-ciko-onayli-v180.png?v=180";
 const POS=Object.freeze({top:[50,12.6,37,8.0],one:[21.7,56.6,15.6,7.0],two:[40.7,56.6,15.6,7.0],three:[59.4,56.6,15.6,7.0],four:[78.1,56.6,15.6,7.0]});
 const ORDER=["one","two","three","four"];
 const norm=s=>String(s??"").toLocaleLowerCase("tr").replaceAll("_"," ").trim();
 function plan(q){
  if(q?.obstacleId!=="F04")return [];
  const entries=q.visual?.labels||[],used=new Set();
  return entries.map(e=>{
   const a=norm(e.anchor),raw=String(e.value??"");
   let slot,caption,value=raw;
   if(/^(katman|toplam katman|katman sayısı)$/.test(a)){slot="top";caption="Katman sayısı";}
   else if(/^(nokta|her katman|bir katman|açık katman ışığı)$/.test(a)){slot=used.has("top")?"one":"top";caption=a==="açık katman ışığı"?"Açık katmanda":"Her katmanda";}
   else if(/kapalı katman/.test(a)){slot="two";caption="Kapalı katman";}
   else if(/uyarı lambası/.test(a)){slot="four";caption="Uyarı lambası";}
   else if(/arızalı oran/.test(a)){slot="two";caption="Arızalı oran";}
   else if(a==="ilk"){slot="one";caption="1. katman";}
   else if(a==="ikinci"){slot="two";caption="2. katman";}
   else if(a==="ilk sönük"){slot="three";caption="1. sönük oran";}
   else if(/^[123]\. sönük$/.test(a)){const n=Number(a[0]);slot=ORDER[n-1];caption=n+". sönük oran";}
   else if(/^(katman [123]|birinci ışık katmanı|ikinci ışık katmanı|üçüncü ışık katmanı)$/.test(a)){
    const n=Number(a.match(/\d/)?.[0]||({birinci:1,ikinci:2,üçüncü:3}[a.split(" ")[0]]));
    slot=ORDER[n-1];caption=n+". katman";
    value=raw.replace(/\s*lamba(?=;)/,"").replace(/;\s*/,"\n");
   }else{caption=a;}
   if(!slot||used.has(slot))slot=ORDER.find(s=>!used.has(s))||(!used.has("top")?"top":null);
   if(!slot)return null;used.add(slot);return {slot,caption,value,raw,anchor:e.anchor,box:POS[slot]};
  }).filter(Boolean);
 }
 const css=String.raw
`
 .mtk-frame.mtk-f04-v211 .mtk-f04-scene{position:absolute!important;inset:0!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important;container-type:size!important;background:#18352a!important;pointer-events:none!important;}
 .mtk-frame.mtk-f04-v211 .mtk-f04-plane{position:relative!important;width:min(100cqw,100cqh)!important;aspect-ratio:1!important;flex:none!important;container-type:inline-size!important;isolation:isolate!important;}
 .mtk-frame.mtk-f04-v211 .mtk-f04-bg{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important;}
 .mtk-frame.mtk-f04-v211 .mtk-f04-character{position:absolute!important;left:7%!important;bottom:2%!important;width:30%!important;height:20%!important;object-fit:contain!important;object-position:left bottom!important;z-index:1!important;}
 .mtk-frame.mtk-f04-v211 .mtk-f04-label{position:absolute!important;transform:translate(-50%,-50%)!important;z-index:2!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;text-align:center!important;color:#fff2c1!important;text-shadow:0 1px 2px #000!important;line-height:1.05!important;overflow:hidden!important;box-sizing:border-box!important;}
 .mtk-frame.mtk-f04-v211 .mtk-f04-label small{font-size:2.1cqw!important;font-weight:650!important;white-space:nowrap!important;}
 .mtk-frame.mtk-f04-v211 .mtk-f04-label strong{font-size:4.1cqw!important;font-weight:850!important;white-space:pre-line!important;}
 .mtk-frame.mtk-f04-v211 .mtk-f04-label.multiline small{font-size:1.7cqw!important;}
 .mtk-frame.mtk-f04-v211 .mtk-f04-label.multiline strong{font-size:2.2cqw!important;}
`;
 function enhance(frame,q){
  if(!frame||q?.obstacleId!=="F04")return false;
  const visual=frame.querySelector(".mtk-visual-region");if(!visual)return false;
  const items=plan(q);if(items.length!==(q.visual?.labels||[]).length)return false;
  const make=(tag,cls)=>{const e=document.createElement(tag);e.className=cls;return e;};
  const scene=make("div","mtk-f04-scene"),plane=make("div","mtk-f04-plane");
  const bg=make("img","mtk-f04-bg"),ch=make("img","mtk-f04-character");
  bg.alt="Onaylı katmanlı ışık geçidi";ch.alt="Onaylı Erdem ve Çiko";bg.draggable=ch.draggable=false;
  scene.setAttribute("aria-label","Katmanlı ışık geçidi ve sorunun değişken verileri");
  plane.append(bg,ch);
  for(const p of items){const e=make("span","mtk-f04-label"+(p.value.includes("\n")?" multiline":""));const [x,y,w,h]=p.box;
   Object.assign(e.style,{left:x+"%",top:y+"%",width:w+"%",height:h+"%"});e.dataset.slot=p.slot;e.dataset.anchor=p.anchor;e.setAttribute("aria-label",p.anchor+": "+p.raw);
   const label=make("small",""),value=make("strong","");label.textContent=p.caption;value.textContent=p.value;e.append(label,value);plane.append(e);
  }
  scene.append(plane);let loaded=0;const ready=()=>{if(++loaded!==2||!frame.isConnected)return;
   if(!document.getElementById("mtk-f04-v211-style")){const s=document.createElement("style");s.id="mtk-f04-v211-style";s.textContent=css;document.head.append(s);}
   frame.classList.add("mtk-f04-v211");visual.replaceChildren(scene);
  };
  bg.onload=ch.onload=ready;bg.src=MASTER;ch.src=CHARACTER;
  return true;
 }
 window.MTKF04ApprovedV211=Object.freeze({plan,enhance,POS,source:MASTER,character:CHARACTER});
})();
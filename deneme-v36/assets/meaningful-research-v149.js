/* Matematik Evreni v149 — F01/F02 meaningful, source-driven research animations.
   Immutable 3D object pixels; change only independent browser layers. */
(function(){
 "use strict";
 const CSS = [
  ".mtk-frame .mtk-story-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;overflow:visible}",
  ".mtk-frame .mtk-story-svg path{fill:none;stroke:#17bde0;stroke-width:12;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:23 19;filter:drop-shadow(0 0 13px #5be4fc);animation:mtkEnergyMarch 2.4s linear infinite}",
  ".mtk-frame .mtk-story-svg path.drain{stroke:#ed9b57;filter:drop-shadow(0 0 10px #f4ac61)}",
  ".mtk-frame .mtk-story-svg path.dormant{opacity:.08}",
  "@keyframes mtkEnergyMarch{to{stroke-dashoffset:-84}}",
  ".mtk-frame .mtk-story-button{position:absolute;z-index:5;border:0;background:transparent;color:#24533e;cursor:pointer;touch-action:manipulation;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:3px;padding:1px 4px;font:800 clamp(9px,1.7cqw,18px)/1.15 system-ui,-apple-system,sans-serif}",
  ".mtk-frame .mtk-story-button:focus-visible{outline:2px solid #107da0;outline-offset:-1px;border-radius:10px}",
  ".mtk-frame .mtk-growth-panel{left:35.5%;top:29%;width:29%;height:23%}",
  ".mtk-frame .mtk-growth-caption{font-size:clamp(9px,1.65cqw,17px);font-weight:900;white-space:nowrap}",
  ".mtk-frame .mtk-growth-hint{font-size:clamp(8px,1.25cqw,13px);font-weight:650;opacity:.85}",
  ".mtk-frame .mtk-growth-row{display:grid;grid-template-columns:21px 1fr;align-items:center;width:95%;gap:3px;height:13%}",
  ".mtk-frame .mtk-growth-row .marker{font-size:clamp(9px,1.4cqw,14px);font-weight:900}",
  ".mtk-frame .mtk-growth-track{height:100%;border-radius:20px;background:#a99a7955;overflow:hidden;border:1px solid #b5a27b}",
  ".mtk-frame .mtk-growth-track i{display:block;height:100%;border-radius:20px;background:linear-gradient(90deg,#24915e,#88e3a0);transition:width .35s ease}",
  ".mtk-frame .mtk-growth-row.right i{background:linear-gradient(90deg,#338ab9,#78eaf5)}",
  ".mtk-frame .mtk-step-guide{left:26%;top:9%;width:48%;height:21%;font-size:clamp(9px,1.8cqw,20px);gap:5px}",
  ".mtk-frame .mtk-step-guide.compact{left:77%;top:5%;width:21%;height:12%;background:#fff5dabb;border:1px solid #aa8b50;border-radius:9px}",
  ".mtk-frame .mtk-step-guide strong{font-size:clamp(10px,1.83cqw,20px)}",
  ".mtk-frame .mtk-step-guide small{font-size:clamp(8px,1.35cqw,15px)}",
  ".mtk-frame .mtk-power-bars{width:88%;display:flex;gap:3px;align-items:center;justify-content:space-around;height:18%}",
  ".mtk-frame .mtk-power-bars span{display:block;flex:1;height:100%;min-width:0;border:1px solid #b7a57c;border-radius:10px;background:#c5b89b44;overflow:hidden}",
  ".mtk-frame .mtk-power-bars i{height:100%;display:block;background:linear-gradient(90deg,#36a0bd,#85f1f6);transition:width .3s}",
  ".mtk-frame .mtk-power-bars span.drain i{background:linear-gradient(90deg,#e59c58,#fbce88)}",
  ".mtk-frame .mtk-story-token{position:absolute;z-index:4;pointer-events:none;font:900 clamp(11px,1.85cqw,20px)/1 system-ui;text-shadow:0 1px 6px #fff,0 1px 3px #fff;padding:2px 4px;border-radius:7px;background:#e9ffe1ba}",
  ".mtk-frame .mtk-vine-token-a{left:10%;top:59%}",
  ".mtk-frame .mtk-vine-token-b{right:9%;top:59%;background:#e0f4ffbc}",
  "@media(orientation:landscape){.mtk-frame .mtk-story-button{font-size:clamp(10px,1.35cqw,20px)}.mtk-frame .mtk-growth-caption{font-size:clamp(10px,1.4cqw,21px)}.mtk-frame .mtk-step-guide strong{font-size:clamp(11px,1.4cqw,21px)}.mtk-frame .mtk-growth-hint{font-size:clamp(9px,1.1cqw,16px)}}",
  "@media(prefers-reduced-motion:reduce){.mtk-frame .mtk-story-svg path{animation:none!important}.mtk-frame .mtk-growth-track i{transition:none!important}}"
 ].join("\n");
 function elt(tag,cl,text){const n=document.createElement(tag);if(cl)n.className=cl;if(text!==undefined)n.textContent=String(text);return n}
 function get(labels,pattern){return (labels||[]).find(x=>pattern.test(String(x.anchor||"").toLocaleLowerCase("tr")))}
 function strip(val){return String(val||"").replace(/[^0-9]/g,"")}
 function factor(val){const m=String(val||"").match(/[×x]\s*(\d+)/);return m?Number(m[1]):null}
 function pathLayer(visual,paths){
   const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
   svg.setAttribute("viewBox","0 0 1000 1000");
   svg.setAttribute("preserveAspectRatio","none");
   svg.setAttribute("class","mtk-story-svg");
   return paths.map(info=>{
     const p=document.createElementNS("http://www.w3.org/2000/svg","path");
     p.setAttribute("d",info.d);
     if(info.drain)p.classList.add("drain");
     p.classList.add("dormant");
     svg.appendChild(p);return p;
   }) && (visual.appendChild(svg),[...svg.querySelectorAll("path")]);
 }
 function activate(paths,indexes){
   paths.forEach((p,i)=>p.classList.toggle("dormant",!indexes.includes(i)));
 }
 function vineDayGrowth(visual,labels){
   const left=get(labels,/sol.*ilk.*gün/),right=get(labels,/sağ.*ilk.*gün/);
   const leftFactor=get(labels,/sol.*büyüme/),rightFactor=get(labels,/sağ.*büyüme/),last=get(labels,/^gün$/);
   const a=Number(left?.value),b=Number(right?.value),fa=factor(leftFactor?.value),fb=factor(rightFactor?.value),total=Number(last?.value);
   if(![a,b,fa,fb,total].every(Number.isFinite)||a<1||b<1||fa<2||fb<2||total<2||total>7)return false;
   const old=Array.from(visual.querySelectorAll(".mtk-research-value")).find(n=>String(n.title||"").toLocaleLowerCase("tr")==="gün");
   if(old)old.hidden=true;
   const guide=elt("button","mtk-story-button mtk-growth-panel");
   guide.type="button";
   const caption=elt("strong","mtk-growth-caption");
   guide.appendChild(caption);
   const data=[];
   for(const cls of ["left","right"]){
     const row=elt("span","mtk-growth-row "+cls);
     row.appendChild(elt("span","marker",cls==="left"?"Sol":"Sağ"));
     const track=elt("span","mtk-growth-track"),bar=elt("i");
     track.appendChild(bar);row.appendChild(track);guide.appendChild(row);
     data.push(bar);
   }
   guide.appendChild(elt("small","mtk-growth-hint","Dokun • günleri incele"));
   let day=1;
   function paint(){
     const lv=a*Math.pow(fa,day-1),rv=b*Math.pow(fb,day-1),max=Math.max(lv,rv);
     data[0].style.width=Math.max(4,100*lv/max)+"%";
     data[1].style.width=Math.max(4,100*rv/max)+"%";
     caption.textContent=day+". gün / "+total+". gün";
     guide.setAttribute("aria-label",day+". gün, sol ve sağ sarmaşıkların göreli gelişimi. Sonraki günü görmek için dokun.");
   }
   guide.addEventListener("click",()=>{day=day>=total?1:day+1;paint()});
   visual.appendChild(guide);
   const paths=pathLayer(visual,[{d:"M 230 580 Q 100 480 220 260"},{d:"M 780 585 Q 900 450 780 255"}]);
   activate(paths,[0,1]);paint();
   return true;
 }
 function vineOther(visual,labels){
   const keep=get(labels,/korunma|kopan|geçit|dökülen/);
   const paths=pathLayer(visual,[{d:"M 275 510 Q 380 560 490 590 Q 510 560 500 490"},{d:"M 750 515 Q 650 590 510 600 Q 500 570 500 490"}]);
   activate(paths,[0,1]);
   if(keep){
     const token=elt("div","mtk-story-token mtk-vine-token-a",/dökülen|kopan/.test(String(keep.anchor))?"🍂":"🌿");
     visual.appendChild(token);
   }
 }
 const superscripts={"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9"};
 function amount(txt){
   const v=String(txt||"").trim();
   let m=v.match(/^2\^(\d+)$/);
   if(m)return Math.pow(2,Number(m[1]));
   m=v.match(/^2([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/);
   if(m)return Math.pow(2,Number([...m[1]].map(c=>superscripts[c]).join("")));
   return null;
 }
 function stairFlow(visual,labels){
   const spent=labels.some(x=>/harcama|tüketim|hasarlı|aktarım|uyarı kullanımı/i.test(String(x.anchor)));
   const partial=labels.some(x=>/çalışma oran|korunma/i.test(String(x.anchor)));
   const hasTop=labels.some(x=>/sayaç|toplam/i.test(String(x.anchor)));
   const guide=elt("button","mtk-story-button mtk-step-guide"+(hasTop?" compact":""));
   guide.type="button";
   const caption=elt("strong"),hint=elt("small");
   guide.append(caption);
   const barWrap=elt("span","mtk-power-bars");
   guide.appendChild(barWrap);guide.appendChild(hint);
   const countValues=labels.filter(x=>amount(x.value)!==null).slice(0,spent?3:4).map(x=>({value:amount(x.value),anchor:String(x.anchor)}));
   const high=Math.max(1,...countValues.map(x=>x.value));
   countValues.forEach((x,i)=>{
     const wrap=elt("span",spent&&i===countValues.length-1?"drain":"");
     wrap.title="Göreli güç: "+x.anchor;
     const bar=elt("i");bar.style.width=Math.max(5,100*x.value/high)+"%";
     wrap.appendChild(bar);barWrap.appendChild(wrap);
   });
   const mode=spent?["Güç kaynakları","Enerjiler birleşir","Kapı güç harcar"]:partial?["Basamak enerjisi","Etkin kısımlar","Güçler birleşir"]:["Basamak enerjisi","Güçler birleşir","Ortak güç"];
   const paths=pathLayer(visual,[
     {d:"M 220 800 Q 130 570 475 235"},
     {d:"M 800 650 Q 890 470 540 235"},
     {d:"M 520 235 Q 860 215 930 480",drain:spent}
   ]);
   let stage=0;
   function paint(){
     caption.textContent=mode[stage];
     hint.textContent=(stage+1)+"/3 · Dokunarak incele";
     guide.setAttribute("aria-label","Enerji akışı, "+mode[stage]+". Sonraki aşamayı görmek için dokun.");
     activate(paths,stage===0?[0]:stage===1?[0,1]:[0,1,2]);
   }
   guide.addEventListener("click",()=>{stage=(stage+1)%3;paint()});
   visual.appendChild(guide);paint();
 }
 function mount(visual,q){
   const id=String(q?.obstacleId||"");
   if(id!=="F01"&&id!=="F02")return false;
   if(!visual)return false;
   if(!document.getElementById("mtk-meaningful-v149-style")){
     const style=elt("style");style.id="mtk-meaningful-v149-style";style.textContent=CSS;document.head.appendChild(style);
   }
   const labels=Array.isArray(q?.visual?.labels)?q.visual.labels:[];
   if(id==="F01"){if(!vineDayGrowth(visual,labels))vineOther(visual,labels)}
   else stairFlow(visual,labels);
   return true;
 }
 window.MTKResearchMeaningfulV149=Object.freeze({mount,version:"149"});
})();
/* Matematik Evreni v150: readable learning controls; original 3D object unchanged. */
(function(){
"use strict";
const CSS="\n.mtk-frame .mtk-question-region.mtk-story-owner{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:4px!important}\n.mtk-frame .mtk-question-region.mtk-story-owner>.prompt{flex:1 1 auto!important;min-height:0!important;max-height:none!important;height:auto!important;overflow-y:auto!important}\n.mtk-frame .mtk-story-control{flex:0 0 auto;box-sizing:border-box;width:100%;border:1.5px solid #bda16e;border-radius:11px;background:#fff4dbee;color:#244839;padding:3px 6px;display:flex;flex-direction:column;gap:2px;box-shadow:0 1px 4px #603b1940}\n.mtk-frame .mtk-story-nav{display:flex;align-items:center;justify-content:space-between;gap:4px;min-height:27px}\n.mtk-frame .mtk-story-nav button{flex:0 0 32px;min-width:32px;min-height:27px;border:1.5px solid #9b8857;border-radius:8px;color:#145c60;background:#fff8e7;font:900 18px/1 system-ui;cursor:pointer;touch-action:manipulation}\n.mtk-frame .mtk-story-nav button:focus-visible{outline:2px solid #147bb4}\n.mtk-frame .mtk-story-status{flex:1;min-width:0;text-align:center;color:#2f553c;font:900 clamp(11px,2.65cqw,17px)/1.2 system-ui,-apple-system,sans-serif;white-space:nowrap}\n.mtk-frame .mtk-story-bottom{display:flex;align-items:center;justify-content:center;gap:6px;font:750 clamp(10px,2.4cqw,15px)/1.13 system-ui,-apple-system,sans-serif;min-height:13px;text-align:center;color:#465d4d}\n.mtk-frame .mtk-story-compare{flex:1;display:flex;align-items:center;gap:3px;min-width:0}\n.mtk-frame .mtk-story-compare b{white-space:nowrap;font-weight:850}\n.mtk-frame .mtk-story-rail{height:9px;flex:1;border-radius:15px;background:#dfdacc;overflow:hidden;border:1px solid #bbaa84}\n.mtk-frame .mtk-story-rail i{height:100%;display:block;min-width:4%;border-radius:15px;transition:width .23s ease}\n.mtk-frame .mtk-story-left .mtk-story-rail i{background:linear-gradient(90deg,#269953,#80d895)}\n.mtk-frame .mtk-story-right .mtk-story-rail i{background:linear-gradient(90deg,#138bb2,#80d3ec)}\n.mtk-frame .mtk-research-value.mtk-branch-left{color:#166543!important;text-shadow:0 1px #fff}\n.mtk-frame .mtk-research-value.mtk-branch-right{color:#125e8c!important;text-shadow:0 1px #fff}\n.mtk-frame .mtk-research-value.mtk-branch-focused{outline:3px solid #0f99a6!important;border-radius:9px;background:#e7fdf2c9!important}\n.mtk-frame .mtk-research-value.mtk-branch-muted{opacity:.32!important}\n.mtk-frame .mtk-meaningful-flow{position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none}\n.mtk-frame .mtk-meaningful-flow path{fill:none;stroke-width:9;stroke-linecap:round;stroke-linejoin:round;transition:opacity .25s ease}\n.mtk-frame .mtk-meaningful-flow path.source{stroke:#00c9f0;filter:drop-shadow(0 0 9px #17dffa)}\n.mtk-frame .mtk-meaningful-flow path.drain{stroke:#ef903e;filter:drop-shadow(0 0 9px #ffc37d)}\n.mtk-frame .mtk-story-dots{display:inline-flex;gap:3px;white-space:nowrap}\n.mtk-frame .mtk-story-dot{width:7px;height:7px;border-radius:100%;background:#d2c6a2;border:1px solid #a89269}\n.mtk-frame .mtk-story-dot.active{background:#178d94;border-color:#08717b}\n.mtk-frame .mtk-story-blue{color:#107aab;font-weight:900}\n.mtk-frame .mtk-story-orange{color:#ad6426;font-weight:900}\n.mtk-frame .mtk-research-value[hidden]{display:none!important}\n@media(orientation:landscape){.mtk-frame .mtk-story-control{padding:2px 6px;gap:1px}.mtk-frame .mtk-story-nav{min-height:24px}.mtk-frame .mtk-story-nav button{min-height:24px}.mtk-frame .mtk-story-status{font-size:clamp(10px,1.5cqw,16px)}.mtk-frame .mtk-story-bottom{font-size:clamp(9px,1.2cqw,14px)}}\n@media(prefers-reduced-motion:reduce){.mtk-frame .mtk-story-rail i,.mtk-frame .mtk-meaningful-flow path{transition:none!important}}\n";
function el(tag,cl,txt){const n=document.createElement(tag);if(cl)n.className=cl;if(txt!==undefined)n.textContent=String(txt);return n}
function find(labels,rx){return (labels||[]).find(x=>rx.test(String(x.anchor||"").toLocaleLowerCase("tr")))}
function mul(value){const m=String(value||"").match(/[×x]\s*(\d+)/);return m?Number(m[1]):null}
function toolbar(textRegion){
 textRegion.classList.add("mtk-story-owner");
 const root=el("div","mtk-story-control"),nav=el("div","mtk-story-nav");
 const prev=el("button","","‹"),status=el("strong","mtk-story-status"),next=el("button","","›");
 prev.type="button";next.type="button";prev.setAttribute("aria-label","Önceki aşama");next.setAttribute("aria-label","Sonraki aşama");
 nav.append(prev,status,next);
 const bottom=el("div","mtk-story-bottom");root.append(nav,bottom);textRegion.appendChild(root);
 return {root,prev,status,next,bottom};
}
function colorBranches(visual){
 Array.from(visual.querySelectorAll(".mtk-research-value")).forEach(n=>{
  const key=String(n.title||"").toLocaleLowerCase("tr");
  if(/sol|ilk dal/.test(key))n.classList.add("mtk-branch-left");
  if(/sağ/.test(key))n.classList.add("mtk-branch-right");
 });
}
function growth(visual,labels,ui){
 const aLabel=find(labels,/sol.*ilk.*gün/),bLabel=find(labels,/sağ.*ilk.*gün/);
 const faLabel=find(labels,/sol.*büyüme/),fbLabel=find(labels,/sağ.*büyüme/),last=find(labels,/^gün$/);
 const a=Number(aLabel?.value),b=Number(bLabel?.value),fa=mul(faLabel?.value),fb=mul(fbLabel?.value),total=Number(last?.value);
 if(![a,b,fa,fb,total].every(Number.isFinite)||a<1||b<1||fa<2||fb<2||total<2||total>7)return false;
 const old=Array.from(visual.querySelectorAll(".mtk-research-value")).find(n=>String(n.title||"").toLocaleLowerCase("tr")==="gün");
 if(old)old.hidden=true;
 colorBranches(visual);
 const bars=[];
 for(const [name,factor,cls] of [["Sol",fa,"mtk-story-left"],["Sağ",fb,"mtk-story-right"]]){
  const wrap=el("span","mtk-story-compare "+cls),title=el("b","",name+" ×"+factor),rail=el("span","mtk-story-rail"),fill=el("i");
  rail.appendChild(fill);wrap.append(title,rail);ui.bottom.appendChild(wrap);bars.push(fill);
 }
 let day=1;
 const paint=()=>{
  const left=a*Math.pow(fa,day-1),right=b*Math.pow(fb,day-1),max=Math.max(left,right);
  bars[0].style.width=(100*left/max).toFixed(1)+"%";
  bars[1].style.width=(100*right/max).toFixed(1)+"%";
  ui.status.textContent=day+". gün / "+total+". gün";
  ui.root.setAttribute("aria-label","Gün seçimi ve sol-sağ sarmaşıkların göreli büyüme çubukları.");
 };
 ui.prev.addEventListener("click",()=>{day=day<=1?total:day-1;paint()});
 ui.next.addEventListener("click",()=>{day=day>=total?1:day+1;paint()});
 paint();return true;
}
function compareBranches(visual,labels,ui){
 const keys=[...new Set(labels.map(x=>String(x.anchor||"").toLocaleLowerCase("tr").match(/\b(sol|sağ|kol a|kol b|kol c)\b/)?.[0]).filter(Boolean))];
 const modes=keys.length>1?keys.slice(0,3):["Levhalar","Birlikte"];
 let phase=0;const labelsOnArt=Array.from(visual.querySelectorAll(".mtk-research-value"));
 colorBranches(visual);
 const dots=el("span","mtk-story-dots"),icons=modes.map(()=>el("i","mtk-story-dot"));icons.forEach(d=>dots.appendChild(d));
 ui.bottom.append(dots,el("span","","Dal bilgilerini karşılaştır"));
 const update=()=>{
  const mode=modes[phase];
  ui.status.textContent=mode.charAt(0).toLocaleUpperCase("tr")+mode.slice(1)+" • incele";
  labelsOnArt.forEach(n=>{
   const active=mode==="Levhalar"||mode==="Birlikte"||String(n.title||"").toLocaleLowerCase("tr").includes(mode);
   n.classList.toggle("mtk-branch-focused",active&&mode!=="Levhalar"&&mode!=="Birlikte");
   n.classList.toggle("mtk-branch-muted",!active);
  });
  icons.forEach((d,i)=>d.classList.toggle("active",i===phase));
 };
 ui.prev.addEventListener("click",()=>{phase=(phase+modes.length-1)%modes.length;update()});
 ui.next.addEventListener("click",()=>{phase=(phase+1)%modes.length;update()});
 update();
}
function makeFlow(visual){
 const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
 svg.setAttribute("class","mtk-meaningful-flow");svg.setAttribute("viewBox","0 0 1000 1000");svg.setAttribute("preserveAspectRatio","none");
 const specs=[["source","M190 770 C175 610 230 430 455 230"],["source","M800 605 C800 440 700 305 540 230"],["drain","M500 235 C680 245 760 395 840 575"]];
 const paths=specs.map(([cls,d])=>{const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("class",cls);p.setAttribute("d",d);svg.appendChild(p);return p});
 visual.appendChild(svg);return paths;
}
function energy(visual,labels,ui){
 const spend=labels.some(x=>/harcama|tüketim|hasarlı|aktarım|uyarı kullanımı/i.test(String(x.anchor)));
 const partial=labels.some(x=>/çalışma oran|korunma/i.test(String(x.anchor)));
 const phases=spend?[["1/3 • Kaynaklar","Basamaklarda güç var"],["2/3 • Birleşme","Mavi: enerjiler birleşir"],["3/3 • Tüketim","Turuncu: kapı harcar"]]:
 partial?[["1/3 • Kaynaklar","Basamakların gücü"],["2/3 • Etkin oran","Yalnız etkin güç geçer"],["3/3 • Birleşme","Mavi: güçler birleşir"]]:
 [["1/3 • Kaynaklar","Basamakların gücü"],["2/3 • Birleşme","Mavi: güçler birleşir"],["3/3 • Ortak güç","Toplamı sen hesapla"]];
 let phase=0;const paths=makeFlow(visual),status=el("span"),dots=el("span","mtk-story-dots");
 const icons=phases.map(()=>el("i","mtk-story-dot"));icons.forEach(x=>dots.appendChild(x));ui.bottom.append(dots,status);
 const plaques=Array.from(visual.querySelectorAll(".mtk-research-value"));
 const update=()=>{
  ui.status.textContent=phases[phase][0];status.textContent=phases[phase][1];
  status.className=phase===2&&spend?"mtk-story-orange":phase===1?"mtk-story-blue":"";
  icons.forEach((d,i)=>d.classList.toggle("active",i===phase));
  paths[0].style.opacity=phase===0?".09":".85";paths[1].style.opacity=phase===0?".09":".85";paths[2].style.opacity=phase===2&&spend?".85":"0";
  plaques.forEach(n=>n.classList.toggle("mtk-branch-focused",phase===2&&spend&&/harcama|tüketim|hasarlı/.test(String(n.title||"").toLocaleLowerCase("tr"))));
 };
 ui.prev.addEventListener("click",()=>{phase=(phase+phases.length-1)%phases.length;update()});
 ui.next.addEventListener("click",()=>{phase=(phase+1)%phases.length;update()});
 update();
}
function mount(visual,q,textRegion){
 const id=String(q?.obstacleId||"");
 if((id!=="F01"&&id!=="F02")||!visual||!textRegion)return false;
 if(!document.getElementById("mtk-meaningful-v150-style")){
  const style=el("style");style.id="mtk-meaningful-v150-style";style.textContent=CSS;document.head.appendChild(style);
 }
 const ui=toolbar(textRegion),labels=Array.isArray(q?.visual?.labels)?q.visual.labels:[];
 if(id==="F01"){if(!growth(visual,labels,ui))compareBranches(visual,labels,ui)}else energy(visual,labels,ui);
 return true;
}
window.MTKResearchMeaningfulV150=Object.freeze({mount,version:"150"});
})();
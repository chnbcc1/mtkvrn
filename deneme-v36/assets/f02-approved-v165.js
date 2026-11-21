/* Matematik Evreni | F02 Işıklı Taş Basamaklar | user-approved artwork.
   All values are sourced from the selected approved 630-question pack; no text is baked into art.
   Screen coordinates are percentages of the approved F02 image itself. */
(()=>{"use strict";
 const IMAGE="./assets/f02-approved-v165.avif";
 const POS={
  top:{x:50,y:15.1,w:41.5,h:11.3},
  one:{x:47.5,y:64.2,w:26.5,h:8.0},
  two:{x:75.7,y:51.8,w:27.4,h:8.2},
  three:{x:50.6,y:42.2,w:24.4,h:7.9},
  four:{x:75.6,y:30.9,w:26.2,h:8.2}
 };
 const ORDER=["one","two","three","four"];
 const normalize=v=>String(v??"").toLocaleLowerCase("tr").replaceAll("_"," ").trim();
 const isCounter=a=>/üst sayaç|güç sayacı|çalışma oranları|basamak sayısı/.test(a);
 function plan(q){
  const entries=Array.isArray(q?.visual?.labels)?q.visual.labels:[];
  if(q?.obstacleId!=="F02"||entries.length===0||entries.length>5)return null;
  const out=[],used=new Set();
  const put=(slot,item,value=item.value)=>{
   if(!POS[slot]||used.has(slot))return false;
   used.add(slot);out.push({slot,anchor:String(item.anchor||""),value:String(value??"")});return true;
  };
  const repeated=entries.find(e=>normalize(e.anchor)==="her basamak");
  const count=entries.find(e=>normalize(e.anchor)==="basamak sayısı");
  if(repeated&&count){
    const n=Number(count.value);
    if(!Number.isInteger(n)||n<1||n>4)return null;
    put("top",count,n+" Basamak");
    for(let i=0;i<n;i++)put(ORDER[i],{anchor:"Basamak "+(i+1)},repeated.value);
    return out;
  }
  for(const e of entries){
    const a=normalize(e.anchor);
    if(isCounter(a))put("top",e);
  }
  const stepEntries=entries.filter(e=>!isCounter(normalize(e.anchor)));
  // Ordered data maps to the climbing path, from its bottom step to its top step.
  for(let i=0;i<stepEntries.length;i++){
    const e=stepEntries[i],a=normalize(e.anchor);
    let wish=null;
    const matched=a.match(/^basamak ([1-4])$/);
    if(matched)wish=ORDER[Number(matched[1])-1];
    else if(/son basamak|üst basamak/.test(a))wish="four";
    else if(/orta basamak|basamak b/.test(a))wish="two";
    else if(/ilk basamak|alt basamak|giriş|ilk enerji|^ilk$|basamak a/.test(a))wish="one";
    else if(/basamak c/.test(a))wish="three";
    else if(/kapı tüketimi|hasarlı taş/.test(a))wish="two";
    else if(/uyarı kullanımı/.test(a))wish="four";
    else if(/^uyarı$/.test(a))wish="three";
    else if(/^sol$/.test(a))wish="one";
    else if(/^sağ$/.test(a))wish="two";
    else if(/harcama|aktarım/.test(a))wish="three";
    if(wish&&used.has(wish))wish=null;
    if(!wish)wish=ORDER.find(x=>!used.has(x));
    if(wish)put(wish,e);
  }
  // For two-step question types, show the second step near the first; no fake digits.
  return out;
 }
 function render(visual,q){
  const labels=plan(q);
  if(!labels)return false;
  const scene=document.createElement("div");
  scene.className="mtk-f02-art";
  scene.setAttribute("aria-label","Işıklı Taş Basamaklar: değişken matematik levhaları");
  const art=document.createElement("img");
  art.className="mtk-f02-image";art.src=IMAGE;
  art.alt="Erdem ile Çiko'nun önünde dört büyülü ışıklı taş basamak; dört boş levha ve üst enerji göstergesi";
  art.draggable=false;scene.appendChild(art);
  for(const {slot,anchor,value} of labels){
    const pos=POS[slot],node=document.createElement("span");
    node.className="mtk-f02-label"+(String(value).length>13?" long":"");
    node.style.left=pos.x+"%";node.style.top=pos.y+"%";
    node.style.width=pos.w+"%";node.style.height=pos.h+"%";
    node.textContent=value;node.title=anchor;
    node.setAttribute("aria-label",anchor+" "+value);scene.appendChild(node);
  }
  visual.appendChild(scene);
  return true;
 }
 const style=document.createElement("style");
 style.id="mtk-f02-approved-css-v165";style.textContent=String.raw\`
 .mtk-frame .mtk-visual-region .mtk-f02-art{
    position:absolute;inset:0;width:100%;height:100%;overflow:hidden;
    display:flex;align-items:center;justify-content:center;pointer-events:none;
 }
 .mtk-frame .mtk-f02-art .mtk-f02-image{
    position:absolute;inset:0;width:100%;height:100%;object-fit:fill;
    user-select:none;pointer-events:none;
 }
 .mtk-frame .mtk-f02-art .mtk-f02-label{
    position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;
    color:#fff5d5;text-shadow:0 2px 4px #062921,0 1px 1px #05180d;
    font-weight:950;font-size:clamp(13px,3cqw,27px);letter-spacing:.015em;
    text-align:center;line-height:1.15;overflow-wrap:anywhere;white-space:normal;
    box-sizing:border-box;padding:2px 4px;pointer-events:none;
 }
 .mtk-frame .mtk-f02-art .mtk-f02-label.long{font-size:clamp(11px,2.25cqw,20px)}
 @media(orientation:landscape){
   .mtk-frame .mtk-f02-art .mtk-f02-label{font-size:clamp(13px,1.65cqw,26px)}
   .mtk-frame .mtk-f02-art .mtk-f02-label.long{font-size:clamp(11px,1.4cqw,20px)}
 }\`;
 if(!document.getElementById(style.id))document.head.appendChild(style);
 window.MTKF02ApprovedV165=Object.freeze({render,plan,positions:POS});
})();

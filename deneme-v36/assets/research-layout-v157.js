/* v157 pilot: F03 only. Erdem and Ciko use the EXACT pixels of the approved v145 portrait reference (cropped with CSS). */
(function(){
 "use strict";
 const old=window.MTKApprovedQuizV145;
 if(!old||window.MTKResearch157)return;
 const make=(tag,cls,value)=>{
  const e=document.createElement(tag);
  if(cls)e.className=cls;
  if(value!==undefined)e.textContent=String(value);
  return e;
 };
 function character(cls,src){
  const holder=make("div","mtk-v157-actor "+cls),image=make("img");
  image.src=src;image.alt="";image.setAttribute("aria-hidden","true");
  holder.append(image);return holder;
 }
 function placeValues(scene,q){
  const values=Array.isArray(q?.visual?.labels)?q.visual.labels:[];
  const linear=values.length>=3&&values.every(v=>/giriş|^[1-3]\. filtre|gözlem kolu/i.test(String(v.anchor||"")));
  const positions={"giriş":[30,51],"1. filtre":[49,51],"2. filtre":[63,51],"3. filtre":[77,51],"gözlem kolu":[92,51]};
  const row=linear?null:make("div","mtk-v157-labelrow");
  for(const item of values.slice(0,7)){
   const val=make("span","mtk-v157-label");
   val.append(make("small",null,item.anchor||""),make("b",null,item.value??""));
   const pos=positions[String(item.anchor||"").toLocaleLowerCase("tr")];
   if(linear&&pos){
    val.style.left=pos[0]+"%";val.style.top=pos[1]+"%";
    scene.append(val);
   }else row.append(val);
  }
  if(row)scene.append(row);
 }
 function pilot(app,q,s,choices){
  const frames=window.MTK_QUIZ_FRAMES_V145,media=window.MTK_QUIZ_MEDIA_V145;
  const prompt=app?.querySelector(".prompt");
  if(!prompt||!frames?.portrait||!media?.F03)return old.mount(app,q,s,choices);
  const rest=[...app.children].filter(el=>el!==prompt&&el!==choices&&!el.matches(".eyebrow,h2,.mini"));
  const screen=make("section","mtk-frame mtk-v157");
  screen.setAttribute("aria-label","Sis Türbini araştırma sorusu");
  const head=make("header","mtk-v157-header"),name=make("div","mtk-v157-title");
  name.append(make("small",null,"MATEMATİK EVRENİ · ORMAN PATİKASI"),make("strong",null,"Sis Türbini"));
  head.append(name,make("span","mtk-v157-level",(q.difficulty||"").toLocaleUpperCase("tr")));
  const body=make("div","mtk-v157-body"),scene=make("section","mtk-v157-scene");
  scene.setAttribute("aria-label","Üç filtreli sis makinesi: işaretli değerleri incele");
  const art=make("img","mtk-v157-object");
  art.src=media.F03;art.alt="Bir giriş, üç filtre ve gözlem tüpünden oluşan sis makinesi";
  scene.append(art,character("mtk-v157-erdem",frames.portrait),character("mtk-v157-chiko",frames.portrait));
  placeValues(scene,q);
  const paper=make("section","mtk-v157-paper"),bar=make("div","mtk-v157-paperhead");
  bar.append(make("span",null,"🔎 Araştırma Görevi"),make("small",null,q.id||"F03"));
  const question=make("div","mtk-v157-question");question.append(prompt);
  const feedback=make("section","mtk-v157-feedback");rest.forEach(el=>feedback.append(el));
  choices.classList.add("mtk-v157-choices");
  paper.append(bar,question,feedback,choices,make("div","mtk-v157-note","İlk yanlış: ipucu · İkinci yanlış: benzer örnek"));
  body.append(scene,paper);screen.append(head,body);
  app.replaceChildren(screen);document.body.classList.add("mtk-approved-active");
  return true;
 }
 window.MTKApprovedQuizV145=Object.freeze({
  mount(app,q,s,choices){
   if(q?.obstacleId==="F03"&&q?.visual?.sceneId==="f03-research-3d")return pilot(app,q,s,choices);
   return old.mount(app,q,s,choices);
  },
  reset(){old.reset()}
 });
 window.MTKResearch157=Object.freeze({pilot:"F03",landscape:"50/50",characters:"approved v145 portrait reference"});
})();
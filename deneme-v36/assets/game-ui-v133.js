/* Matematik Evreni v128 — shared settings & chapter panel building blocks. */
(function(){
 "use strict";
 const version="141";
 function settingsMarkup(prefix,p){
  const sound=!!p.sound,vibration=!!p.vibration;
  return '<div class="mtk-setting-list forestSettings">'+
   '<label for="'+prefix+'Sound"><span class="mtk-setting-icon">🔊</span>'+
   '<span class="mtk-setting-label"><strong>Ses efektleri</strong><small>Oyun ve düğme sesleri</small></span>'+
   '<input id="'+prefix+'Sound" type="checkbox" '+(sound?'checked':'')+' aria-label="Ses efektleri"></label>'+
   '<label for="'+prefix+'Vibration"><span class="mtk-setting-icon">📳</span>'+
   '<span class="mtk-setting-label"><strong>Titreşim</strong><small>Desteklenen cihazlarda dokunsal geri bildirim</small></span>'+
   '<input id="'+prefix+'Vibration" type="checkbox" '+(vibration?'checked':'')+' aria-label="Titreşim"></label>'+
   '<button type="button" id="'+prefix+'RestartChapter" class="mtk-action-setting mtk-restart-chapter" aria-label="Bölümü yeniden başlatmayı onayla">'+
   '<span class="mtk-setting-icon" aria-hidden="true">↻</span><span class="mtk-setting-label"><strong>Bölümü Yeniden Başlat</strong><small>Yalnızca bulunduğun bölümü sıfırla</small></span></button>'+
   '<button type="button" id="'+prefix+'RestartGame" class="mtk-action-setting mtk-restart-game" aria-label="Oyunu yeniden başlatmayı onayla">'+
   '<span class="mtk-setting-icon" aria-hidden="true">↻</span><span class="mtk-setting-label"><strong>Oyunu Yeniden Başlat</strong><small>Bütün bölümleri sıfırla</small></span></button>'+
   '</div><p class="mtk-version">✦ Matematik Evreni · v'+version+' · İlerleme otomatik kaydedilir.</p>';
 }
 function bindSettings(prefix){
  const one=document.getElementById(prefix+"Sound"),two=document.getElementById(prefix+"Vibration");
  if(one)one.addEventListener("change",e=>window.MTKPrefs?.update({sound:e.target.checked}));
  if(two)two.addEventListener("change",e=>window.MTKPrefs?.update({vibration:e.target.checked}));
 }
 function resetProgress(scope,chapter="home"){
  const homeKey="mathverse-v40-investigation",forestKey="mathverse-v68-forest-full";
  function clearQuizRuns(){
   const keys=[];for(let i=0;i<localStorage.length;i++)keys.push(localStorage.key(i));
   for(const k of keys)if(k&&(k.startsWith("mathverse-v70-quiz-")||k==="mathverse-v65-choice-run"))localStorage.removeItem(k);
  }
  try{
   if(scope==="game"){
    for(const k of [homeKey,forestKey,"mathverse-v128-chapter-milestones"])localStorage.removeItem(k);
    clearQuizRuns();return true;
   }
   if(scope!=="chapter")return false;
   if(chapter==="home"){localStorage.removeItem(homeKey);return true}
   if(chapter==="forest"){
    localStorage.removeItem(forestKey);localStorage.removeItem("mathverse-v128-chapter-milestones");clearQuizRuns();
    const home=JSON.parse(localStorage.getItem(homeKey)||"null");
    if(home&&typeof home==="object"){
     delete home.chapter2;home.chapter2EntrySeen=false;home.activeScene="home";
     localStorage.setItem(homeKey,JSON.stringify(home));
    }
    return true;
   }
  }catch(e){console.warn("İlerleme sıfırlanamadı",e);return false}
  return false;
 }
 function notesProgress(icon,title,detail){
  const holder=document.createElement("div");holder.className="mtk-notes-progress";
  const emblem=document.createElement("span");emblem.textContent=icon;
  const copy=document.createElement("div"),strong=document.createElement("strong"),small=document.createElement("small");
  strong.textContent=title;small.textContent=detail;copy.append(strong,small);holder.append(emblem,copy);
  return holder;
 }

 // The illustration uses the game's own authentic Çiko animation atlas.
 // A single 192 × 192 frame is shown inside the pre-existing illustrated
 // medallion; no unrelated emoji/parrot image is used.
 function mountChiko(){
  const el=document.getElementById("pikoBtn");
  if(!el||el.dataset.mtkChikoMounted)return;
  el.dataset.mtkChikoMounted="1";
  el.textContent="";
  const portrait=document.createElement("span");
  portrait.className="mtk-chiko-portrait";
  portrait.setAttribute("aria-hidden","true");
  const sprite=document.createElement("span");
  sprite.className="mtk-chiko-frame";
  portrait.append(sprite);
  const label=document.createElement("span");
  label.className="mtk-chiko-name";
  label.textContent="ÇİKO";label.setAttribute("aria-hidden","true");
  el.append(portrait,label);
  if(window.CHIKO_V57_HD_ATLAS){
   sprite.style.backgroundImage='url("'+window.CHIKO_V57_HD_ATLAS+'")';
  }
 }
 // The map is a real in-game sheet. Its iframe is only its self-contained
 // interactive atlas: it never changes the browser page when it opens.
 function configureHUD(chapterId){
  const hud=document.querySelector(".mtk-hud-shell");
  if(!hud)return;
  const chapters=window.MTKWorldMap?.chapters?.()||[];
  const item=chapters.find(c=>c.id===chapterId);
  if(!item)return;
  hud.dataset.chapter=chapterId;
  const icon=hud.querySelector(".mtk-hud-chapter-icon");
  const title=hud.querySelector(".mtk-hud-chapter-name");
  const subtitle=hud.querySelector(".mtk-hud-chapter-subtitle");
  if(icon)icon.textContent=item.icon;
  if(title)title.textContent=item.name.toLocaleUpperCase("tr-TR");
  if(subtitle)subtitle.textContent=item.subtitle;
 }
 // These cards never scroll vertically: reduce paragraph/heading typography to
 // fit small iPhone landscape screens instead of clipping the lower buttons.
 function fitPanel(content,{question=false}={}){
  if(!content||question)return;
  const run=()=>{
   if(!content.isConnected||content.clientHeight<20)return;
   content.style.overflowY="hidden";
   content.style.fontSize="";
   const all=[content,...content.querySelectorAll("p,div,section,blockquote")];
   for(let i=0;i<9&&content.scrollHeight>content.clientHeight+3;i++){
    const current=parseFloat(getComputedStyle(content).fontSize)||16;
    content.style.fontSize=Math.max(11,current-1)+"px";
    for(const child of all.slice(1)){
     if(child.matches(".statement,.note,.noteAdvice,.thought,.mtk-note-line")){
      child.style.padding=Math.max(5,12-i)+"px";
      child.style.marginBlock="2px";
     }
    }
   }
  };
  requestAnimationFrame(run);
 }
 function openMap({from="home",onOpen,onClose,onBeforeNavigate}={}){
  const prior=document.activeElement;
  const existing=document.querySelector(".mtk-map-layer");
  if(existing)return existing.__mtkClose;
  if(typeof onOpen==="function")onOpen();
  const overlay=document.createElement("div");
  overlay.className="mtk-map-layer";
  const sheet=document.createElement("section");
  sheet.className="mtk-map-sheet";sheet.setAttribute("role","dialog");
  sheet.setAttribute("aria-modal","true");sheet.setAttribute("aria-label","Macera haritası");
  const head=document.createElement("div");head.className="mtk-map-sheet-head";
  const title=document.createElement("strong");title.textContent="Macera Haritası";
  const closeButton=document.createElement("button");closeButton.className="mtk-map-sheet-close";
  closeButton.type="button";closeButton.textContent="✕ Kapat";closeButton.setAttribute("aria-label","Haritayı kapat");
  head.append(title,closeButton);
  const body=document.createElement("div");body.className="mtk-map-contents";
  sheet.append(head,body);overlay.append(sheet);document.body.append(overlay);
  let closed=false;
  function close(){
   if(closed)return;closed=true;
   document.removeEventListener("keydown",escape);
   view?.close();overlay.remove();
   if(typeof onClose==="function")onClose();
   if(prior?.isConnected)prior.focus?.();
  }
  function escape(e){if(e.key==="Escape"){e.preventDefault();e.stopImmediatePropagation();close()}}
  const view=window.MTKWorldMap.mount(body,{
   from,
   onClose:close,
   onNavigate(region){
    if(from===region){close();return}
    const next=(window.MTKWorldMap.chapters().find(c=>c.id===region)||{}).route;
    if(!next)return;
    if(typeof onBeforeNavigate==="function")onBeforeNavigate();
    close();location.assign(next);
   }
  });
  document.addEventListener("keydown",escape,true);
  closeButton.addEventListener("click",close);
  overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
  overlay.__mtkClose=close;
  closeButton.focus({preventScroll:true});
  return close;
 }
 window.MTKGameUI=Object.freeze({version,settingsMarkup,bindSettings,resetProgress,notesProgress,mountChiko,configureHUD,fitPanel,openMap});
})();

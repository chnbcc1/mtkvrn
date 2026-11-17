/* Matematik Evreni v127 — shared settings & chapter panel building blocks. */
(function(){
 "use strict";
 const version="127";
 function settingsMarkup(prefix,p){
  const sound=!!p.sound,vibration=!!p.vibration;
  return '<div class="mtk-setting-list forestSettings">'+
   '<label for="'+prefix+'Sound"><span class="mtk-setting-icon">🔊</span>'+
   '<span class="mtk-setting-label"><strong>Ses efektleri</strong><small>Oyun ve düğme sesleri</small></span>'+
   '<input id="'+prefix+'Sound" type="checkbox" '+(sound?'checked':'')+' aria-label="Ses efektleri"></label>'+
   '<label for="'+prefix+'Vibration"><span class="mtk-setting-icon">📳</span>'+
   '<span class="mtk-setting-label"><strong>Titreşim</strong><small>Desteklenen cihazlarda dokunsal geri bildirim</small></span>'+
   '<input id="'+prefix+'Vibration" type="checkbox" '+(vibration?'checked':'')+' aria-label="Titreşim"></label>'+
   '</div><p class="mtk-version">✦ Matematik Evreni · v'+version+' · İlerleme otomatik kaydedilir.</p>';
 }
 function bindSettings(prefix){
  const one=document.getElementById(prefix+"Sound"),two=document.getElementById(prefix+"Vibration");
  if(one)one.addEventListener("change",e=>window.MTKPrefs?.update({sound:e.target.checked}));
  if(two)two.addEventListener("change",e=>window.MTKPrefs?.update({vibration:e.target.checked}));
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
 function openMap({from="home",onOpen,onClose,onBeforeNavigate}={}){
  const previous=document.activeElement;
  const existing=document.querySelector(".mtk-map-layer");
  if(existing)return existing.__mtkClose;
  if(typeof onOpen==="function")onOpen();
  const overlay=document.createElement("div");
  overlay.className="mtk-map-layer";
  const sheet=document.createElement("section");
  sheet.className="mtk-map-sheet";
  sheet.setAttribute("role","dialog");
  sheet.setAttribute("aria-modal","true");
  sheet.setAttribute("aria-label","Macera haritası");
  const head=document.createElement("div");
  head.className="mtk-map-sheet-head";
  const name=document.createElement("strong");
  name.textContent="🧭 PROFESÖRÜN KAYIP İZLERİ · HARİTA";
  const closeButton=document.createElement("button");
  closeButton.type="button";closeButton.className="mtk-map-sheet-close";
  closeButton.textContent="✕ Kapat";
  closeButton.setAttribute("aria-label","Macera haritasını kapat");
  head.append(name,closeButton);
  const frame=document.createElement("iframe");
  frame.className="mtk-map-sheet-frame";
  frame.title="Matematik Evreni Macera Haritası";
  frame.setAttribute("loading","eager");
  frame.src="./map-v113.html?embedded=1&from="+encodeURIComponent(from)+"&v=127";
  sheet.append(head,frame);overlay.append(sheet);document.body.append(overlay);
  let closed=false;
  function close(){
   if(closed)return;closed=true;
   window.removeEventListener("message",receive);
   document.removeEventListener("keydown",escape);
   overlay.remove();
   if(typeof onClose==="function")onClose();
   if(previous?.isConnected)previous.focus?.();
  }
  function escape(e){if(e.key==="Escape"){e.preventDefault();close()}}
  function receive(event){
   if(event.origin!==location.origin||event.source!==frame.contentWindow)return;
   const data=event.data||{};
   if(data.type==="mtk-map-close"){close();return}
   if(data.type!=="mtk-map-navigate")return;
   const region=data.region;
   if(!["home","forest","gate"].includes(region))return;
   if((from==="home"&&region==="home")||(from==="forest"&&region==="forest")){close();return}
   if(typeof onBeforeNavigate==="function")onBeforeNavigate();
   close();
   const destination=region==="home"
    ?"./?scene=home&autostart=1&v=127"
    :region==="gate"
      ?"./forest-v113-full.html?resume=1&focus=gate&v=127"
      :"./forest-v113-full.html?resume=1&v=127";
   location.assign(destination);
  }
  window.addEventListener("message",receive);
  document.addEventListener("keydown",escape);
  closeButton.addEventListener("click",close);
  overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
  overlay.__mtkClose=close;
  closeButton.focus({preventScroll:true});
  return close;
 }

 window.MTKGameUI=Object.freeze({version,settingsMarkup,bindSettings,notesProgress,mountChiko,openMap});
})();

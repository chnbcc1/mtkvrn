/* Matematik Evreni v125 — shared settings & chapter panel building blocks. */
(function(){
 "use strict";
 const version="125";
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
 window.MTKGameUI=Object.freeze({version,settingsMarkup,bindSettings,notesProgress});
})();

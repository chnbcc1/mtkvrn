/* v221: guarded progressive activation of verified scene assets. */
(function(root){
const api=(function buildAPI(root){
"use strict";
const specialIds=Object.freeze(["F02","F03","F07","F10","F19"]);
const deferred=Object.freeze([]);
const eligible=q=>/^F(?:0[1-9]|1[0-9]|2[01])$/.test(q?.obstacleId||"")&&!deferred.includes(q.obstacleId);
let active=null;
function trailMessage(event,q,extra={}){
 try{if(root.parent===root)return;const params=new URLSearchParams(location.search);
 if(params.get("embedded")!=="1")return;
 const preview=params.get("preview")==="1";
 root.parent.postMessage({source:preview?"mtk-qa-v225":"mathverse-v68-quiz",event,obstacle:q.obstacleId,difficulty:params.get("difficulty")||q.difficulty,...extra},location.origin);
 }catch(e){}
}
function mountTrailNavigation(ui,q){
 if(!ui?.navigation)return false;
 const button=document.createElement("button");button.type="button";button.className="mtk-trail-button-v237";button.textContent="‹ Patikaya dön";
 button.addEventListener("click",()=>trailMessage("return-to-trail",q));
 ui.navigation.replaceChildren(button);ui.navigation.hidden=false;return true;
}
function previewReport(event,q,extra={}){try{if(new URLSearchParams(location.search).get("preview")!=="1")return;root.parent.postMessage({source:"mtk-qa-v225",event,obstacle:q.obstacleId,question:q.id,...extra},location.origin)}catch(e){}}
function reset(){
 const a=active;active=null;if(!a)return;
 clearTimeout(a.timer);a.scene?.destroy();a.ui?.destroy();a.host?.remove();
}
function capture(app,choices){
 const prompt=app.querySelector(".prompt");if(!prompt)return null;
 const rest=[...app.children].filter(n=>n!==prompt&&n!==choices&&!n.matches(".eyebrow,h2,.mini"));
 const groups=rest.filter(n=>n.classList.contains("btnRow"));
 return {prompt,extras:rest.filter(n=>!groups.includes(n)),buttons:groups.flatMap(n=>[...n.children])};
}
function mount(app,q,s,choices,run,save){
 reset();
 const raw=capture(app,choices);
 function errorScreen(){
  const box=document.createElement("div");Object.assign(box.style,{position:"fixed",inset:"0",background:"#123d32",color:"#fff6df",display:"grid",placeContent:"center",gap:"12px",padding:"24px",textAlign:"center",zIndex:"2"});
  const message=document.createElement("p");message.textContent="Onaylı soru görseli yüklenemedi.";
  const retry=document.createElement("button");retry.className="btn";retry.textContent="Tekrar dene";retry.onclick=()=>location.reload();
  const back=document.createElement("button");back.className="btn";back.textContent="Patikaya dön";back.onclick=()=>trailMessage("return-to-trail",q);
  box.append(message,retry,back);app.replaceChildren(box);trailMessage("trail-navigation-ready",q);trailMessage("load-error",q);previewReport("error",q,{message:"Onaylı soru görseli yüklenemedi."});return false;
 }
 if(!raw||!eligible(q))return errorScreen();
 const api=root.MTKSceneLayoutV218,planAPI=root.MTKScenePlanV214,characterAPI=root.MTKCharacterLayerV215,plaqueAPI=root.MTKPlaqueTextV216,matchingAPI=root.MTKF21MatchingV217;
 const specialAPI=root.MTKSpecialScenesV222;
 if(!api||!planAPI?.plan(q)||!characterAPI||!plaqueAPI||(q.obstacleId==="F21"&&!matchingAPI)||(specialIds.includes(q.obstacleId)&&!specialAPI?.describe(q))){return errorScreen();}
 const host=document.createElement("div");host.className="mtk-upgrade-host-v221";
 Object.assign(host.style,{position:"fixed",inset:"0",width:"100%",height:"100%",background:"#123d32",zIndex:"1"});
 const loading=document.createElement("div");loading.textContent="Soru görseli hazırlanıyor…";Object.assign(loading.style,{position:"absolute",inset:"0",display:"grid",placeItems:"center",color:"#fff6df",background:"#123d32",zIndex:"4",fontWeight:"700"});
 host.append(loading);app.replaceChildren(host);
 const ui=api.shell(host);
 if(!ui){host.remove();return errorScreen()}
 ui.element.style.visibility="hidden";ui.element.inert=true;document.body.classList.add("mtk-approved-active");
 const ticket={host,ui,scene:null,timer:null};active=ticket;
 // F21 old board has already locked choices. Recover original disabled state
 // only for the matching controller, while preserving wrong/revealed choices.
 const helpOpen=!!(run.stageCorrect||run.awaiting)||(!run.stageCorrect&&Number(run.wrong)>0&&run.helpView!==false);
 const realChoices=[...choices.children];
 const choiceSnapshot=realChoices.map(b=>({b,disabled:b.disabled,locked:b.classList.contains("match-locked")}));
 let matchingTouched=false;
 const scopedMatching=q.obstacleId==="F21"?{mount(args){
  matchingTouched=true;
  for(const {b} of choiceSnapshot){b.disabled=!!(run.stageCorrect||run.revealed||run.awaiting||b.classList.contains("wrongChoice"));b.classList.remove("match-locked")}
  const result=matchingAPI.mount({...args,choices});
  if(!result)restoreChoices();
  return result;
 }}:matchingAPI;
 function restoreChoices(){if(!matchingTouched)return;matchingTouched=false;for(const {b,disabled,locked} of choiceSnapshot){b.disabled=disabled;b.classList.toggle("match-locked",locked)}}
 function discard(){if(active===ticket){reset();restoreChoices();errorScreen();}}
 ticket.timer=setTimeout(discard,15000);
 api.mountScene({q,ui,sceneAPI:planAPI,characterAPI,plaqueAPI,matchingAPI:scopedMatching,specialAPI,run,save}).then(scene=>{
  if(active!==ticket||!host.isConnected){scene?.destroy();if(active===ticket)discard();return}
  if(!scene){discard();return}
  clearTimeout(ticket.timer);ticket.scene=scene;
  try{
   // Keep actual original DOM nodes and event listeners. Never clone buttons.
   const hasTrailNavigation=mountTrailNavigation(ui,q);
   ui.content.append(raw.prompt);
   ui.choices.append(...realChoices);
   ui.actions.append(...raw.buttons);
   const extra=document.createElement("div");extra.className="mtk-extra-v221";
   extra.append(...raw.extras);
   if(helpOpen){
    ui.question.insertBefore(extra,ui.choices);
    // Only the teaching card and its actions occupy the question half.
    // Original prompt, data and choice nodes survive for the return path.
    ui.content.hidden=true;
    ui.readout.hidden=true;
    ui.choices.hidden=true;
    ui.choices.style.display="none";
    ui.element.classList.add("mtk-teaching-open-v224");
    extra.classList.add("mtk-teaching-body-v224");
    extra.setAttribute("role","region");
    extra.setAttribute("aria-label","İpucu ve çözüm");
    extra.tabIndex=0;
    ui.actions.classList.add("mtk-teaching-actions-v224");
    ui.visual.inert=true;
   }else{
    ui.question.insertBefore(extra,ui.actions);
    if(!raw.extras.length)extra.hidden=true;
   }
   ui.element.classList.add("mtk-live-v221");
   // Old frame is removed only after both images and all dynamic layers exist.
   loading.remove();ui.element.style.visibility="visible";ui.element.inert=false;
   root.MTKMathNotebook?.placeButton(app);
   if(hasTrailNavigation)trailMessage("trail-navigation-ready",q);
   trailMessage("ready",q);
   if(helpOpen){ui.question.scrollTop=0;extra.scrollTop=0;}
   const character=scene.character?.image||scene.plane?.querySelector?.(".mtk-approved-character-v215");
   previewReport("scene-ready",q,{orientation:ui.orientation,characterLoaded:!!character?.naturalWidth,characterWidth:character?.naturalWidth||0,characterHeight:character?.naturalHeight||0,labels:scene.plan?.labels?.length||0,helpOpen});
  }catch(error){
   discard();
  }
 }).catch(discard);
 return true;
}
return Object.freeze({mount,reset,eligible,deferred,mountTrailNavigation});
})(root);
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKSceneLiveV221=api;
})(typeof window!=="undefined"?window:globalThis);

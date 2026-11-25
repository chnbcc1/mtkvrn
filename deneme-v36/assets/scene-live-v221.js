/* v221: guarded progressive activation of verified scene assets. */
(function(root){
const api=(function buildAPI(root){
"use strict";
const deferred=Object.freeze(["F02","F03","F07","F10","F19"]);
const eligible=q=>/^F(?:0[1-9]|1[0-9]|2[01])$/.test(q?.obstacleId||"")&&!deferred.includes(q.obstacleId);
let active=null;
function reset(){
 const a=active;active=null;if(!a)return;
 a.scene?.destroy();a.ui?.destroy();a.host?.remove();
}
function capture(app,choices){
 const prompt=app.querySelector(".prompt");if(!prompt)return null;
 const rest=[...app.children].filter(n=>n!==prompt&&n!==choices&&!n.matches(".eyebrow,h2,.mini"));
 const groups=rest.filter(n=>n.classList.contains("btnRow"));
 return {prompt,extras:rest.filter(n=>!groups.includes(n)),buttons:groups.flatMap(n=>[...n.children])};
}
function mount(app,q,s,choices,run,save){
 reset();
 const raw=capture(app,choices),legacy=root.MTKApprovedQuizV145;
 const fallback=legacy?.mount(app,q,s,choices,run,save);
 if(!fallback||!raw||!eligible(q))return fallback;
 const api=root.MTKSceneLayoutV218,planAPI=root.MTKScenePlanV214,characterAPI=root.MTKCharacterLayerV215,plaqueAPI=root.MTKPlaqueTextV216,matchingAPI=root.MTKF21MatchingV217;
 if(!api||!planAPI?.plan(q)||!characterAPI||!plaqueAPI||(q.obstacleId==="F21"&&!matchingAPI))return fallback;
 const frame=app.querySelector(".mtk-frame");if(!frame)return fallback;
 const host=document.createElement("div");host.className="mtk-upgrade-host-v221";
 Object.assign(host.style,{position:"fixed",inset:"0",width:"100%",height:"100%",visibility:"hidden",pointerEvents:"none",zIndex:"1"});
 app.append(host);
 const ui=api.shell(host);
 if(!ui){host.remove();return fallback}
 const ticket={host,ui,frame,scene:null};active=ticket;
 // F21 old board has already locked choices. Recover original disabled state
 // only for the matching controller, while preserving wrong/revealed choices.
 const helpOpen=!run.stageCorrect&&Number(run.wrong)>0&&run.helpView!==false;
 const realChoices=[...choices.children];
 const choiceSnapshot=realChoices.map(b=>({b,disabled:b.disabled,locked:b.classList.contains("match-locked")}));
 const scopedMatching=q.obstacleId==="F21"?{mount(args){
  for(const {b} of choiceSnapshot){b.disabled=!!(run.stageCorrect||run.revealed||run.awaiting||b.classList.contains("wrongChoice"));b.classList.remove("match-locked")}
  const result=matchingAPI.mount({...args,choices});
  if(!result)restoreChoices();
  return result;
 }}:matchingAPI;
 function restoreChoices(){for(const {b,disabled,locked} of choiceSnapshot){b.disabled=disabled;b.classList.toggle("match-locked",locked)}}
 function discard(){if(active===ticket){reset();restoreChoices()}}
 api.mountScene({q,ui,sceneAPI:planAPI,characterAPI,plaqueAPI,matchingAPI:scopedMatching,run,save}).then(scene=>{
  if(active!==ticket||!frame.isConnected){scene?.destroy();if(active===ticket)discard();return}
  if(!scene){discard();return}
  ticket.scene=scene;
  try{
   // Keep actual original DOM nodes and event listeners. Never clone buttons.
   ui.content.append(raw.prompt);
   ui.choices.append(...realChoices);
   ui.actions.append(...raw.buttons);
   const extra=document.createElement("div");extra.className="mtk-extra-v221";
   extra.append(...raw.extras);
   if(helpOpen){
    ui.question.insertBefore(extra,ui.choices);
    ui.choices.hidden=true;
    ui.choices.style.display="none";
   }else{
    ui.question.insertBefore(extra,ui.actions);
    if(!raw.extras.length)extra.hidden=true;
   }
   ui.element.classList.add("mtk-live-v221");
   // Old frame is removed only after both images and all dynamic layers exist.
   frame.remove();host.style.visibility="visible";host.style.pointerEvents="auto";
   root.MTKMathNotebook?.placeButton(app);
   if(helpOpen)extra.scrollIntoView?.({block:"start"});
  }catch(error){
   // If commit failed after nodes moved, restore them through the original
   // renderer using the same nodes and their listeners.
   if(active!==ticket)return;
   reset();restoreChoices();
   const group=document.createElement("div");group.className="btnRow";group.append(...raw.buttons);
   choices.append(...realChoices);app.replaceChildren(raw.prompt,choices,...raw.extras);
   if(raw.buttons.length)app.append(group);
   legacy.mount(app,q,s,choices,run,save);root.MTKMathNotebook?.placeButton(app);
  }
 }).catch(discard);
 return fallback;
}
return Object.freeze({mount,reset,eligible,deferred});
})(root);
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKSceneLiveV221=api;
})(typeof window!=="undefined"?window:globalThis);

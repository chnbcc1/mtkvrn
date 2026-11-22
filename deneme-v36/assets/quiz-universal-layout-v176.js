/* Matematik Evreni v176 — one responsive geometry for all 21 quiz obstacles.
   Separate scene and DOM data; never rasterize question numbers into art.
   A slot occupies exactly 50% of its side. The original image is always CONTAIN,
   never cover or fill, until a correctly proportioned orientation asset exists. */
(function(){
"use strict";
const ID="mtk-universal-layout-v176";
const CSS=`
body.mtk-approved-active .mtk-frame.mtk-universal-v176{
  position:relative!important;box-sizing:border-box!important;isolation:isolate!important;
  width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
  max-width:100%!important;max-height:100%!important;aspect-ratio:auto!important;
  border:0!important;border-radius:0!important;overflow:hidden!important;
  margin:0!important;padding:0!important;
  background:#123d32!important;background-image:none!important;
  container-type:inline-size!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176::before{
  content:""!important;position:absolute!important;pointer-events:none!important;z-index:1!important;
  box-sizing:border-box!important;left:0!important;top:50%!important;width:100%!important;
  height:50%!important;border:4px solid #d6aa65!important;border-radius:12px!important;
  background:linear-gradient(140deg,#fff6df,#f5dcaf)!important;
  box-shadow:inset 0 0 0 1px #fff8e4!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .f01-approved-portrait,
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .f01-landscape-panel{
  display:none!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-visual-region{
  box-sizing:border-box!important;position:absolute!important;z-index:2!important;
  left:0!important;top:0!important;width:100%!important;height:50%!important;
  max-width:none!important;max-height:none!important;aspect-ratio:auto!important;
  border:0!important;border-radius:0!important;padding:0!important;margin:0!important;
  transform:none!important;overflow:hidden!important;
  background:#123d32!important;background-image:none!important;
  pointer-events:auto!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-visual-region .f01-approved-landscape{
  display:block!important;position:absolute!important;z-index:0!important;
  left:0!important;top:0!important;right:auto!important;bottom:auto!important;
  width:100%!important;height:100%!important;max-width:100%!important;
  transform:none!important;aspect-ratio:auto!important;
  object-fit:contain!important;object-position:center!important;
  user-select:none!important;pointer-events:none!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-visual-region .mtk-f02-image,
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-visual-region .mtk-research-object,
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-visual-region .mtk-visual-image{
  object-fit:contain!important;object-position:center!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-visual-region .mtk-visual-image{
  position:absolute!important;left:0!important;top:0!important;bottom:auto!important;
  width:100%!important;height:100%!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-question-region{
  box-sizing:border-box!important;position:absolute!important;z-index:4!important;
  left:4.2%!important;top:51.1%!important;width:91.6%!important;height:25.1%!important;
  min-height:0!important;max-height:none!important;overflow:hidden!important;
  padding:5px 6px 2px!important;margin:0!important;display:flex!important;
  flex-flow:column nowrap!important;align-items:stretch!important;gap:3px!important;
  border:0!important;box-shadow:none!important;background:transparent!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-question-region>.prompt{
  box-sizing:border-box!important;position:relative!important;inset:auto!important;
  color:#33291b!important;background:transparent!important;
  border:0!important;box-shadow:none!important;flex:1 1 auto!important;
  min-height:0!important;max-height:100%!important;width:100%!important;
  margin:0!important;padding:2px 5px!important;
  font-family:system-ui,-apple-system,sans-serif!important;
  font-size:clamp(12px,3.1cqw,21px)!important;font-weight:750!important;
  line-height:1.29!important;letter-spacing:normal!important;
  overflow-x:hidden!important;overflow-y:auto!important;
  overflow-wrap:break-word!important;white-space:normal!important;
  touch-action:pan-y!important;-webkit-overflow-scrolling:touch!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.choiceGrid{
  box-sizing:border-box!important;position:absolute!important;inset:auto!important;z-index:8!important;
  left:4.2%!important;top:77.2%!important;width:91.6%!important;height:14.5%!important;
  min-height:0!important;max-height:none!important;max-width:91.6%!important;
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:5% 3.6%!important;
  margin:0!important;padding:0!important;background:none!important;
  pointer-events:none!important;overflow:visible!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.choiceGrid>.choice,
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.choiceGrid>.choice:nth-child(n){
  box-sizing:border-box!important;position:static!important;inset:auto!important;
  left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;
  width:100%!important;height:100%!important;max-width:100%!important;
  max-height:100%!important;min-height:0!important;min-width:0!important;
  transform:none!important;display:flex!important;align-items:center!important;justify-content:center!important;
  padding:3px 5px!important;margin:0!important;gap:7px!important;
  border:1.7px solid #b88c51!important;border-radius:12px!important;
  background:#fffaeed9!important;box-shadow:0 2px 4px #76542c3b!important;
  color:#33291b!important;font-size:clamp(12px,3.05cqw,23px)!important;
  line-height:1.15!important;font-weight:860!important;
  text-align:center!important;overflow:hidden!important;pointer-events:auto!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.choiceGrid>.choice[aria-pressed="true"]{
  box-shadow:inset 0 0 0 2px #237b65!important;background:#dbf4e2!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.choiceGrid>.choice.wrongChoice{
  box-shadow:inset 0 0 0 2px #a83c38!important;background:#f7e4d9!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions{
  box-sizing:border-box!important;position:absolute!important;z-index:12!important;
  left:4.2%!important;top:92.3%!important;width:91.6%!important;height:6.8%!important;
  display:flex!important;align-items:center!important;justify-content:flex-start!important;
  flex-wrap:nowrap!important;gap:7px!important;margin:0!important;padding:0!important;
  overflow:visible!important;border:0!important;background:none!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions>.btnRow{
  position:static!important;inset:auto!important;display:flex!important;
  flex:0 1 auto!important;min-width:0!important;max-width:50%!important;
  gap:0!important;margin:0!important;padding:0!important;
  border:0!important;background:none!important;box-shadow:none!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions .btn{
  box-sizing:border-box!important;position:static!important;
  width:auto!important;max-width:100%!important;min-width:0!important;
  min-height:30px!important;height:auto!important;padding:5px 10px!important;margin:0!important;
  border:1px solid #a99365!important;border-radius:10px!important;
  background:#fff8e5aa!important;color:#56664a!important;
  box-shadow:none!important;font-family:system-ui,-apple-system,sans-serif!important;
  font-size:clamp(11px,2.35cqw,16px)!important;font-weight:650!important;line-height:1.15!important;
  white-space:normal!important;pointer-events:auto!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions .btn:focus-visible{
  outline:2px solid #216b65!important;outline-offset:2px!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-feedback-overlay:not(.mtk-answer-help-card):not(.mtk-f02-correct-card){
  position:relative!important;inset:auto!important;top:auto!important;left:auto!important;
  box-sizing:border-box!important;display:block!important;
  width:100%!important;max-width:100%!important;max-height:55%!important;
  min-height:0!important;margin:2px 0!important;padding:4px!important;
  overflow-y:auto!important;box-shadow:none!important;border:0!important;
  background:#fff0d8ed!important;font-size:clamp(11px,2.3cqw,16px)!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176.mtk-help-mode>.mtk-answer-help-card{
  box-sizing:border-box!important;position:absolute!important;inset:auto!important;
  left:3%!important;top:51%!important;width:94%!important;height:47.6%!important;
  max-height:none!important;z-index:35!important;overflow:hidden!important;
  display:flex!important;flex-flow:column nowrap!important;
  background:#fff4dd!important;border:2px solid #b68f56!important;
  border-radius:12px!important;padding:8px!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176.mtk-help-mode>.mtk-answer-help-card .mtk-help-body{
  min-height:0!important;flex:1 1 auto!important;overflow-y:auto!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176.mtk-help-mode>.mtk-universal-actions{display:none!important}
body.mtk-approved-active .mtk-frame.mtk-universal-v176.mtk-f02-correct-mode>.mtk-f02-correct-card{
  box-sizing:border-box!important;position:absolute!important;inset:auto!important;
  left:4.2%!important;top:51.1%!important;width:91.6%!important;height:25.1%!important;
  overflow:hidden!important;display:flex!important;flex-flow:column nowrap!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-f02-correct-foot:empty{display:none!important}
@media(orientation:landscape){
  body.mtk-approved-active .mtk-frame.mtk-universal-v176::before{
    left:50%!important;top:0!important;width:50%!important;height:100%!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-visual-region{
    left:0!important;top:0!important;width:50%!important;height:100%!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-question-region{
    left:51.6%!important;top:4%!important;width:46.8%!important;height:56%!important;
    padding:6px 9px 2px!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-question-region>.prompt{
    font-size:clamp(12px,1.72cqw,24px)!important;line-height:1.25!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176>.choiceGrid{
    left:51.6%!important;top:62%!important;width:46.8%!important;height:27.5%!important;
    max-width:46.8%!important;gap:6% 4%!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176>.choiceGrid>.choice,
  body.mtk-approved-active .mtk-frame.mtk-universal-v176>.choiceGrid>.choice:nth-child(n){
    font-size:clamp(12px,1.56cqw,22px)!important;padding:4px 6px!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions{
    left:51.6%!important;top:91%!important;width:46.8%!important;height:7.2%!important;
    gap:8px!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions .btn{
    min-height:28px!important;padding:3px 9px!important;
    font-size:clamp(11px,1.05vw,15px)!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176.mtk-help-mode>.mtk-answer-help-card{
    left:51%!important;top:2.4%!important;width:48%!important;height:95%!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176.mtk-f02-correct-mode>.mtk-f02-correct-card{
    left:51.6%!important;top:4%!important;width:46.8%!important;height:56%!important;
  }
}

/* F02 practice mode formerly used a more specific per-obstacle text height.
   Global geometry takes precedence, in either orientation, with no overlay. */
body.mtk-approved-active .mtk-frame.mtk-universal-v176.mtk-f02-toolbar-mode>.mtk-question-region{
  left:4.2%!important;top:51.1%!important;width:91.6%!important;height:25.1%!important;
}
@media(orientation:landscape){
  body.mtk-approved-active .mtk-frame.mtk-universal-v176.mtk-f02-toolbar-mode>.mtk-question-region{
    left:51.6%!important;top:4%!important;width:46.8%!important;height:56%!important;
  }
}

/* v179: every obstacle, every question. Both completion/practice actions
   are true choice-column peers (not little buttons in a half-width btnRow).
   Existing handlers and saved question state are never replaced. */
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions {
  box-sizing:border-box!important;
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  grid-template-rows:minmax(0,1fr)!important;
  column-gap:3.6%!important;row-gap:0!important;
  align-items:stretch!important;justify-content:stretch!important;
  justify-items:stretch!important;
  overflow:hidden!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions>.btn,
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions>.btnRow>.btn {
  box-sizing:border-box!important;position:static!important;inset:auto!important;
  display:flex!important;align-items:center!important;justify-content:center!important;
  width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;
  max-width:100%!important;max-height:100%!important;
  margin:0!important;padding:3px 8px!important;
  font-size:clamp(11px,2.55cqw,17px)!important;line-height:1.12!important;
  font-weight:750!important;text-align:center!important;white-space:normal!important;
  border:1.7px solid #b88c51!important;border-radius:12px!important;
  background:#fff8e9!important;color:#445744!important;
  box-shadow:0 2px 4px #76542c30!important;
  overflow-wrap:break-word!important;overflow:hidden!important;
  pointer-events:auto!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions>.btnRow {
  display:contents!important;
}
/* Open instructional panel: use equal-width buttons as well. */
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-answer-help-card .mtk-help-foot>.btnRow {
  box-sizing:border-box!important;width:100%!important;
  display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
  gap:3.6%!important;align-items:stretch!important;
}
body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-answer-help-card .mtk-help-foot>.btnRow>.btn {
  box-sizing:border-box!important;width:100%!important;min-width:0!important;
  min-height:34px!important;margin:0!important;
  border:1.7px solid #b88c51!important;border-radius:12px!important;
  background:#fff8e9!important;color:#445744!important;
  font-weight:750!important;white-space:normal!important;
}
@media(orientation:landscape) {
  body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions {
    column-gap:4%!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176>.mtk-universal-actions>.btn {
    font-size:clamp(10px,1.12vw,15px)!important;
    padding:2px 5px!important;
  }
  body.mtk-approved-active .mtk-frame.mtk-universal-v176 .mtk-answer-help-card .mtk-help-foot>.btnRow {
    gap:4%!important;
  }
}
`;
function apply(frame,q){
  if(!frame||!q||!/^F(?:0[1-9]|1[0-9]|2[01])$/.test(String(q.obstacleId||"")))return false;
  frame.classList.add("mtk-universal-v176");
  frame.dataset.sceneId=String(q.visual?.sceneId||q.obstacleId);
  const visual=frame.querySelector(".mtk-visual-region");
  if(!visual)return false;
  // F01 approved scene art and existing DOM labels must share one coordinate box.
  if(q.obstacleId==="F01"){
    const scene=frame.querySelector(".f01-approved-landscape");
    if(scene)visual.prepend(scene);
  }
  // Generic/interactive diagrams continue to be real DOM, not numbers burnt into JPG/AVIF.
  // Legacy portrait/landscape frame is intentionally no longer a full-screen background.
  if(!document.getElementById(ID)){
    const style=document.createElement("style");
    style.id=ID;style.textContent=CSS;document.head.appendChild(style);
  }else{
    document.head.appendChild(document.getElementById(ID));
  }
  const openHelp=frame.classList.contains("mtk-help-mode");
  if(!openHelp){
    const groups=[...frame.querySelectorAll(".mtk-feedback-overlay .btnRow")];
    if(groups.length){
      const actions=document.createElement("nav");
      actions.className="mtk-universal-actions";
      actions.setAttribute("aria-label","Soru işlemleri");
      // Use real buttons as direct grid items. A completed question supplies
      // two buttons inside ONE btnRow; moving that row as one item used to
      // squeeze both actions into a single option-column width.
      for(const group of groups){
        for(const child of [...group.children])actions.appendChild(child);
        group.remove();
      }
      frame.appendChild(actions);
      for(const extra of frame.querySelectorAll(".mtk-feedback-overlay")){
        if(!extra.textContent.trim())extra.remove();
      }
    }
  }
  return true;
}
window.MTKQuizUniversalV176=Object.freeze({apply,version:"179",styleId:ID});
})();

/* Matematik Evreni v159 — approved F01 artwork as an immutable image; math labels are DOM layers.
   Portrait: full approved artwork. Landscape: left 50% approved scene, right 50% text and choices.
   Does not modify the question, answer order, scoring, feedback handlers, Erdem or Çiko pixels. */
(function(){
  'use strict';
  const PORTRAIT='./assets/f01-approved-portrait-v159.webp';
  const SCENE='./assets/f01-approved-scene-v159.webp';
  const STYLE=`
    body.mtk-approved-active .mtk-frame.mtk-f01-v159 {
      position:relative!important; isolation:isolate!important; overflow:hidden!important;
      width:min(100vw,calc(100dvh * 2 / 3))!important;
      height:auto!important; aspect-ratio:2 / 3!important;
      max-width:none!important; max-height:100dvh!important; padding:0!important;
      margin:0 auto!important; border:0!important; border-radius:0!important;
      box-shadow:none!important; background:#073b33!important; container-type:inline-size;
    }
    .mtk-frame.mtk-f01-v159 .f01-approved-portrait {
      position:absolute;inset:0;width:100%;height:100%;object-fit:fill;z-index:0;
      pointer-events:none;user-select:none;
    }
    .mtk-frame.mtk-f01-v159 .f01-approved-landscape {display:none}
    .mtk-frame.mtk-f01-v159 .f01-landscape-panel{display:none}
    .mtk-frame.mtk-f01-v159 .mtk-visual-region {
      position:absolute!important;left:0!important;top:0!important;width:100%!important;
      height:52.1%!important;overflow:visible!important;z-index:2!important;
      transform:none!important;pointer-events:none!important;background:none!important;
    }
    .mtk-frame.mtk-f01-v159 .f01-label {
      position:absolute;z-index:5;transform:translate(-50%,-50%);display:flex;
      align-items:center;justify-content:center;text-align:center;
      padding:0 2px;box-sizing:border-box;
      font:900 clamp(11px,3.25cqw,27px)/1.08 system-ui,-apple-system,sans-serif!important;
      color:#f9f4d4!important;text-shadow:0 2px 3px #062f2c,0 0 2px #072d23;
      white-space:normal;overflow-wrap:anywhere;pointer-events:none;
    }
    .mtk-frame.mtk-f01-v159 .f01-label.long{font-size:clamp(10px,2.4cqw,21px)!important}
    .mtk-frame.mtk-f01-v159 .mtk-question-region{
      position:absolute!important;left:5.2%!important;top:55.7%!important;width:89.6%!important;
      height:20.6%!important;min-height:0!important;z-index:3!important;
      display:flex!important;flex-direction:column!important;gap:3px!important;
      padding:0!important;margin:0!important;overflow-y:auto!important;
      background:none!important;border:0!important;box-shadow:none!important;
      overscroll-behavior:contain;
    }
    .mtk-frame.mtk-f01-v159 .mtk-question-region .prompt{
      color:#342a1a!important; background:transparent!important;border:0!important;
      padding:0!important;margin:0!important;font:750 clamp(12px,3.28cqw,21px)/1.28 system-ui,-apple-system,sans-serif!important;
      text-align:left!important;white-space:normal!important;overflow-wrap:break-word!important;
    }
    .mtk-frame.mtk-f01-v159.mtk-help-mode .mtk-question-region{
      left:5.2%!important;top:55.7%!important;width:89.6%!important;height:40.5%!important;
      display:flex!important;flex-direction:column!important;overflow-y:auto!important;
    }
    .mtk-frame.mtk-f01-v159.mtk-help-mode .mtk-question-region .prompt{display:none!important}
    .mtk-frame.mtk-f01-v159 .choiceGrid{
      position:absolute!important;left:4.3%!important;top:77.8%!important;width:91.4%!important;
      height:17.3%!important;max-height:none!important;min-height:0!important;z-index:6!important;
      display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
      grid-template-rows:repeat(2,minmax(0,1fr))!important;
      gap:8% 4%!important;padding:0!important;margin:0!important;
      background:transparent!important;border:0!important;box-shadow:none!important;
    }
    .mtk-frame.mtk-f01-v159 .choiceGrid .choice{
      appearance:none!important;display:flex!important;align-items:center!important;justify-content:center!important;
      position:relative!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;
      width:100%!important;height:100%!important;min-height:0!important;
      background:transparent!important;border:0!important;border-radius:12px!important;
      box-shadow:none!important;padding:2px 4px!important;margin:0!important;
      color:#302719!important; font:800 clamp(12px,3.4cqw,25px)/1.1 system-ui,-apple-system,sans-serif!important;
      gap:8px!important;cursor:pointer;touch-action:manipulation;
    }
    .mtk-frame.mtk-f01-v159 .choiceGrid .choice .choiceMark{font:900 1em/1 system-ui!important;color:inherit!important}
    .mtk-frame.mtk-f01-v159 .choiceGrid .choice:focus-visible{
      outline:3px solid #078d8b!important;outline-offset:-4px!important;
    }
    .mtk-frame.mtk-f01-v159 .choiceGrid .choice.wrongChoice{
      background:#ea717144!important;box-shadow:inset 0 0 0 3px #b44d3e!important;
    }
    .mtk-frame.mtk-f01-v159 .choiceGrid .choice[aria-pressed="true"]{
      background:#80d2ad50!important;box-shadow:inset 0 0 0 3px #228675!important;
    }
    .mtk-frame.mtk-f01-v159 .mtk-feedback-overlay{
      position:relative!important;inset:auto!important;width:100%!important;
      height:auto!important;max-height:none!important;overflow:visible!important;
      background:#fff0cfee!important;color:#40301c!important;z-index:7!important;
      margin:0!important;padding:5px!important;box-shadow:none!important;border-radius:10px!important;
    }
    .mtk-frame.mtk-f01-v159 .mtk-feedback-overlay[hidden]{display:none!important}
    .mtk-frame.mtk-f01-v159 .mtk-feedback-toggle{
      position:relative!important;inset:auto!important;min-height:25px!important;
      font:700 12px system-ui!important;align-self:flex-start!important;pointer-events:auto!important;
    }
    @media (orientation:landscape){
      body.mtk-approved-active .mtk-frame.mtk-f01-v159 {
        width:100vw!important;height:100dvh!important;aspect-ratio:auto!important;
        max-height:100dvh!important;max-width:100vw!important;margin:0!important;
        border-radius:0!important;
        background:linear-gradient(120deg,#0e3831,#0e5143)!important;
      }
      .mtk-frame.mtk-f01-v159 .f01-approved-portrait{display:none}
      .mtk-frame.mtk-f01-v159 .f01-approved-landscape{
        display:block;position:absolute;left:0;top:50%;transform:translateY(-50%);
        width:50%;height:auto;aspect-ratio:1024 / 800;object-fit:contain;z-index:0;
        pointer-events:none;user-select:none;
      }
      .mtk-frame.mtk-f01-v159 .f01-landscape-panel{
        display:block;position:absolute;left:50%;top:0;width:50%;height:100%;box-sizing:border-box;
        background:linear-gradient(130deg,#fff5da,#fce5ac)!important;
        border:5px solid #c99b50;border-radius:14px;box-shadow:inset 0 0 0 2px #fef1cc;
        z-index:1;pointer-events:none;
      }
      .mtk-frame.mtk-f01-v159 .mtk-visual-region{
        left:0!important;top:50%!important;transform:translateY(-50%)!important;
        width:50%!important;height:auto!important;aspect-ratio:1024 / 800!important;
      }
      .mtk-frame.mtk-f01-v159 .f01-label{
        font-size:clamp(11px,1.55vw,21px)!important;
      }
      .mtk-frame.mtk-f01-v159 .f01-label.long{font-size:clamp(9px,1.25vw,17px)!important}
      .mtk-frame.mtk-f01-v159 .mtk-question-region{
        left:52%!important;top:5%!important;width:46%!important;height:55%!important;
        padding:2px!important;
      }
      .mtk-frame.mtk-f01-v159 .mtk-question-region .prompt{
        font-size:clamp(13px,1.65vw,22px)!important;line-height:1.22!important;
      }
      .mtk-frame.mtk-f01-v159.mtk-help-mode .mtk-question-region{
        left:52%!important;top:5%!important;width:46%!important;height:90%!important;
      }
      .mtk-frame.mtk-f01-v159 .choiceGrid{
        left:52%!important;top:63%!important;width:46%!important;height:32%!important;
        gap:8% 4%!important;
      }
      .mtk-frame.mtk-f01-v159 .choiceGrid .choice{
        background:#fffaf0b6!important;border:2px solid #bd9254!important;
        box-shadow:0 1px 2px #5c431d45!important;
        font-size:clamp(12px,1.55vw,21px)!important;
      }
    }
    @media (prefers-reduced-motion:reduce){
      .mtk-frame.mtk-f01-v159 *{transition:none!important;animation:none!important}
    }
  `;
  const PLAQUES = [
    {id:'top',x:52,y:16.0,w:28,h:9},
    {id:'leftUpper',x:25,y:33.4,w:19.4,h:10.5},
    {id:'rightUpper',x:79.5,y:33.4,w:19.3,h:10.5},
    {id:'leftLower',x:35.7,y:67.4,w:20,h:10},
    {id:'rightLower',x:79.7,y:67.4,w:20,h:10}
  ];
  function chooseSlot(label,used){
    const a=String(label||'').toLocaleLowerCase('tr').replaceAll('_',' ').trim();
    let wanted=null;
    if(/(^gün$|kaçıncı gün|toplam|ortak|sayaç|dökülen|kol c)/.test(a))wanted='top';
    else if(/sol/.test(a) && /(büyüme|korunma|kopan|geçit|katlanma)/.test(a))wanted='leftUpper';
    else if(/sağ/.test(a) && /(büyüme|korunma|kopan|geçit|katlanma)/.test(a))wanted='rightUpper';
    else if(/sağ|kol b/.test(a))wanted='rightLower';
    else if(/sol|kol a|ilk dal|ilk|sabah|bugün/.test(a))wanted='leftLower';
    else if(/büyüme|gelişim|akşam|katlanma/.test(a))wanted='leftUpper';
    const order=['leftLower','rightLower','leftUpper','rightUpper','top'];
    const choice=(wanted&&!used.has(wanted))?wanted:order.find(x=>!used.has(x));
    if(choice)used.add(choice);
    return PLAQUES.find(x=>x.id===choice)||null;
  }
  function make(tag,cls){const n=document.createElement(tag);if(cls)n.className=cls;return n}
  function enhance(frame,q){
    if(!frame||String(q?.obstacleId||'')!=='F01')return false;
    const region=frame.querySelector('.mtk-visual-region');
    const text=frame.querySelector('.mtk-question-region');
    if(!region||!text||!frame.querySelector('.choiceGrid'))return false;
    if(!document.getElementById('mtk-f01-v159-style')){
      const style=make('style');style.id='mtk-f01-v159-style';style.textContent=STYLE;document.head.appendChild(style);
    }
    // The approved image already includes Erdem and Çiko: do not redraw or crop their faces.
    const bg=make('img','f01-approved-portrait');bg.src=PORTRAIT;
    bg.alt='Onaylanan Sarmaşık Duvarı; sol altta Erdem ve Çiko; beş boş taş levha';
    const landscape=make('img','f01-approved-landscape');landscape.src=SCENE;
    landscape.alt='Aynı onaylı Sarmaşık Duvarı sahnesi ve karakterler';
    const panel=make('div','f01-landscape-panel');panel.setAttribute('aria-hidden','true');
    // Normal renderer still owns the answers, feedback buttons, scoring and question text.
    const oldFeedback=region.querySelector('.mtk-feedback-overlay');
    const toggle=region.querySelector('.mtk-feedback-toggle');
    region.replaceChildren();
    if(oldFeedback)text.appendChild(oldFeedback);
    if(toggle)text.appendChild(toggle);
    const used=new Set();
    for(const entry of (Array.isArray(q?.visual?.labels)?q.visual.labels:[])){
      const slot=chooseSlot(entry.anchor,used);if(!slot)continue;
      const raw=String(entry.value??'');
      const anchor=String(entry.anchor??'').toLocaleLowerCase('tr').replaceAll('_',' ').trim();
      const shown=/(^gün$|kaçıncı gün)/.test(anchor) && /^[0-9]+$/.test(raw.trim()) ? raw.trim()+'. Gün' : raw;
      const v=make('span','f01-label'+(shown.length>9?' long':''));
      v.style.left=slot.x+'%';v.style.top=slot.y+'%';v.style.width=slot.w+'%';
      v.style.height=slot.h+'%';v.textContent=shown;
      v.title=String(entry.anchor??'');
      v.setAttribute('aria-label',String(entry.anchor??'')+': '+String(entry.value??''));
      region.appendChild(v);
    }
    frame.prepend(bg,landscape,panel);
    frame.classList.add('mtk-f01-v159');
    return true;
  }
  window.MTKF01ApprovedV159=Object.freeze({enhance,chooseSlot,version:'159'});
})();
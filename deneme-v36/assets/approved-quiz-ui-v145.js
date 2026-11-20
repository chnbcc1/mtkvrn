/* Matematik Evreni v145: approved portrait/landscape frame art + dynamic quiz overlays. */
(function(){
  'use strict';
  const style = `
  body.embedded.mtk-approved-active{height:100dvh!important;min-height:0!important;padding:0!important;background:#102d27!important;overflow:hidden!important}
  .mtk-approved-active main{height:100%!important;width:100%!important;max-width:none!important;display:grid!important;place-items:center!important;overflow:hidden!important;margin:0!important}
  .mtk-approved-active #app{height:100%!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;box-shadow:none!important;border:0!important;background:transparent!important;display:grid!important;place-items:center!important;overflow:hidden!important}
  .mtk-frame{box-sizing:border-box;position:relative;aspect-ratio:941/1672;width:min(100vw,calc(100dvh * 941 / 1672));max-height:100dvh;background-image:var(--portrait-frame);background-repeat:no-repeat;background-size:100% 100%;container-type:inline-size;overflow:hidden;isolation:isolate}
  .mtk-frame .mtk-question-region{position:absolute;left:24.5%;top:11.7%;width:68.6%;height:24%;display:flex;align-items:flex-start;justify-content:stretch;overflow:hidden}
  .mtk-frame .mtk-question-region>.prompt{font-size:clamp(13px,2.65cqw,26px)!important;line-height:1.32!important;overflow-y:auto!important;overflow-wrap:anywhere;max-height:100%;width:100%;height:auto;margin:0!important;padding:0!important;white-space:pre-wrap;background:transparent!important;color:#123832!important;border:0!important;box-shadow:none!important;font-weight:760!important;scrollbar-width:thin}
  .mtk-frame .mtk-visual-region{position:absolute;left:24.6%;top:37.5%;width:68.5%;height:24.7%;overflow:hidden}
  .mtk-frame .mtk-visual-image{position:absolute;left:0;bottom:0;width:100%;height:80%;object-fit:contain;object-position:center bottom;pointer-events:none}
  .mtk-frame .mtk-image-tag{position:absolute;top:0;transform:translateX(-50%);display:grid;place-items:center;white-space:nowrap;border:1px solid #ad7d3e;border-radius:999px;background:#fff4d5;color:#184840;padding:.2em .45em;min-width:9%;font-size:clamp(10px,1.6cqw,17px);font-weight:850;box-shadow:0 1px 2px #66482460}
  .mtk-frame>.choiceGrid{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;padding:0!important;margin:0!important;gap:0!important;pointer-events:none}
  .mtk-frame .choiceGrid>.choice{box-sizing:border-box!important;position:absolute!important;display:flex!important;justify-content:center!important;text-align:center!important;align-items:center!important;gap:.45em!important;padding:.3em .55em!important;margin:0!important;min-height:0!important;max-height:none!important;width:35.1%!important;height:7.8%!important;pointer-events:auto!important;border:2px solid transparent!important;background:transparent!important;box-shadow:none!important;border-radius:15px!important;color:#39281d!important;line-height:1.12!important;font-size:clamp(11px,2.5cqw,23px)!important;font-weight:900!important;overflow:auto!important;scrollbar-width:thin}
  .mtk-frame .choiceGrid>.choice:nth-child(1){left:22.2%!important;top:66.6%!important}
  .mtk-frame .choiceGrid>.choice:nth-child(2){left:60.5%!important;top:66.6%!important}
  .mtk-frame .choiceGrid>.choice:nth-child(3){left:22.2%!important;top:76.4%!important}
  .mtk-frame .choiceGrid>.choice:nth-child(4){left:60.5%!important;top:76.4%!important}
  .mtk-frame .choiceGrid>.choice .choiceMark{width:auto!important;height:auto!important;flex:0 0 auto!important;border:0!important;background:transparent!important;color:inherit!important;font-weight:950!important;border-radius:0!important;display:inline!important;padding:0!important;font-size:inherit!important}
  .mtk-frame .choiceGrid>.choice[aria-pressed=true]{outline:3px solid #187c6f!important;background:#d5f8db99!important}
  .mtk-frame .choiceGrid>.choice.wrongChoice{outline:3px solid #a84335!important;background:#f6ad9788!important}
  .mtk-frame .mtk-feedback-overlay{box-sizing:border-box;position:absolute;z-index:20;top:28%;left:25%;width:67%;max-height:48%;overflow-y:auto;background:#fff3d9f5;border:2px solid #c9a066;box-shadow:0 8px 28px #0006;border-radius:13px;padding:clamp(8px,1.8cqw,19px);font-size:clamp(12px,1.9cqw,17px);color:#3b2b1e}
  .mtk-frame .mtk-feedback-overlay .btnRow{position:static!important;margin-top:9px!important;padding:0!important;background:transparent!important;box-shadow:none!important}
  .mtk-frame .mtk-feedback-overlay .btn{min-height:35px!important;padding:6px 9px!important;font-size:inherit!important}
  @media(orientation:landscape){
    .mtk-frame{aspect-ratio:1672/941;width:min(100vw,calc(100dvh * 1672 / 941));background-image:var(--landscape-frame)}
    .mtk-frame .mtk-question-region{left:16.5%;top:14.8%;width:39.3%;height:45.7%}
    .mtk-frame .mtk-question-region>.prompt{font-size:clamp(11px,1.8cqw,27px)!important;line-height:1.32!important}
    .mtk-frame .mtk-visual-region{left:57.2%;top:14.7%;width:39%;height:45.5%}
    .mtk-frame .mtk-visual-image{height:78%}
    .mtk-frame .mtk-image-tag{font-size:clamp(9px,1.1cqw,17px)}
    .mtk-frame .choiceGrid>.choice{width:39.1%!important;height:10.4%!important;font-size:clamp(11px,1.65cqw,23px)!important}
    .mtk-frame .choiceGrid>.choice:nth-child(1){left:15.9%!important;top:67.5%!important}
    .mtk-frame .choiceGrid>.choice:nth-child(2){left:57.2%!important;top:67.5%!important}
    .mtk-frame .choiceGrid>.choice:nth-child(3){left:15.9%!important;top:82.0%!important}
    .mtk-frame .choiceGrid>.choice:nth-child(4){left:57.2%!important;top:82.0%!important}
    .mtk-frame .mtk-feedback-overlay{top:20%;left:25%;width:64%;max-height:66%}
  }
  `;
  function elem(tag,cls){const e=document.createElement(tag);if(cls)e.className=cls;return e}
  function tag(container,text,left){const t=elem('span','mtk-image-tag');t.textContent=text;t.style.left=left+'%';container.appendChild(t)}
  function mount(app,q,s,choices){
    const frames=window.MTK_QUIZ_FRAMES_V145;
    if(!frames?.portrait||!frames?.landscape||!app||!choices)return false;
    const prompt=app.querySelector('.prompt');if(!prompt)return false;
    const rest=[...app.children].filter(e=>e!==prompt&&e!==choices&&!e.matches('.eyebrow,h2,.mini'));
    const frame=elem('section','mtk-frame');frame.style.setProperty('--portrait-frame','url("'+frames.portrait+'")');frame.style.setProperty('--landscape-frame','url("'+frames.landscape+'")');
    frame.setAttribute('aria-label','Soru ekranı');
    const text=elem('div','mtk-question-region');text.appendChild(prompt);
    const visual=elem('div','mtk-visual-region');visual.setAttribute('aria-label','Soru görseli ve değişken etiketler');
    if(q?.visual?.type==='sis-turbini' && window.MTK_QUIZ_MEDIA_V145?.F03){
      const machine=elem('img','mtk-visual-image');machine.alt='Bir giriş, üç sis filtresi ve bir gözlem tüpünden oluşan filtre sistemi';machine.src=window.MTK_QUIZ_MEDIA_V145.F03;visual.appendChild(machine);
      const anchors=[15.5,35.3,51.5,67,86.5];
      (q.visual.values||[]).slice(0,5).forEach((v,i)=>tag(visual,v,anchors[i]));
    }
    const extra=elem('section','mtk-feedback-overlay');rest.forEach(x=>extra.appendChild(x));
    frame.append(text,visual,choices);if(extra.children.length)frame.appendChild(extra);
    app.replaceChildren(frame);document.body.classList.add('mtk-approved-active');
    if(!document.querySelector('#mtk-approved-style-v145')){const s=elem('style');s.id='mtk-approved-style-v145';s.textContent=style;document.head.appendChild(s)}
    return true;
  }
  function reset(){document.body.classList.remove('mtk-approved-active')}
  window.MTKApprovedQuizV145=Object.freeze({mount,reset});
})();
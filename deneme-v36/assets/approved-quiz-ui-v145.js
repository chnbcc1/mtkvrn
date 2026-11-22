/* Matematik Evreni v145: approved portrait/landscape frame art + dynamic quiz overlays. */
(function(){
  'use strict';
  const style = `
  /* Hint and solution cover all four answers. Choices remain underneath; question stays visible. */
  .mtk-frame.mtk-help-mode .choiceGrid>.choice{pointer-events:none!important}
  .mtk-frame.mtk-help-mode .mtk-answer-help-card{
    position:absolute!important;z-index:40!important;left:20%!important;top:64%!important;
    width:77%!important;height:29%!important;max-height:none!important;box-sizing:border-box;
    overflow-y:auto!important;overscroll-behavior:contain;background:#fff2d7!important;
    border:2px solid #b18d58!important;border-radius:14px!important;padding:12px!important;
    margin:0!important;color:#352a1e!important;box-shadow:0 4px 18px #38241255!important;
  }
  .mtk-frame.mtk-answer-hint-closed .mtk-answer-help-card{
    position:absolute!important;z-index:20!important;left:21%!important;top:62%!important;
    width:auto!important;height:auto!important;max-height:none!important;overflow:visible!important;
    background:transparent!important;border:0!important;padding:0!important;margin:0!important;box-shadow:none!important;
  }
  .mtk-frame .mtk-answer-help-card .btnRow{position:static!important;background:transparent!important;padding:4px 0!important;margin-top:8px!important}
  @media(orientation:landscape){
    .mtk-frame.mtk-help-mode .mtk-answer-help-card{left:15%!important;top:64%!important;width:82%!important;height:31%!important}
    .mtk-frame.mtk-answer-hint-closed .mtk-answer-help-card{left:16%!important;top:59%!important;width:auto!important;height:auto!important}
  }

  /* Keep the explanation scroll independent of always-visible controls. */
  .mtk-frame.mtk-help-mode .mtk-answer-help-card{display:flex!important;flex-direction:column!important;gap:8px!important;overflow:hidden!important}
  .mtk-frame .mtk-answer-help-card .mtk-help-body{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;font-size:clamp(12px,2.45cqw,19px);line-height:1.43}
  .mtk-frame .mtk-answer-help-card .mtk-help-body .feedback{margin:0!important;padding:8px!important;line-height:1.43!important}
  .mtk-frame .mtk-answer-help-card .mtk-help-body .solution{margin:8px 0!important;padding:9px!important;line-height:1.48!important}
  .mtk-frame .mtk-answer-help-card .mtk-help-body .mtk-teaching-step{
    margin:9px 0!important;padding:9px 10px!important;line-height:1.5!important;
    border-left:3px solid #a98955!important;border-radius:7px!important;
    background:#fff8e9!important;color:#352c20!important;font-size:inherit!important;
    overflow-wrap:break-word!important;
  }
  .mtk-frame .mtk-answer-help-card .mtk-help-body .feedback.wrong{
    margin:0 0 8px!important;padding:8px 10px!important;
    font-weight:850!important;background:#f7e3be!important;border-radius:9px!important;
    line-height:1.28!important;
  }
  .mtk-frame .mtk-answer-help-card .mtk-help-foot{flex:0 0 auto;border-top:1px solid #c0a779;padding-top:8px;min-height:44px}
  .mtk-frame .mtk-answer-help-card .mtk-help-foot .btnRow{display:flex!important;flex-wrap:wrap!important;justify-content:space-evenly!important;gap:8px!important;margin:0!important;padding:0!important}
  .mtk-frame .mtk-answer-help-card .mtk-help-foot .btn{flex:1 1 41%;min-width:0;white-space:normal;text-align:center;min-height:39px!important;font-size:clamp(12px,2.4cqw,18px)!important}
  .mtk-frame .mtk-inline-hint-trigger{position:relative!important;inset:auto!important;width:auto!important;height:auto!important;max-height:none!important;overflow:visible!important;background:transparent!important;border:0!important;box-shadow:none!important;margin:0!important;padding:0!important}
  .mtk-frame .mtk-inline-hint-trigger .btnRow{position:relative!important;margin:0!important;padding:0!important;display:flex!important;justify-content:flex-start!important}
  .mtk-frame .mtk-inline-hint-trigger .btn{min-height:36px!important;padding:5px 11px!important}
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

  /* v146: never clip the first character against the illustrated inner border. */
  .mtk-frame .mtk-question-region{left:28.8%!important;top:12.2%!important;width:62%!important;height:24.5%!important}
  .mtk-frame .mtk-question-region>.prompt{padding:2px 5px 4px 2px!important;box-sizing:border-box!important;overflow-wrap:break-word!important;word-break:normal!important;scrollbar-width:thin}
  .mtk-frame .mtk-visual-region{left:25.7%!important;top:38.3%!important;width:65.2%!important;height:23.2%!important;position:absolute!important;overflow:hidden!important}
  /* Every feedback pane belongs to the illustration region, never the answer grid. */
  .mtk-frame .mtk-visual-region .mtk-feedback-overlay{
    position:absolute!important;inset:auto 0 0!important;z-index:7!important;width:100%!important;
    max-height:93%!important;overflow:auto!important;background:#fff5e8f7!important;
    box-shadow:0 2px 14px #4a312945!important;border:2px solid #bf9d6b!important;border-radius:12px!important;
    padding:10px 12px!important;font-size:clamp(11px,2cqw,17px)!important
  }
  .mtk-frame .mtk-visual-region .mtk-feedback-overlay:has(.solution){inset:0!important;max-height:100%!important;padding:40px 12px 12px!important}
  .mtk-frame .mtk-visual-region .mtk-feedback-overlay[hidden]{display:none!important}
  .mtk-frame .mtk-visual-region .mtk-feedback-overlay .feedback{margin:0!important;padding:7px!important;line-height:1.35!important;font-size:inherit!important}
  .mtk-frame .mtk-visual-region .mtk-feedback-overlay .solution{font-size:inherit!important;margin:7px 0!important;padding:9px!important;line-height:1.45!important}
  .mtk-frame .mtk-visual-region .mtk-feedback-overlay .btnRow{flex-wrap:wrap!important}
  .mtk-frame .mtk-feedback-toggle{position:absolute;right:5px;top:5px;z-index:9;min-height:30px;max-width:66%;
    border:1px solid #b39254;border-radius:9px;background:#fce9c5;color:#46311b;font-size:clamp(10px,1.5cqw,14px);
    font-weight:800;padding:4px 8px;box-shadow:0 2px 6px #2d221733;cursor:pointer}
  .mtk-frame .mtk-vine-scene{height:100%;display:grid;grid-template-rows:auto 1fr;gap:3px;place-items:center;color:#245745}
  .mtk-frame .mtk-vine-title{font-weight:850;text-align:center;font-size:clamp(12px,2.2cqw,19px)}
  .mtk-frame .mtk-vine-track{display:flex;align-items:center;justify-content:space-evenly;gap:3px;width:100%}
  .mtk-frame .mtk-vine-step{min-width:0;flex:1;min-height:40%;border:1.5px solid #b99a5f;border-radius:12px;background:linear-gradient(#fffaf0,#f1e5b9);display:grid;place-items:center;gap:2px;padding:5px;text-align:center;font-weight:900;font-size:clamp(11px,2.05cqw,19px)}
  .mtk-frame .mtk-vine-emoji{font-size:clamp(20px,5cqw,51px);line-height:1}
  .mtk-frame .mtk-vine-arrow{color:#6c8737;font-size:clamp(14px,3cqw,26px);font-weight:900}
  .mtk-frame .mtk-info-scene{display:grid;height:100%;place-content:center;justify-items:center;gap:7px;color:#2b6047;text-align:center}
  .mtk-frame .mtk-info-icon{font-size:clamp(34px,8cqw,70px);line-height:1.05}
  .mtk-frame .mtk-info-title{font-size:clamp(13px,2.3cqw,21px);font-weight:850}
  .mtk-frame .mtk-info-values{display:flex;flex-wrap:wrap;justify-content:center;gap:5px}
  .mtk-frame .mtk-info-values span{padding:3px 7px;background:#fff8e4;border:1px solid #c6a775;border-radius:10px;font-weight:800;font-size:clamp(11px,1.75cqw,18px)}
  @media(orientation:landscape){
    .mtk-frame .mtk-question-region{left:17.7%!important;top:15.4%!important;width:37.7%!important;height:44.5%!important}
    .mtk-frame .mtk-visual-region{left:57.2%!important;top:15.1%!important;width:38.8%!important;height:45.2%!important}
    .mtk-frame .mtk-vine-title{font-size:clamp(11px,1.7cqw,23px)}
    .mtk-frame .mtk-vine-step{font-size:clamp(10px,1.4cqw,19px)}
    .mtk-frame .mtk-vine-emoji{font-size:clamp(17px,3.5cqw,48px)}
    .mtk-frame .mtk-visual-region .mtk-feedback-overlay{font-size:clamp(11px,1.5cqw,17px)!important}
  }
  
  /* v147: show exact ZIP-pack data as readable movable labels, never on the approved artwork. */
  .mtk-frame .mtk-scene-labels{height:100%;overflow:auto;scrollbar-width:thin;display:grid;grid-template-rows:auto 1fr;gap:4px;color:#265744;padding:2px}
  .mtk-frame .mtk-scene-heading{font-size:clamp(10px,1.85cqw,19px);text-align:center;font-weight:850}
  .mtk-frame .mtk-scene-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;align-content:center;overflow:auto}
  .mtk-frame .mtk-scene-chip{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;min-height:31px;padding:3px;border:1px solid #c4a368;border-radius:9px;background:#fff7e7e8;overflow-wrap:anywhere;text-align:center;line-height:1.15}
  .mtk-frame .mtk-scene-chip small{font-size:clamp(8px,1.18cqw,13px);font-weight:650;color:#58705c}
  .mtk-frame .mtk-scene-chip b{font-size:clamp(11px,2.1cqw,19px);font-weight:900;color:#1d4f39}
  .mtk-frame .mtk-matching-board{height:100%;overflow:auto;scrollbar-width:thin;display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:1px 2px;align-content:start;color:#274d3a}
  .mtk-frame .mtk-matching-col{display:grid;grid-template-rows:repeat(5,minmax(26px,auto));gap:3px;min-width:0}
  .mtk-frame .mtk-match-title{grid-column:1/-1;text-align:center;font-size:clamp(9px,1.6cqw,16px);font-weight:900}
  .mtk-frame .mtk-matching-col button{font:inherit;min-height:25px;min-width:0;overflow-wrap:anywhere;border:1.5px solid #b59256;border-radius:8px;background:#fff7dcf2;color:#234d36;padding:3px;font-weight:850;font-size:clamp(11px,2cqw,19px);cursor:pointer}
  .mtk-frame .mtk-matching-col button.selected{outline:3px solid #2486a0;outline-offset:-2px}
  .mtk-frame .mtk-matching-col button.paired{background:#dbf4d1;border-color:#32815e;color:#265036}
  .mtk-frame .mtk-match-message{grid-column:1/-1;text-align:center;font-weight:750;font-size:clamp(9px,1.55cqw,15px);line-height:1.2}
  .mtk-frame .mtk-matching-tip{grid-column:1/-1;font-size:clamp(9px,1.55cqw,15px);font-weight:800;text-align:center}
  .mtk-frame .choiceGrid>.choice.match-locked{opacity:.7!important;cursor:not-allowed!important}
  @media(orientation:landscape){
    .mtk-frame .mtk-scene-heading{font-size:clamp(12px,1.6cqw,19px)}
    .mtk-frame .mtk-scene-chip small{font-size:clamp(10px,1.2cqw,14px)}
    .mtk-frame .mtk-scene-chip b{font-size:clamp(12px,1.6cqw,20px)}
    .mtk-frame .mtk-matching-col{grid-template-rows:repeat(5,minmax(28px,auto))}
    .mtk-frame .mtk-matching-col button{font-size:clamp(12px,1.5cqw,22px);min-height:28px}
  }

  /* v148: F01/F02 3D objects stay unmarked; math is positioned as editable DOM. */
  .mtk-frame .mtk-research-object{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none}
  .mtk-frame .mtk-research-value{position:absolute;z-index:3;transform:translate(-50%,-50%);
    display:flex;align-items:center;justify-content:center;text-align:center;
    box-sizing:border-box;max-height:19%;overflow:hidden;color:#224b32;
    font-size:clamp(10px,2.15cqw,22px);font-weight:950;line-height:1.08;
    overflow-wrap:break-word;white-space:normal;text-shadow:0 1px 0 #fff8e3aa;
    pointer-events:none}
  .mtk-frame .mtk-research-value.small-plaque{font-size:clamp(8px,1.48cqw,15px);max-height:9%}
  .mtk-frame .mtk-research-value.long{font-size:clamp(9px,1.65cqw,17px)}
  @media(orientation:landscape){
    .mtk-frame .mtk-research-value{font-size:clamp(11px,1.48cqw,23px)}
    .mtk-frame .mtk-research-value.small-plaque{font-size:clamp(9px,1.15cqw,17px)}
    .mtk-frame .mtk-research-value.long{font-size:clamp(10px,1.24cqw,18px)}
  }
  `;
  function elem(tag,cls){const e=document.createElement(tag);if(cls)e.className=cls;return e}
  function tag(container,text,left){const t=elem('span','mtk-image-tag');t.textContent=text;t.style.left=left+'%';container.appendChild(t)}
  function appendText(parent,cls,str){const n=elem('span',cls);n.textContent=String(str);parent.appendChild(n);return n}
  function illustrate(visual,q,s){
    const description=String(s?.prompt||q?.prompt||'');
    const id=String(q?.obstacleId||'');
    const sprout=description.match(/(\d+)\s+filiz\s+(\d+)\s+kez\s+iki\s+katına\s+çıkıyor,\s*sonra\s+(\d+)\s+filiz\s+kuruyor/i);
    if(id==='F01'&&sprout){
      const [,start,times,dry]=sprout;
      const art=elem('div','mtk-vine-scene');
      appendText(art,'mtk-vine-title','Sarmaşıkların gelişimi');
      const row=elem('div','mtk-vine-track');
      const superDigits={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
      const exponent=String(times).split('').map(x=>superDigits[x]||x).join('');
      const steps=[[start+' filiz','🌱'],['2'+exponent+' kat','🌿'],[dry+' filiz kurur','🍂']];
      steps.forEach(([caption,emoji],i)=>{
        if(i)appendText(row,'mtk-vine-arrow','→');
        const block=elem('div','mtk-vine-step');
        appendText(block,'mtk-vine-emoji',emoji);
        appendText(block,'',caption);row.appendChild(block);
      });
      art.appendChild(row);visual.appendChild(art);return;
    }
    const originalLabels=Array.isArray(q?.visual?.labels)?q.visual.labels:[];
    if(originalLabels.length){
      const scene=elem('div','mtk-scene-labels');
      const icons={F01:'🌿',F02:'🪨',F03:'⚙️',F04:'💡',F05:'💎',F06:'🍄',F07:'⬜',F08:'🌉',F09:'🪢',F10:'📐',F11:'💦',F12:'🛤️',F13:'🧊',F14:'⚙️',F15:'🔮',F16:'🔢',F17:'✨',F18:'🧭',F19:'🪨',F20:'🔐',F21:'🧩'};
      appendText(scene,'mtk-scene-heading',(icons[id]||'🧩')+' '+(q?.topic||'Sorudaki matematiksel bilgiler'));
      const grid=elem('div','mtk-scene-grid');
      originalLabels.forEach(({anchor,value})=>{
        const chip=elem('div','mtk-scene-chip');
        const lbl=elem('small');lbl.textContent=String(anchor||'').replaceAll('_',' ');chip.appendChild(lbl);
        const val=elem('b');val.textContent=String(value||'');chip.appendChild(val);
        grid.appendChild(chip);
      });
      scene.appendChild(grid);visual.appendChild(scene);return;
    }
    const names={F01:['🌿','Sarmaşık duvarı'],F02:['🪨','Işıklı basamaklar'],F03:['⚙️','Sis türbini'],F04:['💡','Işık geçidi'],F05:['💎','Güç kristalleri']};
    const [emoji,title]=names[id]||['🧩','Sorudaki bilgiler'];
    const scene=elem('div','mtk-info-scene');
    appendText(scene,'mtk-info-icon',emoji);appendText(scene,'mtk-info-title',title);
    const vals=[...description.matchAll(/(?:\d+\s*[×÷+-]\s*)?\d+(?:\^\(?[−-]?\d+\)?|[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)?(?:\/\d+)?/g)].map(x=>x[0].trim()).filter(Boolean).slice(0,4);
    if(vals.length){const chips=elem('div','mtk-info-values');vals.forEach(v=>appendText(chips,'',v));scene.appendChild(chips)}
    visual.appendChild(scene);
  }

  /* Named semantic anchors have priority; every unknown anchor receives a free plaque. */
  function renderResearchObject(visual,q){
    const id=String(q?.obstacleId||"");
    if(id!=="F01"&&id!=="F02")return false;
    const data=window.MTK_RESEARCH_OBJECTS_V148?.[id];
    if(typeof data!=="string"||!data.startsWith("data:image/webp;base64,"))return false;
    const art=elem("img","mtk-research-object");art.src=data;art.alt=id==="F01"?
      "Sarmaşıklarla kaplı taş duvar; üç büyük ve iki küçük boş bilgi levhası":
      "Dört ışıklı taş basamak ve boş taş enerji levhaları";
    visual.appendChild(art);
    const entries=Array.isArray(q?.visual?.labels)?q.visual.labels:[];
    /* Fractions/powers are source-supplied data. Never calculate or bake them into the image. */
    const plaques=id==="F01"?
      [{x:23.6,y:47,w:27},{x:50,y:39,w:32},{x:77.5,y:47,w:27},{x:33.2,y:69,w:12,mini:true},{x:71.6,y:69,w:12,mini:true}]:
      [{x:50,y:76,w:77},{x:50,y:63,w:73},{x:50,y:51,w:67},{x:50,y:38,w:60},{x:50,y:21,w:66}];
    const used=new Set();
    function choose(i,anchor){
      const a=String(anchor||"").toLocaleLowerCase("tr").replaceAll("_"," ");
      let slot=-1;
      if(id==="F01"){
        if(/sol.*(büyüme|korunma|kopan)/.test(a))slot=3;
        else if(/sağ.*(büyüme|korunma|kopan)/.test(a))slot=4;
        else if(/sol|ilk dal|sabah/.test(a))slot=0;
        else if(/sağ/.test(a))slot=2;
        else if(/toplam|ortak|sayaç|gün|bugün|geçit/.test(a))slot=1;
      }else{
        if(/sayaç|çalışma oran|basamak sayısı/.test(a))slot=4;
        else if(/üst basamak|son basamak|basamak 4/.test(a))slot=3;
        else if(/orta basamak|basamak 3/.test(a))slot=2;
        else if(/basamak 2|kapı tüketim/.test(a))slot=1;
        else if(/ilk|giriş|alt basamak|basamak 1/.test(a))slot=0;
      }
      const priority=id==="F01"?[0,2,1,3,4]:[0,1,2,3,4];
      if(slot<0||used.has(slot))slot=priority.find(n=>!used.has(n))??-1;
      if(slot>=0)used.add(slot);
      return slot;
    }
    const countItem=id==="F02"?entries.find(e=>/basamak[_ ]sayısı/i.test(String(e.anchor||""))):null;
    const perStep=id==="F02"?entries.find(e=>/her[_ ]basamak/i.test(String(e.anchor||""))):null;
    if(countItem&&perStep){
      const raw=Number(String(countItem.value).replace(/[^0-9]/g,""));
      const count=Number.isFinite(raw)?Math.max(1,Math.min(4,raw)):1;
      const heading=plaques[4],v=elem("span","mtk-research-value");
      v.style.left=heading.x+"%";v.style.top=heading.y+"%";v.style.width=heading.w+"%";
      v.textContent=String(countItem.value)+" basamak";v.title=String(countItem.anchor);visual.appendChild(v);
      for(let i=0;i<count;i++){
        const p=plaques[i],n=elem("span","mtk-research-value");
        n.style.left=p.x+"%";n.style.top=p.y+"%";n.style.width=p.w+"%";
        n.textContent=String(perStep.value);n.title="Basamak "+(i+1);visual.appendChild(n);
      }
      
      return true;
    }
    for(let i=0;i<entries.length;i++){
      const item=entries[i],n=choose(i,item.anchor);
      if(n<0)continue;
      const p=plaques[n],label=elem("span","mtk-research-value"+(p.mini?" small-plaque":"")+(String(item.value||"").length>11?" long":""));
      label.style.left=p.x+"%";label.style.top=p.y+"%";label.style.width=p.w+"%";
      label.textContent=String(item.value??"");label.title=String(item.anchor||"");
      label.setAttribute("aria-label",String(item.anchor||"")+" "+String(item.value??""));
      visual.appendChild(label);
    }
    
    return true;
  }
  function matchingBoard(visual,q,choices,run,save){
    const data=q?.interaction;
    if(data?.kind!=='matching_unmatched')return false;
    const state=run?(run.matchingById||(run.matchingById={})):null;
    const current=state?(state[q.id]||(state[q.id]={pairs:[]})):{pairs:[]};
    const expected=new Map((data.pairs||[]).map(p=>[p.radical,p.exponent]));
    const board=elem('div','mtk-matching-board');
    const msg=elem('div','mtk-match-message');
    const title=elem('div','mtk-matching-tip');
    const rootCol=elem('div','mtk-matching-col'),expCol=elem('div','mtk-matching-col');
    const matched=()=>new Map(current.pairs||[]);
    let selected=null;
    const rootButtons=[],expButtons=[];
    (data.radicalItems||[]).forEach(v=>{
      const b=elem('button');b.type='button';b.textContent=v;b.setAttribute('aria-label','Köklü taş '+v);
      b.addEventListener('click',()=>{if(matched().has(v))return;selected=selected===v?null:v;paint()});
      rootCol.appendChild(b);rootButtons.push([v,b]);
    });
    (data.exponentItems||[]).forEach(v=>{
      const b=elem('button');b.type='button';b.textContent=v;b.setAttribute('aria-label','Üslü taş '+v);
      b.addEventListener('click',()=>{
        if(!selected){msg.textContent='Önce soldaki bir köklü taşa dokun.';return}
        const used=new Set(matched().values());if(used.has(v))return;
        if(expected.get(selected)===v){
          current.pairs=[...(current.pairs||[]),[selected,v]];selected=null;
          if(typeof save==='function')save();msg.textContent='Doğru eşleşme!';paint();
        }else{msg.textContent='Bu iki taş eşdeğer değil. Başka bir taş dene.';paint()}
      });
      expCol.appendChild(b);expButtons.push([v,b]);
    });
    const header=elem('div','mtk-match-title');header.textContent='Köklü taşlar · Üslü taşlar';board.appendChild(header);
    board.append(rootCol,expCol,msg,title);visual.appendChild(board);
    function paint(){
      const m=matched(),used=new Set(m.values()),ready=m.size>=Number(data.requiredPairs||4);
      rootButtons.forEach(([v,b])=>{b.classList.toggle('paired',m.has(v));b.classList.toggle('selected',selected===v);b.disabled=m.has(v)});
      expButtons.forEach(([v,b])=>{b.classList.toggle('paired',used.has(v));b.disabled=used.has(v)});
      title.textContent=ready?'Dört çift bulundu. Açıkta kalan iki taşı seç.':m.size+'/4 doğru çift · Önce soldan, sonra sağdan taşı seç.';
      if(choices)for(const b of choices.children){
        if(!run?.stageCorrect&&!run?.revealed){
          b.disabled=!ready||b.classList.contains('wrongChoice');
          b.classList.toggle('match-locked',!ready);
        }
      }
    }
    paint();return true;
  }
  function mount(app,q,s,choices,run,save){
    const frames=window.MTK_QUIZ_FRAMES_V145;
    if(!frames?.portrait||!frames?.landscape||!app||!choices)return false;
    const prompt=app.querySelector('.prompt');if(!prompt)return false;
    const rest=[...app.children].filter(e=>e!==prompt&&e!==choices&&!e.matches('.eyebrow,h2,.mini'));
    const frame=elem('section','mtk-frame');const wrongHelp=!run?.stageCorrect&&Number(run?.wrong)>0;const helpOpen=wrongHelp&&run?.helpView!==false;frame.classList.toggle('mtk-help-mode',helpOpen);frame.classList.toggle('mtk-answer-hint-closed',wrongHelp&&!helpOpen);frame.style.setProperty('--portrait-frame','url("'+frames.portrait+'")');frame.style.setProperty('--landscape-frame','url("'+frames.landscape+'")');
    frame.setAttribute('aria-label','Soru ekranı');
    const text=elem('div','mtk-question-region');text.appendChild(prompt);
    const visual=elem('div','mtk-visual-region');visual.setAttribute('aria-label','Soru görseli ve değişken etiketler');
    if(!matchingBoard(visual,q,choices,run,save)){
      const isF03=q?.obstacleId==='F03'||q?.visual?.type==='sis-turbini';
      if(isF03 && window.MTK_QUIZ_MEDIA_V145?.F03){
        const machine=elem('img','mtk-visual-image');machine.alt='Bir giriş, üç sis filtresi ve bir gözlem tüpü';machine.src=window.MTK_QUIZ_MEDIA_V145.F03;
        visual.appendChild(machine);
        const labels=q?.visual?.labels||[];
        const direct=q?.visual?.values||[];
        const leftFor=(anchor,index)=>{
          const a=String(anchor||'').toLocaleLowerCase('tr');
          if(/giriş|türbin/.test(a))return 15.5;
          if(/birinci|filtre[_ ]?1/.test(a))return 35.3;
          if(/ikinci|filtre[_ ]?2/.test(a))return 51.5;
          if(/üçüncü|filtre[_ ]?3/.test(a))return 67;
          if(/gözlem|tüp|çıkış|dördüncü/.test(a))return 86.5;
          return [15.5,35.3,51.5,67,86.5][Math.min(index,4)];
        };
        if(labels.length)labels.slice(0,5).forEach((item,i)=>tag(visual,item.value,leftFor(item.anchor,i)));
        else direct.slice(0,5).forEach((value,i)=>tag(visual,value,[15.5,35.3,51.5,67,86.5][i]));
      }else if(q?.obstacleId==="F01"&&window.MTKF01ApprovedV159){ /* approved first obstacle unchanged */ }
      else if(q?.obstacleId==="F02"&&window.MTKF02ApprovedV165?.render(visual,q)){ /* approved second obstacle scene and live values */ }
      else if(!renderResearchObject(visual,q))illustrate(visual,q,s);
    }
    const extra=elem('section','mtk-feedback-overlay');rest.forEach(x=>extra.appendChild(x));
    frame.append(text,visual,choices);
    if(extra.children.length){
      if(wrongHelp&&helpOpen){
        extra.classList.add('mtk-answer-help-card');
        const body=elem('div','mtk-help-body'),foot=elem('div','mtk-help-foot');
        for(const part of [...extra.children]){
          if(part.classList.contains('btnRow'))foot.appendChild(part);
          else body.appendChild(part);
        }
        extra.append(body,foot);frame.appendChild(extra);
      }else if(wrongHelp){
        extra.classList.add('mtk-inline-hint-trigger');text.appendChild(extra);
      }else text.appendChild(extra);
    }
    app.replaceChildren(frame);document.body.classList.add('mtk-approved-active');
    if(!document.querySelector('#mtk-approved-style-v145')){const s=elem('style');s.id='mtk-approved-style-v145';s.textContent=style;document.head.appendChild(s)}
    if(q?.obstacleId==='F01')window.MTKF01ApprovedV159?.enhance(frame,q);
    if(q?.obstacleId==='F02')window.MTKF02ApprovedV165?.enhance(frame,q);
    // One layout owns ALL 21 obstacle screens, after approved scene/label mounts.
    window.MTKQuizUniversalV176?.apply(frame,q);
    return true;
  }
  function reset(){document.body.classList.remove('mtk-approved-active')}
  window.MTKApprovedQuizV145=Object.freeze({mount,reset});
})();
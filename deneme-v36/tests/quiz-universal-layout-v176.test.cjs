"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const universal=fs.readFileSync(path.join(root,"assets/quiz-universal-layout-v176.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const html=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
new vm.Script(universal);new vm.Script(ui);
assert.equal(bank.questions.length,630,"Approved source bank must remain at 630 records");
assert.equal(new Set(bank.obstacles.map(o=>o.id)).size,21);
for(const obstacle of bank.obstacles){
  assert.equal(bank.questions.filter(q=>q.obstacleId===obstacle.id).length,30,obstacle.id);
}
for(const q of bank.questions){
  assert(q.options.length===4&&q.options.includes(q.correctAnswer),q.id);
  assert.equal(q.visual?.bakedIntoImage,false,q.id+" must have DOM math values");
}
assert(html.includes('quiz-universal-layout-v176.js?v=179'),"Shared v179 equal-width action layout must load");
assert(html.indexOf('approved-quiz-ui-v145.js?v=176')<html.indexOf('quiz-universal-layout-v176.js?v=179'),"Global script loads after approved UI");
assert(ui.includes('window.MTKQuizUniversalV176?.apply(frame,q)'),"Global layout must mount for every obstacle");
assert(ui.includes('window.MTKF01ApprovedV159?.enhance(frame,q)'),"F01 approved art must remain");
assert(ui.includes('window.MTKF02ApprovedV165?.enhance(frame,q)'),"F02 approved art must remain");
assert(ui.includes('matchingBoard(visual,q,choices,run,save)'),"Touch matching must remain");
const appended=[];
const doc={
  getElementById:()=>null,
  createElement:name=>({
    tagName:name,children:[],className:"",dataset:{},textContent:"",
    setAttribute(k,v){this[k]=v},
    appendChild(node){this.children.push(node);return node},
    remove(){this.removed=true}
  }),
  head:{appendChild(node){appended.push(node)}}
};
const scope={window:{},document:doc};
vm.runInNewContext(universal,scope);
const controller=scope.window.MTKQuizUniversalV176;
assert(controller&&controller.version==="179");
const createFrame=({help=false,actions=false,obstacle="F03"}={})=>{
  const classes=new Set(help?["mtk-help-mode"]:[]);
  const scene={id:"approved-original-scene"};
  const visual={children:[],prepend(x){this.children.unshift(x)}};
  const row={tagName:"DIV",className:"btnRow",
    children:[{label:"Engeli aç · Ormana dön",handler:()=>42},{label:"Benzer soru çöz",handler:()=>43}],
    remove(){this.removed=true}
  };
  const extra={textContent:"",remove(){this.removed=true}};
  const frame={
    classList:{add(n){classes.add(n)},contains(n){return classes.has(n)}},dataset:{},
    children:[],querySelector(s){if(s===".mtk-visual-region")return visual;if(s===".f01-approved-landscape")return scene;return null},
    querySelectorAll(s){return actions?(s===".mtk-feedback-overlay .btnRow"?[row]:s===".mtk-feedback-overlay"?[extra]:[]):[]},
    appendChild(x){this.children.push(x);return x}
  };
  const q={obstacleId:obstacle,visual:{sceneId:obstacle.toLowerCase()+"-research-3d"}};
  return {frame,q,visual,scene,row,extra,classes};
};
for(const obstacle of bank.obstacles){
  const x=createFrame({obstacle:obstacle.id});
  assert.equal(controller.apply(x.frame,x.q),true,obstacle.id+" did not enter universal geometry");
  assert(x.classes.has("mtk-universal-v176"),obstacle.id+" not globally marked");
}
const f01=createFrame({obstacle:"F01"});
assert.equal(controller.apply(f01.frame,f01.q),true);
assert.equal(f01.visual.children[0],f01.scene,"The exact approved F01 art must be in the visual slot");
const c=createFrame({actions:true});
assert.equal(controller.apply(c.frame,c.q),true);
const footer=c.frame.children.find(x=>x.className==="mtk-universal-actions");
assert(footer&&footer.children.length===2,"Exactly two completion controls must occupy a two-column footer");
assert(footer.children[0]===c.row.children[0]&&footer.children[1]===c.row.children[1],"Keep the exact original buttons, not new substitutes");
assert(footer.children[0].handler()===42&&footer.children[1].handler()===43,"Both existing button actions must still work");
assert(c.row.removed,"Old wrapper must be removed so it cannot squeeze two buttons into one column");
assert(c.extra.removed,"Empty overlay after controls relocated must be removed");
const h=createFrame({actions:true,help:true});
assert.equal(controller.apply(h.frame,h.q),true);
assert(!h.frame.children.some(x=>x.className==="mtk-universal-actions"),"Open help keeps its own accessible footer");
const css=appended[0]?.textContent||"";
assert(css.length>1000,"No universal stylesheet was mounted");
assert(css.includes("width:100%!important;height:50%!important"),"Portrait visual slot is not exactly top 50%");
assert(css.includes("width:50%!important;height:100%!important"),"Landscape visual slot is not exactly left 50%");
assert(css.includes("object-fit:contain!important"),"Original scene must be uniformly scaled");
assert(!/object-fit:(?:cover|fill)!important/.test(css),"Never crop or stretch approved art");
assert(css.includes("top:92.3%!important")&&css.includes("top:91%!important"),"Controls must be below answers on both orientations");
assert(css.includes("top:77.2%!important")&&css.includes("top:62%!important"),"Choices should have a separate grid");
assert(css.includes("height:25.1%!important")&&css.includes("height:56%!important"),"Text keeps its own touch-scrolling viewport");
assert(css.includes("touch-action:pan-y!important"),"Long problems must scroll on iPhone");
assert(css.includes("v179: every obstacle, every question."),"Shared action layout v179 must be active");
assert(css.includes("grid-template-columns:repeat(2,minmax(0,1fr))!important"),"Actions must be two equal-width columns");
assert(css.includes("column-gap:3.6%!important")&&css.includes("column-gap:4%!important"),"Action gutter must match the choice grid in both orientations");
assert(css.includes("width:100%!important;height:100%!important"),"Each action must fill its entire option-sized grid cell");
assert(css.includes(".mtk-help-foot>.btnRow"),"Expanded hint footer must also use equally wide buttons");
assert(css.includes("background:#fff8e9!important"),"Subdued parchment action style must be readable");
const f01source=fs.readFileSync(path.join(root,"assets/f01-approved-v159.js"),"utf8");
const f02source=fs.readFileSync(path.join(root,"assets/f02-approved-v165.js"),"utf8");
assert(f01source.includes('f01-approved-scene-v159.webp'),"Keep user-approved F01 Erdem/Çiko");
assert(f02source.includes('f02-energy-stairs-v174.avif'),"Keep user-approved F02 Erdem/Çiko");
assert(!f02source.includes("background-image:url("),"F02 duplicate background must not return");
console.log("PASS universal v179: 21 obstacles and 630 approved questions, true 50% visual slots, dynamic values, scroll, accessible bottom buttons.");

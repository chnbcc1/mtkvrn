"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/research-layout-v157.js"),"utf8");
const css=fs.readFileSync(path.join(root,"assets/research-layout-v157.css"),"utf8");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
const frames=fs.readFileSync(path.join(root,"assets/quiz-approved-frames-v145.js"),"utf8");
new vm.Script(source);
assert.equal(bank.questions.length,630);
assert.equal(bank.obstacles.length,21);
assert(quiz.includes('research-layout-v157.css?v=157b'));
assert(quiz.includes('research-layout-v157.js?v=157'));
assert(quiz.includes('forest-questions-v147.json?v=147'));
assert(css.includes('grid-template-columns:minmax(0,1fr) minmax(0,1fr)'),"Landscape must split into equal halves");
assert(css.includes('grid-template-rows:minmax(0,54fr) minmax(0,46fr)'),"Portrait image above text and options");
assert(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),"A–D must remain a symmetrical 2x2 grid");
assert(css.includes('clip-path:polygon('),"Reference crops should not show rectangular old backgrounds");
assert(frames.includes('"portrait"')&&frames.includes('"landscape"'));
assert(source.includes('window.MTK_QUIZ_FRAMES_V145')&&source.includes('character("mtk-v157-erdem",frames.portrait)'));
assert(source.includes('character("mtk-v157-chiko",frames.portrait)'));
assert(!source.includes("image_gen"),"Do not redraw the approved characters");
class E{
 constructor(tag){this.tagName=tag;this.className="";this.textContent="";this.children=[];this.style={};this.attrs={};this.classList={add:x=>this.className+=(this.className?" ":"")+x};}
 append(...elems){for(const el of elems)this.children.push(el);}
 appendChild(x){this.append(x);return x}
 replaceChildren(...c){this.children=c}
 setAttribute(k,v){this.attrs[k]=v}
 matches(pattern){return pattern.split(",").some(x=>x.trim()==="."+this.className.split(" ").find(y=>y===x.trim().slice(1)))}
 querySelector(sel){return this.children.find(x=>x.className.split(" ").includes(sel.slice(1)))||null}
}
const window={MTK_QUIZ_FRAMES_V145:{portrait:"approved-portrait-exact",landscape:"approved-landscape-exact"},MTK_QUIZ_MEDIA_V145:{F03:"approved-F03-object"}};
let fallback=0,reset=0;
window.MTKApprovedQuizV145={mount(){fallback++;return true},reset(){reset++}};
const document={createElement:t=>new E(t),body:{classList:{add(){}}}};
vm.runInNewContext(source,{window,document,console});
const q=bank.questions.find(x=>x.id==="F03-O-01");
assert(q?.visual?.sceneId==="f03-research-3d"&&q.visual.bakedIntoImage===false);
const app=new E("div"),prompt=new E("div"),choices=new E("div");
prompt.className="prompt";choices.className="choiceGrid";app.append(prompt,choices);
assert.equal(window.MTKApprovedQuizV145.mount(app,q,{},choices),true);
assert.equal(fallback,0,"F03 must use the new research pilot");
const frame=app.children[0];assert(frame.className.includes("mtk-v157"));
const body=frame.children[1],scene=body.children[0],paper=body.children[1];
assert(scene.className==="mtk-v157-scene"&&paper.className==="mtk-v157-paper");
const actors=scene.children.filter(x=>x.className.includes("mtk-v157-actor"));
assert.equal(actors.length,2);
assert(actors.every(x=>x.children[0].src==="approved-portrait-exact"),"Both characters must use unchanged approved reference pixels");
assert.equal(scene.children.filter(x=>x.className==="mtk-v157-label").length,q.visual.labels.length);
assert.equal(paper.children.find(x=>x.className==="mtk-v157-question").children[0],prompt,"Question stays a live DOM node");
assert.equal(paper.children.find(x=>x.className==="choiceGrid mtk-v157-choices"),choices,"Original answer handlers must be preserved");
const qF01=bank.questions.find(x=>x.obstacleId==="F01");
assert.equal(window.MTKApprovedQuizV145.mount(new E("div"),qF01,{},new E("div")),true);
assert.equal(fallback,1,"Other 20 obstacles must remain untouched in the pilot");
window.MTKApprovedQuizV145.reset();assert.equal(reset,1);
console.log("PASS v157: original Erdem/Ciko pixels, exact landscape halves, portrait stack, dynamic F03 labels, options and 630-question bank unchanged.");

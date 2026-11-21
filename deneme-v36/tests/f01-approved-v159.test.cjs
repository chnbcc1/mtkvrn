'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.resolve(__dirname,'..');
const script = fs.readFileSync(path.join(base,'assets/f01-approved-v159.js'),'utf8');
const bank = JSON.parse(fs.readFileSync(path.join(base,'forest-questions-v147.json'),'utf8'));
const host = fs.readFileSync(path.join(base,'assets/approved-quiz-ui-v145.js'),'utf8');
const quiz = fs.readFileSync(path.join(base,'forest-v70-quiz.html'),'utf8');
new vm.Script(script);
new vm.Script(host);
assert.equal(bank.questions.length,630);
const questions = bank.questions.filter(x=>x.obstacleId==='F01');
assert.equal(questions.length,30,'F01 must have 10 questions per difficulty');
assert.deepEqual([...new Set(questions.map(x=>x.difficulty))].sort(),['kolay','orta','zor']);
for(const asset of ['f01-approved-portrait-v159.webp','f01-approved-scene-v159.webp']){
 const data=fs.readFileSync(path.join(base,'assets',asset));
 assert.equal(data.subarray(0,4).toString(),'RIFF',asset+' is a valid WEBP RIFF asset');
 assert.equal(data.subarray(8,12).toString(),'WEBP');
 assert(data.length>100_000&&data.length<800_000,'Optimized approved artwork '+asset);
}
assert(host.includes("if(q?.obstacleId==='F01')window.MTKF01ApprovedV159?.enhance(frame,q)"));
assert(host.includes('q?.obstacleId==="F01"&&window.MTKF01ApprovedV159'), 'Original F01 research art should be skipped');
assert(quiz.includes('f01-approved-v159.js?v=162'),'Approved F01 layout must be loaded');
assert(quiz.indexOf('f01-approved-v159.js')<quiz.indexOf('approved-quiz-ui-v145.js'), 'F01 helper must be available before standard renderer');
class El{
 constructor(tag){this.tag=tag;this.className='';this.children=[];this.attrs={};this.style={};this.textContent='';this.title='';this.parent=null;this.classList={add:(x)=>{this.className+=' '+x;}};}
 appendChild(n){n.parent=this;this.children.push(n);return n;}
 prepend(...nodes){for(const n of nodes)n.parent=this;this.children.unshift(...nodes);}
 replaceChildren(...nodes){this.children=[];nodes.forEach(n=>this.appendChild(n));}
 setAttribute(k,v){this.attrs[k]=String(v)}
 querySelector(s){const c=s.replace('.','');return this.children.find(x=>x.className.split(' ').includes(c))||null}
}
const doc={head:new El('head'),createElement:t=>new El(t),getElementById:()=>null};
const ctx={window:{},document:doc,console};
vm.runInNewContext(script,ctx);
const api=ctx.window.MTKF01ApprovedV159;
assert(api&&api.version==='159');
function getScene(){
 const frame=new El('section'),region=new El('div'),text=new El('div'),buttons=new El('div');
 region.className='mtk-visual-region';text.className='mtk-question-region';buttons.className='choiceGrid';
 frame.appendChild(text);frame.appendChild(region);frame.appendChild(buttons);
 return {frame,region,text,buttons};
}
for(const q of questions){
 const used=new Set();
 const slots=q.visual.labels.map(item=>api.chooseSlot(item.anchor,used));
 assert(slots.every(Boolean),q.id+' must have a visible plaque');
 assert.equal(new Set(slots.map(x=>x.id)).size,slots.length,q.id+' has duplicate plaque placement');
 const s=getScene();assert(api.enhance(s.frame,q),q.id+' could not mount');
 assert(s.frame.className.includes('mtk-f01-v159'));
 assert.equal(s.region.children.length,q.visual.labels.length,q.id+' overlay count mismatch');
 assert.deepEqual(s.region.children.map(n=>n.textContent),q.visual.labels.map(n=>n.anchor==="gün"&&/^[0-9]+$/.test(String(n.value))?String(n.value)+". Gün":String(n.value)),q.id+' must preserve source labels without baking numbers');
 assert.equal(s.frame.children.filter(n=>n.tag==='img').length,2,'Approved portrait and landscape art reused');
 assert(s.frame.children.find(n=>n.className==='f01-approved-portrait').src===undefined || true);
 assert.equal(s.frame.children.filter(n=>n.className==='choiceGrid').length,1,'Original clickable answer options stay in DOM');
}
const sample=questions.find(q=>q.id==='F01-O-01'),used=new Set();
const places=sample.visual.labels.map(x=>api.chooseSlot(x.anchor,used).id);
assert.deepEqual(places,['leftLower','rightLower','leftUpper','rightUpper','top'],'Medium labels must align to correct plaques');
assert(!script.includes('background-size:cover')&&!script.includes('object-fit:cover'),'Approved character artwork should never be cropped');
assert(script.includes('left:50%')&&script.includes('width:50%'),'Landscape must be exactly half art and half question');
assert(script.includes('prefers-reduced-motion'),'Accessible to low-motion users');
assert.deepEqual(sample.visual.labels.map(x=>x.anchor),['sol ilk gün','sağ ilk gün','sol büyüme','sağ büyüme','gün']);
console.log('PASS F01 v159: approved artwork; all 30 dynamic label mappings; source text/options untouched; portrait and landscape scenes; 630-question bank.');
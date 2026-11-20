"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const src=fs.readFileSync(path.join(root,"assets/meaningful-research-v150.js"),"utf8");
const gui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const html=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
new vm.Script(src,{filename:"meaningful-research-v150.js"});
new vm.Script(gui,{filename:"approved-quiz-ui-v145.js"});
assert(html.includes("meaningful-research-v150.js?v=150"));
assert(html.indexOf("meaningful-research-v150.js")<html.indexOf("approved-quiz-ui-v145.js"));
assert.equal((gui.match(/MTKResearchMeaningfulV150\?\.mount\(visual,q,textRegion\)/g)||[]).length,2);
assert(gui.includes("renderResearchObject(visual,q,text)"));
assert.equal(bank.questions.length,630);
class FakeElement{
 constructor(tag){this.tagName=tag;this.style={};this.children=[];this.textContent="";this.title="";this.hidden=false;this.attrs={};this.listeners={};this.className="";this.set=new Set();this.classList={
   add:x=>this.set.add(x),toggle:(x,on)=>{if(on)this.set.add(x);else this.set.delete(x)}
 };}
 appendChild(x){this.children.push(x);return x}
 append(...xs){xs.forEach(x=>this.appendChild(x))}
 setAttribute(k,v){this.attrs[k]=String(v)}
 addEventListener(k,f){this.listeners[k]=f}
 querySelectorAll(selector){return this.children.flatMap(c=>[...(selector[0]==="."?c.className.includes(selector.slice(1))?[c]:[]:c.tagName===selector?[c]:[]),...c.querySelectorAll(selector)])}
}
const doc={head:new FakeElement("head"),createElement:t=>new FakeElement(t),createElementNS:(ns,t)=>new FakeElement(t),getElementById:()=>null};
const context={window:{},document:doc,console};
vm.runInNewContext(src,context);
const mount=context.window.MTKResearchMeaningfulV150.mount;
const findChild=(v,needle)=>v.children.find(c=>c.className.includes(needle));
const q=id=>bank.questions.find(x=>x.id===id);
const vine=new FakeElement("div"),vineText=new FakeElement("div");
assert(mount(vine,q("F01-O-04"),vineText));
const growth=findChild(vineText,"mtk-story-control");
assert(growth,"F01 learning control should live under text, NOT over the 3D art");
assert(!findChild(vine,"mtk-story-control"),"No teaching button may obscure 3D image");
const nav=growth.children[0],barRow=growth.children[1],status=nav.children[1];
assert(status.textContent.includes("1. gün"));
const bars=barRow.children.map(e=>e.children[1].children[0]);
assert(parseFloat(bars[0].style.width)>parseFloat(bars[1].style.width));
for(let i=0;i<3;i++)nav.children[2].listeners.click();
assert(status.textContent.includes("4. gün"));
assert(parseFloat(bars[0].style.width)<parseFloat(bars[1].style.width));
assert(!growth.textContent.includes("78"),"Do not reveal final answer");
nav.children[0].listeners.click();
assert(status.textContent.includes("3. gün"),"Backward navigation must work");
const stair=new FakeElement("div"),stairText=new FakeElement("div");
assert(mount(stair,q("F02-O-06"),stairText));
const energy=findChild(stairText,"mtk-story-control");
assert(energy&&!findChild(stair,"mtk-story-control"));
const energyNav=energy.children[0],energyStatus=energyNav.children[1];
assert(energyStatus.textContent.includes("Kaynaklar"));
energyNav.children[2].listeners.click();assert(energyStatus.textContent.includes("Birleşme"));
energyNav.children[2].listeners.click();assert(energyStatus.textContent.includes("Tüketim"));
assert(energy.children[1].children[1].textContent.includes("Turuncu"));
energyNav.children[0].listeners.click();assert(energyStatus.textContent.includes("Birleşme"));
const artPaths=stair.querySelectorAll("path");
assert.equal(artPaths.length,3);
assert(!energyStatus.textContent.includes("40"),"Leave the numeric answer to the learner");
assert.equal(bank.questions.filter(x=>["F01","F02"].includes(x.obstacleId)).length,60);
assert(bank.questions.every(x=>x.visual?.bakedIntoImage===false));
assert(src.includes("prefers-reduced-motion"),"Motion accessibility");
console.log("PASS v150: clean F01 growth and F02 energy controls beneath question text; original art and 630 approved questions preserved.");

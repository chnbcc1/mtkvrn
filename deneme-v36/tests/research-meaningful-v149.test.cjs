"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const script=fs.readFileSync(path.join(root,"assets/meaningful-research-v149.js"),"utf8");
const gui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const html=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
new vm.Script(script,{filename:"meaningful-research-v149.js"});
assert(html.includes("meaningful-research-v149.js?v=149"),"New interaction source must be loaded");
assert(html.indexOf("meaningful-research-v149.js")<html.indexOf("approved-quiz-ui-v145.js"),"Interaction should load before existing screen");
assert.equal((gui.match(/MTKResearchMeaningfulV149\?\.mount\(visual,q\)/g)||[]).length,2,"All object rendering paths need interaction");
assert.equal(bank.questions.length,630);
class FakeElement{
 constructor(tag){this.tagName=tag;this.style={};this.children=[];this.textContent="";this.title="";this.hidden=false;this.attrs={};this.listeners={};this.classes=new Set();this.className="";this.classList={
 add:(x)=>this.classes.add(x),toggle:(x,on)=>{if(on)this.classes.add(x);else this.classes.delete(x)}
 };}
 appendChild(x){this.children.push(x);return x}
 append(...xs){xs.forEach(x=>this.appendChild(x))}
 setAttribute(k,v){this.attrs[k]=String(v)}
 addEventListener(k,fn){this.listeners[k]=fn}
 querySelectorAll(tag){return this.children.flatMap(c=>[...(c.tagName===tag?[c]:[]),...c.querySelectorAll(tag)])}
 getAttribute(k){return this.attrs[k]}
}
const head=new FakeElement("head");
const doc={head,createElement:t=>new FakeElement(t),createElementNS:(ns,t)=>new FakeElement(t),getElementById:()=>null};
const sandbox={window:{},document:doc,console};
vm.runInNewContext(script,sandbox);
const mount=sandbox.window.MTKResearchMeaningfulV149.mount;
const get=id=>bank.questions.find(q=>q.id===id);
const find=(v,cls)=>v.children.find(c=>c.className.includes(cls));
const f01=get("F01-O-04");
assert(f01?.prompt.includes("4. günün sonunda")&&f01?.visual?.labels?.length===5);
const vines=new FakeElement("div");
assert(mount(vines,f01));
const panel=find(vines,"mtk-growth-panel");
assert(panel&&panel.listeners.click,"Vines need an active day control");
const caption=panel.children[0],bars=panel.children.slice(1,3).map(row=>row.children[1].children[0]);
assert(caption.textContent.includes("1. gün"),"Begin from the initial day");
const initial=[parseFloat(bars[0].style.width),parseFloat(bars[1].style.width)];
assert(initial[0]>initial[1],"First day 3 > 2");
panel.listeners.click();panel.listeners.click();panel.listeners.click();
assert(caption.textContent.includes("4. gün"));
const final=[parseFloat(bars[0].style.width),parseFloat(bars[1].style.width)];
assert(final[1]>final[0],"Fourth day proportional bars show 2×3³ exceeds 3×2³");
assert(!String(panel.textContent).includes("78"),"Do not give away the final sum");
panel.listeners.click();
assert(caption.textContent.includes("1. gün"),"Day interaction must cycle");
const f02=get("F02-O-06");
assert(f02?.prompt.includes("2⁵")&&f02?.visual?.labels?.length===3);
const stairs=new FakeElement("div");
assert(mount(stairs,f02));
const step=find(stairs,"mtk-step-guide");
assert(step&&step.listeners.click);
const phaseTitle=step.children[0];
assert(phaseTitle.textContent.includes("kaynakları"));
const barsF02=step.children[1].children;
assert.equal(barsF02.length,3);
const widths=barsF02.map(b=>parseFloat(b.children[0].style.width));
assert(widths[0]===100&&widths[1]===50&&widths[2]===25,"Energy bars must correctly represent 32:16:8");
step.listeners.click();assert(phaseTitle.textContent.includes("birleşir"));
step.listeners.click();assert(phaseTitle.textContent.includes("harcar"));
assert(!String(phaseTitle.textContent).includes("40"),"The remaining power must be calculated by the learner");
const all=bank.questions.filter(q=>["F01","F02"].includes(q.obstacleId));
assert.equal(all.length,60);
assert(all.every(q=>q.visual?.bakedIntoImage===false));
assert(script.includes("prefers-reduced-motion"),"Reduce-motion support is required");
console.log("PASS v149: F01 temporal growth and F02 source/consume energy interactions, unchanged 630-question bank and art.");

"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/f03-approved-v197.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const host=fs.readFileSync(path.join(root,"forest-v113-full.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
const art=fs.readFileSync(path.join(root,"assets/f03-sis-turbini-master-v197.avif"));
new vm.Script(source,{filename:"f03-approved-v197.js"});
const ctx={window:{},Object,String,Array};
vm.runInNewContext(source,ctx);
const api=ctx.window.MTKF03ApprovedV197;
assert.equal(typeof api?.plan,"function","F03 mapping must be exposed to tests");
assert.equal(typeof api?.enhance,"function","F03 must be mounted into real quiz");
assert(art.toString("ascii",4,12).startsWith("ftypavif"),"Use the user-approved optimized AVIF scene");
assert(art.length>100000&&art.length<190000,"Approved scene should keep high mobile quality without huge downloads");
const f03=bank.questions.filter(q=>q.obstacleId==="F03");
assert.equal(f03.length,30,"Exactly 30 approved F03 questions");
for(const level of ["kolay","orta","zor"])assert.equal(f03.filter(q=>q.difficulty===level).length,10,level+" question count");
assert(source.includes('const MASTER="./assets/f03-sis-turbini-master-v197.avif?v=197"'),"One master file only, not separate landscape art");
assert(!source.includes("f03-sis-turbini-landscape"),"Do not redraw the landscape scene");
assert(source.includes("aspect-ratio:1213 / 1297!important"),"Preserve aspect ratio with vertical-only crop");
assert(source.includes("overflow:hidden!important")&&source.includes("top:0!important"),"Vertical-only crop from source artwork");
assert(!source.includes("erdem-ciko-onayli"),"Leave Erdem and Çiko for a later reference-layer step");
assert(source.includes("e.textContent=item.value"),"Math numbers must be live text from the question, not baked into image");
assert(source.includes('img.onerror=()=>'),"A missing picture must not block the task");
assert(ui.includes('window.MTKF03ApprovedV197?.enhance(frame,q)'),"The real quiz must mount F03 after universal layout");
assert(ui.indexOf('MTKQuizUniversalV176?.apply(frame,q)')<ui.indexOf('MTKF03ApprovedV197?.enhance(frame,q)'),"Coordinates should be applied after frame geometry");
assert(quiz.includes('f03-approved-v197.js?v=197'),"The new scene script must load");
assert(host.includes("forest-v70-quiz.html?v=197"),"The game must load the current F03 quiz");
const bounds=api.PLAQUES;
assert(Object.keys(bounds).length>=12,"Support two entries, three filters, two observation pipes, four outlets");
const slots=new Set(Object.keys(bounds));
for(const q of f03){
 const data=q.visual?.labels||[],items=api.plan(q);
 assert.equal(items.length,data.length,q.id+" missing label");
 assert.equal(new Set(items.map(x=>x.slot)).size,items.length,q.id+" plaque collision");
 for(let i=0;i<items.length;i++){
  const x=items[i],y=data[i];
  assert(slots.has(x.slot),q.id+": invalid plaque");
  assert.equal(x.value,String(y.value),q.id+": changed mathematical data");
  assert.equal(x.anchor,String(y.anchor),q.id+": changed data anchor");
  assert(x.x-x.w/2>=0&&x.x+x.w/2<=1213,q.id+": outside horizontal image");
  assert(x.y-x.h/2>=0&&x.y+x.h/2<=1297,q.id+": outside vertical image");
  for(const screen of [{w:390,h:390},{w:422,h:390},{w:466,h:430},{w:350,h:315}]){
   const scale=screen.w/1213;
   assert((x.y+x.h/2)*scale<=screen.h+1,q.id+": "+x.slot+" cropped on "+screen.w+"x"+screen.h);
  }
 }
}
assert.equal(api.plan({obstacleId:"F02",visual:{labels:[]}}).length,0,"F02 should be unaffected");
assert.equal(bank.questions.length,630,"Original 630 questions remain unmodified");
console.log("PASS F03 v197: approved master picture, 30 questions across 3 levels, accurate distinct plaques, portrait/landscape visibility, no baked numbers or characters.");

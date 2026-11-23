"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),crypto=require("node:crypto");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"assets/f03-approved-v197.js"),"utf8");
const ui=fs.readFileSync(path.join(root,"assets/approved-quiz-ui-v145.js"),"utf8");
const quiz=fs.readFileSync(path.join(root,"forest-v70-quiz.html"),"utf8");
const host=fs.readFileSync(path.join(root,"forest-v113-full.html"),"utf8");
const bank=JSON.parse(fs.readFileSync(path.join(root,"forest-questions-v147.json"),"utf8"));
const art=fs.readFileSync(path.join(root,"assets/f03-five-plaques-v198.avif"));
const approvedCharacter=fs.readFileSync(path.join(root,"assets/erdem-ciko-onayli-v180.png"));
new vm.Script(source,{filename:"f03-approved-v197.js"});
const context={window:{},Object,String,Array};
vm.runInNewContext(source,context);
const api=context.window.MTKF03ApprovedV197;
assert.equal(typeof api?.enhance,"function","Actual F03 game mount must exist");
assert.equal(typeof api?.plan,"function","Pure question layout planner required");
assert.equal(api.source,"./assets/f03-five-plaques-v198.avif?v=198");
assert.equal(api.character,"./assets/erdem-ciko-onayli-v180.png?v=180");
assert(art.toString("ascii",4,12).startsWith("ftypavif"),"Use optimized approved five-plaque AVIF");
assert(art.length>90000 && art.length<200000,"Keep quality and reasonable mobile download");
assert.equal(crypto.createHash("sha256").update(approvedCharacter).digest("hex"),"b0e1a903b1bc0171785eebaa6b50a41900c7fa17f5d7d471509583ac4229eba5","Erdem–Çiko PNG must remain the exact approved source");
assert(source.includes("plane.appendChild(character)"),"Overlay original transparent character file, not AI redraw");
assert(source.includes("object-fit:contain!important"),"Do not stretch characters");
assert(source.includes("aspect-ratio:1213 / 1297!important"),"Reuse portrait master without distortion");
assert(!source.includes("f03-five-plaques-landscape"),"No second landscape illustration");
assert(source.includes("value.textContent=item.value"),"Question numbers must be separate DOM labels");
assert(source.includes("img.onerror=()=>"),"Keep playable old quiz if image is unavailable");
assert(ui.includes("window.MTKF03ApprovedV197?.enhance(frame,q)"),"Game must mount five-plaque F03 scene");
assert(ui.indexOf("MTKQuizUniversalV176?.apply(frame,q)")<ui.indexOf("MTKF03ApprovedV197?.enhance(frame,q)"),"Mount after universal layout");
assert(quiz.includes("f03-approved-v197.js?v=203"),"Update iPhone browser asset cache");
assert(host.includes("forest-v70-quiz.html?v=203"),"Update parent iframe cache");
const f03=bank.questions.filter(q=>q.obstacleId==="F03");
assert.equal(bank.questions.length,630,"Preserve all 630 approved questions");
assert.equal(f03.length,30,"F03 requires 30 approved questions");
for(const difficulty of ["kolay","orta","zor"]){
  assert.equal(f03.filter(q=>q.difficulty===difficulty).length,10);
}
assert.equal(Object.keys(api.PLAQUES).length,5,"ONLY five empty data plaques in new illustration");
const outputOnly=bank.questions.find(q=>q.id==="F03-K-06");
assert.equal(api.plan(outputOnly)[0].slot,"filter_2","Exit flow cannot be shown on an incoming pipe");
assert.equal(api.plan(outputOnly)[1].slot,"filter_3","Observation share must be beside final observation tube");
assert(api.PLAQUES.filter_1[1]>825,"Numeric text must be centered below the top gemstone");
const slotNames=new Set(Object.keys(api.PLAQUES));
let numberCount=0;
for(const q of f03){
  const labels=q.visual?.labels||[];
  const planned=api.plan(q);
  numberCount+=labels.length;
  assert(labels.length>=2&&labels.length<=5,q.id+" has unexpected label count");
  assert.equal(planned.length,labels.length,q.id+" lost a numeric label");
  assert.equal(new Set(planned.map(x=>x.slot)).size,planned.length,q.id+" has plaque collision");
  for(let i=0;i<planned.length;i++){
    const a=planned[i],original=labels[i];
    assert(slotNames.has(a.slot),q.id+" uses missing plaque");
    assert.equal(a.value,String(original.value),q.id+" changed source math");
    assert.equal(a.anchor,String(original.anchor),q.id+" changed anchor");
    assert(a.caption.length>0&&a.caption.length<=18,q.id+" requires readable live anchor caption");
    assert(a.x-a.w/2>=0&&a.x+a.w/2<=1213,q.id+" x outside image");
    assert(a.y-a.h/2>=0&&a.y+a.h/2<=1297,q.id+" y outside image");
    for(const viewport of [{w:390,h:390},{w:422,h:390},{w:466,h:430},{w:350,h:315},{w:680,h:568}]){
      const scale=viewport.w/1213;
      assert((a.y+a.h/2)*scale<=viewport.h+1,q.id+" cropped "+a.slot+" on "+viewport.w+"x"+viewport.h);
    }
  }
}
assert.equal(numberCount,114,"All 114 F03 dynamic values must be preserved");
const bases=new Set(f03.map(q=>q.visual.labels[0].value.replace(/ birim$/,"").match(/^(\d+)[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/)?.[1]).filter(Boolean));
for(const b of ["2","3","4","5","6"])assert(bases.has(b),"F03 must offer genuine powers with base "+b);
assert.equal(f03.find(q=>q.id==="F03-K-06").visual.labels[0].value,"2⁸","Show 256 in exponential form on the output plaque");
for(const q of f03){
 const g=q.f03Guide;
 assert(g?.first?.length===3&&g?.second?.length===3&&g?.solution?.length>=4,q.id+" must have question-specific clear Turkish explanations");
 assert(q.options.includes(q.correctAnswer)&&new Set(q.options).size===4,q.id+" answers and distractors must be valid");
 assert(/[²³⁴⁵⁶⁷⁸⁹]/.test(q.workedExample?.question||""),q.id+" worked example should use powers");
 if(q.id!=="F03-Z-01")assert(!/\b[12]\. filtreden miktarın|\bfiltre gelen sisin .*aktarıyor/.test(q.prompt),q.id+" incorrect flow grammar");
}
const charBottom=1297*.499 + (1213*.234)*(1402/1122);
assert(charBottom < 1010,"Approved transparent reference must remain in landscape vertical safe area");
assert.equal(api.plan({obstacleId:"F02",visual:{labels:[]}}).length,0,"Do not alter F02");
console.log("PASS F03 v198: approved five-plaque master; 30 original questions and 114 labels; centered values; original transparent Erdem-Çiko; portrait and landscape safe crop.");
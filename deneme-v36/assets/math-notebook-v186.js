/* Matematik Evreni v186 — Erdem'in Matematik Defteri.
   Offline, privacy-preserving vector handwriting tied to each approved question.
   No OCR, no changes to scoring, art, answer keys or the 630-question bank. */
(function(global){
 "use strict";
 const DOC_W=1000,DOC_H=1414,PREFIX="mathverse-notebook-v186:";
 const palette=["#173b36","#164b83","#ac4634","#754fa3"];
 let question=null,launcher=null,root=null,canvas=null,paper=null,workspace=null;
 let note=null,open=false,active=null,activePointer=null,tool="pen",redone=new Map();
 let raf=0,lastFocus=null,savedFallback=new Map(),saveFailed=false;
 const $=id=>root&&root.querySelector("#"+id);
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const finite=n=>typeof n==="number"&&Number.isFinite(n);
 const keyFor=id=>PREFIX+encodeURIComponent(String(id||"").trim());
 const blank=()=>({version:1,pages:[{strokes:[]}],page:0,paper:"grid",zoom:1,penSize:5,eraserSize:28,color:palette[0]});
 function normalize(raw){
  const out=blank();
  if(!raw||typeof raw!=="object"||!Array.isArray(raw.pages))return out;
  const pages=raw.pages.slice(0,250).map(p=>{
   const strokes=Array.isArray(p?.strokes)?p.strokes:[];
   return {strokes:strokes.slice(0,7000).filter(s=>s&&Array.isArray(s.points)&&s.points.length>0&&["pen","erase"].includes(s.tool)).map(s=>({
    tool:s.tool,
    color:palette.includes(s.color)?s.color:palette[0],
    size:clamp(finite(s.size)?s.size:5,1,120),
    points:s.points.slice(0,18000).filter(pt=>Array.isArray(pt)&&pt.length===2&&finite(pt[0])&&finite(pt[1])).map(pt=>[clamp(pt[0],0,DOC_W),clamp(pt[1],0,DOC_H)])
   })).filter(s=>s.points.length>0)};
  });
  out.pages=pages.length?pages:[{strokes:[]}];
  out.page=clamp(Number.isInteger(raw.page)?raw.page:0,0,out.pages.length-1);
  out.paper=["grid","lined","plain"].includes(raw.paper)?raw.paper:"grid";
  out.zoom=clamp(finite(raw.zoom)?raw.zoom:1,.7,2);
  out.penSize=clamp(finite(raw.penSize)?raw.penSize:5,2,24);
  out.eraserSize=clamp(finite(raw.eraserSize)?raw.eraserSize:28,10,90);
  out.color=palette.includes(raw.color)?raw.color:palette[0];
  return out;
 }
 function load(){
  if(!question)return blank();
  const key=keyFor(question.id);
  if(savedFallback.has(key))return normalize(savedFallback.get(key));
  try{return normalize(JSON.parse(localStorage.getItem(key)||"null"))}catch(e){return blank()}
 }
 function status(text,isError=false){
  const el=$("mn-status");if(!el)return;
  el.textContent=text;el.dataset.error=isError?"true":"false";
 }
 function save(){
  if(!question||!note)return;
  const key=keyFor(question.id);
  savedFallback.set(key,note);
  try{
   localStorage.setItem(key,JSON.stringify(note));
   saveFailed=false;status("✓ Bu cihazda kaydedildi");
  }catch(e){
   saveFailed=true;
   status("Kaydetme başarısız: cihaz depolamasını kontrol edin. Bu oturumda yazılar korunuyor.",true);
  }
 }
 function element(tag,cls,text){
  const n=document.createElement(tag);if(cls)n.className=cls;
  if(text!==undefined)n.textContent=text;return n;
 }
 function ensureLauncher(){
  if(launcher)return;
  launcher=element("button","mn-launcher","✎  Defter");
  launcher.type="button";launcher.title="Erdem'in Matematik Defterini aç";
  launcher.setAttribute("aria-label","İşlem yapmak için matematik defterini aç");
  launcher.addEventListener("click",showNotebook);
  document.body.appendChild(launcher);
 }
 function attach(info){
  if(!info||!info.questionId){hide();return}
  const id=String(info.questionId),text=String(info.questionText||"").trim();
  if(question&&question.id!==id&&open)closeNotebook();
  question={id,text};
  ensureLauncher();
  launcher.hidden=false;
  launcher.style.display="";
  if(open&&root)$("mn-question").textContent=text;
 }
 function hide(){
  if(open)closeNotebook();
  if(launcher){launcher.hidden=true;launcher.style.display="none"}
  question=null;
 }
 function makeUI(){
  root=element("section","mn-root");
  root.hidden=true;
  root.setAttribute("role","dialog");
  root.setAttribute("aria-modal","true");
  root.setAttribute("aria-label","Erdem'in Matematik Defteri");
  root.innerHTML=[
   '<header class="mn-header"><div class="mn-heading"><strong>✎ Erdem’in Matematik Defteri</strong><small>İşlemler bu cihazda saklanır</small></div>',
   '<button type="button" id="mn-back" class="mn-primary">← Soruya dön</button></header>',
   '<section class="mn-question-block"><div class="mn-question-label">SORU</div><div id="mn-question" class="mn-question-text"></div></section>',
   '<div class="mn-tools" role="toolbar" aria-label="Yazma araçları">',
   '<button type="button" id="mn-pen" class="mn-tool mn-active" aria-pressed="true">✎ Kalem</button>',
   '<button type="button" id="mn-eraser" class="mn-tool" aria-pressed="false">▧ Silgi</button>',
   '<button type="button" id="mn-undo" class="mn-tool mn-square" aria-label="Geri al" title="Geri al">↶</button>',
   '<button type="button" id="mn-redo" class="mn-tool mn-square" aria-label="İleri al" title="İleri al">↷</button>',
   '<div class="mn-sizes"><label for="mn-size" id="mn-size-label">Kalem: 5</label><input id="mn-size" type="range" min="2" max="24" step="1" value="5"></div>',
   '<div class="mn-colors" id="mn-colors" aria-label="Kalem renkleri"></div>',
   '<label class="mn-select-label">Zemin<select id="mn-paper-type"><option value="grid">Kareli</option><option value="lined">Çizgili</option><option value="plain">Düz</option></select></label>',
   '<div class="mn-zoom"><label for="mn-zoom">Sayfa: <span id="mn-zoom-label">100%</span></label><input id="mn-zoom" type="range" min="70" max="200" step="10" value="100"></div>',
   '</div>',
   '<div id="mn-workspace" class="mn-workspace" aria-label="El yazısıyla işlem alanı">',
   '<div class="mn-paper-track"><div id="mn-paper" class="mn-paper" data-paper="grid"><canvas id="mn-canvas" aria-label="Parmağınızla veya kalemle işlem yapın"></canvas></div></div>',
   '</div>',
   '<footer class="mn-footer"><div class="mn-page-nav">',
   '<button type="button" id="mn-prev" class="mn-tool" aria-label="Önceki sayfa">‹</button>',
   '<strong id="mn-page-count" aria-live="polite">Sayfa 1 / 1</strong>',
   '<button type="button" id="mn-next" class="mn-tool" aria-label="Sonraki sayfa">›</button>',
   '<button type="button" id="mn-add" class="mn-tool">＋ Yeni sayfa</button>',
   '<button type="button" id="mn-clear" class="mn-tool mn-danger">Sayfayı temizle</button></div>',
   '<span id="mn-status" role="status" aria-live="polite">Hazır</span></footer>'
  ].join("");
  document.body.appendChild(root);
  canvas=$("mn-canvas");paper=$("mn-paper");workspace=$("mn-workspace");
  $("mn-back").addEventListener("click",closeNotebook);
  $("mn-pen").addEventListener("click",()=>selectTool("pen"));
  $("mn-eraser").addEventListener("click",()=>selectTool("erase"));
  $("mn-undo").addEventListener("click",undo);
  $("mn-redo").addEventListener("click",redo);
  $("mn-prev").addEventListener("click",()=>setPage(note.page-1));
  $("mn-next").addEventListener("click",()=>setPage(note.page+1));
  $("mn-add").addEventListener("click",addPage);
  $("mn-clear").addEventListener("click",clearPage);
  $("mn-size").addEventListener("input",e=>{
   const size=Number(e.target.value);
   if(tool==="pen")note.penSize=size;else note.eraserSize=size;
   refreshControls();save();
  });
  $("mn-zoom").addEventListener("input",e=>{
   note.zoom=Number(e.target.value)/100;
   $("mn-zoom-label").textContent=Math.round(note.zoom*100)+"%";
   fitPaper();save();
  });
  $("mn-paper-type").addEventListener("change",e=>{note.paper=e.target.value;paper.dataset.paper=note.paper;save()});
  for(const color of palette){
   const b=element("button","mn-color");
   b.type="button";b.style.background=color;b.dataset.color=color;
   b.setAttribute("aria-label","Kalem rengi "+color);
   b.addEventListener("click",()=>{note.color=color;selectTool("pen");refreshControls();save()});
   $("mn-colors").appendChild(b);
  }
  canvas.addEventListener("pointerdown",pointerDown);
  canvas.addEventListener("pointermove",pointerMove);
  canvas.addEventListener("pointerup",pointerEnd);
  canvas.addEventListener("pointercancel",pointerEnd);
  canvas.addEventListener("lostpointercapture",pointerEnd);
  if(global.ResizeObserver)new ResizeObserver(()=>{if(open)fitPaper()}).observe(workspace);
  else global.addEventListener("resize",()=>{if(open)fitPaper()},{passive:true});
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&open){finishStroke();save()}});
  global.addEventListener("pagehide",()=>{if(open){finishStroke();save()}});
  document.addEventListener("keydown",e=>{
   if(!open)return;
   if(e.key==="Escape"){e.preventDefault();closeNotebook()}
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){
    e.preventDefault();if(e.shiftKey)redo();else undo();
   }
  });
 }
 function showNotebook(){
  if(!question)return;
  if(!root)makeUI();
  if(open)return;
  lastFocus=document.activeElement;
  note=load();redone=new Map();active=null;activePointer=null;tool="pen";
  open=true;root.hidden=false;document.body.classList.add("mn-open");
  $("mn-question").textContent=question.text;
  paper.dataset.paper=note.paper;
  $("mn-paper-type").value=note.paper;
  $("mn-zoom").value=String(Math.round(note.zoom*100));
  $("mn-zoom-label").textContent=Math.round(note.zoom*100)+"%";
  refreshControls();refreshPages();
  requestAnimationFrame(()=>{fitPaper();$("mn-back").focus({preventScroll:true})});
 }
 function closeNotebook(){
  if(!open)return;
  finishStroke();save();
  open=false;root.hidden=true;document.body.classList.remove("mn-open");
  if(lastFocus?.isConnected&&typeof lastFocus.focus==="function")lastFocus.focus({preventScroll:true});
  else if(launcher&&!launcher.hidden)launcher.focus({preventScroll:true});
 }
 function selectTool(next){
  tool=next==="erase"?"erase":"pen";refreshControls();
 }
 function currentPage(){return note.pages[note.page]}
 function refreshControls(){
  if(!root||!note)return;
  for(const name of ["pen","eraser"]){
   const b=$("mn-"+name),selected=(name==="pen"&&tool==="pen")||(name==="eraser"&&tool==="erase");
   b.classList.toggle("mn-active",selected);b.setAttribute("aria-pressed",String(selected));
  }
  const v=tool==="pen"?note.penSize:note.eraserSize;
  $("mn-size").min=tool==="pen"?"2":"10";
  $("mn-size").max=tool==="pen"?"24":"90";
  $("mn-size").value=String(v);
  $("mn-size-label").textContent=(tool==="pen"?"Kalem: ":"Silgi: ")+v;
  for(const item of $("mn-colors").children)item.classList.toggle("mn-selected",item.dataset.color===note.color);
  const stack=redone.get(note.page)||[];
  $("mn-undo").disabled=currentPage().strokes.length===0;
  $("mn-redo").disabled=stack.length===0;
 }
 function refreshPages(){
  if(!root||!note)return;
  $("mn-page-count").textContent="Sayfa "+(note.page+1)+" / "+note.pages.length;
  $("mn-prev").disabled=note.page===0;
  $("mn-next").disabled=note.page===note.pages.length-1;
  paper.dataset.paper=note.paper;
  refreshControls();
 }
 function setPage(index){
  if(!note||index<0||index>=note.pages.length)return;
  finishStroke();note.page=index;save();refreshPages();repaint();
  workspace.scrollTop=0;workspace.scrollLeft=0;
 }
 function addPage(){
  if(!note)return;finishStroke();
  note.pages.push({strokes:[]});note.page=note.pages.length-1;
  save();refreshPages();repaint();
  workspace.scrollTop=0;workspace.scrollLeft=0;
 }
 function clearPage(){
  if(!note)return;
  const hasInk=currentPage().strokes.length>0;
  if(!hasInk)return;
  if(!global.confirm("Bu sayfadaki bütün işlemler silinecek. Emin misiniz?"))return;
  finishStroke();currentPage().strokes=[];
  redone.delete(note.page);save();repaint();refreshControls();
 }
 function undo(){
  if(!note)return;finishStroke();
  const p=currentPage(),stroke=p.strokes.pop();if(!stroke)return;
  const list=redone.get(note.page)||[];list.push(stroke);redone.set(note.page,list);
  save();repaint();refreshControls();
 }
 function redo(){
  if(!note)return;finishStroke();
  const list=redone.get(note.page)||[],stroke=list.pop();if(!stroke)return;
  currentPage().strokes.push(stroke);redone.set(note.page,list);
  save();repaint();refreshControls();
 }
 function logicalPoint(e,rect){
  return [clamp(Math.round((e.clientX-rect.left)/rect.width*DOC_W),0,DOC_W),
          clamp(Math.round((e.clientY-rect.top)/rect.height*DOC_H),0,DOC_H)];
 }
 function pointerDown(e){
  if(!open||!note||activePointer!==null)return;
  if(e.pointerType==="mouse"&&e.button!==0)return;
  e.preventDefault();
  activePointer=e.pointerId;
  active={tool,color:note.color,size:tool==="pen"?note.penSize:note.eraserSize,points:[logicalPoint(e,canvas.getBoundingClientRect())]};
  try{canvas.setPointerCapture(e.pointerId)}catch(err){}
  repaint();
 }
 function pointerMove(e){
  if(!active||e.pointerId!==activePointer)return;
  e.preventDefault();
  const rect=canvas.getBoundingClientRect();
  const events=typeof e.getCoalescedEvents==="function"?e.getCoalescedEvents():[];
  const samples=events.length?events:[e];
  for(const item of samples){
   const pt=logicalPoint(item,rect),last=active.points[active.points.length-1];
   if(Math.abs(pt[0]-last[0])+Math.abs(pt[1]-last[1])>=1)active.points.push(pt);
  }
  if(!raf)raf=requestAnimationFrame(()=>{raf=0;repaint()});
 }
 function pointerEnd(e){
  if(!active||e.pointerId!==activePointer)return;
  e.preventDefault();
  finishStroke();
  try{if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId)}catch(err){}
 }
 function finishStroke(){
  if(!active||!note)return;
  if(raf){cancelAnimationFrame(raf);raf=0}
  currentPage().strokes.push(active);
  redone.delete(note.page);active=null;activePointer=null;
  save();repaint();refreshControls();
 }
 function drawStroke(ctx,stroke){
  if(!stroke||!stroke.points.length)return;
  ctx.save();
  ctx.setTransform(canvas.width/DOC_W,0,0,canvas.height/DOC_H,0,0);
  ctx.globalCompositeOperation=stroke.tool==="erase"?"destination-out":"source-over";
  ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=stroke.size;
  ctx.strokeStyle=stroke.tool==="erase"?"#000":stroke.color;
  ctx.fillStyle=ctx.strokeStyle;
  const points=stroke.points;
  if(points.length===1){
   ctx.beginPath();ctx.arc(points[0][0],points[0][1],stroke.size/2,0,Math.PI*2);ctx.fill();
  }else{
   ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
   for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
   ctx.stroke();
  }
  ctx.restore();
 }
 function repaint(){
  if(!canvas||!note)return;
  const ctx=canvas.getContext("2d");if(!ctx)return;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.restore();
  for(const stroke of currentPage().strokes)drawStroke(ctx,stroke);
  if(active)drawStroke(ctx,active);
 }
 function fitPaper(){
  if(!open||!workspace||!paper||!canvas)return;
  const available=Math.max(250,workspace.clientWidth-28);
  const basis=Math.min(720,available);
  const width=Math.round(basis*note.zoom),height=Math.round(width*DOC_H/DOC_W);
  paper.style.width=width+"px";paper.style.height=height+"px";
  const ratio=Math.min(global.devicePixelRatio||1,2);
  const targetWidth=Math.round(width*ratio),targetHeight=Math.round(height*ratio);
  if(canvas.width!==targetWidth||canvas.height!==targetHeight){
   canvas.width=targetWidth;canvas.height=targetHeight;
  }
  repaint();
 }
 global.MTKMathNotebook=Object.freeze({attach,hide,open:showNotebook,close:closeNotebook,getStatus:()=>({open,questionId:question?.id||null,saved:!saveFailed})});
 // Small pure helpers for automated verification, not part of the quiz/scoring API.
 global.MTKMathNotebookTest=Object.freeze({keyFor,blank,normalize,logicalPoint,docWidth:DOC_W,docHeight:DOC_H});
})(window);

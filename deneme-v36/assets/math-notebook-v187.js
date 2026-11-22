/* Matematik Evreni v187 — Erdem'in Matematik Defteri.
   One continuous, automatically extending vector worksheet. Only visible
   canvases are allocated; writing and scrolling are mutually exclusive tools.
   v186 multi-page notes are converted without discarding old handwriting. */
(function(global){
 "use strict";
 const WIDTH=1000,SEGMENT=720,INITIAL_HEIGHT=2880,MAX_HEIGHT=240000;
 const KEY_PREFIX="mathverse-notebook-v186:";
 const COLORS=["#173b36","#164b83","#ac4634","#754fa3"];
 const clamp=(n,min,max)=>Math.max(min,Math.min(n,max));
 const finite=n=>typeof n==="number"&&Number.isFinite(n);
 const keyFor=id=>KEY_PREFIX+encodeURIComponent(String(id||"").trim());
 const blank=()=>({version:2,strokes:[],height:INITIAL_HEIGHT,scrollY:0,paper:"grid",zoom:1,
  penSize:5,eraserSize:28,color:COLORS[0],tool:"pen"});
 let question=null,launcher=null,root=null,note=null,workspace=null,paper=null,opened=false;
 let active=null,pointer=null,drawFrame=0,scale=.35,saveTimer=0,focusBefore=null;
 let redoStack=[],liveSegments=new Map(),saveError=false;
 const memory=new Map();
 const el=id=>root?.querySelector("#"+id)||null;
 function cleanStroke(s,offset=0){
  if(!s||!["pen","erase"].includes(s.tool)||!Array.isArray(s.points))return null;
  const pts=s.points.slice(0,18000).filter(p=>Array.isArray(p)&&p.length===2&&finite(p[0])&&finite(p[1]))
   .map(p=>[clamp(p[0],0,WIDTH),clamp(p[1]+offset,0,MAX_HEIGHT)]);
  if(!pts.length)return null;
  return {tool:s.tool,color:COLORS.includes(s.color)?s.color:COLORS[0],
    size:clamp(finite(s.size)?s.size:5,1,120),points:pts};
 }
 function normalize(raw){
  const result=blank();
  if(!raw||typeof raw!=="object")return result;
  if(raw.version===1&&Array.isArray(raw.pages)){
   // Each v186 sheet occupied 1000 x 1414 logical units. Retain page order,
   // eraser paths and original ink as a continuous vertical scroll.
   result.strokes=raw.pages.slice(0,250).flatMap((page,i)=>
    (Array.isArray(page?.strokes)?page.strokes:[]).slice(0,7000)
     .map(s=>cleanStroke(s,i*1414)).filter(Boolean));
   result.height=clamp(Math.ceil((Math.max(2,raw.pages.length)*1414)/SEGMENT)*SEGMENT,INITIAL_HEIGHT,MAX_HEIGHT);
   result.scrollY=clamp((Number.isInteger(raw.page)?raw.page:0)*1414,0,result.height);
  }else if(raw.version===2&&Array.isArray(raw.strokes)){
   result.strokes=raw.strokes.slice(0,25000).map(s=>cleanStroke(s)).filter(Boolean);
   const farthest=result.strokes.reduce((max,s)=>Math.max(max,...s.points.map(p=>p[1])),0);
   const desired=finite(raw.height)?raw.height:INITIAL_HEIGHT;
   result.height=clamp(Math.ceil(Math.max(desired,farthest+SEGMENT,INITIAL_HEIGHT)/SEGMENT)*SEGMENT,INITIAL_HEIGHT,MAX_HEIGHT);
   result.scrollY=clamp(finite(raw.scrollY)?raw.scrollY:0,0,result.height);
  }
  result.paper=["grid","lined","plain"].includes(raw.paper)?raw.paper:"grid";
  result.zoom=clamp(finite(raw.zoom)?raw.zoom:1,.7,2);
  result.penSize=clamp(finite(raw.penSize)?raw.penSize:5,2,24);
  result.eraserSize=clamp(finite(raw.eraserSize)?raw.eraserSize:28,10,90);
  result.color=COLORS.includes(raw.color)?raw.color:COLORS[0];
  result.tool=["pen","erase","hand"].includes(raw.tool)?raw.tool:"pen";
  return result;
 }
 function load(){
  const key=keyFor(question.id);
  if(memory.has(key))return normalize(memory.get(key));
  try{return normalize(JSON.parse(localStorage.getItem(key)||"null"))}catch(e){return blank()}
 }
 function status(message,error=false){
  const s=el("mn-status");if(s){s.textContent=message;s.dataset.error=error?"true":"false";}
 }
 function persist(){
  if(!question||!note)return;
  const key=keyFor(question.id);memory.set(key,note);
  try{localStorage.setItem(key,JSON.stringify(note));saveError=false;status("✓ Kaydedildi")}
  catch(e){saveError=true;status("Depolama dolu; bu oturumdaki işlemler korundu.",true)}
 }
 function scheduleSave(){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{saveTimer=0;persist()},300);
 }
 function flush(){
  clearTimeout(saveTimer);saveTimer=0;
  finishStroke();persist();
 }
 function element(tag,cls,text){
  const n=document.createElement(tag);if(cls)n.className=cls;
  if(text!==undefined)n.textContent=text;
  return n;
 }
 function ensureLauncher(){
  if(launcher)return;
  launcher=element("button","mn-launcher","✎");
  launcher.type="button";
  launcher.title="İşlem defterini aç";
  launcher.setAttribute("aria-label","İşlemleri yazmak için defteri aç");
  launcher.addEventListener("click",openNotebook);
 }
 function attach(info){
  if(!info?.questionId){hide();return}
  const id=String(info.questionId),text=String(info.questionText||"").trim();
  if(opened&&question&&question.id!==id)closeNotebook();
  question={id,text,scene:info.scene||"forest"};
  ensureLauncher();
  if(opened&&el("mn-question"))el("mn-question").textContent=text;
 }
 function placeButton(host){
  if(!host||!question)return;
  ensureLauncher();
  const prompt=host.querySelector(".mtk-question-region .prompt")||host.querySelector(".prompt");
  if(!prompt)return;
  prompt.insertBefore(launcher,prompt.firstChild);
  launcher.hidden=false;
 }
 function hide(){
  if(opened)closeNotebook();
  launcher?.remove();
  question=null;
 }
 function notify(event){
  try{
   if(global.parent===global)return;
   const url=new URLSearchParams(location.search);
   global.parent.postMessage({source:"mathverse-v68-quiz",event,
    obstacle:url.get("obstacle")||"",difficulty:url.get("difficulty")||"orta"},location.origin);
  }catch(e){}
 }
 function createUI(){
  root=element("section","mn-root");
  root.hidden=true;root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");
  root.setAttribute("aria-label","Erdem'in Matematik Defteri");
  root.innerHTML=[
   '<header class="mn-header"><strong>✎ Erdem’in Defteri</strong><button type="button" id="mn-back" aria-label="Soruya dön">← Soruya dön</button></header>',
   '<section class="mn-question-block"><span>SORU</span><div id="mn-question"></div></section>',
   '<nav class="mn-toolbar" aria-label="Defter araçları">',
   '<button type="button" id="mn-pen" aria-label="Kalem" title="Kalem" aria-pressed="true">✎</button>',
   '<button type="button" id="mn-erase" aria-label="Silgi" title="Silgi" aria-pressed="false">▤</button>',
   '<button type="button" id="mn-hand" aria-label="Sayfayı kaydır" title="El ile kaydır" aria-pressed="false">✋</button>',
   '<span class="mn-toolspace"></span>',
   '<button type="button" id="mn-undo" aria-label="Geri al" title="Geri al">↶</button>',
   '<button type="button" id="mn-redo" aria-label="İleri al" title="İleri al">↷</button></nav>',
   '<div class="mn-settings" aria-label="Seçili aracın ayarları">',
   '<div id="mn-pen-options" class="mn-option-panel"><div id="mn-colors" class="mn-colors"></div>',
   '<label>Kalınlık<input id="mn-pen-size" type="range" min="2" max="24" step="1" value="5"></label>',
   '<label>Zemin<select id="mn-paper-type"><option value="grid">Kareli</option><option value="lined">Çizgili</option><option value="plain">Düz</option></select></label></div>',
   '<div id="mn-erase-options" class="mn-option-panel" hidden><label>Silgi boyutu<input id="mn-erase-size" type="range" min="10" max="90" step="2" value="28"></label></div>',
   '<div id="mn-hand-options" class="mn-option-panel" hidden><span>↕ Sayfayı sürükleyerek kaydır</span>',
   '<label>Yakınlaştır<input id="mn-zoom" type="range" min="70" max="200" step="10" value="100"></label>',
   '<span id="mn-zoom-label">100%</span></div></div>',
   '<div id="mn-workspace" class="mn-workspace" aria-label="Uzun kaydırılabilir işlem sayfası">',
   '<div class="mn-paper-track"><div id="mn-paper" class="mn-paper" data-paper="grid"></div></div></div>',
   '<footer class="mn-footer"><button type="button" id="mn-clear" title="Tüm işlemleri temizle" aria-label="Tüm işlemleri temizle">🗑</button>',
   '<small id="mn-status" role="status" aria-live="polite">İşlemler bu cihazda kaydedilir</small></footer>'
  ].join("");
  // v189: reuse the working controls in a responsive landscape side rail.
  const side=element("aside","mn-side-rail");
  side.setAttribute("aria-label","Kalem, silgi, el ve defter ayarları");
  for(const selector of [".mn-toolbar",".mn-settings",".mn-footer"]){
   const child=root.querySelector(selector);
   if(child)side.appendChild(child);
  }
  root.insertBefore(side,root.querySelector(".mn-workspace"));
  document.body.appendChild(root);
  workspace=el("mn-workspace");paper=el("mn-paper");
  el("mn-back").addEventListener("click",closeNotebook);
  for(const name of ["pen","erase","hand"])
   el("mn-"+name).addEventListener("click",()=>setTool(name));
  el("mn-undo").addEventListener("click",undo);
  el("mn-redo").addEventListener("click",redo);
  el("mn-clear").addEventListener("click",clearAll);
  el("mn-pen-size").addEventListener("input",e=>{note.penSize=+e.target.value;scheduleSave()});
  el("mn-erase-size").addEventListener("input",e=>{note.eraserSize=+e.target.value;scheduleSave()});
  el("mn-paper-type").addEventListener("change",e=>{note.paper=e.target.value;paper.dataset.paper=note.paper;scheduleSave()});
  el("mn-zoom").addEventListener("input",e=>{
   finishStroke();
   const position=workspace.scrollTop/scale;
   note.zoom=+e.target.value/100;el("mn-zoom-label").textContent=Math.round(note.zoom*100)+"%";
   fitPaper(position);scheduleSave();
  });
  for(const color of COLORS){
   const b=element("button","mn-color");
   b.type="button";b.dataset.color=color;b.style.backgroundColor=color;
   b.setAttribute("aria-label","Kalem rengi "+color);
   b.addEventListener("click",()=>{note.color=color;setTool("pen");refresh();scheduleSave()});
   el("mn-colors").appendChild(b);
  }
  workspace.addEventListener("scroll",onScroll,{passive:true});
  if(global.ResizeObserver)new ResizeObserver(()=>{if(opened)fitPaper()}).observe(workspace);
  else global.addEventListener("resize",()=>{if(opened)fitPaper()},{passive:true});
  document.addEventListener("visibilitychange",()=>{if(document.hidden&&opened)flush()});
  global.addEventListener("pagehide",()=>{if(opened)flush()});
  document.addEventListener("keydown",e=>{
   if(!opened)return;
   if(e.key==="Escape"){e.preventDefault();closeNotebook()}
   if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="z"){
    e.preventDefault();if(e.shiftKey)redo();else undo();
   }
  });
 }
 function openNotebook(){
  if(!question)return;
  if(!root)createUI();
  if(opened)return;
  focusBefore=document.activeElement;
  note=load();redoStack=[];active=null;pointer=null;
  opened=true;root.hidden=false;root.classList.toggle("mn-forest",question.scene==="forest");
  document.body.classList.add("mn-open");
  el("mn-question").textContent=question.text;
  el("mn-paper-type").value=note.paper;paper.dataset.paper=note.paper;
  el("mn-zoom").value=String(Math.round(note.zoom*100));
  el("mn-zoom-label").textContent=Math.round(note.zoom*100)+"%";
  refresh();notify("notebook-open");
  requestAnimationFrame(()=>{
   fitPaper(note.scrollY);
   el("mn-back").focus({preventScroll:true});
  });
 }
 function closeNotebook(){
  if(!opened)return;
  note.scrollY=workspace.scrollTop/scale;
  flush();opened=false;root.hidden=true;
  document.body.classList.remove("mn-open");
  for(const canvas of liveSegments.values())canvas.remove();
  liveSegments.clear();
  notify("notebook-close");
  if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
  else if(launcher?.isConnected)launcher.focus({preventScroll:true});
 }
 function refresh(){
  if(!opened||!note)return;
  const hand=note.tool==="hand";
  root.classList.toggle("mn-hand",hand);
  for(const name of ["pen","erase","hand"]){
   const on=note.tool===name;
   el("mn-"+name).setAttribute("aria-pressed",String(on));
   el("mn-"+name).classList.toggle("mn-active",on);
  }
  el("mn-pen-options").hidden=note.tool!=="pen";
  el("mn-erase-options").hidden=note.tool!=="erase";
  el("mn-hand-options").hidden=!hand;
  el("mn-pen-size").value=note.penSize;
  el("mn-erase-size").value=note.eraserSize;
  el("mn-undo").disabled=!note.strokes.length;
  el("mn-redo").disabled=!redoStack.length;
  for(const b of el("mn-colors").children)b.classList.toggle("mn-selected",b.dataset.color===note.color);
 }
 function setTool(value){
  if(!note)return;
  finishStroke();
  note.tool=value;
  refresh();scheduleSave();
 }
 function undo(){
  if(!note)return;finishStroke();
  const stroke=note.strokes.pop();
  if(!stroke)return;
  redoStack.push(stroke);persist();refresh();renderVisible(true);
 }
 function redo(){
  if(!note)return;finishStroke();
  const stroke=redoStack.pop();
  if(!stroke)return;
  note.strokes.push(stroke);persist();refresh();renderVisible(true);
 }
 function clearAll(){
  if(!note||!note.strokes.length)return;
  if(!global.confirm("Bu sorunun defterindeki bütün yazılar silinecek. Emin misiniz?"))return;
  finishStroke();note.strokes=[];redoStack=[];
  persist();refresh();renderVisible(true);
 }
 function onScroll(){
  if(!opened||!note)return;
  const near=workspace.scrollTop+workspace.clientHeight>=workspace.scrollHeight-Math.max(120,workspace.clientHeight*.8);
  if(near&&note.height<MAX_HEIGHT){
   note.height=Math.min(MAX_HEIGHT,note.height+2*SEGMENT);
   sizePaper();
  }
  note.scrollY=workspace.scrollTop/scale;
  renderVisible();scheduleSave();
 }
 function sizePaper(){
  paper.style.width=Math.round(WIDTH*scale)+"px";
  paper.style.height=Math.round(note.height*scale)+"px";
  paper.style.setProperty("--mn-grid-step",Math.max(8,Math.round(60*scale))+"px");
 }
 function fitPaper(toLogicalY){
  if(!opened||!workspace||!paper)return;
  const oldPosition=Number.isFinite(toLogicalY)?toLogicalY:workspace.scrollTop/(scale||1);
  // Fill the writing area almost edge-to-edge at 100% zoom.
  // Smaller zoom levels retain the same sage-green surface on both sides.
  const available=Math.max(240,workspace.clientWidth-4);
  const basis=available;
  scale=basis*note.zoom/WIDTH;
  sizePaper();
  for(const canvas of liveSegments.values())canvas.remove();
  liveSegments.clear();
  workspace.scrollTop=clamp(oldPosition*scale,0,Math.max(0,paper.offsetHeight-workspace.clientHeight));
  renderVisible(true);
 }
 function makeSegment(index){
  const c=element("canvas","mn-segment");
  c.dataset.index=String(index);
  c.setAttribute("aria-label","Parmakla işlem yazma bölümü");
  c.style.top=Math.round(index*SEGMENT*scale)+"px";
  c.style.width=Math.round(WIDTH*scale)+"px";
  c.style.height=Math.ceil(SEGMENT*scale)+"px";
  const density=Math.min(global.devicePixelRatio||1,1.8);
  c.width=Math.max(1,Math.ceil(WIDTH*scale*density));
  c.height=Math.max(1,Math.ceil(SEGMENT*scale*density));
  c.addEventListener("pointerdown",pointerDown);
  c.addEventListener("pointermove",pointerMove);
  c.addEventListener("pointerup",pointerEnd);
  c.addEventListener("pointercancel",pointerEnd);
  c.addEventListener("lostpointercapture",pointerEnd);
  paper.appendChild(c);
  return c;
 }
 function renderVisible(force=false){
  if(!opened||!paper||!workspace||!note)return;
  const first=clamp(Math.floor(workspace.scrollTop/(SEGMENT*scale))-1,0,Math.floor((note.height-1)/SEGMENT));
  const last=clamp(Math.ceil((workspace.scrollTop+workspace.clientHeight)/(SEGMENT*scale))+1,first,Math.floor((note.height-1)/SEGMENT));
  for(const [index,c] of [...liveSegments.entries()]){
   if(index<first||index>last){c.remove();liveSegments.delete(index)}
  }
  for(let i=first;i<=last;i++){
   let c=liveSegments.get(i);
   if(!c){c=makeSegment(i);liveSegments.set(i,c);drawSegment(i,c)}
   else if(force)drawSegment(i,c);
  }
 }
 function drawStroke(ctx,stroke,index){
  if(!stroke?.points?.length)return;
  const points=stroke.points;
  const lo=points.reduce((m,p)=>Math.min(m,p[1]),Infinity);
  const hi=points.reduce((m,p)=>Math.max(m,p[1]),-Infinity);
  const y=index*SEGMENT;
  if(hi+stroke.size<y||lo-stroke.size>y+SEGMENT)return;
  ctx.globalCompositeOperation=stroke.tool==="erase"?"destination-out":"source-over";
  ctx.strokeStyle=stroke.tool==="erase"?"#000":stroke.color;
  ctx.fillStyle=ctx.strokeStyle;
  ctx.lineWidth=stroke.size;ctx.lineCap="round";ctx.lineJoin="round";
  if(points.length===1){
   ctx.beginPath();ctx.arc(points[0][0],points[0][1],stroke.size/2,0,Math.PI*2);ctx.fill();
  }else{
   ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
   for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
   ctx.stroke();
  }
 }
 function drawSegment(index,c){
  const ctx=c.getContext("2d");if(!ctx)return;
  ctx.clearRect(0,0,c.width,c.height);
  ctx.save();
  ctx.setTransform(c.width/WIDTH,0,0,c.height/SEGMENT,0,0);
  ctx.translate(0,-index*SEGMENT);
  for(const stroke of note.strokes)drawStroke(ctx,stroke,index);
  if(active)drawStroke(ctx,active,index);
  ctx.restore();
 }
 function point(e){
  const r=paper.getBoundingClientRect();
  return [clamp(Math.round((e.clientX-r.left)/scale),0,WIDTH),
   clamp(Math.round((e.clientY-r.top)/scale),0,MAX_HEIGHT)];
 }
 function pointerDown(e){
  if(!opened||!note||note.tool==="hand"||pointer!==null)return;
  if(e.pointerType==="mouse"&&e.button!==0)return;
  e.preventDefault();
  pointer=e.pointerId;
  active={tool:note.tool,color:note.color,size:note.tool==="erase"?note.eraserSize:note.penSize,points:[point(e)]};
  try{e.currentTarget.setPointerCapture(e.pointerId)}catch(err){}
  renderVisible(true);
 }
 function pointerMove(e){
  if(pointer!==e.pointerId||!active)return;
  e.preventDefault();
  const list=typeof e.getCoalescedEvents==="function"?e.getCoalescedEvents():[];
  for(const item of list.length?list:[e]){
   if(active.points.length>=18000)break;
   const p=point(item),last=active.points[active.points.length-1];
   if(Math.abs(p[0]-last[0])+Math.abs(p[1]-last[1])>=2)active.points.push(p);
  }
  if(!drawFrame)drawFrame=requestAnimationFrame(()=>{drawFrame=0;renderVisible(true)});
 }
 function pointerEnd(e){
  if(!active||pointer!==e.pointerId)return;
  e.preventDefault();
  finishStroke();
  try{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}catch(err){}
 }
 function finishStroke(){
  if(!active||!note)return;
  if(drawFrame){cancelAnimationFrame(drawFrame);drawFrame=0}
  note.strokes.push(active);redoStack=[];
  active=null;pointer=null;persist();refresh();renderVisible(true);
 }
 global.MTKMathNotebook=Object.freeze({
  attach,placeButton,hide,open:openNotebook,close:closeNotebook,
  getStatus:()=>({open:opened,questionId:question?.id||null,saved:!saveError,
   strokes:note?.strokes.length||0,height:note?.height||0})
 });
 global.MTKMathNotebookTest=Object.freeze({keyFor,blank,normalize,docWidth:WIDTH,segmentHeight:SEGMENT,initialHeight:INITIAL_HEIGHT});
})(window);

const assert=require('node:assert/strict');
const api=require('../assets/f21-matching-v217.js');
const plan=require('../assets/scene-plan-v214.js');
const bank=require('../forest-questions-v147.json');
console.log('PASS v224',(function domTest(api,planAPI,bank,check){
 class E{constructor(){this.children=[];this.style={};this.attrs={};this.disabled=false;this.hidden=false;this.parent=null;this.listeners={};this.cls=new Set();this.classList={contains:k=>this.cls.has(k),add:k=>this.cls.add(k),remove:k=>this.cls.delete(k),toggle:(k,v)=>v?this.cls.add(k):this.cls.delete(k)}}append(...xs){for(const x of xs){x.parent=this;this.children.push(x)}}setAttribute(k,v){this.attrs[k]=v}addEventListener(k,f){this.listeners[k]=f}click(){if(!this.disabled)this.listeners.click?.()}remove(){if(this.parent){this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null}}}
 const doc={createElement:()=>new E()};let qs=0,wrong=0,pairs=0,locked=0;
 for(const q of bank.questions.filter(q=>q.obstacleId==="F21")){
 const d=q.interaction,plan=planAPI.plan(q),plane=new E(),readout=new E(),choices=new E();choices.append(...Array.from({length:4},()=>new E()));choices.children[1].disabled=true;choices.children[1].classList.add("wrongChoice");
 const nodes=new Map(),plaque={mount(_p,l,o){const e=new E();e.addEventListener("click",o.onActivate);plane.append(e);nodes.set(l.slot,e);o.onFit(l,{readable:false,width:20,height:10});return{element:e,destroy(){e.remove()}}}};
 const run={wrong:0};let saves=0;const m=api.mount({q,plan,plane,readout,choices,run,save:()=>saves++,plaqueAPI:plaque,documentRef:doc});check(m&&choices.children.every(x=>x.disabled),q.id+" initial lock");
 const r=d.radicalItems[0],bad=d.exponentItems.find(e=>!d.pairs.some(x=>x.radical===r&&x.exponent===e));const root=nodes.get(0),exp=nodes.get(5+d.exponentItems.indexOf(bad));root.click();exp.click();check(root.style.outline.includes("#cf6254")&&exp.style.outline.includes("#cf6254")&&saves===0,q.id+" wrong pair");wrong++;
 for(const p of d.pairs){nodes.get(d.radicalItems.indexOf(p.radical)).click();nodes.get(5+d.exponentItems.indexOf(p.exponent)).click();pairs++}
 check(saves===4&&run.matchingById[q.id].pairs.length===4&&!choices.children[0].disabled&&choices.children[1].disabled,q.id+" ready and wrong option preserved");m.destroy();
 const help={wrong:1,helpView:true,matchingById:run.matchingById};const m2=api.mount({q,plan,plane,readout,choices,run:help,plaqueAPI:plaque,documentRef:doc});check(m2&&plane.children.every(x=>x.disabled)&&choices.children.every(x=>x.disabled),q.id+" help lock");locked++;m2.destroy();qs++;
 }
 return{qs,wrong,pairs,locked};
})(api,plan,bank,(v,m)=>assert.ok(v,m)));

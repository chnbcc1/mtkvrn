const assert=require('node:assert/strict');
const special=require('../assets/special-scenes-v222.js');
const bank=require('../forest-questions-v147.json');
console.log('PASS v222',(function checks(special,bank,check){
 let count=0,labels=0,diagramOnly=0,modes={};
 for(const q of bank.questions.filter(q=>special.ids.includes(q.obstacleId))){
 const d=special.describe(q);check(d,q.id);const canon=x=>JSON.stringify(x.map(l=>[l.anchor,l.value]).sort());check(canon(d.rows.flatMap(r=>r.items))===canon(q.visual.labels),q.id+" labels");
 count++;labels+=d.labels.length;if(d.diagramOnly)diagramOnly++;(modes[d.id]??={})[d.mode]=(modes[d.id][d.mode]||0)+1;
 }
 check(count===150&&labels===426&&diagramOnly===21,"coverage");
 check(modes.F02.counter===4&&modes.F03.parallel===3&&modes.F03.branch===3&&modes.F10.partial===4&&modes.F19.pieces===1,"specific modes");
 class Element{constructor(){this.children=[];this.style={};this.attrs={};this.parent=null;this.textContent=""}append(...xs){for(const x of xs){x.parent=this;this.children.push(x)}}setAttribute(k,v){this.attrs[k]=v}remove(){if(this.parent){this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null}}}
 const doc={createElement:()=>new Element(),createElementNS:()=>new Element()};
 let rendered=0;
 for(const q of bank.questions.filter(q=>special.ids.includes(q.obstacleId))){const plane=new Element(),readout=new Element(),m=special.mount({q,plane,readout,documentRef:doc});check(m&&readout.children.length===1,q.id+" mount");m.destroy();check(!plane.children.length&&!readout.children.length,q.id+" cleanup");rendered++}
 return {count,labels,diagramOnly,rendered,modes};
})(special,bank,(x,m)=>assert.ok(x,m)));

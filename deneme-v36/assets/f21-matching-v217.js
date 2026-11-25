/* v217 staged F21 matching controller; no live game wiring. */
(function(root){
const api=(function buildAPI(){
  "use strict";
  const palette=["#32bc82","#36a7e6","#e6a83c","#c18aef"];
  function create(q,saved){
    const d=q?.interaction;
    if(q?.obstacleId!=="F21"||d?.kind!=="matching_unmatched"||d.requiredPairs!==4)return null;
    const groups={radical:d.radicalItems,exponent:d.exponentItems};
    if(Object.values(groups).some(g=>!Array.isArray(g)||g.length!==5||new Set(g).size!==5)||!Array.isArray(d.pairs)||d.pairs.length!==4)return null;
    const expected=new Map(d.pairs.map(p=>[p.radical,p.exponent]));
    if(expected.size!==4||new Set(expected.values()).size!==4||d.pairs.some(p=>!groups.radical.includes(p.radical)||!groups.exponent.includes(p.exponent)))return null;
    if(groups.radical.filter(v=>!expected.has(v))[0]!==d.unmatchedRadical||groups.exponent.filter(v=>![...expected.values()].includes(v))[0]!==d.unmatchedExponent)return null;
    const pairs=new Map();
    for(const p of Array.isArray(saved?.pairs)?saved.pairs:[]){
      if(Array.isArray(p)&&p.length===2&&expected.has(p[0])&&expected.get(p[0])===p[1])pairs.set(p[0],p[1]);
    }
    let selected=null;
    function paired(side,value){return side==="radical"?pairs.has(value):[...pairs.values()].includes(value)}
    function pairIndex(side,value){
      return [...pairs].findIndex(p=>p[side==="radical"?0:1]===value);
    }
    function snapshot(){
      return {pairs:[...pairs],selected:selected?{...selected}:null,ready:pairs.size===4,count:pairs.size};
    }
    function activate(side,value){
      if(!groups[side]?.includes(value)||paired(side,value)||pairs.size===4)return {kind:"ignored",state:snapshot()};
      if(selected?.side===side&&selected.value===value){selected=null;return {kind:"deselected",state:snapshot()}}
      if(!selected||selected.side===side){selected={side,value};return {kind:"selected",state:snapshot()}}
      const root=side==="radical"?value:selected.value,exp=side==="exponent"?value:selected.value;
      if(expected.get(root)!==exp){selected=null;return {kind:"wrong",state:snapshot()}}
      pairs.set(root,exp);selected=null;return {kind:pairs.size===4?"ready":"paired",state:snapshot()};
    }
    return {groups,activate,snapshot,paired,pairIndex,remaining(){return pairs.size===4?{radical:groups.radical.find(v=>!paired("radical",v)),exponent:groups.exponent.find(v=>!paired("exponent",v))}:null}};
  }
  // Caller supplies the already loaded, correctly cropped scene plane and readout
  // container. Never replace approved artwork or characters in this module.
  function mount({q,plan,plane,readout,choices,run,save,plaqueAPI,documentRef=typeof document!=="undefined"?document:null,onWrong}={}){
    if(!documentRef||!plane||!readout||!plaqueAPI?.mount||!plan?.matching||plan.labels?.length!==10)return null;
    const old=run?.matchingById?.[q.id],model=create(q,old);
    if(!model)return null;
    const stones=plan.labels.map(l=>({label:l,side:l.slot<5?"radical":"exponent",index:l.slot%5}));
    if(new Set(stones.map(s=>s.label.slot)).size!==10||stones.some(s=>!Number.isInteger(s.label.slot)||s.label.slot<0||s.label.slot>9||model.groups[s.side][s.index]!==s.label.value))return null;
    const disposers=[],views=[],measurements=new Map();
    const status=documentRef.createElement("p");status.setAttribute("role","status");status.setAttribute("aria-live","polite");
    Object.assign(status.style,{fontSize:"14px",margin:"4px 0",fontWeight:"700"});
    const panel=documentRef.createElement("section");panel.hidden=true;panel.setAttribute("aria-label","Büyük ve dokunulabilir taşlar");
    const header=documentRef.createElement("p");header.textContent="Taşları büyük boyutta seç";Object.assign(header.style,{fontSize:"14px",fontWeight:"700",margin:"4px 0"});
    const grid=documentRef.createElement("div");Object.assign(grid.style,{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:"6px"});
    panel.append(header,grid);readout.append(status,panel);
    const initialDisabled=new Map([...choices?.children||[]].map(b=>[b,b.disabled]));
    const locked=()=>!!(run?.stageCorrect||run?.revealed||run?.awaiting);
    let destroyed=false;
    function persist(){
      if(run){run.matchingById||={};run.matchingById[q.id]={pairs:model.snapshot().pairs}}
      if(typeof save==="function")save();
    }
    function syncPanel(){
      if(destroyed)return;
      panel.hidden=!stones.some(s=>{const m=measurements.get(s.label.slot);return !m||!m.readable||m.width/.92<44||m.height/.88<44});
    }
    function paint(msg){
      const st=model.snapshot();
      status.textContent=msg||(st.ready?"4/4 çift bulundu. Eşleşmeden kalan iki taşı belirle.":st.count+"/4 doğru çift. İki sütundan birer taş seç.");
      for(const v of views){
        const i=model.pairIndex(v.side,v.value),selected=st.selected?.side===v.side&&st.selected.value===v.value;
        v.button.disabled=locked()||st.ready||i>=0;
        v.button.setAttribute("aria-pressed",String(selected||i>=0));
        v.button.setAttribute("aria-label",(v.side==="radical"?"Köklü taş ":"Üslü taş ")+v.value+(i>=0?", eşleşme "+(i+1):selected?", seçili":""));
        v.button.style.outline=i>=0?"3px solid "+palette[i]:selected?"3px solid #fff2a0":"";
        v.button.style.outlineOffset="-3px";
        v.button.style.boxShadow=i>=0?"inset 0 0 12px "+palette[i]+", 0 0 8px "+palette[i]:"";
        v.mark.hidden=i<0;v.mark.textContent=i>=0?String(i+1):"";
        v.mark.style.backgroundColor=i>=0?palette[i]:"";
      }
      for(const [b,disabled] of initialDisabled){
        b.disabled=locked()||disabled||!st.ready||b.classList.contains("wrongChoice");
        b.classList.toggle("match-locked",!st.ready&&!locked());
      }
    }
    function choose(side,value){
      if(locked())return;
      const r=model.activate(side,value);
      if(r.kind==="paired"||r.kind==="ready")persist();
      paint(r.kind==="wrong"?"Bu iki taş eşdeğer değil. Kök derecesi ve üs işlemini tekrar kontrol et.":undefined);
      if(r.kind==="wrong"&&typeof onWrong==="function")onWrong();
    }
    function addView(button,side,value){
      const mark=documentRef.createElement("span");mark.hidden=true;mark.setAttribute("aria-hidden","true");
      Object.assign(mark.style,{position:"absolute",top:"0",right:"0",fontSize:"10px",lineHeight:"14px",minWidth:"14px",borderRadius:"50%",color:"#17221a",fontWeight:"800",pointerEvents:"none"});
      button.append(mark);views.push({button,side,value,mark});
    }
    function abort(){destroy();return null}
    function destroy(){
      if(destroyed)return;destroyed=true;
      disposers.forEach(f=>f());status.remove();panel.remove();
      for(const [b,disabled] of initialDisabled){b.disabled=disabled;b.classList.remove("match-locked")}
    }
    for(const s of stones){
      const m=plaqueAPI.mount(plane,s.label,{documentRef,matching:true,onActivate:()=>choose(s.side,s.label.value),onFit:(l,r)=>{measurements.set(l.slot,r);syncPanel()}});
      if(!m)return abort();
      disposers.push(()=>m.destroy());addView(m.element,s.side,s.label.value);
    }
    for(let i=0;i<5;i++)for(const side of ["radical","exponent"]){
      const value=model.groups[side][i],button=documentRef.createElement("button");button.type="button";button.textContent=value;
      Object.assign(button.style,{position:"relative",minHeight:"44px",minWidth:"0",fontSize:"16px",fontWeight:"700",padding:"6px",border:"1px solid #b59256",borderRadius:"8px",color:"#302515",background:"#fff7dc",overflowWrap:"anywhere"});
      button.addEventListener("click",()=>choose(side,value));grid.append(button);addView(button,side,value);
    }
    syncPanel();paint();
    return {model,destroy};
  }
  return Object.freeze({create,mount,palette:Object.freeze(palette)});
})();
if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKF21MatchingV217=api;
})(typeof window!=="undefined"?window:globalThis);

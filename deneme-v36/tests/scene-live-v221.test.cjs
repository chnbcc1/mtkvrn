const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/scene-live-v221.js'),'utf8');
(function tests(source,check){
 class Node{
  constructor(cls=""){this.cls=new Set(cls.split(" ").filter(Boolean));this.children=[];this.parent=null;this.style={};this.disabled=false;this.hidden=false;this.classList={contains:x=>this.cls.has(x),add:x=>this.cls.add(x),remove:x=>this.cls.delete(x),toggle:(x,v)=>v?this.cls.add(x):this.cls.delete(x)};}
  setAttribute(k,v){this[k]=v}
  set className(s){this.cls=new Set(s.split(" ").filter(Boolean))}
  get isConnected(){return this===doc.body||!!this.parent?.isConnected}
  append(...nodes){for(const n of nodes){n.remove();this.children.push(n);n.parent=this}}
  remove(){if(this.parent){const a=this.parent.children;a.splice(a.indexOf(this),1);this.parent=null}}
  replaceChildren(...nodes){for(const n of [...this.children])n.remove();this.append(...nodes)}
  insertBefore(n,b){n.remove();this.children.splice(this.children.indexOf(b),0,n);n.parent=this}
  matches(s){return s.split(",").some(x=>x.startsWith(".")&&this.cls.has(x.slice(1)))}
  querySelector(s){for(const n of this.children){if(n.matches(s))return n;const r=n.querySelector(s);if(r)return r}return null}
 }
 const doc={createElement:()=>new Node()};doc.body=new Node();
 const root={};let deferred=[],destroyed=0,notebook=0;
 root.MTKApprovedQuizV145={mount(app,q,s,choices,run){const frame=new Node("mtk-frame");frame.append(...app.children);app.append(frame);if(q.obstacleId==="F21"&&!run.stageCorrect&&!run.revealed)for(const b of choices.children){b.disabled=true;b.classList.add("match-locked")}return true}};
 root.MTKScenePlanV214={plan:q=>q};root.MTKCharacterLayerV215={};root.MTKPlaqueTextV216={};root.MTKF21MatchingV217={mount:({choices})=>{check(choices.children[0].disabled===false,"F21 unlocks base choice");check(choices.children[1].disabled===true,"F21 preserves wrong choice");return {destroy(){}}}};
 root.MTKMathNotebook={placeButton(){notebook++}};
 root.MTKSceneLayoutV218={shell(host){const element=new Node(),visual=new Node(),question=new Node(),content=new Node(),readout=new Node(),choices=new Node(),actions=new Node();question.append(content,readout,choices,actions);element.append(visual,question);host.append(element);return{element,visual,question,content,readout,choices,actions,destroy(){element.remove()}}},mountScene(args){return new Promise(resolve=>deferred.push({args,resolve}))}};
 const m={exports:{}};new Function("module","window","document","setTimeout","clearTimeout",source)(m,root,doc,()=>1,()=>{});
 const api=m.exports;
 function sample(id,run={wrong:0}){const app=new Node();doc.body.append(app);const prompt=new Node("prompt"),choices=new Node("choiceGrid"),btn=new Node("choice"),wrong=new Node("choice wrongChoice"),extra=new Node("solution"),row=new Node("btnRow"),action=new Node("btn");wrong.disabled=true;row.append(action);choices.append(btn,wrong);app.append(prompt,choices,extra,row);const q={id:id+"-K-01",obstacleId:id};api.mount(app,q,{},choices,run,()=>{});return{app,prompt,choices,btn,wrong,extra,action}}
 const scene=()=>({destroy(){destroyed++}});
 return (async()=>{
 const one=sample("F01");check(one.app.querySelector(".mtk-frame"),"fallback while waiting");let pending=deferred.shift();pending.resolve(scene());await Promise.resolve();await Promise.resolve();check(!one.app.querySelector(".mtk-frame")&&one.app.querySelector(".mtk-live-v221"),"activation");check(one.prompt.isConnected&&one.btn.isConnected&&one.action.isConnected,"node identity retained");
 api.reset();check(destroyed===1&&!one.prompt.isConnected,"cleanup");
 const two=sample("F05");pending=deferred.shift();pending.resolve(null);await Promise.resolve();await Promise.resolve();check(two.app.querySelector(".mtk-frame")&&two.btn.isConnected,"failed art fallback");
 const three=sample("F02");check(three.app.querySelector(".mtk-frame")&&deferred.length===0,"special task fallback");
 const four=sample("F21");pending=deferred.shift();pending.args.matchingAPI.mount({});pending.resolve(scene());await Promise.resolve();await Promise.resolve();check(four.app.querySelector(".mtk-live-v221")&&four.wrong.disabled,"F21 matching integration");
 const five=sample("F08",{wrong:1,helpView:true});pending=deferred.shift();pending.resolve(scene());await Promise.resolve();await Promise.resolve();check(five.extra.isConnected&&five.btn.parent.hidden&&five.prompt.parent.hidden&&five.extra.parent.classList.contains("mtk-teaching-body-v224")&&five.action.parent.classList.contains("mtk-teaching-actions-v224"),"help panel occupies question half");
 const six=sample("F06");pending=deferred.shift();api.reset();pending.resolve(scene());await Promise.resolve();await Promise.resolve();check(six.app.querySelector(".mtk-frame")&&!six.app.querySelector(".mtk-live-v221"),"stale load ignored");
 return {cases:6,notebook,destroyed};
 })();
})(source,(v,m)=>assert.ok(v,m)).then(r=>console.log('PASS v221 mock DOM',r),e=>{console.error(e);process.exitCode=1});

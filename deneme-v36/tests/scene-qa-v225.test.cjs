const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const get=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
console.log('PASS v225',(function verify(html,notebook,qa,bank,check){
 const line=(src,prefix)=>src.split("\n").find(x=>x.startsWith(prefix));
 const report=html.slice(html.indexOf("function reportSolved(obs)"),html.indexOf("function show()"));
 const functions=[line(html,"function read(key)"),line(html,"function save()"),report].join("\n");
 let cases=0;
 for(const preview of [true,false]){
  let reads=0,writes=0,events=[];const run={taskWrong:2,awaiting:false},storage={getItem(){reads++;return '{"old":true}'},setItem(){writes++}},window={parent:{postMessage(msg){events.push(msg)}}};
  const api=new Function("QA_PREVIEW","localStorage","run","history","RUN_KEY","HISTORY_KEY","window","location",functions+"\nreturn {read,save,reportSolved}")(preview,storage,run,{},"run","history",window,{origin:"https://test.example"});
  const read=api.read("history");api.save();api.reportSolved({id:"F01"});
  check(preview?reads===0&&writes===0&&read===null&&!run.awaiting&&events[0].source==="mtk-qa-v225":reads===1&&writes===4&&read.old&&run.awaiting&&events[0].source==="mathverse-v68-quiz","preview storage and event "+preview);cases++;
 }
 const load=notebook.slice(notebook.indexOf(" function load(){"),notebook.indexOf(" function status("));
 const persist=notebook.slice(notebook.indexOf(" function persist(){"),notebook.indexOf(" function scheduleSave("));
 // The test isolate has no native URLSearchParams; pass a minimal deterministic query parser.
 const Params=class{constructor(s){this.s=s}get(k){return this.s==="?preview=1"&&k==="preview"?"1":null}};
 for(const preview of [true,false]){
  let reads=0,writes=0;const mem=new Map(),storage={getItem(){reads++;return '{"previous":1}'},setItem(){writes++}};
  const test=new Function("location","localStorage","memory","question","note","keyFor","normalize","blank","status","URLSearchParams","let saveError=false;"+load+persist+"\nreturn {load,persist}")({search:preview?"?preview=1":""},storage,mem,{id:"q"},{test:1},id=>id,x=>x,()=>({blank:true}),()=>{},Params);
  const value=test.load();test.persist();check(preview?reads===0&&writes===0&&value.blank&&mem.has("q"):reads===1&&writes===1&&value.previous===1,"notebook isolation "+preview);cases++;
 }
 let combos=0,count=0;for(const id of bank.playOrder)for(const difficulty of ["kolay","orta","zor"]){const qs=bank.questions.filter(q=>q.obstacleId===id&&q.difficulty===difficulty);check(qs.length===10,id+difficulty);combos++;count+=qs.length}
 check(qa.includes('preview:"1"')&&qa.includes('previewQuestion:currentId')&&qa.includes('e.source!==el("frame").contentWindow'),"QA source checks");
 check(html.includes("if(!EMBED||window.parent===window||QA_PREVIEW)return;"),"normal ready disabled in preview");
 return {cases,combos,count};
})(get('forest-v70-quiz.html'),get('assets/math-notebook-v187.js'),get('scene-qa-v225.html'),JSON.parse(get('forest-questions-v147.json')),(v,m)=>assert.ok(v,m)));

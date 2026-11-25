const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const bank=JSON.parse(read("forest-questions-v147.json"));
const win={};
new Function("window",read("assets/f04-approved-v211.js"))(win);
const f=win.MTKF04ApprovedV211;
const questions=bank.questions.filter(q=>q.obstacleId==="F04");
const supers="⁰¹²³⁴⁵⁶⁷⁸⁹";
function power(s){const m=String(s).match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/);assert(m,"power "+s);return Number(m[1])**Number([...m[2]].map(c=>supers.indexOf(c)).join(""));}
function frac(s){const m=String(s).match(/(\d+)\/(\d+)/);if(m)return Number(m[1])/Number(m[2]);assert(s==="0","fraction "+s);return 0;}
function calculate(q){
 const m=new Map(q.visual.labels.map(e=>[e.anchor,e.value])),get=k=>m.get(k),values=[...m.values()];
 if(m.has("nokta"))return Number(get("katman"))*power(get("nokta"));
 if(m.has("kapalı_katman"))return (Number(get("toplam_katman"))-Number(get("kapalı_katman")))*power(get("açık_katman_ışığı"));
 if(m.has("uyarı_lambası"))return Number(get("katman"))*power(get("her_katman"))+Number(get("uyarı_lambası"));
 if(m.has("1. sönük"))return ["1. sönük","2. sönük","3. sönük"].reduce((sum,k)=>sum+power(get("her katman"))*(1-frac(get(k))),0);
 if(m.has("arızalı oran"))return Number(get("katman sayısı"))*power(get("bir katman"))*(1-frac(get("arızalı oran")));
 if(m.has("ilk sönük"))return power(get("ilk"))*(1-frac(get("ilk sönük")))+power(get("ikinci"));
 if(values.every(v=>/sönük/.test(v)))return values.reduce((s,v)=>s+power(v)*(1-frac(v)),0);
 if(values.every(v=>/kapanan/.test(v)))return values.reduce((s,v)=>s+power(v)*frac(v),0);
 if(values.every(v=>/yanan/.test(v)))return values.reduce((s,v)=>s+power(v)*frac(v),0)-power(values[0]);
 throw Error("Unknown F04 variant "+q.id);
}
assert.equal(questions.length,30);
let n=0;
for(const q of questions){
 const p=f.plan(q);
 assert.equal(p.length,q.visual.labels.length,q.id);
 assert.equal(new Set(p.map(x=>x.slot)).size,p.length,q.id);
 assert(p.every((x,i)=>x.raw===q.visual.labels[i].value&&x.anchor===q.visual.labels[i].anchor),q.id);
 assert(p.every(x=>x.box.every(Number.isFinite)&&x.box[0]-x.box[2]/2>=0&&x.box[0]+x.box[2]/2<=100&&x.box[1]-x.box[3]/2>=0&&x.box[1]+x.box[3]/2<=100),q.id);
 const result=calculate(q);
 assert.equal(result,Number(q.correctAnswer),q.id);
 assert.equal(q.options.filter(x=>Number(x)===result).length,1,q.id);
 n+=p.length;
}
assert.equal(n,90);
console.log("PASS F04: 30 independently calculated answers, 90 distinct live plaque labels");

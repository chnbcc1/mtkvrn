const assert=require("node:assert/strict");
const bank=require("../forest-questions-v147.json");
const layout=require("../assets/scene-plan-v214.js");
const fit=require("../assets/plaque-text-v216.js");
// Deterministic synthetic font-width model. Browser canvas metrics are used by
// mount() at runtime; this test is not a screenshot or real-device font test.
const measure=(s,n)=>[...s].reduce((sum,c)=>sum+(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵃ⁻⁺]/.test(c)?.42:/\s/.test(c)?.32:/[MW∜∛√]/.test(c)?.86:.64),0)*n;
const stats=[];
for(const dim of [195,300,390,600]){
 let total=0,small=0,multi=0;
 for(const q of bank.questions){
  const p=layout.plan(q),results=new Map();
  for(const l of p.labels){
   let w=l.box[2]*dim/100,h=l.box[3]*dim/100;if(l.rotation)[w,h]=[h,w];
   const r=fit.fit(l.value,w,h,measure,{maxSize:Math.max(12,Math.min(32,dim*.075))});
   assert(r&&r.size>0,q.id);
   assert.equal(r.lines.join("").replace(/\s/g,""),l.value.replace(/\s/g,""),q.id);
   assert(r.lines.every(s=>measure(s,r.size)<=r.width+1e-7),q.id);
   assert(r.lines.length*r.size*r.lineHeight<=r.height+1e-7,q.id);
   results.set(l.slot,r);total++;if(!r.readable)small++;if(r.lines.length>1)multi++;
  }
  const rows=fit.unreadableRows(p.labels,results);
  assert.equal(rows.length,p.labels.filter(l=>!results.get(l.slot).readable).length,q.id);
  for(const row of rows)assert.equal(row.value,p.labels.find(l=>l.slot===row.slot).value,q.id);
 }
 assert.equal(total,2081);stats.push({dim,total,small,multi});
}
for(const v of ["2⁻³","∛(3⁶)","1/4","4,5 × 10⁵","(√5 + √2)(√5 − √2)"]){
 for(const lines of fit.candidates(v))assert.equal(lines.join("").replace(/\s/g,""),v.replace(/\s/g,""));
}
assert.equal(fit.fit("2⁵",0,10,measure),null);
console.log(JSON.stringify(stats));
console.log("PASS v216: 8324 synthetic size checks, preserved math and readable fallback rows");

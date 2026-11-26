const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const F=require('../assets/step-format-v232.js'),R=require('../assets/f01-revision-v229.js'),T=require('../assets/teaching-v219.js'),bank=R.apply(require('../forest-questions-v147.json'));
console.log('PASS v232',(function check(F,T,bank,html,assert){
 const compact=s=>s.replace(/\s/g,"");let fields=0,equations=0,examples=0;
 for(const q of bank.questions){
  const ex=T.workedExample(q,bank.questions);assert(!!ex,q.id+" example");examples++;
  const inputs=[q.hint,q.solution,ex.solution,...(q.f01Guide?.first||[]),...(q.f01Guide?.second||[]),...(q.f03Guide?.first||[]),...(q.f03Guide?.second||[]),...(Array.isArray(q.f03Guide?.solution)?q.f03Guide.solution:[]),q.f01Guide?.solution,q.workedExample?.solution].filter(x=>typeof x==="string");
  for(const s of inputs){const rows=F.lines(s);assert(compact(rows.map(r=>r.text).join(""))===compact(s),q.id+" content preserved");assert(rows.every(r=>!/^[.,;:!?]+$/.test(r.text)),q.id+" orphan punctuation");fields++;equations+=rows.filter(r=>r.kind==="math").length;}
 }
 const sample=bank.questions.find(q=>q.id==="F01-O-05").solution,rows=F.lines(sample);
 for(const expr of ["5² = 25","25 ÷ 5 = 5","25 − 5 = 20","4³ = 64","64 ÷ 4 = 16","64 − 16 = 48","20 + 48 = 68"])assert(rows.some(r=>r.kind==="math"&&r.text.includes(expr)),expr);
 assert(F.lines("1,68 × 10⁶ = 1680000").length===1,"decimal chain");
 assert(F.lines("(a+b)(a−b)=a²−b²").length===1,"identity");
 assert(F.lines("3 × 2 = 6, 4 × 5 = 20").filter(r=>r.kind==="math").length===2,"comma steps");
 assert(html.includes('teachingText("p","mtk-teaching-step",explanation)')&&html.includes('teachingText("p","mtk-teaching-step",text)')&&html.includes('teachingText("p","mtk-example-solution-v232"')&&html.includes('return teachingText("div","feedback "+status,s)')&&html.includes("white-space:nowrap!important"),"all renderer paths");
 return {questions:bank.questions.length,fields,equations,examples,sample:rows};
})(F,T,bank,fs.readFileSync(path.join(__dirname,'../forest-v70-quiz.html'),'utf8'),(v,m)=>assert.ok(v,m)));

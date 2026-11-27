/* v241 — source-grounded symbolic teaching and numbered steps. */
(function(root){
"use strict";
const digits="⁰¹²³⁴⁵⁶⁷⁸⁹", sup=n=>String(n).replace(/[-0-9]/g,x=>x==="-"?"⁻":digits[Number(x)]);
const pow=(b,e)=>String(b)+sup(e);
const unsup=s=>Number([...s].map(c=>c==="⁻"?"-":digits.indexOf(c)).join(""));
const parse=s=>{const m=String(s).match(/^\s*(\d+)([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?:\s|$)/u);return m?[+m[1],unsup(m[2])]:null};
const expOf=(b,n)=>{if(!Number.isInteger(n)||n<1||b<2)return null;let e=0;while(n>1&&n%b===0){n/=b;e++}return n===1?e:null};
const baseOf=(b)=>{for(let x=2;x<b;x++){const e=expOf(x,b);if(e!==null)return [x,e]}return [b,1]};
const quotientRule="Tabanları aynı olan üslü sayılar bölünürken üsleri çıkarılır.";
const productRule="Tabanları aynı olan üslü sayılar çarpılırken üsleri toplanır.";
const powerRule="Bir üslü sayının kuvveti alınırken üsler çarpılır.";
const rootRule="Kökün derecesine uygun tam kuvvet çarpanını ayır. Aynı derecedeki köklerde çarpım ve bölüm kök içinde yapılabilir.";
const divisor=s=>{s=String(s).replace(/\s/g,"");if(/^÷\d+$/.test(s))return +s.slice(1);if(/^1\/\d+$/.test(s))return +s.slice(2);const m=s.match(/^×(\d+)⁻([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/u);if(m)return (+m[1])**unsup(m[2]);throw Error("F03 oran "+s)};
function divide(b,e,d){
 let k=expOf(b,d),prefix=[];
 if(k===null){const [x,m]=baseOf(b);k=expOf(x,d);if(k===null)throw Error("Ortak taban yok "+b+"/"+d);prefix=[pow(b,e)+" = "+pow(x,m*e)];b=x;e*=m;}
 return {b,e:e-k,rows:[...prefix,pow(b,e)+"/"+pow(b,k)+" = "+b+"^("+e+"−"+k+")",b+"^("+e+"−"+k+") = "+pow(b,e-k)],den:d===b?null:String(d)+" = "+pow(b,k)};
}
const F03_EQUATIONS={
  "F03-Z-04": {
    "base": 2,
    "terms": [
      [
        2,
        "n"
      ],
      [
        2,
        -3
      ],
      [
        2,
        -2
      ],
      [
        2,
        -4
      ]
    ],
    "out": 16,
    "ask": "n",
    "topic": "Girişte bilinmeyen üs",
    "eq": "n−9",
    "rhs": 4,
    "solve": [
      "n − 9 = 4",
      "n = 4 + 9",
      "n = 13"
    ],
    "answer": 13,
    "options": [
      "9",
      "13",
      "5",
      "16"
    ]
  },
  "F03-Z-05": {
    "base": 3,
    "terms": [
      [
        3,
        "n"
      ],
      [
        3,
        -1
      ],
      [
        3,
        -2
      ],
      [
        3,
        -1
      ]
    ],
    "out": 81,
    "ask": "n",
    "topic": "Girişte bilinmeyen üs",
    "eq": "n−4",
    "rhs": 4,
    "solve": [
      "n − 4 = 4",
      "n = 4 + 4",
      "n = 8"
    ],
    "answer": 8,
    "options": [
      "4",
      "12",
      "6",
      "8"
    ]
  },
  "F03-Z-06": {
    "base": 5,
    "terms": [
      [
        5,
        8
      ],
      [
        5,
        -1
      ],
      [
        5,
        "−n"
      ],
      [
        5,
        -2
      ]
    ],
    "out": 25,
    "ask": "n",
    "topic": "Filtrede bilinmeyen üs",
    "eq": "5−n",
    "rhs": 2,
    "solve": [
      "5 − n = 2",
      "n = 5 − 2",
      "n = 3"
    ],
    "answer": 3,
    "options": [
      "3",
      "5",
      "2",
      "7"
    ]
  },
  "F03-Z-07": {
    "base": 4,
    "terms": [
      [
        4,
        7
      ],
      [
        4,
        "−n"
      ],
      [
        4,
        -1
      ],
      [
        4,
        -2
      ]
    ],
    "out": 16,
    "ask": "n",
    "topic": "Filtrede bilinmeyen üs",
    "eq": "4−n",
    "rhs": 2,
    "solve": [
      "4 − n = 2",
      "n = 4 − 2",
      "n = 2"
    ],
    "answer": 2,
    "options": [
      "4",
      "1",
      "2",
      "5"
    ]
  },
  "F03-Z-08": {
    "base": 2,
    "terms": [
      [
        2,
        "n"
      ],
      [
        2,
        "−a"
      ],
      [
        2,
        -2
      ],
      [
        2,
        -3
      ]
    ],
    "out": 16,
    "ask": "a",
    "relation": "n = 2a",
    "topic": "İki değişkenli üslü denklem",
    "eq": "n−a−5",
    "rhs": 4,
    "solve": [
      "n − a − 5 = 4",
      "n − a = 9",
      "n = 2a",
      "2a − a = 9",
      "a = 9"
    ],
    "answer": 9,
    "options": [
      "5",
      "9",
      "18",
      "4"
    ]
  },
  "F03-Z-09": {
    "base": 6,
    "terms": [
      [
        6,
        9
      ],
      [
        6,
        "−a"
      ],
      [
        6,
        "−b"
      ],
      [
        6,
        -1
      ]
    ],
    "out": 216,
    "ask": "a + b",
    "topic": "İki değişkenli üslü denklem",
    "eq": "8−a−b",
    "rhs": 3,
    "solve": [
      "8 − a − b = 3",
      "a + b = 8 − 3",
      "a + b = 5"
    ],
    "answer": 5,
    "options": [
      "8",
      "3",
      "6",
      "5"
    ]
  },
  "F03-Z-10": {
    "base": 2,
    "terms": [
      [
        4,
        "n"
      ],
      [
        2,
        -3
      ],
      [
        8,
        -1
      ],
      [
        2,
        -2
      ]
    ],
    "out": 64,
    "ask": "n",
    "topic": "Farklı tabanlarda bilinmeyen üs",
    "eq": "2n−8",
    "rhs": 6,
    "solve": [
      "2n − 8 = 6",
      "2n = 6 + 8",
      "2n = 14",
      "n = 14/2",
      "n = 7"
    ],
    "answer": 7,
    "options": [
      "7",
      "14",
      "5",
      "4"
    ]
  }
};
function f03EquationText(b,e){return typeof e==="number"?pow(b,e):String(b)+[...e].map(c=>({"n":"ⁿ","a":"ᵃ","b":"ᵇ","−":"⁻"}[c]||c)).join("");}
function reviseF03Equation(q){
 const s=F03_EQUATIONS[q.id];if(!s)return null;
 const ts=s.terms.map(([b,e])=>f03EquationText(b,e));
 const prompt="Sis türbinine "+ts[0]+" birim sis giriyor. 1. filtreye gelen sis miktarının "+ts[1]+" katı, 2. filtreye aktarılıyor. 2. filtreye gelen sis miktarının "+ts[2]+" katı, 3. filtreye aktarılıyor. 3. filtreye gelen sis miktarının "+ts[3]+" katı, gözlem tüpüne yönlendiriliyor. Gözlem tüpüne "+s.out+" birim sis ulaştığına göre "+(s.relation?s.relation+" ise ":"")+s.ask+" kaçtır?";
 const labels=["giriş","filtre 1","filtre 2","filtre 3","çıkış"].map((anchor,i)=>({anchor,value:i===0?ts[0]:i===4?String(s.out):"× "+ts[i]}));
 return {...q,prompt,topic:s.topic,options:s.options,correctAnswer:String(s.answer),visual:{...q.visual,labels},f03EquationV249:true};
}
function f03EquationGuide(q){
 const s=F03_EQUATIONS[q.id],terms=s.terms.map(([b,e])=>f03EquationText(b,e));
 const expression=terms.join(" · "),mixed=s.terms.some(([b])=>b!==s.base);
 const normalized=s.terms.map(([b,e])=>{const m=expOf(s.base,b);if(m===null)throw Error(q.id+" taban");return typeof e==="number"?pow(s.base,e*m):m===1?f03EquationText(s.base,e):s.base+"^("+m+e+")";});
 const normalizedExpr=normalized.join(" · "),exponent=s.base+"^("+s.eq+")",right=pow(s.base,s.rhs);
 if(s.base**s.rhs!==s.out||!s.options.includes(String(s.answer))||new Set(s.options).size!==4)throw Error(q.id+" denklem seçenekleri");
 const equation=expression+" = "+s.out;
 const first=[mixed?"Önce bütün kuvvetleri 2 tabanında yaz. Sonra aynı tabanlı kuvvetleri çarparken üsleri topla.":"Üç filtrenin çarpanını başlangıçtaki sisle çarp ve sonucu verilen çıkış miktarına eşitle.",productRule,"Çıkış miktarını "+s.base+" tabanında yaz. Tabanlar eşit olunca üsleri eşitle."];
 const second=["Verilenlerle denklemi kuralım:\n"+equation,...(mixed?["4 ve 8'i 2'nin kuvveti olarak yaz:\n4ⁿ = (2²)ⁿ\n8⁻¹ = (2³)⁻¹"]:[]),"Çıkış miktarını aynı tabanda göster:\n"+s.out+" = "+right,"Üsleri topla ve eşitle."+(s.relation?" Verilen "+s.relation+" ilişkisini kullan.":"")+" İstenen "+s.ask+" ifadesini kendin bul."];
 const solution=["Verilen giriş, üç filtre ve çıkışla denklemi kuralım:\n"+equation];
 if(mixed)solution.push(powerRule,"Tabanları eşitleyelim:\n4ⁿ = (2²)ⁿ\n(2²)ⁿ = 2^(2n)\n8⁻¹ = (2³)⁻¹\n(2³)⁻¹ = 2⁻³","Denklemi 2 tabanında yazalım:\n"+normalizedExpr+" = "+s.out);
 solution.push(productRule,"Üsleri birleştirelim:\n"+(mixed?normalizedExpr:expression)+" = "+exponent+"\n"+exponent+" = "+s.out,"Çıkış miktarını aynı tabanda yazalım:\n"+s.out+" = "+right+"\n"+exponent+" = "+right,"Tabanlar eşit olduğundan üsleri eşitleyelim:\n"+s.solve.join("\n"),"Sonuç: "+s.ask+" = "+s.answer);
 return {first,second,solution};
}
function migrateRun(run){if(!run||run.f03EquationRevision==="v249")return run;const id=run.remediationId||run.practiceId||run.activeId;if(F03_EQUATIONS[id]&&!run.awaiting)Object.assign(run,{stage:0,wrong:0,wrongChoices:[],revealed:false,helpView:false,stageCorrect:false,feedback:""});run.f03EquationRevision="v249";return run;}
function reviseF03Hard(q){
 const equation=reviseF03Equation(q);if(equation)return equation;
 if(q.obstacleId!=="F03"||q.difficulty!=="zor"||q.f03NegativeV248)return q;
 const ls=q.visual.labels,[b,e]=parse(ls[0].value);
 if(ls.length!==5)throw Error(q.id+" filtre sayısı");
 const ks=ls.slice(1).map(l=>expOf(b,divisor(l.value)));
 if(ks.some(k=>k===null||k<1))throw Error(q.id+" negatif üs");
 const p=ks.map(k=>pow(b,-k));
 const end=/dört eşit toplama haznesine/u.test(q.prompt)?"hazne":/iki eşit gözlem tüpüne/u.test(q.prompt)?"iki tüp":"tüp";
 const tail=end==="hazne"?"Son filtreden çıkan sis dört eşit toplama haznesine paylaştırılıyor. Her hazneye çıkan sis miktarının "+p[3]+" katı ulaşıyor. Bir haznede kaç birim sis bulunur?":end==="iki tüp"?"Son filtreden çıkan sis iki eşit gözlem tüpüne paylaştırılıyor. Her tüpe çıkan sis miktarının "+p[3]+" katı ulaşıyor. Bir tüpe kaç birim sis ulaşır?":"Son olarak çıkan sis miktarının "+p[3]+" katı, gözlem tüpüne yönlendiriliyor. Gözlem tüpüne kaç birim sis ulaşır?";
 const prompt="Sis türbinine "+pow(b,e)+" birim sis giriyor. 1. filtreye gelen sis miktarının "+p[0]+" katı, 2. filtreye aktarılıyor. 2. filtreye gelen sis miktarının "+p[1]+" katı, 3. filtreye aktarılıyor. 3. filtreye gelen sis miktarının "+p[2]+" katı, filtreden geçiyor. "+tail;
 return {...q,prompt,visual:{...q.visual,labels:ls.map((l,i)=>i?{...l,value:"× "+p[i-1]}:l)},f03NegativeV248:true};
}
function f03NegativeGuide(q){
 const ls=q.visual.labels,[b,e]=parse(ls[0].value),ps=ls.slice(1).map(l=>parse(l.value.replace(/^×\s*/u,"")));
 if(ps.length!==4||ps.some(p=>!p||p[0]!==b||p[1]>=0))throw Error(q.id+" negatif çarpan");
 const k=ps.map(p=>p[1]),p=k.map(n=>pow(b,n)),exponent=e+k.reduce((s,n)=>s+n,0),ans=b**exponent;
 if(String(ans)!==q.correctAnswer)throw Error(q.id+" sonuç "+ans);
 const destination=/haznede/u.test(q.prompt)?"Bir toplama haznesine":/Bir tüpe/u.test(q.prompt)?"Bir gözlem tüpüne":"Gözlem tüpüne";
 const first=["Her filtreye ulaşan sis miktarını o filtrenin negatif üslü çarpanıyla çarp. Son aktarımda da "+p[3]+" ile çarp.",productRule];
 const second=["İlk filtre işlemini kuralıyla yapalım:\n"+pow(b,e)+" · "+p[0]+" = "+b+"^("+e+"−"+Math.abs(k[0])+")\n"+b+"^("+e+"−"+Math.abs(k[0])+") = "+pow(b,e+k[0]),"Kalan üç çarpanı sırayla uygula. Üsleri toplayarak son kuvveti kendin bul."];
 const rows=[productRule,"Başlangıçtaki sis:\n"+pow(b,e)];
 let cur=e;
 for(let i=0;i<4;i++){const n=cur+k[i],expr=b+"^("+cur+"−"+Math.abs(k[i])+")";rows.push((i<3?(i+1)+". filtreyi geçen sis":destination+" ulaşan sis")+":\n"+pow(b,cur)+" · "+p[i]+" = "+expr+"\n"+expr+" = "+pow(b,n));cur=n;}
 const chain=[pow(b,e),...p].join(" · "),exp=b+"^("+e+k.map(n=>"−"+Math.abs(n)).join("")+")";
 rows.push("Tüm işlemi tek bir üslü çarpımda da gösterebiliriz:\n"+chain+" = "+exp+"\n"+exp+" = "+pow(b,exponent),"Son kuvvetin değerini hesaplayalım:\n"+pow(b,exponent)+" = "+ans,"Sonuç: "+ans+" birim sis.");
 return {first,second,solution:rows};
}
function f03(q){
 if(q.f03EquationV249)return f03EquationGuide(q);
 if(q.f03NegativeV248)return f03NegativeGuide(q);
 const l=q.visual.labels.map(x=>x.value),a=q.visual.labels.map(x=>x.anchor),steps=[],first=[quotientRule,productRule],second=[quotientRule];let result;
 const divStep=(b,e,d,title)=>{const z=divide(b,e,d);return {b:z.b,e:z.e,text:[title+":",...(z.den?[z.den]:[]),...z.rows].join("\n")}};
 if(a[0]==="A borusu"){
  const [b,e]=parse(l[0]),[c,f]=parse(l[1]),x=divStep(b,e,divisor(l[2]),"A borusundan geçen sis"),y=divStep(c,f,divisor(l[3]),"B borusundan geçen sis");result=x.b**x.e+y.b**y.e;
  first.push("A ve B boruları bağımsızdır. Her kolda aynı tabana getirip üsleri çıkar, en son iki kolu topla.");
  second.push(x.text,"B kolundaki oranı aynı kuralla uygula ve iki sonucu topla.");
  steps.push(x.text,y.text,"İki kolun toplamı:\n"+pow(x.b,x.e)+" + "+pow(y.b,y.e)+" = "+(x.b**x.e)+" + "+(y.b**y.e)+"\n"+(x.b**x.e)+" + "+(y.b**y.e)+" = "+result);
 }else if(a[1]==="ayrılan"){
  const [b,e]=parse(l[0]),x=divStep(b,e,divisor(l[1]),"Yan kola ayrılan sis");result=b**e-x.b**x.e;
  first.push("Yan kola ayrılan miktarı üslü bölme ile bul. Ana hatta kalan için başlangıçtaki sis miktarından çıkar.");
  second.push(x.text,"Ana hatta kalan miktarı başlangıçtan bu kuvveti çıkararak bul.");
  steps.push(x.text);
  steps.push("Kalan sis miktarını bulalım:\n"+pow(b,e)+" − "+pow(x.b,x.e)+" = "+(b**e)+" − "+(x.b**x.e)+"\n"+(b**e)+" − "+(x.b**x.e)+" = "+result);
 }else{
  let [b,e]=parse(l[0]);const initial=pow(b,e);
  const ds=a[1]==="filtre_sayısı"?Array(Number(l[1])).fill(divisor(l[2])):l.slice(1).map(divisor);
  first.push("Her aşamada yalnız o aşamaya ulaşan sis kullanılır. Bölünen sayıyı ve böleni aynı tabanın kuvveti olarak yaz.");
  const x=divide(b,e,ds[0]);if(ds.length>1)second.push(divStep(b,e,ds[0],"İlk geçiş").text,"Kalan geçişlerde de bölenlerin üslerini sırayla çıkar. Son kuvvetin değerini en son hesapla.");
  else second.push("Bölme işlemini aynı tabanda kur:\n"+pow(x.b,x.e+(expOf(x.b,ds[0])||0))+"/"+pow(x.b,expOf(x.b,ds[0])),"Payın üssünden paydanın üssünü çıkar. Sonucu kendin hesapla.");
  steps.push("Başlangıç miktarını üslü biçimde tutalım:\n"+initial);
  for(let i=0;i<ds.length;i++){const title=a[0]==="çıkış"?"Gözlem tüpüne aktarılan sis":i===ds.length-1&&/gözlem|tüp/.test(a.at(-1))?"Son aktarım":(i+1)+". geçiş";const z=divStep(b,e,ds[i],title);steps.push(z.text);b=z.b;e=z.e;}
  result=b**e;steps.push("Son kuvvetin sayısal değerini bulalım:\n"+pow(b,e)+" = "+result);
 }
 if(String(result)!==q.correctAnswer)throw Error(q.id+" hesap "+result+" ≠ "+q.correctAnswer);
 return {first,second,solution:[quotientRule, ...steps,"Sonuç: "+result+" birim sis."]};
}
function algebra(q){
 const l=q.visual.labels.map(x=>x.value),total=Number(String(l.at(-1)).match(/\d+/)?.[0]);
 if(q.obstacleId==="F06"&&l[0].includes("ⁿ")){
  const v=total*2/11,ans=2*v;if(String(ans)!==q.correctAnswer)throw Error(q.id);
  return {first:[productRule,quotientRule,"Üç adanın toplamını yaz. Ortak çarpan 2ⁿ olsun."],second:["B adasını ve C adasını 2ⁿ cinsinden yaz:\n2ⁿ⁺¹ = 2ⁿ · 2\n2ⁿ⁻¹ = 2ⁿ/2","Üç terimi 2ⁿ parantezine alıp denklemi çöz."],solution:["Üç adanın toplamı:\n3 · 2ⁿ + 2ⁿ⁺¹ + 2ⁿ⁻¹ = "+total,productRule+"\n2ⁿ⁺¹ = 2ⁿ · 2",quotientRule+"\n2ⁿ⁻¹ = 2ⁿ/2","Ortak çarpanı ayır:\n2ⁿ · (3 + 2 + 1/2) = "+total+"\n2ⁿ · (11/2) = "+total,"Her iki tarafı 2/11 ile çarp:\n2ⁿ = "+total+" · 2/11\n2ⁿ = "+v,"B adasının miktarı:\n2ⁿ⁺¹ = 2ⁿ · 2\n"+v+" · 2 = "+ans]};
 }
 if(q.obstacleId==="F13"&&l[0].includes("ⁿ")){
  const v=total*2/15,ans=4*v;if(String(ans)!==q.correctAnswer)throw Error(q.id);
  return {first:[productRule,quotientRule,"Dört yüzün toplamında ortak 2ⁿ çarpanını ayır. En büyük üs en çok işareti gösterir."],second:["Kuvvetleri 2ⁿ cinsinden aç:\n2ⁿ⁻¹ = 2ⁿ/2\n2ⁿ⁺¹ = 2ⁿ · 2\n2ⁿ⁺² = 2ⁿ · 4","Toplamı ortak çarpanla yaz ve 2ⁿ değerini bul."],solution:[productRule,quotientRule,"Dört yüzün toplamı:\n2ⁿ⁻¹ + 2ⁿ + 2ⁿ⁺¹ + 2ⁿ⁺² = "+total,"Ortak çarpanı ayır:\n2ⁿ · (1/2 + 1 + 2 + 4) = "+total+"\n2ⁿ · (15/2) = "+total,"Her iki tarafı 2/15 ile çarp:\n2ⁿ = "+total+" · 2/15\n2ⁿ = "+v,"En büyük kuvvet:\n2ⁿ⁺² = 2ⁿ · 4\n"+v+" · 4 = "+ans]};
 }
 return null;
}
function exactPower(q){
 const l=q.visual.labels.map(x=>String(x.value)),topic=q.topic.toLocaleLowerCase("tr");
 let expr=null,answerMode="value";
 if(q.obstacleId==="F14"&&q.difficulty==="zor"){expr=l[0];answerMode=q.id==="F14-Z-01"?"slot":"exponent";}
 else if(q.obstacleId==="F14"&&q.difficulty==="orta"){
  if(l[0].includes("÷")||l[0].includes("×")||l[0].includes("·"))expr=l[0];else if(parse(l[0])&&/^\d+$/.test(l[1]))expr=l[0]+" ÷ "+l[1];
  answerMode=/^[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+$/.test(q.correctAnswer)?"exponent":"auto";
 }else if(q.obstacleId==="F09"&&q.difficulty==="kolay"&&/bölme/.test(topic))expr=l[0].replace(/\s*m$/,"")+" ÷ "+l[1];
 else if(q.obstacleId==="F05"&&(/sıfırıncı|üslerin toplamı|negatif üs ile çarpma/.test(topic)))expr=l[0]+" · "+l[1];
 else if(q.obstacleId==="F17"&&q.difficulty==="kolay"&&/üs kurallarıyla çarpma/.test(topic))expr=l[0]+" · "+l[1].replace(/\s*g$/,"");
 else if(q.obstacleId==="F10"&&q.difficulty==="kolay"&&/dizilim/.test(topic))expr=l[0]+" · "+l[1];
 if(!expr)return null;
 const s=expr.replace(/\s/g,"").replace(/[()]/g,"").replace(/×/g,"·");
 if(!/^\d+[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*(?:[·÷]\d+[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)+$/u.test(s))return null;
 const terms=[...s.matchAll(/([·÷]?)(\d+)([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*)/gu)].map(m=>({op:m[1],b:+m[2],e:m[3]?unsup(m[3]):1}));
 let base=baseOf(terms[0].b)[0];if(!terms.every(t=>expOf(base,t.b)!==null))return null;
 const changes=terms.map(t=>({...t,k:expOf(base,t.b)*t.e})),exponent=changes.reduce((v,t)=>v+(t.op==="÷"?-t.k:t.k),0),v=base**exponent;
 const ans=String(q.correctAnswer),frac=exponent<0?"1/"+base**(-exponent):String(v);
 if(answerMode==="slot"){const slot=l.find(x=>x.startsWith(ans.split(".")[0]+":"));const p=slot&&parse(slot.split(":")[1].trim());if(!p||p[0]**p[1]!==v)return null;}
 else if(answerMode==="exponent"){if(ans!==String(exponent))return null;}
 else if(![String(v),frac,pow(base,exponent),String(exponent)].includes(ans)){const equivalent=parse(ans);if(!equivalent||equivalent[0]**equivalent[1]!==v)return null;}
 const normalized=changes.map(t=>(t.op?" "+t.op+" ":"")+pow(base,t.k)).join("");
 const arithmetic=changes.map(t=>(t.op?(t.op==="÷"?"−":"+"):"")+(t.k<0?"("+t.k+")":t.k)).join("");
 const conversions=changes.filter(t=>t.b!==base).map(t=>pow(t.b,t.e)+" = "+pow(base,t.k));
 const final=answerMode==="exponent"?"İstenen üs: "+exponent:answerMode==="slot"?"Bu değer "+ans+" ile eşleşir.":parse(ans)&&ans!==pow(base,exponent)?pow(base,exponent)+" = "+ans:pow(base,exponent)+" = "+frac;
 return {first:[productRule,quotientRule,powerRule,"Bütün çarpanları mümkünse "+base+" tabanında yaz; işlem işaretlerine göre üsleri birleştir."],second:[powerRule,...(conversions.length?["Tabanları eşitleyelim:\n"+conversions.join("\n")]:["Tabanlar zaten eşit."]), "Üs işlemini kur:\n"+arithmetic,"İşlemi tamamlayıp sorunun istediği gösterimi seç."],solution:[productRule,quotientRule,...(conversions.length?[powerRule+"\n"+conversions.join("\n")]:[]),"İfadeyi aynı tabanda yaz:\n"+normalized,"Üsleri birleştir:\n"+normalized+" = "+base+"^("+arithmetic+")\n"+base+"^("+arithmetic+") = "+pow(base,exponent),final]};
}
function rootWork(q){
 const raw=q.visual.labels.map(l=>String(l.value)).join(" ");const out=[],seen=new Set();
 for(const m of raw.matchAll(/([√∛∜])(?:\((\d+)\)|(\d+))/gu)){
  const sym=m[1],n=+(m[2]||m[3]),degree={"√":2,"∛":3,"∜":4}[sym],key=sym+n;if(seen.has(key)||n<1)continue;seen.add(key);
  if(degree===4&&Number.isInteger(Math.sqrt(n))){
   const k=Math.sqrt(n);out.push(key+" = √"+k);
   let d=Math.floor(Math.sqrt(k));while(d>1&&k%(d*d))d--;if(d>1)out.push("√"+k+" = √("+d+"² · "+k/(d*d)+")\n√"+k+" = "+(k===d*d?d:d+"√"+k/(d*d)));continue;
  }
  let d=Math.floor(n**(1/degree)+1e-8);while(d>1&&n%d**degree)d--;if(d>1){const rem=n/d**degree;out.push(key+" = "+sym+"("+pow(d,degree)+" · "+rem+")\n"+key+" = "+(rem===1?d:d+sym+rem));}
 }
 for(const m of raw.matchAll(/([√∛∜])\((\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)\)/gu)){
  const sym=m[1],b=+m[2],e=unsup(m[3]),n={"√":2,"∛":3,"∜":4}[sym];
  if(e%n===0&&!seen.has(m[0])){seen.add(m[0]);out.push(m[0]+" = "+b+"^("+e+"/"+n+")\n"+m[0]+" = "+pow(b,e/n));}
 }
 return out;
}
function supplemental(q){return null;} // v242: no speculative topic-wide rule injection.

function simplePower(q){
 const labels=q.visual.labels.map(x=>String(x.value)),topic=String(q.topic).toLocaleLowerCase("tr");
 if(q.obstacleId==="F01"||q.obstacleId==="F02")return null;
 if(q.obstacleId==="F05"&&labels.length===1){
  const p=parse(labels[0]);if(!p||p[1]>=0)return null;const [b,e]=p,den=b**(-e),result="1/"+den;
  if(q.correctAnswer!==result)return null;
  return {first:["Negatif üs işaretin negatif olduğu anlamına gelmez. Sıfırdan farklı a için a⁻ⁿ = 1/aⁿ."],second:["Verilen "+labels[0]+" ifadesinde üssün işaretini değiştirerek kuvveti paydada yaz. Pay 1 olmalı."],solution:["Negatif üs kuralı:\na⁻ⁿ = 1/aⁿ","Verilen ifadeyi dönüştür:\n"+labels[0]+" = 1/"+pow(b,-e),"Paydadaki kuvveti hesapla:\n"+labels[0]+" = "+result]};
 }
 if(labels.length!==2||!labels.every(x=>/^\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+(?:\s*(?:m|L|cm))?$/u.test(x)))return null;
 const [p,z]=labels.map(parse);if(!p||!z)return null;const [b,e]=p,[c,f]=z;
 const addition=/topla|birlikte|sayma/.test(topic),subtraction=/fark|çıkar|eksik/.test(topic);if(addition===subtraction)return null;
 const sign=addition?"+":"−",ans=addition?b**e+c**f:b**e-c**f;if(String(ans)!==q.correctAnswer)return null;
 const original=pow(b,e)+" "+sign+" "+pow(c,f),numeric=(b**e)+" "+sign+" "+(c**f);
 return {first:["Toplama ve çıkarmada üsler doğrudan birleştirilmez.","Her üslü sayının değerini bul, ardından "+(addition?"topla.":"çıkar.")],second:["İşlemi kur:\n"+original,"Kuvvetleri ayrı ayrı hesapla ve işlemi kendin tamamla."],solution:["Üslü sayıları "+(addition?"toplarken":"çıkarırken")+" üsler doğrudan birleştirilmez.","Kuvvetlerin değerlerini hesaplayalım:\n"+original+" = "+numeric,numeric+" = "+ans]};

}


function exactRoot(q){
 if(!["F07","F09","F10","F19"].includes(q.obstacleId))return null;
 const t=String(q.topic).toLocaleLowerCase("tr"),l=q.visual.labels.map(x=>String(x.value));
 function parseRoot(s){const z=s.trim().match(/^(\d*)([√∛∜])(?:\((\d+)\)|(\d+))(?:\s*(?:m|cm|birim))?$/u);return z?{c:Number(z[1]||1),s:z[2],n:Number(z[3]||z[4]),d:{"√":2,"∛":3,"∜":4}[z[2]]}:null;}
 const fmt=(c,s,n)=>n===1?String(c):(c===1?"":c===0?"0":String(c))+s+n;
 const value=x=>x.c*x.n**(1/x.d);
 function valid(expr){const ans=String(q.correctAnswer).trim().replace(/\s*(?:m²|cm²|m|cm|birim|taş)$/u,"");const p=parseRoot(expr),z=parseRoot(ans);const a=p?value(p):Number(expr),b=z?value(z):Number(ans);return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b));}
 const x=parseRoot(l[0]),y=parseRoot(l[1]||"");if(!x)return null;
 const r=x.s+x.n,A=fmt(x.c,x.s,x.n);
 let c,formula,rule,method,steps;
 if(q.obstacleId==="F07"&&/karesi/.test(t)&&l.length===1){
  if(x.d!==2&&x.d!==4)return null;
  const n=x.d===2?x.n:Math.sqrt(x.n);if(!Number.isInteger(n))return null;
  c=x.c*x.c*n;if(!valid(String(c)))return null;
  const square=x.d===2?String(x.n):"√"+x.n;
  rule="Çarpımın karesi alınırken her çarpanın karesi alınır. Kök derecesi ile üs sadeleştirilir.";
  method="Karenin alanı için kenar uzunluğunun karesini al. Katsayının karesini ve köklü kısmın karesini ayrı hesapla.";
  steps=["Alanı kenarın karesi olarak yaz:\n("+A+")²", "Çarpımın karesini dağıt:\n("+A+")² = "+x.c+"² · ("+r+")²","Köklü kısmın karesi:\n("+r+")² = "+square,...(x.d===4?["Karekökü sadeleştir:\n"+square+" = "+n]:[]),"Alanı hesapla:\n"+x.c+"² · "+n+" = "+(x.c*x.c)+" · "+n+"\n"+(x.c*x.c)+" · "+n+" = "+c];
 }else if(q.obstacleId==="F07"&&/çevre/.test(t)&&l.length===1){
  c=4*x.c;formula="4 · "+A;rule="Köklü ifadeyi tam sayıyla çarparken katsayı çarpılır, köklü kısım değişmez.";method="Karenin dört eşit kenarı vardır. Bir kenarı dörtle çarp.";steps=[method+"\n"+formula,"Katsayıları çarp:\n"+formula+" = (4 · "+x.c+") · "+r+"\n(4 · "+x.c+") · "+r+" = "+fmt(c,x.s,x.n)];if(!valid(fmt(c,x.s,x.n)))return null;
 }else{
  if(!y)return null;const z=l.length>=3?parseRoot(l[2]):null;
  if(x.d!==y.d||x.n!==y.n||z&&(z.d!==x.d||z.n!==x.n))return null;
  const B=fmt(y.c,y.s,y.n);
  if(q.obstacleId==="F10"&&/çevre/.test(t)&&l.length===2){c=2*(x.c+y.c);formula="2 · ("+A+" + "+B+")";method="Dikdörtgenin çevresi için uzun ve kısa kenarı topla, toplamın iki katını al.";steps=[method+"\n"+formula,"Ortak köklü kısmı ayır:\n"+formula+" = 2 · ("+x.c+" + "+y.c+") · "+r,"\n2 · ("+x.c+" + "+y.c+") · "+r+" = "+fmt(c,x.s,x.n)];}
  else if(q.obstacleId==="F10"&&/kenar uzunluğu farkı/.test(t)&&l.length===2){c=2*(x.c-y.c);formula="2 · ("+A+" − "+B+")";method="İki uzun kenarın toplamından iki kısa kenarın toplamını çıkar.";steps=[method+"\n"+formula,"Köklü kısım ortak:\n"+formula+" = 2 · ("+x.c+" − "+y.c+") · "+r,"\n2 · ("+x.c+" − "+y.c+") · "+r+" = "+fmt(c,x.s,x.n)];}
  else if(q.obstacleId==="F09"&&/paylaştırma/.test(t)&&/^\d+ eş parça$/.test(l[2]||"")){const n=Number(l[2].split(" ")[0]);c=(x.c-y.c)/n;formula="("+A+" − "+B+") ÷ "+n;method="Önce kesilen kısmı çıkar, kalan uzunluğu eş parçalara böl.";steps=[method+"\n"+formula,"Ortak köklü kısmı ayır:\n"+formula+" = ("+x.c+" − "+y.c+") · "+r+" ÷ "+n,"Katsayıyı böl:\n"+(x.c-y.c)+" · "+r+" ÷ "+n+" = "+fmt(c,x.s,x.n)];}
  else if((q.obstacleId==="F09"||q.obstacleId==="F19")&&z&&l.length===3&&/birleş|örtüş|destek toplamı/.test(t)){c=x.c+y.c-z.c;const C=fmt(z.c,z.s,z.n);formula=A+" + "+B+" − "+C;method="İki uzunluğu topla; ortak veya belirtilen çıkarılacak kısmı yalnız bir kez çıkar.";steps=[method+"\n"+formula,"Ortak köklü kısmı ayır:\n"+formula+" = ("+x.c+" + "+y.c+" − "+z.c+") · "+r,"\n("+x.c+" + "+y.c+" − "+z.c+") · "+r+" = "+fmt(c,x.s,x.n)];}
  else if(l.length===2&&/topla|fark|çıkar/.test(t)){const subtract=/fark|çıkar/.test(t),op=subtract?"−":"+";c=subtract?x.c-y.c:x.c+y.c;formula=A+" "+op+" "+B;method=subtract?"Aynı köklü uzunlukların farkını bul.":"Aynı köklü uzunlukları topla.";steps=[method+"\n"+formula,"Köklü kısmı ortak çarpan olarak yaz:\n"+formula+" = ("+x.c+" "+op+" "+y.c+") · "+r,"\n("+x.c+" "+op+" "+y.c+") · "+r+" = "+fmt(c,x.s,x.n)];}
  else return null;
  if(!Number.isInteger(c)||c<1||!valid(fmt(c,x.s,x.n)))return null;
  rule="Kök derecesi ve kök içi aynıysa toplama ve çıkarmada yalnız katsayılar işleme girer. Tam sayıyla çarpma veya bölmede de katsayı işlem görür.";
 }
 return {first:[rule,method],second:[rule,formula?"İşlemi kur:\n"+formula:"Kenarın karesini kur:\n("+A+")²","Köklü kısmı ve katsayıyı ayrı değerlendir; sonucu kendin tamamla."],solution:[rule,...steps,"Sonuç: "+q.correctAnswer]};
}


function growthGuide(q){
 if(q.obstacleId!=="F01")return null;
 const l=Object.fromEntries(q.visual.labels.map(x=>[x.anchor,String(x.value)]));
 if(l.ilk_dal&&l.büyüme&&l.gün){
  const start=Number(l.ilk_dal),b=Number(l.büyüme.match(/\d+/)?.[0]),day=Number(l.gün),e=day-1,ans=start*b**e;
  if(String(ans)!==q.correctAnswer)return null;
  const same=expOf(b,start),expr=start+" · "+pow(b,e);
  const rule=same!==null&&same>0?productRule:"Aynı sayının tekrarlı çarpımı üslü olarak yazılabilir.";
  return {first:["İlk gün başlangıçtır. Her yeni gün için bir kez "+b+" ile çarpılır.",rule],second:["Büyüme sayısını bul:\n"+day+" − 1 = "+e,"Başlangıç miktarını büyüme çarpanının "+e+". kuvvetiyle çarp:\n"+expr],solution:["İlk gün "+start+" tomurcuk vardır. "+day+". güne kadar büyüme sayısı:\n"+day+" − 1 = "+e,"Tekrarlı çarpmayı üslü olarak yazalım:\n"+expr,...(same!==null&&same>0?[productRule+"\n"+expr+" = "+pow(b,same)+" · "+pow(b,e)+"\n"+pow(b,same)+" · "+pow(b,e)+" = "+pow(b,same+e)]:[]),"Sonucu hesaplayalım:\n"+(same!==null&&same>0?pow(b,same+e):expr)+" = "+ans,"Sonuç: "+ans+" tomurcuk."]};
 }
 if(l.bugün&&l.gelişim){
  const p=parse(l.bugün),d=Number(l.gelişim.match(/\d+/)?.[0]);if(!p||expOf(p[0],d)===null)return null;
  const [b,e]=p,z=divide(b,e,d),ans=z.b**z.e;if(String(ans)!==q.correctAnswer)return null;
  return {first:["Düne dönmek için günlük büyüme çarpanına böl.",quotientRule],second:["Bölmeyi aynı tabanda kur:\n"+pow(b,e)+"/"+pow(b,expOf(b,d)),"Üsleri çıkar ve sonucu kendin hesapla."],solution:["Bugünkü miktarı günlük büyüme çarpanına bölelim.",quotientRule,...z.rows,"Sonucu bul:\n"+pow(z.b,z.e)+" = "+ans,"Sonuç: "+ans+" tomurcuk."]};
 }
 return null;
}
function relevantGuide(q,g){
 if(!g)return null;
 if(q.f03NegativeV248||q.f03EquationV249)return g; // explicitly derived same-base multiplication
 const all=g.solution.join("\n");
 const usesProduct=all.includes(productRule)&&g.solution.some(s=>/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵃ]\s*·\s*\d+[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵃ]/u.test(s)||/·\s*\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]\s*=/u.test(s));
 const usesQuotient=g.solution.some(s=>/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵃ]\s*(?:÷|\/)\s*\d/u.test(s));
 const usesPower=g.solution.some(s=>s.startsWith(powerRule)&&s.includes("\n"));
 const keep=s=>s!==productRule||usesProduct;
 const filter=xs=>xs.filter(s=>keep(s)&&(s!==quotientRule||usesQuotient)&&(s!==powerRule||usesPower));
 return {...g,first:filter(g.first),second:filter(g.second),solution:filter(g.solution)};
}

function f04LossType(q){return q.obstacleId==="F04"&&q.visual.labels.some(x=>["arızalı oran","ilk sönük","1. sönük"].includes(x.anchor)||/;\s*sönük/u.test(x.value));}
function f04Guide(q){
 const l=Object.fromEntries(q.visual.labels.map(x=>[x.anchor,String(x.value)])),rows=[],first=[],second=[];
 const add=(...s)=>rows.push(...s),v=t=>{const [b,e]=parse(t);return b**e;};
 const frac=s=>s==="0"?[0,1]:s.split("/").map(Number);
 const remain=s=>{const [n,d]=frac(s);return [d-n,d];};
 const rat=([n,d])=>d===1?String(n):n+"/"+d;
 const final=(expr,n)=>{if(expr!==String(n))add(expr+" = "+n);return n;};
 function mult(n,t){
  const [b,e]=parse(t);let k=expOf(b,n);
  if(n===1){add("1 · "+t+" = "+t);return v(t);}
  if(k!==null){const p=pow(b,k);if(String(n)!==p)add(n+" = "+p);add(productRule,p+" · "+t+" = "+b+"^("+k+"+"+e+")",b+"^("+k+"+"+e+") = "+pow(b,k+e),pow(b,k+e)+" = "+n*v(t));}
  else {add(t+" = "+v(t));add(n+" · "+v(t)+" = "+n*v(t));}
  return n*v(t);
 }
 function multHint(n,t){const [b,e]=parse(t),k=expOf(b,n);return k!==null&&n>1?[n+" · "+t+" = "+pow(b,k)+" · "+t,productRule,"Üsleri topla; sonra oluşan kuvvetin değerini bul."]:[n+" · "+t,"Tabanlar aynı olmadığından kuvvetin değerini bulup "+n+" ile çarp."];}
 function portion(t,[n,d],title){
  const [b,e]=parse(t),a=v(t)*n/d;if(!Number.isInteger(a))throw Error(q.id+" kesir");
  add(title+":");
  if(n===0){add("0 · "+t+" = 0");return 0;}
  if(n===d){add("Tüm lambalar yanıyor.",t+" = "+v(t));return v(t);}
  add(t+" · "+rat([n,d])+" = ("+t+"/"+d+") · "+n);
  let k=expOf(b,d),base=b,ee=e;
  if(k===null){const [x,m]=baseOf(b);k=expOf(x,d);if(k!==null){base=x;ee=e*m;add(powerRule,t+" = ("+pow(x,m)+")"+sup(e),"("+pow(x,m)+")"+sup(e)+" = "+pow(base,ee));}}
  let piece;
  if(k!==null){const p=pow(base,k),ex=base+"^("+ee+"−"+k+")";add(d+" = "+p,quotientRule,pow(base,ee)+"/"+p+" = "+ex,ex+" = "+pow(base,ee-k));piece=base**(ee-k);add(pow(base,ee-k)+" = "+piece);}
  else{
   // All remaining F04 denominators are powers of two and bases have factor 2 (e.g. 6).
   const h=expOf(2,d);let odd=b,two=0;while(odd%2===0){two++;odd/=2;}
   if(h===null||two*e<h)throw Error(q.id+" bölen "+d);
   const u=two*e,ex="2^("+u+"−"+h+")",power=pow(2,u),other=pow(odd,e);
   add("Çarpımın kuvveti alınırken her çarpanın kuvveti alınır.",t+" = (2 · "+odd+")"+sup(e),"(2 · "+odd+")"+sup(e)+" = "+power+" · "+other,d+" = "+pow(2,h),quotientRule,"("+power+" · "+other+")/"+pow(2,h)+" = "+ex+" · "+other,ex+" · "+other+" = "+pow(2,u-h)+" · "+other);
   piece=2**(u-h)*odd**e;add(pow(2,u-h)+" · "+other+" = "+piece);
  }
  if(n!==1)add(piece+" · "+n+" = "+a);
  return a;
 }
 function portionHint(t,[n,d]){if(n===d)return t;const [b,e]=parse(t),[x,m]=baseOf(b);let k=expOf(b,d);if(k!==null)return t+"/"+pow(b,k)+(n===1?"":" · "+n);k=expOf(x,d);if(k!==null)return pow(x,m*e)+"/"+pow(x,k)+(n===1?"":" · "+n);let odd=b,two=0;while(odd%2===0){two++;odd/=2;}return "("+pow(2,two*e)+" · "+pow(odd,e)+")/"+pow(2,expOf(2,d))+(n===1?"":" · "+n);}
 function lossGuide(){
 let ts,raw,global=false;
 if(l["arızalı oran"]){ts=Array(Number(l["katman sayısı"])).fill(l["bir katman"]);raw=[l["arızalı oran"]];global=true;}
 else if(l.ilk){ts=[l.ilk,l.ikinci];raw=[l["ilk sönük"],"0"];}
 else if(l["her katman"]){ts=Array(3).fill(l["her katman"]);raw=[l["1. sönük"],l["2. sönük"],l["3. sönük"]];}
 else{const m=q.visual.labels.map(x=>String(x.value).match(/^(\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?: lamba)?;\s*sönük:?\s*(\d+\/\d+)$/u));if(m.some(x=>!x))throw Error(q.id+" sönük veri");ts=m.map(x=>x[1]);raw=m.map(x=>x[2]);}
 const rs=raw.map(frac),n=ts.length,same=ts.every(x=>x===ts[0]),totalExpr=same?n+" · "+ts[0]:ts.join(" + "),total=ts.reduce((s,t)=>s+v(t),0);
 const term=(t,[p,d])=>p===0?"0":t+"/"+d+(p===1?"":" · "+p);
 const first=[],second=[];let lost;
 if(global){
  const [p,d]=rs[0];
  first.push(n+" katmanda toplam "+totalExpr+" lamba var. Bunların "+raw[0]+" kadarı arızalı.","Arızalı lamba sayısını bulmak için toplam lamba sayısını "+d+" eşit gruba ayır."+(p===1?" Bir gruptaki lamba sayısını bul.":" "+p+" gruptaki lamba sayısını bul."),"Arızalı lamba sayısını bütün lambaların sayısından çıkar.");
  second.push("Önce arızalı lambaların sayısını bul:\n("+totalExpr+")/"+d+(p===1?"":" · "+p),"Çarpanların sırasını değiştirerek işlemi kolaylaştır:\n"+n+" · ("+portionHint(ts[0],rs[0])+")",quotientRule,"Tüm lamba sayısı:\n"+totalExpr,"Toplam lamba sayısından arızalı lamba sayısını çıkar.");
  add("Önce arızalı lamba sayısını hesaplayalım:","("+totalExpr+") · "+raw[0],"Çarpanların sırasını değiştirerek işlemi kolaylaştıralım:\n"+n+" · ("+ts[0]+" · "+raw[0]+")");
  const a=portion(ts[0],rs[0],"Kesirli çarpımı hesaplayalım");lost=n*a;
  add("Toplam arızalı lamba sayısı:",n+" · "+a+" = "+lost);
 }else{
  first.push(same?"Her katmanda "+ts[0]+" lamba var. Önce sönük lambaların sayısını bul.":"İlk katmanda "+ts[0]+", ikinci katmanda "+ts[1]+" lamba var. Önce sönük lambaların sayısını bul.");
  for(let i=0;i<n;i++){const [p,d]=rs[i];first.push(p===0?(i+1)+". katmanda hiç lamba sönmemiş.":(i+1)+". katmandaki "+ts[i]+" lambayı "+d+" eşit gruba ayır. "+(p===1?"Sönük olan grubun":"Sönük "+p+" grubun")+" lamba sayısını hesapla.");second.push((i+1)+". katmanda sönük lambalar:\n"+term(ts[i],rs[i]));}
  first.push("Sönük lamba sayılarını topla. Bulduğun sayıyı tüm lambaların sayısından çıkar.");
  const i=rs.findIndex(([p])=>p>0);second.push("İlk bölmeyi üslü sayılarla yaz:\n"+term(ts[i],rs[i])+" = "+portionHint(ts[i],rs[i]),quotientRule,"Tüm lambaların sayısı:\n"+totalExpr,"Sönük lamba sayılarını topla. Sonra bu toplamı tüm lambaların sayısından çıkar.");
  const losses=rs.map((r,i)=>portion(ts[i],r,(i+1)+". katmanda sönük lambalar"));lost=losses.reduce((s,a)=>s+a,0);
  add("Sönük lambaların toplamı:",losses.join(" + ")+" = "+lost);
 }
 add("Tüm lambaların sayısı:",totalExpr);
 if(same)mult(n,ts[0]);else{ts.forEach(t=>add(t+" = "+v(t)));add(ts.map(v).join(" + ")+" = "+total);}
 add((global?"Arızalı":"Sönük")+" lambaları toplamdan çıkaralım:",total+" − "+lost+" = "+(total-lost),"Sonuç: "+(total-lost)+" lamba.");
 if(String(total-lost)!==q.correctAnswer)throw Error(q.id+" sonuç");
 return {first,second,solution:rows};
}
 if(f04LossType(q))return lossGuide();
 let answer;
 if(l.katman){
  const n=+l.katman,t=l.nokta||l.her_katman,extra=+(l.uyarı_lambası||0);
  first.push("Geçitte "+n+" katman var. Her katmanda "+t+" ışık yanıyor. Katmanlardaki ışıkların toplamı için "+n+" ile "+t+" ifadelerini çarp."+(extra?" Sonra "+extra+" uyarı lambasını ekle.":""));
  const [b]=parse(t);if(expOf(b,n)!==null&&n>1)first.push("Katman sayısını da "+b+" tabanında yazabilir misin? "+productRule);else first.push(t+" ifadesi, tabanın üs kadar kendisiyle çarpılmasıdır.");
  second.push(...multHint(n,t));if(extra)second.push("Katmanları hesapladıktan sonra "+extra+" ek lambayı topla:\n("+n+" · "+t+") + "+extra);
  add("Katmanlardaki yanan ışıkları bulalım:",n+" · "+t);const a=mult(n,t);answer=extra?final(a+" + "+extra,a+extra):a;
 }else if(l.toplam_katman){
  const n=+l.toplam_katman,c=+l.kapalı_katman,t=l.açık_katman_ışığı,open=n-c;
  first.push(n+" katmandan "+c+" tanesi kapalı. Kapalı katmanlarda ışık yanmaz. Önce açık katman sayısını bul; ardından her açık katmandaki "+t+" ışığı hesaba kat.");
  second.push("Açık katman sayısı:\n"+n+" − "+c+" = "+open,...multHint(open,t));
  add("Açık katman sayısı:",n+" − "+c+" = "+open,"Sadece açık katmanların ışıklarını hesaplayalım:",open+" · "+t);answer=mult(open,t);
 }else if(l["katman sayısı"]){
  const n=+l["katman sayısı"],t=l["bir katman"],r=remain(l["arızalı oran"]);
  first.push(n+" katmanın her birinde "+t+" lamba var. "+l["arızalı oran"]+" arızalı olduğundan yanan payı 1'den arızalı payı çıkararak bul.");
  second.push("Yanan pay:\n1 − "+l["arızalı oran"]+" = "+rat(r),"Her katman için bu payı uygula:\n"+t+" · "+rat(r)+" = "+portionHint(t,r),quotientRule,"Bir katmandaki yanan miktarı "+n+" ile çarp.");
  add("Yanan pay:", "1 − "+l["arızalı oran"]+" = "+rat(r),"Aynı oran toplamın her eş katmanına uygulanabilir.");const a=portion(t,r,"Bir katmanda yanan lamba sayısı");answer=final(n+" · "+a,n*a);
 }else if(l.ilk){
  const t=l.ilk,u=l.ikinci,r=remain(l["ilk sönük"]);
  first.push("Sönen lambalar yalnız ilk katmanda. İlk katmanın "+l["ilk sönük"]+" payı sönük; geri kalan payı bul. İkinci katmandaki "+u+" lambanın tamamı yanıyor.",quotientRule);
  second.push("İlk katmanın yanan payı:\n1 − "+l["ilk sönük"]+" = "+rat(r),"İlk katman:\n"+t+" · "+rat(r)+" = "+portionHint(t,r),"İlk katmanda bulduğun miktara "+u+" ifadesinin değerini ekle.");
  add("İlk katmanın yanan payı:","1 − "+l["ilk sönük"]+" = "+rat(r));const a=portion(t,r,"İlk katmanda yanan lambalar");add("İkinci katmanın tamamı yanıyor:",u+" = "+v(u));answer=final(a+" + "+v(u),a+v(u));
 }else{
  let t,rs,kind,raw;
  if(l["her katman"]){t=l["her katman"];raw=[l["1. sönük"],l["2. sönük"],l["3. sönük"]];kind="sönük";}
  else{const m=q.visual.labels.map(x=>String(x.value).match(/^(\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?: lamba)?;\s*(sönük|kapanan|yanan):?\s*(\d+\/\d+)$/u));if(m.some(x=>!x))throw Error(q.id+" katman");t=m[0][1];kind=m[0][2];raw=m.map(x=>x[3]);}
  rs=raw.map(s=>kind==="sönük"?remain(s):frac(s));
  const target=kind==="kapanan"?"kapanan":"yanan";
  first.push("Her katmanda "+t+" lamba var. "+(kind==="sönük"?"Verilen oranlar sönük lambalara ait. Her katman için yanan payı 1'den sönük payı çıkararak bul.":kind==="kapanan"?"Verilen oranlar kapanan lambalara ait; doğrudan bu payları hesapla.":"Verilen oranlar yanan lambalara ait; doğrudan bu payları hesapla."),"Her katmanın "+target+" lamba sayısını ayrı hesapla. Kesrin paydasına bölerken uygun tabanları eşitle; üsleri çıkar."+ (kind==="yanan"?" En son toplamdan tek katmanın lamba sayısını çıkar.":" Sonra üç miktarı topla."));
  if(kind==="sönük")second.push("Yanan paylar:\n"+raw.map((s,i)=>"1 − "+s+" = "+rat(rs[i])).join("\n"));
  second.push("İlk katmanın işlemi:\n"+t+" · "+rat(rs[0])+" = "+portionHint(t,rs[0]),quotientRule,"Diğer iki katman için "+rat(rs[1])+" ve "+rat(rs[2])+" paylarını aynı yöntemle hesapla. "+(kind==="yanan"?"Toplamdan "+t+" lambayı çıkar.":"Üç sonucu topla."));
  if(kind==="sönük")add("Yanan payları bulalım:",...raw.map((s,i)=>"1 − "+s+" = "+rat(rs[i])));
  const nums=rs.map((r,i)=>portion(t,r,(i+1)+". katmanda "+target+" lambalar"));const total=nums.reduce((a,b)=>a+b,0);add("Üç katmanın "+target+" lamba toplamı:",nums.join(" + ")+" = "+total);
  if(kind==="yanan"){add("Tek bir katmanın lamba sayısı:",t+" = "+v(t),"İstenen fark:");answer=final(total+" − "+v(t),total-v(t));}else answer=total;
 }
 if(String(answer)!==q.correctAnswer)throw Error(q.id+" sonuç "+answer+" ≠ "+q.correctAnswer);
 add("Sonuç: "+answer+" "+(l.katman||l.toplam_katman?"ışık noktası.":"lamba."));
 return {first,second,solution:rows};
}
function f04ReadableHints(q,g){
 const l=Object.fromEntries(q.visual.labels.map(x=>[x.anchor,String(x.value)]));
 const fraction=s=>s==="0"?[0,1]:s.split("/").map(Number);
 const part=([n,d])=>d===1?String(n):n+"/"+d;
 const parts=(n,d)=>d+" eşit parçanın "+n+" tanesi";
 const remaining=(s)=>{const [n,d]=fraction(s);return [d-n,d];};
 const explain=(s,place,word="sönük")=>{const [n,d]=fraction(s);return n===0?place+" hiçbir lamba sönmemiş. Lambaların tamamı yanıyor.":place+" lambaları "+d+" eşit gruba ayır. "+n+" grup "+word+" olduğuna göre "+(d-n)+" grup yanıyor.";};
 const use=(t,r)=>{const [n,d]=r;return n===d?t:t+"/"+d+(n===1?"":" · "+n);};
 const goal=(kind)=>kind==="kapanan"?"Üç katmanda kapanan lamba sayılarını topla.":kind==="yanan"?"Üç katmanda yanan lambaları topla. Sonra bir katmandaki tüm lambaların sayısını bu toplamdan çıkar.":"Üç katmanda yanan lamba sayılarını topla.";
 let first=[],second=[];
 if(l.katman||l.toplam_katman){
  const n=Number(l.katman||l.toplam_katman),c=Number(l.kapalı_katman||0),t=l.nokta||l.her_katman||l.açık_katman_ışığı,extra=Number(l.uyarı_lambası||0),open=n-c,[b,e]=parse(t),k=expOf(b,open);
  first=c?[n+" katmanın "+c+" tanesinde hiç ışık yanmıyor. Kaç katmanın açık kaldığını bul.","Açık katman sayısını, bir katmandaki "+t+" ışıkla çarp."]:[n+" katmanın her birinde "+t+" ışık yanıyor. Aynı miktar "+n+" kez tekrar ediyor.","Bir katmandaki ışık sayısıyla katman sayısını çarp."+(extra?" Kapının üstündeki "+extra+" uyarı lambasını da ekle.":"")];
  if(k!==null&&open>1)first.push(open+" sayısını "+b+" tabanında üslü olarak yaz. "+productRule);
  else first.push(t+" ifadesi, "+b+" sayısının "+e+" kez kendisiyle çarpılmasıdır.");
  second=[...g.second].map(s=>s.replace("Tabanlar aynı olmadığından kuvvetin değerini bulup "+open+" ile çarp.","Önce "+t+" değerini bul. Sonra "+open+" ile çarp.").replace("Üsleri topla; sonra oluşan kuvvetin değerini bul.","Üsleri topla. Elde ettiğin kuvvetin değerini hesapla."));
 }else if(l["katman sayısı"]){
  const t=l["bir katman"],n=Number(l["katman sayısı"]),r=remaining(l["arızalı oran"]);
  first=[explain(l["arızalı oran"],"Her katmanda","arızalı"),"Bir katmanda "+t+" lamba var. Yanan "+r[0]+" grubun kaç lamba ettiğini bul.","Bir katmandaki yanan lamba sayısını "+n+" ile çarp."];
  second=["Yanan lambaların oranı:\n1 − "+l["arızalı oran"]+" = "+part(r),"Bir katmandaki "+t+" lambayı "+r[1]+" eşit gruba ayır. Yanan "+r[0]+" grubu hesapla:\n"+use(t,r),...g.second.slice(1,2).map(s=>s.replace("Her katman için bu payı uygula:","Bölmeyi üslü sayılarla yaz:")),quotientRule,"Bulduğun sayıyı "+n+" ile çarp."];
 }else if(l.ilk){
  const r=remaining(l["ilk sönük"]),t=l.ilk,u=l.ikinci;
  first=[explain(l["ilk sönük"],"İlk katmanda"),"İlk katmanda "+t+" lamba var. Yanan grubun lamba sayısını bul.","İkinci katmandaki "+u+" lambanın tamamı yanıyor. İki katmanda yanan lambaları topla."];
  second=["İlk katmanda yanan lambaların oranı:\n1 − "+l["ilk sönük"]+" = "+part(r),"İlk katmandaki işlemi kur:\n"+use(t,r),g.second[1].replace("İlk katman:","Bölmeyi üslü sayılarla yaz:"),quotientRule,"İlk katmanda bulduğun sayıya "+u+" değerini ekle."];
 }else{
  let t,raw,kind;
  if(l["her katman"]){t=l["her katman"];raw=[l["1. sönük"],l["2. sönük"],l["3. sönük"]];kind="sönük";}
  else{const m=q.visual.labels.map(x=>String(x.value).match(/^(\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?: lamba)?;\s*(sönük|kapanan|yanan):?\s*(\d+\/\d+)$/u));t=m[0][1];kind=m[0][2];raw=m.map(x=>x[3]);}
  const rs=raw.map(s=>kind==="sönük"?remaining(s):fraction(s));
  first=["Her katmanda "+t+" lamba var.",...raw.map((s,i)=>{if(kind==="sönük")return explain(s,(i+1)+". katmanda");const [n,d]=fraction(s);return (i+1)+". katmanda lambaları "+d+" eşit gruba ayır. "+n+" grup "+(kind==="kapanan"?"kapanıyor.":"yanıyor.");}),goal(kind)];
  second=raw.map((s,i)=>{const r=rs[i];return (i+1)+". katman"+(kind==="sönük"?" (yanan lambalar)":kind==="kapanan"?" (kapanan lambalar)":" (yanan lambalar)")+":\n"+(r[0]===r[1]?"Tüm lambalar yanıyor: "+t:use(t,r));});
  const worked=g.second.find(s=>s.startsWith("İlk katmanın işlemi:"));
  if(worked)second.push(worked.replace("İlk katmanın işlemi:","İlk katmandaki bölmeyi üslü sayılarla yaz:"));
  second.push(quotientRule,goal(kind));
 }
 return {...g,first,second};
}
function reviseF04(q){if(q.obstacleId!=="F04")return q;const prompt=q.prompt.replace("toplam ışık sayısı kaçtır?","toplam yanan ışık sayısı kaçtır?");return {...q,prompt,f04TeachingV251:true};}
function guide(q){if(q.obstacleId==="F04"){const g=f04Guide(q);return f04LossType(q)?g:f04ReadableHints(q,g);}return relevantGuide(q,q.obstacleId==="F03"?f03(q):growthGuide(q)||algebra(q)||exactPower(q)||simplePower(q)||exactRoot(q));}
function apply(bank){return {...bank,questions:bank.questions.map(source=>{const q=reviseF04(reviseF03Hard(source));const g=guide(q);return g?{...q,symbolicGuideV241:g,...(q.obstacleId==="F03"?{f03Guide:g,hint:g.first.join("\n"),solution:g.solution.join("\n")}: q.f04TeachingV251?{hint:g.first.join("\n"),solution:g.solution.join("\n")}: {})}:q})};}
function groups(items){
 const out=[];
 for(const item of items){for(const part of String(item??"").split("\n").map(s=>s.trim()).filter(Boolean)){
   const clean=part.replace(/^\d+\.\s*(?:Adım\s*[:.–-]?\s*|(?=[A-ZÇĞİÖŞÜ]))/u,"");
   if(!clean||/^\d+\.$/.test(clean))continue;
   const math=/^[\d(√∛∜a-zA-Zⁿᵃ⁻+−]/u.test(clean)&&(/[=÷·×]/u.test(clean)||/^\d+[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/u.test(clean))&&!/[a-zçğıöşü]{3,}/iu.test(clean);
   if(math&&out.length)out[out.length-1].push(clean);else out.push([clean]);
 }}
 return out;
}

/* v243: student-facing hints only. Never change the approved full solution. */
function plainHints(q,stage,source){
 if(q?.f04TeachingV251)return stage===2?q.symbolicGuideV241.second:q.symbolicGuideV241.first;
 if(q?.f03NegativeV248||q?.f03EquationV249)return stage===2?q.symbolicGuideV241.second:q.symbolicGuideV241.first;
 if(q?.f02SymbolicGuideV245)return stage===2?q.symbolicGuideV241.second:q.symbolicGuideV241.first;
 const l=Object.fromEntries(q.visual.labels.map(x=>[x.anchor,String(x.value)]));
 const vals=q.visual.labels.map(x=>String(x.value));
 const t=String(q.topic||"").toLocaleLowerCase("tr");
 const second=stage===2;
 if(q.obstacleId==="F01"&&l.ilk_dal&&l.büyüme&&l.gün){
  const n=Number(l.gün),b=Number(l.büyüme.match(/\d+/)[0]),start=Number(l.ilk_dal);
  return second?["1. günde "+start+" tomurcuk var. "+n+". güne kadar kaç kez "+b+" ile çarpmalıyız?\n"+n+" − 1 = "+(n-1),"Şimdi işlemi tamamla:\n"+start+" · "+pow(b,n-1)]:["1. günde "+start+" tomurcuk var. 2. güne geçince sayı "+b+" ile çarpılır.","Her yeni günde aynı işlemi yap. "+n+". güne kadar kaç kez "+b+" ile çarpman gerektiğini düşün."];
 }
 if(q.obstacleId==="F01"&&l.bugün&&l.gelişim){
  const p=parse(l.bugün),b=Number(l.gelişim.match(/\d+/)?.[0]);
  if(p&&b===p[0])return second?["Dünkü sayıyı bulmak için bugünkü sayıyı "+b+" ile böl.\n"+l.bugün+"/"+pow(b,1),quotientRule]:["Bugünkü sayı, dünkü sayının "+b+" katı. Dünü bulmak için "+b+" ile böl.",quotientRule];
 }
 if(q.obstacleId==="F01"&&l["sol ilk gün"]&&l["sağ ilk gün"]&&l.gün){
  const n=Number(l.gün),a=Number(l["sol büyüme"].match(/\d+/)[0]),b=Number(l["sağ büyüme"].match(/\d+/)[0]);
  return second?["Her kol "+(n-1)+" kez büyür.\n"+n+" − 1 = "+(n-1),"Sol kol:\n"+l["sol ilk gün"]+" · "+pow(a,n-1),"Sağ kol:\n"+l["sağ ilk gün"]+" · "+pow(b,n-1),"İki sonucu topla."]:["İlk gün iki kolda farklı sayıda tomurcuk var. Sol kol her gün "+a+", sağ kol "+b+" katına çıkar.","Her kolu ayrı hesapla. İlk gün büyüme yapılmadığını unutma. Sonra iki sonucu topla."];
 }
 if(q.obstacleId==="F03"){
  const keys=q.visual.labels.map(x=>x.anchor);
  if(keys[0]==="A borusu"){
   const a=divisor(vals[2]),b=divisor(vals[3]);return second?["A borusundaki sis:\n"+vals[0]+"/"+a,"B borusundaki sis:\n"+vals[1]+"/"+b,quotientRule,"İki borudan geçen sisi topla."]:["A borusundaki sisi "+a+", B borusundaki sisi "+b+" ile böl. Sonra iki miktarı topla.",quotientRule];
  }
  const p=parse(vals[0]);if(p){
   const ds=keys[1]==="filtre_sayısı"?Array(Number(vals[1])).fill(divisor(vals[2])):keys[1]==="ayrılan"?[divisor(vals[1])]:vals.slice(1).map(divisor);
   const z=divide(p[0],p[1],ds[0]);
   const next=keys[1]==="ayrılan"?"Bulduğun miktarı başlangıçtaki sisten çıkar.":ds.length>1?"Sonraki işlemlerde de kalan sisi belirtilen sayılara böl.":"Bölme işlemini tamamla.";
   const first=keys[1]==="ayrılan"?"Yan kola ayrılan sisi bulmak için "+ds[0]+" ile böl. Bu miktarı başlangıçtaki sisten çıkar.":ds.length>1?(ds.every(d=>d===ds[0])?"Sis "+ds.length+" kez "+ds[0]+" ile bölünüyor.":"Sis sırasıyla "+ds.slice(0,-1).join(", ")+" ve "+ds.at(-1)+" ile bölünüyor.")+" Her seferinde bir önceki işlemden kalan sisi kullan.":"Sis miktarını "+ds[0]+" ile böl.";
   const divisorExp=expOf(z.b,ds[0]),initialExp=z.e+divisorExp;
   return second?["İlk bölmede tabanları eşitle:\n"+pow(z.b,initialExp)+"/"+pow(z.b,divisorExp),quotientRule,next]:[first,quotientRule];
  }
 }
 if(q.obstacleId==="F02"&&l.basamak_sayısı&&l.her_basamak){
  return second?["Her basamakta "+l.her_basamak+" birim enerji var.","Toplam enerji için şu işlemi yap:\n"+l.basamak_sayısı+" · "+l.her_basamak]:["Bütün basamaklarda aynı miktarda enerji var.","Bir basamağın enerjisini bul. Sonra basamak sayısıyla çarp."];
 }
 if(q.obstacleId==="F02"&&l["ilk enerji"]&&l["kapı tüketimi"]&&l.uyarı&&l["uyarı kullanımı"]){
  return second?["Birinci basamaktan harcanan güç:\n"+l["ilk enerji"]+" · "+l["kapı tüketimi"],"İkinci basamaktan harcanan güç:\n"+l.uyarı+" · "+l["uyarı kullanımı"],"Her basamakta harcananı kendi gücünden çıkar. Kalanları topla."]:["Her basamağın gücünü ayrı hesapla.","Kapı ve lamba için harcanan güçleri kendi basamaklarından çıkar. Kalan iki gücü topla."];
 }
 const input=(Array.isArray(source)?source:[source]).map(x=>String(x??"").trim()).filter(Boolean);
 const edits=[
 [/Aynı sayının tekrarlı çarpımı üslü olarak yazılabilir\./gu,"Aynı sayıyı birkaç kez kendisiyle çarparsan bunu üslü sayı olarak yazabilirsin."],
 [/Tabanları aynı olan üslü sayılar çarpılırken üsleri toplanır\./gu,productRule],
 [/Tabanları aynı olan üslü sayılar bölünürken üsleri çıkarılır\./gu,quotientRule],
 [/Kök derecesi ve kök içi aynıysa toplama ve çıkarmada yalnız katsayılar işleme girer\. Tam sayıyla çarpma veya bölmede de katsayı işlem görür\./gu,"Kökün derecesi ve içindeki sayı aynıysa sadece kökün önündeki sayıları işle."],
 [/Köklü kısmı ve katsayıyı ayrı değerlendir; sonucu kendin tamamla\./gu,"Kökün önündeki sayıları işle. Sonucu kendin bul."],
 [/Ortak kuvveti ayırırken her terimin üssünden ortak üssü çıkar\./gu,"Ortak üslü sayıyı parantezin dışına al. Her terimin üssünden ortak üssü çıkar."],
 [/Ortak (?:çarpanı|kuvveti) ayır/gu,"Ortak çarpanı parantezin dışına al"],
 [/değerlendir/gu,"hesapla"],
 [/uygun biçimde/gu,""],
 [/nihai/gu,"son"],
 [/işleme girer/gu,"işlem yapılır"],
 [/Önce üslü ifadelerin değerlerini ayrı ayrı bul\. Sonra soruda istenen işlemi yap\./gu,"Önce her üslü sayının değerini bul. Sonra soruda istenen işlemi yap."],
 [/Önce üsleri hesapla/gu,"Önce üslü sayıların değerlerini bul"],
 [/Üslerin değerlerini ayrı ayrı bulup topla/gu,"Üslü sayıların değerlerini ayrı ayrı bul ve topla"],
 [/Kök derecesine dikkat et; farklı derecedeki kökler eşit değeri gösterebilir\./gu,""],
 [/Verilen değerlerle bu işlemi kur ve sonucu kendin tamamla\./gu,"Şimdi işlemi verilen sayılarla yap."],
 [/Katsayı/gu,"Katsayı (kökün önündeki sayı)"]
 ];
 // Keep standard mathematical terminology in scientific notation and all formulas.
 const out=[];
 for(const s of input){
  let z=s;
  for(const [re,v] of edits){if((!/köklü|kök|eşlenik/.test(t)||/bilimsel/.test(t))&&/katsay|Katsayı/.test(re.source))continue;z=z.replace(re,v);}
  z=z.replace(/[ \t]{2,}/g," ").trim();
  if(z&&!out.includes(z))out.push(z);
 }
 return out;
}

const api={version:"v253",apply,guide,supplemental,groups,plainHints,migrateRun};if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKSymbolicV241=api;
})(typeof window!=="undefined"?window:globalThis);

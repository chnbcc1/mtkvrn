/* v222: question-specific semantic layers for the five approved scenes; no artwork mutation. */
(function(root){const api=(function buildAPI(){
"use strict";
const ids=Object.freeze(["F02","F03","F07","F10","F19"]);
const norm=s=>String(s||"").toLocaleLowerCase("tr").replace(/_/g," ");
function describe(q){
 if(!ids.includes(q?.obstacleId))return null;
 const labels=(q.visual?.labels||[]).map(l=>({anchor:l.anchor,value:String(l.value)}));
 const key=labels.map(l=>norm(l.anchor)).join("|"),topic=norm(q.topic);
 const row=(title,...indices)=>({title,items:indices.map(i=>labels[i])});
 let mode="",title="",rows=[],art="none",diagramOnly=false;
 switch(q.obstacleId){
 case "F02":
  if(key==="basamak sayısı|her basamak"){mode="side-by-side";title="Yan yana eş basamaklar";rows=[row("Basamak sayısı ve her basamak",0,1)];diagramOnly=true}
  else if(key==="ilk enerji|kapı tüketimi|uyarı|uyarı kullanımı"){mode="independent";title="İki bağımsız enerji deposu";rows=[row("Birinci basamak → kapı",0,1),row("İkinci basamak → uyarı lambası",2,3)];diagramOnly=true}
  else if(key==="sol|sağ|harcama"){mode="two-sources";title="İki kaynak ve kapı tüketimi";rows=[row("Bağımsız kaynaklar",0,1),row("Kapı tüketimi",2)];diagramOnly=true}
  else if(key==="ilk|orta|son|çalışma oranları"){mode="working";title="Basamakların çalışma oranları";rows=[row("Birinci, ikinci, üçüncü basamak",0,1,2),row("Aynı sıradaki çalışma oranları",3)]}
  else if(/sayaç|sayacı/.test(key)){mode="counter";title="Üç basamak ve ortak sayaç";rows=[row("Basamaklar",0,1,2),row("Ortak sayaç",3)]}
  else if(key==="basamak 1|basamak 2|basamak 3|basamak 4"){mode="groups";title="İki basamak grubu";rows=[row("İlk iki",0,1),row("Son iki",2,3)]}
  else if(key==="alt basamak|üst basamak|aktarım"){mode="transfer";title="Alt ve üst basamak → yedek lambalar";rows=[row("Basamaklar",0,1),row("Aktarım oranı",2)]}
  else if(key==="giriş|hasarlı taş"){mode="consumption";title="Giriş enerjisi ve harcanan miktar";rows=[row("Enerji → harcama",0,1)];diagramOnly=true}
  else{mode="stairs";title="Ayrı basamakların güçleri";rows=[row("Basamaklar",...labels.map((_,i)=>i))]}
  break;
 case "F03":
  if(key==="a borusu|b borusu|a geçirgenliği|b geçirgenliği"){mode="parallel";title="Bağımsız iki boru (ardışık değil)";rows=[row("A borusu → 1. gözlem tüpü",0,2),row("B borusu → 2. gözlem tüpü",1,3)];diagramOnly=true}
  else if(key==="giriş|ayrılan|ana hat"){mode="branch";title="Girişten ayrılan yan kol";rows=[row("Giriş",0),row("Yan filtreye ayrılan",1),row("Ana boruda kalan",2)];diagramOnly=true}
  else if(key==="giriş|filtre sayısı|her filtre"){mode="repeat";title="Aynı düzenin art arda tekrarı";rows=[row("Giriş",0),row("Tekrar sayısı ve her geçiş",1,2)];diagramOnly=true}
  else if(key.startsWith("çıkış|")){mode="outlet";title="Çıkıştan gözlem tüpüne";rows=[row("Çıkış → gözlem tüpü",0,1)]}
  else{mode="serial";title="Sis akışı: girişten sırayla filtrelere";rows=[row("İşlem sırası",...labels.map((_,i)=>i))]}
  break;
 case "F07":
  if(key==="uzun kenar|kısa kenar"){mode="rectangle";title="Platformun dikdörtgen bölümü";rows=[row("Uzun ve kısa kenar",0,1)];art="rectangle"}
  else if(/iç|boşlu|gölge/.test(key)){mode=key.includes("aydınlanma")?"fraction-ring":"ring";title=mode==="fraction-ring"?"Dış alan, merkezdeki gölge ve aydınlanma oranı":"Dış kare ve iç boşluk";rows=[row("Dış ve iç kenar",0,1)];if(labels.length===3)rows.push(row(mode==="fraction-ring"?"Kalan alanın aydınlanma oranı":"Bir taşın alanı",2));art="ring"}
  else if(topic.includes("çevre")){mode="perimeter";title="Karenin dört dış kenarı";rows=[row("Kenar",0)];art="perimeter"}
  else if(topic.includes("dizi")){mode="grid";title="Kare biçiminde taş dizisi";rows=[row("Bir kenardaki taş sayısı",0)];art="area"}
  else{mode="square";title="Kare platformun bütün yüzeyi";rows=[row("Kenar",0)];if(labels.length===2)rows.push(row("Bir taşın alanı",1));art="area"}
  break;
 case "F10":
  if(key==="sıra|sütun"){mode="grid";title="Satır ve sütun düzeni";art="area"}
  else if(key.includes("aydınlanan")||key.includes("ışıklı alan etiketi")){mode="partial";title="Aydınlanmış çevre oranı";art="perimeter"}
  else if(key.includes("|tur")){mode="laps";title="Çevrede ışık şeridi turları";art="perimeter"}
  else if(topic.includes("fark")||topic.includes("çıkarma")){mode="difference";title="Uzun ve kısa kenar karşılaştırması";art="edges"}
  else if(topic.includes("alan")){mode="area";title="Dikdörtgenin iç yüzeyi";art="area"}
  else{mode="perimeter";title="Dikdörtgenin dört dış kenarı";art="perimeter"}
  rows=[row("Kenar / dizi verileri",0,1)];if(labels.length===3)rows.push(row(mode==="partial"?"Aydınlanan oran":"Tur sayısı",2));
  break;
 case "F19":
  if(labels.length===2){mode=topic.includes("katsayı")?"compare":"join";title=mode==="compare"?"İki ayrı köklü uzunluk":"Uç uca, örtüşme yok";rows=[row("İki destek",0,1)]}
  else{mode=key.includes("kesim")?"cut":key.includes("kullanılan")?"used":key.includes("eş parça")?"pieces":"overlap";title="İki desteğin ortak bölgesi";rows=[row("İki destek",0,1),row("Ortak bölüm",2)];if(labels.length===4)rows.push(row(mode==="cut"?"Uçtan kesilen":mode==="used"?"Kullanılan oran":"Eş parça uzunluğu",3));art="overlap"}
  break;
 }
 if(rows.flatMap(r=>r.items).length!==labels.length||rows.some(r=>r.items.some(x=>!x)))return null;
 return {id:q.obstacleId,mode,title,rows,art,diagramOnly,labels};
}
function mount({q,plane,readout,documentRef}){
 const d=describe(q);if(!d||!plane||!readout||!documentRef)return null;
 const doc=documentRef,svgNS="http://www.w3.org/2000/svg";
 // F02 prompts contain all givens. The existing scene plaques show the same data; no duplicate schematic card.
 if(d.id==="F02")return {destroy(){},description:{...d,diagramOnly:false}};
 const panel=doc.createElement("section");panel.className="mtk-special-v222";
 Object.assign(panel.style,{border:"1px solid #ba9458",borderRadius:"9px",padding:"7px",fontSize:"14px",background:"#fff9e7",color:"#33291b"});
 const h=doc.createElement("strong");h.textContent=d.title;panel.append(h);
 const note=doc.createElement("p");note.textContent=d.diagramOnly?"Ana sahne temsilidir; bu sorunun gerçek işlem düzeni aşağıdadır.":"Şematik gösterim — ölçüler verilen değerlerdir.";Object.assign(note.style,{margin:"4px 0",fontSize:"12px"});panel.append(note);
 const schematic=doc.createElement("div");Object.assign(schematic.style,{display:"grid",gap:"4px",margin:"6px 0"});
 const chip=(value,color="#dff2ed")=>{const n=doc.createElement("span");n.textContent=value;Object.assign(n.style,{minWidth:"0",padding:"5px",border:"1px solid #9c916a",borderRadius:"6px",background:color,textAlign:"center",overflowWrap:"anywhere"});return n};
 const flow=(values)=>{const line=doc.createElement("div");Object.assign(line.style,{display:"flex",alignItems:"center",flexWrap:"wrap",gap:"4px"});values.forEach((v,i)=>{if(i){const arrow=doc.createElement("span");arrow.textContent="→";line.append(arrow)}line.append(chip(v))});schematic.append(line)};
 const vals=d.labels.map(l=>l.value);
 if(d.id==="F03"){
  if(d.mode==="parallel"){flow(["A: "+vals[0],vals[2],"1. tüp"]);flow(["B: "+vals[1],vals[3],"2. tüp"])}
  else if(d.mode==="branch"){flow([vals[0],"Yan kol: "+vals[1]]);flow([vals[0],"Ana hat: "+vals[2]])}
  else if(d.mode==="repeat")flow([vals[0],vals[1]+" kez "+vals[2],"Çıkış"]);
  else flow([...vals,"İstenen miktar"]);
 }else if(d.id==="F02"){
  if(d.mode==="side-by-side"){const line=doc.createElement("div");Object.assign(line.style,{display:"flex",flexWrap:"wrap",gap:"4px"});const n=Number(vals[0]);if(Number.isInteger(n)&&n>=1&&n<=10)for(let i=0;i<n;i++)line.append(chip((i+1)+". basamak: "+vals[1]));else line.append(chip(vals[0]+" basamak, her biri "+vals[1]));schematic.append(line)}
  else if(d.mode==="independent"){flow([vals[0],"Kapı: "+vals[1]]);flow([vals[2],"Lamba: "+vals[3]])}
  else if(d.mode==="two-sources"){const line=doc.createElement("div");line.append(chip(vals[0]),chip(vals[1]));schematic.append(line);flow(["Ortak enerji","Kapı: "+vals[2]])}
 }else if(d.id==="F10"&&d.mode==="partial"){
  const match=vals[2].match(/(\d+)\s*\/\s*(\d+)/);if(match){const n=Number(match[1]),k=Number(match[2]);if(k>0&&n>=0&&n<=k){const bar=doc.createElement("div");Object.assign(bar.style,{display:"flex",height:"16px",border:"1px solid #9c916a",borderRadius:"5px",overflow:"hidden"});const lit=doc.createElement("div"),rest=doc.createElement("div");Object.assign(lit.style,{width:(100*n/k)+"%",background:"#e5bb4f"});Object.assign(rest.style,{flex:"1",background:"#355450"});bar.append(lit,rest);schematic.append(bar);const caption=doc.createElement("small");caption.textContent="Sarı: aydınlanan bölüm · Koyu: kalan bölüm";schematic.append(caption)}}
 }else if(d.id==="F07"&&d.mode==="rectangle"){
  const shape=doc.createElement("div");Object.assign(shape.style,{width:"70%",height:"40px",border:"2px solid #b58b3f",background:"#f4e3b2",margin:"0 auto"});schematic.append(shape);
 }else if(d.id==="F19"){
  const bar=(value,color,offset)=>{const n=chip(value,color);Object.assign(n.style,{width:"70%",marginLeft:offset+"%",minHeight:"23px"});schematic.append(n)};
  if(d.mode==="join"||d.mode==="compare"){bar(vals[0],"#dceee5",0);bar(vals[1],"#f2deb4",0)}
  else{bar("A: "+vals[0],"#dceee5",0);bar("B: "+vals[1],"#f2deb4",25);schematic.append(chip("Ortak: "+vals[2],"#f8d478"))}
 }
 if(schematic.children.length)panel.append(schematic);
 for(const r of d.rows){const section=doc.createElement("div"),heading=doc.createElement("div"),grid=doc.createElement("div");heading.textContent=r.title;heading.style.fontWeight="700";Object.assign(grid.style,{display:"flex",flexWrap:"wrap",gap:"5px",margin:"4px 0"});section.append(heading,grid);
  for(const item of r.items){const tile=doc.createElement("span");tile.textContent=item.anchor.replace(/_/g," ")+": "+item.value;Object.assign(tile.style,{border:"1px solid #d4b982",borderRadius:"5px",padding:"4px",overflowWrap:"anywhere",background:"#fffdf4"});grid.append(tile)}
  panel.append(section)
 }
 const svg=doc.createElementNS(svgNS,"svg");svg.setAttribute("viewBox","0 0 100 100");svg.setAttribute("aria-hidden","true");Object.assign(svg.style,{position:"absolute",inset:"0",width:"100%",height:"100%",pointerEvents:"none",zIndex:"1"});
 const path=(d,fill="none",stroke="#ffe69a",width="0.7")=>{const p=doc.createElementNS(svgNS,"path");for(const [k,v] of Object.entries({d,fill,stroke,"stroke-width":width,"stroke-linejoin":"round"}))p.setAttribute(k,v);svg.append(p);return p};
 if(d.id==="F07"){
  const outer="M 28 29 L 81 29 L 92 64 L 17 64 Z",inner="M 43 37 L 66 37 L 68 51 L 41 51 Z";
  if(d.art==="ring"){path(outer+" "+inner,"#f4bf483b").setAttribute("fill-rule","evenodd");path(inner,"#132c3570","#83d8df")}
  else if(d.art==="perimeter")path(outer,"none","#ffe69a","1.2");
  else if(d.art==="rectangle"){ /* Exact subregion is not specified; use independent schematic. */ }
  else path(outer,"#f4bf483b");
 }else if(d.id==="F10"){
  const outer="M 15 42 L 84 42 L 94 58 L 6 58 Z";
  if(d.art==="area")path(outer,"#ffe69a35");
  else if(d.art==="edges"){path("M 15 42 L 84 42","none","#ffd45c","1.2");path("M 84 42 L 94 58","none","#75e4e8","1.2")}
  else path(outer,"none","#ffe69a","1.1");
 }else if(d.id==="F19"&&d.art==="overlap"){path("M 44 50 L 56 50 L 56 60 L 44 60 Z","#ffe69a38","#ffd45c","0.8")}
 if(svg.children.length)plane.append(svg);
 readout.append(panel);
 return {destroy(){svg.remove();panel.remove()},description:d};
}
return Object.freeze({ids,describe,mount});
})();if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKSpecialScenesV222=api;})(typeof window!=="undefined"?window:globalThis);

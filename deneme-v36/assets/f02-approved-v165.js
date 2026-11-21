/* Matematik Evreni | F02 Işıklı Taş Basamaklar | user-approved artwork.
   All values are sourced from the selected approved 630-question pack; no text is baked into art.
   Screen coordinates are percentages of the approved F02 image itself. */
(()=>{"use strict";
 const IMAGE="./assets/f02-approved-v165.avif";
 const POS={
  top:{x:50,y:15.1,w:41.5,h:11.3},
  one:{x:47.5,y:64.2,w:26.5,h:8.0},
  two:{x:75.7,y:51.8,w:27.4,h:8.2},
  three:{x:50.6,y:42.2,w:24.4,h:7.9},
  four:{x:75.6,y:30.9,w:26.2,h:8.2}
 };
 const ORDER=["one","two","three","four"];
 const normalize=v=>String(v??"").toLocaleLowerCase("tr").replaceAll("_"," ").trim();
 const isCounter=a=>/üst sayaç|güç sayacı|çalışma oranları|basamak sayısı|^harcama$|^aktarım$/.test(a);
 function plan(q){
  const entries=Array.isArray(q?.visual?.labels)?q.visual.labels:[];
  if(q?.obstacleId!=="F02"||entries.length===0||entries.length>5)return null;
  const out=[],used=new Set();
  const put=(slot,item,value=item.value)=>{
   if(!POS[slot]||used.has(slot))return false;
   used.add(slot);out.push({slot,anchor:String(item.anchor||""),value:String(value??"")});return true;
  };
  const recharge=entries.find(e=>normalize(e.anchor)==="ilk enerji");
  const door=entries.find(e=>normalize(e.anchor)==="kapı tüketimi");
  const lamp=entries.find(e=>normalize(e.anchor)==="uyarı");
  const lampRatio=entries.find(e=>normalize(e.anchor)==="uyarı kullanımı");
  if(recharge&&door&&lamp&&lampRatio){
    put("one",recharge);put("two",lamp);
    put("top",{anchor:"Enerji kullanım oranları",value:"Kapı "+door.value+" • Lamba "+lampRatio.value});
    return out;
  }
  const repeated=entries.find(e=>normalize(e.anchor)==="her basamak");
  const count=entries.find(e=>normalize(e.anchor)==="basamak sayısı");
  if(repeated&&count){
    const n=Number(count.value);
    if(!Number.isInteger(n)||n<1||n>4)return null;
    put("top",count,n+" Basamak");
    for(let i=0;i<n;i++)put(ORDER[i],{anchor:"Basamak "+(i+1)},repeated.value);
    return out;
  }
  for(const e of entries){
    const a=normalize(e.anchor);
    if(isCounter(a))put("top",e);
  }
  const stepEntries=entries.filter(e=>!isCounter(normalize(e.anchor)));
  // Ordered data maps to the climbing path, from its bottom step to its top step.
  for(let i=0;i<stepEntries.length;i++){
    const e=stepEntries[i],a=normalize(e.anchor);
    let wish=null;
    const matched=a.match(/^basamak ([1-4])$/);
    if(matched)wish=ORDER[Number(matched[1])-1];
    else if(/üst basamak/.test(a))wish="four";
    else if(/son basamak|^son$/.test(a))wish="three";
    else if(/orta basamak|basamak b|^orta$/.test(a))wish="two";
    else if(/ilk basamak|alt basamak|giriş|ilk enerji|^ilk$|basamak a/.test(a))wish="one";
    else if(/basamak c/.test(a))wish="three";
    else if(/kapı tüketimi|hasarlı taş/.test(a))wish="two";
    else if(/uyarı kullanımı/.test(a))wish="four";
    else if(/^uyarı$/.test(a))wish="three";
    else if(/^sol$/.test(a))wish="one";
    else if(/^sağ$/.test(a))wish="two";
    else if(/harcama|aktarım/.test(a))wish="three";
    if(wish&&used.has(wish))wish=null;
    if(!wish)wish=ORDER.find(x=>!used.has(x));
    if(wish)put(wish,e);
  }
  // For two-step question types, show the second step near the first; no fake digits.
  return out;
 }

 // Teacher-grade progressive hints: method first, concrete intermediate computation second.
 function guide(q){
  if(q?.obstacleId!=="F02")return null;
  const entries=q.visual?.labels||[];
  const map=new Map(entries.map(e=>[normalize(e.anchor),String(e.value)]));
  const get=k=>map.get(k);
  const power=value=>{
    const m=String(value??"").match(/^2([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/);
    if(!m)return NaN;
    const exponent=Number([...m[1]].map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(c)).join(""));
    return 2**exponent;
  };
  const value=k=>power(get(k));
  const hint=(first,second)=>({first,second,solution:String(q.solution||"")});
  const n0=entries.length;
  if(get("basamak sayısı")&&get("her basamak")){
    const count=Number(get("basamak sayısı")),single=value("her basamak");
    return hint([
      "Her basamağın gücü "+get("her basamak")+" olarak verilmiş. Önce bu üslü ifadenin değerini bul.",
      "Bütün basamakların gücü eşit olduğundan, bir basamağın gücü ile "+count+" basamak sayısını çarp."
    ],[
      get("her basamak")+" = "+single+". Bir basamak "+single+" birim güç üretir.",
      "Tüm basamaklar için "+count+" × "+single+" işlemini yap; aynı enerjiyi "+count+" kez toplamakla eşdeğerdir."
    ]);
  }
  if(get("basamak 1")&&get("basamak 4")){
    const keys=["basamak 1","basamak 2","basamak 3","basamak 4"],ns=keys.map(value);
    return hint([
      "Dört taşın üzerindeki üslü ifadeleri ayrı ayrı hesapla.",
      "Son iki basamağın enerjilerini topla. İlk iki basamağın toplamını da bulup iki toplam arasındaki farkı hesapla."
    ],[
      "Basamak enerjileri sırasıyla "+ns.join(", ")+" birimdir.",
      "İlk ikisi için "+ns[0]+" + "+ns[1]+", son ikisi için "+ns[2]+" + "+ns[3]+" toplanır. Son ikinin toplamından ilk ikininkini çıkar."
    ]);
  }
  if(get("ilk basamak levhası")||get("ilk basamak")&&get("güç sayacı")){
    const raw=get("üst sayaç")||get("güç sayacı")||"",total=Number(String(raw).match(/[0-9]+/)?.[0]);
    const middle=/ortadaki/i.test(q.prompt);
    return hint([
      "Basamaklarda 2 üzeri a (veya n), onun dört katı ve on altı katı bulunuyor.",
      "Ortak kuvveti paranteze al: 2 üzeri a × (1 + 4 + 16). Toplam enerji buradan hesaplanır."
    ],[
      "Parantezin içi 21 eder. Böylece 21 × ortak kuvvet = "+total+" eşitliğini elde edersin.",
      middle?"Önce "+total+" sayısını 21'e böl; bulunan ilk basamak değerinin 4 katı ortadaki basamağın enerjisidir.":"Önce "+total+" sayısını 21'e böl; sonuç ilk basamağın enerjisidir."
    ]);
  }
  if(get("alt basamak")&&get("üst basamak")&&get("aktarım")){
    const a=value("alt basamak"),b=value("üst basamak");
    return hint([
      "Alt ve üst basamaktaki enerjileri üslü ifadeleri hesaplayarak bul.",
      "Yedek lambalara enerjinin dörtte biri aktarılacak. İki enerjiyi topla ve toplamı dört eş parçaya böl."
    ],[
      "Alt basamak "+get("alt basamak")+" = "+a+", üst basamak "+get("üst basamak")+" = "+b+" birimdir.",
      "Önce "+a+" + "+b+" işlemini yap, sonra bulunan toplamı 4'e böl."
    ]);
  }
  if(get("ilk")&&get("orta")&&get("son")&&get("çalışma oranları")){
    const a=value("ilk"),b=value("orta"),c=value("son");
    return hint([
      "Üç basamağın güçleri ayrı ayrı verilmiştir. Önce her üslü ifadenin değerini hesapla.",
      "İlk basamak tamamen; orta basamağın dörtte biri; son basamağın yarısı çalışıyor. Yalnızca çalışan enerjileri topla."
    ],[
      "Üç basamağın enerjileri sırasıyla "+a+", "+b+" ve "+c+" birimdir.",
      "Çalışan toplam enerji için "+a+" + ("+b+" ÷ 4) + ("+c+" ÷ 2) işlemini yap."
    ]);
  }
  if(get("ilk enerji")&&get("kapı tüketimi")&&get("uyarı")&&get("uyarı kullanımı")){
    const start=value("ilk enerji"),warning=value("uyarı");
    return hint([
      "Depolanmış ilk enerjiyi bul. Kapıyı açmak için bunun dörtte biri tüketiliyor.",
      "Uyarı lambası içinse ayrıca "+get("uyarı")+" enerjisinin yarısı harcanıyor. İki harcamayı başlangıç enerjisinden çıkar."
    ],[
      get("ilk enerji")+" = "+start+" ve "+get("uyarı")+" = "+warning+" birim enerji.",
      "Kapının tüketimi "+start+" ÷ 4; lambanın tüketimi "+warning+" ÷ 2'dir. Önce bu iki tüketimi bul, sonra "+start+" birimden çıkar."
    ]);
  }
  if(get("sol")&&get("sağ")&&get("harcama")){
    const a=value("sol"),b=value("sağ"),c=value("harcama");
    return hint([
      "İlk olarak sol ve sağ basamaklardaki üslü enerji değerlerini hesapla.",
      "Basamakların toplamı başlangıç enerjisidir. Kapı açılırken harcanan enerjiyi bu toplamdan çıkar."
    ],[
      "Sol basamak "+a+", sağ basamak "+b+" birimdir. Birlikte "+a+" + "+b+" enerji verir.",
      "Kapı için "+get("harcama")+" = "+c+" birim tüketiliyor. Şimdi ("+a+" + "+b+") − "+c+" işlemini yap."
    ]);
  }
  if(get("basamak a")&&get("basamak b")&&get("basamak c")){
    const ns=["basamak a","basamak b","basamak c"].map(value);
    return hint([
      "Üç taşın üzerindeki üslü ifadeleri ayrı ayrı sayıya dönüştür.",
      "Üç basamak birlikte çalıştığı için elde ettiğin enerji değerlerini topla."
    ],[
      "Üç güç değeri sırasıyla "+ns[0]+", "+ns[1]+" ve "+ns[2]+" birimdir.",
      "Bu üç değeri toplamak için "+ns.join(" + ")+" işlemini tamamla."
    ]);
  }
  if(get("basamak 1")&&get("basamak 2")){
    const a=value("basamak 1"),b=value("basamak 2");
    return hint([
      "İki basamağın üslü ifadelerini ayrı ayrı hesapla; 2 üzeri n, 2'nin n kez çarpımıdır.",
      "İki basamak birlikte etkinleşiyorsa güçleri toplanır."
    ],[
      get("basamak 1")+" = "+a+" ve "+get("basamak 2")+" = "+b+".",
      "Toplam gücü bulmak için "+a+" + "+b+" işlemini yap."
    ]);
  }
  if(get("giriş")&&get("hasarlı taş")){
    const a=value("giriş"),b=value("hasarlı taş");
    return hint([
      "Giriş basamağındaki depolanmış enerji ile hasarlı taş için harcanan enerjiyi ayrı ayrı bul.",
      "Harcanan güç başlangıçtaki güçten çıkarılır, toplanmaz."
    ],[
      "Depolanan enerji "+get("giriş")+" = "+a+", tüketilen enerji "+get("hasarlı taş")+" = "+b+".",
      "Geriye kalanı bulmak için "+a+" − "+b+" işlemini yap."
    ]);
  }
  if(n0===0)return null;
  return hint([
    "Taş levhalarındaki üslü ifadelerin değerlerini ayrı ayrı bul.",
    "Soruda toplam mı, fark mı yoksa oran mı istendiğini belirleyip buna göre işlem seç."
  ],[
    String(q.hint||"Sorudaki verileri hesapla."),
    "Bulduğun ara sonuçları sorunun istediği işlemle birleştir."
  ]);
 }

 function render(visual,q){
  const labels=plan(q);
  if(!labels)return false;
  const scene=document.createElement("div");
  scene.className="mtk-f02-art";
  scene.setAttribute("aria-label","Işıklı Taş Basamaklar: değişken matematik levhaları");
  const art=document.createElement("img");
  art.className="mtk-f02-image";art.src=IMAGE;
  art.alt="Erdem ile Çiko'nun önünde dört büyülü ışıklı taş basamak; dört boş levha ve üst enerji göstergesi";
  art.draggable=false;scene.appendChild(art);
  for(const {slot,anchor,value} of labels){
    const pos=POS[slot],node=document.createElement("span");
    node.className="mtk-f02-label"+(String(value).length>13?" long":"");
    node.style.left=pos.x+"%";node.style.top=pos.y+"%";
    node.style.width=pos.w+"%";node.style.height=pos.h+"%";
    node.textContent=value;node.title=anchor;
    node.setAttribute("aria-label",anchor+" "+value);scene.appendChild(node);
  }
  visual.appendChild(scene);
  return true;
 }

 function enhance(frame,q){
  if(!frame||q?.obstacleId!=="F02")return false;
  frame.classList.add("mtk-f02-v165");
  /* The general frame stylesheet is injected by mount() at runtime.
     Move F02's scoped rules after it so generic nth-child positioning cannot win. */
  const ownCss=document.getElementById("mtk-f02-approved-css-v165");
  if(ownCss&&document.head)document.head.appendChild(ownCss);
  const visual=frame.querySelector(".mtk-visual-region"),scene=visual?.querySelector(".mtk-f02-art");
  if(!visual||!scene)return false;
  const sync=()=>{
    if(!frame.isConnected)return;
    const w=visual.clientWidth,h=visual.clientHeight;
    if(w<=0||h<=0)return;
    // F02 images and labels occupy the EXACT SAME visible box.
    // Never scale beyond the available frame: this previously cropped Çiko and
    // moved numbers relative to the ornamental plaques.
    scene.style.width="100%";scene.style.height="100%";
    scene.style.left="0";scene.style.top="0";scene.style.transform="none";
  };
  requestAnimationFrame(sync);
  if(window.ResizeObserver)new ResizeObserver(sync).observe(visual);
  else window.addEventListener("resize",sync,{passive:true});
  return true;
 }
 const style=document.createElement("style");
 style.id="mtk-f02-approved-css-v165";
 style.textContent="\n    body.mtk-approved-active .mtk-frame.mtk-f02-v165 {\n      position:relative!important; isolation:isolate!important; overflow:hidden!important;\n      width:min(100vw,calc(100dvh * 2 / 3))!important;\n      height:auto!important; aspect-ratio:2 / 3!important;\n      max-width:none!important; max-height:100dvh!important; padding:0!important;\n      margin:0 auto!important; border:0!important; border-radius:0!important;\n      box-shadow:none!important; background:#073b33!important; container-type:inline-size;\n    }\n    .mtk-frame.mtk-f02-v165 .f01-approved-portrait {\n      position:absolute;inset:0;width:100%;height:100%;object-fit:fill;z-index:0;\n      pointer-events:none;user-select:none;\n    }\n    .mtk-frame.mtk-f02-v165 .f01-approved-landscape {display:none}\n    .mtk-frame.mtk-f02-v165 .f01-landscape-panel{display:none}\n    .mtk-frame.mtk-f02-v165 .mtk-visual-region {\n      position:absolute!important;left:0!important;top:0!important;width:100%!important;\n      height:52.1%!important;overflow:visible!important;z-index:2!important;\n      transform:none!important;pointer-events:none!important;background:none!important;\n    }\n    .mtk-frame.mtk-f02-v165 .f01-label {\n      position:absolute;z-index:5;transform:translate(-50%,-50%);display:flex;\n      align-items:center;justify-content:center;text-align:center;\n      padding:0 2px;box-sizing:border-box;\n      font:900 clamp(11px,3.25cqw,27px)/1.08 system-ui,-apple-system,sans-serif!important;\n      color:#f9f4d4!important;text-shadow:0 2px 3px #062f2c,0 0 2px #072d23;\n      white-space:normal;overflow-wrap:anywhere;pointer-events:none;\n    }\n    .mtk-frame.mtk-f02-v165 .f01-label.long{font-size:clamp(10px,2.4cqw,21px)!important}\n    .mtk-frame.mtk-f02-v165 .mtk-question-region{\n      position:absolute!important;left:5.2%!important;top:55.7%!important;width:89.6%!important;\n      height:20.6%!important;min-height:0!important;z-index:3!important;\n      display:flex!important;flex-direction:column!important;gap:3px!important;\n      padding:0!important;margin:0!important;overflow-y:auto!important;\n      background:none!important;border:0!important;box-shadow:none!important;\n      overscroll-behavior:contain;\n    }\n    .mtk-frame.mtk-f02-v165 .mtk-question-region .prompt{\n      color:#342a1a!important; background:transparent!important;border:0!important;\n      padding:0!important;margin:0!important;font:750 clamp(12px,3.28cqw,21px)/1.28 system-ui,-apple-system,sans-serif!important;\n      text-align:left!important;white-space:normal!important;overflow-wrap:break-word!important;\n    }\n    .mtk-frame.mtk-f02-v165 .choiceGrid{\n      position:absolute!important;left:4.3%!important;top:77.8%!important;width:91.4%!important;\n      height:17.3%!important;max-height:none!important;min-height:0!important;z-index:6!important;\n      display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;\n      grid-template-rows:repeat(2,minmax(0,1fr))!important;\n      gap:8% 4%!important;padding:0!important;margin:0!important;\n      background:transparent!important;border:0!important;box-shadow:none!important;\n    }\n    .mtk-frame.mtk-f02-v165 .choiceGrid .choice{\n      appearance:none!important;display:flex!important;align-items:center!important;justify-content:center!important;\n      position:relative!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;\n      width:100%!important;height:100%!important;min-height:0!important;\n      background:transparent!important;border:0!important;border-radius:12px!important;\n      box-shadow:none!important;padding:2px 4px!important;margin:0!important;\n      color:#302719!important; font:800 clamp(12px,3.4cqw,25px)/1.1 system-ui,-apple-system,sans-serif!important;\n      gap:8px!important;cursor:pointer;touch-action:manipulation;\n    }\n    .mtk-frame.mtk-f02-v165 .choiceGrid .choice .choiceMark{font:900 1em/1 system-ui!important;color:inherit!important}\n    .mtk-frame.mtk-f02-v165 .choiceGrid .choice:focus-visible{\n      outline:3px solid #078d8b!important;outline-offset:-4px!important;\n    }\n    .mtk-frame.mtk-f02-v165 .choiceGrid .choice.wrongChoice{\n      background:#ea717144!important;box-shadow:inset 0 0 0 3px #b44d3e!important;\n    }\n    .mtk-frame.mtk-f02-v165 .choiceGrid .choice[aria-pressed=\"true\"]{\n      background:#80d2ad50!important;box-shadow:inset 0 0 0 3px #228675!important;\n    }\n    .mtk-frame.mtk-f02-v165 .mtk-feedback-overlay{\n      position:relative!important;inset:auto!important;width:100%!important;\n      height:auto!important;max-height:none!important;overflow:visible!important;\n      background:#fff0cfee!important;color:#40301c!important;z-index:7!important;\n      margin:0!important;padding:5px!important;box-shadow:none!important;border-radius:10px!important;\n    }\n    .mtk-frame.mtk-f02-v165 .mtk-feedback-overlay[hidden]{display:none!important}\n    .mtk-frame.mtk-f02-v165 .mtk-feedback-toggle{\n      position:relative!important;inset:auto!important;min-height:25px!important;\n      font:700 12px system-ui!important;align-self:flex-start!important;pointer-events:auto!important;\n    }\n    @media (orientation:landscape){\n      body.mtk-approved-active .mtk-frame.mtk-f02-v165 {\n        width:100vw!important;height:100dvh!important;aspect-ratio:auto!important;\n        max-height:100dvh!important;max-width:100vw!important;margin:0!important;\n        border-radius:0!important;\n        background:linear-gradient(120deg,#0e3831,#0e5143)!important;\n      }\n      .mtk-frame.mtk-f02-v165 .f01-approved-portrait{display:none}\n      .mtk-frame.mtk-f02-v165 .f01-approved-landscape{\n        display:block;position:absolute;left:0;top:50%;transform:translateY(-50%);\n        width:50%;height:auto;aspect-ratio:1024 / 800;object-fit:contain;z-index:0;\n        pointer-events:none;user-select:none;\n      }\n      .mtk-frame.mtk-f02-v165 .f01-landscape-panel{\n        display:block;position:absolute;left:50%;top:0;width:50%;height:100%;box-sizing:border-box;\n        background:linear-gradient(130deg,#fff5da,#fce5ac)!important;\n        border:5px solid #c99b50;border-radius:14px;box-shadow:inset 0 0 0 2px #fef1cc;\n        z-index:1;pointer-events:none;\n      }\n      .mtk-frame.mtk-f02-v165 .mtk-visual-region{\n        left:0!important;top:50%!important;transform:translateY(-50%)!important;\n        width:50%!important;height:auto!important;aspect-ratio:1024 / 800!important;\n      }\n      .mtk-frame.mtk-f02-v165 .f01-label{\n        font-size:clamp(11px,1.55vw,21px)!important;\n      }\n      .mtk-frame.mtk-f02-v165 .f01-label.long{font-size:clamp(9px,1.25vw,17px)!important}\n      .mtk-frame.mtk-f02-v165 .mtk-question-region{\n        left:52%!important;top:5%!important;width:46%!important;height:55%!important;\n        padding:2px!important;\n      }\n      .mtk-frame.mtk-f02-v165 .mtk-question-region .prompt{\n        font-size:clamp(13px,1.65vw,22px)!important;line-height:1.22!important;\n      }\n      .mtk-frame.mtk-f02-v165 .choiceGrid{\n        left:52%!important;top:63%!important;width:46%!important;height:32%!important;\n        gap:8% 4%!important;\n      }\n      .mtk-frame.mtk-f02-v165 .choiceGrid .choice{\n        background:#fffaf0b6!important;border:2px solid #bd9254!important;\n        box-shadow:0 1px 2px #5c431d45!important;\n        font-size:clamp(12px,1.55vw,21px)!important;\n      }\n    }\n\n    /* F01 bottom parchment extends from 54% to 97%: cover question text AND four choices. */\n    .mtk-frame.mtk-f02-v165.mtk-help-mode .choiceGrid{display:grid!important;pointer-events:none!important}\n    .mtk-frame.mtk-f02-v165.mtk-help-mode .mtk-answer-help-card{\n      box-sizing:border-box!important;position:absolute!important;inset:auto!important;\n      left:4.3%!important;top:54.4%!important;width:91.4%!important;height:42.0%!important;\n      min-height:0!important;max-height:none!important;overflow:hidden!important;\n      display:flex!important;flex-direction:column!important;\n      padding:12px 13px!important;margin:0!important;\n      background:#fff2d4!important;border:2px solid #af8655!important;\n      border-radius:14px!important;z-index:35!important;box-shadow:0 4px 14px #54331544!important;\n    }\n    .mtk-frame.mtk-f02-v165 .mtk-answer-help-card .mtk-help-body{\n      min-height:0!important;flex:1 1 auto!important;overflow-y:auto!important;\n      font-size:clamp(13px,3.0cqw,21px)!important;line-height:1.45!important;\n    }\n    .mtk-frame.mtk-f02-v165 .mtk-answer-help-card .mtk-help-foot{\n      flex:0 0 auto!important;padding-top:8px!important;border-top:1px solid #c4a371!important;\n    }\n    .mtk-frame.mtk-f02-v165.mtk-answer-hint-closed .mtk-question-region{\n      overflow:hidden!important;display:flex!important;flex-direction:column!important;gap:6px!important;\n    }\n    .mtk-frame.mtk-f02-v165.mtk-answer-hint-closed .mtk-question-region>.prompt{\n      flex:1 1 auto!important;min-height:0!important;max-height:none!important;overflow-y:auto!important;\n    }\n    .mtk-frame.mtk-f02-v165.mtk-answer-hint-closed .mtk-inline-hint-trigger{\n      position:relative!important;inset:auto!important;width:100%!important;height:auto!important;\n      flex:0 0 auto!important;overflow:visible!important;max-height:none!important;\n      background:transparent!important;border:0!important;box-shadow:none!important;\n      padding:0!important;margin:0!important;z-index:5!important;\n    }\n    .mtk-frame.mtk-f02-v165.mtk-answer-hint-closed .mtk-inline-hint-trigger .btnRow{\n      justify-content:flex-start!important;margin:0!important;padding:0!important;\n    }\n    .mtk-frame.mtk-f02-v165.mtk-answer-hint-closed .mtk-inline-hint-trigger .btn{\n      min-height:36px!important;padding:5px 12px!important;\n      font-size:clamp(12px,2.8cqw,18px)!important;\n    }\n    @media (orientation:landscape){\n      .mtk-frame.mtk-f02-v165.mtk-help-mode .mtk-answer-help-card{\n        left:51.5%!important;top:4%!important;width:47%!important;height:92%!important;\n        padding:10px 13px!important;\n      }\n      .mtk-frame.mtk-f02-v165 .mtk-answer-help-card .mtk-help-body{\n        font-size:clamp(12px,1.6vw,19px)!important;\n      }\n    }\n    @media (prefers-reduced-motion:reduce){\n      .mtk-frame.mtk-f02-v165 *{transition:none!important;animation:none!important}\n    }\n  \n\n/* F02 retains the first obstacle's answer spacing, tip navigation and two-screen layouts. */\nbody.mtk-approved-active .mtk-frame.mtk-f02-v165{background:#f8e5b7!important}\n.mtk-frame.mtk-f02-v165::before{content:\"\";position:absolute;left:0;top:60.5%;width:100%;height:39.5%;box-sizing:border-box;pointer-events:none;z-index:1;background:linear-gradient(130deg,#fff7e4,#f7dbab);border:6px solid #d7a958;border-radius:14px;box-shadow:inset 0 0 0 2px #fce8bf}\n.mtk-frame.mtk-f02-v165 .mtk-visual-region{left:0!important;top:0!important;width:100%!important;height:60.5%!important;overflow:hidden!important;box-sizing:border-box!important;border:3px solid #d8a550!important;border-radius:14px!important;transform:none!important;z-index:2!important}\n.mtk-frame.mtk-f02-v165 .mtk-question-region{left:5.2%!important;top:62.1%!important;width:89.6%!important;height:17.2%!important;z-index:4!important}\n.mtk-frame.mtk-f02-v165 .choiceGrid{top:81.1%!important;height:15.3%!important}\n.mtk-frame.mtk-f02-v165 .choiceGrid .choice{border:2px solid #b8894c!important;background:#fff9e9b0!important;box-shadow:0 2px 3px #6b451f55!important}\n.mtk-frame.mtk-f02-v165 .mtk-question-region .prompt{font-size:clamp(12px,3.15cqw,21px)!important}\n.mtk-frame.mtk-f02-v165.mtk-help-mode .mtk-answer-help-card{top:61.4%!important;height:35.8%!important;left:4.3%!important;width:91.4%!important}\n.mtk-frame.mtk-f02-v165.mtk-answer-hint-closed .mtk-question-region>.prompt{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important}\n.mtk-frame .mtk-visual-region .mtk-f02-art{position:absolute;width:100%;height:100%;overflow:hidden;pointer-events:none}\n.mtk-frame .mtk-f02-art .mtk-f02-image{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;user-select:none;pointer-events:none}\n.mtk-frame .mtk-f02-art .mtk-f02-label{position:absolute;z-index:7;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;color:#fff5d5;text-shadow:0 2px 4px #062921,0 1px 1px #05180d;font:950 clamp(13px,3.3cqw,27px)/1.15 system-ui,sans-serif;text-align:center;overflow-wrap:anywhere;white-space:normal;box-sizing:border-box;padding:2px 4px;pointer-events:none}\n.mtk-frame .mtk-f02-art .mtk-f02-label.long{font-size:clamp(11px,2.55cqw,20px)}\n@media(orientation:landscape){\nbody.mtk-approved-active .mtk-frame.mtk-f02-v165{background:linear-gradient(105deg,#0c3b31,#0f4b3d)!important}\n.mtk-frame.mtk-f02-v165::before{left:50%!important;top:0!important;width:50%!important;height:100%!important;border:5px solid #c99b50!important;border-radius:14px!important}\n.mtk-frame.mtk-f02-v165 .mtk-visual-region{left:0!important;top:0!important;width:50%!important;height:100%!important;aspect-ratio:auto!important;transform:none!important;border-radius:0!important}\n.mtk-frame.mtk-f02-v165 .mtk-question-region{left:52%!important;top:5%!important;width:46%!important;height:55%!important}\n.mtk-frame.mtk-f02-v165 .choiceGrid{left:52%!important;top:63%!important;width:46%!important;height:32%!important}\n.mtk-frame.mtk-f02-v165.mtk-help-mode .mtk-answer-help-card{left:51.5%!important;top:4%!important;width:47%!important;height:92%!important}\n.mtk-frame .mtk-f02-art .mtk-f02-label{font-size:clamp(12px,1.55vw,24px)}\n.mtk-frame .mtk-f02-art .mtk-f02-label.long{font-size:clamp(10px,1.3vw,18px)}\n}";
 style.textContent+="\n /* v166: F02-only layout. Keep the whole approved picture visible, and neutralize\n    legacy absolute nth-child rules so ALL answers stay inside the parchment. */\n body.mtk-approved-active .mtk-frame.mtk-f02-v165 .mtk-visual-region .mtk-f02-art{\n   position:absolute!important;inset:0!important;\n   left:0!important;top:0!important;width:100%!important;height:100%!important;\n   transform:none!important;overflow:hidden!important;box-sizing:border-box!important;\n }\n body.mtk-approved-active .mtk-frame.mtk-f02-v165 .mtk-visual-region .mtk-f02-image{\n   position:absolute!important;inset:0!important;width:100%!important;height:100%!important;\n   object-fit:fill!important;object-position:center!important;\n }\n body.mtk-approved-active .mtk-frame.mtk-f02-v165>.choiceGrid{\n   position:absolute!important;inset:auto!important;\n   left:4.3%!important;top:81.1%!important;width:91.4%!important;height:15.3%!important;\n   max-width:91.4%!important;max-height:none!important;min-width:0!important;\n   box-sizing:border-box!important;display:grid!important;\n   grid-template-columns:repeat(2,minmax(0,1fr))!important;\n   grid-template-rows:repeat(2,minmax(0,1fr))!important;\n   column-gap:3.5%!important;row-gap:6%!important;\n   overflow:visible!important;padding:0!important;margin:0!important;\n   pointer-events:none!important;\n }\n body.mtk-approved-active .mtk-frame.mtk-f02-v165>.choiceGrid>.choice,\n body.mtk-approved-active .mtk-frame.mtk-f02-v165>.choiceGrid>.choice:nth-child(1),\n body.mtk-approved-active .mtk-frame.mtk-f02-v165>.choiceGrid>.choice:nth-child(2),\n body.mtk-approved-active .mtk-frame.mtk-f02-v165>.choiceGrid>.choice:nth-child(3),\n body.mtk-approved-active .mtk-frame.mtk-f02-v165>.choiceGrid>.choice:nth-child(4){\n   box-sizing:border-box!important;position:static!important;inset:auto!important;\n   left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;\n   transform:none!important;display:flex!important;\n   min-width:0!important;max-width:100%!important;width:100%!important;\n   min-height:0!important;max-height:100%!important;height:100%!important;\n   overflow:hidden!important;pointer-events:auto!important;\n   align-items:center!important;justify-content:center!important;\n   padding:4px 6px!important;margin:0!important;\n   border:2px solid #b8894c!important;border-radius:13px!important;\n   background:#fff9e9c9!important;box-shadow:0 2px 3px #6b451f55!important;\n   font-size:clamp(13px,3.1cqw,23px)!important;\n }\n @media(orientation:landscape){\n   body.mtk-approved-active .mtk-frame.mtk-f02-v165>.choiceGrid{\n     inset:auto!important;left:52%!important;top:63%!important;\n     width:46%!important;max-width:46%!important;height:32%!important;\n     column-gap:4%!important;row-gap:8%!important;\n   }\n   body.mtk-approved-active .mtk-frame.mtk-f02-v165>.choiceGrid>.choice{\n     font-size:clamp(12px,1.55vw,20px)!important;\n   }\n   body.mtk-approved-active .mtk-frame.mtk-f02-v165 .mtk-visual-region .mtk-f02-label{\n     font-size:clamp(12px,1.45vw,23px)!important;\n   }\n }\n";
 if(!document.getElementById(style.id))document.head.appendChild(style);
 window.MTKF02ApprovedV165=Object.freeze({render,enhance,plan,guide,positions:POS});
})();

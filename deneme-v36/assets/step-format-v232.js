/* v232: shared, lossless step formatting for all teaching views. */
(function(root){const api=(function build(){
 "use strict";
 // Only split presentation, never calculate or modify any mathematical value.
 // Unicode mathematical tokens and single-letter variables; decimal punctuation is retained.
 const tokenRun=/(?:[0-9⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻ⁺⁻√∛∜×÷·−+*/=<>≤≥≠≈^()[\]{}|%→²³\-]+|[.,](?=\d)|(?<![\p{L}])[a-zA-Z](?![\p{L}])|[ \t])+/gu;
 const operation=/[=≤≥≠≈<>×÷·+−*/→]|(?<=\d)-(?=\d)/u;
 function lines(input){
  const s=String(input??"");
  const result=[];
  function prose(value){
   // Keep sentence numbers (1. gün etc.) and decimal separators intact.
   for(const part of value.split(/(?:\r?\n)+|(?<=;)\s+|(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ])/u)){
    const trimmed=part.trim();if(trimmed)result.push({kind:"text",text:trimmed});
   }
  }
  let pos=0;
  for(const match of s.matchAll(tokenRun)){
   const text=match[0].trim();
   if(!text||!operation.test(text)||!/[0-9⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻ√∛∜a-zA-Z]/u.test(text))continue;
   // A bare fraction in prose is not an operation step.
   if(/^\d+\/\d+$/u.test(text))continue;
   if(/^[\-+−*/=<>≤≥≠≈→×÷·]+$/u.test(text))continue;
   prose(s.slice(pos,match.index));result.push({kind:"math",text});pos=match.index+match[0].length;
  }
  prose(s.slice(pos));
  // A label and its equation form one row; punctuation never occupies a row alone.
  const clean=[];
  for(const item of result){
   let row={...item};
   const prev=clean[clean.length-1];
   if(prev&&row.kind==="text"){
    const leading=row.text.match(/^[.,;:!?]+/u)?.[0];
    if(leading){prev.text+=leading;row.text=row.text.slice(leading.length).trim();}
    if(!row.text)continue;
   }
   if(row.kind==="math"&&prev?.kind==="text"&&prev.text.length<=38&&/[:：]$/u.test(prev.text)&&!s.includes(prev.text+"\n")){
    row.text=prev.text+" "+row.text;clean.pop();
   }
   clean.push(row);
  }
  return clean;
 }

 // v234: semantic exponent groups and true stacked fractions; source remains unchanged.
 const supers="⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻ";
 const supMap=Object.fromEntries([...supers].map((c,i)=>[c,[..."0123456789+−=()nabcdefghijklmoprstuvwxyz"][i]]));
 const escapeHTML=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
 const exponentPattern="["+supers+"]+|\\^\\(([^()]+)\\)|\\^([−-]?\\d+)";
 const powerRE=new RegExp("(\\([^()\\n]+\\)|[√∛∜]?\\d+(?:[.,]\\d+)?|[a-zA-Z])("+exponentPattern+")","gu");
 const supRE=new RegExp(exponentPattern,"gu");
 function powers(input){
  const s=String(input);
  function standalone(part){let out="",at=0;for(const m of part.matchAll(supRE)){
   out+=escapeHTML(part.slice(at,m.index));
   const exponent=m[1]??m[2]??[...m[0]].map(c=>supMap[c]??c).join("");
   out+='<sup class="mtk-math-exp">'+escapeHTML(exponent)+'</sup>';at=m.index+m[0].length;
  }return out+escapeHTML(part.slice(at));}
  let out="",at=0;for(const m of s.matchAll(powerRE)){
   out+=standalone(s.slice(at,m.index));
   out+='<span class="mtk-math-power">'+standalone(m[1])+standalone(m[2])+'</span>';
   at=m.index+m[0].length;
  }return out+standalone(s.slice(at));
 }
 const atom="(?:\\([0-9a-zA-Z√∛∜"+supers+"+−×÷·* .,-]+\\)|(?:[√∛∜]?\\d+(?:[,.]\\d+)?|[a-zA-Z])(?:["+supers+"]+|\\^\\([^()]+\\)|\\^[−-]?\\d+)?)";
 const fractionRE=new RegExp("(?<![\\p{L}\\p{N}.,])("+atom+")\\s*/\\s*("+atom+")(?![\\p{L}\\p{N}])","gu");
 function mathHTML(value,{fractions=true}={}){
  const s=String(value??"");if(!fractions)return powers(s);
  const exponentRanges=[...s.matchAll(/\^\([^()]+\)/g)].map(m=>[m.index,m.index+m[0].length]);
  let out="",at=0;for(const m of s.matchAll(fractionRE)){
   if(exponentRanges.some(([start,end])=>m.index>start&&m.index<end))continue;
   // Do not reinterpret unit strings such as L/sn or 10²/dk.
   out+=powers(s.slice(at,m.index));
   out+='<span class="mtk-math-frac"><span class="mtk-math-num">'+powers(m[1])+'</span><span class="mtk-math-den">'+powers(m[2])+'</span></span>';
   at=m.index+m[0].length;
  }return out+powers(s.slice(at));
 }


 // v244: all instructional division operators render as stacked fractions.
 // Parenthesized operands, radical coefficients, and chained division retain their grouping.
 const teachExp="(?:["+supers+"]+|\\^\\([^()]+\\)|\\^[−-]?\\d+)";
 const teachBasic="(?:(?:\\d+(?:[.,]\\d+)?)?[√∛∜](?:\\([^()]+\\)|\\d+(?:[.,]\\d+)?)|\\d+(?:[.,]\\d+)?|[a-zA-Z])"+teachExp+"?";
 const teachInner="(?:[^()\\n]|\\([^()\\n]*\\))*";
 const teachAtom="(?:\\("+teachInner+"\\)"+teachExp+"?|"+teachBasic+")";
 const teachDivision=new RegExp("(?<![\\p{L}\\p{N}.,])("+teachAtom+")(?:\\s*[÷/]\\s*"+teachAtom+")+(?![\\p{L}\\p{N}])","gu");
 const teachParts=new RegExp("^("+teachAtom+")|\\s*[÷/]\\s*("+teachAtom+")","gu");
 const frac=(n,d)=>'<span class="mtk-math-frac"><span class="mtk-math-num">'+n+'</span><span class="mtk-math-den">'+d+'</span></span>';
 function instructionalHTML(value){
  const s=String(value??"");
  let out="",at=0;
  for(const m of s.matchAll(teachDivision)){
   // A fractional exponent belongs inside the exponent, not the baseline.
   const before=s.slice(0,m.index);
   if(/\^\([^()]*$/.test(before))continue;
   const parts=[...m[0].matchAll(teachParts)].map(p=>p[1]||p[2]);
   if(parts.length<2)continue;
   out+=instructionalPlain(s.slice(at,m.index));
   let n=instructionalHTML(parts[0]);for(const d of parts.slice(1))n=frac(n,instructionalHTML(d));
   out+=n;at=m.index+m[0].length;
  }
  return out+instructionalPlain(s.slice(at));
 }
 function instructionalPlain(s){
  // An isolated filter instruction (÷3) has no dividend; spell it out.
  return mathHTML(s.replace(/(?<![\d\p{L}\p{N})])÷\s*(\d+)(?![\d⁰¹²³⁴⁵⁶⁷⁸⁹])/gu,"$1 ile böl"));
 }

 function displayRows(input){
  return lines(input).flatMap(row=>{
   // Break a pure chained equality into consecutive complete equations; do not split prose or inequality statements.
   if(row.kind!=="math"||!/^[-+−0-9⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵃ⁺⁻√∛∜a-zA-Z×÷·*/=^()[\]{}|%., \t]+$/u.test(row.text)||/(?<![\d])[a-zA-Z]{2,}/u.test(row.text))return [row];
   const terms=row.text.split("=").map(s=>s.trim());
   if(terms.length<3||terms.some(s=>!s))return [row];
   return terms.slice(1).map((s,i)=>({kind:"math",text:terms[i]+" = "+s}));
  });
 }
 // v236: only instructional text uses the multiplication middle dot.
 function teachingNotation(input){return String(input??"").replace(/×/gu,"·");}
 function render(element,input,{documentRef,htmlMath}){
  if(!element||!documentRef||typeof htmlMath!=="function")return element;
  element.classList.add("mtk-steps-v232");
  for(const item of displayRows(teachingNotation(input))){
   const row=documentRef.createElement("span");
   row.className=item.kind==="math"?"mtk-step-equation-v232":"mtk-step-prose-v232";
   if(item.kind==="math"){const formula=documentRef.createElement("span");formula.className="mtk-step-formula-v234";formula.innerHTML=instructionalHTML(item.text);row.appendChild(formula);}else row.innerHTML=instructionalHTML(item.text);
   if(item.kind==="math"){row.tabIndex=0;row.setAttribute("aria-label",item.text);}
   element.appendChild(row);
  }
  return element;
 }
 return Object.freeze({lines,displayRows,render,mathHTML,teachingNotation,instructionalHTML});
})();if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKStepFormatV232=api;})(typeof window!=="undefined"?window:globalThis);

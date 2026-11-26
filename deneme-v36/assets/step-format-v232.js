/* v232: shared, lossless step formatting for all teaching views. */
(function(root){const api=(function build(){
 "use strict";
 // Only split presentation, never calculate or modify any mathematical value.
 // Unicode mathematical tokens and single-letter variables; decimal punctuation is retained.
 const tokenRun=/(?:[0-9⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻√∛∜×÷·−+*/=<>≤≥≠≈^()[\]{}|%→²³\-]+|[.,](?=\d)|(?<![\p{L}])[a-zA-Z](?![\p{L}])|[ \t])+/gu;
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
   if(!text||!operation.test(text)||!/[0-9⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ√∛∜a-zA-Z]/u.test(text))continue;
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
   if(row.kind==="math"&&prev?.kind==="text"&&prev.text.length<=38&&/[:：]$/u.test(prev.text)){
    row.text=prev.text+" "+row.text;clean.pop();
   }
   clean.push(row);
  }
  return clean;
 }
 function render(element,input,{documentRef,htmlMath}){
  if(!element||!documentRef||typeof htmlMath!=="function")return element;
  element.classList.add("mtk-steps-v232");
  for(const item of lines(input)){
   const row=documentRef.createElement("span");
   row.className=item.kind==="math"?"mtk-step-equation-v232":"mtk-step-prose-v232";
   row.innerHTML=htmlMath(item.text);
   if(item.kind==="math"){row.tabIndex=0;row.setAttribute("aria-label",item.text);}
   element.appendChild(row);
  }
  return element;
 }
 return Object.freeze({lines,render});
})();if(typeof module!=="undefined"&&module.exports)module.exports=api;else root.MTKStepFormatV232=api;})(typeof window!=="undefined"?window:globalThis);

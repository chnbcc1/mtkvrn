/* Mathematics Universe v116: user preference storage and UI feedback. */
(function(){
 'use strict';
 const KEY='mathverse-v116-settings';
 function load(){try{const p=JSON.parse(localStorage.getItem(KEY)||'{}')||{};return {sound:p.sound!==false,vibration:p.vibration!==false}}catch(e){return {sound:true,vibration:true}}}
 function update(change){const next={...load(),...change};try{localStorage.setItem(KEY,JSON.stringify(next))}catch(e){}return next}
 let audioCtx;
 function feedback(){const p=load();if(p.vibration&&navigator.vibrate){try{navigator.vibrate(12)}catch(e){}}
 if(p.sound){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audioCtx=audioCtx||new Audio();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),t=audioCtx.currentTime;osc.type='sine';osc.frequency.setValueAtTime(570,t);osc.frequency.exponentialRampToValueAtTime(760,t+0.07);gain.gain.setValueAtTime(.025,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.085);osc.connect(gain).connect(audioCtx.destination);osc.start(t);osc.stop(t+.09)}catch(e){}}}
 window.MTKPrefs={load,update,feedback};
 document.addEventListener('click',e=>{if(e.target.closest('button')&&!e.target.matches('input[type="checkbox"]'))feedback()});
})();
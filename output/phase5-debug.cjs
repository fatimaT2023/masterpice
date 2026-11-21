const path=require('node:path');const {start}=require('./phase4-harness.cjs');
(async()=>{const h=await start(path.join(__dirname,'parent-phase5-qa'));try{
 await h.call('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{if(window===top)return;const log=(...a)=>{try{(top.__log=top.__log||[]).push(location.pathname.split('/').pop()+' '+a.join(' '))}catch{}};const orig=EventTarget.prototype.addEventListener;EventTarget.prototype.addEventListener=function(type,fn,opts){if(type==='storage'&&this===window){const wrapped=function(e){log('storage-event',e.key);return fn.apply(this,arguments)};return orig.call(this,type,wrapped,opts)}return orig.call(this,type,fn,opts)};window.addEventListener('beforeunload',()=>log('unload'));})()`});
 await h.open('case-speech','parent-dashboard.html','en',1280,'return !!d.getElementById("careUpdates")');
 await h.sleep(3000);console.log((await h.evaluate('top.__log||[]')).slice(0,40));
}finally{await h.close();}})();

const path=require('node:path'),fs=require('node:fs');const {start}=require('./phase4-harness.cjs');
(async()=>{const h=await start(path.join(__dirname,'parent-phase5-qa'));try{
 await h.open('family','parent-dashboard.html','en',1280,'return !!d.getElementById("parentExperience")');
 console.log('roles',await h.evaluate('[...document.getElementById("previewRole").options].map(o=>o.value+"|"+o.textContent)'));
 await h.evaluate('(()=>{const s=document.getElementById("previewRole");s.value="specialist:showcase_speech_specialist";s.dispatchEvent(new Event("change"));})()');
 await h.sleep(2500);
 console.log(await h.inner('return {url:w.location.pathname,demo:d.documentElement.dataset.demoPreview,title:d.title,role:w.sessionStorage.getItem("rafiqRole"),inbox:!!d.getElementById("practiceInbox"),children:JSON.parse(w.localStorage.getItem("rafiqChildren")||"[]").length,nativeKids:window.top.localStorage.getItem("rafiqChildren")}'));
 console.log('snapshot bytes',await h.evaluate('(sessionStorage.getItem("rafiqPreviewState")||"").length'),'errors',h.errors);
 fs.mkdirSync(path.join(__dirname,'parent-phase5-qa'),{recursive:true});fs.writeFileSync(path.join(__dirname,'parent-phase5-qa','smoke-specialist.png'),Buffer.from((await h.call('Page.captureScreenshot',{format:'png'})).data,'base64'));
}finally{await h.close();}})();

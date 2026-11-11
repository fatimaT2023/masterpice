/* Fictional account installation; child fixtures stay in RAM. */
(() => { 'use strict';const data=window.RafiqDemoCases;
 async function install(storage=localStorage,credentials=window.RafiqPreviewCredentials,scenario=null){
  if(scenario!==null&&!data.cases.some(c=>c.key===scenario))throw Error('Unknown demo account');
  const before=storage.getItem('rafiqUsers'),existing=JSON.parse(before||'[]');if(!Array.isArray(existing))throw Error('Invalid account list');const next=[...existing];
  for(const item of data.cases.filter(c=>scenario===null||c.key===scenario)){const match=existing.find(u=>u.id===item.owner||String(u.email||'').toLowerCase()===item.email);if(match){if(match.role!=='parent'||match.isDemo!==true||match.id!==item.owner||match.email!==item.email||match.demoSet!==data.tag||match.demoScenario!==item.key||!match.previewCredential)throw Error('Demo account collision');continue;}next.push({id:item.owner,role:'parent',email:item.email,fullName:'Demo / عرض — '+item.label.ar,status:'active',isDemo:true,demoSet:data.tag,demoScenario:item.key,createdAt:new Date().toISOString(),previewCredential:await credentials.create(data.password)});}
  if(storage.getItem('rafiqUsers')!==before)throw Error('Accounts changed in another tab');storage.setItem('rafiqUsers',JSON.stringify(next));return next;
 }
window.RafiqShowcaseAccounts={install};
})();

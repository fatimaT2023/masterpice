/* Local account restrictions; the backend must enforce the same checks in production. */
(()=>{'use strict';
 const key='rafiqAccountRestrictions';
 const read=name=>{const data=JSON.parse(localStorage.getItem(name)||'[]');if(!Array.isArray(data))throw Error('Account data could not be read.');return data;};
 const same=(a,b)=>a.role===b.role&&((a.id&&b.id&&a.id===b.id)||(a.email&&b.email&&a.email.trim().toLowerCase()===b.email.trim().toLowerCase()));
 function inactive(account){if(!account)return false;const saved=read(key).find(r=>same({...r,id:r.accountId},account));return saved?saved.status==='inactive':account.accountStatus==='inactive';}
 function set(account,status,options={}){
  if(sessionStorage.getItem('rafiqRole')!=='admin')throw Error('Administrator access is required.');
  if(!['parent','specialist'].includes(account.role)||!['active','inactive'].includes(status))throw Error('This account cannot be changed here.');
  const current=read('rafiqUsers').find(u=>same(u,account))||(account.role==='specialist'?read('rafiqSpecialists').find(s=>same({...s,role:'specialist'},account)):null);if(!current)throw Error('The account no longer exists. Refresh the directory.');
  const reason=String(options.reason||'').trim();if(reason.length<5||reason.length>500)throw Error('Enter a reason between 5 and 500 characters.');
  const wasInactive=inactive(account);if(wasInactive===(status==='inactive'))throw Error('The account status changed. Refresh the directory.');
  const transition=status==='inactive'&&window.RafiqAdminFamilies?window.RafiqAdminFamilies.planDeactivation(account,options):{changes:{},summary:{}};
  const list=read(key),index=list.findIndex(r=>same({...r,id:r.accountId},account)),now=new Date().toISOString(),by=sessionStorage.getItem('rafiqAdminEmail')||'admin';
  const record={accountId:current.id,email:current.email||account.email||'',role:account.role,status,reason,updatedAt:now,updatedBy:by};if(index>=0)list[index]=record;else list.push(record);
  const audit=read('rafiqAccountActionAudit');audit.push({id:crypto.randomUUID(),action:status==='inactive'?'account-deactivated':'account-reactivated',...record,previousStatus:wasInactive?'inactive':'active',impact:transition.summary});
  const changes={...transition.changes,[key]:list,rafiqAccountActionAudit:audit},before=new Map(Object.keys(changes).map(name=>[name,localStorage.getItem(name)]));
  try{for(const [name,value] of Object.entries(changes))localStorage.setItem(name,JSON.stringify(value));}catch(error){for(const [name,value] of before)try{if(value===null)localStorage.removeItem(name);else localStorage.setItem(name,value);}catch{}throw error;}
  return record;
 }
 function current(){
  const role=sessionStorage.getItem('rafiqRole');
  if(role==='parent'){const id=sessionStorage.getItem('rafiqParentUserId');return read('rafiqUsers').find(u=>u.id===id&&u.role===role)||null;}
  if(role==='specialist'){const uid=sessionStorage.getItem('rafiqSpecialistRegistrationUserId'),id=sessionStorage.getItem('rafiqSpecialistId');return read('rafiqUsers').find(u=>u.id===uid&&u.role===role)||read('rafiqSpecialists').filter(s=>s.id===id).map(s=>({...s,role}))[0]||null;}
  return null;
 }
 window.RafiqAccountStatus={inactive,set,current};
})();

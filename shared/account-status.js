/* Local account restrictions; the backend must enforce the same checks in production. */
(()=>{'use strict';
 const key='rafiqAccountRestrictions';
 const read=name=>{const data=JSON.parse(localStorage.getItem(name)||'[]');if(!Array.isArray(data))throw Error('Account data could not be read.');return data;};
 const same=(a,b)=>a.role===b.role&&((a.id&&b.id&&a.id===b.id)||(a.email&&b.email&&a.email.trim().toLowerCase()===b.email.trim().toLowerCase()));
 function inactive(account){if(!account)return false;const saved=read(key).find(r=>same({...r,id:r.accountId},account));return saved?saved.status==='inactive':account.accountStatus==='inactive';}
 function set(account,status){
  if(sessionStorage.getItem('rafiqRole')!=='admin')throw Error('Administrator access is required.');
  if(!['parent','specialist'].includes(account.role)||!['active','inactive'].includes(status))throw Error('This account cannot be changed here.');
  const current=read('rafiqUsers').find(u=>same(u,account))||(account.role==='specialist'?read('rafiqSpecialists').find(s=>same({...s,role:'specialist'},account)):null);
  if(!current)throw Error('The account no longer exists. Refresh the directory.');
  const list=read(key),index=list.findIndex(r=>same({...r,id:r.accountId},account));
  const record={accountId:current.id,email:current.email||account.email||'',role:account.role,status,updatedAt:new Date().toISOString(),updatedBy:sessionStorage.getItem('rafiqAdminEmail')||'admin'};
  if(index>=0)list[index]=record;else list.push(record);localStorage.setItem(key,JSON.stringify(list));return record;
 }
 function current(){
  const role=sessionStorage.getItem('rafiqRole');
  if(role==='parent'){const id=sessionStorage.getItem('rafiqParentUserId');return read('rafiqUsers').find(u=>u.id===id&&u.role===role)||null;}
  if(role==='specialist'){const uid=sessionStorage.getItem('rafiqSpecialistRegistrationUserId'),id=sessionStorage.getItem('rafiqSpecialistId');return read('rafiqUsers').find(u=>u.id===uid&&u.role===role)||read('rafiqSpecialists').filter(s=>s.id===id).map(s=>({...s,role}))[0]||null;}
  return null;
 }
 window.RafiqAccountStatus={inactive,set,current};
})();

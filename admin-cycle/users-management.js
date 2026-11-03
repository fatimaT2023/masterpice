/* Registered accounts and reversible administrator restrictions. */
(()=>{'use strict';
 if(sessionStorage.getItem('rafiqRole')!=='admin'){location.replace('../piblic-pages/login.html');return;}
 const get=id=>document.getElementById(id),search=get('userSearch'),api=window.RafiqAccountStatus,dialog=get('accountActionDialog');let users=[],target=null,previous=null;
 const read=key=>{const value=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(value))throw Error('Invalid directory');return value;};
 function load(){
  try{
   const directory=new Map();
   for(const u of read('rafiqUsers').filter(u=>u&&u.id&&['parent','specialist'].includes(u.role))){const key=u.role+':'+(u.email?.trim().toLowerCase()||u.id);if(!directory.has(key))directory.set(key,{...u,fullName:u.fullName||u.name||'Unnamed user'});}
   for(const p of read('rafiqSpecialists').filter(p=>p&&p.id)){const key='specialist:'+(p.email?.trim().toLowerCase()||p.id);if(!directory.has(key))directory.set(key,{...p,role:'specialist',fullName:p.fullName||'Specialist'});}
   users=[...directory.values()].map(u=>({...u,inactive:api.inactive(u)})).sort((a,b)=>(Date.parse(b.createdAt)||0)-(Date.parse(a.createdAt)||0));get('directoryError').hidden=true;
  }catch{users=[];get('directoryError').hidden=false;}
  get('parentCount').textContent=users.length;get('activeAccountCount').textContent=users.filter(u=>!u.inactive).length;get('inactiveAccountCount').textContent=users.filter(u=>u.inactive).length;render();
 }
 function render(){
  const term=search.value.trim().toLowerCase(),role=get('userRoleFilter').value,status=get('userStatusFilter').value;
  const visible=users.filter(u=>(role==='all'||u.role===role)&&(status==='all'||(status==='inactive')===u.inactive)&&[u.fullName,u.email,u.phone].some(v=>String(v||'').toLowerCase().includes(term))),body=get('userRows');body.replaceChildren();
  for(const user of visible){
   const row=document.createElement('tr'),date=new Date(user.createdAt);
   for(const value of [user.fullName,user.email||'—',user.phone||'—',user.role==='parent'?'Parent':'Specialist',Number.isNaN(date.getTime())?'—':date.toLocaleDateString('en-GB')]){const cell=document.createElement('td');cell.textContent=value;row.append(cell);}
   const statusCell=document.createElement('td'),badge=document.createElement('span');badge.className='account-status '+(user.inactive?'is-inactive':'is-active');badge.textContent=user.inactive?'Inactive':'Active';statusCell.append(badge);row.append(statusCell);
   const actions=document.createElement('td'),button=document.createElement('button');button.type='button';button.className='account-action'+(user.inactive?'':' is-danger');button.textContent=user.inactive?'Reactivate':'Deactivate';button.setAttribute('aria-label',button.textContent+' '+user.fullName);
   button.addEventListener('click',()=>{target={...user,desiredStatus:user.inactive?'active':'inactive'};previous=button;dialog.setAttribute('data-action',target.desiredStatus);get('accountActionTitle').textContent=user.inactive?'Reactivate this account?':'Deactivate this account?';get('accountActionName').textContent=user.fullName+' · '+(user.email||user.id);get('accountActionDescription').textContent=user.inactive?'This user will be able to sign in again. Specialist approval is still required separately.':'This user will not be able to sign in. Their current local sessions will be signed out. Their records, appointments and messages will be kept.';get('confirmAccountAction').textContent=user.inactive?'Yes, reactivate':'Yes, deactivate';get('accountActionError').textContent='';dialog.showModal();get('cancelAccountAction').focus();});actions.append(button);row.append(actions);body.append(row);
  }
  get('userResults').textContent=visible.length+' of '+users.length+' accounts';get('usersEmpty').hidden=!!visible.length;get('usersEmpty').textContent=users.length?'No accounts match these filters.':'No registered accounts yet.';
 }
 get('cancelAccountAction').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{if(previous?.isConnected)previous.focus();else search.focus();target=null;});
 get('confirmAccountAction').addEventListener('click',()=>{if(!target)return;const b=get('confirmAccountAction');b.disabled=true;try{const next=target.desiredStatus;api.set(target,next);get('accountActionStatus').textContent=next==='inactive'?'Account deactivated. Records were kept.':'Account reactivated. Specialist approval is unchanged.';dialog.close();load();}catch(error){get('accountActionError').textContent=error.message;}finally{b.disabled=false;}});
 search.addEventListener('input',render);get('userRoleFilter').addEventListener('change',render);get('userStatusFilter').addEventListener('change',render);get('refreshUsers').addEventListener('click',load);window.addEventListener('storage',e=>{if(e.key===null||['rafiqUsers','rafiqSpecialists','rafiqAccountRestrictions'].includes(e.key))load();});load();
})();

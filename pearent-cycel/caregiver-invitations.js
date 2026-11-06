/* Browser-local invitation and shared caregiver flow; no email delivery. */
(() => {
'use strict';
const KEY='rafiqCaregiverInvitationsPreview';
function read(){const records=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(records))throw Error('Could not read invitations.');return records;}
function save(records){localStorage.setItem(KEY,JSON.stringify(records));}
function status(record){return record.status==='pending'&&Date.parse(record.expiresAt)<=Date.now()?'expired':record.status;}
function create(data){
 if(window.RafiqFamily){const child=window.RafiqFamily.child(data.childId);if(!child||!window.RafiqFamily.canManage(child)||data.ownerId!==(child.parentId||'legacy-browser'))throw Error('This child is not linked to your account.');}
 const records=read(),email=data.email.trim().toLowerCase();
 if(records.some(r=>r.ownerId===data.ownerId&&r.childId===data.childId&&r.email===email&&['pending','accepted'].includes(status(r))))throw Error('This person already has a pending or accepted invitation.');
 const record={...data,email,permission:'contribute',invitedBy:window.RafiqFamily?.owner()||data.ownerId,id:crypto.randomUUID(),status:'pending',createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+7*86400000).toISOString()};
 save([...records,record]);return record;
}
function currentUser(){const id=sessionStorage.getItem('rafiqParentUserId');if(sessionStorage.getItem('rafiqRole')!=='parent'||!id)return null;const users=JSON.parse(localStorage.getItem('rafiqUsers')||'[]');return users.find(u=>u.id===id&&u.role==='parent')||null;}
function recipient(record){const user=currentUser();return user&&user.id!==record.ownerId&&(record.acceptedUserId?record.acceptedUserId===user.id:user.email?.toLowerCase()===record.email)?user:null;}
function respond(id,next){const record=read().find(r=>r.id===id);if(!record||!recipient(record))throw Error('Sign in with the invited email before responding.');if(!['accepted','declined'].includes(next))throw Error('Invalid invitation status.');const result=update(id,next);if(next==='accepted'){const records=read(),saved=records.find(r=>r.id===id);saved.acceptedUserId=currentUser().id;saved.permission='contribute';save(records);window.RafiqFamily?.select(record.childId);}return result;}
function update(id,next,ownerId){const records=read(),record=records.find(r=>r.id===id);if(!record)throw Error('Invitation not found.');if(ownerId&&(record.ownerId!==ownerId||(window.RafiqFamily&&!window.RafiqFamily.canManage(window.RafiqFamily.child(record.childId)))))throw Error('Invitation not found.');if(status(record)!=='pending'&&!(next==='revoked'&&status(record)==='accepted'))throw Error('This invitation is no longer pending.');if(!['accepted','declined','cancelled','revoked'].includes(next))throw Error('Invalid invitation status.');record.status=next;save(records);if(next==='revoked')window.RafiqFamily?.accessRemoved(record);return record;}
window.RafiqCaregiverPreview={read,status,create,update,currentUser,recipient,respond};
})();

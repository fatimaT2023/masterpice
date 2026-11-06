const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const {webcrypto}=require('node:crypto');
const root=path.resolve(__dirname,'..'),memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
const put=(key,value)=>storage.setItem(key,JSON.stringify(value));
put('rafiqUsers',[{id:'dad',role:'parent',email:'dad@example.com',fullName:'Dad'},{id:'mom',role:'parent',email:'mom@example.com',fullName:'Mom'},{id:'other',role:'parent',email:'other@example.com'}]);
put('rafiqChildren',[{id:'adam',parentId:'dad',name:'Adam',dateOfBirth:'2025-01-01',relationship:'father',setupCompletedAt:'2026-01-01'},{id:'other-child',parentId:'other',name:'Private child',relationship:'mother'}]);
function context(id){const session=new Map([['rafiqRole','parent'],['rafiqParentUserId',id]]);const styles=new Map(),attrs=new Map();const ctx={window:null,localStorage:storage,sessionStorage:{getItem:k=>session.get(k)||null,setItem:(k,v)=>session.set(k,v)},document:{documentElement:{style:{setProperty:(k,v)=>styles.set(k,v),removeProperty:k=>styles.delete(k)},toggleAttribute:(k,v)=>attrs.set(k,v)},addEventListener(){},dispatchEvent(){}},addEventListener(){},setTimeout,clearTimeout,crypto:webcrypto,Date,URLSearchParams,CustomEvent:function(){},location:{pathname:'/pearent-cycel/parent-dashboard.html'}};ctx.window=ctx;vm.createContext(ctx);const load=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});load('shared/family-access.js');load('pearent-cycel/parent-setup-utils.js');load('pearent-cycel/caregiver-invitations.js');return {ctx,load,styles,attrs};}

module.exports=(async()=>{
const dad=context('dad'),mom=context('mom'),other=context('other');
dad.ctx.RafiqFamily.select('adam');const invite=dad.ctx.RafiqCaregiverPreview.create({ownerId:'dad',childId:'adam',childName:'Adam',email:'mom@example.com',relationship:'mother'});mom.ctx.RafiqCaregiverPreview.respond(invite.id,'accepted');
for(const person of [dad,mom,other]){person.load('shared/membership.js');person.ctx.Event=function(){};person.ctx.dispatchEvent=()=>{};person.load('pearent-cycel/notifications.js');}
const paid=dad.ctx.RafiqMembership.activate({id:'sub-one',price:5,currency:'JOD',paymentReference:'paid-once'});
assert.equal(paid.familyId,'family_dad');assert.equal(mom.ctx.RafiqMembership.state().active,true);assert.equal(other.ctx.RafiqMembership.state().active,false);
assert.equal(mom.ctx.RafiqMembership.state().canManage,false);
assert.throws(()=>dad.ctx.RafiqMembership.activate({id:'duplicate'}),/already/);assert.equal(JSON.parse(storage.getItem('rafiqSubscriptions')).length,1);
assert.throws(()=>mom.ctx.RafiqMembership.renewal(true),/billing manager/);
dad.ctx.RafiqMembership.renewal(true);assert.equal(mom.ctx.RafiqMembership.state().active,true);assert.equal(mom.ctx.RafiqMembership.state().record.cancelAtPeriodEnd,true);
assert.equal(mom.ctx.RafiqMembership.state(new Date(Date.now()+400*86400000)).active,false);assert.equal(mom.ctx.RafiqSetup.readChildren().length,1);
assert.equal(dad.ctx.RafiqMembership.remaining(),30);mom.ctx.RafiqMembership.consumeAI();assert.equal(dad.ctx.RafiqMembership.remaining(),29);assert.equal(other.ctx.RafiqMembership.remaining(),3);
const transfer=dad.ctx.RafiqFamily.proposeBilling('mom');assert.throws(()=>other.ctx.RafiqFamily.respondBilling(transfer.id,true),/unavailable/);mom.ctx.RafiqFamily.respondBilling(transfer.id,true);
assert.equal(mom.ctx.RafiqMembership.state().canManage,true);assert.equal(dad.ctx.RafiqMembership.state().canManage,false);mom.ctx.RafiqMembership.renewal(false);assert.equal(dad.ctx.RafiqMembership.state().record.cancelAtPeriodEnd,false);assert.equal(dad.ctx.RafiqMembership.state().record.payerId,'dad');
assert.throws(()=>mom.ctx.RafiqCaregiverPreview.create({ownerId:'dad',childId:'adam',email:'other@example.com'}),/not linked/);
put('rafiqNotifications',[]);const notification=dad.ctx.createRafiqNotification({type:'booking',title:'Child appointment',childId:'adam'});let notices=dad.ctx.getRafiqNotifications();notices.find(n=>n.id===notification.id).read=true;dad.ctx.saveRafiqNotifications(notices);
assert.equal(dad.ctx.getRafiqNotifications()[0].read,true);assert.equal(mom.ctx.getRafiqNotifications()[0].read,false);assert.equal(other.ctx.getRafiqNotifications().length,0);
const momNotices=mom.ctx.getRafiqNotifications();momNotices[0].read=true;mom.ctx.saveRafiqNotifications(momNotices);assert.equal(dad.ctx.getRafiqNotifications()[0].read,true);
dad.ctx.createRafiqNotification({title:'Dad only'});assert.equal(mom.ctx.getRafiqNotifications().length,1);
put('rafiqNotificationPreferences_mom',{appointments:false});assert.equal(mom.ctx.getRafiqNotifications().length,0);assert.equal(dad.ctx.getRafiqNotifications().length,2);
// A child created within a shared family has one canonical profile and correct per-person relationships.
const before=mom.ctx.RafiqSetup.readChildren();mom.ctx.RafiqSetup.writeChildren([...before,{id:'new-child',familyId:'family_dad',name:'New child',relationship:'mother',dateOfBirth:'2025-05-01'}]);
assert.equal(dad.ctx.RafiqSetup.readChildren().find(c=>c.id==='new-child').relationship,'father');assert.equal(mom.ctx.RafiqSetup.readChildren().find(c=>c.id==='new-child').relationship,'mother');
assert.throws(()=>mom.ctx.RafiqFamily.archive('new-child'),/primary caregiver/);dad.ctx.RafiqFamily.archive('new-child');assert.equal(mom.ctx.RafiqSetup.readChildren().some(c=>c.id==='new-child'),false);dad.ctx.RafiqFamily.archive('new-child',true);assert.equal(mom.ctx.RafiqSetup.readChildren().some(c=>c.id==='new-child'),true);
assert.notEqual(dad.ctx.RafiqFamily.privateChatKey('adam'),mom.ctx.RafiqFamily.privateChatKey('adam'));assert.throws(()=>other.ctx.RafiqFamily.privateChatKey('adam'),/not linked/);const beforeSharing=JSON.parse(storage.getItem('rafiqAgeObservations_adam')||'[]').length;const sharedAI=mom.ctx.RafiqFamily.shareAI('adam',{id:'message-one',sender:'ai',text:'Explicitly shared answer'});assert.equal(sharedAI.duplicate,false);assert.equal(mom.ctx.RafiqFamily.shareAI('adam',{id:'message-one',sender:'ai',text:'Explicitly shared answer'}).duplicate,true);assert.equal(JSON.parse(storage.getItem('rafiqAgeObservations_adam')).length,beforeSharing+1);assert.equal(sharedAI.record.createdBy,'mom');
// Support tickets are scoped to stable account identity, not to the browser or family.
for(const person of [dad,mom]){person.ctx.URLSearchParams=URLSearchParams;person.ctx.location.search='';person.load('shared/support-api.js');}
await mom.ctx.RafiqSupport.create({name:'Mom',email:'mom@example.com',subject:'Private support',message:'Private account question',category:'account'});assert.equal((await dad.ctx.RafiqSupport.list()).length,0);assert.equal((await mom.ctx.RafiqSupport.list()).length,1);
const additional=mom.ctx.RafiqCaregiverPreview.read().find(r=>r.childId==='new-child');dad.ctx.RafiqCaregiverPreview.update(invite.id,'revoked','dad');assert.equal(mom.ctx.RafiqMembership.state(new Date(),'family_dad').canManage,true);dad.ctx.RafiqCaregiverPreview.update(additional.id,'revoked','dad');assert.equal(dad.ctx.RafiqMembership.state(new Date(),'family_dad').canManage,true);assert.equal(dad.ctx.RafiqMembership.state(new Date(),'family_dad').record.cancelAtPeriodEnd,true);assert.equal(dad.ctx.RafiqMembership.state(new Date(),'family_dad').active,true);
console.log('PASS: shared family plan/quota, duplicate payment protection, period-end cancellation, expiry retention, consent-based billing transfer, independent notifications, scoped invitations, archive/restore and private support.');
})();

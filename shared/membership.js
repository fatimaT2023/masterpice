/* Browser-local family entitlements. No real charges or automatic renewal. */
(()=>{'use strict';
 const config={price:5,currency:'JOD',freeChildren:1,plusChildren:5,freeAI:3,plusAI:30};
 const read=(key,fallback)=>{const value=JSON.parse(localStorage.getItem(key)||'null');return value??fallback;};
 const owner=()=>sessionStorage.getItem('rafiqParentUserId')||'legacy-browser';
 const familyId=()=>window.RafiqFamily?.currentFamilyId()||'family_'+owner();
 const dateKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
 function state(now=new Date(),id=familyId()){
  const plans=read('rafiqFamilyMemberships',{}),primary=window.RafiqFamily?.family(id).ownerId||owner();
  let record=Object.hasOwn(plans,id)?plans[id]:read('rafiqParentMemberships',{})[primary];
  if(!record&&primary==='legacy-browser'){const legacy=read('rafiqSubscriptionDetails',null);if(legacy?.expiresAt)record=legacy;}
  const active=!!record&&record.plan==='plus'&&record.status==='active'&&Number.isFinite(Date.parse(record.expiresAt))&&new Date(record.expiresAt)>now;
  return {familyId:id,plan:active?'plus':'free',active,record,children:active?config.plusChildren:config.freeChildren,aiLimit:active?config.plusAI:config.freeAI,canManage:window.RafiqFamily?window.RafiqFamily.canBill(id):true};
 }
 function store(record){const plans=read('rafiqFamilyMemberships',{}),subscriptions=read('rafiqSubscriptions',[]);if(!Array.isArray(subscriptions))throw Error('Subscription records could not be read.');const index=subscriptions.findIndex(item=>item.id===record.id);if(index<0)subscriptions.push(record);else subscriptions[index]=record;plans[record.familyId]=record;localStorage.setItem('rafiqSubscriptions',JSON.stringify(subscriptions));localStorage.setItem('rafiqFamilyMemberships',JSON.stringify(plans));document.dispatchEvent(new CustomEvent('rafiq:family-plan'));return record;}
 function activate(details){const id=details.familyId||familyId();if(window.RafiqFamily&&!window.RafiqFamily.canBill(id))throw Error('Only the billing manager can purchase or change the family plan.');if(state(new Date(),id).active)throw Error('Your family already has an active subscription. No second payment is needed.');const from=new Date(),until=new Date(from),day=until.getDate();until.setDate(1);until.setMonth(until.getMonth()+1);until.setDate(Math.min(day,new Date(until.getFullYear(),until.getMonth()+1,0).getDate()));const account=window.RafiqFamily?.user();return store({...details,id:details.id||crypto.randomUUID(),familyId:id,parentId:owner(),payerId:owner(),parentName:account?.fullName||'',parentEmail:account?.email||'',plan:'plus',status:'active',cancelAtPeriodEnd:false,activatedAt:from.toISOString(),expiresAt:until.toISOString()});}
 function renewal(cancel){const current=state();if(!current.canManage)throw Error('Only the billing manager can change renewal.');if(!current.active)throw Error('There is no active family subscription.');return store({...current.record,familyId:current.familyId,cancelAtPeriodEnd:cancel,renewalChangedBy:owner(),renewalChangedAt:new Date().toISOString()});}
 function downgrade(){return renewal(true);}
 function remaining(){const usage=read('rafiqAIUsage',{}),used=Number(usage[familyId()+'|'+dateKey()])||0;return Math.max(0,state().aiLimit-used);}
 function consumeAI(){if(!remaining())return false;const usage=read('rafiqAIUsage',{}),key=familyId()+'|'+dateKey();usage[key]=(Number(usage[key])||0)+1;localStorage.setItem('rafiqAIUsage',JSON.stringify(usage));return true;}
 function canAdd(children,id=familyId()){const count=window.RafiqFamily?window.RafiqFamily.familyChildren(id).length:children.length;return count<state(new Date(),id).children;}
 function prompt(feature){let dialog=document.getElementById('membershipPrompt');if(dialog)dialog.remove();dialog=document.createElement('dialog');dialog.id='membershipPrompt';dialog.className='membership-prompt';const heading=document.createElement('h2'),copy=document.createElement('p'),actions=document.createElement('div'),close=document.createElement('button'),upgrade=document.createElement('a');heading.textContent=state().active?'Your plan limit has been reached':'More room with Rafiq Plus';copy.textContent=feature;close.type='button';close.textContent='Not now';close.onclick=()=>dialog.close();upgrade.href='subscription.html';upgrade.textContent='View plans';actions.append(close,upgrade);dialog.append(heading,copy,actions);document.body.append(dialog);dialog.showModal();}

 window.RafiqMembership={config,owner,familyId,state,activate,downgrade,renewal,remaining,consumeAI,canAdd,prompt};
})();

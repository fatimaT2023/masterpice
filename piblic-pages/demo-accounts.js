/* Explicit local test setup. Does not replace existing users or application records. */
document.addEventListener('DOMContentLoaded',()=>{
 const status=document.getElementById('demoStatus');
 document.getElementById('prepareDemo').addEventListener('click',async()=>{
  const button=document.getElementById('prepareDemo');if(button.disabled)return;button.disabled=true;
  try{
   const read=key=>{const value=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(value))throw Error('Invalid saved data');return value;};
   const now=new Date().toISOString(),users=read('rafiqUsers'),specialists=read('rafiqSpecialists'),children=read('rafiqChildren');
   const accounts=[{id:'rafiq_demo_parent',fullName:'Demo Parent',email:'parent.demo@rafiq.test',role:'parent',createdAt:now},{id:'rafiq_demo_specialist_user',fullName:'Dr. Lina — Demo',email:'specialist.demo@rafiq.test',role:'specialist',createdAt:now}];
   for(const account of accounts){const existing=users.find(u=>u.email===account.email);if(existing&&existing.id!==account.id)throw Error('A different account already uses a demo email. Your data was not changed.');if(!existing)users.push(account);}
   if(!specialists.some(s=>s.id==='rafiq_demo_specialist'))specialists.push({id:'rafiq_demo_specialist',registrationUserId:'rafiq_demo_specialist_user',fullName:'Dr. Lina — Demo',email:'specialist.demo@rafiq.test',notificationEmail:'specialist.demo@rafiq.test',phone:'0790000000',specialtyKey:'development',specialty:'Child Development Specialist',experience:5,qualification:'Demo qualification',licenseNumber:'DEMO-ONLY',bio:'Demo specialist profile for testing messages and bookings. Not a real practitioner.',status:'approved',verificationStatus:'approved',consultationTypes:['online'],languages:['arabic','english'],price:25,currency:'JOD',createdAt:now,approvedAt:now,isDemo:true});
   if(!children.some(c=>c.id==='rafiq_demo_child'))children.push({id:'rafiq_demo_child',name:'Demo Child',dateOfBirth:'2025-10-01',gender:'female',initialGoal:'activities',isDemo:true});
   const demoParent=users.find(u=>u.id==='rafiq_demo_parent');
   if(!demoParent.previewCredential)demoParent.previewCredential=await window.RafiqPreviewCredentials.create('RafiqDemo2026!');
   const demoChild=children.find(c=>c.id==='rafiq_demo_child');
   if(demoChild&&!demoChild.parentId)demoChild.parentId='rafiq_demo_parent';
   localStorage.setItem('rafiqUsers',JSON.stringify(users));localStorage.setItem('rafiqSpecialists',JSON.stringify(specialists));localStorage.setItem('rafiqChildren',JSON.stringify(children));
   status.textContent='Demo accounts are ready. Sign in using the credentials below.';document.getElementById('demoLogins').hidden=false;
  }catch(error){status.textContent='Could not prepare demo accounts: '+error.message;}finally{button.disabled=false;}
 });
 document.getElementById('parentDemoLogin').addEventListener('click',()=>(window.RafiqFamily ? window.RafiqFamily.select('rafiq_demo_child') : localStorage.setItem('rafiqCurrentChildId','rafiq_demo_child')));
});

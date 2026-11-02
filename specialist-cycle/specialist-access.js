/* Preview access routing. Production must enforce approval on the server too. */
(()=>{'use strict';
 const read=(storage,key,fallback)=>{try{return JSON.parse(storage.getItem(key)||'null')??fallback;}catch{return fallback;}};
 const users=read(localStorage,'rafiqUsers',[]),directory=read(localStorage,'rafiqSpecialists',[]);
 const userId=sessionStorage.getItem('rafiqSpecialistRegistrationUserId');
 const user=Array.isArray(users)?users.find(u=>u?.id===userId&&u.role==='specialist'):null;
 const id=sessionStorage.getItem('rafiqSpecialistId')||(!user?localStorage.getItem('rafiqCurrentSpecialistId'):null);
 const saved=read(localStorage,'rafiqSpecialistProfile',null);
 const matches=p=>p&&(user?p.email?.toLowerCase()===user.email?.toLowerCase():id&&p.id===id);
 const profile=(Array.isArray(directory)?directory.find(matches):null)||(matches(saved)?saved:null);
 const approved=profile?.status==='approved'&&profile.verificationStatus!=='rejected';
 window.RafiqSpecialistAccess={user,profile,approved};
 if(profile){localStorage.setItem('rafiqSpecialistProfile',JSON.stringify(profile));localStorage.setItem('rafiqCurrentSpecialistId',profile.id);sessionStorage.setItem('rafiqSpecialistId',profile.id);}
 const onboarding=location.pathname.endsWith('/specialist-onboarding.html');
 if(!onboarding&&!approved){document.documentElement.classList.add('specialist-access-redirect');location.replace('specialist-onboarding.html');}
 if(onboarding&&approved)location.replace('specialist-dashboard.html');
})();

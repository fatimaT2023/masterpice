/* Parent-only entry points. No automatic export of the plan or questions. */
(() => {
 'use strict';
 const M=window.RafiqSupportStart,U=window.RafiqSupportStartUI,C=window.RafiqSupportStartContent;
 const node=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
 function guideLink(child,hash=''){return 'start-guide.html?child='+encodeURIComponent(child.id)+hash;}
 function afterAboutReady(host,child){if(window.RafiqSupportJourneyUI)return;if(!M.enabled(child)||child.supportProfile.situation!=='diagnosed_no_followup'||document.getElementById('afterAboutStart'))return;const a=node('a',U.u('nextAbout',child));a.id='afterAboutStart';a.href=guideLink(child);host.append(a);}
 U.afterAboutReady=afterAboutReady;
 function mount(){
  const page=location.pathname.split('/').pop();
  for(const id of ['startHomeProgress','startWhoLink','startSpecialistQuestions'])document.getElementById(id)?.remove();
  try{const id=new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected(),child=window.RafiqSetup.readChildren().find(c=>c.id===id);if(!M.enabled(child))return;
   if(page==='parent-dashboard.html'&&child.supportProfile.situation==='diagnosed_no_followup'&&!window.RafiqSupportJourney){
    const target=document.getElementById('supportModeCard');if(!target)return;const week=M.build(child).periods[0],progress=node('p',U.u('weekProgress',child,{done:week.done,total:week.total})),service=target.querySelector('[data-support-service="start-guide"]');if(service){progress.id='startHomeProgress';service.after(progress);}else{const box=node('div');box.id='startHomeProgress';box.className='start-inline';const a=node('a',U.u('title',child));a.href=guideLink(child);box.append(a,progress);target.append(box);}
   }
   if(page==='specialists.html'){const host=document.getElementById('supportDirectoryFilter');if(!host)return;const b=node('button',U.u('who'));b.id='startWhoLink';b.className='start-directory-link';b.type='button';b.onclick=()=>U.dialog(child,b);host.append(b);if(child.supportProfile.situation==='diagnosed_no_followup'&&!M.state(child).directoryVisitedAt)M.save(child,{directoryVisitedAt:new Date().toISOString()});}
   if(page==='specialist-profile.html'){const a=node('a',U.u('specialistQuestions'));a.id='startSpecialistQuestions';a.className='start-inline';a.href=guideLink(child,'#questions');document.querySelector('main')?.prepend(a);}
   if(page==='child-profile.html'&&new URLSearchParams(location.search).get('invite')==='1'){document.getElementById('openCaregiversModal')?.click();const form=document.getElementById('caregiverInviteForm');if(form?.hidden)document.getElementById('caregiverInviteToggle')?.click();document.getElementById('caregiverEmail')?.focus();}
   if(page==='about-me.html'&&child.aboutMe?.cursor===9)afterAboutReady(document.getElementById('aboutApp'),child);
  }catch{/* Optional progress never blocks the existing page. */}
 }
 document.addEventListener('DOMContentLoaded',mount);window.addEventListener('rafiq-support-change',mount);window.addEventListener('storage',e=>{if(e.key===null||['rafiqChildren','rafiqBookings','rafiqCaregiverInvitationsPreview','rafiqCareConnections'].includes(e.key)||e.key?.startsWith('rafiqHealthNotes_')||e.key?.startsWith('rafiqAgeObservations_'))mount();});
})();

(() => {
 'use strict';const M=window.RafiqSupportJourney,U=window.RafiqSupportJourneyUI;
 const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 U.afterAboutReady=(host,child)=>{if(!M.active(child)||document.getElementById('journeyEntry'))return;const box=node('section');box.id='journeyEntry';box.className='sj-card';box.append(node('h2',U.t('next')),U.link('journey','support-journey.html',child,true));host.append(box);};
 // Resolve an explicitly opened report link before the existing report controller runs.
 if(location.pathname.endsWith('/specialist-report.html')){try{const p=new URLSearchParams(location.search),child=window.RafiqSetup.readChildren().find(c=>c.id===(p.get('child')||window.RafiqFamily.selected()));if(M.active(child)&&p.get('booking')){const reports=JSON.parse(localStorage.getItem('rafiqSpecialistReports')||'[]');if(reports.some(r=>r.childId===child.id&&r.bookingId===p.get('booking'))){window.RafiqFamily.select(child.id);sessionStorage.setItem('rafiqSelectedReportBooking',p.get('booking'));}}}catch{}}
 function mount(){
  document.getElementById('journeyEntry')?.remove();const page=location.pathname.split('/').pop();
  try{const id=new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected(),child=window.RafiqSetup.readChildren().find(c=>c.id===id);if(!M.active(child))return;const box=node('section');box.id='journeyEntry';box.className='sj-card';
   if(page==='child-profile.html'){box.append(node('h2',U.t('journey')),U.link('journey','support-journey.html',child,true));document.getElementById('profileContent')?.append(box);}
   if(page==='bookings.html'||page==='booking.html'){box.append(node('h2',U.t('visit')),node('p',U.t('visitHelp')),U.link('visit','support-visit.html',child),U.link('journey','support-journey.html',child));document.querySelector('main')?.append(box);}
   if(page==='specialist-report.html'){const report=M.build(child).reports.find(r=>r.bookingId===sessionStorage.getItem('rafiqSelectedReportBooking'));if(report){M.seen(child,report);box.append(node('h2',U.t('stagePractice')),node('p',U.t('practiceHelp')),U.link('practice','support-practice.html',child,true),U.link('journey','support-journey.html',child));document.getElementById('reportView')?.append(box);}}
   if(page==='start-guide.html'){box.append(node('h2',U.t('next')),U.link('find','specialists.html',child,true),U.link('journey','support-journey.html',child));box.querySelector('a').addEventListener('click',()=>{try{const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);M.save(fresh,{planReviewedAt:new Date().toISOString()});}catch{}});document.getElementById('startApp')?.append(box);}
   if(page==='about-me.html'){box.append(node('h2',U.t('next')),U.link('journey','support-journey.html',child,true));document.getElementById('aboutApp')?.append(box);}
  }catch{/* Optional support navigation never blocks an existing service. */}
 }
 document.addEventListener('DOMContentLoaded',mount);window.addEventListener('storage',e=>{if(e.key==='rafiqChildren')mount();});
})();

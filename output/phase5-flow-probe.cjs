const path=require('node:path'),fs=require('node:fs');const {start}=require('./phase4-harness.cjs');
(async()=>{const out=path.join(__dirname,'parent-phase5-qa');const h=await start(out);const shot=async n=>fs.writeFileSync(path.join(out,n),Buffer.from((await h.call('Page.captureScreenshot',{format:'png'})).data,'base64'));try{
 await h.open('case-speech','specialists.html','en',1280,'return !!d.querySelector(".card-book-button")');
 await h.inner(`d.querySelector('.card-book-button[data-id="showcase_speech_specialist"]').click();return 1`);
 await h.waitFor('return w.location.pathname.endsWith("booking.html")&&!!d.querySelector("#consultationOptions button,#consultationOptions input")','booking page');await h.sleep(600);
 console.log(await h.inner(`return {types:[...d.querySelectorAll('#consultationOptions button,#consultationOptions input,#consultationOptions label')].map(e=>e.tagName+':'+(e.value||e.dataset.type||e.textContent.trim()).slice(0,30)),dates:[...d.querySelectorAll('#dateOptions button')].slice(0,3).map(b=>b.dataset.date||b.textContent.trim().slice(0,20)),times:d.querySelectorAll('#timeOptions button').length}`));
 await h.inner(`d.querySelector('#consultationOptions button,#consultationOptions input')?.click();return 1`);await h.sleep(200);
 await h.inner(`d.querySelector('#dateOptions button:not([disabled])')?.click();return 1`);await h.sleep(300);
 console.log('times',await h.inner(`return [...d.querySelectorAll('#timeOptions button')].map(b=>(b.disabled?'x':'')+b.textContent.trim()).slice(0,6)`));
 await h.inner(`d.querySelector('#timeOptions button:not([disabled])')?.click();const r=d.getElementById('bookingReason');r.value='QA request note';r.dispatchEvent(new Event('input'));return 1`);
 await h.inner(`d.getElementById('confirmBookingButton').click();return 1`);await h.sleep(500);await shot('flow-review.png');
 console.log('review',await h.inner(`return {open:!!d.querySelector('dialog[open]'),text:(d.querySelector('dialog[open]')?.innerText||'').slice(0,300),err:d.getElementById('bookingError').textContent}`));
 await h.inner(`d.getElementById('reviewContinue')?.click();return 1`);await h.sleep(800);
 console.log('after',await h.inner(`return {success:!d.getElementById('successView').hidden,err:d.getElementById('bookingError').textContent,msg:d.getElementById('successMessage').textContent,bookings:JSON.parse(w.localStorage.getItem('rafiqBookings')).map(b=>[b.id,b.status,b.date,b.time,b.consultationType,b.sessionPayment?.status])}`));
 await shot('flow-success.png');console.log('errors',h.errors);
}finally{await h.close();}})();

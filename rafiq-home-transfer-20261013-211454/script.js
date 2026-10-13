/* RAFIQ cinematic homepage — vanilla JS, no build step. */
(() => {
'use strict';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (n, lo=0, hi=1) => Math.max(lo, Math.min(hi,n));
const lerp = (a,b,t) => a+(b-a)*t;

// Public component: set data-mode="video" and data-video="assets/child/look.mp4",
// or data-mode="sequence" and data-frames='["path/front.webp", ...]'.
// data-front controls the front-facing position in the sequence/video (0..1).
class BabyInteractive {
 constructor(root) {
  this.root=root; this.body=root.querySelector('.baby-body'); this.head=root.querySelector('.baby-head'); this.eyes=root.querySelector('.eye-motion');
  this.photo=root.querySelector('.baby-photo'); this.video=root.querySelector('video');
  this.hero=document.querySelector('.cinematic-hero'); this.panel=document.querySelector('.hero-content'); this.light=document.querySelector('.studio-light'); this.ring=document.querySelector('.pointer-ring');
  this.targetX=0; this.targetY=0; this.x=0; this.y=0; this.pointerX=0; this.pointerY=0;
  this.targetTime=0; this.isSeeking=false; this.active=true; this.raf=0; this.lastFrame=-1; this.mode='layered'; this.frames=[];
  this.configure();
  this.hero.addEventListener('pointermove',e=>{if(!this.canTrack())return;const r=this.hero.getBoundingClientRect();this.targetX=clamp((e.clientX-r.left)/r.width*2-1,-1,1);this.targetY=clamp((e.clientY-r.top)/r.height*2-1,-1,1);this.pointerX=e.clientX;this.pointerY=e.clientY;this.updateTargetTime();this.resume();},{passive:true});
  this.hero.addEventListener('pointerleave',()=>{this.targetX=0;this.targetY=0;this.ring.classList.remove('visible');this.updateTargetTime();this.resume();});
  root.querySelector('.baby-hit-area').addEventListener('pointerenter',()=>{if(this.canTrack())this.ring.classList.add('visible');});
  root.querySelector('.baby-hit-area').addEventListener('pointerleave',()=>this.ring.classList.remove('visible'));
  this.hero.addEventListener('pointerdown',()=>this.ring.classList.add('pressed'));
  window.addEventListener('pointerup',()=>this.ring.classList.remove('pressed'));
  this.observer=new IntersectionObserver(entries=>{this.active=entries[0].isIntersecting;this.resume();},{threshold:0});this.observer.observe(this.hero);
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('tab-hidden',document.hidden);if(document.hidden){cancelAnimationFrame(this.raf);this.raf=0;clearTimeout(this.blinkTimer);}else{this.scheduleBlink();this.resume();}});
  reduced.addEventListener('change',()=>{this.reset();this.scheduleBlink();this.resume();});finePointer.addEventListener('change',()=>{this.reset();this.resume();});
  this.scheduleBlink();this.resume();
 }
 canTrack(){return finePointer.matches&&!reduced.matches&&innerWidth>600;}
 configure(){
  const requested=this.root.dataset.mode;
  if(requested==='video'&&this.root.dataset.video){
   this.video.src=this.root.dataset.video;this.video.preload='metadata';
   this.video.addEventListener('loadedmetadata',()=>{if(!Number.isFinite(this.video.duration))return;this.mode='video';this.video.hidden=false;this.photo.hidden=true;this.head.hidden=true;this.updateTargetTime();this.seekLatest();});
   this.video.addEventListener('seeked',()=>{this.isSeeking=false;this.seekLatest();});
   this.video.addEventListener('error',()=>{this.mode='layered';this.video.hidden=true;this.photo.hidden=false;this.head.hidden=false;this.isSeeking=false;});
  }else if(requested==='sequence'&&this.root.dataset.frames){
   try{const paths=JSON.parse(this.root.dataset.frames);if(!Array.isArray(paths)||!paths.length)return;this.frames=paths.map(src=>{const img=new Image();img.src=src;return img;});this.mode='sequence';}catch{this.mode='layered';}
  }
 }
 progress(){const front=clamp(Number(this.root.dataset.front??.5));return this.x<0?front*(this.x+1):front+(1-front)*this.x;}
 updateTargetTime(){if(this.mode==='video'){const front=clamp(Number(this.root.dataset.front??.5));const p=this.targetX<0?front*(this.targetX+1):front+(1-front)*this.targetX;this.targetTime=clamp(p)*Math.max(0,this.video.duration-.04);}}
 seekLatest(){if(this.mode!=='video'||this.isSeeking||document.hidden||!this.active)return;if(Math.abs(this.video.currentTime-this.targetTime)<.035)return;this.isSeeking=true;try{this.video.currentTime=this.targetTime;}catch{this.isSeeking=false;}}
 scheduleBlink(){clearTimeout(this.blinkTimer);if(reduced.matches||document.hidden)return;this.blinkTimer=setTimeout(()=>{if(this.active&&this.mode==='layered'){this.head.classList.remove('blinking');void this.head.offsetWidth;this.head.classList.add('blinking');}this.scheduleBlink();},3000+Math.random()*3000);}
 reset(){this.x=this.y=this.targetX=this.targetY=0;this.body.style.transform='';this.head.style.transform='';this.eyes.style.transform='';this.panel.style.transform='';this.light.style.transform='';this.ring.classList.remove('visible');}
 resume(){if(this.raf||document.hidden||!this.active)return;if(!this.canTrack()){this.reset();return;}this.raf=requestAnimationFrame(()=>this.tick());}
 tick(){this.raf=0;if(document.hidden||!this.active||!this.canTrack())return;this.x+=(this.targetX-this.x)*.07;this.y+=(this.targetY-this.y)*.07;
  this.body.style.transform='translate3d('+this.x*3+'px,'+this.y*2+'px,0)';
  if(this.mode==='layered'){this.head.style.transform='rotateY('+this.x*4+'deg) rotateX('+(-this.y*2)+'deg)';this.eyes.style.transform='translate('+this.x*7+'px,'+this.y*4+'px)';}
  else if(this.mode==='video'){this.seekLatest();}
  else if(this.mode==='sequence'){const i=Math.round(this.progress()*(this.frames.length-1));const frame=this.frames[i];if(i!==this.lastFrame&&frame.complete&&frame.naturalWidth){this.photo.src=frame.src;this.head.hidden=true;this.lastFrame=i;}}
  this.panel.style.transform='translate3d('+this.x*3+'px,'+this.y*3+'px,0)';this.light.style.transform='translate3d('+this.x*8+'px,'+this.y*8+'px,0)';
  if(this.ring.classList.contains('visible'))this.ring.style.transform='translate('+(this.pointerX-16)+'px,'+(this.pointerY-16)+'px) scale('+(this.ring.classList.contains('pressed')?.88:1)+')';
  if(Math.abs(this.targetX-this.x)+Math.abs(this.targetY-this.y)>.0001)this.raf=requestAnimationFrame(()=>this.tick());
 }
}
window.BabyInteractive=BabyInteractive;
if (document.getElementById('babyInteractive').dataset.mode !== 'poses') {
  new BabyInteractive(document.getElementById('babyInteractive'));
}

class LifeJourney {
 constructor(section){
  this.section=section;this.stage=section.querySelector('.story-stage');this.copies=[...section.querySelectorAll('.story-copy')];this.images=[...section.querySelectorAll('.story-child')];this.buttons=[...section.querySelectorAll('[data-age]')];this.track=section.querySelector('.timeline-track>span');this.note=section.querySelector('.asset-preview-note');this.count=document.getElementById('storyCount');this.current=-1;this.raf=0;this.top=0;this.distance=1;this.lastProgress=-1;
  this.colors=[[223,243,255],[230,243,249],[224,244,243],[230,239,252],[227,237,251],[239,245,244]];
  this.images.forEach((img,i)=>{img.addEventListener('error',()=>{if(img.dataset.failed)return;img.dataset.failed='true';img.src=img.dataset.fallback;img.alt='Baby portrait placeholder — age '+this.buttons[i].textContent.trim()+' imagery pending';if(i===this.current)this.note.hidden=false;});});
  this.buttons.forEach((b,i)=>b.addEventListener('click',()=>{window.scrollTo({top:this.top+this.distance*i/5,behavior:reduced.matches?'instant':'smooth'});}));
  this.measure();window.addEventListener('resize',()=>{this.measure();this.lastProgress=-1;this.schedule();},{passive:true});window.addEventListener('scroll',()=>this.schedule(),{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(this.raf);this.raf=0;}else this.schedule();});reduced.addEventListener('change',()=>{this.lastProgress=-1;this.schedule();});
  new IntersectionObserver(entries=>{if(entries[0].isIntersecting){this.load(0);this.load(1);this.schedule();}},{rootMargin:'100% 0px'}).observe(section);this.schedule();
 }
 measure(){this.top=this.section.getBoundingClientRect().top+scrollY;this.distance=Math.max(1,this.section.offsetHeight-this.stage.offsetHeight);}
 load(i){const img=this.images[i];if(img?.dataset.src&&!img.getAttribute('src')){img.src=img.dataset.src;}}
 schedule(){if(!this.raf&&!document.hidden)this.raf=requestAnimationFrame(()=>{this.raf=0;this.render();});}
 render(){const p=clamp((scrollY-this.top)/this.distance);if(Math.abs(p-this.lastProgress)<.00005)return;this.lastProgress=p;
  // Each scene holds for 62% of its interval. Morph over the remaining 38%.
  const position=p*5;const a=Math.min(5,Math.floor(position));const b=Math.min(5,a+1);const local=position-a;const mix=clamp((local-.62)/.38);const t=mix*mix*(3-2*mix);const active=t>.5?b:a;
  this.load(a);this.load(b);this.load(b+1);
  if(active!==this.current){this.current=active;this.buttons.forEach((button,i)=>{if(i===active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});this.count.textContent=String(active+1).padStart(2,'0')+' / 06';this.note.hidden=!this.images[active].dataset.failed;}
  this.images.forEach((img,i)=>{const opacity=i===a?1-t:i===b?t:0;img.style.opacity=String(opacity);if(opacity>0&&!reduced.matches){img.style.transform='scale('+(i===a?1+t*.035:.97+t*.03)+')';img.style.filter='blur('+(i===a?t*8:(1-t)*8)+'px)';}else{img.style.transform='none';img.style.filter='none';}img.classList.toggle('is-current',i===active);img.setAttribute('aria-hidden',String(i!==active));});
  this.copies.forEach((copy,i)=>{const opacity=i===a?1-t:i===b?t:0;copy.style.opacity=String(opacity);copy.style.transform=reduced.matches?'none':'translateY('+(i===a?-12*t:14*(1-t))+'px)';copy.style.filter=reduced.matches?'none':'blur('+(i===a?5*t:5*(1-t))+'px)';copy.inert=i!==active;copy.setAttribute('aria-hidden',String(i!==active));copy.classList.toggle('is-current',i===active);});
  const color=this.colors[a].map((v,i)=>Math.round(lerp(v,this.colors[b][i],local)));this.stage.style.backgroundColor='rgb('+color.join(',')+')';this.track.style.transform='scaleY('+p+')';
 }
}
if (!document.getElementById('journey').classList.contains('growth-story')) {
  new LifeJourney(document.getElementById('journey'));
}

const navbar=document.querySelector('.navbar');const menu=document.getElementById('mobileMenu');const menuButton=document.getElementById('menuButton');
function setMenu(open){menu.classList.toggle('open',open);menuButton.classList.toggle('open',open);navbar.classList.toggle('menu-active',open);menu.inert=!open;menu.setAttribute('aria-hidden',String(!open));menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.style.overflow=open?'hidden':'';if(open)menu.querySelector('a').focus();}
menuButton.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
window.addEventListener('resize',()=>{if(innerWidth>1050)setMenu(false);},{passive:true});
document.addEventListener('keydown',e=>{if(!menu.classList.contains('open'))return;if(e.key==='Escape'){setMenu(false);menuButton.focus();}if(e.key==='Tab'){const controls=[menuButton,...menu.querySelectorAll('a,button')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
function syncNavbar(){navbar.classList.toggle('scrolled',scrollY>40);}window.addEventListener('scroll',syncNavbar,{passive:true});syncNavbar();
const login=document.getElementById('loginDialog');document.querySelectorAll('[data-login]').forEach(b=>b.addEventListener('click',()=>{setMenu(false);login.showModal();}));login.querySelector('.dialog-close').addEventListener('click',()=>login.close());login.querySelector('a').addEventListener('click',()=>login.close());login.addEventListener('click',e=>{if(e.target===login){const r=login.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)login.close();}});
document.getElementById('footerYear').textContent=new Date().getFullYear();
// Existing copy-email behavior remains available wherever a copy button exists.
const copy=document.getElementById('copyEmail');if(copy)copy.addEventListener('click',async()=>{const email=copy.dataset.email||'hello@mainframe.co';try{await navigator.clipboard.writeText(email);document.getElementById('copyToast').textContent='Email copied';document.getElementById('copyToast').classList.add('show');setTimeout(()=>document.getElementById('copyToast').classList.remove('show'),1600);}catch{location.href='mailto:'+email;}});
if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.home-section .section-title,.home-section .section-label,.home-section p,.lab-card,.process-step,.home-section details').forEach((el,i)=>{if(el.closest('#studio'))return;if(el.closest('.lab-card,.process-step')!==el&&el.closest('.lab-card,.process-step'))return;el.classList.add('reveal-ready');el.style.setProperty('--reveal-delay',(el.matches('.lab-card,.process-step')?i%3*70:0)+'ms');observer.observe(el);});}
})();

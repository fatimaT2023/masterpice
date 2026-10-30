/* Shared homepage navigation, without initializing homepage-only scenes. */
(() => {
  'use strict';
  const navbar=document.querySelector('.navbar');
  const menu=document.getElementById('mobileMenu');
  const button=document.getElementById('menuButton');
  function setMenu(open){
    menu.classList.toggle('open',open);button.classList.toggle('open',open);navbar.classList.toggle('menu-active',open);
    menu.inert=!open;menu.setAttribute('aria-hidden',String(!open));button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.style.overflow=open?'hidden':'';
    if(open)menu.querySelector('a')?.focus();
  }
  button.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
  window.addEventListener('resize',()=>{if(innerWidth>1050)setMenu(false);},{passive:true});
  document.addEventListener('keydown',event=>{
    if(!menu.classList.contains('open'))return;
    if(event.key==='Escape'){setMenu(false);button.focus();}
    if(event.key==='Tab'){
      const controls=[...document.querySelectorAll('.navbar a,.navbar button'),...menu.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);
      const first=controls[0],last=controls.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  const sync=()=>navbar.classList.toggle('scrolled',scrollY>40);
  window.addEventListener('scroll',sync,{passive:true});sync();
  document.getElementById('footerYear').textContent=new Date().getFullYear();
  document.querySelectorAll('.info-inline-video').forEach(video=>{
    new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();}).observe(video);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  });
})();

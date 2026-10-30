/* Muted, local stock footage. Static first on mobile, reduced motion and save-data. */
(() => {
  'use strict';
  const section=document.getElementById('family-moments');
  if(!section)return;
  const video=section.querySelector('video');
  const button=section.querySelector('button');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width: 600px)');
  let visible=false,choice=null,failed=false,version=0;
  const text=()=>{
    const ar=document.documentElement.lang==='ar';
    const playing=!video.paused&&!video.ended;
    button.textContent=playing?(ar?'Ⅱ إيقاف الفيديو':'Ⅱ Pause video'):(ar?'▶ تشغيل الفيديو':'▶ Play video');
    button.setAttribute('aria-label',playing?(ar?'إيقاف فيديو اللحظات العائلية':'Pause family moments video'):(ar?'تشغيل فيديو اللحظات العائلية':'Play family moments video'));
  };
  function sync(){
    const ticket=++version;
    const automatic=!reduced.matches&&!mobile.matches&&!navigator.connection?.saveData&&!document.documentElement.hasAttribute('data-theme-no-video');
    const shouldPlay=!failed&&visible&&!document.hidden&&(choice===true||(choice===null&&automatic));
    if(!shouldPlay){video.pause();if((reduced.matches||mobile.matches)&&choice!==true)section.classList.remove('is-playing');text();return;}
    if(!video.getAttribute('src')){video.src=video.dataset.src;video.load();}
    video.play().then(()=>{if(ticket!==version&&!visible)video.pause();text();},()=>{text();});
  }
  button.addEventListener('click',()=>{choice=video.paused;sync();});
  video.addEventListener('playing',()=>{section.classList.add('is-playing');text();});
  video.addEventListener('pause',text);
  video.addEventListener('error',()=>{failed=true;section.classList.remove('is-playing');button.hidden=true;video.pause();});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(section);
  else {visible=true;choice=false;}
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('rafiq-theme-change',sync);
  reduced.addEventListener('change',()=>{choice=null;section.classList.remove('is-playing');sync();});
  mobile.addEventListener('change',sync);
  new MutationObserver(text).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  button.hidden=false;
  text();
})();

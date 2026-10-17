(() => {
 'use strict';
 const section = document.getElementById('process');
 if (!section) return;
 const steps = [...section.querySelectorAll('.rj-step')];
 const panels = [...section.querySelectorAll('.rj-preview')];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const mobile = matchMedia('(max-width: 800px)');
 let current = -1, frame = 0;
 function activate(index) {
  if (index === current || !panels[index]) return;
  current = index;
  steps.forEach((step,i) => {
   step.classList.toggle('is-active', i === index);
   const button = step.querySelector('button');
   if (i === index) button.setAttribute('aria-current','step');
   else button.removeAttribute('aria-current');
  });
  panels.forEach((panel,i) => { panel.hidden = i !== index; panel.classList.toggle('is-active',i === index); });
  section.style.setProperty('--rj-index',index);
  section.style.setProperty('--rj-progress',(index+1)/steps.length);
  section.querySelector('#rj-step-count').textContent = `${String(index+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`;
  if (!reduced.matches && panels[index].animate) panels[index].animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.2,.7,.2,1)'});
 }
 function update() {
  frame=0;
  if (mobile.matches) return;
  const centre=innerHeight*.5;
  let best=0, distance=Infinity;
  steps.forEach((step,i) => { const box=step.getBoundingClientRect(); const d=Math.abs(box.top+box.height/2-centre); if(d<distance){distance=d;best=i;} });
  activate(best);
 }
 steps.forEach((step,i) => step.querySelector('button').addEventListener('click',() => {
  activate(i);
  (mobile.matches ? section.querySelector('.rj-preview-wrap') : step).scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});
 }));
 addEventListener('scroll',() => {if(!frame)frame=requestAnimationFrame(update);},{passive:true});
 addEventListener('resize',() => {if(!frame)frame=requestAnimationFrame(update);});
 activate(0);
})();
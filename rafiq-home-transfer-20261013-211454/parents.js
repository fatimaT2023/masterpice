(() => {
 'use strict';
 const section=document.getElementById('parents');if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const tabs=[...section.querySelectorAll('[role=tab]')];
 const panels=[...section.querySelectorAll('.pd-panel')];
 const children=[...section.querySelectorAll('[data-child]')];
 function reveal(node){if(!reduced.matches&&node.animate)node.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'ease-out'});}
 function select(index,focus=false){
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(index===i));tab.tabIndex=index===i?0:-1;panels[i].hidden=index!==i;});
  reveal(panels[index]);if(focus)tabs[index].focus();
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>select(i));
  tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();select(next,true);});
 });
 children.forEach(button=>button.addEventListener('click',()=>{
  const omar=button.dataset.child==='omar',name=omar?'Omar':'Layan';
  children.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  section.querySelector('#pd-child-title').textContent=`${name}'s little world.`;
  section.querySelector('#pd-album-name').textContent=`${name}'s Album`;
  section.querySelector('#pd-age-label').textContent=`${name.toUpperCase()} / ${omar?'8':'2'} YEARS`;
  section.querySelector('#pd-growth-copy').textContent=omar?'Explore development through the school years and record each new achievement.':'Explore milestones for the toddler years and record each little achievement.';
  reveal(panels.find(panel=>!panel.hidden));
 }));
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){reveal(entry.target);observer.unobserve(entry.target);}});},{threshold:.15});observer.observe(section.querySelector('.pd-dashboard'));}
})();
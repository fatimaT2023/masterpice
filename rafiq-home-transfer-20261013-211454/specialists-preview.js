(() => {
 'use strict';
 const section=document.getElementById('openings');if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const tabs=[...section.querySelectorAll('[role=tab]')],panels=[...section.querySelectorAll('.sw-panel')];
 function animate(node){if(!reduced.matches&&node.animate)node.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'ease-out'});}
 function select(index,focus=false){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});animate(panels[index]);if(focus)tabs[index].focus();}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();select(n,true);});});
 const days=[...section.querySelectorAll('[data-day]')];
 days.forEach(button=>button.addEventListener('click',()=>{days.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));section.querySelector('#sw-day-label').textContent=`${button.dataset.day.toUpperCase()} / EXAMPLE SESSION`;animate(section.querySelector('.sw-appointment'));}));
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animate(entry.target);observer.unobserve(entry.target);}}),{threshold:.15});observer.observe(section.querySelector('.sw-workspace'));}
})();
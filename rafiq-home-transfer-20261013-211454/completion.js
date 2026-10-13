(() => {
  const sections = [...document.querySelectorAll('.completion')];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let observer;
  const counted = new WeakSet();
  const frames = new Map();
  const revealed = new WeakSet();
  function count(node) {
    if (counted.has(node) || reduced.matches) return;
    counted.add(node);
    const target = Number(node.dataset.count), start = performance.now();
    const render = now => {
      const p = Math.min(1,(now-start)/850);
      node.textContent = String(Math.round(target*(1-Math.pow(1-p,3))));
      if(p<1) frames.set(node,requestAnimationFrame(render));
      else frames.delete(node);
    };
    frames.set(node,requestAnimationFrame(render));
  }
  sections.forEach(section => {
    const sequence = section.querySelectorAll('.rc-work-profile,.rc-workspace>.rc-verified,.rc-work-grid>.rc-reveal');
    sequence.forEach((node,i) => node.style.setProperty('--rc-delay',`${i*125}ms`));
    section.querySelectorAll('.rc-booking-track>li,.rc-plan-stack>article,.rc-trust li').forEach((node,i) => node.style.setProperty('--rc-delay',`${i*140}ms`));
    section.querySelectorAll('.rc-paths .rc-cta').forEach(node => node.style.setProperty('--rc-delay','450ms'));
  });
  function show(node) {
    node.classList.add('rc-visible'); node.inert=false;
    if(!revealed.has(node)) {
      revealed.add(node);
      node.querySelectorAll('[data-count]').forEach(count);
      if(node.matches('[data-count]'))count(node);
    }
    if(node.matches('.rc-booking-track li'))node.closest('.rc-booking-track').classList.add('rc-drawn');
    if(node.matches('.rc-trust li')) {
      const shield=node.closest('.rc-trust').querySelector('.rc-shield');
      const index=[...node.parentElement.children].indexOf(node);
      shield.style.filter=`drop-shadow(0 18px 40px rgba(15,47,46,.08)) brightness(${1+index*.025})`;
    }
  }
  function configure() {
    observer?.disconnect();
    if(reduced.matches) {
      frames.forEach(frame=>cancelAnimationFrame(frame)); frames.clear();
      document.querySelectorAll('.completion [data-count]').forEach(node=>node.textContent=node.dataset.count);
    }
    sections.forEach(section=>section.classList.toggle('rc-motion',!reduced.matches && 'IntersectionObserver' in window));
    const nodes=sections.flatMap(section=>[...section.querySelectorAll('.rc-reveal')]);
    if(reduced.matches || !('IntersectionObserver' in window)) { nodes.forEach(show); return; }
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){show(entry.target);observer.unobserve(entry.target);}
    }),{threshold:.12,rootMargin:'0px 0px -4% 0px'});
    nodes.forEach(node=>{if(!node.classList.contains('rc-visible'))node.inert=true;observer.observe(node);});
  }
  document.querySelector('.rc-toggle')?.addEventListener('click',event=>{
    const button=event.currentTarget, enabled=button.getAttribute('aria-pressed')!=='true';
    button.setAttribute('aria-pressed',String(enabled));button.querySelector('span').textContent=enabled?'On':'Off';
  });
  ['.rc-times','.rc-book-visual'].forEach(selector=>document.querySelectorAll(selector).forEach(group=>{
    const buttons=[...group.querySelectorAll('button[aria-pressed]')];
    buttons.forEach(button=>button.addEventListener('click',()=>buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)))));
  }));
  // Native details semantics with a measured, reversible height transition.
  document.querySelectorAll('.rc-accordion details').forEach(details=>{
    const summary=details.querySelector('summary');let animation;
    summary.addEventListener('click',event=>{
      if(reduced.matches || !details.animate)return;
      event.preventDefault();
      const start=details.getBoundingClientRect().height;
      const closing=details.dataset.target ? details.dataset.target==='open' : details.open;
      animation?.cancel();
      details.dataset.target=closing?'closed':'open';
      if(!details.open)details.open=true;
      const end=closing?summary.getBoundingClientRect().height+2:details.scrollHeight+2;
      details.style.overflow='hidden';
      animation=details.animate([{height:`${start}px`},{height:`${end}px`}],{duration:350,easing:'cubic-bezier(.2,.7,.2,1)'});
      if(!closing)details.querySelector('div').animate([{opacity:0},{opacity:1}],{duration:450});
      animation.onfinish=()=>{details.open=!closing;details.style.overflow='';delete details.dataset.target;animation=null;};
    });
  });
  reduced.addEventListener('change',configure);configure();
})();

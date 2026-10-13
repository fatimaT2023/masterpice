(() => {
  const section = document.getElementById('parents');
  if (!section) return;
  const dashboard = section.querySelector('.pd-dashboard');
  const modules = [...section.querySelectorAll('.pd-module')];
  const profiles = [...section.querySelectorAll('[data-child]')];
  const moods = [...section.querySelectorAll('.pd-moods button')];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let observer, frame = 0, near = true, profileSwitched = false, profileChosen = false, typed = false, typingTimer;
  const clamp = n => Math.max(0, Math.min(1,n));
  function profile(index) { profiles.forEach((button,i) => button.setAttribute('aria-pressed',String(i===index))); }
  profiles.forEach((button,i) => button.addEventListener('click',() => { profileChosen = true; profile(i); }));
  moods.forEach((button,i) => {
    button.style.setProperty('--mood-delay',`${350+i*130}ms`);
    button.addEventListener('click',() => {
      moods.forEach((mood,j) => mood.setAttribute('aria-pressed',String(j===i)));
      section.querySelector('.pd-mood-status').textContent = `Today's example check-in: ${button.querySelector('span').textContent}.`;
    });
  });
  const challenge = section.querySelector('.pd-challenge-button');
  challenge.addEventListener('click',() => {
    const selected = challenge.getAttribute('aria-pressed') !== 'true';
    challenge.setAttribute('aria-pressed',String(selected));
    challenge.textContent = selected ? 'Added to your example day ✓' : "Try today's challenge →";
  });
  modules.forEach((module,i) => module.style.setProperty('--pd-delay',`${i%2*125}ms`));
  function show(node) {
    node.classList.add('pd-visible');
    node.inert = false;
    if (node.classList.contains('pd-ai') && !typed && !reduced.matches) {
      typed = true;
      node.classList.add('pd-is-typing');
      typingTimer = setTimeout(() => node.classList.remove('pd-is-typing'),1900);
    }
  }
  function render() {
    frame = 0;
    if (!near || reduced.matches || document.hidden) return;
    const progress = clamp((innerHeight*.9-dashboard.getBoundingClientRect().top)/(innerHeight*.65));
    const eased = progress*progress*(3-2*progress);
    dashboard.style.setProperty('--pd-opacity',.4+eased*.6);
    dashboard.style.setProperty('--pd-y',`${50*(1-eased)}px`);
    dashboard.style.setProperty('--pd-scale',.92+eased*.08);
    dashboard.style.setProperty('--pd-blur',`${6*(1-eased)}px`);
    if (progress>.7 && !profileSwitched) { profileSwitched = true; if(!profileChosen) profile(1); }
  }
  function schedule() { if (!frame && near && !reduced.matches) frame=requestAnimationFrame(render); }
  let visibility;
  function configure() {
    observer?.disconnect(); visibility?.disconnect(); cancelAnimationFrame(frame); frame=0;
    clearTimeout(typingTimer); section.querySelector('.pd-ai').classList.remove('pd-is-typing');
    section.classList.toggle('pd-motion',!reduced.matches && 'IntersectionObserver' in window);
    const nodes=[section.querySelector('.pd-header'),...modules,section.querySelector('.pd-final')];
    if (reduced.matches || !('IntersectionObserver' in window)) { nodes.forEach(show); return; }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) { show(entry.target); observer.unobserve(entry.target); }
      });
    },{threshold:.1,rootMargin:'0px 0px -5% 0px'});
    nodes.forEach(node => { if(!node.classList.contains('pd-visible')) node.inert=true; observer.observe(node); });
    visibility = new IntersectionObserver(entries => {near=entries[0].isIntersecting;if(near)schedule();},{rootMargin:'100px'});
    visibility.observe(section); near=true; schedule();
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',configure);
  configure();
})();

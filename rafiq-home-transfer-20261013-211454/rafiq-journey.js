(() => {
  const section = document.getElementById('process');
  if (!section) return;
  const scenes = [...section.querySelectorAll('.rj-scene')];
  const indicators = [...section.querySelectorAll('.rj-indicator button')];
  const slots = [...section.querySelectorAll('.rj-times button')];
  const badge = section.querySelector('.rj-verified');
  const desktop = matchMedia('(min-width:901px) and (min-height:650px) and (prefers-reduced-motion:no-preference)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => { n = clamp(n); return n * n * (3 - 2 * n); };
  let frame = 0, near = true, observer, visibilityObserver, pulsed = false, selectedByUser = false;
  const set = (node, name, value) => node.style.setProperty(name, value);
  function selectSlot(index) {
    slots.forEach((slot, i) => slot.setAttribute('aria-pressed', String(i === index)));
  }
  slots.forEach((slot, i) => slot.addEventListener('click', () => {
    selectedByUser = true;
    selectSlot(i);
    set(section, '--booking-progress', 1);
  }));
  indicators.forEach((button, i) => button.addEventListener('click', () => {
    const range = section.offsetHeight - innerHeight;
    scrollTo({top: section.getBoundingClientRect().top + scrollY + range * ((i + .7) / 8), behavior: reduced.matches ? 'instant' : 'smooth'});
  }));
  function render() {
    frame = 0;
    if (!desktop.matches || !near || document.hidden) return;
    const top = section.getBoundingClientRect().top;
    const progress = clamp(-top / (section.offsetHeight - innerHeight));
    const position = progress * 8 - .45;
    const final = smooth((position - 6.45) / .8);
    const entry = smooth((innerHeight * .8 - top) / (innerHeight * .6));
    const introFade = smooth(progress / .17);
    set(section, '--intro-opacity', entry * (1 - introFade * .78));
    set(section, '--intro-y', `${(1 - entry) * 28 - introFade * 22}px`);
    set(section, '--intro-blur', `${(1 - entry) * 7}px`);
    set(section, '--path-progress', clamp(position / 6));
    set(section, '--path-opacity', 1 - final * .85);
    set(section, '--final-opacity', final);
    set(section, '--final-y', `${(1 - final) * 28}px`);
    set(section, '--final-blur', `${(1 - final) * 7}px`);
    section.classList.toggle('rj-finished', final > .65);
    const active = Math.max(0, Math.min(6, Math.floor(position + .35)));
    scenes.forEach((scene, i) => {
      const local = position - i;
      const incoming = smooth((local + .65) / .65);
      const outgoing = smooth(local / .65);
      const gone = smooth((local - .65) / .35);
      const opacity = incoming * (1 - outgoing * .85) * (1 - gone) * (1 - final * .9);
      set(scene, '--scene-opacity', opacity);
      set(scene, '--scene-y', `${(1 - incoming) * 30 - outgoing * 24}px`);
      set(scene, '--scene-scale', 1 - (1 - incoming + outgoing) * .03);
      set(scene, '--scene-blur', `${(1 - incoming) * 7 + outgoing * 6}px`);
      const current = i === active && final < .65 && opacity > .2;
      scene.classList.toggle('rj-active', current);
      scene.inert = !current;
      scene.setAttribute('aria-hidden', String(!current));
    });
    indicators.forEach((button, i) => {
      if (i === active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    section.querySelector('.rj-finale').inert = final < .65;
    set(section, '--metric-progress', smooth((position - 1.5) / .7));
    const booking = smooth((position - 4.8) / .65);
    set(section, '--booking-progress', selectedByUser ? 1 : booking);
    if (!selectedByUser) selectSlot(booking > .35 ? 1 : -1);
    if (!pulsed && active === 4) { badge.classList.add('rj-pulse'); pulsed = true; }
    const hue = progress * 95;
    section.querySelector('.rj-atmosphere').style.background = `radial-gradient(ellipse at ${20 + progress * 30}% 30%,hsla(${195 - hue},65%,94%,.55),transparent 60%),radial-gradient(ellipse at 80% ${65 - progress * 20}%,hsla(${265 - hue},70%,95%,.5),transparent 60%)`;
  }
  function schedule() { if (!frame && desktop.matches && near) frame = requestAnimationFrame(render); }
  function configure() {
    observer?.disconnect(); visibilityObserver?.disconnect(); cancelAnimationFrame(frame); frame = 0;
    section.classList.toggle('rj-pinned', desktop.matches);
    section.classList.remove('rj-mobile-motion');
    scenes.forEach(scene => { scene.inert = false; scene.removeAttribute('aria-hidden'); });
    section.querySelector('.rj-finale').inert = false;
    if (desktop.matches) {
      visibilityObserver = new IntersectionObserver(entries => { near = entries[0].isIntersecting; if (near) schedule(); }, {rootMargin:'200px'});
      visibilityObserver.observe(section);
      near = true; schedule();
    } else {
      selectSlot(1);
      if (!reduced.matches && 'IntersectionObserver' in window) {
        section.classList.add('rj-mobile-motion');
        observer = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('rj-visible'); observer.unobserve(entry.target); }
        }), {threshold:.12});
        scenes.forEach(scene => observer.observe(scene));
      }
    }
  }
  if (!('IntersectionObserver' in window)) { selectSlot(1); return; }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  document.addEventListener('visibilitychange', schedule);
  desktop.addEventListener('change', configure);
  reduced.addEventListener('change', configure);
  configure();
})();

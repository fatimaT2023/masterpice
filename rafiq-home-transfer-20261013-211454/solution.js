/* A single, once-only entrance sequence; content stays visible without JS. */
(() => {
  const section = document.getElementById('studio');
  if (!section) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const copy = [...section.querySelectorAll('.solution-copy .solution-reveal')];
  const bubbles = [...section.querySelectorAll('.solution-bubble')];
  copy.forEach((item, i) => item.style.setProperty('--solution-delay', `${i * 180}ms`));
  bubbles.forEach((item, i) => item.style.setProperty('--solution-delay', `${1400 + i * 150}ms`));
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      section.classList.add('solution-resolved');
      observer.disconnect();
    }
  }, {threshold: 0, rootMargin: '0px 0px -12% 0px'});
  section.classList.add('solution-animated');
  observer.observe(section);
  reduced.addEventListener('change', event => {
    if (event.matches) {
      section.classList.add('solution-resolved');
      observer.disconnect();
    }
  });
})();

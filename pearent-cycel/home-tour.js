/* First visit to Home: a 3-point tour (your journey -> your next step -> help is here).
   Shown once per parent account; "Skip" or Esc closes it for good. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const key = () => 'rafiqHomeTourSeen_' + (sessionStorage.getItem('rafiqParentUserId') || 'parent');
  const steps = () => [
    ['#familyJourney', x('Your journey', 'هاي رحلتكم'), x('Four stations. “You are here” shows where you are, and ✓ marks what you finished.', 'أربع محطات. «أنتم هون» بتبيّن وين إنتوا، و✓ بتعلّم اللي خلّصتوه.')],
    ['#nextBestAction', x('Your next step', 'هاي خطوتكم الجاية'), x('One clear thing to do now, with why it helps. Start here every time.', 'إشي واحد واضح تعملوه هلّق، مع ليش بيفيد. ابدأوا من هون كل مرة.')],
    ['#rafiqHelp', x('Help is always here', 'والمساعدة دايمًا هون'), x('Ask about anything on the page — Rafiq explains it in simple words.', 'اسألوا عن أي إشي بالصفحة — رفيق بيشرحلكم ببساطة.')]
  ];
  let i = 0, layer, ring, card;

  function seen() { try { return !!localStorage.getItem(key()); } catch { return true; } }
  function done() { try { localStorage.setItem(key(), new Date().toISOString()); } catch {} layer?.remove(); ring?.remove(); card?.remove(); layer = ring = card = null; removeEventListener('keydown', onKey, true); removeEventListener('resize', position); removeEventListener('scroll', position, true); current = null; }
  function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); done(); } }

  function place() {
    const [sel, title, text] = steps()[i];
    const target = document.querySelector(sel);
    if (!target) { if (i < steps().length - 1) { i++; return place(); } return done(); }
    if (i < 2) target.scrollIntoView({ block: 'center', behavior: 'instant' });
    current = target;
    card.replaceChildren();
    const count = document.createElement('p'); count.className = 'ht-count'; count.textContent = x((i + 1) + ' of 3', (i + 1) + ' من 3');
    const h = document.createElement('h2'); h.id = 'homeTourTitle'; h.textContent = title;
    const p = document.createElement('p'); p.textContent = text;
    const row = document.createElement('div'); row.className = 'ht-actions';
    const skip = document.createElement('button'); skip.type = 'button'; skip.className = 'ht-skip'; skip.textContent = x('Skip', 'تخطّوا'); skip.onclick = done;
    const next = document.createElement('button'); next.type = 'button'; next.className = 'ht-next'; next.textContent = i === steps().length - 1 ? x('Got it', 'تمام، فهمت') : x('Next', 'التالي');
    next.onclick = () => { if (i >= steps().length - 1) return done(); i++; place(); };
    row.append(skip, next); card.append(count, h, p, row);
    position(); setTimeout(position, 120); setTimeout(position, 400);
    next.focus({ preventScroll: true });
  }

  // Keep the ring on the target and the card next to it (also while the page scrolls).
  let current = null;
  function position() {
    if (!current || !ring || !card) return;
    const r = current.getBoundingClientRect(), pad = 8;
    Object.assign(ring.style, { top: (r.top - pad) + 'px', left: (r.left - pad) + 'px', width: (r.width + pad * 2) + 'px', height: (r.height + pad * 2) + 'px' });
    const below = r.bottom + pad + 12 + card.offsetHeight < innerHeight;
    card.style.top = Math.max(12, below ? r.bottom + pad + 12 : r.top - pad - 12 - card.offsetHeight) + 'px';
  }

  function start() {
    if (seen() || !document.getElementById('familyJourney')) return;
    layer = document.createElement('div'); layer.className = 'ht-layer'; layer.addEventListener('click', done);
    ring = document.createElement('div'); ring.className = 'ht-ring'; ring.setAttribute('aria-hidden', 'true');
    card = document.createElement('div'); card.className = 'ht-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'true'); card.setAttribute('aria-labelledby', 'homeTourTitle'); card.dataset.noTranslate = '';
    document.body.append(layer, ring, card);
    addEventListener('keydown', onKey, true); addEventListener('resize', position); addEventListener('scroll', position, true);
    place();
  }
  const go = () => setTimeout(() => { try { start(); } catch { done(); } }, 900);
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
})();

/* Memories page: a short header (title, one line, one add button, a small count),
   no repeated helpers, and the gallery as the main content. Reuses the page's own
   upload button, search, sort and grid. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const childName = () => { try { const id = window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child'); return window.RafiqSetup.readChildren().find(c => c.id === id)?.name || ''; } catch { return ''; } };

  function apply() {
    const hero = document.querySelector('.album-hero-card');
    if (!hero) return;
    document.body.classList.add('album-tidy');
    const name = childName();
    const info = hero.querySelector('.album-hero-info');
    let title = info?.querySelector('h1');
    if (title) { title.dataset.noTranslate = ''; title.textContent = ar() ? ('ذكريات ' + (name || 'طفلكم')) : ((name ? name + '’s' : 'Your child’s') + ' memories'); }
    const desc = info?.querySelector('.album-hero-desc');
    if (desc) { desc.dataset.noTranslate = ''; desc.textContent = ar() ? 'أول ابتسامة، أول خطوة، ولحظات يومية بتحبوها — مرتّبة حسب التاريخ ومحفوظة على جهازكم.' : 'First smiles, first steps and everyday moments you love — sorted by date and kept on your device.'; }
    // One clear add button (the main one already has a + icon).
    const main = document.getElementById('openUpload');
    const label = main?.querySelector('span');
    if (label) { label.dataset.noTranslate = ''; label.textContent = ar() ? 'إضافة صور' : 'Add photos'; }
    document.getElementById('heroUpload')?.setAttribute('hidden', '');
    hero.querySelector('.album-upload-hint')?.setAttribute('hidden', '');
    // Count as a small chip next to the title.
    const count = Number(document.getElementById('photoCount')?.textContent || 0);
    let chip = info?.querySelector('.album-count-chip');
    if (info && !chip) { chip = document.createElement('span'); chip.className = 'album-count-chip'; chip.dataset.noTranslate = ''; (title || info.firstElementChild)?.after(chip); }
    if (chip) {
      const size = document.getElementById('albumSize')?.textContent?.trim() || '';
      chip.textContent = (ar() ? (count === 0 ? 'لسا ما في صور' : count === 1 ? 'صورة وحدة' : count + ' صور') : (count === 0 ? 'No photos yet' : count === 1 ? '1 photo' : count + ' photos')) + (count && size ? ' · ' + size : '');
    }
    // Search and sort only make sense once there are photos; the empty state keeps one button.
    document.body.classList.toggle('album-is-empty', count === 0);
    document.title = (ar() ? ('ذكريات ' + (name || 'طفلكم')) : ((name ? name + '’s' : 'Your child’s') + ' memories')) + ' | ' + (ar() ? 'رفيق' : 'RAFIQ');
    const empty = document.getElementById('albumEmpty');
    if (empty) { const h = empty.querySelector('h2'), p = empty.querySelector('p'); if (h) { h.dataset.noTranslate = ''; h.textContent = ar() ? 'هون بتبلّش حكاية ' + (name || 'طفلكم') : (name || 'Your child') + '’s story starts here'; } if (p) { p.dataset.noTranslate = ''; p.textContent = ar() ? 'أضيفوا أول صورة: ابتسامة، خطوة، أو لحظة حلوة من اليوم.' : 'Add the first photo: a smile, a step, or a sweet moment from today.'; } }
  }

  const run = () => { try { apply(); } catch { /* keep the page as it was */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', () => { run(); setTimeout(run, 400); });
  const count = document.getElementById('photoCount');
  if (count) new MutationObserver(run).observe(count, { childList: true, characterData: true, subtree: true });
  new MutationObserver(() => setTimeout(run, 80)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

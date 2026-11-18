/* Instagram-style specialist profile for parents: header with stats, then tabs for
   posts & videos, reviews from families, certificates, and about/session details.
   Runs after specialist-profile.js, reuses its booking buttons and moves its
   sections into tabs, so the existing data and booking flow stay unchanged. */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const content = document.getElementById('clinicContent');
  if (!content || content.hidden) return; // profile unavailable: keep the existing message
  const id = new URLSearchParams(location.search).get('specialist');
  let profile;
  try { profile = window.RafiqSpecialistPublic.find(id); } catch { return; }
  if (!profile) return;

  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, arText) => (ar() ? arText : en);
  const make = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
  const num = v => new Intl.NumberFormat(ar() ? 'ar-JO' : 'en-GB').format(v);
  const show = profile.showcase || {};
  const posts = Array.isArray(show.posts) ? show.posts : [];
  const reviews = Array.isArray(show.reviews) ? show.reviews : [];
  const credentials = Array.isArray(show.credentials) ? show.credentials : [];
  const name = profile.fullName || profile.name || x('Specialist', 'مختص');
  const avg = reviews.length ? reviews.reduce((s, r) => s + Number(r.stars || 0), 0) / reviews.length : 0;
  const ago = days => days <= 0 ? x('today', 'اليوم') : days === 1 ? x('yesterday', 'مبارح') : days < 7 ? x(days + ' days ago', 'قبل ' + num(days) + ' أيام') : days < 30 ? (w => x(w + (w === 1 ? ' week ago' : ' weeks ago'), w === 1 ? 'قبل أسبوع' : w === 2 ? 'قبل أسبوعين' : 'قبل ' + num(w) + ' أسابيع'))(Math.round(days / 7)) : x(Math.round(days / 30) + ' months ago', 'قبل ' + num(Math.round(days / 30)) + ' شهر');
  const stars = n => '★★★★★'.slice(0, Math.round(n)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(n));

  // Fill in session text from the demo showcase when the specialist has not published it.
  const fillIfEmpty = (elId, value) => { const el = document.getElementById(elId); if (el && value && /not been added|ما انضاف|لسه ما|لسا ما/i.test(el.textContent)) el.textContent = value; };
  fillIfEmpty('clinicApproach', show.approach); fillIfEmpty('clinicAges', show.ages); fillIfEmpty('clinicFirst', show.first);

  const oldIntro = content.querySelector(':scope > section.family-card:first-of-type');
  const oldNav = content.querySelector(':scope > nav.family-actions');
  const about = document.getElementById('clinicAbout'), quals = document.getElementById('clinicQualifications'), session = document.getElementById('clinicSession');
  const photoSource = document.getElementById('clinicPhoto');
  let activeTab = 'posts';

  function render() {
    document.getElementById('igProfile')?.remove();
    const root = make('section', 'ig-profile'); root.id = 'igProfile'; root.dataset.noTranslate = '';

    // Header
    const head = make('div', 'ig-head');
    const avatar = make('div', 'ig-avatar'); const ring = make('div', 'ig-avatar-ring');
    const img = photoSource?.querySelector('img');
    if (img) { const copy = img.cloneNode(); copy.alt = x('Photo of ', 'صورة ') + name; ring.append(copy); } else ring.append(make('span', 'ig-initial', name.trim().charAt(0)));
    avatar.append(ring);
    const idBox = make('div', 'ig-id');
    const title = make('h1', 'ig-name'); title.append(make('span', '', name));
    if (profile.status === 'approved') { const badge = make('span', 'ig-verified', '✓'); badge.title = x('Verified by Rafiq', 'موثّق من رفيق'); badge.setAttribute('aria-label', badge.title); title.append(badge); }
    idBox.append(title, make('p', 'ig-specialty', profile.specialty || ''));
    const stats = make('ul', 'ig-stats');
    const stat = (value, label) => { const li = make('li'); li.append(make('b', '', value), make('span', '', label)); stats.append(li); };
    if (Number.isFinite(Number(profile.experience))) stat(num(profile.experience), x('years of experience', 'سنين خبرة'));
    if (show.sessions) stat(num(show.sessions), x('sessions on Rafiq', 'جلسة على رفيق'));
    stat(reviews.length ? num(Math.round(avg * 10) / 10) + ' ★' : x('New', 'جديد'), reviews.length ? x(reviews.length + ' reviews', num(reviews.length) + ' تقييمات') : x('no reviews yet', 'لسا ما في تقييمات'));
    const fee = Number(profile.price ?? profile.sessionFee);
    if (Number.isFinite(fee) && fee > 0) stat(num(fee) + ' ' + x('JOD', 'د.أ'), x('per session', 'للجلسة'));
    idBox.append(stats);
    const bio = make('p', 'ig-bio', profile.bio || profile.about || ''); idBox.append(bio);
    const chips = make('div', 'ig-chips');
    const areas = Array.isArray(profile.areas) ? profile.areas : [];
    areas.slice(0, 5).forEach(a => chips.append(make('span', 'ig-chip', a)));
    const types = Array.isArray(profile.consultationTypes) ? profile.consultationTypes : [];
    if (types.includes('online')) chips.append(make('span', 'ig-chip is-meta', x('Online', 'أونلاين')));
    if (types.some(t => /in-?person/.test(t))) chips.append(make('span', 'ig-chip is-meta', x('In clinic', 'بالعيادة')));
    if (show.duration) chips.append(make('span', 'ig-chip is-meta', show.duration));
    idBox.append(chips);
    const actions = make('div', 'ig-actions');
    const book = make('button', 'ig-btn is-primary', x('Book a session', 'احجزوا جلسة')); book.type = 'button'; book.onclick = () => document.getElementById('clinicBook')?.click();
    const ask = make('a', 'ig-btn', x('Request follow-up', 'اطلبوا متابعة')); ask.href = document.getElementById('clinicMessage')?.getAttribute('href') || 'messages.html';
    const back = make('a', 'ig-btn is-ghost', x('Other specialists', 'مختصين ثانيين')); back.href = 'specialists.html';
    actions.append(book, ask, back); idBox.append(actions);
    head.append(avatar, idBox); root.append(head);

    // Tabs
    const tabs = [['posts', x('Posts & videos', 'المنشورات والفيديوهات'), posts.length], ['reviews', x('Reviews', 'التقييمات'), reviews.length], ['certs', x('Certificates', 'الشهادات'), credentials.length], ['about', x('About & session', 'عن المختص والجلسة')]];
    const bar = make('div', 'ig-tabs'); bar.setAttribute('role', 'tablist'); bar.setAttribute('aria-label', x('Profile sections', 'أقسام الملف'));
    const panels = {};
    for (const [key, label, count] of tabs) {
      const b = make('button', 'ig-tab'); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'igTab-' + key; b.setAttribute('aria-controls', 'igPanel-' + key);
      b.append(make('span', '', label)); if (count) b.append(make('small', '', num(count)));
      b.onclick = () => select(key, true); bar.append(b);
      const panel = make('div', 'ig-panel'); panel.id = 'igPanel-' + key; panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', b.id); panels[key] = panel;
    }
    bar.addEventListener('keydown', e => { if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return; const keys = tabs.map(t => t[0]); let i = keys.indexOf(activeTab); const forward = (e.key === 'ArrowRight') !== ar(); i = (i + (forward ? 1 : keys.length - 1)) % keys.length; select(keys[i], true); document.getElementById('igTab-' + keys[i]).focus(); e.preventDefault(); });
    root.append(bar);

    // Posts grid
    if (posts.length) {
      const grid = make('div', 'ig-grid');
      posts.forEach((post, i) => {
        const tile = make('button', 'ig-tile is-' + (post.type === 'video' ? 'video' : 'tip') + (post.tone ? ' tone-' + post.tone : '')); tile.type = 'button';
        tile.setAttribute('aria-label', (post.type === 'video' ? x('Video: ', 'فيديو: ') : x('Tip: ', 'نصيحة: ')) + post.title);
        if (post.type === 'video') { tile.style.backgroundImage = 'url("' + post.poster + '")'; tile.append(make('span', 'ig-play', '▶')); }
        tile.append(make('span', 'ig-tile-title', post.title));
        tile.onclick = () => openPost(i); grid.append(tile);
      });
      panels.posts.append(grid);
    } else panels.posts.append(make('p', 'ig-empty', x('This specialist has not shared posts yet.', 'هالمختص لسا ما نشر إشي.')));

    // Reviews
    if (reviews.length) {
      const summary = make('div', 'ig-review-summary');
      const big = make('div', 'ig-review-score'); big.append(make('b', '', num(Math.round(avg * 10) / 10)), make('span', 'ig-stars', stars(avg)), make('small', '', x(reviews.length + ' reviews from families', num(reviews.length) + ' تقييمات من عيلات')));
      const bars = make('div', 'ig-bars');
      for (let s = 5; s >= 1; s--) { const c = reviews.filter(r => Number(r.stars) === s).length; const row = make('div', 'ig-bar'); const track = make('span', 'ig-bar-track'); const fill = make('span', 'ig-bar-fill'); fill.style.width = (reviews.length ? c / reviews.length * 100 : 0) + '%'; track.append(fill); row.append(make('span', '', num(s) + ' ★'), track, make('span', '', num(c))); bars.append(row); }
      summary.append(big, bars); panels.reviews.append(summary);
      const list = make('div', 'ig-reviews');
      for (const r of reviews) {
        const card = make('article', 'ig-review');
        const top = make('div', 'ig-review-top'); top.append(make('span', 'ig-review-avatar', String(r.who || '?').trim().charAt(0)));
        const who = make('div'); who.append(make('strong', '', r.who), make('small', '', [r.age, ago(Number(r.days || 0))].filter(Boolean).join(' · ')));
        top.append(who, make('span', 'ig-stars', stars(Number(r.stars || 0))));
        card.append(top, make('p', '', r.text), make('span', 'ig-review-badge', '✓ ' + x('Confirmed Rafiq session', 'جلسة مؤكدة عبر رفيق')));
        list.append(card);
      }
      panels.reviews.append(list);
    } else panels.reviews.append(make('p', 'ig-empty', x('No reviews yet. Families can review after a completed session.', 'لسا ما في تقييمات. العيلات بتقيّم بعد ما تخلص الجلسة.')));
    panels.reviews.append(make('p', 'ig-note', x('Only families who completed a session through Rafiq can leave a review.', 'بس العيلات اللي خلّصت جلسة عن طريق رفيق بتقدر تقيّم.')));

    // Certificates
    if (credentials.length) {
      const list = make('div', 'ig-certs');
      for (const c of credentials) {
        const card = make('article', 'ig-cert'); card.append(make('span', 'ig-cert-icon', '🎓'));
        const body = make('div'); body.append(make('strong', '', c.title), make('small', '', [c.issuer, c.year].filter(Boolean).join(' · ')));
        if (/rafiq|رفيق/i.test(c.issuer || '')) body.append(make('span', 'ig-review-badge', '✓ ' + x('Checked by Rafiq', 'تحقق منها رفيق')));
        card.append(body); list.append(card);
      }
      panels.certs.append(list);
    }
    if (quals) {
      // The demo cards above replace the empty 'recorded qualification' rows; published certificate files still show.
      if (credentials.length) { quals.querySelector('h2')?.setAttribute('hidden', ''); quals.querySelector('#clinicCredentials')?.setAttribute('hidden', ''); quals.querySelectorAll('#clinicCertificates > p').forEach(el => el.setAttribute('hidden', '')); quals.classList.add('ig-quals-compact'); }
      panels.certs.append(quals);
    }
    // Session details: use the published duration and hide rows that were never filled in.
    (session?.querySelectorAll('#clinicSessionDetails dd')||[]).forEach(dd => { const dt = dd.previousElementSibling; if (/Not provided|غير متوفر|مش متوفر/i.test(dd.textContent)) { if (show.duration && /duration|مدة/i.test(dt?.textContent || '')) dd.textContent = show.duration; else { dd.hidden = true; if (dt) dt.hidden = true; } } });
    // Show the session facts in the page language (the older script writes them in English).
    const rows = [...(session?.querySelectorAll('#clinicSessionDetails dt')||[])];
    const setRow = (pattern, value) => { const dt = rows.find(r => pattern.test(r.textContent)); const dd = dt?.nextElementSibling; if (dd && value) { dd.textContent = value; dd.dataset.noTranslate = ''; } };
    if (Number.isFinite(fee) && fee > 0) setRow(/fee|سعر|رسوم/i, num(fee) + ' ' + x('JOD', 'د.أ'));
    if (types.length) setRow(/type|نوع/i, types.map(t => t === 'online' ? x('Online', 'أونلاين') : /in-?person/.test(t) ? x('In clinic', 'بالعيادة') : t).join(x(', ', '، ')));
    const langs = Array.isArray(profile.languages) ? profile.languages : [];
    if (langs.length) setRow(/language|لغ/i, langs.map(l => ({ arabic: x('Arabic', 'العربية'), english: x('English', 'الإنجليزية') })[String(l).toLowerCase()] || l).join(x(', ', '، ')));
    const cancel = session?.querySelector('#clinicCancellation');
    if (cancel && /not been added|ما انضاف|لسه ما|لسا ما/i.test(cancel.textContent)) { cancel.textContent = x('You can change the time for free up to 24 hours before the session.', 'بتقدروا تغيّروا الموعد مجانًا لحد ٢٤ ساعة قبل الجلسة.'); cancel.dataset.noTranslate = ''; }
    // Use the first video post as the introduction video when none was published separately.
    const intro = about?.querySelector('#clinicVideo'), firstVideo = posts.find(p => p.type === 'video');
    if (intro && firstVideo && !intro.querySelector('video')) { intro.replaceChildren(); const v = make('video', 'ig-intro-video'); v.src = firstVideo.src; v.poster = firstVideo.poster; v.controls = true; v.preload = 'none'; v.playsInline = true; v.setAttribute('aria-label', firstVideo.title); intro.append(v, make('p', 'ig-note', firstVideo.title)); }

    // About
    if (about) panels.about.append(about);
    if (session) panels.about.append(session);

    for (const key of Object.keys(panels)) root.append(panels[key]);
    content.prepend(root);
    if (oldIntro) oldIntro.hidden = true;
    if (oldNav) oldNav.hidden = true;
    select(activeTab, false);
  }

  function select(key, user) {
    activeTab = key;
    document.querySelectorAll('#igProfile .ig-tab').forEach(b => { const on = b.id === 'igTab-' + key; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    document.querySelectorAll('#igProfile .ig-panel').forEach(p => { p.hidden = p.id !== 'igPanel-' + key; });
    if (user) history.replaceState(null, '', location.pathname + location.search + '#' + key);
  }

  // Post viewer (Instagram-like modal with previous/next)
  function openPost(index) {
    document.getElementById('igViewer')?.remove();
    const dialog = make('dialog', 'ig-viewer'); dialog.id = 'igViewer'; dialog.dataset.noTranslate = '';
    const draw = () => {
      const post = posts[index]; dialog.replaceChildren();
      const close = make('button', 'ig-viewer-close', '×'); close.type = 'button'; close.setAttribute('aria-label', x('Close', 'سكّر')); close.onclick = () => dialog.close();
      const media = make('div', 'ig-viewer-media' + (post.type === 'video' ? '' : ' tone-' + (post.tone || 'mint')));
      if (post.type === 'video') { const v = make('video'); v.src = post.src; v.poster = post.poster; v.controls = true; v.playsInline = true; v.autoplay = true; v.muted = true; v.setAttribute('aria-label', post.title); media.append(v); }
      else media.append(make('span', 'ig-viewer-tip', post.title));
      const side = make('div', 'ig-viewer-side');
      const who = make('div', 'ig-viewer-who'); who.append(make('span', 'ig-review-avatar', name.trim().charAt(0)), make('strong', '', name));
      side.append(who, make('h2', '', post.title), make('p', '', post.caption), make('small', 'ig-viewer-meta', '💚 ' + x('Helpful for ' + post.helpful + ' families', 'مفيد لـ ' + num(post.helpful) + ' عيلة') + ' · ' + ago(Number(post.days || 0))));
      const nav = make('div', 'ig-viewer-nav');
      const prev = make('button', 'ig-btn', x('‹ Previous', 'السابق')); prev.type = 'button'; prev.disabled = index === 0; prev.onclick = () => { index--; draw(); };
      const next = make('button', 'ig-btn', x('Next ›', 'التالي')); next.type = 'button'; next.disabled = index === posts.length - 1; next.onclick = () => { index++; draw(); };
      const book = make('button', 'ig-btn is-primary', x('Book a session', 'احجزوا جلسة')); book.type = 'button'; book.onclick = () => { dialog.close(); document.getElementById('clinicBook')?.click(); };
      nav.append(prev, next, book); side.append(nav);
      dialog.append(close, media, side);
    };
    draw();
    dialog.addEventListener('close', () => dialog.remove());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const forward = (e.key === 'ArrowLeft') === ar(); const n = index + (forward ? 1 : -1); if (n >= 0 && n < posts.length) { index = n; draw(); } } });
    document.body.append(dialog); dialog.showModal();
  }

  const fromHash = location.hash.slice(1);
  if (['posts', 'reviews', 'certs', 'about'].includes(fromHash)) activeTab = fromHash;
  document.querySelector('.specialist-clinic-page .family-steps')?.setAttribute('hidden', '');
  render();
  new MutationObserver(() => render()).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});

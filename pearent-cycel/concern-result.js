/* "I have a concern" result: turn the saved answers into one clear, explained suggestion
   (talk to someone soon / a consultation may help / keep watching at home) with matching
   actions. Transparent rules from the parent's own answers — not a test or a diagnosis.
   Reuses the page's own summary, booking link and saved-note link. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const make = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
  const child = () => { try { const id = window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child'); return window.RafiqSetup.readChildren().find(c => c.id === id) || null; } catch { return null; } };
  const areaOf = { communication: 'language', movement: 'movement', social: 'social', emotions: 'social', unsure: '' };
  const who = { communication: ['a speech and language specialist', 'مختص نطق ولغة'], movement: ['a child development or physio specialist', 'مختص نمو أو علاج طبيعي'], social: ['a child development specialist', 'مختص نمو أطفال'], emotions: ['a child psychologist', 'أخصائي نفسي للأطفال'], unsure: ['your paediatrician or a development specialist', 'طبيب الأطفال أو مختص نمو'] };

  function answers(view) {
    const out = [];
    const dl = view.querySelector('#concernSummaryAnswers');
    if (!dl) return out;
    [...dl.querySelectorAll('dt')].forEach(dt => out.push({ q: dt.textContent.trim(), a: (dt.nextElementSibling?.textContent || '').trim() }));
    return out;
  }
  function topicKey() { const checked = document.querySelector('#topicForm input[name="topic"]:checked'); return checked?.value || 'unsure'; }

  function assess(list, c, topic) {
    const find = re => list.find(r => re.test(r.q))?.a || '';
    const regress = find(/توقف|stopped|lost/i), since = find(/متى|when/i), where = find(/أين|where/i);
    const reasons = []; let level = 'watch';
    if (/^(نعم|yes)/i.test(regress)) { level = 'soon'; reasons.push(x('You noticed your child stopped doing something they could do before.', 'لاحظتوا إنه بطّل يعمل إشي كان بيعرفه.')); }
    if (/أشهر|طويلة|months|long/i.test(since)) { if (level === 'watch') level = 'consult'; reasons.push(x('You have noticed this for months.', 'لاحظتوها من أشهر.')); }
    if (/شخص آخر|someone else|other/i.test(where)) { if (level === 'watch') level = 'consult'; reasons.push(x('Someone else also pointed it out.', 'في حدا ثاني كمان لفت انتباهكم.')); }
    try {
      const chosen = window.RafiqConcernAreas?.current?.(); const byArea = { speech: 'language', development: '', learning: 'cognitive', everyday: 'social', genetic: '', sensory: 'movement', behaviour: 'social', emotional: 'social', sleep: null, feeding: null, medical: null }; const area = chosen ? byArea[chosen.id] : areaOf[topic]; if (area === null) throw 0; const checks = JSON.parse(localStorage.getItem('rafiqMilestoneChecks_' + c.id) || '{}');
      const notYet = Object.entries(checks).filter(([k, v]) => v?.state === 'not_yet' && (!area || k.includes(':' + area + ':'))).length;
      if (notYet >= 2) { if (level === 'watch') level = 'consult'; reasons.push(x(notYet + ' skills for this age are marked “not yet” in the growth journal.', notYet + ' مهارات لهالعمر معلّمة «لسا» بسجل النمو.')); }
    } catch {}
    if (!reasons.length) reasons.push(x('It started recently and nothing else stood out in your answers.', 'بلّشت قريب وما في إشي ثاني لافت بإجاباتكم.'));
    return { level, reasons };
  }

  function render() {
    const view = document.getElementById('summaryView');
    if (!view || view.hidden) return;
    const c = child(); if (!c) return;
    document.body.classList.add('concern-result-on');
    const topic = topicKey(), list = answers(view), { level, reasons } = assess(list, c, topic);
    const area = window.RafiqConcernAreas?.current?.() || null;
    const whoEn = area ? area.who.en : whoEn, whoAr = area ? area.who.ar : whoAr;
    view.querySelector('.cr')?.remove();
    const box = make('section', 'cr is-' + level); box.dataset.noTranslate = ''; box.setAttribute('aria-live', 'polite');
    const head = make('div', 'cr-head');
    head.append(make('p', 'cr-kicker', x('Your result for ' + c.name, 'النتيجة لـ ' + c.name)));
    const titles = { soon: x('Talk to your paediatrician or a specialist soon', 'احكوا مع طبيب الأطفال أو مختص بأقرب وقت'), consult: x('A consultation with a specialist could help', 'استشارة مع مختص ممكن تفيدكم'), watch: x('Keep watching at home for two weeks', 'راقبوا بالبيت أسبوعين') };
    const leads = {
      soon: x('Losing a skill is a reason to check early. This does not mean something is wrong — it means it is worth asking now.', 'لما الطفل يبطّل يعمل مهارة كان بيعرفها، بيستاهل نسأل بدري. هاد ما بيعني إنه في مشكلة — بيعني إنه منيح نسأل هلّق.'),
      consult: x('What you described is worth talking through with ' + whoEn + '. Your summary is ready to share.', 'اللي وصفتوه بيستاهل تحكوه مع ' + whoAr + '. ملخصكم جاهز تشاركوه.'),
      watch: x('Try a short activity each day, note what you see, and come back in two weeks. If it is the same or more worrying, book a consultation.', 'جرّبوا نشاط قصير كل يوم، سجّلوا شو بتشوفوا، وارجعوا بعد أسبوعين. إذا ضلّت نفسها أو صارت مقلقة أكثر، احجزوا استشارة.')
    };
    head.append(make('h2', 'cr-title', titles[level]), make('p', 'cr-lead', leads[level]));
    box.append(head);
    const why = make('div', 'cr-why'); why.append(make('strong', '', x('Why this suggestion?', 'ليش هالاقتراح؟')));
    const ul = make('ul'); reasons.forEach(r => ul.append(make('li', '', r))); why.append(ul); box.append(why);

    // Actions that match the level
    const actions = make('div', 'cr-actions');
    const specialistHref = document.getElementById('browseConcernSpecialists')?.getAttribute('href') || 'specialists.html';
    const card = (cls, title, text, label, href, onClick) => { const a = make('a', 'cr-action ' + cls); a.href = href; a.append(make('strong', '', title), make('span', '', text), make('em', '', label)); if (onClick) a.addEventListener('click', onClick); return a; };
    const includeBox = document.getElementById('includeConcernSummary');
    const book = card('is-book', x('Talk to ' + whoEn, 'احكوا مع ' + whoAr), x('Your summary can be attached to the booking — you review it first.', 'ملخصكم بينضاف لطلب الحجز — وبتراجعوه قبل ما تأكدوا.'), x('Find a specialist →', 'لاقوا مختص ←'), specialistHref, e => { const original = document.getElementById('browseConcernSpecialists'); if (includeBox && !includeBox.checked) includeBox.click(); const note = document.getElementById('bookingNoteText'); if (area && note && !note.value.startsWith('[')) { note.value = ('[' + area.label.en + ' / ' + area.label.ar + '] ' + note.value).slice(0, 500); } if (original) { e.preventDefault(); original.click(); } });
    const watch = card('is-watch', x('Try today’s activity', 'جرّبوا نشاط اليوم'), x('5–10 minutes of play matched to ' + c.name + '’s age.', '٥–١٠ دقايق لعب على قد عمر ' + c.name + '.'), x('Start →', 'ابدأوا ←'), 'daily-activity.html');
    const notes = card('is-notes', x('Note what you see', 'سجّلوا اللي بتشوفوه'), x('Short notes and the age checklist help you and the specialist.', 'ملاحظات قصيرة وقائمة مهارات العمر بتساعدكم وبتساعد المختص.'), x('Growth journal →', 'سجل النمو ←'), 'milestones.html');
    if (level === 'watch') actions.append(watch, notes, book); else actions.append(book, notes);
    if (area) actions.append(card('is-topics', x('More about ' + area.label.en.toLowerCase(), 'مواضيع ' + area.label.ar), x('Guides and services for this area on Rafiq.', 'أدلة وخدمات هالمجال على رفيق.'), x('See topics →', 'شوفوا المواضيع ←'), 'support-areas.html?category=' + encodeURIComponent(area.id)));
    box.append(actions);

    // The summary that would reach the specialist, folded
    const details = make('details', 'cr-summary'); details.append(make('summary', '', x('See the summary a specialist would receive', 'شوفوا الملخص اللي رح يوصل للمختص')));
    const dl = make('dl'); list.forEach(r => { dl.append(make('dt', '', r.q), make('dd', '', r.a)); }); details.append(dl);
    box.append(details);
    box.append(make('p', 'cr-note', x('Saved in ' + c.name + '’s record. This is not a diagnosis — only a way to organise what you noticed.', 'انحفظ بسجل ' + c.name + '. هاد مش تشخيص — بس طريقة نرتّب فيها اللي لاحظتوه.')));
    view.prepend(box);
  }

  function steps() {
    document.querySelectorAll('.screen-flow-steps .step-text').forEach(s => { if (!s.dataset.crClean) { s.dataset.crClean = '1'; s.textContent = s.textContent.replace(/^\s*[0-9٠-٩]+\s*[.\-–]\s*/, ''); } });
  }
  function run() { try { steps(); render(); } catch { /* keep the original summary */ } }
  const watchView = () => { const v = document.getElementById('summaryView'); if (!v || v.dataset.crWatch) return; v.dataset.crWatch = '1'; new MutationObserver(() => { if (!v.hidden && !v.querySelector('.cr')) setTimeout(run, 50); }).observe(v, { attributes: true, attributeFilter: ['hidden'], childList: true }); };
  const start = () => { watchView(); run(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('load', () => setTimeout(start, 200));
  new MutationObserver(() => setTimeout(() => { document.querySelectorAll('.screen-flow-steps .step-text').forEach(s => delete s.dataset.crClean); run(); }, 120)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

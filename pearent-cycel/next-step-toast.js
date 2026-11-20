/* After every save, a small note says it worked and offers the next step, so the journey
   continues instead of ending on a silent save ("Vaccine saved ✓ · See the next one").
   It listens to saves made right after the parent clicks or types (not page-load writes). */
(() => {
  'use strict';
  if (window.RafiqNextStep) return;
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const page = location.pathname.split('/').pop() || '';
  const kid = () => { try { const id = window.RafiqFamily?.selected?.() || localStorage.getItem('rafiqCurrentChildId'); return window.RafiqSetup?.readChildren?.().find(c => c.id === id)?.name || ''; } catch { return ''; } };
  const go = (href, en, a) => ({ href, label: x(en, a) });
  // prefix -> () => { title, text, next } ; `grow` = only when a list got longer
  const RULES = [
    ['rafiqVaccinations_', () => ({ title: x('Vaccine saved ✓', 'انسجّل المطعوم ✓'), text: x('The schedule is updated and shows what comes next.', 'الجدول تحدّث وبيبيّن شو الجاي.'), next: page === 'health.html' ? null : go('health.html', 'See the schedule', 'شوفوا الجدول') })],
    ['rafiqGrowth_', () => ({ title: x('Measurement saved ✓', 'انحفظ القياس ✓'), text: x('Add a note about how ' + (kid() || 'your child') + ' is doing?', 'بتحبّوا تسجّلوا ملاحظة عن ' + (kid() || 'طفلكم') + '؟'), next: go('milestones.html', 'Growth journal', 'دفتر النمو') })],
    ['rafiqHealthNotes_', () => ({ title: x('Health note saved ✓', 'انحفظت الملاحظة الصحية ✓'), text: x('It will be ready to show the doctor at the next visit.', 'بتكون جاهزة تفرجوها للدكتور بالزيارة الجاية.'), next: null })],
    ['rafiqAgeObservations_', () => ({ title: x('Note saved in the growth journal ✓', 'انحفظت الملاحظة بدفتر النمو ✓'), text: x('Next: a short game that fits this age.', 'الجاي: لعبة قصيرة بتناسب هالعمر.'), next: page === 'daily-activity.html' ? null : go('daily-activity.html', 'Today’s activity', 'نشاط اليوم') }), 'grow'],
    ['rafiqMilestoneChecks_', () => ({ title: x('Marked ✓', 'انعلّمت ✓'), text: x('For skills that are “not yet”, a game can help practise them.', 'المهارات اللي «لسّا»، في ألعاب بتساعد تتدرّب عليها.'), next: go('activities.html', 'Find a game', 'لاقوا لعبة') }), 'quiet'],
    ['rafiqMilestones_', () => ({ title: x('Marked ✓', 'انعلّمت ✓'), text: x('For skills that are “not yet”, a game can help practise them.', 'المهارات اللي «لسّا»، في ألعاب بتساعد تتدرّب عليها.'), next: go('activities.html', 'Find a game', 'لاقوا لعبة') }), 'quiet'],
    ['rafiqDailyAssignments_', () => ({ title: x('Today’s activity saved ✓', 'انحفظ نشاط اليوم ✓'), text: x('Write down what you noticed — it builds the growth journal.', 'سجّلوا شو لاحظتوا — هيك بيكبر دفتر النمو.'), next: page === 'milestones.html' ? null : go('milestones.html', 'Add a note', 'أضيفوا ملاحظة') })],
    ['rafiqBookings', () => ({ title: x('Booking request sent ✓', 'انبعت طلب الحجز ✓'), text: x('You will see the specialist’s reply in Appointments.', 'ردّ المختص بيظهر بالمواعيد.'), next: page === 'bookings.html' ? null : go('bookings.html', 'My appointments', 'مواعيدي') }), 'grow'],
    ['rafiqReportFollowup_', () => ({ title: x('Home practice saved ✓', 'انحفظت تجربتكم بالبيت ✓'), text: x('Your specialist can see it at the follow-up.', 'المختص بيشوفها بالمتابعة.'), next: go('messages.html', 'My specialists', 'مختصّيني') })],
    ['rafiqChildAlbums', () => ({ title: x('Memory saved ✓', 'انحفظت الذكرى ✓'), text: x('It is now part of ' + (kid() || 'your child') + '’s story.', 'صارت جزء من حكاية ' + (kid() || 'طفلكم') + '.'), next: null })],
    ['rafiqDirectConversations', () => ({ title: x('Message sent ✓', 'انبعتت الرسالة ✓'), text: x('You will get a notification when they reply.', 'بيوصلكم تنبيه لما يردّوا.'), next: null }), 'grow']
  ];
  let lastUser = 0, lastShown = '', lastAt = 0;
  ['pointerdown', 'keydown', 'submit', 'change'].forEach(e => addEventListener(e, () => { lastUser = Date.now(); }, true));
  const size = v => { try { const j = JSON.parse(v); if (Array.isArray(j)) return j.filter(r => !r?._deletedAt).length; if (j && typeof j === 'object') return Object.keys(j).length; } catch {} return -1; };

  function onWrite(store, key, value, before) {
    if (Date.now() - lastUser > 2500 || before === value) return;
    let rule = RULES.find(([p]) => key === p || key.startsWith(p)); if (!rule) return;
    // On the report page every save is the home follow-up for the specialist.
    if (page === 'specialist-report.html' && /^rafiq(AgeObservations|ReportFollowup)_/.test(key)) rule = RULES.find(([p]) => p === 'rafiqReportFollowup_');
    const [, make, mode] = rule;
    if (mode === 'grow' && !(size(value) > size(before))) return;
    const msg = make(); const id = msg.title;
    if (id === lastShown && Date.now() - lastAt < (mode === 'quiet' ? 20000 : 3000)) return;
    lastShown = id; lastAt = Date.now();
    // Some saves reload the page at once; keep the note for the next page load.
    try { sessionStorage.setItem('rafiqPendingStep', JSON.stringify({ at: Date.now(), msg })); } catch {}
    setTimeout(() => show(msg), 250);
  }

  function hook(store) {
    if (!store || store.__rafiqStepHook) return;
    const set = store.setItem;
    const wrapped = function (k, v) { let before = null; try { before = this.getItem(k); } catch {} const r = set.apply(this, arguments); try { onWrite(this, String(k), String(v), before); } catch {} return r; };
    if (Object.prototype.toString.call(store) === '[object Storage]') {
      // Real browser storage: wrap the prototype once (assigning on the instance would save an item).
      if (!Storage.prototype.__rafiqStepHook) { const orig = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (this !== window.localStorage) return orig.apply(this, arguments); let before = null; try { before = this.getItem(k); } catch {} const r = orig.apply(this, arguments); try { onWrite(this, String(k), String(v), before); } catch {} return r; }; Object.defineProperty(Storage.prototype, '__rafiqStepHook', { value: true }); }
    } else {
      // The demo store may be a proxy that treats assignment as saving an item, so define the method directly.
      try { Object.defineProperty(store, 'setItem', { value: wrapped, configurable: true, writable: true }); Object.defineProperty(store, '__rafiqStepHook', { value: true }); } catch {}
      try { if (String(store.getItem('setItem') || '').includes('onWrite')) store.removeItem('setItem'); } catch {}
    }
  }

  let box, timer;
  function show({ title, text, next }) {
    if (!document.body) return;
    try { sessionStorage.removeItem('rafiqPendingStep'); } catch {}
    if (!box) {
      box = document.createElement('div'); box.className = 'rafiq-step-toast'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); box.dataset.noTranslate = '';
      document.body.append(box);
      box.addEventListener('mouseenter', () => clearTimeout(timer)); box.addEventListener('mouseleave', () => { timer = setTimeout(hide, 3000); });
    }
    box.replaceChildren();
    const body = document.createElement('div'); body.className = 'rst-body';
    const s = document.createElement('strong'); s.textContent = title; body.append(s);
    if (text) { const p = document.createElement('span'); p.textContent = text; body.append(p); }
    box.append(body);
    if (next) { const a = document.createElement('a'); a.className = 'rst-next'; a.href = next.href; a.textContent = next.label + x(' →', ' ←'); box.append(a); }
    const c = document.createElement('button'); c.type = 'button'; c.className = 'rst-close'; c.setAttribute('aria-label', x('Close', 'سكّروا')); c.textContent = '×'; c.addEventListener('click', hide); box.append(c);
    box.classList.remove('is-out'); requestAnimationFrame(() => box.classList.add('is-in'));
    clearTimeout(timer); timer = setTimeout(hide, 7000);
  }
  function hide() { if (!box) return; box.classList.remove('is-in'); box.classList.add('is-out'); }

  hook(window.localStorage);
  try { const p = JSON.parse(sessionStorage.getItem('rafiqPendingStep') || 'null'); if (p && Date.now() - p.at < 6000) { const run = () => setTimeout(() => show(p.msg), 500); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run(); } else sessionStorage.removeItem('rafiqPendingStep'); } catch {}
  window.RafiqNextStep = { show, rules: RULES };
})();

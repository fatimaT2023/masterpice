/* Jordan national immunization schedule (Ministry of Health, national programme) for the
   parent Health page: due dates from the child's birthday, status per visit, and a quick
   way for the parent to record or edit a dose. Doses are saved as normal vaccine records
   (RafiqHealthRecords) with a scheduleKey, so counts elsewhere stay in sync.
   Sources: MoH national programme; PCV13 added for children born from 1 Jan 2025
   (2, 4 months, booster at 12 months); varicella added 2026 (one dose at 12 months,
   children born from 1 Jan 2025). Parents should always confirm with the vaccination card. */
(() => {
  'use strict';
  const p = (en, ar) => ({ en, ar });
  const NEW_2025 = '2025-01-01';
  // months: age in months when due (school doses use years via months)
  const visits = [
    { id: 'birth', months: 0, label: p('First month', 'الشهر الأول'), doses: [
      { key: 'bcg', name: p('BCG (tuberculosis)', 'السل (BCG)') } ] },
    { id: 'm2', months: 2, label: p('2 months', 'عمر شهرين'), doses: [
      { key: 'hexa1', name: p('Hexavalent – dose 1', 'السداسي – الجرعة ١'), note: p('Diphtheria, tetanus, whooping cough, polio (IPV), Hib, hepatitis B', 'الخناق، الكزاز، السعال الديكي، شلل الأطفال (حقن)، المستدمية، التهاب الكبد ب') },
      { key: 'rota1', name: p('Rotavirus – dose 1', 'الروتا – الجرعة ١') },
      { key: 'pcv1', name: p('Pneumococcal (PCV13) – dose 1', 'المكورات الرئوية – الجرعة ١'), from: NEW_2025 } ] },
    { id: 'm3', months: 3, label: p('3 months', 'عمر ٣ أشهر'), doses: [
      { key: 'hexa2', name: p('Hexavalent – dose 2', 'السداسي – الجرعة ٢') },
      { key: 'opv1', name: p('Oral polio – dose 1', 'شلل الأطفال الفموي – الجرعة ١') },
      { key: 'rota2', name: p('Rotavirus – dose 2', 'الروتا – الجرعة ٢') } ] },
    { id: 'm4', months: 4, label: p('4 months', 'عمر ٤ أشهر'), doses: [
      { key: 'hexa3', name: p('Hexavalent – dose 3', 'السداسي – الجرعة ٣') },
      { key: 'opv2', name: p('Oral polio – dose 2', 'شلل الأطفال الفموي – الجرعة ٢') },
      { key: 'rota3', name: p('Rotavirus – dose 3', 'الروتا – الجرعة ٣') },
      { key: 'pcv2', name: p('Pneumococcal (PCV13) – dose 2', 'المكورات الرئوية – الجرعة ٢'), from: NEW_2025 } ] },
    { id: 'm9', months: 9, label: p('9 months', 'عمر ٩ أشهر'), doses: [
      { key: 'measles', name: p('Measles', 'الحصبة') },
      { key: 'opv3', name: p('Oral polio – dose 3', 'شلل الأطفال الفموي – الجرعة ٣') } ] },
    { id: 'm12', months: 12, label: p('12 months', 'عمر سنة'), doses: [
      { key: 'mmr1', name: p('MMR – dose 1', 'الثلاثي الفيروسي (حصبة، نكاف، حصبة ألمانية) – الجرعة ١') },
      { key: 'hepa1', name: p('Hepatitis A – dose 1', 'التهاب الكبد أ – الجرعة ١') },
      { key: 'pcv3', name: p('Pneumococcal (PCV13) – booster', 'المكورات الرئوية – الجرعة المعززة'), from: NEW_2025 },
      { key: 'varicella', name: p('Chickenpox (varicella)', 'جدري الماء'), from: NEW_2025 } ] },
    { id: 'm18', months: 18, label: p('18 months', 'عمر سنة ونص'), doses: [
      { key: 'mmr2', name: p('MMR – dose 2', 'الثلاثي الفيروسي – الجرعة ٢') },
      { key: 'dtp_b', name: p('DTP booster', 'الثلاثي البكتيري – جرعة معززة') },
      { key: 'opv_b', name: p('Oral polio booster', 'شلل الأطفال الفموي – جرعة معززة') },
      { key: 'hepa2', name: p('Hepatitis A – dose 2', 'التهاب الكبد أ – الجرعة ٢') } ] },
    { id: 'school1', months: 72, school: true, label: p('First grade (about 6 years)', 'الصف الأول (حوالي ٦ سنين)'), doses: [
      { key: 'school_td', name: p('Tetanus–diphtheria school booster', 'الكزاز والخناق – جرعة مدرسية') },
      { key: 'school_opv', name: p('Oral polio school booster', 'شلل الأطفال الفموي – جرعة مدرسية') } ] },
    { id: 'school10', months: 180, school: true, label: p('Tenth grade (about 15 years)', 'الصف العاشر (حوالي ١٥ سنة)'), doses: [
      { key: 'td10', name: p('Tetanus–diphtheria (Td)', 'الكزاز والخناق (Td)') } ] }
  ];

  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ar');
  const t = v => (v && typeof v === 'object' ? v[lang()] : v);
  const make = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
  const iso = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  const addMonths = (dob, m) => { const [y, mo, d] = dob.split('-').map(Number); const last = new Date(y, mo - 1 + m + 1, 0).getDate(); return new Date(y, mo - 1 + m, Math.min(d, last)); };
  const fmt = d => new Date(d + (d.length === 10 ? 'T12:00:00' : '')).toLocaleDateString(lang() === 'ar' ? 'ar-JO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  function child() {
    try { const id = window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child'); return window.RafiqSetup.readChildren().find(c => c.id === id) || null; } catch { return null; }
  }
  function plan(c, today = new Date()) {
    let records = [];
    try { records = window.RafiqHealthRecords.read('vaccine', c.id).filter(r => !r._deletedAt); } catch { records = []; }
    const byKey = new Map(records.filter(r => r.scheduleKey).map(r => [r.scheduleKey, r]));
    const ageMonths = (() => { const a = window.RafiqSetup?.ageFromBirth?.(c.dateOfBirth, today); return a ? a.totalMonths : 0; })();
    return visits.map(v => {
      const doses = v.doses.filter(d => !d.from || c.dateOfBirth >= d.from).map(d => ({ ...d, record: byKey.get(d.key) || null }));
      const due = addMonths(c.dateOfBirth, v.months);
      const doneCount = doses.filter(d => d.record).length;
      const days = Math.round((due - today) / 86400000);
      let status = doneCount === doses.length ? 'done' : days > 21 ? 'upcoming' : days >= -30 ? 'due' : 'late';
      if (v.school && ageMonths < v.months - 6 && doneCount === 0) status = 'upcoming';
      return { ...v, doses, due, days, status, doneCount };
    }).filter(v => v.doses.length);
  }

  const openVisits = new Set();
  function render() {
    const host = document.getElementById('healthContent');
    const c = child();
    if (!host || !c || !c.dateOfBirth || !window.RafiqHealthRecords) return;
    document.getElementById('vaccineSchedule')?.remove();
    const visitsPlan = plan(c);
    const all = visitsPlan.flatMap(v => v.doses), done = all.filter(d => d.record).length;
    const late = visitsPlan.filter(v => v.status === 'late'), next = visitsPlan.find(v => v.status === 'due') || visitsPlan.find(v => v.status === 'upcoming');

    const box = make('section', 'vx'); box.id = 'vaccineSchedule'; box.dataset.noTranslate = '';
    const head = make('div', 'vx-head');
    const title = make('div'); title.append(make('p', 'vx-kicker', t(p('Jordan national schedule', 'جدول المطاعيم الوطني – الأردن'))), make('h2', '', t(p(c.name + '’s vaccinations', 'مطاعيم ' + c.name))));
    const summary = make('div', 'vx-summary');
    const ring = make('div', 'vx-ring'); ring.style.setProperty('--vx-p', (all.length ? Math.round(done / all.length * 100) : 0) + '%'); ring.append(make('b', '', done + '/' + all.length));
    const lines = make('div');
    lines.append(make('strong', '', t(p(done + ' of ' + all.length + ' doses recorded', done + ' من ' + all.length + ' جرعة مسجّلة'))));
    if (late.length) lines.append(make('span', 'vx-alert', t(p(late.length + ' visit(s) look overdue — record the date if it was given, or check with your health centre.', late.length === 1 ? 'في زيارة وحدة فاتها موعدها — سجّلوا التاريخ إذا أخذها، أو راجعوا المركز الصحي.' : late.length + ' زيارات فاتها موعدها — سجّلوا التاريخ إذا أخذها، أو راجعوا المركز الصحي.'))));
    if (next) lines.append(make('span', 'vx-next', t(p('Next: ' + t(next.label) + ' · ' + fmt(iso(next.due)), 'الجاي: ' + t(next.label) + ' · ' + fmt(iso(next.due))))));
    else if (!late.length) lines.append(make('span', 'vx-next', t(p('All scheduled doses are recorded.', 'كل الجرعات المطلوبة مسجّلة.'))));
    summary.append(ring, lines); head.append(title, summary); box.append(head);

    const list = make('ol', 'vx-timeline');
    const statusText = { done: p('Done', 'تمّ'), due: p('Due now', 'مستحق الآن'), late: p('Overdue', 'متأخر'), upcoming: p('Upcoming', 'قادم') };
    for (const v of visitsPlan) {
      const li = make('li', 'vx-visit is-' + v.status);
      const top = make('div', 'vx-visit-top');
      const when = make('div'); when.append(make('strong', '', t(v.label)), make('small', '', v.school ? t(p('Given at school', 'بتنعطى بالمدرسة')) : fmt(iso(v.due))));
      top.append(make('span', 'vx-dot', v.status === 'done' ? '✓' : ''), when, make('span', 'vx-badge', t(statusText[v.status]) + (v.status !== 'done' && v.doneCount ? ' · ' + v.doneCount + '/' + v.doses.length : '')));
      const firstUpcoming = visitsPlan.find(x => x.status === 'upcoming');
      const open = v.status === 'late' || v.status === 'due' || v === firstUpcoming || openVisits.has(v.id);
      li.classList.toggle('is-open', open);
      top.setAttribute('role', 'button'); top.tabIndex = 0; top.setAttribute('aria-expanded', String(open));
      const toggle = () => { const now = !li.classList.contains('is-open'); li.classList.toggle('is-open', now); top.setAttribute('aria-expanded', String(now)); if (now) openVisits.add(v.id); else openVisits.delete(v.id); };
      top.addEventListener('click', toggle); top.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      li.append(top);
      const doses = make('ul', 'vx-doses');
      for (const d of v.doses) {
        const row = make('li', 'vx-dose' + (d.record ? ' is-done' : ''));
        const name = make('div', 'vx-dose-name'); name.append(make('span', '', t(d.name)));
        if (d.note) name.append(make('small', '', t(d.note)));
        if (d.record) name.append(make('small', 'vx-done-on', t(p('Given on ', 'انعطى بتاريخ ')) + fmt(d.record.date) + (d.record.provider ? ' · ' + d.record.provider : '')));
        const actions = make('div', 'vx-dose-actions');
        if (d.record) {
          const edit = make('button', 'vx-btn', t(p('Edit', 'تعديل'))); edit.type = 'button'; edit.onclick = () => openForm(row, c, d, v);
          const undo = make('button', 'vx-btn is-quiet', t(p('Remove', 'إلغاء'))); undo.type = 'button';
          undo.onclick = () => { try { window.RafiqHealthRecords.removed('vaccine', c.id, d.record.id, true); refresh(); } catch (e) { alert(e.message); } };
          actions.append(edit, undo);
        } else {
          const add = make('button', 'vx-btn is-primary', t(p('Record', 'سجّلوا'))); add.type = 'button'; add.onclick = () => openForm(row, c, d, v);
          actions.append(add);
        }
        row.append(name, actions); doses.append(row);
      }
      li.append(doses); list.append(li);
    }
    box.append(list);
    box.append(make('p', 'vx-source', t(p('Based on the Jordan Ministry of Health national immunization programme (PCV added 2025, chickenpox added 2026 for children born from 2025). Always confirm with the child’s vaccination card or health centre. Rafiq does not give medical advice.', 'حسب البرنامج الوطني للتطعيم – وزارة الصحة الأردنية (المكورات الرئوية من ٢٠٢٥، وجدري الماء من ٢٠٢٦ لمواليد ٢٠٢٥ وبعد). تأكدوا دايمًا من بطاقة التطعيم أو المركز الصحي. رفيق ما بيعطي نصيحة طبية.'))));
    const slot = document.querySelector('.hx-main'), overview = document.getElementById('healthOverview');
    if (slot) slot.prepend(box); else if (overview) overview.after(box); else host.prepend(box);
    window.RafiqHealthLayout?.run?.();
  }

  function openForm(row, c, d, v) {
    row.parentElement.querySelectorAll('.vx-form').forEach(f => f.remove());
    const form = make('form', 'vx-form'); form.noValidate = true;
    const today = iso(new Date()), suggested = d.record?.date || (iso(v.due) <= today ? iso(v.due) : today);
    const dateLabel = make('label', '', t(p('Date given', 'تاريخ المطعوم')));
    const date = make('input'); date.type = 'date'; date.required = true; date.value = suggested; date.min = c.dateOfBirth; date.max = today; dateLabel.append(date);
    const placeLabel = make('label', '', t(p('Where (optional)', 'وين (اختياري)')));
    const place = make('input'); place.type = 'text'; place.maxLength = 80; place.placeholder = t(p('e.g. health centre', 'مثلًا: المركز الصحي')); place.value = d.record?.provider || ''; placeLabel.append(place);
    const error = make('p', 'vx-error'); error.setAttribute('role', 'alert');
    const save = make('button', 'vx-btn is-primary', t(p('Save', 'حفظ'))); save.type = 'submit';
    const cancel = make('button', 'vx-btn is-quiet', t(p('Cancel', 'إلغاء'))); cancel.type = 'button'; cancel.onclick = () => form.remove();
    const btns = make('div', 'vx-form-actions'); btns.append(save, cancel);
    form.append(dateLabel, placeLabel, btns, error);
    form.onsubmit = e => {
      e.preventDefault();
      if (!date.value) { error.textContent = t(p('Choose the date.', 'اختاروا التاريخ.')); return; }
      try {
        window.RafiqHealthRecords.save('vaccine', c, { name: t(d.name), date: date.value, provider: place.value, note: t(v.label), scheduleKey: d.key }, { id: d.record?.id || null });
        refresh();
      } catch (err) { error.textContent = err.fields?.date ? t(p('The date must be after the birth date and not in the future.', 'التاريخ لازم يكون بعد الولادة ومش بالمستقبل.')) : (err.message || 'Error'); }
    };
    row.after(form); date.focus();
  }

  // Keep the page's own counts and history in sync after a change.
  function refresh() { try { sessionStorage.setItem('rafiqScrollToVaccines', '1'); } catch {} location.reload(); }

  const run = () => { try { render(); } catch { /* keep the page as it was */ } };
  const start = () => {
    run();
    try { if (sessionStorage.getItem('rafiqScrollToVaccines')) { sessionStorage.removeItem('rafiqScrollToVaccines'); setTimeout(() => document.getElementById('vaccineSchedule')?.scrollIntoView({ block: 'start' }), 300); } } catch {}
  };
  if (document.readyState === 'complete') start(); else window.addEventListener('load', () => setTimeout(start, 150));
  new MutationObserver(() => setTimeout(run, 100)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.RafiqJordanVaccines = { visits, plan };
})();

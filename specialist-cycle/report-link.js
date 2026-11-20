/* Report form: make the link to the family visible. Each recommendation line becomes a
   checklist item the family marks at home ("Did you try it at home?"), so we say so, show a
   live preview of what the parent will see, and offer ready-made practical lines by specialty. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const p = (en, a) => ({ en, a });
  const IDEAS = {
    speech: [p('Name what your child looks at, in short words, 5 times a day.', 'سمّوا ما ينظر إليه طفلكم بكلمات قصيرة، ٥ مرات يوميًا.'), p('Wait 5 seconds before helping, so your child can try to ask.', 'انتظروا ٥ ثوانٍ قبل المساعدة ليحاول طفلكم الطلب.'), p('Read one picture book together every evening.', 'اقرأوا كتاب صور واحدًا معًا كل مساء.')],
    development: [p('Tummy time for a minute or two, several times a day.', 'وقت على البطن لدقيقة أو دقيقتين، عدة مرات يوميًا.'), p('Talk and sing during nappy changes.', 'تحدّثوا وغنّوا أثناء تغيير الحفاض.'), p('Offer toys slightly out of reach to encourage reaching.', 'ضعوا الألعاب أبعد قليلًا لتشجيع الوصول إليها.')],
    psychology: [p('Give a 5-minute warning before changing activity.', 'نبّهوا قبل تغيير النشاط بخمس دقائق.'), p('Keep the same short bedtime routine every night.', 'حافظوا على روتين نوم قصير ثابت كل ليلة.'), p('Name the feeling calmly: “You are angry because…”.', 'سمّوا الشعور بهدوء: «أنت غاضب لأن…».')]
  };
  const specialty = () => { try { const me = sessionStorage.getItem('rafiqSpecialistId') || ''; return /speech/.test(me) ? 'speech' : /psych/.test(me) ? 'psychology' : 'development'; } catch { return 'development'; } };

  function render() {
    const ta = document.getElementById('reportRecommendations'); if (!ta) return;
    const group = ta.closest('.form-group'); if (!group) return;
    let box = document.getElementById('reportLinkBox');
    if (!box) { box = document.createElement('div'); box.id = 'reportLinkBox'; box.className = 'rl-box'; box.dataset.noTranslate = ''; group.after(box); ta.addEventListener('input', () => preview()); }
    box.replaceChildren();
    const note = document.createElement('p'); note.className = 'rl-note';
    note.textContent = x('Each line becomes a checklist item for the family: they mark “we tried it” or “I have a question”, and you see their answers before the next session.', 'كل سطر يصبح بندًا عند العائلة: تعلّم «جرّبناها» أو «عندي سؤال»، وترى إجاباتها قبل الجلسة التالية.');
    const chips = document.createElement('div'); chips.className = 'rl-chips';
    const t = document.createElement('span'); t.className = 'rl-chips-title'; t.textContent = x('Quick ideas:', 'أفكار جاهزة:'); chips.append(t);
    IDEAS[specialty()].forEach(i => { const b = document.createElement('button'); b.type = 'button'; b.className = 'rl-chip'; b.textContent = '+ ' + x(i.en, i.a); b.addEventListener('click', () => { const line = x(i.en, i.a); const v = ta.value.trim(); if (!v.split('\n').includes(line)) { ta.value = (v ? v + '\n' : '') + line; ta.dispatchEvent(new Event('input', { bubbles: true })); } ta.focus(); }); chips.append(b); });
    const prev = document.createElement('div'); prev.className = 'rl-preview'; prev.id = 'reportLinkPreview';
    box.append(note, chips, prev); preview();
  }
  function preview() {
    const ta = document.getElementById('reportRecommendations'), prev = document.getElementById('reportLinkPreview'); if (!ta || !prev) return;
    const lines = ta.value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 6);
    prev.replaceChildren();
    if (!lines.length) return;
    const h = document.createElement('p'); h.className = 'rl-prev-title'; h.textContent = x('What the family will see:', 'ما ستراه العائلة:');
    const ul = document.createElement('ul');
    lines.forEach(l => { const li = document.createElement('li'); li.append(document.createTextNode(l)); const s = document.createElement('span'); s.textContent = x('Tried it? ☐', 'جرّبوها؟ ☐'); li.append(s); ul.append(li); });
    prev.append(h, ul);
  }
  const run = () => { try { render(); } catch {} };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 80)); else setTimeout(run, 80);
  new MutationObserver(() => setTimeout(run, 120)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

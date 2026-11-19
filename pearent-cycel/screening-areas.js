/* "I have a concern" step 1 uses the same 11 support areas as the Support page.
   Each area maps to one of the existing question sets (topic) and to the right
   specialist; the first question gets an area-specific example. The chosen area is
   saved per child so the result and the Support page can link back to it.
   Open with ?area=<support-area-id> to preselect (e.g. from the Support page). */
(() => {
  'use strict';
  const p = (en, ar) => ({ en, ar });
  const AREAS = [
    { id: 'development', icon: '🌱', label: p('Growth & development', 'النمو والتطوّر'), desc: p('Sitting, walking, skills coming slowly', 'القعدة، المشي، مهارات جاية أبطأ'), topic: 'social', who: p('a child development specialist', 'مختص نمو أطفال'), hint: p('Think about a skill you expected by now — moving, playing or understanding.', 'فكّروا بمهارة كنتوا متوقعينها هلّق — حركة، لعب أو فهم.') },
    { id: 'speech', icon: '💬', label: p('Speech & language', 'النطق واللغة'), desc: p('Words, sounds, understanding', 'الكلمات، الأصوات، الفهم'), topic: 'communication', who: p('a speech and language specialist', 'مختص نطق ولغة') },
    { id: 'behaviour', icon: '⚡', label: p('Behaviour & attention', 'السلوك والانتباه'), desc: p('Tantrums, attention, waiting', 'نوبات الغضب، الانتباه، الانتظار'), topic: 'emotions', who: p('a child psychologist', 'أخصائي نفسي للأطفال') },
    { id: 'emotional', icon: '💛', label: p('Feelings & wellbeing', 'المشاعر والصحة النفسية'), desc: p('Worries, fears, separation', 'القلق، الخوف، الانفصال'), topic: 'emotions', who: p('a child psychologist', 'أخصائي نفسي للأطفال') },
    { id: 'learning', icon: '📚', label: p('Learning', 'التعلّم'), desc: p('Early learning, attention to tasks', 'التعلّم المبكر، التركيز بالمهام'), topic: 'social', who: p('a child development specialist', 'مختص نمو أطفال'), hint: p('Think about a recent moment of learning — a puzzle, a story, colours or counting.', 'فكّروا بلحظة تعلّم قريبة — بازل، قصة، ألوان أو عدّ.') },
    { id: 'sensory', icon: '✋', label: p('Senses', 'الاختلافات الحسّية'), desc: p('Noise, touch, textures, movement', 'الأصوات، اللمس، الملمس، الحركة'), topic: 'movement', who: p('an occupational therapist', 'أخصائي علاج وظيفي'), hint: p('Think about a strong reaction to noise, light, clothes, food textures or touch.', 'فكّروا بردة فعل قوية على صوت، ضو، ملابس، ملمس أكل أو لمس.') },
    { id: 'feeding', icon: '🥣', label: p('Feeding', 'التغذية'), desc: p('Picky eating, chewing, allergies', 'الانتقائية، المضغ، الحساسية'), topic: 'unsure', who: p('your paediatrician', 'طبيب الأطفال'), hint: p('Think about a recent meal — what was offered, what happened and how your child reacted.', 'فكّروا بوجبة قريبة — شو قدّمتوا، شو صار، وكيف كانت ردة فعله.') },
    { id: 'sleep', icon: '🌙', label: p('Sleep', 'النوم'), desc: p('Bedtime, night waking', 'وقت النوم، الصحيان بالليل'), topic: 'emotions', who: p('a family psychologist or your paediatrician', 'أخصائي نفسي للعيلة أو طبيب الأطفال'), hint: p('Think about last night or a recent bedtime — what happened and how long it lasted.', 'فكّروا بالليلة الماضية أو وقت نوم قريب — شو صار وقديش طوّل.') },
    { id: 'medical', icon: '🩺', label: p('Physical health', 'الصحة الجسدية والطبية'), desc: p('Hearing, vision, ongoing conditions', 'السمع، النظر، حالة مستمرة'), topic: 'unsure', who: p('your paediatrician', 'طبيب الأطفال'), hint: p('Think about what you noticed — for example responding to sounds, looking at things, or a health change.', 'فكّروا باللي لاحظتوه — مثلًا الرد على الأصوات، النظر للأشياء، أو تغيير صحي.') },
    { id: 'genetic', icon: '🧬', label: p('Genetic conditions', 'المتلازمات الوراثية'), desc: p('Down syndrome and other reported conditions', 'متلازمة داون وحالات مسجّلة ثانية'), topic: 'social', who: p('a child development specialist', 'مختص نمو أطفال'), hint: p('Think about a recent everyday moment you want to ask the specialist about.', 'فكّروا بموقف يومي قريب بدكم تسألوا المختص عنه.') },
    { id: 'everyday', icon: '🏡', label: p('Everyday life', 'التفاعل والحياة اليومية'), desc: p('Friends, nursery, toileting, independence', 'الأصحاب، الحضانة، الحمّام، الاستقلالية'), topic: 'social', who: p('a child development specialist', 'مختص نمو أطفال') }
  ];
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ar');
  const t = v => v[lang()];
  const childId = () => { try { return window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child') || ''; } catch { return ''; } };
  const key = () => 'rafiqConcernArea_' + childId();
  const getArea = () => { try { return AREAS.find(a => a.id === localStorage.getItem(key())) || null; } catch { return null; } };
  const setArea = id => { try { localStorage.setItem(key(), id); } catch {} };

  function choose(area) {
    setArea(area.id);
    const radio = document.querySelector('#topicChoices input[name="topic"][value="' + area.topic + '"]');
    if (radio && !radio.checked) radio.click();
    paint();
  }

  function paint() {
    const choices = document.getElementById('topicChoices');
    if (!choices || !choices.querySelector('input[name="topic"]')) return;
    document.body.classList.add('sx-on');
    let grid = document.getElementById('concernAreas');
    if (!grid) {
      grid = document.createElement('div'); grid.id = 'concernAreas'; grid.className = 'sx-areas'; grid.setAttribute('role', 'radiogroup'); grid.dataset.noTranslate = '';
      choices.after(grid);
    }
    const current = getArea();
    const checkedTopic = choices.querySelector('input[name="topic"]:checked')?.value;
    grid.setAttribute('aria-label', lang() === 'ar' ? 'شو المجال اللي شاغل بالكم؟' : 'Which area is on your mind?');
    grid.replaceChildren(...AREAS.map(a => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'sx-area'; b.setAttribute('role', 'radio');
      const on = current?.id === a.id && checkedTopic === a.topic;
      b.setAttribute('aria-checked', String(on)); b.tabIndex = on || (!current && a.id === 'development') ? 0 : -1;
      const icon = document.createElement('span'); icon.className = 'sx-ic'; icon.textContent = a.icon; icon.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span'); text.className = 'sx-text';
      const strong = document.createElement('strong'); strong.textContent = t(a.label);
      const small = document.createElement('small'); small.textContent = t(a.desc);
      text.append(strong, small); b.append(icon, text);
      b.addEventListener('click', () => choose(a));
      b.addEventListener('keydown', e => { const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']; if (!keys.includes(e.key)) return; e.preventDefault(); const list = [...grid.children]; let i = list.indexOf(b); const fwd = (e.key === 'ArrowDown') || (e.key === 'ArrowLeft' && lang() === 'ar') || (e.key === 'ArrowRight' && lang() === 'en'); i = (i + (fwd ? 1 : list.length - 1)) % list.length; list[i].focus(); list[i].click(); });
      return b;
    }));
  }

  // Questions: show the area name and an area-specific example on the first question.
  function questionText() {
    const area = getArea(); if (!area) return;
    const count = document.getElementById('questionCount');
    if (count) { const rest = count.textContent.split(' · ').slice(1).join(' · '); const next = t(area.label) + (rest ? ' · ' + rest : ''); if (count.textContent !== next) { count.dataset.noTranslate = ''; count.textContent = next; } }
    const help = document.getElementById('concernQuestionHelp');
    const first = /(^|\D)1(\D|$)|١/.test((count?.textContent || '').split(' · ')[1] || '');
    if (help && area.hint && first && help.dataset.sxArea !== area.id) { help.dataset.sxArea = area.id; help.dataset.noTranslate = ''; help.textContent = t(area.hint) + (lang() === 'ar' ? ' احكوا باختصار بكلماتكم — هاد مش اختبار.' : ' Describe it briefly in your own words — this is not a test.'); }
  }

  function preselect() {
    const want = new URLSearchParams(location.search).get('area');
    const area = AREAS.find(a => a.id === want);
    if (!area) return;
    choose(area);
    // Opened from an area link: start at step 1 even if an earlier concern is saved.
    const g = id => document.getElementById(id);
    if (g('topicView') && g('topicView').hidden) {
      [['topicView', 'stepConcern'], ['questionView', 'stepQuestions'], ['summaryView', 'stepSummary']].forEach(([id, step]) => { if (g(id)) g(id).hidden = id !== 'topicView'; g(step)?.removeAttribute('aria-current'); });
      g('stepConcern')?.setAttribute('aria-current', 'step');
    }
    setTimeout(() => document.querySelector('.sx-area[aria-checked="true"]')?.scrollIntoView({ block: 'center' }), 150);
  }

  window.RafiqConcernAreas = { list: AREAS, current: getArea };
  const start = () => {
    paint(); preselect();
    const choices = document.getElementById('topicChoices');
    if (choices) new MutationObserver(() => setTimeout(paint, 0)).observe(choices, { childList: true });
    const count = document.getElementById('questionCount');
    if (count) new MutationObserver(() => setTimeout(questionText, 0)).observe(count, { childList: true, characterData: true, subtree: true });
    questionText();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 0)); else setTimeout(start, 0);
  window.addEventListener('load', () => setTimeout(() => { paint(); questionText(); }, 200));
  new MutationObserver(() => setTimeout(() => { paint(); const h = document.getElementById('concernQuestionHelp'); if (h) delete h.dataset.sxArea; questionText(); }, 80)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

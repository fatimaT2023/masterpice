/* =========================================================================
   RAFIQ landing page: behaviour
   Vanilla JS. Sections below mirror the page order. All content that is
   likely to change (copy, mock data, routes) lives in the DATA block.
   ========================================================================= */
(() => {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  root.classList.add('js');
  let userScrolled = false;

  /* =======================================================================
     DATA (edit here)
     ======================================================================= */

  // Journey steps. `tag` is the story stage that lights up on the path.
  const STEPS = [
    { tag: 'Concern', title: 'Add Your Child', icon: 'user', text: 'Create a child profile with age and basic information.', mini: ['Name', 'Age', 'Language'] },
    { tag: 'Development', title: 'Understand Development', icon: 'trend', text: 'See age-appropriate milestones and development areas.', mini: ['Physical', 'Communication', 'Social'] },
    { tag: 'AI', title: 'Ask Rafiq AI', icon: 'chat', text: 'Ask everyday parenting questions and receive personalized guidance.', mini: ['Arabic & English', 'Suggested next steps'] },
    { tag: 'Screening', title: 'Screen Early Concerns', icon: 'file', text: 'Complete age-appropriate screening tools when relevant.', mini: ['Not a diagnosis', 'Clear result levels'] },
    { tag: 'Guidance', title: 'Understand Challenges', icon: 'book', text: 'Get practical guidance for behavioral, emotional, developmental and school-related challenges.', mini: ['What to do', 'What to avoid', 'When to seek help'] },
    { tag: 'Specialist', title: 'Connect With a Specialist', icon: 'search', text: 'Find a suitable verified specialist.', mini: ['Verified', 'Online or in-person'] },
    { tag: 'Booking & follow-up', title: 'Book & Follow Up', icon: 'calendar', text: 'Book a session and keep consultation reports in one place.', mini: ['Choose a time', 'Reports saved'] }
  ];

  const PROFILES = [
    { name: 'Layan', age: '2 years', initials: 'L', cls: 'a1', stage: 'Toddler', focus: ['Speech', 'Sleep', 'Feeding'], next: 'Speech screening in 3 days' },
    { name: 'Omar', age: '8 years', initials: 'O', cls: 'a3', stage: 'School age', focus: ['Attention', 'Screen time', 'School'], next: 'Annual checkup on Nov 14' },
    { name: 'Adam', age: '15 years', initials: 'A', cls: 'a2', stage: 'Teenager', focus: ['Communication', 'Academic pressure'], next: 'Daily check-in is ready' }
  ];

  // [achieved, not yet, concern] per area. Example for a 2-year-old.
  const DEV = [
    ['Physical', 6, 1, 0], ['Communication', 3, 3, 1], ['Cognitive', 5, 2, 0],
    ['Social', 4, 2, 0], ['Emotional', 4, 1, 0], ['Behavioral', 3, 2, 1]
  ];

  const SCREEN = [
    ['Autism-related concerns', 'Low Concern', 'ok'],
    ['Speech and language', 'Professional Evaluation Recommended', 'crit-p'],
    ['Developmental delay', 'Monitor', 'warn-p'],
    ['Attention', 'Low Concern', 'ok'],
    ['Social communication', 'Monitor', 'warn-p'],
    ['Behavioral concerns', 'Low Concern', 'ok']
  ];

  const HEALTH = [
    { t: 'Checkup completed', s: 'Sep 02 · Growth on track', c: 'done' },
    { t: 'Vaccination schedule', s: '4 of 5 recorded', c: 'done' },
    { t: 'Next vaccine due', s: 'Nov 14 · Reminder set', c: 'next' },
    { t: 'Health note', s: 'Mild cold last week, recovered', c: '' }
  ];

  // Challenge preview: n = name, w = what is happening, r = reasons, d = what parents can do, a = what to avoid, h = when to seek help
  const CH = {
    '0–3': [
      { n: 'Speech delay', w: 'Your child uses fewer words or gestures than other children of the same age.', r: 'Children learn at different speeds. Hearing, daily language exposure and overall development can all play a part.', d: 'Talk, read and sing together every day. Name what you see and respond to every sound or gesture.', a: 'Pressuring your child to repeat words, or comparing them with other children.', h: 'Ask your pediatrician if your child is not using words or gestures as expected, or seems to lose skills they had.' },
      { n: 'Sleep', w: 'Bedtime takes long, nights are broken, or naps are short.', r: 'Routine changes, teething, separation worries and being overtired often disturb sleep.', d: 'Keep a short, calm bedtime routine and similar sleep times each day.', a: 'Changing the routine every night or using screens close to bedtime.', h: 'Talk to a doctor if sleep problems are severe, last for weeks, or come with loud snoring or pauses in breathing.' },
      { n: 'Feeding', w: 'Your child refuses foods, eats very little or turns mealtimes into a struggle.', r: 'Appetite shifts with growth. New textures, tiredness and a wish for control are common reasons.', d: 'Offer small portions at regular times and keep offering new foods without fuss. Eat together when you can.', a: 'Forcing bites, bribing with sweets or making mealtimes tense.', h: 'Ask a doctor if your child is losing weight, gags often, or eats a very narrow range of foods.' },
      { n: 'Separation anxiety', w: 'Your child cries or clings when you leave, even briefly.', r: 'It is a common stage while children learn that you will come back. New places and changes can bring it back.', d: 'Say a short, warm goodbye, keep drop-offs predictable and return when you said you would.', a: 'Sneaking away or long, emotional goodbyes.', h: 'Speak with a professional if distress is intense, lasts for months or stops normal daily activities.' }
    ],
    '4–6': [
      { n: 'Tantrums', w: 'Your child has loud, intense outbursts when upset, tired or told no.', r: 'Young children feel big emotions before they have the words and skills to manage them.', d: 'Stay calm, keep them safe, name the feeling and talk once they settle. Praise the calm moments.', a: 'Giving in to stop the noise, or shouting back.', h: 'Ask for advice if tantrums are very frequent, last a long time, or include harming themselves or others.' },
      { n: 'Aggression', w: 'Your child hits, bites or pushes other children or family members.', r: 'Frustration, limited words and still-developing self-control are common causes.', d: 'Step in early, state the rule simply and show what to do instead. Notice and praise gentle behavior.', a: 'Hitting back, public shaming or long lectures.', h: 'Speak with a professional if aggression is frequent, hard to redirect or affects school and friendships.' },
      { n: 'Kindergarten adaptation', w: 'Your child finds it hard to settle into the new routine, teachers or classroom.', r: 'New rules, new people and long days take energy. Adjustment can take weeks.', d: 'Visit before the first day, keep morning routines calm and ask the teacher how the day went.', a: 'Showing your own worry at drop-off or promising things you cannot keep.', h: 'Talk to the teacher and your pediatrician if distress does not ease after several weeks.' },
      { n: 'Social skills', w: 'Your child struggles to share, take turns or join other children in play.', r: 'Social skills grow with practice. Shyness, temperament and limited chances to play can all matter.', d: 'Arrange short play dates, practice turn-taking at home and model kind words.', a: 'Forcing hugs or labeling your child as shy in front of others.', h: 'Ask a professional if your child rarely engages with others or has trouble understanding social cues.' }
    ],
    '7–12': [
      { n: 'Bullying', w: 'Your child is being teased, excluded, threatened or hurt by other children, in person or online.', r: 'Bullying is about power, not about something wrong with your child. It often goes unreported.', d: 'Listen without judgment, keep records, tell the school and help your child plan how to respond.', a: 'Telling them to ignore it, or confronting the other child or parents on your own.', h: 'Get support quickly if your child is afraid to go to school, is hurt, or shows deep changes in mood.' },
      { n: 'Learning difficulties', w: 'Reading, writing or math are much harder than expected for your child.', r: 'Learning differences, attention, vision or hearing, and stress can all affect schoolwork.', d: 'Talk with the teacher, break tasks into small steps and celebrate effort, not only grades.', a: 'Calling your child lazy or adding hours of extra work.', h: 'Ask for an assessment if difficulties persist despite effort and support.' },
      { n: 'Attention', w: 'Your child has trouble focusing, finishing tasks or staying organized.', r: 'Tiredness, stress, boredom and differences in attention can look similar.', d: 'Use short tasks, clear routines, quiet study spaces and regular breaks.', a: 'Constant criticism, or assuming a cause without an evaluation.', h: 'See a professional if difficulties are lasting and affect school, home and friendships.' },
      { n: 'Screen time', w: 'Screens take up much of your child\'s day and stopping causes conflict.', r: 'Games and videos are designed to hold attention, and screens fill free time quickly.', d: 'Agree on family rules together, give warnings before ending and offer enjoyable alternatives.', a: 'Sudden bans, using screens as the only reward, or ignoring what they watch.', h: 'Seek advice if screens replace sleep, school or friends, or your child becomes very distressed without them.' }
    ],
    '13–18': [
      { n: 'Academic pressure', w: 'Your teenager feels overwhelmed by exams, grades and expectations.', r: 'Expectations from school, family and peers can pile up, especially around exams.', d: 'Ask how they feel, set realistic goals together and protect sleep, meals and downtime.', a: 'Comparing them with others or tying your love to results.', h: 'Reach out to a professional if stress affects sleep, appetite or mood for weeks.' },
      { n: 'Social media', w: 'Your teenager spends long hours online and seems affected by what they see.', r: 'Social media shapes friendships and self-image, and comparison is easy.', d: 'Talk about what they follow, agree on limits together and keep phones out of the bedroom at night.', a: 'Secret monitoring or mocking their online world.', h: 'Get support if you notice cyberbullying, secrecy with real risk, or a sharp drop in mood.' },
      { n: 'Emotional changes', w: 'Your teenager has strong mood swings, withdraws or reacts more intensely.', r: 'Hormones, growing independence and social stress all play a part during these years.', d: 'Stay available, listen first and keep routines steady. Respect privacy while staying connected.', a: 'Dismissing feelings as a phase or forcing them to talk.', h: 'Seek help promptly if low mood persists, they stop enjoying things, or you worry about their safety.' },
      { n: 'Communication', w: 'Conversations turn into arguments or short answers.', r: 'Teenagers are building independence and may feel judged or unheard.', d: 'Pick relaxed moments, ask open questions and listen without fixing right away.', a: 'Lecturing, interrupting or bringing up old mistakes.', h: 'Consider family support if communication has broken down for a long time.' },
      { n: 'Peer pressure', w: 'Your teenager feels pushed to act in ways that go against their values.', r: 'Belonging matters a lot at this age, and friends have strong influence.', d: 'Talk through situations in advance and agree on an easy way to leave. Welcome their friends.', a: 'Criticizing their friends or setting rules without explanation.', h: 'Seek support if peer pressure involves substances, risky behavior or threats.' }
    ]
  };

  const AGES = [
    { key: '0–3', s: .55, stage: 'Babies and toddlers', line: 'Early years move fast. Rafiq helps you notice and support every new skill.', concerns: ['Development', 'Speech', 'Sleep', 'Feeding', 'Early communication'] },
    { key: '4–6', s: .7, stage: 'Preschool years', line: 'Big feelings and first friendships take center stage.', concerns: ['Behavior', 'Tantrums', 'Language', 'Social skills', 'Kindergarten'] },
    { key: '7–12', s: .85, stage: 'School age', line: 'School life brings new pressures and new independence.', concerns: ['School', 'Bullying', 'Learning', 'Attention', 'Screen time'] },
    { key: '13–18', s: 1, stage: 'Teenage years', line: 'Teens need space and support at the same time.', concerns: ['Mental wellbeing', 'Social media', 'Academic pressure', 'Communication', 'Peer pressure'] }
  ];

  // Sample specialist profiles for the mock search (not real people)
  const SPECIALISTS = [
    { id: 'lina-haddad', name: 'Dr. Lina Haddad', ini: 'LH', cls: 'a1', spec: 'Pediatrician', key: 'pediatrician', exp: 12, rating: 4.9, modes: ['online', 'in-person'], ages: ['0-3', '4-6', '7-12'], next: 'Today, 4:30 PM', avail: 'today', price: 'mid' },
    { id: 'rana-khoury', name: 'Rana Khoury', ini: 'RK', cls: 'a2', spec: 'Speech & Language Specialist', key: 'speech', exp: 8, rating: 4.8, modes: ['online'], ages: ['0-3', '4-6'], next: 'Tomorrow, 10:00 AM', avail: 'week', price: 'low' },
    { id: 'omar-nasser', name: 'Dr. Omar Nasser', ini: 'ON', cls: 'a3', spec: 'Child Psychologist', key: 'psychologist', exp: 15, rating: 4.9, modes: ['in-person', 'online'], ages: ['7-12', '13-18'], next: 'Thu, 1:15 PM', avail: 'week', price: 'high' },
    { id: 'sara-mansour', name: 'Sara Mansour', ini: 'SM', cls: 'a4', spec: 'Learning Difficulty Specialist', key: 'learning', exp: 9, rating: 4.7, modes: ['in-person'], ages: ['7-12'], next: 'Sun, 9:00 AM', avail: 'week', price: 'mid' },
    { id: 'yara-salim', name: 'Dr. Yara Salim', ini: 'YS', cls: 'a2', spec: 'Child Development Specialist', key: 'development', exp: 11, rating: 4.8, modes: ['online', 'in-person'], ages: ['0-3', '4-6'], next: 'Today, 6:00 PM', avail: 'today', price: 'mid' },
    { id: 'khaled-barakat', name: 'Khaled Barakat', ini: 'KB', cls: 'a1', spec: 'Behavioral Specialist', key: 'behavioral', exp: 7, rating: 4.6, modes: ['online'], ages: ['4-6', '7-12', '13-18'], next: 'Wed, 5:30 PM', avail: 'week', price: 'low' }
  ];
  const PRICE = { low: '$', mid: '$$', high: '$$$' };

  const FAQ = [
    ['What ages does Rafiq support?', 'Rafiq is designed for children from birth to age 18. Guidance is grouped into four stages: 0–3, 4–6, 7–12 and 13–18.'],
    ['Does the AI diagnose my child?', 'No. Rafiq gives educational and supportive guidance. It does not diagnose conditions and does not replace a doctor, psychologist or other specialist.'],
    ['What happens if the AI detects an emergency?', 'If a conversation contains possible red flags, such as difficulty breathing, Rafiq pauses its normal answers and tells you to seek urgent medical attention. In an emergency, contact your local emergency services.'],
    ['Can I add more than one child?', 'Yes. One parent account can hold several child profiles, and you can switch between them. Guidance and tracking follow the child you select.'],
    ['Can I book a specialist?', 'Yes. Search by specialty, age group, availability and session type, view a profile, choose a date and time, and confirm your booking.'],
    ['Are specialists verified?', 'Specialists apply to join and are reviewed and approved by Rafiq admins before they can accept bookings. Verification is shown on their profile.'],
    ['Does Rafiq support Arabic?', 'Yes. Rafiq is built for Arabic and English, including the AI assistant.'],
    ['Is early screening a diagnosis?', 'No. Screening shows whether a concern may deserve attention and suggests a level: Low Concern, Monitor, or Professional Evaluation Recommended. Only a qualified professional can diagnose.'],
    ['Can I manage my child\'s vaccinations?', 'Yes. Keep a vaccination schedule, growth measurements, checkups, health notes and reminders for each child in one place. Always follow your pediatrician\'s advice for your child\'s schedule.'],
    ['Is Rafiq free?', 'There is a free parent plan with a child profile, basic milestones, limited AI guidance and basic parenting content. Premium and specialist plans add more. This version is a preview, so no payments are processed.']
  ];

  const HERO_CHILD = {
    Layan: { line: 'Layan · 2 years', pct: 64, tip: 'Narrate your day in short sentences. Hearing words in context helps toddlers learn them.' },
    Omar: { line: 'Omar · 8 years', pct: 72, tip: 'Name a feeling out loud. "You look frustrated" gives children the words to tell you.' },
    Adam: { line: 'Adam · 15 years', pct: 58, tip: 'Ask one open question and listen without fixing. Teens talk when the pressure drops.' }
  };

  // Arabic strings for the key page headings and calls to action.
  // Elements opt in with data-i18n="key". Anything not listed stays in English.
  const AR = {
    'nav.home': 'الرئيسية', 'nav.features': 'المزايا', 'nav.how': 'كيف يعمل', 'nav.parents': 'للأهل',
    'nav.specialists': 'للمختصين', 'nav.safety': 'الأمان', 'nav.faq': 'الأسئلة الشائعة',
    'nav.login': 'تسجيل الدخول', 'nav.start': 'ابدأ الآن',
    'hero.l1': 'الأبوّة تأتي مع الكثير من الأسئلة.',
    'hero.l2': 'ورفيق يساعدك على إيجاد الخطوة التالية.',
    'hero.sub': 'افهم طفلك، وتابع نموّه، واحصل على إرشاد ذكي مخصّص، وافحص المخاوف المبكرة، وتواصل مع مختصين موثّقين — كل ذلك في مكان واحد.',
    'hero.cta1': 'ابدأ مجاناً', 'hero.cta2': 'اكتشف كيف يعمل',
    'hero.trust': 'مصمّم لأهالي الأطفال من الولادة حتى عمر 18 سنة.',
    'problem.title': 'كل عمر يحمل أسئلة جديدة.',
    'problem.end': 'لا يجب أن تبحث في كل مكان عن الإجابات.',
    'journey.title': 'من أول سؤال إلى المتابعة.',
    'features.title': 'كل ما يحتاجه الأهل في منصة واحدة',
    'age.title': 'رفيق يكبر مع طفلك',
    'parents.title': 'مكان هادئ لكل ما يخص طفلك.',
    'spec.title': 'دعم مهني عندما يحتاج الأهل إلى أكثر من الإرشاد.',
    'booking.title': 'كيف يعمل الحجز',
    'trust.title': 'بُني والأمان في مركزه.',
    'users.title': 'منصة واحدة، ثلاثة أدوار',
    'plans.title': 'خطط بسيطة',
    'faq.title': 'أسئلة يطرحها الأهل',
    'cta.h': 'لست مضطراً لتدبّر الأبوّة وحدك.',
    'cta.sub': 'تابع، وافهم، واسأل، وتواصل — ورفيق بجانبك في كل مرحلة.',
    'cta.b1': 'ابدأ كوالد أو والدة', 'cta.b2': 'انضم كمختص',
    'foot.tag': 'رفيقك في الأبوّة ونموّ الطفل.',
    'foot.platform': 'المنصة', 'foot.parents': 'للأهل', 'foot.spec': 'للمختصين', 'foot.legal': 'القانونية',
    'foot.disc': 'تقدّم رفيق معلومات تعليمية وداعمة ولا تُغني عن المشورة الطبية المهنية أو التشخيص أو خدمات الطوارئ.'
  };

  /* =======================================================================
     ROUTES, SCROLL ACTIONS AND TOAST
     Every button is either a scroll action (data-scroll) or a route
     placeholder (data-route). Swap the placeholder handler for real
     navigation (router.push) when the app pages exist.
     ======================================================================= */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  document.addEventListener('click', (e) => {
    // const r = e.target.closest('[data-route]');
    // if (r) {
    //   e.preventDefault();
    //   const path = r.getAttribute('data-route') || r.getAttribute('href');
    //   toast('Route placeholder: ' + path);
    //   closeMenu();
    //   return;
    // }
    const s = e.target.closest('[data-scroll]');
    if (s) {
      e.preventDefault();
      scrollToId(s.getAttribute('data-scroll'));
      closeMenu();
    }
  });

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger'), menu = $('#mobileMenu'), burgerUse = $('#burgerIcon use');
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    burgerUse.setAttribute('href', '#i-menu');
  }
  burger.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    burgerUse.setAttribute('href', open ? '#i-x' : '#i-menu');
    if (open) $('.nav').classList.add('scrolled');
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 1120) closeMenu(); });

  /* ---------- Language toggle (EN | العربية) ---------- */
  function setLang(lang) {
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const key = el.dataset.i18n;
      el.innerHTML = lang === 'ar' && AR[key] ? AR[key] : el.dataset.en;
    });
    $$('[data-lang]').forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    try { localStorage.setItem('rafiq-lang', lang); } catch (e) { /* storage may be blocked */ }
    requestAnimationFrame(() => { placeAgeIndicator(); });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b) setLang(b.dataset.lang);
  });

  /* =======================================================================
     SCROLL EFFECTS: navbar, progress bar, parallax, scroll-driven stages
     ======================================================================= */
  const nav = $('#nav'), bar = $('#progressBar');
  const parallaxEls = $$('[data-speed]');
  const problem = $('#problem'), journey = $('#how-it-works');
  let ticking = false;

  function stickyTop(el) { return parseFloat(getComputedStyle(el).top) || 68; }

  function updateProblem() {
    if (!problem.classList.contains('live')) return;
    const stage = $('.problem-stage', problem);
    const total = problem.offsetHeight - stage.offsetHeight;
    const p = clamp((stickyTop(stage) - problem.getBoundingClientRect().top) / total);
    const items = problemItems;
    const n = Math.min(items.length, Math.floor(p * (items.length + 1)) + 1);
    items.forEach((el, i) => el.classList.toggle('show', i < n));
  }
  const problemItems = [...$$('.q', problem), $('.q-end', problem), $('.q-rafiq', problem)];

  function onScroll() {
    userScrolled = true;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  function update() {
    ticking = false;
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 12);
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max) : 0).toFixed(4) + ')';
    if (!reduced && innerWidth > 760) {
      parallaxEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const d = r.top + r.height / 2 - innerHeight / 2;
        el.style.transform = 'translate3d(0,' + (-d * parseFloat(el.dataset.speed)).toFixed(1) + 'px,0)';
      });
    }
    updateProblem();
    updateJourney();
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* Highlight the nav link for the section in view */
  const navLinks = $$('.nav-links a[data-sec]');
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('active', a.dataset.sec === en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => { const s = document.getElementById(a.dataset.sec); if (s) secIO.observe(s); });

  /* ---------- Magnetic CTA buttons (pointer devices only) ---------- */
  if (!reduced && matchMedia('(hover: hover)').matches) {
    $$('[data-magnetic]').forEach((b) => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.16;
        const y = (e.clientY - r.top - r.height / 2) * 0.26;
        b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  /* =======================================================================
     REVEAL ON SCROLL
     Elements already in view stay visible. Below-the-fold ones start hidden
     and ease in when reached.
     ======================================================================= */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.remove('pre');
      en.target.classList.add('in');
      revealIO.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  $$('[data-stagger]').forEach((p) => {
    [...p.children].forEach((c, i) => { c.classList.add('reveal'); c.style.setProperty('--rd', i * 80 + 'ms'); });
  });
  function armReveal(el) {
    if (reduced) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.92) { el.classList.add('in'); return; }
    el.classList.add('pre');
    revealIO.observe(el);
  }

  /* ---------- Count-up numbers and progress rings ---------- */
  const counters = $$('[data-count]');
  const fmt = (el, v) => {
    const d = +el.dataset.decimals || 0;
    el.textContent = (el.dataset.prefix || '') + v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) + (el.dataset.suffix || '');
  };
  function runCount(el) {
    if (el._done) return;
    el._done = true;
    const to = +el.dataset.count;
    if (reduced) { fmt(el, to); return; }
    const t0 = performance.now(), dur = 1500;
    const step = (t) => {
      const k = clamp((t - t0) / dur);
      fmt(el, to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      runCount(en.target);
      countIO.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => {
    if (reduced || el.getBoundingClientRect().top < innerHeight * 0.9) { runCount(el); return; }
    fmt(el, 0);
    countIO.observe(el);
  });

  const rings = $$('[data-ring]');
  const ringIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.style.strokeDashoffset = 100 - +en.target.dataset.ring;
      ringIO.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  rings.forEach((r) => {
    if (reduced) { r.style.strokeDashoffset = 100 - +r.dataset.ring; return; }
    ringIO.observe(r);
  });

  /* =======================================================================
     HERO: child selector in the dashboard preview
     ======================================================================= */
  const heroPct = $('#heroPct'), heroRing = $('#heroRing'), heroLine = $('#heroChildLine'), heroTip = $('#heroTip');
  let heroVal = 0;
  function tween(from, to, cb) {
    if (reduced) { cb(to); return; }
    const t0 = performance.now(), dur = 700;
    const step = (t) => { const k = clamp((t - t0) / dur); cb(Math.round(lerp(from, to, 1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function setHeroChild(name) {
    const d = HERO_CHILD[name];
    $$('[data-hero-child]').forEach((b) => {
      const on = b.dataset.heroChild === name;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
    });
    heroLine.textContent = d.line;
    heroTip.textContent = d.tip;
    heroRing.style.strokeDashoffset = 100 - d.pct;
    tween(heroVal, d.pct, (v) => { heroPct.textContent = v; });
    heroVal = d.pct;
  }
  $$('[data-hero-child]').forEach((b) => b.addEventListener('click', () => setHeroChild(b.dataset.heroChild)));
  heroVal = 0; heroPct.textContent = '0';
  setTimeout(() => setHeroChild('Omar'), reduced ? 0 : 700);

  /* =======================================================================
     JOURNEY: sticky storytelling with a drawn path
     ======================================================================= */
  const N = STEPS.length;
  const jcard = $('#jcard'), jdots = $('#jdots'), jlist = $('#jlist');
  const miniHtml = (s) => s.mini.map((m) => '<span>' + m + '</span>').join('');

  // Static list (phones, tablets, reduced motion)
  jlist.innerHTML = STEPS.map((s, i) =>
    '<li class="jitem reveal" data-n="' + (i + 1) + '"><span class="j-tag">' + s.tag + '</span><h3>' + s.title + '</h3><p>' + s.text + '</p><div class="j-mini">' + miniHtml(s) + '</div></li>').join('');
  const onIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('on'); onIO.unobserve(en.target); } });
  }, { threshold: 0.55 });
  $$('.jitem', jlist).forEach((el) => { armReveal(el); onIO.observe(el); });

  // Sticky stage: dots
  jdots.innerHTML = STEPS.map((s, i) => '<button type="button" class="jdot-b" data-k="' + i + '" aria-label="Step ' + (i + 1) + ': ' + s.title + '"></button>').join('');
  const dotBtns = $$('.jdot-b', jdots);

  // Path geometry
  const PTS = [[110, 48], [410, 122], [110, 208], [410, 292], [110, 378], [410, 462], [260, 566]];
  const JN = { ready: false, fr: [], len: 0, lit: -1, cur: -1 };
  const r1 = (n) => Math.round(n * 10) / 10;

  function buildPath() {
    if (JN.ready) return;
    const base = $('#jbase'), prog = $('#jprog'), nodes = $('#jnodes');
    let d = 'M' + PTS[0].join(' ');
    const segs = [];
    for (let i = 0; i < PTS.length - 1; i++) {
      const p0 = PTS[i - 1] || PTS[i], p1 = PTS[i], p2 = PTS[i + 1], p3 = PTS[i + 2] || p2;
      const c1 = [r1(p1[0] + (p2[0] - p0[0]) / 6), r1(p1[1] + (p2[1] - p0[1]) / 6)];
      const c2 = [r1(p2[0] - (p3[0] - p1[0]) / 6), r1(p2[1] - (p3[1] - p1[1]) / 6)];
      const seg = 'C' + c1.join(' ') + ' ' + c2.join(' ') + ' ' + p2.join(' ');
      d += seg;
      segs.push('M' + p1.join(' ') + seg);
    }
    base.setAttribute('d', d);
    prog.setAttribute('d', d);
    try {
      const NS = 'http://www.w3.org/2000/svg';
      const lens = segs.map((sd) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', sd); return p.getTotalLength(); });
      const total = lens.reduce((a, b) => a + b, 0);
      let acc = 0;
      JN.fr = [0].concat(lens.map((l) => { acc += l; return acc / total; }));
      JN.len = prog.getTotalLength();
    } catch (e) { return; }
    prog.style.strokeDasharray = JN.len;
    prog.style.strokeDashoffset = JN.len;
    nodes.innerHTML = PTS.map((pt, i) => {
      const left = pt[0] < 200 || i === PTS.length - 1;
      const x = left ? 28 : -28, anchor = left ? 'start' : 'end';
      return '<g class="jn" data-i="' + i + '" transform="translate(' + pt[0] + ' ' + pt[1] + ')">' +
        '<circle class="jn-c" r="16"/><text class="jn-num">' + (i + 1) + '</text>' +
        '<text class="jn-title" x="' + x + '" y="-2" text-anchor="' + anchor + '">' + STEPS[i].title + '</text>' +
        '<text class="jn-tag" x="' + x + '" y="15" text-anchor="' + anchor + '">' + STEPS[i].tag + '</text></g>';
    }).join('');
    JN.nodes = $$('.jn', nodes);
    JN.ready = true;
  }

  function renderCard(i) {
    const s = STEPS[i];
    jcard.innerHTML = '<div class="jc-top"><span class="jc-ic"><svg class="i"><use href="#i-' + s.icon + '"/></svg></span><span class="jc-n">Step ' + (i + 1) + ' of ' + N + '</span></div>' +
      '<h3>' + s.title + '</h3><p>' + s.text + '</p><div class="j-mini">' + miniHtml(s) + '</div>';
    if (!reduced) { jcard.classList.remove('swap'); void jcard.offsetWidth; jcard.classList.add('swap'); }
  }
  renderCard(0);

  function updateJourney() {
    if (!journey.classList.contains('live') || !JN.ready) return;
    const stage = $('.jstage', journey);
    const total = journey.offsetHeight - stage.offsetHeight;
    const p = clamp((stickyTop(stage) - journey.getBoundingClientRect().top) / total);
    const t = p * (N - 1);
    const i0 = Math.floor(t), i1 = Math.min(N - 1, i0 + 1), f = t - i0;
    const draw = lerp(JN.fr[i0], JN.fr[i1], f);
    const prog = $('#jprog');
    prog.style.strokeDashoffset = JN.len * (1 - draw);
    const pt = prog.getPointAtLength(JN.len * draw);
    const dot = $('#jdot');
    dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    const lit = Math.floor(t + 0.02), cur = Math.round(t);
    if (lit !== JN.lit) {
      JN.nodes.forEach((n, k) => n.classList.toggle('lit', k <= lit));
      dotBtns.forEach((b, k) => b.classList.toggle('lit', k <= lit));
      JN.lit = lit;
    }
    if (cur !== JN.cur) {
      JN.nodes.forEach((n, k) => n.classList.toggle('cur', k === cur));
      dotBtns.forEach((b, k) => b.classList.toggle('cur', k === cur));
      renderCard(cur);
      JN.cur = cur;
    }
  }
  jdots.addEventListener('click', (e) => {
    const b = e.target.closest('.jdot-b');
    if (!b || !journey.classList.contains('live')) return;
    const stage = $('.jstage', journey);
    const total = journey.offsetHeight - stage.offsetHeight;
    const abs = journey.getBoundingClientRect().top + scrollY;
    const target = abs - stickyTop(stage) + (+b.dataset.k / (N - 1)) * total + 1;
    scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* Switch between sticky "live" stages and the simple stacked layout */
  const mqSmall = matchMedia('(max-width: 900px)');
  function applyModes() {
    const live = !mqSmall.matches && !reduced;
    problem.classList.toggle('live', live);
    journey.classList.toggle('live', live);
    if (live) { buildPath(); JN.lit = -1; JN.cur = -1; }
    update();
  }
  mqSmall.addEventListener('change', applyModes);

  /* =======================================================================
     FEATURE WIDGETS
     ======================================================================= */

  /* ---------- Child profiles ---------- */
  const profilesEl = $('#profiles'), profileDetail = $('#profileDetail');
  profilesEl.innerHTML = PROFILES.map((p, i) =>
    '<button type="button" class="pf" role="tab" data-i="' + i + '" aria-selected="' + (i === 1) + '"><span class="avatar ' + p.cls + '" aria-hidden="true">' + p.initials + '</span><b>' + p.name + '</b><small>' + p.age + '</small></button>').join('');
  function showProfile(i) {
    const p = PROFILES[i];
    $$('.pf', profilesEl).forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    profileDetail.innerHTML = '<p class="m-strong">' + p.name + ' · ' + p.stage + '</p>' +
      '<div><p class="m-meta">Focus areas</p><div class="pd-row">' + p.focus.map((f) => '<span>' + f + '</span>').join('') + '</div></div>' +
      '<div><p class="m-meta">Coming up</p><p class="m-text">' + p.next + '</p></div>';
    if (!reduced) { profileDetail.classList.remove('swap'); void profileDetail.offsetWidth; profileDetail.classList.add('swap'); }
  }
  profilesEl.addEventListener('click', (e) => { const b = e.target.closest('.pf'); if (b) showProfile(+b.dataset.i); });
  showProfile(1);

  /* ---------- Development ---------- */
  $('#devRows').innerHTML = DEV.map((r, i) => {
    const [name, a, n, c] = r;
    return '<div class="dev-row"><b>' + name + '</b><div class="seg-bar">' +
      '<i class="seg ok" style="--n:' + a + ';--d:' + i * 80 + 'ms"></i><i class="seg warn" style="--n:' + n + ';--d:' + i * 80 + 'ms"></i>' +
      (c ? '<i class="seg crit" style="--n:' + c + ';--d:' + i * 80 + 'ms"></i>' : '') +
      '</div><small>' + a + '/' + (a + n + c) + '</small></div>';
  }).join('');

  /* ---------- Screening ---------- */
  $('#scrRows').innerHTML = SCREEN.map((s) => '<li><span>' + s[0] + '</span><span class="pill ' + (s[2] === 'ok' ? 'ok' : s[2]) + '">' + s[1] + '</span></li>').join('');

  /* ---------- Health timeline ---------- */
  $('#healthTl').innerHTML = HEALTH.map((h) => '<li class="' + h.c + '"><b>' + h.t + '</b><span>' + h.s + '</span></li>').join('');

  /* ---------- Challenges ---------- */
  const chTabs = $('#chTabs'), chList = $('#chList'), chDetail = $('#chDetail');
  const chKeys = Object.keys(CH);
  let chAge = chKeys[1], chIdx = 0;
  chTabs.innerHTML = chKeys.map((k) => '<button type="button" class="tab" role="tab" data-k="' + k + '" aria-selected="' + (k === chAge) + '">Ages ' + k + '</button>').join('');
  function renderChList() {
    chList.innerHTML = CH[chAge].map((c, i) => '<button type="button" class="ch-item" role="tab" data-i="' + i + '" aria-selected="' + (i === chIdx) + '">' + c.n + '</button>').join('');
  }
  function renderChDetail() {
    const c = CH[chAge][chIdx];
    chDetail.innerHTML =
      '<div class="ch-q what"><h4>What is happening?</h4><p>' + c.w + '</p></div>' +
      '<div class="ch-q"><h4>Possible reasons</h4><p>' + c.r + '</p></div>' +
      '<div class="ch-q"><h4>What parents can do</h4><p>' + c.d + '</p></div>' +
      '<div class="ch-q"><h4>What to avoid</h4><p>' + c.a + '</p></div>' +
      '<div class="ch-q help"><h4>When to seek help</h4><p>' + c.h + '</p></div>';
    if (!reduced) { chDetail.classList.remove('swap'); void chDetail.offsetWidth; chDetail.classList.add('swap'); }
  }
  chTabs.addEventListener('click', (e) => {
    const b = e.target.closest('.tab'); if (!b) return;
    chAge = b.dataset.k; chIdx = 0;
    $$('.tab', chTabs).forEach((t) => t.setAttribute('aria-selected', String(t === b)));
    renderChList(); renderChDetail();
  });
  chList.addEventListener('click', (e) => {
    const b = e.target.closest('.ch-item'); if (!b) return;
    chIdx = +b.dataset.i;
    $$('.ch-item', chList).forEach((t) => t.setAttribute('aria-selected', String(t === b)));
    renderChDetail();
  });
  renderChList(); renderChDetail();

  /* ---------- Specialist search (mock filtering) ---------- */
  const spGrid = $('#spGrid'), spCount = $('#spCount');
  const F = { spec: $('#fSpec'), age: $('#fAge'), mode: $('#fMode'), avail: $('#fAvail'), price: $('#fPrice') };
  function renderSpecialists() {
    const res = SPECIALISTS.filter((s) =>
      (!F.spec.value || s.key === F.spec.value) && (!F.age.value || s.ages.includes(F.age.value)) &&
      (!F.mode.value || s.modes.includes(F.mode.value)) && (!F.avail.value || (F.avail.value === 'today' ? s.avail === 'today' : true)) &&
      (!F.price.value || s.price === F.price.value));
    spCount.textContent = res.length ? res.length + (res.length === 1 ? ' specialist matches' : ' specialists match') : '';
    spGrid.innerHTML = res.length ? res.map((s, k) =>
      '<article class="sp" style="--k:' + k + '"><div class="sp-top"><span class="avatar ' + s.cls + '" aria-hidden="true">' + s.ini + '</span><div><h4>' + s.name + '</h4><p>' + s.spec + '</p></div></div>' +
      '<div class="sp-meta"><span><svg class="i"><use href="#i-clock"/></svg>' + s.exp + ' yrs experience</span><span><svg class="i star"><use href="#i-star"/></svg>' + s.rating.toFixed(1) + '</span>' +
      s.modes.map((m) => '<span><svg class="i"><use href="#i-' + (m === 'online' ? 'video' : 'pin') + '"/></svg>' + (m === 'online' ? 'Online' : 'In-person') + '</span>').join('') +
      '<span>' + PRICE[s.price] + '</span></div>' +
      '<p class="sp-next"><svg class="i"><use href="#i-calendar"/></svg>Next available: ' + s.next + '</p>' +
      '<div class="sp-act"><a class="btn btn-ghost btn-sm" href="/specialists/' + s.id + '" data-route>View Profile</a><a class="btn btn-primary btn-sm" href="/book/' + s.id + '" data-route>Book Session</a></div></article>').join('')
      : '<p class="empty">No sample specialists match these filters. Try widening one of them.</p>';
  }
  Object.values(F).forEach((s) => s.addEventListener('change', renderSpecialists));
  renderSpecialists();

  /* ---------- Safety sequence ---------- */
  const safe = $('#safeChat');
  const safeParts = [$('.msg', safe), $('#safeStatus'), $('#safeAlert')];
  function showSafe() { safeParts.forEach((el, i) => setTimeout(() => el.classList.add('show'), reduced ? 0 : i * 900 + 200)); }
  if (!reduced && safe.getBoundingClientRect().top > innerHeight * 0.9) {
    safe.classList.add('play');
    const safeIO = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { showSafe(); safeIO.disconnect(); }
    }, { threshold: 0.5 });
    safeIO.observe(safe);
  }

  /* =======================================================================
     AGE PERSONALIZATION
     ======================================================================= */
  const ageTabs = $('#ageTabs'), ageInd = $('#ageInd'), agePanel = $('#agePanel'), grow = $('#grow'), growLabel = $('#growLabel');
  let ageIdx = 1;
  ageTabs.insertAdjacentHTML('beforeend', AGES.map((a, i) => '<button type="button" class="age-tab" role="tab" data-i="' + i + '" aria-selected="' + (i === ageIdx) + '">' + a.key + '</button>').join(''));
  function placeAgeIndicator() {
    const b = $('.age-tab[aria-selected="true"]', ageTabs);
    if (!b) return;
    ageInd.style.width = b.offsetWidth + 'px';
    ageInd.style.left = b.offsetLeft + 'px';
  }
  function showAge(i) {
    ageIdx = i;
    const a = AGES[i];
    $$('.age-tab', ageTabs).forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    placeAgeIndicator();
    agePanel.innerHTML = '<p class="age-stage">' + a.stage + '</p><p>' + a.line + '</p><div class="concerns">' +
      a.concerns.map((c, k) => '<span style="--k:' + k + '">' + c + '</span>').join('') + '</div>';
    if (!reduced) { agePanel.classList.remove('swap'); void agePanel.offsetWidth; agePanel.classList.add('swap'); }
    grow.style.setProperty('--s', a.s);
    growLabel.textContent = a.key;
  }
  ageTabs.addEventListener('click', (e) => { const b = e.target.closest('.age-tab'); if (b) showAge(+b.dataset.i); });
  addEventListener('resize', placeAgeIndicator);

  /* =======================================================================
     MOCK DASHBOARD INTERACTIONS
     ======================================================================= */
  const toggleGroup = (sel, cls, single) => {
    $$(sel).forEach((b) => b.addEventListener('click', () => {
      if (single) $$(sel).forEach((o) => { o.classList.remove(cls); o.setAttribute('aria-pressed', 'false'); });
      const on = single ? true : !b.classList.contains(cls);
      b.classList.toggle(cls, on);
      b.setAttribute('aria-pressed', String(on));
    }));
  };
  toggleGroup('.mood', 'on', true);
  toggleGroup('.day', 'on', false);

  /* =======================================================================
     FAQ ACCORDION
     ======================================================================= */
  const acc = $('#acc');
  acc.innerHTML = FAQ.map((f, i) =>
    '<div class="acc-item' + (i === 0 ? ' open' : '') + '"><h3><button type="button" class="acc-q" id="aq' + i + '" aria-expanded="' + (i === 0) + '" aria-controls="aa' + i + '">' + f[0] +
    '<svg class="i"><use href="#i-chevron"/></svg></button></h3><div class="acc-a" id="aa' + i + '" role="region" aria-labelledby="aq' + i + '"><div><p>' + f[1] + '</p></div></div></div>').join('');
  acc.addEventListener('click', (e) => {
    const b = e.target.closest('.acc-q'); if (!b) return;
    const item = b.closest('.acc-item');
    const willOpen = !item.classList.contains('open');
    $$('.acc-item', acc).forEach((it) => { it.classList.remove('open'); $('.acc-q', it).setAttribute('aria-expanded', 'false'); });
    if (willOpen) { item.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
  });

  /* =======================================================================
     BOOT
     ======================================================================= */
  $$('.reveal').forEach(armReveal);
  const bk = $('#bk');
  if (!reduced && bk.getBoundingClientRect().top > innerHeight * 0.9) { bk.classList.add('pre'); }

  showAge(ageIdx);
  applyModes();
  try { const saved = localStorage.getItem('rafiq-lang'); if (saved === 'ar') setLang('ar'); } catch (e) { /* ignore */ }
  document.fonts && document.fonts.ready.then(placeAgeIndicator);

  // If nobody scrolls (for example a static capture), show everything that was waiting.
  setTimeout(() => {
    if (userScrolled) return;
    $$('.pre').forEach((el) => { el.classList.remove('pre'); el.classList.add('in'); });
    counters.forEach((el) => { runCount(el); });
    rings.forEach((r) => { r.style.strokeDashoffset = 100 - +r.dataset.ring; });
    if (safe.classList.contains('play')) showSafe();
  }, 6000);
})();
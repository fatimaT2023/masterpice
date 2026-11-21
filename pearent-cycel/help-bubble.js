/* "Need help?" — a small, page-aware helper on every parent page.
   Explains what the page is for and what the parent gets from it, answers common
   questions in plain words with a link to the right place, shows the page's steps
   (from parent-step-guide.js) and matches free-typed questions. No live AI or
   medical advice: unmatched questions are offered to the Rafiq AI page. */
(() => {
  'use strict';
  if (window.top !== window && window.parent?.document?.getElementById('rafiqHelp')) { /* nested frames: fine */ }
  const page = location.pathname.split('/').pop() || 'parent-dashboard.html';
  if (page === 'ai-assistant.html' || page === 'onboarding.html' || page === 'parent-preview.html') return;
  const p = (en, ar) => ({ en, ar });
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const t = v => (v && typeof v === 'object' ? v[ar() ? 'ar' : 'en'] : v);
  const childName = () => { try { const id = window.RafiqFamily?.selected?.(); return window.RafiqSetup?.readChildren?.().find(c => c.id === id)?.name || ''; } catch { return ''; } };
  const N = () => childName() || (ar() ? 'طفلكم' : 'your child');
  const qa = (q, a, link, kw) => ({ q, a, link, kw: kw || [] });
  const L = (href, en, arText) => ({ href, label: p(en, arText) });

  // Page content: what it is, what you get, quick questions
  const PAGES = {
    'parent-dashboard.html': { name: p('Home', 'الرئيسية'),
      what: () => p('Your starting point every day: where ' + N() + ' is in the journey, one clear next step, and what happened this week.', 'نقطة البداية كل يوم: وين ' + N() + ' بالرحلة، خطوة وحدة واضحة، وشو صار هالأسبوع.'),
      benefit: p('You don’t need to visit every page — just follow “Your next step”.', 'مش لازم تفوتوا كل الصفحات — بس امشوا ورا «خطوتكم الجاية».'),
      qs: [
        qa(p('What are the 4 stations?', 'شو هي المحطات الأربع؟'), p('Get to know → Play and observe → Ask for support → Follow up. “You are here” moves with your child’s situation, so you always know where you are.', 'نتعرّف ← نلعب ونلاحظ ← نطلب دعم ← نتابع. «أنتم هون» بتتحرك حسب وضع طفلكم، فدايمًا بتعرفوا وين إنتو.'), null, ['محطات', 'رحلة', 'station', 'journey']),
        qa(p('How do I switch child?', 'كيف أبدّل بين الأطفال؟'), p('Tap the child’s name on the card at the top, or the child picker in the top bar. Every page then shows that child.', 'اضغطوا على اسم الطفل بالكرت فوق، أو على اسم الطفل بالشريط العلوي. كل الصفحات بتصير عن هالطفل.'), null, ['ابدل', 'طفل', 'اولاد', 'switch', 'child']),
        qa(p('What is “This week”?', 'شو يعني «هالأسبوع»؟'), p('A quick count of activities, notes from home and specialist reports in the last 7 days — small steps that add up.', 'عدّ سريع للأنشطة وملاحظات البيت وتقارير المختص بآخر ٧ أيام — خطوات صغيرة بتتجمّع.'), L('milestones.html', 'Add a note', 'أضيفوا ملاحظة'), ['اسبوع', 'week', 'ملاحظات'])
      ] },
    'child-profile.html': { name: p('Child profile', 'ملف الطفل'),
      what: () => p(N() + '’s basic details and story in one place.', 'بيانات ' + N() + ' وحكايته بمكان واحد.'),
      benefit: p('The more of the story you fill in, the better the suggested activities and next steps.', 'كل ما كمّلتوا الحكاية، بتصير الأنشطة والخطوات المقترحة أدق.'),
      qs: [
        qa(p('How do I edit the details?', 'كيف أعدّل البيانات؟'), p('Use “Edit child details” at the top, or “Add / Edit” beside any part of the story.', 'من زر «تعديل بيانات الطفل» فوق، أو «إضافة / تعديل» جنب أي قسم بالحكاية.'), null, ['عدل', 'تعديل', 'edit', 'بيانات']),
        qa(p('Who are caregivers?', 'مين مقدمو الرعاية؟'), p('You can invite the other parent or a grandparent to follow ' + N() + ' with you. You choose what they can do.', 'بتقدروا تعزموا الأب أو الجدّة يتابعوا معكم. وإنتو بتختاروا شو بيقدروا يعملوا.'), null, ['رعاية', 'اب', 'جدة', 'caregiver', 'invite']),
        qa(p('Why fill in the story?', 'ليش أعبّي الحكاية؟'), p('It helps Rafiq suggest activities at the right level and gives a specialist a quick picture before a session.', 'بتساعد رفيق يقترح أنشطة على المستوى الصح، وبتعطي المختص صورة سريعة قبل الجلسة.'), null, ['حكاية', 'story', 'ليش'])
      ] },
    'health.html': { name: p('Health and vaccines', 'الصحة والمطاعيم'),
      what: () => p(N() + '’s vaccines on the Jordan schedule, height and weight, and doctor-visit notes.', 'مطاعيم ' + N() + ' حسب جدول الأردن، الطول والوزن، وملاحظات زيارات الطبيب.'),
      benefit: p('You always know which vaccine is next, and you have everything ready for the doctor.', 'بتعرفوا دايمًا شو المطعوم الجاي، وكل إشي جاهز للطبيب.'),
      qs: [
        qa(p('How do I record a vaccine?', 'كيف أسجّل مطعوم؟'), p('In the schedule, open the visit and press “Record” next to the dose. The date is filled in for you — change it if needed and save.', 'بالجدول، افتحوا الزيارة واضغطوا «سجّلوا» جنب الجرعة. التاريخ بيطلع جاهز — عدّلوه إذا لازم واحفظوا.'), null, ['مطعوم', 'لقاح', 'سجل', 'vaccine', 'record']),
        qa(p('What does “Overdue” mean?', 'شو يعني «متأخر»؟'), p('The usual date for that visit has passed and no dose is recorded. If it was given, record the date; if not, check with your health centre.', 'موعد الزيارة المعتاد مرّ وما في جرعة مسجّلة. إذا أخذها سجّلوا التاريخ، وإذا لا راجعوا المركز الصحي.'), null, ['متاخر', 'overdue', 'late']),
        qa(p('Is this the official schedule?', 'هل هاد الجدول الرسمي؟'), p('It follows the Jordan Ministry of Health programme as a guide. Always confirm with the vaccination card or your health centre.', 'هو دليل حسب برنامج وزارة الصحة الأردنية. تأكدوا دايمًا من بطاقة التطعيم أو المركز الصحي.'), null, ['رسمي', 'وزارة', 'official']),
        qa(p('How do I add height or weight?', 'كيف أضيف طول أو وزن؟'), p('Use “Add” on the Height and weight card beside the schedule.', 'من زر «أضيفوا» على كرت الطول والوزن جنب الجدول.'), null, ['طول', 'وزن', 'height', 'weight'])
      ] },
    'album.html': { name: p('Memories', 'الذكريات'),
      what: () => p(N() + '’s photos and sweet moments, sorted by date.', 'صور ' + N() + ' ولحظاته الحلوة، مرتّبة حسب التاريخ.'),
      benefit: p('A private album that stays on your device.', 'ألبوم خاص بيضل على جهازكم.'),
      qs: [qa(p('How do I add photos?', 'كيف أضيف صور؟'), p('Press “Add photos”, pick from your phone or computer, then save.', 'اضغطوا «إضافة صور»، اختاروا من جوالكم أو جهازكم، واحفظوا.'), null, ['صور', 'اضيف', 'photo']), qa(p('Who can see them?', 'مين بيشوفهم؟'), p('Only you on this device. Nothing is shared automatically.', 'بس إنتو على هالجهاز. ما في إشي بينشارك لحاله.'), null, ['مين', 'خصوصية', 'privacy'])] },
    'activities.html': { name: p('Play and observe', 'نلعب ونلاحظ'),
      what: () => p('Short activities matched to ' + N() + '’s age.', 'أنشطة قصيرة على قد عمر ' + N() + '.'),
      benefit: p('Ten minutes of play a day builds skills — and you learn what your child enjoys.', 'عشر دقايق لعب باليوم بتبني مهارات — وبتعرفوا شو بيحب طفلكم.'),
      qs: [qa(p('Where do I start?', 'من وين أبلّش؟'), p('Press “Start today’s activity”. It takes about 10 minutes, one step per screen.', 'اضغطوا «ابدأوا نشاط اليوم». بياخد حوالي ١٠ دقايق، خطوة بكل شاشة.'), L('daily-activity.html', 'Today’s activity', 'نشاط اليوم'), ['ابلش', 'نشاط', 'start', 'activity']), qa(p('Why save the reaction?', 'ليش أسجّل ردة فعله؟'), p('It goes into the growth journal, so you (and a specialist) can see progress over time.', 'بتروح على سجل النمو، فبتشوفوا (والمختص كمان) التقدّم مع الوقت.'), null, ['سجل', 'ردة', 'save'])] },
    'daily-activity.html': { name: p('Today’s activity', 'نشاط اليوم'),
      what: () => p('One activity for today, step by step.', 'نشاط واحد لليوم، خطوة خطوة.'), benefit: p('Simple play that fits ' + N() + '’s age, then a quick note on how it went.', 'لعب بسيط على قد عمر ' + N() + '، وبعدها ملاحظة سريعة كيف مشي.'),
      qs: [qa(p('What if my child is not interested?', 'إذا طفلي ما تفاعل؟'), p('That is fine — stop and save “Not for us today”. Try again another day; it still tells you something useful.', 'عادي — وقّفوا واحفظوا «مش لنا اليوم». جرّبوا يوم ثاني؛ وهاد كمان معلومة مفيدة.'), null, ['ما تفاعل', 'رفض', 'not interested'])] },
    'milestones.html': { name: p('Growth journal', 'سجل النمو'),
      what: () => p('What most children do at ' + N() + '’s age, plus your notes from home.', 'شو بيعملوا أغلب الأطفال بعمر ' + N() + '، وملاحظاتكم من البيت.'),
      benefit: p('Tick what you have seen. If several skills are “not yet”, Rafiq suggests a next step early.', 'علّموا اللي شفتوه. إذا كذا مهارة «لسا»، رفيق بيقترح خطوة بدري.'),
      qs: [qa(p('Is this a test?', 'هل هاد اختبار؟'), p('No. It is a checklist from the CDC to help you notice. Every child has their own pace.', 'لا. هاي قائمة من CDC بتساعدكم تلاحظوا. كل طفل إله وتيرته.'), null, ['اختبار', 'تشخيص', 'test']), qa(p('What if a skill is “not yet”?', 'إذا مهارة «لسا»؟'), p('Keep watching and try a related activity. If two or more are “not yet”, it is worth talking to a doctor or specialist.', 'ضلّوا راقبوا وجرّبوا نشاط إله علاقة. إذا مهارتين أو أكثر «لسا»، بيستاهل تحكوا مع طبيب أو مختص.'), L('screening.html', 'I have a concern', 'عندي قلق'), ['لسا', 'not yet', 'متاخر']), qa(p('How do I write a note?', 'كيف أكتب ملاحظة؟'), p('Use “What did you notice today?” beside your notes. One sentence about a real moment is enough.', 'من «شو لاحظت على طفلك اليوم؟» جنب الملاحظات. جملة وحدة عن موقف حقيقي بتكفّي.'), null, ['ملاحظة', 'اكتب', 'note'])] },
    'support-areas.html': { name: p('Support areas', 'مجالات الدعم'),
      what: () => p('Two doors (a worry or a diagnosis) and 11 areas of support.', 'بابين (قلق أو تشخيص) و١١ مجال دعم.'), benefit: p('Find the right topic, the services for it, and the right specialist.', 'بتلاقوا الموضوع الصح، والخدمات إله، والمختص المناسب.'),
      qs: [qa(p('Which door should I choose?', 'أي باب أختار؟'), p('“Something worries me” if there is no diagnosis yet; “My child has a diagnosis” if a professional already diagnosed your child.', '«في إشي مقلقني» إذا لسا ما في تشخيص؛ «طفلي عنده تشخيص» إذا مختص شخّصه قبل.'), null, ['باب', 'اختار', 'door']), qa(p('Does browsing change anything?', 'التصفّح بيغيّر إشي؟'), p('No — browsing never changes your child’s profile.', 'لا — التصفّح ما بيغيّر ملف طفلكم أبدًا.'), null, ['يغير', 'ملف'])] },
    'screening.html': { name: p('I have a concern', 'عندي قلق'),
      what: () => p('Three short steps to turn a worry into clear notes and one next step.', '٣ خطوات قصيرة بتحوّل القلق لملاحظات واضحة وخطوة وحدة.'), benefit: p('You get a summary you can share with a specialist — not a diagnosis.', 'بتطلعوا بملخص بتقدروا تشاركوه مع مختص — مش تشخيص.'),
      qs: [qa(p('How long does it take?', 'قديش بياخد وقت؟'), p('About 3 minutes: choose an area, answer 4 short questions, see your result.', 'حوالي ٣ دقايق: اختاروا مجال، جاوبوا ٤ أسئلة قصيرة، وشوفوا النتيجة.'), null, ['قديش', 'وقت', 'long']), qa(p('What does the result mean?', 'شو بتعني النتيجة؟'), p('It is a suggestion from your own answers: keep watching, a consultation may help, or talk to someone soon. It always explains why.', 'هي اقتراح من إجاباتكم: راقبوا، أو استشارة ممكن تفيد، أو احكوا مع حدا قريبًا. ودايمًا بتشرح ليش.'), null, ['نتيجة', 'result']), qa(p('Will the specialist see my answers?', 'المختص رح يشوف إجاباتي؟'), p('Only if you choose to attach the summary to a booking — and you can edit it first.', 'بس إذا اخترتوا تضيفوا الملخص للحجز — وبتقدروا تعدّلوه قبل.'), null, ['مختص', 'يشوف', 'share'])] },
    'specialists.html': { name: p('Find a specialist', 'البحث عن مختص'),
      what: () => p('Verified specialists, their ratings and fees.', 'مختصين موثّقين، تقييماتهم وأسعارهم.'), benefit: p('Open a profile to see posts, reviews and certificates before you book.', 'افتحوا الملف وشوفوا المنشورات والتقييمات والشهادات قبل ما تحجزوا.'),
      qs: [qa(p('How do I choose?', 'كيف أختار مختص؟'), p('Start with the specialty that matches your concern, then compare reviews, experience and session type (online or clinic).', 'ابدأوا بالتخصص اللي بيناسب قلقكم، وبعدين قارنوا التقييمات والخبرة ونوع الجلسة (أونلاين أو عيادة).'), null, ['اختار', 'مختص', 'choose']), qa(p('What does “Verified by Rafiq” mean?', 'شو يعني «موثّق من رفيق»؟'), p('The Rafiq team checked the specialist’s licence before they could accept bookings.', 'فريق رفيق تحقق من رخصة المختص قبل ما يقدر يستقبل حجوزات.'), null, ['موثق', 'verified'])] },
    'specialist-profile.html': { name: p('Specialist profile', 'ملف المختص'),
      what: () => p('Get to know the specialist: posts, reviews, certificates and session details.', 'تعرّفوا على المختص: منشورات، تقييمات، شهادات وتفاصيل الجلسة.'), benefit: p('Decide with confidence before booking.', 'بتقرّروا وإنتو مرتاحين قبل الحجز.'),
      qs: [qa(p('Are the reviews real?', 'التقييمات حقيقية؟'), p('Only families who completed a session through Rafiq can leave a review. (In this demo they are sample data.)', 'بس العيلات اللي خلّصت جلسة عن طريق رفيق بتقيّم. (بهالعرض هي بيانات تجريبية.)'), null, ['تقييم', 'review']), qa(p('How do I book?', 'كيف أحجز؟'), p('Press “Book a session”, choose a time, review the fee and confirm.', 'اضغطوا «احجزوا جلسة»، اختاروا وقت، راجعوا السعر وأكدوا.'), null, ['احجز', 'book'])] },
    'booking.html': { name: p('Booking', 'الحجز'), what: () => p('Choose a time with the specialist and confirm.', 'اختاروا وقت مع المختص وأكدوا.'), benefit: p('You see the fee and details before paying (payment is simulated in this demo).', 'بتشوفوا السعر والتفاصيل قبل الدفع (الدفع محاكاة بهالعرض).'), qs: [qa(p('Can I change the time later?', 'بقدر أغيّر الموعد بعدين؟'), p('Yes — usually for free up to 24 hours before. Check the specialist’s cancellation note.', 'آه — عادة مجانًا لحد ٢٤ ساعة قبل. شوفوا سياسة الإلغاء عند المختص.'), null, ['غير', 'الغاء', 'cancel'])] },
    'bookings.html': { name: p('Appointments and reports', 'المواعيد والتقارير'), what: () => p('All of ' + N() + '’s sessions and the specialists’ reports.', 'كل جلسات ' + N() + ' وتقارير المختصين.'), benefit: p('Open a report, then use “Practise at home” to turn it into small steps.', 'افتحوا التقرير، وبعدين «نطبّق بالبيت» عشان يصير خطوات صغيرة.'), qs: [qa(p('Where is the video link?', 'وين رابط الجلسة؟'), p('On the appointment card when it is an online session — press “Open video room” at the time.', 'على كرت الموعد إذا الجلسة أونلاين — اضغطوا «افتحوا غرفة الفيديو» بوقتها.'), null, ['رابط', 'فيديو', 'video']), qa(p('When does the report arrive?', 'إمتى بيوصل التقرير؟'), p('After the specialist writes it — waiting for a report is normal. You will get a notification.', 'بعد ما المختص يكتبه — الانتظار طبيعي. ورح يوصلكم إشعار.'), null, ['تقرير', 'report'])] },
    'specialist-report.html': { name: p('Specialist report', 'تقرير المختص'), what: () => p('What the specialist observed and recommends for ' + N() + '.', 'شو لاحظ المختص وشو بيقترح لـ ' + N() + '.'), benefit: p('Pick one recommendation to try this week, then note how it went.', 'اختاروا اقتراح واحد تجرّبوه هالأسبوع، وسجّلوا كيف مشي.'), qs: [qa(p('What do I do now?', 'شو أعمل هلّق؟'), p('Choose one idea from the report, try it at home this week, and write a short note. Request a follow-up if you have questions.', 'اختاروا فكرة وحدة من التقرير، جرّبوها بالبيت هالأسبوع، واكتبوا ملاحظة قصيرة. واطلبوا متابعة إذا عندكم أسئلة.'), L('milestones.html', 'Write a note', 'اكتبوا ملاحظة'), ['هلق', 'بعدين', 'now'])] },
    'messages.html': { name: p('Messages', 'الرسائل'), what: () => p('Conversations with specialists who accepted a follow-up.', 'محادثات مع المختصين اللي قبلوا متابعة.'), benefit: p('Ask quick questions between sessions and share notes you choose.', 'اسألوا أسئلة سريعة بين الجلسات وشاركوا الملاحظات اللي بتختاروها.'), qs: [qa(p('Why can’t I message a specialist?', 'ليش ما بقدر أراسل مختص؟'), p('Messaging opens after the specialist accepts a follow-up request.', 'المراسلة بتنفتح بعد ما المختص يقبل طلب المتابعة.'), null, ['راسل', 'رسالة', 'message'])] },
    'support-practice.html': { name: p('Practise at home', 'نطبّق بالبيت'), what: () => p('Turn the specialist’s advice into small steps at home.', 'حوّلوا نصايح المختص لخطوات صغيرة بالبيت.'), benefit: p('Your notes show the specialist what worked at the next visit.', 'ملاحظاتكم بتورجي المختص شو زبط بالزيارة الجاية.'), qs: [] },
    'settings.html': { name: p('Settings', 'الإعدادات'), what: () => p('Your account, language and privacy.', 'حسابكم، اللغة والخصوصية.'), benefit: p('Change language anytime from here or from My account.', 'غيّروا اللغة بأي وقت من هون أو من «حسابي».'), qs: [] },
    'subscription.html': { name: p('My plan', 'خطتي'), what: () => p('Free or Plus plan for your family.', 'الخطة المجانية أو Plus لعيلتكم.'), benefit: p('Plus adds extra activities each day.', 'Plus بيضيف أنشطة زيادة كل يوم.'), qs: [] }
  };
  const GLOBAL = [
    qa(p('How do I change the language?', 'كيف أغيّر اللغة؟'), p('Open My account (the person icon at the top) and choose العربية or English.', 'افتحوا «حسابي» (أيقونة الشخص فوق) واختاروا العربية أو English.'), null, ['لغة', 'انجليزي', 'عربي', 'language']),
    qa(p('Where are my appointments?', 'وين مواعيدي؟'), p('In Appointments at the top. Reports appear there too after the session.', 'بـ«المواعيد» فوق. والتقارير بتطلع هناك كمان بعد الجلسة.'), L('bookings.html', 'Appointments', 'المواعيد'), ['موعد', 'مواعيد', 'appointment']),
    qa(p('How do I book a specialist?', 'كيف أحجز مختص؟'), p('Support → Find a specialist, open a profile, then “Book a session”.', 'الدعم ← البحث عن مختص، افتحوا الملف، وبعدين «احجزوا جلسة».'), L('specialists.html', 'Find a specialist', 'لاقوا مختص'), ['احجز', 'مختص', 'book', 'specialist']),
    qa(p('Does Rafiq diagnose?', 'هل رفيق بيشخّص؟'), p('No. Rafiq helps you organise what you notice and reach the right specialist. Diagnosis is for professionals.', 'لا. رفيق بيساعدكم ترتّبوا اللي بتلاحظوه وتوصلوا للمختص الصح. التشخيص للمختصين.'), null, ['تشخيص', 'يشخص', 'diagnos']),
    qa(p('I am worried about my child', 'أنا قلقانة على طفلي'), p('Start “I have a concern”: 3 short steps and you get a clear next step.', 'ابدأوا «عندي قلق»: ٣ خطوات قصيرة وبتطلعوا بخطوة واضحة.'), L('screening.html', 'I have a concern', 'عندي قلق'), ['قلق', 'قلقان', 'خايف', 'worried', 'concern'])
  ];

  const norm = s => String(s || '').toLowerCase().replace(/[ً-ْ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[؟?!.,،]/g, ' ');
  function match(text, list) {
    const q = norm(text); if (!q.trim()) return null;
    let best = null, score = 0;
    for (const item of list) {
      let s = 0;
      for (const k of item.kw) if (q.includes(norm(k))) s += 2;
      for (const w of norm(t(item.q)).split(/\s+/)) if (w.length > 2 && q.includes(w)) s += 1;
      if (s > score) { score = s; best = item; }
    }
    return score >= 2 ? best : null;
  }

  const make = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text !== undefined) el.textContent = text; return el; };
  let panel, log, open = false;

  function say(role, text, link) {
    const b = make('div', 'rh-msg is-' + role); b.append(make('p', '', text));
    if (link) { const a = make('a', 'rh-link', t(link.label) + (ar() ? ' ←' : ' →')); a.href = link.href; b.append(a); }
    log.append(b); log.scrollTop = log.scrollHeight;
  }
  function answer(item) { say('me', t(item.q)); setTimeout(() => say('bot', t(item.a), item.link), 180); }

  function build() {
    const info = PAGES[page] || { name: p('This page', 'هالصفحة'), what: () => p('Part of your child’s journey on Rafiq.', 'جزء من رحلة طفلكم على رفيق.'), benefit: p('Use the menu at the top to move between stations.', 'استعملوا القائمة فوق عشان تتنقّلوا بين المحطات.'), qs: [] };
    const root = make('div', 'rh'); root.id = 'rafiqHelp'; root.dataset.noTranslate = '';
    const fab = make('button', 'rh-fab'); fab.type = 'button'; fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'rafiqHelpPanel');
    fab.append(make('span', 'rh-fab-ic', '?'), make('span', 'rh-fab-text', t(p('Need help?', 'بدك مساعدة؟'))));
    panel = make('section', 'rh-panel'); panel.id = 'rafiqHelpPanel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', t(p('Help with this page', 'مساعدة بهالصفحة')));
    const head = make('div', 'rh-head');
    const title = make('div'); title.append(make('strong', '', t(p('Rafiq is here to help', 'رفيق هون ليساعدكم'))), make('small', '', t(info.name)));
    const close = make('button', 'rh-close', '×'); close.type = 'button'; close.setAttribute('aria-label', t(p('Close', 'سكّروا'))); close.onclick = () => toggle(false);
    head.append(make('span', 'rh-avatar', '✦'), title, close);
    log = make('div', 'rh-log'); log.setAttribute('aria-live', 'polite');
    say('bot', t(info.what()) + ' ' + t(info.benefit));
    const quick = make('div', 'rh-quick');
    const items = [...info.qs, ...GLOBAL.filter(g => !info.qs.some(q => t(q.q) === t(g.q)))].slice(0, Math.max(4, info.qs.length));
    for (const item of items.slice(0, 5)) { const b = make('button', 'rh-chip', t(item.q)); b.type = 'button'; b.onclick = () => answer(item); quick.append(b); }
    const guide = window.RafiqParentStepGuide?.guides?.[page];
    if (Array.isArray(guide) && guide.length) {
      const b = make('button', 'rh-chip is-steps', t(p('Show me the steps', 'ورجوني الخطوات'))); b.type = 'button';
      b.onclick = () => { say('me', t(p('Show me the steps', 'ورجوني الخطوات'))); const tr = v => (ar() ? (window.RafiqHomeArabic?.[v] || v) : v); const lines = guide.map((s, i) => (i + 1) + '. ' + tr(s.title || '') + (s.help ? ' — ' + tr(s.help) : '')); setTimeout(() => say('bot', lines.join('\n')), 180); };
      quick.prepend(b);
    }
    const form = make('form', 'rh-form');
    const input = make('input'); input.type = 'text'; input.maxLength = 200; input.placeholder = t(p('Ask about this page…', 'اسألوا عن هالصفحة…')); input.setAttribute('aria-label', input.placeholder);
    const send = make('button', 'rh-send', ar() ? '←' : '→'); send.type = 'submit'; send.setAttribute('aria-label', t(p('Send', 'إرسال')));
    form.append(input, send);
    form.onsubmit = e => {
      e.preventDefault(); const text = input.value.trim(); if (!text) return; input.value = '';
      say('me', text);
      const hit = match(text, [...info.qs, ...GLOBAL]);
      setTimeout(() => {
        if (hit) say('bot', t(hit.a), hit.link);
        else say('bot', t(p('I don’t have a ready answer for that here. Rafiq AI can help you organise the question — it is not medical advice.', 'ما عندي جواب جاهز لهالسؤال هون. «اسألوا رفيق» بيساعدكم ترتّبوا السؤال — وهو مش نصيحة طبية.')), { href: 'ai-assistant.html?q=' + encodeURIComponent(text), label: p('Ask Rafiq', 'اسألوا رفيق') });
      }, 220);
    };
    panel.append(head, log, quick, form);
    fab.onclick = () => toggle(!open);
    root.append(panel, fab);
    document.body.append(root);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) { toggle(false); fab.focus(); } });
    function toggle(v) { open = v; panel.hidden = !v; fab.setAttribute('aria-expanded', String(v)); root.classList.toggle('is-open', v); if (v) setTimeout(() => input.focus(), 50); }
  }

  function start() { if (document.getElementById('rafiqHelp')) return; try { build(); } catch { /* help is optional */ } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 300)); else setTimeout(start, 300);
  new MutationObserver(() => { const el = document.getElementById('rafiqHelp'); if (!el) return; const wasOpen = el.classList.contains('is-open'); el.remove(); start(); if (wasOpen) document.querySelector('#rafiqHelp .rh-fab')?.click(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

# المرحلة الأولى / Phase 1

تجهيز العرض: صفحة `../piblic-pages/demo-showcase.html` بتضيف ١٦ هوية دخول وهمية فقط، وبتعرض الإيميلات والباسورد وخطوات كل سيناريو بالعربي والإنجليزي. حسابات العرض بتفتح بيانات الطفل المناسبة بالذاكرة. دليل التقديم: `../output/DEMO-SHOWCASE-GUIDE-AR-EN.md`. هالإضافة بيانات عرض، مش تنفيذ مكتبة الحالات.

Presentation setup: `../piblic-pages/demo-showcase.html` explicitly installs 16 fictional login identities only and lists credentials and per-case walkthroughs in Arabic/English. Each account opens its matching child fixtures in memory. See `../output/DEMO-SHOWCASE-GUIDE-AR-EN.md`. This adds demo scenarios, not the conditions library.

## ما تغيّر / What changed

حافظنا على نص الأسئلة وخياراتها وتسلسلها وأقسامها التسعة وشروط ظهورها حسب العمر. أضفنا شرحًا اختياريًا لاستخدام كل إجابة وروابط للأدوات الموجودة. أهداف العيلة المختارة تظهر في الرئيسية والملف مع سبب ظهورها، وتظل باقي الخدمات متاحة. كل الإضافات بالعربي والإنجليزي مع RTL/LTR.

Question wording, options, sequence, nine sections and age conditions are preserved. Each question has an optional explanation and an existing tool link. Explicit family goals produce links with reasons on the home and child profile; other services remain available. Additions support Arabic/English and RTL/LTR.

بيانات الولادة الأساسية تملأ سؤال الموعد فقط إذا كان بلا إجابة. التعبئة ظاهرة وقابلة للتعديل ولا تحفظ بمجرد فتح السؤال. الإجابة السابقة، حتى «تخطّي»، تبقى محفوظة. التعارض لا يغيّر حساب العمر أو بيانات الولادة الأساسية تلقائيًا.

Basic birth details prefill only an unanswered term-status question. The visible prefill is editable and is not persisted merely by opening the question. Existing answers, including Skip, win. Conflicts never silently change basic birth details or age calculations.

## تجربة البيانات / Data preview

- افتحوا أي صفحة أهل عبر خادم HTTP المحلي؛ تنتقل إلى `parent-preview.html` وتعرض الصفحة الأصلية داخل إطار بلا حواف مع شريط تجربة واضح.
- السيناريو الجديد: عيلة وهمية، بلا أطفال، والخطة المجانية الحالية. سيناريو العيلة: ثلاثة أطفال وهميين ومقدّم رعاية إضافي وخطة Plus محاكاة بوضوح.
- الإدخالات الجديدة في الذاكرة فقط أثناء التنقل داخل الإطار. إعادة تحميل صفحة العرض الخارجية أو إغلاقها يفقدها. إعادة التجربة لها تأكيد. المسموح تخزينه فعليًا هو تفضيل اللغة `ar` أو `en` فقط.
- السجلات القديمة متاحة للقراءة عبر جلسة حساب الأهل الموجودة. لا ترحيل أو حذف تلقائي. منع التعديل يشمل الصور. هذا لا يجعل بيانات المتصفح القديمة آمنة ولا يشكّل نظام مصادقة آمنًا.
- لا تدخلوا معلومات حقيقية. يلزم خادم آمن وتفويض فعلي وسياسة موافقة واحتفاظ وحذف قبل الاستخدام الحقيقي.

- Open an existing parent page over local HTTP. It opens its original layout in the borderless `parent-preview.html` frame, with a clear demo notice.
- New-family mode starts empty with the existing Free quota. Family mode has three fictional children, a linked caregiver and an explicitly simulated Plus plan.
- New entries live only in host memory across inner-page navigation. Reloading/closing the outer preview loses them. Reset asks for confirmation. Only validated `ar`/`en` language preferences reach persistent storage.
- Existing browser records require the existing parent session and are read-only, including photos. No automatic migration or deletion. This does not secure old browser storage or provide secure authentication.
- Use fictional details only. Production requires secure server storage, real authorization, consent and retention/deletion policies.

الصور التجريبية تستعمل واجهة ذاكرة تدعم العمليات التي يستعملها الألبوم الحالي فقط؛ ليست بديلًا كاملًا لـ IndexedDB. الدعوات وخدمات الحساب العامة وخدمات خارج مسار الأهل تفتح منفصلة مع توضيح أن بيانات التجربة لا تنتقل. لا ادّعاء بحجز أو دفع أو AI حي.

Demo photos use a memory adapter implementing the current album's operations, not a complete IndexedDB replacement. Invitations, public account services and routes outside the parent workspace open separately with a notice that temporary entries do not transfer. This is not live booking, payment or AI.

## خريطة الإجابات / Answer map

المصدر التنفيذي الكامل: `parent-question-map.js`. كل سجل يحدد مسار الحفظ، الأداة، منطق الاستخدام، الفائدة والصفحة. الإجابات تحفظ في `child.backgroundHistory.answers[id]`، وتبقى مرايا الولادة والحساسية والأدوية والأهداف الحالية. الأسماء التالية معرّفات تقنية وليست بديلًا عن نص السؤال.

The complete executable registry is `parent-question-map.js`. Each record defines the saved path, feature, logic, benefit and action route. Answers use `child.backgroundHistory.answers[id]`, preserving existing birth, allergy, medicine and goal mirrors. IDs below are technical identifiers, not replacement question wording.

| Question IDs / معرّفات الأسئلة | Feature and reaction / الأداة والتفاعل |
| --- | --- |
| about.siblings, about.caregiver | Caregiver options; access still needs explicit invitation / خيارات مقدّمي الرعاية، بدون منح وصول تلقائي |
| birth.termStatus, birth.weeks, birth.delivery | Child profile and basic-history review / الملف ومراجعة بيانات الولادة |
| birth.weightGrams, birth.lengthCm | Dated Health measurements after separate confirmation only / قياسات مؤرخة بعد موافقة منفصلة فقط |
| birth.nicu, birth.complications | Health reference and visit questions / مرجع صحي وأسئلة للزيارة |
| health.allergies, health.conditions, health.medicines, health.hospital, health.hearing, health.vision, health.instructions | Health records; no prescriptions, diagnosis or automatic activity-safety decision / السجل الصحي بدون وصف علاج أو تشخيص أو قرار أمان تلقائي |
| vaccinations.status | Existing vaccine record, no inferred national schedule / سجل المطاعيم الحالي بدون استنتاج جدول وطني |
| feeding.milk, feeding.solids, feeding.meals, feeding.preferences, feeding.difficulty | Health-note entry; no inferred diet or swallowing instructions / ملاحظات صحية بدون استنتاج حمية أو تعليمات بلع |
| sleep.pattern, sleep.naps, sleep.helps, sleep.hard | Health notes; dedicated sleep log is not implemented / الملاحظات الصحية، سجل النوم المتخصص غير منفّذ |
| play.interests, play.dailyLife, play.communication, play.everydayParticipation | Existing activities; free text retained as background / الأنشطة الحالية والنص كمرجع |
| play.ready-handling, play.ready-turns, play.ready-pretend, play.ready-ideas, play.ready-matching, play.focus, play.level | Existing explicit readiness, skill and difficulty rules / قواعد الجاهزية والمهارات والصعوبة الحالية |
| family.history | Profile reference only; no inherited diagnosis or risk score / مرجع بالملف، بدون تشخيص وراثي أو علامة خطر |
| family.support | Existing appointments and follow-up tools; no automatic booking/sharing / أدوات المواعيد والمتابعة بدون حجز أو مشاركة تلقائية |
| goals.choices | Explicit goal links with reasons / روابط حسب الأهداف المختارة مع توضيح السبب |

أهداف النوم والتغذية توصل للملاحظات الصحية، النطق لدليل مختصي النطق، السلوك لوصف القلق، اللعب للأنشطة، النمو للملاحظات النمائية، و«غير هيك» للملف. التخطي وعدم المعرفة والنصوص الطبية لا تنشئ تشخيصًا أو علامة خطر أو أولوية تلقائية.

Sleep/feeding goals link to health notes, speech to the speech directory, behaviour to concern description, play to activities, growth to milestone observations, and Other to the profile. Skip, Not sure and medical free text do not generate diagnoses, risk scores or inferred priorities.

## التحقق والنطاق / Validation and scope

`tests/parent-phase1.test.cjs` يتحقق من عزل التخزين، القراءة فقط، التصفير، خرائط الأسئلة الأربعين، اللغتين، التطابق الحرفي لدالة الأسئلة مع HEAD، أهداف صريحة، تعبئة الولادة، وعزل معاملات الصور. الاختبارات السابقة تبقى مطلوبة. اختبار المتصفح موجود في `output/parent-phase1-browser-check.cjs` ولقطاته في `output/parent-phase1-qa/`.

`tests/parent-phase1.test.cjs` checks storage isolation, read-only legacy, reset, all 40 mappings, both languages, exact question-function equality against HEAD, explicit goals, birth prefill and photo transactions. Existing regression tests remain required. Browser checks and screenshots are in `output/parent-phase1-browser-check.cjs` and `output/parent-phase1-qa/`.

ملفات التعديل في مسار الأهل فقط، مع اختبار جديد وأدلة تحقق. لا تغيير لملفات المختص أو الإدارة أو الملفات المشتركة. مكتبة الحالات، الأدوات الجديدة، تطوير AI، وتغييرات المراحل 2–9 ليست ضمن المرحلة الأولى وتحتاج موافقة المرحلة التالية.

Changes are confined to parent sources, a new test and verification artifacts. Specialist, Admin and shared sources are unchanged. The conditions library, new tools, AI upgrade and phases 2–9 remain outside this phase and require next-phase approval.

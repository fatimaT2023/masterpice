# إعادة ترتيب تجربة الأهل — الدفعة الأولى

تحديث: اكتملت دفعة اكتشاف مجالات الدعم؛ تفاصيلها في [PARENT-EXPERIENCE-STEP2.md](PARENT-EXPERIENCE-STEP2.md). وصف البنود التالية يوثّق نطاق الدفعة الأولى وقت تسليمها.

تم تنفيذ الرئيسية والتنقّل وبطاقات الخدمات واختصار أدوات العرض. هاد مش تسليم كامل لإعادة التصميم؛ مكتبة مجالات الدعم التفصيلية ومركز الأنشطة الجديد وباقي تحسينات الصفحات لسه خطوات تالية ضمن الخطة.

## تجربة الرئيسية

سبعة أقسام: لمحة الطفل، ثلاث خدمات مقترحة بحد أقصى، خطة اليوم، مداخل مجالات الدعم الـ١١، الأنشطة والأدوات، المتابعة والملاحظات، والمختصون والمتابعة. «شوفوا كل الخدمات» يفتح وجهات الخدمات المتاحة. الفئات الحالية مداخل لخدمات مشتركة، مش صفحات تفاصيل حالات أو أدوات سريرية جديدة.

كل بطاقة تعرّف نوع الخدمة ووظيفتها وإجراءها، والتوصيات توضّح سبب ظهورها. بحساب التوحد تظهر معلومات التواصل واللوحات البصرية والتفضيلات الحسّية؛ النص يوضّح أن الأداة الحسّية المتخصصة غير منفّذة. حسابات النوم والتغذية توصل لإضافة ملاحظات صحية، بدون الادعاء بوجود أدوات متخصصة غير مبنية.

التوصيات تستخدم `RafiqQuestionMap.project` واختيار العيلة الصريح لمسار التوحد. قواعد `activity-matching.js` والعمر المصحّح والجاهزية لم تتغيّر. لا تحليل طبي للنصوص ولا تشخيص أو تعديل لبيانات الطفل من مكوّن العرض الجديد.

## الحفاظ على الموجود

- الاستبيان بأقسامه التسعة ونصه وخياراته وشروط العمر وخرائط الإجابات محفوظ.
- الأزرق والوردي مشتقان من `data-child-appearance` الحالي.
- كل الإضافات بالعربي والإنجليزي، مع اتجاه RTL/LTR وتبديل مباشر.
- المتحكمات القديمة ومصادر السجلات محفوظة؛ العرض القديم للرئيسية مخفي بوضوح عند نجاح العرض الجديد حتى لا تتكرر الكروت والتعليمات.
- تبقى خطوات البداية متاحة اختياريًا من قائمة المساعدة؛ عند طلبها تنتقل لمكان ظاهر بدل أن تُحجب مع العرض القديم.
- الرسائل والتنبيهات والصلاحيات وحدود Free/Plus لم تُلغَ. مكتبة الأنشطة الحالية تظل حسب صلاحية Plus، ونشاط اليوم المجاني متاح من الرئيسية.
- أدوات الديمو داخل قائمة قابلة للطي؛ تنبيه البيانات الوهمية والمؤقتة يبقى ظاهرًا.
- لا تعديل لملفات الإدارة أو المختص أو المصادر المشتركة.

## الملفات

`parent-experience.js` و`.css` للعرض، `parent-dashboard.html` لتحميله، `parent-sidebar.js` و`.css` للتنقّل وترجمته، `parent-preview.html` و`.js` و`.css` لقائمة الديمو، وتعديل محدود في `parent-guidance.js` للحفاظ على المساعدة الاختيارية. اختبار تنقّل قديم كان يفحص صياغة القالب حرفيًا؛ تم تحديثه ليتحقق من الوجهات الجديدة وترتيب الرسائل بعد المختصين.

## التحقق

`tests/parent-experience.test.cjs` يتحقق من التوصيات المحدودة، اللغتين، المجالات الـ١١، الوجهات الموجودة وعدم استنتاج احتياج من النص الطبي. اختبارات المشروع الحالية مطلوبة أيضًا. فحص المتصفح ولقطاته: `../output/parent-experience-browser-check.cjs` و`../output/parent-experience-qa/`.

تم فحص حسابات التوحد والنوم والتغذية والنمو المعتاد والولادة المبكرة والانتباه، تبديل اللغة والثيم، عرض الهاتف 360px والكمبيوتر 1280px، زر كل الخدمات، روابط التنقّل وعدم كتابة بيانات الطفل بالتخزين الدائم. التحقق يشمل المسارات المذكورة، وليس كل تفاعل بكل صفحة.

## English

Step 1 delivers the service-oriented home, unified navigation labels and collapsible demo controls. Seven sections surface up to three recommendations from explicit family goals/support choices, meaningful existing actions and honest availability descriptions. Existing questionnaires, mappings, activity rules, records, access and subscription limits remain intact. Blue/pink child themes and live AR/EN RTL/LTR are preserved.

The current 11-category gateways link to existing shared services; searchable condition details and the redesigned activity hub are still next steps. Dedicated condition-tool development is not part of this delivery. Old dashboard controllers remain authoritative for data; their previous presentation is hidden once the new view succeeds. Optional onboarding help remains available on request.

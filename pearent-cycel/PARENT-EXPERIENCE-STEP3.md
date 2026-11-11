# مركز الأنشطة والأدوات — الدفعة الثالثة

تحديث: اكتملت دفعة توحيد المتابعة والمختصين؛ التفاصيل في [PARENT-EXPERIENCE-STEP4.md](PARENT-EXPERIENCE-STEP4.md).

صار `activities.html` مركزًا للأنشطة بدل قائمة Plus المنفصلة. الأنشطة الـ٤٩ الحالية ومصادرها وخطواتها وقواعد الملاءمة ما تغيّرت. ما أضفنا أنشطة علاجية أو أدوات حالات جديدة.

## الأقسام

- **لطفلكم:** مقترحات حسب العمر النمائي والجاهزية المسجّلة وقواعد المطابقة الموجودة.
- **تصفّح الأنشطة:** بحث عربي/إنجليزي وفلاتر لعمر الطفل أو عمر آخر، هدف المهارة، والملاءمة الحالية أو خيارات يقودها مقدّم الرعاية. نتائج الأنشطة مقسّمة لتسعة بكل صفحة.
- **المحفوظات:** إضافة وإزالة علامات حفظ، مستقلة لكل حساب ولكل طفل. الحفظ مش تسجيل إنجاز ولا بغيّر السجل.
- **سجل التجارب:** قراءة سجلات `daily-moment` الحالية وردود الأهل، مع رابط للملاحظات المحفوظة. تجربة «جرّبناه» أو «لبعدين» أو «مش مناسب إلنا» ما تتحوّل لدرجة نمو.
- **الأدوات والموارد:** فصل الأداة البصرية وملف التواصل عن الدليل التعليمي وخدمة المختص. الأدوات التي تتطلب اختيار دعم التوحد لا تُفعّل تلقائيًا.

## التفاصيل والتنفيذ

`activities.html?activity=<id>` يفتح تفاصيل النشاط، ونوع المهارة والمدى العمري والحفظ، ثم الخطوات والمصدر وبدء النشاط إذا كان متاحًا. التنفيذ وتسجيل الرد يظلان في `daily-activity.html` باستخدام المتحكم الحالي. بعد الحفظ يظهر الرد في سجل المركز وفي الملاحظات النمائية.

تصفّح عمر آخر لا يغيّر عمر الطفل أو يتجاوز الجاهزية أو توجيه مختص فعّال أو استبعاد «مش مناسب إلنا». نشاط اليوم مجاني، والأنشطة الإضافية حسب Plus. بيانات العناوين متاحة للاستكشاف؛ التفاصيل والخطوات والبدء تبقى مقيّدة بالإتاحة. السجلات السابقة تبقى محفوظة، وصلاحية تحديث سجل اليوم تتبع القواعد الحالية.

تمت معالجة الرابط المرفوض في `daily-moment-ui.js`: يظهر سبب عدم الإتاحة ورابط للرجوع، بدل الاستمرار بنشاط اليوم كأنه النشاط المطلوب.

## الترجمة والملفات

`activity-hub-model.js` للعرض والحفظ والفلاتر، و`activity-hub.js` و`.css` للواجهة. `activity-hub-ar.js` يستكمل النصوص العربية الناقصة من الأنشطة الموجودة ويُحمّل في المركز وصفحة التنفيذ؛ لا يعدّل نصوص الأنشطة الإنجليزية أو قواعدها. يتم تبديل النصوص والاتجاه مباشرة، مع بقاء مدخلات الأهل كما كتبوها والثيم الأزرق/الوردي الحالي.

علامات الحفظ تستعمل `rafiqSavedActivities_<account>_<child>` عبر محوّل التخزين المؤقت الحالي. اختيار فكرة اليوم قد يحدّث تعيين اليوم الموجود أصلًا؛ تصفّح المركز لا يسجّل استجابة نشاط تلقائيًا. البيانات غير الصالحة لا تُستبدل تلقائيًا، وأخطاء القراءة والحفظ تظهر بدون حذف السجلات.

## التحقق والحدود

نجحت ملفات الاختبار الـ٢٥. `tests/activity-hub.test.cjs` يتحقق من Free/Plus والعمر والجاهزية والاستبعادات وعزل المحفوظات وعدم تعديل السجل وحماية البيانات غير الصالحة.

`../output/activity-hub-browser-check.cjs` تحقق من المحفوظات والرجوع إلها، تفاصيل Plus ثم البدء والحفظ الفعلي وظهور الملاحظة بالسجل، الفلاتر، قيد Free، الروابط غير الصالحة، الأدوات، اللغتين وعرض 1280px و360px. فحص قاموس الترجمة يشمل عناوين الأنشطة الـ٤٩ وأوصافها وخطواتها ومدتها وأدواتها ونصوص العناية. اللقطات في `../output/activity-hub-qa/`.

الفحص للمسارات المذكورة، مش لكل تفاعل بكل صفحة. الأنشطة الحالية أفكار لعب وليست اختبارات أو علاجًا، وما في AI أو دفع حي جديد. ما تغيّرت مصادر المختص أو الإدارة أو الملفات المشتركة. الخطوة التالية هي توحيد عرض المتابعة والتقارير والمختصين ومراجعة الرحلة كاملة؛ بناء أدوات جديدة لكل حالة يظل خارج إعادة ترتيب الواجهة الحالية.

## English

The activity hub combines existing recommendations, a searchable/filterable catalogue, per-account/per-child bookmarks, recorded activity history and clearly typed tools/resources. Existing 49 play ideas, matching rules, consent-based specialist limits, age/corrected-age handling and subscription gates remain authoritative.

Details use the existing `activities.html?activity=` route and execution still uses `daily-activity.html`. A rejected activity request now shows an unavailable state rather than silently substituting another activity. Bookmarks never mark activities complete or rewrite observations. Missing Arabic play copy is supplied locally without altering the English activities. Existing RAM-preview persistence limits still apply.

All 25 test files passed, plus isolated-browser checks for the documented workflow, translation coverage, access gates and responsive layouts. No dedicated new clinical tools, server persistence, live AI or live payments are added here.

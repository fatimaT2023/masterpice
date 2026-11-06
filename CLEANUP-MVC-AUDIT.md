# جرد التنظيف قبل النقل إلى MVC

تم فحص 357 ملفًا خارج مجلد Git، منها 58 صفحة HTML. الفحص ساكن للروابط وتحميل السكربتات والستايلات والاستيرادات؛ ليس إثباتًا لاستخدام كل ميزة داخل المتصفح. لم يتم حذف أو نقل أي ملف من التطبيق.

## القرار السريع

- لا توجد قائمة كبيرة من صفحات يمكن حذفها مباشرة. أغلب الصفحات لها روابط أو مراجع في الكود.
- صفحة تجربة مستقلة بلا رابط وارد: `rafiq-home-transfer-20261013-211454/baby-3d.html`.
- أداة اختبار بلا رابط وارد: `piblic-pages/demo-accounts.html`. تبقى مفيدة لتجهيز حسابات التجربة، لكنها ليست صفحة إنتاجية.
- صفحة أنشطة قديمة محتملة: `pearent-cycel/challenges.html`. المسار الحالي هو `daily-activity.html`، والمكتبة الإضافية هي `activities.html`؛ هاتان ليستا صفحتين مكررتين.
- `piblic-pages/index.html` و`piblic-pages/about.html` نسختان عامتان تحتاجان توحيدًا، لكنهما ما زالتا مرتبطتين من صفحات فعلية. لا تحذفيهما قبل تعديل المراجع.

## مرشحات الأرشفة

### تجربة 3D

المجموعة التالية تخص التجربة المستقلة حسب المراجع النصية الحالية:

- `rafiq-home-transfer-20261013-211454/baby-3d.html`
- `rafiq-home-transfer-20261013-211454/baby-3d.js`
- `rafiq-home-transfer-20261013-211454/baby-scroll-motion.js`
- `rafiq-home-transfer-20261013-211454/vendor/three.module.js`
- `rafiq-home-transfer-20261013-211454/vendor/three.core.js`

ابدئي بأرشفتها في Git خارج ملفات النشر، ثم افحصي الهوم. لا تنقلي صور الشخصية معها؛ مثل `assets/hero/sit-front-cutout.png` مستخدمة في الدخول والتسجيل والإعداد.

### سكربتات وستايلات لم أجد تحميلًا أو مرجع اسم لها من كود آخر

- `pearent-cycel/milestones.js`
- `pearent-cycel/parent-dashboard-background.js`
- `pearent-cycel/parent-dashboard-photo.css`
- `pearent-cycel/screening.js`
- `piblic-pages/legal-modal.css`
- `piblic-pages/legal-modal.js`

هذه مرشحات مراجعة وأرشفة، وليست ملفات حُذفت. البدائل الحالية للملاحظات والقلق هي `growth-journal.js` و`screening-flow.js`. وجود اسم قديم لا يعني حذف صفحة `milestones.html` أو `screening.html` نفسها. اختبري نوافذ الشروط والخصوصية قبل أرشفة ملفات `legal-modal`.

### صفحة الأنشطة القديمة

`challenges.html` تحمل `challenges.js` و`challenges.css`. لا يوجد رابط تنقل حالي إليها، لكن توجد مراجع في:

- `age-context.js`: شروط ومعالجة الصفحة القديمة.
- `parent-sidebar.js`: قائمة تسجيل آخر زيارة.
- `today-model.js`: خريطة الاستكمال؛ وقد توجد آخر زيارة محفوظة عند مستخدم على هذا المسار.

قبل الأرشفة: وجّهي استكمال الصفحة القديمة إلى `daily-activity.html`، وأزيلي شروطها غير المطلوبة، ثم أرشفي الثلاثة معًا. لا تحذفي بقية ملفات العمر أو التنقل المشتركة.

## ملفات لا تُحذف بسبب تشابه الاسم

- `pearent-cycel/payment.html`: تفتحها `subscription.js` للدفع الخاص بالاشتراك.
- `daily-activity.html`: تجربة النشاط المجاني والإضافي، والحفظ والتفاعل.
- `activities.html`: مكتبة اختيار أنشطة Plus؛ ليست نسخة من صفحة التنفيذ.
- `clients.html`: سجل الاستشارات، و`follow-up.html`: الأطفال المرتبطون بمتابعة مستمرة. الحجز لا يعني متابعة مستمرة.
- `schedule.html`: عرض الجدول، و`specialist-bookings.html`: إدارة الحجوزات. يمكن توحيد واجهتهما لاحقًا، لكن كليهما مستخدم.
- `booking-details.html` و`consultation.html` و`report-form.html`: تفاصيل الموعد، تنفيذ الجلسة، ثم التقرير.
- `meetingZoom/index.html`: روم Jitsi المرتبطة بالموعد.

## تحذير مهم بخصوص المجلدات

مجلد `rafiq-home-transfer-20261013-211454` ليس نسخة احتياطية مهملة. منه الهوم الحالية، وملف `home-ar.js` له 56 مستهلكًا مباشرًا في الصفحات. الدخول والتسجيل وصفحات الخدمات تستخدم ملفاته وصوره.

مجلد `piblic-pages` يحتوي الدخول والتسجيل والثيم والخطوط وملفات مشتركة. ومجلد `shared` يحتوي صلاحيات الحسابات والمحادثات والمتابعة والاشتراك والروم والترجمة؛ لا يُحذف أي منهما بالكامل.

`.video-review` يحتوي 5 صور مراجعة بلا مراجع تطبيقية ظاهرة؛ يُستبعد من النشر ويمكن الاحتفاظ به كتوثيق. ملفات Markdown وREADME وتقارير الفحص تبقى في المستودع وخارج مجلد النشر. لا تمسّي `.git`.

## الأهل

| الصفحة | القرار |
|---|---|
| `pearent-cycel/activities.html` | احتفظي بها |
| `pearent-cycel/ai-assistant.html` | احتفظي بها |
| `pearent-cycel/album.html` | احتفظي بها |
| `pearent-cycel/booking.html` | احتفظي بها |
| `pearent-cycel/bookings.html` | احتفظي بها |
| `pearent-cycel/challenges.html` | قديمة محتملة؛ افصلي المراجع أولًا |
| `pearent-cycel/child-profile.html` | احتفظي بها |
| `pearent-cycel/daily-activity.html` | احتفظي بها |
| `pearent-cycel/getting-started.html` | احتفظي بها |
| `pearent-cycel/health.html` | احتفظي بها |
| `pearent-cycel/messages.html` | احتفظي بها |
| `pearent-cycel/milestones.html` | احتفظي بها |
| `pearent-cycel/onboarding.html` | احتفظي بها |
| `pearent-cycel/parent-dashboard.html` | احتفظي بها |
| `pearent-cycel/payment.html` | احتفظي بها |
| `pearent-cycel/screening.html` | احتفظي بها |
| `pearent-cycel/settings.html` | احتفظي بها |
| `pearent-cycel/specialist-report.html` | احتفظي بها |
| `pearent-cycel/specialists.html` | احتفظي بها |
| `pearent-cycel/subscription.html` | احتفظي بها |

## المختص

| الصفحة | القرار |
|---|---|
| `specialist-cycle/availability.html` | احتفظي بها |
| `specialist-cycle/booking-details.html` | احتفظي بها |
| `specialist-cycle/clients.html` | احتفظي بها |
| `specialist-cycle/consultation.html` | احتفظي بها |
| `specialist-cycle/earnings.html` | احتفظي بها |
| `specialist-cycle/follow-up.html` | احتفظي بها |
| `specialist-cycle/messages.html` | احتفظي بها |
| `specialist-cycle/profile.html` | احتفظي بها |
| `specialist-cycle/report-form.html` | احتفظي بها |
| `specialist-cycle/schedule.html` | احتفظي بها |
| `specialist-cycle/specialist-bookings.html` | احتفظي بها |
| `specialist-cycle/specialist-dashboard.html` | احتفظي بها |
| `specialist-cycle/specialist-onboarding.html` | احتفظي بها |
| `specialist-cycle/specialist-settings.html` | احتفظي بها |

## الأدمن

| الصفحة | القرار |
|---|---|
| `admin-cycle/admin-dashboard.html` | احتفظي بها |
| `admin-cycle/admin-settings.html` | احتفظي بها |
| `admin-cycle/ai-governance.html` | احتفظي بها |
| `admin-cycle/appearance.html` | احتفظي بها |
| `admin-cycle/billing-management.html` | احتفظي بها |
| `admin-cycle/bookings-management.html` | احتفظي بها |
| `admin-cycle/content-management.html` | احتفظي بها |
| `admin-cycle/reports-analytics.html` | احتفظي بها |
| `admin-cycle/specialist-approvals.html` | احتفظي بها |
| `admin-cycle/specialists-management.html` | احتفظي بها |
| `admin-cycle/support-requests.html` | احتفظي بها |
| `admin-cycle/users-management.html` | احتفظي بها |

## الصفحات العامة

| الصفحة | القرار |
|---|---|
| `piblic-pages/about.html` | نسخة عامة تحتاج توحيد الروابط أولًا |
| `piblic-pages/demo-accounts.html` | أداة اختبار؛ لا تُنشر بالإنتاج |
| `piblic-pages/forgot-password.html` | احتفظي بها |
| `piblic-pages/help-center.html` | احتفظي بها |
| `piblic-pages/index.html` | نسخة عامة تحتاج توحيد الروابط أولًا |
| `piblic-pages/login.html` | احتفظي بها |
| `piblic-pages/register.html` | احتفظي بها |

## الهوم الحالية

| الصفحة | القرار |
|---|---|
| `rafiq-home-transfer-20261013-211454/about.html` | احتفظي بها |
| `rafiq-home-transfer-20261013-211454/baby-3d.html` | تجربة مستقلة مرشحة للأرشفة |
| `rafiq-home-transfer-20261013-211454/contact.html` | احتفظي بها |
| `rafiq-home-transfer-20261013-211454/index.html` | احتفظي بها |

## غرفة الجلسة

| الصفحة | القرار |
|---|---|
| `meetingZoom/index.html` | احتفظي بها |

## النقل إلى MVC بدون كسر المشروع

1. احتفظي بنسخة Git مستقرة وفرع مستقل للنقل. ابدئي بأرشفة المرشحات فقط، وليس حذف مجموعة مجلدات.
2. ثبتي الهوم العامة المطلوبة. استبدلي روابط النسخة القديمة قبل أرشفتها؛ إعدادات الأدمن وصفحة المساعدة وصفحات أخرى ما زالت تشير إلى `piblic-pages/index.html`.
3. إذا كان الهدف ASP.NET MVC: انقلي هيكل HTML إلى Views حسب Public / Parent / Specialist / Admin / Meeting. انقلي CSS وJS والصور وملفات الفيديو إلى مجلد الأصول الثابتة المناسب، مثل `wwwroot` في ASP.NET Core. المسارات المقترحة تنظيمية وليست ملفات تم إنشاؤها.
4. اجمعي التنقل المشترك في Layout/Partial لكل دور، مع الاحتفاظ بمعرّفات العناصر التي تعتمد عليها السكربتات. ملفات `parent-sidebar.js` و`specialist-sidebar.js` و`admin-sidebar.js` تنشئ واجهات حاليًا؛ لا تشغّليها لإنشاء نسخة ثانية من Layout جديد.
5. استبدلي روابط `.html` وتحويلات `location` ومسارات المحادثات والتقارير بروابط Routes/Actions الجديدة. البحث يجب أن يشمل JavaScript وCSS، لا HTML فقط. ملف CSV المرفق يحفظ السكربتات والستايلات الحالية لكل صفحة.
6. احتفظي بترتيب تحميل السكربتات؛ ملفات الصلاحيات يجب أن تُحمّل قبل استخدام خدماتها، وقواميس الترجمة قبل `site-language.js`.
7. انقلي مصدر البيانات خطوة خطوة من localStorage/IndexedDB إلى خدمات الباك إند. لا تغيّري أسماء المفاتيح ثم تتوقعي ظهور البيانات القديمة تلقائيًا.
8. تغيير المنفذ أو الدومين يجعل تخزين المتصفح القديم غير ظاهر للتطبيق الجديد؛ حسابات التجربة وصور IndexedDB لا تنتقل بمجرد نسخ ملفات المشروع. جهزي بيانات اختبار أو عملية ترحيل متعمدة.
9. اختبري بعد كل خطوة: الدخول والأدوار والتعطيل، الطفل، النشاط والملاحظات، الحجز والروم والتقرير، مشاركة السجل، ثم الصحة والذكريات والاشتراك والأدمن.

## حدود هذا الجرد

المراجع النصية قد تشمل تعليقات أو خرائط صفحات قديمة، وبعض المسارات تُنشأ ديناميكيًا أو تُحفظ في بيانات المتصفح. لذلك تم تصنيف الصفحات القديمة كمراجعة لا كحذف آمن. لم تُجرَ إعادة تسمية أو تغيير مسارات أو تنظيف فعلي أثناء إعداد الجرد.

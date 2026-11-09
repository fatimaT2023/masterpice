# تجربة حسابات العائلة في رفيق

حساب مستقل لكل ولي أمر، وملف واحد لكل طفل. المظهر حسب الطفل المختار.

## تجربة أمام الكوتشات

1. افتح حساب الأب وأضف طفلًا، ثم افتح ملفه > إدارة أولياء الأمور.
2. أدخل إيميل الأم وحدد الأطفال المشمولين بالدعوة، ثم أنشئ الدعوة التجريبية.
3. افتح «معاينة الدعوة» في التبويب الجديد، وسجل حساب الأم بالإيميل المدعو واقبل الدعوة.
4. تظهر نفس ملفات الأطفال في سايكل ولي الأمر. إضافة سجل صحي أو صورة أو موعد تظهر للحسابين.
5. افتح الاشتراكات من الأب وفعل الدفع التجريبي. تظهر الباقة فعالة عند الأم أيضًا، ولا يُطلب دفع ثانٍ.
6. الحصة اليومية لمساعد رفيق مشتركة للعائلة؛ محادثة كل شخص خاصة. جرّب مشاركة رسالة محددة في سجل الطفل، ثم افتح الملاحظات من الطرف الآخر.
7. اقرأ إشعار طفل من حساب واحد وتحقق أنه ما زال غير مقروء عند الحساب الآخر.
8. من صفحة الاشتراك، اطلب نقل مسؤولية الفوترة إلى الأم. من حسابها اقبل الطلب. تصبح هي القادرة على إدارة الباقة.
9. ألغ التجديد؛ تبقى المزايا حتى تاريخ الانتهاء وتبقى المواعيد المدفوعة والسجلات بعد الانتهاء.
10. من ولي الأمر الأساسي أرشف طفلًا. من الإعدادات استعد الملف مع سجلاته، مع الالتزام بحد الملفات النشطة في الباقة.

## قواعد المشاركة

- الدعوة تشمل الأطفال المحددين فقط، ولا تكشف تلقائيًا أطفالًا آخرين.
- إضافة طفل إلى عائلة مشتركة توضح مسبقًا أن ولي أمرها الأساسي سيراه؛ البقية يحتاجون دعوة.
- إدارة الدعوات والأرشفة لولي الأمر الأساسي؛ إدارة الباقة لمسؤول الفوترة.
- نقل الفوترة يتطلب قبول الطرف الآخر. لا تُشارك وسائل الدفع أو كلمات المرور.
- الجلسة لها دفعة واحدة منفصلة عن Plus، وأي استرداد يتبع الدفعة الأصلية.
- الإيميل واللغة والإشعارات وطلبات الدعم ومحادثات AI خاصة بالحساب.
- عند إزالة آخر وصول لمسؤول الفوترة، يعود التحكم لولي الأمر الأساسي ويتوقف التجديد مع استمرار الفترة المدفوعة.
- لا تُحذف السجلات عند انتهاء الاشتراك أو إزالة وصول ولي أمر.

## حدود التجربة

هذه واجهة بتخزين محلي في نفس المتصفح والأصل. لا يوجد إرسال إيميلات أو دفع أو تجديد أو استرداد فعلي. المصادقة والتفويض والتحقق من الدفع ومنع العمليات المتزامنة بين الأجهزة مسؤولية الباك إند لاحقًا.

## التحقق

اختبارات المنطق: tests/family-flow.test.cjs وtests/family-entitlements.test.cjs. تعمل ببيانات معزولة ولا تغيّر بيانات المتصفح.

## جهة الأدمن

- افتح إدارة المستخدمين: لكل حساب حالته وزر تعطيله وعائلاته المرتبطة.
- اضغط اسم العائلة أو «عرض العائلة» لرؤية الحسابات والأطفال وروابط كل طفل ومسؤول الفوترة والاشتراك والمواعيد والمدفوعات الإدارية. السجلات الصحية والمحادثات الخاصة لا تُعرض في هذه الصفحة.
- عند التعطيل أدخل السبب وراجع المسؤوليات. اختر بديلًا من الأشخاص الفعّالين المرتبطين بالطفل أصلًا، أو اترك الحالة بحاجة متابعة إذا لا يوجد بديل.
- تعطيل مسؤول الفوترة يعلّق إدارة الدفع ويوقف التجديد مع استمرار الفترة المدفوعة. البديل يستلم طلبًا داخل حسابه ويجب أن يقبله.
- تعطيل أحد الوالدين لا يعطّل الثاني ولا يحذف ملفات الأطفال أو المواعيد.
- إعادة التفعيل تحفظ الروابط، ولا تعيد تلقائيًا مسؤوليات سبق نقلها.
- فلتر «بحاجة متابعة» يعرض المسؤوليات المعلّقة. يمكن تعيين مسؤول طفل مؤهل أو طلب نقل الفوترة لاحقًا.
- سجل الإجراءات يعرض السبب والحساب المنفّذ والتاريخ. تغييرات الأدمن لا تعيد إحياء التجديد تلقائيًا.

اختبار إضافي: tests/admin-families.test.cjs.

## متابعة المختص المستمرة

1. من دليل المختصين أو ملف المختص اختاروا «طلب متابعة». الطلب متاح أيضًا من تفاصيل الموعد والتقرير ومن منطقة المختصين في ملف الطفل.
2. اختاروا الطفل وفئات المشاركة: ملاحظات النمو والقلق و/أو نتائج الأنشطة. السجلات السابقة غير مشمولة افتراضيًا، وتضمينها خيار مستقل. رسالة تعريفية اختيارية واحدة بحد 500 حرف تُرسل مع الطلب.
3. إذا كان المختص يتابع الطفل قبل المنصة، فعّل الخيار وأدخل تاريخ البداية حسب إفادة العائلة. هذا لا يغيّر تاريخ قبول المشاركة على رفيق.
4. من حساب المختص افتح المتابعة المستمرة واقبل الطلب. يظهر الطفل ضمن «الأطفال الذين أتابعهم».
5. سجّل نشاطًا وملاحظة من حساب الأم. تظهر الملاحظة باسمها عند المختص ضمن الفئات التي سمحت العائلة بمشاركتها.
6. يراجع المختص الملاحظة ويختار طلب توضيح أو تعديل نشاط أو اقتراح موعد أو عدم الحاجة لإجراء إضافي، ثم يكتب توصيته ويشاركها.
7. تظهر التوصية للأم والأب في محادثة العائلة، ويصل إشعار. الملاحظة الأصلية لا تتغير ولا يُحجز موعد تلقائيًا.
8. إذا عدّل الأهل الملاحظة، تُعلّم التوصية السابقة بأنها تخص نسخة سابقة وتحتاج الملاحظة مراجعة جديدة.
9. للمشاهدة السريعة، من صفحة متابعة المختص افتح «جرّب مثال متابعة قديمة للطفل». المثال افتراضي بالكامل ولا يضيف بيانات لأطفال حقيقيين.

اختبار المتابعة: tests/ongoing-care.test.cjs.

## الأنشطة والمهارات

من «نشاط مع طفلي» افتح «جاهزية طفلي للأنشطة» وسجّل الجاهزية والمهارات التي ترغب بدعمها. الاقتراح يراعي عمر الطفل ومتطلبات المشاركة، ويشرح سبب الاختيار. تفاصيل توجيه المختص وحدود المطابقة والتجربة في [ACTIVITY-MATCHING.md](ACTIVITY-MATCHING.md).

## محادثات المتابعة وقواعد الإرسال — الخطوة 2د

- الطلب ينشئ المحادثة وطلبًا معلّقًا بعملية واحدة قابلة للتراجع عند فشل التخزين، باستخدام RafiqDirectMessages.start وRafiqCareConnections.change. طلب موجود بحالة pending أو active يُعاد استخدامه دون نسخ أو رسالة تعريف إضافية.
- pending: المختص يرى الطلب والرسالة التعريفية إن وُجدت، دون الوصول للسجلات. لا إرسال عادي من أي طرف قبل القبول. active: المراسلة متاحة للطرفين، والسجلات ضمن الفئات التي اختارتها العيلة فقط. declined وrevoked: الرسائل السابقة تبقى للقراءة، والمراسلة تتوقف؛ يمكن للأهل طلب المتابعة مجددًا.
- حسابا الأهل يشاهدان نفس محادثات الأطفال المشمولين بدعوة العيلة. القراءة وغير المقروء مستقلان لكل حساب، ومحادثات الذكاء الاصطناعي الخاصة ليست جزءًا من مختصّيني.
- المحادثات القديمة بدون متابعة، ومنها المرتبطة بحجز، لا تُحذف وتظهر تحت «محادثات سابقة». الحجز والدفع والجلسة والتقرير مستقلون عن الرسائل، وسياق الموعد والتقرير يبقى قابلًا للفتح من المحادثة القديمة.
- واجهة المختص الحالية ستستقبل حالة pending بنفس مفاتيح المتابعة الحالية، مع requestId جديد للتفريق بين محاولات الطلب. الرسالة الاختيارية رسالة عادية فيها introRequestId وintroRequestAt إضافيان؛ لا يلزم تعديل عرض نص الرسالة. الطلب بدون رسالة يظهر أيضًا في قائمة المتابعات.
- أدوات القبول والاعتذار الحالية تستمر. بعد القبول تُتاح المراسلة؛ قبل القبول وبعد الرفض أو الإيقاف معطّلة. صندوق المختص في الملفات المشتركة يبقي المحادثات القديمة للقراءة، بينما فرز «الحالية/السابقة» الجديد خاص بواجهة الأهل. إشعارات الرسائل والتوصيات باقية، ويوجد إشعار طلب متابعة جديد مع specialistId ورابط المحادثة.
- لم تُعدّل ملفات specialist-cycle أو admin-cycle أو meetingZoom. تغييرات shared محصورة بقواعد الإرسال والطلب ومعرفة الحالة والواجهة المشتركة والترجمة، مع الحفاظ على بيانات المحادثات والتقارير الحالية. التطبيق ما يزال تجربة محلية؛ الصلاحيات والمعاملات المتزامنة الحقيقية تحتاج الخادم كما سابقًا.

## Support mode (A1)

Family-selected support mode is stored per child as supportProfile version 1. Both linked parents can change or clear it; clearing preserves supportData. Saves re-read the accessible child and reject a stale support answer. Existing family access and child quota rules are retained. The setting is not consumed by AI, booking notes, messages, concern drafts or specialist views.

The shared optional question opens after basics in onboarding, from the child profile and from the dismissible home invitation. Home dismissal stores skipped; profile can reopen it. Only explicitly selected autism focus with diagnosed_no_followup or diagnosed_following enables tools. Other choices retain the ordinary experience and show a warm explanation.

support-services.js holds availability and review metadata. Only find-specialist is currently available; About-me waits for A2, so unavailable steps are skipped. child.supportData.completedServices supplies future completion without losing existing next-step fallback. Draft labels default on. See pearent-cycel/SUPPORT-CONTENT-GUIDE.md for language, privacy and review rules.

Directory filtering searches published specialty, bio, areas and publicProfile.approach. The visible label says mentions autism, without claiming experience; active support mode shows the filter banner and Show everyone control. Request specialist-side publicProfile.focusAreas (autism, speech_language, occupational_therapy, early_intervention); no specialist-cycle edits were made.

Verification: all 17 tests/*.cjs ran successfully with Node v24.17.0, including support-mode.test.cjs. Home in both situations, entry flow and RTL at 360px still need visual verification. No clinical content or treatment recommendations were added.

## Private support journey
child.supportJourney v1 is a family-shared private notebook for visits, confirmed-source home instructions, observations and daily tools. Both parents edit through accessible child reads with stale-write protection and attribution. It is not a specialist permission scope and is not automatically shared, added to messages/booking notes, sent to AI, used for activity selection or logged in notifications. Source reports and bookings are read-only here. See pearent-cycel/PARENT-CYCLE.md for the complete cycle and verification.
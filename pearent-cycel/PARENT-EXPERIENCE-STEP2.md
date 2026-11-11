# مكتبة مجالات الدعم — الدفعة الثانية / Support discovery

تحديث: اكتملت دفعة مركز الأنشطة والأدوات، وتفاصيلها في [PARENT-EXPERIENCE-STEP3.md](PARENT-EXPERIENCE-STEP3.md). البنود التالية توثّق نطاق دفعة مكتبة الدعم وقت تسليمها.

تم ربط «مجالات الدعم» بالتنقّل والرئيسية. الصفحتان `support-areas.html` و`support-detail.html` تستخدمان بيانات `support-catalog-data.js` وعرض `support-catalog.js` و`.css`، مع سجّل الخدمات المشترك من `parent-experience.js`.

## الموجود

- ١١ فئة و٣٢ موضوعًا تمثيليًا، مش موسوعة طبية أو تغطية لكل تشخيص فرعي بالمواصفة.
- بحث عربي/إنجليزي يراعي اختلاف الهمزات والتشكيل، مع فلتر المجال ونوع الموضوع: تشخيصات ومتلازمات، أعراض وصعوبات، مخاوف نمائية، وتحديات يومية.
- ٩ نتائج بكل صفحة بدل عرض كل المواضيع بقائمة طويلة، وتنقّل فعلي للصفحة التالية والسابقة. تغيير البحث أو الفلتر يرجع للصفحة الأولى.
- البحث قبل فئات التصفّح؛ اختيار الفئات قابل للطي على الهاتف. تبديل اللغة يحافظ على اختيارات البحث والفلاتر.
- تفاصيل كل موضوع تربط الخدمات الحالية ونوعها ووظيفتها، ملاحظة صحية للأسئلة، المواعيد، موضوع دليل المختصين ومواضيع من نفس المجال.
- مسارات أدوات التوحد التي تتطلب اختيار العيلة لا تتفعّل تلقائيًا من التصفّح. بدل ادّعاء الإتاحة، يظهر رابط لمراجعة اختيارات الدعم بالملف.
- روابط الرجوع للرئيسية والمكتبة، حالات عدم وجود نتائج والرابط غير المعروف، واتجاهات RTL/LTR والثيم الأزرق/الوردي.

## حدود المحتوى

هذا دليل اكتشاف خدمات، مش تشخيصًا أو خطة علاج أو إحالة طبية. فلتر المختصين ليس تحققًا من ملاءمة مختص بعينه. لا محتوى علاجي أو اختبارات طبية جديدة، ولا تطوير لأدوات المرحلة الثالثة. الخدمات المتخصصة غير المبنية موضّحة، والروابط تفتح الخدمات المشتركة الموجودة. التصفّح لا يغيّر تشخيص الطفل أو أهدافه أو إجاباته ولا يشارك سجلاته.

## التحقق

نجحت ملفات الاختبار الـ٢٤، ومنها `tests/support-catalog.test.cjs` لتغطية الفئات والمواضيع والترجمات والفلاتر والروابط. اختبارات المرحلة الأولى ما زالت تتحقق من بقاء الاستبيان وخرائطه.

فحص المتصفح: `../output/support-catalog-browser-check.cjs`. تم اختبار الدخول المباشر للمكتبة ضمن عرض الأهل، الفئات، البحث بالتشكيل، الفلاتر، التنقّل بين صفحات النتائج، بقاء الفلاتر بعد تبديل اللغة، تفاصيل التوحد وأدواته، رابط ملاحظات النوم، حالات الفراغ والخطأ، وعرض 1280px و360px. لم تتغير سجلات الطفل أثناء التصفّح ولم تُحفظ بالمخزن الدائم. اللقطات في `../output/support-catalog-qa/`؛ فحوص المتصفح تشمل المسارات المذكورة ولا تمثّل اختبار كل تفاعل في كل صفحة.

لا تعديل لمصادر الإدارة أو المختص أو الملفات المشتركة. الخطوة التالية: مركز الأنشطة والأدوات، بما فيه التصفّح والتفاصيل والحفظ والسجل، مع الحفاظ على قواعد الملاءمة وFree/Plus.

## English

The second redesign step adds 11 support categories and 32 representative topics, bilingual search/filtering, paginated results and topic details connected to existing services and directory filters. It is service-discovery metadata, not a clinical encyclopedia, diagnosis, referral or treatment plan. Browsing neither infers nor changes a child's condition, goals or answers. Autism-only tools remain gated by the family's explicit support choice.

Existing questionnaire and service models remain intact. New routes are supported by the RAM preview and shared parent navigation. AR/EN, RTL/LTR, empty/invalid states and child themes are preserved. Twenty-four test files passed and isolated-browser checks cover the paths described above. The activity hub and dedicated new condition tools are not implemented in this step.

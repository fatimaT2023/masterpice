# نقل صفحة RAFIQ إلى المشروع الأصلي

هذه نسخة كاملة من الحالة الحالية للصفحة، مع ملفات الأنميشن والتنسيقات والصور، بدون ملفات التجارب ومخرجات المعاينة.

## شو تنقل بالضبط؟
انقل كل محتويات هذا المجلد إلى مجلد واحد داخل المشروع الأصلي، مثلاً public/rafiq-home/.
احتفظ بمجلد assets كما هو، بجانب index.html، وبنفس أسماء ملفات CSS وJS.
إذا المشروع الأصلي HTML عادي، افتح صفحة rafiq-home/index.html من السيرفر المحلي للمشروع.
إذا المشروع React / Next / Vue / Laravel، هذه نسخة مستقلة جاهزة للعرض؛ دمجها داخل مكوّن أو قالب يحتاج تكييف حسب المشروع.
لا تستبدل index.html الرئيسي للمشروع الأصلي عشوائياً.

## مهم حتى يضل كل شيء شغال
- انقل index.html بالكامل: فيه CSS داخل وسم style بالإضافة إلى ملفات CSS الخارجية، والنافبار والمحتوى ونوافذ الحوار.
- حافظ على class="rafiq-home" على body، وعلى جميع IDs وdata attributes.
- حافظ على ترتيب تحميل CSS والـJavaScript كما هو في index.html، وعلى defer للسكربتات.
- حافظ على المسارات النسبية assets/hero/ وassets/growth/ وباقي assets.
- لا تشغّل سكربتات الصفحة مرتين عند الدمج في إطار عمل؛ بعض السكربتات تنشئ observers ونسخاً إضافية للكروسل.
- الخطوط الحالية تُحمّل من db.onlinewebfonts.com وتحتاج اتصال إنترنت؛ ملفات الخطوط ليست محلية.
- هذه واجهة استعراضية: التسجيل والحجز والدفع والنشرة البريدية ليست مرتبطة بخدمات فعلية. لا تفترض أن النقل يربطها تلقائياً.

## وين تكمل التعديل والأنميشن؟
- index.html: النصوص، البنية، روابط الأقسام، التنسيقات الداخلية.
- style.css وcinematic.css وscript.js: الأساس العام والنافبار والقوائم ونوافذ الدخول.
- hero.css وhero.js: الهيرو وحركة الطفل.
- growth.css وgrowth.js: قصة نمو الطفل.
- solution.css وsolution.js: Together in one place وبالونات المحادثة.
- features.css وfeatures.js: كروسل الميزات الأفقي.
- rafiq-journey.css وrafiq-journey.js: How It Works.
- parents.css وparents.js: لوحة الأهل.
- completion.css وcompletion.js: المختصون والحجز والثقة والخطط وFAQ والـCTA النهائي.
- footer.css وfooter.js: الفوتر الأخضر.

## بعد النقل
شغّل سيرفر التطوير في المشروع الأصلي وافتح الصفحة. جرّب النافبار، الكروسل، حركة الطفل، الـFAQ، عرض الموبايل وتفضيل تقليل الحركة.
لدمجها مباشرة داخل المشروع الأصلي، يلزم تحديد مساره وتقنيته أولاً.

## ترتيب CSS الحالي
style.css
cinematic.css
hero.css
growth.css
solution.css
rafiq-journey.css
features.css
parents.css
completion.css
footer.css

## ترتيب JavaScript الحالي
script.js
hero.js
growth.js
solution.js
rafiq-journey.js
features.js
parents.js
completion.js
footer.js
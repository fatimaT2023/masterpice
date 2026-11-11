# Parent Phase 1 — verification / تحقق المرحلة الأولى

Date: 2026-11-10. Local-only changes; no deployment.

- All 21 `tests/*.cjs` files passed, including the 20 pre-existing regression suites.
- `tests/parent-phase1.test.cjs` compares the entire questionnaire function against Git HEAD: wording, options, ordering and age branches match exactly. It also checks all 40 mappings, explicit goal selection, birth-prefill precedence, RAM storage, legacy write rejection and album transaction isolation.
- `output/parent-phase1-browser-check.cjs` passed in isolated headless Edge with a local HTTP server. It exercises direct-page entry, three fictional profiles, goal selection, inner navigation, Arabic/English switching, RTL/LTR, birth prefill, health-note deep link, an outside-service boundary, Blob album storage, legacy read-only mode, reset, new-child creation, Unknown, Previous and Save for later.
- Persistent child records were unchanged by temporary input. A synthetic pre-existing account was used for read-only checks. Native IndexedDB did not receive the demo Blob database. Native language preferences are deliberately allowed.
- Runtime exceptions collected from the host and iframe: none.
- Layout checks at 1280px and 360px; screenshots inspected for the existing colors/cards, readable bilingual labels and the new goal/hint cards. Screenshots use an explicit viewport clip because Edge's full-page capture misaligns RTL content after resizing.
- `git diff --check` passed. Specialist, Admin and shared source directories are unchanged.

مرّت ملفات الاختبار الـ21 واختبار المتصفح ببيانات وهمية. راجعنا لقطات الكمبيوتر والهاتف، واللغتين والاتجاهين، وعدم تغيير الأسئلة. إدخالات التجربة وصورها لم تنتقل للتخزين الدائم، والسجلات السابقة لم تتغيّر. تغيير اللغة وحده يُحفظ كتفضيل.

## Evidence / الأدلة

- [English desktop](parent-phase1-qa/dashboard-en-desktop.png)
- [Arabic mobile](parent-phase1-qa/dashboard-mobile.png)
- [Explicit goal links](parent-phase1-qa/goal-links-mobile.png)
- [Question purpose hint](parent-phase1-qa/question-mobile.png)
- [Legacy read-only](parent-phase1-qa/legacy-mobile.png)
- [Empty Free family](parent-phase1-qa/new-family-mobile.png)
- [New child profile](parent-phase1-qa/created-profile-mobile.png)

## Limits / الحدود

This validates Phase 1 and the exercised paths, not every page interaction or the later roadmap. Temporary data is lost on outer reload/close. Old persistent records are retained, not secured by the preview. Cross-service account invitations and live specialist/admin collaboration do not share this in-memory demo. Production storage, live AI/payments and phases 2–9 are not implemented here. Browser verification requires a local HTTP server, not `file://`.

التحقق للمرحلة الأولى والمسارات المذكورة فقط. تحديث صفحة العرض الخارجية أو إغلاقها يفقد بيانات التجربة. التخزين القديم ما صار آمنًا بسبب العرض. دعوات الحساب والخدمات الخارجية ما بتشارك ذاكرة العرض. التخزين الإنتاجي وAI والدفع الحي والمراحل 2–9 خارج هذا التسليم. افتحوا المشروع بخادم محلي مثل Live Server.

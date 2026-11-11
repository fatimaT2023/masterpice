# Presentation fixtures QA — 2026-11-10

Login repair: the login page now loads the showcase registry/installer. A missing whitelisted demo account is prepared on first sign-in; ordinary accounts keep their previous behaviour. Existing accounts and password verifiers are not overwritten. Browser regression now clears the demo account registry before signing in and uses a sufficiently long incorrect password to exercise password verification rather than just the minimum-length validator.

Prepared 16 bilingual representative cases for the planned 11 categories, with the six priority topics first. This is presentation data and account routing, not an implementation of the conditions library or every condition-specific tool.

Changed sources:

- `pearent-cycel/demo-cases.js`: fictional per-account child/history/goals/health/observations, corrected-age case and autism passport/visit/board/report fixtures.
- `pearent-cycel/parent-preview-data.js`, `parent-preview.html`, `parent-preview.js`: load fixtures, map installed demo identities to the correct scenario, add scenario options and the account-guide link.
- `piblic-pages/demo-showcase.html`, `.css`, `.js`, `demo-showcase-accounts.js`: bilingual setup, credentials and case-specific walkthroughs. Installation is explicit, additive and account-only.
- `piblic-pages/login.js`: prefill a fictional showcase email supplied by the account page; existing password verification and role flow remain in use.
- `tests/demo-showcase.test.cjs`, parent notes and presentation guide.

Verification:

- All 22 test files passed. The new suite checks 16 distinct bilingual cases, account ownership, goals, dates, prematurity, autism report links/stage, salted password verification, idempotent setup, collision rejection and preservation of existing child storage.
- `output/demo-showcase-browser-check.cjs` passed in an isolated Edge profile over local HTTP. Tested setup, wrong/right passwords, actual login routing for autism and premature accounts, all 16 scenario switches, autism service pages, the fictional report, selecting and confirming its source for home practice, reset, corrected age and AR/EN pages at 1280px/360px.
- Native storage did not receive child histories, health notes, observations or reports. Only fictional account identities/verifiers and permitted language preferences are persisted by setup/preview. Existing authentication session handling remains the application's current frontend demo flow.
- No collected host/iframe runtime exceptions. `git diff --check` and syntax checks passed. Screenshots inspected in `demo-showcase-qa/`.

تم اختبار الحسابات والدخول وربط الحالة الصحيحة، التقرير ومصدر التوصية، التصفير، العمر المصحّح واللغتين والهاتف. البيانات وهمية. تثبيت الحسابات يتم بزر «تجهيز حسابات العرض» في المتصفح المستخدم للعرض؛ الاختبارات الآلية استعملت متصفحًا منفصلًا، ولم تثبّت الحسابات في متصفح المستخدم.

Limits: no live AI/payments, no real clinical guidance, no server authentication, and no cross-session specialist/admin synchronization of RAM fixtures. Most non-autism cases use the current shared tools; their dedicated tools are still planned. Outer reload/close loses edits and rebuilds the case. See `DEMO-SHOWCASE-GUIDE-AR-EN.md` for the complete credentials and presentation script.

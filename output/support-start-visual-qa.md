# A3 verification

All 19 tests/*.cjs passed with Node v24.17.0, with previous test files unchanged. New coverage is in tests/support-start.test.cjs. Changed JavaScript syntax checks and git diff --check passed.

A real isolated headless Edge session verified:
- Arabic checklist tabs at 360px without horizontal overflow; manual save, exact period resume and automatic About completion.
- Chooser mapping to directory specialty URLs; custom questions retained locally.
- Directory topic selection and visible literal-mention banner; Show everyone; six specialist-role cards in a dialog; precise absent-type filtering with zero results rather than silently showing other types.
- First-week progress and next step on home; A2 next link; specialist questions link; existing family invitation dialog/form.
- Inactive support state hides guidance, home progress and directory role entry point.
- Arabic print-media captures and PDFs: all 17 checklist steps across three A4 pages, and the sample My questions list on one A4 page. Navigation and chooser controls do not print. RTL screenshots were visually inspected.

Artifacts use synthetic data and are in output/support-start-qa/. No real messages, invitations, appointments or external shares were sent. Physical printer output and assistive-technology behavior were not verified. No Jordan resource entries are present or shown. All supplied content remains draft pending specialist review.

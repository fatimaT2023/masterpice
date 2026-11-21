# Phase 3 Home: QA report

Run on 11 Nov 2026 with `output/parent-home-phase3-qa-matrix.cjs`. Headless Edge, the demo preview, and no product code changed during QA. Raw results are in `parent-home-phase3-qa-matrix/results.json`, with screenshots in the same folder.

**397 checks: 352 passed, 45 failed.** All 45 failures fall into four causes, described below.

## Coverage

| Scenario | Demo | Runs |
|---|---|---|
| 1. Diagnosed (autism) | case-autism (boy) | EN/AR × 1280/360 |
| 2. Concerns, speech delay | case-speech (girl) | EN/AR × 1280/360 |
| 3. General development | case-typical (girl) | EN/AR × 1280/360 |
| 4. Skipped Phase 2 | family (girl, no discovery) | EN/AR × 1280/360 |
| 5. Multiple children | family: 3 children given different answers, one appointment, distinct notes | EN 1280 and AR 360, switching to each child |

## Passed

- **Saved data and personalisation:** 100% across all runs. This covers saved `supportDiscovery` and `supportProfile`, journey, topics shown = saved topics, and services from saved choices only (story goals when skipped). The next step was correct in each scenario: report first for autism, the speech priority for concerns, the activity or an observation for general development, and the support questions when skipped.
- **Trust rules:** 22/22 runs each. No diagnosis label without a reported diagnosis, autism-only tools only when eligible, the next-step service never repeated, why/what/where always present.
- **Multiple children:** 6/6 for each check. Heading, theme and pressed sibling, journey and topics, observation count, and the appointment appearing only for the boy were all correct. No data crossed between children.
- **Themes, layout and stability:** 22/22 runs each. Pink for girls and blue for boys, including the wallpaper. RTL/LTR direction, no horizontal overflow, no JavaScript errors.
- **Internal destinations:** every internal link on every run returned 200 and is allowed by the preview frame.

## Failures

| Cause | Failed runs | Verdict |
|---|---|---|
| Original activity player has untranslated English in Arabic, e.g. “A play idea, not a developmental test”, “Only the age-suitable items…”, and the 0–6-month activity step text | 11/11 Arabic runs | **Real defect.** The player was moved onto Home unchanged; it belongs to Phase 4. |
| External links other than CDC (Sesame Workshop, UNICEF, HSE) | 22/22 | **Check too strict.** They are the activity player's own source and video links, and they open in a new tab with `noopener`. |
| Names in the other language, e.g. a demo child or specialist named in Arabic while the page is English | 7 English + 5 Arabic | **Data, not interface text.** Demo names are stored in the language active when the demo is created. No interface strings were found outside the player. |
| The child's name inside next-step sentences is not wrapped in a direction-isolated span (`bdi`) | Seen in the probe | **Real minor defect.** It can reorder mixed Arabic/English text. The hero heading, sibling chips and support heading are isolated. |

## Not tested

- Tablet widths (only 360 and 1280).
- A real login session (only the demo preview).
- Some next-step branches: the follow-up reminder, age over 7, and an in-progress concern. The appointment-today branch was tested only by Codex's check (EN 1280).
- Screen reader and keyboard-only use.
- Visual review of all 18 matrix screenshots; I reviewed only the earlier set.

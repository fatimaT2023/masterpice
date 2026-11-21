# Parent Cycle — Phase 1: Registration and onboarding

11 November 2026. Phase 1 only. No other parent page was redesigned, and no Specialist, Admin or `shared/` file was changed. Codex's uncommitted work is preserved as it was. Nothing was committed.

## The nine story sections and what each answer does

The nine sections are unchanged. They hold up to 40 questions, depending on the child's age. Every question is optional, and wording, options, order and age rules are byte-identical to `HEAD`; `tests/parent-phase1.test.cjs` enforces this.

| # | Section | Questions | Purpose: where the answer goes |
|---|---|---|---|
| 1 | About your child | 2 | Siblings and main caregiver. Profile context and caregiver options. It never grants anyone access. |
| 2 | Birth | 7 | Term or early, weeks, delivery, weight, length, neonatal care, complications. Profile record. Weight and length go to Health only after a separate confirmation. |
| 3 | Health | 7 | Allergies, conditions, medicines, hospital, hearing and vision checks, care instructions. Health reference. No diagnosis or prescription. |
| 4 | Vaccinations | 1 | Up to date, or review. Links to the vaccine record in Health. |
| 5 | Feeding | 1–5 | Milk under 2 years, solids from 6–24 months, meals, preferences, difficulty. Health notes. No diet is generated. |
| 6 | Sleep | 4 | Pattern, naps, what helps, what is hard. Health notes. |
| 7 | Play and routine | 6–11 | Interests, routine, communication, participation, readiness by age, focus, play level. Drives activity matching. |
| 8 | Family | 2 | Family health history (reference only), previous professional support. |
| 9 | What you'd like help with | 1 | Sleep, feeding, speech, behaviour, play, growth or other. Drives the goal links on Home and the child profile. |

## What changed for the parent

**Before:** one long form with family workspace, plan note, name, birthday, relationship, birth timing and gender, in that order. Gender came last, so the pink or blue theme only appeared at the very end, and accents stayed generic green. The story opened under a support pop-up, showed no map of its sections, and ended in a 40-row list where skipped questions appeared as "Skip".

**After:**

1. **Basics in three short screens** (Name → Birthday → You). Each screen has a tab with a number, then a check once it's done, plus one primary button. Back keeps answers. Enter moves forward and never saves half a profile.
2. **Theme from the first tap.** The page opens in a lilac blend of pink and blue, with both babies shown. Tapping Girl or Boy immediately switches the wallpaper photo, glass, buttons, tabs, brand mark and language toggle to that child's original colours.
3. **A live child card.** Name, age in the page language, and chips (Girl/Boy, Born early, Mother) build up as she answers.
4. **Visual choices** instead of dropdowns: illustrated Girl/Boy cards, icon cards for birth timing (On time / Early / Not sure) and relationship. The original selects stay in the form, so saving is unchanged.
5. **Story with a nine-icon topic map.** Each card shows the topic icon and name, "2 / 7" within the topic, and big tap answers. "Not sure" and "Skip" sit quietly on their own row. Multi-choice questions use checkboxes. "How this answer is used" collapses to a small ⓘ.
6. **Checkpoints between topics:** a check badge, the existing thank-you line, and "Next up: Birth".
7. **Review** with one block per topic: icon, "answered / total", and Edit. Only real answers are listed; skipped questions are hidden and not counted.
8. **Never lost.** A journey bar marks step 1 → 2 → 3. Every screen has Back or Previous. "Saved as you go" explains autosave. "Save and finish later" is always available. On phones the main button is full width and sticks to the bottom.

### Behaviour changes to be aware of

- **The support pop-up no longer opens over question 1.** That optional question is still offered on the next-steps page right after the story (`getting-started.html`), on Home, and on the child profile. Phase 2 will place support discovery after the nine sections.
- **"Back to child profile" is hidden during first-time setup**, because the profile doesn't exist for the parent yet. It still shows when editing from the profile (`return=profile`).
- **The family workspace selector only shows when the parent belongs to more than one family.** The plan note moved next to the save button.

## Files

| File | Change |
|---|---|
| `pearent-cycel/onboarding.html` | Basics rebuilt as three screens and a live child card. Journey bar icons. Shorter story header. All form IDs and names kept. |
| `pearent-cycel/onboarding.js` | Removed the automatic support pop-up. Hides the profile link during first-time setup. Fires an event when returning to the basics. |
| `pearent-cycel/child-history.js` | Render layer only: topic map, counter, quiet Skip, checkpoint, review blocks, per-value answer labels. `questions()` untouched. |
| `pearent-cycel/onboarding-journey.js` | **New.** Screen pacing and validation (same messages as `onboarding.js`), card-to-select sync, live child card, Arabic copy. Writes no data. |
| `pearent-cycel/onboarding-journey.css` | **New.** Visual layer. Old green tokens now follow the child theme. Lilac neutral, icons, mobile layout, reduced motion. |
| `tests/onboarding-journey.test.cjs` | **New.** Story map, counters, Skip handling, checkpoint, review and unchanged saving. |
| `output/parent-onboarding-phase1-browser-check.cjs` | **New.** End-to-end check in headless Edge. |

## Verification

- All 29 test files pass with Node (28 existing + 1 new). JavaScript syntax check and `git diff --check` pass.
- Headless Edge, brand-new demo family, run four times: girl in English at 1280px and 360px; boy in Arabic at 360px and 1280px. Each run checks:
  - lilac to girl/boy theme, using the original wallpaper photos and colours, glass blur, and the brand mark
  - empty name blocked with focus moved; error clears on input; Enter on screen 1 saves nothing
  - birthday over 7 years explained; due date before birth rejected; Back keeps answers
  - relationship required; saved child matches every basics answer
  - no pop-up over the story; nine topics; Previous returns to the basics without creating a duplicate child
  - checkpoint, multi-choice, review with only real answers (Arabic answers fully in Arabic)
  - ends on the next-steps page for that child, which offers the support question
  - no horizontal overflow; no runtime errors
- Edit mode: every screen opens, cards are prefilled from the saved child, a change is saved, and the parent returns to the child profile. Home still shows the support card.
- Results: [results.json](parent-onboarding-phase1-qa/results.json). Screenshots: [parent-onboarding-phase1-qa/](parent-onboarding-phase1-qa/). Files starting with `00-before-` show the old screens.

## Found, not fixed (outside Phase 1)

- **`shared/site-ar.js` has 142 Arabic entries corrupted to "????"**, for example `'Try this activity':'?????? ??????'`. They will show as question marks wherever no other dictionary overrides them. Only the plan-note sentence on onboarding is overridden here. Fixing the file touches a shared file used by Specialist and Admin pages, so it needs your decision.
- **Registration (`piblic-pages/register.html`) was reviewed but not changed.** It is shared with specialist sign-up and already has its own step visual. A new parent goes straight from it to the redesigned onboarding.
- **The onboarding header link reads "Log out" while it behaves as "Save & exit".** The label comes from the shared account script.
- **The child age pill in the story uses the existing question-map wording** ("٨ شهر" rather than "٨ أشهر" in Arabic). I left it because the same function serves Home and the profile.

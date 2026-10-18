# Parent age context and content coverage

Scope: birth until the seventh birthday (0 <= completed calendar months < 84). Six years and eleven months is supported; seven years is outside personalized coverage. Existing older profiles and their appointments, payments, reports and records are not deleted.

## Age source of truth

parent-setup-utils.js supplies calendar age, formatting, support checks, 23 content bands and childContext. Month anniversaries clamp to month ends; calculations use local calendar dates. Birth date remains authoritative; stored ageBandId is a snapshot, never a selector. Services recalculate at use time.

Bands: monthly before 12 months; quarterly from 12 to 24; six-monthly from 24 to 48; yearly from 48 to 84. Bands organize content and are not clinical assessment intervals.

Optional reported prematurity and expected due date are retained in the child profile. Development resources use age from expected due date before chronological age 24 months. No checklist is selected before the due date or when reported prematurity lacks a valid due date. Health and appointment ages remain chronological. No vaccination timetable is changed. Reference: https://www.healthychildren.org/English/ages-stages/baby/preemie/pages/Corrected-Age-For-Preemies.aspx

## Publication metadata

age-content.js records kind, minimum month, exclusive maximum month, source, reviewStatus and reviewer/date. An internal item is eligible only if approved, source-backed, reviewed, the right kind and within range. No item falls back to another age band.

Original CDC resource links are clearly external publisher resources, not internally reviewed Rafiq content. Checklist checkpoint ages: 2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48 and 60 months. The most recent reached checkpoint is labelled explicitly. No checklist is selected below 2 months or from 72 months onward. Source: https://www.cdc.gov/act-early/milestones/

## Existing prototype content

Broad 0–3 / 4–6 templates and the nonvalidated screening demo are retained in source and marked draft, but their interactive assessments are hidden. Source resources, clinician links and a personal observation journal replace the unsuitable personalized presentation. No automatic score, risk category or developmental diagnosis is generated. Legacy saved milestone statuses and screening results are not overwritten or counted as current journal observations.

New notes use rafiqAgeObservations_CHILD_ID and snapshot age months/days, developmental age, band and age basis. They remain available across birthdays. Today counts these personal notes separately from legacy milestone statuses. All existing finance keys and flows remain unchanged.

AI remains a local preview: prompts use finer age context and responses organize questions, without presenting generic scripts as age-specific medical advice.

Next editorial work: review internal activities and developmental content per supported range, obtain authorization and validate an in-app screening integration if desired, and then implement the daily moment. Source links and a coverage notice do not mean that a complete internal 0–6 clinical library exists.

## Screening preparation workflow (2026-10-18)

screening-tools.js selects a link to an original English SWYC form from TEAM UP Center. This is an external original PDF workflow, not an embedded questionnaire or an automatic scored screening. The publisher requests contact for electronic administration; no questionnaire items or scoring rules are reproduced. See https://www.teamupcenter.org/about-swyc/swyc-frequently-asked-questions/ and https://www.teamupcenter.org/age-specific-forms/.

SWYC form edges are separate from Rafiq content bands and CDC checklist checkpoints. Supported form intervals in completed months are [1,4), [4,6), [6,9), [9,12), [12,15), [15,18), [18,23), [23,29), [29,35), [35,47), [47,59), [59,66). No form is substituted below one month or at/after 66 months. SWYC adjustment is tool-specific: under chronological 24 months and at least 21 days early, using the reported expected due date. Missing prematurity details require confirmation or care-team selection.

rafiqScreeningJourney_CHILD_ID stores opening and parent-reported completion separately, with administration date, form id and age basis. Rafiq never creates a score, diagnostic category, or clinician result. Completing an external form is confirmed by the parent, not inferred from opening a link. New-day or changed-form selection requires a fresh form step.

An optional concern is saved to the existing personal notes key. Only clicking Use my note when booking creates rafiqBookingConcernDraft in sessionStorage. Booking applies it only for the same child, within 24 hours, at up to 500 characters, and only when the existing reason is empty. The note remains available while comparing specialists and is cleared after successful booking or explicit removal. The parent reviews it in the normal booking form. The PDF link carries no child data.

## Concern-first parent journey

The screening entry now begins with a parent-selected concern (communication, movement, interaction/play, behavior/emotions or unsure). concern-model.js supplies age-contextual example prompts and four observation questions. These are original, non-scored intake questions, not a validated screening instrument. Summaries repeat the parent's answers, explain next-step options, and never generate diagnostic likelihood or severity scores. Reported loss of an existing skill points to a clinician conversation, following CDC guidance: https://www.cdc.gov/act-early/families/concerned.html.

rafiqConcernJourney_CHILD_ID stores drafts and completed summaries; completed notes use the existing personal-observation key. A specialty query in the directory is a parent-facing topic filter, not clinical or age matching. Provider age experience must be confirmed; a missing specialty shows a transparent fallback to all listings. Existing booking fees, availability, payment and confirmation paths remain in use.

The original SWYC form is an optional resource after the concern summary, selected with the existing tool-specific age logic. Prior SWYC journey records are retained. The parent must opt in to include a short summary (up to 500 characters) in the existing child-scoped session booking draft. Nothing is submitted to a specialist by generating the summary.

## Journey review fixes

Concern sharing now has an editable preview of exactly the text used in the booking draft. Shortening to 500 characters is indicated before sharing; the full observation remains in the saved summary. A parent-reported skill change is placed before the example so shortening does not drop that statement.

concern-booking.js centralizes child scope, 24-hour expiry, maximum length and explicit removal. Booking no longer consumes the note at first page entry: edits persist while comparing specialists, cancellation or failed demo checkout preserves the draft, and confirmed booking clears it. The existing booking textarea also offers explicit note removal.

## Daily moment

Today now offers 24 general shared-play ideas across 12 explicit ranges from birth to under 84 months, with sources from CDC, AAP HealthyChildren and UNICEF. They are editorial, source-checked adaptations, not a clinician-approved curriculum, developmental test or treatment. Sources and age ranges are attached to every item; no other-age fallback is used. The small library can repeat ideas.

Selection is stable for child/local date, restores a saved same-day response, avoids the most recent saved idea when alternatives exist, and excludes ideas marked Not for us. Corrected development age is used where profile context supports it; missing due-date information yields a coverage message.

Feedback is optional: tried, later or not-for-us, plus a note. One daily record per child/date is upserted to rafiqAgeObservations_CHILD_ID, with source, age snapshot, activity and outcome. It is visible in Today history and the existing personal-observation journal. No streak, score or missed-day warning is generated.

Unsaved feedback prevents automatic Today reloads at midnight or after cross-tab storage updates. A moment begun before midnight can still be saved for its original date. Concern, appointment and report main actions retain priority.

## Growth journal and after-visit follow-up

My child’s growth now shows current age context, the original age resource where available, dated observations with recorded age, note-type filters and explicit selection of notes for a 500-character editable booking preview. Old notes remain stored. Growth notes do not generate a developmental percentage or diagnosis.

Specialist reports now have a separate caregiver workspace with personal planned/tried/question labels for each unchanged recommendation, a personal note, and an optional parent-selected reminder date. Responses are keyed by child and booking; original report text is never overwritten. Report access checks the selected child. An edited recommendation does not inherit an old response unless both index and text match.

Saving creates or updates one linked follow-up journal entry. Today surfaces due reminders across that child’s reports, not only the latest report, while keeping appointment-today and unread-report priority. Opening a reminder uses the corresponding original report. Return-to-specialist links use the original specialist id when present, with a browse-all escape if unavailable. Reminder dates are not prescribed appointment dates and no notification is sent externally.

## Health-record usability

Health entry now starts with vaccine received, measurement or personal health note. Existing rafiqVaccinations_CHILD, rafiqGrowth_CHILD and rafiqHealthNotes_CHILD arrays and legacy fields are retained. Writes touch only the selected record type and re-read its latest stored array before updating. Corrupt arrays block saving instead of being replaced with an empty array.

Dates are validated against the browser's local calendar day and the child's birth date. Measurements use explicit cm/kg, allow one or both values and require finite positive numbers; small recorded infant weights are not rejected by the previous 1 kg HTML minimum. No growth interpretation, missed-vaccine inference or jurisdiction-specific vaccine timetable is generated.

Each new/edited entry records age at the event date. The unified history shows all types, filtering, editing and soft removal through _deletedAt with a Recently removed view and restoration. Today excludes removed entries from health counts. Removal never permanently deletes the original record. Browser-local storage remains a preview limitation.

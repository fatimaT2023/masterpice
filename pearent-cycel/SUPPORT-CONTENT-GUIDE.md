# Support mode content guide

Rafiq offers educational support. It does not diagnose or treat, and it does not replace your specialists.

Support mode is a family-chosen setting, never a diagnosis made by Rafiq. Both parents can change or turn it off from the child profile. Saved support data remains intact.

Use the child's name, strengths-based language and respectful, neurodiversity-aware wording: “a child with autism” or “[Name], who has autism”. Never use “suffers from”, “victim”, “patient”, “abnormal”, “severe/mild”, “high/low functioning”, “behind”, “delayed” about the child, “cure”, “recover” or “fix”. Never promise improvement, outcomes or treatment.

Do not recommend or list unproven interventions, diets, supplements or products. Questions about these in Ask Rafiq should be directed to the child's doctor.

Use support and the child's name in notifications, email subjects, browser tab titles, URLs and externally visible page names. Do not include condition names in these surfaces. The setting is not included in AI context, analytics, logs, booking notes, concern drafts, messages or specialist views. Any future sharing requires explicit selection by the parent.

Every guidance item has an owner, reviewStatus, reviewedBy and reviewedAt. Registry content currently belongs to the Rafiq content team, is draft and has no clinical reviewer yet. Show “Draft: pending specialist review” only when window.RAFIQ_SHOW_DRAFT_LABELS is true (default true).

Arabic uses simple, warm, Jordanian-friendly neutral plural address: طفلكم، بتقدروا، سجّلوا. Use التوحد or طيف التوحد and put spaces around the child's name. All support pages must include the educational-support footer in the chosen language.

## Needs specialist input

All guidance awaits specialist review. Do not invent medical guidance. Future starting guides, appointment preparation, practice, visual tools, logs, parent care and safety content require an assigned reviewer before publication.

## Directory field needed

The current directory has no structured autism-experience field. The filter searches only specialist-published specialty, bio, areas and publicProfile.approach for literal mentions. It does not establish qualifications or experience. Request publicProfile.focusAreas with values autism, speech_language, occupational_therapy, early_intervention, published through the specialist profile and its public normalizer.

A2 enables About me. The next actionable step is the passport until its flow is finished, then the specialist directory. Unavailable services are skipped. Passport completion uses child.aboutMe.cursor; other service completion uses child.supportData.completedServices. Turning support off preserves both.

## A2 — Needs specialist review

Owner: Rafiq content team; reviewStatus: draft; reviewedBy/reviewedAt: null. Review every field prompt and helper in about-me-copy.js, all communication/understanding choices, sense descriptors, examples (بحب الأغاني، بنزعج من صوت المكنسة، المكان الهادي بساعد), the safety questions, the 30-second summary labels and the wallet phrase “I may not answer when called”. These are family-editable prompts, never clinical guidance or a validated assessment. No treatment claims are included.

A2 now enables About me. Every section is optional; finishing even a skipped passport advances the next step. The standalone safety-card registry service remains unavailable. Sharing of passport content is a selected snapshot only, with explicit action and exact preview every time. Existing notifications remain generic and contain no passport text. Export defaults exclude phone/contact details, allergy/medicine details and photo. Medical details from existing records are only suggested and need confirmation before copying into the passport.
## A3 — Needs specialist review

Owner: Rafiq content team; reviewStatus: draft; reviewedBy/reviewedAt: null. Review the supplied opening and educational disclaimer, the caution about programmes/products promising a cure, all 17 checklist titles/help lines and their time-period labels, all six specialist-role explanations, the “good to ask” question references, all six chooser labels and mappings, the “Many families start with…” wording and doctor-discussion disclaimer, both ready-question groups (12 questions), progress/automatic-check explanations, directory topic wording and print copy. These blocks live in support-start-content.js so reviewers can edit content without editing controllers. No review or clinical endorsement is implied by availability.

## How to add a verified resource

support-resources.js intentionally ships with no entries. Collect information from official sources for: disability-card application process; education and inclusion services; social support and funding; health-centre services; and any national autism organisations. These are research categories, not claims that a particular entitlement/service exists.

For each entry collect: stable id; official title in English and Arabic; a bilingual summary of no more than three lines; organization; exact application steps (both languages); publicly published phone, website and address if available; direct official sourceUrl (HTTPS); the date checked as verifiedAt (ISO); the person/team who checked as verifiedBy; and appliesTo (eligibility/applicability). Confirm the application details and eligibility against the official source before adding an entry. Do not guess phone numbers, rights, local processes or services. The page only displays verified entries; missing sourceUrl or verifiedAt must never render. No placeholders or coming-soon section is shown.

The new plan/questions remain private local family data. They are never automatically added to booking notes, specialist records, messages, Ask Rafiq, notifications or logs. Copy and print are explicit parent actions. Other support tools remain unavailable unless already enabled in A1/A2.
## Core support cycle — pending specialist review

Owner: Rafiq content team. Every string in support-journey-copy.js is draft, with reviewedBy/reviewedAt null. Review the stage descriptions, appointment preparation/recap prompts, source-confirmation wording, neutral observation options, explicit question-reviewed acknowledgement, tough-moment prompts, small-win/parent-space wording and all optional daily-symbol labels. These are organizational prompts, not a clinical protocol or a validated assessment. The icon choices are family-selected everyday symbols; no activity, reward or therapy is prescribed by them.

No clinical instructions are authored by Rafiq: the parent explicitly selects an exact recommendation from a child report or confirms that their own text comes from their specialist. Parent-entered outside instructions are labelled family-reported, not authenticated clinical reports. No source report is edited, no dosage/frequency is suggested and no improvement is promised. The family records their own observations and can prepare questions for discussion. No automated diagnosis, escalation scoring or screening was added. The worried-without-diagnosis path still uses the existing concern flow.

New workspace records stay on the accessible child in local browser storage. Copy/print has a preview; opening a conversation never sends text by itself. No new sharing permission scope, specialist-cycle changes, analytics or notification text were added. Source records, booking/payment state, Ask Rafiq context and activity matching remain unchanged. Availability means the tool works, not that its draft content has specialist endorsement.
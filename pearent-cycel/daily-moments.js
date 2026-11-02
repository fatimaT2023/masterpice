/* General shared-play ideas, not assessments or a clinical treatment plan. */
(()=>{'use strict';
const library=[
  {
    "id": "moment-0-0",
    "minMonths": 0,
    "maxMonthsExclusive": 2,
    "title": "A familiar voice",
    "insight": "Your voice can be part of a comforting moment.",
    "steps": [
      "Choose an awake, comfortable moment. Speak gently about what you are doing, then pause. No response is required."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; a book only if mentioned",
    "sourceUrl": "https://www.healthychildren.org/English/ages-stages/baby/Pages/Hearing-and-Making-Sounds.aspx",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-0-1",
    "minMonths": 0,
    "maxMonthsExclusive": 2,
    "title": "A tiny reading moment",
    "insight": "Reading can start as listening to your voice.",
    "steps": [
      "Read a short passage in a gentle voice while your baby is awake and comfortably supported. Stop whenever they need a break."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; a book only if mentioned",
    "sourceUrl": "https://www.healthychildren.org/English/ages-stages/baby/Pages/Hearing-and-Making-Sounds.aspx",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-2-0",
    "minMonths": 2,
    "maxMonthsExclusive": 4,
    "title": "A sound, then a pause",
    "insight": "Back-and-forth attention can begin with simple sounds.",
    "steps": [
      "If your baby makes a sound, respond softly and pause. Follow their interest rather than asking for a performance."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; a book only if mentioned",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/2-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-2-1",
    "minMonths": 2,
    "maxMonthsExclusive": 4,
    "title": "A picture together",
    "insight": "Looking at pictures can become a shared conversation.",
    "steps": [
      "Hold a picture book yourself. Describe one colorful picture while your baby is awake and comfortable. Follow their gaze and stop if they turn away."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; a book only if mentioned",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/2-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-4-0",
    "minMonths": 4,
    "maxMonthsExclusive": 6,
    "title": "Your little conversation",
    "insight": "Responding to sounds makes time together interactive.",
    "steps": [
      "Listen during an awake moment. Gently echo a sound your baby makes, add a few words, and leave a pause."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; a book only if mentioned",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/4-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-4-1",
    "minMonths": 4,
    "maxMonthsExclusive": 6,
    "title": "A familiar tune",
    "insight": "Quiet singing is one way to spend attentive time together.",
    "steps": [
      "Sing a familiar short song while comfortably supporting your awake baby. Watch for cues that they want a break."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; a book only if mentioned",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/4-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-6-0",
    "minMonths": 6,
    "maxMonthsExclusive": 9,
    "title": "Follow that look",
    "insight": "Your baby’s interest can start a conversation.",
    "steps": [
      "Notice something your baby looks toward. Point it out and name it gently. Stay beside them and follow their interest."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/6-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-6-1",
    "minMonths": 6,
    "maxMonthsExclusive": 9,
    "title": "Read a picture",
    "insight": "Reading does not have to mean finishing the words.",
    "steps": [
      "Hold a book and talk about one picture. If your baby makes a sound, respond and leave space for another turn."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/6-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-9-0",
    "minMonths": 9,
    "maxMonthsExclusive": 12,
    "title": "Peek-a-boo together",
    "insight": "A familiar playful exchange can be enjoyable to repeat.",
    "steps": [
      "Cover your own eyes with your hands, uncover them, and greet your baby. Keep their face uncovered and follow their comfort."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/9-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-9-1",
    "minMonths": 9,
    "maxMonthsExclusive": 12,
    "title": "A book and a few words",
    "insight": "Pictures can become a small shared conversation.",
    "steps": [
      "Hold a book, point to a picture and name it. Leave room for your baby’s sounds, gestures or a pause."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/9-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-12-0",
    "minMonths": 12,
    "maxMonthsExclusive": 18,
    "title": "One page, their choice",
    "insight": "Talking about a picture counts as reading together.",
    "steps": [
      "Let your child choose a page while you hold the book. Name something they notice; gestures and sounds are welcome."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/1-year.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-12-1",
    "minMonths": 12,
    "maxMonthsExclusive": 18,
    "title": "Blocks, together",
    "insight": "Simple toys can invite shared exploration.",
    "steps": [
      "Offer intact age-rated blocks without small parts. Join your child in exploring or placing them, with adult supervision and no building goal."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/1-year.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-18-0",
    "minMonths": 18,
    "maxMonthsExclusive": 24,
    "title": "A pretend meal",
    "insight": "Pretend play offers room for shared imagination.",
    "steps": [
      "Using an age-rated toy and safe pretend-play spoon, pretend to feed a toy animal. Invite a turn without requiring one. Supervise throughout."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/18-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-18-1",
    "minMonths": 18,
    "maxMonthsExclusive": 24,
    "title": "A toy’s little story",
    "insight": "Simple pretend routines can become a shared moment.",
    "steps": [
      "Use an age-suitable doll or animal to act out a familiar routine. Let your child lead or watch. Keep small parts out of reach."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/18-months.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-24-0",
    "minMonths": 24,
    "maxMonthsExclusive": 36,
    "title": "A picture conversation",
    "insight": "Shared attention can make reading a conversation.",
    "steps": [
      "Look through an age-suitable book together. Describe what interests your child and leave room for their words, gestures or questions."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/2-years.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-24-1",
    "minMonths": 24,
    "maxMonthsExclusive": 36,
    "title": "A little helper",
    "insight": "A small family task can be something you do together.",
    "steps": [
      "Invite your child to put clean cloths into a basket beside you. Join in and appreciate their help. Keep household chemicals and small items out of reach."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/2-years.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-36-0",
    "minMonths": 36,
    "maxMonthsExclusive": 48,
    "title": "What might happen next?",
    "insight": "Stories can invite ideas rather than right answers.",
    "steps": [
      "Pause at a picture in a book. Ask what might happen next and listen to any idea. Offer your own if they prefer to listen."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/3-years.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-36-1",
    "minMonths": 36,
    "maxMonthsExclusive": 48,
    "title": "Find a match",
    "insight": "Matching can be a playful way to notice similarities.",
    "steps": [
      "Look together at pictures in a book. Invite your child to find two similar things. Model a match and keep it light."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/3-years.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-48-0",
    "minMonths": 48,
    "maxMonthsExclusive": 60,
    "title": "Make a story together",
    "insight": "Sharing ideas can add a new turn to a familiar story.",
    "steps": [
      "Read a short part of a book. Take turns suggesting what might happen next; there is no correct ending."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/4-years.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-48-1",
    "minMonths": 48,
    "maxMonthsExclusive": 60,
    "title": "Notice colors together",
    "insight": "Everyday things can start a conversation about color.",
    "steps": [
      "Look at nearby safe objects together. Talk about colors your child notices. Offer names naturally instead of testing them."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/4-years.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-60-0",
    "minMonths": 60,
    "maxMonthsExclusive": 72,
    "title": "A rhyme for fun",
    "insight": "Word play can be silly and shared.",
    "steps": [
      "Choose a familiar word and suggest a rhyme. Invite another, or make up a funny word together. This is play, not a test."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/5-years.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-60-1",
    "minMonths": 60,
    "maxMonthsExclusive": 72,
    "title": "Your child’s picture story",
    "insight": "Pictures can give your child a starting point for storytelling.",
    "steps": [
      "Let your child tell a story from a book’s pictures. Listen and add a turn if invited. They do not need to read the text."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.cdc.gov/act-early/milestones/5-years.html",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-72-0",
    "minMonths": 72,
    "maxMonthsExclusive": 84,
    "title": "Let them teach you",
    "insight": "Listening to your child’s ideas makes room for their interests.",
    "steps": [
      "Ask your child to show or explain something they enjoy. Listen with curiosity and let them choose how much to share."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.unicef.org/asia-pacific/place-for-parents/positive-parenting-tips-6-10",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "moment-72-1",
    "minMonths": 72,
    "maxMonthsExclusive": 84,
    "title": "A small task, together",
    "insight": "Joining everyday family tasks can create a sense of participation.",
    "steps": [
      "Choose a simple safe task together, such as arranging unbreakable table items. Let your child suggest a plan and help alongside them. Avoid heat, sharp items and cleaning chemicals."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned below",
    "sourceUrl": "https://www.unicef.org/asia-pacific/place-for-parents/positive-parenting-tips-6-10",
    "sourceCheckedAt": "2026-10-18",
    "contentStatus": "source-checked-play-idea",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  }
];
library.push(...[
  {
    "id": "play-hello-face",
    "minMonths": 0,
    "maxMonthsExclusive": 6,
    "title": "A hello with your face",
    "titleAr": "تحية بوجهك",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "While your baby is awake and comfortable, smile gently and say hello. Pause and notice their cues; no response is needed."
    ],
    "stepsAr": [
      "وقت يكون طفلك صاحي ومرتاح، ابتسم بهدوء واحكيله مرحبًا. استنى ولاحظ تفاعله؛ مش مطلوب منه يرد."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www2.hse.ie/babies-children/play/0-6-months/",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-name-song",
    "minMonths": 0,
    "maxMonthsExclusive": 6,
    "title": "A little name song",
    "titleAr": "أغنية صغيرة باسمه",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Sing your baby’s name softly in a short tune. Pause after each line and stop if they turn away or seem tired."
    ],
    "stepsAr": [
      "غنّي اسم طفلك بهدوء بلحن قصير. استنى بعد كل جملة ووقف إذا لف وجهه أو بان عليه التعب."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www2.hse.ie/babies-children/play/0-6-months/",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-room-chat",
    "minMonths": 0,
    "maxMonthsExclusive": 6,
    "title": "A gentle room chat",
    "titleAr": "حكي هادي عن الغرفة",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Stay beside your comfortably supported baby and describe one thing nearby. Use a calm voice and leave quiet pauses."
    ],
    "stepsAr": [
      "خليك جنب طفلك وهو مسنود ومرتاح، واحكي بهدوء عن غرض قريب. اترك فترات هدوء بين الجمل."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www2.hse.ie/babies-children/play/0-6-months/",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-quiet-hum",
    "minMonths": 0,
    "maxMonthsExclusive": 6,
    "title": "A quiet humming moment",
    "titleAr": "لحظة دندنة هادية",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Hum a short familiar tune quietly while staying beside your baby. Follow their interest and finish whenever they need rest."
    ],
    "stepsAr": [
      "دندن لحن مألوف بصوت واطي وإنت جنب طفلك. امشِ مع راحته وانهي اللحظة وقت يحتاج يرتاح."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www2.hse.ie/babies-children/play/0-6-months/",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-picture-name",
    "minMonths": 0,
    "maxMonthsExclusive": 6,
    "title": "One picture, one word",
    "titleAr": "صورة وحدة وكلمة",
    "comfort": "pictures",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Hold a baby-safe picture book yourself while your baby is awake. Name one picture without asking them to look or respond."
    ],
    "stepsAr": [
      "امسك إنت كتاب صور مناسب للرضع وطفلك صاحي. سمّي صورة وحدة بدون ما تطلب منه ينظر أو يرد."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www2.hse.ie/babies-children/play/0-6-months/",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-sound-echo",
    "minMonths": 6,
    "maxMonthsExclusive": 12,
    "title": "Echo a little sound",
    "titleAr": "نردّد صوت صغير",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "When your baby makes a comfortable sound, copy it gently once. Pause and let them decide whether the exchange continues."
    ],
    "stepsAr": [
      "وقت طفلك يطلع صوت وهو مرتاح، قلّده بهدوء مرة وحدة. استنى وخليه يقرر إذا بده يكمل."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www.unicef.org/parenting/child-development/baby-tips",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-toy-names",
    "minMonths": 6,
    "maxMonthsExclusive": 12,
    "title": "Meet a familiar toy",
    "titleAr": "نتعرّف على لعبة مألوفة",
    "comfort": "pictures",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Hold one familiar age-suitable toy where your baby can comfortably see it. Name it, then follow what catches their attention."
    ],
    "stepsAr": [
      "امسك لعبة مألوفة ومناسبة لعمره بمكان يشوفها براحة. سمّيها وبعدها امشِ مع الشي اللي لفت انتباهه."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www.unicef.org/parenting/child-development/baby-tips",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-wave-hello",
    "minMonths": 6,
    "maxMonthsExclusive": 12,
    "title": "A friendly hello wave",
    "titleAr": "تلويحة مرحبا",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Wave hello to your baby and say their name gently. Pause; watching, smiling or turning away are all useful cues."
    ],
    "stepsAr": [
      "لوّح لطفلك واحكي اسمه بهدوء. استنى؛ نظرته أو ابتسامته أو لف وجهه كلها إشارات بتساعدك تفهمه."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www.unicef.org/parenting/child-development/baby-tips",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-book-find",
    "minMonths": 6,
    "maxMonthsExclusive": 12,
    "title": "Notice a book picture",
    "titleAr": "نلاحظ صورة بكتاب",
    "comfort": "pictures",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Hold a sturdy baby book and point to one familiar picture. Name it and let your baby look or reach at their own pace."
    ],
    "stepsAr": [
      "امسك كتاب رضّع متين وأشّر لصورة مألوفة. سمّيها وخلي طفلك ينظر أو يمد إيده على راحته."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www.unicef.org/parenting/child-development/baby-tips",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-soft-beat",
    "minMonths": 6,
    "maxMonthsExclusive": 12,
    "title": "A soft song beat",
    "titleAr": "إيقاع أغنية هادي",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Sing a short familiar song and tap your own knee softly. Pause between verses and follow your baby’s interest."
    ],
    "stepsAr": [
      "غنّي أغنية قصيرة مألوفة واطرق على ركبتك بخفة. استنى بين المقاطع وامشِ مع اهتمام طفلك."
    ],
    "duration": "A few minutes, or less",
    "materials": "Your attention; hold any book or toy yourself.",
    "sourceUrl": "https://www.unicef.org/parenting/child-development/baby-tips",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-toy-in-out",
    "minMonths": 12,
    "maxMonthsExclusive": 24,
    "title": "In and out together",
    "titleAr": "ندخل ونطلع سوا",
    "comfort": "handling",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Offer a wide unbreakable container and large age-suitable blocks with no small parts. Take turns putting one in and taking one out."
    ],
    "stepsAr": [
      "جهّز وعاء واسع ما بينكسر ومكعبات كبيرة مناسبة للعمر بدون قطع صغيرة. تناوبوا تدخلوا قطعة وتطلعوها."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/21-learning-activities-babies-and-toddlers",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-animal-voices",
    "minMonths": 12,
    "maxMonthsExclusive": 24,
    "title": "Who makes that sound?",
    "titleAr": "مين بيعمل هالصوت؟",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Look at a familiar animal picture and make its sound softly. Let your child respond with a look, sound or gesture."
    ],
    "stepsAr": [
      "شوفوا صورة حيوان مألوف وقلّد صوته بهدوء. خلي طفلك يرد بنظرة أو صوت أو إشارة."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/21-learning-activities-babies-and-toddlers",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-toy-goodnight",
    "minMonths": 12,
    "maxMonthsExclusive": 24,
    "title": "Goodnight, little toy",
    "titleAr": "تصبح على خير يا لعبة",
    "comfort": "pretend",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Choose a familiar age-suitable soft toy without loose parts. Pretend it is sleepy and invite your child to say goodnight in their own way."
    ],
    "stepsAr": [
      "اختاروا لعبة قماش مألوفة مناسبة للعمر وبدون قطع مفكوكة. تخيّلوا إنها نعسانة وخلي طفلك يودعها بطريقته."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/21-learning-activities-babies-and-toddlers",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-two-pictures",
    "minMonths": 12,
    "maxMonthsExclusive": 24,
    "title": "Choose a picture",
    "titleAr": "نختار صورة",
    "comfort": "pictures",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Show two familiar pictures in a sturdy book. Follow whichever your child notices, and say a few words about it without quizzing them."
    ],
    "stepsAr": [
      "اعرض صورتين مألوفتين بكتاب متين. اتبع الصورة اللي انتبهلها طفلك واحكي عنها كلمات بسيطة بدون اختبار."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/21-learning-activities-babies-and-toddlers",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-rolling-ball",
    "minMonths": 12,
    "maxMonthsExclusive": 24,
    "title": "A gentle ball exchange",
    "titleAr": "نتبادل الكرة بهدوء",
    "comfort": "handling",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Sit together in a clear floor space using the support your child normally needs. Gently roll a large soft ball between you; help as needed."
    ],
    "stepsAr": [
      "اقعدوا بأرض فاضية مع الدعم المعتاد اللي يحتاجه طفلك. دحرجوا كرة طرية كبيرة بينكم بهدوء وساعده حسب حاجته."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/21-learning-activities-babies-and-toddlers",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-animal-guess",
    "minMonths": 24,
    "maxMonthsExclusive": 48,
    "title": "An animal guessing game",
    "titleAr": "لعبة نخمن الحيوان",
    "comfort": "pretend",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Make a gentle animal sound and let your child guess, point or join in. Swap roles if they want; giving clues is welcome."
    ],
    "stepsAr": [
      "قلّد صوت حيوان بهدوء وخلي طفلك يخمّن أو يأشّر أو يشارك. بدّلوا الأدوار إذا حب وساعده بتلميحات."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-sock-character",
    "minMonths": 24,
    "maxMonthsExclusive": 48,
    "title": "A sock with a voice",
    "titleAr": "جراب إله صوت",
    "comfort": "pretend",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Use a clean plain sock with no decorations or loose parts as a hand puppet. Give it a funny greeting and invite your child to answer."
    ],
    "stepsAr": [
      "استخدم جراب نظيف سادة بدون زينة أو قطع مفكوكة كدمية بإيدك. خليها تحكي تحية مضحكة وادعُ طفلك يرد."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-colour-pairs",
    "minMonths": 24,
    "maxMonthsExclusive": 48,
    "title": "Find two alike",
    "titleAr": "نلاقي شيئين متشابهين",
    "comfort": "pictures",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Offer several large safe toys in two colours. Find two with the same colour together, accepting any way your child groups them."
    ],
    "stepsAr": [
      "جهّز ألعاب كبيرة وآمنة بلونين. دوروا سوا على قطعتين بنفس اللون وتقبّل أي طريقة يصنف فيها طفلك."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-clap-pattern",
    "minMonths": 24,
    "maxMonthsExclusive": 48,
    "title": "Copy my gentle claps",
    "titleAr": "نقلّد التصفيق الخفيف",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Clap a short gentle pattern and pause. Let your child copy, invent a different one or simply listen, then follow their lead."
    ],
    "stepsAr": [
      "صفّق إيقاع قصير وخفيف واستنى. خلي طفلك يقلّده أو يخترع غيره أو يسمع بس، وبعدها اتبع اختياره."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-toy-adventure",
    "minMonths": 24,
    "maxMonthsExclusive": 48,
    "title": "A toy goes visiting",
    "titleAr": "لعبة بتروح زيارة",
    "comfort": "storytelling",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Choose two large familiar toys and pretend one visits the other. Invite your child to decide what happens next with words or gestures."
    ],
    "stepsAr": [
      "اختاروا لعبتين كبيرتين ومألوفتين وتخيّلوا وحدة بتزور الثانية. خلي طفلك يختار شو بصير بكلمات أو إشارات."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-sound-detective",
    "minMonths": 48,
    "maxMonthsExclusive": 84,
    "title": "Sound detectives",
    "titleAr": "محققين الأصوات",
    "comfort": "listening",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Sit together and listen for ordinary sounds nearby. Take turns describing what you notice without needing to identify every sound correctly."
    ],
    "stepsAr": [
      "اقعدوا سوا واسمعوا الأصوات العادية حواليكم. تناوبوا بوصف اللي سمعتوه، ومش لازم تعرفوا مصدر كل صوت."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-story-turns",
    "minMonths": 48,
    "maxMonthsExclusive": 84,
    "title": "One sentence each",
    "titleAr": "كل واحد جملة",
    "comfort": "storytelling",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Start a made-up story with one short sentence. Take turns adding a sentence, drawing or gesture, and end whenever your child wishes."
    ],
    "stepsAr": [
      "بلّش قصة خيالية بجملة قصيرة. تناوبوا تضيفوا جملة أو رسمة أو إشارة، وانهوا وقت طفلك يحب."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-draw-world",
    "minMonths": 48,
    "maxMonthsExclusive": 84,
    "title": "Draw an imaginary place",
    "titleAr": "نرسم مكان خيالي",
    "comfort": "pictures",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Offer paper and age-suitable drawing materials. Create an imaginary place together and invite your child to describe or point out a favourite part."
    ],
    "stepsAr": [
      "جهّز ورق وأدوات رسم مناسبة للعمر. ارسموا مكان خيالي سوا وخلي طفلك يحكي أو يأشّر للجزء اللي بحبه."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-build-town",
    "minMonths": 48,
    "maxMonthsExclusive": 84,
    "title": "Build a little town",
    "titleAr": "نبني بلدة صغيرة",
    "comfort": "handling",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Use large age-suitable blocks on a clear surface. Build a small place together and let your child decide what each part could be."
    ],
    "stepsAr": [
      "استخدموا مكعبات كبيرة مناسبة للعمر على سطح فاضي. ابنوا مكان صغير سوا وخلي طفلك يقرر شو كل جزء بيمثّل."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  },
  {
    "id": "play-kind-character",
    "minMonths": 48,
    "maxMonthsExclusive": 84,
    "title": "A character needs help",
    "titleAr": "شخصية بتحتاج مساعدة",
    "comfort": "pretend",
    "insight": "A small moment to explore together, at your child’s pace.",
    "steps": [
      "Invent a character who needs a simple everyday favour. Act out different ways to help together, accepting your child’s ideas without scoring them."
    ],
    "stepsAr": [
      "تخيّلوا شخصية بتحتاج مساعدة بسيطة بيومها. مثّلوا طرق مختلفة تساعدوها وتقبّل أفكار طفلك بدون تقييم."
    ],
    "duration": "A few minutes, or less",
    "materials": "Only the age-suitable items mentioned in the steps.",
    "sourceUrl": "https://www.unicef.org/parenting/child-care/screen-free-activities",
    "sourceCheckedAt": "2026-11-02",
    "contentStatus": "editorial-play-idea-source-inspired",
    "clinicalReview": null,
    "care": "Stay together, follow your child’s cues, and stop when either of you needs a break. Adapt around your care team’s advice."
  }
]);
// Parent-reported comfort signals guide variety; they are not milestone assessments.
const comfortLabels={listening:'Listening to voices',pictures:'Looking at pictures',handling:'Handling large toys',pretend:'Pretend play',storytelling:'Sharing stories'};
const comfortById={'moment-0-0':'listening','moment-0-1':'pictures','moment-2-0':'listening','moment-2-1':'pictures','moment-4-0':'listening','moment-4-1':'listening','moment-6-0':'listening','moment-6-1':'pictures','moment-9-0':'listening','moment-9-1':'pictures','moment-12-0':'pictures','moment-12-1':'handling','moment-18-0':'pretend','moment-18-1':'storytelling','moment-24-0':'pictures','moment-24-1':'handling','moment-36-0':'storytelling','moment-36-1':'handling','moment-48-0':'storytelling','moment-48-1':'pictures','moment-60-0':'listening','moment-60-1':'storytelling','moment-72-0':'storytelling','moment-72-1':'handling'};
for(const item of library)item.comfort=comfortById[item.id]||item.comfort;
function preferences(child){try{const value=JSON.parse(localStorage.getItem('rafiqPlayPreferences_'+child.id)||'{}');return {comfortable:Array.isArray(value.comfortable)?value.comfortable.filter(key=>Object.hasOwn(comfortLabels,key)):[]};}catch{return {comfortable:[],unavailable:true};}}
function reasons(item,context,prefs,records){
 const result=[context.basis==='corrected'?'Within your child’s corrected development-age range.':'Within your child’s recorded age range.'];
 if(prefs.comfortable.includes(item.comfort))result.push('You said '+comfortLabels[item.comfort].toLowerCase()+' feels comfortable for your child.');
 const tried=records.some(record=>record.outcome==='tried'&&library.find(other=>other.id===record.activityId)?.comfort===item.comfort);
 if(tried)result.push('You previously tried a similar kind of play.');
 result.push('Ideas marked “Not for us” are left out on future days.');return result;
}
function dayKey(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
function choose(child,notes=[],date=new Date()){
 const context=window.RafiqSetup.childContext(child,date),day=dayKey(date),prefs=preferences(child);
 if(!context.supported||!context.development||context.needsDueDate)return {day,context,item:null,reason:context.needsDueDate?'needs-due-date':'age-unavailable'};
 const months=context.development.totalMonths,eligible=library.filter(item=>months>=item.minMonths&&months<item.maxMonthsExclusive);
 const records=notes.filter(n=>n&&n.type==='daily-moment'&&n.childId===child.id);
 const saved=records.find(n=>!n.isExtra&&n.day===day&&eligible.some(item=>item.id===n.activityId));
 if(saved){const item=eligible.find(i=>i.id===saved.activityId);return {day,context,item,saved,reasons:reasons(item,context,prefs,records)};}
 const excluded=new Set(records.filter(n=>n.outcome==='not-for-us').map(n=>n.activityId));
 let options=eligible.filter(i=>!excluded.has(i.id));
 if(!options.length)return {day,context,item:null,reason:'no-suitable-idea'};
 let assignments=[];
 try{const stored=JSON.parse(localStorage.getItem('rafiqDailyAssignments_'+child.id)||'[]');if(Array.isArray(stored))assignments=stored.filter(a=>a&&/^\d{4}-\d{2}-\d{2}$/.test(a.day)&&typeof a.activityId==='string');}catch{/* Saved observations still support rotation. */}
 const assigned=assignments.find(a=>a.day===day&&options.some(item=>item.id===a.activityId));
 if(assigned){const item=options.find(i=>i.id===assigned.activityId);return {day,context,item,saved:null,reasons:reasons(item,context,prefs,records)};}
 // Offer unseen ideas first; otherwise revisit the least recently offered idea.
 const seen=[...records,...assignments].filter(a=>a.day<day);
 const lastSeen=item=>seen.filter(a=>a.activityId===item.id).reduce((last,a)=>a.day>last?a.day:last,'');
 const oldest=options.map(lastSeen).sort()[0];options=options.filter(item=>lastSeen(item)===oldest);
 const score=item=>(prefs.comfortable.includes(item.comfort)?2:0)+(records.some(r=>r.outcome==='tried'&&library.find(other=>other.id===r.activityId)?.comfort===item.comfort)?1:0);
 const best=Math.max(...options.map(score));options=options.filter(item=>score(item)===best);
 const seed=Array.from(child.id+'|'+day).reduce((sum,c)=>(sum*31+c.charCodeAt(0))>>>0,0);
 const item=options[seed%options.length];let selectionUnstored=false;
 try{localStorage.setItem('rafiqDailyAssignments_'+child.id,JSON.stringify([...assignments.filter(a=>a.day!==day),{day,activityId:item.id}].sort((a,b)=>a.day.localeCompare(b.day)).slice(-180)));}catch{selectionUnstored=true;}
 return {day,context,item,saved:null,reasons:reasons(item,context,prefs,records),selectionUnstored};
}
function additional(child,notes=[],date=new Date()){
 const context=window.RafiqSetup.childContext(child,date),day=dayKey(date);
 if(!context.supported||!context.development||context.needsDueDate)return [];
 const own=notes.filter(n=>n&&n.type==='daily-moment'&&n.childId===child.id);
 const used=new Set(own.filter(n=>n.day===day||n.outcome==='not-for-us').map(n=>n.activityId));
 const months=context.development.totalMonths;
 return library.filter(item=>months>=item.minMonths&&months<item.maxMonthsExclusive&&!used.has(item.id));
}
function open(child,notes=[],requested=null,date=new Date()){
 const primary=choose(child,notes,date);if(!requested||requested===primary.item?.id)return primary;
 const saved=notes.find(n=>n&&n.type==='daily-moment'&&n.childId===child.id&&n.day===primary.day&&n.activityId===requested);
 const item=library.find(i=>i.id===requested),context=primary.context,months=context.development?.totalMonths;
 if(!item||!context.supported||!context.development||context.needsDueDate||months<item.minMonths||months>=item.maxMonthsExclusive)return {...primary,requestDenied:true};
 if(saved)return {...primary,item,saved,isExtra:!!saved.isExtra,reasons:reasons(item,context,preferences(child),notes.filter(n=>n?.childId===child.id))};
 if(!primary.saved||!window.RafiqMembership?.state().active||!additional(child,notes,date).some(i=>i.id===requested))return {...primary,requestDenied:true};
 return {...primary,item,saved:null,isExtra:true,reasons:reasons(item,context,preferences(child),notes.filter(n=>n?.childId===child.id))};
}
window.RafiqDailyMoments={library,dayKey,choose,preferences,comfortLabels,additional,open};})();

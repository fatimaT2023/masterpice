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
function dayKey(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
function choose(child,notes=[],date=new Date()){
 const context=window.RafiqSetup.childContext(child,date),day=dayKey(date);
 if(!context.supported||!context.development||context.needsDueDate)return {day,context,item:null,reason:context.needsDueDate?'needs-due-date':'age-unavailable'};
 const months=context.development.totalMonths,eligible=library.filter(item=>months>=item.minMonths&&months<item.maxMonthsExclusive);
 const records=notes.filter(n=>n&&n.type==='daily-moment'&&n.childId===child.id);
 const saved=records.find(n=>n.day===day&&eligible.some(item=>item.id===n.activityId));
 if(saved)return {day,context,item:eligible.find(i=>i.id===saved.activityId),saved};
 const excluded=new Set(records.filter(n=>n.outcome==='not-for-us').map(n=>n.activityId));
 let options=eligible.filter(i=>!excluded.has(i.id));
 if(!options.length)return {day,context,item:null,reason:'no-suitable-idea'};
 const recent=records.filter(n=>n.day<day).sort((a,b)=>b.day.localeCompare(a.day))[0];
 if(options.length>1&&recent)options=options.filter(i=>i.id!==recent.activityId);
 const seed=Array.from(child.id+'|'+day).reduce((sum,c)=>(sum*31+c.charCodeAt(0))>>>0,0);
 return {day,context,item:options[seed%options.length],saved:null};
}
window.RafiqDailyMoments={library,dayKey,choose};})();

document.addEventListener('DOMContentLoaded',()=>{
Object.assign(window.RafiqHomeArabic=window.RafiqHomeArabic||{}, {'Discuss with a specialist':'ناقشها مع مختص','Record a follow-up':'سجّل متابعة','What changed or happened next?':'شو تغيّر أو صار بعد هيك؟','Save follow-up':'احفظ المتابعة','Follow-up':'متابعة','Follow-up saved with the original observation.':'تم حفظ المتابعة مع الملاحظة الأصلية.','We could not save your follow-up. Please try again.':'تعذّر حفظ المتابعة. حاول مرة ثانية.'});
'use strict';const get=id=>document.getElementById(id),api=window.RafiqSetup;let child,notes=[],selected=new Set();
function error(message){get('growthError').textContent=message;get('growthError').hidden=false;}
function read(){const value=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');if(!Array.isArray(value))throw Error('Invalid notes');if(value.some(note=>!note||typeof note.text!=='string'))throw Error('Invalid observation entry');return value;}
try{const children=api.readChildren();child=children.find(c=>c.id===(window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId')))||children[0];if(!child){location.replace('onboarding.html');return;}notes=read();}catch{error('We couldn’t read the saved profile or observations. Existing records have not been changed.');return;}
const context=api.childContext(child),resource=window.RafiqAgeContent.milestoneResource(context);
const months=context.development?.totalMonths??context.chronological?.totalMonths??2;
get('growthChild').textContent=(child.name||'Your child')+' · '+api.formatAge(context.chronological);
get('growthStage').textContent=context.band?.label||'Your child’s recorded stage';

const stageDescriptions = {
  0: "During the first month, your newborn is adjusting to life outside the womb. They communicate primarily through crying, focus their gaze on faces 20–30 cm away, and find comfort in gentle rocking and familiar voices.",
  2: "At 2 months, your baby begins actively interacting with you. They discover their hands, smile socially in response to your smiles, make gentle cooing sounds, and push up slightly during tummy time.",
  4: "At 4 months, babies become playful and socially expressive. They chuckle, push up firmly on elbows during tummy time, reach for toys with one hand, and enjoy back-and-forth play.",
  6: "At 6 months, babies are full of curiosity. They roll over in both directions, begin to sit with little support, babble with consonant sounds, and pass toys from hand to hand.",
  9: "At 9 months, babies are on the move. They crawl, pull up to stand, play peek-a-boo, look for hidden toys, and pick up small objects with thumb and forefinger.",
  12: "At 12 months, toddlers take exciting steps toward independence. They say simple words like 'mama' and 'dada', pull up or take first steps, and enjoy interactive games.",
  18: "At 18 months, toddlers explore actively. They walk independently, say 10 to 20 words, point to things they want, and enjoy simple pretend play like feeding a toy.",
  24: "At 2 years, toddlers communicate in two-word phrases, run, kick balls, imitate adults, sort shapes, and play alongside other children.",
  36: "At 3 years, children speak in full sentences, pedal tricycles, ask lots of curious questions, share with guidance, and show wonderful imagination."
};

let stageText = stageDescriptions[0];
if (months >= 36) stageText = stageDescriptions[36];
else if (months >= 24) stageText = stageDescriptions[24];
else if (months >= 18) stageText = stageDescriptions[18];
else if (months >= 12) stageText = stageDescriptions[12];
else if (months >= 9) stageText = stageDescriptions[9];
else if (months >= 6) stageText = stageDescriptions[6];
else if (months >= 4) stageText = stageDescriptions[4];
else if (months >= 2) stageText = stageDescriptions[2];

get('growthStageDescription').textContent=context.supported ? stageText : 'Personalized content currently covers birth until the seventh birthday. Your saved observations and specialist follow-up remain available.';
get('growthAgeBasis').textContent=context.basis==='corrected'?'Development resources use corrected age: '+api.formatAge(context.development)+'. The profile age above uses date of birth.':context.needsDueDate?'Add the expected due date in child details to choose development resources using corrected age.':'Resources use the birth date recorded in your child’s profile. Each resource has its own age range.';
get('growthSourceDescription').textContent=resource?resource.title+'. This is the most recent CDC checklist age reached, not a monthly test or a screening score.':context.development?.totalMonths<2?'CDC milestone checklists start at 2 months; no older baby’s checklist is applied here.':'No original age checklist is selected with the current details. Your clinician can help choose an appropriate resource.';
get('growthSource').hidden=!resource;
if(resource)get('growthSource').href=resource.source.url;

function getStageSkills(m) {
  if (m < 2) {
    return [
      { domain: 'communication', icon: '🗣️', title: 'Sounds & Crying', desc: 'Makes small throaty sounds; cries to express hunger, tiredness or discomfort.' },
      { domain: 'social', icon: '💖', title: 'Bonding & Gazing', desc: 'Focuses on parent’s face from 20–30 cm away; calms down when held gently.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Reflexes & Head', desc: 'Moves arms and legs symmetrically; grasps fingers placed in palm; turns head side-to-side.' },
      { domain: 'cognitive', icon: '🧠', title: 'Visual Attention', desc: 'Watches parents move nearby; reacts to high-contrast colors and bright lights.' }
    ];
  } else if (m < 4) {
    return [
      { domain: 'communication', icon: '🗣️', title: 'Cooing & Sounds', desc: 'Makes sweet gurgling and cooing sounds ("ooh", "aah"); turns head toward familiar voices.' },
      { domain: 'social', icon: '💖', title: 'Social Smiles', desc: 'Smiles back at you when you smile or talk; makes warm, direct eye contact.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Tummy Time & Arms', desc: 'Holds head up when on tummy; movements of arms and legs become smoother; opens and shuts hands.' },
      { domain: 'cognitive', icon: '🧠', title: 'Tracking Objects', desc: 'Follows moving toys with eyes from side to side; watches faces with keen interest.' }
    ];
  } else if (m < 6) {
    return [
      { domain: 'communication', icon: '🗣️', title: 'Babbling & Chuckling', desc: 'Laughs and chuckles out loud; turns head toward pleasant sounds and music.' },
      { domain: 'social', icon: '💖', title: 'Expressive Interaction', desc: 'Smiles spontaneously, especially at people; enjoys playing with caregivers.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Rolling & Pushing Up', desc: 'Pushes up on elbows during tummy time; begins to roll front-to-back; reaches for toys.' },
      { domain: 'cognitive', icon: '🧠', title: 'Hands to Mouth', desc: 'Brings hands to mouth; uses hands and eyes together to explore safe objects.' }
    ];
  } else if (m < 9) {
    return [
      { domain: 'communication', icon: '🗣️', title: 'Consonant Babble', desc: 'Strings vowels together (ah, eh, oh); makes consonant sounds like "m", "b", "d".' },
      { domain: 'social', icon: '💖', title: 'Recognizing Faces', desc: 'Knows familiar faces; enjoys looking at self in a mirror; responds to emotions.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Sitting & Rolling', desc: 'Rolls over in both directions; starts to sit without support; rocks on hands and knees.' },
      { domain: 'cognitive', icon: '🧠', title: 'Object Exploration', desc: 'Transfers toys from one hand to the other; shows curiosity about everyday objects.' }
    ];
  } else if (m < 12) {
    return [
      { domain: 'communication', icon: '🗣️', title: 'Gestures & "No"', desc: 'Understands "no"; makes sounds like "mamama" and "bababa"; copies simple gestures.' },
      { domain: 'social', icon: '💖', title: 'Stranger Awareness', desc: 'May show caution with strangers; has favorite toys; plays simple peek-a-boo.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Crawling & Pulling Up', desc: 'Crawls smoothly; pulls up to stand while holding onto furniture; sits easily.' },
      { domain: 'cognitive', icon: '🧠', title: 'Pincer Grasp', desc: 'Picks up small items with thumb and index finger; looks for hidden objects.' }
    ];
  } else if (m < 18) {
    return [
      { domain: 'communication', icon: '🗣️', title: 'First Words', desc: 'Says "mama", "dada" and 1–2 other words; responds to simple requests; waves bye-bye.' },
      { domain: 'social', icon: '💖', title: 'Imitation & Affection', desc: 'Hands you a book for story time; shows affection with hugs; repeats sounds for attention.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Cruising & Walking', desc: 'Walks holding onto furniture or takes first steps independently; stands alone briefly.' },
      { domain: 'cognitive', icon: '🧠', title: 'Object Functions', desc: 'Uses things correctly (drinks from cup, brushes hair); puts items into containers.' }
    ];
  } else if (m < 24) {
    return [
      { domain: 'communication', icon: '🗣️', title: 'Vocabulary Growth', desc: 'Uses at least 10–20 words; points to show what they want; points to named body parts.' },
      { domain: 'social', icon: '💖', title: 'Simple Pretend Play', desc: 'Feeds a stuffed animal; explores near familiar adults; laughs at unexpected events.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Confident Walking', desc: 'Walks independently and may run; walks up steps with help; pulls toys while walking.' },
      { domain: 'cognitive', icon: '🧠', title: 'Scribbling & Stacking', desc: 'Scribbles with crayons; builds a tower of 3–4 blocks; follows 1-step verbal commands.' }
    ];
  } else if (m < 36) {
    return [
      { domain: 'communication', icon: '🗣️', title: '2-Word Phrases', desc: 'Combines two words ("more milk", "big ball"); knows names of familiar people and items.' },
      { domain: 'social', icon: '💖', title: 'Parallel Play', desc: 'Plays happily alongside other children; copies adults and playmates.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Running & Kicking', desc: 'Runs well; kicks a ball forward; walks up and down stairs holding the rail.' },
      { domain: 'cognitive', icon: '🧠', title: 'Sorting & Shapes', desc: 'Sorts shapes and colors; finds things hidden under covers; repeats book rhymes.' }
    ];
  } else {
    return [
      { domain: 'communication', icon: '🗣️', title: 'Full Sentences', desc: 'Speaks in 3–5 word sentences; talks about daily activities clearly.' },
      { domain: 'social', icon: '💖', title: 'Cooperative Play', desc: 'Takes turns in simple games; shows affection for friends; expresses varied emotions.' },
      { domain: 'movement', icon: '🏃‍♂️', title: 'Climbing & Hopping', desc: 'Pedals a tricycle; hops and balances on one foot briefly; catches a large ball.' },
      { domain: 'cognitive', icon: '🧠', title: 'Curiosity & Puzzles', desc: 'Asks "why?" and "what?" often; plays with mechanical toys; completes simple puzzles.' }
    ];
  }
}

const skillsGrid = get('stageSkillsGrid');
if (skillsGrid) {
  skillsGrid.replaceChildren();
  const skills = getStageSkills(months);
  for (const s of skills) {
    const card = document.createElement('div');
    card.className = 'stage-skill-card skill-domain-' + s.domain;
    
    const iconWrap = document.createElement('div');
    iconWrap.className = 'skill-card-icon-wrap';
    iconWrap.textContent = s.icon;
    
    const info = document.createElement('div');
    info.className = 'skill-card-info';
    
    const h4 = document.createElement('h4');
    h4.textContent = s.title;
    
    const p = document.createElement('p');
    p.textContent = s.desc;
    
    info.append(h4, p);
    card.append(iconWrap, info);
    skillsGrid.append(card);
  }
}

function selectionStatus(){get('growthSelectionCount').textContent=selected.size?selected.size+' selected for your visit preview.':'';get('prepareGrowthVisit').disabled=!selected.size;get('growthVisitPreview').hidden=true;}
function prepareVisit(){const text=notes.filter(n=>(!n.childId||n.childId===child.id)&&selected.has(n.id)).map(n=>n.text).join(' | ');if(!text)return;get('growthBookingNote').value=text.slice(0,500);get('growthVisitPreview').hidden=false;get('growthBookingNote').focus();}
function addActions(article,note){
 if(!note.id)return;
 const actions=document.createElement('div');actions.className='growth-entry-actions';
 const discuss=document.createElement('button');discuss.type='button';discuss.className='screen-flow-secondary';discuss.textContent='Prepare for a consultation';discuss.addEventListener('click',()=>{selected.clear();selected.add(note.id);render();prepareVisit();});
 const follow=document.createElement('button');follow.type='button';follow.className='screen-flow-secondary';follow.textContent='Record a follow-up';
 const form=document.createElement('form');form.className='growth-followup';form.hidden=true;
 const label=document.createElement('label'),input=document.createElement('textarea'),save=document.createElement('button'),status=document.createElement('p');input.id='followup-'+note.id;label.htmlFor=input.id;label.textContent='What changed or happened next?';input.rows=3;input.maxLength=2000;input.required=true;save.type='submit';save.className='screen-flow-primary';save.textContent='Save follow-up';status.setAttribute('role','status');form.append(label,input,save,status);
 follow.addEventListener('click',()=>{form.hidden=!form.hidden;follow.setAttribute('aria-expanded',String(!form.hidden));if(!form.hidden)input.focus();});follow.setAttribute('aria-expanded','false');
 form.addEventListener('submit',event=>{event.preventDefault();const text=input.value.trim();if(!text)return;try{const latest=read(),index=latest.findIndex(n=>n.id===note.id&&(!n.childId||n.childId===child.id));if(index<0)throw Error('Missing observation');const entries=Array.isArray(latest[index].followUps)?latest[index].followUps:[];latest[index]={...latest[index],followUps:[...entries,{text,createdAt:new Date().toISOString(),createdBy:window.RafiqFamily.owner(),createdByName:window.RafiqFamily.actor().name}]};localStorage.setItem('rafiqAgeObservations_'+child.id,JSON.stringify(latest));window.RafiqFamily.notify(child.id,'Child observations updated','milestones.html');notes=latest;render();get('growthSaveStatus').textContent='Follow-up saved with the original observation.';}catch{status.textContent='We could not save your follow-up. Please try again.';}});
 actions.append(discuss,follow);article.append(actions,form);
 for(const entry of Array.isArray(note.followUps)?note.followUps:[]){if(typeof entry?.text!=='string')continue;const item=document.createElement('div'),heading=document.createElement('strong'),body=document.createElement('p');item.className='growth-followup-entry';const date=new Date(entry.createdAt);heading.textContent='Follow-up';if(!Number.isNaN(date.getTime())){const time=document.createElement('time');time.dateTime=date.toISOString();time.textContent=' · '+date.toLocaleDateString();heading.append(time);}body.textContent=entry.text;item.append(heading,body);article.append(item);}
}
function render(){get('growthTimeline').replaceChildren();const filter=get('growthFilter').value,items=notes.filter(n=>!n.childId||n.childId===child.id).filter(n=>filter==='all'||(n.type||'observation')===filter).slice().sort((a,b)=>(Date.parse(b.createdAt)||0)-(Date.parse(a.createdAt)||0));get('growthEmpty').textContent=items.length?'':'No observations in this view yet. Start with a little thing you noticed.';for(const note of items){const article=document.createElement('article'),label=document.createElement('label'),box=document.createElement('input'),meta=document.createElement('strong'),text=document.createElement('p');article.className='growth-entry';box.type='checkbox';box.checked=selected.has(note.id);box.disabled=!note.id;box.setAttribute('aria-label','Select this observation for a visit');box.addEventListener('change',()=>{box.checked?selected.add(note.id):selected.delete(note.id);selectionStatus();});const date=new Date(note.createdAt);const dateText=Number.isNaN(date.getTime())?'Date not recorded':date.toLocaleDateString('en',{year:'numeric',month:'short',day:'numeric'});let ageText='Age not recorded';if(Number.isInteger(note.chronologicalAgeMonths))ageText=note.chronologicalAgeMonths+' completed months'+(Number.isInteger(note.ageDays)?', '+note.ageDays+' days':'');else if(!Number.isNaN(date.getTime()))ageText=api.formatAge(api.ageFromBirth(child.dateOfBirth,date))||ageText;meta.textContent=dateText+' · '+ageText;text.textContent=note.text;text.setAttribute('data-user-content','');const kind=document.createElement('span');kind.className='growth-kind';kind.textContent=({'daily-moment':'Activity result',concern:'Question or concern','follow-up':'After a visit','ai-share':'Shared AI message',observation:'Observation'})[note.type||'observation']||'Observation';label.append(box,meta);article.append(kind,label,text);if(note.createdByName){const author=document.createElement('small');author.textContent='Added by: '+note.createdByName;article.append(author);}
if(note.reportBookingId){try{const reports=JSON.parse(localStorage.getItem('rafiqSpecialistReports')||'[]');if(Array.isArray(reports)&&reports.some(r=>r?.childId===child.id&&r.bookingId===note.reportBookingId)){const link=document.createElement('a');link.className='screen-flow-link';link.href='specialist-report.html';link.textContent='Open the specialist’s original report →';link.addEventListener('click',event=>{try{sessionStorage.setItem('rafiqSelectedReportBooking',note.reportBookingId);}catch{event.preventDefault();error('We couldn’t open the report. You can find it in My appointments.');}});article.append(link);}}catch{/* A personal note remains readable without a report link. */}}
addActions(article,note);get('growthTimeline').append(article);}selectionStatus();}
const prompts={movement:'What movement or action did you notice? Describe one example.',interaction:'What happened while you were interacting? How did your child respond?',question:'What are you wondering about? Describe the situation that raised your question.'};
document.querySelectorAll('[data-growth-prompt]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-growth-prompt]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));get('growthNote').placeholder=prompts[button.dataset.growthPrompt];if(button.dataset.growthPrompt==='question')get('growthNoteType').value='concern';else get('growthNoteType').value='observation';get('growthNote').focus();}));
get('growthNoteForm').addEventListener('submit',event=>{event.preventDefault();const value=get('growthNote').value.trim();if(!value){get('growthSaveStatus').textContent='Write one thing you noticed before saving.';get('growthNote').focus();return;}get('growthError').hidden=true;try{const latest=read(),current=api.childContext(child);latest.push({id:'note_'+(globalThis.crypto?.randomUUID?.()||Date.now()),type:get('growthNoteType').value==='concern'?'concern':'observation',childId:child.id,text:value,createdAt:new Date().toISOString(),createdBy:window.RafiqFamily.owner(),createdByName:window.RafiqFamily.actor().name,chronologicalAgeMonths:current.chronological?.totalMonths??null,ageDays:current.chronological?.days??null,ageBandId:current.band?.id||null,ageBasis:current.basis});localStorage.setItem('rafiqAgeObservations_'+child.id,JSON.stringify(latest));window.RafiqFamily.notify(child.id,'Child observations updated','milestones.html');notes=latest;get('growthFilter').value='all';get('growthViewSaved').hidden=false;get('growthNote').value='';get('growthSaveStatus').textContent='Observation saved with your child’s age today.';render();}catch{error('We couldn’t save your observation. Your existing notes are unchanged.');}});
get('growthFilter').addEventListener('change',()=>{selected.clear();render();});get('prepareGrowthVisit').addEventListener('click',prepareVisit);get('growthBookLink').addEventListener('click',event=>{try{const text=get('growthBookingNote').value.trim();if(!text){event.preventDefault();error('Add a booking note or find a specialist directly from the navigation.');return;}window.RafiqConcernBooking.write(child.id,text);}catch{event.preventDefault();error('We couldn’t prepare your booking note. Please try again.');}});const requestedFilter=new URLSearchParams(location.search).get('filter');if(['all','observation','concern','daily-moment','follow-up'].includes(requestedFilter))get('growthFilter').value=requestedFilter;get('growthContent').hidden=false;render();if(location.hash==='#savedObservations')get('savedObservations').scrollIntoView({block:'start'});
});

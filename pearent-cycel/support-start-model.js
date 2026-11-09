/* Private family choices only. Nothing here writes health, messages, notes or AI context. */
(() => {
 'use strict';
 const C=()=>window.RafiqSupportStartContent;
 const clone=value=>JSON.parse(JSON.stringify(value));
 const enabled=child=>child?.supportProfile?.focus==='autism'&&['diagnosed_no_followup','diagnosed_following'].includes(child.supportProfile.situation);
 const state=child=>child.supportStart?.version===1?clone(child.supportStart):{version:1,manual:{},selectedQuestions:[],customQuestions:[],chooser:[],period:'week'};
 function array(storage,key){const value=JSON.parse(storage.getItem(key)||'[]');if(!Array.isArray(value))throw Error('Invalid saved records');return value.filter(v=>v&&typeof v==='object');}
 function aboutFilled(child){if(window.RafiqAboutMe)return window.RafiqAboutMe.hasContent(child);return Object.values(child.aboutMe?.sections||{}).some(section=>Object.values(section).some(v=>Array.isArray(v)?v.length:typeof v==='string'?!!v.trim():v===true));}
 function questions(child){const s=state(child),chosen=new Set(s.selectedQuestions);return [...C().questionGroups.flatMap(g=>g.questions).filter(q=>chosen.has(q.id)),...s.customQuestions.filter(q=>q.text?.trim()).map(q=>({id:q.id,custom:true,text:q.text}))];}
 function build(child,storage=localStorage){
  if(!enabled(child))return {enabled:false,periods:[],phase:null};
  const s=state(child),id=child.id;
  const notes=[...array(storage,'rafiqHealthNotes_'+id),...array(storage,'rafiqAgeObservations_'+id)].filter(n=>!n._deletedAt&&(!n.childId||n.childId===id));
  const invitations=array(storage,'rafiqCaregiverInvitationsPreview').filter(i=>i.childId===id&&(i.status==='accepted'||(i.status==='pending'&&(!i.expiresAt||new Date(i.expiresAt)>new Date()))));
  const bookings=array(storage,'rafiqBookings').filter(b=>b.childId===id&&!b._deletedAt&&['confirmed','upcoming','scheduled','accepted','completed'].includes(b.status)&&!['failed','refunded','refund_pending','pending'].includes(b.sessionPayment?.status));
  const followup=array(storage,'rafiqCareConnections').some(c=>c.childId===id&&['pending','active'].includes(c.status));
  const auto={about:aboutFilled(child),note:notes.length>0,invitation:invitations.length>0,questions:questions(child).length>=3,booking:bookings.length>0,followup};
  const periods=C().periods.map(p=>{const steps=p.steps.map(step=>({...step,autoDone:!!auto[step.automatic],done:!!auto[step.automatic]||s.manual[step.id]===true}));return {...p,steps,done:steps.filter(v=>v.done).length,total:steps.length};});
  let phase='about';if(auto.about||child.aboutMe?.cursor===9){if(periods[0].done<periods[0].total)phase='start';else if(!s.directoryVisitedAt&&!bookings.length)phase='find';else phase=bookings.length?'done':'booking';}
  return {enabled:true,state:s,periods,auto,phase};
 }
 function save(child,patch){
  const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);
  if(!fresh||!enabled(child)||!enabled(fresh)||JSON.stringify(fresh.supportStart)!==JSON.stringify(child.supportStart))throw Error('Support plan changed');
  const next={...state(fresh),...clone(patch)};
  if(!C().periods.some(p=>p.id===next.period)||!Array.isArray(next.chooser)||next.chooser.length>3||next.chooser.some(id=>!C().chooser.some(c=>c.choice===id))||!Array.isArray(next.selectedQuestions)||!Array.isArray(next.customQuestions)||next.customQuestions.some(q=>typeof q.id!=='string'||typeof q.text!=='string'||q.text.length>500))throw Error('Invalid plan');
  const validQuestions=new Set(C().questionGroups.flatMap(g=>g.questions.map(q=>q.id))),validSteps=new Set(C().periods.flatMap(p=>p.steps.map(s=>s.id)));
  next.selectedQuestions=[...new Set(next.selectedQuestions)].filter(id=>validQuestions.has(id));next.manual=Object.fromEntries(Object.entries(next.manual).filter(([id,v])=>validSteps.has(id)&&typeof v==='boolean'));
  const who=window.RafiqFamily.actor();Object.assign(next,{version:1,updatedAt:new Date().toISOString(),updatedBy:who.id,updatedByName:who.name,revision:(state(fresh).revision||0)+1});
  const updated={...fresh,supportStart:next};window.RafiqSetup.writeChildren([updated]);return updated;
 }
 function choose(ids){return [...new Set(ids)].slice(0,3).map(id=>C().chooser.find(c=>c.choice===id)).filter(Boolean).map(c=>C().specialists.find(s=>s.id===c.type));}
 function directoryUrl(type){return 'specialists.html?specialty='+encodeURIComponent(type.filter)+'&support=1';}
 function matchesSpecialty(specialist,key){
  const specialty=String(specialist.specialty||'');
  if(key==='developmental_pediatrician')return specialist.specialtyKey===key||/developmental.*p(?:ae|e)diatric|p(?:ae|e)diatric.*developmental|طبيب.*أطفال.*نمائي/i.test(specialty);
  if(key==='special_education')return specialist.specialtyKey===key||/special educat|تربية خاصة/i.test(specialty);
  return specialist.specialtyKey===key;
 }
 function verifiedResources(entries=window.RafiqSupportResources||[]){return entries.filter(r=>{try{const url=new URL(r.sourceUrl);return url.protocol==='https:'&&!url.username&&!url.password&&/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(r.verifiedAt||'')&&Number.isFinite(Date.parse(r.verifiedAt))&&!!r.verifiedBy&&r.title?.en&&r.title?.ar&&r.summary?.en&&r.summary?.ar;}catch{return false;}});}
 function questionText(child,translate=block=>block.en){return questions(child).map(q=>q.custom?q.text:translate(q).replaceAll('{name}',child.name||'')).join('\n');}
 window.RafiqSupportStart={enabled,state,aboutFilled,questions,build,save,choose,directoryUrl,matchesSpecialty,verifiedResources,questionText};
})();

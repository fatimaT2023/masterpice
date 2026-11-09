/* Private family passport. No health writes, notifications, inference or AI context. */
(() => {
 'use strict';
 const clone=value=>JSON.parse(JSON.stringify(value));
 const sections=()=>window.RafiqAboutCopy.sections;
 function profile(child){return child.aboutMe?.version===1?clone(child.aboutMe):{version:1,sections:{},sectionsDone:[],cursor:0};}
 function save(child,patch){
  const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);
  if(!fresh||JSON.stringify(fresh.aboutMe)!==JSON.stringify(child.aboutMe))throw Error('Stale family passport');
  const previous=profile(fresh),next={...previous,...clone(patch)};
  if(!Number.isInteger(next.cursor)||next.cursor<0||next.cursor>9||!next.sections||typeof next.sections!=='object'||Array.isArray(next.sections))throw Error('Invalid passport');
  next.sectionsDone=[...new Set(next.sectionsDone)].filter(id=>sections().some(s=>s.id===id));
  const who=window.RafiqFamily.actor();Object.assign(next,{version:1,updatedAt:new Date().toISOString(),updatedBy:who.id,updatedByName:who.name,revision:(previous.revision||0)+1});
  const result={...fresh,aboutMe:next};window.RafiqSetup.writeChildren([result]);return result;
 }
 function hasContent(child){return Object.values(profile(child).sections).some(s=>Object.values(s).some(v=>Array.isArray(v)?v.length:typeof v==='string'?v.trim():v===true));}
 function defaults(){return {sections:sections().map(s=>s.id),phones:false,allergies:false,photo:false};}
 function rows(child,selection=defaults(),translate=s=>s){
  const data=profile(child),out=[];
  for(const id of ['strengths','loves','name','communication','senses','calm','daily','safety','people']){
   if(!selection.sections.includes(id))continue;
   const section=sections().find(s=>s.id===id),values=data.sections[id]||{},entries=[];
   for(const f of section.fields){
    if(f.id==='photo'||(!selection.phones&&['contact','phone','otherContact'].includes(f.id))||(!selection.allergies&&['allergies','medicines'].includes(f.id)))continue;
    const value=values[f.id];if(value===undefined||value===''||value===false)continue;
    const format=v=>f.options.find(o=>o.id===v)?translate(f.options.find(o=>o.id===v).label):String(v);
    const text=Array.isArray(value)?value.map(format).join('، '):format(value);if(text)entries.push({label:translate(f.label).replaceAll('{name}',child.name),text});
   }
   if(entries.length)out.push({id,title:translate(section.title).replaceAll('{name}',child.name),entries});
  }
  return out;
 }
 function snapshot(child,selection,translate=s=>s){
  const title=translate(window.RafiqAboutCopy.ui.title).replaceAll('{name}',child.name);
  return [title,translate(window.RafiqAboutCopy.ui.intro),...rows(child,selection,translate).flatMap(s=>[s.title,...s.entries.map(e=>e.label+': '+e.text)])].join('\n').trim();
 }
 function prefill(child,storage=localStorage){
  const h=child.backgroundHistory||{},a=h.answers||{};
  const detail=value=>typeof value==='string'?value:value?.details||'';
  const allergies=detail(h.allergies)||detail(a['health.allergies'])||detail(h.legacy?.allergies);
  const medicines=[detail(h.medication)||detail(h.medicines)||detail(a['health.medicines'])||detail(h.legacy?.medicines)];
  const notes=JSON.parse(storage.getItem('rafiqHealthNotes_'+child.id)||'[]');if(!Array.isArray(notes))throw Error('Invalid health records');
  for(const n of notes)if(!n._deletedAt&&n.category==='medication')medicines.push([n.title,n.details].filter(Boolean).join(': '));
  return {allergies,medicines:[...new Set(medicines.filter(Boolean))].join('\n')};
 }
 function confirmPrefill(child,confirmed,storage=localStorage){if(confirmed!==true)return child;const data=profile(child),candidate=prefill(child,storage);data.sections.safety={...data.sections.safety,...Object.fromEntries(Object.entries(candidate).filter(([,v])=>v))};return save(child,{sections:data.sections});}
 function due(child,now=new Date()){const p=profile(child);if(!p.updatedAt||p.reviewDismissedFor===p.updatedAt)return false;const date=new Date(p.updatedAt);date.setMonth(date.getMonth()+3);return now>=date;}
 function send(child,selection,preview,threadId){
  const text=snapshot(child,selection,window.RafiqAboutTranslate||((s)=>s));if(text!==preview||!text||text.length>2000)throw Error('Review the selected text');
  const api=window.RafiqDirectMessages,viewer=api.identity('parent'),thread=api.list(viewer).find(t=>t.id===threadId&&t.childId===child.id);
  if(!thread||!api.canReply(viewer,thread))throw Error('Active follow-up required');return api.send(viewer,thread.id,preview);
 }
 window.RafiqAboutMe={profile,save,hasContent,defaults,rows,snapshot,prefill,confirmPrefill,due,send};
})();

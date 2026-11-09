const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
let stored=[{id:'c',name:'Leen',backgroundHistory:{allergies:{details:'Peanuts'},medication:{details:'Family medication'}}}],actor={id:'mom',name:'Mother'},fail=false,sent=[];
memory.set('rafiqHealthNotes_c',JSON.stringify([{category:'medication',title:'Prescription',details:'Ask doctor'},{category:'medication',title:'Removed',_deletedAt:'yes'}]));
const window={RafiqSetup:{readChildren:()=>structuredClone(stored),writeChildren:children=>{if(fail)throw Error('Quota');for(const c of children)stored[stored.findIndex(v=>v.id===c.id)]=structuredClone(c);}},RafiqFamily:{actor:()=>actor},RafiqDirectMessages:{identity:()=>({id:actor.id}),list:()=>[{id:'thread',childId:'c'}],canReply:()=>true,send:(v,id,text)=>sent.push({id,text})}};
const ctx=vm.createContext({window,localStorage:storage,Date});
for(const file of ['about-me-copy.js','about-me-model.js','support-services.js'])vm.runInContext(fs.readFileSync('pearent-cycel/'+file,'utf8'),ctx);
const M=window.RafiqAboutMe;let child=stored[0];
assert.equal(M.profile(child).cursor,0);assert.equal(M.hasContent(child),false);assert.equal(sent.length,0);
child=M.save(child,{sections:{loves:{songs:'Loves songs'},safety:{phone:'1234567',allergies:'Private allergy'}},cursor:2});
assert.equal(M.profile(stored[0]).cursor,2);assert.equal(M.profile(child).updatedBy,'mom');assert.equal(M.profile(child).sections.loves.songs,'Loves songs');
const stale=child;actor={id:'dad',name:'Father'};child=M.save(stored[0],{cursor:3});assert.equal(child.aboutMe.updatedBy,'dad');assert.equal(child.aboutMe.updatedByName,'Father');assert.throws(()=>M.save(stale,{cursor:4}));
fail=true;const before=JSON.stringify(stored);assert.throws(()=>M.save(child,{cursor:4}));assert.equal(JSON.stringify(stored),before);fail=false;
const originalHealth=storage.getItem('rafiqHealthNotes_c');assert.equal(M.confirmPrefill(child,false),child);assert.equal(child.aboutMe.sections.safety.allergies,'Private allergy');
child=M.confirmPrefill(child,true);assert.equal(child.aboutMe.sections.safety.allergies,'Peanuts');assert.match(child.aboutMe.sections.safety.medicines,/Prescription/);assert.doesNotMatch(child.aboutMe.sections.safety.medicines,/Removed/);assert.equal(storage.getItem('rafiqHealthNotes_c'),originalHealth);assert.equal(stored[0].backgroundHistory.allergies.details,'Peanuts');
let selection=M.defaults(),preview=M.snapshot(child,selection);assert.equal(selection.phones,false);assert.equal(selection.allergies,false);assert.equal(selection.photo,false);assert.doesNotMatch(preview,/1234567|Peanuts|Prescription/);assert.match(preview,/Loves songs/);
assert.equal(sent.length,0);assert.throws(()=>M.send(child,selection,preview+'changed','thread'));assert.equal(sent.length,0);M.send(child,selection,preview,'thread');assert.equal(sent[0].text,preview);
selection.phones=true;selection.allergies=true;assert.match(M.snapshot(child,selection),/1234567/);assert.match(M.snapshot(child,selection),/Peanuts/);
window.RafiqDirectMessages.canReply=()=>false;assert.throws(()=>M.send(child,M.defaults(),preview,'thread'));assert.equal(sent.length,1);
const old={...child,aboutMe:{...child.aboutMe,updatedAt:'2026-01-15T12:00:00Z'}};assert.equal(M.due(old,new Date('2026-04-14')),false);assert.equal(M.due(old,new Date('2026-04-16')),true);old.aboutMe.reviewDismissedFor=old.aboutMe.updatedAt;assert.equal(M.due(old,new Date('2026-04-16')),false);
let empty={...stored[0],aboutMe:undefined};stored[0]=empty;for(let cursor=1;cursor<=9;cursor++)empty=M.save(empty,{cursor});assert.equal(empty.aboutMe.sectionsDone.length,0);assert.equal(M.hasContent(empty),false);assert.equal(empty.aboutMe.cursor,9);
const registry=window.RafiqSupportServices;empty.supportProfile={focus:'autism',situation:'diagnosed_following'};assert.equal(registry.next(empty).id,'find-specialist');assert.equal(registry.services.find(s=>s.id==='safety-card').available,false);assert.equal(registry.services.find(s=>s.id==='about-me').destination,'about-me.html');
for(const [en,ar] of Object.entries(window.RafiqAboutCopy.messages)){assert.ok(en);assert.match(ar,/[\u0600-\u06ff]/,en);}
for(const section of window.RafiqAboutCopy.sections){assert.ok(window.RafiqAboutCopy.messages[section.title]);for(const f of section.fields){assert.ok(window.RafiqAboutCopy.messages[f.label]);for(const o of f.options)assert.ok(window.RafiqAboutCopy.messages[o.label]);}}
const html=fs.readFileSync('pearent-cycel/about-me.html','utf8');assert.doesNotMatch(html.match(/<title>(.*?)<\/title>/)[1],/autis/i);
for(const file of ['ai-assistant.js','activity-matching.js'])assert.ok(!fs.readFileSync('pearent-cycel/'+file,'utf8').includes('aboutMe'));
console.log('PASS: About me save/resume, skip-all, shared attribution, stale/failed saves, confirmed health copy without source writes, private export defaults, exact opt-in message snapshot, active conversation gate, review dates, registry, Arabic and no AI/activity use.');

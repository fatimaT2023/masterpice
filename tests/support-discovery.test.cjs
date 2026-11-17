// Phase 2 support discovery: catalog coverage, parent-reported status mapping,
// existing-service links only, autism gating, story hints and safe saving.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),memory=new Map();
const storage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
storage.setItem('rafiqUsers',JSON.stringify([{id:'parent',role:'parent',email:'parent@example.test'}]));
storage.setItem('rafiqChildren',JSON.stringify([
 {id:'layan',parentId:'parent',name:'Layan',gender:'female',dateOfBirth:'2023-05-01',supportData:{completedServices:['find-specialist']}},
 {id:'omar',parentId:'parent',name:'Omar',gender:'male',dateOfBirth:'2022-01-01'}
]));
const ctx={window:null,localStorage:storage,sessionStorage:{getItem:key=>key==='rafiqParentUserId'?'parent':null},document:{addEventListener(){}},addEventListener(){},location:{pathname:'/pearent-cycel/support-discovery.html',search:''},Date,URL,URLSearchParams};
ctx.window=ctx;vm.createContext(ctx);
for(const file of ['shared/family-access.js','pearent-cycel/parent-setup-utils.js','pearent-cycel/parent-experience.js','pearent-cycel/support-catalog-data.js','pearent-cycel/support-services.js','pearent-cycel/support-discovery-model.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
const D=ctx.RafiqSupportDiscovery,catalog=ctx.RafiqSupportCatalog,services=ctx.RafiqParentExperience.services;
// Arrays from the VM sandbox are copied locally so strict deep-equal compares values only.
const draft=over=>({...D.blank(),...over}),ids=list=>Array.from(list,s=>s.id);

// Coverage: every area has its own visual copy, every topic links only to services that exist.
assert.equal(catalog.categories.length,11);assert.equal(catalog.topics.length,32);
for(const area of catalog.categories){assert.ok(D.areaCopy[area.id]?.en&&/[؀-ۿ]/.test(D.areaCopy[area.id].ar),area.id);assert.ok(catalog.topics.some(t=>t.category===area.id),'every area has topics: '+area.id);}
for(const topic of catalog.topics){for(const s of topic.services)assert.ok(services[s],topic.id+' -> '+s);assert.ok(D.specialties[topic.specialty],topic.id+' specialty');
 const result=ids(D.services(draft({status:'concerns',topics:[topic.id],areas:[topic.category]})));
 for(const s of topic.services.filter(s=>!D.gated.includes(s)))assert.ok(result.includes(s),topic.id+' keeps '+s);assert.ok(result.includes('specialists'),topic.id+' offers the directory');}
for(const area of D.autismAreas)for(const s of area.services)assert.ok(services[s],'autism area '+area.id+' uses an existing service');
for(const s of D.statuses)assert.ok(/[؀-ۿ]/.test(s.title.ar));assert.deepEqual(ids(D.statuses),['diagnosed','assessment','concerns','monitoring','private']);

// Parent-reported status maps onto the existing support-mode values only.
assert.deepEqual({...D.profileFor(draft({status:'diagnosed',diagnosed:['autism'],following:'yes'}))},{situation:'diagnosed_following',focus:'autism'});
assert.deepEqual({...D.profileFor(draft({status:'diagnosed',diagnosed:['autism'],following:'private'}))},{situation:'diagnosed_no_followup',focus:'autism'});
assert.deepEqual({...D.profileFor(draft({status:'diagnosed',diagnosed:['speech-delay']}))},{situation:'diagnosed_no_followup',focus:'speech_language'});
assert.deepEqual({...D.profileFor(draft({status:'diagnosed',diagnosed:['adhd']}))},{situation:'diagnosed_no_followup',focus:'other'});
assert.deepEqual({...D.profileFor(draft({status:'diagnosed'}))},{situation:'diagnosed_no_followup',focus:'not_said'});
for(const [status,situation] of [['assessment','worried'],['concerns','worried'],['monitoring','none'],['private','skipped']])assert.equal(D.profileFor(draft({status})).situation,situation);
assert.equal(D.profileFor(draft({})),null,'No answer, no support-mode change');

// Autism: the three autism-only tools open only with a recorded autism diagnosis.
const dx=D.services(draft({status:'diagnosed',diagnosed:['autism'],following:'no',autismAreas:['routines','sensory']}));
for(const s of ['passport','routines','sensory','play','journey','specialists'])assert.ok(ids(dx).includes(s),'diagnosed autism: '+s);
assert.ok(dx.filter(s=>['routines','sensory'].includes(s.id)).every(s=>s.priority&&!s.locked),'Chosen autism areas come first');
const worried=D.services(draft({status:'concerns',topics:['autism'],areas:['development']}));
assert.ok(worried.filter(s=>D.gated.includes(s.id)).every(s=>s.locked),'Autism concern without a diagnosis never unlocks autism-only tools');
assert.ok(!ids(worried).includes('journey'));assert.ok(!D.priorityOptions(draft({status:'concerns',topics:['autism']})).some(id=>D.gated.includes(id)),'Locked tools are never offered as priorities');

// Other needs reach their own catalog services (navigation, not clinical advice).
const has=(d,list)=>{const got=ids(D.services(d));for(const s of list)assert.ok(got.includes(s),JSON.stringify(d)+' -> '+s);};
has(draft({status:'concerns',topics:['speech-delay']}),['speech','play','specialists']);
has(draft({status:'diagnosed',diagnosed:['adhd']}),['behaviour','play']);
// Phase 4: emotional topics use the observation journal (growth) rather than a physical health note.
has(draft({status:'concerns',topics:['anxiety']}),['behaviour','growth']);
has(draft({status:'concerns',topics:['selective-eating']}),['feeding']);
has(draft({status:'concerns',topics:['waking']}),['sleep','health']);
has(draft({status:'diagnosed',diagnosed:['down-syndrome']}),['growth','health','speech']);
has(draft({status:'concerns',areas:['sleep']}),['sleep']);
assert.deepEqual(ids(D.services(draft({status:'monitoring',monitoring:true}))),['growth','play','health'],'General development tracking');
assert.deepEqual([...D.services(draft({status:'diagnosed',diagnosed:['speech-delay','waking']})).find(s=>s.id==='specialists').specialties],['speech','pediatrician'],'Directory filters follow each topic');

// Story answers only highlight areas; emotional, sensory and genetic are never suggested.
const story={backgroundHistory:{answers:{'sleep.pattern':{value:'support'},'play.focus':{value:['communication','thinking']},'goals.choices':{value:['behaviour','feeding']},'about.caregiver':{value:'nursery'},'health.conditions':{value:'yes'}}},bornBeforeDueDate:'yes'};
assert.deepEqual([...D.hints(story)].sort(),['behaviour','development','everyday','feeding','learning','medical','sleep','speech']);
assert.equal(D.hints({}).size,0);const every={backgroundHistory:{answers:Object.fromEntries(['about.caregiver','birth.termStatus','birth.nicu','health.allergies','health.conditions','feeding.meals','feeding.difficulty','sleep.pattern','sleep.hard','play.communication','play.everydayParticipation'].map(k=>[k,{value:'support'}]))}};
for(const area of ['emotional','sensory','genetic'])assert.ok(!D.hints(every).has(area),'never hinted: '+area);

// Clean data: unknown ids dropped, at most 3 priorities, diagnosis fields only when diagnosed.
const c=D.clean(draft({status:'concerns',diagnosed:['autism'],diagnosisNote:'x',topics:['adhd','made-up','adhd'],areas:['sleep','nope'],priorities:['a','b','c','d'],autismAreas:['routines']}));
assert.deepEqual([...c.diagnosed],[]);assert.equal(c.diagnosisNote,'');assert.deepEqual([...c.topics],['adhd']);assert.deepEqual([...c.areas],['sleep']);assert.equal(c.priorities.length,3);assert.deepEqual([...c.autismAreas],[],'Autism areas need the autism topic');
assert.equal(D.clean(draft({status:'diagnosed',diagnosisNote:'y'.repeat(400)})).diagnosisNote.length,300);

// Saving: one child only, existing support data kept, autism tools follow the saved choice, stale tabs refused.
const read=id=>ctx.RafiqSetup.readChildren().find(c=>c.id===id);
let layan=read('layan');const before=JSON.stringify(read('omar'));
layan=D.save(layan,draft({status:'diagnosed',diagnosed:['autism'],following:'no',areas:['development'],autismAreas:['routines']}));
assert.equal(read('layan').supportDiscovery.revision,1);assert.equal(read('layan').supportProfile.situation,'diagnosed_no_followup');assert.equal(read('layan').supportProfile.focus,'autism');
assert.equal(ctx.RafiqSupportServices.active(read('layan')),true,'Existing autism tools open from the explicit choice');
assert.equal(JSON.stringify(read('layan').supportData),JSON.stringify({completedServices:['find-specialist']}),'Support data preserved');
assert.equal(JSON.stringify(read('omar')),before,'Other children untouched');
const stale={...layan,supportDiscovery:{...layan.supportDiscovery,revision:0}};assert.throws(()=>D.save(stale,draft({status:'monitoring'})),/stale/);
layan=D.save(read('layan'),draft({status:'concerns',topics:['autism']}));
assert.equal(read('layan').supportProfile.situation,'worried');assert.equal(ctx.RafiqSupportServices.active(read('layan')),false,'Changing the answer turns autism-only tools off');
assert.equal(read('layan').supportProfile.setAt,layan.supportProfile.setAt);
// Families who chose support before Phase 2 open with the same meaning.
const legacy=D.fromChild({supportProfile:{version:1,situation:'diagnosed_following',focus:'autism'}});
assert.equal(legacy.status,'diagnosed');assert.deepEqual([...legacy.diagnosed],['autism']);assert.equal(legacy.following,'yes');
assert.equal(D.fromChild({supportProfile:{situation:'none'}}).status,'monitoring');assert.equal(D.fromChild({}).status,null);
console.log('PASS: 11 areas and 32 topics covered with existing services only, five parent-reported statuses mapped to support mode, autism-only tools gated by a recorded diagnosis, story hints never suggest emotional/sensory/genetic, clean limits, single-child save with stale protection and legacy mapping.');

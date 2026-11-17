const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:null,document:{addEventListener(){}},location:{pathname:'/unit.html'},Date};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['demo-cases.js','parent-question-map.js','support-journey-model.js','parent-experience.js'])vm.runInContext(fs.readFileSync('pearent-cycel/'+f,'utf8'),ctx,{filename:f});
const api=ctx.RafiqParentExperience;assert.equal(api.categories.length,11);
for(const [key,expected] of [['autism','passport'],['sleep','sleep'],['feeding','feeding'],['speech','speech'],['typical','play'],['premature','growth'],['attention','behaviour']]){const child=ctx.RafiqDemoCases.fixtures(key).values.rafiqChildren[0],result=api.recommend(child);assert.ok(result.length<=3);assert.equal(result[0].id,expected);for(const r of result)assert.ok(r.reason.en&&r.reason.ar);}
const notesOnly={backgroundHistory:{answers:{'health.conditions':{value:'yes',details:'autism sleep feeding'}}}};assert.equal(api.recommend(notesOnly)[0].id,'play','Medical text never produces condition recommendations');assert.equal(api.recommend({backgroundHistory:{goals:{choices:['sleep','feeding','speech','play','growth']}}}).length,3);
for(const [id,record] of Object.entries(api.services)){for(const index of [0,1,3,4])assert.ok(record[index].ar&&record[index].en,id);assert.ok(fs.existsSync('pearent-cycel/'+record[2].split('?')[0]),id);}
const before=JSON.stringify(notesOnly);api.recommend(notesOnly);assert.equal(JSON.stringify(notesOnly),before);
// Dashboard presentation must prioritize time-sensitive records without changing them.
const now=new Date(2026,10,11,10),booking={id:'today',childId:'child-a'},report={bookingId:'past',childId:'child-a'};
const model={upcoming:{booking,date:new Date(2026,10,11,12)},unseenReport:true,report,next:{title:'Support step',url:'about-me.html',support:true}};
const snapshot=JSON.stringify(model);
assert.equal(api.nextAction(model,now).kind,'appointment');
assert.equal(api.nextAction(model,now).booking.id,'today');
assert.equal(api.nextAction({...model,upcoming:{booking,date:new Date(2026,10,12)}},now).kind,'report');
assert.equal(api.nextAction({...model,upcoming:null,unseenReport:false},now).url,'about-me.html');
assert.equal(JSON.stringify(model),snapshot,'Presentation does not mutate booking, report or recommendations');
console.log('PASS: 11 support gateways, bounded explicit-goal recommendations, autism tools, bilingual service metadata, real destinations and no clinical-text inference or child mutation.');

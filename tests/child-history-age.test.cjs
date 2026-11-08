const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx={window:null,document:{addEventListener(){}},addEventListener(){},Date,URLSearchParams};ctx.window=ctx;vm.createContext(ctx);
for(const file of ['pearent-cycel/parent-setup-utils.js','pearent-cycel/child-history-age.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'..',file),'utf8'),ctx,{filename:file});
const api=ctx.RafiqChildHistoryAge;
for(let months=0;months<84;months++){
 const stage=api.forAge(months);assert.ok(stage);assert.ok(months>=stage.min&&months<stage.max);
 for(const key of ['interests','dailyLife','sleepRoutine','mealtime','communication','everydayParticipation']){assert.equal(typeof stage.prompts[key],'string');assert.ok(ctx.RafiqHomeArabic[stage.prompts[key]]);assert.ok(ctx.RafiqHomeArabic[stage.prompts[key]+' (optional)']);}
}
for(const [months,id] of [[0,'birth-6'],[5,'birth-6'],[6,'6-12'],[11,'6-12'],[12,'12-24'],[23,'12-24'],[24,'24-36'],[35,'24-36'],[36,'36-60'],[59,'36-60'],[60,'60-84'],[83,'60-84']])assert.equal(api.forAge(months).id,id);
for(const invalid of [undefined,null,NaN,-1,84,100])assert.equal(api.forAge(invalid),null);
for(const key of ['interests','dailyLife','sleepRoutine','mealtime','communication','everydayParticipation'])assert.equal(new Set(api.stages.map(stage=>stage.prompts[key])).size,6,'Each stage should ask its own '+key+' question');
const date=new Date(2026,10,8),child={dateOfBirth:'2026-04-08',bornBeforeDueDate:'yes',expectedDueDate:'2026-06-08'};
const corrected=api.forChild(child,date);assert.equal(corrected.context.chronological.totalMonths,7);assert.equal(corrected.context.development.totalMonths,5);assert.equal(corrected.stage.id,'birth-6');
assert.equal(api.forChild({dateOfBirth:'2026-04-08'},date).stage.id,'6-12');
assert.equal(api.forChild({dateOfBirth:'2026-11-01',bornBeforeDueDate:'yes',expectedDueDate:'2026-12-01'},date).stage,null);
assert.equal(api.forChild({dateOfBirth:'invalid'},date).stage,null);
console.log('PASS: age prompts across 0–83 months, all stage boundaries, Arabic copy, distinct routines and interests, corrected age and unavailable-age fallback.');

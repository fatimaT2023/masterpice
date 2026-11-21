const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:null,addEventListener(){},document:{readyState:'loading',addEventListener(){}},location:{pathname:'/unit.html'}};ctx.window=ctx;vm.createContext(ctx);
for(const name of ['parent-cycle-ui.js','ai-demo-content.js','demo-cases.js','payment.js'])vm.runInContext(fs.readFileSync('pearent-cycel/'+name,'utf8'),ctx,{filename:name});
for(const [file,service] of Object.entries(ctx.RafiqParentCycleUI.pages)){
 assert.ok(fs.existsSync('pearent-cycel/'+file));assert.ok(fs.existsSync('pearent-cycel/'+service.next.split(/[?#]/)[0]));
 for(const key of ['title','purpose','saved'])assert.ok(service[key].en&&service[key].ar,file+' '+key);
}
for(const [question,key] of [['sleep','health'],['النوم','health'],['أكل','health'],['play together','play'],['نشاط','play'],['concern','concern'],['ملاحظاتي','growth'],['other','explore']]){
 const result=ctx.RafiqParentAIDemo.build(question);assert.equal(result.key,key);assert.ok(result.text.en.startsWith('Demo response'));assert.ok(result.text.ar.startsWith('رد تجريبي'));assert.ok(fs.existsSync('pearent-cycel/'+ctx.RafiqParentAIDemo.services[key].href.split('?')[0]));
}
const data=ctx.RafiqDemoCases.fixtures('speech'),specialist=data.values.rafiqSpecialists[0],availability=data.values['rafiqAvailability_'+specialist.id];
const now=new Date(2026,10,11);for(const [value,valid] of [['11/26',true],['12/26',true],['01/27',true],['10/26',false],['12/25',false],['00/27',false],['13/27',false],['x',false]])assert.equal(ctx.RafiqParentPayment.validExpiry(value,now),valid,value);
assert.equal(specialist.isDemo,true);assert.equal(availability.isDemo,true);assert.equal(availability.weeklySchedule.length,7);assert.ok(availability.weeklySchedule.every(day=>day.enabled&&day.start&&day.end));
console.log('PASS: bilingual parent service purposes/storage/next routes, neutral simulated AI with real service destinations, and bookable fictional specialist fixtures.');

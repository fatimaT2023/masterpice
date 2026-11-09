const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let stored=[{id:'c',name:'Leen',supportData:{kept:true}}],owner='mother',fail=false;
const window={RafiqSetup:{parentOwner:()=>owner,readChildren:()=>structuredClone(stored),writeChildren:incoming=>{if(fail)throw Error('quota');for(const c of incoming)stored[stored.findIndex(x=>x.id===c.id)]=structuredClone(c);}}};
const context=vm.createContext({window});
for(const file of ['support-mode.js','support-services.js'])vm.runInContext(fs.readFileSync('pearent-cycel/'+file,'utf8'),context);
const mode=window.RafiqSupportMode,registry=window.RafiqSupportServices;
let child=mode.save(stored[0],{situation:'diagnosed_no_followup',focus:'autism'});
assert.equal(child.supportProfile.version,1);assert.equal(child.supportProfile.setBy,'mother');
assert.equal(registry.available(child).length,2);assert.equal(registry.next(child).id,'about-me');
owner='father';assert.equal(stored[0].supportProfile.situation,'diagnosed_no_followup');
const stale=child;child=mode.save(stored[0],{situation:'diagnosed_following',focus:'autism'});
assert.equal(child.supportProfile.setBy,'father');assert.equal(registry.next(child).id,'about-me');
assert.throws(()=>mode.clear(stale));
fail=true;const before=JSON.stringify(stored);assert.throws(()=>mode.clear(child));assert.equal(JSON.stringify(stored),before);fail=false;
child=mode.clear(child);assert.equal(registry.available(child).length,0);assert.equal(child.supportData.kept,true);
for(const situation of ['worried','none','skipped']){child=mode.save(child,{situation,focus:null});assert.equal(registry.available(child).length,0);}
child=mode.save(child,{situation:'diagnosed_following',focus:'autism'});child.aboutMe={version:1,cursor:9};child.supportData.completedServices=['find-specialist'];assert.equal(registry.next(child),null);
for(const service of registry.services){assert.ok(service.titleAr&&service.descriptionAr);assert.equal(service.reviewStatus,'draft');}
for(const file of ['ai-assistant.js','booking.js','concern-booking.js'])assert.ok(!fs.readFileSync('pearent-cycel/'+file,'utf8').includes('supportProfile'),file+' must not consume support mode');
const ui=fs.readFileSync('pearent-cycel/support-mode-ui.js','utf8');const mock={window:{},document:{addEventListener(){}},};mock.window.addEventListener=()=>{};
vm.runInNewContext(ui,mock);for(const [key,pair] of Object.entries(mock.window.RafiqSupportUI.copy)){assert.equal(pair.length,2,key);assert.match(pair[1],/[\u0600-\u06ff]/,key);}
console.log('Support mode: save, shared parents, stale writes, failed writes, clear, skip, registry, next steps, privacy and Arabic passed.');

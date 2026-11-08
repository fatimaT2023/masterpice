const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const memory=new Map(),storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
const put=(key,value)=>storage.setItem(key,JSON.stringify(value));
put('rafiqUsers',[{id:'new-parent',role:'parent',email:'new@example.test'},{id:'existing-parent',role:'parent',email:'existing@example.test'}]);
// Old demo profiles without ownership remain in the browser after registration.
put('rafiqChildren',[{id:'legacy-demo',name:'Old demo'},{id:'existing-child',parentId:'existing-parent'}]);
put('rafiqCurrentChildId','legacy-demo');
function account(id){const session=new Map([['rafiqParentUserId',id],['rafiqRole','parent']]);const ctx={window:null,localStorage:storage,sessionStorage:{getItem:key=>session.get(key)||null},document:{addEventListener(){}},addEventListener(){},Date,URLSearchParams,location:{pathname:'/pearent-cycel/onboarding.html'}};ctx.window=ctx;vm.createContext(ctx);for(const file of ['shared/family-access.js','pearent-cycel/parent-setup-utils.js','shared/membership.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'..',file),'utf8'),ctx,{filename:file});return ctx;}
const fresh=account('new-parent'),existing=account('existing-parent'),legacy=account(null);
assert.equal(fresh.RafiqSetup.readChildren().length,0);
assert.equal(fresh.RafiqFamily.familyId({id:'legacy-demo'}),'family_legacy-browser');
assert.equal(existing.RafiqFamily.familyId({id:'legacy-demo'}),'family_legacy-browser');
assert.equal(fresh.RafiqFamily.familyChildren('family_new-parent').length,0);
assert.equal(fresh.RafiqMembership.canAdd(fresh.RafiqSetup.readChildren(),'family_new-parent'),true,'A new email can create its first child despite old demo data');
assert.equal(existing.RafiqMembership.canAdd(existing.RafiqSetup.readChildren(),'family_existing-parent'),false,'An existing free family still has a one-child limit');
assert.equal(legacy.RafiqMembership.canAdd(legacy.RafiqSetup.readChildren(),'family_legacy-browser'),false,'Legacy profiles still count in the legacy workspace');
fresh.RafiqSetup.writeChildren([{id:'first-new-child',parentId:'new-parent',familyId:'family_new-parent',name:'First child'}]);
assert.equal(fresh.RafiqSetup.readChildren().length,1);
assert.equal(fresh.RafiqMembership.canAdd(fresh.RafiqSetup.readChildren(),'family_new-parent'),false);
assert.equal(JSON.parse(storage.getItem('rafiqChildren')).length,3,'Do not clear or claim another account’s existing data');
assert.equal(existing.RafiqSetup.readChildren().length,1);
assert.equal(fresh.RafiqFamily.familyId({id:'explicit',familyId:'family_existing-parent'}),'family_existing-parent');
console.log('PASS: new parent first-child quota with legacy browser data, stable family ownership, existing limits and preserved records.');

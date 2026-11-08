const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),memory=new Map();
const storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
const put=(key,value)=>storage.setItem(key,JSON.stringify(value));
put('rafiqUsers',[{id:'parent',role:'parent',email:'parent@example.test'}]);
put('rafiqChildren',[{id:'one',parentId:'parent',name:'First',dateOfBirth:'2024-01-01'},{id:'two',parentId:'parent',name:'Second'},{id:'private',parentId:'unrelated'}]);
const ctx={window:null,localStorage:storage,sessionStorage:{getItem:key=>key==='rafiqParentUserId'?'parent':null},document:{addEventListener(){}},addEventListener(){},Date,URL,URLSearchParams,location:{pathname:'/pearent-cycel/child-history.html'}};ctx.window=ctx;vm.createContext(ctx);
const load=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
load('shared/family-access.js');load('pearent-cycel/parent-setup-utils.js');load('pearent-cycel/activity-matching.js');load('pearent-cycel/child-history-model.js');load('shared/specialist-public.js');
const child=ctx.RafiqSetup.readChildren()[0];
const saved=ctx.RafiqChildHistory.save('one',{familyHistory:'unknown',familyDetails:'Family-reported note',childHealth:'Parent-reported condition',interests:'Books',unexpected:'must not persist'});
assert.equal(saved.familyHistory,'unknown');assert.equal(saved.unexpected,undefined);
assert.equal(JSON.parse(storage.getItem('rafiqChildren')).find(c=>c.id==='two').backgroundHistory,undefined);
assert.throws(()=>ctx.RafiqChildHistory.save('private',{familyHistory:'yes'}),/متاح/);
assert.equal(ctx.RafiqChildHistory.normalize({familyHistory:'invalid'}).familyHistory,'');
assert.equal(ctx.RafiqChildHistory.normalize({medicines:'x'.repeat(1600)}).medicines.length,1500);
// Health and family answers cannot silently infer or change activity readiness.
assert.equal(storage.getItem('rafiqActivityProfile_one'),null);
ctx.RafiqActivityMatching.saveProfile(child,{abilities:{handling:'not_yet'},maxDifficulty:1,focusSkills:['communication']});
ctx.RafiqChildHistory.save('one',{childHealth:'Updated health note',familyHistory:'yes'});
assert.equal(ctx.RafiqActivityMatching.profile(child).abilities.handling,'not_yet');
assert.equal(ctx.RafiqActivityMatching.profile(child).focusSkills[0],'communication');
assert.equal(storage.getItem('rafiqActivityProfile_two'),null);
const api=ctx.RafiqSpecialistPublic;
for(const bad of ['javascript:alert(1)','http://example.test/photo.jpg','data:text/html,test','https://user:password@example.test/file'])assert.equal(api.url(bad),'');
assert.equal(api.image('data:image/svg+xml;base64,PHN2Zz4='),'');
const normalized=api.normalize({photo:'https://example.test/photo.jpg',video:'javascript:alert(1)',certificates:[{title:'Public certificate',url:'https://example.test/certificate.pdf'},{title:'Bad',url:'javascript:alert(1)'}],credentialProofs:{qualificationProof:{data:'private'}}});
assert.equal(normalized.video,'');assert.equal(normalized.certificates.length,1);assert.equal(normalized.credentialProofs,undefined);
put('rafiqSpecialists',[{id:'approved',status:'approved',credentialProofs:{private:'never published'}},{id:'pending',status:'pending'},{id:'rejected',status:'approved',verificationStatus:'rejected'}]);
assert.equal(api.find('approved').id,'approved');assert.equal(api.find('pending'),null);assert.equal(api.find('rejected'),null);assert.equal(api.find('missing'),null);
ctx.RafiqAccountStatus={inactive:()=>true};assert.equal(api.find('approved'),null);
// Exercise the four-part parent form: back/next retain answers, final save updates
// the same child's history and readiness, then continues setup.
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.value='';this.hidden=false;this.options=[];this.listeners={};}
 append(...children){this.children.push(...children);if(this.tagName==='select')this.options.push(...children);}
 replaceChildren(...children){this.children=[];this.append(...children);}
 setAttribute(){} focus(){} scrollIntoView(){}
 addEventListener(type,fn){this.listeners[type]=fn;}
 querySelector(tag){for(const child of this.children){if(child.tagName===tag)return child;const nested=child.querySelector?.(tag);if(nested)return nested;}return null;}
 get selectedOptions(){return this.options.filter(option=>option.value===this.value);}
}
const ids=Object.fromEntries(['historyExit','historyChild','historyFields','historyProgress','historyPrevious','historyLater','historyNext','historyStatus','historyForm'].map(id=>[id,new Element('div')]));
let initialize,redirect;
ctx.document={documentElement:{dataset:{},lang:'en'},getElementById:id=>ids[id],createElement:tag=>new Element(tag),addEventListener:(event,fn)=>{if(event==='DOMContentLoaded')initialize=fn;}};
ctx.Option=function(text,value){const option=new Element('option');option.textContent=text;option.value=value;return option;};
ctx.location={pathname:'/pearent-cycel/child-history.html',search:'?child=one',assign:url=>{redirect=url;}};
const girlProfiles=ctx.RafiqSetup.readChildren();girlProfiles.find(c=>c.id==='one').gender='female';ctx.RafiqSetup.writeChildren(girlProfiles);
load('pearent-cycel/child-history-copy.js');load('pearent-cycel/child-history-age.js');load('pearent-cycel/child-history.js');initialize();
const panels=ids.historyFields.children;assert.equal(panels.length,4);assert.equal(panels.filter(p=>!p.hidden).length,1);
assert.equal(ctx.document.documentElement.dataset.childAppearance,'girl');
assert.equal(panels[0].querySelector('h2').textContent,'Birth and health');
assert.equal(ids.historyNext.textContent,'Next');
assert.equal(ctx.RafiqHomeArabic['Birth and health'],'الحمل والولادة وصحّة طفلك');
function findId(node,id){if(node.id===id)return node;for(const child of node.children){const found=findId(child,id);if(found)return found;}return null;}
const healthInput=findId(ids.historyFields,'history-childHealth');healthInput.value='Changed in the parent form';
const submit=()=>ids.historyForm.onsubmit({preventDefault(){}});
submit();assert.equal(panels[1].hidden,false);ids.historyPrevious.onclick();assert.equal(healthInput.value,'Changed in the parent form');
submit();submit();assert.equal(panels[2].hidden,false);
const handlingInput=findId(panels[2],'readiness-handling');assert.ok(handlingInput);handlingInput.value='with_support';
submit();assert.equal(panels[3].hidden,false);assert.ok(panels[3].children.some(node=>node.tagName==='dl'));
submit();assert.equal(ids.historyStatus.textContent,'');assert.equal(redirect,'getting-started.html?child=one');
assert.equal(JSON.parse(storage.getItem('rafiqChildren')).find(c=>c.id==='one').backgroundHistory.childHealth,'Changed in the parent form');
assert.equal(ctx.RafiqActivityMatching.profile(child).abilities.handling,'with_support');
assert.equal(JSON.parse(storage.getItem('rafiqChildren')).find(c=>c.id==='two').backgroundHistory,undefined);
// The same form runs inside onboarding without navigating to a separate page.
ctx.location.pathname='/pearent-cycel/onboarding.html';ctx.location.search='?edit=one&return=profile';redirect=null;
let returnedToBasics=false;
let inline=ctx.RafiqChildStoryForm.mount({childId:'one',returnToProfile:true,onBack:()=>{returnedToBasics=true;}});
findId(ids.historyFields,'history-childHealth').value='Draft kept while editing basic details';
ids.historyPrevious.onclick();assert.equal(returnedToBasics,true);assert.equal(redirect,null);
const inlineDraft=inline.draft();inline.dispose();
inline=ctx.RafiqChildStoryForm.mount({childId:'one',returnToProfile:true,draft:inlineDraft,onBack(){}});
assert.equal(findId(ids.historyFields,'history-childHealth').value,'Draft kept while editing basic details');
submit();submit();submit();assert.equal(redirect,null);submit();
assert.equal(redirect,'getting-started.html?child=one');
assert.equal(JSON.parse(storage.getItem('rafiqChildren')).find(c=>c.id==='one').backgroundHistory.childHealth,'Draft kept while editing basic details');
// Moving between age stages changes the questions, while preserving answers
// and family-reported readiness even when a readiness question is not shown.
const birthdayAt=months=>{const now=new Date(),birth=new Date(now.getFullYear(),now.getMonth()-months,1);return [birth.getFullYear(),String(birth.getMonth()+1).padStart(2,'0'),'01'].join('-');};
let ageProfiles=ctx.RafiqSetup.readChildren();ageProfiles.find(c=>c.id==='one').dateOfBirth=birthdayAt(3);ctx.RafiqSetup.writeChildren(ageProfiles);
inline.dispose();inline=ctx.RafiqChildStoryForm.mount({childId:'one',returnToProfile:true});
assert.equal(findId(ids.historyFields,'readiness-handling'),null);
const babyInterest=ids.historyFields.children[2].children.find(n=>n.htmlFor==='history-interests').textContent;
assert.ok(babyInterest.includes('your baby'));
findId(ids.historyFields,'history-sleepRoutine').value='Family sleep observation to preserve';
const ageDraft=inline.draft();inline.dispose();
ageProfiles=ctx.RafiqSetup.readChildren();ageProfiles.find(c=>c.id==='one').dateOfBirth=birthdayAt(62);ctx.RafiqSetup.writeChildren(ageProfiles);
inline=ctx.RafiqChildStoryForm.mount({childId:'one',returnToProfile:true,draft:ageDraft});
const olderInterest=ids.historyFields.children[2].children.find(n=>n.htmlFor==='history-interests').textContent;
assert.notEqual(olderInterest,babyInterest);assert.ok(olderInterest.includes('friends'));
assert.equal(findId(ids.historyFields,'history-sleepRoutine').value,'Family sleep observation to preserve');
submit();submit();submit();submit();
assert.equal(JSON.parse(storage.getItem('rafiqChildren')).find(c=>c.id==='one').backgroundHistory.sleepRoutine,'Family sleep observation to preserve');
assert.equal(ctx.RafiqActivityMatching.profile(child).abilities.handling,'with_support');
// Parent-facing specialist page renders published details and re-checks approval
// at booking time, rather than trusting an earlier directory snapshot.
const clinicIds=Object.fromEntries(['clinicStatus','clinicName','clinicSpecialty','clinicExperience','clinicApproval','clinicPhoto','clinicBio','clinicApproach','clinicAges','clinicFirst','clinicCancellation','clinicVideo','clinicCredentials','clinicCertificates','clinicSessionDetails','clinicMessage','clinicBook','clinicBookBottom','clinicContent'].map(id=>[id,new Element('div')]));
ctx.document.getElementById=id=>clinicIds[id];ctx.location.search='?specialist=approved';
const sessionMemory=new Map();ctx.sessionStorage.setItem=(key,value)=>sessionMemory.set(key,String(value));
ctx.RafiqAccountStatus={inactive:()=>false};
put('rafiqSpecialists',[{id:'approved',fullName:'Published specialist',status:'approved',qualification:'Recorded qualification',price:25,consultationTypes:['online'],publicProfile:{approach:'Published approach',ageGroups:'2–6 years'},credentialProofs:{qualificationProof:{data:'Private proof'}}}]);
load('pearent-cycel/specialist-profile.js');initialize();assert.equal(clinicIds.clinicContent.hidden,false);assert.equal(clinicIds.clinicName.textContent,'Published specialist');assert.equal(clinicIds.clinicApproach.textContent,'Published approach');
redirect=null;clinicIds.clinicBook.onclick({preventDefault(){}});assert.equal(redirect,'booking.html');assert.equal(sessionMemory.get('rafiqSelectedSpecialistId'),'approved');
put('rafiqSpecialists',[{id:'approved',status:'rejected'}]);redirect=null;clinicIds.clinicBookBottom.onclick({preventDefault(){}});assert.equal(redirect,null);assert.ok(clinicIds.clinicStatus.textContent.includes('not currently available'));
console.log('PASS: child history ownership, per-child isolation, optional and unknown answers, independent readiness, URL validation, explicit public certificates and approved active specialist lookup.');

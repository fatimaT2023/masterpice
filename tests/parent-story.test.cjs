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
 constructor(tag){this.tagName=tag;this.children=[];this.value='';this.hidden=false;this.options=[];this.listeners={};this.dataset={};this.textContent='';}
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

// The former four-panel assertions are replaced by interview navigation and autosave checks.
assert.equal(ids.historyFields.children.length,1);
assert.equal(ctx.document.documentElement.dataset.childAppearance,'girl');
assert.equal(ids.historyFields.querySelector('h2').textContent,'How many siblings does your child have?');
function findId(node,id){if(node.id===id)return node;for(const child of node.children){const found=findId(child,id);if(found)return found;}return null;}
function findChoice(node,value){if(node.dataset?.value===value)return node;for(const child of node.children){const found=findChoice(child,value);if(found)return found;}return null;}
const submit=()=>ids.historyForm.onsubmit({preventDefault(){}});
findChoice(ids.historyFields,'1').onclick();
let history=ctx.RafiqSetup.readChildren()[0].backgroundHistory;
assert.equal(history.version,2);assert.equal(history.answers['about.siblings'].value,'1');assert.equal(history.cursor,'about.caregiver');
let inline=ctx.RafiqChildStoryForm.mount({childId:'one'});
assert.equal(ids.historyFields.querySelector('h2').textContent,'Who mainly looks after your child?');
findChoice(ids.historyFields,'other').onclick();
let detail=findId(ids.historyFields,'interview-details');assert.equal(detail.hidden,false);detail.value='Grandparent';detail.oninput();
assert.equal(ctx.RafiqSetup.readChildren()[0].backgroundHistory.answers['about.caregiver'].details,'Grandparent');
submit();assert.ok(ids.historyFields.querySelector('h2').textContent.includes('Thank you'));submit();
assert.equal(ids.historyProgress.textContent,'Birth');
// Concurrent edits must remain intact and stop navigation.
let rows=ctx.RafiqSetup.readChildren();rows[0].backgroundHistory.parentGoal='Other tab';ctx.RafiqSetup.writeChildren(rows);
findChoice(ids.historyFields,'term').onclick();assert.ok(ids.historyStatus.textContent.includes('another tab'));
assert.equal(ctx.RafiqSetup.readChildren()[0].backgroundHistory.parentGoal,'Other tab');
inline.dispose();inline=ctx.RafiqChildStoryForm.mount({childId:'one'});
// Walk every optional question to the grouped summary without requiring any health answer.
for(let n=0;n<140&&ids.historyNext.textContent!=='Save and see next steps';n++)submit();
assert.equal(ids.historyNext.textContent,'Save and see next steps');assert.equal(ids.historyStatus.textContent,'');
assert.ok(ids.historyFields.querySelector('dl'));
submit();assert.equal(redirect,'getting-started.html?child=one');
assert.equal(ctx.RafiqActivityMatching.profile(child).abilities.handling,'not_yet');
// Corrected-age selection and complete translation coverage.
for(const months of [3,9,18,30,48,72]){
 const now=new Date(),birth=new Date(now.getFullYear(),now.getMonth()-months,1);
 const dob=[birth.getFullYear(),String(birth.getMonth()+1).padStart(2,'0'),'01'].join('-');
 const questions=ctx.RafiqChildInterview.questions({...child,dateOfBirth:dob});
 assert.equal(questions.some(q=>q.id==='feeding.milk'),months<24);
 assert.equal(questions.some(q=>q.id==='play.ready-handling'),months>=12);
 for(const q of questions){assert.ok(ctx.RafiqHomeArabic[q.prompt],q.prompt);for(const option of q.options)assert.ok(ctx.RafiqHomeArabic[option.label],option.label);}
}

// A failed multi-key save rolls back history/readiness/growth and leaves the question available.
let reset=ctx.RafiqSetup.readChildren();reset[0].backgroundHistory.cursor='play.ready-handling';ctx.RafiqSetup.writeChildren(reset);
inline.dispose();inline=ctx.RafiqChildStoryForm.mount({childId:'one'});
const beforeHistory=storage.getItem('rafiqChildren'),beforeReady=storage.getItem('rafiqActivityProfile_one');
const originalWrite=ctx.RafiqSetup.writeChildren;ctx.RafiqSetup.writeChildren=()=>{throw Error('Simulated quota failure');};
findChoice(ids.historyFields,'comfortable').onclick();assert.ok(ids.historyStatus.textContent.includes('quota'));
assert.equal(storage.getItem('rafiqChildren'),beforeHistory);assert.equal(storage.getItem('rafiqActivityProfile_one'),beforeReady);
ctx.RafiqSetup.writeChildren=originalWrite;
// Editing reopens just the chosen section and returns to the summary.
reset=ctx.RafiqSetup.readChildren();reset[0].backgroundHistory.cursor='summary';ctx.RafiqSetup.writeChildren(reset);
inline.dispose();inline=ctx.RafiqChildStoryForm.mount({childId:'one'});
ids.historyFields.children[0].children.find(n=>n.tagName==='button').onclick();
assert.equal(ids.historyProgress.textContent,'About your child');
findChoice(ids.historyFields,'2').onclick();findChoice(ids.historyFields,'parents').onclick();
assert.equal(ids.historyNext.textContent,'Save and see next steps');
let returned=false;reset=ctx.RafiqSetup.readChildren();reset[0].backgroundHistory.cursor='about.siblings';ctx.RafiqSetup.writeChildren(reset);
inline.dispose();inline=ctx.RafiqChildStoryForm.mount({childId:'one',onBack:()=>{returned=true;}});
ids.historyPrevious.onclick();assert.equal(returned,true);
const draft=inline.draft();inline.dispose();inline=ctx.RafiqChildStoryForm.mount({childId:'one',draft});assert.equal(inline.draft().values.answers['about.siblings'].value,'2');

// Confirmation row links open only the requested interview sections.
inline.dispose();ctx.location.search='?child=one&interviewSection=feeding,sleep';
const beforeAllergies=JSON.stringify(ctx.RafiqSetup.readChildren()[0].backgroundHistory.allergies);
inline=ctx.RafiqChildStoryForm.mount({childId:'one'});assert.equal(ids.historyProgress.textContent,'Feeding');
for(let n=0;n<50&&ids.historyNext.textContent!=='Save and see next steps';n++)submit();
assert.equal(ids.historyNext.textContent,'Save and see next steps');
assert.equal(JSON.stringify(ctx.RafiqSetup.readChildren()[0].backgroundHistory.allergies),beforeAllergies);
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

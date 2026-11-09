const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const memory=new Map(),session=new Map([['rafiqParentUserId','parent'],['rafiqRole','parent']]);
const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
const put=(k,v)=>storage.setItem(k,JSON.stringify(v));
const now=new Date(),birth=new Date(now.getFullYear(),now.getMonth()-28,1),dob=[birth.getFullYear(),String(birth.getMonth()+1).padStart(2,'0'),'01'].join('-');
put('rafiqUsers',[{id:'parent',role:'parent',email:'parent@example.test'}]);
put('rafiqChildren',[{id:'child',parentId:'parent',name:'My child',dateOfBirth:dob,backgroundHistory:{parentGoal:'My own words, including a health concern',childHealth:'A parent-reported condition'}},{id:'other',parentId:'someone-else',name:'Private child'}]);
storage.setItem('rafiqSetupPendingChildId','child');
let initialize,redirect;
const ctx={window:null,document:{addEventListener:(event,callback)=>{if(event==='DOMContentLoaded')initialize=callback;}},addEventListener(){},localStorage:storage,sessionStorage:{getItem:k=>session.get(k)||null,setItem:(k,v)=>session.set(k,String(v))},Date,URLSearchParams,location:{pathname:'/pearent-cycel/getting-started.html',search:'?child=child',assign:url=>{redirect=url;},replace:url=>{redirect=url;}}};ctx.window=ctx;vm.createContext(ctx);
const load=file=>vm.runInContext(fs.readFileSync(path.resolve(__dirname,'..',file),'utf8'),ctx,{filename:file});
for(const file of ['shared/family-access.js','pearent-cycel/parent-setup-utils.js','pearent-cycel/activity-matching.js','pearent-cycel/daily-moments.js','pearent-cycel/child-history-age.js','pearent-cycel/support-guide.js'])load(file);
const api=ctx.RafiqSupportGuide,child=ctx.RafiqSetup.readChildren()[0];
let model=api.build(child);assert.equal(model.focusSkills.length,0,'Free-text health concerns must not infer a missing skill');assert.equal(model.parentGoal,child.backgroundHistory.parentGoal);
assert.equal(model.stage.id,'24-36');assert.equal(JSON.parse(storage.getItem('rafiqChildren')).find(c=>c.id==='child').setupCompletedAt,undefined);
ctx.RafiqActivityMatching.saveProfile(child,{abilities:{handling:'with_support'},maxDifficulty:2,focusSkills:['fine_motor']});
api.saveFocus(child,['communication']);assert.equal(ctx.RafiqActivityMatching.profile(child).abilities.handling,'with_support');assert.equal(ctx.RafiqActivityMatching.profile(child).maxDifficulty,2);
const idea=api.preview(child);assert.ok(idea.item);assert.ok(idea.item.minMonths<=model.ageContext.development.totalMonths&&idea.item.maxMonthsExclusive>model.ageContext.development.totalMonths);
assert.throws(()=>api.finish('other','activities',[]),/unavailable/);assert.throws(()=>api.finish('child','unknown',[]),/available/);
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.hidden=false;this.checked=false;this.dataset={};this.textContent='';}
 append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=[];this.append(...nodes);}after(){}scrollIntoView(){}setAttribute(){}
}
const ids=Object.fromEntries(['welcomeServices','guideSavedLine','guideActivityMaterials','guideActivityInstruction','guideWhatHappens','guideHeading','guideSavedHeading','guidePrivacy','guideProfile','guideNote','guideSummary','guideIncomplete','guideActivityDuration','guideError','guideChild','guideStage','guideEdit','guideEditBottom','guideGoalBlock','guideGoal','guideFocusIntro','guideAreas','guideActivityReasons','guideActivityTitle','guideActivityCopy','guideStart','guideActivityStatus','guideFocusStatus','guideUpdate','guideForm','guideContent'].map(id=>[id,new Element('div')]));
ids.guideContent.hidden=true;
const actions=['development','concern','explore'].map(goal=>{const button=new Element('button');button.dataset.guideGoal=goal;return button;});
ctx.document.getElementById=id=>ids[id];ctx.document.createElement=tag=>new Element(tag);ctx.document.querySelectorAll=selector=>selector==='[data-guide-goal]'?actions:[];ctx.sessionStorage.removeItem=k=>session.delete(k);load('pearent-cycel/rafiq-services.js');
let chosenLanguage;ctx.RafiqLanguage={setLanguage:value=>{chosenLanguage=value;}};load('pearent-cycel/getting-started.js');initialize();assert.equal(chosenLanguage,'ar');
assert.equal(ids.guideContent.hidden,false);assert.equal(ids.welcomeServices.children.length,6);assert.equal(ids.guideHeading.textContent,'Welcome to Rafiq');assert.equal(ids.guideAreas.children.length,6);assert.ok(ids.guideActivityTitle.textContent);assert.equal(redirect,undefined,'Viewing the guide never sends a parent straight to Today');
const skillInputs=ids.guideAreas.children.map(label=>label.children[0]);for(const input of skillInputs)input.checked=input.value==='social';ids.guideUpdate.onclick();assert.equal(ctx.RafiqActivityMatching.profile(child).focusSkills[0],'social');assert.equal(ctx.RafiqActivityMatching.profile(child).abilities.handling,'with_support');
ids.guideForm.onsubmit({preventDefault(){}});assert.equal(redirect,'daily-activity.html');
const complete=JSON.parse(storage.getItem('rafiqChildren')).find(c=>c.id==='child');assert.ok(complete.setupCompletedAt);assert.ok(complete.supportGuideReviewedAt);assert.equal(complete.initialGoal,'activities');assert.equal(storage.getItem('rafiqSetupPendingChildId'),null);assert.equal(JSON.parse(storage.getItem('rafiqChildren')).find(c=>c.id==='other').setupCompletedAt,undefined);
// Without a valid age, an activity cannot bypass eligibility; another next step remains available.
const rows=ctx.RafiqSetup.readChildren();rows[0].dateOfBirth='invalid';ctx.RafiqSetup.writeChildren(rows);const before=storage.getItem('rafiqChildren'),beforeProfile=storage.getItem('rafiqActivityProfile_child');
assert.throws(()=>api.finish('child','activities',['thinking']),/Review age/);assert.equal(storage.getItem('rafiqChildren'),before);assert.equal(storage.getItem('rafiqActivityProfile_child'),beforeProfile);assert.equal(api.finish('child','development',[]),'milestones.html');

// Confirmation summaries cover empty, partial, old and structured saved histories.
let summary=api.summary({...child,backgroundHistory:undefined});assert.equal(summary.rows.length,5);assert.equal(summary.mostlyEmpty,true);assert.equal(summary.answeredSections,1);assert.equal(summary.rows[1].recorded,false);
summary=api.summary({...child,backgroundHistory:{version:1,childHealth:'Family note',allergies:'Milk',mealtime:'Family meals',sleepRoutine:'Naps',interests:'Books',parentGoal:'More play'}});
assert.equal(summary.answeredSections,5);assert.equal(summary.mostlyEmpty,false);assert.equal(summary.rows[1].parts[0].text,'Family note');assert.equal(summary.rows[1].parts[0].user,true);assert.ok(summary.rows[2].href.includes('feeding%2Csleep'));
summary=api.summary({...child,backgroundHistory:{version:2,answers:{'health.allergies':{value:'yes',details:'Egg'},'feeding.milk':{value:'mixed',details:''},'play.interests':{value:'other',details:'Music'},'goals.choices':{value:['sleep','speech'],details:''}},goals:{choices:['sleep','speech']}}});
assert.equal(summary.answeredSections,5);assert.equal(summary.rows[1].parts[0].text,'Egg');assert.equal(summary.rows[2].parts[0].text,'Mixed');assert.equal(summary.rows[3].parts[0].text,'Music');assert.equal(summary.rows[4].parts[0].text,'Sleep');
summary=api.summary({...child,backgroundHistory:{version:2,answers:{'health.allergies':{value:'skip'},'feeding.milk':{value:'unknown'}}}});assert.equal(summary.mostlyEmpty,true);assert.equal(summary.rows[1].recorded,false);
summary=api.summary({...child,backgroundHistory:{version:2,allergies:{has:'yes',details:'Milk'},medication:{has:'yes',details:'Supplement'},goals:{choices:['sleep'],details:'Our own words'}}});assert.equal(summary.rows[1].recorded,true);assert.equal(summary.rows[4].parts[0].text,'Sleep');
// No suitable activity gives an enabled observation action, and that action completes setup.
redirect=undefined;load('pearent-cycel/getting-started.js');initialize();assert.equal(ids.guideStart.disabled,false);assert.equal(ids.guideStart.textContent,'Save a first note');assert.ok(ids.guideActivityStatus.textContent.includes('No suitable activity'));
ids.guideForm.onsubmit({preventDefault(){}});assert.equal(redirect,'milestones.html');assert.equal(ctx.RafiqSetup.readChildren()[0].initialGoal,'development');
load('pearent-cycel/support-guide-copy.js');for(const text of ['Your next step','Start the first activity','Record a first observation','Age and stage','Not recorded yet','Why this activity?'])assert.ok(ctx.RafiqHomeArabic[text]);
load('pearent-cycel/today-ar.js');for(const item of ctx.RafiqDailyMoments.library){assert.ok(ctx.RafiqHomeArabic[item.title],item.title);assert.ok(ctx.RafiqHomeArabic[item.duration],item.duration);}

// Model the shared translator's whitespace normalization on the actual rendered name nodes.
function visible(node,arabic=false){if(node.children.length)return node.children.map(n=>visible(n,arabic)).join('');const value=node.textContent||'';return arabic?(ctx.RafiqHomeArabic[value.trim()]??value):value;}
assert.equal(visible(ids.guideProfile),'Open\u00a0My child’s profile');assert.equal(visible(ids.guideSavedLine),'My child’s profile is saved');
assert.equal(visible(ids.guideProfile,true),'افتحوا ملف\u00a0My child');assert.equal(visible(ids.guideSavedLine,true),'My child، ملفه محفوظ');
for(const item of ctx.RafiqDailyMoments.library){assert.ok(ctx.RafiqHomeArabic[item.steps[0]],item.id+' concrete instructions');assert.ok(ctx.RafiqHomeArabic[item.materials],item.id+' materials');}
const html=fs.readFileSync(path.resolve(__dirname,'../pearent-cycel/getting-started.html'),'utf8');assert.equal((html.match(/<details/g)||[]).length,2);assert.ok(!html.includes('<details open'));assert.ok(!html.includes('3 · Your family'));assert.ok(html.includes('lang="ar" dir="rtl"'));assert.ok(!html.includes('guideSummary'));assert.ok(!html.includes('What we saved'));assert.ok(html.includes('welcomeServices'));
console.log('PASS: empty/partial/full v1/v2 summaries, optional sections, activity-title Arabic coverage, enabled observation fallback and completion, contextual guide, explicit focus without diagnosis, real eligible activity preview, no automatic Today navigation, preserved readiness, first action completion, rollback and child isolation.');

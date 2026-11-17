// Phase 1 onboarding: the visual story layer (topic map, counters, quiet Skip,
// checkpoints and review) must not change answers, order or saving.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),memory=new Map();
const storage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
storage.setItem('rafiqUsers',JSON.stringify([{id:'parent',role:'parent',email:'parent@example.test'}]));
storage.setItem('rafiqChildren',JSON.stringify([{id:'one',parentId:'parent',name:'Layan',gender:'female',dateOfBirth:'2024-01-01'}]));
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.value='';this.hidden=false;this.dataset={};this.textContent='';this.className='';this.attributes={};}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=[];this.append(...children);}
 setAttribute(name,value){this.attributes[name]=String(value);} focus(){}
 querySelector(tag){for(const child of this.children){if(child.tagName===tag)return child;const nested=child.querySelector?.(tag);if(nested)return nested;}return null;}
}
const all=(node,test,out=[])=>{for(const child of node.children||[]){if(test(child))out.push(child);all(child,test,out);}return out;};
const ids=Object.fromEntries(['historyExit','historyChild','historyFields','historyProgress','historyPrevious','historyLater','historyNext','historyStatus','historyForm'].map(id=>[id,new Element('div')]));
let initialize;
const ctx={window:null,localStorage:storage,sessionStorage:{getItem:key=>key==='rafiqParentUserId'?'parent':null},addEventListener(){},removeEventListener(){},Date,URL,URLSearchParams,
 location:{pathname:'/pearent-cycel/child-history.html',search:'?child=one',assign(){}},
 document:{documentElement:{dataset:{},lang:'en'},getElementById:id=>ids[id],createElement:tag=>new Element(tag),addEventListener:(event,fn)=>{if(event==='DOMContentLoaded')initialize=fn;}}};
ctx.window=ctx;vm.createContext(ctx);
for(const file of ['shared/family-access.js','pearent-cycel/parent-setup-utils.js','pearent-cycel/activity-matching.js','pearent-cycel/child-history-model.js','pearent-cycel/child-history-copy.js','pearent-cycel/child-history-age.js','pearent-cycel/child-history.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
initialize();
const panel=()=>ids.historyFields.children[0],submit=()=>ids.historyForm.onsubmit({preventDefault(){}});
const choice=value=>all(panel(),n=>n.dataset?.value===value)[0];

// Question view: nine topic beads, the current one marked, and an in-topic counter.
let beads=all(panel(),n=>n.tagName==='li'&&n.className.includes('story-bead'));
assert.equal(beads.length,9,'All nine story topics are on the map');
assert.deepEqual(beads.map(b=>b.dataset.section),['about','birth','health','vaccinations','feeding','sleep','play','family','goals']);
assert.ok(beads[0].className.includes('is-current'));assert.equal(beads[0].attributes['aria-current'],'step');
assert.equal(all(panel(),n=>n.className==='story-count')[0].textContent,'1 / 2');
assert.equal(all(panel(),n=>n.className==='story-section-name')[0].textContent,'About your child');
assert.equal(panel().querySelector('h2').textContent,'How many siblings does your child have?','The question is still the first heading');
assert.equal(ids.historyProgress.textContent,'About your child','Live section label is unchanged');
// Not sure and Skip are kept, but marked as quiet secondary answers.
assert.ok(choice('unknown').className.includes('is-minor'));assert.ok(choice('skip').className.includes('is-minor'));assert.ok(!choice('1').className.includes('is-minor'));

// Checkpoint after a topic: About is done, Birth is next, and the answer is saved.
choice('2').onclick();choice('parents').onclick();
assert.ok(panel().className.includes('story-done'));assert.ok(panel().querySelector('h2').textContent.includes('Thank you'));
beads=all(panel(),n=>n.className.includes?.('story-bead'));
assert.ok(beads[0].className.includes('is-done'));assert.ok(beads[1].className.includes('is-current'));
assert.equal(all(panel(),n=>n.className.includes?.('story-next-up'))[0].children[1].textContent,'Birth');
assert.equal(JSON.parse(storage.getItem('rafiqChildren'))[0].backgroundHistory.answers['about.siblings'].value,'2');
submit();
assert.ok(all(panel(),n=>n.className.includes?.('story-bead'))[0].className.includes('is-done'));

// Multi-select questions are marked so they read as checkboxes.
for(let n=0;n<80&&!all(panel(),x=>x.className?.includes('is-multi')).length;n++)submit();
assert.equal(panel().querySelector('h2').textContent,'What would you like to support through play?');
choice('communication').onclick();choice('social').onclick();
assert.deepEqual(JSON.parse(storage.getItem('rafiqActivityProfile_one')).focusSkills,['communication','social'],'Play focus still saves to readiness');

// Review: skipped questions are hidden, real answers are counted per topic.
for(let n=0;n<80&&!panel().className.includes('story-summary');n++)submit();
assert.equal(ids.historyNext.textContent,'Save and see next steps');
const titles=all(panel(),n=>n.tagName==='h3');
assert.equal(titles.length,9);
const count=id=>all(panel(),n=>n.tagName==='h3'&&n.className.includes('story-icon-'+id))[0].children[0].textContent;
assert.equal(count('about'),'2 / 2');assert.equal(count('birth'),'0 / 7','Skipped answers are not counted as given');
const hiddenRows=all(panel(),n=>n.tagName==='dd'&&n.className==='is-empty');assert.ok(hiddenRows.length>20,'Skipped rows are marked for hiding');
const playChips=all(panel(),n=>n.className==='story-answer').map(n=>n.textContent);
assert.ok(playChips.includes('Communication and language')&&playChips.includes('Interaction and turn-taking'),'Each chosen value is its own translatable label');
// The first direct button is still the first topic's Edit, which reopens just that topic.
panel().children.find(n=>n.tagName==='button').onclick();
assert.equal(ids.historyProgress.textContent,'About your child');
console.log('PASS: nine-topic story map, in-topic counter, quiet Skip/Not sure, topic checkpoints, multi-select marking, review hides skipped answers and keeps per-value labels, unchanged saving and edit.');

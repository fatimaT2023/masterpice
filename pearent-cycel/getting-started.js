document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const get=id=>document.getElementById(id),make=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n;},api=window.RafiqSupportGuide;
 try{
 const id=new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected(),child=window.RafiqSetup.readChildren().find(c=>c.id===id);if(!child){location.replace('onboarding.html');return;}
 window.RafiqFamily.select(child.id);const model=api.build(child),focusInputs=[];
 get('guideChild').textContent=child.name+' · '+window.RafiqSetup.formatAge(model.ageContext.chronological);
 get('guideStage').textContent=model.stage?model.stage.label:'Review your child’s date of birth to see age-specific ideas.';
 if(model.ageContext.basis==='corrected')get('guideStage').after(make('p',window.RafiqChildHistoryAge.corrected));
 const edit='onboarding.html?edit='+encodeURIComponent(child.id)+'&return=profile&section=story';get('guideEdit').href=edit;get('guideEditBottom').href=edit;
 if(model.parentGoal){get('guideGoalBlock').hidden=false;get('guideGoal').textContent=model.parentGoal;}
 get('guideFocusIntro').textContent=model.focusSkills.length?'Your previous choices are selected below. These are your preferences, not skills assessed as missing.':'You have not chosen a focus yet. Explore the areas below, or leave them open for a general age-appropriate play idea.';
 for(const [key,area] of Object.entries(api.areas)){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=key;input.checked=model.focusSkills.includes(key);const copy=document.createElement('span');copy.append(make('strong',area.title),make('span',area.copy));label.append(input,copy);get('guideAreas').append(label);focusInputs.push(input);}
 const focus=()=>focusInputs.filter(input=>input.checked).map(input=>input.value);
 function preview(){get('guideActivityReasons').replaceChildren();const selection=api.preview(child),item=selection.item;get('guideActivityTitle').textContent=item?.title||'';get('guideActivityCopy').textContent=item?.insight||'';get('guideStart').disabled=!item||!!selection.noLongerSuggested;
  get('guideActivityStatus').textContent=!item?'No suitable play idea is available from the current profile. Review age and readiness, or start by recording an observation.':selection.noLongerSuggested?'A saved activity no longer matches the current readiness. Review the profile or record an observation first.':'An age-matched idea using the play readiness saved in your child’s profile.';
  if(item){get('guideActivityReasons').append(make('li',api.areas[item.targetSkill].title),make('li',window.RafiqActivityMatching.levels[item.difficulty]));if(focus().length&&!focus().includes(item.targetSkill))get('guideActivityReasons').append(make('li','Your focus never overrides age, readiness or current specialist guidance.'));}
  return selection;
 }
 function update(){get('guideError').textContent='';api.saveFocus(child,focus());const selection=preview();get('guideFocusStatus').textContent='Your focus is saved for this child. You can change it anytime.';return selection;}
 get('guideUpdate').onclick=()=>{try{update();}catch(error){get('guideError').textContent=error.message;}};
 function start(goal){try{get('guideError').textContent='';if(goal==='activities'){const selection=update();if(!selection.item||selection.noLongerSuggested)return;}const url=api.finish(child.id,goal,focus());location.assign(url);}catch(error){get('guideError').textContent=error.message||'We could not save your starting path. Please try again.';get('guideError').scrollIntoView();}}
 get('guideForm').onsubmit=event=>{event.preventDefault();start('activities');};document.querySelectorAll('[data-guide-goal]').forEach(button=>button.onclick=()=>start(button.dataset.guideGoal));preview();get('guideContent').hidden=false;
 }catch(error){get('guideError').textContent=error.message||'We could not load your child’s starting path. Please try again.';}
});

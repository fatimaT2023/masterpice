document.addEventListener('DOMContentLoaded', () => {
'use strict';
const {readChildren,ageFromBirth,formatAge}=window.RafiqSetup;
const get=id=>document.getElementById(id), form=get('needsForm'), button=get('startButton'), explore=get('exploreButton');
const choices={development:{url:'milestones.html',label:'Growth & milestones',copy:'Start with your child’s stage and record your observations.'},activities:{url:'challenges.html',label:'Activities together',copy:'Explore age-group guidance and things to try together.'},concern:{url:'screening.html',label:'My concern',copy:'Tell us what is worrying you, answer a few age-aware observation questions, and review your next step.'},health:{url:'health.html',label:'Health & vaccinations',copy:'Start by adding a health note, measurement, or vaccination record.'},explore:{url:'parent-dashboard.html',label:'Today'}};
let child;
try{const id=new URLSearchParams(location.search).get('child')||localStorage.getItem('rafiqCurrentChildId');child=readChildren().find(item=>item.id===id);}catch{get('needsError').textContent='We couldn’t read your child’s profile in this browser. Please return to child details and try again.';form.querySelectorAll('input,button').forEach(input=>input.disabled=true);return;}
if(!child){location.replace('onboarding.html');return;}
const age=ageFromBirth(child.dateOfBirth);
get('needsChild').textContent=child.name+(age?' · '+formatAge(age):'');get('backToChild').href='onboarding.html?edit='+encodeURIComponent(child.id);
function update(){const value=form.querySelector('input[name="goal"]:checked')?.value;button.disabled=!choices[value];button.textContent=choices[value]?'Start with '+choices[value].label:'Continue';get('startPreview').textContent=choices[value]?.copy||'Pick a starting point, or explore at your own pace.';}
form.querySelectorAll('input[name="goal"]').forEach(input=>{input.checked=input.value===child.initialGoal;input.addEventListener('change',update);});update();
function start(goal){
 if(!choices[goal])return;button.disabled=true;explore.disabled=true;get('needsError').textContent='';
 try{
 const children=readChildren(),index=children.findIndex(item=>item.id===child.id);if(index<0)throw new Error('Missing child');
 children[index]={...children[index],initialGoal:goal,setupCompletedAt:new Date().toISOString()};
 localStorage.setItem('rafiqChildren',JSON.stringify(children));localStorage.setItem('rafiqCurrentChildId',child.id);
 if(localStorage.getItem('rafiqSetupPendingChildId')===child.id)localStorage.removeItem('rafiqSetupPendingChildId');
 location.assign(choices[goal].url);
 }catch{get('needsError').textContent='We couldn’t save your choice. Check that browser storage is available, then try again.';explore.disabled=false;update();}
}
form.addEventListener('submit',event=>{event.preventDefault();if(!button.disabled)start(form.querySelector('input[name="goal"]:checked')?.value);});
explore.addEventListener('click',()=>{if(!explore.disabled)start('explore');});
});

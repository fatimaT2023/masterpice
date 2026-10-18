/* A read-only view of the child's existing health records. No duplicate profile values. */
(()=>{
'use strict';
const get=id=>document.getElementById(id);
function usableDate(value){return !!window.RafiqSetup.ageFromBirth(value);}
function displayDate(value){return usableDate(value)?new Date(value+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):'Date not recorded';}
function positive(value){return value!==null&&value!==undefined&&String(value).trim()!==''&&Number.isFinite(Number(value))&&Number(value)>0;}
function load(type,child){return window.RafiqHealthRecords.read(type,child.id).filter(record=>!record._deletedAt&&(!record.childId||record.childId===child.id)).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||'')));}
function appendRecord(container,title,record,child,body){
 const article=document.createElement('article');article.className='profile-health-entry';
 const heading=document.createElement('h3');heading.textContent=title;
 const meta=document.createElement('p');meta.className='screen-flow-small';
 const age=usableDate(record.date)?window.RafiqSetup.ageFromBirth(child.dateOfBirth||child.dob||child.birthDate,new Date(record.date+'T12:00:00')):null;
 meta.textContent=displayDate(record.date)+(age?' · '+window.RafiqSetup.formatAge(age):'');
 const content=document.createElement('p');content.className='profile-health-body';content.textContent=body||'No additional details.';
 article.append(heading,meta,content);container.append(article);
}
function render(child){
 const types=[['growth','Growth'],['vaccine','Vaccine'],['note','Note']];
 for(const [type,label] of types){
  const container=get('profile'+label+'Records');container.replaceChildren();
  try{
   const records=load(type,child);get('profile'+label+'Count').textContent='('+records.length+')';
   if(!records.length){const empty=document.createElement('p');empty.textContent='No '+(type==='growth'?'measurements':type==='vaccine'?'vaccines':'health notes')+' recorded yet.';container.append(empty);}
   if(type==='growth'){
    for(const [field,unit,id] of [['weight','kg','Weight'],['height','cm','Height']]){
     const latest=records.find(record=>positive(record[field])&&usableDate(record.date)&&record.date>=(child.dateOfBirth||child.dob||child.birthDate||''));
     get('profile'+id).textContent=latest?Number(latest[field])+' '+unit:'Not recorded yet';
     get('profile'+id+'Date').textContent=latest?'Measured on '+displayDate(latest.date):'Add a dated measurement to see it here.';
    }
    records.forEach(record=>appendRecord(container,'Height & weight',record,child,[positive(record.weight)?'Weight: '+Number(record.weight)+' kg':'',positive(record.height)?'Height / length: '+Number(record.height)+' cm':''].filter(Boolean).join('\n')));
   } else if(type==='vaccine'){
    records.forEach(record=>appendRecord(container,record.name||'Vaccination record',record,child,[record.provider?'Provider / clinic: '+record.provider:'',record.note||''].filter(Boolean).join('\n')));
   } else {
    const categories={checkup:'Checkup',symptom:'Symptom / concern',medication:'Medication note',other:'Other'};
    records.forEach(record=>appendRecord(container,record.title||'Health note',record,child,[categories[record.category]||'Other',record.details||''].join('\n')));
   }
  }catch{
   get('profile'+label+'Count').textContent='';const error=document.createElement('p');error.setAttribute('role','status');error.textContent='These records could not be loaded. Your saved data has not been changed.';container.append(error);
   if(type==='growth')for(const id of ['Weight','Height']){get('profile'+id).textContent='Unavailable';get('profile'+id+'Date').textContent='Measurements could not be loaded.';}
  }
 }
}
window.RafiqChildProfileHealth={render};
})();

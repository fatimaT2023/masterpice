/* Health record storage/validation. Values are recorded, not medically interpreted. */
(()=>{'use strict';
const keys={vaccine:'rafiqVaccinations_',growth:'rafiqGrowth_',note:'rafiqHealthNotes_'};
function read(type,childId,storage=localStorage){if(!Object.hasOwn(keys,type))throw Error('Unknown record type');const records=JSON.parse(storage.getItem(keys[type]+childId)||'[]');if(!Array.isArray(records)||records.some(r=>!r||typeof r!=='object'||Array.isArray(r)))throw Error('Invalid health records');return records;}
function validate(type,value,child,today=new Date()){
 const errors={};const age=window.RafiqSetup.ageFromBirth(value.date,today);if(!age)errors.date='Choose a valid date that is not in the future.';else if(value.date<child.dateOfBirth)errors.date='The record date must be on or after your child’s birth date.';
 if(type==='vaccine'&&!String(value.name||'').trim())errors.name='Enter the vaccine name as shown on the vaccination record.';
 if(type==='growth'){
 if(!String(value.height??'').trim()&&!String(value.weight??'').trim())errors.measurement='Enter at least one measurement.';
 for(const field of ['height','weight'])if(String(value[field]??'').trim()&&(!Number.isFinite(Number(value[field]))||Number(value[field])<=0))errors[field]='Enter a positive number in '+(field==='height'?'centimeters':'kilograms')+'.';
 }
 if(type==='note'){if(!String(value.title||'').trim())errors.title='Give this note a short title.';if(!String(value.details||'').trim())errors.details='Write what you want to remember.';if(!['checkup','symptom','medication','other'].includes(value.category))errors.category='Choose a category.';}
 if(!Object.hasOwn(keys,type))errors.type='Choose a record type.';return errors;
}
function save(type,child,payload,{storage=localStorage,today=new Date(),id=null}={}){
 const errors=validate(type,payload,child,today);if(Object.keys(errors).length){const error=new Error('Check the highlighted fields.');error.fields=errors;throw error;}
 const records=read(type,child.id,storage),index=id?records.findIndex(r=>r.id===id&&!r._deletedAt):-1;if(id&&index<0)throw Error('This record changed or was removed. Reload before editing.');
 const age=window.RafiqSetup.ageFromBirth(child.dateOfBirth,new Date(payload.date+'T12:00:00'));const record={...(index>=0?records[index]:{}),id:id||type+'_'+(globalThis.crypto?.randomUUID?.()||Date.now()+'_'+Math.random().toString(36).slice(2)),childId:child.id,date:payload.date,createdAt:index>=0?records[index].createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),recordedAgeMonths:age?.totalMonths??null,recordedAgeDays:age?.days??null};
 if(type==='vaccine')Object.assign(record,{name:payload.name.trim(),provider:String(payload.provider||'').trim(),note:String(payload.note||'').trim()});
 if(type==='growth')Object.assign(record,{height:String(payload.height??'').trim()?Number(payload.height):null,weight:String(payload.weight??'').trim()?Number(payload.weight):null});
 if(type==='note')Object.assign(record,{title:payload.title.trim(),category:payload.category,details:payload.details.trim()});
 if(index>=0)records[index]=record;else records.push(record);storage.setItem(keys[type]+child.id,JSON.stringify(records));return record;
}
function removed(type,childId,id,remove,storage=localStorage){const records=read(type,childId,storage),record=records.find(r=>r.id===id);if(!record)throw Error('Record not found');if(remove)record._deletedAt=new Date().toISOString();else delete record._deletedAt;storage.setItem(keys[type]+childId,JSON.stringify(records));}
window.RafiqHealthRecords={keys,read,validate,save,removed};})();

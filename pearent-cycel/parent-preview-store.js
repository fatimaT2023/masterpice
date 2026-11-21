/* Phase 5: the host may keep a snapshot of FICTIONAL demo modes in this tab's sessionStorage so a
   refresh keeps the demo (never native localStorage; legacy signed-in data stays read-only).
   Storage-compatible, RAM-only parent preview. No patient data is persisted.
   Native storage is used only for validated AR/EN preferences. Not authentication. */
(() => {
 'use strict';
 function create({mode='new',nativeLocal,nativeSession,language='ar',now=new Date(),notify=()=>{},restore=null,onChange=()=>{}}={}){
  const values=new Map(),sessions=new WeakMap(),connections=new Set();let changed=false;
  const isLanguage=key=>/^rafiqLanguage(?:_|$)/.test(key);
  const readOnlyError=()=>Error((nativeLocal.getItem('rafiqLanguage')||language)==='ar'?'الملفات المحفوظة للقراءة فقط. اختاروا عيلة وهمية لتجربة التعديل.':'Saved profiles are read-only. Choose a fictional family to test editing.');
  let initial;
  if(mode==='legacy'){
   const role=nativeSession.getItem('rafiqRole'),owner=nativeSession.getItem('rafiqParentUserId');
   if(role!=='parent'||!owner)throw Error('Sign in as a parent to view saved profiles');
   for(let i=0;i<nativeLocal.length;i++){const key=nativeLocal.key(i);if(key?.startsWith('rafiq'))values.set(key,nativeLocal.getItem(key));}
   initial={rafiqRole:'parent',rafiqParentUserId:owner};
  }else{
   if(restore&&restore.mode===mode&&restore.values&&typeof restore.values==='object'){for(const [key,value] of Object.entries(restore.values))if(typeof value==='string'&&!isLanguage(key))values.set(key,value);initial=restore.session&&typeof restore.session==='object'?restore.session:window.RafiqParentPreviewFixtures(mode,now,language).session;}
   else{const data=window.RafiqParentPreviewFixtures(mode,now,language);initial=data.session;
   for(const [key,value] of Object.entries(data.values))values.set(key,typeof value==='string'?value:JSON.stringify(value));}
  }
  function event(key,oldValue,newValue,writer){for(const target of connections){if(target===writer)continue;try{if(target.closed){connections.delete(target);continue;}target.dispatchEvent(new target.StorageEvent('storage',{key,oldValue,newValue,url:target.location.href}));}catch{connections.delete(target);}}}
  function facade(map,writer,local){
   const api={get length(){const keys=new Set(map.keys());if(local)for(let i=0;i<nativeLocal.length;i++){const k=nativeLocal.key(i);if(isLanguage(k))keys.add(k);}return keys.size;},key(index){const keys=new Set(map.keys());if(local)for(let i=0;i<nativeLocal.length;i++){const k=nativeLocal.key(i);if(isLanguage(k))keys.add(k);}return [...keys][index]??null;},getItem(key){key=String(key);if(map.has(key))return map.get(key);return local&&isLanguage(key)?nativeLocal.getItem(key):null;},setItem(key,value){key=String(key);value=String(value);if(local&&isLanguage(key)){if(!['ar','en'].includes(value))throw Error('Invalid language');nativeLocal.setItem(key,value);map.set(key,value);return;}if(mode==='legacy'&&local&&!/^rafiq(?:CurrentChildId|LastVisit_|ParentTourSeen_|TodaySeenReports_)/.test(key)){notify('readonly');throw readOnlyError();}const oldValue=map.get(key)??null;map.set(key,value);if(local){changed=true;event(key,oldValue,value,writer);}onChange();},removeItem(key){key=String(key);if(mode==='legacy'&&local){notify('readonly');throw readOnlyError();}const old=map.get(key)??null;map.delete(key);if(local){changed=true;event(key,old,null,writer);}onChange();},clear(){if(mode==='legacy'&&local){notify('readonly');throw readOnlyError();}map.clear();if(local){changed=true;event(null,null,null,writer);}}};
   // Existing code uses getItem/setItem; bracket access remains Storage-compatible.
   return new Proxy(api,{get(target,key){if(key in target)return Reflect.get(target,key);return typeof key==='string'?target.getItem(key):undefined;},set(target,key,value){target.setItem(key,value);return true;},deleteProperty(target,key){target.removeItem(key);return true;}});
  }
  function connect(target){connections.add(target);let session=sessions.get(target);if(!session){session=new Map(Object.entries(initial));sessions.set(target,session);}return {local:facade(values,target,true),session:facade(session,target,false)};}
  // Fictional demo modes only: what the host may keep in this tab so a refresh keeps the demo.
  function dump(target){if(mode==='legacy')return null;const session=target?sessions.get(target):null;return {mode,values:Object.fromEntries([...values].filter(([k])=>!isLanguage(k))),session:session?Object.fromEntries(session):initial};}
  return {version:1,mode,get changed(){return changed;},connect,dump,readOnly:mode==='legacy'};
 }
 window.RafiqParentPreviewStore={create};
})();

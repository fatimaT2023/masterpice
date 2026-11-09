/* Support mode is a private family choice, never an inferred diagnosis. */
(() => {
 'use strict';
 const situations=['diagnosed_no_followup','diagnosed_following','worried','none','skipped'],focuses=['autism','speech_language','social','other','not_said',null];
 function save(child,answer){
  if(!situations.includes(answer.situation)||!focuses.includes(answer.focus))throw Error('Invalid support choice');
  const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);
  if(!fresh||JSON.stringify(fresh.supportProfile)!==JSON.stringify(child.supportProfile))throw Error('Support choice changed. Reopen and try again.');
  const now=new Date().toISOString();
  const supportProfile={version:1,situation:answer.situation,focus:answer.focus,setAt:fresh.supportProfile?.setAt||now,setBy:window.RafiqSetup.parentOwner(),updatedAt:now};
  window.RafiqSetup.writeChildren([{...fresh,supportProfile}]);return {...fresh,supportProfile};
 }
 window.RafiqSupportMode={save,clear:child=>save(child,{situation:'none',focus:null})};
})();

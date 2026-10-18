/* Review is local; only the existing booking handler can submit. */
(()=>{'use strict';
window.RafiqBookingReview = {
  open(details, reason) {
    const dialog=document.getElementById('appointmentReview');
    if(dialog.open)return Promise.resolve(false);
    const list=document.getElementById('reviewDetails');list.replaceChildren();
    Object.entries(details).forEach(([label,value])=>{
      const term=document.createElement('dt'), definition=document.createElement('dd');
      term.textContent=label;definition.textContent=String(value);list.append(term,definition);
    });
    document.getElementById('reviewReason').textContent=reason.trim()||'No note added.';
    const previous=document.activeElement;
    return new Promise(resolve=>{
      let done=false;
      const finish=accepted=>{
        if(done)return;done=true;dialog.close();
        dialog.removeEventListener('cancel',cancel);
        dialog.removeEventListener('close',closed);
        document.getElementById('reviewEdit').onclick=null;
        document.getElementById('reviewContinue').onclick=null;
        previous?.focus();resolve(accepted);
      };
      const cancel=event=>{event.preventDefault();finish(false);};
      const closed=()=>finish(false);
      dialog.addEventListener('cancel',cancel);dialog.addEventListener('close',closed);
      document.getElementById('reviewEdit').onclick=()=>finish(false);
      document.getElementById('reviewContinue').onclick=()=>finish(true);
      dialog.showModal();document.getElementById('reviewHeading').focus();
    });
  }
};
})();

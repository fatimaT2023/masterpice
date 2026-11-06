(() => {
'use strict';
const api=window.RafiqCaregiverPreview,$=id=>document.getElementById(id),id=new URLSearchParams(location.search).get('invite');
function render(){try{
 const record=api.read().find(item=>item.id===id);if(!record)throw Error('Invitation not found. Open a preview invitation from caregiver management in the same browser.');
 $('invitationError').hidden=true;$('invitationContent').hidden=false;
 $('invitedChild').textContent=api.read().filter(r=>r.id===id||(record.groupId&&r.groupId===record.groupId&&r.email===record.email)).map(r=>r.childName).join(' · ');$('invitedEmail').textContent=record.email;
 $('invitedRelationship').textContent=({mother:'Mother',father:'Father',guardian:'Guardian',other:'Other caregiver'})[record.relationship];
 $('invitedPermission').textContent='Shared caregiver access';
 $('invitedExpiry').textContent=new Date(record.expiresAt).toLocaleDateString(document.documentElement.lang==='ar'?'ar-JO':'en-GB');
 const state=api.status(record),user=api.currentUser(),matches=!!api.recipient(record);
 $('invitationIdentity').textContent=user?user.email:'';
 $('invitationAuth').hidden=state!=='pending'||matches;
 $('invitationActions').hidden=state!=='pending'||!matches;
 const query='?invite='+encodeURIComponent(id);
 $('invitationRegister').href='register.html'+query+'&role=parent';$('invitationLogin').href='login.html'+query;
 $('openInvitedChild').href='../pearent-cycel/parent-dashboard.html';$('openInvitedChild').hidden=state!=='accepted'||!matches;
 $('invitationBack').hidden=!user||user.id!==record.ownerId;
 $('invitationStatus').textContent=({pending:matches?'Review the invitation details before accepting.':'Sign in or create an account with the invited email to continue.',accepted:'Invitation accepted. Open your child’s workspace.',declined:'Invitation declined.',cancelled:'This invitation was cancelled.',revoked:'Access to this child has been removed.',expired:'This invitation has expired. Ask the primary caregiver for a new invitation.'})[state];
}catch(error){$('invitationError').hidden=false;$('invitationError').textContent=error.message;$('invitationContent').hidden=true;}}
$('openInvitedChild').addEventListener('click',()=>{const record=api.read().find(r=>r.id===id);if(record&&api.recipient(record))window.RafiqFamily.select(record.childId);});
for(const [button,state] of [['acceptInvitation','accepted'],['declineInvitation','declined']])$(button).addEventListener('click',()=>{try{const record=api.read().find(r=>r.id===id);const group=api.read().filter(r=>r.id===id||(record?.groupId&&r.groupId===record.groupId&&r.email===record.email));for(const item of group.filter(r=>api.status(r)==='pending'))api.respond(item.id,state);if(state==='accepted')location.href='../pearent-cycel/parent-dashboard.html';else render();}catch(error){render();$('invitationError').hidden=false;$('invitationError').textContent=error.message;}});
window.addEventListener('storage',render);window.addEventListener('focus',render);new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
})();

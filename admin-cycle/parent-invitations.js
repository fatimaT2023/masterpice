/* Registration guidance only; secure activation invitations need a backend. */
(() => {
  'use strict';
  const form = document.getElementById('parentInviteForm');
  if (!form) return;
  const role = sessionStorage.getItem('rafiqRole');
  if (role && role !== 'admin') return;
  const message = document.getElementById('inviteMessage');
  const status = document.getElementById('inviteStatus');
  const draft = document.getElementById('inviteEmailDraft');
  const hosted = ['https:','http:'].includes(location.protocol) && !['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  form.addEventListener('submit',event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = document.getElementById('inviteName').value.trim();
    const email = document.getElementById('inviteEmail').value.trim();
    if (!name) {document.getElementById('inviteName').focus();return;}
    const signup = hosted ? new URL('../piblic-pages/register.html?role=parent',location.href).href : '[Add the public RAFIQ registration link here]';
    message.value = `Hello ${name},\n\nYou're invited to join RAFIQ as a parent.\n\nCreate your account here: ${signup}\n\nChoose Parent, complete your details and set your own password. If you need help, use the registration help link on that page.\n\nThe RAFIQ team`.replaceAll('\\n','\n');
    draft.href = 'mailto:' + encodeURIComponent(email) + '?subject=' + encodeURIComponent('Your invitation to join RAFIQ') + '&body=' + encodeURIComponent(message.value);
    document.getElementById('invitePreview').hidden = false;
    document.getElementById('inviteHostingNote').hidden = hosted;
    status.textContent = 'Invitation prepared. Nothing has been sent and no account has been created.';
  });
  form.addEventListener('input',() => {document.getElementById('invitePreview').hidden = true;draft.removeAttribute('href');});
  document.getElementById('copyInvite').addEventListener('click',async () => {
    try {await navigator.clipboard.writeText(message.value);status.textContent = 'Invitation copied. You can share it with the parent.';}
    catch {message.focus();message.select();status.textContent = 'Select and copy the invitation message manually.';}
  });
})();
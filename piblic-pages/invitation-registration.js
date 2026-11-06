document.addEventListener('DOMContentLoaded',()=>{
 const id=new URLSearchParams(location.search).get('invite');if(!id)return;
 const roleCards=document.getElementById('roleCards');if(roleCards)roleCards.hidden=true;
 const email=document.getElementById('email');
 try{const record=JSON.parse(localStorage.getItem('rafiqCaregiverInvitationsPreview')||'[]').find(r=>r.id===id);if(record&&email){email.value=record.email;email.readOnly=true;email.dispatchEvent(new Event('input',{bubbles:true}));}}catch{}
 document.querySelectorAll('a[href="login.html"]').forEach(link=>link.href='login.html?invite='+encodeURIComponent(id));
});

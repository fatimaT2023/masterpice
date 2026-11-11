/* Frontend preview only. Connect a real authentication service before production. */
(() => {
  'use strict';
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const toggle = document.getElementById('passwordToggle');
  const baby = document.getElementById('baby');
  const caption = document.getElementById('characterCaption');
  const submit = document.getElementById('loginButton');
  const status = document.getElementById('formStatus');
  const roles = [...document.querySelectorAll('[data-role]')];
  const invitationId = new URLSearchParams(location.search).get('invite');
  const showcaseEmail=new URLSearchParams(location.search).get('demoEmail');
  if(!invitationId&&/^[a-z-]+\.show@rafiq\.test$/.test(showcaseEmail||''))email.value=showcaseEmail;
  if(invitationId){
    document.querySelector('.role-selector').hidden=true;
    document.querySelector('.create-account').href='register.html?role=parent&invite='+encodeURIComponent(invitationId);
    try{const invite=JSON.parse(localStorage.getItem('rafiqCaregiverInvitationsPreview')||'[]').find(r=>r.id===invitationId);if(invite)email.value=invite.email;}catch{}
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if(new URLSearchParams(location.search).get('account')==='inactive')status.textContent='This account is deactivated. Contact support.';
  if(new URLSearchParams(location.search).get('account')==='unavailable')status.textContent='We could not verify your account status. Reload and try again.';
  let role = 'parent', submitting = false, success = false, verifying = false;
  const poses = new Map([...baby.querySelectorAll('[data-pose]')].map(image => [image.dataset.pose, image]));
  const adminPreview = new URLSearchParams(location.search).get('role') === 'admin';
  if(adminPreview){role='admin';document.querySelector('.role-selector').hidden=true;document.getElementById('loginTitle').textContent='Administrator preview sign in';const signup=document.querySelector('.create-account');if(signup)signup.hidden=true;}
  let currentPose = 'idle', targetState = 'idle', poseTimer, assetsReady = false;
  const privatePoses = new Set(['cover-eyes', 'peek']);
  function showPose(name) {
    poses.forEach((image, key) => image.classList.toggle('is-active', key === name));
    currentPose = name;
    baby.dataset.pose = name;
  }
  function transitionPose(state) {
    clearTimeout(poseTimer);
    const next = privatePoses.has(state) ? state : 'idle';
    if (!assetsReady || next === currentPose) return;
    if (reduced.matches) return showPose(next);
    // Authored anatomical poses replace the entire character; no extra limb overlays.
    // A middle pose makes the raise/lower action readable within a 560ms gesture.
    if ((currentPose === 'idle' && privatePoses.has(next)) || (privatePoses.has(currentPose) && next === 'idle')) {
      showPose('raising');
      poseTimer = setTimeout(() => showPose(next), 280);
    } else showPose(next);
  }
  function setState(state) {
    if (state === targetState && assetsReady) return;
    targetState = state;
    baby.dataset.state = state;
    // caption.textContent = {idle:'Right here, with you.',watching:"I'm listening.",'cover-eyes':"No peeking. Promise.",peek:'Just a tiny peek?',success:'Ready for your next chapter.'}[state];
    transitionPose(state);
  }
  Promise.all([...poses.values()].map(image => image.decode().then(() => true, () => false))).then(results => {
    assetsReady = results.every(Boolean);
    if (assetsReady) transitionPose(targetState);
    else caption.textContent = 'Right here, with you.';
  });
  function syncState() {
    if (success) return setState('success');
    const active = document.activeElement;
    if (active === password || active === toggle) setState(password.type === 'password' ? 'cover-eyes' : 'peek');
    else setState(active === email ? 'watching' : 'idle');
  }
  form.addEventListener('focusin', syncState);
  form.addEventListener('focusout', () => queueMicrotask(syncState));
  [email,password].forEach(input => input.addEventListener('input', () => {
    document.getElementById(input.id + 'Error').textContent = '';
    input.removeAttribute('aria-invalid');
    if (success) {success = false;submit.firstElementChild.textContent = 'Log In';}
    status.textContent = '';syncState();
  }));
  toggle.addEventListener('click', () => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(visible));
    toggle.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    syncState();
  });
  roles.forEach(button => button.addEventListener('click', () => {
    if (submitting || verifying) return;
    role = button.dataset.role;
    roles.forEach(b => {b.classList.toggle('active',b === button);b.setAttribute('aria-pressed',String(b === button));});
    document.querySelector('.create-account').href = role === 'specialist' ? 'register.html?role=specialist' : 'register.html';
  }));
  function invalid(input,message) {
    document.getElementById(input.id + 'Error').textContent = message;
    input.setAttribute('aria-invalid','true');
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || verifying) return;
    let firstInvalid = null;
    if (!email.value.trim()) {invalid(email,'Please enter your email or username.');firstInvalid = email;}
    else if (email.value.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {invalid(email,'Please enter a valid email address.');firstInvalid = email;}
    if (!password.value) {invalid(password,'Please enter your password.');firstInvalid ||= password;}
    else if (password.value.length < 6) {invalid(password,'Password must be at least 6 characters.');firstInvalid ||= password;}
    if (firstInvalid) {firstInvalid.focus();return;}
    const signInRole = email.value.trim().toLowerCase() === 'admin@rafiq.com' ? 'admin' : role;
    if(signInRole==='admin'){
      if(email.value.trim().toLowerCase()!=='admin@rafiq.com'||password.value!=='RafiqAdmin2026!'){
        invalid(password,'Incorrect administrator preview credentials.');password.focus();return;
      }
      sessionStorage.setItem('rafiqRole','admin');sessionStorage.setItem('rafiqAdminEmail','admin@rafiq.com');
    }
    if(signInRole==='specialist'){
      try{
        const users=JSON.parse(localStorage.getItem('rafiqUsers')||'[]');
        const user=Array.isArray(users)?users.find(u=>u?.role==='specialist'&&u.email?.toLowerCase()===email.value.trim().toLowerCase()):null;
        const specialists=JSON.parse(localStorage.getItem('rafiqSpecialists')||'[]');
        const profile=Array.isArray(specialists)?specialists.find(p=>p?.email?.toLowerCase()===email.value.trim().toLowerCase()):null;
        if(!user&&!profile){invalid(email,'No specialist account was found for this email. Please register first.');email.focus();return;}
        if((user&&window.RafiqAccountStatus.inactive(user))||(profile&&window.RafiqAccountStatus.inactive({...profile,role:'specialist'}))){invalid(email,'This account is deactivated. Contact support.');email.focus();return;}
        sessionStorage.removeItem('rafiqSpecialistRegistrationUserId');sessionStorage.removeItem('rafiqSpecialistId');
        if(user)sessionStorage.setItem('rafiqSpecialistRegistrationUserId',user.id);
        if(profile)sessionStorage.setItem('rafiqSpecialistId',profile.id);
        sessionStorage.setItem('rafiqRole','specialist');
      }catch{invalid(email,'We couldn’t read your account. Please try again.');return;}
    }
    if(signInRole==='parent') {
      try{
        let users=JSON.parse(localStorage.getItem('rafiqUsers')||'[]');
        let user=Array.isArray(users)?users.find(u=>u?.role==='parent'&&u.email?.toLowerCase()===email.value.trim().toLowerCase()):null;
        const demoCase=window.RafiqDemoCases?.cases.find(c=>c.email===email.value.trim().toLowerCase());
        if(!user&&demoCase&&Array.isArray(users)){
          verifying=true;submit.disabled=true;email.disabled=true;password.disabled=true;toggle.disabled=true;roles.forEach(b=>b.disabled=true);
          try{await window.RafiqShowcaseAccounts.install(localStorage,window.RafiqPreviewCredentials,demoCase.key);users=JSON.parse(localStorage.getItem('rafiqUsers')||'[]');user=users.find(u=>u.id===demoCase.owner);}
          finally{verifying=false;submit.disabled=false;email.disabled=false;password.disabled=false;toggle.disabled=false;roles.forEach(b=>b.disabled=false);}
        }
        if(!user){invalid(email,'No parent account was found for this email. Please register first.');email.focus();return;}
        if(window.RafiqAccountStatus.inactive(user)){invalid(email,'This account is deactivated. Contact support.');email.focus();return;}
        if(!user.previewCredential){invalid(password,'This older preview account has no saved password verifier. Use a new email to create a preview account; existing records remain saved.');password.focus();return;}
        verifying=true;submit.disabled=true;email.disabled=true;password.disabled=true;toggle.disabled=true;roles.forEach(b=>b.disabled=true);
        let verified;
        try{verified=await window.RafiqPreviewCredentials.verify(user,password.value);}finally{verifying=false;submit.disabled=false;email.disabled=false;password.disabled=false;toggle.disabled=false;roles.forEach(b=>b.disabled=false);}
        if(!verified){invalid(password,'Incorrect password. Please try again.');password.focus();return;}
        if(window.RafiqAccountStatus.inactive(user)){invalid(email,'This account is deactivated. Contact support.');return;}
        if(sessionStorage.getItem('rafiqParentUserId')!==user.id){
          ['rafiqCurrentChildId','rafiqSetupPendingChildId'].forEach(key=>localStorage.removeItem(key));
          ['rafiqBookingConcernDraft','rafiqSelectedReportBooking'].forEach(key=>sessionStorage.removeItem(key));
        }
        sessionStorage.setItem('rafiqRole','parent');sessionStorage.setItem('rafiqParentUserId',user.id);
      }catch{invalid(email,'We could not read your account. Please try again.');return;}
    }
    submitting = true;submit.disabled = true;toggle.disabled = true;roles.forEach(b => b.disabled = true);
    form.setAttribute('aria-busy','true');submit.firstElementChild.textContent = 'Opening your workspace…';
    status.textContent = signInRole === 'parent' ? 'Signed in. Opening your next step…' : 'Preview mode: opening your workspace…';
    await new Promise(resolve => setTimeout(resolve,900));
    success = true;setState('success');submit.firstElementChild.textContent = 'Welcome back';
    form.setAttribute('aria-busy','false');
    await new Promise(resolve => setTimeout(resolve,1000));
    if(invitationId && signInRole==='parent'){location.href='caregiver-invitation.html?invite='+encodeURIComponent(invitationId);return;}
    location.href = signInRole === 'admin' ? '../admin-cycle/specialist-approvals.html' : signInRole === 'parent' ? '../pearent-cycel/parent-dashboard.html' : '../specialist-cycle/specialist-dashboard.html';
  });
  reduced.addEventListener('change', () => { clearTimeout(poseTimer); if (assetsReady) showPose(privatePoses.has(targetState) ? targetState : 'idle'); });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  syncState();
})();

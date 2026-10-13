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
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let role = 'parent', submitting = false, success = false;
  const poses = new Map([...baby.querySelectorAll('[data-pose]')].map(image => [image.dataset.pose, image]));
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
    if (submitting) return;
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
    if (submitting) return;
    let firstInvalid = null;
    if (!email.value.trim()) {invalid(email,'Please enter your email or username.');firstInvalid = email;}
    else if (email.value.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {invalid(email,'Please enter a valid email address.');firstInvalid = email;}
    if (!password.value) {invalid(password,'Please enter your password.');firstInvalid ||= password;}
    else if (password.value.length < 6) {invalid(password,'Password must be at least 6 characters.');firstInvalid ||= password;}
    if (firstInvalid) {firstInvalid.focus();return;}
    submitting = true;submit.disabled = true;toggle.disabled = true;roles.forEach(b => b.disabled = true);
    form.setAttribute('aria-busy','true');submit.firstElementChild.textContent = 'Opening your workspace…';
    status.textContent = 'Preview mode: continuing to the sample workspace.';
    await new Promise(resolve => setTimeout(resolve,900));
    success = true;setState('success');submit.firstElementChild.textContent = 'Welcome back';
    form.setAttribute('aria-busy','false');
    await new Promise(resolve => setTimeout(resolve,1000));
    location.href = role === 'parent' ? '../pearent-cycel/parent-dashboard.html' : '../specialist-cycle/specialist-dashboard.html';
  });
  reduced.addEventListener('change', () => { clearTimeout(poseTimer); if (assetsReady) showPose(privatePoses.has(targetState) ? targetState : 'idle'); });
  document.getElementById('year').textContent = new Date().getFullYear();
  syncState();
})();

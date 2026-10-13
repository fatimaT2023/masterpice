/* Form-driven registration world. No credentials are copied into the scene. */
(() => {
  'use strict';
  const world = document.getElementById('registerWorld');
  if (!world) return;
  const form = document.getElementById('registerForm');
  const name = document.getElementById('fullName');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirmPassword');
  const baby = world.querySelector('.world-baby');
  const poses = new Map([...baby.querySelectorAll('[data-pose]')].map(img => [img.dataset.pose,img]));
  const nameToken = document.getElementById('worldNameToken');
  const nameText = document.getElementById('worldName');
  const mail = document.getElementById('worldMail');
  const ready = document.getElementById('worldReady');
  const ring = world.querySelector('.ring-progress');
  const status = document.getElementById('worldStatus');
  const match = document.getElementById('passwordMatch');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let pose = 'wave', state = 'idle', poseTimer, welcomeTimer, assetsReady = false, completed = false;
  const privatePoses = new Set(['cover','peek']);
  function showPose(next) {
    poses.forEach((img,key) => img.classList.toggle('is-active',key === next));
    pose = next;
  }
  function moveTo(next) {
    clearTimeout(poseTimer);
    if (!assetsReady || next === pose) return;
    if (reduced.matches) return showPose(next);
    if ((privatePoses.has(next) && !privatePoses.has(pose)) || (privatePoses.has(pose) && !privatePoses.has(next))) {
      showPose('raising');
      poseTimer = setTimeout(() => showPose(next),280);
    } else showPose(next);
  }
  function update() {
    if (completed) return;
    const hasName = name.value.trim().length >= 2;
    const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const secure = password.value.length >= 8 && /[A-Z]/.test(password.value) && /\d/.test(password.value);
    const matches = secure && confirm.value.length > 0 && confirm.value === password.value;
    nameText.textContent = hasName ? name.value.trim().split(/\s+/)[0].slice(0,32) : 'Your little world';
    nameToken.classList.toggle('is-visible',hasName);
    mail.classList.toggle('is-visible',hasEmail);
    ready.classList.toggle('is-visible',matches);
    match.hidden = !matches;
    const progress = [hasName,hasEmail,secure,matches];
    world.querySelectorAll('[data-step]').forEach((step,index) => step.classList.toggle('is-complete',progress[index]));
    ring.style.strokeDashoffset = String(100 - progress.filter(Boolean).length * 25);
    const active = document.activeElement;
    const toggle = active && active.closest ? active.closest('[data-password-target]') : null;
    const target = toggle ? document.getElementById(toggle.dataset.passwordTarget) : active;
    let nextState = 'idle', nextPose = 'idle', message = 'A little world. Made just for you.';
    if (target === password || target === confirm) {
      nextState = target.type === 'password' ? 'privacy' : 'peek';
      nextPose = target.type === 'password' ? 'cover' : 'peek';
      message = matches ? 'A perfect match. Your world is coming together.' : 'A little privacy while you make it yours.';
    } else if (active === name) {nextState = 'name';message = hasName ? 'Nice to meet you, ' + nameText.textContent + '.' : "Let's give your world a name.";}
    else if (active === email) {nextState = 'email';message = hasEmail ? 'Your invitation has a place to land.' : 'A place for your next chapter.';}
    else if (matches) message = 'Your world is ready for its first chapter.';
    if (state !== nextState || assetsReady && pose === 'wave') {
      state = nextState;
      world.dataset.state = state;
      moveTo(nextPose);
    }
    if (status.textContent !== message) status.textContent = message;
  }
  Promise.all([...poses.values()].map(img => img.decode().then(() => true,() => false))).then(results => {
    assetsReady = results.every(Boolean);
    if (assetsReady) {
      if (document.activeElement && form.contains(document.activeElement)) update();
      else welcomeTimer = setTimeout(() => {showPose('idle');update();},reduced.matches ? 0 : 1200);
    }
  });
  form.addEventListener('input',update);
  form.addEventListener('change',update);
  form.addEventListener('focusin',() => {clearTimeout(welcomeTimer);update();});
  form.addEventListener('focusout',() => queueMicrotask(update));
  form.querySelectorAll('[data-password-target]').forEach(button => button.addEventListener('click',() => queueMicrotask(update)));
  document.addEventListener('rafiq:registration-success',() => {
    completed = true;clearTimeout(poseTimer);clearTimeout(welcomeTimer);
    world.dataset.state = 'success';
    if (assetsReady) showPose('wave');
    status.textContent = 'A new journey, together.';
  });
  reduced.addEventListener('change',() => {clearTimeout(poseTimer);clearTimeout(welcomeTimer);if (completed) showPose('wave');else {state='';update();}});
  update();
})();

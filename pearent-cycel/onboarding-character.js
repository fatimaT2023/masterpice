/* Same RAFIQ character identity; variant follows the child profile selection. */
(() => {
  'use strict';
  const companion = document.getElementById('setupCompanion');
  const form = document.getElementById('childForm');
  if (!companion || !form) return;
  const boy = companion.querySelector('.companion-boy');
  const girl = companion.querySelector('.companion-girl');
  let girlReady = false;
  function syncCharacter() {
    const selected = form.querySelector('input[name="gender"]:checked');
    const female = selected?.value === 'female' && girlReady;
    companion.dataset.gender = female ? 'female' : 'male';
    boy.setAttribute('aria-hidden', String(female));
    girl.setAttribute('aria-hidden', String(!female));
  }
  form.querySelectorAll('input[name="gender"]').forEach(radio => radio.addEventListener('change',syncCharacter));
  form.addEventListener('reset', () => queueMicrotask(syncCharacter));
  window.addEventListener('pageshow',syncCharacter);
  girl.decode().then(() => {girlReady = true;syncCharacter();}, () => { /* Retain loaded boy if the girl asset cannot be decoded. */ });
  syncCharacter();
})();

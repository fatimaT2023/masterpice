/* Keep the public Help Center link in sync with the selected language. */
(() => {
  'use strict';
  const help = document.getElementById('registrationHelp');
  if (!help) return;
  function update() {
    help.querySelector('[data-help-copy="title"]').textContent = document.documentElement.lang === 'ar'
      ? 'مشكلة بالتسجيل؟ زر مركز المساعدة'
      : 'Trouble signing up? Get help';
  }
  new MutationObserver(update).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  update();
})();
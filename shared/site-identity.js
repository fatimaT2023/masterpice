/* Same r. mark as the approved homepage. Never replaces form or navigation roots. */
(() => {
 'use strict';
 const selector='a.brand,a.wordmark,a.parent-brand,a.help-brand,a.card-brand,a.logo';
 function brand(anchor){
  if(anchor.dataset.rafiqBrand==='true')return;
  anchor.dataset.rafiqBrand='true';anchor.classList.add('rafiq-unified-brand');
  const mark=document.createElement('span');mark.className='rafiq-unified-mark';mark.textContent=anchor.closest('#sidebar')&&document.documentElement.classList.contains('specialist-sidebar-collapsed')||document.documentElement.classList.contains('admin-sidebar-collapsed')?'r':'r.';mark.setAttribute('aria-hidden','true');mark.setAttribute('data-no-translate','');
  const name=document.createElement('span');name.className='rafiq-unified-name';name.textContent='RAFIQ';
  // Existing brand children are decorative; the anchor, href and listeners survive.
  anchor.replaceChildren(mark,name);
 }
 function scan(root){if(root.nodeType!==1)return;if(root.matches(selector))brand(root);root.querySelectorAll(selector).forEach(brand);}
 scan(document.documentElement);
 new MutationObserver(()=>{const mark=document.querySelector('#sidebar .rafiq-unified-mark');if(mark)mark.textContent=document.documentElement.classList.contains('specialist-sidebar-collapsed')||document.documentElement.classList.contains('admin-sidebar-collapsed')?'r':'r.';}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(scan))).observe(document.body,{childList:true,subtree:true});
 // Parent language controls live in Settings.
 if(document.body.classList.contains('has-parent-navigation')||document.body.dataset.specialistLanguageInSettings==='true')return;
 const specialistLanguageMount=document.getElementById('specialistLanguageMount')||document.getElementById('adminLanguageMount');
 if(!specialistLanguageMount&&document.querySelector('[data-home-language],.language-switcher,[data-language]'))return;
 const group=document.createElement('div');group.className='site-languages';group.setAttribute('role','group');group.setAttribute('aria-label','Page language');
 for(const [language,label]of [['ar','العربية'],['en','English']]){const button=document.createElement('button');button.type='button';button.dataset.homeLanguage=language;button.lang=language;button.textContent=label;button.setAttribute('aria-pressed','false');group.append(button);}
 const mount=specialistLanguageMount||document.querySelector('.parent-header-actions,.topbar-actions,.header-actions,.top-nav .nav-actions,.topbar,.help-header nav,.sidebar-top,header');
 if(mount)mount.append(group);else{group.classList.add('site-languages-floating');document.body.append(group);}
})();

(() => {
  'use strict';
  const role=sessionStorage.getItem('rafiqRole');
  if(role&&role!=='admin'){location.replace('../piblic-pages/login.html');return;}
  const api=window.RafiqTheme, form=document.getElementById('appearanceForm'), status=document.getElementById('appearanceStatus');
  const presets={rafiq:{...api.defaults},ocean:{primary:'#1769aa',secondary:'#00a6a0',background:'#f1f7ff',video:true,glass:48},lavender:{primary:'#7052b5',secondary:'#c46a96',background:'#faf5ff',video:true,glass:48}};
  let committed=api.read();
  function message(text,error=false){status.textContent=text;status.dataset.error=String(error);}
  function values(){return {primary:form.elements.primary.value,secondary:form.elements.secondary.value,background:form.elements.background.value,video:form.elements.video.value==='video',glass:Number(form.elements.glass.value)};}
  function fill(theme){theme=api.normalize(theme);['primary','secondary','background','glass'].forEach(name=>form.elements[name].value=theme[name]);form.elements.video.value=theme.video?'video':'solid';document.getElementById('glassValue').textContent=theme.glass+'%';}
  function preview(){api.apply(values());document.getElementById('glassValue').textContent=form.elements.glass.value+'%';document.querySelectorAll('[data-preset]').forEach(button=>button.setAttribute('aria-pressed','false'));message('Unsaved preview. Save to apply your changes across all pages.');}
  form.addEventListener('input',preview);
  form.addEventListener('change',preview);
  document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{fill(presets[button.dataset.preset]);preview();button.setAttribute('aria-pressed','true');}));
  form.addEventListener('submit',event=>{event.preventDefault();try{committed=api.save(values());message('Saved. Your theme is applied across all pages in this browser.');}catch{message('Unable to save in this browser. Your changes are still a preview.',true);}});
  document.getElementById('cancelAppearance').addEventListener('click',()=>{api.apply(committed);fill(committed);message('Preview canceled. Your saved settings have been restored.');});
  document.getElementById('resetAppearance').addEventListener('click',()=>{try{api.reset();committed=null;fill(api.defaults);message('The original RAFIQ design has been restored across all pages.');}catch{message('Unable to restore defaults. Please allow browser storage and try again.',true);}});
  window.addEventListener('storage',event=>{if(event.key===api.key||event.key===null){committed=api.read();fill(committed);message('Your theme was updated in another tab.');}});
  document.getElementById('adminSidebarName').textContent=sessionStorage.getItem('rafiqAdminName')||'RAFIQ Admin';
  fill(committed);
})();

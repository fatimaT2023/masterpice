(() => {
  const footer=document.getElementById('rafiq-footer');
  if(!footer)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const blocks=[...footer.querySelectorAll('.gf-reveal')];
  let observer;
  blocks.forEach((block,i)=>block.style.setProperty('--gf-delay',`${i*100}ms`));
  function configure(){
    observer?.disconnect();
    footer.classList.toggle('gf-motion',!reduced.matches && 'IntersectionObserver' in window);
    if(reduced.matches || !('IntersectionObserver' in window)){
      blocks.forEach(block=>{block.classList.add('gf-visible');block.inert=false;});return;
    }
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('gf-visible');entry.target.inert=false;observer.unobserve(entry.target);}
    }),{threshold:.08});
    blocks.forEach(block=>{block.inert=!block.classList.contains('gf-visible');observer.observe(block);});
  }
  const form=footer.querySelector('form');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    footer.querySelector('#gf-newsletter-status').textContent='Subscriptions are not connected in this preview. Your email has not been sent or saved.';
  });
  const dialog=footer.querySelector('dialog');
  const copy={
    privacy:['Privacy Policy','The RAFIQ privacy policy has not been published in this homepage preview. For privacy questions, contact support@rafiq.com.'],
    terms:['Terms of Use','Terms of Use are not yet published in this homepage preview. Contact the team for information before registering for live services.'],
    accessibility:['Accessibility','This homepage supports keyboard navigation, visible focus indicators and reduced-motion preferences. If you encounter an accessibility issue, contact support@rafiq.com.']
  };
  footer.querySelectorAll('[data-footer-info]').forEach(button=>button.addEventListener('click',()=>{
    const [title,body]=copy[button.dataset.footerInfo];
    dialog.querySelector('h2').textContent=title;dialog.querySelector('p').textContent=body;dialog.showModal();
  }));
  dialog.querySelector('.gf-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)dialog.close();
  });
  reduced.addEventListener('change',configure);configure();
})();

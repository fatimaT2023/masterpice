(() => {
  const section = document.getElementById('labs');
  if (!section) return;
  const viewport = section.querySelector('.rf-viewport');
  const track = section.querySelector('.rf-demo');
  if (!viewport || !track) return;
  const originals = [...track.querySelectorAll('.rf-feature')];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const position = section.querySelector('.rf-position');
  const count = originals.length;
  // Visual bookends keep a neighboring card visible at both ends of the loop.
  function bookend(source) {
    const clone = source.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    clone.setAttribute('aria-hidden','true'); clone.inert = true;
    clone.classList.add('rf-bookend');
    return clone;
  }
  track.prepend(bookend(originals[count-1]));
  track.append(bookend(originals[0]));
  const cards = [...track.children];
  let centers = [], step = 1, renderFrame = 0, tween = 0, settleTimer, dragging = null, target = 1, active = -1, profileTimer, chosenProfile = false, suppressClick = false;
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const logical = index => (index-1+count)%count;
  const profiles = [...section.querySelectorAll('.rf-profiles button')];
  function selectProfile(index) { profiles.forEach((button,i) => button.setAttribute('aria-pressed',String(i===index))); }
  profiles.forEach((button,i) => button.addEventListener('click',()=>{chosenProfile=true;clearTimeout(profileTimer);selectProfile(i);}));
  cards.forEach((card,i) => {
    card.style.setProperty('--feature-tint',card.dataset.tint);
    card.querySelectorAll('.rf-topics span').forEach((topic,j)=>topic.style.setProperty('--topic-delay',`${j*120}ms`));
    if(i>0 && i<=count) {
      card.setAttribute('role','group'); card.setAttribute('aria-roledescription','slide');
      card.setAttribute('aria-label',`${i} of ${count}: ${card.querySelector('h3').textContent}`);
    }
  });
  function nearest() {
    let best=0;
    centers.forEach((center,i)=>{if(Math.abs(center-viewport.scrollLeft)<Math.abs(centers[best]-viewport.scrollLeft))best=i;});
    return best;
  }
  function render() {
    renderFrame=0;
    const index=nearest(), next=logical(index);
    cards.forEach((card,i)=>{
      const distance=clamp(Math.abs(centers[i]-viewport.scrollLeft)/step,0,1);
      card.style.setProperty('--card-scale',reduced.matches?1:1-distance*.08);
      card.style.setProperty('--card-opacity',reduced.matches?1:1-distance*.45);
      card.classList.toggle('rf-active',i===index);
      if(!card.classList.contains('rf-bookend')) {
        if(i!==index && card.contains(document.activeElement))viewport.focus({preventScroll:true});
        card.inert=i!==index;
      }
    });
    if(next!==active) {
      active=next;
      position.textContent=`${String(next+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
      section.style.setProperty('--rf-tint',originals[next].dataset.tint);
      clearTimeout(profileTimer);
      if(next===1 && !chosenProfile && !reduced.matches) {
        selectProfile(0); profileTimer=setTimeout(()=>{if(active===1)selectProfile(1);},800);
      }
    }
  }
  function schedule() {if(!renderFrame)renderFrame=requestAnimationFrame(render);}
  function stopTween(){cancelAnimationFrame(tween);tween=0;clearTimeout(settleTimer);}
  function wrap() {
    const index=nearest();
    if(index===0 || index===count+1) {
      const real=index===0?count:1;
      viewport.style.scrollSnapType='none';viewport.scrollLeft=centers[real];
      target=real;render();viewport.style.scrollSnapType='';
    }
  }
  function go(index) {
    stopTween(); target=clamp(index,0,count+1);
    const start=viewport.scrollLeft, end=centers[target];
    viewport.style.scrollSnapType='none';
    if(reduced.matches || Math.abs(start-end)<1) {viewport.scrollLeft=end;render();wrap();viewport.style.scrollSnapType='';return;}
    const started=performance.now();
    function tick(now) {
      const p=clamp((now-started)/650,0,1);
      // Monotonic ease-out with no overshoot, shared by drag release and arrows.
      const ease=1-Math.pow(1-p,4);
      viewport.scrollLeft=start+(end-start)*ease;
      render();
      if(p<1)tween=requestAnimationFrame(tick);
      else {tween=0;wrap();viewport.style.scrollSnapType='';}
    }
    tween=requestAnimationFrame(tick);
  }
  function settle(){if(!dragging && !tween)go(nearest());}
  section.querySelector('.rf-prev').addEventListener('click',()=>go((tween?target:nearest())-1));
  section.querySelector('.rf-next').addEventListener('click',()=>go((tween?target:nearest())+1));
  viewport.addEventListener('keydown',event=>{
    if(event.target.matches('input,select,textarea'))return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight') {
      event.preventDefault();go((tween?target:nearest())+(event.key==='ArrowRight'?1:-1));
    } else if(event.key==='Home'||event.key==='End') {event.preventDefault();go(event.key==='Home'?1:count);}
  });
  viewport.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse') {stopTween();viewport.style.scrollSnapType='';return;}
    if(event.button!==0 || event.target.closest('a,button,input,select'))return;
    stopTween();viewport.style.scrollSnapType='none';
    dragging={id:event.pointerId,x:event.clientX,scroll:viewport.scrollLeft};
    viewport.setPointerCapture(event.pointerId);viewport.classList.add('rf-dragging');
  });
  viewport.addEventListener('pointermove',event=>{
    if(!dragging || event.pointerId!==dragging.id)return;
    const delta=event.clientX-dragging.x;
    if(Math.abs(delta)>5)suppressClick=true;
    viewport.scrollLeft=dragging.scroll-delta;schedule();
  });
  function release(event) {
    if(!dragging || event.pointerId!==dragging.id)return;
    const id=dragging.id;dragging=null;viewport.classList.remove('rf-dragging');
    if(viewport.hasPointerCapture(id))viewport.releasePointerCapture(id);
    go(nearest());setTimeout(()=>{suppressClick=false;},0);
  }
  viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);
  viewport.addEventListener('lostpointercapture',event=>{if(dragging)release(event);});
  viewport.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();}},true);
  viewport.addEventListener('wheel',()=>{stopTween();viewport.style.scrollSnapType='';},{passive:true});
  viewport.addEventListener('scroll',()=>{
    schedule();clearTimeout(settleTimer);
    if(!dragging && !tween)settleTimer=setTimeout(settle,180);
  },{passive:true});
  function measure() {
    const saved=active<0?0:active;
    stopTween();
    centers=cards.map(card=>card.offsetLeft-(viewport.clientWidth-card.offsetWidth)/2);
    step=centers[1]-centers[0];
    viewport.style.scrollSnapType='none';viewport.scrollLeft=centers[saved+1];
    target=saved+1;render();viewport.style.scrollSnapType='';
  }
  section.classList.add('rf-enhanced');
  if('ResizeObserver' in window)new ResizeObserver(measure).observe(viewport);
  else window.addEventListener('resize',measure,{passive:true});
  reduced.addEventListener('change',()=>{clearTimeout(profileTimer);measure();});
  measure();
  // Preserve links from other sections into individual feature demonstrations.
  function followHash(){const index=originals.findIndex(card=>`#${card.id}`===location.hash);if(index>=0)go(index+1);}
  window.addEventListener('hashchange',followHash);followHash();
})();

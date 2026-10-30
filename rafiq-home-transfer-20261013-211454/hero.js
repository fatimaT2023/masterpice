/* Supplied RAFIQ character poses. Scope: opening hero only. */
(() => {
  'use strict';
  const section = document.querySelector('.hero-scroll');
  if (!section) return;
  const stage = section.querySelector('.hero-sticky');
  const character = section.querySelector('.hero-character-position');
  const depth = section.querySelector('.hero-character-depth');
  const sitting = section.querySelector('.hero-sitting-group');
  const crawling = section.querySelector('.hero-crawling-group');
  const front = section.querySelector('.pose-front');
  const left = section.querySelector('.pose-left');
  const right = section.querySelector('.pose-right');
  const wave = section.querySelector('.pose-wave');
  const hand = section.querySelector('.hero-wave-hand');
  const eyes = section.querySelector('.hero-eye-layer');
  const blink = section.querySelector('.hero-blink');
  const crawlA = section.querySelector('.pose-crawl-a');
  const crawlB = section.querySelector('.pose-crawl-b');
  const panel = section.querySelector('.hero-content');
  const light = section.querySelector('.studio-light');
  const shadow = section.querySelector('.floor-shadow');
  const ring = section.querySelector('.pointer-ring');
  const progressBar = section.querySelector('.hero-scroll-progress > span');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
  const smooth = v => { v=clamp(v); return v*v*(3-2*v); };
  let geometry={top:0,distance:1,width:innerWidth,charWidth:0,height:0};
  let targetX=0,targetY=0,currentX=0,currentY=0,pointerX=0,pointerY=0;
  let raf=0,active=true,ready=false,waveFinished=reduced.matches,introStart=performance.now();
  let blinkTimer,blinkEnd,pressed=false,lastProgress=-1;
  let lastFrame=0, displayedProgress=null;
  const canFollow = () => ready && waveFinished && !reduced.matches && fine.matches && innerWidth>600;
  function measure(){
    geometry={top:section.getBoundingClientRect().top+scrollY,distance:Math.max(1,section.offsetHeight-stage.offsetHeight),width:innerWidth,charWidth:character.offsetWidth,height:stage.offsetHeight};
    lastProgress=-1; schedule();
  }
  function schedule(){if(!raf && active && !document.hidden)raf=requestAnimationFrame(render);}
  function planBlink(){
    clearTimeout(blinkTimer);
    if(reduced.matches || document.hidden || !active)return;
    blinkTimer=setTimeout(()=>{
      if(waveFinished && lastProgress<.2 && Math.abs(currentX)<.3){blink.classList.add('is-blinking');clearTimeout(blinkEnd);blinkEnd=setTimeout(()=>blink.classList.remove('is-blinking'),220);}
      planBlink();
    },3000+Math.random()*3000);
  }
  function render(now){
    raf=0;if(!active || document.hidden)return;
    // Time-based damping behaves consistently on 60 Hz and high-refresh screens.
    const dt=Math.min(.05,Math.max(0,(now-(lastFrame||now-16.67))/1000));
    lastFrame=now;
    const rawProgress=clamp((scrollY-geometry.top)/geometry.distance);
    if(displayedProgress===null || reduced.matches) displayedProgress=rawProgress;
    else displayedProgress+=(rawProgress-displayedProgress)*(1-Math.exp(-dt/0.085));
    if(Math.abs(rawProgress-displayedProgress)<.00008)displayedProgress=rawProgress;
    const p=displayedProgress;
    const transition=smooth((p-.20)/.25);
    const travel=smooth((p-.45)/.55);
    const moving=p>.2;
    if(moving){waveFinished=true;targetX=targetY=0;} // scrolling takes priority over the one-time greeting
    const elapsed=(now-introStart)/1000;
    if(ready && !waveFinished && elapsed>=1.45)waveFinished=true;
    const greeting=ready&&!waveFinished&&!reduced.matches?smooth((elapsed-.25)/.20)*(1-smooth((elapsed-1.15)/.30)):0;
    front.style.opacity=String(1-greeting);wave.style.opacity=String(greeting);hand.style.opacity=String(greeting);
    hand.style.transform='rotate('+(greeting*Math.sin((elapsed-.25)*Math.PI*4.5)*3)+'deg)';
    const follow=1-Math.exp(-dt/(moving?.08:.05));
    const desiredX=canFollow()&&!moving?targetX:0;
    const desiredY=canFollow()&&!moving?targetY:0;
    currentX+=(desiredX-currentX)*follow;currentY+=(desiredY-currentY)*follow;
    depth.style.transform='translate3d('+currentX*1.5+'px,0,0)';
    left.style.opacity=String(smooth(Math.max(0,-currentX))*(1-greeting));right.style.opacity=String(smooth(Math.max(0,currentX))*(1-greeting));
    const headTransform='rotateY('+currentX*5+'deg) rotateX('+(-currentY*2.5)+'deg)';
    left.style.transform=headTransform;right.style.transform=headTransform;
    // Restore the original mouse-following eye layer while the baby is seated.
    eyes.style.opacity=String((1-clamp(Math.abs(currentX)*2))*(1-greeting)*.65);
    eyes.style.transform='translate('+currentX*7+'px,'+currentY*4+'px)';
    if(p!==lastProgress){
      lastProgress=p;
      // Never fade the crawling character out. It leaves by translating RIGHT.
      const distance=geometry.width*(reduced.matches?.38:.55)+geometry.charWidth*.06;
      const gaitEnvelope=smooth(travel/.1)*(1-smooth((travel-.9)/.1));
      const phase=travel*Math.PI*8;
      const gait=reduced.matches?0:Math.sin(phase)*gaitEnvelope;
      // Each push accelerates, then the body settles over the planted hands.
      // The displacement stays monotonic, including when scrolling backwards.
      const stride=reduced.matches?travel:travel-.55*Math.sin(phase)/(Math.PI*8);
      const x=stride*distance;
      const lift=reduced.matches?0:Math.sin(phase*2)*2.8*gaitEnvelope;
      const y=transition*geometry.height*.045+lift;
      character.style.transform='translate(-50%,-50%) translate3d('+x+'px,'+y+'px,0)';
      sitting.style.opacity=String(1-transition);crawling.style.opacity=String(transition);
      const morphBlur=reduced.matches?0:Math.sin(transition*Math.PI)*3;
      sitting.style.filter='blur('+morphBlur+'px)';crawling.style.filter='blur('+morphBlur+'px)';
      sitting.style.transform=reduced.matches?'none':'perspective(900px) rotateX('+transition*12+'deg) translateY('+transition*10+'px) scale('+(1-transition*.035)+')';
      crawling.style.transform=reduced.matches?'none':'rotate('+gait*.8+'deg) scaleY('+(1-Math.abs(gait)*.008)+')';
      // Do not paint an alternate body on top of a fully opaque first pose.
      const alternate=reduced.matches||travel===0?0:smooth((Math.sin(phase)+.16)/.32)*gaitEnvelope;
      crawlA.style.opacity=String(1-alternate);
      crawlB.style.opacity=String(alternate);
      shadow.style.transform='scale('+(1+transition*.16)+','+(1-Math.abs(gait)*.08)+')';
      shadow.style.opacity=String(.10-Math.abs(gait)*.015);
      section.classList.toggle('is-moving',moving);
      character.dataset.pose=p<.2?'sitting':p<.45?'leaning':p<.9?'crawling-right':'exiting-right';
      character.dataset.progress=p.toFixed(4);
      progressBar.style.transform='scaleX('+p+')';
      panel.style.opacity=String(1-smooth((p-.35)/.65)*.35);
    }
    panel.style.transform='translate3d('+currentX*1.25+'px,'+currentY*1.25+'px,0)';
    light.style.transform='translate3d('+currentX*8+'px,'+currentY*8+'px,0)';
    if(ring.classList.contains('visible'))ring.style.transform='translate('+(pointerX-16)+'px,'+(pointerY-16)+'px) scale('+(pressed?.88:1)+')';
    if((ready&&!waveFinished)||Math.abs(desiredX-currentX)+Math.abs(desiredY-currentY)>.0002||Math.abs(rawProgress-displayedProgress)>.00001) schedule();
    else lastFrame=0;
  }
  stage.addEventListener('pointermove',event=>{
    if(!canFollow()||lastProgress>.2)return;
    // Follow relative to the face instead of the viewport center.
    const bounds=character.getBoundingClientRect();
    targetX=clamp((event.clientX-(bounds.left+bounds.width*.5))/(geometry.width*.30),-1,1);
    targetY=clamp((event.clientY-(bounds.top+bounds.height*.35))/(geometry.height*.48),-1,1);
    pointerX=event.clientX;pointerY=event.clientY;schedule();
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{targetX=targetY=0;ring.classList.remove('visible');schedule();});
  section.querySelector('.baby-hit-area').addEventListener('pointerenter',()=>{if(canFollow()&&lastProgress<.2)ring.classList.add('visible');schedule();});
  section.querySelector('.baby-hit-area').addEventListener('pointerleave',()=>ring.classList.remove('visible'));
  stage.addEventListener('pointerdown',()=>{pressed=true;schedule();});window.addEventListener('pointerup',()=>{pressed=false;schedule();});
  window.addEventListener('scroll',()=>{if(lastProgress>.2)ring.classList.remove('visible');schedule();},{passive:true});
  window.addEventListener('resize',measure,{passive:true});
  reduced.addEventListener('change',()=>{targetX=targetY=currentX=currentY=0;displayedProgress=null;lastFrame=0;waveFinished=true;lastProgress=-1;ring.classList.remove('visible');planBlink();measure();window.dispatchEvent(new Event('resize'));});
  fine.addEventListener('change',()=>{targetX=targetY=0;ring.classList.remove('visible');schedule();});
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('tab-hidden',document.hidden);if(document.hidden){cancelAnimationFrame(raf);raf=0;lastFrame=0;clearTimeout(blinkTimer);}else{planBlink();schedule();}});
  new IntersectionObserver(entries=>{active=entries[0].isIntersecting;section.classList.toggle('is-active',active);if(active){planBlink();schedule();}else{cancelAnimationFrame(raf);raf=0;clearTimeout(blinkTimer);ring.classList.remove('visible');}},{threshold:0}).observe(section);
  const images=[...section.querySelectorAll('.hero-pose img')];
  // Measure alpha once to match the floor and scale across extracted poses.
  // The bitmap files remain untouched; only their CSS placement is normalized.
  function alignPortrait(img){
    if(!img.complete||!img.naturalWidth)return;
    try{
      const canvas=document.createElement('canvas');canvas.width=160;canvas.height=200;
      const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0,160,200);
      const pixels=context.getImageData(0,0,160,200).data;
      let minX=160,maxX=0,minY=200,maxY=0;
      for(let y=0;y<200;y++)for(let x=0;x<160;x++)if(pixels[(y*160+x)*4+3]>100){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
      const scale=Math.min(.765/((maxY-minY)/200),.84/((maxX-minX)/160));
      const x=(1-scale)*50,y=(.85-maxY/200*scale)*100;
      img.style.transformOrigin='0 0';img.style.transform='translate('+x+'%,'+y+'%) scale('+scale+')';
      img.dataset.alignment=img.style.transform;
    }catch{/* Opaque/local-origin fallback retains authored framing. */}
  }
  Promise.allSettled(images.map(img=>img.decode())).then(()=>{
    images.forEach(alignPortrait);
    const normalized=images.find(img=>img.closest('.pose-front'));
    section.querySelector('.hero-eye-layer img').style.cssText=normalized.style.cssText;
    const waveImage=images.find(img=>img.closest('.pose-wave'));
    section.querySelector('.hero-wave-hand img').style.cssText=waveImage.style.cssText;
    ready=true;introStart=performance.now();schedule();
  });
  measure();planBlink();
})();

/* Continuous RAFIQ growth. Movement and age morphing use separate layers. */
(() => {
'use strict';
const section=document.querySelector('.growth-story');if(!section)return;
const stage=section.querySelector('.growth-stage');
const track=section.querySelector('.character-track');
const gait=section.querySelector('.growth-gait');
const ages=[...section.querySelectorAll('.growth-age')];
const images=ages.map(age=>age.querySelector('img'));
const alternate=section.querySelector('.growth-crawl-alternate');
const copies=[...section.querySelectorAll('.growth-copy')];
const buttons=[...section.querySelectorAll('[data-growth-stop]')];
const entryCopy=section.querySelector('.growth-entry-copy');
const line=section.querySelector('.growth-timeline-line>span');
const count=document.getElementById('growthCount');
const shadow=section.querySelector('.growth-floor-shadow');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=n=>Math.max(0,Math.min(1,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
const breaks=[.30,.45,.60,.75,.88,1];
const stops=[.09,.45,.60,.75,.88,1];
const colors=[[223,243,255],[229,243,249],[224,244,243],[230,239,252],[227,237,251],[237,245,246]];
let geometry={top:0,distance:1,width:innerWidth},raf=0,active=true,last=-1,current=-1;
const ready=new Array(6).fill(false);
function measure(){geometry={top:section.getBoundingClientRect().top+scrollY,distance:Math.max(1,section.offsetHeight-stage.offsetHeight),width:innerWidth};last=-1;schedule();}
function schedule(){if(!raf&&active&&!document.hidden)raf=requestAnimationFrame(render);}
function align(img){
  try{
    const canvas=document.createElement('canvas');canvas.width=160;canvas.height=200;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,160,200);const data=ctx.getImageData(0,0,160,200).data;
    let minX=160,maxX=0,minY=200,maxY=0;
    for(let y=0;y<200;y++)for(let x=0;x<160;x++)if(data[(y*160+x)*4+3]>100){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
    const scale=Math.min(.765/((maxY-minY)/200),.84/((maxX-minX)/160));
    img.style.transform='translate('+((1-scale)*50)+'%,'+((.85-maxY/200*scale)*100)+'%) scale('+scale+')';
  }catch{/* Authored portrait framing remains a safe fallback. */}
}
async function load(i){
  const img=images[i];if(!img||img.dataset.requested)return;img.dataset.requested='true';
  if(img.dataset.src){img.loading='eager';img.src=img.dataset.src;}
  try{await img.decode();align(img);ready[i]=true;last=-1;schedule();}catch{img.dataset.failed='true';}
}
function render(){
  raf=0;if(!active||document.hidden)return;
  const p=clamp((scrollY-geometry.top)/geometry.distance);if(p===last)return;last=p;
  let a=0,b=0,t=0;
  if(p>=.3){for(let i=0;i<5;i++)if(p>=breaks[i]&&p<=breaks[i+1]){a=i;b=i+1;t=smooth((p-breaks[i])/(breaks[i+1]-breaks[i]));break;}}
  load(a);load(b);if(p>.12)load(Math.min(5,b+1));
  // Keep the last available child visible while the next asset decodes.
  if(!ready[b]&&b!==a){b=a;t=0;}
  if(!ready[a]){const previous=ready.findLastIndex((ok,i)=>ok&&i<a);if(previous>=0){a=b=previous;t=0;}}
  const activeAge=t>.5?b:a;
  const mobile=geometry.width<=600;
  let x;
  if(p<=.15)x=lerp(-.20,.20,p/.15);
  else if(p<=.30)x=lerp(.20,mobile?.50:.58,(p-.15)/.15);
  else x=lerp(mobile?.50:.58,mobile?.57:.70,(p-.30)/.70);
  const standing=smooth((p-.30)/.15);
  const crawlRhythm=p*Math.PI*32;
  const bob=reduced.matches?0:Math.sin(crawlRhythm)*lerp(2.3,1.6,standing);
  track.style.transform='translate(-50%,-50%) translate3d('+(x*geometry.width)+'px,0,0)';
  gait.style.transform=reduced.matches?'none':'translateY('+bob+'px) rotate('+(Math.sin(crawlRhythm)*lerp(.55,.22,standing))+'deg)';
  alternate.style.opacity=String(reduced.matches?0:smooth((Math.sin(crawlRhythm)+.12)/.24));
  shadow.style.transform='scaleX('+lerp(1,.6,standing)+')';
  ages.forEach((age,i)=>{
    const opacity=a===b?(i===a?1:0):i===a?1-t:i===b?t:0;
    age.style.opacity=String(opacity);
    age.style.filter=reduced.matches?'none':'blur('+(i===a?t*6:i===b?(1-t)*6:0)+'px)';
    age.style.transform=reduced.matches?'none':'scale('+(i===a?1+t*.03:i===b?.97+t*.03:1)+')';
    age.setAttribute('aria-hidden',String(i!==activeAge));
  });
  const textReady=smooth((p-.20)/.10);
  copies.forEach((copy,i)=>{
    const opacity=(a===b?(i===a?1:0):i===a?1-t:i===b?t:0)*textReady;
    copy.style.opacity=String(opacity);
    copy.style.transform=reduced.matches?'none':'translateY('+(i===a?-12*t:14*(1-t))+'px)';
    copy.style.filter=reduced.matches?'none':'blur('+(i===a?t*5:i===b?(1-t)*5:0)+'px)';
    copy.inert=i!==activeAge||opacity<.1;copy.setAttribute('aria-hidden',String(copy.inert));copy.classList.toggle('is-current',i===activeAge&&opacity>.1);
  });
  entryCopy.style.opacity=String(1-smooth((p-.17)/.08));entryCopy.setAttribute('aria-hidden',String(p>.25));
  if(current!==activeAge){current=activeAge;count.textContent=String(current+1).padStart(2,'0')+' / 06';buttons.forEach((button,i)=>{if(i===current)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});track.setAttribute('aria-label',current===0?'The same blue-clothed baby crawling in from the left':'The same child walking and growing, age '+buttons[current].textContent.trim());}
  const color=colors[a].map((v,i)=>Math.round(lerp(v,colors[b][i],t)));stage.style.backgroundColor='rgb('+color.join(',')+')';
  line.style.transform='scaleY('+p+')';track.dataset.progress=p.toFixed(4);track.dataset.age=String(activeAge);track.dataset.direction='right';track.dataset.locomotion=p<.3?'crawling':p<.45?'standing-up':'walking';track.dataset.centerX=(x*geometry.width).toFixed(1);
}
buttons.forEach((button,i)=>button.addEventListener('click',()=>scrollTo({top:geometry.top+geometry.distance*stops[i],behavior:reduced.matches?'instant':'smooth'})));
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure,{passive:true});
reduced.addEventListener('change',measure);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();});
new IntersectionObserver(entries=>{active=entries[0].isIntersecting;section.classList.toggle('is-active',active);if(active)schedule();else{cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(section);
new IntersectionObserver(entries=>{if(entries[0].isIntersecting){load(0);load(1);}},{rootMargin:'100% 0px'}).observe(section);
alternate.decode().then(()=>align(alternate)).catch(()=>{});
measure();load(0);
})();

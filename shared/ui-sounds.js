/* Small opt-in UI sounds. Loading this module never creates audio or plays it. */
(()=>{
  'use strict';
  if(window.RafiqUISounds)return;
  let context;
  const attached=new WeakSet();
  function click(){
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext)return null;
    try{
      context=context||new AudioContext();
      // Resume is requested directly during the user gesture.
      const ready=context.state==='running'?Promise.resolve():context.resume();
      return Promise.resolve(ready).then(()=>{
        const oscillator=context.createOscillator(),gain=context.createGain(),now=context.currentTime;
        oscillator.type='sine';
        oscillator.frequency.setValueAtTime(740,now);
        oscillator.frequency.exponentialRampToValueAtTime(480,now+0.045);
        gain.gain.setValueAtTime(0.0001,now);
        gain.gain.exponentialRampToValueAtTime(0.018,now+0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001,now+0.05);
        oscillator.connect(gain);gain.connect(context.destination);
        return new Promise(resolve=>{
          oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();resolve();};
          oscillator.start(now);oscillator.stop(now+0.055);
        });
      }).catch(()=>{});
    }catch{return null;}
  }
  function attachNavigation(root){
    if(!root||attached.has(root))return;
    attached.add(root);
    root.addEventListener('click',event=>{
      const link=event.target.closest?.('a[href]');
      if(!link||!root.contains(link)||event.defaultPrevented||event.button!==0)return;
      const url=new URL(link.href,location.href);
      if(!['http:','https:'].includes(url.protocol))return;
      if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.hasAttribute('download')||(link.target&&link.target!=='_self')){
        click();return; // Keep native new-tab, download and modified-click behavior.
      }
      if(url.origin!==location.origin||url.pathname===location.pathname&&url.search===location.search){
        click();return;
      }
      const playback=click();
      if(!playback)return; // Unsupported audio keeps normal navigation.
      event.preventDefault();
      // Give the short sound time to finish before unloading, even on cold pages.
      // A blocked or failed audio context must never block navigation.
      Promise.race([playback,new Promise(resolve=>setTimeout(resolve,120))])
        .then(()=>location.assign(link.href));
    });
  }
  window.RafiqUISounds={click,attachNavigation};
})();

/* Local profile presentation only. Never attached to messages, reports or AI requests. */
(()=>{
'use strict';
const animals=['bear','bunny','cat','fox','star','moon'],colors=['#f6d9e6','#d5eafb','#d9eee3','#f7e3c7','#e4def7','#f6edb9'];
const text=en=>document.documentElement.lang==='ar'?(window.RafiqHomeArabic?.[en]||en):en;
function illustration(kind){
 const ears=kind==='bunny'?'<ellipse cx="25" cy="18" rx="7" ry="16"/><ellipse cx="55" cy="18" rx="7" ry="16"/>':kind==='cat'||kind==='fox'?'<path d="M14 36 12 8 35 25M45 25 68 8 66 36"/>':'<circle cx="19" cy="24" r="12"/><circle cx="61" cy="24" r="12"/>';
 const face=kind==='star'?'<path d="m40 7 10 22 24 3-18 17 5 24-21-12-21 12 5-24L6 32l24-3Z"/>':kind==='moon'?'<path d="M54 8a32 32 0 1 0 18 52A30 30 0 0 1 54 8Z"/>':ears+'<ellipse cx="40" cy="45" rx="28" ry="26"/>';
 return `<svg viewBox="0 0 80 80" aria-hidden="true" style="width:78%;height:78%"><g fill="${kind==='fox'?'#e4a36e':'#fff8ee'}" stroke="#52665c" stroke-width="2" stroke-linejoin="round">${face}</g><g fill="#36554a"><circle cx="30" cy="43" r="2.5"/><circle cx="50" cy="43" r="2.5"/></g><path d="M35 53q5 5 10 0" fill="none" stroke="#36554a" stroke-width="2" stroke-linecap="round"/></svg>`;
}
function render(el,child){
 if(!el)return;el.replaceChildren();el.style.overflow='hidden';el.style.borderRadius='50%';
 if(/^data:image\/(jpeg|png|webp|gif);base64,/i.test(child?.photo||'')){
  const img=document.createElement('img');img.src=child.photo;img.alt=child.name||text('Your child');img.style.cssText='width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit';el.append(img);
 }else if(animals.includes(child?.avatar)){el.style.backgroundColor=colors.includes(child.avatarColor)?child.avatarColor:colors[0];el.innerHTML=illustration(child.avatar);}
 else{el.style.removeProperty('background-color');el.textContent=Array.from(child?.name||'?')[0].toUpperCase();}
}
let activeDialog=null;
function pick(child,onSave){
 if(activeDialog?.open)return;
 const dialog=document.createElement('dialog');activeDialog=dialog;dialog.className='child-avatar-dialog';dialog.setAttribute('aria-labelledby','avatarPickerTitle');
 dialog.innerHTML=`<form method="dialog"><h2 id="avatarPickerTitle">${text('Choose a photo')}</h2><p>${text('Only you and the caregivers you invite can see this photo.')}</p><div class="avatar-upload-actions"><button type="button" data-upload>${text('Upload')}</button><button type="button" data-camera>${text('Take photo')}</button></div><input type="file" accept="image/*" data-file hidden aria-label="${text('Upload')}"><input type="file" accept="image/*" capture="user" data-capture hidden aria-label="${text('Take photo')}"><div class="avatar-crop-wrap"><canvas width="256" height="256" tabindex="0" aria-label="${text('Photo crop: drag or use arrow keys to reposition')}"></canvas><div class="avatar-picker-preview"></div></div><label class="avatar-zoom">${text('Zoom')}<input type="range" min="1" max="3" step="0.01" value="1" aria-label="${text('Zoom')}"></label><fieldset><legend>${text('Or choose an avatar')}</legend><div class="avatar-options"></div></fieldset><fieldset><legend>${text('Background color')}</legend><div class="avatar-colors"></div></fieldset><p class="avatar-picker-status" role="status"></p><div class="avatar-picker-actions"><button type="button" data-remove>${text('Remove')}</button><button value="cancel">${text('Cancel')}</button><button type="button" data-save>${text('Save')}</button></div></form>`;
 document.body.append(dialog);
 const q=s=>dialog.querySelector(s),canvas=q('canvas'),ctx=canvas.getContext('2d'),preview=q('.avatar-picker-preview'),zoom=q('[type=range]'),status=q('.avatar-picker-status'),save=q('[data-save]');
 let photo=child.photo||null,avatar=child.avatar||null,color=child.avatarColor||colors[0],img=null,offset={x:0,y:0},drag=null,loading=0,removed=false,stream=null;
 const video=document.createElement('video'),capture=document.createElement('button');video.autoplay=true;video.playsInline=true;video.muted=true;video.hidden=true;video.className='avatar-camera-preview';capture.type='button';capture.textContent=text('Take photo');capture.hidden=true;q('.avatar-crop-wrap').after(video,capture);
 function stopCamera(){stream?.getTracks().forEach(track=>track.stop());stream=null;video.srcObject=null;video.hidden=true;capture.hidden=true;}
 capture.onclick=()=>{if(!video.videoWidth)return;const shot=document.createElement('canvas');shot.width=video.videoWidth;shot.height=video.videoHeight;shot.getContext('2d').drawImage(video,0,0);shot.toBlob(blob=>{stopCamera();if(blob)load(blob);},'image/jpeg',.9);};
 function draw(){if(!img)return;const scale=Math.max(256/img.width,256/img.height)*Number(zoom.value),w=img.width*scale,h=img.height*scale;offset.x=Math.max(-(w-256)/2,Math.min((w-256)/2,offset.x));offset.y=Math.max(-(h-256)/2,Math.min((h-256)/2,offset.y));ctx.fillStyle='#fff';ctx.fillRect(0,0,256,256);ctx.drawImage(img,128-w/2+offset.x,128-h/2+offset.y,w,h);}
 function update(){canvas.hidden=!img;preview.hidden=!!img;q('.avatar-zoom').hidden=!img;if(!img)render(preview,{name:child.name,photo,avatar,avatarColor:color});dialog.querySelectorAll('[data-avatar]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.avatar===avatar&&!photo&&!img)));dialog.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===color)));}
 async function load(file){
  const request=++loading;status.textContent='';
  if(!file||!file.type.startsWith('image/')){status.textContent=text('Please choose an image.');return;}
  if(file.size>8*1024*1024){status.textContent=text('Please choose a photo under 8 MB.');return;}
  const url=URL.createObjectURL(file);save.disabled=true;
  try{const candidate=new Image();candidate.src=url;await candidate.decode();if(request!==loading||!dialog.open)return;img=candidate;photo=null;avatar=null;removed=false;offset={x:0,y:0};zoom.value='1';draw();update();}catch{if(request===loading)status.textContent=text('This image could not be opened. Please choose another.');}finally{URL.revokeObjectURL(url);if(request===loading)save.disabled=false;}
 }
 for(const kind of animals){const b=document.createElement('button');b.type='button';b.dataset.avatar=kind;b.setAttribute('aria-label',text(kind));b.innerHTML=illustration(kind);b.onclick=()=>{stopCamera();loading++;save.disabled=false;img=null;photo=null;avatar=kind;removed=false;update();};q('.avatar-options').append(b);}
 for(const value of colors){const b=document.createElement('button');b.type='button';b.dataset.color=value;b.style.backgroundColor=value;b.setAttribute('aria-label',text(['Pink','Blue','Mint','Peach','Lavender','Yellow'][colors.indexOf(value)]));b.onclick=()=>{color=value;update();};q('.avatar-colors').append(b);}
 q('[data-upload]').onclick=()=>{stopCamera();q('[data-file]').click();};q('[data-camera]').onclick=async()=>{
  if(!navigator.mediaDevices?.getUserMedia){q('[data-capture]').click();return;}
  stopCamera();try{const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});if(!dialog.open){media.getTracks().forEach(track=>track.stop());return;}stream=media;video.srcObject=media;video.hidden=false;capture.hidden=false;capture.focus();}catch{status.textContent=text('Camera unavailable. You can upload a photo instead.');}
 };
 for(const input of dialog.querySelectorAll('[type=file]'))input.onchange=()=>{if(input.files[0])load(input.files[0]);input.value='';};
 zoom.oninput=draw;
 canvas.onpointerdown=e=>{if(!img)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);};
 canvas.onpointermove=e=>{if(!drag)return;const ratio=256/canvas.getBoundingClientRect().width;offset.x+=(e.clientX-drag.x)*ratio;offset.y+=(e.clientY-drag.y)*ratio;drag={x:e.clientX,y:e.clientY};draw();};
 canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;};
 canvas.onkeydown=e=>{const delta={ArrowLeft:[-4,0],ArrowRight:[4,0],ArrowUp:[0,-4],ArrowDown:[0,4]}[e.key];if(delta&&img){e.preventDefault();offset.x+=delta[0];offset.y+=delta[1];draw();}};
 q('[data-remove]').onclick=()=>{stopCamera();loading++;save.disabled=false;img=null;photo=null;avatar=null;removed=true;update();status.textContent=text('Photo will be removed when you save.');};
 save.onclick=()=>{try{
  const current=window.RafiqSetup.readChildren().find(c=>c.id===child.id);if(!current)throw Error(text('This child profile could not be found.'));
  const updated={...current};delete updated.photo;delete updated.avatar;delete updated.avatarColor;
  if(!removed){if(img)updated.photo=canvas.toDataURL('image/jpeg',.8);else if(photo)updated.photo=photo;else if(avatar){updated.avatar=avatar;updated.avatarColor=color;}}
  window.RafiqSetup.writeChildren([updated]);document.dispatchEvent(new Event('rafiq-child-change'));onSave?.(updated);dialog.close('save');
 }catch(error){status.textContent=error.message||text('We could not save this photo. Please try again.');}};
 dialog.addEventListener('close',()=>{loading++;stopCamera();dialog.remove();activeDialog=null;document.body.classList.remove('child-avatar-open');},{once:true});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close('cancel');});
 update();document.body.classList.add('child-avatar-open');dialog.showModal();q('[data-upload]').focus();
}
window.RafiqChildAvatar={render,pick};
function sync(){try{const list=window.RafiqSetup?.readChildren()||[],id=window.RafiqFamily?.selected(),child=list.find(c=>c.id===id)||list[0];if(!child)return;for(const id of ['childAvatar','sidebarChildAvatar'])render(document.getElementById(id),child);}catch{}}
document.addEventListener('DOMContentLoaded',()=>queueMicrotask(sync));document.addEventListener('rafiq-child-change',sync);window.addEventListener('pageshow',sync);window.addEventListener('storage',e=>{if(e.key==='rafiqChildren'||e.key==='rafiqCurrentChildId')sync();});
sync();
})();

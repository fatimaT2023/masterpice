/* Prototype credential copies. Server-side private storage is needed for production. */
(() => {
 const documents={};window.RafiqCredentialProofs=documents;
 document.addEventListener('DOMContentLoaded',()=>{
  const previous=window.RafiqSpecialistAccess?.profile;
  if(previous?.status==='needs_changes')Object.assign(documents,previous.credentialProofs||{});
  const keys=['licenseProof','qualificationProof'];
  function render(key){
   const mount=document.querySelector('[data-proof-preview="'+key+'"]');mount.replaceChildren();
   const doc=documents[key];document.querySelector('[data-proof-remove="'+key+'"]').hidden=!doc;
   if(!doc)return;
   const name=document.createElement('p');name.textContent=doc.name;mount.append(name);
   if(doc.type.startsWith('image/')){const image=document.createElement('img');image.src=doc.data;image.alt='Document preview';mount.append(image);}
   else{const info=document.createElement('p');info.textContent='PDF · '+Math.ceil(doc.size/1024)+' KB';mount.append(info);}
  }
  const camera=document.createElement('dialog');camera.className='proof-camera-dialog';
  camera.innerHTML='<h2>Photograph your document</h2><p>Keep the whole document in frame and make sure the text is readable.</p><video autoplay playsinline muted></video><img alt="Captured document" hidden><p class="field-error" role="alert"></p><div class="proof-actions"><button type="button" data-camera="capture">Capture photo</button><button type="button" data-camera="retake" hidden>Retake</button><button type="button" data-camera="use" hidden>Use photo</button><button type="button" data-camera="close">Cancel</button></div>';
  document.body.append(camera);
  const video=camera.querySelector('video'),photo=camera.querySelector('img'),cameraError=camera.querySelector('[role=alert]');
  const action=name=>camera.querySelector('[data-camera="'+name+'"]');
  let stream=null,cameraKey=null,captured=null,request=0;
  function stopCamera(){if(stream)stream.getTracks().forEach(track=>track.stop());stream=null;video.srcObject=null;}
  function closeCamera(){request++;stopCamera();cameraKey=null;captured=null;if(camera.open)camera.close();}
  function live(){photo.hidden=true;video.hidden=false;action('capture').hidden=false;action('capture').disabled=true;action('retake').hidden=true;action('use').hidden=true;}
  video.addEventListener('loadeddata',()=>{action('capture').disabled=false;});
  async function openCamera(key){
   closeCamera();const token=++request;cameraKey=key;captured=null;cameraError.textContent='';live();camera.showModal();
   if(!navigator.mediaDevices?.getUserMedia){cameraError.textContent='Camera access requires HTTPS or localhost and a supported browser.';return;}
   try{const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}},audio:false});
    if(token!==request||!camera.open){media.getTracks().forEach(track=>track.stop());return;}
    stream=media;video.srcObject=media;await video.play();
   }catch(error){if(token===request){stopCamera();cameraError.textContent=error.name==='NotAllowedError'?'Allow camera access in your browser, then try again.':'Could not start the camera. Check that a camera is connected and available.';}}
  }
  action('capture').addEventListener('click',()=>{
   if(!video.videoWidth||!video.videoHeight)return;
   const canvas=document.createElement('canvas'),scale=Math.min(1,1800/Math.max(video.videoWidth,video.videoHeight));canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);
   canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
   let quality=.9,data=canvas.toDataURL('image/jpeg',quality);
   while((data.length-data.indexOf(',')-1)*.75>1024*1024&&quality>.3){quality-=.1;data=canvas.toDataURL('image/jpeg',quality);}
   const size=Math.ceil((data.length-data.indexOf(',')-1)*.75);
   if(size>1024*1024){cameraError.textContent='Photo is too large. Move closer to the document and try again.';return;}
   captured={name:cameraKey+'-'+Date.now()+'.jpg',type:'image/jpeg',size,data};photo.src=data;photo.hidden=false;video.hidden=true;action('capture').hidden=true;action('retake').hidden=false;action('use').hidden=false;cameraError.textContent='';
  });
  action('retake').addEventListener('click',()=>{captured=null;live();action('capture').disabled=!video.videoWidth;});
  action('use').addEventListener('click',()=>{if(!captured||!cameraKey)return;documents[cameraKey]=captured;document.getElementById(cameraKey+'Error').textContent='';render(cameraKey);closeCamera();});
  action('close').addEventListener('click',closeCamera);
  camera.addEventListener('cancel',event=>{event.preventDefault();closeCamera();});camera.addEventListener('close',stopCamera);
  window.addEventListener('pagehide',closeCamera);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)closeCamera();});
  for(const key of keys){
   document.querySelector('[data-proof-camera="'+key+'"]').addEventListener('click',()=>openCamera(key));
   for(const input of document.querySelectorAll('[data-proof-file="'+key+'"]'))input.addEventListener('change',async()=>{
    const file=input.files[0],error=document.getElementById(key+'Error');error.textContent='';if(!file)return;
    if(!['application/pdf','image/jpeg','image/png'].includes(file.type)||file.size>1024*1024){error.textContent='Choose a PDF, JPG or PNG file up to 1 MB.';input.value='';return;}
    try{const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});documents[key]={name:file.name,type:file.type,size:file.size,data};render(key);}catch{error.textContent='Could not read the document. Please try again.';}
   });
   document.querySelector('[data-proof-remove="'+key+'"]').addEventListener('click',()=>{delete documents[key];document.querySelectorAll('[data-proof-file="'+key+'"]').forEach(input=>input.value='');render(key);});render(key);
  }
  window.RafiqValidateCredentialProofs=()=>{let valid=true;for(const key of keys){const missing=!documents[key];document.getElementById(key+'Error').textContent=missing?'Attach a supporting document to continue.':'';if(missing)valid=false;}return valid;};
 });
})();
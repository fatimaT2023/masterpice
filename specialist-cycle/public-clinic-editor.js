/* The specialist explicitly chooses these materials for publication to parents.
   Renders two profile cards ("How you work with families" and "Photo, video & certificates")
   and exposes RafiqPublicClinicEditor.collect() for profile.js to save. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const button=document.getElementById('saveProfileButton');if(!button)return;
 let profile;try{profile=JSON.parse(localStorage.getItem('rafiqSpecialistProfile')||'null');}catch{return;}if(!profile?.id)return;
 const api=window.RafiqSpecialistPublic,current=api.normalize(profile.publicProfile);
 const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const MAX_CERTS=6;
 function card(id,kicker,title,text,icon){
  const section=make('section',undefined,'profile-card clinic-card');section.id=id;
  const head=make('div',undefined,'card-heading');
  const iconBox=make('div',icon,'card-icon '+(id==='clinicWorkCard'?'mint':'sky'));iconBox.setAttribute('aria-hidden','true');
  const copy=make('div');copy.append(make('span',kicker,'section-kicker'),make('h2',title),make('p',text));
  head.append(iconBox,copy);section.append(head);return section;
 }
 const inputs={};
 function field(parent,key,label,hint,{area=false,type='text',placeholder=''}={}){
  const wrap=make('div',undefined,'form-group'+(area?' full':''));
  const input=make(area?'textarea':'input');input.id='public-clinic-'+key;input.maxLength=1500;input.value=current[key]||'';if(!area)input.type=type;if(area)input.rows=3;if(placeholder)input.placeholder=placeholder;
  const lab=make('label',label);lab.htmlFor=input.id;wrap.append(lab,input);if(hint){const small=make('small',hint,'field-hint');wrap.append(small);}
  parent.append(wrap);inputs[key]=input;return input;
 }

 /* Card 1: how you work — read by families before they book. */
 const work=card('clinicWorkCard','FOR FAMILIES','How you work with families','Shown on your public page so parents know what to expect before booking.','♡');
 const workGrid=make('div',undefined,'form-grid');work.append(workGrid);
 field(workGrid,'approach','Your approach with children and parents','', {area:true,placeholder:'For example: I start from what the family has noticed at home and suggest small, playful steps.'});
 field(workGrid,'firstSession','What happens in the first session','', {area:true,placeholder:'For example: we get to know your child through play and agree on one or two goals together.'});
 field(workGrid,'ageGroups','Age groups you work with','',{placeholder:'e.g. Birth to 6 years'});
 field(workGrid,'duration','Session length','',{placeholder:'e.g. 45 minutes'});
 field(workGrid,'clinic','Clinic name and location, or online','',{placeholder:'e.g. Online, or Clinic name — Amman'});
 field(workGrid,'cancellation','Cancellation and rescheduling policy','', {area:true,placeholder:'e.g. Free rescheduling up to 24 hours before the session.'});

 /* Card 2: media and public certificates. */
 const media=card('clinicMediaCard','PUBLIC MATERIALS','Photo, video & certificates','Only add files that are meant for the public. Verification documents stay private with RAFIQ administration.','◎');
 const mediaGrid=make('div',undefined,'form-grid');media.append(mediaGrid);
 field(mediaGrid,'photo','Profile photo link','HTTPS link. Or upload an image below.',{type:'url',placeholder:'https://'});
 field(mediaGrid,'video','Introduction video link','Optional. A short HTTPS video link.',{type:'url',placeholder:'https://'});
 const uploadWrap=make('div',undefined,'form-group full clinic-upload');
 const uploadLabel=make('label','Upload a profile photo'),upload=make('input');upload.type='file';upload.id='public-clinic-upload';upload.accept='image/png,image/jpeg,image/webp';uploadLabel.htmlFor=upload.id;
 const removePhoto=make('button','Remove uploaded photo','secondary-button');removePhoto.type='button';
 uploadWrap.append(uploadLabel,upload,make('small','PNG, JPEG or WebP, up to 500 KB.','field-hint'),removePhoto);mediaGrid.append(uploadWrap);
 const status=make('p',undefined,'field-error clinic-status');status.setAttribute('role','alert');media.append(status);
 let photoData=current.photo.startsWith('data:')?current.photo:'';if(photoData)inputs.photo.value='';removePhoto.hidden=!photoData;
 removePhoto.onclick=()=>{photoData='';upload.value='';removePhoto.hidden=true;status.textContent='';};
 upload.onchange=async()=>{const file=upload.files[0];if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>500*1024){status.textContent='Choose a PNG, JPEG or WebP image under 500 KB.';upload.value='';return;}try{photoData=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});inputs.photo.value='';removePhoto.hidden=false;status.textContent='';upload.dispatchEvent(new Event('input',{bubbles:true}));}catch{status.textContent='The image could not be read.';}};

 const certHead=make('div',undefined,'clinic-cert-head');certHead.append(make('h3','Public certificates'),make('p','A title and a public HTTPS link for each certificate you want families to see.'));media.append(certHead);
 const certList=make('div',undefined,'clinic-cert-list');media.append(certList);
 const certRows=[];
 for(let index=0;index<MAX_CERTS;index++){
  const row=make('div',undefined,'clinic-cert-row'),title=make('input'),url=make('input');
  title.id='public-clinic-cert-title-'+index;url.id='public-clinic-cert-url-'+index;title.maxLength=160;url.type='url';title.placeholder='Certificate title';url.placeholder='https://';
  title.value=current.certificates[index]?.title||'';url.value=current.certificates[index]?.url||'';
  const tl=make('label','Certificate '+(index+1)),ul=make('label','Public link');tl.htmlFor=title.id;ul.htmlFor=url.id;
  const a=make('div',undefined,'form-group'),b=make('div',undefined,'form-group');a.append(tl,title);b.append(ul,url);
  const clear=make('button','Remove','text-button');clear.type='button';clear.setAttribute('aria-label','Remove certificate '+(index+1));
  clear.onclick=()=>{title.value='';url.value='';title.dispatchEvent(new Event('input',{bubbles:true}));if(certRows.filter(r=>!r.row.hidden).length>1)row.hidden=true;addCert.hidden=false;};
  row.append(a,b,clear);certList.append(row);certRows.push({row,title,url});
 }
 const filled=certRows.filter(r=>r.title.value||r.url.value).length;
 certRows.forEach((r,i)=>{r.row.hidden=i>=Math.max(filled,1);});
 const addCert=make('button','+ Add another certificate','secondary-button');addCert.type='button';addCert.hidden=filled>=MAX_CERTS;
 addCert.onclick=()=>{const next=certRows.find(r=>r.row.hidden);if(next){next.row.hidden=false;next.title.focus();}addCert.hidden=!certRows.some(r=>r.row.hidden);};
 media.append(addCert);
 const preview=make('a','Open your public page as families see it ↗','text-link clinic-preview-link');preview.href='../pearent-cycel/specialist-profile.html?specialist='+encodeURIComponent(profile.id);preview.target='_blank';preview.rel='noopener';media.append(preview);

 button.closest('.save-bar').before(work,media);

 window.RafiqPublicClinicEditor={collect(){
  status.textContent='';
  for(const key of ['photo','video'])if(inputs[key].value.trim()&&!api.url(inputs[key].value.trim())){status.textContent='Use a valid HTTPS link for the photo and video.';inputs[key].focus();throw Error(status.textContent);}
  for(const row of certRows)if((row.title.value.trim()||row.url.value.trim())&&(!row.title.value.trim()||!api.url(row.url.value.trim()))){row.row.hidden=false;status.textContent='Each certificate needs a title and a valid HTTPS link.';row.url.focus();throw Error(status.textContent);}
  return api.normalize({...Object.fromEntries(Object.entries(inputs).map(([key,input])=>[key,input.value])),photo:inputs.photo.value.trim()||photoData,certificates:certRows.map(row=>({title:row.title.value.trim(),url:row.url.value.trim()}))});
 }};
 document.dispatchEvent(new CustomEvent('rafiq:clinic-editor-ready'));
});

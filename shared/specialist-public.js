/* Only explicitly published media belongs in the parent-facing clinic. */
(() => {
 'use strict';
 function url(value,kind='link'){if(typeof value!=='string'||!value.trim())return '';try{const parsed=new URL(value);if(parsed.protocol!=='https:'||parsed.username||parsed.password)return '';return parsed.href;}catch{return '';}}
 function image(value){return typeof value==='string'&&/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)?value:url(value);}
 function normalize(value={}){value=value&&typeof value==='object'?value:{};const text=key=>typeof value[key]==='string'?value[key].trim().slice(0,1500):'';return {photo:image(value.photo),video:url(value.video),approach:text('approach'),ageGroups:text('ageGroups'),firstSession:text('firstSession'),duration:text('duration'),clinic:text('clinic'),cancellation:text('cancellation'),certificates:Array.isArray(value.certificates)?value.certificates.filter(c=>c&&typeof c==='object').slice(0,6).map(c=>({title:String(c.title||'').slice(0,160),url:image(c.url)})).filter(c=>c.title&&c.url):[]};}
 function find(id){const list=JSON.parse(localStorage.getItem('rafiqSpecialists')||'[]');if(!Array.isArray(list))throw Error('Specialist directory unavailable');let profile=list.find(s=>s?.id===id);if(!profile){const single=JSON.parse(localStorage.getItem('rafiqSpecialistProfile')||'null');if(single?.id===id)profile=single;}return profile?.status==='approved'&&profile.verificationStatus!=='rejected'&&!window.RafiqAccountStatus?.inactive({...profile,role:'specialist'})?profile:null;}
 window.RafiqSpecialistPublic={url,image,normalize,find};
})();

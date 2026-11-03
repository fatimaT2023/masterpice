(()=>{'use strict';
 function check(){
  try{const account=window.RafiqAccountStatus.current();if(account&&window.RafiqAccountStatus.inactive(account)){sessionStorage.clear();location.replace('../piblic-pages/login.html?account=inactive');}}
  catch{if(['parent','specialist'].includes(sessionStorage.getItem('rafiqRole'))){sessionStorage.clear();location.replace('../piblic-pages/login.html?account=unavailable');}}
 }
 check();window.addEventListener('storage',event=>{if(event.key===null||['rafiqAccountRestrictions','rafiqUsers','rafiqSpecialists'].includes(event.key))check();});window.addEventListener('focus',check);
})();

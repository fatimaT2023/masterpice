/* Public support contact. Only the fixed greeting is passed to WhatsApp. */
(() => {
  'use strict';
  const help = document.getElementById('registrationHelp');
  if (!help) return;
  const copy = {
    en: {
      title:'Trouble signing up? Get help',
      center:'Browse the Help Center',
      intro:'No account needed. Contact the RAFIQ support team on WhatsApp for help with registration.',
      tipEmail:'Check that your email address is entered correctly.',
      tipPassword:'Follow the password requirements and make sure both passwords match.',
      tipRole:'Choose Parent or Specialist and complete the required fields.',
      action:'Chat with support on WhatsApp',
      note:'WhatsApp opens in a new tab. Describe the problem there; never send your password or verification codes.',
      message:'Hello, I need help signing up for RAFIQ.'
    },
    ar: {
      center:'مركز المساعدة والإرشادات',
      title:'واجهت مشكلة؟ اطلب مساعدة بالتسجيل',
      intro:'مش محتاج حساب. تواصل مع فريق دعم رفيق على واتساب لنساعدك بالتسجيل.',
      tipEmail:'تأكد من كتابة بريدك الإلكتروني بشكل صحيح.',
      tipPassword:'اتبع شروط كلمة المرور وتأكد إنها متطابقة في الخانتين.',
      tipRole:'اختَر ولي أمر أو مختص، وعبّي الحقول المطلوبة.',
      action:'تواصل مع الدعم على واتساب',
      note:'رح يفتح واتساب بتبويب جديد. اشرح المشكلة هناك، ولا ترسل كلمة المرور أو رموز التحقق.',
      message:'مرحبًا، محتاج مساعدة بالتسجيل في رفيق.'
    }
  };
  function update() {
    const text = copy[document.documentElement.lang === 'ar' ? 'ar' : 'en'];
    help.querySelectorAll('[data-help-copy]').forEach(el => {el.textContent = text[el.dataset.helpCopy];});
    document.getElementById('registrationHelpWhatsApp').href = 'https://wa.me/962772574463?text=' + encodeURIComponent(text.message);
  }
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  update();
})();
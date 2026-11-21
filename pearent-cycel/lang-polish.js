/* Last pass for the Arabic view: catches the few English words that older pages or saved
   data still show (account menu on some pages, saved concern notes, payment status,
   tab titles). In English nothing changes; switching back restores the original text. */
(() => {
  'use strict';
  const exact = {
    'Ask Rafiq': 'اسألوا رفيق', 'My account': 'حسابي', 'Account, language & privacy': 'الحساب واللغة والخصوصية',
    'Settings': 'الإعدادات', 'My plan and payments': 'خطتي والمدفوعات', 'View your subscription options': 'شوفوا خيارات الاشتراك',
    'Help Center': 'مركز المساعدة', 'Guides & registration support': 'الأدلة ودعم التسجيل', 'How to use Rafiq': 'كيف تستخدموا رفيق',
    'Learn about the services anytime': 'تعرّفوا على الخدمات بأي وقت', 'Log out': 'تسجيل الخروج',
    'Choose your updates': 'اختاروا التنبيهات اللي بدكم إياها', 'No measurements recorded yet.': 'لسّا ما في قياسات مسجّلة.',
    'Payment & booking details': 'تفاصيل الدفع والحجز',
    '1 · Choose session': '١ · اختاروا الجلسة', '2 · Review details': '٢ · راجعوا التفاصيل', '3 · Demo payment': '٣ · الدفع', '4 · Confirmed': '٤ · تم التأكيد',
    'Speech & communication': 'النطق والتواصل', 'Movement & coordination': 'الحركة والتآزر', 'Interaction & play': 'التفاعل واللعب',
    'Behavior & emotions': 'السلوك والمشاعر', 'I’m not sure': 'مش متأكدين',
    'Read session report': 'اقرأوا تقرير الجلسة', 'Menu': 'القائمة',
    'Conversations': 'المحادثات', 'Search conversations': 'دوّروا بالمحادثات', 'Your conversations, together.': 'كل محادثاتكم بمكان واحد.',
    'Select a conversation to read messages and reply.': 'اختاروا محادثة لتقرأوا الرسائل وتردّوا.', 'Message history': 'سجل الرسائل', 'Write your message…': 'اكتبوا رسالتكم…',
    'Read saved records and session reports': 'قراءة السجلات المحفوظة وتقارير الجلسات', 'Everything in Free': 'كل إشي بالخطة المجانية',
    'Up to 5 child profiles': 'لحد ٥ ملفات أطفال', 'Personal follow-up reminders in Today': 'تذكيرات متابعة شخصية بالرئيسية',
    'Follow-up reminders': 'تذكيرات المتابعة', 'Included': 'مشمول', 'Saved records and reports': 'السجلات والتقارير المحفوظة',
    'Specialist messages': 'رسائل المختصين', 'Session fees': 'رسوم الجلسات', 'Paid separately': 'بتندفع لحالها',
    'Play and observe': 'نلعب ونلاحظ', 'Writing ideas': 'أفكار للكتابة', 'Other ways to continue': 'طرق ثانية تكمّلوا فيها', 'Activity stages': 'مراحل النشاط', 'A little reaction or something to remember…': 'ردة فعل صغيرة أو إشي بدكم تتذكروه…','Appointments and reports': 'المواعيد والتقارير'
  };
  // Phrases inside longer text (e.g. a saved concern note), longest first.
  const phrases = Object.entries({
    'My follow-up after a visit with ': 'متابعتي بعد زيارة ',
    'Has your child stopped doing something they used to do?': 'هل بطّل طفلكم يعمل إشي كان يعمله؟',
    'When did you first notice this?': 'إمتى لاحظتوا هالإشي أول مرة؟', 'Where do you notice it?': 'وين بتلاحظوه؟',
    'What did you notice?': 'شو لاحظتوا؟', 'It has been a long-standing concern': 'قلق من زمان',
    'In one particular situation': 'بموقف واحد محدّد', 'In several everyday situations': 'بأكثر من موقف يومي',
    'Someone else mentioned it to me': 'حدا ثاني لفت انتباهي', 'I’m not sure yet': 'لسّا مش متأكدين',
    'Several weeks ago': 'من كم أسبوع', 'Several months ago': 'من كم شهر', 'Recently': 'من فترة قريبة',
    'Speech & communication': 'النطق والتواصل', 'Movement & coordination': 'الحركة والتآزر', 'Interaction & play': 'التفاعل واللعب',
    'Behavior & emotions': 'السلوك والمشاعر', 'I’m not sure': 'مش متأكدين',
    ': paid': ': مدفوع', ': unpaid': ': مش مدفوع', ': pending': ': قيد الانتظار', ': refunded': ': مسترجع', ' JOD': ' دينار'
  }).sort((a, b) => b[0].length - a[0].length);
  const patterns = [
    [/^Plus access ends on (.+?)\. This preview does not renew or charge automatically\.$/, (m, d) => 'اشتراك Plus بينتهي بـ ' + d + '. هاد عرض تجريبي، ما بيتجدد وما بينخصم إشي تلقائيًا.'],
    [/^Development resources use corrected age: (.+?)\. The profile age above uses date of birth\.$/, (m, a) => 'محتوى النمو بيعتمد العمر المصحّح: ' + a + '. العمر فوق محسوب من تاريخ الولادة.'],
    [/^(\d+) appointment and report updates?$/, (m, n) => n + ' تحديثات عن المواعيد والتقارير']
  ];
  const after = [[/(^|\n)(No|Yes)(?=\n|$)/g, (m, s, w) => s + (w === 'Yes' ? 'نعم' : 'لا')]];
  const titles = { 'daily-activity.html': 'نشاط اليوم | رفيق', 'milestones.html': 'دفتر النمو | رفيق', 'support-practice.html': 'نطبّق بالبيت | رفيق' };
const page = location.pathname.split('/').pop();
  const original = new WeakMap(); const changed = new Set();
  let originalTitle = null, busy = false;
  const isAr = () => (document.documentElement.lang || 'ar') !== 'en';

  function translate(s) {
    const trimmed = s.trim();
    if (exact[trimmed]) return s.replace(trimmed, exact[trimmed]);
    for (const [re, fn] of patterns) if (re.test(trimmed)) return s.replace(trimmed, trimmed.replace(re, fn));
    if (!/[A-Za-z]{3,}/.test(s)) return s;
    let out = s, hit = false;
    for (const [en, ar] of phrases) if (out.includes(en)) { out = out.split(en).join(ar); hit = true; }
    if (hit) for (const [re, fn] of after) out = out.replace(re, fn);
    return out;
  }

  function apply() {
    if (busy) return; busy = true;
    try {
      if (isAr()) {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
        while ((n = w.nextNode())) {
          const el = n.parentElement; if (!el || el.closest('script,style,textarea,input,[contenteditable]')) continue;
          const next = translate(n.textContent);
          if (next !== n.textContent) { if (!original.has(n)) original.set(n, n.textContent); n.textContent = next; changed.add(n); }
        }
        // Placeholders and screen-reader labels
        document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
          for (const a of ['placeholder', 'aria-label', 'title']) {
            const v = el.getAttribute(a); if (!v || !/[A-Za-z]{3,}/.test(v)) continue;
            const next = translate(v); if (next === v) continue;
            if (!el.hasAttribute('data-lp-' + a)) el.setAttribute('data-lp-' + a, v);
            el.setAttribute(a, next);
          }
        });
        // A booking reference code means nothing to a parent.
        document.querySelectorAll('p,li,span,div').forEach(el => { if (el.children.length === 0 && /^المرجع:\s*\S+$/.test(el.textContent.trim())) el.hidden = true; });
        const t = titles[page]; if (t && document.title !== t) { originalTitle = originalTitle || document.title; document.title = t; }
      } else {
        changed.forEach(n => { if (n.isConnected && original.has(n)) n.textContent = original.get(n); }); changed.clear();
        for (const a of ['placeholder', 'aria-label', 'title']) document.querySelectorAll('[data-lp-' + a + ']').forEach(el => { el.setAttribute(a, el.getAttribute('data-lp-' + a)); el.removeAttribute('data-lp-' + a); });
        if (originalTitle) { document.title = originalTitle; originalTitle = null; }
      }
    } finally { setTimeout(() => { busy = false; }, 0); }
  }

  let timer = 0; const later = (ms = 120) => { clearTimeout(timer); timer = setTimeout(apply, ms); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => later(200)); else later(200);
  window.addEventListener('load', () => { later(150); setTimeout(apply, 900); });
  new MutationObserver(() => later(300)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const watch = () => document.body && new MutationObserver(m => { if (!busy && isAr() && m.some(r => r.addedNodes.length || r.type === 'characterData')) later(250); }).observe(document.body, { childList: true, subtree: true, characterData: true });
  if (document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
})();

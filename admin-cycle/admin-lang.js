/* Admin area, Arabic view: translates the English that older admin pages still show, turns
   dates and amounts into Arabic, and hides internal record codes. English view is untouched;
   switching back restores the original text. */
(() => {
  'use strict';
  const exact = {
    'Your daily workspace': 'مساحة عملك اليومية', 'Review requests and outstanding actions. Open reports for trends and comparisons.': 'راجع الطلبات والإجراءات المعلّقة. وللاتجاهات والمقارنات افتح التقارير.',
    'View performance reports →': 'عرض تقارير الأداء ←', 'Applications awaiting review': 'طلبات اعتماد بانتظار المراجعة', 'New support requests': 'طلبات دعم جديدة',
    'Open support requests': 'فتح طلبات الدعم', 'Settlements awaiting transfer': 'تسويات بانتظار التحويل', 'Review settlements': 'مراجعة التسويات',
    'Refunds awaiting action': 'مبالغ مستردة بانتظار إجراء', 'Review refunds': 'مراجعة الاسترداد', 'Today’s appointments': 'مواعيد اليوم',
    'Appointments scheduled for today across RAFIQ.': 'المواعيد المجدولة اليوم على منصة رفيق.',
    'Verification checklist': 'قائمة التحقق', 'Confirm each item against an independent source. A recorded file name is not proof that a document was reviewed.': 'تحقّق من كل بند عبر مصدر مستقل. اسم الملف المسجّل ليس دليلًا على مراجعة الوثيقة.',
    'Identity matches the professional documents': 'الهوية مطابقة للوثائق المهنية', 'Qualifications support the stated specialty': 'المؤهلات تدعم التخصص المذكور',
    'Contact details checked and experience evidence reviewed': 'تم التحقق من بيانات التواصل ومراجعة إثبات الخبرة', 'Verification notes and source references': 'ملاحظات التحقق ومراجعها',
    'Required before approval: briefly describe what you checked and the source used (at least 10 characters).': 'مطلوب قبل الاعتماد: اكتب باختصار ما الذي تحققت منه والمصدر (١٠ أحرف على الأقل).',
    'Request more information': 'طلب معلومات إضافية', 'Needs information': 'بحاجة لمعلومات', 'Suspend': 'تعليق',
    'Record the issuing body, reference checked and verification date. Do not include unnecessary personal data.': 'سجّل الجهة المُصدِرة والمرجع وتاريخ التحقق. لا تضف بيانات شخصية غير ضرورية.',
    'Finance': 'المالية', 'Finance settings': 'إعدادات المالية', 'Commission for new bookings (%)': 'عمولة الحجوزات الجديدة (٪)', 'Save commission': 'حفظ العمولة',
    'Changes apply to new bookings only. Existing payment records keep their original rate.': 'التغيير يطبَّق على الحجوزات الجديدة فقط، وتحتفظ الدفعات السابقة بنسبتها الأصلية.',
    'Review session payments, specialist settlements and parent subscriptions.': 'راجع دفعات الجلسات وتسويات الأخصائيين واشتراكات الأهل.',
    'Preview records only. No real payments, transfers or emails are sent.': 'سجلات عرض فقط. لا تُرسل دفعات أو تحويلات أو رسائل حقيقية.',
    'Reporting period': 'فترة التقرير', 'REPORTING PERIOD': 'فترة التقرير', 'Session date · subscription start date · payment date': 'تاريخ الجلسة · بداية الاشتراك · تاريخ الدفع',
    'Refund pending': 'استرداد معلّق', 'Collected session payments': 'دفعات الجلسات المحصّلة', 'Selected period · excludes refunded payments': 'الفترة المختارة · بدون المبالغ المستردة',
    'Specialist amounts due': 'المستحق للأخصائيين', 'Completed sessions awaiting transfer': 'جلسات مكتملة بانتظار التحويل', 'Earned platform commission': 'عمولة المنصة المكتسبة',
    'Paid, completed sessions': 'جلسات مدفوعة ومكتملة', 'Session payments': 'دفعات الجلسات', 'Specialist settlements': 'تسويات الأخصائيين', 'Subscription payment history': 'سجل دفعات الاشتراكات',
    'Search': 'بحث', 'Booking / specialist': 'الحجز / الأخصائي', 'BOOKING / SPECIALIST': 'الحجز / الأخصائي', 'Commission': 'العمولة', 'COMMISSION': 'العمولة', 'Specialist net': 'صافي الأخصائي', 'SPECIALIST NET': 'صافي الأخصائي',
    'Record demo transfer': 'تسجيل تحويل', 'Held until session completion': 'محجوز حتى انتهاء الجلسة', 'requested': 'مطلوب', 'Pending': 'بانتظار المراجعة',
    'All time': 'كل الفترات', 'Booking or specialist': 'الحجز أو الأخصائي', 'Needs action': 'بحاجة لإجراء', 'Refunded': 'مسترد', 'Transferred': 'تم التحويل',
    'Compare activity across periods. Use the dashboard for requests that need action.': 'قارن النشاط بين الفترات. للطلبات التي تحتاج إجراء استخدم اللوحة الرئيسية.',
    'Performance over time': 'الأداء عبر الوقت', 'Open daily dashboard →': 'فتح اللوحة اليومية ←', 'Subscription payments collected': 'دفعات الاشتراكات المحصّلة',
    'Current content inventory (all time)': 'المحتوى الحالي (كل الفترات)', 'Current AI inventory (all time)': 'محتوى المساعد الحالي (كل الفترات)',
    'Last 30 days': 'آخر ٣٠ يومًا', 'Custom dates': 'تواريخ مخصّصة', 'Age bands & content sources': 'الفئات العمرية ومصادر المحتوى', 'About content management': 'عن إدارة المحتوى',
    'Show all': 'عرض الكل', 'Range': 'المدى', 'RANGE': 'المدى', 'Hide': 'إخفاء', 'Audience': 'الجمهور', 'Disable': 'تعطيل', 'Enable': 'تفعيل',
    'No registered accounts yet.': 'لا توجد حسابات مسجّلة بعد.'
  };
  const months = 'شهر';
  const patterns = [
    [/^(\d+) to (\d+) months$/, (m, a, b) => 'من ' + a + ' إلى ' + b + ' ' + months],
    [/^(\d+) to (\d+) years$/, (m, a, b) => 'من ' + a + ' إلى ' + b + ' سنوات'],
    [/^Organizational age band: (\d+) to under (\d+) months\. Not a clinical milestone classification\.$/, (m, a, b) => 'فئة تنظيمية: من ' + a + ' إلى أقل من ' + b + ' ' + months + '. ليست تصنيفًا سريريًا للنمو.'],
    [/^Compared (?:with|مع) the previous equal-length period: (.+)$/, (m, r) => 'مقارنة بالفترة السابقة بنفس الطول: ' + r],
    [/^Starts (?:with|مع) (\d+) records per category\.$/, (m, n) => 'يبدأ بعرض ' + n + ' سجلات لكل فئة.'],
    [/^Showing (\d+) of (\d+) items$/, (m, a, b) => 'عرض ' + a + ' من ' + b],
    [/^License checked (?:with|مع) the issuer, or an explained exemption verified$/, () => 'تم التحقق من الرخصة لدى الجهة المُصدِرة، أو من استثناء موضّح'],
    [/^Dates refer to specialist registration, scheduled session, report submission and recorded payment\..*$/, () => 'التواريخ تعني: تسجيل الأخصائي، موعد الجلسة، إرسال التقرير، وتسجيل الدفع. المحتوى ومحتوى المساعد الحاليان معروضان بشكل منفصل.'],
    [/^Previous period: (.+)$/, (m, v) => 'الفترة السابقة: ' + v],
    [/^(\d+) total applications?$/, (m, n) => n + ' طلبات إجمالًا'],
    [/^(\d+) session records? needs? action\.$/, (m, n) => n + ' سجلات جلسات تحتاج إجراء.'],
    [/^(\d+) tickets? awaiting attention$/, (m, n) => n + ' طلبات بانتظار المعالجة'],
    [/^(\d+) requests?$/, (m, n) => n + ' طلبات'], [/^(\d+) items?$/, (m, n) => n + ' عناصر'], [/^(\d+) critical$/, (m, n) => n + ' حرجة'],
    [/^Updated (\d{1,2}:\d{2}) (AM|PM)$/, (m, t, p) => 'آخر تحديث ' + t + (p === 'PM' ? ' م' : ' ص')],
    [/^([\d.]+) JOD \((\d+)%\)$/, (m, v, p) => v + ' د.أ (' + p + '٪)'],
    [/^(Online|In-person) · (.+)$/, (m, t, r) => (t === 'Online' ? 'عن بُعد' : 'حضوري') + ' · ' + r],
    [/^(.+?) • Pending$/, (m, n) => n + ' • بانتظار المراجعة'],
    [/^(?:demo|showcase|rafiq_showcase)[\w-]* \/ (.+)$/, (m, n) => n],
    [/^(\d{1,2} )?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*( \d{1,2},)?( \d{4})?(, \d{1,2}:\d{2})?$/, m => { const d = new Date(/\d{4}/.test(m) ? m : m + ' ' + new Date().getFullYear()); if (isNaN(d)) return m; const opt = { day: 'numeric', month: 'long' }; if (/\d{4}/.test(m)) opt.year = 'numeric'; let s = d.toLocaleDateString('ar', opt); const t = /(\d{1,2}:\d{2})$/.exec(m); return t ? s + '، ' + t[1] : s; }]
  ];
  const code = /^(demo|showcase|rafiq_showcase|rafiq[A-Z])[\w-]*$/;
  const orig = new WeakMap(), changed = new Set();
  let busy = false;
  const isAr = () => (document.documentElement.lang || 'ar') !== 'en';
  const tr = s => { const t = s.trim().replace(/\s+/g, ' '); if (!t || !/[A-Za-z]/.test(t)) return s; if (exact[t]) return exact[t]; for (const [re, fn] of patterns) if (re.test(t)) return t.replace(re, fn); return s; };

  function apply() {
    if (busy) return; busy = true;
    try {
      if (isAr()) {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; const nodes = [];
        while ((n = w.nextNode())) nodes.push(n);
        for (const node of nodes) {
          const el = node.parentElement; if (!el || el.closest('script,style,textarea')) continue;
          const t = node.textContent.trim().replace(/\s+/g, ' ');
          if ((code.test(t) || /^المرجع:\s*(demo|showcase)[\w-]*$/.test(t)) && !el.children.length && !el.closest('a,button')) { el.classList.add('admin-code'); continue; }
          const next = tr(node.textContent);
          if (next !== node.textContent) { if (!orig.has(node)) orig.set(node, node.textContent); node.textContent = next; changed.add(node); }
        }
        document.querySelectorAll('[placeholder]').forEach(el => { const v = el.getAttribute('placeholder'); const next = tr(v); if (next !== v) { if (!el.hasAttribute('data-al-ph')) el.setAttribute('data-al-ph', v); el.setAttribute('placeholder', next); } });
      } else {
        changed.forEach(n => { if (n.isConnected && orig.has(n)) n.textContent = orig.get(n); }); changed.clear();
        document.querySelectorAll('[data-al-ph]').forEach(el => { el.setAttribute('placeholder', el.getAttribute('data-al-ph')); el.removeAttribute('data-al-ph'); });
        document.querySelectorAll('.admin-code').forEach(el => el.classList.remove('admin-code'));
      }
    } finally { setTimeout(() => { busy = false; }, 0); }
  }
  const style = document.createElement('style'); style.textContent = '.admin-code{display:none!important}'; document.head.append(style);
  let timer = 0; const later = ms => { clearTimeout(timer); timer = setTimeout(apply, ms); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => later(120)); else later(120);
  addEventListener('load', () => { later(150); setTimeout(apply, 900); });
  new MutationObserver(() => later(250)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const watch = () => document.body && new MutationObserver(m => { if (!busy && isAr() && m.some(r => r.addedNodes.length || r.type === 'characterData')) later(200); }).observe(document.body, { childList: true, subtree: true, characterData: true });
  if (document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
})();

/* Demo navigation content, not medical advice or a live model integration. */
(() => {
 'use strict';const p=(en,ar)=>({en,ar});
 const services={
  health:{href:'health.html?record=note',label:p('Write a health note','اكتبوا ملاحظة صحية')},
  play:{href:'activities.html',label:p('Explore existing activities','استكشفوا الأنشطة الموجودة')},
  concern:{href:'screening.html',label:p('Organize my observations','رتّبوا ملاحظاتكم')},
  growth:{href:'milestones.html',label:p('Open saved observations','افتحوا الملاحظات المحفوظة')},
  explore:{href:'support-areas.html',label:p('Explore support topics','استكشفوا مواضيع الدعم')}
 };
 function build(question){const q=String(question||'').toLowerCase();
  const key=/sleep|bedtime|nap|feed|food|eat|نوم|تغذي|رضاع|حليب|أكل|اكل/.test(q)?'health':/play|activit|لعب|نشاط/.test(q)?'play':/concern|worri|doctor|قلق|طبيب/.test(q)?'concern':/record|observ|milestone|سجل|ملاحظ|نمو/.test(q)?'growth':'explore';
  const detail={health:p('You can keep your own sleep or feeding observations in a health note, then bring selected questions to a specialist. No diet, treatment or medical assessment is generated.','بتقدروا تحفظوا ملاحظات النوم أو التغذية بملاحظة صحية، وبعدها تجهّزوا أسئلة مختارة للمختص. ما بنولّد حمية أو علاج أو تقييم طبي.'),play:p('Open the existing activity library. It uses the child’s recorded age and readiness. After playing, your response appears in activity history and growth observations.','افتحوا مكتبة الأنشطة الموجودة. بتستخدم عمر الطفل وجاهزيته المسجّلة. بعد اللعب، تفاعلكم بظهر بسجل الأنشطة وملاحظات النمو.'),concern:p('The observation tool helps you describe what happened and prepare questions. It does not produce a diagnosis. Contact a specialist directly whenever you choose.','أداة الملاحظات بتساعدكم توصفوا اللي صار وتجهّزوا أسئلة، بدون تشخيص. بتقدروا تختاروا التواصل مع مختص مباشرة.'),growth:p('Your saved observations belong to the selected child. You can add a note or prepare selected entries for a visit; nothing is shared automatically.','الملاحظات المحفوظة بتخص الطفل المختار. بتقدروا تضيفوا ملاحظة أو تجهّزوا سجلات مختارة للزيارة؛ ما في مشاركة تلقائية.'),explore:p('Choose a topic from the 11 support areas to see the tools and services available now. Browsing does not change your child’s profile or book a session.','اختاروا موضوع من مجالات الدعم الـ١١ لتشوفوا الأدوات والخدمات المتاحة حاليًا. التصفّح ما بغيّر ملف طفلكم وما بحجز جلسة.')};
  return {key,text:p('Demo response — no live AI is connected.\n\n'+detail[key].en,'رد تجريبي — ما في AI حي موصول.\n\n'+detail[key].ar)};
 }
 const greeting=p('This is Rafiq’s simulated assistant. Try a question to find an existing service, or organize what you want to discuss. No live AI or medical assessment is connected.','هذا مساعد رفيق المحاكى. جرّبوا سؤال لتلاقوا خدمة موجودة أو ترتّبوا اللي حابين تناقشوه. ما في AI حي أو تقييم طبي موصول.');
 window.RafiqParentAIDemo={services,build,greeting};
})();

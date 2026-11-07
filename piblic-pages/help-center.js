(() => {
  'use strict';
  const search = document.getElementById('helpSearch');

  const topics={"parent":[["account","Getting started","البداية","↗"],["children","Child profiles","ملفات الأطفال","♡"],["booking","Bookings & sessions","الحجوزات والجلسات","▦"],["reports","Reports & follow-up","التقارير والمتابعة","≡"],["payments","Subscription & payments","الاشتراك والمدفوعات","◇"],["privacy","Privacy & safety","الخصوصية والأمان","◎"]],"specialist":[["approval","Registration & approval","التسجيل والموافقة","✓"],["schedule","Availability & schedule","التوفر والجدول","▦"],["sessions","Sessions & reports","الجلسات والتقارير","≡"],["earnings","Earnings & payouts","الأرباح والمستحقات","◇"],["messages","Messages & follow-up","الرسائل والمتابعة","♡"],["specialist-account","Account","الحساب","◎"]]};
  const specialistAnswers=[[["When can parents book me?","متى يمكن للأهل الحجز معي؟","Your specialist profile must be approved before parents can book appointments with you.","يجب الموافقة على ملفك كمختص قبل أن يتمكن الأهل من حجز المواعيد معك."],["What does needs changes mean?","ماذا تعني بحاجة إلى تعديلات؟","Review the feedback, edit your professional information and resubmit your profile for review.","راجع الملاحظات وعدّل معلوماتك المهنية ثم أعد إرسال ملفك للمراجعة."]],[["How do I set my working hours?","كيف أحدد ساعات عملي؟","Open Availability, enable your working days, choose the hours and session duration, then save your availability.","افتح التوفر وفعّل أيام العمل وحدد الساعات ومدة الجلسة ثم احفظ إعدادات التوفر."],["Where can I see my schedule?","أين أجد جدول مواعيدي؟","Open Schedule to select a day and review booked appointments. Availability controls which times can be offered for future bookings.","افتح الجدول لاختيار يوم ومراجعة المواعيد المحجوزة. تحدد إعدادات التوفر الأوقات التي يمكن عرضها للحجوزات القادمة."]],[["When can I join an online session?","متى يمكنني الانضمام إلى جلسة عبر الإنترنت؟","The Jitsi room opens 15 minutes before the appointment. Open your booking and join when the meeting window is available.","تفتح غرفة جيتسي قبل الموعد بـ15 دقيقة. افتح الحجز وانضم عندما تكون نافذة الاجتماع متاحة."],["How do I finish a session and share its report?","كيف أنهي الجلسة وأشارك تقريرها؟","End the session yourself, then complete and send the report. Parents can see the report only after you send it; drafts stay private.","أنه الجلسة بنفسك ثم أكمل التقرير وأرسله. يرى الأهل التقرير بعد إرساله فقط، وتبقى المسودات خاصة."]],[["How are session earnings calculated?","كيف تُحسب أرباح الجلسات؟","Platform commission is deducted per paid session. Review Earnings for the recorded session amounts and completed consultation history.","تُخصم عمولة المنصة عن كل جلسة مدفوعة. راجع الأرباح للاطلاع على المبالغ المسجلة وسجل الاستشارات المكتملة."],["Are payouts connected in this preview?","هل تحويل المستحقات متصل في هذه النسخة؟","Payment and payout records are a local preview. Orange Money and live specialist payouts are not connected.","سجلات الدفع والمستحقات معاينة محلية. أورنج موني والتحويلات الفعلية للمختصين غير متصلة."]],[["How does ongoing follow-up work?","كيف تعمل المتابعة المستمرة؟","Parents can share growth notes and activity results. You can accept or decline their request, and parents can stop sharing anytime. A booking alone does not grant journal access.","يمكن للأهل مشاركة ملاحظات النمو ونتائج الأنشطة. يمكنك قبول الطلب أو رفضه، ويستطيع الأهل إيقاف المشاركة في أي وقت. الحجز وحده لا يمنح الوصول إلى السجل."],["Where do I reply to a family?","أين أرد على الأسرة؟","Open Messages, select the family conversation and send your reply. Shared notes do not promise continuous monitoring or an instant response.","افتح الرسائل واختر محادثة الأسرة وأرسل ردك. مشاركة الملاحظات لا تعني مراقبة مستمرة أو رداً فورياً."]],[["Where do I update my account preferences?","أين أعدل تفضيلات حسابي؟","Open Settings to manage contact information, language, notifications and security. Use your profile to review professional information.","افتح الإعدادات لإدارة معلومات الاتصال واللغة والإشعارات والأمان. استخدم ملفك لمراجعة المعلومات المهنية."],["What if I cannot sign in?","ماذا أفعل إذا تعذر تسجيل الدخول؟","Use Forgot password on the login page or contact support. Never share your password or verification codes.","استخدم نسيت كلمة المرور في صفحة الدخول أو تواصل مع الدعم. لا تشارك كلمة مرورك أو رموز التحقق."]]];
  const parentExtra=[["reports","When can I read a specialist report?","متى أستطيع قراءة تقرير المختص؟","Open the appointment to read the report after the specialist sends it. A draft is not visible to parents.","افتح الموعد لقراءة التقرير بعد أن يرسله المختص. لا تظهر المسودات للأهل."],["payments","Where do I manage my subscription and payments?","أين أدير اشتراكي ومدفوعاتي؟","Open My plan & payments from your account menu to review your plan and payment records.","افتح خطتي والمدفوعات من قائمة حسابك لمراجعة خطتك وسجلات الدفع."],["privacy","Who can see shared growth notes and activity results?","من يمكنه رؤية ملاحظات النمو ونتائج الأنشطة المشتركة؟","Ongoing sharing starts after a specialist accepts your request. You choose what to share and can stop sharing anytime. Never send passwords or verification codes.","تبدأ المشاركة المستمرة بعد قبول المختص لطلبك. تختار ما تشاركه ويمكنك إيقاف المشاركة في أي وقت. لا ترسل كلمات المرور أو رموز التحقق."]];
  const byId=id=>document.getElementById(id);
  const make=(tag,text)=>{const el=document.createElement(tag);if(text!=null)el.textContent=text;return el;};
  const params=new URLSearchParams(location.search),hint=params.get('from');
  const role=sessionStorage.getItem('rafiqRole');
  const signedIn=['parent','admin','specialist'].includes(role);
  let audience=signedIn?(role==='specialist'?'specialist':'parent'):(hint==='specialist'?'specialist':'parent');
  // The shared support API reads "from" as an identity fallback. Consume the
  // display hint now so it can never become a guest ticket's requester role.
  if(params.has('from')){params.delete('from');history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+location.hash);}
  const original=[...document.querySelectorAll('.help-group')];
  const parentGroups=original;
  const host=byId('helpAnswers');
  for(const topic of topics.parent){
    let group=parentGroups.find(g=>g.id===topic[0]);
    if(!group){group=make('section');group.className='help-group';group.id=topic[0];group.append(make('h2',topic[1]));host.insertBefore(group,byId('helpEmpty'));parentGroups.push(group);}
    group.querySelector('h2').textContent=topic[1];group.dataset.audience='parent';
  }
  // Keep all existing questions, moving the appointments/report question to Reports.
  const reportQuestion=byId('booking').querySelectorAll('details')[1];
  if(reportQuestion)byId('reports').append(reportQuestion);
  function addQuestion(group,title,answer){
    const detail=make('details');detail.className='help-question';
    detail.append(make('summary',title),make('p',answer));group.append(detail);
  }
  parentExtra.forEach(q=>addQuestion(byId(q[0]),q[1],q[3]));
  const specialistGroups=topics.specialist.map((topic,index)=>{
    const group=make('section');group.id=topic[0];group.className='help-group';group.dataset.audience='specialist';group.append(make('h2',topic[1]));
    specialistAnswers[index].forEach(q=>addQuestion(group,q[0],q[2]));host.insertBefore(group,byId('helpEmpty'));return group;
  });
  let selected=topics[audience][0][0];
  byId('helpAudienceSwitch').hidden=signedIn;byId('helpAccountLinks').hidden=signedIn;byId('helpBack').hidden=!signedIn;
  byId('helpBack').href=role==='specialist'?'../specialist-cycle/specialist-dashboard.html':'../pearent-cycel/parent-dashboard.html';
  function stored(key,fallback){try{return JSON.parse(localStorage.getItem(key))||fallback;}catch{return fallback;}}
  const id=role==='specialist'?(sessionStorage.getItem('rafiqSpecialistId')||sessionStorage.getItem('rafiqSpecialistRegistrationUserId')):sessionStorage.getItem(role==='admin'?'rafiqAdminId':'rafiqParentUserId');
  const account=stored('rafiqUsers',[]).find(u=>u.id===id&&u.role===role);
  const profile=account||(signedIn?stored(role==='specialist'?'rafiqSpecialistProfile':role==='parent'?'rafiqParentProfile':'rafiqAdminProfile',{}):{});
  const name=profile.fullName||profile.name||'',email=profile.email||'';
  if(signedIn&&name){const line=byId('helpSignedIn');line.hidden=false;const label=make('span','Signed in as'),value=make('span',name);value.dataset.userContent='';line.append(label,document.createTextNode(' '),value);}
  const form=byId('supportCreate');
  function prefill(){if(signedIn){form.elements.name.value=name;form.elements.email.value=email;}}
  prefill();form.addEventListener('reset',()=>queueMicrotask(prefill));
  byId('helpRequester').textContent=signedIn?'Sending as '+role:"You're sending this as a guest. Use an email we can reach you on.";
  byId('helpWhatsApp').hidden=signedIn;
  const dialog=byId('helpSupportDialog');
  function openSupport(){if(!dialog.open){dialog.showModal();document.documentElement.classList.add('help-modal-open');}}
  byId('helpContact').addEventListener('click',openSupport);
  byId('helpSupportClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.documentElement.classList.remove('help-modal-open');byId('helpContact').focus();});
  function choose(id,question){selected=id;search.value='';filter();if(question){question.open=true;question.querySelector('summary').focus();}}
  function renderAudience(){
    document.body.dataset.audience=audience;
    byId('helpAudiencePill').textContent=audience==='specialist'?'Specialist Help Center':'Parent Help Center';
    document.querySelectorAll('button[data-audience]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.audience===audience)));
    byId('helpTopics').replaceChildren();byId('helpPopular').replaceChildren();
    topics[audience].forEach(topic=>{
      const button=make('button');button.type='button';button.dataset.topic=topic[0];
      const icon=make('span',topic[3]);icon.className='topic-icon';icon.setAttribute('aria-hidden','true');
      button.append(icon,make('strong',topic[1]),make('small',byId(topic[0]).querySelectorAll('details').length+' questions'));
      button.addEventListener('click',()=>choose(topic[0]));byId('helpTopics').append(button);
    });
    const popular=topics[audience].slice(0,4).map(topic=>byId(topic[0]).querySelector('details'));
    popular.forEach((question,index)=>{const button=make('button',topics[audience][index][1]);button.title=question.querySelector('summary').textContent;button.type='button';button.addEventListener('click',()=>choose(question.parentElement.id,question));byId('helpPopular').append(button);});
    filter();
  }
  document.querySelectorAll('button[data-audience]').forEach(button=>button.addEventListener('click',()=>{if(signedIn)return;audience=button.dataset.audience;selected=topics[audience][0][0];search.value='';renderAudience();}));

  const groups = [...document.querySelectorAll('.help-group')];
  const normalize = value => value.toLowerCase().normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');

  function clearHighlights(){document.querySelectorAll('.help-question mark').forEach(mark=>mark.replaceWith(document.createTextNode(mark.textContent)));}
  function highlight(question,term){
    const needle=normalize(term);if(!needle)return;
    const walker=document.createTreeWalker(question,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      const text=node.data;let folded='',offsets=[],position=0;
      for(const char of text){const part=normalize(char);for(let i=0;i<part.length;i++)offsets.push([position,position+char.length]);folded+=part;position+=char.length;}
      let from=0,last=0,at;const fragment=document.createDocumentFragment();
      while((at=folded.indexOf(needle,from))!==-1){
        const start=offsets[at][0],end=offsets[at+needle.length-1][1];
        fragment.append(document.createTextNode(text.slice(last,start)),make('mark',text.slice(start,end)));last=end;from=at+needle.length;
      }
      if(last){fragment.append(document.createTextNode(text.slice(last)));node.replaceWith(fragment);}
    }
  }
  function filter() {
    clearHighlights();
    const raw=search.value.trim(),term=normalize(raw);let count=0;
    groups.forEach(group=>{
      let matches=0;
      group.querySelectorAll('.help-question').forEach(question=>{
        const match=group.dataset.audience===audience&&(!term?group.id===selected:normalize(question.textContent+' '+group.querySelector('h2').textContent).includes(term));
        question.hidden=!match;
        if(match){matches++;count++;if(term)highlight(question,raw);}
      });
      group.hidden=!matches;
    });
    document.querySelectorAll('[data-topic]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.topic===selected&&!term)));
    byId('helpEmpty').hidden=count>0;
    byId('helpResults').textContent=term?count+' matching answers':'';
  }
  search.addEventListener('input',filter);
  renderAudience();
})();
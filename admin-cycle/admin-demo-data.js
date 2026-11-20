/* Admin preview: the admin pages read the browser's own storage, while the parent and
   specialist demo lives inside the preview shell. So when an administrator opens the admin
   area, the same demo story is added here (Saja's family, the three demo doctors, their
   bookings, reports and payments) plus one doctor waiting for approval — so every admin page
   tells the same story the evaluator saw on the parent and specialist side.
   Only rows marked isDemo are replaced; anything else in storage is left untouched.
   Refreshed once a day so "today" stays today. Fictional data only. */
(() => {
  'use strict';
  try {
    if (sessionStorage.getItem('rafiqRole') !== 'admin' || typeof window.RafiqParentPreviewFixtures !== 'function') return;
    const now = new Date(), stamp = 'v3-' + now.toDateString();
    if (localStorage.getItem('rafiqAdminDemoVersion') === stamp) return;
    const lang = localStorage.getItem('rafiqLanguage') === 'en' ? 'en' : 'ar', name = (en, ar) => (lang === 'ar' ? ar : en);
    const { values } = window.RafiqParentPreviewFixtures('mother', now, lang);
    const ago = d => new Date(now.getTime() - d * 864e5).toISOString();

    // Doctors as user accounts, and the family's mother
    const doctors = values.rafiqSpecialists || [];
    const logins = { showcase_speech_specialist: 'rami.speech@rafiq.test', showcase_development_specialist: 'lina.development@rafiq.test', showcase_psychology_specialist: 'omar.family@rafiq.test' };
    doctors.forEach((s, i) => { s.email = logins[s.id] || s.email; s.phone = s.phone || '07' + (90000000 + i * 1234567); s.createdAt = s.createdAt || ago(60 - i * 7); s.licenseNumber = s.licenseNumber || 'JO-' + (4410 + i); s.qualification = s.qualification || name('MSc', 'ماجستير'); s.isDemo = true; });
    values.rafiqUsers = [
      ...(values.rafiqUsers || []).map(u => ({ ...u, email: u.role === 'parent' ? 'saja.family@rafiq.test' : u.email, phone: '0791234567', createdAt: ago(40), familyId: 'family_demo-mother-parent' })),
      ...doctors.map(s => ({ id: s.registrationUserId || 'user_' + s.id, role: 'specialist', fullName: s.fullName, email: s.email, phone: s.phone, status: 'active', specialistId: s.id, createdAt: s.createdAt, isDemo: true }))
    ];
    // A fourth doctor who has applied and is waiting for the admin's decision
    const applicant = {
      id: 'demo_pending_occupational', registrationUserId: 'demo_pending_occupational_user', fullName: name('Hala Mansour — Occupational therapist', 'هالة منصور — أخصائية علاج وظيفي'),
      email: 'hala.ot@rafiq.test', notificationEmail: 'hala.ot@rafiq.test', phone: '0795551234', specialtyKey: 'occupational', specialty: name('Occupational therapy', 'العلاج الوظيفي'),
      qualification: name('MSc Occupational Therapy, University of Jordan', 'ماجستير علاج وظيفي، الجامعة الأردنية'), experience: 6, licenseNumber: 'JO-OT-2291',
      bio: name('Helps children with sensory differences, fine motor skills and daily routines.', 'تساعد الأطفال في الاختلافات الحسّية والمهارات الحركية الدقيقة والروتين اليومي.'),
      consultationTypes: ['online', 'in-person'], languages: ['arabic', 'english'], price: 25, currency: 'JOD', credentialFileName: 'hala-mansour-license.pdf',
      status: 'pending', verificationStatus: 'pending', createdAt: ago(1), submittedAt: ago(1), isDemo: true
    };
    values.rafiqSpecialists = [...doctors, applicant];
    values.rafiqUsers.push({ id: applicant.registrationUserId, role: 'specialist', fullName: applicant.fullName, email: applicant.email, phone: applicant.phone, status: 'active', specialistId: applicant.id, createdAt: applicant.createdAt, isDemo: true });

    const isDemo = r => r && (r.isDemo || /^(demo|showcase|rafiq_showcase)/.test(String(r.id || '')));
    const read = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
    for (const key of ['rafiqUsers', 'rafiqSpecialists', 'rafiqBookings', 'rafiqSpecialistReports', 'rafiqChildren', 'rafiqFamilies', 'rafiqConsultations']) {
      const fresh = values[key]; if (!Array.isArray(fresh)) continue;
      const old = read(key); const keep = Array.isArray(old) ? old.filter(r => !isDemo(r) && !fresh.some(f => f.id === r.id)) : [];
      localStorage.setItem(key, JSON.stringify([...keep, ...fresh]));
    }
    const mem = read('rafiqFamilyMemberships'); localStorage.setItem('rafiqFamilyMemberships', JSON.stringify({ ...(mem && typeof mem === 'object' && !Array.isArray(mem) ? mem : {}), ...(values.rafiqFamilyMemberships || {}) }));
    // Family Plus subscription payment so Finance shows a subscription too
    const subs = (read('rafiqSubscriptions') || []).filter(r => !isDemo(r));
    subs.push({ id: 'demo-sub-saja', parentId: 'demo-mother-parent', familyId: 'family_demo-mother-parent', parentName: name('Saja', 'سجى'), plan: 'plus', amount: 4.99, currency: 'JOD', status: 'active', paymentStatus: 'paid', startDate: ago(5).slice(0, 10), createdAt: ago(5), paidAt: ago(5), isDemo: true });
    localStorage.setItem('rafiqSubscriptions', JSON.stringify(subs));
    // Support inbox: three requests from the same story (replaces the generic English samples)
    const h = n => new Date(now.getTime() - n * 36e5).toISOString();
    const sample = ['req-8841-a1b2', 'req-7729-c3d4', 'req-6610-e5f6'];
    const tickets = (read('rafiqSupportTickets') || []).filter(t => t && !sample.includes(t.id) && !isDemo(t));
    tickets.push(
      { id: 'demo-ticket-saja-booking', ownerId: 'parent:demo-mother-parent', name: name('Saja', 'سجى'), email: 'saja.family@rafiq.test', requesterRole: 'parent', category: 'booking', subject: name('Moving Noor’s visit with Dr. Lina', 'تغيير موعد نور مع د. لينا'), status: 'new', createdAt: h(1), updatedAt: h(1), isDemo: true,
        messages: [{ id: 'dm1', authorRole: 'parent', body: name('Hello, can I move Noor’s follow-up with Dr. Lina to tomorrow morning? Thank you.', 'مرحبا، بقدر أنقل موعد متابعة نور مع د. لينا لبكرة الصبح؟ شكرًا.'), createdAt: h(1) }] },
      { id: 'demo-ticket-rami-hours', ownerId: 'specialist:showcase_speech_specialist', name: name('Rami Haddad', 'رامي حداد'), email: 'rami.speech@rafiq.test', requesterRole: 'specialist', category: 'account', subject: name('Adding Saturday evening slots', 'إضافة أوقات مسائية يوم السبت'), status: 'in_progress', createdAt: h(6), updatedAt: h(3), isDemo: true,
        messages: [{ id: 'dm2', authorRole: 'specialist', body: name('I would like to open Saturday 4–7 pm for online sessions.', 'أرغب بفتح يوم السبت من ٤ إلى ٧ مساءً للجلسات عن بُعد.'), createdAt: h(6) }, { id: 'dm3', authorRole: 'admin', body: name('You can add them from My practice → Availability. We will check they appear for families.', 'يمكنك إضافتها من عيادتي ← التوافر، وسنتأكد من ظهورها للعائلات.'), createdAt: h(3) }] },
      { id: 'demo-ticket-saja-vaccines', ownerId: 'parent:demo-mother-parent', name: name('Saja', 'سجى'), email: 'saja.family@rafiq.test', requesterRole: 'parent', category: 'profile', subject: name('Where is the vaccination schedule?', 'وين بلاقي جدول المطاعيم؟'), status: 'resolved', createdAt: h(30), updatedAt: h(20), isDemo: true,
        messages: [{ id: 'dm4', authorRole: 'parent', body: name('Where can I record Noor’s vaccines?', 'وين بقدر أسجّل مطاعيم نور؟'), createdAt: h(30) }, { id: 'dm5', authorRole: 'admin', body: name('From My child → Health and vaccines. The Jordan national schedule is there and you can edit each dose.', 'من «طفلي» ← الصحة والمطاعيم. جدول المطاعيم الوطني الأردني موجود هناك وتقدرين تعدّلي كل جرعة.'), createdAt: h(20) }] }
    );
    localStorage.setItem('rafiqSupportTickets', JSON.stringify(tickets));
    localStorage.setItem('rafiqAdminDemoVersion', stamp);
  } catch (e) { /* the admin pages still open with whatever data exists */ }
})();

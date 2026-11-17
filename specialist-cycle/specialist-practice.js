/* Specialist practice layer (local preview only — no server, no real payments or emails).
   - Sample practice data: fictional families, clearly tagged and removable.
   - Booking request decisions (accept / decline) for status "requested".
   - Sidebar count badges and the dashboard "Incoming requests" inbox.
   Load synchronously after specialist-sidebar.js so sample data exists before page scripts read it. */
(() => {
  'use strict';
  const TAG = 'rafiq-specialist-practice-v1';
  const access = window.RafiqSpecialistAccess;
  const profile = access?.profile;
  if (!access?.approved || !profile?.id) return;
  const sid = profile.id;

  const read = (key, fallback = []) => { try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const shift = days => { const d = new Date(); d.setDate(d.getDate() + days); return d; };
  const iso = (days, hours = 0) => new Date(Date.now() + days * 864e5 + hours * 36e5).toISOString();
  const isRequest = b => ['requested', 'pending'].includes(b?.status);
  const mine = b => b?.specialistId === sid;
  const price = Number(profile.price) || 25;
  const payment = (status, payout) => { const commission = Math.round(price * 0.1 * 100) / 100; return { status, amount: price, currency: profile.currency || 'JOD', commissionRate: 10, commission, specialistNet: Math.round((price - commission) * 100) / 100, payoutStatus: payout, isDemo: true }; };

  /* ---------- Sample data ---------- */
  function sampleFixtures() {
    const id = k => 'spx_' + sid + '_' + k, parent = k => id('parent_' + k), child = k => id('child_' + k);
    const tag = r => ({ ...r, isDemo: true, demoSet: TAG });
    const dob = months => ymd(new Date(new Date().getFullYear(), new Date().getMonth() - months, 1));
    const fams = [
      ['karim', 'كريم', 50, 'male', 'رنا يوسف'],
      ['jood', 'جود', 34, 'female', 'سامي داود'],
      ['tala', 'تالا', 22, 'female', 'دانة خليل'],
      ['zain', 'زين', 66, 'male', 'ليلى نصّار'],
      ['reem', 'ريم', 41, 'female', 'هاني عوض'],
      ['omar', 'عمر', 58, 'male', 'سلام حدّاد']
    ];
    const children = fams.map(([k, name, months, gender, pname]) => tag({ id: child(k), parentId: parent(k), familyId: 'family_' + parent(k), createdBy: parent(k), name, dateOfBirth: dob(months), gender, relationship: 'mother', parentName: pname, createdAt: iso(-30) }));
    const famOf = k => fams.find(f => f[0] === k);
    const now = new Date(), slot = pad(now.getHours()) + ':' + (now.getMinutes() < 30 ? '00' : '30');
    const later = now.getHours() < 16 ? '16:30' : pad(Math.min(now.getHours() + 1, 23)) + ':30';
    const bk = (k, key, days, time, type, status, reason, extra = {}) => tag({
      id: id('booking_' + key), parentId: parent(k), createdBy: parent(k), parentName: famOf(k)[4], childId: child(k), childName: famOf(k)[1],
      specialistId: sid, specialistName: profile.fullName, specialty: profile.specialty, date: ymd(shift(days)), time, durationMinutes: 30,
      consultationType: type, price, currency: profile.currency || 'JOD', status, reason, createdAt: iso(Math.min(days, 0) - 1), ...extra
    });
    const bookings = [
      bk('karim', 'req1', 2, '11:00', 'online', 'requested', 'Uses few two-word phrases at 4 years; family wants guidance on speech practice at home.', { requestedAt: iso(0, -3), sessionPayment: payment('pending', 'not_due') }),
      bk('jood', 'req2', 4, '13:30', 'clinic', 'requested', 'Difficulty settling at nursery and frequent meltdowns at transitions.', { requestedAt: iso(0, -20), sessionPayment: payment('pending', 'not_due') }),
      bk('tala', 'today1', 0, slot, 'online', 'confirmed', 'Follow-up on feeding routine and sleep after a recent move.', { sessionPayment: payment('paid', 'held') }),
      bk('zain', 'today2', 0, later, 'clinic', 'confirmed', 'Pencil grip and fine-motor readiness before starting school.', { sessionPayment: payment('paid', 'held') }),
      bk('reem', 'up1', 1, '09:30', 'online', 'confirmed', 'Parent concerned about limited eye contact during play.', { sessionPayment: payment('paid', 'held') }),
      bk('omar', 'up2', 6, '12:00', 'clinic', 'confirmed', 'Review of attention span at home and in kindergarten.', { sessionPayment: payment('paid', 'held') }),
      bk('karim', 'done1', -3, '10:00', 'online', 'completed', 'Initial consultation about speech and play routines.', { completedAt: iso(-3), sessionPayment: payment('paid', 'pending') }),
      bk('zain', 'done2', -10, '15:00', 'clinic', 'completed', 'Handwriting readiness assessment.', { completedAt: iso(-10), sessionPayment: payment('paid', 'transferred') }),
      bk('reem', 'cancel1', -2, '14:00', 'online', 'cancelled', 'Parent rescheduled due to travel.', { cancelledAt: iso(-4), cancelledBy: 'parent', sessionPayment: payment('refunded', 'not_due') })
    ];
    const report = tag({
      id: id('report_done2'), bookingId: id('booking_done2'), childId: child('zain'), childName: 'زين', parentId: parent('zain'), specialistId: sid,
      specialistName: profile.fullName, specialty: profile.specialty, consultationType: 'clinic', consultationDate: ymd(shift(-10)), reportDate: ymd(shift(-9)),
      createdAt: iso(-9), status: 'submitted', submittedAt: iso(-9),
      summary: 'Sample report: fine-motor play ideas discussed with the family. Not a clinical assessment of a real child.',
      observations: ['Enjoys building blocks and drawing with thick crayons.', 'Tires quickly during tracing tasks.'],
      recommendations: ['Five minutes of play-dough or tearing paper before drawing time.', 'Use short, thick crayons to encourage a tripod grip.'],
      followUp: 'Review progress in four weeks.'
    });
    const msg = (k, sender, text, hours, extra = {}) => tag({ id: id('msg_' + k + '_' + hours), senderRole: sender, senderId: sender === 'parent' ? parent(k) : sid, senderName: sender === 'parent' ? famOf(k)[4] : profile.fullName, text, createdAt: iso(0, hours), ...extra });
    const thread = (k, messages, updated) => tag({ id: id('thread_' + k), parentId: parent(k), parentName: famOf(k)[4], childId: child(k), childName: famOf(k)[1], specialistId: sid, specialistName: profile.fullName, messages, readAt: {}, readCounts: { ['specialist:' + sid]: 0 }, updatedAt: updated });
    const threads = [
      thread('karim', [msg('karim', 'parent', 'Thank you for the session. Can we practise the naming game every day, or is that too much?', -30), msg('karim', 'specialist', 'Daily is great if it stays fun — five minutes is enough.', -28), msg('karim', 'parent', 'He said "big car" today! Should we add new words?', -2)], iso(0, -2)),
      thread('tala', [msg('tala', 'parent', 'We will join the online session from the laptop. Do we need anything ready?', -5)], iso(0, -5)),
      thread('omar', [msg('omar', 'parent', 'Would you be able to follow Omar between sessions? We would like to share his home observations.', -9, { introRequestId: id('request_omar'), introRequestAt: iso(0, -9) })], iso(0, -9))
    ];
    threads[0].readCounts['specialist:' + sid] = 2;
    const care = [
      tag({ threadId: id('thread_omar'), parentId: parent('omar'), childId: child('omar'), specialistId: sid, status: 'pending', requestId: id('request_omar'), scopes: ['observations', 'activities'], includeEarlierRecords: true, allowActivityGuidance: false, requestedAt: iso(0, -9), updatedAt: iso(0, -9), sharingSince: iso(0, -9), scopeSince: { observations: iso(0, -9), activities: iso(0, -9) } }),
      tag({ threadId: id('thread_karim'), parentId: parent('karim'), childId: child('karim'), specialistId: sid, status: 'active', requestId: id('request_karim'), scopes: ['observations', 'activities'], includeEarlierRecords: true, allowActivityGuidance: false, requestedAt: iso(-3), acceptedAt: iso(-3), respondedAt: iso(-3), updatedAt: iso(-3), sharingSince: iso(-3), scopeSince: { observations: iso(-3), activities: iso(-3) } })
    ];
    const notes = { ['rafiqAgeObservations_' + child('karim')]: [
      tag({ id: id('note_karim_1'), childId: child('karim'), type: 'observation', text: 'Said "big car" while playing — first new two-word phrase this week.', createdBy: parent('karim'), createdByName: 'رنا يوسف', createdAt: iso(0, -3) }),
      tag({ id: id('note_karim_2'), childId: child('karim'), type: 'daily-moment', activityTitle: 'Naming game with picture cards', text: 'Played for five minutes before bedtime.', note: 'Asked to repeat the game.', outcome: 'enjoyed', day: ymd(shift(-1)), createdBy: parent('karim'), createdByName: 'رنا يوسف', createdAt: iso(-1) })
    ] };
    return { rafiqChildren: children, rafiqBookings: bookings, rafiqSpecialistReports: [report], rafiqDirectConversations: threads, rafiqCareConnections: care, ...notes };
  }
  const sameRow = (a, b) => (b.id ? a.id === b.id : a.threadId === b.threadId);
  function hasSample() { return read('rafiqBookings').some(b => b.demoSet === TAG && mine(b)); }
  function seed() {
    for (const [key, rows] of Object.entries(sampleFixtures())) {
      const old = read(key); if (!Array.isArray(old)) continue;
      write(key, [...old.filter(o => !rows.some(r => sameRow(o, r))), ...rows]);
    }
    localStorage.setItem('rafiqSpecialistPracticeSeeded_' + sid, new Date().toISOString());
  }
  function clearSample() {
    const prefix = 'spx_' + sid + '_';
    for (const key of ['rafiqChildren', 'rafiqBookings', 'rafiqSpecialistReports', 'rafiqDirectConversations', 'rafiqCareConnections']) {
      const rows = read(key); if (Array.isArray(rows)) write(key, rows.filter(r => !(r?.demoSet === TAG && String(r.id || r.threadId || '').startsWith(prefix))));
    }
    for (let i = localStorage.length - 1; i >= 0; i--) { const k = localStorage.key(i); if (k?.startsWith('rafiqAgeObservations_' + prefix)) localStorage.removeItem(k); }
    localStorage.setItem('rafiqSpecialistPracticeSeeded_' + sid, 'cleared');
  }

  /* Older demo bookings miss settlement fields that the finance panel expects. Fill gaps only. */
  function normalizePayments() {
    const all = read('rafiqBookings'); if (!Array.isArray(all)) return; let changed = false;
    for (const b of all) {
      if (!mine(b) || !b.sessionPayment || typeof b.sessionPayment !== 'object') continue;
      const p = b.sessionPayment, amount = Number(p.amount ?? b.price) || 0;
      const fill = { status: 'paid', amount, commissionRate: 10, commission: Math.round(amount * 10) / 100, specialistNet: Math.round(amount * 90) / 100, payoutStatus: b.status === 'completed' ? 'pending' : 'held' };
      for (const [k, v] of Object.entries(fill)) if (p[k] == null) { p[k] = v; changed = true; }
    }
    if (changed) write('rafiqBookings', all);
  }

  /* ---------- Booking request decisions ---------- */
  function respond(bookingId, decision, reason = '') {
    // Phase 5: one shared lifecycle (statuses, payment-after-acceptance, parent notifications).
    if (window.RafiqAppointments && ['accept', 'decline'].includes(decision)) return window.RafiqAppointments.act(bookingId, decision === 'accept' ? 'accept' : 'reject', { actor: 'specialist', specialistId: sid, reason });
    const all = read('rafiqBookings'), b = all.find(x => x.id === bookingId && mine(x));
    if (!b) throw Error('Booking not found.');
    if (!isRequest(b)) throw Error('This request was already answered.');
    const now = new Date().toISOString();
    if (decision === 'accept') {
      b.status = 'confirmed'; b.acceptedAt = now;
      if (b.sessionPayment) { b.sessionPayment.status = 'paid'; b.sessionPayment.payoutStatus = 'held'; }
    } else if (decision === 'decline') {
      b.status = 'cancelled'; b.cancelledAt = now; b.cancelledBy = 'specialist'; b.declinedAt = now; b.declineReason = String(reason || '').trim().slice(0, 500);
      if (b.sessionPayment) { b.sessionPayment.status = 'not_charged'; b.sessionPayment.payoutStatus = 'not_due'; }
    } else throw Error('Unknown decision.');
    b.updatedAt = now; write('rafiqBookings', all);
    return b;
  }

  /* ---------- Counts ---------- */
  function viewer() { try { return window.RafiqDirectMessages?.identity('specialist'); } catch { return null; } }
  function counts() {
    const bookings = read('rafiqBookings').filter(mine);
    const v = viewer(), threads = v ? window.RafiqDirectMessages.list(v) : [];
    const care = read('rafiqCareConnections').filter(c => c.specialistId === sid);
    const reports = read('rafiqSpecialistReports').filter(r => r.specialistId === sid);
    return {
      requests: bookings.filter(isRequest).length,
      followUps: care.filter(c => c.status === 'pending' && threads.some(t => t.id === c.threadId)).length,
      unread: v ? threads.reduce((n, t) => n + window.RafiqDirectMessages.unread(t, v), 0) : 0,
      reportsDue: bookings.filter(b => b.status === 'completed' && !reports.some(r => r.bookingId === b.id && r.status !== 'draft')).length
    };
  }

  function badges() {
    const c = counts();
    const map = { 'specialist-bookings.html': [c.requests, 'New booking requests'], 'follow-up.html': [c.followUps, 'Follow-up requests'], 'messages.html': [c.unread, 'Unread messages'], 'clients.html': [c.reportsDue, 'Reports due'] };
    for (const [href, [n, label]] of Object.entries(map)) {
      document.querySelectorAll('#sidebar a.nav-link[href="' + href + '"]').forEach(a => {
        let badge = a.querySelector('.nav-badge');
        if (!n) { badge?.remove(); return; }
        if (!badge) { badge = document.createElement('span'); badge.className = 'nav-badge'; badge.setAttribute('data-no-translate', ''); a.append(badge); }
        badge.textContent = n > 9 ? '9+' : String(n); badge.title = label; badge.setAttribute('aria-label', n + ' · ' + label);
      });
    }
  }

  /* ---------- Shared decline dialog ---------- */
  function askDecline(childName) {
    return new Promise(resolve => {
      const dialog = document.createElement('dialog'); dialog.className = 'practice-dialog';
      dialog.innerHTML = '<form method="dialog"><h2>Decline this booking request?</h2><p class="practice-dialog-child" data-user-content></p><label for="practiceDeclineReason">Message to the family (optional)</label><textarea id="practiceDeclineReason" rows="3" maxlength="500" placeholder="For example: this concern is outside my specialty — a speech therapist may help sooner."></textarea><p class="practice-sim">Simulated: the family is not emailed. No payment is taken for declined requests.</p><div class="practice-dialog-actions"><button type="submit" value="cancel" class="practice-btn ghost">Keep request</button><button type="submit" value="decline" class="practice-btn danger">Decline request</button></div></form>';
      dialog.querySelector('.practice-dialog-child').textContent = childName || '';
      document.body.append(dialog);
      dialog.addEventListener('close', () => { const ok = dialog.returnValue === 'decline'; const reason = dialog.querySelector('textarea').value; dialog.remove(); resolve(ok ? { reason } : null); });
      dialog.showModal(); dialog.querySelector('textarea').focus();
    });
  }

  function toast(text, tone = 'ok') {
    let node = document.getElementById('practiceToast');
    if (!node) { node = document.createElement('div'); node.id = 'practiceToast'; node.className = 'practice-toast'; node.setAttribute('role', 'status'); document.body.append(node); }
    toast.last = text; node.dataset.tone = tone; node.textContent = text; node.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => node.classList.remove('show'), 3600);
  }

  /* ---------- Dashboard inbox ---------- */
  const esc = v => { const d = document.createElement('div'); d.textContent = String(v ?? ''); return d.innerHTML; };
  const typeLabel = t => (t === 'online' ? 'Online' : 'In-person');
  function ageLabel(childId) {
    const c = read('rafiqChildren').find(x => x.id === childId), dob = c?.dateOfBirth || c?.dob; if (!dob) return '';
    const b = new Date(dob + 'T12:00:00'), n = new Date(); let m = (n.getFullYear() - b.getFullYear()) * 12 + n.getMonth() - b.getMonth(); if (n.getDate() < b.getDate()) m--;
    if (m < 0) return ''; if (m < 24) return m + (m === 1 ? ' month' : ' months'); const y = Math.floor(m / 12); return y + ' years';
  }
  function relative(isoDate) {
    const mins = Math.round((Date.now() - new Date(isoDate).getTime()) / 6e4); if (!Number.isFinite(mins)) return '';
    if (mins < 60) return Math.max(mins, 1) + ' min ago'; const h = Math.round(mins / 60); if (h < 24) return h + ' h ago'; return Math.round(h / 24) + ' d ago';
  }
  function renderInbox(message) {
    const mount = document.getElementById('practiceInbox'); if (!mount) return;
    const bookings = read('rafiqBookings').filter(b => mine(b) && isRequest(b)).sort((a, b) => String(a.date + a.time).localeCompare(b.date + b.time));
    const v = viewer(), threads = v ? window.RafiqDirectMessages.list(v) : [];
    const follow = read('rafiqCareConnections').filter(c => c.specialistId === sid && c.status === 'pending').map(c => ({ c, t: threads.find(t => t.id === c.threadId) })).filter(x => x.t);
    const list = mount.querySelector('.practice-inbox-list'), empty = mount.querySelector('.practice-inbox-empty'), count = mount.querySelector('.practice-inbox-count');
    const total = bookings.length + follow.length;
    count.textContent = String(total); count.hidden = !total;
    list.replaceChildren(); empty.hidden = total > 0;
    for (const b of bookings) {
      const card = document.createElement('article'); card.className = 'practice-request';
      card.innerHTML = '<div class="practice-request-avatar" aria-hidden="true" data-user-content>' + esc((b.childName || 'C').charAt(0)) + '</div>' +
        '<div class="practice-request-body"><div class="practice-request-top"><span class="practice-chip booking">Booking request</span><small>' + esc(relative(b.requestedAt || b.createdAt)) + '</small></div>' +
        '<h3><span data-user-content>' + esc(b.childName || 'Child') + '</span>' + (ageLabel(b.childId) ? ' <small class="practice-dot">' + esc(ageLabel(b.childId)) + '</small>' : '') + '</h3>' +
        '<p class="practice-request-reason" data-user-content>' + esc(b.reason || 'No consultation reason provided') + '</p>' +
        '<p class="practice-request-meta"><span>' + esc(b.date) + '</span><span>' + esc(b.time) + '</span><span>' + typeLabel(b.consultationType) + '</span><span>' + esc(b.price) + ' JOD</span></p></div>' +
        '<div class="practice-request-actions"><button type="button" class="practice-btn primary" data-act="accept">Accept</button><button type="button" class="practice-btn ghost" data-act="decline">Decline</button><a class="practice-link" href="booking-details.html">Details</a></div>';
      card.querySelector('[data-act="accept"]').onclick = () => { try { respond(b.id, 'accept'); toast('Request accepted. The appointment is now confirmed.'); refresh(); } catch (e) { toast(e.message, 'error'); renderInbox(); } };
      card.querySelector('[data-act="decline"]').onclick = async () => { const answer = await askDecline(b.childName); if (!answer) return; try { respond(b.id, 'decline', answer.reason); toast('Request declined. The family will see your response.'); refresh(); } catch (e) { toast(e.message, 'error'); } };
      card.querySelector('.practice-link').onclick = () => sessionStorage.setItem('rafiqSelectedSpecialistBooking', b.id);
      list.append(card);
    }
    for (const { c, t } of follow) {
      const card = document.createElement('article'); card.className = 'practice-request';
      const intro = (t.messages || []).find(m => m.senderRole === 'parent');
      card.innerHTML = '<div class="practice-request-avatar lav" aria-hidden="true" data-user-content>' + esc((t.childName || 'C').charAt(0)) + '</div>' +
        '<div class="practice-request-body"><div class="practice-request-top"><span class="practice-chip follow">Follow-up request</span><small>' + esc(relative(c.requestedAt)) + '</small></div>' +
        '<h3><span data-user-content>' + esc(t.childName) + '</span> <small class="practice-dot" data-user-content>' + esc(t.parentName) + '</small></h3>' +
        (intro ? '<p class="practice-request-reason" data-user-content>' + esc(intro.text) + '</p>' : '') +
        '<p class="practice-request-meta"><span>Family will share</span>' + (c.scopes || []).map(s => '<span>' + (s === 'activities' ? 'Activity results' : 'Observations') + '</span>').join('') + '</p></div>' +
        '<div class="practice-request-actions"><button type="button" class="practice-btn primary" data-act="accept">Accept</button><button type="button" class="practice-btn ghost" data-act="decline">Decline</button><a class="practice-link" href="follow-up.html">Details</a></div>';
      const act = op => { try { window.RafiqCareConnections.change(v, t.id, op); toast(op === 'accept' ? 'Follow-up accepted. Find this child under Children I follow.' : 'Follow-up declined. The parent can see the response in their conversation.'); refresh(); } catch (e) { toast(e.message, 'error'); } };
      card.querySelector('[data-act="accept"]').onclick = () => act('accept');
      card.querySelector('[data-act="decline"]').onclick = () => act('decline');
      list.append(card);
    }
    if (message) toast(message);
  }
  function refresh() { renderInbox(); badges(); window.dispatchEvent(new CustomEvent('rafiq:practice-changed')); if (document.body.classList.contains('specialist-dashboard-page')) { if (toast.last) sessionStorage.setItem('rafiqPracticeFlash', toast.last); setTimeout(() => location.reload(), 700); } }

  function sampleControls() {
    const box = document.getElementById('practiceSample'); if (!box) return;
    const on = hasSample();
    box.querySelector('.practice-sample-text').textContent = on ? 'Sample practice data is loaded. Families, requests and messages marked as samples are fictional.' : 'Explore the workspace with fictional families, requests and messages. Nothing is sent to real people.';
    const btn = box.querySelector('button');
    btn.textContent = on ? 'Remove sample data' : 'Load sample practice data';
    btn.onclick = () => { if (on) clearSample(); else seed(); location.reload(); };
  }

  /* ---------- Page structure helpers ---------- */
  const page = location.pathname.split('/').pop();
  const startOf = b => { const m = String(b.time || '').match(/^(\d{1,2}):(\d{2})/); return new Date((b.date || '') + 'T' + (m ? pad(m[1]) + ':' + m[2] : '00:00') + ':00').getTime() || 0; };
  const fmtDate = b => { const t = startOf(b); if (!t) return b.date || ''; return new Date(t).toLocaleDateString(document.documentElement.lang === 'ar' ? 'ar-JO' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };

  /* Detail pages opened without a selected booking become a picker instead of a dead end. */
  const PICKERS = {
    'booking-details.html': {
      title: 'Choose a booking to open', text: 'Requests waiting for your answer are listed first, then your next appointments.',
      rows: all => [...all.filter(isRequest).sort((a, b) => startOf(a) - startOf(b)), ...all.filter(b => b.status === 'confirmed' || b.status === 'upcoming').filter(b => startOf(b) + 36e5 > Date.now()).sort((a, b) => startOf(a) - startOf(b))],
      empty: 'No requests or upcoming appointments right now.'
    },
    'consultation.html': {
      title: 'Which session are you starting?', text: 'Pick a confirmed appointment. Today’s sessions are listed first.',
      rows: all => all.filter(b => b.status === 'confirmed' || b.status === 'upcoming').filter(b => startOf(b) + 36e5 > Date.now()).sort((a, b) => startOf(a) - startOf(b)),
      empty: 'No confirmed sessions are coming up.'
    },
    'report-form.html': {
      title: 'Which session is this report for?', text: 'Completed sessions still missing a report are listed first.',
      rows: all => { const done = read('rafiqSpecialistReports').filter(r => r.specialistId === sid && r.status !== 'draft'); const completed = all.filter(b => b.status === 'completed').sort((a, b) => startOf(b) - startOf(a)); return [...completed.filter(b => !done.some(r => r.bookingId === b.id)).map(b => ({ ...b, _due: true })), ...completed.filter(b => done.some(r => r.bookingId === b.id))]; },
      empty: 'No completed sessions yet. Reports become available after a session is marked complete.'
    }
  };
  function statusLabel(b) { if (b._due) return ['Report due', 'due']; if (isRequest(b)) return ['Awaiting your response', 'request']; if (b.status === 'completed') return ['Report sent', 'done']; return [startOf(b) && new Date(startOf(b)).toDateString() === new Date().toDateString() ? 'Today' : 'Confirmed', 'ok']; }
  function picker() {
    const cfg = PICKERS[page], view = document.getElementById('emptyView');
    if (!cfg || !view || view.hidden || view.querySelector('.practice-picker')) return;
    const rows = cfg.rows(read('rafiqBookings').filter(mine)).slice(0, 8);
    view.classList.add('has-picker');
    view.querySelector('span').textContent = 'SELECT A SESSION';
    view.querySelector('h2').textContent = cfg.title;
    view.querySelector('p').textContent = rows.length ? cfg.text : cfg.empty;
    const list = document.createElement('div'); list.className = 'practice-picker'; list.setAttribute('role', 'list');
    for (const b of rows) {
      const [label, tone] = statusLabel(b), item = document.createElement('button');
      item.type = 'button'; item.className = 'practice-pick'; item.setAttribute('role', 'listitem');
      item.innerHTML = '<span class="practice-request-avatar" aria-hidden="true" data-user-content>' + esc((b.childName || 'C').charAt(0)) + '</span><span class="practice-pick-body"><strong data-user-content>' + esc(b.childName || 'Child') + '</strong><small>' + esc(fmtDate(b)) + ' · ' + esc(b.time || '') + ' · ' + typeLabel(b.consultationType) + '</small><em data-user-content>' + esc(b.reason || '') + '</em></span><span class="practice-pick-status" data-tone="' + tone + '">' + label + '</span>';
      item.onclick = () => { sessionStorage.setItem('rafiqSelectedSpecialistBooking', b.id); location.reload(); };
      list.append(item);
    }
    const link = view.querySelector('a'); if (link) { link.textContent = 'See all bookings'; link.before(list); } else view.append(list);
  }

  /* Availability: the saved/not-saved state sits beside the title. */
  function availabilityChip() {
    const status = document.getElementById('availabilityStatus'), back = document.querySelector('.availability-page .topbar .back-button');
    if (!status || !back || status.closest('.practice-status-chip')) return;
    const chip = document.createElement('div'); chip.className = 'practice-status-chip'; chip.setAttribute('role', 'status');
    const sync = () => { chip.dataset.ready = status.dataset.ready === 'true'; }; sync();
    new MutationObserver(sync).observe(status, { attributes: true, attributeFilter: ['data-ready'] });
    chip.append(status); back.before(chip);
  }

  /* Profile: one long form becomes four focused tabs; the parent preview stays beside them. */
  function profileTabs() {
    const main = document.querySelector('.specialist-profile-page .profile-main');
    if (!main || main.querySelector('.profile-tabs')) return;
    const cards = [...main.querySelectorAll(':scope > section.profile-card')];
    const work = document.getElementById('clinicWorkCard'), media = document.getElementById('clinicMediaCard');
    const [identity, details, services] = cards.filter(c => c !== work && c !== media);
    if (!identity || !details || !services) return;
    const tabs = [
      ['about', 'About you', 'Bio, experience and how you work', [details, work]],
      ['services', 'Services & fees', 'Formats, languages and price', [services]],
      ['media', 'Photo & certificates', 'Public photo, video and credentials', [media]],
      ['identity', 'Verified identity', 'Read-only details from verification', [identity]]
    ].filter(t => t[3].every(Boolean));
    const bar = document.createElement('div'); bar.className = 'profile-tabs'; bar.setAttribute('role', 'tablist'); bar.setAttribute('aria-label', 'Profile sections');
    const panels = [];
    tabs.forEach(([key, label, hint, sections], i) => {
      const panel = document.createElement('div'); panel.className = 'profile-tab-panel'; panel.id = 'profileTab-' + key; panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', 'profileTabButton-' + key);
      sections[0].before(panel); sections.forEach(s => panel.append(s));
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'profile-tab'; btn.id = 'profileTabButton-' + key; btn.setAttribute('role', 'tab'); btn.setAttribute('aria-controls', panel.id); btn.title = hint;
      btn.innerHTML = '<span class="profile-tab-step" aria-hidden="true">' + (i + 1) + '</span><span class="profile-tab-copy"><strong>' + label + '</strong><small>' + hint + '</small></span><span class="profile-tab-flag" aria-hidden="true"></span>';
      btn.onclick = () => select(key, true);
      bar.append(btn); panels.push({ key, panel, btn });
    });
    main.prepend(bar);
    function select(key, focus) {
      panels.forEach(p => { const on = p.key === key; p.panel.hidden = !on; p.btn.setAttribute('aria-selected', String(on)); p.btn.tabIndex = on ? 0 : -1; });
      try { history.replaceState(null, '', '#' + key); } catch { /* file:// previews may block this */ }
      if (focus) panels.find(p => p.key === key)?.btn.focus();
    }
    bar.addEventListener('keydown', e => {
      const i = panels.findIndex(p => p.btn === document.activeElement); if (i < 0) return;
      const rtl = document.documentElement.dir === 'rtl', step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, Home: -i, End: panels.length - 1 - i }[e.key];
      if (step === undefined) return; e.preventDefault(); select(panels[(i + step + panels.length) % panels.length].key, true);
    });
    const initial = panels.find(p => '#' + p.key === location.hash)?.key || panels[0].key; select(initial);
    // Edits in the public-page cards also count as unsaved changes.
    const saveStatus = document.getElementById('saveStatus');
    [work, media].forEach(c => c?.addEventListener('input', () => { if (saveStatus) saveStatus.textContent = 'You have unsaved changes.'; }));
    // After a save attempt, open the first tab with an error and flag the others.
    document.getElementById('saveProfileButton')?.addEventListener('click', () => setTimeout(() => {
      let first = null;
      panels.forEach(p => { const bad = [...p.panel.querySelectorAll('.field-error,[role=alert]')].some(n => n.textContent.trim()); p.btn.classList.toggle('has-error', bad); if (bad && !first) first = p; });
      if (first && first.panel.hidden) { select(first.key); first.panel.querySelector('.field-error:not(:empty),[role=alert]:not(:empty)')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }, 0));
  }

  // Seed demo specialists once so the first visit shows a working practice.
  try {
    // Inside the shared parent/specialist demo, sample families are not auto-added (use the sample button).
    if (profile.isDemo && !document.documentElement.dataset.demoPreview && !localStorage.getItem('rafiqSpecialistPracticeSeeded_' + sid)) seed();
    normalizePayments();
  } catch (error) { console.warn('Sample practice data could not be prepared.', error); }

  window.RafiqSpecialistPractice = { TAG, seed, clearSample, hasSample, respond, counts, isRequest, askDecline, toast, badges };
  // Runs after every page script's own DOMContentLoaded handler has rendered.
  document.addEventListener('DOMContentLoaded', () => setTimeout(() => { availabilityChip(); picker(); profileTabs(); const view = document.getElementById('emptyView'); if (view && PICKERS[page]) new MutationObserver(picker).observe(view, { attributes: true, attributeFilter: ['hidden'] }); }, 0));
  document.addEventListener('DOMContentLoaded', () => { badges(); renderInbox(); sampleControls(); const flash = sessionStorage.getItem('rafiqPracticeFlash'); if (flash) { sessionStorage.removeItem('rafiqPracticeFlash'); setTimeout(() => toast(flash), 150); } });
  window.addEventListener('storage', e => { if (/^rafiq(Bookings|DirectConversations|CareConnections)$/.test(e.key || '')) { badges(); renderInbox(); } });
})();

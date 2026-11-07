(() => {
  'use strict';
  const root = document.getElementById('supportPortal');
  if (!root) return;
  const admin = root.dataset.admin === 'true', api = window.RafiqSupport;
  if (admin && sessionStorage.getItem('rafiqRole') && sessionStorage.getItem('rafiqRole') !== 'admin') {
    location.replace('../piblic-pages/login.html');
    return;
  }
  let selected = null, tickets = [];
  const $ = id => document.getElementById(id);
  const labels = { new: 'New', in_progress: 'In progress', resolved: 'Resolved' };

  // Seed realistic demo tickets for preview if local storage is empty in admin mode
  function seedDemoTickets() {
    if (!api || api.remote) return;
    try {
      const existing = JSON.parse(localStorage.getItem('rafiqSupportTickets') || '[]');
      if (Array.isArray(existing) && existing.length > 0) return;
      const now = Date.now();
      const demo = [
        {
          id: 'req-8841-a1b2',
          ownerId: 'parent:demo-user-1',
          name: 'Lina Haddad',
          email: 'lina.haddad@example.com',
          requesterRole: 'parent',
          category: 'booking',
          subject: 'Inquiry regarding specialist consultation booking',
          status: 'new',
          createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
          updatedAt: new Date(now - 1000 * 60 * 45).toISOString(),
          messages: [
            {
              id: 'msg-1',
              authorRole: 'parent',
              body: 'Hello Support Team, I am trying to book an assessment session with Dr. Sarah for speech therapy for my daughter (3 years old). Could you please confirm if the video consultation is available this Saturday?',
              createdAt: new Date(now - 1000 * 60 * 45).toISOString()
            }
          ]
        },
        {
          id: 'req-7729-c3d4',
          ownerId: 'specialist:demo-user-2',
          name: 'Dr. Sarah Ahmad',
          email: 'dr.sarah@rafiq.com',
          requesterRole: 'specialist',
          category: 'account',
          subject: 'Updating practice availability and clinic schedule',
          status: 'in_progress',
          createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
          updatedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
          messages: [
            {
              id: 'msg-2',
              authorRole: 'specialist',
              body: 'Hello, I would like to extend my Saturday evening consultation slots from 4:00 PM to 7:00 PM. How do I enable this in the calendar settings?',
              createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString()
            },
            {
              id: 'msg-3',
              authorRole: 'admin',
              body: 'Hello Dr. Sarah, we are currently reviewing your schedule preferences. You can also adjust your recurring time blocks directly under Specialist Settings > Availability. We will verify this shortly.',
              createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString()
            }
          ]
        },
        {
          id: 'req-6610-e5f6',
          ownerId: 'parent:demo-user-3',
          name: 'Omar Khaled',
          email: 'omar.k@example.com',
          requesterRole: 'parent',
          category: 'profile',
          subject: 'Where to find child milestone tracking and growth notes',
          status: 'resolved',
          createdAt: new Date(now - 1000 * 60 * 60 * 28).toISOString(),
          updatedAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
          messages: [
            {
              id: 'msg-4',
              authorRole: 'parent',
              body: 'Good morning, I was wondering where I can upload recent clinical growth records for my son so the specialist can review them prior to our call.',
              createdAt: new Date(now - 1000 * 60 * 60 * 28).toISOString()
            },
            {
              id: 'msg-5',
              authorRole: 'admin',
              body: 'Hi Omar! You can easily upload and attach records from the "Child Records > Health & Milestones" section. Any attached files will be securely accessible to your assigned specialist during consultation.',
              createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString()
            }
          ]
        }
      ];
      localStorage.setItem('rafiqSupportTickets', JSON.stringify(demo));
    } catch(e) {}
  }

  const notice = $('supportNotice');
  if (notice) {
    notice.textContent = api && api.remote ? '' : 'Local preview: requests and replies stay in this browser. This is not connected to the support team yet.';
    notice.hidden = Boolean(api && api.remote);
  }

  const status = $('supportFeedback');
  function feedback(text) {
    if (status) {
      status.textContent = text;
      if (text) {
        clearTimeout(status._timer);
        status._timer = setTimeout(() => { status.textContent = ''; }, 4500);
      }
    }
  }

  function updateMetrics() {
    const total = tickets.length;
    const newCount = tickets.filter(t => t.status === 'new').length;
    const inProgCount = tickets.filter(t => t.status === 'in_progress').length;
    const resCount = tickets.filter(t => t.status === 'resolved').length;
    const pendingCount = newCount + inProgCount;

    if ($('metricTotal')) $('metricTotal').textContent = String(total);
    if ($('metricNew')) $('metricNew').textContent = String(newCount);
    if ($('metricInProgress')) $('metricInProgress').textContent = String(inProgCount);
    if ($('metricResolved')) $('metricResolved').textContent = String(resCount);
    if ($('heroOpenCount')) $('heroOpenCount').textContent = String(pendingCount);
    if ($('heroOpenText')) {
      $('heroOpenText').textContent = pendingCount === 1 ? '1 ticket awaiting attention' : `${pendingCount} tickets awaiting attention`;
    }
  }

  function render() {
    const list = $('supportList');
    if (!list) return;
    list.replaceChildren();

    const term = ($('supportSearch')?.value || '').toLowerCase().trim();
    const state = $('supportFilter')?.value || '';

    const visible = tickets.filter(t => (!state || t.status === state) && [t.subject, t.name, t.email, t.id].some(s => String(s || '').toLowerCase().includes(term)));

    if ($('supportCount')) {
      $('supportCount').textContent = `${visible.length} ${visible.length === 1 ? 'request' : 'requests'}`;
    }

    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'support-empty-list';
      empty.innerHTML = '<span class="empty-icon">📂</span><p>No support requests match your search or filter.</p>';
      list.append(empty);
      return;
    }

    visible.forEach(ticket => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'support-ticket';
      button.setAttribute('aria-pressed', String(selected === ticket.id));
      button.dataset.status = ticket.status;

      const topRow = document.createElement('div');
      topRow.className = 'ticket-card-top';

      const title = document.createElement('strong');
      title.className = 'ticket-card-title';
      title.textContent = ticket.subject;

      const badge = document.createElement('span');
      badge.className = `ticket-status-pill status-${ticket.status}`;
      badge.textContent = labels[ticket.status] || ticket.status;

      topRow.append(title, badge);

      const metaRow = document.createElement('div');
      metaRow.className = 'ticket-card-sub';

      const user = document.createElement('span');
      user.className = 'ticket-card-user';
      user.textContent = ticket.name || 'Anonymous';

      const roleBadge = document.createElement('span');
      roleBadge.className = 'ticket-card-role';
      roleBadge.textContent = ticket.requesterRole || 'User';

      const catBadge = document.createElement('span');
      catBadge.className = 'ticket-card-category';
      catBadge.textContent = ticket.category || 'General';

      const date = document.createElement('span');
      date.className = 'ticket-card-date';
      try {
        date.textContent = new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      } catch(e) {
        date.textContent = '';
      }

      metaRow.append(user, document.createTextNode(' · '), roleBadge, document.createTextNode(' · '), catBadge, document.createTextNode(' · '), date);

      button.append(topRow, metaRow);

      button.addEventListener('click', () => {
        selected = ticket.id;
        render();
        detail();
      });

      list.append(button);
    });
  }

  function detail() {
    const ticket = tickets.find(t => t.id === selected);
    const panel = $('supportDetail');
    const emptyState = $('supportDetailEmpty');

    if (emptyState) emptyState.hidden = Boolean(ticket);
    if (panel) panel.hidden = !ticket;
    if (!ticket) return;

    if ($('ticketTitle')) $('ticketTitle').textContent = ticket.subject;

    const meta = $('ticketMeta');
    if (meta) {
      meta.replaceChildren();

      const req = document.createElement('span');
      req.className = 'ticket-meta-tag requester';
      req.textContent = ticket.name || 'Anonymous';

      const role = document.createElement('span');
      role.className = `ticket-meta-tag role-${ticket.requesterRole || 'user'}`;
      role.textContent = ticket.requesterRole ? (ticket.requesterRole.charAt(0).toUpperCase() + ticket.requesterRole.slice(1)) : 'User';

      const cat = document.createElement('span');
      cat.className = 'ticket-meta-tag category';
      cat.textContent = ticket.category ? (ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)) : 'General';

      const dt = document.createElement('span');
      dt.className = 'ticket-meta-tag date';
      try {
        dt.textContent = new Date(ticket.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
      } catch(e) {
        dt.textContent = ticket.createdAt || '';
      }

      meta.append(req, role, cat, dt);

      if (admin && ticket.email) {
        const mail = document.createElement('a');
        mail.className = 'ticket-meta-tag email';
        mail.href = `mailto:${ticket.email}`;
        mail.textContent = ticket.email;
        meta.append(mail);
      }
    }

    if ($('ticketReference')) $('ticketReference').textContent = 'Reference: ' + ticket.id;

    const messages = $('supportMessages');
    if (messages) {
      messages.replaceChildren();
      (ticket.messages || []).forEach(message => {
        const article = document.createElement('article');
        const isAdmin = message.authorRole === 'admin';
        article.className = isAdmin ? 'message-card admin-reply' : 'message-card requester-message';

        const header = document.createElement('div');
        header.className = 'message-card-header';

        const author = document.createElement('strong');
        author.className = isAdmin ? 'author-badge admin' : 'author-badge requester';
        author.textContent = isAdmin ? 'RAFIQ Support Team' : (ticket.name || 'Requester');

        const time = document.createElement('time');
        time.className = 'message-time';
        try {
          time.textContent = new Date(message.createdAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
        } catch(e) {
          time.textContent = message.createdAt || '';
        }

        header.append(author, time);

        const body = document.createElement('p');
        body.className = 'message-body';
        body.textContent = message.body;

        article.append(header, body);
        messages.append(article);
      });
    }

    if (admin && $('ticketStatus')) $('ticketStatus').value = ticket.status;
  }

  async function load() {
    try {
      if (admin) seedDemoTickets();
      tickets = await api.list(admin);
      updateMetrics();
      if (!selected && tickets.length > 0) {
        selected = tickets[0].id;
      }
      render();
      detail();
    } catch (error) {
      feedback(error.message);
    }
  }

  async function action(button, work) {
    if (button) button.disabled = true;
    try {
      await work();
      await load();
    } catch (error) {
      feedback(error.message);
    } finally {
      if (button) button.disabled = false;
    }
  }

  $('supportRefresh')?.addEventListener('click', load);
  $('supportSearch')?.addEventListener('input', render);
  $('supportFilter')?.addEventListener('change', render);

  const create = $('supportCreate');
  create?.addEventListener('submit', event => {
    event.preventDefault();
    action(create.querySelector('button'), async () => {
      const data = Object.fromEntries(new FormData(create));
      const ticket = await api.create(data);
      selected = ticket.id;
      create.reset();
      feedback(api.remote ? 'Request submitted. You can follow replies below.' : 'Request saved in local preview. No request has been delivered to a support team.');
    });
  });

  $('supportReply')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    action(form.querySelector('button'), async () => {
      if (!selected) throw Error('Select a request first.');
      const replyInput = $('replyBody');
      if (!replyInput || !replyInput.value.trim()) throw Error('Please enter a reply.');
      await api.reply(selected, replyInput.value, admin);
      form.reset();
      feedback(api.remote ? 'Reply saved.' : 'Reply saved successfully.');
    });
  });

  if (admin) {
    $('saveTicketStatus')?.addEventListener('click', event => action(event.currentTarget, async () => {
      if (!selected) throw Error('Select a request first.');
      await api.status(selected, $('ticketStatus').value);
      feedback('Status updated successfully.');
    }));
  }

  window.addEventListener('storage', event => {
    if (event.key === 'rafiqSupportTickets') load();
  });

  load();
})();

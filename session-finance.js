/* Frontend demonstration only. No money is collected or transferred. */
(() => {
  'use strict';
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const money = n => `${Number(n || 0).toFixed(2)} JOD`;
  const round = n => Math.round(n * 100) / 100;
  const rate = () => {
    const n = Number(read('rafiqCommissionRate', 10));
    return Number.isFinite(n) && n >= 0 && n <= 100 ? n : 10;
  };
  function reconcile() {
    const bookings = read('rafiqBookings', []);
    let changed = false;
    bookings.forEach(b => {
      if (!b.sessionPayment) return;
      const p = b.sessionPayment;
      if (b.status === 'cancelled' && p.status === 'paid' && p.payoutStatus !== 'transferred') {
        p.status = 'refund_pending'; p.payoutStatus = 'blocked'; changed = true;
      }
      if (b.status === 'completed' && p.status === 'paid' && p.payoutStatus === 'held') {
        p.payoutStatus = 'pending'; changed = true;
      }
    });
    if (changed) save('rafiqBookings', bookings);
    return bookings;
  }
  function checkout(amount) {
    return new Promise(resolve => {
      const price = Number(amount);
      if (!Number.isFinite(price) || price < 0) { resolve(null); return; }
      const dialog = document.createElement('dialog');
      dialog.className = 'sf-dialog';
      dialog.innerHTML = `<form method="dialog"><h2>Pay before your session</h2><p>Orange Money · Demo checkout</p><strong class="sf-amount">${money(price)}</strong><p>Your appointment is confirmed after demo payment. No money will leave your wallet.</p><label><input type="checkbox" required> I understand this payment is simulated.</label><p role="status" class="sf-message">Awaiting payment</p><div class="sf-actions"><button type="button" data-cancel>Back</button><button type="button" data-fail>Simulate failure</button><button type="submit">Pay ${money(price)} · Demo</button></div></form>`;
      let settled = false;
      const finish = value => { if (settled) return; settled = true; clearTimeout(timeout); dialog.close(); dialog.remove(); resolve(value); };
      const timeout = setTimeout(() => finish(null), 10 * 60 * 1000);
      dialog.querySelector('[data-cancel]').onclick = () => finish(null);
      dialog.addEventListener('cancel', e => { e.preventDefault(); finish(null); });
      dialog.querySelector('[data-fail]').onclick = () => {
        dialog.querySelector('.sf-message').textContent = 'Demo payment failed. Your booking is not confirmed. Retry or go back.';
      };
      dialog.querySelector('form').onsubmit = e => {
        e.preventDefault();
        const commissionRate = rate();
        const commission = round(price * commissionRate / 100);
        finish({ provider: 'orange_money_demo', status: 'paid', amount: price,
          commissionRate, commission, specialistNet: round(price - commission),
          payoutStatus: 'held', reference: 'DEMO-' + crypto.randomUUID(),
          paidAt: new Date().toISOString() });
      };
      document.body.append(dialog); dialog.showModal();
    });
  }
  window.RafiqFinance = { checkout, reconcile, money };

  function panel() {
    reconcile();
    const admin = location.pathname.endsWith('/billing-management.html');
    const doctor = location.pathname.endsWith('/earnings.html');
    const parent = location.pathname.endsWith('/bookings.html');
    if (!admin && !doctor && !parent) return;
    const profile = read('rafiqSpecialistProfile', null);
    if (doctor && (!profile || profile.status !== 'approved')) return;
    const host = doctor ? document.getElementById('earningsView') : document.querySelector('main');
    if (!host) return;
    const section = document.createElement('section'); section.className = 'sf-panel';
    host.prepend(section);
    const text = (tag, value, target) => { const e = document.createElement(tag); e.textContent = value; target.append(e); return e; };
    function render() {
      section.replaceChildren();
      text('h2', admin ? 'Session payments & settlements' : doctor ? 'Your session settlements' : 'Session payment status', section);
      text('p', 'Demo records only. Orange Money is not connected. Gateway fees are not included. Cancelled sessions require a full demo refund.', section);
      if (admin) {
        const label = text('label', 'Commission for new bookings (%) ', section);
        const input = document.createElement('input'); Object.assign(input, {type:'number', min:'0', max:'100', step:'0.1', value:String(rate())}); label.append(input);
        const button = text('button', 'Save commission', section);
        button.onclick = () => { if (!input.checkValidity() || input.value === '') { input.reportValidity(); return; } save('rafiqCommissionRate', Number(input.value)); button.textContent = 'Saved'; };
      }
      let rows = reconcile().filter(b => b.sessionPayment);
      if (doctor) rows = rows.filter(b => b.specialistId === profile.id);
      if (!rows.length) { text('p', 'No demo session payments yet. New paid bookings will appear here.', section); return; }
      const paid = rows.filter(b => b.sessionPayment.status === 'paid');
      const due = paid.filter(b => b.status === 'completed' && b.sessionPayment.payoutStatus === 'pending');
      const transferred = paid.filter(b => b.sessionPayment.payoutStatus === 'transferred');
      const total = (items, key) => money(items.reduce((sum,b) => sum + b.sessionPayment[key], 0));
      text('p', `Awaiting transfer: ${total(due,'specialistNet')} · Transferred: ${total(transferred,'specialistNet')}` + (admin ? ` · Earned commission: ${total(paid.filter(b => b.status === 'completed'),'commission')}` : ''), section);
      const wrap = document.createElement('div'); wrap.className = 'sf-scroll'; section.append(wrap);
      const table = document.createElement('table'); wrap.append(table);
      const head = document.createElement('tr'); table.append(head);
      ['Booking / specialist','Session','Payment','Total','Commission','Doctor net','Settlement','Action'].forEach(v => text('th',v,head));
      rows.forEach(b => {
        const p = b.sessionPayment;
        const tr = document.createElement('tr'); table.append(tr);
        [b.id + ' / ' + b.specialistName, b.status, p.status.replaceAll('_',' '), money(p.amount), `${money(p.commission)} (${p.commissionRate}%)`, money(p.specialistNet), p.payoutStatus.replaceAll('_',' ')].forEach(v => text('td',v,tr));
        const action = document.createElement('td'); tr.append(action);
        if (admin && b.status === 'completed' && p.status === 'paid' && p.payoutStatus === 'pending') {
          const button = text('button','Record demo transfer',action);
          button.onclick = () => update(b.id, x => { x.payoutStatus = 'transferred'; x.transferredAt = new Date().toISOString(); });
        }
        if (admin && p.status === 'refund_pending') {
          const button = text('button','Record full demo refund',action);
          button.onclick = () => update(b.id, x => { x.status = 'refunded'; x.refundedAt = new Date().toISOString(); x.payoutStatus = 'void'; });
        }
        if (p.status === 'paid' && b.status !== 'completed' && b.status !== 'cancelled') text('span','Held until session completion',action);
        if (b.status === 'cancelled' && p.payoutStatus === 'transferred') text('span','Manual review: already transferred',action);
      });
    }
    function update(id, mutate) {
      const list = reconcile(); const b = list.find(x => x.id === id);
      if (!b) return;
      mutate(b.sessionPayment); save('rafiqBookings',list); render();
    }
    render();
    window.addEventListener('storage', render);
    window.addEventListener('rafiq-finance-change', render);
    window.addEventListener('focus', render);
  }
  document.addEventListener('DOMContentLoaded', panel);
})();

/* Local preview directory; never stores authentication credentials. */
(() => {
  'use strict';
  const role = sessionStorage.getItem('rafiqRole');
  if (role && role !== 'admin') { location.replace('../piblic-pages/login.html'); return; }
  const search = document.getElementById('userSearch');
  let users = [];
  function read(key) {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(data)) throw new Error('Invalid directory');
    return data.filter(item => item && typeof item === 'object');
  }
  function load() {
    try {
      const directory = new Map();
      for (const item of read('rafiqUsers').filter(user => user.role === 'parent')) {
        const role = 'parent';
        const key = role + ':' + (String(item.email || '').trim().toLowerCase() || item.id);
        if (!item.email && !item.id) continue;
        const previous = directory.get(key) || {};
        directory.set(key, {...previous, ...item, role, fullName:item.fullName || item.name || previous.fullName || 'Unnamed user', createdAt:item.createdAt || previous.createdAt});
      }
      users = [...directory.values()].sort((a,b) => (Date.parse(b.createdAt)||0) - (Date.parse(a.createdAt)||0));
      document.getElementById('directoryError').hidden = true;
    } catch {
      users = [];
      document.getElementById('directoryError').hidden = false;
    }
    document.getElementById('parentCount').textContent = users.length;
    render();
  }
  function render() {
    const term = search.value.trim().toLowerCase();
    const visible = users.filter(u => [u.fullName,u.email,u.phone].some(value => String(value||'').toLowerCase().includes(term)));
    const body = document.getElementById('userRows'); body.replaceChildren();
    for (const user of visible) {
      const row = document.createElement('tr');
      const date = new Date(user.createdAt);
      const values = [user.fullName,user.email || '—',user.phone || '—', Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-GB')];
      values.forEach(value => {const cell = document.createElement('td');cell.textContent = value;row.append(cell);});
      body.append(row);
    }
    document.getElementById('userResults').textContent = `${visible.length} of ${users.length} parents`;
    const empty = document.getElementById('usersEmpty'); empty.hidden = visible.length > 0;
    empty.textContent = users.length ? 'No parents match your search. Try another name, email or phone.' : 'No parents saved yet. New parent registrations in this browser will appear here.';
  }
  search.addEventListener('input',render);
  document.getElementById('refreshUsers').addEventListener('click',load);
  window.addEventListener('storage',event => {if (!event.key || event.key === 'rafiqUsers') load();});
  load();
})();
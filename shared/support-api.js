/* Replace local preview transport by configuring apiBase in support-config.js. */
(() => {
  'use strict';
  const config = window.RafiqSupportConfig || {};
  const key = 'rafiqSupportTickets';
  const roles = ['parent','specialist','guest'];
  const states = ['new','in_progress','resolved'];
  const uid = () => crypto.randomUUID();
  function identity() {
    let id = sessionStorage.getItem('rafiqSupportViewerId');
    if (!id) {id=uid();sessionStorage.setItem('rafiqSupportViewerId',id);}
    const hint = new URLSearchParams(location.search).get('from');
    const role = sessionStorage.getItem('rafiqRole') || hint || 'guest';
    return {id,role: roles.includes(role) ? role : 'guest'};
  }
  function read() {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(data)) throw Error('Saved support data is invalid.');
    return data;
  }
  function save(data) {localStorage.setItem(key,JSON.stringify(data));}
  function text(value,max) {if(typeof value!=='string'||!value.trim()||value.trim().length>max)throw Error('Please complete all fields within their limits.');return value.trim();}
  async function request(path,method='GET',body) {
    const response = await fetch(config.apiBase.replace(/\/$/,'')+path,{method,credentials:'include',headers:{'Content-Type':'application/json',...(config.csrfToken ? {'X-CSRF-Token':config.csrfToken} : {})},...(body ? {body:JSON.stringify(body)} : {})});
    if(!response.ok)throw Error(response.status===401?'Please log in to continue.':response.status===403?'You do not have access to this request.':'Unable to save or load support requests. Please try again.');
    return response.status===204 ? null : response.json();
  }
  const remote = Boolean(config.apiBase);
  window.RafiqSupport = {
    remote,
    async list(admin=false) {
      if(remote)return request(admin?'/admin/support/tickets':'/support/tickets');
      const viewer=identity();
      return read().filter(ticket=>admin||ticket.ownerId===viewer.id).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
    },
    async create(input) {
      const payload={name:text(input.name,100),email:text(input.email,254),subject:text(input.subject,150),message:text(input.message,4000),category:input.category};
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))throw Error('Please enter a valid email address.');
      if(!['account','booking','profile','technical','other'].includes(payload.category))throw Error('Choose a category.');
      if(remote)return request('/support/tickets','POST',payload);
      const viewer=identity(),now=new Date().toISOString();
      const ticket={id:uid(),ownerId:viewer.id,requesterRole:viewer.role,...payload,status:'new',createdAt:now,updatedAt:now,messages:[{id:uid(),authorRole:viewer.role,body:payload.message,createdAt:now}]};
      delete ticket.message;const all=read();all.push(ticket);save(all);return ticket;
    },
    async reply(id,body,admin=false) {
      body=text(body,4000);
      if(remote)return request(`${admin?'/admin':''}/support/tickets/${encodeURIComponent(id)}/messages`,'POST',{body});
      const all=read(),ticket=all.find(t=>t.id===id);
      if(!ticket||(!admin&&ticket.ownerId!==identity().id))throw Error('Request unavailable.');
      const now=new Date().toISOString();ticket.messages.push({id:uid(),authorRole:admin?'admin':identity().role,body,createdAt:now});ticket.updatedAt=now;save(all);return ticket;
    },
    async status(id,status) {
      if(!states.includes(status))throw Error('Invalid request status.');
      if(remote)return request('/admin/support/tickets/'+encodeURIComponent(id),'PATCH',{status});
      const all=read(),ticket=all.find(t=>t.id===id);if(!ticket)throw Error('Request unavailable.');ticket.status=status;ticket.updatedAt=new Date().toISOString();save(all);return ticket;
    }
  };
})();
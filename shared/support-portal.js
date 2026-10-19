(() => {
  'use strict';
  const root=document.getElementById('supportPortal');if(!root)return;
  const admin=root.dataset.admin==='true',api=window.RafiqSupport;
  if(admin && sessionStorage.getItem('rafiqRole') && sessionStorage.getItem('rafiqRole')!=='admin'){location.replace('../piblic-pages/login.html');return;}
  let selected=null,tickets=[];
  const $=id=>document.getElementById(id), labels={new:'New',in_progress:'In progress',resolved:'Resolved'};
  const notice=$('supportNotice');
  notice.textContent=api.remote?'':'Local preview: requests and replies stay in this browser. This is not connected to the support team yet.';
  notice.hidden=api.remote;
  const status=$('supportFeedback');
  function feedback(text){status.textContent=text;}
  function node(tag,text){const el=document.createElement(tag);el.textContent=text;return el;}
  function render(){
    const list=$('supportList');list.replaceChildren();
    const term=$('supportSearch').value.toLowerCase().trim(),state=$('supportFilter').value;
    const visible=tickets.filter(t=>(!state||t.status===state)&&[t.subject,t.name,t.email,t.id].some(s=>String(s||'').toLowerCase().includes(term)));
    $('supportCount').textContent=`${visible.length} requests`;
    if(!visible.length)list.append(node('p','No support requests to show.'));
    visible.forEach(ticket=>{const button=node('button',`${ticket.subject} · ${labels[ticket.status] || ticket.status}`);button.type='button';button.className='support-ticket';button.setAttribute('aria-pressed',String(selected===ticket.id));button.addEventListener('click',()=>{selected=ticket.id;render();detail();});list.append(button);});
  }
  function detail(){
    const ticket=tickets.find(t=>t.id===selected),panel=$('supportDetail');panel.hidden=!ticket;if(!ticket)return;
    $('ticketTitle').textContent=ticket.subject;
    $('ticketMeta').textContent=`${ticket.name} · ${ticket.requesterRole} · ${ticket.category} · ${labels[ticket.status]} · ${new Date(ticket.createdAt).toLocaleString('en-GB')}${admin?' · '+ticket.email:''}`;
    $('ticketReference').textContent='Reference: '+ticket.id;
    const messages=$('supportMessages');messages.replaceChildren();
    (ticket.messages||[]).forEach(message=>{const article=node('article','');article.append(node('strong',message.authorRole==='admin'?'Support team':'Requester'),node('p',message.body),node('small',new Date(message.createdAt).toLocaleString('en-GB')));messages.append(article);});
    if(admin)$('ticketStatus').value=ticket.status;
  }
  async function load(){try{tickets=await api.list(admin);render();detail();}catch(error){feedback(error.message);}}
  async function action(button,work){button.disabled=true;try{await work();await load();}catch(error){feedback(error.message);}finally{button.disabled=false;}}
  $('supportRefresh').addEventListener('click',load);$('supportSearch').addEventListener('input',render);$('supportFilter').addEventListener('change',render);
  const create=$('supportCreate');
  create?.addEventListener('submit',event=>{event.preventDefault();action(create.querySelector('button'),async()=>{const data=Object.fromEntries(new FormData(create));const ticket=await api.create(data);selected=ticket.id;create.reset();feedback(api.remote?'Request submitted. You can follow replies below.':'Request saved in local preview. No request has been delivered to a support team.');});});
  $('supportReply').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;action(form.querySelector('button'),async()=>{if(!selected)throw Error('Select a request first.');await api.reply(selected,$('replyBody').value,admin);form.reset();feedback(api.remote?'Reply saved.':'Reply saved in local preview.');});});
  if(admin)$('saveTicketStatus').addEventListener('click',event=>action(event.currentTarget,async()=>{await api.status(selected,$('ticketStatus').value);feedback('Status updated.');}));
  window.addEventListener('storage',event=>{if(event.key==='rafiqSupportTickets')load();});
  load();
})();
/* Translate text nodes only: images, element identity, listeners and animation
   layers are retained. Dynamic preview messages use the same dictionary. */
(() => {
  'use strict';
  const messages = window.RafiqHomeArabic || {};
  const privateValues = new Set();
  let privateScan = -Infinity;
  function refreshPrivateValues() {
    if (Date.now()-privateScan<250) return;
    privateScan=Date.now();privateValues.clear();
    function collect(value,key='',sensitive=false){
      const privateKey=sensitive||/^(?:name|firstName|fullName|email|phone|phoneNumber|text|body|message|reason|notes?|bio|summary|recommendations|observations|description|title)$/i.test(key);
      if(typeof value==='string'){if(privateKey&&value.trim())privateValues.add(value.trim());return;}
      if(Array.isArray(value)){value.forEach(item=>collect(item,key,privateKey));return;}
      if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>collect(v,k,false));
    }
    try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(/^rafiq(?:Users|Children|ParentProfile|Specialists|SpecialistProfile|Bookings|Consultations|Reports|SupportTickets|Concern|AgeObservations|Health)/.test(key))try{collect(JSON.parse(localStorage.getItem(key)));}catch{}}}catch{}
  }
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const reverse = new Map(Object.entries(messages).map(([en, ar]) => [ar, en]));
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  const attributes = ['aria-label', 'aria-roledescription', 'alt', 'placeholder', 'title'];
  const folded = new Map(Object.entries(messages).map(([en,ar])=>[en.toLowerCase(),ar]));
  function privateNode(node){
    const parent=node.parentElement;
    if(parent?.closest('input,textarea,[contenteditable],script,style,noscript,[data-no-translate],[data-home-language]'))return true;
    if(parent?.id==='worldName'&&!['Your little world','عالمك الصغير'].includes(normalize(node.data)))return true;
    return !!parent?.closest('.message-row.user,.album-caption,[data-user-content]')||privateValues.has(normalize(node.data));
  }
  const templates=(window.RafiqArabicTemplates||[]).map(({en,ar})=>({
    pattern:new RegExp('^'+en.split(/\{\d+\}/).map(part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('(.+?)')+'$'),ar
  }));
  function formatArabic(key){
    if(folded.has(key.toLowerCase()))return folded.get(key.toLowerCase());
    for(const template of templates){const match=key.match(template.pattern);if(match)return template.ar.replace(/\{(\d+)\}/g,(_,index)=>match[Number(index)+1]);}
    const title=key.match(/^(.+?)\s*\|\s*(RAFIQ(?: Specialist| Admin)?|Rafiq)$/);
    if(title)return (messages[title[1]]||folded.get(title[1].toLowerCase())||title[1])+' | رفيق';
    const amount=key.match(/^([\d.,]+)\s*JOD$/i);if(amount)return amount[1]+' د.أ';
    const age=key.match(/^(\d+)\s+(days?|weeks?|months?|years?)(?:\s+old)?(?:,?\s+(\d+)\s+(days?|weeks?|months?))?$/i);
    if(age){const units={day:'يوم',days:'أيام',week:'أسبوع',weeks:'أسابيع',month:'شهر',months:'أشهر',year:'سنة',years:'سنوات'};return age[1]+' '+units[age[2].toLowerCase()]+(age[3]?' و'+age[3]+' '+units[age[4].toLowerCase()]:'');}
    const resultCount=key.match(/^(\d+) of (\d+) parents$/);if(resultCount)return resultCount[1]+' من '+resultCount[2]+' من الأهل';
    const answers=key.match(/^(\d+) matching answers?$/);if(answers)return answers[1]+' إجابات مطابقة';
    const count=key.match(/^([\d.,%]+)\s+(.+)$/);if(count){const noun=messages[count[2]]||folded.get(count[2].toLowerCase());if(noun)return count[1]+' '+noun;}
    const prefix=key.match(/^(.+?):\s+(.+)$/);if(prefix){const label=messages[prefix[1]]||folded.get(prefix[1].toLowerCase());if(label)return label+': '+(messages[prefix[2]]||prefix[2]);}
    if(key.endsWith(' →')||key.endsWith(' ↗')){const label=key.slice(0,-2);const ar=messages[label]||folded.get(label.toLowerCase());if(ar)return ar+' '+key.slice(-1);}
    return undefined;
  }
  let language = 'en';
  let observer;
  const buttons = [...document.querySelectorAll('[data-home-language]')];
  const descriptionSource = document.querySelector('meta[name="description"]')?.content || '';
  function canonical(value) {
    const key = normalize(value);
    // Some existing components compose accessible labels from visible headings.
    const card = key.match(/^(\d+) of (\d+): (.+)$/);
    if (card) return `${card[1]} of ${card[2]}: ${reverse.get(card[3]) || card[3]}`;
    if (key.startsWith('The same child walking and growing, age ')) return key.replace('مخطط له', 'Planned');
    return reverse.get(key) || value;
  }
  function translate(value) {
    const key = normalize(value);
    if (language === 'en') return value;
    let translated = messages[key] ?? formatArabic(key);
    if (translated === undefined) {
      const card = key.match(/^(\d+) of (\d+): (.+)$/);
      if (card) translated = `${card[1]} من ${card[2]}: ${messages[card[3]] || card[3]}`;
      else if (key === 'The same blue-clothed baby crawling in from the left') translated = 'نفس الطفل بلباس أزرق يحبو من اليسار';
      else if (key.startsWith('The same child walking and growing, age ')) translated = 'نفس الطفل يمشي ويكبر، العمر ' + key.slice('The same child walking and growing, age '.length).replace('Planned','مخطط له');
    }
    if (translated === undefined || translated === key) return value;
    const leading = value.match(/^\s*/)[0], trailing = value.match(/\s*$/)[0];
    return leading + translated + trailing;
  }
  function updateText(node) {
    const parent = node.parentElement;
    if (!parent || privateNode(node)) return;
    if (!normalize(node.data)) return;
    let record = textRecords.get(node);
    if (!record || node.data !== record.rendered) {
      record = {source: canonical(node.data), rendered: node.data};
      textRecords.set(node, record);
    }
    const next = translate(record.source);
    record.rendered = next;
    if (node.data !== next) node.data = next;
  }
  function updateAttributes(element) {
    if(element.tagName==='OPTION'&&!element.hasAttribute('value'))element.setAttribute('value',element.textContent);
    if (element.closest('script,style,[data-no-translate],[data-home-language]')) return;
    let records = attributeRecords.get(element);
    if (!records) { records = {}; attributeRecords.set(element, records); }
    for (const attr of attributes) {
      if (!element.hasAttribute(attr)) continue;
      const value = element.getAttribute(attr);
      let record = records[attr];
      if (!record || value !== record.rendered) record = records[attr] = {source: canonical(value), rendered: value};
      const next = translate(record.source);
      record.rendered = next;
      if (value !== next) element.setAttribute(attr, next);
    }
  }
  function updateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) { updateText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) updateAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.nodeType === Node.TEXT_NODE) updateText(walker.currentNode);
      else updateAttributes(walker.currentNode);
    }
  }
  function observe() {
    observer.observe(document.documentElement, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes});
  }
  function apply(next, persist = true) {
    observer.disconnect();
    refreshPrivateValues();
    language = next === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    updateTree(document.documentElement);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.content = language === 'ar' ? (messages[descriptionSource] || descriptionSource) : descriptionSource;
    }
    document.querySelectorAll('[data-home-language],[data-language]').forEach(button => {
      const active = (button.dataset.homeLanguage||button.dataset.language) === language;
      button.setAttribute('aria-pressed', String(active));
      if(button.hasAttribute('data-language'))button.classList.toggle('active',active);
    });
    const languageSelect=document.getElementById('languageSelect');
    if(languageSelect)languageSelect.value=language;
    if (persist) { try { localStorage.setItem('rafiqLanguage', language); } catch { /* Storage is optional. */ } }
    observe();
    // Re-measure text-dependent scenes without restarting or replacing them.
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }
  observer = new MutationObserver(records => {
    observer.disconnect();
    refreshPrivateValues();
    for (const record of records) {
      if (record.type === 'characterData') updateText(record.target);
      else if (record.type === 'attributes') updateAttributes(record.target);
      else record.addedNodes.forEach(updateTree);
    }
    observe();
  });
  buttons.forEach(button => button.addEventListener('click', () => apply(button.dataset.homeLanguage)));
  window.addEventListener('storage', event => { if (event.key === 'rafiqLanguage') apply(event.newValue, false); });
  let saved;
  try { saved = localStorage.getItem('rafiqLanguage'); } catch { /* Use English when storage is unavailable. */ }
  apply(saved, false);
  window.RafiqHomeI18n = window.RafiqLanguage = {setLanguage: apply, getLanguage: () => language};
  document.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(button&&['en','ar'].includes(button.dataset.language))apply(button.dataset.language);});
  document.addEventListener('change',event=>{if(event.target.id==='languageSelect'&&['en','ar'].includes(event.target.value))apply(event.target.value);});
  document.addEventListener('DOMContentLoaded',()=>{let stored;try{stored=localStorage.getItem('rafiqLanguage');}catch{}apply(stored||language,false);});
  new MutationObserver(()=>{if(document.documentElement.lang!==language)apply(document.documentElement.lang);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

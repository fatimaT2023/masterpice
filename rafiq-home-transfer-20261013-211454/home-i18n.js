/* Translate text nodes only: images, element identity, listeners and animation
   layers are retained. Dynamic preview messages use the same dictionary. */
(() => {
  'use strict';
  const messages = window.RafiqHomeArabic || {};
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const reverse = new Map(Object.entries(messages).map(([en, ar]) => [ar, en]));
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  const attributes = ['aria-label', 'aria-roledescription', 'alt', 'placeholder', 'title'];
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
    let translated = messages[key];
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
    if (!parent || parent.closest('script,style,noscript,[data-no-translate],[data-home-language]')) return;
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
    language = next === 'ar' ? 'ar' : 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    updateTree(document.documentElement);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.content = language === 'ar' ? (messages[descriptionSource] || descriptionSource) : descriptionSource;
    }
    buttons.forEach(button => {
      const active = button.dataset.homeLanguage === language;
      button.setAttribute('aria-pressed', String(active));
    });
    if (persist) { try { localStorage.setItem('rafiqLanguage', language); } catch { /* Storage is optional. */ } }
    observe();
    // Re-measure text-dependent scenes without restarting or replacing them.
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }
  observer = new MutationObserver(records => {
    observer.disconnect();
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
  window.RafiqHomeI18n = {setLanguage: apply, getLanguage: () => language};
})();

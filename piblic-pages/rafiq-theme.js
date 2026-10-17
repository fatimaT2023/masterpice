/* Shared browser-local appearance settings. Load in <head> on every page. */
(() => {
  'use strict';
  const key = 'rafiqAppearanceV1';
  const defaults = {primary:'#0b7a75',secondary:'#8f7af2',background:'#fffaf0',video:true,glass:36};
  const root = document.documentElement;
  const hex = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
  function normalize(value) {
    value = value && typeof value === 'object' ? value : {};
    return {primary:hex(value.primary)?value.primary:defaults.primary,secondary:hex(value.secondary)?value.secondary:defaults.secondary,background:hex(value.background)?value.background:defaults.background,video:typeof value.video==='boolean'?value.video:true,glass:Number.isFinite(value.glass)?Math.min(85,Math.max(20,value.glass)):36};
  }
  function rgb(color) {return [1,3,5].map(i=>parseInt(color.slice(i,i+2),16));}
  function blend(color,amount) {return '#'+rgb(color).map(c=>Math.round(c+(255-c)*amount).toString(16).padStart(2,'0')).join('');}
  function dark(color) {return '#'+rgb(color).map(c=>Math.round(c*.52).toString(16).padStart(2,'0')).join('');}
  function contrast(color) {
    const linear=rgb(color).map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});
    const luminance=linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
    return (luminance+.05)/.05 >= 1.05/(luminance+.05) ? '#000000' : '#ffffff';
  }
  function read() {try {const saved=localStorage.getItem(key);return saved?normalize(JSON.parse(saved)):null;}catch {return null;}}
  function apply(value) {
    const active=!!value, theme=normalize(value);
    root.toggleAttribute('data-rafiq-theme',active);
    root.toggleAttribute('data-theme-no-video',active&&!theme.video);
    const tokens = {'primary':theme.primary,'primary-deep':dark(theme.primary),'primary-tint':blend(theme.primary,.84),'primary-rgb':rgb(theme.primary).join(','),'on-primary':contrast(theme.primary),'secondary':theme.secondary,'secondary-deep':dark(theme.secondary),'secondary-tint':blend(theme.secondary,.84),'secondary-rgb':rgb(theme.secondary).join(','),'background':theme.background,'background-alt':blend(theme.background,.35),'background-rgb':rgb(theme.background).join(','),'ink':dark(theme.primary),'glass':String(theme.glass/100)};
    Object.entries(tokens).forEach(([name,val])=>active?root.style.setProperty('--theme-'+name,val):root.style.removeProperty('--theme-'+name));
    document.dispatchEvent(new CustomEvent('rafiq-theme-change',{detail:{active,theme}}));
    return theme;
  }
  function save(value) {const theme=normalize(value);localStorage.setItem(key,JSON.stringify(theme));apply(theme);return theme;}
  function reset() {localStorage.removeItem(key);apply(null);}
  window.RafiqTheme = {defaults,key,read,apply,save,reset,normalize};
  apply(read());
  window.addEventListener('storage',event=>{if(event.key===key||event.key===null)apply(read());});
})();

/* Explicit, child-scoped concern drafts. No booking is submitted by this module. */
(()=>{'use strict';
const KEY='rafiqBookingConcernDraft',TTL=86400000;
function preview(summary,answers){const full=summary.topicLabel+' | Age: '+summary.age+' | Reported loss of a previous skill: '+answers.change+' | Started: '+answers.onset+' | Context: '+answers.context+' | Example: '+answers.example;return {text:full.slice(0,500),shortened:full.length>500};}
function read(childId,storage=sessionStorage,now=Date.now()){const draft=JSON.parse(storage.getItem(KEY)||'null');const elapsed=now-Date.parse(draft?.createdAt||'');return draft?.childId===childId&&typeof draft.text==='string'&&draft.text.length<=500&&elapsed>=0&&elapsed<TTL?draft:null;}
function write(childId,text,storage=sessionStorage,now=new Date()){if(typeof text!=='string'||text.length>500)throw Error('Booking notes support up to 500 characters.');storage.setItem(KEY,JSON.stringify({childId,text,createdAt:now.toISOString()}));}
function clear(childId,storage=sessionStorage){const draft=JSON.parse(storage.getItem(KEY)||'null');if(draft?.childId===childId)storage.removeItem(KEY);}
window.RafiqConcernBooking={preview,read,write,clear};})();

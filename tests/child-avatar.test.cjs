/* No browser: exercise the avatar helper using a small DOM double. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class Node{
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.handlers={};this.style={removeProperty(k){delete this[k];}};this.value='1';}
 replaceChildren(...items){this.children=items;this.textContent='';}append(...items){this.children.push(...items);}after(){}focus(){}remove(){}
 setAttribute(k,v){this[k]=v;}addEventListener(k,fn){this.handlers[k]=fn;}
 getContext(){return {fillRect(){},drawImage(){}};}toDataURL(type,quality){assert.equal(type,'image/jpeg');assert.equal(quality,.8);return 'data:image/jpeg;base64,cropped';}
 showModal(){this.open=true;}close(value){this.returnValue=value;this.open=false;this.handlers.close?.();}
 querySelector(selector){return this.map[selector];}
 querySelectorAll(selector){if(selector==='[data-avatar]')return this.map['.avatar-options'].children;if(selector==='[data-color]')return this.map['.avatar-colors'].children;if(selector==='[type=file]')return [this.map['[data-file]'],this.map['[data-capture]']];return [];}
}
let lastDialog,writes=0,events=0;
let current={id:'child',name:'Lolo',gender:'female',photo:'data:image/jpeg;base64,old',customRecord:'preserve me'};
const document={documentElement:{lang:'en'},body:{append(){},classList:{add(){},remove(){}}},addEventListener(){},getElementById(){return null;},dispatchEvent(e){assert.equal(e.type,'rafiq-child-change');events++;},createElement(tag){const n=new Node(tag);if(tag==='dialog'){lastDialog=n;n.map={};for(const s of ['canvas','.avatar-picker-preview','[type=range]','.avatar-picker-status','[data-save]','.avatar-zoom','.avatar-options','.avatar-colors','.avatar-crop-wrap','[data-upload]','[data-camera]','[data-file]','[data-capture]','[data-remove]'])n.map[s]=new Node(s);}return n;}};
const ctx={document,window:{RafiqSetup:{readChildren:()=>[current],writeChildren(rows){assert.equal(rows.length,1);current=rows[0];writes++;}},addEventListener(){}},navigator:{},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},Image:class{constructor(){this.width=1024;this.height=512;}decode(){return Promise.resolve();}},Event:class{constructor(type){this.type=type;}},queueMicrotask};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../pearent-cycel/child-avatar.js'),'utf8'),ctx);
const api=ctx.window.RafiqChildAvatar;
(async()=>{
 const el=new Node('div');api.render(el,{name:'Lolo'});assert.equal(el.textContent,'L');
 api.render(el,{name:'Lolo',photo:'https://example.invalid/photo.jpg'});assert.equal(el.textContent,'L');assert.equal(el.children.length,0);
 api.render(el,current);assert.equal(el.children[0].src,current.photo);
 api.render(el,{name:'Lolo',avatar:'fox',avatarColor:'#f6d9e6'});assert(el.innerHTML.includes('<svg'));assert.equal(el.style.backgroundColor,'#f6d9e6');
 api.pick(current);let d=lastDialog;d.querySelector('.avatar-options').children[3].onclick();d.querySelector('[data-save]').onclick();assert.equal(current.avatar,'fox');assert.equal(current.photo,undefined);assert.equal(current.customRecord,'preserve me');assert.equal(events,1);
 api.pick(current);lastDialog.close('cancel');assert.equal(writes,1);
 api.pick(current);d=lastDialog;const input=d.querySelector('[data-file]');input.files=[{type:'image/jpeg',size:9*1024*1024}];input.onchange();assert.equal(d.querySelector('.avatar-picker-status').textContent,'Please choose a photo under 8 MB.');
 input.files=[{type:'text/plain',size:1}];input.onchange();assert.equal(d.querySelector('.avatar-picker-status').textContent,'Please choose an image.');
 input.files=[{type:'image/jpeg',size:1000}];input.onchange();await new Promise(setImmediate);assert.equal(d.querySelector('.avatar-picker-status').textContent,'');d.querySelector('[data-save]').onclick();assert.equal(current.photo,'data:image/jpeg;base64,cropped');assert.equal(current.avatar,undefined);assert.equal(current.customRecord,'preserve me');
 api.pick(current);d=lastDialog;d.querySelector('[data-remove]').onclick();d.querySelector('[data-save]').onclick();assert.equal(current.photo,undefined);assert.equal(current.avatar,undefined);assert.equal(events,3);
 console.log('PASS: local photo/illustration/initial fallback, file validation, JPEG crop, cancellation, removal, existing fields and change events.');
})().catch(error=>{console.error(error);process.exitCode=1;});

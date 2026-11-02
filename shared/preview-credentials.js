/* Local preview verification only; production requires server-side authentication. */
(() => {
 'use strict';
 const encode = value => new TextEncoder().encode(value);
 const hex = bytes => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
 async function derive(password, salt) {
  const key = await crypto.subtle.importKey('raw', encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encode(salt),iterations:210000,hash:'SHA-256'},key,256));
 }
 async function create(password) {
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  return {version:1,salt,hash:await derive(password,salt)};
 }
 async function verify(user,password) {
  const record=user.previewCredential;
  if(!record || record.version!==1) return false;
  return await derive(password,record.salt)===record.hash;
 }
 window.RafiqPreviewCredentials={create,verify};
})();

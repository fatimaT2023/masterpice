/* Local-first prototype. Replace this repository with authenticated cloud APIs later. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const allowed = new Set(['image/jpeg','image/png','image/webp','image/gif']);
  const errorText = error => error?.name === 'QuotaExceededError' ? 'Not enough browser storage. Download backups and free space before trying again.' : 'The photos could not be saved or loaded. Browser storage may be unavailable. Please retry.';
  let db, child, photos = [], selectedId, gridUrls = [], previewUrls = [], memoryUrl, busy = false;
  const release = urls => { urls.forEach(url => URL.revokeObjectURL(url)); return []; };
  const setStatus = message => { $('albumStatus').textContent = message; };
  function openDatabase() {
    return new Promise((resolve,reject) => {
      const request = indexedDB.open('rafiqChildAlbums',1);
      request.onupgradeneeded = () => {
        const store = request.result.createObjectStore('photos',{keyPath:'id'});
        store.createIndex('childId','childId',{unique:false});
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => setStatus('Close other album tabs and reload to finish opening photo storage.');
      request.onsuccess = () => {
        const result = request.result;
        result.onversionchange = () => { result.close(); $('openUpload').disabled = true; setStatus('Photo storage changed in another tab. Reload this page.'); };
        resolve(result);
      };
    });
  }
  function transaction(mode, action) {
    return new Promise((resolve,reject) => {
      const tx = db.transaction('photos',mode);
      let result;
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
      tx.onerror = () => {}; // The abort handler reports errors once.
      try { action(tx.objectStore('photos'), value => { result = value; }); }
      catch(error) { tx.abort(); reject(error); }
    });
  }
  const loadPhotos = () => transaction('readonly',(store,done) => {
    const request = store.index('childId').getAll(child.id);
    request.onsuccess = () => done(request.result);
  });
  const writePhotos = records => transaction('readwrite',store => records.forEach(record => store.put(record)));
  const removePhoto = id => transaction('readwrite',store => store.delete(id));
  function displayDate(date) { return new Date(date+'T12:00:00').toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}); }
  function render() {
    gridUrls = release(gridUrls);
    const grid = $('albumGrid'); grid.replaceChildren();
    $('photoCount').textContent = photos.length;
    $('albumSize').textContent = `${(photos.reduce((sum,p) => sum + p.blob.size,0)/1024/1024).toFixed(1)} MB stored locally`;
    const query = $('albumSearch').value.trim().toLocaleLowerCase();
    const sort = $('albumSort').value;
    const rows = photos.filter(p => `${p.title} ${p.description}`.toLocaleLowerCase().includes(query)).sort((a,b) => sort === 'added' ? b.createdAt.localeCompare(a.createdAt) : sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    $('albumEmpty').hidden = photos.length !== 0;
    if (!rows.length && photos.length) { const p = document.createElement('p'); p.textContent = 'No memories match your search.'; grid.append(p); }
    rows.forEach(photo => {
      const article = document.createElement('article'); article.className = 'album-card';
      const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label',`Open ${photo.title}`);
      const image = document.createElement('img'); image.src = URL.createObjectURL(photo.blob); gridUrls.push(image.src); image.alt = photo.title; image.loading = 'lazy';
      const caption = document.createElement('div'); caption.className = 'album-caption';
      const title = document.createElement('h3'); title.textContent = photo.title;
      const date = document.createElement('time'); date.dateTime = photo.date; date.textContent = displayDate(photo.date);
      const description = document.createElement('p'); description.textContent = photo.description;
      caption.append(title,date,description); button.append(image,caption); article.append(button); grid.append(article);
      button.onclick = () => openMemory(photo.id);
    });
  }
  async function refresh() { photos = await loadPhotos(); render(); }
  function openMemory(id) {
    const photo = photos.find(p => p.id === id && p.childId === child.id); if (!photo) return;
    selectedId = id;
    if (memoryUrl) URL.revokeObjectURL(memoryUrl);
    memoryUrl = URL.createObjectURL(photo.blob);
    $('memoryImage').src = memoryUrl; $('memoryImage').alt = photo.title;
    $('memoryTitle').value = photo.title; $('memoryDate').value = photo.date; $('memoryDescription').value = photo.description;
    $('downloadPhoto').href = memoryUrl; $('downloadPhoto').download = photo.filename;
    $('memoryStatus').textContent = ''; $('memoryDialog').showModal();
  }
  function validateFiles(files) {
    if (!files.length || files.length > 20) throw new Error('Choose between 1 and 20 photos.');
    for (const file of files) {
      if (!allowed.has(file.type)) throw new Error(`${file.name}: use JPEG, PNG, WebP or GIF.`);
      if (!file.size || file.size > 15*1024*1024) throw new Error(`${file.name}: the photo must be between 1 byte and 15 MB.`);
    }
  }
  async function checkImage(file) {
    // Decode before storing so renamed or damaged non-image files are rejected.
    const url = URL.createObjectURL(file);
    try {
      await new Promise((resolve,reject) => { const image = new Image(); image.onload = resolve; image.onerror = () => reject(new Error(`${file.name}: this image could not be opened.`)); image.src = url; });
    } finally { URL.revokeObjectURL(url); }
  }
  document.addEventListener('DOMContentLoaded',async () => {
    document.querySelectorAll('[data-close]').forEach(button => button.onclick = () => { if (!busy) $(button.dataset.close).close(); });
    document.querySelectorAll('.album-dialog').forEach(dialog => dialog.addEventListener('cancel',event => { if (busy) event.preventDefault(); }));
    $('memoryDialog').addEventListener('close',() => { if (memoryUrl) URL.revokeObjectURL(memoryUrl); memoryUrl = null; $('memoryImage').removeAttribute('src'); });
    $('uploadDialog').addEventListener('close',() => { previewUrls = release(previewUrls); $('uploadPreview').replaceChildren(); $('uploadForm').reset(); });
    $('albumSearch').oninput = render; $('albumSort').onchange = render;
    $('protectStorage').onclick = async () => {
      try { const granted = await navigator.storage?.persist?.(); setStatus(granted ? 'Persistent storage granted. Keep downloaded backups too; manually clearing site data still removes photos.' : 'Persistent storage was not granted or is unavailable. Keep downloaded backups of your photos.'); }
      catch { setStatus('Persistent storage is unavailable. Download your photos to keep backups.'); }
    };
    try {
      const saved = JSON.parse(localStorage.getItem('rafiqChildren') || '[]');
      const children = Array.isArray(saved) ? saved : [];
      child = children.find(c => c.id === localStorage.getItem('rafiqCurrentChildId')) || children[0];
      if (!child?.id) { $('noChild').hidden = false; return; }
      const title = (child.name || 'My Child') + "'s Album";
      $('albumTitle').textContent = title; document.title = `${title} | RAFIQ`;
      db = await openDatabase(); await refresh();
      $('openUpload').disabled = false; $('heroUpload').disabled = false; $('albumToolbar').hidden = false;
    } catch(error) { setStatus(errorText(error)); return; }
    $('openUpload').onclick = () => { $('uploadDate').value = today(); $('uploadStatus').textContent = ''; $('uploadDialog').showModal(); };
    $('heroUpload').onclick = $('openUpload').onclick;
    $('photoFiles').onchange = () => {
      previewUrls = release(previewUrls); $('uploadPreview').replaceChildren(); $('uploadStatus').textContent = '';
      try {
        const files = [...$('photoFiles').files]; validateFiles(files);
        files.forEach(file => { const image = document.createElement('img'); image.src = URL.createObjectURL(file); previewUrls.push(image.src); image.alt = file.name; $('uploadPreview').append(image); });
      } catch(error) { $('uploadStatus').textContent = error.message; }
    };
    $('uploadForm').onsubmit = async event => {
      event.preventDefault(); if (busy) return;
      const files = [...$('photoFiles').files];
      try { validateFiles(files); } catch(error) { $('uploadStatus').textContent = error.message; return; }
      busy = true; $('savePhotos').disabled = true; $('uploadStatus').textContent = 'Checking and saving photos…';
      try {
        for (const file of files) await checkImage(file);
        const records = files.map(file => ({id:crypto.randomUUID(),childId:child.id,blob:file,filename:file.name,title:file.name.replace(/\.[^.]+$/,'').slice(0,120) || 'A little memory',date:$('uploadDate').value,description:$('uploadDescription').value.trim(),createdAt:new Date().toISOString()}));
        await writePhotos(records);
        // A refresh failure must not suggest that a committed upload should be repeated.
        photos.push(...records); render();
        busy = false; $('uploadDialog').close(); setStatus(`${records.length} photo${records.length === 1 ? '' : 's'} saved in this browser. Download backups to keep them safe.`);
      } catch(error) { $('uploadStatus').textContent = error?.message?.includes('could not be opened') ? error.message : errorText(error); }
      finally { busy = false; $('savePhotos').disabled = false; }
    };
    $('memoryForm').onsubmit = async event => {
      event.preventDefault(); if (busy) return;
      const photo = photos.find(p => p.id === selectedId); if (!photo) return;
      const title = $('memoryTitle').value.trim(); if (!title) { $('memoryStatus').textContent = 'Enter a title.'; return; }
      busy = true;
      try {
        const updated = {...photo,title,date:$('memoryDate').value,description:$('memoryDescription').value.trim()};
        await writePhotos([updated]); photos = photos.map(p => p.id === updated.id ? updated : p); render(); $('memoryStatus').textContent = 'Details saved.'; $('memoryImage').alt = title;
      } catch(error) { $('memoryStatus').textContent = errorText(error); }
      finally { busy = false; }
    };
    $('deletePhoto').onclick = () => { if (busy) return; $('deleteStatus').textContent = ''; $('deleteDialog').showModal(); };
    $('confirmDelete').onclick = async () => {
      if (busy) return; busy = true; $('confirmDelete').disabled = true;
      try { await removePhoto(selectedId); photos = photos.filter(p => p.id !== selectedId); render(); busy = false; $('deleteDialog').close(); $('memoryDialog').close(); setStatus('Photo deleted from this browser.'); }
      catch(error) { $('deleteStatus').textContent = errorText(error); }
      finally { busy = false; $('confirmDelete').disabled = false; }
    };
    window.addEventListener('focus',() => { if (!busy && !$('memoryDialog').open && !$('uploadDialog').open) refresh().catch(error => setStatus(errorText(error))); });
  });
  window.addEventListener('pagehide',event => { if (event.persisted) return; release(gridUrls); release(previewUrls); if (memoryUrl) URL.revokeObjectURL(memoryUrl); db?.close(); });
})();

/* Decorative background, with user playback control and reduced-motion support. */
(() => {
  'use strict';
  const video = document.getElementById('dashboardBackgroundVideo');
  const button = document.getElementById('backgroundPlaybackToggle');
  if (!video || !button) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = reduced.matches;
  function syncButton() {
    button.textContent = video.paused ? '▶ Play background' : 'Ⅱ Pause background';
    button.setAttribute('aria-pressed', String(video.paused));
  }
  function syncPlayback() {
    if (document.hidden || userPaused) {video.pause();syncButton();return;}
    video.play().then(syncButton, syncButton);
  }
  button.addEventListener('click', () => {userPaused = !video.paused;syncPlayback();});
  video.addEventListener('play',syncButton);
  video.addEventListener('pause',syncButton);
  video.addEventListener('error',() => {video.hidden = true;button.hidden = true;});
  document.addEventListener('visibilitychange',syncPlayback);
  reduced.addEventListener('change',event => {userPaused = event.matches;syncPlayback();});
  syncPlayback();
})();

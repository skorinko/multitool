/* Site settings. Fill these in, then publish again:
 *   APP_STORE_URL  the app's App Store link, once it is live
 *   SUPPORT_EMAIL  the address for support and privacy questions
 * Until the link is set, buy buttons say "Coming soon to the App Store". */
const APP_STORE_URL = '';
const SUPPORT_EMAIL = 'macapps.support@icloud.com';

document.addEventListener('DOMContentLoaded', () => {
  for (const a of document.querySelectorAll('[data-buy]')) {
    const label = a.querySelector('[data-buy-label]');
    if (APP_STORE_URL) {
      a.href = APP_STORE_URL;
      label.textContent = a.dataset.buy || 'Download on the App Store';
    } else {
      label.textContent = 'Coming soon to the App Store';
    }
  }
  for (const el of document.querySelectorAll('[data-email]')) {
    const a = document.createElement('a');
    a.href = `mailto:${SUPPORT_EMAIL}`;
    a.textContent = SUPPORT_EMAIL;
    el.replaceChildren(a);
  }
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(Math.max(2026, new Date().getFullYear()));
  viewer();
});

/* Screenshots open full size: arrows or swipe for the next one, Escape or Close to leave. */
function viewer() {
  const strips = [...document.querySelectorAll('.strip')];
  if (!strips.length) return;
  const dlg = document.createElement('dialog');
  dlg.className = 'viewer';
  dlg.innerHTML = '<div class="v-count"></div><img alt=""><button class="v-prev" aria-label="Previous">‹</button>' +
    '<button class="v-next" aria-label="Next">›</button><button class="v-close">Close</button>';
  document.body.append(dlg);
  const img = dlg.querySelector('img'), count = dlg.querySelector('.v-count');
  let list = [], at = 0;
  const show = (i) => {
    at = (i + list.length) % list.length;
    img.src = list[at].dataset.full;
    img.alt = list[at].querySelector('img').alt;
    count.textContent = `${at + 1} / ${list.length}`;
    dlg.querySelector('.v-prev').hidden = dlg.querySelector('.v-next').hidden = list.length < 2;
  };
  for (const strip of strips) {
    const buttons = [...strip.querySelectorAll('button')];
    buttons.forEach((b, i) => b.addEventListener('click', () => { list = buttons; show(i); dlg.showModal(); }));
  }
  dlg.querySelector('.v-prev').onclick = () => show(at - 1);
  dlg.querySelector('.v-next').onclick = () => show(at + 1);
  dlg.querySelector('.v-close').onclick = () => dlg.close();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });
  let x0 = null;
  dlg.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

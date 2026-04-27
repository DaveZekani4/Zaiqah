

const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY   = 'zaiqah-theme';

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

applyTheme(getInitialTheme());

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
});

/* ---- PRELOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1800);
});

/* ---- CURSOR ---- */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
});

(function animateRing() {
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .dish-card, .menu-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('expand'); cursorRing.classList.add('expand'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('expand'); cursorRing.classList.remove('expand'); });
});

/* ---- HEADER SCROLL ---- */
const header = document.getElementById('header');
const btt    = document.getElementById('btt');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
  btt.classList.toggle('show', window.scrollY > 400);
});

/* ---- HAMBURGER / MOBILE NAV ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
});

function closeMob() {
  hamburger.classList.remove('active');
  mobileNav.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

/* ---- HERO SLIDER ---- */
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots   = document.querySelectorAll('.hero-dot');
let heroIdx = 0;

function setHeroSlide(i) {
  heroSlides[heroIdx].classList.remove('active');
  heroDots[heroIdx].classList.remove('active');
  heroIdx = i;
  heroSlides[heroIdx].classList.add('active');
  heroDots[heroIdx].classList.add('active');
}

heroDots.forEach(d => d.addEventListener('click', () => setHeroSlide(+d.dataset.slide)));
setInterval(() => setHeroSlide((heroIdx + 1) % heroSlides.length), 6500);

/* ---- DISHES DRAG SCROLL ---- */
const track = document.getElementById('dishesTrack');
let isDown = false, startX, scrollLeft;

track.addEventListener('mousedown',  e => { isDown = true; track.classList.add('grabbing'); startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('grabbing'); });
track.addEventListener('mouseup',    () => { isDown = false; track.classList.remove('grabbing'); });
track.addEventListener('mousemove',  e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - track.offsetLeft; track.scrollLeft = scrollLeft - (x - startX) * 1.4; });

/* ---- MENU TABS ---- */
document.querySelectorAll('.menu-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

/* ---- REVIEWS SLIDER ---- */
const revTrack = document.getElementById('reviewsTrack');
const revDots  = document.querySelectorAll('.rev-dot');
let revIdx = 0;

function setReview(i) {
  revDots[revIdx].classList.remove('active');
  revIdx = i;
  revTrack.style.transform = `translateX(-${revIdx * 100}%)`;
  revDots[revIdx].classList.add('active');
}

revDots.forEach(d => d.addEventListener('click', () => setReview(+d.dataset.rev)));
setInterval(() => setReview((revIdx + 1) % revDots.length), 7000);

/* ---- SCROLL REVEAL ---- */
const revEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: 0.12 });
revEls.forEach(el => revObs.observe(el));

/* ---- LIVE HOURS ---- */
function updateLiveHours() {
  const now  = new Date();
  const hour = now.getHours();
  const min  = now.getMinutes();
  const time = hour * 60 + min;
  const open = 12 * 60, close = 23 * 60;
  const isOpen = time >= open && time < close;

  // Main reservation badge
  const dotEl   = document.getElementById('liveDot');
  const statEl  = document.getElementById('liveStatus');
  if (dotEl && statEl) {
    if (isOpen) {
      dotEl.classList.remove('closed');
      statEl.textContent = 'Open Now · Closes at 11:00 pm';
    } else {
      dotEl.classList.add('closed');
      statEl.textContent = 'Currently Closed · Opens at 12:00 pm';
    }
  }

  // Topbar pill
  const topbarText = document.getElementById('topbarLiveText');
  if (topbarText) {
    topbarText.textContent = isOpen
      ? 'Open Now · Closes 11:00 pm'
      : 'Closed · Opens 12:00 pm';
  }
}
updateLiveHours();
setInterval(updateLiveHours, 60000);

/* ---- RESERVATION FORM ---- */
document.getElementById('resForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  btn.textContent = 'Confirmed!';
  btn.style.background = '#3d8c3d';
  btn.style.borderColor = '#3d8c3d';
  btn.disabled = true;
  document.getElementById('formSuccess').style.display = 'block';
  this.querySelectorAll('input, select, textarea').forEach(f => f.value = '');
  setTimeout(() => {
    btn.textContent = 'Confirm Reservation';
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.disabled = false;
    document.getElementById('formSuccess').style.display = 'none';
  }, 6000);
});

/* ---- NEWSLETTER ---- */
function subscribeNewsletter() {
  const inp = document.getElementById('newsletterEmail');
  if (!inp.value.includes('@')) { inp.style.borderColor = 'var(--rose)'; return; }
  inp.value = '✓ Subscribed — شكراً';
  inp.style.color = 'var(--gold)';
  inp.disabled = true;
}

/* ---- MIN DATE ---- */
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}
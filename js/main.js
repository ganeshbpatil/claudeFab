const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav__links');
hamburger.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '70px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(10,10,10,0.98)';
  navLinks.style.padding = '24px 32px';
  navLinks.style.gap = '20px';
  navLinks.style.borderBottom = '1px solid rgba(201,169,110,0.15)';
});
document.querySelectorAll('.nav__links a').forEach(link => { link.addEventListener('click', () => { navLinks.style.display = 'none'; }); });

const revealEls = document.querySelectorAll('.overview__text, .overview__visual, .amenity-card, .highlights__img-wrap, .highlights__content, .contact__info, .contact__form-wrap, .gallery .container');
revealEls.forEach((el, i) => { el.classList.add('reveal'); if (i % 3 === 1) el.classList.add('reveal-delay-1'); if (i % 3 === 2) el.classList.add('reveal-delay-2'); });
const revealObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }); }, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

const amenityCards = document.querySelectorAll('.amenity-card');
amenityCards.forEach((card, i) => { card.style.transitionDelay = `${i * 0.08}s`; });

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const item = galleryItems[index];
  const img = item.querySelector('img');
  if (img && img.style.display !== 'none') lbImg.src = img.src;
  lbCaption.textContent = item.querySelector('.gallery__caption').textContent.trim();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
function navigate(dir) {
  currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  lbImg.style.opacity = '0';
  setTimeout(() => {
    const img = item.querySelector('img');
    if (img && img.style.display !== 'none') lbImg.src = img.src;
    lbCaption.textContent = item.querySelector('.gallery__caption').textContent.trim();
    lbImg.style.opacity = '1';
  }, 200);
}
lbImg.style.transition = 'opacity 0.2s';
galleryItems.forEach((item, i) => { item.addEventListener('click', () => openLightbox(i)); });
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => navigate(-1));
lbNext.addEventListener('click', () => navigate(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (!lightbox.classList.contains('active')) return; if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') navigate(-1); if (e.key === 'ArrowRight') navigate(1); });

const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => { form.style.display = 'none'; formSuccess.classList.add('active'); }, 1200);
});

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active && !active.classList.contains('nav__cta')) active.style.color = 'var(--gold)';
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

const heroImg = document.querySelector('.hero__img');
window.addEventListener('scroll', () => { const y = window.scrollY; if (y < window.innerHeight && heroImg) heroImg.style.transform = `scale(1.0) translateY(${y * 0.25}px)`; }, { passive: true });

function animateCounter(el, target, suffix) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / 1600, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.hero__stat-num').forEach(el => {
      const text = el.textContent;
      const num = parseInt(text);
      const suffix = text.replace(/[0-9]/g, '');
      if (!isNaN(num)) animateCounter(el, num, suffix);
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.8 });
const statsBar = document.querySelector('.hero__stats');
if (statsBar) statsObserver.observe(statsBar);
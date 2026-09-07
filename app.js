'use strict';

// The page is complete without JavaScript; only optional controls are enhanced.
document.documentElement.classList.add('js');
document.getElementById('year').textContent = new Date().getFullYear();

// Anchor links reveal the biography before the browser scrolls to it.
const about = document.getElementById('about');
document.querySelectorAll('a[href="#about"]').forEach(link => {
  link.addEventListener('click', () => { about.open = true; });
});
if (window.location.hash === '#about') about.open = true;

const menu = document.getElementById('mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');

if (typeof menu.showModal === 'function') {
  menuToggle.hidden = false;
  menuToggle.addEventListener('click', () => {
    menu.showModal();
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-is-open');
    menuClose.focus();
  });
  menuClose.addEventListener('click', () => menu.close());
  menu.addEventListener('close', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-is-open');
  });
  // Native dialog handles Escape, focus containment and background inertness.
  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      menu.close();
      if (target) {
        target.setAttribute('tabindex', '-1');
        requestAnimationFrame(() => target.focus({ preventScroll: true }));
      }
    });
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
    if (event.matches && menu.open) menu.close();
  });
} else {
  document.documentElement.classList.remove('js');
}

const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
let copyReset;
if (navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    clearTimeout(copyReset);
    try {
      await navigator.clipboard.writeText('libic.oliver@gmail.com');
      copyButton.querySelector('span').textContent = 'Email copied';
      copyButton.querySelector('img').src = 'assets/icons/check.svg';
      copyStatus.textContent = 'Email address copied. Ready when you are.';
      copyReset = setTimeout(() => {
        copyButton.querySelector('span').textContent = 'Copy email';
        copyButton.querySelector('img').src = 'assets/icons/copy.svg';
        copyStatus.textContent = '';
      }, 5000);
    } catch {
      copyStatus.textContent = 'Copy is unavailable. You can select the email address above or click it to open your mail app.';
    }
  });
}

// A single current section keeps navigation unambiguous at section boundaries.
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const navSections = navLinks.map(link => document.querySelector(link.hash));
let navFramePending = false;
function updateCurrentSection() {
  const threshold = Math.min(240, window.innerHeight * 0.3);
  let current = 0;
  navSections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top <= threshold) current = index;
  });
  navLinks.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  navFramePending = false;
}
function scheduleNavUpdate() {
  if (navFramePending) return;
  navFramePending = true;
  requestAnimationFrame(updateCurrentSection);
}
window.addEventListener('scroll', scheduleNavUpdate, { passive: true });
window.addEventListener('resize', scheduleNavUpdate);
updateCurrentSection();

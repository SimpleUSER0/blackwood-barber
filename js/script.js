'use strict';

document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const mobileQuery = window.matchMedia('(max-width: 999px)');
let menuOpen = false;

function updateScrollLock() {
  document.body.classList.toggle('is-locked', menuOpen || Boolean(document.querySelector('dialog[open]')));
}

function setMenu(open, restoreFocus = false) {
  menuOpen = open;
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  updateScrollLock();
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => setMenu(!menuOpen));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.querySelectorAll('.brand').forEach(link => link.addEventListener('click', () => setMenu(false)));
mobileQuery.addEventListener('change', () => setMenu(false));
document.addEventListener('click', event => {
  if (menuOpen && !event.target.closest('.site-header')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (!menuOpen) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setMenu(false, true);
  }
  if (event.key === 'Tab') {
    const items = [menuButton, ...navigation.querySelectorAll('a, button')];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
});

// Native dialogs supply focus containment, background inertness and Escape handling.
const dialogOpeners = new WeakMap();
function openDialog(dialog, opener) {
  const openedFromMenu = menuOpen;
  setMenu(false);
  dialogOpeners.set(dialog, openedFromMenu ? menuButton : opener);
  dialog.showModal();
  updateScrollLock();
}
function closeDialog(dialog) {
  dialog.close();
  updateScrollLock();
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
  let pointerStartedOutside = false;
  const outside = event => {
    const box = dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  dialog.addEventListener('pointerdown', event => { pointerStartedOutside = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (pointerStartedOutside && event.target === dialog && outside(event)) closeDialog(dialog);
    pointerStartedOutside = false;
  });
  dialog.addEventListener('close', () => {
    updateScrollLock();
    const dialogOpener = dialogOpeners.get(dialog);
    if (dialogOpener && document.contains(dialogOpener)) dialogOpener.focus({preventScroll:true});
  });
});

// Demo form: no fetch, XMLHttpRequest, storage, analytics or third-party form service.
const bookingDialog = document.querySelector('#booking-dialog');
const bookingForm = document.querySelector('#booking-form');
const formView = document.querySelector('#booking-form-view');
const successView = document.querySelector('#booking-success');
const nameInput = document.querySelector('#booking-name');
const phoneInput = document.querySelector('#booking-phone');
const serviceInput = document.querySelector('#booking-service');
const dateInput = document.querySelector('#booking-date');
const errorMessage = document.querySelector('#booking-error');

function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
function resetBooking() {
  bookingForm.reset();
  [nameInput, phoneInput, dateInput].forEach(input => input.setCustomValidity(''));
  errorMessage.textContent = '';
  dateInput.min = todayLocal();
}
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => {
  resetBooking();
  formView.hidden = false;
  successView.hidden = true;
  bookingDialog.setAttribute('aria-labelledby', 'booking-dialog-title');
  bookingDialog.setAttribute('aria-describedby', 'booking-explanation');
  serviceInput.value = button.dataset.service || '';
  openDialog(bookingDialog, button);
  nameInput.focus({preventScroll:true});
}));
[nameInput, phoneInput, dateInput].forEach(input => input.addEventListener('input', () => {
  input.setCustomValidity('');
  errorMessage.textContent = '';
}));
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  if (nameInput.value.trim().length < 2) nameInput.setCustomValidity('Please enter a demo name with at least 2 characters.');
  const phone = phoneInput.value.trim();
  const digits = phone.replace(/\D/g, '');
  if (!/^[+\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
    phoneInput.setCustomValidity('Please use 7–15 digits for the demo phone number.');
  }
  dateInput.min = todayLocal();
  if (dateInput.value < dateInput.min) dateInput.setCustomValidity('Please select today or a future date.');
  if (!bookingForm.reportValidity()) {
    errorMessage.textContent = 'Please check the highlighted field and try again.';
    return;
  }
  const chosenDate = new Date(`${dateInput.value}T12:00:00`);
  document.querySelector('#booking-summary').textContent = `${serviceInput.value} · ${new Intl.DateTimeFormat('en-GB', {day:'numeric', month:'long', year:'numeric'}).format(chosenDate)}`;
  resetBooking();
  formView.hidden = true;
  successView.hidden = false;
  successView.querySelector('h2').id = 'success-title';
  bookingDialog.setAttribute('aria-labelledby', 'success-title');
  bookingDialog.removeAttribute('aria-describedby');
  successView.focus();
  bookingDialog.scrollTop = 0;
});
bookingDialog.addEventListener('close', resetBooking);

// Gallery: click/tap to open, Previous/Next, arrow keys, and horizontal swipes.
const galleryButtons = [...document.querySelectorAll('[data-gallery]')];
const lightbox = document.querySelector('#lightbox-dialog');
const lightboxImage = document.querySelector('#lightbox-image');
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[photoIndex];
  const source = button.querySelector('img');
  lightboxImage.src = source.src;
  lightboxImage.alt = source.alt;
  document.querySelector('#lightbox-title').textContent = button.querySelector('.gallery-label').firstChild.textContent.trim();
  document.querySelector('#lightbox-count').textContent = `${photoIndex + 1} / ${galleryButtons.length}`;
}
galleryButtons.forEach((button, index) => button.addEventListener('click', () => {
  showPhoto(index); openDialog(lightbox, button);
}));
document.querySelector('#photo-prev').addEventListener('click', () => showPhoto(photoIndex - 1));
document.querySelector('#photo-next').addEventListener('click', () => showPhoto(photoIndex + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let touchStart = null;
lightboxImage.addEventListener('touchstart', event => {
  touchStart = event.touches.length === 1 ? {x:event.touches[0].clientX, y:event.touches[0].clientY} : null;
}, {passive:true});
lightboxImage.addEventListener('touchend', event => {
  if (!touchStart || !event.changedTouches.length) return;
  const deltaX = event.changedTouches[0].clientX - touchStart.x;
  const deltaY = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) showPhoto(photoIndex + (deltaX < 0 ? 1 : -1));
  touchStart = null;
}, {passive:true});

// Social actions explain the demo rather than opening an invented account.
const socialDialog = document.querySelector('#social-dialog');
document.querySelectorAll('[data-social]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#social-message').textContent = `This is a ${button.dataset.social} demo button. BLACKWOOD BARBER is a fictional portfolio project and has no real ${button.dataset.social} account. No message has been sent.`;
  openDialog(socialDialog, button);
}));

if ('IntersectionObserver' in window) {
  const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin:'-15% 0px -65% 0px', threshold:0});
  navLinks.forEach(link => { const section = document.querySelector(link.hash); if (section) sectionObserver.observe(section); });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), {threshold:0.08});
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('will-reveal');
      revealObserver.observe(element);
    });
  }
}
document.querySelector('#year').textContent = new Date().getFullYear();

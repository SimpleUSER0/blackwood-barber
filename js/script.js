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
  menuButton.setAttribute('aria-label', open ? 'მენიუს დახურვა' : 'მენიუს გახსნა');
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

// Static click-to-chat: data stays in the page until the visitor opens WhatsApp.
// The recipient number is public configuration, never a secret/API credential.
const WHATSAPP_NUMBER = '995598623336';
function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
const generalMessage = 'გამარჯობა! მსურს BLACKWOOD BARBER-ში ვიზიტის დეტალების შეთანხმება.';
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = whatsappLink(generalMessage);
});
const bookingDialog = document.querySelector('#booking-dialog');
const bookingForm = document.querySelector('#booking-form');
const formView = document.querySelector('#booking-form-view');
const successView = document.querySelector('#booking-success');
const nameInput = document.querySelector('#booking-name');
const phoneInput = document.querySelector('#booking-phone');
const serviceInput = document.querySelector('#booking-service');
const dateInput = document.querySelector('#booking-date');
const timeInput = document.querySelector('#booking-time');
const errorMessage = document.querySelector('#booking-error');
const requestPreview = document.querySelector('#whatsapp-preview');
const whatsappButton = document.querySelector('#booking-whatsapp');
const summary = document.querySelector('#booking-summary');
const copyStatus = document.querySelector('#copy-status');

function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
function clearPreparedRequest() {
  requestPreview.textContent = '';
  summary.textContent = '';
  whatsappButton.removeAttribute('href');
  copyStatus.textContent = '';
}
function resetBooking() {
  bookingForm.reset();
  [nameInput, phoneInput, serviceInput, dateInput, timeInput].forEach(input => input.setCustomValidity(''));
  errorMessage.textContent = '';
  dateInput.min = todayLocal();
  clearPreparedRequest();
}
function showBookingForm() {
  formView.hidden = false;
  successView.hidden = true;
  bookingDialog.setAttribute('aria-labelledby', 'booking-dialog-title');
  bookingDialog.setAttribute('aria-describedby', 'booking-explanation');
}
document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => {
  resetBooking();
  showBookingForm();
  serviceInput.value = button.dataset.service || '';
  openDialog(bookingDialog, button);
  nameInput.focus({preventScroll:true});
}));
[nameInput, phoneInput, serviceInput, dateInput, timeInput].forEach(input => input.addEventListener('input', () => {
  input.setCustomValidity('');
  errorMessage.textContent = '';
}));
bookingForm.noValidate = true;
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  [nameInput, phoneInput, serviceInput, dateInput, timeInput].forEach(input => input.setCustomValidity(''));
  if (nameInput.value.trim().length < 2) nameInput.setCustomValidity('სახელში შეიყვანე სულ მცირე 2 სიმბოლო.');
  const phone = phoneInput.value.trim();
  const digits = phone.replace(/\D/g, '');
  if (phone && (!/^[+\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15)) {
    phoneInput.setCustomValidity('ტელეფონის ნომერი უნდა შეიცავდეს 7–15 ციფრს.');
  }
  if (!serviceInput.value) serviceInput.setCustomValidity('აირჩიე სერვისი.');
  dateInput.min = todayLocal();
  if (!dateInput.value) dateInput.setCustomValidity('აირჩიე სასურველი თარიღი.');
  else if (dateInput.value < dateInput.min || !dateInput.validity.valid) dateInput.setCustomValidity('აირჩიე დღევანდელი ან მომავალი სწორი თარიღი.');
  if (timeInput.value && !timeInput.validity.valid) timeInput.setCustomValidity('აირჩიე სწორი საათი, 15-წუთიანი ინტერვალით.');
  if (!bookingForm.reportValidity()) {
    errorMessage.textContent = 'გადაამოწმე მონიშნული ველი და სცადე ხელახლა.';
    return;
  }
  const chosenDate = new Date(`${dateInput.value}T12:00:00`);
  const months = ['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'];
  const dateLabel = `${chosenDate.getDate()} ${months[chosenDate.getMonth()]} ${chosenDate.getFullYear()}`;
  const selectedOption = serviceInput.selectedOptions[0].textContent;
  // textContent and URL encoding keep visitor input as text, including &, + and Georgian.
  const message = [
    'BLACKWOOD BARBER — ვიზიტის მოთხოვნა',
    'გამარჯობა! მსურს ვიზიტის დაჯავშნა.',
    `სახელი: ${nameInput.value.trim()}`,
    ...(phone ? [`საკონტაქტო ტელეფონი: ${phone}`] : []),
    `სერვისი: ${selectedOption}`,
    `სასურველი თარიღი: ${dateLabel}`,
    ...(timeInput.value ? [`სასურველი საათი: ${timeInput.value}`] : []),
    'გთხოვთ, დამიდასტუროთ თავისუფალი დრო.'
  ].join('\n');
  summary.textContent = `${serviceInput.value} · ${dateLabel}${timeInput.value ? ` · ${timeInput.value}` : ''}`;
  requestPreview.textContent = message;
  whatsappButton.href = whatsappLink(message);
  copyStatus.textContent = '';
  formView.hidden = true;
  successView.hidden = false;
  bookingDialog.setAttribute('aria-labelledby', 'success-title');
  bookingDialog.removeAttribute('aria-describedby');
  successView.focus();
  bookingDialog.scrollTop = 0;
});
document.querySelector('#booking-edit').addEventListener('click', () => {
  clearPreparedRequest();
  showBookingForm();
  nameInput.focus();
});
document.querySelector('#copy-request').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(requestPreview.textContent);
    copyStatus.textContent = 'ტექსტი დაკოპირებულია. გაგზავნა თავად უნდა დაადასტურო.';
  } catch {
    copyStatus.textContent = 'კოპირება მიუწვდომელია. მონიშნე ზემოთ მოცემული ტექსტი და დააკოპირე ხელით.';
  }
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

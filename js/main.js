/* ===========================================================
   BISTA PVT LTD — MAIN JAVASCRIPT
   =========================================================== */

// Mobile menu toggle
function toggleMobileMenu() {
  const nav = document.querySelector('.nav-links');
  nav.classList.toggle('mobile-open');
}

// Generic toast
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ===================== EMAIL DELIVERY (FormSubmit relay — no backend required) ===================== */
const ENQUIRY_EMAIL = 'covid19positivepatient@gmail.com';

async function sendEnquiryEmail(form, subject) {
  const formData = new FormData(form);
  formData.append('_subject', subject);
  formData.append('_captcha', 'false');
  formData.append('_template', 'table');
  const res = await fetch('https://formsubmit.co/ajax/' + ENQUIRY_EMAIL, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData
  });
  if (!res.ok) throw new Error('Email relay failed');
  return res;
}

/* ===================== CONTACT FORM (full form on Contact page) ===================== */
function submitContactForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const name = form.querySelector('[name="name"]');
  const phone = form.querySelector('[name="phone"]');
  if (name && !name.value.trim()) { alert('Please enter your name.'); return; }
  if (phone && !phone.value.trim()) { alert('Please enter your phone number.'); return; }
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
  sendEnquiryEmail(form, 'New Enquiry — Bista Pvt Ltd Website')
    .then(() => {
      showToast('✅ Enquiry received! Our team will respond within 24 hours.');
      form.reset();
    })
    .catch(() => {
      showToast('⚠️ Could not send right now — please call us at +91 90880 27179.');
    })
    .finally(() => {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Enquiry →'; }
    });
}

/* ===================== LEAD FORM MODAL ===================== */
function openLeadForm(source) {
  const modal = document.getElementById('leadModal');
  if (!modal) return;
  const sourceField = document.getElementById('leadSource');
  if (sourceField) sourceField.value = source || 'General Enquiry';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLeadForm() {
  const modal = document.getElementById('leadModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
function submitLeadForm(e) {
  e.preventDefault();
  const form = document.getElementById('leadForm');
  const name = form.querySelector('[name="name"]');
  const phone = form.querySelector('[name="phone"]');
  if (name && !name.value.trim()) { alert('Please enter your name.'); return; }
  if (phone && !phone.value.trim()) { alert('Please enter your phone number.'); return; }
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
  sendEnquiryEmail(form, 'New Enquiry — Bista Pvt Ltd Website')
    .then(() => {
      closeLeadForm();
      showToast('✅ Enquiry received! Our team will get back to you within 24 hours.');
      form.reset();
    })
    .catch(() => {
      showToast('⚠️ Could not send right now — please call us at +91 90880 27179.');
    })
    .finally(() => {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Enquiry →'; }
    });
}
document.addEventListener('click', function (e) {
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    closeLeadForm();
  }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLeadForm();
});

/* ===================== HERO SLIDER — 5 ANIMATED SLIDES ===================== */
(function () {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.hero-slide');
  const tabs = slider.querySelectorAll('.hero-tab');
  const dotsWrap = slider.querySelector('.hero-dots');
  let index = 0;
  let timer = null;
  const DURATION = 5000;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, si) => s.classList.toggle('active', si === index));
    tabs.forEach((t, ti) => t.classList.toggle('active', ti === index));
    if (dotsWrap) dotsWrap.querySelectorAll('.hero-dot').forEach((d, di) => d.classList.toggle('active', di === index));
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
  function play() { pause(); timer = setInterval(next, DURATION); }
  function pause() { clearInterval(timer); }

  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { goTo(i); play(); });
      dotsWrap.appendChild(dot);
    });
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', () => { goTo(parseInt(tab.dataset.tab, 10)); play(); });
  });
  const nextBtn = slider.querySelector('.hero-arrow.next');
  const prevBtn = slider.querySelector('.hero-arrow.prev');
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); play(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); play(); });

  slider.addEventListener('mouseenter', pause);
  slider.addEventListener('mouseleave', play);
  let startX = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; pause(); }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 40) prev();
    else if (diff < -40) next();
    play();
  }, { passive: true });

  goTo(0);
  play();
})();

/* ===================== FAQ ACCORDION ===================== */
document.addEventListener('click', function (e) {
  const q = e.target.closest('.faq-q');
  if (!q) return;
  const item = q.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
});

// Smooth scroll for in-page anchors
document.addEventListener('click', function (e) {
  const target = e.target.closest('a[href^="#"]');
  if (target && target.getAttribute('href').length > 1) {
    const el = document.querySelector(target.getAttribute('href'));
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

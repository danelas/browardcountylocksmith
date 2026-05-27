// === Broward County Locksmith ===

// Footer year
document.getElementById('yr').textContent = new Date().getFullYear();

// IntersectionObserver — reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Toast helper
const toast = (msg, ms = 4000) => {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), ms);
};

// Phone number formatter
const phone = document.getElementById('phone');
phone?.addEventListener('input', (e) => {
  const d = e.target.value.replace(/\D/g, '').slice(0, 10);
  let out = d;
  if (d.length > 6) out = `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  else if (d.length > 3) out = `(${d.slice(0,3)}) ${d.slice(3)}`;
  else if (d.length > 0) out = `(${d}`;
  e.target.value = out;
});

// Lead form (wire to Formspree / Make.com / your CRM)
const form = document.getElementById('leadForm');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  if (!/^\d{5}$/.test(data.zip)) { form.zip.focus(); toast('Please enter a valid 5-digit ZIP.'); return; }
  if (!data.service) { form.service.focus(); toast('Pick a service so we can quote you.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { form.email.focus(); toast('Please enter a valid email.'); return; }
  const phoneDigits = (data.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10) { form.phone.focus(); toast('Please enter a valid phone number.'); return; }

  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Sending…';

  // TODO: wire to your endpoint
  // await fetch('https://formspree.io/f/XXXX', { method:'POST', headers:{Accept:'application/json'}, body: new FormData(form) });
  await new Promise((r) => setTimeout(r, 1200));

  btn.disabled = false;
  btn.textContent = '✓ Sent — we\'ll text you a quote shortly';
  toast(`Thanks ${data.fname}! A Broward dispatcher will text your quote within 15 minutes.`, 5000);
  setTimeout(() => { btn.innerHTML = original; form.reset(); }, 4500);
});

// Smooth scroll & focus management
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const tgt = document.querySelector(id);
    if (!tgt) return;
    e.preventDefault();
    tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    tgt.setAttribute('tabindex', '-1');
    tgt.focus({ preventScroll: true });
  });
});

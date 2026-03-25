/* ==========================================================
   E-Portfolio — script.js
   ========================================================== */

'use strict';

/* ----------------------------------------------------------
   1. ROUTER
---------------------------------------------------------- */
const PAGES   = { about: 'page-about', certs: 'page-certs', projects: 'page-projects', contact: 'page-contact' };
const NAV_IDS = { about: 'nav-about',  certs: 'nav-certs',  projects: 'nav-projects',  contact: 'nav-contact'  };
let current = 'about';

function navigate(id) {
  if (id === current) return;

  const oldPage = document.getElementById(PAGES[current]);
  const newPage = document.getElementById(PAGES[id]);

  // Slide old page out
  oldPage.style.transition = 'opacity .3s ease, transform .3s ease';
  oldPage.style.opacity    = '0';
  oldPage.style.transform  = 'translateY(-16px)';

  setTimeout(() => {
    oldPage.classList.remove('active');
    oldPage.style.cssText = '';

    // Slide new page in
    newPage.style.opacity   = '0';
    newPage.style.transform = 'translateY(28px)';
    newPage.classList.add('active');

    requestAnimationFrame(() => {
      newPage.style.transition = 'opacity .45s ease, transform .45s ease';
      newPage.style.opacity    = '1';
      newPage.style.transform  = 'translateY(0)';
      observeReveals();
    });
  }, 280);

  // Update nav buttons
  document.getElementById(NAV_IDS[current]).classList.remove('active');
  document.getElementById(NAV_IDS[id]).classList.add('active');
  current = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ----------------------------------------------------------
   2. SCROLL REVEAL  (IntersectionObserver)
---------------------------------------------------------- */
function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}
observeReveals();


/* ----------------------------------------------------------
   3. CUSTOM MAGNETIC CURSOR
---------------------------------------------------------- */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

const mouse   = { x: 0, y: 0 };
const cursor  = { x: 0, y: 0 };
const ringPos = { x: 0, y: 0 };

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

(function animateCursor() {
  cursor.x += (mouse.x - cursor.x) * 0.9;
  cursor.y += (mouse.y - cursor.y) * 0.9;
  cur.style.left = cursor.x + 'px';
  cur.style.top  = cursor.y + 'px';

  ringPos.x += (mouse.x - ringPos.x) * 0.12;
  ringPos.y += (mouse.y - ringPos.y) * 0.12;
  ring.style.left = ringPos.x + 'px';
  ring.style.top  = ringPos.y + 'px';

  requestAnimationFrame(animateCursor);
})();

const HOVER_TARGETS = 'button, a, input, textarea, .skill-card, .cert-card, .project-card, .contact-item, .social-btn';
document.querySelectorAll(HOVER_TARGETS).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform    = 'translate(-50%,-50%) scale(2)';
    cur.style.background   = 'var(--accent2)';
    ring.style.width       = '58px';
    ring.style.height      = '58px';
    ring.style.opacity     = '0.25';
    ring.style.borderColor = 'var(--accent2)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform    = 'translate(-50%,-50%) scale(1)';
    cur.style.background   = 'var(--accent)';
    ring.style.width       = '38px';
    ring.style.height      = '38px';
    ring.style.opacity     = '0.6';
    ring.style.borderColor = 'var(--accent)';
  });
});


/* ----------------------------------------------------------
   4. PARTICLE TRAIL  (canvas overlay)
---------------------------------------------------------- */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9997;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = [];

  document.addEventListener('mousemove', e => {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x:     e.clientX,
        y:     e.clientY,
        vx:    (Math.random() - 0.5) * 1.5,
        vy:    (Math.random() - 0.5) * 1.5 - 0.8,
        life:  1,
        decay: 0.03 + Math.random() * 0.03,
        r:     2 + Math.random() * 3,
        hue:   Math.random() > 0.5 ? '0,245,196' : '123,97,255',
      });
    }
  });

  (function renderParticles() {
    ctx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += 0.04;
      p.life -= p.decay;

      if (p.life <= 0) { particles.splice(i, 1); continue; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.life * 0.6})`;
      ctx.fill();
    }
    requestAnimationFrame(renderParticles);
  })();
})();


/* ----------------------------------------------------------
   5. TYPEWRITER EFFECT  (hero description)
---------------------------------------------------------- */
(function initTypewriter() {
  const target = document.querySelector('.hero-desc');
  if (!target) return;

  const original = target.textContent.trim();
  target.textContent = '';
  target.style.borderRight = '2px solid var(--accent)';

  let i = 0;

  function type() {
    if (i < original.length) {
      target.textContent += original[i++];
      setTimeout(type, 22);
    } else {
      let blinks = 0;
      const blink = setInterval(() => {
        target.style.borderRight = blinks % 2 === 0 ? 'none' : '2px solid var(--accent)';
        if (++blinks > 5) { clearInterval(blink); target.style.borderRight = 'none'; }
      }, 400);
    }
  }

  setTimeout(type, 900);
})();


/* ----------------------------------------------------------
   6. PARALLAX AMBIENT BLOBS
---------------------------------------------------------- */
(function initParallax() {
  const blob1 = document.querySelector('.blob1');
  const blob2 = document.querySelector('.blob2');
  if (!blob1 || !blob2) return;

  document.addEventListener('mousemove', e => {
    const px = (e.clientX / window.innerWidth  - 0.5) * 30;
    const py = (e.clientY / window.innerHeight - 0.5) * 30;
    blob1.style.transform = `translate(${px * 0.6}px, ${py * 0.6}px)`;
    blob2.style.transform = `translate(${-px * 0.4}px, ${-py * 0.4}px)`;
  });
})();


/* ----------------------------------------------------------
   7. STAT COUNTER ANIMATION
---------------------------------------------------------- */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target    = parseInt(el.textContent);
    const suffix    = el.querySelector('span')?.textContent || '';
    let count       = 0;
    const steps     = 50;
    const increment = Math.ceil(target / steps);

    const timer = setInterval(() => {
      count = Math.min(count + increment, target);
      el.innerHTML = count + '<span>' + suffix + '</span>';
      if (count >= target) clearInterval(timer);
    }, 1200 / steps);
  });
}
setTimeout(animateCounters, 500);


/* ----------------------------------------------------------
   8. LIGHTBOX
---------------------------------------------------------- */
function openLightbox(src, caption) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.querySelectorAll('.cert-image').forEach(img => {
  img.addEventListener('click', () => {
    const caption = img.closest('.cert-card')?.querySelector('.cert-title')?.textContent || '';
    openLightbox(img.src, caption);
  });
});


/* ----------------------------------------------------------
   9. CONTACT FORM  (Formspree)
---------------------------------------------------------- */
async function submitForm() {
  const FIELDS = ['fname', 'lname', 'femail', 'fsubject', 'fmessage'];

  // Validate
  for (const id of FIELDS) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.focus();
      el.style.borderColor = 'rgba(255,90,90,.55)';
      el.style.boxShadow   = '0 0 0 3px rgba(255,90,90,.1)';
      setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 1600);
      return;
    }
  }

  const btn = document.querySelector('.form-submit');
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  const fname    = document.getElementById('fname').value.trim();
  const lname    = document.getElementById('lname').value.trim();
  const email    = document.getElementById('femail').value.trim();
  const subject  = document.getElementById('fsubject').value.trim();
  const message  = document.getElementById('fmessage').value.trim();

  try {
    // ⚠️ Replace YOUR_FORM_ID below with the ID from your Formspree dashboard
    const res = await fetch('https://formspree.io/f/mvzvppog', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name:    `${fname} ${lname}`,
        email,
        subject,
        message,
      }),
    });

    if (res.ok) {
      FIELDS.forEach(id => (document.getElementById(id).value = ''));
      showToast('✅ Message sent! I\'ll get back to you soon.');
    } else {
      showToast('❌ Something went wrong. Please try again.');
    }
  } catch (err) {
    showToast('❌ Network error. Please try again.');
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Send Message ✦';
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
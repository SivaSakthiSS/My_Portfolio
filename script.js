/* ===================================================
   SIVASAKTHI S — Portfolio JavaScript
   =================================================== */

'use strict';

// ── Loader ────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1200);
});

// ── Custom Cursor ─────────────────────────────────
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .glass-card, .chip').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});

// ── Scroll Progress ───────────────────────────────
const scrollProgress = document.getElementById('scrollProgress');
const backToTop      = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const docH     = document.documentElement.scrollHeight - window.innerHeight;
  const pct      = Math.min((scrolled / docH) * 100, 100);
  scrollProgress.style.width = pct + '%';
  backToTop.classList.toggle('visible', scrolled > 300);
  updateNavOnScroll(scrolled);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Navbar ────────────────────────────────────────
const navbar = document.getElementById('navbar');

function updateNavOnScroll(scrollY) {
  navbar.classList.toggle('scrolled', scrollY > 50);
  updateActiveNav();
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  let current    = '';

  sections.forEach(s => {
    if (scrollY >= s.offsetTop) current = s.id;
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === '#' + current);
  });
}

// ── Mobile Menu ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── Dark / Light Mode ─────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
let   isDark      = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
});

// ── Typing Effect ─────────────────────────────────
const typingEl    = document.getElementById('typingText');
const typingWords = ['Software Developer', 'Java Programmer', 'Full-Stack Learner', 'Problem Solver', 'IT Student'];
let   wordIndex   = 0;
let   charIndex   = 0;
let   isDeleting  = false;

function typeWriter() {
  const current = typingWords[wordIndex];
  const speed   = isDeleting ? 60 : 110;

  typingEl.textContent = current.substring(0, charIndex);

  if (!isDeleting && charIndex === current.length) {
    setTimeout(() => { isDeleting = true; typeWriter(); }, 1800);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex  = (wordIndex + 1) % typingWords.length;
  }

  charIndex += isDeleting ? -1 : 1;
  setTimeout(typeWriter, speed);
}

setTimeout(typeWriter, 800);

// ── Scroll Reveal ─────────────────────────────────
const animateEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');

      // Trigger skill bars when skills section enters view
      if (entry.target.closest('#skills')) {
        animateSkillBars();
      }

      // Trigger counters when about section enters view
      if (entry.target.closest('#about')) {
        animateCounters();
      }
    }
  });
}, { threshold: 0.12 });

animateEls.forEach(el => observer.observe(el));

// ── Skill Bars ────────────────────────────────────
let skillsAnimated = false;

function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const w = bar.getAttribute('data-width');
    requestAnimationFrame(() => { bar.style.width = w + '%'; });
  });
}

// ── Animated Counters ─────────────────────────────
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1500;
    const step     = Math.max(1, Math.floor(duration / target));
    let   current  = 0;

    const interval = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, step);
  });
}

// ── Particle Background ───────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let   w, h;
  const particles = [];
  const COUNT     = 60;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x     = Math.random() * w;
    this.y     = Math.random() * h;
    this.r     = Math.random() * 1.5 + 0.5;
    this.vx    = (Math.random() - 0.5) * 0.3;
    this.vy    = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
  };

  for (let i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) p.reset();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,130,246,${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59,130,246,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

// ── GitHub Contribution Grid ──────────────────────
(function buildContribGrid() {
  const grid  = document.getElementById('contribGrid');
  const cells = 52 * 7;
  const levels = [
    'rgba(255,255,255,0.04)',
    'rgba(59,130,246,0.2)',
    'rgba(59,130,246,0.4)',
    'rgba(59,130,246,0.65)',
    'rgba(59,130,246,0.9)',
  ];

  for (let i = 0; i < cells; i++) {
    const cell = document.createElement('div');
    cell.className = 'contrib-cell';
    const lvl = Math.random() < 0.35 ? 0 : Math.floor(Math.random() * 4) + 1;
    cell.style.background    = levels[lvl];
    cell.style.borderRadius  = '2px';
    grid.appendChild(cell);
  }
})();

// ── Contact Form ──────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const fields = [
    { id: 'contactName',    check: v => v.trim().length >= 2,  msg: 'Please enter your name.' },
    { id: 'contactEmail',   check: v => validateEmail(v),       msg: 'Please enter a valid email.' },
    { id: 'contactMessage', check: v => v.trim().length >= 10,  msg: 'Message must be at least 10 characters.' },
  ];

  fields.forEach(({ id, check, msg }) => {
    const input    = document.getElementById(id);
    const errorEl  = input.nextElementSibling;
    const ok       = check(input.value);
    errorEl.textContent        = ok ? '' : msg;
    input.style.borderColor    = ok ? '' : '#f87171';
    if (!ok) valid = false;
  });

  if (!valid) return;

  // Simulate form submission
  const btn = contactForm.querySelector('button[type=submit]');
  btn.disabled      = true;
  btn.innerHTML     = '<i class="fas fa-spinner fa-spin"></i> Sending…';

  setTimeout(() => {
    contactForm.reset();
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    formSuccess.hidden = false;
    setTimeout(() => { formSuccess.hidden = true; }, 4000);
  }, 1500);
});

// Clear error on input
contactForm.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => {
    el.style.borderColor = '';
    const err = el.nextElementSibling;
    if (err && err.classList.contains('field-error')) err.textContent = '';
  });
});

// ── Smooth Scroll for Anchor Links ────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Card Tilt Effect ──────────────────────────────
document.querySelectorAll('.project-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

// ── Image Lazy Loading ────────────────────────────
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.src = target.dataset.src;
        lazyObserver.unobserve(target);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
}
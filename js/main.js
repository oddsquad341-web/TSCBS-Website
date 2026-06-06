/* ════════════════════════════════════════
   TSCBS — Premium JS
════════════════════════════════════════ */

// ─── CURSOR ───
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Cursor states
document.querySelectorAll('a, button, .product-card, .category-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.background = 'var(--rose-bright)';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.background = 'var(--gold)';
  });
});

// ─── PARTICLES ───
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  const GOLD = '201,152,74';
  const ROSE = '212,84,122';

  particles = Array.from({ length: 60 }, () => ({
    x: randBetween(0, W),
    y: randBetween(0, H),
    vx: randBetween(-0.15, 0.15),
    vy: randBetween(-0.3, -0.05),
    r: randBetween(0.5, 2),
    alpha: randBetween(0.2, 0.7),
    color: Math.random() > 0.5 ? GOLD : ROSE,
    life: randBetween(0, Math.PI * 2),
    speed: randBetween(0.008, 0.02),
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.life += p.speed;
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = randBetween(0, W); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      const a = p.alpha * (0.5 + 0.5 * Math.sin(p.life));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${a})`;
      ctx.fill();

      // Draw sparkle cross on larger particles
      if (p.r > 1.5) {
        ctx.strokeStyle = `rgba(${p.color},${a * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x - p.r * 2.5, p.y);
        ctx.lineTo(p.x + p.r * 2.5, p.y);
        ctx.moveTo(p.x, p.y - p.r * 2.5);
        ctx.lineTo(p.x, p.y + p.r * 2.5);
        ctx.stroke();
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

initParticles();

// ─── STICKY HEADER ───
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── SCROLL REVEAL ───
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal, .product-card, .category-card, .testimonial-card, .offer-card, .trust-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    obs.observe(el);
  });
}

// ─── 3D TILT ───
function initTilt() {
  document.querySelectorAll('.product-card, .hero-card, .offer-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ─── CART ───
let cart = JSON.parse(localStorage.getItem('tscbs_cart') || '[]');

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) badge.textContent = cart.length;
}

function addToCart(name, price) {
  cart.push({ name, price, id: Date.now() });
  localStorage.setItem('tscbs_cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`✦ ${name} — Added to cart`);
}

// ─── WISHLIST ───
let wishlist = JSON.parse(localStorage.getItem('tscbs_wishlist') || '[]');

function toggleWishlist(btn, productName) {
  const idx = wishlist.indexOf(productName);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.textContent = '♡';
  } else {
    wishlist.push(productName);
    btn.classList.add('active');
    btn.textContent = '♥';
    showToast(`♥ ${productName} — Saved to wishlist`);
  }
  localStorage.setItem('tscbs_wishlist', JSON.stringify(wishlist));
}

// ─── TOAST ───
let toastEl;
function showToast(msg) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.style.opacity = '1';
  toastEl.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2500);
}

// ─── TABS ───
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-section') || document;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      if (target) {
        group.querySelectorAll('.tab-panel').forEach(p => {
          p.style.display = p.dataset.panel === target ? 'grid' : 'none';
        });
      }
    });
  });
}

// ─── SEARCH ───
function initSearch() {
  const btn = document.querySelector('.search-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const q = prompt('Search TSCBS...');
    if (q) window.location.href = `pages/shop.html?q=${encodeURIComponent(q)}`;
  });
}

// ─── NEWSLETTER ───
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input?.value) {
      showToast('✦ Welcome to the family — Subscribed!');
      input.value = '';
    }
  });
}

// ─── COUNTER ANIMATION ───
function animateCounter(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    const suffix = el.dataset.suffix || '';
    el.textContent = (target >= 1000
      ? Math.round(current / 1000) + 'K'
      : Math.round(current)) + suffix;
    if (current >= target) clearInterval(timer);
  }, 25);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const val = parseInt(el.dataset.count);
        if (val) animateCounter(el, val);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initTabs();
  initScrollReveal();
  initTilt();
  initSearch();
  initNewsletter();
  initCounters();
});

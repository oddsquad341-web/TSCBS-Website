/* ════════════════════════════════════════
   TSCBS — ₹10,00,000 JS Engine
   Cinematic · Particles · Full Luxury
════════════════════════════════════════ */

/* ─── PAGE LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

/* ─── CUSTOM CURSOR ─── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
});

(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animateRing);
})();

document.addEventListener('mouseover', e => {
  const t = e.target.closest('a, button, .product-card, .cat-card, .offer-card');
  if (t && dot) {
    dot.style.width = '10px'; dot.style.height = '10px';
    dot.style.background = 'var(--rose-bright)';
    dot.style.boxShadow = '0 0 15px var(--rose-bright)';
  }
});
document.addEventListener('mouseout', e => {
  const t = e.target.closest('a, button, .product-card, .cat-card, .offer-card');
  if (t && dot) {
    dot.style.width = '6px'; dot.style.height = '6px';
    dot.style.background = 'var(--gold-bright)';
    dot.style.boxShadow = '0 0 12px var(--gold-bright)';
  }
});

/* ─── HERO CANVAS — PARTICLE FIELD ─── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouseX = -1000, mouseY = -1000;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  const colors = [
    [201, 147, 74],   // gold
    [232, 175, 101],  // gold bright
    [201, 64, 112],   // rose
    [220, 150, 200],  // pink
    [255, 220, 160],  // pale gold
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }

  particles = Array.from({ length: 90 }, () => ({
    x: rand(0, 1000), xp: 0,
    y: rand(0, 1000), yp: 0,
    vx: rand(-0.2, 0.2),
    vy: rand(-0.4, -0.08),
    r: rand(0.4, 2.2),
    alpha: rand(0.15, 0.65),
    color: colors[Math.floor(Math.random() * colors.length)],
    phase: rand(0, Math.PI * 2),
    speed: rand(0.006, 0.018),
    twinkle: rand(0.5, 2.5),
  }));

  // Connection lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].xp - particles[j].xp;
        const dy = particles[i].yp - particles[j].yp;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(201, 147, 74, ${alpha})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(particles[i].xp, particles[i].yp);
          ctx.lineTo(particles[j].xp, particles[j].yp);
          ctx.stroke();
        }
      }
    }
  }

  let frame = 0;
  function draw() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    drawConnections();

    particles.forEach(p => {
      p.phase += p.speed;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.y < -20) { p.y = H + 20; p.x = rand(0, W); }
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;

      // Mouse repel
      const mdx = p.x - mouseX, mdy = p.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 120) {
        const force = (120 - mdist) / 120 * 0.6;
        p.x += (mdx / mdist) * force;
        p.y += (mdy / mdist) * force;
      }

      p.xp = p.x; p.yp = p.y;

      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
      const [r, g, b] = p.color;

      // Glow
      const grad = ctx.createRadialGradient(p.xp, p.yp, 0, p.xp, p.yp, p.r * 4);
      grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(p.xp, p.yp, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.xp, p.yp, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(a * 1.5, 1)})`;
      ctx.fill();

      // Sparkle cross for larger particles
      if (p.r > 1.4) {
        const crossLen = p.r * 3.5 * (0.7 + 0.3 * Math.sin(p.phase * 1.3));
        ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p.xp - crossLen, p.yp);
        ctx.lineTo(p.xp + crossLen, p.yp);
        ctx.moveTo(p.xp, p.yp - crossLen);
        ctx.lineTo(p.xp, p.yp + crossLen);
        ctx.stroke();

        // Diagonal sparkle
        const d = crossLen * 0.6;
        ctx.beginPath();
        ctx.moveTo(p.xp - d, p.yp - d);
        ctx.lineTo(p.xp + d, p.yp + d);
        ctx.moveTo(p.xp + d, p.yp - d);
        ctx.lineTo(p.xp - d, p.yp + d);
        ctx.stroke();
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── NEWSLETTER CANVAS — FLOWING WAVES ─── */
function initNLCanvas() {
  const canvas = document.getElementById('nl-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function draw() {
    t += 0.005;
    ctx.clearRect(0, 0, W, H);

    // Multiple waves
    for (let w = 0; w < 4; w++) {
      ctx.beginPath();
      const amp = 30 + w * 15;
      const freq = 0.004 + w * 0.001;
      const phase = t + w * Math.PI / 2;
      const yBase = H * (0.3 + w * 0.15);
      const alpha = 0.04 - w * 0.007;
      const isGold = w % 2 === 0;
      const [r, g, b] = isGold ? [201, 147, 74] : [201, 64, 112];

      ctx.moveTo(0, yBase);
      for (let x = 0; x <= W; x += 4) {
        const y = yBase + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2 + phase * 1.3) * amp * 0.3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── STICKY HEADER ─── */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── SCROLL REVEAL ─── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || e.target.dataset.index ? parseFloat(e.target.dataset.index || 0) * 0.08 : 0;
        setTimeout(() => e.target.classList.add('visible'), delay * 1000);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ─── 3D TILT ─── */
function initTilt() {
  document.querySelectorAll('.product-card, .cat-card, .offer-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── HERO ORBIT CARDS hover correction ─── */
function initOrbitCards() {
  const cards = document.querySelectorAll('.orbit-card');
  cards.forEach(c => {
    c.addEventListener('mouseenter', () => { c.style.transform = 'scale(1.08)'; });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });
}

/* ─── CART ─── */
let cart = JSON.parse(localStorage.getItem('tscbs_cart') || '[]');
function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) badge.textContent = cart.length;
}
function addToCart(name, price) {
  cart.push({ name, price, id: Date.now() });
  localStorage.setItem('tscbs_cart', JSON.stringify(cart));
  updateCartBadge();
  showToast('✦ ' + name + ' — Added to cart');
}

/* ─── WISHLIST ─── */
let wishlist = JSON.parse(localStorage.getItem('tscbs_wishlist') || '[]');
function toggleWishlist(btn, name) {
  const idx = wishlist.indexOf(name);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  } else {
    wishlist.push(name);
    btn.classList.add('active');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--rose-bright)" stroke="var(--rose-bright)" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    showToast('♥ ' + name + ' — Saved to wishlist');
  }
  localStorage.setItem('tscbs_wishlist', JSON.stringify(wishlist));
}

/* ─── TOAST ─── */
let toastEl;
function showToast(msg) {
  if (!toastEl) { toastEl = document.getElementById('toast'); }
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.style.opacity = '1';
  toastEl.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2800);
}

/* ─── SEARCH ─── */
function initSearch() {
  const btn = document.querySelector('.search-btn');
  const overlay = document.getElementById('search-overlay');
  const closeBtn = document.querySelector('.search-close');
  const input = document.getElementById('search-input');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    overlay.classList.add('open');
    setTimeout(() => input?.focus(), 200);
  });
  closeBtn?.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('open');
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.add('open');
      setTimeout(() => input?.focus(), 200);
    }
  });
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value) {
      window.location.href = 'pages/shop.html?q=' + encodeURIComponent(input.value);
    }
  });
}

/* ─── TABS ─── */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        if (tab === 'all' || card.dataset.cat === tab) {
          card.style.display = '';
          card.style.animation = 'none';
          requestAnimationFrame(() => { card.style.animation = ''; });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ─── TESTIMONIALS SLIDER ─── */
function initTestimonials() {
  const inner = document.getElementById('testimonials-inner');
  const prevBtn = document.getElementById('t-prev');
  const nextBtn = document.getElementById('t-next');
  if (!inner) return;
  let idx = 0;
  const cards = inner.querySelectorAll('.t-card');
  const total = cards.length;
  const perView = 3;

  function go(dir) {
    idx = (idx + dir + total) % total;
    const offset = -(idx * (100 / perView));
    inner.style.transform = `translateX(${offset}%)`;
  }

  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));

  // Auto-advance
  let auto = setInterval(() => go(1), 5000);
  [prevBtn, nextBtn].forEach(b => b?.addEventListener('click', () => { clearInterval(auto); auto = setInterval(() => go(1), 5000); }));
}

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el, target) {
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const val = Math.round(start + (target - start) * ease);
    el.textContent = target >= 10000 ? Math.round(val / 1000) + 'K' + suffix : val + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const val = parseInt(e.target.dataset.count);
        if (val) animateCounter(e.target, val);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
}

/* ─── PARALLAX ORBS ─── */
function initParallax() {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    document.querySelectorAll('.orb-1').forEach(o => {
      o.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });
    document.querySelectorAll('.orb-2').forEach(o => {
      o.style.transform = `translate(${-x * 15}px, ${-y * 15}px)`;
    });
    document.querySelectorAll('.orb-3').forEach(o => {
      o.style.transform = `translate(${x * 10}px, ${y * 8}px)`;
    });
  });
}

/* ─── CURSOR LINE (jewel trails) ─── */
function initTrail() {
  const trail = [];
  const MAX = 12;
  for (let i = 0; i < MAX; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;width:4px;height:4px;border-radius:50%;
      pointer-events:none;z-index:99990;
      background:var(--gold);mix-blend-mode:screen;
      opacity:0;transition:none;
    `;
    document.body.appendChild(el);
    trail.push({ el, x: 0, y: 0 });
  }

  let tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

  (function animateTrail() {
    trail.forEach((t, i) => {
      const prev = i === 0 ? { x: tx, y: ty } : trail[i - 1];
      t.x += (prev.x - t.x) * 0.35;
      t.y += (prev.y - t.y) * 0.35;
      const scale = 1 - i / MAX;
      const alpha = (1 - i / MAX) * 0.35;
      t.el.style.transform = `translate(${t.x - 2}px, ${t.y - 2}px) scale(${scale})`;
      t.el.style.opacity = alpha;
      // Alternate gold/rose
      t.el.style.background = i % 3 === 0 ? 'var(--rose-bright)' : 'var(--gold-bright)';
    });
    requestAnimationFrame(animateTrail);
  })();
}

/* ─── WISHLIST STATE RESTORE ─── */
function restoreWishlist() {
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    const card = btn.closest('.product-card');
    const nameEl = card?.querySelector('.product-name');
    if (nameEl && wishlist.includes(nameEl.textContent)) {
      btn.classList.add('active');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--rose-bright)" stroke="var(--rose-bright)" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    }
  });
}

/* ─── STAGGERED REVEAL FOR GRIDS ─── */
function initStaggerReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const siblings = e.target.parentElement?.children;
        if (siblings) {
          Array.from(siblings).forEach((sib, i) => {
            sib.style.transitionDelay = `${i * 0.07}s`;
            sib.classList.add('visible');
          });
        } else {
          e.target.classList.add('visible');
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.product-grid .product-card:first-child, .cat-grid .cat-card:first-child, .testimonials-inner .t-card:first-child').forEach(el => obs.observe(el));
}

/* ─── INIT ALL ─── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initSearch();
  initTabs();
  initReveal();
  initTilt();
  initCounters();
  initTestimonials();
  initParallax();
  initOrbitCards();
  initStaggerReveal();
  restoreWishlist();
  initHeroCanvas();
  initNLCanvas();
  initTrail();
});

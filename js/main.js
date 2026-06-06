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
  showToast(`✓ ${name} added to cart`);
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
    showToast(`♥ Added to wishlist`);
  }
  localStorage.setItem('tscbs_wishlist', JSON.stringify(wishlist));
}

// ─── TOAST ───
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed; bottom:5rem; left:50%; transform:translateX(-50%) translateY(20px);
      background:#2b1a20; color:white; padding:10px 20px; border-radius:100px;
      font-size:13px; font-family:'DM Sans',sans-serif; font-weight:500;
      z-index:9999; opacity:0; transition:all 0.3s; white-space:nowrap;
      box-shadow:0 4px 20px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2200);
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

// ─── SCROLL REVEAL ───
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .category-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ─── MOBILE MENU ───
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ─── NEWSLETTER ───
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input && input.value) {
      showToast('🎉 Subscribed! Welcome to the family');
      input.value = '';
    }
  });
}

// ─── SEARCH ───
function initSearch() {
  const searchBtn = document.querySelector('.search-btn');
  if (!searchBtn) return;
  searchBtn.addEventListener('click', () => {
    const q = prompt('Search products...');
    if (q) window.location.href = `pages/shop.html?q=${encodeURIComponent(q)}`;
  });
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initTabs();
  initScrollReveal();
  initMobileMenu();
  initNewsletter();
  initSearch();
});

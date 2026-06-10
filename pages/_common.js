/* TSCBS Shared JS */
// Header scroll
const hdr=document.getElementById('site-header');
if(hdr)window.addEventListener('scroll',()=>hdr.classList.toggle('elevated',scrollY>60),{passive:true});

// Cart badge
let cart=JSON.parse(localStorage.getItem('tscbs_cart')||'[]');
let wl=JSON.parse(localStorage.getItem('tscbs_wl')||'[]');
function updBadge(){const b=document.getElementById('cart-count');if(b)b.textContent=cart.length}
updBadge();
function addToCart(n,p){cart.push({n,p,id:Date.now()});localStorage.setItem('tscbs_cart',JSON.stringify(cart));updBadge();showToast('🛍️ Added — '+n)}
function toggleWish(btn,name){const i=wl.indexOf(name);if(i>-1){wl.splice(i,1);btn.classList.remove('on');btn.textContent='♡'}else{wl.push(name);btn.classList.add('on');btn.textContent='♥';showToast('💕 Saved — '+name)}localStorage.setItem('tscbs_wl',JSON.stringify(wl))}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);localStorage.setItem('tscbs_cart',JSON.stringify(cart));updBadge()}
const toastEl=document.getElementById('toast');let tt;
function showToast(msg){if(!toastEl)return;toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),2600)}
function doSearch(){const q=prompt('🔍 Search TSCBS...');if(q)window.location.href='shop.html?q='+encodeURIComponent(q)}

// Scroll reveal
const rvObs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');rvObs.unobserve(x.target)}})},{threshold:.07});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%6)*.07+'s';rvObs.observe(el)});

/* TSCBS Shared JS v2 */
const WA = '919910513800';

// Header scroll
const hdr=document.getElementById('site-header');
if(hdr)window.addEventListener('scroll',()=>hdr.classList.toggle('elevated',scrollY>60),{passive:true});

// Cart & Wishlist
let cart=JSON.parse(localStorage.getItem('tscbs_cart')||'[]');
let wl=JSON.parse(localStorage.getItem('tscbs_wl')||'[]');

function updBadge(){const b=document.getElementById('cart-count');if(b)b.textContent=cart.length}
updBadge();

function addToCart(n,p){
  cart.push({n,p:parseInt(p),id:Date.now()});
  localStorage.setItem('tscbs_cart',JSON.stringify(cart));
  updBadge();
  showToast('🛍️ Added to cart — '+n);
  // Animate badge
  const b=document.getElementById('cart-count');
  if(b){b.style.transform='scale(1.6)';setTimeout(()=>b.style.transform='',300)}
}

function toggleWish(btn,name){
  const i=wl.indexOf(name);
  if(i>-1){wl.splice(i,1);btn.classList.remove('on');btn.textContent='♡';showToast('Removed from wishlist')}
  else{wl.push(name);btn.classList.add('on');btn.textContent='♥';showToast('💕 Saved to wishlist — '+name)}
  localStorage.setItem('tscbs_wl',JSON.stringify(wl));
}

function removeFromCart(id){
  cart=cart.filter(x=>x.id!==id);
  localStorage.setItem('tscbs_cart',JSON.stringify(cart));
  updBadge();
}

// Toast
const toastEl=document.getElementById('toast');
let tt;
function showToast(msg){
  if(!toastEl)return;
  toastEl.textContent=msg;
  toastEl.classList.add('show');
  clearTimeout(tt);
  tt=setTimeout(()=>toastEl.classList.remove('show'),2600);
}

// Search — works across shop page
function doSearch(){
  const q=prompt('🔍 Search TSCBS (jewellery, bangles, lipstick...)');
  if(q){
    const isInPages=window.location.pathname.includes('/pages/');
    window.location.href=(isInPages?'':'pages/')+'shop.html?q='+encodeURIComponent(q.trim());
  }
}

// Scroll reveal
const rvObs=new IntersectionObserver(e=>{
  e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');rvObs.unobserve(x.target)}}); 
},{threshold:.07});
document.querySelectorAll('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%6)*.07+'s';rvObs.observe(el)});

// WhatsApp order helper
function waOrder(productName, price){
  const msg=encodeURIComponent('Hi! I want to order: *'+productName+'*\nPrice: ₹'+price+'\nPlease confirm!');
  window.open('https://wa.me/'+WA+'?text='+msg,'_blank');
}

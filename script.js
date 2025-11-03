/* script.js
  Galería dinámica + simulación de carrito (cliente).
  Simple, sin pagos.
*/

const products = [
  {
    id: "p1",
    title: "Camiseta Tulsa - Core",
    desc: "Algodón premium, corte moderno.",
    price: 29.99,
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=60",
    category: "Ropa"
  },
  {
    id: "p2",
    title: "Auriculares Tulsa Beat",
    desc: "Sonido claro, diseño urbano.",
    price: 59.99,
    img: "https://images.unsplash.com/photo-1518444029965-1f2f591f8f3d?w=1200&q=60",
    category: "Tecnología"
  },
  {
    id: "p3",
    title: "Gorra Tulsa",
    desc: "Estilo juvenil y ajustable.",
    price: 19.99,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=60",
    category: "Accesorios"
  },
  {
    id: "p4",
    title: "Mochila Tulsa X",
    desc: "Compartimentos para laptop y ojos hacia el futuro.",
    price: 79.00,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=60",
    category: "Accesorios"
  },
  {
    id: "p5",
    title: "Sudadera Tulsa - Neon",
    desc: "Forro suave, capucha ajustable.",
    price: 49.99,
    img: "https://images.unsplash.com/photo-1520975916780-8c7b6f3f0b6b?w=1200&q=60",
    category: "Ropa"
  },
  {
    id: "p6",
    title: "Cargador Tulsa Rapid",
    desc: "Carga rápida USB-C 65W.",
    price: 25.00,
    img: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=60",
    category: "Tecnología"
  }
];

const productsGrid = document.getElementById('productsGrid');
const cartCountEl = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const toast = document.getElementById('toast');

let cart = [];

// RENDER productos
function renderProducts(){
  productsGrid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-media">
        <img src="${p.img}" alt="${p.title}" loading="lazy" />
        <div class="badge">${p.category}</div>
      </div>
      <div class="product-info">
        <div class="product-title">${p.title}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-meta">
          <div class="price"><strong>$${p.price.toFixed(2)}</strong></div>
          <div>
            <button class="btn-ghost view-btn" data-id="${p.id}">Ver</button>
            <button class="btn-primary add-btn" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// Añadir al carrito
function addToCart(id){
  const prod = products.find(x=>x.id===id);
  if(!prod) return;
  // Si ya existe, incrementar cantidad (simulación)
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({...prod, qty:1});
  showToast(`${prod.title} agregado`);
  updateCartUI();
}

// Mostrar toast
let toastTimer;
function showToast(msg){
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2000);
}

// Render mini carrito
function updateCartUI(){
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  if(cart.length===0){
    cartItemsEl.innerHTML = `<p class="muted">Aún no agregaste productos.</p>`;
    cartTotalEl.textContent = `$0.00`;
    return;
  }
  cartItemsEl.innerHTML = '';
  cart.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.img}" alt="${item.title}" />
      <div class="meta">
        <div style="font-weight:700">${item.title}</div>
        <div style="font-size:0.9rem;color:var(--muted)">${item.qty} × $${item.price.toFixed(2)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <button class="icon-btn small dec" data-id="${item.id}">−</button>
        <button class="icon-btn small inc" data-id="${item.id}">+</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);
  cartTotalEl.textContent = `$${total.toFixed(2)}`;

  // Attach inc/dec listeners
  cartItemsEl.querySelectorAll('.inc').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const id = btn.dataset.id; modifyQty(id, +1);
    });
  });
  cartItemsEl.querySelectorAll('.dec').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const id = btn.dataset.id; modifyQty(id, -1);
    });
  });
}

function modifyQty(id, delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    cart = cart.filter(x=>x.id !== id);
  }
  updateCartUI();
}

// EVENTOS UI
document.addEventListener('click', (e)=>{
  // Agregar
  if(e.target.matches('.add-btn')){
    addToCart(e.target.dataset.id);
  }
  // Ver (abrir modal simple)
  if(e.target.matches('.view-btn')){
    const id = e.target.dataset.id;
    const p = products.find(x=>x.id===id);
    if(!p) return;
    showModalProduct(p);
  }
});

// Abrir / cerrar carrito
document.getElementById('openCart').addEventListener('click', ()=> {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
});
document.getElementById('closeCart').addEventListener('click', ()=> {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
});
document.getElementById('clearCart').addEventListener('click', ()=> {
  cart = [];
  updateCartUI();
});

// Simulado checkout
document.getElementById('checkout').addEventListener('click', ()=> {
  if(cart.length===0){ showToast('Tu carrito está vacío'); return; }
  showToast('Proceso de pago simulado — no real');
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', ()=>{
  document.body.classList.toggle('light');
});

// Simple product modal (usando alert-like custom)
function showModalProduct(p){
  const content = `
${p.title}\n\n${p.desc}\nPrecio: $${p.price.toFixed(2)}
`;
  // Simple: usar prompt-like confirm para ver/agregar
  if(confirm(content + "\n\n¿Agregar al carrito?")){
    addToCart(p.id);
  }
}

// Inicialización
renderProducts();
updateCartUI();

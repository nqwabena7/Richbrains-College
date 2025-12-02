// ---------- Data ----------
const categories = [
    {key:'all', label:'All'},
    {key:'headphones', label:'Headphones'},
    {key:'earpieces', label:'Earpieces'},
    {key:'charger', label:'Chargers'},
    {key:'pendrive', label:'Pendrive'},
    {key:'bulbs', label:'Bulbs'},
    {key:'fan', label:'Fan'},
    {key:'kettle', label:'Kettle'},
    {key:'ricecooker', label:'Rice Cooker'},
    {key:'bluetoothspeaker', label:'Bluetooth Speaker'},
    {key:'homeappliances', label:'Home Appliances'},
    {key:'phoneaccessories', label:'Phone Accessories'}
];

const products = [
    {id:1,name:"Wireless Headphones",category:"headphones",price:250,img:"https://images.unsplash.com/photo-1518444021086-5823be1e9a07?auto=format&fit=crop&w=600&q=60"},
    {id:2,name:"Earpiece 2.0",category:"earpieces",price:120,img:"https://images.unsplash.com/photo-1585386959984-a4155225b6d0?auto=format&fit=crop&w=600&q=60"},
    {id:3,name:"Fast Charger 30W",category:"charger",price:120,img:"https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=60"},
    {id:4,name:"Pendrive 64GB",category:"pendrive",price:80,img:"https://images.unsplash.com/photo-1591012911209-1a5f4f7c28c2?auto=format&fit=crop&w=600&q=60"},
    {id:5,name:"LED Bulb 9W",category:"bulbs",price:25,img:"https://images.unsplash.com/photo-1581091870622-c3b5f52b8b12?auto=format&fit=crop&w=600&q=60"},
    {id:6,name:"Ceiling Fan 56in",category:"fan",price:350,img:"https://images.unsplash.com/photo-1578894380912-0fc5e19b7a80?auto=format&fit=crop&w=600&q=60"},
    {id:7,name:"Electric Kettle 1.7L",category:"kettle",price:180,img:"https://images.unsplash.com/photo-1582719478145-1f29d7a4a2e4?auto=format&fit=crop&w=600&q=60"},
    {id:8,name:"Rice Cooker 5L",category:"ricecooker",price:300,img:"https://images.unsplash.com/photo-1598866530747-7b3b0c667ed0?auto=format&fit=crop&w=600&q=60"},
    {id:9,name:"Bluetooth Speaker 10W",category:"bluetoothspeaker",price:350,img:"https://images.unsplash.com/photo-1518444021086-5823be1e9a07?auto=format&fit=crop&w=600&q=60"},
    {id:10,name:"Mixer Grinder",category:"homeappliances",price:500,img:"https://images.unsplash.com/photo-1556909190-6f0f8a58b8b3?auto=format&fit=crop&w=600&q=60"},
    {id:11,name:"Phone Case",category:"phoneaccessories",price:50,img:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=60"}
];

const slides = [
    {img:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=60", title:"Latest Phones — Great Prices", cta:"Shop Phones"},
    {img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=60", title:"Accessories Sale — Limited Time", cta:"Shop Accessories"},
    {img:"https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=60", title:"Home Appliances Deals", cta:"Shop Home"}
];

// ---------- Utility + state ----------
let cart = JSON.parse(localStorage.getItem('twill_cart') || '[]');
let activeCategory = 'all';
let currentSlide = 0;
let sliderInterval;

// ---------- DOM refs ----------
const categoryList = document.getElementById('categoryList');
const mobileCategoryList = document.getElementById('mobileCategoryList');
const productsRoot = document.getElementById('products');
const cartCountEl = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartItemsRoot = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const sliderRoot = document.getElementById('slider');
const yearEl = document.getElementById('year');
const mobileCatsEl = document.getElementById('mobileCats');
const backdropEl = document.getElementById('backdrop'); // New Backdrop element

// ---------- Initial Setup ----------
yearEl.textContent = new Date().getFullYear();

// ---------- Render categories ----------
function renderCategories(){
    categoryList.innerHTML = '';
    mobileCategoryList.innerHTML = '';
    categories.forEach(cat=>{
        const btnClass = `w-full text-left px-2 py-2 rounded hover:bg-blue-50`;
        
        // Desktop Button
        const desktopBtn = document.createElement('button');
        desktopBtn.className = `${btnClass} js-cat-btn ${cat.key === activeCategory ? 'bg-blue-50 font-semibold' : ''}`;
        desktopBtn.textContent = cat.label;
        desktopBtn.dataset.cat = cat.key;
        categoryList.appendChild(desktopBtn);

        // Mobile Button
        const mobileBtn = desktopBtn.cloneNode(true);
        mobileCategoryList.appendChild(mobileBtn);
    });
}

// Handler for category clicks (using delegation)
function handleCategoryClick(e) {
    let target = e.target.closest('.js-cat-btn');
    if (target) {
        const catKey = target.dataset.cat;
        if (catKey === activeCategory) return;
        
        activeCategory = catKey;
        
        // Update active class for both desktop and mobile lists
        document.querySelectorAll('.js-cat-btn').forEach(b => {
            b.classList.remove('bg-blue-50', 'font-semibold');
            if (b.dataset.cat === activeCategory) {
                b.classList.add('bg-blue-50', 'font-semibold');
            }
        });
        
        filterProducts();
        closeMobileCats();
    }
}


// ---------- Render products ----------
function renderProducts(){
    productsRoot.innerHTML = '';
    products.forEach(p=>{
        const card = document.createElement('div');
        card.className = 'bg-white rounded shadow-sm p-3 flex flex-col';
        card.dataset.category = p.category;
        card.dataset.name = p.name.toLowerCase();
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" class="w-full h-40 object-cover rounded mb-2">
            <div class="flex-1">
                <div class="text-sm font-semibold">${p.name}</div>
                <div class="text-xs text-gray-500 mb-2">Quality product</div>
            </div>
            <div class="flex items-center justify-between pt-2">
                <div class="text-blue-600 font-bold">GHS ${p.price}</div>
                <div class="flex items-center gap-2">
                    <button class="text-xs px-2 py-1 border rounded js-quick-view-btn" data-product-id="${p.id}">View</button>
                    <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm js-add-to-cart" data-product-id="${p.id}">Add</button>
                </div>
            </div>
        `;
        productsRoot.appendChild(card);
    });
}

// ---------- Filter by category or search ----------
function filterProducts(){
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    document.querySelectorAll('#products > div').forEach(card=>{
        const cat = card.dataset.category;
        const name = card.dataset.name || '';
        const visibleCat = (activeCategory==='all' || activeCategory===cat);
        const matchesSearch = (!q) || name.includes(q);
        card.style.display = (visibleCat && matchesSearch) ? 'flex' : 'none';
    });
}

// ---------- Slider ----------
function renderSlider(){
    sliderRoot.innerHTML = '';
    slides.forEach((s,idx)=>{
        const slide = document.createElement('div');
        slide.className = `absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${idx===currentSlide?'opacity-100':'opacity-0'}`;
        slide.style.backgroundImage = `url('${s.img}')`;
        slide.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-transparent opacity-50"></div>
            <div class="relative h-full flex flex-col justify-center p-6 md:p-12 text-white">
                <h3 class="text-lg md:text-2xl font-bold mb-2">${s.title}</h3>
                <button class="mt-2 inline-block bg-white text-blue-700 px-3 py-2 rounded">${s.cta}</button>
            </div>
        `;
        sliderRoot.appendChild(slide);
    });
}
function nextSlide(){ currentSlide = (currentSlide+1) % slides.length; renderSlider(); }
function prevSlide(){ currentSlide = (currentSlide-1+slides.length) % slides.length; renderSlider(); }
function startSlider(){ sliderInterval = setInterval(nextSlide,4000); }
function stopSlider(){ clearInterval(sliderInterval); }

// ---------- Cart logic ----------
function saveCart(){ localStorage.setItem('twill_cart', JSON.stringify(cart)); }
function getCartCount(){ return cart.reduce((s,i)=>s+i.qty,0); }

function addToCart(productId){
    const p = products.find(x=>x.id===productId);
    if(!p) return;
    const ex = cart.find(i=>i.id===p.id);
    if(ex) ex.qty += 1;
    else cart.push({id:p.id,name:p.name,price:p.price,qty:1,img:p.img});
    saveCart();
    renderCart();
    openCart();
}

function removeFromCart(productId){
    cart = cart.filter(i=>i.id!==productId);
    saveCart();
    renderCart();
}

function changeQty(productId, delta){
    const it = cart.find(i=>i.id===productId);
    if(!it) return;
    it.qty += delta;
    if(it.qty <= 0){ removeFromCart(productId); return; }
    saveCart();
    renderCart();
}

function renderCart(){
    cartItemsRoot.innerHTML = '';
    let total = 0;
    if(cart.length === 0){
        cartItemsRoot.innerHTML = '<div class="text-sm text-gray-500">Your cart is empty.</div>';
    } else {
        cart.forEach(item=>{
            total += item.price * item.qty;
            const row = document.createElement('div');
            row.className = 'flex items-center gap-3 border-b pb-3 last:border-b-0';
            row.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="w-14 h-14 object-cover rounded">
                <div class="flex-1 text-sm">
                    <div class="font-semibold">${item.name}</div>
                    <div class="text-xs text-gray-500">GHS ${item.price} x ${item.qty}</div>
                    <div class="mt-2 flex items-center gap-2 js-cart-controls" data-product-id="${item.id}">
                        <button class="px-2 py-0.5 border rounded text-xs js-qty-minus">-</button>
                        <div class="text-sm">${item.qty}</div>
                        <button class="px-2 py-0.5 border rounded text-xs js-qty-plus">+</button>
                        <button class="ml-4 text-xs text-red-600 js-remove-item">Remove</button>
                    </div>
                </div>
                <div class="text-sm font-semibold">GHS ${item.price * item.qty}</div>
            `;
            cartItemsRoot.appendChild(row);
        });
    }
    cartTotalEl.textContent = `GHS ${total}`;
    cartCountEl.textContent = getCartCount();
}

// ---------- Drawer Controls (Integrated Backdrop) ----------
function openBackdrop() {
    backdropEl.classList.remove('opacity-0', 'pointer-events-none');
    backdropEl.classList.add('opacity-100', 'pointer-events-auto');
}
function closeBackdrop() {
    backdropEl.classList.add('opacity-0', 'pointer-events-none');
    backdropEl.classList.remove('opacity-100', 'pointer-events-auto');
}

function openCart(){ 
    cartDrawer.classList.remove('translate-x-full'); 
    openBackdrop();
}
function closeCart(){ 
    cartDrawer.classList.add('translate-x-full');
    // Only close backdrop if mobile menu isn't open
    if (mobileCatsEl.classList.contains('-translate-x-full')) {
        closeBackdrop();
    }
}

function openMobileCats(){ 
    mobileCatsEl.classList.remove('-translate-x-full'); 
    mobileCatsEl.classList.add('translate-x-0');
    openBackdrop();
}
function closeMobileCats(){ 
    mobileCatsEl.classList.add('-translate-x-full'); 
    mobileCatsEl.classList.remove('translate-x-0'); 
    // Only close backdrop if cart isn't open
    if (cartDrawer.classList.contains('translate-x-full')) {
        closeBackdrop();
    }
}

// ---------- Quick view (placeholder) ----------
function quickView(id){
    const p = products.find(x=>x.id===id);
    alert(`${p.name} — GHS ${p.price}\n\n(Quick view demo)`);
}

// ---------- Centralized Event Listeners ----------
function initEventListeners() {
    
    // Header controls
    document.getElementById('cartToggle').addEventListener('click', ()=>{ renderCart(); openCart(); });
    document.getElementById('mobileCatBtn').addEventListener('click', openMobileCats);
    document.getElementById('mobileCatClose').addEventListener('click', closeMobileCats);

    // Search and Filter
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('searchBtn').addEventListener('click', filterProducts);

    // Slider controls
    document.getElementById('nextSlide').addEventListener('click', ()=>{ nextSlide(); stopSlider(); startSlider(); });
    document.getElementById('prevSlide').addEventListener('click', ()=>{ prevSlide(); stopSlider(); startSlider(); });

    // Cart Drawer Controls
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('clearCartBtn').addEventListener('click', ()=>{ 
        if(confirm('Clear cart?')){ 
            cart=[]; 
            saveCart(); 
            renderCart(); 
        }
    });
    document.getElementById('checkoutBtn').addEventListener('click', ()=>{ 
        if(cart.length===0){ alert('Cart is empty'); return; } 
        alert('Checkout demo — integrate backend to process orders'); 
    });

    // Category Buttons (Delegation)
    categoryList.addEventListener('click', handleCategoryClick);
    mobileCategoryList.addEventListener('click', handleCategoryClick);

    // Product Cards (Delegation for Add/View buttons)
    productsRoot.addEventListener('click', (e) => {
        const target = e.target;
        const productId = parseInt(target.dataset.productId);

        if (target.classList.contains('js-add-to-cart')) {
            addToCart(productId);
        } else if (target.classList.contains('js-quick-view-btn')) {
            quickView(productId);
        }
    });

    // Cart Items (Delegation for +/-/Remove)
    cartItemsRoot.addEventListener('click', (e) => {
        const target = e.target;
        const controls = target.closest('.js-cart-controls');
        if (!controls) return;
        
        const productId = parseInt(controls.dataset.productId);

        if (target.classList.contains('js-qty-plus')) {
            changeQty(productId, 1);
        } else if (target.classList.contains('js-qty-minus')) {
            changeQty(productId, -1);
        } else if (target.classList.contains('js-remove-item')) {
            removeFromCart(productId);
        }
    });

    // Backdrop click listener to close open drawers
    backdropEl.addEventListener('click', () => {
        if (!cartDrawer.classList.contains('translate-x-full')) {
            closeCart();
        }
        if (!mobileCatsEl.classList.contains('-translate-x-full')) {
            closeMobileCats();
        }
    });
}

// ---------- Init Function to run everything ----------
function init(){
    renderCategories();
    renderProducts();
    renderSlider();
    startSlider();
    renderCart();
    initEventListeners();
}

// Run the initialization function
init();<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faculty - RichBrain College</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: #ffffff; /* White background */
      color: #212529; /* Dark text for readability */
    }
    .hero {
      background: url('assets/images/faculty-bg.jpg') center/cover no-repeat;
      color: white;
      text-align: center;
      padding: 80px 20px;
    }
    .card {
      border-radius: 10px;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .card-img-top {
      height: 250px;
      object-fit: cover;
    }
    .card-body {
      flex-grow: 1;
    }
    .btn-primary {
      background: #007bff;
      border: none;
    }
    footer {
      background: #343a40;
      color: #fff;
      text-align: center;
      padding: 10px; /* Reduced footer padding */
      font-size: 14px;
    }
    @media (max-width: 768px) {
      .hero {
        padding: 50px 20px;
      }
      .card-img-top {
        height: 200px;
      }
    }
  </style>
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="index.html">Head Of Departments</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="admission.html">Admission</a></li>
          <li class="nav-item"><a class="nav-link" href="school-life.html">School Life</a></li>
          <li class="nav-item"><a class="nav-link active" href="faculty.html">Faculty</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <h1>Meet Our Faculty</h1>
    <p>Dedicated professionals guiding our students to success</p>
  </section>

  <!-- Faculty Grid -->
  <div class="container py-5">
    <div class="row g-4">
      <!-- Teacher 1 -->
      <div class="col-md-4">
        <div class="card">
          <img src="assets/images/faculty/teacher1.jpg" onerror="this.src='assets/images/placeholder.jpg'" class="card-img-top" alt="Teacher 1">
          <div class="card-body text-center">
            <h5 class="card-title">John Doe</h5>
            <p class="card-text">Head of Science Department</p>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#teacher1Modal">View Profile</button>
          </div>
        </div>
      </div>

      <!-- Teacher 2 -->
      <div class="col-md-4">
        <div class="card">
          <img src="assets/images/faculty/teacher2.jpg" onerror="this.src='assets/images/placeholder.jpg'" class="card-img-top" alt="Teacher 2">
          <div class="card-body text-center">
            <h5 class="card-title">Mary Smith</h5>
            <p class="card-text">Mathematics Department</p>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#teacher2Modal">View Profile</button>
          </div>
        </div>
      </div>

      <!-- Teacher 3 -->
      <div class="col-md-4">
        <div class="card">
          <img src="assets/images/faculty/teacher3.jpg" onerror="this.src='assets/images/placeholder.jpg'" class="card-img-top" alt="Teacher 3">
          <div class="card-body text-center">
            <h5 class="card-title">James Brown</h5>
            <p class="card-text">English Department</p>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#teacher3Modal">View Profile</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Teacher Modals -->
  <!-- Teacher 1 Modal -->
  <div class="modal fade" id="teacher1Modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">John Doe</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <img src="assets/images/faculty/teacher1.jpg" onerror="this.src='assets/images/placeholder.jpg'" class="img-fluid mb-3" alt="Teacher 1">
          <p>John Doe is the Head of the Science Department with over 15 years of experience in teaching and curriculum development.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Teacher 2 Modal -->
  <div class="modal fade" id="teacher2Modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Mary Smith</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <img src="assets/images/faculty/teacher2.jpg" onerror="this.src='assets/images/placeholder.jpg'" class="img-fluid mb-3" alt="Teacher 2">
          <p>Mary Smith specializes in advanced mathematics and has helped numerous students excel in national exams.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Teacher 3 Modal -->
  <div class="modal fade" id="teacher3Modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">James Brown</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <img src="assets/images/faculty/teacher3.jpg" onerror="this.src='assets/images/placeholder.jpg'" class="img-fluid mb-3" alt="Teacher 3">
          <p>James Brown is passionate about literature and communication, inspiring students to love reading and writing.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer>
    <p>&copy; 2025 Our School. All Rights Reserved.</p>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

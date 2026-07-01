/* ==========================================================================
   THE EDITED STUDIO — App
   Shared product catalogue + page interactions (nav, filters, forms, etc.)
   ========================================================================== */

/* ---------------------------------- Product catalogue ---------------------------------- */
window.PRODUCTS = [
  {
    id: 'brand-toolkit',
    name: 'Brand Identity Toolkit',
    price: 240,
    category: 'Templates',
    image: 'product-brand-toolkit.jpg',
    description: 'A complete editable toolkit of logo lockups, colour systems and type guides, built to help you present a considered identity from day one.',
    features: [

    'Editable logo templates',

    'Colour palette guide',

    'Typography system',

    'Instant download'

  ],
     details: { format: 'Figma + PDF', delivery: 'Instant download', license: 'Single studio use' }
  },
  {
    id: 'editorial-webkit',
    name: 'Editorial Web Kit',
    price: 180,
    category: 'Templates',
    image: 'product-webkit.jpg',
    description: 'A modular set of web page templates in a calm, editorial style — built for teams who want a considered site without starting from a blank page.',
    features: [

    'Editable logo templates',

    'Colour palette guide',

    'Typography system',

    'Instant download'

  ],
     details: { format: 'Figma + HTML', delivery: 'Instant download', license: 'Single studio use' }
  },
  {
    id: 'social-frames',
    name: 'Social Content Frames',
    price: 65,
    category: 'Templates',
    image: 'product-social-frames.jpg',
    description: 'Sixty layered frames for stories, grids and carousels, designed to keep a feed feeling cohesive without the daily design lift.',
    features: [

    'Editable logo templates',

    'Colour palette guide',

    'Typography system',

    'Instant download'

  ],
     details: { format: 'Figma + Canva', delivery: 'Instant download', license: 'Single studio use' }
  },
  {
    id: 'strategy-workbook',
    name: 'Brand Strategy Workbook',
    price: 95,
    category: 'Guides',
    image: 'product-workbook.jpg',
    description: 'A guided workbook of prompts and frameworks for clarifying positioning, voice and audience before a single pixel gets designed.',
    features: [

    'Editable logo templates',

    'Colour palette guide',

    'Typography system',

    'Instant download'

  ],
     details: { format: 'PDF, 48 pages', delivery: 'Instant download', license: 'Personal use' }
  },
  {
    id: 'moodboard-set',
    name: 'Moodboard Starter Set',
    price: 48,
    category: 'Guides',
    image: 'product-moodboard.jpg',
    description: 'Curated moodboard layouts and texture packs for grounding a new brand direction before client presentations.',
    features: [

    'Editable logo templates',

    'Colour palette guide',

    'Typography system',

    'Instant download'

  ]
   ,
     details: { format: 'PDF + JPG pack', delivery: 'Instant download', license: 'Personal use' }
  },
  {
    id: 'launch-checklist',
    name: 'Website Launch Checklist',
    price: 32,
    category: 'Guides',
    image: 'product-checklist.jpg',
    description: 'A studio-tested, room-by-room checklist covering everything from copy to accessibility before a site goes live.',
    features: [

    'Editable logo templates',

    'Colour palette guide',

    'Typography system',

    'Instant download'

  ],details: { format: 'PDF, 12 pages', delivery: 'Instant download', license: 'Personal use' }
  }
];

function getProduct(id) {
  return window.PRODUCTS.find((p) => p.id === id);
}

/* ---------------------------------- Mobile navigation ---------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!toggle || !drawer) return;

  function open() {
    drawer.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const firstLink = drawer.querySelector('a');
    if (firstLink) firstLink.focus();
  }
  function close() {
    drawer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }
  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
}

/* ---------------------------------- Shop grid rendering ---------------------------------- */
function renderShopGrid() {
  const grid = document.querySelector('[data-shop-grid]');
  if (!grid) return;

  function draw(products) {
    grid.innerHTML = products.map((p) => `
      <article class="card">
        <a href="product.html?id=${p.id}" class="card-media" aria-hidden="true">
          <img src="${p.image}" alt="" loading="lazy">
        </a>
        <div class="card-body">
          <span class="tag">${p.category}</span>
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          
          <div class="card-meta">
          <span class="price">R${p.price}</span>
            <button class="btn btn-sm" data-quick-add="${p.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  draw(window.PRODUCTS);

  const sortSelect = document.querySelector('[data-shop-sort]');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      let list = [...window.PRODUCTS];
      if (val === 'price-low') list.sort((a, b) => a.price - b.price);
      if (val === 'price-high') list.sort((a, b) => b.price - a.price);
      if (val === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
      draw(list);
    });
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quick-add]');
    if (!btn) return;
    const product = getProduct(btn.dataset.quickAdd);
    if (!product) return;
    window.Cart.addItem(product, 1);
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1400);
  });
}

/* ---------------------------------- Featured products (home) ---------------------------------- */
function renderFeaturedProducts() {
  const grid = document.querySelector('[data-featured-grid]');
  if (!grid) return;
  const featured = window.PRODUCTS.slice(0, 3);
  grid.innerHTML = featured.map((p) => `
    <article class="card">
      <a href="product.html?id=${p.id}" class="card-media" aria-hidden="true">
        <img src="${p.image}" alt="" loading="lazy">
      </a>
      <div class="card-body">
        <span class="tag">${p.category}</span>
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="card-meta">
          <span class="price">${window.Cart.formatPrice(p.price)}</span>
          <a href="product.html?id=${p.id}" class="btn btn-ghost btn-sm">View</a>
        </div>
      </div>
    </article>
  `).join('');
}

/* ---------------------------------- Product detail page ---------------------------------- */
function initProductPage() {
  const wrap = document.querySelector('[data-product-page]');
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProduct(params.get('id')) || window.PRODUCTS[0];

  wrap.querySelector('[data-p-name]').textContent = product.name;
  wrap.querySelector('[data-p-price]').textContent = window.Cart.formatPrice(product.price);
  wrap.querySelector('[data-p-desc]').textContent = product.description;
  wrap.querySelector('[data-p-category]').textContent = product.category;
  document.title = product.name + ' — The Edited Studio';

  const mainImg = wrap.querySelector('[data-p-main-image]');
  mainImg.src = product.image;
  mainImg.alt = product.name;

  const metaList = wrap.querySelector('[data-p-meta]');
  if (metaList && product.details) {
    metaList.innerHTML = Object.entries(product.details).map(([k, v]) => `
      <dt>${k}</dt><dd>${v}</dd>
    `).join('');
  }

  // Thumbnails (reuse same image at different "angles" via placeholder variety)
  const thumbWrap = wrap.querySelector('[data-p-thumbs]');
  if (thumbWrap) {
    thumbWrap.innerHTML = [1, 2, 3, 4].map((n, i) => `
      <button type="button" class="${i === 0 ? 'active' : ''}" data-thumb aria-label="View image ${n}">
        <img src="${product.image}" alt="" loading="lazy">
      </button>
    `).join('');
    thumbWrap.querySelectorAll('[data-thumb]').forEach((btn) => {
      btn.addEventListener('click', () => {
        thumbWrap.querySelectorAll('[data-thumb]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        mainImg.src = btn.querySelector('img').src;
      });
    });
  }

  // Quantity selector
  const qtyInput = wrap.querySelector('[data-qty-input]');
  wrap.querySelector('[data-qty-decrease]').addEventListener('click', () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
  });
  wrap.querySelector('[data-qty-increase]').addEventListener('click', () => {
    qtyInput.value = parseInt(qtyInput.value, 10) + 1;
  });

  // Add to cart
  const addBtn = wrap.querySelector('[data-add-to-cart]');
  addBtn.addEventListener('click', () => {
    window.Cart.addItem(product, qtyInput.value);
    addBtn.textContent = 'Added to cart ✓';
    setTimeout(() => { addBtn.textContent = 'Add to cart'; }, 1600);
  });

  // Related products
  const relatedGrid = wrap.querySelector('[data-related-grid]');
  if (relatedGrid) {
    const related = window.PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = related.map((p) => `
      <article class="card">
        <a href="product.html?id=${p.id}" class="card-media" aria-hidden="true">
          <img src="${p.image}" alt="" loading="lazy">
        </a>
        <div class="card-body">
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="card-meta">
            <span class="price">${window.Cart.formatPrice(p.price)}</span>
            <a href="product.html?id=${p.id}" class="btn btn-ghost btn-sm">View</a>
          </div>
        </div>
      </article>
    `).join('');
  }
}

/* ---------------------------------- Cart page rendering ---------------------------------- */
function renderCartPage() {
  const tableBody = document.querySelector('[data-cart-body]');
  if (!tableBody) return;

  const emptyState = document.querySelector('[data-cart-empty]');
  const cartContent = document.querySelector('[data-cart-content]');

  function draw() {
    const items = window.Cart.read();

    if (items.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (cartContent) cartContent.style.display = 'none';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';

    tableBody.innerHTML = items.map((item) => `
      <tr data-row="${item.id}">
        <td>
          <div class="cart-item-info">
            <div class="cart-item-thumb"><img src="${item.image}" alt="" loading="lazy"></div>
            <div>
              <p class="cart-item-name">${item.name}</p>
              <button class="remove-btn" data-remove="${item.id}" aria-label="Remove ${item.name} from cart">Remove</button>
            </div>
          </div>
        </td>
        <td>${window.Cart.formatPrice(item.price)}</td>
        <td>
          <div class="qty-selector">
            <button type="button" data-decrease="${item.id}" aria-label="Decrease quantity">−</button>
            <input type="text" inputmode="numeric" value="${item.qty}" data-qty="${item.id}" aria-label="Quantity for ${item.name}">
            <button type="button" data-increase="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </td>
        <td>${window.Cart.formatPrice(item.price * item.qty)}</td>
      </tr>
    `).join('');

    const { subtotal, shipping, total } = window.Cart.totals();
    document.querySelector('[data-sum-subtotal]').textContent = window.Cart.formatPrice(subtotal);
    document.querySelector('[data-sum-shipping]').textContent = shipping === 0 ? 'Free' : window.Cart.formatPrice(shipping);
    document.querySelector('[data-sum-total]').textContent = window.Cart.formatPrice(total);
  }

  draw();
  document.addEventListener('cart:updated', draw);

  tableBody.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-increase]');
    const dec = e.target.closest('[data-decrease]');
    const rem = e.target.closest('[data-remove]');
    if (inc) window.Cart.changeQty(inc.dataset.increase, 1);
    if (dec) window.Cart.changeQty(dec.dataset.decrease, -1);
    if (rem) window.Cart.removeItem(rem.dataset.remove);
  });

  tableBody.addEventListener('change', (e) => {
    const input = e.target.closest('[data-qty]');
    if (!input) return;
    window.Cart.setQty(input.dataset.qty, input.value);
  });

  const checkoutBtn = document.querySelector('[data-checkout]');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('This is a design preview — checkout is not connected to a payment processor yet.');
    });
  }
}

/* ---------------------------------- Portfolio filtering ---------------------------------- */
function initPortfolioFilter() {
  const bar = document.querySelector('[data-filter-bar]');
  if (!bar) return;
  const items = document.querySelectorAll('[data-portfolio-item]');

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    bar.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    const filter = btn.dataset.filter;
    items.forEach((item) => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.hidden = !match;
    });
  });
}

/* ---------------------------------- Newsletter form ---------------------------------- */
function initNewsletterForm() {
  document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('[data-form-note]');
      form.querySelector('input').value = '';
      if (note) {
        note.textContent = 'Thank you — you are on the list.';
      }
    });
  });
}

/* ---------------------------------- Contact form ---------------------------------- */
function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const success = document.querySelector('[data-form-success]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (success) success.classList.add('show');
    form.reset();
    if (success) success.focus();
  });
}

/* ---------------------------------- Set active nav link ---------------------------------- */
function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.setAttribute('aria-current', 'page');
  });
}

/* ---------------------------------- Init ---------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  markActiveNav();
  renderShopGrid();
  renderFeaturedProducts();
  initProductPage();
  renderCartPage();
  initPortfolioFilter();
  initNewsletterForm();
  initContactForm();
});

/* ==========================================================================
   THE EDITED STUDIO — Cart
   Fully working shopping cart backed by Local Storage.
   Exposes window.Cart so other scripts (app.js, product pages) can use it.
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'editedStudioCart';
  const SHIPPING_FLAT_RATE = 12; // flat shipping, waived over free-shipping threshold
  const FREE_SHIPPING_THRESHOLD = 150;

  /** Read cart array from Local Storage. */
  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn('Cart: could not read Local Storage, starting empty.', err);
      return [];
    }
  }

  /** Persist cart array to Local Storage and notify listeners. */
  function writeCart(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Cart: could not save to Local Storage.', err);
    }
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: { items } }));
  }

  /** Add a product to the cart, or increase quantity if it already exists. */
  function addItem(product, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    const items = readCart();
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: qty
      });
    }
    writeCart(items);
    return items;
  }

  /** Set an item's quantity explicitly (min 1). Removes if set to 0. */
  function setQty(id, qty) {
    let items = readCart();
    qty = parseInt(qty, 10);
    if (isNaN(qty) || qty < 1) {
      items = items.filter((i) => i.id !== id);
    } else {
      const item = items.find((i) => i.id === id);
      if (item) item.qty = qty;
    }
    writeCart(items);
    return items;
  }

  /** Increase/decrease quantity by a delta (e.g. +1 / -1). */
  function changeQty(id, delta) {
    const items = readCart();
    const item = items.find((i) => i.id === id);
    if (!item) return items;
    return setQty(id, item.qty + delta);
  }

  /** Remove an item entirely regardless of quantity. */
  function removeItem(id) {
    const items = readCart().filter((i) => i.id !== id);
    writeCart(items);
    return items;
  }

  /** Empty the whole cart. */
  function clearCart() {
    writeCart([]);
  }

  /** Total number of units in the cart (for the nav badge). */
  function itemCount() {
    return readCart().reduce((sum, i) => sum + i.qty, 0);
  }

  /** Subtotal, shipping and total, in dollars. */
  function totals() {
    const items = readCart();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }

  function formatPrice(amount) {
    return '$' + amount.toFixed(2);
  }

  /** Update every cart-count badge on the page (nav icon). */
  function refreshCartBadges() {
    const count = itemCount();
    document.querySelectorAll('.cart-count').forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  document.addEventListener('cart:updated', refreshCartBadges);
  document.addEventListener('DOMContentLoaded', refreshCartBadges);

  // Keep multiple open tabs in sync.
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) refreshCartBadges();
  });

  window.Cart = {
    read: readCart,
    addItem,
    setQty,
    changeQty,
    removeItem,
    clearCart,
    itemCount,
    totals,
    formatPrice,
    FREE_SHIPPING_THRESHOLD
  };
})();

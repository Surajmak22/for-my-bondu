/* ============================================
   STORE.JS — Love Store Cart System
   ============================================ */

const LoveStore = {
  cart: [],

  init() {
    this.bindButtons();
    this.updateCartBadge();
  },

  bindButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = btn.closest('.product-card');
        const item = {
          id: card.dataset.id,
          name: card.dataset.name,
          emoji: card.dataset.emoji,
          price: card.dataset.price || 'Free forever'
        };
        this.addToCart(item, btn, e);
      });
    });

    // Floating cart click -> scroll to checkout
    const floatingCart = document.getElementById('floating-cart');
    if (floatingCart) {
      floatingCart.addEventListener('click', () => {
        const checkout = document.getElementById('checkout');
        if (checkout) checkout.scrollIntoView({ behavior: 'smooth' });
      });
    }
  },

  addToCart(item, btn, event) {
    // Check if already in cart
    const exists = this.cart.find(i => i.id === item.id);
    if (exists) {
      exists.qty = (exists.qty || 1) + 1;
    } else {
      item.qty = 1;
      this.cart.push(item);
    }

    // Button feedback
    const originalText = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = '✓ Added!';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = originalText;
    }, 1200);

    // Heart burst animation
    this.createHeartBurst(btn, event);

    // Update UI
    this.updateCartBadge();
    this.updateCartSummary();
  },

  createHeartBurst(btn, event) {
    const burst = document.createElement('div');
    burst.classList.add('heart-burst');
    
    const hearts = ['❤️', '💕', '💖', '💗', '💝', '🩷'];
    
    for (let i = 0; i < 6; i++) {
      const span = document.createElement('span');
      span.textContent = hearts[i % hearts.length];
      const angle = (360 / 6) * i;
      const distance = 40 + Math.random() * 30;
      span.style.setProperty('--tx', `${Math.cos(angle * Math.PI / 180) * distance}px`);
      span.style.setProperty('--ty', `${Math.sin(angle * Math.PI / 180) * distance}px`);
      burst.appendChild(span);
    }

    btn.appendChild(burst);
    setTimeout(() => burst.remove(), 700);
  },

  updateCartBadge() {
    const badge = document.getElementById('cart-count');
    const floatingCart = document.getElementById('floating-cart');
    const totalItems = this.cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    if (badge) badge.textContent = totalItems;
    if (floatingCart) {
      floatingCart.classList.toggle('has-items', totalItems > 0);
    }
  },

  updateCartSummary() {
    const container = document.getElementById('cart-items-list');
    if (!container) return;

    container.innerHTML = '';

    if (this.cart.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:#9ca3af;font-family:var(--font-handwritten);padding:20px;">Your cart is empty 💔</p>';
      return;
    }

    this.cart.forEach(item => {
      const row = document.createElement('div');
      row.classList.add('cart-item-row');
      row.innerHTML = `
        <span><span class="cart-item-emoji">${item.emoji}</span>${item.name} × ${item.qty || 1}</span>
        <span>${item.price}</span>
      `;
      container.appendChild(row);
    });

    // Total
    const totalRow = document.createElement('div');
    totalRow.classList.add('cart-total-row');
    totalRow.innerHTML = `<span>Total</span><span>∞ Love</span>`;
    container.appendChild(totalRow);
  },

  getCart() {
    return this.cart;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LoveStore.init();
});

/* ============================================
   CHECKOUT.JS — Password Validation & Receipt
   ============================================ */

const Checkout = {
  // Target date: May 5, 2025
  TARGET_YEAR: 2025,
  TARGET_MONTH: 4, // 0-indexed (4 = May)
  TARGET_DATE: 5,

  currentDate: new Date(),
  selectedDate: null,

  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

  init() {
    this.form = document.getElementById('checkout-form');
    this.btn = document.getElementById('checkout-btn');
    this.errorMsg = document.getElementById('password-error');
    
    // Calendar UI elements
    this.calTrigger = document.getElementById('calendar-trigger-btn');
    this.calDisplay = document.getElementById('cal-display');
    this.calPopup = document.getElementById('mini-calendar');
    this.calPrev = document.getElementById('cal-prev');
    this.calNext = document.getElementById('cal-next');
    this.calMonthYear = document.getElementById('cal-month-year');
    this.calDays = document.getElementById('cal-days');
    this.heart = document.getElementById('password-heart');
    this.downloadBtn = document.getElementById('download-receipt-btn');

    if (!this.form || !this.calTrigger) return;

    // Set initial calendar view to the target date's month/year to make it easier to find
    this.currentDate = new Date(this.TARGET_YEAR, this.TARGET_MONTH, 1);

    // Event Listeners
    this.calTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCalendar();
    });

    // Close calendar when clicking outside
    document.addEventListener('click', (e) => {
      if (this.calPopup.classList.contains('show') && 
          !this.calPopup.contains(e.target) && 
          e.target !== this.calTrigger) {
        this.closeCalendar();
      }
    });

    // Prevent closing when clicking inside calendar
    this.calPopup.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    this.calPrev.addEventListener('click', () => this.changeMonth(-1));
    this.calNext.addEventListener('click', () => this.changeMonth(1));

    this.btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.validate();
    });

    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.downloadPDF());
    }

    this.renderCalendar();
  },

  toggleCalendar() {
    this.calPopup.classList.toggle('show');
    this.calTrigger.classList.toggle('active');
    
    // Reset error states when opening calendar
    this.calTrigger.classList.remove('error', 'success');
    this.errorMsg.classList.remove('show');
  },
  
  closeCalendar() {
    this.calPopup.classList.remove('show');
    this.calTrigger.classList.remove('active');
  },

  changeMonth(dir) {
    this.currentDate.setMonth(this.currentDate.getMonth() + dir);
    this.renderCalendar();
  },

  renderCalendar() {
    this.calDays.innerHTML = '';
    
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.calMonthYear.textContent = `${this.monthNames[month]} ${year}`;
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty slots for days before first of month
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'cal-day empty';
      this.calDays.appendChild(emptyDiv);
    }
    
    // Add days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'cal-day';
      dayDiv.textContent = i;
      
      // Check if this day is currently selected
      if (this.selectedDate && 
          this.selectedDate.getDate() === i && 
          this.selectedDate.getMonth() === month && 
          this.selectedDate.getFullYear() === year) {
        dayDiv.classList.add('selected');
      }
      
      dayDiv.addEventListener('click', () => this.selectDate(i, month, year));
      this.calDays.appendChild(dayDiv);
    }
  },

  selectDate(date, month, year) {
    this.selectedDate = new Date(year, month, date);
    
    // Update display
    this.calDisplay.textContent = `${this.monthNames[month]} ${date}, ${year}`;
    this.calDisplay.style.color = 'var(--checkout-text)';
    
    // Re-render to show selection
    this.renderCalendar();
    
    // Close calendar and enable button
    setTimeout(() => {
      this.closeCalendar();
      this.btn.disabled = false;
      this.calTrigger.classList.remove('error');
      this.errorMsg.classList.remove('show');
    }, 200);
  },

  validate() {
    if (!this.selectedDate) {
      this.showError('Pick a date from the calendar first 💕');
      return;
    }

    const isMatch = 
      this.selectedDate.getFullYear() === this.TARGET_YEAR &&
      this.selectedDate.getMonth() === this.TARGET_MONTH &&
      this.selectedDate.getDate() === this.TARGET_DATE;

    if (isMatch) {
      this.success();
    } else {
      this.showError('That\'s not it... Try again, my love 💕');
      this.calTrigger.classList.add('error');
      setTimeout(() => this.calTrigger.classList.remove('error'), 600);
    }
  },

  showError(msg) {
    this.errorMsg.textContent = msg;
    this.errorMsg.classList.add('show');
  },

  success() {
    this.calTrigger.classList.add('success');
    this.heart.textContent = '💚';
    this.heart.classList.add('valid');
    this.btn.disabled = true;
    this.btn.textContent = '✓ Unlocked!';

    // Launch confetti
    this.launchConfetti();

    // Show receipt after delay
    setTimeout(() => {
      this.generateReceipt();
      const receipt = document.getElementById('receipt');
      if (receipt) {
        receipt.classList.add('unlocked');
        receipt.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1500);
  },

  generateReceipt() {
    const itemsList = document.getElementById('receipt-items-list');
    if (!itemsList) return;

    const cart = LoveStore.getCart();
    itemsList.innerHTML = '';

    if (cart.length === 0) {
      // Default items if cart is empty
      const defaults = [
        { emoji: '🤗', name: 'Warm Hugs', qty: '∞', price: 'Free' },
        { emoji: '💋', name: 'Sweet Kisses', qty: '∞', price: 'Free' },
        { emoji: '🥰', name: 'Cuddles', qty: '∞', price: 'Free' }
      ];
      defaults.forEach(item => this.addReceiptItem(itemsList, item));
    } else {
      cart.forEach(item => {
        this.addReceiptItem(itemsList, {
          emoji: item.emoji,
          name: item.name,
          qty: item.qty || '∞',
          price: item.price || 'Free'
        });
      });
    }

    // Set receipt number and date
    const receiptNum = document.getElementById('receipt-number');
    const receiptDate = document.getElementById('receipt-date');
    const receiptTime = document.getElementById('receipt-time');

    if (receiptNum) receiptNum.textContent = '#LOVE-' + Math.floor(Math.random() * 9000 + 1000);
    if (receiptDate) {
      const now = new Date();
      receiptDate.textContent = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    if (receiptTime) {
      const now = new Date();
      receiptTime.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
  },

  addReceiptItem(container, item) {
    const row = document.createElement('div');
    row.classList.add('receipt-item');
    row.innerHTML = `
      <span class="receipt-item-name">${item.emoji} ${item.name}</span>
      <span class="receipt-item-qty">×${item.qty}</span>
      <span class="receipt-item-price">${item.price}</span>
    `;
    container.appendChild(row);
  },

  downloadPDF() {
    const element = document.querySelector('.receipt-paper');
    if (!element) return;

    // Temporarily adjust styles for better PDF output if needed
    const opt = {
      margin:       10,
      filename:     'Love_Store_Receipt.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Change button text while generating
    const originalText = this.downloadBtn.innerHTML;
    this.downloadBtn.innerHTML = '⏳ Generating...';
    this.downloadBtn.disabled = true;

    html2pdf().set(opt).from(element).save().then(() => {
      this.downloadBtn.innerHTML = originalText;
      this.downloadBtn.disabled = false;
    }).catch(err => {
      console.error('PDF generation error:', err);
      this.downloadBtn.innerHTML = '❌ Failed to generate';
      setTimeout(() => {
        this.downloadBtn.innerHTML = originalText;
        this.downloadBtn.disabled = false;
      }, 2000);
    });
  },

  launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('confetti-canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#f472b6'];

    for (let i = 0; i < 120; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotationSpeed;
      });

      frame++;
      if (frame < 180) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }
    animate();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Checkout.init();
});

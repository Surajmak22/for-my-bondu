/* ============================================
   MAIN.JS — Navigation, Scroll, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initTypewriter();
  initParallax();
  initFinalPage();
  initLetterDownload();
});

/* ---- Section Navigation ---- */
function initNavigation() {
  const dots = document.querySelectorAll('.nav-dot');
  const sections = document.querySelectorAll('.page-section');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.dataset.section;
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Update active dot on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(d => d.classList.remove('active'));
        const activeDot = document.querySelector(`.nav-dot[data-section="${id}"]`);
        if (activeDot) activeDot.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // Hero CTA scroll button
  const heroBtn = document.getElementById('hero-cta-btn');
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const bondu = document.getElementById('bondu');
      if (bondu) bondu.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ---- Scroll Reveal Animations ---- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ---- Typewriter Effect ---- */
function initTypewriter() {
  const el = document.querySelector('.typewriter-text');
  if (!el) return;

  const text = el.dataset.text || el.textContent;
  el.textContent = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, 80);
    }
  }

  // Start typewriter when hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(type, 800);
      heroObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const hero = document.getElementById('hero');
  if (hero) heroObserver.observe(hero);
}

/* ---- Subtle Parallax on Mouse Move ---- */
function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const sparkles = hero.querySelector('.hero-sparkles');
    if (!sparkles) return;

    const xShift = (e.clientX / window.innerWidth - 0.5) * 20;
    const yShift = (e.clientY / window.innerHeight - 0.5) * 20;
    sparkles.style.transform = `translate(${xShift}px, ${yShift}px)`;
  });
}

/* ---- Final Page: YES buttons → Video Reveal ---- */
function initFinalPage() {
  const yesBtn1 = document.getElementById('yes-btn-1');
  const yesBtn2 = document.getElementById('yes-btn-2');
  const videoContainer = document.getElementById('video-reveal');
  const video = document.getElementById('reveal-video');
  const questionContainer = document.getElementById('question-container');

  function revealVideo() {
    if (!videoContainer) return;
    
    // Hide the question
    if (questionContainer) {
      questionContainer.style.opacity = '0';
      questionContainer.style.transform = 'translateY(-20px)';
      questionContainer.style.transition = 'all 0.5s ease';
      setTimeout(() => {
        questionContainer.style.display = 'none';
      }, 500);
    }

    // Show the video
    setTimeout(() => {
      videoContainer.style.display = 'block';
      if (video) {
        video.play().catch(e => console.log('Video autoplay blocked:', e));
      }
      videoContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  }

  if (yesBtn1) yesBtn1.addEventListener('click', revealVideo);
  if (yesBtn2) yesBtn2.addEventListener('click', revealVideo);
}

/* ---- Love Letter PDF Download ---- */
function initLetterDownload() {
  const downloadBtn = document.getElementById('download-letter-btn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    const element = document.querySelector('.letter-paper');
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     'Love_Letter.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '⏳ Generating...';
    downloadBtn.disabled = true;

    html2pdf().set(opt).from(element).save().then(() => {
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }).catch(err => {
      console.error('PDF generation error:', err);
      downloadBtn.innerHTML = '❌ Failed';
      setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
      }, 2000);
    });
  });
}


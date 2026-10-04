/**
 * Al-Fadhel Telecom — Landing Page Interactive Engine
 * Controls: Live Calculator Widget, Scroll Progress, Intersection Observer Reveal,
 * Bento Spotlight, Device Image Switcher & Smooth Navigation.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Mark JS enabled for CSS reveals
  document.documentElement.classList.add('js');

  // --------------------------------------------------------------------------
  // 1. Scroll Progress Bar & Back to Top Button
  // --------------------------------------------------------------------------
  const progressBar = document.getElementById('lpProgress');
  const toTopBtn = document.getElementById('lpToTop');

  function updateScrollState() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = progressPercent + '%';
    }

    if (toTopBtn) {
      toTopBtn.style.setProperty('--p', Math.round(progressPercent));
      if (scrollTop > 400) {
        toTopBtn.classList.add('is-shown');
      } else {
        toTopBtn.classList.remove('is-shown');
      }
    }
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  if (toTopBtn) {
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  // Single-click offcanvas backdrop close listener
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('offcanvas-backdrop')) {
      const openOffcanvas = document.querySelector('.offcanvas.show');
      if (openOffcanvas && window.bootstrap && bootstrap.Offcanvas) {
        const instance = bootstrap.Offcanvas.getInstance(openOffcanvas) || new bootstrap.Offcanvas(openOffcanvas);
        if (instance) instance.hide();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 2. Navbar Floating & Active Link Scrollspy
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('lpNav');
  const navLinks = document.querySelectorAll('.lp-nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    const scrollTop = window.scrollY;

    if (navbar) {
      if (scrollTop > 30) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }

    let currentSectionId = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (currentSectionId && link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // --------------------------------------------------------------------------
  // 3. Live Device Booking Calculator
  // --------------------------------------------------------------------------
  const modelBtns = document.querySelectorAll('.lp-model');
  const previewImg = document.getElementById('calcPreviewImg');
  const tagEl = document.getElementById('calcTag');
  const priceTagEl = document.getElementById('calcPriceTag');
  const qtyMinus = document.getElementById('calcMinus');
  const qtyPlus = document.getElementById('calcPlus');
  const qtyVal = document.getElementById('calcQty');

  const capitalEl = document.getElementById('calcCapitalVal');
  const profitEl = document.getElementById('calcProfitVal');
  const totalEl = document.getElementById('calcTotalVal');

  let activePrice = 6348.00;
  let activeQty = 2;

  function formatCurrency(val) {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function updateCalculations() {
    const capital = activePrice * activeQty;
    const profit = capital * 0.07;
    const total = capital + profit;

    if (capitalEl) capitalEl.textContent = formatCurrency(capital);
    if (profitEl) profitEl.textContent = '+' + formatCurrency(profit);
    if (totalEl) totalEl.textContent = formatCurrency(total);
  }

  modelBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      modelBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      activePrice = parseFloat(this.getAttribute('data-price')) || 6348;
      const name = this.getAttribute('data-name') || 'iPhone 17 Pro 1TB';
      const imgSrc = this.getAttribute('data-img') || './src/image/product_1 (1).webp';

      if (tagEl) tagEl.textContent = name;
      if (priceTagEl) priceTagEl.textContent = formatCurrency(activePrice) + ' ريال';

      if (previewImg && previewImg.getAttribute('src') !== imgSrc) {
        previewImg.classList.add('is-swapping');
        setTimeout(function () {
          previewImg.setAttribute('src', imgSrc);
          previewImg.classList.remove('is-swapping');
        }, 180);
      }

      updateCalculations();
    });
  });

  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', function () {
      if (activeQty > 1) {
        activeQty--;
        qtyVal.textContent = activeQty;
        updateWidgetCalculations();
      }
    });

    qtyPlus.addEventListener('click', function () {
      if (activeQty < 50) {
        activeQty++;
        qtyVal.textContent = activeQty;
        updateWidgetCalculations();
      }
    });
  }

  function updateWidgetCalculations() {
    updateCalculations();
  }

  updateCalculations();

  // --------------------------------------------------------------------------
  // 4. Bento Card Spotlight Tracking Effect
  // --------------------------------------------------------------------------
  const bentoCards = document.querySelectorAll('.lp-bento');
  bentoCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });

  // --------------------------------------------------------------------------
  // 5. Intersection Observer Reveal Animations & Number Counters
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal, .lp-steps-line, .lp-bento-navy');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // Animate counter numbers if present
          const counters = entry.target.querySelectorAll('.lp-counter');
          counters.forEach(function (counter) {
            if (!counter.classList.contains('counted')) {
              counter.classList.add('counted');
              const targetNum = parseFloat(counter.getAttribute('data-target')) || 0;
              const isDecimal = counter.getAttribute('data-decimal') === 'true';
              let count = 0;
              const step = targetNum / 40;
              const timer = setInterval(function () {
                count += step;
                if (count >= targetNum) {
                  count = targetNum;
                  clearInterval(timer);
                }
                counter.textContent = isDecimal ? count.toFixed(1) : Math.floor(count);
              }, 30);
            }
          });
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
});

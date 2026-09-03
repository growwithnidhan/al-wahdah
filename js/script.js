/* ==========================================================================
   AL WAHDAH — LUXURY MOTION & INTERACTION ENGINE
   Production-grade vanilla JS with GSAP, Lenis & accessible fallbacks
   Domain: wahdahae.com
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. ACTIVE NAVIGATION & HEADER STATE
     ------------------------------------------------------------------------ */
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '') {
      currentPath = 'index.html';
    }

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');
      if (linkHref) {
        const linkPath = linkHref.split('/').pop().split('#')[0];
        if (linkPath === currentPath) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      }
    });

    // Header scroll background & compacting
    const header = document.querySelector('.site-header');
    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 24) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
  }

  /* ------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!toggleBtn || !navMenu) return;

    function openMenu() {
      navMenu.classList.add('is-active');
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      navMenu.classList.remove('is-active');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.contains('is-active') ? closeMenu() : openMenu();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close when nav links clicked
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    window._closeMobileMenu = closeMenu;
  }

  /* ------------------------------------------------------------------------
     3. BESPOKE CUSTOM CURSOR (Desktop Lerp Physics)
     ------------------------------------------------------------------------ */
  function initCustomCursor() {
    // Only initialize on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1025) return;

    let cursor = document.querySelector('.custom-cursor');
    let follower = document.querySelector('.custom-cursor-follower');

    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);
    }

    if (!follower) {
      follower = document.createElement('div');
      follower.className = 'custom-cursor-follower';
      follower.innerHTML = '<span class="cursor-text">View</span>';
      document.body.appendChild(follower);
    }

    const cursorText = follower.querySelector('.cursor-text');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
      // Direct position for inner cursor
      cursorX += (mouseX - cursorX) * 0.7;
      cursorY += (mouseY - cursorY) * 0.7;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

      // Smooth lerp for trailing follower
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive target triggers
    const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .filter-btn-luxury, .service-chip');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    const viewTargets = document.querySelectorAll('.product-card-luxury, .discipline-card, [data-cursor="view"]');
    viewTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-view');
        if (cursorText) cursorText.textContent = target.getAttribute('data-cursor-text') || 'View';
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-view');
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. LIVE UAE LOCAL TIME & OPERATIONAL STATUS
     ------------------------------------------------------------------------ */
  function initLiveTimeClock() {
    const timeElements = document.querySelectorAll('[data-live-uae-time]');
    if (!timeElements.length) return;

    function updateTime() {
      const now = new Date();
      // Format to UAE Time (Asia/Dubai, UTC+4)
      const options = {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      try {
        const uaeTimeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
        timeElements.forEach((el) => {
          el.textContent = `${uaeTimeStr} GST (UTC+4)`;
        });
      } catch (e) {
        // Fallback calculation
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const uaeDate = new Date(utc + (3600000 * 4));
        const hours = String(uaeDate.getHours()).padStart(2, '0');
        const minutes = String(uaeDate.getMinutes()).padStart(2, '0');
        timeElements.forEach((el) => {
          el.textContent = `${hours}:${minutes} GST (UTC+4)`;
        });
      }
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL & STATS COUNTER ANIMATION
     ------------------------------------------------------------------------ */
  function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal, [data-reveal]');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            
            // Check if element contains numerical counter
            const counters = entry.target.querySelectorAll('[data-counter-target]');
            counters.forEach((counter) => animateCounter(counter));

            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach((el) => revealObserver.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-visible'));
    }

    function animateCounter(counter) {
      if (counter.dataset.animated === 'true') return;
      counter.dataset.animated = 'true';

      const target = parseFloat(counter.getAttribute('data-counter-target'));
      const isDecimal = String(target).includes('.');
      const duration = 1800; // ms
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo curve
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = target * easeOut;

        counter.textContent = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = isDecimal ? target.toFixed(2) : target;
        }
      }
      requestAnimationFrame(update);
    }
  }

  /* ------------------------------------------------------------------------
     6. PRODUCT CATEGORY FILTERING
     ------------------------------------------------------------------------ */
  function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn-luxury');
    const productItems = document.querySelectorAll('.product-item-wrap');
    if (!filterBtns.length || !productItems.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter');

        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        productItems.forEach((item) => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat === category) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            }, 20);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px) scale(0.96)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. PRODUCT LIGHTBOX MODAL
     ------------------------------------------------------------------------ */
  function initProductModal() {
    const modal = document.querySelector('#product-luxury-modal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-description');
    const modalTag = modal.querySelector('.modal-tag');
    const modalMediaSlot = modal.querySelector('.modal-media-slot');
    const modalSpecsSlot = modal.querySelector('.modal-specs-slot');
    const modalEnquireBtn = modal.querySelector('.modal-enquire-btn');
    const closeBtns = modal.querySelectorAll('[data-close-modal]');
    const triggers = document.querySelectorAll('[data-open-product-modal]');

    let previousActiveEl = null;

    function openModal(card) {
      previousActiveEl = document.activeElement;

      const title = card.getAttribute('data-title') || 'Al Wahdah Precision Spec';
      const desc = card.getAttribute('data-desc') || 'Manufactured with high-precision tolerances and industrial finishing.';
      const category = card.getAttribute('data-category-name') || 'Fabrication';
      const imgSrc = card.getAttribute('data-img-src') || '';
      const specs = card.getAttribute('data-specs') || '';
      const serviceSlug = card.getAttribute('data-service-slug') || 'custom';

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalTag) modalTag.textContent = category;

      if (modalMediaSlot && imgSrc) {
        modalMediaSlot.innerHTML = `<img src="${imgSrc}" alt="${title}" loading="eager">`;
      }

      if (modalSpecsSlot && specs) {
        try {
          const specObj = JSON.parse(specs);
          let rowsHtml = '';
          for (const [key, val] of Object.entries(specObj)) {
            rowsHtml += `
              <div class="modal-spec-row">
                <span class="modal-spec-key">${key}</span>
                <span class="modal-spec-val">${val}</span>
              </div>
            `;
          }
          modalSpecsSlot.innerHTML = `<div class="modal-specs-list">${rowsHtml}</div>`;
        } catch (e) {
          modalSpecsSlot.innerHTML = '';
        }
      }

      if (modalEnquireBtn) {
        modalEnquireBtn.setAttribute('href', `contact.html?service=${serviceSlug}&product=${encodeURIComponent(title)}`);
      }

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const firstBtn = modal.querySelector('button, a');
      if (firstBtn) firstBtn.focus();
    }

    function closeModal() {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (previousActiveEl && typeof previousActiveEl.focus === 'function') {
        previousActiveEl.focus();
      }
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(trigger);
      });
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(trigger);
        }
      });
    });

    closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window._closeProductModal = closeModal;
  }

  /* ------------------------------------------------------------------------
     8. CONTACT FORM & INTERACTIVE SPEC CONFIGURATOR
     ------------------------------------------------------------------------ */
  function initContactConfigurator() {
    const form = document.querySelector('#luxury-enquiry-form');
    if (!form) return;

    const chips = form.querySelectorAll('.service-chip');
    const serviceInput = form.querySelector('#selected-service-input');
    const whatsappBtn = document.querySelector('#direct-whatsapp-dispatch');

    // Parse URL query parameters (e.g. ?service=acrylic or ?product=...)
    const urlParams = new URLSearchParams(window.location.search);
    const initialService = urlParams.get('service');
    const initialProduct = urlParams.get('product');

    if (initialService) {
      chips.forEach((chip) => {
        if (chip.getAttribute('data-service-val') === initialService) {
          chip.classList.add('selected');
          if (serviceInput) serviceInput.value = chip.textContent.trim();
        } else {
          chip.classList.remove('selected');
        }
      });
    }

    if (initialProduct) {
      const messageField = form.querySelector('#message');
      if (messageField && !messageField.value) {
        messageField.value = `Enquiry regarding: ${initialProduct}\n\nPlease provide technical blueprint consultation and production estimation.`;
      }
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
        if (serviceInput) {
          serviceInput.value = chip.textContent.trim();
        }
      });
    });

    // Form Submission Validation
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone');
    const messageInput = form.querySelector('#message');
    const statusAlert = form.querySelector('#form-status-alert');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let errors = [];

      if (!nameInput || !nameInput.value.trim()) {
        isValid = false;
        errors.push('Full Name is required');
        nameInput && nameInput.classList.add('has-error');
      } else {
        nameInput && nameInput.classList.remove('has-error');
      }

      if (!emailInput || !emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        isValid = false;
        errors.push('Valid Email Address is required');
        emailInput && emailInput.classList.add('has-error');
      } else {
        emailInput && emailInput.classList.remove('has-error');
      }

      if (!messageInput || !messageInput.value.trim() || messageInput.value.trim().length < 8) {
        isValid = false;
        errors.push('Please provide detailed project specifications (at least 8 characters)');
        messageInput && messageInput.classList.add('has-error');
      } else {
        messageInput && messageInput.classList.remove('has-error');
      }

      if (!isValid) {
        if (statusAlert) {
          statusAlert.className = 'form-status-alert error';
          statusAlert.innerHTML = `<strong>Please correct the following:</strong><br>${errors.join('<br>')}`;
        }
        return;
      }

      // Success
      if (statusAlert) {
        const selectedDiscipline = serviceInput ? serviceInput.value : 'Custom Manufacturing';
        statusAlert.className = 'form-status-alert success';
        statusAlert.innerHTML = `
          <strong>✓ Specification Received</strong><br>
          Thank you, <strong>${nameInput.value.trim()}</strong>. Our technical engineering desk at Al Wahdah will review your <strong>${selectedDiscipline}</strong> blueprint and respond within 24 hours.
        `;
      }

      // Also compose optional WhatsApp quick link
      const waMsg = `Hello Al Wahdah Team,\nMy name is ${nameInput.value.trim()} (${emailInput.value.trim()}).\nService: ${serviceInput ? serviceInput.value : 'Manufacturing'}\nDetails: ${messageInput.value.trim()}`;
      if (whatsappBtn) {
        whatsappBtn.setAttribute('href', `https://wa.me/971529286262?text=${encodeURIComponent(waMsg)}`);
      }

      form.reset();
      // Re-select default chip
      if (chips.length) chips[0].classList.add('selected');
    });
  }

  /* ------------------------------------------------------------------------
     9. INTERACTIVE FAQ ACCORDION
     ------------------------------------------------------------------------ */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('is-open');
            const otherTrigger = other.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     10. GLOBAL KEYBOARD ACCESSIBILITY
     ------------------------------------------------------------------------ */
  function initKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (window._closeMobileMenu) window._closeMobileMenu();
        if (window._closeProductModal) window._closeProductModal();
      }
    });
  }

  /* ------------------------------------------------------------------------
     11. INITIALIZE ALL SUITES
     ------------------------------------------------------------------------ */
  initNavigation();
  initMobileNav();
  initCustomCursor();
  initLiveTimeClock();
  initScrollAnimations();
  initProductFilters();
  initProductModal();
  initContactConfigurator();
  initFaqAccordion();
  initKeyboardHandlers();
});

/* ==========================================================================
   AL WAHDAH — PRINTING & FABRICATION SOLUTIONS
   Main Client-Side Script (Vanilla JavaScript)
   Domain: wahdahae.com
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. ACTIVE NAVIGATION STATE
     ------------------------------------------------------------------------ */
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '') {
      currentPath = 'index.html';
    }

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute('href')?.split('/').pop();
      if (linkPath === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. MOBILE HAMBURGER NAVIGATION & OPEN/CLOSE
     ------------------------------------------------------------------------ */
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function openMobileMenu() {
    if (!toggleBtn || !navMenu) return;
    navMenu.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!toggleBtn || !navMenu) return;
    navMenu.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  function initMobileNav() {
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('is-active');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('is-active') &&
        !navMenu.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close mobile nav when links inside it are clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => closeMobileMenu());
    });
  }

  /* ------------------------------------------------------------------------
     3. STICKY NAVIGATION BEHAVIOR
     ------------------------------------------------------------------------ */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ------------------------------------------------------------------------
     4. SMOOTH SCROLLING FOR ANCHOR LINKS
     ------------------------------------------------------------------------ */
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();
          closeMobileMenu();

          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Focus on target for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      revealElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback for older browsers
      revealElements.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ------------------------------------------------------------------------
     6. PRODUCT CATEGORY FILTERING
     ------------------------------------------------------------------------ */
  function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-card-item');

    if (!filterButtons.length || !productItems.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');

        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        productItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. PRODUCT LIGHTBOX / MODAL
     ------------------------------------------------------------------------ */
  let previousActiveElement = null;

  function initLightbox() {
    const modal = document.querySelector('#product-modal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalMediaContainer = modal.querySelector('.modal-media-slot');
    const closeBtns = modal.querySelectorAll('[data-close-modal]');
    const triggerCards = document.querySelectorAll('[data-open-modal]');

    function openModal(card) {
      previousActiveElement = document.activeElement;

      const title = card.getAttribute('data-title') || 'Product Details';
      const desc = card.getAttribute('data-desc') || 'High-precision manufacturing and premium finishing solution.';
      const mediaHtml = card.querySelector('.media-placeholder')?.outerHTML || '<div class="media-placeholder"><span class="media-placeholder-text">Preview Image</span></div>';

      if (modalTitle) modalTitle.textContent = title;
      if (modalDescription) modalDescription.textContent = desc;
      if (modalMediaContainer) modalMediaContainer.innerHTML = mediaHtml;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const focusable = modal.querySelector('button, [tabindex="0"]');
      if (focusable) focusable.focus();
    }

    function closeModal() {
      if (!modal.classList.contains('is-open')) return;

      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }

    triggerCards.forEach((card) => {
      card.addEventListener('click', () => openModal(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window._closeModal = closeModal;
  }

  /* ------------------------------------------------------------------------
     8. GLOBAL ESCAPE KEY & KEYBOARD ACCESSIBILITY HANDLER
     ------------------------------------------------------------------------ */
  function initKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        // Close Mobile Menu if open
        if (navMenu && navMenu.classList.contains('is-active')) {
          closeMobileMenu();
        }
        // Close Lightbox Modal if open
        if (window._closeModal) {
          window._closeModal();
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     9. CONTACT FORM VALIDATION & FRONTEND SUBMISSION
     ------------------------------------------------------------------------ */
  function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const feedbackArea = form.querySelector('.form-feedback');

    function showError(input, message) {
      const group = input.closest('.form-group');
      if (!group) return;

      group.classList.add('has-error');
      let errorEl = group.querySelector('.error-message');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.style.color = '#ef4444';
        errorEl.style.fontSize = '0.8125rem';
        errorEl.style.marginTop = '0.25rem';
        errorEl.style.display = 'block';
        group.appendChild(errorEl);
      }
      errorEl.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      const group = input.closest('.form-group');
      if (!group) return;

      group.classList.remove('has-error');
      const errorEl = group.querySelector('.error-message');
      if (errorEl) errorEl.remove();
      input.removeAttribute('aria-invalid');
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent default since there is no backend
      let isValid = true;

      // Validate Name
      if (nameInput) {
        if (!nameInput.value.trim()) {
          showError(nameInput, 'Full name is required.');
          isValid = false;
        } else {
          clearError(nameInput);
        }
      }

      // Validate Email
      if (emailInput) {
        if (!emailInput.value.trim()) {
          showError(emailInput, 'Email address is required.');
          isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
          showError(emailInput, 'Please enter a valid email address.');
          isValid = false;
        } else {
          clearError(emailInput);
        }
      }

      // Validate Message
      if (messageInput) {
        if (!messageInput.value.trim()) {
          showError(messageInput, 'Message cannot be empty.');
          isValid = false;
        } else if (messageInput.value.trim().length < 10) {
          showError(messageInput, 'Message should be at least 10 characters.');
          isValid = false;
        } else {
          clearError(messageInput);
        }
      }

      if (isValid) {
        if (feedbackArea) {
          feedbackArea.innerHTML = `
            <div style="padding: 1rem; background-color: rgba(163, 107, 76, 0.15); border: 1px solid var(--color-accent-brown); border-radius: 4px; color: var(--color-text-main); margin-top: 1rem;">
              <strong>Thank you for contacting Al Wahdah!</strong><br>
              Your message has been validated successfully. (Demo mode: No backend server attached).
            </div>
          `;
        }
        form.reset();
      }
    });

    // Real-time error clearing on input
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => clearError(input));
      }
    });
  }

  /* ------------------------------------------------------------------------
     INITIALIZATION
     ------------------------------------------------------------------------ */
  initActiveNav();
  initMobileNav();
  initStickyHeader();
  initSmoothScroll();
  initScrollReveal();
  initProductFilter();
  initLightbox();
  initKeyboardEvents();
  initContactForm();
});
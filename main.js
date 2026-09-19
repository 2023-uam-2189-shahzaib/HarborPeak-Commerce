/**
 * HarborPeak Commerce - Core JavaScript Engine (Enhanced)
 * Handlers: Multi-View Router, Mobile Drawer, Keyboard Accessible FAQ Accordion,
 * Consultation & Legal Modals, Form Validation, and Accessibility Support.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. MULTI-VIEW NAVIGATION ROUTER
     ========================================================================== */
  const pageViews = document.querySelectorAll('.page-view');
  const desktopNavItems = document.querySelectorAll('.desktop-nav .nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileToggle = document.getElementById('mobile-toggle');

  function navigateToPage(targetPageId) {
    if (!targetPageId) return;

    const cleanId = targetPageId.replace('#', '');
    const pageElement = document.getElementById(`page-${cleanId}`);

    if (pageElement) {
      pageViews.forEach(view => view.classList.remove('active'));
      pageElement.classList.add('active');

      desktopNavItems.forEach(item => {
        if (item.dataset.page === cleanId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      mobileNavItems.forEach(item => {
        if (item.dataset.page === cleanId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Close mobile drawer if open
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (history.pushState) {
        history.pushState(null, null, `#${cleanId}`);
      } else {
        window.location.hash = cleanId;
      }
    }
  }

  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      navigateToPage(pageId);
    });
  });

  function handleInitialHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`page-${hash}`)) {
      navigateToPage(hash);
    } else {
      navigateToPage('home');
    }
  }

  window.addEventListener('popstate', handleInitialHash);
  handleInitialHash();


  /* ==========================================================================
     2. MOBILE MENU DRAWER TOGGLE & ACCESSIBILITY
     ========================================================================== */
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }


  /* ==========================================================================
     3. FAQ ACCORDION TOGGLE WITH KEYBOARD & ARIA SUPPORT
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item');
      const isCurrentlyActive = faqItem.classList.contains('active');
      
      // Close other open FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const qBtn = item.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isCurrentlyActive) {
        faqItem.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ==========================================================================
     4. MODAL POPUPS (CONSULTATION & LEGAL) WITH ESCAPE KEY SUPPORT
     ========================================================================== */
  const consultationModal = document.getElementById('consultation-modal');

  document.querySelectorAll('.btn-consultation-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (consultationModal) {
        consultationModal.classList.add('active');
        consultationModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  document.querySelectorAll('.open-legal-modal').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = link.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        targetModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  document.querySelectorAll('.modal-close, .close-modal-action').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ESC key listener to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        closeModal(modal);
      });
    }
  });


  /* ==========================================================================
     5. CONTACT FORM VALIDATION & DEMONSTRATION NOTICE SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('partner-contact-form');
  const successBox = document.getElementById('form-success-message');
  const resetFormBtn = document.getElementById('reset-form-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const validateInput = (id, checkFn) => {
        const input = document.getElementById(id);
        const formGroup = input ? input.closest('.form-group') : null;
        if (!input || !formGroup) return false;

        const val = input.type === 'checkbox' ? input.checked : input.value.trim();
        if (!checkFn(val)) {
          formGroup.classList.add('has-error');
          return false;
        } else {
          formGroup.classList.remove('has-error');
          return true;
        }
      };

      const isNameValid = validateInput('full_name', val => val.length >= 2);
      const isEmailValid = validateInput('email', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      const isInquiryTypeValid = validateInput('inquiry_type', val => val !== '');
      const isMessageValid = validateInput('message', val => val.length >= 5);
      const isConsentValid = validateInput('consent', val => val === true);

      const isValid = isNameValid && isEmailValid && isInquiryTypeValid && isMessageValid && isConsentValid;

      if (isValid) {
        contactForm.style.display = 'none';
        if (successBox) {
          successBox.style.display = 'block';
        }
      }
    });
  }

  if (resetFormBtn && contactForm) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = 'block';
      if (successBox) {
        successBox.style.display = 'none';
      }
      document.querySelectorAll('.form-group.has-error').forEach(group => {
        group.classList.remove('has-error');
      });
    });
  }

});

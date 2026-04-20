/* ================================================================
   AXYONA — main.js
   Animaciones, navegación, formulario — Vanilla JS puro
   ================================================================ */

(function () {
  'use strict';

  /* ── PILL NAV SCROLL ──────────────────────────────────────── */
  const pillNav = document.querySelector('.pill-nav');

  function updatePillNav() {
    if (!pillNav) return;
    pillNav.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updatePillNav, { passive: true });
  updatePillNav();


  /* ── INTERSECTION OBSERVER — ANIMACIONES ───────────────────── */
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));


  /* ── CONTADORES ANIMADOS ────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(ease * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    el.textContent = '0';
    counterObserver.observe(el);
  });


  /* ── SMOOTH SCROLL ANCLAS INTERNAS ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── FORMULARIO DE CONTACTO ─────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const submitBtn = contactForm.querySelector('[type="submit"]');
    const successEl = document.getElementById('form-success');

    function validateField(group, input) {
      const value = input.value.trim();
      let valid = true;

      if (input.required && value === '') {
        valid = false;
      } else if (input.type === 'email' && value !== '') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      group.classList.toggle('has-error', !valid);
      return valid;
    }

    // Validación en tiempo real al salir del campo
    contactForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
      input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        if (group) validateField(group, input);
      });

      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          validateField(group, input);
        }
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validar todos los campos
      let allValid = true;
      contactForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        const group = input.closest('.form-group');
        if (group && !validateField(group, input)) allValid = false;
      });

      if (!allValid) {
        const firstError = contactForm.querySelector('.has-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Estado de loading
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Enviando…`;

      try {
        const formData = new FormData(contactForm);
        const action = contactForm.getAttribute('action');

        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          if (successEl) {
            successEl.classList.add('visible');
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          throw new Error('Error en el envío');
        }
      } catch {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        alert('Hubo un problema enviando el mensaje. Por favor escríbenos directamente a hola@axyona.co');
      }
    });
  }


  /* ── KEYFRAME SPIN para loading ─────────────────────────────── */
  if (!document.getElementById('ax-keyframes')) {
    const style = document.createElement('style');
    style.id = 'ax-keyframes';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }


  /* ── MOBILE DRAWER ───────────────────────────────────────────── */
  const drawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawer        = document.getElementById('mobileDrawer');
  const drawerOpenBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn= document.getElementById('mobileDrawerClose');

  function openDrawer() {
    if (!drawer || !drawerOverlay) return;
    drawerOverlay.style.display = 'block';
    requestAnimationFrame(() => {
      drawerOverlay.classList.add('open');
      drawer.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer || !drawerOverlay) return;
    drawerOverlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { drawerOverlay.style.display = 'none'; }, 320);
  }

  if (drawerOpenBtn)  drawerOpenBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay)  drawerOverlay.addEventListener('click', closeDrawer);

  // Close on nav link click
  if (drawer) {
    drawer.querySelectorAll('.mobile-drawer-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Swipe down to close
  if (drawer) {
    let startY = 0;
    drawer.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
    drawer.addEventListener('touchend',   e => { if (e.changedTouches[0].clientY - startY > 60) closeDrawer(); }, { passive: true });
  }

})();

/* ============================================================
   URBAN PLATE — JavaScript
   Navbar, mobile menu, menu tabs, scroll animations, active link
   ============================================================ */

(function () {
  'use strict';

  // Cache DOM elements
  const navbar    = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta');
  const navLinks  = document.querySelectorAll('.nav-link');
  const menuTabs  = document.querySelectorAll('.menu__tab');
  const menuPanels = document.querySelectorAll('.menu__panel');
  const sections  = document.querySelectorAll('section[id]');

  // ---- Navbar scroll effect ----
  function handleNavbarScroll() {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load

  // ---- Mobile menu toggle ----
  function openMobileNav() {
    navBurger.classList.add('open');
    navBurger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    navBurger.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  navBurger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.contains('open');
    isOpen ? closeMobileNav() : openMobileNav();
  });

  // Close mobile nav when a link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  // Close mobile nav on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // ---- Menu tabs ----
  menuTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const category = this.dataset.category;

      // Update active tab
      menuTabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      // Show corresponding panel
      menuPanels.forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.panel === category);
      });
    });
  });

  // ---- Scroll-triggered animations ----
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15,
      }
    );

    animatedElements.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything immediately
    animatedElements.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---- Active nav link on scroll ----
  function highlightActiveLink() {
    let currentSection = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
    });
  }

  window.addEventListener('scroll', highlightActiveLink, { passive: true });
  highlightActiveLink();

  // ---- Smooth scroll for all anchor links (fallback for older browsers) ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;

      window.scrollTo({
        top: target.offsetTop - navbarHeight,
        behavior: 'smooth',
      });
    });
  });
})();

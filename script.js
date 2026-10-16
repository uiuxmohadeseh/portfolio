(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const workToggle = document.querySelector('.mobile-menu-work-toggle');
  const workSubmenu = document.querySelector('#mobile-work-submenu');

  if (header && menuButton && mobileMenu && workToggle && workSubmenu) {
    const closeMenu = () => {
      mobileMenu.hidden = true;
      workSubmenu.hidden = true;
      workToggle.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      header.classList.remove('mobile-menu-open');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      mobileMenu.hidden = isOpen;
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      header.classList.toggle('mobile-menu-open', !isOpen);
    });

    workToggle.addEventListener('click', () => {
      const isOpen = workToggle.getAttribute('aria-expanded') === 'true';
      workSubmenu.hidden = isOpen;
      workToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.hidden) {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  const targets = document.querySelectorAll(
    '.hero, #about .section-heading, #work .section-heading, .bento-card, .work-card, .project-card, .case-intro, .study-card, .contact-hero, .contact-heading, .channel-card, .about-hero, .about-section, .about-principle, .career-item, .about-skill-card, .about-tools, .cta, footer'
  );

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  targets.forEach((element) => element.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -24px 0px'
  });

  targets.forEach((element) => observer.observe(element));
})();

(() => {
  const fa = document.documentElement.lang === 'fa';
  const menuButton = document.querySelector('.new-menu-button');
  const mobileNav = document.querySelector('.new-mobile-nav');
  function closeMenu() {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  }
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    mobileNav.hidden = !open;
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) {
      closeMenu(); menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.new-header')) closeMenu();
  });
  matchMedia('(min-width:1001px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  const links = [...document.querySelectorAll('.new-nav a')];
  const sections = [...document.querySelectorAll('.new-hero, main>section[id]')];
  if (sections.length && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const hash = entry.target.classList.contains('new-hero') ? '#top' : '#' + entry.target.id;
        links.forEach(link => {
          const active = link.hash === hash;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      }
    }, {rootMargin:'-15% 0px -65% 0px',threshold:0}).observe(document.querySelector('.new-hero'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin:'-15% 0px -65% 0px',threshold:0});
    sections.filter(section => section.id).forEach(section => observer.observe(section));
  }
  document.querySelectorAll('.new-language').forEach(link => {
    const path = link.getAttribute('href').split('#')[0];
    link.href = path + location.hash;
    link.addEventListener('click', () => {link.href = path + location.hash;});
  });
  function initializeScrollMotion() {
    if (!document.body.classList.contains('redesign-home') ||
        !('IntersectionObserver' in window) || !Element.prototype.animate) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMotion = matchMedia('(max-width:700px)');
    const active = new Map();
    const targets = new Set();
    function register(selector, kind, delay = 0) {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.dataset.scrollReveal = kind;
        element.dataset.scrollState = 'waiting';
        element.style.setProperty('--reveal-delay', `${typeof delay === 'function' ? delay(index) : delay}ms`);
        targets.add(element);
      });
    }
    register('.hero-hello', 'intro');
    register('.new-hero h1', 'intro', 70);
    register('.new-hero>p', 'intro', 140);
    register('.hero-buttons', 'intro', 210);
    register('.new-work>.section-label,.new-about>.section-label,.new-contact>.section-label', 'heading');
    register('.new-work>h2,.new-about>h2,.new-contact>h2', 'heading', 60);
    register('.career-intro,.new-contact>p:not(.new-status)', 'heading', 110);
    register('.featured-project', 'project');
    register('.timeline-card', 'timeline');
    register('.passion-copy', 'heading');
    register('.passion-notes', 'notes', 100);
    register('.new-quote', 'statement');
    register('.new-channel', 'contact', index => index * 75);

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        element.dataset.scrollState = 'visible';
        // Content is visible by default, including when JS or motion support is unavailable.
        if (reducedMotion.matches || element.contains(document.activeElement)) continue;
        const kind = element.dataset.scrollReveal;
        const box = element.getBoundingClientRect();
        let x = 0;
        let y = mobileMotion.matches ? 20 : 32;
        let delay = parseInt(element.style.getPropertyValue('--reveal-delay')) || 0;
        if (kind === 'intro' || kind === 'heading') y = 16;
        if (kind === 'project') {
          y = mobileMotion.matches ? 24 : 38;
          if (!mobileMotion.matches && element.closest('.featured-column')?.matches(':nth-child(2)')) delay = 100;
        }
        if (kind === 'timeline' && !mobileMotion.matches) {
          x = box.left + box.width / 2 < innerWidth / 2 ? -24 : 24;
          y = 16;
        }
        if (mobileMotion.matches && kind === 'contact') delay = 0;
        element.dataset.scrollState = 'entering';
        const animation = element.animate([
          {opacity:0,translate:`${x}px ${y}px`},
          {opacity:1,translate:'0px 0px'}
        ], {
          duration:kind === 'project' || kind === 'timeline' ? 680 : 560,
          delay,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'
        });
        active.set(element, animation);
        animation.onfinish = animation.oncancel = () => {
          element.dataset.scrollState = 'visible';
          active.delete(element);
        };
      }
    }, {rootMargin:'0px 0px -24px 0px',threshold:0.06});
    targets.forEach(element => observer.observe(element));
    // Keyboard navigation never has to wait for an entrance animation.
    document.addEventListener('focusin', event => {
      const element = event.target.closest('[data-scroll-reveal]');
      if (!element) return;
      observer.unobserve(element);
      element.dataset.scrollState = 'visible';
      active.get(element)?.finish();
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) active.forEach(animation => animation.finish());
    });
  }
  initializeScrollMotion();
  const status = document.querySelector('#copy-status');
  document.querySelectorAll('.new-copy').forEach(button => {
    let timer;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        button.classList.add('is-copied');
        status.textContent = fa ? 'کپی شد.' : 'Copied to clipboard.';
        clearTimeout(timer);
        timer = setTimeout(() => button.classList.remove('is-copied'), 2000);
      } catch (_) {
        status.textContent = fa ? 'کپی خودکار ممکن نشد؛ اطلاعات تماس را انتخاب و کپی کن.' : 'Please select and copy the contact information.';
      }
    });
  });
})();

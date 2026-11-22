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

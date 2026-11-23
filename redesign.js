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
    // Keep text and the hero immediately readable. Only the card surfaces enter.
    const targets = [...document.querySelectorAll('.featured-project,.timeline-card,.passion-notes,.new-channel')];
    targets.forEach(element => {
      element.dataset.scrollReveal = element.matches('.timeline-card') ? 'timeline' : 'card';
      element.dataset.scrollState = reducedMotion.matches ? 'visible' : 'waiting';
    });
    if (reducedMotion.matches) return;

    function settle(element) {
      element.dataset.scrollState = 'visible';
      active.delete(element);
    }
    const observer = new IntersectionObserver(entries => {
      let batchIndex = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        observer.unobserve(element);
        if (reducedMotion.matches || element.contains(document.activeElement)) {
          settle(element);
          continue;
        }
        const career = element.matches('.timeline-card');
        const rise = mobileMotion.matches ? 10 : career ? 12 : 16;
        const delay = mobileMotion.matches ? 0 : Math.min(batchIndex++ * 65,130);
        element.dataset.scrollState = 'entering';
        const animation = element.animate([
          {opacity:.3,translate:`0px ${rise}px`},
          {opacity:1,translate:'0px 0px'}
        ], {
          duration:career ? 620 : 700,
          delay,easing:'cubic-bezier(.22,.61,.36,1)',fill:'backwards'
        });
        active.set(element,animation);
        animation.onfinish = animation.oncancel = () => settle(element);
      }
    },{rootMargin:'0px 0px -32px 0px',threshold:.08});
    targets.forEach(element => observer.observe(element));
    document.addEventListener('focusin',event => {
      const element = event.target.closest('[data-scroll-reveal]');
      if (!element) return;
      observer.unobserve(element);
      active.get(element)?.finish();
      settle(element);
    });
    reducedMotion.addEventListener('change',event => {
      if (!event.matches) return;
      observer.disconnect();
      active.forEach(animation => animation.finish());
      targets.forEach(settle);
    });
  }
  initializeScrollMotion();
  function initializeHeroTyping() {
    const heading = document.querySelector('.redesign-home .new-hero h1');
    if (!heading || !Element.prototype.animate || !('IntersectionObserver' in window)) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;
    const lines = [...heading.querySelectorAll(':scope>span')];
    if (!lines.length) return;
    // Keep full, connected Persian text and its original layout throughout typing.
    heading.setAttribute('aria-label',lines.map(line=>line.textContent).join(' '));
    heading.dataset.typingState = 'preparing';
    heading.dataset.typedLines = '0';
    const rtl = getComputedStyle(heading).direction === 'rtl';
    const hiddenClip = rtl ? 'inset(-12px 0px -12px 100%)' : 'inset(-12px 100% -12px 0px)';
    lines.forEach(line=>{line.style.clipPath=hiddenClip;});
    const caret = document.createElement('i');
    caret.className = 'hero-typing-caret';
    caret.setAttribute('aria-hidden','true');
    const animations = new Set();
    let finished = false;
    let started = false;
    function finishTyping() {
      if (finished) return;
      finished = true;
      animations.forEach(animation=>animation.cancel());
      animations.clear();
      lines.forEach(line=>line.style.removeProperty('clip-path'));
      caret.remove();
      heading.dataset.typingState = 'complete';
      heading.dataset.typedLines = String(lines.length);
      observer.disconnect();
      window.removeEventListener('resize',finishTyping);
      reducedMotion.removeEventListener('change',onMotionChange);
    }
    function onMotionChange(event) {if (event.matches) finishTyping();}
    async function typeLines() {
      if (started || finished) return;
      started = true;
      try {
        await document.fonts.ready;
        if (finished) return;
        heading.dataset.typingState = 'typing';
        heading.append(caret);
        for (const [index,line] of lines.entries()) {
          if (finished) return;
          const text = line.firstChild;
          const segments = typeof Intl.Segmenter === 'function'
            ? [...new Intl.Segmenter(fa?'fa':'en',{granularity:'grapheme'}).segment(text.textContent)].map(part=>part.segment)
            : Array.from(text.textContent);
          const bounds = line.getBoundingClientRect();
          const headingBounds = heading.getBoundingClientRect();
          const range = document.createRange();
          const frames = [{clipPath:hiddenClip,offset:0,easing:'steps(1,end)'}];
          const caretFrames = [];
          let offset = 0;
          const cursorY = bounds.top-headingBounds.top+bounds.height*.13;
          caret.style.height = `${bounds.height*.75}px`;
          for (let count=0;count<=segments.length;count++) {
            if (count) offset += segments[count-1].length;
            range.setStart(text,0);range.setEnd(text,offset);
            const prefix = range.getBoundingClientRect();
            const edge = count ? (rtl?prefix.left:prefix.right) : (rtl?bounds.right:bounds.left);
            const cursorX = edge-headingBounds.left+(rtl?-4:3);
            caretFrames.push({translate:`${cursorX}px ${cursorY}px`,offset:count/segments.length,easing:'steps(1,end)'});
            if (!count) continue;
            const remaining = Math.max(0,Math.min(100,(rtl?edge-bounds.left:bounds.right-edge)/bounds.width*100));
            frames.push({clipPath:rtl?`inset(-12px 0px -12px ${remaining}%)`:`inset(-12px ${remaining}% -12px -2px)`,offset:count/segments.length,easing:'steps(1,end)'});
          }
          const timing = {duration:segments.length*105,delay:index?200:220,fill:'both'};
          const lettering = line.animate(frames,timing);
          const cursor = caret.animate(caretFrames,timing);
          animations.add(lettering);animations.add(cursor);
          await Promise.all([lettering.finished,cursor.finished]);
          if (finished) return;
          line.style.removeProperty('clip-path');
          lettering.cancel();cursor.cancel();
          animations.delete(lettering);animations.delete(cursor);
          heading.dataset.typedLines = String(index+1);
        }
        finishTyping();
      } catch (_) {finishTyping();}
    }
    const observer = new IntersectionObserver(entries=>{
      if (entries.some(entry=>entry.isIntersecting)) {observer.disconnect();typeLines();}
    },{threshold:.15});
    observer.observe(heading);
    window.addEventListener('resize',finishTyping,{passive:true});
    reducedMotion.addEventListener('change',onMotionChange);
  }
  initializeHeroTyping();
  document.querySelectorAll('.estate-stack').forEach(async stack => {
    const cards = [...stack.querySelectorAll('img')];
    if (cards.length !== 3 || !Element.prototype.animate) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const slots = ['translate(0,0) scale(1)','translate(0,-15%) scale(.93)','translate(0,-30%) scale(.865)'];
    let visible = false;
    new IntersectionObserver(entries => {visible = entries[0].isIntersecting;}).observe(stack);
    const depth = [
      {opacity:1,boxShadow:'0 4px 12px #05031945'},
      {opacity:.72,boxShadow:'0 3px 8px #05031930'},
      {opacity:.45,boxShadow:'0 2px 5px #05031920'}
    ];
    const settle = () => cards.forEach((card,index) => {
      card.style.transform = slots[index];
      card.style.zIndex = String(3-index);
      Object.assign(card.style,depth[index]);
    });
    async function move(card,from,to,fromDepth=0,toDepth=0) {
      const animation = card.animate([{transform:from,...depth[fromDepth]},{transform:to,...depth[toDepth]}],
        {duration:850,easing:'cubic-bezier(.25,.1,.25,1)',fill:'forwards'});
      await animation.finished;
      card.style.transform = to;
      Object.assign(card.style,depth[toDepth]);
      animation.cancel();
    }
    await Promise.all(cards.map(card => card.decode().catch(() => {})));
    settle();
    while (stack.isConnected) {
      await new Promise(resolve => setTimeout(resolve,2200));
      if (!visible || document.hidden || reduced.matches) continue;
      const [front,middle,back] = cards;
      // Keep depth fixed until the outgoing screen is completely outside the clip.
      await move(front,slots[0],'translate(0,115%) scale(1)');
      front.style.zIndex = '0';
      await Promise.all([
        move(middle,slots[1],slots[0],1,0),
        move(back,slots[2],slots[1],2,1),
        move(front,'translate(0,115%) scale(1)',slots[2],0,2)
      ]);
      cards.push(cards.shift());
      settle();
    }
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

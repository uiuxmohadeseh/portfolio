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
    register('.new-hero>p', 'intro', 140);
    register('.hero-buttons', 'intro', 210);
    register('.new-work>.section-label,.new-about>.section-label,.new-contact>.section-label', 'heading');
    register('.new-work>h2,.new-about>h2,.new-contact>h2', 'heading', 60);
    register('.career-intro,.new-contact>p:not(.new-status)', 'heading', 110);
    register('.featured-project', 'project');
    register('.passion-copy', 'heading');
    register('.passion-notes', 'notes', 100);
    register('.new-quote', 'statement');
    register('.new-channel', 'contact', index => index * 75);

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const element = entry.target;
        if (!entry.isIntersecting) {
          if (entry.boundingClientRect.top >= innerHeight && !active.has(element)) element.dataset.scrollState = 'waiting';
          continue;
        }
        if (element.dataset.scrollState === 'visible' || active.has(element)) continue;
        element.dataset.scrollState = 'visible';
        // Content is visible by default, including when JS or motion support is unavailable.
        if (reducedMotion.matches || element.contains(document.activeElement)) continue;
        const kind = element.dataset.scrollReveal;
        let delay = parseInt(element.style.getPropertyValue('--reveal-delay')) || 0;
        if (kind === 'project') {
          if (!mobileMotion.matches && element.closest('.featured-column')?.matches(':nth-child(2)')) delay = 100;
        }
        if (mobileMotion.matches && kind === 'contact') delay = 0;
        const rise = kind === 'project' ? 28 : kind === 'contact' ? 18 : kind === 'notes' ? 16 : 0;
        element.dataset.scrollState = 'entering';
        const animation = element.animate([
          {opacity:0,translate:`0px ${rise}px`},
          {opacity:1,translate:'0px 0px'}
        ], {
          duration:kind === 'project' ? 1250 : 1100,
          delay,easing:'cubic-bezier(.25,.1,.25,1)',fill:'backwards'
        });
        active.set(element, animation);
        animation.onfinish = animation.oncancel = () => {
          element.dataset.scrollState = element.getBoundingClientRect().top >= innerHeight ? 'waiting' : 'visible';
          active.delete(element);
        };
      }
    }, {rootMargin:'0px 0px -24px 0px',threshold:0.06});
    targets.forEach(element => observer.observe(element));

    // Scroll reveals each card in order, with a short reading pause between entries.
    const careerPause = 800;
    const timeline = [...document.querySelectorAll('.timeline-card')].map(element => {
      element.dataset.scrollReveal = 'timeline';
      element.dataset.scrollState = 'waiting';
      return {element,item:element.closest('.timeline-item'),progress:0,finished:false,released:false,completedAt:null};
    });
    let timelineFrame = 0;
    let previousFrameTime = 0;
    function showTimelineCard(card,permanent = false,time = performance.now()) {
      card.finished = permanent;
      card.progress = 1;
      card.released = true;
      if (card.completedAt === null) card.completedAt = time;
      card.element.dataset.scrollState = 'visible';
      card.element.style.removeProperty('opacity');
      card.element.style.removeProperty('translate');
      card.element.style.removeProperty('will-change');
    }
    function updateTimeline(time) {
      timelineFrame = 0;
      const elapsed = previousFrameTime ? Math.min(time - previousFrameTime, 50) : 16;
      previousFrameTime = time;
      const smoothing = 1 - Math.exp(-elapsed / 140);
      let unsettled = false;
      // Read the untransformed timeline items before writing animated card styles.
      const boxes = timeline.map(card => card.item.getBoundingClientRect());
      timeline.forEach((card,index) => {
        if (card.finished) return;
        if (reducedMotion.matches) {showTimelineCard(card,true);return;}
        const box = boxes[index];
        // Finish one entrance before the next card reaches its own trigger.
        const travel = Math.min(180,box.height * .9,innerHeight * .26);
        const scrollTarget = Math.max(0,Math.min(1,(innerHeight * .88 - box.top) / Math.max(1,travel)));
        if (scrollTarget === 1 && box.bottom < 0) {showTimelineCard(card,false,time);return;}
        let target = scrollTarget;
        let queued = false;
        if (target > 0 && !card.released) {
          const previous = timeline[index-1];
          if (previous && !previous.finished && (previous.progress < 1 || previous.completedAt === null || time-previous.completedAt < careerPause)) {
            target = 0;
            queued = true;
            unsettled = true;
          } else card.released = true;
        }
        card.progress += (target - card.progress) * smoothing;
        if (Math.abs(target - card.progress) < .002) card.progress = target;
        else unsettled = true;
        if (card.progress === 1) {showTimelineCard(card,false,time);return;}
        if (scrollTarget === 0 && card.progress === 0) {
          card.released = false;
          card.completedAt = null;
        }
        const eased = card.progress * card.progress * (3 - 2 * card.progress);
        card.element.style.opacity = String(eased);
        const side = box.left + box.width / 2 < innerWidth / 2 ? -1 : 1;
        const drift = mobileMotion.matches ? 0 : side * 10 * (1 - eased);
        card.element.style.translate = `${drift}px ${22 * (1 - eased)}px`;
        card.element.style.willChange = eased > 0 ? 'opacity, translate' : 'auto';
        card.element.dataset.scrollState = queued ? 'queued' : eased > 0 ? 'entering' : 'waiting';
      });
      if (unsettled) timelineFrame = requestAnimationFrame(updateTimeline);
      else previousFrameTime = 0;
    }
    function scheduleTimeline() {
      if (!timelineFrame) timelineFrame = requestAnimationFrame(updateTimeline);
    }
    window.addEventListener('scroll',scheduleTimeline,{passive:true});
    window.addEventListener('resize',scheduleTimeline,{passive:true});
    scheduleTimeline();
    // Keyboard navigation never has to wait for an entrance animation.
    document.addEventListener('focusin', event => {
      const element = event.target.closest('[data-scroll-reveal]');
      if (!element) return;
      observer.unobserve(element);
      element.dataset.scrollState = 'visible';
      active.get(element)?.finish();
      const careerCard = timeline.find(card => card.element === element);
      if (careerCard) showTimelineCard(careerCard,true);
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        active.forEach(animation => animation.finish());
        timeline.forEach(card=>showTimelineCard(card,true));
      }
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

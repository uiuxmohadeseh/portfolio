document.querySelectorAll('.rav-lifecycle').forEach(group => {
  const tabs = [...group.querySelectorAll('[data-lifecycle-tab]')];
  const panels = [...group.querySelectorAll('[data-lifecycle-panel]')];
  group.querySelector('.rav-lifecycle-tabs').setAttribute('role','tablist');
  function select(index,focus=false) {
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected',String(i===index));
      tab.tabIndex=i===index?0:-1;
      panels[i].hidden=i!==index;
    });
    if(focus) tabs[index].focus();
  }
  tabs.forEach((tab,index) => {
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-controls',panels[index].id);
    panels[index].setAttribute('role','tabpanel');
    panels[index].setAttribute('aria-labelledby',tab.id);
    panels[index].tabIndex=0;
    tab.addEventListener('click',()=>select(index));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();select(next,true);}
    });
  });
  select(0);
});

document.querySelectorAll('.rav-sidebar').forEach(sidebar => {
  const links = [...sidebar.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  let pending = false;
  function updateCurrent() {
    pending = false;
    const marker = window.innerHeight * 0.6;
    let current = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= marker) current = index;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      current = sections.length - 1;
    }
    links.forEach((link, index) => {
      const active = index === current;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleUpdate() {
    if (!pending) { pending = true; requestAnimationFrame(updateCurrent); }
  }
  window.addEventListener('scroll', scheduleUpdate, {passive:true});
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate, {once:true});
  updateCurrent();
});

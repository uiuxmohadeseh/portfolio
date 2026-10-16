(() => {
 document.querySelectorAll('.language-switch').forEach(link => {
  const target=link.getAttribute('href').split('#')[0];
  link.href=target+location.hash;
  link.addEventListener('click',()=>{link.href=target+location.hash});
 });
 if(document.documentElement.lang!=='fa')return;
 const labels={'Open navigation menu':'بازکردن منو','Close navigation menu':'بستن منو'};
 const toggle=document.querySelector('.mobile-menu-toggle');
 const translateLabel=()=>{const value=toggle?.getAttribute('aria-label');if(labels[value])toggle.setAttribute('aria-label',labels[value]);};
 translateLabel();if(toggle)new MutationObserver(translateLabel).observe(toggle,{attributes:true,attributeFilter:['aria-label']});
})();

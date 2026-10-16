(() => {
  const mobile = window.matchMedia('(max-width:850px)');
  let observer;
  function initializeReader() {
    document.querySelectorAll('.reader-toc').forEach(toc=>{toc.open=!mobile.matches});
    observer?.disconnect();
    const links=[...document.querySelectorAll('.reader-toc a')];
    if ('IntersectionObserver' in window) {
      observer=new IntersectionObserver(entries=>{
        for(const entry of entries) if(entry.isIntersecting){
          links.forEach(link=>link.classList.toggle('is-current',link.hash==='#'+entry.target.id));
        }
      },{rootMargin:'-110px 0px -55% 0px',threshold:0});
      document.querySelectorAll('.reading-section').forEach(section=>observer.observe(section));
    }
  }
  mobile.addEventListener('change',initializeReader);
  initializeReader();
  const gate=document.querySelector('.password-gate');
  if(!gate) return;
  const form=gate.querySelector('form'),input=gate.querySelector('input'),button=gate.querySelector('button');
  const status=document.querySelector('#gate-status'),reader=document.querySelector('#protected-reader'),lock=document.querySelector('.lock-study');
  const data=JSON.parse(document.querySelector('#protected-case-data').textContent);
  const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!input.value){status.textContent='رمز کیس‌استادی را وارد کن.';input.focus();return}
    if(!window.crypto?.subtle){status.textContent='برای بازکردن این کیس‌استادی از مرورگر به‌روز یا نسخه‌ی آنلاین استفاده کن.';return}
    button.disabled=true;status.textContent='در حال بازکردن…';input.removeAttribute('aria-invalid');
    try{
      const encoder=new TextEncoder();
      const base=await crypto.subtle.importKey('raw',encoder.encode(input.value),'PBKDF2',false,['deriveKey']);
      const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(data.salt),iterations:data.iterations,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['decrypt']);
      const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(data.iv),additionalData:encoder.encode('map-preparation-v1')},key,bytes(data.ciphertext));
      reader.innerHTML=new TextDecoder().decode(plaintext);
      reader.hidden=false;gate.hidden=true;lock.hidden=false;input.value='';status.textContent='';
      initializeReader();
      const first=reader.querySelector('h2');first.tabIndex=-1;first.focus({preventScroll:true});
    }catch(_){status.textContent='رمز درست نیست. دوباره امتحان کن.';input.setAttribute('aria-invalid','true');input.focus()}
    finally{button.disabled=false}
  });
  lock.addEventListener('click',()=>{
    observer?.disconnect();reader.replaceChildren();reader.hidden=true;gate.hidden=false;lock.hidden=true;input.value='';input.focus();
  });
})();

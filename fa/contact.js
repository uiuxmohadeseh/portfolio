(() => {
  const status = document.querySelector('#contact-copy-status');
  const timers = new WeakMap();
  async function copyValue(value) {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(value); return; } catch (_) {}
    }
    const previous = document.activeElement;
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    previous?.focus({preventScroll:true});
    if (!copied) throw new Error('Copy failed');
  }
  document.querySelectorAll('.copy-button').forEach((button) => {
    const originalLabel = button.getAttribute('aria-label');
    button.addEventListener('click', async () => {
      try {
        await copyValue(button.dataset.copy);
        clearTimeout(timers.get(button));
        button.classList.add('is-copied');
        button.setAttribute('aria-label', 'کپی شد!');
        button.title = 'کپی شد!';
        status.textContent = `${button.dataset.copyLabel} کپی شد.`;
        timers.set(button, setTimeout(() => {
          button.classList.remove('is-copied');
          button.setAttribute('aria-label', originalLabel);
          button.title = originalLabel;
        }, 2000));
      } catch (_) {
        status.textContent = 'کپی خودکار انجام نشد. اطلاعات بالا را انتخاب و کپی کن.';
      }
    });
  });
})();

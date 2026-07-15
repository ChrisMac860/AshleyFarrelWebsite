(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');

  const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menu?.classList.toggle('is-open', !isOpen);
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
  }));

  document.querySelectorAll('[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const serviceSelect = form?.elements.namedItem('service');
      if (!(serviceSelect instanceof HTMLSelectElement)) return;
      const service = link.getAttribute('data-service');
      serviceSelect.value = service === 'Mortgage advice' ? 'General mortgage advice' : 'Protection advice';
    });
  });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  document.querySelectorAll('.reveal').forEach((element) => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('is-visible');
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = encodeURIComponent(`Callback request: ${data.get('service')}`);
    const body = encodeURIComponent([
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Email: ${data.get('email')}`,
      `Service: ${data.get('service')}`,
      '',
      'Details:',
      String(data.get('message') || 'No additional details provided.')
    ].join('\n'));

    status.textContent = 'Opening your email application…';
    window.location.href = `mailto:Ashley@farrellfs.co.uk?subject=${subject}&body=${body}`;
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();

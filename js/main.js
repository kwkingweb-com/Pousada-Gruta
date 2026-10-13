(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const navLinks = nav ? [...nav.querySelectorAll('a')] : [];

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('is-open', !isOpen);
    });
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Active navigation follows the visible section while scrolling.
  const sections = ['inicio', 'pousada', 'acomodacoes', 'lazer', 'localizacao', 'contato']
    .map(id => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window && navLinks.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .15, .35, .6] });
    sections.forEach(section => observer.observe(section));
  }

  // Simple mobile testimonial switching; on wider screens all cards remain visible.
  const reviewCards = [...document.querySelectorAll('.review-card')];
  const dots = [...document.querySelectorAll('.review-dots span')];
  let reviewIndex = 0;
  function setReview(index) {
    if (!reviewCards.length) return;
    reviewIndex = (index + reviewCards.length) % reviewCards.length;
    reviewCards.forEach((card, i) => {
      card.classList.toggle('mobile-review-active', i === reviewIndex);
      if (window.innerWidth <= 640) card.style.display = i === reviewIndex ? 'block' : 'none';
      else card.style.display = '';
    });
    dots.forEach((dot, i) => dot.classList.toggle('selected', i === reviewIndex));
  }
  document.querySelector('.review-prev')?.addEventListener('click', () => setReview(reviewIndex - 1));
  document.querySelector('.review-next')?.addEventListener('click', () => setReview(reviewIndex + 1));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) reviewCards.forEach(card => card.style.display = '');
    else setReview(reviewIndex);
  });
  if (window.innerWidth <= 640) setReview(0);
})();

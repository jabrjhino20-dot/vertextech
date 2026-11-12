/* =====================================================================
   Vertex Tech — v2 · js/servicios.js
   1. Índice de grupos: resalta el grupo visible (scrollspy)
   2. Línea de luz del proceso que se dibuja con el scroll (GSAP; sin GSAP queda completa)
   ===================================================================== */
(function () {
  'use strict';
  const VT = window.VT;
  if (!VT) return;
  const $ = VT.$, $$ = VT.$$;

  /* ===== 1. SCROLLSPY ===== */
  const enlaces = $$('[data-spy]');
  if (enlaces.length && 'IntersectionObserver' in window) {
    const marcar = (id) => enlaces.forEach((a) => {
      const activo = a.dataset.spy === id;
      a.classList.toggle('activo', activo);
      if (activo) { a.setAttribute('aria-current', 'location'); }
      else a.removeAttribute('aria-current');
    });
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => { if (en.isIntersecting) marcar(en.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    enlaces.forEach((a) => { const s = document.getElementById(a.dataset.spy); if (s) io.observe(s); });
  }

  /* ===== 2. LÍNEA DE LUZ DEL PROCESO ===== */
  const gsap = window.gsap, ST = window.ScrollTrigger;
  const luz = $('[data-proceso-luz]');
  if (gsap && VT.reducirMovimiento()) { if (ST) ST.disable(); gsap.ticker.sleep(); return; } // sin animaciones: GSAP y ScrollTrigger no consumen recursos
  if (!luz || !gsap || !ST) return;
  gsap.registerPlugin(ST);
  const mm = gsap.matchMedia();
  const animar = (prop) => () => {
    gsap.fromTo(luz, { [prop]: 0 }, {
      [prop]: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-proceso]', start: 'top 75%', end: 'bottom 55%', scrub: true }
    });
    $$('.proceso__paso').forEach((paso) => {
      gsap.from(paso.querySelector('.proceso__num'), {
        scale: 0.4, opacity: 0.3, duration: 0.6, ease: 'back.out(2)',
        scrollTrigger: { trigger: paso, start: 'top 70%', toggleActions: 'play none none reverse' }
      });
    });
  };
  mm.add('(min-width: 900px)', animar('scaleX'));
  mm.add('(max-width: 899px)', animar('scaleY'));
})();

/* =====================================================================
   Vertex Tech — v2 · js/inicio.js
   Lógica propia del inicio:
    1. Red de partículas en canvas (reacciona al cursor/toque y converge al hacer scroll)
    2. Héroe y escenas de convergencia con GSAP + ScrollTrigger (solo escritorio)
    3. Carrusel de productos destacados
    4. Mini chat de IA con efecto de escritura
    5. Spotlight del bento y botón magnético
   Todo es opcional: si algo falla, el contenido ya está visible en el HTML.
   ===================================================================== */
(function () {
  'use strict';
  const VT = window.VT;
  if (!VT) return;
  const $ = VT.$, $$ = VT.$$;
  const reducir = VT.reducirMovimiento();

  /* ===== 0. VIDEO DEL HÉROE =====
     Solo se carga si no hay movimiento reducido ni ahorro de datos; si no, queda el poster.
     Se pausa cuando el héroe sale de pantalla para no gastar batería ni CPU. */
  (function videoHeroe() {
    const video = $('.hero-inicio__video');
    if (!video) return;
    const ahorroDatos = !!(navigator.connection && navigator.connection.saveData);
    if (reducir || ahorroDatos) { video.removeAttribute('autoplay'); return; }
    video.muted = true; // requisito para reproducción automática en móviles
    video.src = video.dataset.src;
    const reproducir = () => { const p = video.play(); if (p && p.catch) p.catch(() => { /* bloqueado: queda el poster */ }); };
    reproducir();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { if (en[0].isIntersecting) reproducir(); else video.pause(); }, { threshold: 0 }).observe(video.parentElement);
    }
  })();

  /* ===== 1. PARTÍCULAS (solo escritorio, sutiles sobre el video) ===== */
  (function particulas() {
    const canvas = $('.hero-inicio__canvas');
    if (!canvas || !canvas.getContext) return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return; // en móvil y tablet, solo video
    const hero = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const CIAN = '0, 184, 217';
    let w = 0, h = 0, puntos = [], progreso = 0, visible = true, rafId = 0;
    const raton = { x: 0, y: 0, activo: false };

    function crear() {
      const movil = w < 768;
      const n = Math.round(Math.min(movil ? 55 : 90, Math.max(36, (w * h) / (movil ? 7000 : 15000))));
      puntos = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.7, dx: 0, dy: 0
      }));
    }
    function dimensionar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      crear();
    }
    const suavizar = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    function dibujar() {
      ctx.clearRect(0, 0, w, h);
      const p = suavizar(progreso);
      const cx = w < 1024 ? w * 0.5 : w * 0.72;
      const cy = h * 0.5;
      const radio = w < 768 ? 90 : 140;
      const maxD = w < 768 ? 95 : 135;

      for (const pt of puntos) {
        if (!reducir) {
          pt.x += pt.vx; pt.y += pt.vy;
          if (pt.x < 0 || pt.x > w) pt.vx *= -1;
          if (pt.y < 0 || pt.y > h) pt.vy *= -1;
          if (raton.activo) {
            const ddx = pt.x - raton.x, ddy = pt.y - raton.y;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 < radio * radio) {
              const d = Math.sqrt(d2) || 1;
              const f = ((radio - d) / radio) * 1.4;
              pt.x += (ddx / d) * f; pt.y += (ddy / d) * f;
            }
          }
        }
        pt.dx = pt.x + (cx - pt.x) * p;
        pt.dy = pt.y + (cy - pt.y) * p;
      }

      // Líneas de conexión
      ctx.lineWidth = 1;
      for (let i = 0; i < puntos.length; i++) {
        const a = puntos[i];
        for (let j = i + 1; j < puntos.length; j++) {
          const b = puntos[j];
          const ddx = a.dx - b.dx, ddy = a.dy - b.dy;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < maxD * maxD) {
            const alfa = (1 - Math.sqrt(d2) / maxD) * 0.18 * (1 - p * 0.6); // sutil sobre el video
            ctx.strokeStyle = 'rgba(' + CIAN + ',' + alfa.toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.dx, a.dy); ctx.lineTo(b.dx, b.dy); ctx.stroke();
          }
        }
        // Líneas hacia el cursor
        if (raton.activo && p < 0.5) {
          const ddx = a.dx - raton.x, ddy = a.dy - raton.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < radio * 1.5) {
            ctx.strokeStyle = 'rgba(' + CIAN + ',' + ((1 - d / (radio * 1.5)) * 0.35).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.dx, a.dy); ctx.lineTo(raton.x, raton.y); ctx.stroke();
          }
        }
      }
      // Nodos
      ctx.fillStyle = 'rgba(' + CIAN + ',0.55)';
      for (const pt of puntos) { ctx.beginPath(); ctx.arc(pt.dx, pt.dy, pt.r, 0, Math.PI * 2); ctx.fill(); }

      // Punto de luz donde todo converge
      if (p > 0.02) {
        const r = 30 + p * Math.min(w, h) * 0.45;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, 'rgba(' + CIAN + ',' + (0.6 * p).toFixed(3) + ')');
        g.addColorStop(0.25, 'rgba(' + CIAN + ',' + (0.35 * p).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + CIAN + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255,' + (0.9 * p).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(cx, cy, 2 + p * 4, 0, Math.PI * 2); ctx.fill();
      }
    }

    function bucle() {
      rafId = 0;
      if (!visible || document.hidden) return;
      dibujar();
      rafId = requestAnimationFrame(bucle);
    }
    const arrancar = () => { if (!reducir && !rafId) rafId = requestAnimationFrame(bucle); };

    dimensionar();
    dibujar(); // primer cuadro (y único con movimiento reducido)

    let tRes;
    window.addEventListener('resize', () => { clearTimeout(tRes); tRes = setTimeout(() => { dimensionar(); dibujar(); }, 150); });
    if (reducir) return;

    // Cursor y toque
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      raton.x = e.clientX - r.left; raton.y = e.clientY - r.top; raton.activo = true;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { raton.activo = false; });
    hero.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') raton.activo = false; });

    // Convergencia con el scroll
    const actualizarProgreso = () => { progreso = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.85))); };
    window.addEventListener('scroll', actualizarProgreso, { passive: true });
    actualizarProgreso();

    // Pausa fuera de pantalla o con la pestaña oculta
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) arrancar(); }, { threshold: 0 }).observe(hero);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden) arrancar(); });
    arrancar();
  })();

  /* ===== 2. GSAP: héroe y escenas fijas ===== */
  (function escenas() {
    const gsap = window.gsap, ST = window.ScrollTrigger;
    if (gsap && reducir) { if (ST) ST.disable(); gsap.ticker.sleep(); return; } // sin animaciones: GSAP y ScrollTrigger no consumen recursos
    if (!gsap || !ST) return;
    gsap.registerPlugin(ST);

    // El contenido del héroe se aleja mientras las partículas convergen
    gsap.to('.hero-inicio__contenido', {
      yPercent: -18, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero-inicio', start: 'top top', end: 'bottom top', scrub: true }
    });

    const seccion = $('.convergencia');
    if (!seccion) return;
    const escenasEl = $$('.escena', seccion);
    const etiquetas = $$('.convergencia__progreso li', seccion);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      seccion.classList.add('convergencia--pin');
      const n = escenasEl.length;
      gsap.set(escenasEl.slice(1), { opacity: 0, y: 80 });
      const marcar = (idx) => etiquetas.forEach((li, i) => li.classList.toggle('activo', i === idx));
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.convergencia__escenario', start: 'top top', end: '+=' + (n - 1) * 110 + '%',
          pin: true, scrub: 0.7, anticipatePin: 1,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, ease: 'power1.inOut' },
          onUpdate: (self) => marcar(Math.round(self.progress * (n - 1)))
        }
      });
      // Transición secuencial: la escena saliente termina de desvanecerse ANTES de que entre la siguiente
      // (pausa breve en blanco entre ambas), así nunca se leen dos textos superpuestos.
      for (let i = 1; i < n; i++) {
        tl.to(escenasEl[i - 1], { opacity: 0, y: -60, duration: 0.45, ease: 'power2.in' })
          .to(escenasEl[i - 1].querySelector('.orbe'), { scale: 0.7, duration: 0.45, ease: 'power2.in' }, '<')
          .fromTo(escenasEl[i], { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '>0.1')
          .fromTo(escenasEl[i].querySelector('.orbe'), { scale: 1.25 }, { scale: 1, duration: 0.45, ease: 'power2.out' }, '<');
      }
      tl.to('.convergencia__barra', { scaleY: 1, ease: 'none', duration: tl.duration() }, 0);

      // Accesibilidad: si el foco entra a una escena oculta, se desplaza hasta ella
      const alEnfocar = (e) => {
        const idx = escenasEl.findIndex((el) => el.contains(e.target));
        if (idx < 0 || !tl.scrollTrigger) return;
        const st = tl.scrollTrigger;
        const y = st.start + (st.end - st.start) * (idx / (n - 1));
        if (VT.lenis) VT.lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
      };
      seccion.addEventListener('focusin', alEnfocar);
      return () => {
        seccion.removeEventListener('focusin', alEnfocar);
        seccion.classList.remove('convergencia--pin');
        gsap.set(escenasEl, { clearProps: 'all' });
        gsap.set($$('.orbe', seccion), { clearProps: 'all' });
      };
    });
  })();

  /* ===== 3. CARRUSEL DE DESTACADOS ===== */
  (function destacados() {
    const pista = $('[data-destacados]');
    const cat = window.VT_CATALOGO;
    if (!pista || !cat) return;
    const lista = cat.productos.filter((p) => p.destacado).slice(0, 8);
    pista.innerHTML = lista.map((p) => '<li>' + VT.tarjetaProducto(p, 'h3') + '</li>').join('');
    const contenedor = $('[data-carrusel]');
    const ant = $('[data-carrusel-anterior]');
    const sig = $('[data-carrusel-siguiente]');
    const paso = () => { const li = pista.firstElementChild; return li ? li.getBoundingClientRect().width + 20 : 300; };
    const mover = (dir) => contenedor.scrollBy({ left: dir * paso(), behavior: reducir ? 'auto' : 'smooth' });
    const actualizar = () => {
      const max = contenedor.scrollWidth - contenedor.clientWidth - 2;
      ant.disabled = contenedor.scrollLeft <= 2;
      sig.disabled = contenedor.scrollLeft >= max;
    };
    ant.addEventListener('click', () => mover(-1));
    sig.addEventListener('click', () => mover(1));
    contenedor.addEventListener('scroll', actualizar, { passive: true });
    contenedor.addEventListener('keydown', (e) => {
      if (e.target !== contenedor) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); mover(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); mover(-1); }
    });
    window.addEventListener('resize', actualizar);
    actualizar();
  })();

  /* ===== 4. MINI CHAT ===== */
  (function chat() {
    const caja = $('[data-chat-adelanto]');
    if (!caja || reducir || !('IntersectionObserver' in window)) return;
    const msj = $('[data-escribir]', caja);
    const texto = msj.textContent;
    msj.textContent = '';
    msj.hidden = true;
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      const cuerpo = $('.chat__cuerpo', caja);
      const puntos = document.createElement('span');
      puntos.className = 'chat__escribiendo';
      puntos.setAttribute('aria-label', 'El asistente está escribiendo');
      puntos.innerHTML = '<i></i><i></i><i></i>';
      cuerpo.appendChild(puntos);
      setTimeout(() => {
        puntos.remove();
        msj.hidden = false;
        msj.setAttribute('aria-label', texto); // los lectores reciben el texto completo de una vez
        let i = 0;
        const escribir = () => {
          i = Math.min(texto.length, i + 2);
          msj.textContent = texto.slice(0, i);
          if (i < texto.length) setTimeout(escribir, 22);
          else msj.removeAttribute('aria-label');
        };
        escribir();
      }, 1100);
    }, { threshold: 0.5 });
    io.observe(caja);
  })();

  /* ===== 5. SPOTLIGHT Y BOTÓN MAGNÉTICO ===== */
  (function spotlight() {
    const bento = $('[data-bento]');
    if (!bento || reducir || !VT.puedeHover()) return;
    const celdas = $$('.bento__celda', bento);
    bento.addEventListener('pointermove', (e) => {
      celdas.forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--x', (e.clientX - r.left) + 'px');
        c.style.setProperty('--y', (e.clientY - r.top) + 'px');
      });
    }, { passive: true });
  })();

  (function magnetico() {
    if (reducir || !VT.puedeHover()) return;
    $$('[data-magnetico]').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.4;
        b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  })();
})();

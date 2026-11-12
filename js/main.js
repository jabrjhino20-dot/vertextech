/* =====================================================================
   Vertex Tech — v2 · js/main.js
   Comportamiento compartido por todas las páginas.
   ÍNDICE
    1. CONFIG (datos centralizados)
    2. Utilidades (WhatsApp, soles, foco)
    3. Datos de contacto, enlaces de WhatsApp y año
    4. Lenis (scroll suave) y anclas
    5. Header (estado al hacer scroll) y avisos rotativos
    6. Mega menús
    7. Buscador desplegable
    8. Menú móvil
    9. Barra inferior móvil (teclado)
   10. Mi pedido (carrito por WhatsApp)
   11. Acordeones y pestañas genéricos
   12. Aparición al hacer scroll y contadores
   13. Formularios con envío por WhatsApp
   14. Tarjeta de producto (render compartido)
   15. Videos decorativos (carga diferida, un solo video a la vez)
   ===================================================================== */

/* ===== 1. CONFIG ===== */
const CONFIG = {
  whatsapp: '51999999999',                      /* EJEMPLO: REEMPLAZAR — código de país + número, sin + ni espacios (igual en _build/build.js) */
  telefono: '+51 999 999 999',                  /* EJEMPLO: REEMPLAZAR — formato visible */
  telefonoEnlace: '+51999999999',               /* EJEMPLO: REEMPLAZAR — formato tel: */
  correo: 'contacto@vertextech.pe',             /* EJEMPLO: REEMPLAZAR */
  direccion: 'Av. Javier Prado Este 1234, San Isidro, Lima', /* EJEMPLO: REEMPLAZAR */
  horario: 'Lun-Vie 9:00 a. m. a 6:00 p. m. | Sáb 9:00 a. m. a 1:00 p. m.', /* EJEMPLO: REEMPLAZAR */
  redes: {                                      /* EJEMPLO: REEMPLAZAR */
    facebook: 'https://www.facebook.com/vertextech',
    instagram: 'https://www.instagram.com/vertextech',
    linkedin: 'https://www.linkedin.com/company/vertextech',
    tiktok: 'https://www.tiktok.com/@vertextech'
  },
  razonSocial: 'Vertex Tech S.A.C.',            /* EJEMPLO: REEMPLAZAR */
  ruc: '20600000001',                           /* EJEMPLO: REEMPLAZAR */
  sitioUrl: '',                                 /* REEMPLAZAR: 'https://www.vertextech.pe/' para que los enlaces de fichas en WhatsApp sean absolutos */
  mensajes: {                                   /* EJEMPLO: REEMPLAZAR — textos prellenados */
    general: 'Hola Vertex Tech, quisiera más información sobre sus servicios.',
    producto: 'Hola Vertex Tech, quiero pedir: {nombre} (cantidad: {cantidad}). Ficha: {url}',
    pedidoIntro: 'Hola Vertex Tech, quiero hacer este pedido:',
    pedidoCierre: 'Quedo atento a la confirmación de stock y precio final.'
  },
  claveAlmacenamiento: 'vt-mi-pedido'
};

(function () {
  'use strict';

  const VT = (window.VT = window.VT || {});
  VT.CONFIG = CONFIG;
  const doc = document;
  const html = doc.documentElement;
  const body = doc.body;
  const $ = (s, c) => (c || doc).querySelector(s);
  const $$ = (s, c) => Array.from((c || doc).querySelectorAll(s));
  VT.$ = $; VT.$$ = $$;

  const mqReducir = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqEscritorio = window.matchMedia('(min-width: 1240px)');
  const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  VT.reducirMovimiento = () => mqReducir.matches;
  VT.puedeHover = () => mqHover.matches;

  /* ===== 2. UTILIDADES ===== */
  VT.urlWhatsApp = (texto) => 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);

  // Abre WhatsApp UNA sola vez: ventana nueva; solo si el navegador la bloquea, usa la misma pestaña
  VT.abrirWhatsApp = (texto) => {
    const url = VT.urlWhatsApp(texto);
    let ventana = null;
    try { ventana = window.open(url, '_blank'); } catch (e) { ventana = null; }
    if (ventana) { try { ventana.opener = null; } catch (e) { /* sin acción */ } }
    else { window.location.href = url; }
  };

  VT.soles = (n) => 'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  VT.escapar = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  VT.urlAbsoluta = (ruta) => { try { return new URL(ruta, CONFIG.sitioUrl || window.location.href).href; } catch (e) { return ruta; } };
  VT.normalizar = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  const esVisible = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  function enfocables(c) {
    return $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', c).filter(esVisible);
  }
  function atraparFoco(e, contenedor) {
    if (e.key !== 'Tab') return;
    const f = enfocables(contenedor);
    if (!f.length) return;
    const primero = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && doc.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }

  let toastTimer;
  VT.toast = (texto) => {
    const t = $('[data-toast]');
    if (!t) return;
    t.textContent = texto;
    t.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('visible'), 2600);
  };

  /* ===== 3. DATOS DE CONTACTO, WHATSAPP Y AÑO ===== */
  $$('[data-config="telefono"]').forEach((el) => { el.textContent = CONFIG.telefono; el.href = 'tel:' + CONFIG.telefonoEnlace; });
  $$('[data-config="correo"]').forEach((el) => { el.textContent = CONFIG.correo; el.href = 'mailto:' + CONFIG.correo; });
  // Los enlaces ya funcionan sin JS; aquí solo se regeneran por si cambia el número en CONFIG
  VT.actualizarEnlacesWA = (c) => $$('a[data-wa]', c).forEach((a) => { a.href = VT.urlWhatsApp(a.dataset.wa); });
  VT.actualizarEnlacesWA();
  $$('[data-anio]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ===== 4. LENIS Y ANCLAS ===== */
  let lenis = null;
  if (window.Lenis && !VT.reducirMovimiento()) {
    try {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      VT.lenis = lenis;
      if (window.gsap && window.ScrollTrigger) {
        lenis.on('scroll', window.ScrollTrigger.update);
        window.gsap.ticker.add((t) => lenis.raf(t * 1000));
        window.gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (e) { lenis = null; }
  }

  // Bloqueo de scroll con contador (menú y panel pueden coincidir)
  let bloqueos = 0;
  VT.bloquearScroll = (activar) => {
    bloqueos = Math.max(0, bloqueos + (activar ? 1 : -1));
    const bloquear = bloqueos > 0;
    html.classList.toggle('scroll-bloqueado', bloquear);
    if (lenis) { bloquear ? lenis.stop() : lenis.start(); }
  };

  const altoHeader = () => { const h = $('.header'); return h ? h.offsetHeight : 0; };
  VT.irA = (el) => {
    const offset = -(altoHeader() + 16);
    if (lenis) lenis.scrollTo(el, { offset: offset });
    else {
      const y = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: VT.reducirMovimiento() ? 'auto' : 'smooth' });
    }
    if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  doc.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || a.hasAttribute('data-abrir-menu') || a.hasAttribute('data-cerrar-menu')) return;
    const url = new URL(a.href, window.location.href);
    if (url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash || url.hash === '#') return;
    const destino = doc.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!destino) return;
    e.preventDefault();
    if (a.closest('.menu-movil')) cerrarMenu(false);
    VT.irA(destino);
    history.pushState(null, '', url.hash);
  });

  /* ===== 5. HEADER Y AVISOS ===== */
  const cabecera = $('#cabecera');
  const header = $('.header');
  const actualizarCabecera = () => { if (cabecera) cabecera.classList.toggle('cabecera--solida', window.scrollY > 24); };
  window.addEventListener('scroll', actualizarCabecera, { passive: true });
  actualizarCabecera();

  const avisos = $$('.topbar__avisos li');
  if (avisos.length > 1 && !VT.reducirMovimiento()) {
    let i = 0;
    setInterval(() => {
      if (doc.hidden) return;
      avisos[i].classList.remove('activo');
      i = (i + 1) % avisos.length;
      avisos[i].classList.add('activo');
    }, 4000);
  }

  /* ===== 6. MEGA MENÚS ===== */
  const itemsMega = $$('.nav__item--mega');
  function setMega(item, abrir) {
    const b = $('.nav__boton', item);
    b.setAttribute('aria-expanded', String(abrir));
    item.classList.toggle('abierto', abrir);
    if (!abrir) delete item.dataset.porHover;
    header.classList.toggle('mega-abierta', itemsMega.some((it) => it.classList.contains('abierto')));
  }
  function cerrarMegas(excepto) { itemsMega.forEach((it) => { if (it !== excepto) setMega(it, false); }); }
  itemsMega.forEach((item) => {
    const boton = $('.nav__boton', item);
    let t;
    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') === 'true';
      if (abierto && item.dataset.porHover) { delete item.dataset.porHover; return; } // abierto por hover: el clic lo fija
      cerrarMegas(item);
      setMega(item, !abierto);
    });
    item.addEventListener('mouseenter', () => {
      if (!VT.puedeHover()) return;
      clearTimeout(t);
      t = setTimeout(() => {
        if (!item.classList.contains('abierto')) { cerrarMegas(item); setMega(item, true); item.dataset.porHover = '1'; }
      }, 90);
    });
    item.addEventListener('mouseleave', () => {
      if (!VT.puedeHover()) return;
      clearTimeout(t);
      t = setTimeout(() => setMega(item, false), 220);
    });
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) setMega(item, false); });
  });
  doc.addEventListener('click', (e) => { if (!e.target.closest('.nav__item--mega')) cerrarMegas(); });

  /* ===== 7. BUSCADOR DESPLEGABLE ===== */
  const buscador = $('#buscador');
  const inputBuscador = $('#buscador-input');
  const abridoresBuscador = $$('[data-abrir-buscador]');
  function setBuscador(abrir, devolverFoco) {
    if (!buscador) return;
    buscador.hidden = !abrir;
    header.classList.toggle('buscador-abierto', abrir);
    abridoresBuscador.forEach((b) => b.setAttribute('aria-expanded', String(abrir)));
    if (abrir) { cerrarMegas(); inputBuscador.focus(); }
    else if (devolverFoco && abridoresBuscador[0]) abridoresBuscador[0].focus();
  }
  abridoresBuscador.forEach((b) => {
    b.setAttribute('role', 'button');
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-controls', 'buscador');
    b.addEventListener('click', (e) => { e.preventDefault(); setBuscador(buscador.hidden, false); });
  });
  $$('[data-cerrar-buscador]').forEach((b) => b.addEventListener('click', () => setBuscador(false, true)));
  doc.addEventListener('click', (e) => {
    if (buscador && !buscador.hidden && !e.target.closest('#buscador, [data-abrir-buscador]')) setBuscador(false, false);
  });

  /* ===== 8. MENÚ MÓVIL ===== */
  const menu = $('#menu-movil');
  const abridoresMenu = $$('[data-abrir-menu]');
  let focoPrevioMenu = null;
  const menuAbierto = () => menu && menu.classList.contains('abierto');
  function abrirMenu(enfocar) {
    if (!menu || menuAbierto()) return;
    focoPrevioMenu = doc.activeElement;
    menu.classList.add('abierto');
    body.classList.add('menu-abierto');
    abridoresMenu.forEach((b) => b.setAttribute('aria-expanded', 'true'));
    VT.bloquearScroll(true);
    requestAnimationFrame(() => (enfocar || $('[data-cerrar-menu]', menu)).focus());
  }
  function cerrarMenu(devolverFoco) {
    if (!menuAbierto()) return;
    menu.classList.remove('abierto');
    body.classList.remove('menu-abierto');
    abridoresMenu.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    VT.bloquearScroll(false);
    if (devolverFoco !== false && focoPrevioMenu) focoPrevioMenu.focus();
  }
  VT.abrirMenu = abrirMenu; VT.cerrarMenu = cerrarMenu;
  abridoresMenu.forEach((b) => {
    b.setAttribute('role', 'button');
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-controls', 'menu-movil');
    b.addEventListener('click', (e) => { e.preventDefault(); abrirMenu(); });
  });
  $$('[data-cerrar-menu]').forEach((b) => {
    b.setAttribute('role', 'button');
    b.addEventListener('click', (e) => { e.preventDefault(); cerrarMenu(); });
  });
  if (menu) {
    menu.addEventListener('keydown', (e) => atraparFoco(e, menu));
    $$('a:not([data-cerrar-menu])', menu).forEach((a) => a.addEventListener('click', () => {
      // Enlaces a otra página: se deja navegar; anclas de esta página las gestiona el bloque 4
      if (a.target !== '_blank') setTimeout(() => cerrarMenu(false), 0);
    }));
    mqEscritorio.addEventListener('change', (e) => { if (e.matches) cerrarMenu(false); });
  }

  /* ===== 9. BARRA INFERIOR MÓVIL ===== */
  $$('[data-abrir-buscar-movil]').forEach((b) => {
    b.setAttribute('role', 'button');
    b.setAttribute('aria-controls', 'menu-movil');
    b.addEventListener('click', (e) => { e.preventDefault(); abrirMenu($('#mm-buscar')); });
  });
  // Se oculta mientras el teclado está abierto en un formulario
  const esCampoTexto = (el) => el && el.matches && el.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="range"]), textarea, select');
  doc.addEventListener('focusin', (e) => { if (esCampoTexto(e.target)) body.classList.add('teclado-abierto'); });
  doc.addEventListener('focusout', () => {
    setTimeout(() => { if (!esCampoTexto(doc.activeElement)) body.classList.remove('teclado-abierto'); }, 60);
  });

  /* ===== 10. MI PEDIDO ===== */
  const panel = $('#pedido');
  const fondoPedido = $('.pedido-fondo');
  let memoria = [];
  let focoPrevioPedido = null;

  function leerPedido() {
    try {
      const datos = JSON.parse(window.localStorage.getItem(CONFIG.claveAlmacenamiento) || '[]');
      return Array.isArray(datos) ? datos.filter((i) => i && i.id && i.cantidad > 0) : [];
    } catch (e) { return memoria.slice(); }
  }
  function guardarPedido(items) {
    memoria = items;
    try { window.localStorage.setItem(CONFIG.claveAlmacenamiento, JSON.stringify(items)); } catch (e) { /* el sitio sigue funcionando en memoria */ }
    renderPedido();
  }
  const totalUnidades = (items) => items.reduce((s, i) => s + i.cantidad, 0);
  const subtotal = (items) => items.reduce((s, i) => s + i.cantidad * (Number(i.precio) || 0), 0);

  VT.pedido = {
    items: leerPedido,
    agregar(prod, cantidad) {
      const n = Math.max(1, parseInt(cantidad, 10) || 1);
      const items = leerPedido();
      const existente = items.find((i) => i.id === prod.id);
      if (existente) existente.cantidad = Math.min(99, existente.cantidad + n);
      else items.push({ id: prod.id, nombre: prod.nombre, precio: Number(prod.precio) || 0, cantidad: Math.min(99, n) });
      guardarPedido(items);
    },
    cambiar(id, delta) {
      const items = leerPedido();
      const it = items.find((i) => i.id === id);
      if (!it) return;
      it.cantidad = Math.min(99, it.cantidad + delta);
      guardarPedido(items.filter((i) => i.cantidad > 0));
    },
    quitar(id) { guardarPedido(leerPedido().filter((i) => i.id !== id)); },
    vaciar() { guardarPedido([]); }
  };

  function renderPedido() {
    const items = leerPedido();
    const total = totalUnidades(items);
    $$('[data-contador-pedido]').forEach((c) => {
      c.textContent = total > 99 ? '99+' : total;
      if (total) c.removeAttribute('data-vacio'); else c.setAttribute('data-vacio', '');
    });
    $$('[data-abrir-pedido]').forEach((b) => b.setAttribute('aria-label', total ? 'Mi pedido, ' + total + (total === 1 ? ' producto' : ' productos') : 'Mi pedido, vacío'));
    if (!panel) return;
    const lista = $('[data-pedido-lista]', panel);
    const vacio = $('[data-pedido-vacio]', panel);
    const pie = $('[data-pedido-pie]', panel);
    vacio.hidden = items.length > 0;
    pie.hidden = items.length === 0;
    lista.innerHTML = items.map((i) => {
      const n = VT.escapar(i.nombre);
      const id = VT.escapar(i.id);
      return '<li class="pedido__item">' +
        '<div><p class="pedido__nombre">' + n + '</p><p class="pedido__unitario">' + VT.soles(i.precio) + ' c/u</p></div>' +
        '<p class="pedido__linea">' + VT.soles(i.precio * i.cantidad) + '</p>' +
        '<div class="pedido__controles">' +
          '<div class="cantidad" role="group" aria-label="Cantidad de ' + n + '">' +
            '<button type="button" data-restar="' + id + '" aria-label="Restar una unidad de ' + n + '"><svg class="icono" aria-hidden="true"><use href="#i-menos"/></svg></button>' +
            '<span aria-live="polite">' + i.cantidad + '</span>' +
            '<button type="button" data-sumar="' + id + '" aria-label="Sumar una unidad de ' + n + '"><svg class="icono" aria-hidden="true"><use href="#i-mas"/></svg></button>' +
          '</div>' +
          '<button type="button" class="pedido__quitar" data-quitar="' + id + '" aria-label="Quitar ' + n + ' del pedido"><svg class="icono" aria-hidden="true"><use href="#i-papelera"/></svg>Quitar</button>' +
        '</div></li>';
    }).join('');
    $('[data-pedido-subtotal]', panel).textContent = VT.soles(subtotal(items));
  }

  function abrirPedido() {
    if (!panel || !panel.hidden) return;
    focoPrevioPedido = doc.activeElement;
    cerrarMenu(false);
    panel.hidden = false;
    fondoPedido.hidden = false;
    body.classList.add('pedido-abierto');
    VT.bloquearScroll(true);
    $$('[data-abrir-pedido]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.classList.add('abierto');
      fondoPedido.classList.add('visible');
      $('[data-cerrar-pedido].accion', panel).focus();
    }));
  }
  function cerrarPedido() {
    if (!panel || panel.hidden) return;
    panel.classList.remove('abierto');
    fondoPedido.classList.remove('visible');
    body.classList.remove('pedido-abierto');
    VT.bloquearScroll(false);
    $$('[data-abrir-pedido]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    const ocultar = () => { if (!panel.classList.contains('abierto')) { panel.hidden = true; fondoPedido.hidden = true; } };
    if (VT.reducirMovimiento()) ocultar(); else setTimeout(ocultar, 460);
    if (focoPrevioPedido && esVisible(focoPrevioPedido)) focoPrevioPedido.focus();
  }
  VT.abrirPedido = abrirPedido;

  $$('[data-abrir-pedido]').forEach((b) => {
    b.setAttribute('role', 'button');
    b.setAttribute('aria-controls', 'pedido');
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', (e) => { e.preventDefault(); abrirPedido(); });
  });
  $$('[data-cerrar-pedido]').forEach((b) => b.addEventListener('click', cerrarPedido));
  if (panel) {
    panel.addEventListener('keydown', (e) => atraparFoco(e, panel));
    panel.addEventListener('click', (e) => {
      const b = e.target.closest('[data-sumar], [data-restar], [data-quitar]');
      if (!b) return;
      if (b.dataset.sumar) { VT.pedido.cambiar(b.dataset.sumar, 1); const s = panel.querySelector('[data-sumar="' + CSS.escape(b.dataset.sumar) + '"]'); if (s) s.focus(); }
      else if (b.dataset.restar) {
        const id = b.dataset.restar;
        VT.pedido.cambiar(id, -1);
        const r = panel.querySelector('[data-restar="' + CSS.escape(id) + '"]');
        (r || $('[data-cerrar-pedido].accion', panel)).focus();
      } else { VT.pedido.quitar(b.dataset.quitar); VT.toast('Producto quitado de tu pedido'); $('[data-cerrar-pedido].accion', panel).focus(); }
    });
    $('[data-vaciar-pedido]', panel).addEventListener('click', () => { VT.pedido.vaciar(); VT.toast('Pedido vaciado'); $('[data-cerrar-pedido].accion', panel).focus(); });
    $('[data-enviar-pedido]', panel).addEventListener('click', () => {
      const items = leerPedido();
      if (!items.length) return;
      const lineas = [CONFIG.mensajes.pedidoIntro, ''];
      items.forEach((i, n) => lineas.push((n + 1) + '. ' + i.nombre + ' × ' + i.cantidad + ' — ' + VT.soles(i.precio * i.cantidad) + ' (' + VT.soles(i.precio) + ' c/u)'));
      lineas.push('', 'Subtotal referencial: ' + VT.soles(subtotal(items)), '', CONFIG.mensajes.pedidoCierre);
      VT.abrirWhatsApp(lineas.join('\n'));
    });
  }
  window.addEventListener('storage', (e) => { if (e.key === CONFIG.claveAlmacenamiento) renderPedido(); });

  // Agregar desde cualquier botón [data-agregar] (con data-nombre y data-precio)
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-agregar]');
    if (!b) return;
    const sel = b.dataset.cantidadDesde;
    const cantidad = sel && $(sel) ? $(sel).value : 1;
    VT.pedido.agregar({ id: b.dataset.agregar, nombre: b.dataset.nombre, precio: b.dataset.precio }, cantidad);
    volarAlPedido(b);
    VT.toast('Agregado a tu pedido: ' + b.dataset.nombre);
  });

  // Microinteracción: la ilustración del producto "vuela" hasta el contador visible
  function volarAlPedido(boton) {
    const contador = $$('[data-contador-pedido]').find((c) => esVisible(c.closest('a, button')));
    const rebote = () => { if (contador) { contador.classList.remove('rebote'); void contador.offsetWidth; contador.classList.add('rebote'); } };
    const contenedor = boton.closest('[data-producto]');
    const origen = contenedor ? $('[data-imagen-producto] svg', contenedor) : null;
    if (VT.reducirMovimiento() || !origen || !contador || !origen.animate) { rebote(); return; }
    const r1 = origen.getBoundingClientRect();
    const r2 = contador.getBoundingClientRect();
    const clon = origen.cloneNode(true);
    clon.classList.add('volador');
    clon.setAttribute('aria-hidden', 'true');
    Object.assign(clon.style, { left: r1.left + 'px', top: r1.top + 'px', width: r1.width + 'px', height: r1.height + 'px' });
    body.appendChild(clon);
    const dx = r2.left + r2.width / 2 - (r1.left + r1.width / 2);
    const dy = r2.top + r2.height / 2 - (r1.top + r1.height / 2);
    const escala = Math.max(0.06, 28 / r1.width);
    const anim = clon.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx * 0.45 + 'px, ' + (dy * 0.45 - 90) + 'px) scale(' + (0.5 + escala / 2) + ')', opacity: 0.95, offset: 0.5 },
      { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + escala + ')', opacity: 0.3 }
    ], { duration: 750, easing: 'cubic-bezier(.55, 0, .45, 1)' });
    anim.onfinish = () => { clon.remove(); rebote(); };
  }

  renderPedido();

  /* Esc cierra la capa superior abierta */
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (panel && !panel.hidden) { cerrarPedido(); return; }
    if (menuAbierto()) { cerrarMenu(); return; }
    if (buscador && !buscador.hidden) { setBuscador(false, true); return; }
    const abierto = itemsMega.find((it) => it.classList.contains('abierto'));
    if (abierto) { setMega(abierto, false); $('.nav__boton', abierto).focus(); }
  });

  /* ===== 11. ACORDEONES Y PESTAÑAS ===== */
  VT.iniciarAcordeones = (c) => {
    $$('[data-acordeon]', c).forEach((b) => {
      if (b.dataset.listo) return;
      b.dataset.listo = '1';
      const panelA = doc.getElementById(b.getAttribute('aria-controls'));
      if (!panelA) return;
      panelA.hidden = b.getAttribute('aria-expanded') !== 'true';
      b.addEventListener('click', () => {
        const abrir = b.getAttribute('aria-expanded') !== 'true';
        const grupo = b.closest('[data-acordeon-unico]');
        if (abrir && grupo) {
          $$('[data-acordeon][aria-expanded="true"]', grupo).forEach((o) => {
            if (o !== b) { o.setAttribute('aria-expanded', 'false'); const p = doc.getElementById(o.getAttribute('aria-controls')); if (p) p.hidden = true; }
          });
        }
        b.setAttribute('aria-expanded', String(abrir));
        panelA.hidden = !abrir;
      });
    });
  };
  VT.iniciarAcordeones();

  VT.iniciarPestanas = (c) => {
    $$('[role="tablist"]', c).forEach((lista) => {
      if (lista.dataset.listo) return;
      lista.dataset.listo = '1';
      const tabs = $$('[role="tab"]', lista);
      const usaHash = lista.hasAttribute('data-hash');
      function activar(tab, enfocar, cambiarHash) {
        tabs.forEach((t) => {
          const sel = t === tab;
          t.setAttribute('aria-selected', String(sel));
          t.tabIndex = sel ? 0 : -1;
          const p = doc.getElementById(t.getAttribute('aria-controls'));
          if (p) p.hidden = !sel;
        });
        if (enfocar) tab.focus({ preventScroll: true });
        // Centra la pestaña activa dentro de la tira deslizable (móvil), sin mover la página
        if (lista.scrollWidth > lista.clientWidth) lista.scrollLeft = tab.offsetLeft - (lista.clientWidth - tab.offsetWidth) / 2;
        if (cambiarHash && usaHash && tab.dataset.hash) history.replaceState(null, '', '#' + tab.dataset.hash);
        lista.dispatchEvent(new CustomEvent('vt:pestana', { detail: tab }));
      }
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => activar(t, false, true));
        t.addEventListener('keydown', (e) => {
          let n = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') n = 0;
          if (e.key === 'End') n = tabs.length - 1;
          if (n !== null) { e.preventDefault(); activar(tabs[n], true, true); }
        });
      });
      const porHash = usaHash && window.location.hash ? tabs.find((t) => t.dataset.hash === window.location.hash.slice(1)) : null;
      activar(porHash || tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0], false, false);
      if (porHash) setTimeout(() => VT.irA(lista), 50);
      lista._activar = activar;
    });
  };
  VT.iniciarPestanas();

  /* ===== 12. APARICIÓN Y CONTADORES ===== */
  VT.observarRevelar = (c) => {
    const els = $$('.revelar:not(.visible)', c);
    if (VT.reducirMovimiento() || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('visible')); return; }
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  };
  VT.observarRevelar();

  // Solo anima si data-objetivo tiene un número real; si no, se queda el marcador [XX]
  function animarContador(el) {
    const objetivo = parseInt(el.dataset.objetivo, 10);
    if (isNaN(objetivo)) return;
    const sufijo = el.dataset.sufijo || '';
    if (VT.reducirMovimiento()) { el.textContent = objetivo + sufijo; return; }
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min((ahora - inicio) / 1600, 1);
      el.textContent = Math.round(objetivo * (1 - Math.pow(1 - t, 3))) + sufijo;
      if (t < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }
  const contadores = $$('[data-objetivo]');
  if (contadores.length) {
    if ('IntersectionObserver' in window) {
      const ioC = new IntersectionObserver((entradas) => {
        entradas.forEach((en) => { if (en.isIntersecting) { animarContador(en.target); ioC.unobserve(en.target); } });
      }, { threshold: 0.6 });
      contadores.forEach((el) => ioC.observe(el));
    } else contadores.forEach(animarContador);
  }

  /* ===== 13. FORMULARIOS CON ENVÍO POR WHATSAPP =====
     <form data-form-wa data-wa-intro="Texto inicial"> con campos que tengan data-etiqueta.
     Errores: <p class="error" id="[id-del-campo]-error">. */
  function mensajeError(campo) {
    const v = campo.validity;
    if (v.valueMissing) return campo.dataset.errorVacio || 'Este campo es obligatorio.';
    if (v.typeMismatch) return 'Revisa el correo; debe tener el formato nombre@empresa.pe.';
    if (v.patternMismatch) return campo.dataset.errorFormato || 'Revisa el formato de este campo.';
    if (v.tooShort) return 'Escribe al menos ' + campo.minLength + ' caracteres.';
    return 'Revisa este campo.';
  }
  function validarCampo(campo) {
    const err = doc.getElementById(campo.id + '-error');
    const ok = campo.checkValidity();
    if (err) err.textContent = ok ? '' : mensajeError(campo);
    if (ok) campo.removeAttribute('aria-invalid'); else campo.setAttribute('aria-invalid', 'true');
    return ok;
  }
  VT.validarCampo = validarCampo;
  $$('form[data-form-wa]').forEach((form) => {
    form.setAttribute('novalidate', '');
    const campos = $$('input, select, textarea', form).filter((c) => c.willValidate && c.id);
    campos.forEach((c) => {
      const esOpcion = c.type === 'radio' || c.type === 'checkbox';
      c.addEventListener('blur', () => { if ((!esOpcion && c.value !== '') || c.getAttribute('aria-invalid')) validarCampo(c); });
      ['input', 'change'].forEach((ev) => c.addEventListener(ev, () => { if (c.getAttribute('aria-invalid') === 'true') validarCampo(c); }));
    });
    // Grupos de radio: el primer radio (con id) representa al grupo; se revalida al elegir cualquiera
    form.addEventListener('change', (e) => {
      if (e.target.type !== 'radio') return;
      const primero = form.querySelector('input[type="radio"][name="' + e.target.name + '"][id]');
      if (primero && primero.getAttribute('aria-invalid') === 'true') validarCampo(primero);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let primero = null;
      campos.forEach((c) => { if (!validarCampo(c) && !primero) primero = c; });
      const estado = $('[data-form-estado]', form);
      if (primero) { if (estado) estado.textContent = ''; primero.focus(); return; }
      const lineas = [form.dataset.waIntro || 'Hola Vertex Tech, les escribo desde la web.', ''];
      $$('[data-etiqueta]', form).forEach((c) => {
        let valor = '';
        if (c.type === 'checkbox' || c.type === 'radio') { if (!c.checked) return; valor = c.value; }
        else if (c.tagName === 'SELECT') valor = c.value ? c.options[c.selectedIndex].text : '';
        else valor = c.value.trim();
        lineas.push('*' + c.dataset.etiqueta + ':* ' + (valor || '-'));
      });
      VT.abrirWhatsApp(lineas.join('\n'));
      if (estado) estado.textContent = 'Listo. Abrimos WhatsApp con tus datos; solo presiona enviar.';
    });
  });

  /* ===== 14. TARJETA DE PRODUCTO (render compartido) ===== */
  VT.categoria = (id) => {
    const cats = (window.VT_CATALOGO && window.VT_CATALOGO.categorias) || [];
    return cats.find((c) => c.id === id) || { id: id, nombre: '' };
  };
  VT.ilustracion = (tipo) => (VT.ilustraciones && (VT.ilustraciones[tipo] || VT.ilustraciones.generico)) || '';
  VT.mensajeProducto = (p, cantidad) => CONFIG.mensajes.producto
    .replace('{nombre}', p.nombre).replace('{cantidad}', cantidad || 1).replace('{url}', VT.urlAbsoluta('producto.html?id=' + encodeURIComponent(p.id)));
  VT.tarjetaProducto = (p, nivel) => {
    const h = nivel || 'h3';
    const url = 'producto.html?id=' + encodeURIComponent(p.id);
    const n = VT.escapar(p.nombre);
    const etiqueta = p.etiqueta ? '<span class="etiqueta etiqueta--' + VT.normalizar(p.etiqueta) + '">' + VT.escapar(p.etiqueta) + '</span>' : '';
    return '<article class="tarjeta-producto" data-producto="' + VT.escapar(p.id) + '">' +
      '<a class="tp__imagen" href="' + url + '" tabindex="-1" aria-hidden="true" data-imagen-producto>' + VT.ilustracion(p.ilustracion) + '</a>' + etiqueta +
      '<div class="tp__cuerpo">' +
        '<p class="tp__categoria">' + VT.escapar(VT.categoria(p.categoria).nombre) + '</p>' +
        '<' + h + ' class="tp__nombre"><a href="' + url + '">' + n + '</a></' + h + '>' +
        '<p class="tp__precio">' + VT.soles(p.precio) + '<small>Precio referencial</small></p>' +
        '<div class="tp__acciones">' +
          '<button class="btn btn--primario btn--sm" type="button" data-agregar="' + VT.escapar(p.id) + '" data-nombre="' + n + '" data-precio="' + p.precio + '">Agregar a mi pedido</button>' +
          '<a class="btn btn--icono" href="' + VT.urlWhatsApp(VT.mensajeProducto(p, 1)) + '" target="_blank" rel="noopener" aria-label="Pedir ' + n + ' por WhatsApp"><svg class="icono" aria-hidden="true"><use href="#i-whatsapp"/></svg></a>' +
        '</div>' +
      '</div></article>';
  };

  /* ===== 15. VIDEOS DECORATIVOS =====
     Todo <video data-src="..."> pasa por aquí:
     · prefers-reduced-motion o ahorro de datos → solo poster, 0 descargas de MP4.
     · Carga diferida: el MP4 se asigna cuando el video está a menos de 400 px de la pantalla
       (los que están ocultos con display:none, p. ej. en móvil, nunca se cargan).
     · Nunca más de un video reproduciéndose: se elige el más visible entre los permitidos
       (data-activo="false" lo excluye; lo usa la sección Convergencia del inicio). */
  (function videos() {
    const lista = $$('video[data-src]');
    VT.videos = { recalcular: () => {} };
    if (!lista.length) return;
    const ahorroDatos = !!(navigator.connection && navigator.connection.saveData);
    if (VT.reducirMovimiento() || ahorroDatos) {
      lista.forEach((v) => { v.removeAttribute('autoplay'); v.preload = 'none'; });
      return;
    }
    const visibilidad = new Map();
    const permitido = (v) => v.dataset.activo !== 'false';
    function elegir() {
      let mejor = null, max = 0;
      lista.forEach((v) => {
        const r = visibilidad.get(v) || 0;
        if (v.getAttribute('src') && permitido(v) && r > max) { max = r; mejor = v; }
      });
      lista.forEach((v) => { if (v !== mejor && !v.paused) v.pause(); });
      if (mejor && mejor.paused && !doc.hidden) { const p = mejor.play(); if (p && p.catch) p.catch(() => { /* bloqueado: queda el poster */ }); }
    }
    VT.videos.recalcular = elegir;
    function cargar(v) {
      if (v.getAttribute('src')) return;
      if (v.dataset.poster && !v.getAttribute('poster')) v.setAttribute('poster', v.dataset.poster);
      v.muted = true; // requisito para reproducción automática en móviles
      v.src = v.dataset.src;
    }
    const ioCarga = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => { if (en.isIntersecting) { cargar(en.target); ioCarga.unobserve(en.target); } });
      elegir();
    }, { rootMargin: '400px 0px' });
    const ioVista = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => visibilidad.set(en.target, en.isIntersecting ? Math.max(en.intersectionRatio, 0.01) : 0));
      elegir();
    }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    lista.forEach((v) => {
      v.muted = true;
      ioCarga.observe(v);
      ioVista.observe(v);
      // Si alguno arranca por su cuenta (autoplay), los demás se pausan
      v.addEventListener('play', () => lista.forEach((o) => { if (o !== v && !o.paused) o.pause(); }));
      v.addEventListener('loadeddata', elegir);
    });
    doc.addEventListener('visibilitychange', () => { if (doc.hidden) lista.forEach((v) => v.pause()); else elegir(); });
  })();

  /* Al llegar con un ancla (servicios.html#seguridad), se desplaza hasta ella con el offset del header.
     Las pestañas con hash (rubros) se gestionan en iniciarPestanas. */
  if (window.location.hash.length > 1) {
    let destino = null;
    try { destino = doc.getElementById(decodeURIComponent(window.location.hash.slice(1))); } catch (e) { destino = null; }
    if (destino && destino.getAttribute('role') !== 'tabpanel' && esVisible(destino)) setTimeout(() => VT.irA(destino), 120);
  }

  VT.listo = true;
})();

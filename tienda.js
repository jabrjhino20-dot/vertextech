/* =====================================================================
   Vertex Tech — v2 · js/tienda.js
   Filtros por categoría, búsqueda en vivo, orden y contador.
   El estado se refleja en la URL: tienda.html?categoria=...&buscar=...&orden=...
   ===================================================================== */
(function () {
  'use strict';
  const VT = window.VT, cat = window.VT_CATALOGO;
  if (!VT || !cat) return;
  const $ = VT.$, $$ = VT.$$;

  const grilla = $('[data-grilla]');
  const listaFiltros = $('[data-filtros]');
  const conteo = $('[data-conteo]');
  const orden = $('[data-orden]');
  const vacio = $('[data-vacio]');
  const vacioWA = $('[data-vacio-wa]');
  const input = $('#buscar-tienda');
  const params = new URLSearchParams(window.location.search);

  const estado = {
    categoria: cat.categorias.some((c) => c.id === params.get('categoria')) ? params.get('categoria') : '',
    buscar: (params.get('buscar') || '').trim(),
    orden: ['destacados', 'precio-asc', 'precio-desc'].indexOf(params.get('orden')) !== -1 ? params.get('orden') : 'destacados'
  };
  input.value = estado.buscar;
  orden.value = estado.orden;

  // Texto indexado de cada producto (sin tildes, en minúsculas)
  const indice = new Map(cat.productos.map((p) => [p.id, VT.normalizar([
    p.nombre, VT.categoria(p.categoria).nombre, p.descripcion, Object.values(p.especificaciones || {}).join(' ')
  ].join(' '))]));

  function coincideBusqueda(p) {
    if (!estado.buscar) return true;
    const texto = indice.get(p.id);
    return VT.normalizar(estado.buscar).split(/\s+/).every((t) => texto.indexOf(t) !== -1);
  }

  function renderFiltros() {
    const base = cat.productos.filter(coincideBusqueda);
    const items = [{ id: '', nombre: 'Todas', icono: 'i-caja' }].concat(cat.categorias);
    listaFiltros.innerHTML = items.map((c) => {
      const n = c.id ? base.filter((p) => p.categoria === c.id).length : base.length;
      return '<li><button class="filtro" type="button" data-categoria="' + c.id + '" aria-pressed="' + (estado.categoria === c.id) + '">' +
        '<svg class="icono" aria-hidden="true"><use href="#' + c.icono + '"/></svg><span>' + VT.escapar(c.nombre) + '</span><span class="filtro__n">' + n + '</span></button></li>';
    }).join('');
  }

  function resultados() {
    let lista = cat.productos.filter((p) => (!estado.categoria || p.categoria === estado.categoria) && coincideBusqueda(p));
    if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => a.precio - b.precio);
    else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => b.precio - a.precio);
    else lista = lista.slice().sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    return lista;
  }

  function actualizarURL() {
    const q = new URLSearchParams();
    if (estado.categoria) q.set('categoria', estado.categoria);
    if (estado.buscar) q.set('buscar', estado.buscar);
    if (estado.orden !== 'destacados') q.set('orden', estado.orden);
    const s = q.toString();
    history.replaceState(null, '', window.location.pathname + (s ? '?' + s : ''));
  }

  function render() {
    const lista = resultados();
    grilla.innerHTML = lista.map((p) => VT.tarjetaProducto(p, 'h3')).join('');
    vacio.hidden = lista.length > 0;
    grilla.hidden = lista.length === 0;
    const nombreCat = estado.categoria ? ' en ' + VT.categoria(estado.categoria).nombre : '';
    const busq = estado.buscar ? ' para «' + estado.buscar + '»' : '';
    conteo.textContent = lista.length === 1 ? '1 producto' + nombreCat + busq : lista.length + ' productos' + nombreCat + busq;
    if (!lista.length && vacioWA) {
      const msj = 'Hola Vertex Tech, busco ' + (estado.buscar ? '«' + estado.buscar + '»' : 'un producto') + (nombreCat ? nombreCat.replace(' en ', ' en la categoría ') : '') + ' y no lo encontré en la tienda. ¿Me pueden ayudar?';
      vacioWA.dataset.wa = msj;
      vacioWA.href = VT.urlWhatsApp(msj);
    }
    renderFiltros();
    actualizarURL();
    document.title = (estado.categoria ? VT.categoria(estado.categoria).nombre + ' | ' : '') + 'Tienda | Vertex Tech';
  }

  listaFiltros.addEventListener('click', (e) => {
    const b = e.target.closest('[data-categoria]');
    if (!b) return;
    estado.categoria = b.dataset.categoria;
    render();
    const nuevo = listaFiltros.querySelector('[data-categoria="' + estado.categoria + '"]');
    if (nuevo) nuevo.focus();
  });
  orden.addEventListener('change', () => { estado.orden = orden.value; render(); });
  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.buscar = input.value.trim(); render(); }, 180); });
  $('[data-form-busqueda]').addEventListener('submit', (e) => {
    e.preventDefault();
    estado.buscar = input.value.trim();
    render();
    VT.irA($('.catalogo'));
  });
  $('[data-limpiar]').addEventListener('click', () => {
    estado.categoria = ''; estado.buscar = ''; input.value = '';
    render();
    input.focus();
  });

  render();
  // Si se llegó con filtros desde el menú o el buscador del header, se lleva la vista al catálogo
  if (params.get('categoria') || params.get('buscar')) setTimeout(() => VT.irA($('.catalogo')), 100);
})();

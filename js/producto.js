/* =====================================================================
   Vertex Tech — v2 · js/producto.js
   Arma la ficha (producto.html?id=...) desde js/productos.js:
   galería, precio, cantidad, pedido, especificaciones, relacionados,
   <title>, meta description y JSON-LD Product.
   ===================================================================== */
(function () {
  'use strict';
  const VT = window.VT, cat = window.VT_CATALOGO;
  if (!VT || !cat) return;
  const $ = VT.$, $$ = VT.$$;

  const id = new URLSearchParams(window.location.search).get('id');
  const p = cat.productos.find((x) => x.id === id);
  const ficha = $('[data-ficha]');

  function setMeta(selector, valor) { const m = $(selector); if (m) m.setAttribute('content', valor); }

  if (!p) {
    $('[data-producto-nombre]').textContent = 'Producto no encontrado';
    document.title = 'Producto no encontrado | Tienda Vertex Tech';
    const robots = document.createElement('meta');
    robots.name = 'robots'; robots.content = 'noindex';
    document.head.appendChild(robots);
    $('[data-ficha-error]').hidden = false;
    return;
  }

  const categoria = VT.categoria(p.categoria);
  const descripcionCorta = p.descripcion.length > 155 ? p.descripcion.slice(0, 152).trim() + '…' : p.descripcion;

  // <title>, meta description y Open Graph
  document.title = p.nombre + ' | Tienda Vertex Tech';
  setMeta('meta[name="description"]', descripcionCorta);
  setMeta('meta[property="og:title"]', document.title);
  setMeta('meta[property="og:description"]', descripcionCorta);
  setMeta('meta[name="twitter:title"]', document.title);
  setMeta('meta[name="twitter:description"]', descripcionCorta);

  // Encabezado y migas
  $('[data-producto-nombre]').textContent = p.nombre;
  $('[data-producto-categoria]').textContent = categoria.nombre;
  $('[data-migas]').insertAdjacentHTML('beforeend',
    '<li><a href="tienda.html?categoria=' + encodeURIComponent(p.categoria) + '">' + VT.escapar(categoria.nombre) + '</a></li>' +
    '<li><span aria-current="page">' + VT.escapar(p.nombre) + '</span></li>');

  // Ficha
  const ilus = VT.ilustracion(p.ilustracion);
  const vistas = ['Vista general', 'Vista ampliada', 'Detalle'];
  ficha.setAttribute('data-producto', p.id);
  ficha.innerHTML =
    '<div class="galeria">' +
      // REEMPLAZAR: fotos reales del producto (img/productos/...) en lugar de la ilustración
      '<div class="galeria__principal vista-0" data-imagen-producto data-galeria-principal>' + ilus + '</div>' +
      '<div class="galeria__miniaturas" role="group" aria-label="Vistas del producto">' +
        vistas.map((v, i) => '<button class="galeria__mini vista-' + i + '" type="button" data-vista="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="' + v + '">' + ilus + '</button>').join('') +
      '</div>' +
      '<p class="galeria__nota">Imagen referencial</p>' +
    '</div>' +
    '<div class="compra">' +
      (p.etiqueta ? '<span class="etiqueta etiqueta--' + VT.normalizar(p.etiqueta) + '">' + VT.escapar(p.etiqueta) + '</span>' : '') +
      '<p class="compra__precio">' + VT.soles(p.precio) + '<small>Precio referencial. Te confirmamos stock y precio final por WhatsApp.</small></p>' +
      '<p class="compra__descripcion">' + VT.escapar(p.descripcion) + '</p>' +
      '<div class="compra__fila">' +
        '<label class="sr-only" for="cantidad-producto">Cantidad</label>' +
        '<div class="cantidad cantidad--grande">' +
          '<button type="button" data-cant="-1" aria-label="Restar una unidad"><svg class="icono" aria-hidden="true"><use href="#i-menos"/></svg></button>' +
          '<input id="cantidad-producto" type="number" inputmode="numeric" min="1" max="99" value="1">' +
          '<button type="button" data-cant="1" aria-label="Sumar una unidad"><svg class="icono" aria-hidden="true"><use href="#i-mas"/></svg></button>' +
        '</div>' +
        '<button class="btn btn--primario btn--lg compra__agregar" type="button" data-agregar="' + VT.escapar(p.id) + '" data-nombre="' + VT.escapar(p.nombre) + '" data-precio="' + p.precio + '" data-cantidad-desde="#cantidad-producto">Agregar a mi pedido</button>' +
      '</div>' +
      '<a class="btn btn--contorno btn--bloque" data-wa-producto target="_blank" rel="noopener" href="#"><svg class="icono" aria-hidden="true"><use href="#i-whatsapp"/></svg>Pedir por WhatsApp</a>' +
      '<ul class="compra__garantias">' +
        // VALIDAR CON CLIENTE: plazo de garantía por producto (campo "garantia" en js/productos.js)
        '<li><svg class="icono" aria-hidden="true"><use href="#i-escudo"/></svg><span><strong>Garantía:</strong> ' + VT.escapar(p.garantia || '[XX] meses') + ', gestionada por nosotros.</span></li>' +
        '<li><svg class="icono" aria-hidden="true"><use href="#i-soporte"/></svg><span><strong>Soporte post-venta:</strong> te acompañamos después de la entrega.</span></li>' +
        // VALIDAR CON CLIENTE: emisión de factura electrónica
        '<li><svg class="icono" aria-hidden="true"><use href="#i-documento"/></svg><span><strong>Factura electrónica</strong> en todas tus compras.</span></li>' +
      '</ul>' +
    '</div>';
  ficha.hidden = false;

  // Galería
  const principal = $('[data-galeria-principal]', ficha);
  ficha.addEventListener('click', (e) => {
    const b = e.target.closest('[data-vista]');
    if (!b) return;
    $$('[data-vista]', ficha).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    principal.className = 'galeria__principal vista-' + b.dataset.vista;
  });

  // Cantidad y enlace de WhatsApp con la cantidad elegida
  const inputCant = $('#cantidad-producto');
  const waProducto = $('[data-wa-producto]', ficha);
  const normalizarCant = () => { const n = Math.min(99, Math.max(1, parseInt(inputCant.value, 10) || 1)); inputCant.value = n; return n; };
  const actualizarWA = () => { waProducto.href = VT.urlWhatsApp(VT.mensajeProducto(p, normalizarCant())); };
  ficha.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cant]');
    if (!b) return;
    inputCant.value = (parseInt(inputCant.value, 10) || 1) + parseInt(b.dataset.cant, 10);
    actualizarWA();
  });
  inputCant.addEventListener('change', actualizarWA);
  actualizarWA();

  // Especificaciones
  const specs = p.especificaciones || {};
  $('[data-specs]').innerHTML = '<caption class="sr-only">Especificaciones de ' + VT.escapar(p.nombre) + '</caption><tbody>' +
    Object.keys(specs).map((k) => '<tr><th scope="row">' + VT.escapar(k) + '</th><td>' + VT.escapar(specs[k]) + '</td></tr>').join('') +
    '<tr><th scope="row">Garantía</th><td>' + VT.escapar(p.garantia || '[XX] meses') + '</td></tr></tbody>';
  $('[data-ficha-detalle]').hidden = false;

  // Relacionados: misma categoría y, si faltan, destacados
  let rel = cat.productos.filter((x) => x.categoria === p.categoria && x.id !== p.id);
  cat.productos.filter((x) => x.destacado && x.id !== p.id && rel.indexOf(x) === -1).forEach((x) => rel.push(x));
  rel = rel.slice(0, 4);
  if (rel.length) {
    $('[data-relacionados]').innerHTML = rel.map((x) => VT.tarjetaProducto(x, 'h3')).join('');
    $('[data-relacionados-seccion]').hidden = false;
  }

  // JSON-LD Product (EJEMPLO: REEMPLAZAR precios y URL absoluta con CONFIG.sitioUrl)
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    sku: p.id,
    category: categoria.nombre,
    description: p.descripcion,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: String(p.precio),
      url: VT.urlAbsoluta('producto.html?id=' + encodeURIComponent(p.id)),
      seller: { '@type': 'Organization', name: 'Vertex Tech' }
    }
  });
  document.head.appendChild(ld);
})();

/* =====================================================================
   Vertex Tech — v2 · js/productos.js
   CATÁLOGO EDITABLE (productos ficticios de ejemplo, sin marcas reales).

   CÓMO EDITAR
   · Agregar un producto: copia un bloque { ... } dentro de "productos", cambia
     el id (único, en minúsculas y con guiones; se usa en producto.html?id=...) y los datos.
   · Editar: cambia nombre, precio, descripción, especificaciones, etc.
   · Quitar: borra el bloque completo (incluida la coma final).
   · Categorías: edita la lista "categorias". Un producto cuya categoría no exista
     no se muestra (así puedes quitar una categoría sin romper nada).
   · ilustracion: tipo de dibujo SVG de js/ilustraciones.js (laptop, pc, workstation,
     servidor, nas, impresora, impresora-color, monitor, perifericos, webcam, router,
     switch, mochila, auriculares, licencia, camaras, ups, estabilizador, pos).
     REEMPLAZAR por fotos reales: agrega "imagen": "img/productos/archivo.webp".
   · etiqueta: 'Nuevo', 'Destacado' o '' (vacío).
   · destacado: true → aparece en el carrusel del inicio (se muestran los 8 primeros).
   · Precios: EJEMPLO: REEMPLAZAR (todos son referenciales en soles).
   · garantia: VALIDAR CON CLIENTE el plazo real por producto.
   ===================================================================== */
window.VT_CATALOGO = {
  categorias: [
    { id: 'laptops', nombre: 'Laptops y computadoras', icono: 'i-laptop' },
    { id: 'servidores', nombre: 'Servidores', icono: 'i-servidor' },
    { id: 'impresoras', nombre: 'Impresoras', icono: 'i-impresora' },
    { id: 'monitores-perifericos', nombre: 'Monitores y periféricos', icono: 'i-monitor' },
    { id: 'redes', nombre: 'Redes y conectividad', icono: 'i-red' },
    { id: 'accesorios', nombre: 'Accesorios', icono: 'i-auricular' },
    /* INICIO [NUEVO: VALIDAR CON CLIENTE] categorías nuevas */
    { id: 'licencias', nombre: 'Licencias y software', icono: 'i-llave' },
    { id: 'videovigilancia', nombre: 'Videovigilancia', icono: 'i-camara' },
    { id: 'energia', nombre: 'Energía: UPS y estabilizadores', icono: 'i-rayo' },
    { id: 'puntos-de-venta', nombre: 'Puntos de venta', icono: 'i-pos' }
    /* FIN [NUEVO] categorías nuevas */
  ],

  productos: [
    {
      id: 'laptop-empresarial-14', nombre: 'Laptop empresarial 14 pulgadas', categoria: 'laptops',
      precio: 3499, /* EJEMPLO: REEMPLAZAR */ etiqueta: 'Destacado', destacado: true, ilustracion: 'laptop',
      descripcion: 'Liviana, rápida y lista para el trabajo diario de oficina. Batería para toda la jornada y seguridad empresarial para proteger la información de tu equipo.',
      especificaciones: { Pantalla: '14" Full HD antirreflejo', Procesador: 'De última generación, 8 núcleos', Memoria: '16 GB RAM', Almacenamiento: 'SSD 512 GB', Sistema: 'Sistema operativo profesional', Peso: '1.4 kg aprox.' },
      garantia: '[XX] meses' /* VALIDAR CON CLIENTE */
    },
    {
      id: 'laptop-ultraligera-13', nombre: 'Laptop ultraligera 13 pulgadas', categoria: 'laptops',
      precio: 4299, /* EJEMPLO: REEMPLAZAR */ etiqueta: 'Nuevo', destacado: true, ilustracion: 'laptop',
      descripcion: 'Para gerentes y equipos que se mueven: pesa poco, enciende al instante y se conecta a todo. Ideal para reuniones y trabajo remoto.',
      especificaciones: { Pantalla: '13.3" de alta resolución', Procesador: 'Eficiente de bajo consumo', Memoria: '16 GB RAM', Almacenamiento: 'SSD 1 TB', Batería: 'Hasta una jornada completa', Peso: '1.1 kg aprox.' },
      garantia: '[XX] meses'
    },
    {
      id: 'pc-escritorio-compacta', nombre: 'Computadora de escritorio compacta', categoria: 'laptops',
      precio: 2599, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: true, ilustracion: 'pc',
      descripcion: 'Ocupa poco espacio y rinde de sobra para facturación, ofimática y sistemas de gestión. Silenciosa y fácil de mantener.',
      especificaciones: { Formato: 'Mini torre compacta', Procesador: '6 núcleos', Memoria: '8 GB RAM (ampliable)', Almacenamiento: 'SSD 512 GB', Conectividad: 'Wifi, Bluetooth y red cableada' },
      garantia: '[XX] meses'
    },
    {
      id: 'estacion-trabajo-diseno', nombre: 'Estación de trabajo para diseño', categoria: 'laptops',
      precio: 6899, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'workstation',
      descripcion: 'Potencia para diseño, planos y edición de video sin esperas. Pensada para estudios de arquitectura, agencias y áreas técnicas.',
      especificaciones: { Procesador: 'Alto rendimiento, 12 núcleos', Memoria: '32 GB RAM', Gráficos: 'Tarjeta dedicada profesional', Almacenamiento: 'SSD 1 TB + HDD 2 TB', Fuente: 'Certificada de alta eficiencia' },
      garantia: '[XX] meses'
    },
    {
      id: 'servidor-torre-pyme', nombre: 'Servidor torre para pymes', categoria: 'servidores',
      precio: 7990, /* EJEMPLO: REEMPLAZAR */ etiqueta: 'Destacado', destacado: true, ilustracion: 'servidor',
      descripcion: 'Centraliza archivos, sistemas y copias de seguridad de tu empresa en un solo equipo confiable. Lo dimensionamos según tu operación.',
      especificaciones: { Formato: 'Torre', Procesador: 'De servidor, 8 núcleos', Memoria: '32 GB ECC', Almacenamiento: '2 × 2 TB en espejo (RAID 1)', Fuente: 'Redundante opcional' },
      garantia: '[XX] meses'
    },
    {
      id: 'nas-4-bahias', nombre: 'Almacenamiento en red de 4 bahías', categoria: 'servidores',
      precio: 3290, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'nas',
      descripcion: 'Un lugar seguro y ordenado para los archivos de todo el equipo, con acceso desde la oficina o desde casa.',
      especificaciones: { Bahías: '4 discos intercambiables', Capacidad: 'Hasta 4 × 8 TB', Red: '2 puertos de alta velocidad', Funciones: 'Copias automáticas y acceso remoto' },
      garantia: '[XX] meses'
    },
    {
      id: 'impresora-laser-multifuncional', nombre: 'Impresora láser multifuncional', categoria: 'impresoras',
      precio: 1290, /* EJEMPLO: REEMPLAZAR */ etiqueta: 'Destacado', destacado: true, ilustracion: 'impresora',
      descripcion: 'Imprime, copia y escanea a doble cara con bajo costo por página. Conéctala por wifi y comparte con toda la oficina.',
      especificaciones: { Funciones: 'Impresión, copia, escaneo', Velocidad: 'Hasta 40 páginas por minuto', Dúplex: 'Automático', Conectividad: 'Wifi, red y USB' },
      garantia: '[XX] meses'
    },
    {
      id: 'impresora-tinta-continua', nombre: 'Impresora de tinta continua a color', categoria: 'impresoras',
      precio: 990, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'impresora-color',
      descripcion: 'Color de calidad con tanques recargables: ideal para materiales comerciales y documentos con gráficos.',
      especificaciones: { Funciones: 'Impresión, copia, escaneo', Sistema: 'Tanques de tinta recargables', Rendimiento: 'Miles de páginas por recarga', Conectividad: 'Wifi y USB' },
      garantia: '[XX] meses'
    },
    {
      id: 'monitor-24-fhd', nombre: 'Monitor 24 pulgadas Full HD', categoria: 'monitores-perifericos',
      precio: 649, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: true, ilustracion: 'monitor',
      descripcion: 'Más espacio de trabajo y menos cansancio visual. Base ajustable y bordes delgados para usar dos pantallas.',
      especificaciones: { Tamaño: '24"', Resolución: 'Full HD 1920 × 1080', Panel: 'IPS con filtro de luz azul', Conexiones: 'HDMI y DisplayPort' },
      garantia: '[XX] meses'
    },
    {
      id: 'kit-teclado-mouse', nombre: 'Kit teclado y mouse inalámbrico', categoria: 'monitores-perifericos',
      precio: 129, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'perifericos',
      descripcion: 'Cómodo y silencioso, con un solo receptor para ambos. Escritorios más ordenados, sin cables.',
      especificaciones: { Conexión: 'Inalámbrica con receptor USB', Teclado: 'Español latinoamericano', Batería: 'Larga duración' },
      garantia: '[XX] meses'
    },
    {
      id: 'camara-web-fhd', nombre: 'Cámara web Full HD para reuniones', categoria: 'monitores-perifericos',
      precio: 189, /* EJEMPLO: REEMPLAZAR */ etiqueta: 'Nuevo', destacado: false, ilustracion: 'webcam',
      descripcion: 'Imagen nítida y micrófono con reducción de ruido para videollamadas profesionales.',
      especificaciones: { Resolución: 'Full HD 1080p', Micrófono: 'Doble, con reducción de ruido', Montaje: 'Clip para monitor o trípode' },
      garantia: '[XX] meses'
    },
    {
      id: 'router-wifi-6', nombre: 'Router empresarial wifi 6', categoria: 'redes',
      precio: 459, /* EJEMPLO: REEMPLAZAR */ etiqueta: 'Destacado', destacado: true, ilustracion: 'router',
      descripcion: 'Wifi estable para toda la oficina, con red separada para visitas. Menos cortes, más productividad.',
      especificaciones: { Estándar: 'Wifi 6', Cobertura: 'Oficinas medianas', Funciones: 'Red de invitados y control de acceso', Puertos: '4 de red + 1 de internet' },
      garantia: '[XX] meses'
    },
    {
      id: 'switch-24-puertos', nombre: 'Switch gestionable de 24 puertos', categoria: 'redes',
      precio: 1190, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: true, ilustracion: 'switch',
      descripcion: 'El corazón de una red ordenada: conecta computadoras, cámaras y teléfonos con control y monitoreo.',
      especificaciones: { Puertos: '24 de red gigabit', Gestión: 'Interfaz web', Montaje: 'En rack o escritorio' },
      garantia: '[XX] meses'
    },
    {
      id: 'mochila-laptop', nombre: 'Mochila ejecutiva para laptop', categoria: 'accesorios',
      precio: 149, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'mochila',
      descripcion: 'Protege tu laptop en el día a día, con compartimentos para cargador, documentos y accesorios.',
      especificaciones: { Compatibilidad: 'Laptops de hasta 15.6"', Material: 'Resistente al agua', Extras: 'Puerto de carga USB externo' },
      garantia: '[XX] meses'
    },
    {
      id: 'auriculares-microfono', nombre: 'Auriculares con micrófono', categoria: 'accesorios',
      precio: 159, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'auriculares',
      descripcion: 'Sonido claro para llamadas y reuniones, cómodos para usar toda la jornada.',
      especificaciones: { Conexión: 'USB', Micrófono: 'Con cancelación de ruido', Uso: 'Atención al cliente y videollamadas' },
      garantia: '[XX] meses'
    },
    /* INICIO [NUEVO: VALIDAR CON CLIENTE] producto licencias */
    {
      id: 'licencia-antivirus-anual', nombre: 'Antivirus empresarial (licencia anual por equipo)', categoria: 'licencias',
      precio: 89, /* EJEMPLO: REEMPLAZAR */ etiqueta: 'Nuevo', destacado: false, ilustracion: 'licencia',
      descripcion: 'Protección gestionada contra virus y correos fraudulentos, con instalación y seguimiento incluidos.',
      especificaciones: { Duración: '12 meses', Cobertura: '1 equipo', Incluye: 'Instalación y consola de gestión' },
      garantia: 'Vigencia de la licencia'
    },
    /* FIN [NUEVO] producto licencias */
    /* INICIO [NUEVO: VALIDAR CON CLIENTE] producto videovigilancia */
    {
      id: 'kit-4-camaras-ip', nombre: 'Kit de 4 cámaras IP con grabador', categoria: 'videovigilancia',
      precio: 1890, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'camaras',
      descripcion: 'Mira tu negocio desde el celular, de día y de noche. Te lo instalamos y configuramos.',
      especificaciones: { Cámaras: '4 cámaras IP para interior y exterior', Grabador: '8 canales con disco de 1 TB', Visión: 'Nocturna', Acceso: 'App móvil' },
      garantia: '[XX] meses'
    },
    /* FIN [NUEVO] producto videovigilancia */
    /* INICIO [NUEVO: VALIDAR CON CLIENTE] productos energía */
    {
      id: 'ups-1500va', nombre: 'UPS interactivo 1500 VA', categoria: 'energia',
      precio: 890, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'ups',
      descripcion: 'Protege tus equipos de cortes y variaciones de luz, y te da tiempo para guardar el trabajo.',
      especificaciones: { Capacidad: '1500 VA', Tipo: 'Interactivo', Tomas: '6 tomacorrientes protegidos', Autonomía: 'Según carga conectada' },
      garantia: '[XX] meses'
    },
    {
      id: 'estabilizador-1000va', nombre: 'Estabilizador de voltaje 1000 VA', categoria: 'energia',
      precio: 189, /* EJEMPLO: REEMPLAZAR */ etiqueta: '', destacado: false, ilustracion: 'estabilizador',
      descripcion: 'Mantiene un voltaje estable para alargar la vida útil de computadoras e impresoras.',
      especificaciones: { Capacidad: '1000 VA', Tomas: '4 tomacorrientes', Protección: 'Contra sobretensión' },
      garantia: '[XX] meses'
    },
    /* FIN [NUEVO] productos energía */
    /* INICIO [NUEVO: VALIDAR CON CLIENTE] producto puntos de venta */
    {
      id: 'kit-punto-de-venta', nombre: 'Kit punto de venta completo', categoria: 'puntos-de-venta',
      precio: 2490, /* EJEMPLO: REEMPLAZAR */ etiqueta: 'Nuevo', destacado: false, ilustracion: 'pos',
      descripcion: 'Cobra más rápido: terminal táctil, impresora de tickets, lector de códigos y cajón de dinero, listos para facturar.',
      especificaciones: { Terminal: 'Táctil de 15"', Impresora: 'Térmica de tickets', Lector: 'Códigos de barras', Cajón: 'Monedero con apertura automática' },
      garantia: '[XX] meses'
    }
    /* FIN [NUEVO] producto puntos de venta */
  ]
};

/* Filtra productos de categorías inexistentes (permite quitar categorías sin romper el sitio) */
(function () {
  const ids = window.VT_CATALOGO.categorias.map((c) => c.id);
  window.VT_CATALOGO.productos = window.VT_CATALOGO.productos.filter((p) => ids.indexOf(p.categoria) !== -1);
})();

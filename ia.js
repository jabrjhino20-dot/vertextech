/* =====================================================================
   Vertex Tech — v2 · js/ia.js
   1. Demo de chat con efecto de escritura y 3 escenarios (ilustrativa)
   2. Diagnóstico de IA de 3 preguntas con resultado y envío por WhatsApp
   ===================================================================== */
(function () {
  'use strict';
  const VT = window.VT;
  if (!VT) return;
  const $ = VT.$, $$ = VT.$$;
  const reducir = VT.reducirMovimiento();

  /* ===== 1. DEMO DE CHAT ===== */
  // EJEMPLO: conversaciones ilustrativas; ajustarlas con el cliente
  const ESCENARIOS = {
    atencion: [
      ['usuario', 'Hola, ¿a qué hora atienden el sábado?'],
      ['asistente', '¡Hola! Los sábados atendemos de 9:00 a. m. a 1:00 p. m. ¿Te ayudo con algo más?'],
      ['usuario', 'Quiero cotizar 3 impresoras para la oficina.'],
      ['asistente', 'Perfecto. ¿Las necesitas para documentos en blanco y negro o a color? Con eso te paso opciones y precios, y si quieres te contacta un asesor.']
    ],
    reportes: [
      ['usuario', 'Dame el resumen de ventas de esta semana.'],
      ['asistente', 'Aquí va el resumen de lunes a viernes: ventas por S/ [XX], [XX] pedidos y el producto más vendido fue la laptop empresarial de 14 pulgadas.'],
      ['usuario', '¿Cómo vamos frente a la semana pasada?'],
      ['asistente', 'Vamos [XX] % arriba. Te dejé el detalle por día y por vendedor en la hoja compartida y en tu correo.']
    ],
    agenda: [
      ['usuario', 'Quiero una cita para el jueves en la tarde.'],
      ['asistente', 'Claro. El jueves tengo libres las 3:00 p. m. y las 4:30 p. m. ¿Cuál prefieres?'],
      ['usuario', 'A las 4:30, por favor.'],
      ['asistente', 'Listo, tu cita quedó para el jueves a las 4:30 p. m. Te enviaré un recordatorio un día antes.']
    ]
  };
  const cuerpo = $('[data-chat-demo]');
  const repetir = $('[data-repetir]');
  const botones = $$('[data-escenario]');
  let ejecucion = 0;
  let actual = 'atencion';
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  async function reproducir(nombre) {
    actual = nombre;
    const id = ++ejecucion;
    const guion = ESCENARIOS[nombre];
    cuerpo.innerHTML = '';
    repetir.hidden = true;
    if (reducir) {
      cuerpo.innerHTML = guion.map((m) => '<p class="chat__mensaje chat__mensaje--' + m[0] + '">' + VT.escapar(m[1]) + '</p>').join('');
      repetir.hidden = false;
      return;
    }
    for (const [de, texto] of guion) {
      if (id !== ejecucion) return;
      const p = document.createElement('p');
      p.className = 'chat__mensaje chat__mensaje--' + de;
      if (de === 'usuario') {
        await esperar(500);
        if (id !== ejecucion) return;
        p.textContent = texto;
        cuerpo.appendChild(p);
      } else {
        const puntos = document.createElement('span');
        puntos.className = 'chat__escribiendo';
        puntos.innerHTML = '<i></i><i></i><i></i>';
        cuerpo.appendChild(puntos);
        await esperar(900);
        if (id !== ejecucion) return;
        puntos.remove();
        p.setAttribute('aria-label', texto);
        cuerpo.appendChild(p);
        for (let i = 2; i <= texto.length + 1; i += 2) {
          if (id !== ejecucion) return;
          p.textContent = texto.slice(0, i);
          await esperar(18);
        }
        p.removeAttribute('aria-label');
      }
      cuerpo.scrollTop = cuerpo.scrollHeight;
    }
    if (id === ejecucion) repetir.hidden = false;
  }

  if (cuerpo) {
    botones.forEach((b) => b.addEventListener('click', () => {
      botones.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      reproducir(b.dataset.escenario);
    }));
    repetir.addEventListener('click', () => reproducir(actual));
    // Arranca cuando la demo entra en pantalla
    if ('IntersectionObserver' in window && !reducir) {
      const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); reproducir('atencion'); } }, { threshold: 0.4 });
      io.observe(cuerpo);
    } else repetir.hidden = false;
  }

  /* ===== 2. DIAGNÓSTICO ===== */
  const form = $('[data-diagnostico]');
  if (!form) return;
  // Recomendación según la tarea principal (EJEMPLO: validar textos con el cliente)
  const RECOMENDACIONES = {
    consultas: { titulo: 'Un asistente virtual para atención al cliente', texto: 'Responde preguntas frecuentes, toma datos de contacto y te pasa solo las consultas que necesitan a una persona. Suele ser el punto de partida con resultados más rápidos.' },
    reportes: { titulo: 'Automatización de reportes', texto: 'Conectamos tus hojas de cálculo o sistemas para que los reportes se armen y lleguen solos, a la hora que los necesitas.' },
    documentos: { titulo: 'Automatización del registro de documentos', texto: 'La IA lee facturas, guías u órdenes y registra los datos por ti, con revisión humana donde haga falta.' },
    agenda: { titulo: 'Un asistente de agenda y recordatorios', texto: 'Tus clientes reservan, reprograman y reciben recordatorios automáticos, y tu equipo ve la agenda siempre actualizada.' }
  };
  const NOTAS = {
    basico: 'Como hoy usan herramientas básicas, empezaríamos con una solución simple sobre WhatsApp y hojas de cálculo, más una capacitación corta para tu equipo.',
    intermedio: 'Como ya usan sistemas y hojas de cálculo, podemos conectar la solución a lo que ya tienen para aprovechar tus datos desde el primer día.',
    avanzado: 'Como ya tienen procesos digitales, podemos integrar la IA con tus sistemas y medir el ahorro con indicadores claros.'
  };
  const resultado = $('[data-resultado]', form);
  const error = $('[data-diagnostico-error]', form);
  let respuestas = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datos = new FormData(form);
    const tarea = datos.get('tarea'), tamano = datos.get('tamano'), madurez = datos.get('madurez');
    if (!tarea || !tamano || !madurez) {
      error.textContent = 'Responde las 3 preguntas para ver tu resultado.';
      const falta = $$('fieldset', form).map((f) => (f.querySelector('input:checked') ? null : f.querySelector('input'))).find(Boolean);
      if (falta) falta.focus();
      return;
    }
    error.textContent = '';
    const rec = RECOMENDACIONES[tarea];
    $('[data-resultado-titulo]', form).textContent = rec.titulo;
    $('[data-resultado-texto]', form).textContent = rec.texto;
    $('[data-resultado-nota]', form).textContent = NOTAS[madurez];
    const etiqueta = (name) => { const i = form.querySelector('input[name="' + name + '"]:checked'); return i ? i.nextElementSibling.textContent : ''; };
    respuestas = { tarea: etiqueta('tarea'), tamano: etiqueta('tamano'), madurez: etiqueta('madurez'), rec: rec.titulo };
    resultado.hidden = false;
    resultado.focus({ preventScroll: true });
    VT.irA(resultado);
  });
  $('[data-resultado-wa]', form).addEventListener('click', () => {
    if (!respuestas) return;
    VT.abrirWhatsApp([
      'Hola Vertex Tech, hice el diagnóstico de IA en su web:', '',
      '*Tarea que más tiempo quita:* ' + respuestas.tarea,
      '*Tamaño de la empresa:* ' + respuestas.tamano + ' personas',
      '*Uso de herramientas digitales:* ' + respuestas.madurez,
      '*Recomendación:* ' + respuestas.rec, '',
      '¿Podemos conversar?'
    ].join('\n'));
  });
})();

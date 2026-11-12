/* =====================================================================
   Vertex Tech — v2 · js/ilustraciones.js
   Ilustraciones SVG de producto (marcadores en la paleta de marca).
   REEMPLAZAR por fotos reales en img/productos/ cuando estén disponibles
   (agrega "imagen" en js/productos.js y adapta VT.ilustracion en main.js).
   ===================================================================== */
(function () {
  'use strict';
  const I = '#1B2A6B', C = '#00B8D9', B = '#FFFFFF', G = '#F4F5F7', M = '#6B7280';
  const svg = (contenido) => '<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" focusable="false">' +
    '<ellipse cx="120" cy="160" rx="86" ry="8" fill="' + I + '" opacity=".08"/>' + contenido + '</svg>';
  const trazo = 'stroke="' + I + '" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';

  const ilustraciones = {
    laptop: svg(
      '<rect x="56" y="26" width="128" height="88" rx="8" fill="' + B + '" ' + trazo + '/>' +
      '<rect x="66" y="36" width="108" height="66" rx="3" fill="' + I + '"/>' +
      '<path d="M76 88l20-16 16 10 20-24 30 30" fill="none" stroke="' + C + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="132" cy="58" r="4" fill="' + C + '"/>' +
      '<path d="M30 120h180l-14 16H44z" fill="' + I + '"/><rect x="104" y="120" width="32" height="4" rx="2" fill="' + C + '"/>'),
    pc: svg(
      '<rect x="30" y="34" width="104" height="70" rx="6" fill="' + B + '" ' + trazo + '/>' +
      '<rect x="39" y="43" width="86" height="52" rx="2" fill="' + I + '"/><rect x="48" y="54" width="40" height="5" rx="2.5" fill="' + C + '"/><rect x="48" y="66" width="60" height="4" rx="2" fill="' + B + '" opacity=".35"/><rect x="48" y="76" width="50" height="4" rx="2" fill="' + B + '" opacity=".35"/>' +
      '<path d="M74 104v18M60 124h44" ' + trazo + ' fill="none"/>' +
      '<rect x="150" y="40" width="58" height="104" rx="8" fill="' + I + '"/><circle cx="179" cy="60" r="7" fill="none" stroke="' + C + '" stroke-width="3"/>' +
      '<path d="M162 100h34M162 110h34M162 120h34" stroke="' + B + '" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>'),
    workstation: svg(
      '<rect x="20" y="24" width="150" height="92" rx="7" fill="' + B + '" ' + trazo + '/>' +
      '<rect x="30" y="34" width="130" height="72" rx="2" fill="' + I + '"/>' +
      '<path d="M44 92c20-34 40-34 56-14s34 8 46-30" fill="none" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/><path d="M44 64h30M44 74h20" stroke="' + B + '" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M95 116v14M75 132h40" ' + trazo + ' fill="none"/>' +
      '<rect x="180" y="30" width="44" height="114" rx="8" fill="' + I + '"/><rect x="188" y="40" width="28" height="6" rx="3" fill="' + C + '"/><circle cx="202" cy="128" r="5" fill="' + C + '"/>'),
    servidor: svg(
      '<rect x="78" y="20" width="84" height="128" rx="10" fill="' + I + '"/>' +
      '<rect x="90" y="34" width="60" height="18" rx="3" fill="' + B + '" opacity=".14"/><rect x="90" y="58" width="60" height="18" rx="3" fill="' + B + '" opacity=".14"/><rect x="90" y="82" width="60" height="18" rx="3" fill="' + B + '" opacity=".14"/>' +
      '<circle cx="140" cy="43" r="3.5" fill="' + C + '"/><circle cx="140" cy="67" r="3.5" fill="' + C + '"/><circle cx="140" cy="91" r="3.5" fill="' + B + '" opacity=".5"/>' +
      '<path d="M96 43h28M96 67h28M96 91h28" stroke="' + B + '" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="120" cy="124" r="8" fill="none" stroke="' + C + '" stroke-width="3"/>'),
    nas: svg(
      '<rect x="62" y="36" width="116" height="104" rx="12" fill="' + B + '" ' + trazo + '/>' +
      '<rect x="76" y="50" width="18" height="70" rx="4" fill="' + I + '"/><rect x="100" y="50" width="18" height="70" rx="4" fill="' + I + '"/><rect x="124" y="50" width="18" height="70" rx="4" fill="' + I + '"/><rect x="148" y="50" width="18" height="70" rx="4" fill="' + I + '"/>' +
      '<circle cx="85" cy="110" r="3" fill="' + C + '"/><circle cx="109" cy="110" r="3" fill="' + C + '"/><circle cx="133" cy="110" r="3" fill="' + C + '"/><circle cx="157" cy="110" r="3" fill="' + B + '" opacity=".5"/>'),
    impresora: svg(
      '<path d="M78 66V30h84v36" fill="' + B + '" ' + trazo + '/><path d="M92 44h56M92 54h40" stroke="' + M + '" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="40" y="66" width="160" height="62" rx="12" fill="' + I + '"/>' +
      '<rect x="150" y="80" width="34" height="12" rx="3" fill="' + C + '"/><circle cx="58" cy="86" r="4" fill="' + C + '"/>' +
      '<rect x="74" y="112" width="92" height="36" rx="3" fill="' + B + '" ' + trazo + '/><path d="M88 126h64M88 136h44" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/>'),
    'impresora-color': svg(
      '<rect x="44" y="52" width="152" height="70" rx="12" fill="' + B + '" ' + trazo + '/>' +
      '<rect x="44" y="52" width="152" height="22" rx="10" fill="' + I + '"/>' +
      '<rect x="60" y="88" width="16" height="26" rx="3" fill="' + C + '"/><rect x="82" y="88" width="16" height="26" rx="3" fill="' + I + '"/><rect x="104" y="88" width="16" height="26" rx="3" fill="' + M + '"/><rect x="126" y="88" width="16" height="26" rx="3" fill="' + G + '" stroke="' + I + '" stroke-width="2"/>' +
      '<rect x="78" y="118" width="84" height="30" rx="3" fill="' + B + '" ' + trazo + '/><rect x="92" y="128" width="30" height="10" rx="2" fill="' + C + '"/>'),
    monitor: svg(
      '<rect x="34" y="22" width="172" height="106" rx="8" fill="' + B + '" ' + trazo + '/>' +
      '<rect x="44" y="32" width="152" height="86" rx="3" fill="' + I + '"/>' +
      '<rect x="56" y="46" width="60" height="38" rx="4" fill="' + C + '" opacity=".9"/><rect x="124" y="46" width="60" height="8" rx="4" fill="' + B + '" opacity=".4"/><rect x="124" y="62" width="44" height="8" rx="4" fill="' + B + '" opacity=".4"/><rect x="56" y="94" width="128" height="8" rx="4" fill="' + B + '" opacity=".25"/>' +
      '<path d="M120 128v16M92 148h56" ' + trazo + ' fill="none"/>'),
    perifericos: svg(
      '<rect x="22" y="84" width="150" height="56" rx="10" fill="' + B + '" ' + trazo + '/>' +
      '<g fill="' + I + '"><rect x="36" y="98" width="14" height="10" rx="2"/><rect x="56" y="98" width="14" height="10" rx="2"/><rect x="76" y="98" width="14" height="10" rx="2"/><rect x="96" y="98" width="14" height="10" rx="2"/><rect x="116" y="98" width="14" height="10" rx="2"/><rect x="136" y="98" width="22" height="10" rx="2"/><rect x="36" y="114" width="22" height="10" rx="2"/><rect x="64" y="114" width="64" height="10" rx="2"/><rect x="134" y="114" width="24" height="10" rx="2"/></g>' +
      '<rect x="184" y="76" width="36" height="58" rx="18" fill="' + I + '"/><path d="M202 78v18" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M80 60c10-14 30-14 40 0M90 70c6-7 14-7 20 0" fill="none" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/>'),
    webcam: svg(
      '<rect x="64" y="40" width="112" height="58" rx="29" fill="' + I + '"/>' +
      '<circle cx="120" cy="69" r="20" fill="' + B + '"/><circle cx="120" cy="69" r="12" fill="' + I + '"/><circle cx="125" cy="64" r="4" fill="' + C + '"/>' +
      '<circle cx="160" cy="58" r="3" fill="' + C + '"/>' +
      '<path d="M120 98v20M84 120h72l-8 20H92z" fill="' + B + '" ' + trazo + '/>'),
    router: svg(
      '<path d="M76 98V44M164 98V44" ' + trazo + '/>' +
      '<rect x="44" y="96" width="152" height="40" rx="12" fill="' + I + '"/>' +
      '<circle cx="66" cy="116" r="3.5" fill="' + C + '"/><circle cx="80" cy="116" r="3.5" fill="' + C + '"/><circle cx="94" cy="116" r="3.5" fill="' + B + '" opacity=".5"/>' +
      '<path d="M100 60c12-12 28-12 40 0M108 70c7-7 17-7 24 0" fill="none" stroke="' + C + '" stroke-width="4" stroke-linecap="round"/><circle cx="120" cy="80" r="4" fill="' + C + '"/>'),
    switch: svg(
      '<rect x="18" y="70" width="204" height="44" rx="8" fill="' + I + '"/>' +
      '<g fill="' + B + '" opacity=".9"><rect x="32" y="82" width="12" height="10" rx="1.5"/><rect x="48" y="82" width="12" height="10" rx="1.5"/><rect x="64" y="82" width="12" height="10" rx="1.5"/><rect x="80" y="82" width="12" height="10" rx="1.5"/><rect x="96" y="82" width="12" height="10" rx="1.5"/><rect x="112" y="82" width="12" height="10" rx="1.5"/><rect x="128" y="82" width="12" height="10" rx="1.5"/><rect x="144" y="82" width="12" height="10" rx="1.5"/></g>' +
      '<g fill="' + C + '"><circle cx="38" cy="100" r="2"/><circle cx="54" cy="100" r="2"/><circle cx="70" cy="100" r="2"/><circle cx="102" cy="100" r="2"/><circle cx="134" cy="100" r="2"/></g>' +
      '<rect x="172" y="82" width="36" height="20" rx="4" fill="' + C + '"/>' +
      '<path d="M50 70V50M90 70V40M130 70V54M170 70V44" stroke="' + C + '" stroke-width="2" stroke-dasharray="3 5" stroke-linecap="round"/>'),
    mochila: svg(
      '<path d="M92 40a28 28 0 0 1 56 0" fill="none" ' + trazo + '/>' +
      '<rect x="70" y="40" width="100" height="108" rx="26" fill="' + I + '"/>' +
      '<rect x="86" y="96" width="68" height="40" rx="10" fill="' + B + '" opacity=".14"/><path d="M98 108h44" stroke="' + C + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M86 62h68" stroke="' + B + '" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>'),
    auriculares: svg(
      '<path d="M66 108V92a54 54 0 0 1 108 0v16" fill="none" stroke="' + I + '" stroke-width="10" stroke-linecap="round"/>' +
      '<rect x="52" y="98" width="34" height="50" rx="14" fill="' + I + '"/><rect x="154" y="98" width="34" height="50" rx="14" fill="' + I + '"/>' +
      '<rect x="62" y="110" width="14" height="26" rx="7" fill="' + C + '"/>' +
      '<path d="M72 148c0 12 18 14 30 10" fill="none" stroke="' + I + '" stroke-width="4" stroke-linecap="round"/><circle cx="106" cy="157" r="6" fill="' + C + '"/>'),
    licencia: svg(
      '<rect x="44" y="30" width="152" height="112" rx="12" fill="' + B + '" ' + trazo + '/>' +
      '<rect x="44" y="30" width="152" height="24" rx="10" fill="' + I + '"/><circle cx="60" cy="42" r="3.5" fill="' + C + '"/><circle cx="72" cy="42" r="3.5" fill="' + B + '" opacity=".5"/>' +
      '<path d="M120 66l28 10v18c0 16-12 28-28 32-16-4-28-16-28-32V76z" fill="' + I + '"/><path d="M108 96l9 9 17-18" fill="none" stroke="' + C + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'),
    camaras: svg(
      '<path d="M30 52l70-18 8 30-70 18z" fill="' + B + '" ' + trazo + '/><circle cx="92" cy="54" r="7" fill="' + I + '"/><circle cx="92" cy="54" r="3" fill="' + C + '"/><path d="M60 76l4 18H44" ' + trazo + ' fill="none"/>' +
      '<path d="M210 52l-70-18-8 30 70 18z" fill="' + B + '" ' + trazo + '/><circle cx="148" cy="54" r="7" fill="' + I + '"/><circle cx="148" cy="54" r="3" fill="' + C + '"/><path d="M180 76l-4 18h20" ' + trazo + ' fill="none"/>' +
      '<rect x="64" y="112" width="112" height="34" rx="8" fill="' + I + '"/><circle cx="82" cy="129" r="3.5" fill="' + C + '"/><path d="M96 129h60" stroke="' + B + '" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/>'),
    ups: svg(
      '<rect x="80" y="24" width="80" height="124" rx="10" fill="' + I + '"/>' +
      '<rect x="92" y="38" width="56" height="30" rx="4" fill="' + C + '"/><path d="M104 53h10l-4 8 12-14h-10l4-8z" fill="' + I + '"/>' +
      '<circle cx="120" cy="88" r="7" fill="none" stroke="' + B + '" stroke-opacity=".7" stroke-width="3"/>' +
      '<rect x="96" y="108" width="20" height="14" rx="3" fill="' + B + '" opacity=".2"/><rect x="124" y="108" width="20" height="14" rx="3" fill="' + B + '" opacity=".2"/><rect x="96" y="126" width="20" height="14" rx="3" fill="' + B + '" opacity=".2"/><rect x="124" y="126" width="20" height="14" rx="3" fill="' + B + '" opacity=".2"/>'),
    estabilizador: svg(
      '<rect x="58" y="54" width="124" height="88" rx="12" fill="' + B + '" ' + trazo + '/>' +
      '<path d="M88 104a32 32 0 0 1 64 0" fill="none" stroke="' + I + '" stroke-width="6" stroke-linecap="round"/><path d="M120 104l16-18" stroke="' + C + '" stroke-width="5" stroke-linecap="round"/><circle cx="120" cy="104" r="5" fill="' + I + '"/>' +
      '<rect x="78" y="118" width="18" height="12" rx="3" fill="' + I + '"/><rect x="102" y="118" width="18" height="12" rx="3" fill="' + I + '"/><rect x="126" y="118" width="18" height="12" rx="3" fill="' + I + '"/><circle cx="162" cy="124" r="4" fill="' + C + '"/>'),
    pos: svg(
      '<rect x="34" y="26" width="110" height="78" rx="8" fill="' + B + '" ' + trazo + '/>' +
      '<rect x="43" y="35" width="92" height="60" rx="3" fill="' + I + '"/><g fill="' + C + '"><rect x="52" y="44" width="22" height="16" rx="3"/><rect x="78" y="44" width="22" height="16" rx="3" opacity=".6"/><rect x="104" y="44" width="22" height="16" rx="3" opacity=".6"/></g><rect x="52" y="68" width="74" height="18" rx="3" fill="' + B + '" opacity=".25"/>' +
      '<path d="M89 104l-8 26h16z" fill="' + I + '"/><rect x="40" y="128" width="98" height="16" rx="5" fill="' + I + '"/>' +
      '<rect x="160" y="78" width="54" height="66" rx="8" fill="' + I + '"/><path d="M172 78V52h30v26" fill="' + B + '" ' + trazo + '/><path d="M180 62h14M180 70h10" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/>'),
    generico: svg(
      '<path d="M60 58l60-26 60 26v60l-60 26-60-26z" fill="' + B + '" ' + trazo + '/><path d="M60 58l60 26 60-26M120 84v60" fill="none" ' + trazo + '/><circle cx="120" cy="84" r="6" fill="' + C + '"/>')
  };

  window.VT = window.VT || {};
  window.VT.ilustraciones = ilustraciones;
})();

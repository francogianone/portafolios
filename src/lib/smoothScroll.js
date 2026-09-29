import Lenis from 'lenis';

/**
 * Smooth scroll global con inercia (Lenis).
 * - Se inicializa una sola vez desde main.jsx y queda activo SIEMPRE:
 *   ya no se apaga con prefers-reduced-motion (decisión de producto: el
 *   portafolio debe verse y sentirse igual en todas las PCs).
 * - Modo "lerp" alto (0.3): seguimiento casi inmediato de la rueda (ideal para
 *   monitores de alta tasa de refresco, 120-240Hz) manteniendo un micro-glide
 *   que suaviza los saltos discretos de la rueda del mouse.
 * - Todo scroll programatico DEBE usar estos helpers (no scrollIntoView
 *   directo), para que Lenis y la pagina no peleen por el scroll.
 */
let lenis = null;

export const initSmoothScroll = () => {
  if (lenis) return lenis;
  lenis = new Lenis({
    // Que tan rapido persigue al target (por frame, normalizado por delta).
    // 0.1 = muy flotante/lento | 0.3 = reactivo con micro-glide (200Hz friendly)
    // Subilo a 0.4-0.5 para respuesta casi nativa; baja a 0.15-0.2 para mas glide.
    lerp: 0.3,
    smoothWheel: true,    // intercepta la rueda del mouse
    touchMultiplier: 1.5, // en pantallas tactiles responde un poco mas por gesto
  });
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
};

/** Scroll suave hacia un elemento (reemplaza scrollIntoView) */
export const scrollToTarget = (target) => {
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

/** Salto instantaneo a una posicion Y (restauracion de scroll entre rutas) */
export const scrollToY = (y) => {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo(0, y);
  }
};
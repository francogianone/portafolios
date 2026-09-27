import Lenis from 'lenis';

/**
 * Smooth scroll global con inercia (Lenis).
 * - Se inicializa una sola vez desde main.jsx.
 * - Respeta prefers-reduced-motion: no se inicializa y los helpers
 *   caen al comportamiento nativo del navegador.
 * - Todo scroll programático DEBE usar estos helpers (no scrollIntoView
 *   directo), para que Lenis y la página no peleen por el scroll.
 */
let lenis = null;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const initSmoothScroll = () => {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({
    lerp: 0.1,          // suavidad de la inercia (0 = seco, 1 = muy flotante)
    smoothWheel: true,  // intercepta la rueda del mouse
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

/** Salto instantáneo a una posición Y (restauración de scroll entre rutas) */
export const scrollToY = (y) => {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo(0, y);
  }
};

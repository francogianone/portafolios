import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToY } from '../lib/smoothScroll';

/**
 * Restauración de scroll entre rutas:
 * - Guarda continuamente la posición de scroll de la página actual.
 * - Al navegar a una página nueva: baja al inicio.
 * - Al volver a una página ya visitada (ej: volver del detalle de un proyecto
 *   a la home): restaura exactamente la posición en la que estaba el usuario.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const positions = useRef({});
  const currentPath = useRef(pathname);

  // guardar continuamente la posición de scroll de la página actual
  useLayoutEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        positions.current[currentPath.current] = window.scrollY;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    if (currentPath.current === pathname) return;

    // la posición de la página anterior ya quedó guardada por el listener de scroll
    const saved = positions.current[pathname];
    if (typeof saved === 'number') {
      scrollToY(saved);
      positions.current[pathname] = saved;
    } else {
      scrollToY(0);
      positions.current[pathname] = 0;
    }
    currentPath.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollToTop;

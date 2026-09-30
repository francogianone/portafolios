import { useEffect, useState } from 'react';

/**
 * Mobile = pantallas chicas (celulares y tablets) o dispositivos táctiles
 * (sin hover y con puntero grueso), aunque tengan una pantalla grande.
 * Se inicializa con el valor real de matchMedia (sin flash) y reacciona
 * si el usuario rota el dispositivo o redimensiona la ventana.
 */
const QUERY = '(max-width: 1024px), ((hover: none) and (pointer: coarse))';

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
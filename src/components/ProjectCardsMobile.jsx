import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';

/**
 * Carrusel de proyectos para mobile/tablet (reemplaza al mazo 3D CardSwap).
 * - Rendimiento primero: scroll-snap CSS nativo (compositado por el navegador),
 *   cero GSAP/framer-motion y cero loops de animación en JS.
 * - Las cards son estáticas: solo cambian al deslizar a los costados o con
 *   las flechas laterales.
 * - El índice activo se sincroniza con el scroll con un listener rAF-throttled
 *   (un solo cálculo por frame, solo mientras se está deslizando).
 */
const ProjectCardsMobile = forwardRef(({ projects, onOpen }, ref) => {
  const trackRef = useRef(null);
  const touchStart = useRef(null);
  const [index, setIndex] = useState(0);

  // Sincroniza el índice activo con la posición del scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setIndex((prev) => {
          const next = Math.max(0, Math.min(projects.length - 1, i));
          return prev === next ? prev : next;
        });
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [projects.length]);

  const goToIndex = useCallback((i) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  }, [projects.length]);

  useImperativeHandle(ref, () => ({ goToIndex }), [goToIndex]);

  // Tap vs swipe: si el dedo se movió al tocar, no abrir el proyecto
  const handleTap = (i) => (e) => {
    const t = touchStart.current;
    touchStart.current = null;
    if (t && (Math.abs(e.clientX - t.x) > 12 || Math.abs(e.clientY - t.y) > 12)) return;
    onOpen?.(projects[i].id);
  };

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          data-lenis-prevent
          onTouchStart={(e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
        >
          {projects.map((project, i) => (
            <div key={project.id} className="snap-center shrink-0 w-full px-6 flex justify-center">
              <div
                onClick={handleTap(i)}
                className="relative w-full max-w-[520px] h-[560px] rounded-[20px] border border-neon-blue/30 bg-gradient-to-br from-[#0a0f14] to-[#05080b] shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden cursor-pointer select-none"
              >
                <ProjectCard project={project} showImageArrows={false} />
              </div>
            </div>
          ))}
        </div>

        {/* Flechas laterales, montadas sobre los bordes de la card */}
        <button
          onClick={() => goToIndex(index - 1)}
          disabled={index === 0}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 border border-white/15 text-white flex items-center justify-center transition active:bg-neon-blue active:text-black disabled:opacity-30"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => goToIndex(index + 1)}
          disabled={index === projects.length - 1}
          aria-label="Siguiente"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 border border-white/15 text-white flex items-center justify-center transition active:bg-neon-blue active:text-black disabled:opacity-30"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Indicador de posición */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {projects.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goToIndex(i)}
            aria-label={`Ir al proyecto ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-neon-blue' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
});

ProjectCardsMobile.displayName = 'ProjectCardsMobile';

export default ProjectCardsMobile;
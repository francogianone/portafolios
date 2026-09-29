import React, { Children, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

// Ancho de diseño de referencia: cardDistance/verticalDistance se especifican
// para este ancho y se escalan proporcionalmente al ancho real del contenedor,
// para que el mazo se vea igual en cualquier resolución/zoom de navegador.
const DESIGN_WIDTH = 1300;

// Delta estándar de una notcha de rueda (px). Las notchas se acumulan y cada
// una equivale a un paso del mazo: nada se descarta por throttle.
const WHEEL_NOTCH = 100;

export const Card = forwardRef(({ customClass, ...rest }, ref) => {
  // El efecto hover (escala + glow) solo aplica a la card frontal:
  // evita tormentas de tweens cuando las cards pasan bajo el cursor durante la rotación.
  const handleEnter = (e) => {
    if (!e.currentTarget.classList.contains('card-front')) return;
    gsap.to(e.currentTarget, { scale: 1.03, duration: 0.25, ease: 'power2.out' });
  };
  const handleLeave = (e) => {
    if (!e.currentTarget.classList.contains('card-front')) return;
    gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: 'power2.out' });
  };
  const className = `card ${customClass ?? ''} ${rest.className ?? ''}`.trim();
  return <div ref={ref} onMouseEnter={handleEnter} onMouseLeave={handleLeave} {...rest} className={className} />;
});
Card.displayName = 'Card';

const CardSwap = forwardRef(
  (
    {
      width = 'min(92vw, 1200px)',
      height = 'min(80vh, 720px)',
      cardDistance = 60,
      verticalDistance = 45,
      skewAmount = 4,
      easing = 'elastic',
      onCardClick,
      onFrontChange,
      children
    },
    ref
  ) => {
    const ease = easing === 'elastic' ? 'elastic.out(0.6,0.9)' : 'power1.inOut';

    const childArr = useMemo(() => Children.toArray(children), [children]);
    const refs = useMemo(
      () => childArr.map(() => React.createRef()),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [childArr.length]
    );
    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const container = useRef(null);
    // Acumulador de delta de rueda: suma las notchas y emite un paso por notcha.
    const wheelAcc = useRef(0);
    // Distancias escaladas al ancho real del contenedor (las actualiza el ResizeObserver)
    const metrics = useRef({ dx: cardDistance, dy: verticalDistance });

    const makeSlot = (i, total) => ({
      x: i * metrics.current.dx,
      y: -i * metrics.current.dy,
      z: -i * metrics.current.dx * 0.7,
      zIndex: total - i
    });

    /**
     * Coloca las cards según `list` (orden de slots).
     * - animate=false: colocación instantánea (montaje o resize).
     * - base=true: además fija xPercent/yPercent/skewY (solo montaje inicial).
     */
    const place = useCallback((list, opts = {}) => {
      const { animate = true, duration = 0.6, ease: tweenEase = ease, base = false } = opts;
      list.forEach((cardIdx, slotIdx) => {
        const el = refs[cardIdx]?.current;
        if (!el) return;
        const s = makeSlot(slotIdx, refs.length);
        gsap.set(el, { zIndex: s.zIndex });
        // Solo la card frontal mantiene el hover; las demás se resetean (auto-sanitiza el scale)
        if (slotIdx === 0) {
          el.classList.add('card-front');
        } else {
          el.classList.remove('card-front');
          gsap.set(el, { scale: 1 });
        }
        if (animate) {
          gsap.to(el, { x: s.x, y: s.y, z: s.z, duration, ease: tweenEase, overwrite: 'auto' });
        } else if (base) {
          gsap.set(el, {
            x: s.x,
            y: s.y,
            z: s.z,
            xPercent: -50,
            yPercent: -50,
            skewY: skewAmount,
            transformOrigin: 'center center',
            force3D: true
          });
        } else {
          gsap.set(el, { x: s.x, y: s.y, z: s.z });
        }
      });
    }, [refs, ease, skewAmount]);

    const animateTo = useCallback((newOrder) => {
      place(newOrder, { animate: true });
      order.current = newOrder;
      onFrontChange?.(newOrder[0]);
    }, [place, onFrontChange]);

    const next = useCallback(() => {
      const o = [...order.current];
      o.push(o.shift());
      animateTo(o);
    }, [animateTo]);

    const prev = useCallback(() => {
      const o = [...order.current];
      o.unshift(o.pop());
      animateTo(o);
    }, [animateTo]);

    useImperativeHandle(ref, () => ({
      next,
      prev,
      bringToFront: (idx) => {
        const i = order.current.indexOf(idx);
        if (i === -1) return;
        const o = [...order.current];
        o.splice(i, 1);
        o.unshift(idx);
        animateTo(o);
      }
    }), [next, prev, animateTo]);

    // Colocación inicial (con las props base de transform)
    useEffect(() => {
      place(order.current, { animate: false, base: true });
    }, [childArr.length, place]);

    // Medición del contenedor: escala las distancias al ancho real.
    // Así el mazo no se deforma ni desborda en un monitor 4K, una notebook
    // 1366x768 o con el zoom del navegador cambiado.
    useEffect(() => {
      const el = container.current;
      if (!el) return;
      let first = true;
      const measure = () => {
        const w = el.clientWidth;
        if (!w) return;
        const scale = Math.max(0.3, Math.min(1, w / DESIGN_WIDTH));
        const dx = Math.round(cardDistance * scale);
        const dy = Math.round(verticalDistance * scale);
        if (!first && metrics.current.dx === dx && metrics.current.dy === dy) return;
        metrics.current = { dx, dy };
        place(order.current, first ? { animate: false } : { animate: true, duration: 0.3, ease: 'power2.out' });
        first = false;
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [cardDistance, verticalDistance, place]);

    useEffect(() => {
      const el = container.current;
      if (!el) return;
      const onWheel = (e) => {
        e.preventDefault();
        // Normaliza deltaMode: Firefox reporta líneas (1) o páginas (2), no píxeles
        const d = e.deltaMode === 1
          ? e.deltaY * (WHEEL_NOTCH / 3)
          : e.deltaMode === 2
            ? e.deltaY * WHEEL_NOTCH
            : e.deltaY;
        if (Math.abs(d) < 2) return;
        wheelAcc.current += d;
        // Cada notcha acumulada = un paso del mazo, con retarget inmediato:
        // ninguna notcha se descarta (ráfagas rápidas avanzan todas las cards).
        while (Math.abs(wheelAcc.current) >= WHEEL_NOTCH) {
          const dir = Math.sign(wheelAcc.current);
          wheelAcc.current -= dir * WHEEL_NOTCH;
          if (dir > 0) next();
          else prev();
        }
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => {
        el.removeEventListener('wheel', onWheel);
        wheelAcc.current = 0;
      };
    }, [next, prev]);

    const rendered = childArr.map((child, i) =>
      isValidElement(child)
        ? cloneElement(child, {
            key: i,
            ref: refs[i],
            style: { width, height, ...(child.props.style ?? {}) },
            onClick: (e) => {
              child.props.onClick?.(e);
              onCardClick?.(i);
            }
          })
        : child
    );

    return (
      <div ref={container} className="card-swap-container" data-lenis-prevent style={{ width, height }}>
        {rendered}
      </div>
    );
  }
);

CardSwap.displayName = 'CardSwap';

export default CardSwap;
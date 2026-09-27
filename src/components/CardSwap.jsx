import React, { Children, cloneElement, forwardRef, isValidElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

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

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 0.7,
  zIndex: total - i
});

const CardSwap = forwardRef(
  (
    {
      width = 'min(92vw, 1200px)',
      height = 'min(80vh, 720px)',
      cardDistance = 60,
      verticalDistance = 45,
      skewAmount = 4,
      easing = 'elastic',
      wheelThrottle = 180,
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
    const lastWheel = useRef(0);

    const animateTo = useCallback(
      (newOrder) => {
        newOrder.forEach((cardIdx, slotIdx) => {
          const el = refs[cardIdx]?.current;
          if (!el) return;
          const s = makeSlot(slotIdx, cardDistance, verticalDistance, refs.length);
          gsap.set(el, { zIndex: s.zIndex });
          // Solo la card frontal mantiene el hover; las demás se resetean (auto-sanitiza el scale)
          if (slotIdx === 0) {
            el.classList.add('card-front');
          } else {
            el.classList.remove('card-front');
            gsap.set(el, { scale: 1 });
          }
          gsap.to(el, { x: s.x, y: s.y, z: s.z, duration: 0.6, ease, overwrite: 'auto' });
        });
        order.current = newOrder;
        onFrontChange?.(newOrder[0]);
      },
      [cardDistance, verticalDistance, ease, refs, onFrontChange]
    );

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

    useEffect(() => {
      order.current.forEach((cardIdx, slotIdx) => {
        const el = refs[cardIdx]?.current;
        if (!el) return;
        const s = makeSlot(slotIdx, cardDistance, verticalDistance, refs.length);
        el.classList.toggle('card-front', slotIdx === 0);
        gsap.set(el, {
          x: s.x,
          y: s.y,
          z: s.z,
          xPercent: -50,
          yPercent: -50,
          skewY: skewAmount,
          transformOrigin: 'center center',
          zIndex: s.zIndex,
          force3D: true
        });
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDistance, verticalDistance, skewAmount, childArr.length]);

    useEffect(() => {
      const el = container.current;
      if (!el) return;
      const onWheel = (e) => {
        e.preventDefault();
        if (Math.abs(e.deltaY) < 5) return;
        const now = Date.now();
        if (now - lastWheel.current < wheelThrottle) return;
        lastWheel.current = now;
        if (e.deltaY > 0) next();
        else prev();
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }, [next, prev, wheelThrottle]);

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

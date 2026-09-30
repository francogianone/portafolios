import { useEffect, useRef } from 'react';

/**
 * Fondo animado de red de nodos (estilo constelación) sobre canvas.
 * - Sin interacción: los nodos derivan lentamente. En dispositivos táctiles,
 *   además, "luciérnagas" automáticas recorren el campo encendiendo la red
 *   cuando nadie interactúa (así la red se muestra viva sin mouse).
 * - Con el puntero (mouse o dedo, Pointer Events): los nodos cercanos se
 *   encienden, se conectan entre sí y son suavemente repelidos; el rastro
 *   se desvanece al pasar. En táctil funciona incluso mientras se scrollea
 *   (listeners passive, sin preventDefault: el scroll de la página no se toca).
 * - Al tocar/click (pointerdown): un pulso expansivo enciende los nodos a su
 *   paso y se desvanece.
 * - Optimizado para equipos de gama baja: nodos, DPR y FPS se adaptan al
 *   hardware. Pausa cuando la sección no es visible.
 * - No se apaga con prefers-reduced-motion (decisión de producto).
 */
const NetworkBackground = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    // --- Sondeo de capacidad del equipo (una sola vez) ---
    const cores = navigator.hardwareConcurrency || 2;
    let tier = 1;
    if (cores >= 8) tier = 1;
    else if (cores >= 6) tier = 0.85;
    else if (cores >= 4) tier = 0.7;
    else tier = 0.45;
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) tier *= 0.75;

    // ¿Dispositivo táctil (celular/tablet)? Ahí viven las luciérnagas en reposo.
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const MAX_NODES = 170;
    const BASE_DENSITY = 9000; // px² de canvas por nodo en un equipo potente
    const LINK_DIST = 150;   // distancia máxima para conectar nodos
    const MOUSE_DIST = 220;  // radio de conexión con el puntero
    const MOUSE_REPEL = 110; // radio de repulsión del puntero
    // Versiones al cuadrado: evitan Math.hypot/sqrt en el bucle O(n²)
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
    const MOUSE_DIST_SQ = MOUSE_DIST * MOUSE_DIST;
    const MOUSE_REPEL_SQ = MOUSE_REPEL * MOUSE_REPEL;
    const FIREFLY_DIST = 130;     // radio de influencia de una luciérnaga
    const FIREFLY_LINK = 90;      // hasta dónde dibuja líneas una luciérnaga
    const FIREFLY_SPEED = 0.45;   // px por frame de referencia (~16.7ms)
    const FIREFLY_IDLE_MS = 2500; // inactividad necesaria para que despierten
    const BURST_SPEED = 0.38;     // expansión del pulso (px por ms)
    const MAX_BURSTS = 3;
    // En equipos muy flojos, dibujar a ~30fps (mitad de costo, se ve igual de fluido)
    const FRAME_MIN_MS = tier < 0.6 ? 33 : 0;

    let width = 0;
    let height = 0;
    let nodes = [];
    let raf = null;
    let visible = true;
    let lastFrame = 0;
    let rect = null;
    let fireflyFade = 0;
    let lastInteraction = -Infinity;
    const mouse = { x: -9999, y: -9999 };
    const bursts = [];    // { x, y, r, maxR }
    const fireflies = []; // { x, y, angle }

    const rand = (min, max) => Math.random() * (max - min) + min;

    const spawnNodes = () => {
      const count = Math.min(
        Math.floor((width * height) / (BASE_DENSITY / tier)),
        MAX_NODES
      );
      nodes = [];
      // Clústeres para imitar la referencia: red densa a la izquierda, dispersión hacia los bordes
      const clusters = [
        { x: width * 0.26, y: height * 0.42, spread: Math.min(width, height) * 0.34 },
        { x: width * 0.68, y: height * 0.62, spread: Math.min(width, height) * 0.22 },
      ];
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        let x, y;
        if (roll < 0.5) {
          const c = clusters[0];
          x = c.x + (Math.random() + Math.random() + Math.random() - 1.5) * c.spread;
          y = c.y + (Math.random() + Math.random() + Math.random() - 1.5) * c.spread;
        } else if (roll < 0.68) {
          const c = clusters[1];
          x = c.x + (Math.random() + Math.random() - 1) * c.spread;
          y = c.y + (Math.random() + Math.random() - 1) * c.spread;
        } else {
          x = rand(0, width);
          y = rand(0, height);
        }
        nodes.push({
          x: Math.max(0, Math.min(width, x)),
          y: Math.max(0, Math.min(height, y)),
          vx: rand(-0.22, 0.22),
          vy: rand(-0.22, 0.22),
          r: rand(1, 2.1),
          accent: Math.random() < 0.07,
          energy: 0, // se enciende al pasar el puntero/pulso/luciérnaga; decae con el tiempo
        });
      }
      // Luciérnagas: solo en táctil, 2 en equipos flojos y 3 en el resto
      fireflies.length = 0;
      if (isTouch) {
        const count = tier < 0.6 ? 2 : 3;
        for (let i = 0; i < count; i++) {
          fireflies.push({ x: rand(0, width), y: rand(0, height), angle: rand(0, Math.PI * 2) });
        }
      }
    };

    const drawFrame = (dt, t) => {
      ctx.clearRect(0, 0, width, height);
      const step = dt / 16.7; // factor de tiempo para animaciones por frame

      // --- Pulsos expansivos (pointerdown): encienden los nodos a su paso ---
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.r += BURST_SPEED * dt;
        const fade = 1 - b.r / b.maxR;
        if (fade <= 0) {
          bursts.splice(i, 1);
          continue;
        }
        const r2 = b.r * b.r;
        const boost = Math.min(1, fade * 1.6);
        for (const n of nodes) {
          const dx = n.x - b.x;
          const dy = n.y - b.y;
          if (dx * dx + dy * dy < r2 && n.energy < boost) n.energy = boost;
        }
        ctx.strokeStyle = `rgba(0, 243, 255, ${0.35 * fade})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(0, 190, 255, ${0.12 * fade})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 0.72, 0, Math.PI * 2);
        ctx.stroke();
      }

      // --- Luciérnagas (solo táctil): despiertan tras un rato sin interacción ---
      const idle = isTouch && t - lastInteraction > FIREFLY_IDLE_MS;
      fireflyFade += ((idle ? 1 : 0) - fireflyFade) * Math.min(1, dt / 600);
      if (fireflyFade > 0.01) {
        const fd2max = FIREFLY_DIST * FIREFLY_DIST;
        for (const f of fireflies) {
          f.angle += (Math.random() - 0.5) * 0.04 * step;
          f.x += Math.cos(f.angle) * FIREFLY_SPEED * step;
          f.y += Math.sin(f.angle) * FIREFLY_SPEED * step;
          if (f.x < -30) f.x = width + 30;
          if (f.x > width + 30) f.x = -30;
          if (f.y < -30) f.y = height + 30;
          if (f.y > height + 30) f.y = -30;
          for (const n of nodes) {
            const dx = n.x - f.x;
            const dy = n.y - f.y;
            if (dx * dx + dy * dy < fd2max && n.energy < fireflyFade) n.energy = fireflyFade;
          }
        }
      }

      // conexiones entre nodos: SOLO entre nodos con energía (encendidos por el puntero,
      // el pulso o las luciérnagas). Cada conexión usa la energía mínima del par.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (a.energy < 0.02) continue;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (b.energy < 0.02) continue;
          const pairEnergy = Math.min(a.energy, b.energy);
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST_SQ) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.32 * pairEnergy;
            ctx.strokeStyle = `rgba(0, 190, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // conexiones del puntero
      if (mouse.x >= 0) {
        for (const n of nodes) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_DIST_SQ) {
            const alpha = (1 - Math.sqrt(d2) / MOUSE_DIST) * 0.45;
            ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // luciérnagas: líneas hacia los nodos cercanos + punto brillante con halo
      if (fireflyFade > 0.01) {
        const fl2 = FIREFLY_LINK * FIREFLY_LINK;
        for (const f of fireflies) {
          for (const n of nodes) {
            const dx = n.x - f.x;
            const dy = n.y - f.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < fl2) {
              const alpha = (1 - Math.sqrt(d2) / FIREFLY_LINK) * 0.22 * fireflyFade;
              if (alpha > 0.01) {
                ctx.strokeStyle = `rgba(0, 190, 255, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(f.x, f.y);
                ctx.lineTo(n.x, n.y);
                ctx.stroke();
              }
            }
          }
          ctx.beginPath();
          ctx.arc(f.x, f.y, 5.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 243, 255, ${0.18 * fireflyFade})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(f.x, f.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(190, 225, 255, ${0.9 * fireflyFade})`;
          ctx.fill();
        }
      }

      // nodos
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.accent
          ? 'rgba(168, 85, 247, 0.85)'
          : 'rgba(160, 220, 255, 0.8)';
        ctx.fill();
      }

      // movimiento
      for (const n of nodes) {
        // repulsión suave del puntero + activación por cercanía
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;

        // activación: el puntero "enciende" los nodos cercanos; se apagan lentamente al pasar
        if (d2 < MOUSE_DIST_SQ) {
          n.energy = 1;
        } else {
          n.energy *= 0.975;
        }

        if (d2 < MOUSE_REPEL_SQ && d2 > 0.0001) {
          const d = Math.sqrt(d2);
          const force = (1 - d / MOUSE_REPEL) * 0.6;
          n.x += (dx / d) * force;
          n.y += (dy / d) * force;
        }

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }
    };

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      // DPR más bajo en equipos flojos: menos píxeles que llenar en cada frame
      const dpr = Math.min(window.devicePixelRatio || 1, tier >= 0.7 ? 2 : 1.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawnNodes();
      rect = null;
    };

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (FRAME_MIN_MS && t - lastFrame < FRAME_MIN_MS) return;
      const dt = Math.min(50, t - lastFrame || 16.7);
      lastFrame = t;
      if (visible) drawFrame(dt, t);
    };

    // El rect del canvas se cachea: leerlo en cada pointer event fuerza layout.
    // Se invalida al hacer scroll o resize.
    const updateRect = () => { rect = canvas.getBoundingClientRect(); };

    const setPointerFromEvent = (e) => {
      if (!rect) updateRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };

    // Pointer Events unifican mouse, dedo y lápiz en un solo código:
    // pointermove dispara siempre en mouse y, en táctil, mientras el dedo está apoyado.
    const onPointerMove = (e) => {
      lastInteraction = e.timeStamp;
      setPointerFromEvent(e);
    };

    const onPointerDown = (e) => {
      lastInteraction = e.timeStamp;
      setPointerFromEvent(e);
      if (mouse.x > -999) {
        if (bursts.length >= MAX_BURSTS) bursts.shift();
        bursts.push({ x: mouse.x, y: mouse.y, r: 0, maxR: Math.min(width, height) * 0.45 });
      }
    };

    const onPointerUp = (e) => {
      lastInteraction = e.timeStamp;
      // Al levantar el dedo se apaga el rastro (en mouse NO: el cursor sigue activo)
      if (e.pointerType !== 'mouse') {
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };

    const onMouseLeaveDoc = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    resize();
    updateRect();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', updateRect, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveDoc);
    raf = requestAnimationFrame(loop);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.removeEventListener('mouseleave', onMouseLeaveDoc);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
    />
  );
};

export default NetworkBackground;
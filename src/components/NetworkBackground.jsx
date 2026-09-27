import { useEffect, useRef } from 'react';

/**
 * Fondo animado de red de nodos (estilo constelación) sobre canvas.
 * - Sin mouse: solo nodos flotando lentamente, todos desconectados entre sí.
 * - Al mover el mouse por la sección: los nodos cercanos al cursor se "encienden"
 *   y se conectan entre sí, dejando un rastro de red que se desvanece al pasar.
 *   El cursor además traza líneas hacia los nodos cercanos y los repele suavemente.
 * - Optimizado: respeta prefers-reduced-motion y pausa cuando la sección no es visible.
 */
const NetworkBackground = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const LINK_DIST = 150;   // distancia máxima para conectar nodos
    const MOUSE_DIST = 220;  // radio de conexión con el mouse
    const MOUSE_REPEL = 110; // radio de repulsión del mouse
    // Versiones al cuadrado: evitan Math.hypot/sqrt en el bucle O(n²)
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
    const MOUSE_DIST_SQ = MOUSE_DIST * MOUSE_DIST;
    const MOUSE_REPEL_SQ = MOUSE_REPEL * MOUSE_REPEL;

    let width = 0;
    let height = 0;
    let nodes = [];
    let raf = null;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    const rand = (min, max) => Math.random() * (max - min) + min;

    const spawnNodes = () => {
      const count = Math.min(Math.floor((width * height) / 9000), 170);
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
          energy: 0, // se enciende al pasar el mouse; decae con el tiempo
        });
      }
    };

    const drawFrame = (staticFrame = false) => {
      ctx.clearRect(0, 0, width, height);

      if (staticFrame) {
        // Modo estático (prefers-reduced-motion): encender solo los nodos cerca del mouse
        for (const n of nodes) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          n.energy = d < MOUSE_DIST ? 1 : n.energy * 0.975;
        }
      }

      // conexiones entre nodos: SOLO entre nodos con energía (encendidos por el paso del mouse).
      // Cada conexión usa la energía mínima del par, así el rastro se desvanece nodo a nodo.
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

      // conexiones del mouse
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

      // nodos
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.accent
          ? 'rgba(168, 85, 247, 0.85)'
          : 'rgba(160, 220, 255, 0.8)';
        ctx.fill();
      }

      if (staticFrame) return;

      // movimiento
      for (const n of nodes) {
        // repulsión suave del mouse + activación por cercanía
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;

        // activación: el mouse "enciende" los nodos cercanos; se apagan lentamente al pasar
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
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawnNodes();
      if (reducedMotion) drawFrame(true);
    };

    const loop = () => {
      if (visible) drawFrame();
      raf = requestAnimationFrame(loop);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
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

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    if (reducedMotion) {
      drawFrame(true);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
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

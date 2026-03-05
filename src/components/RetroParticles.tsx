import React, { useRef, useEffect, useCallback } from "react";
import "./RetroParticles.css";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseOpacity: number;
  sparkle: boolean;
  sparkleTimer: number;
  sparkleDuration: number;
}

interface RetroParticlesProps {
  isDark: boolean;
}

const PARTICLE_COUNT = 45;

const RetroParticles: React.FC<RetroParticlesProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const isDarkRef = useRef(isDark);
  const initializedRef = useRef(false);
  const prevSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Keep isDark in a ref so the animation loop always reads the latest value
  // without needing to be in the useEffect dependency array.
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  const createParticle = useCallback(
    (width: number, height: number, startVisible: boolean): Particle => {
      const isSparkle = Math.random() < 0.2;
      const baseOpacity = isSparkle
        ? Math.random() * 0.2 + 0.55
        : Math.random() * 0.2 + 0.35;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSparkle ? Math.random() * 3 + 3 : Math.random() * 2.5 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -(Math.random() * 0.35 + 0.1),
        opacity: startVisible ? baseOpacity : 0,
        baseOpacity,
        sparkle: isSparkle,
        sparkleTimer: Math.random() * 200,
        sparkleDuration: Math.random() * 60 + 40,
      };
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const newW = parent.clientWidth;
      const newH = parent.clientHeight;

      // On resize, rescale existing particle positions proportionally
      // so they stay in the same relative spot inside the container.
      if (
        particlesRef.current.length > 0 &&
        prevSizeRef.current.w > 0 &&
        prevSizeRef.current.h > 0
      ) {
        const scaleX = newW / prevSizeRef.current.w;
        const scaleY = newH / prevSizeRef.current.h;
        particlesRef.current.forEach((p) => {
          p.x *= scaleX;
          p.y *= scaleY;
        });
      }

      canvas.width = newW;
      canvas.height = newH;
      prevSizeRef.current = { w: newW, h: newH };
    };

    resizeCanvas();

    // Only create particles on first mount -- never re-create.
    const isFirstMount = !initializedRef.current;
    if (isFirstMount) {
      initializedRef.current = true;
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height, false)
      );
      // Staggered fade-in only on first mount
      particlesRef.current.forEach((p, i) => {
        setTimeout(() => {
          p.opacity = p.baseOpacity;
        }, i * 30);
      });
    }

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const color = isDarkRef.current ? "200, 210, 230" : "15, 30, 70";

      particlesRef.current.forEach((p) => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges using current canvas dimensions
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Sparkle effect
        let currentOpacity = p.opacity;
        if (p.sparkle) {
          p.sparkleTimer++;
          if (p.sparkleTimer > p.sparkleDuration) {
            const flashProgress =
              (p.sparkleTimer - p.sparkleDuration) / 30;
            if (flashProgress < 1) {
              currentOpacity =
                p.baseOpacity +
                (0.85 - p.baseOpacity) *
                  Math.sin(flashProgress * Math.PI);
            } else {
              p.sparkleTimer = 0;
              p.sparkleDuration = Math.random() * 120 + 60;
            }
          }
        }

        // Draw pixel-style square
        ctx.fillStyle = `rgba(${color}, ${currentOpacity})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
    };
  }, [createParticle]);

  return <canvas ref={canvasRef} className="retro-particles" />;
};

export default RetroParticles;

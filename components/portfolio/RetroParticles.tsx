"use client";

import { useRef, useEffect, useCallback } from "react";

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

export function RetroParticles({ isDark }: RetroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const isDarkRef = useRef(isDark);
  const initializedRef = useRef(false);

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

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    if (!initializedRef.current) {
      initializedRef.current = true;
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height, false)
      );
      particlesRef.current.forEach((p, i) => {
        setTimeout(() => {
          p.opacity = p.baseOpacity;
        }, i * 30);
      });
    }

    const handleResize = () => {
      const oldW = canvas.width;
      const oldH = canvas.height;
      setCanvasSize();
      if (oldW > 0 && oldH > 0) {
        const scaleX = canvas.width / oldW;
        const scaleY = canvas.height / oldH;
        particlesRef.current.forEach((p) => {
          p.x *= scaleX;
          p.y *= scaleY;
        });
      }
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const color = isDarkRef.current ? "200, 210, 230" : "15, 30, 70";

      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        let currentOpacity = p.opacity;
        if (p.sparkle) {
          p.sparkleTimer++;
          if (p.sparkleTimer > p.sparkleDuration) {
            const flashProgress = (p.sparkleTimer - p.sparkleDuration) / 30;
            if (flashProgress < 1) {
              currentOpacity =
                p.baseOpacity +
                (0.85 - p.baseOpacity) * Math.sin(flashProgress * Math.PI);
            } else {
              p.sparkleTimer = 0;
              p.sparkleDuration = Math.random() * 120 + 60;
            }
          }
        }

        ctx.fillStyle = `rgba(${color}, ${currentOpacity})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [createParticle]);

  return <canvas ref={canvasRef} className="retro-particles" />;
}

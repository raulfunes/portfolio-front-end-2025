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

  const createParticle = useCallback((width: number, height: number): Particle => {
    const isSparkle = Math.random() < 0.15;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: isSparkle ? Math.random() * 2 + 2 : Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.3 + 0.1),
      opacity: 0,
      baseOpacity: isSparkle ? Math.random() * 0.25 + 0.3 : Math.random() * 0.2 + 0.15,
      sparkle: isSparkle,
      sparkleTimer: Math.random() * 200,
      sparkleDuration: Math.random() * 60 + 40,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();

    // Initialize particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height)
    );

    // Fade in particles gradually
    particlesRef.current.forEach((p, i) => {
      setTimeout(() => {
        p.opacity = p.baseOpacity;
      }, i * 40);
    });

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const color = isDark ? "255, 255, 255" : "6, 19, 43";

      particlesRef.current.forEach((p) => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
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
            // Brief bright flash
            const flashProgress = (p.sparkleTimer - p.sparkleDuration) / 30;
            if (flashProgress < 1) {
              currentOpacity = p.baseOpacity + (0.5 - p.baseOpacity) * Math.sin(flashProgress * Math.PI);
            } else {
              p.sparkleTimer = 0;
              p.sparkleDuration = Math.random() * 120 + 60;
            }
          }
        }

        // Draw pixel-style square
        ctx.fillStyle = `rgba(${color}, ${currentOpacity})`;
        ctx.fillRect(
          Math.round(p.x),
          Math.round(p.y),
          p.size,
          p.size
        );
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
  }, [isDark, createParticle]);

  return <canvas ref={canvasRef} className="retro-particles" />;
};

export default RetroParticles;

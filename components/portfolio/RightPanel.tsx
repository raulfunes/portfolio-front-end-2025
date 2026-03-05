"use client";

import { useRef, useEffect, useState } from "react";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { TechnologiesSection } from "./Technologies";
import { Footer } from "./Footer";

interface RightPanelProps {
  panelWidth: string;
  left: string;
  opacity: number;
  onScroll?: (scrollLeft: number) => void;
}

export function RightPanel({ panelWidth, left, opacity, onScroll }: RightPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const el = scrollRef.current;
    if (!el) return;

    let raf = 0;
    let scrollSpeed = 0;
    let lastTouchX = 0;
    let lastTouchTime = 0;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      scrollSpeed += delta * 0.8;
      if (!raf) startMomentum();
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchX = e.touches[0].clientX;
      lastTouchTime = Date.now();
      scrollSpeed = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchX = e.touches[0].clientX;
      const deltaX = lastTouchX - touchX;
      el.scrollLeft += deltaX * 1.2;
      onScroll?.(el.scrollLeft);

      const now = Date.now();
      const dt = now - lastTouchTime;
      if (dt > 0) {
        scrollSpeed = (deltaX / dt) * 16 * 2;
      }

      lastTouchX = touchX;
      lastTouchTime = now;
    };

    const handleTouchEnd = () => {
      if (Math.abs(scrollSpeed) > 1 && !raf) {
        startMomentum();
      }
    };

    const startMomentum = () => {
      const animate = () => {
        if (Math.abs(scrollSpeed) > 0.5) {
          el.scrollLeft += scrollSpeed;
          onScroll?.(el.scrollLeft);
          scrollSpeed *= 0.92;
          raf = requestAnimationFrame(animate);
        } else {
          scrollSpeed = 0;
          raf = 0;
        }
      };
      raf = requestAnimationFrame(animate);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, onScroll]);

  if (isMobile) {
    return (
      <div
        className="right-panel-container"
        style={{ width: "100%", left: "0", opacity: 1 }}
      >
        <Experience />
        <Projects />
        <TechnologiesSection />
        <Footer />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="right-panel-container"
      style={{
        width: panelWidth,
        left,
        opacity,
        overflowX: "auto",
        overflowY: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ display: "flex", minWidth: "max-content" }}>
        <Experience />
        <Projects />
        <TechnologiesSection />
        <Footer />
      </div>
    </div>
  );
}

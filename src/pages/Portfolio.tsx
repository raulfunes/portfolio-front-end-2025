import React, { useEffect, useRef, useState, useCallback } from "react";
import AboutMe from "./AboutMe";
import "./Portfolio.css"
import { ChevronsDown } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useDarkMode } from "../functions/useDarkMode";
import RightPanel from "./RightPanel";
import RetroParticles from "../components/RetroParticles";

const Portfolio: React.FC = () => {
  const threshold = 300; // Umbral para la transición
  const [scrollVal, setScrollVal] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const { isDark, toggle } = useDarkMode();

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Skip custom scroll handling on mobile
      if (isMobile) return;

      // Si aún no se completó la transición, siempre intervenimos
      if (scrollVal < threshold) {
        e.preventDefault();
        setScrollVal((prev) =>
          Math.max(0, Math.min(prev + e.deltaY, threshold))
        );
      } else if (e.deltaY < 0) {
          // Si ya se completó la transición (scrollVal === threshold):
          // Si el usuario scrollea hacia arriba y la sección de Experiencia está en su posición (scrollTop === 0),
          // entonces capturamos el evento para revertir la animación.
          const expElem = rightPanelRef.current;
          if (expElem && expElem.scrollTop === 0) {
            e.preventDefault();
            setScrollVal((prev) => Math.max(0, prev + e.deltaY));
          }
        // Si se scrollea hacia abajo, dejamos que la Experiencia maneje su scroll natural.
      }
    },
    [scrollVal, threshold, isMobile]
  );

  useEffect(() => {
    // Don't attach wheel handler on mobile
    if (isMobile) return;

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel, isMobile]);

  // Calculamos el ancho de About Me:
  // En móvil usamos 100% para ambos paneles (layout vertical)
  // scrollVal = 0 => 100vw; scrollVal = threshold => 40vw.
  const aboutWidth = isMobile ? 100 : (scrollVal < threshold ? 100 - (60 * scrollVal) / threshold : 40);
  const aboutWidthStr = isMobile ? "100%" : `${aboutWidth}vw`;
  // La sección Experiencia ocupará el complemento
  const rightPanelWidthStr = isMobile ? "100%" : `calc(100vw - ${aboutWidthStr})`;
  // La opacidad de Experiencia aumenta conforme se avanza la transición
  const rightPanelOpacity = isMobile ? 1 : (scrollVal < threshold ? scrollVal / threshold : 1);

  return (
    <div className={isDark? "portfolio-container dark" : "portfolio-container"}>

      <RetroParticles isDark={isDark} />
      <Navbar isDark={isDark} toggle={toggle}/>

      <AboutMe 
        aboutWidth={aboutWidth} 
        aboutWidthStr={aboutWidthStr} 
        thresholdReached={scrollVal !== threshold}/>

      <RightPanel 
        aboutWidthStr={aboutWidthStr} 
        rightPanelRef={rightPanelRef} 
        rightPanelWidthStr={rightPanelWidthStr} 
        rightPanelOpacity={rightPanelOpacity}
        overflowY={scrollVal === threshold ? "auto" : "hidden"} 
        thresholdReached={scrollVal !== threshold} />

      <div className="scroll-indicator" style={scrollVal !== 0 ? { opacity: 0, pointerEvents: "none" } : {}}>
        <div className="scroll-line" />
        <div className="scroll-label">
          <span>{'> '}Scroll</span>
          <ChevronsDown className="scroll-icon" size={20} color={isDark ? "white" : "black"} />
        </div>
        <div className="scroll-line" />
      </div>
    </div>
  );
};

export default Portfolio;

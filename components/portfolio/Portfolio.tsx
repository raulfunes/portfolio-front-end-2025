"use client";

import { useState, useCallback, useEffect } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { translations, type Locale } from "@/lib/translations";
import { RetroParticles } from "./RetroParticles";
import { Navbar } from "./Navbar";
import { AboutMe } from "./AboutMe";
import { RightPanel } from "./RightPanel";
import { ScrollIndicator } from "./ScrollIndicator";

const ABOUT_MIN_WIDTH_PX = 120;
const ABOUT_MAX_WIDTH_PERCENT = 50;

export function Portfolio() {
  const { isDark, toggle, mounted } = useDarkMode();
  const [locale, setLocale] = useState<Locale>("es");
  const [aboutWidth, setAboutWidth] = useState(ABOUT_MAX_WIDTH_PERCENT);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleScroll = useCallback((scroll: number) => {
    if (typeof window === "undefined") return;
    setScrollLeft(scroll);

    const viewportWidth = window.innerWidth;
    const minAboutWidthPercent = (ABOUT_MIN_WIDTH_PX / viewportWidth) * 100;
    const scrollFactor = Math.min(scroll / (viewportWidth * 0.5), 1);
    const newWidth =
      ABOUT_MAX_WIDTH_PERCENT -
      (ABOUT_MAX_WIDTH_PERCENT - minAboutWidthPercent) * scrollFactor;

    setAboutWidth(Math.max(minAboutWidthPercent, newWidth));
  }, []);

  const thresholdReached = aboutWidth > 20;
  const aboutWidthStr = isMobile ? "100%" : `${aboutWidth}%`;
  const panelWidth = isMobile ? "100%" : `${100 - aboutWidth}%`;
  const panelLeft = isMobile ? "0" : `${aboutWidth}%`;
  const panelOpacity = isMobile ? 1 : Math.min(1, scrollLeft / 100 + 0.3);

  const t = translations[locale];

  if (!mounted) {
    return (
      <div className="portfolio-container dark">
        <div className="about-me-container" style={{ width: "50%" }}>
          <div className="about-content">
            <div className="photo-wrapper" style={{ width: 125 }}>
              <div className="photo-glow" />
              <div className="about-photo" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`portfolio-container ${isDark ? "dark" : ""}`}>
      <RetroParticles isDark={isDark} />
      <Navbar
        isDark={isDark}
        toggle={toggle}
        locale={locale}
        onLocaleChange={(l) => setLocale(l as Locale)}
      />
      <AboutMe
        aboutWidth={aboutWidth}
        aboutWidthStr={aboutWidthStr}
        thresholdReached={thresholdReached}
        translations={t.about}
      />
      <RightPanel
        panelWidth={panelWidth}
        left={panelLeft}
        opacity={panelOpacity}
        onScroll={handleScroll}
      />
      {!isMobile && thresholdReached && scrollLeft < 50 && <ScrollIndicator />}
    </div>
  );
}

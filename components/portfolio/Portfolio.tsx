"use client";

import { useState, useEffect } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { translations, type Locale } from "@/lib/translations";
import { useProfile } from "@/hooks/use-portfolio-data";
import { RetroParticles } from "./RetroParticles";
import { Navbar } from "./Navbar";
import { AboutMe } from "./AboutMe";
import { RightPanel } from "./RightPanel";
import { FloatingEditButton } from "./FloatingEditButton";

export function Portfolio() {
  const { isDark, toggle, mounted } = useDarkMode();
  const { profile } = useProfile();
  const [locale, setLocale] = useState<Locale>("es");

  const t = translations[locale];

  const aboutTranslations = profile
    ? {
        title: profile.title || t.about.title,
        roles: profile.roles?.length ? profile.roles : t.about.roles,
        paragraph: profile.paragraph || t.about.paragraph,
      }
    : t.about;

  if (!mounted) {
    return (
      <div className="portfolio-container dark">
        <div className="about-me-container">
          <div className="about-content">
            <div className="photo-wrapper" style={{ width: 250 }}>
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
        translations={aboutTranslations}
        imageUrl={profile?.image_url ?? "/images/myself.jpg"}
        profile={profile}
      />
      <RightPanel locale={locale} />
      <FloatingEditButton />
    </div>
  );
}

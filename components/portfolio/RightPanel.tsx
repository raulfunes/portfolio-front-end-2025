"use client";

import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { TechnologiesSection } from "./Technologies";
import { Footer } from "./Footer";
import type { Locale } from "@/lib/types";

interface RightPanelProps {
  locale?: Locale;
}

export function RightPanel({ locale = "es" }: RightPanelProps) {
  return (
    <div className="right-panel-container">
      <Experience locale={locale} />
      <Projects locale={locale} />
      <TechnologiesSection locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { IconsComponent } from "./IconsComponent";
import { TypewriterText } from "./TypewriterText";
import { TerminalFrame } from "./TerminalFrame";
import { TechBadges } from "./TechBadges";
import { RotatingRole } from "./RotatingRole";
import type { Profile } from "@/lib/types";

interface AboutMeProps {
  translations: {
    title: string;
    roles: string[];
    paragraph: string;
  };
  imageUrl?: string;
  profile?: Profile | null;
}

export function AboutMe({
  translations,
  imageUrl = "/images/myself.jpg",
  profile,
}: AboutMeProps) {
  const [titleDone, setTitleDone] = useState(false);
  const [roleDone, setRoleDone] = useState(false);

  const handleTitleComplete = useCallback(() => setTitleDone(true), []);
  const handleFirstRoleComplete = useCallback(() => setRoleDone(true), []);

  return (
    <div className="about-me-container">
      <div className="about-content">
        <div style={{ width: 260 }} className="photo-wrapper">
          <div className="photo-glow" />
          <div className="about-photo">
            <Image
              src={imageUrl || "/images/myself.jpg"}
              alt={translations.title || "Profile"}
              width={300}
              height={300}
              priority
              unoptimized={imageUrl?.startsWith("http")}
            />
          </div>
        </div>

        <TerminalFrame className="terminal-area">
          <TypewriterText
            text={translations.title}
            as="h1"
            speed={50}
            delay={300}
            onComplete={handleTitleComplete}
          />
          <RotatingRole
            roles={translations.roles}
            as="h2"
            speed={45}
            pauseDuration={2200}
            initialDelay={titleDone ? 200 : 99999}
            onFirstComplete={handleFirstRoleComplete}
          />
          <p className={roleDone ? "hero-fade-in visible" : "hero-fade-in"}>
            {translations.paragraph}
          </p>
          <TechBadges
            className={roleDone ? "hero-fade-in visible" : "hero-fade-in"}
          />
          <div
            className={
              roleDone
                ? "terminal-contact-line hero-fade-in visible delay-1"
                : "terminal-contact-line hero-fade-in"
            }
          >
            <span className="terminal-prompt">$</span>
            <span className="terminal-cmd">contact</span>
            <span className="terminal-flag">--via</span>
            <IconsComponent className="icons-container-terminal" showName />
          </div>
        </TerminalFrame>
      </div>
    </div>
  );
}

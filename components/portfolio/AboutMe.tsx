"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { IconsComponent } from "./IconsComponent";
import { TypewriterText } from "./TypewriterText";
import { TerminalFrame } from "./TerminalFrame";
import { TechBadges } from "./TechBadges";
import { RotatingRole } from "./RotatingRole";

interface AboutMeProps {
  aboutWidth: number;
  aboutWidthStr: string;
  thresholdReached: boolean;
  translations: {
    title: string;
    roles: string[];
    paragraph: string;
  };
}

export function AboutMe({
  aboutWidth,
  aboutWidthStr,
  thresholdReached,
  translations,
}: AboutMeProps) {
  const [titleDone, setTitleDone] = useState(false);
  const [roleDone, setRoleDone] = useState(false);

  const handleTitleComplete = useCallback(() => setTitleDone(true), []);
  const handleFirstRoleComplete = useCallback(() => setRoleDone(true), []);

  const isCompact = !thresholdReached;

  return (
    <div
      style={{ width: aboutWidthStr }}
      className={
        thresholdReached ? "about-me-container" : "about-me-container threshold"
      }
    >
      <div
        className={
          thresholdReached ? "about-content" : "about-content threshold"
        }
      >
        <div style={{ width: aboutWidth * 2.5 }} className="photo-wrapper">
          <div className="photo-glow" />
          <div className="about-photo">
            <Image
              src="/images/myself.jpg"
              alt="Raul Funes"
              width={300}
              height={300}
              priority
            />
          </div>
        </div>

        <TerminalFrame
          className={isCompact ? "terminal-area terminal-compact" : "terminal-area"}
        >
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
            compact={isCompact}
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
            <IconsComponent
              className="icons-container-terminal"
              showName={thresholdReached}
            />
          </div>
        </TerminalFrame>
      </div>
    </div>
  );
}

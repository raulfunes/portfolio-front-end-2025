"use client";

import { useState, useEffect, useRef } from "react";

interface RotatingRoleProps {
  roles: string[];
  speed?: number;
  pauseDuration?: number;
  as?: "h2" | "h3" | "span";
  className?: string;
  initialDelay?: number;
  onFirstComplete?: () => void;
}

export function RotatingRole({
  roles,
  speed = 45,
  pauseDuration = 2000,
  as: Tag = "h2",
  className = "",
  initialDelay = 0,
  onFirstComplete,
}: RotatingRoleProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [cursorBlink, setCursorBlink] = useState(false);
  const [started, setStarted] = useState(false);
  const onFirstCompleteRef = useRef(onFirstComplete);
  const firstCompleteRef = useRef(false);

  useEffect(() => {
    onFirstCompleteRef.current = onFirstComplete;
  }, [onFirstComplete]);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const rolesRef = useRef(roles);
  useEffect(() => {
    rolesRef.current = roles;
  }, [roles]);

  useEffect(() => {
    if (!started || roles.length === 0) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    let roleIndex = 0;

    const typeRole = () => {
      if (cancelled) return;
      const currentRoles = rolesRef.current;
      const currentRole = currentRoles[roleIndex % currentRoles.length];
      let charIndex = 0;

      setShowCursor(true);
      setCursorBlink(false);

      interval = setInterval(() => {
        if (cancelled) {
          clearInterval(interval);
          return;
        }
        charIndex++;
        if (charIndex <= currentRole.length) {
          setDisplayedText(currentRole.slice(0, charIndex));
        } else {
          clearInterval(interval);

          if (!firstCompleteRef.current) {
            firstCompleteRef.current = true;
            onFirstCompleteRef.current?.();
          }

          setCursorBlink(true);
          timeout = setTimeout(() => {
            if (cancelled) return;
            setCursorBlink(false);
            eraseRole(currentRole);
          }, pauseDuration);
        }
      }, speed);
    };

    const eraseRole = (text: string) => {
      if (cancelled) return;
      let eraseIndex = text.length;

      interval = setInterval(() => {
        if (cancelled) {
          clearInterval(interval);
          return;
        }
        eraseIndex--;
        if (eraseIndex >= 0) {
          setDisplayedText(text.slice(0, eraseIndex));
        } else {
          clearInterval(interval);
          roleIndex++;
          timeout = setTimeout(() => {
            if (cancelled) return;
            typeRole();
          }, 300);
        }
      }, speed / 2);
    };

    typeRole();

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [started, speed, pauseDuration, roles.length]);

  if (!started) {
    return (
      <Tag className={`rotating-role ${className}`}>
        <span className="rotating-cursor blink">_</span>
      </Tag>
    );
  }

  return (
    <Tag className={`rotating-role ${className}`}>
      {displayedText}
      <span className={`rotating-cursor${cursorBlink ? " blink" : ""}`}>_</span>
    </Tag>
  );
}

import React, { useState, useEffect, useRef } from "react";
import "./RotatingRole.css";

interface RotatingRoleProps {
  roles: string[];
  speed?: number;
  pauseDuration?: number;
  as?: "h2" | "h3" | "span";
  className?: string;
  initialDelay?: number;
  onFirstComplete?: () => void;
}

const RotatingRole: React.FC<RotatingRoleProps> = ({
  roles,
  speed = 45,
  pauseDuration = 2000,
  as: Tag = "h2",
  className = "",
  initialDelay = 0,
  onFirstComplete,
}) => {
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

  // Stable ref for roles to avoid re-triggering the effect on every render
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

      // Type in
      interval = setInterval(() => {
        if (cancelled) { clearInterval(interval); return; }
        charIndex++;
        if (charIndex <= currentRole.length) {
          setDisplayedText(currentRole.slice(0, charIndex));
        } else {
          clearInterval(interval);

          // Fire onFirstComplete only once
          if (!firstCompleteRef.current) {
            firstCompleteRef.current = true;
            onFirstCompleteRef.current?.();
          }

          // Pause with blinking cursor
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
        if (cancelled) { clearInterval(interval); return; }
        eraseIndex--;
        if (eraseIndex >= 0) {
          setDisplayedText(text.slice(0, eraseIndex));
        } else {
          clearInterval(interval);
          roleIndex++;
          // Small pause before typing next role
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
    // Only re-run when started changes, not on every roles reference change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, speed, pauseDuration]);

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
};

export default RotatingRole;

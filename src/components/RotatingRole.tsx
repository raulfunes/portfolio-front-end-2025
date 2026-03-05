import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [isTyping, setIsTyping] = useState(true);
  const [started, setStarted] = useState(false);
  const roleIndexRef = useRef(0);
  const firstCompleteRef = useRef(false);
  const onFirstCompleteRef = useRef(onFirstComplete);

  useEffect(() => {
    onFirstCompleteRef.current = onFirstComplete;
  }, [onFirstComplete]);

  // Start after initial delay
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const animateRole = useCallback(() => {
    if (roles.length === 0) return;

    const currentRole = roles[roleIndexRef.current];
    let charIndex = 0;
    setIsTyping(true);

    // Type in
    const typeInterval = setInterval(() => {
      charIndex++;
      if (charIndex <= currentRole.length) {
        setDisplayedText(currentRole.slice(0, charIndex));
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);

        // Fire onFirstComplete only once after first role finishes typing
        if (!firstCompleteRef.current) {
          firstCompleteRef.current = true;
          onFirstCompleteRef.current?.();
        }

        // Pause, then erase
        setTimeout(() => {
          setIsTyping(true);
          let eraseIndex = currentRole.length;
          const eraseInterval = setInterval(() => {
            eraseIndex--;
            if (eraseIndex >= 0) {
              setDisplayedText(currentRole.slice(0, eraseIndex));
            } else {
              clearInterval(eraseInterval);
              roleIndexRef.current = (roleIndexRef.current + 1) % roles.length;
              // Small pause before typing next
              setTimeout(() => animateRole(), 300);
            }
          }, speed / 2);
        }, pauseDuration);
      }
    }, speed);
  }, [roles, speed, pauseDuration]);

  useEffect(() => {
    if (!started || roles.length === 0) return;
    animateRole();
  }, [started, animateRole]);

  if (!started) {
    return <Tag className={`rotating-role ${className}`}><span className="rotating-cursor">_</span></Tag>;
  }

  return (
    <Tag className={`rotating-role ${className}`}>
      {displayedText}
      {isTyping && <span className="rotating-cursor">_</span>}
      {!isTyping && <span className="rotating-cursor blink">_</span>}
    </Tag>
  );
};

export default RotatingRole;

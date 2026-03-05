"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 60,
  delay = 0,
  as: Tag = "span",
  className = "",
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(false);
    setIsDone(false);

    const delayTimer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setIsDone(true);
          onCompleteRef.current?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [text, speed, delay]);

  return (
    <Tag className={`typewriter-text ${className}`}>
      {displayedText}
      {(isTyping || !isDone) && <span className="typewriter-cursor">_</span>}
    </Tag>
  );
}

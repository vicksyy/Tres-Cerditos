"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

interface StoryCaptionProps {
  text: string;
  className?: string;
  startDelay?: number;
}

export default function StoryCaption({ text, className = "", startDelay = 0.15 }: StoryCaptionProps) {
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const caption = captionRef.current;
    if (!caption) return;

    const section = caption.closest(".section");
    const target = section ?? caption;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={captionRef} className={`story-caption ${className}${isVisible ? " story-caption--animate" : ""}`.trim()}>
      {text.split("").map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className="story-caption-letter"
          style={{ "--letter-delay": `${startDelay + index * 0.06}s` } as CSSProperties}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </p>
  );
}

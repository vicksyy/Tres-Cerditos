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
  const words = text.trim().split(/\s+/);

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
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span
            className="story-caption-letter"
            style={{ "--letter-delay": `${startDelay + index * 0.11}s` } as CSSProperties}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

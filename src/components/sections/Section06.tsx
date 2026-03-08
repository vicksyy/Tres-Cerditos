"use client";

import { useEffect, useRef, useState } from "react";
import StoryCaption from "@/components/StoryCaption";

export default function Section06() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wolfSwapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wolfVisible, setWolfVisible] = useState(false);
  const [wolfChanged, setWolfChanged] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setWolfVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (wolfSwapTimeoutRef.current) clearTimeout(wolfSwapTimeoutRef.current);
    };
  }, []);

  const handleWolfClick = () => {
    setWolfChanged(true);

    if (wolfSwapTimeoutRef.current) clearTimeout(wolfSwapTimeoutRef.current);
    wolfSwapTimeoutRef.current = setTimeout(() => {
      setWolfChanged(false);
    }, 1500);
  };

  return (
    <section ref={sectionRef} className="section section--06">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section06/bg-section06.png')",
        }}
        aria-hidden="true"
      />
      <StoryCaption
        text="Entonces apareció el lobo feroz, hambriento y con ganas de soplar."
        className="story-caption--soft"
      />
      <div className="section-content section--06-content" role="group" aria-label="Escena 6">
        <img
          className={`section--06-wolf${wolfVisible ? " section--06-wolf--visible" : ""}`}
          src={wolfChanged ? "/img/Section06/wolf_mediumbody2.png" : "/img/Section06/wolf_mediumbody.png"}
          alt="Lobo en escena"
          onClick={handleWolfClick}
          draggable={false}
        />
      </div>
    </section>
  );
}

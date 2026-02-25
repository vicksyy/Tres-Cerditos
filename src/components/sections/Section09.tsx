"use client";

import { useEffect, useRef, useState } from "react";

export default function Section09() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [wolfVisible, setWolfVisible] = useState(false);

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

  return (
    <section ref={sectionRef} className="section section--09">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section09/bg-section09.png')",
        }}
        aria-hidden="true"
      />
      <div className="section-content section--09-content" role="group" aria-label="Escena 9">
        <div className={`section--09-wolf-stage${wolfVisible ? " section--09-wolf-stage--visible" : ""}`}>
          <img
            className="section--09-wolf-evil"
            src="/img/Section08/evil_wolf.png"
            alt="Lobo feroz acercandose"
            draggable={false}
          />
        </div>
        <img
          className="section--09-house"
          src="/img/Section09/brick_house_final.png"
          alt="Casa de ladrillo"
          draggable={false}
        />
      </div>
    </section>
  );
}

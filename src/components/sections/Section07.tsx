"use client";

import { useEffect, useRef, useState } from "react";

export default function Section07() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const destroyMotionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wolfVisible, setWolfVisible] = useState(false);
  const [sceneStep, setSceneStep] = useState(0);
  const [impactMotion, setImpactMotion] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
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
      if (destroyMotionTimeoutRef.current) clearTimeout(destroyMotionTimeoutRef.current);
    };
  }, []);

  const handleSceneClick = () => {
    if (destroyMotionTimeoutRef.current) clearTimeout(destroyMotionTimeoutRef.current);
    setSceneStep((prev) => (prev < 3 ? prev + 1 : prev));
    setImpactMotion(true);
    destroyMotionTimeoutRef.current = setTimeout(() => {
      setImpactMotion(false);
    }, 620);
  };

  const isBlowing = sceneStep >= 1;
  const wolfIsBlowing = sceneStep === 1;
  const hideHouse = sceneStep >= 2;
  const showPigSurprise = sceneStep === 2;
  const showPigRun = sceneStep >= 3;

  return (
    <section ref={sectionRef} className="section section--07">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section07/bg-section07og.png')",
        }}
        aria-hidden="true"
      />
      <div
        className="section-content section--07-content section--07-content--interactive"
        role="group"
        aria-label="Escena 7"
        onClick={handleSceneClick}
      >
        <div className={`section--07-wolf-stage${wolfVisible ? " section--07-wolf-stage--visible" : ""}`}>
          <img
            className={`section--07-wolf-evil${wolfIsBlowing ? " section--07-wolf-evil--hidden" : ""}`}
            src="/img/Section07/evil_wolf.png"
            alt="Lobo feroz acercandose"
            draggable={false}
          />
          <img
            className={`section--07-wolf-blowing${wolfIsBlowing ? " section--07-wolf-blowing--visible" : ""}`}
            src="/img/Section07/wolf_blowing.png"
            alt="Lobo soplando"
            draggable={false}
          />
        </div>
        <img
          className={`section--07-house${isBlowing ? " section--07-house--destroyed" : ""}${
            hideHouse ? " section--07-house--hidden" : ""
          }${impactMotion && sceneStep === 1 ? " section--07-house--impact" : ""
          }`}
          src={isBlowing ? "/img/Section07/destroyed_house.png" : "/img/Section07/straw_house.png"}
          alt="Casa de paja"
          draggable={false}
        />
        <img
          className={`section--07-pig-surprise${showPigSurprise ? " section--07-pig-surprise--visible" : ""}${
            impactMotion && sceneStep === 2 ? " section--07-pig-surprise--impact" : ""
          }`}
          src="/img/Section07/pig1_surprise.png"
          alt="Cerdito sorprendido"
          draggable={false}
        />
        <img
          className={`section--07-pig-run${showPigRun ? " section--07-pig-run--active" : ""}`}
          src="/img/Section07/pig1_run.png"
          alt="Cerdito corriendo"
          draggable={false}
        />
      </div>
    </section>
  );
}

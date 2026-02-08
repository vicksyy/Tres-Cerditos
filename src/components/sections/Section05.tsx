"use client";

import { useEffect, useRef, useState } from "react";

export default function Section05() {
  const [showWorkPig, setShowWorkPig] = useState(false);
  const [houseStep, setHouseStep] = useState(0);
  const [showDust, setShowDust] = useState(false);
  const [fadeInStep, setFadeInStep] = useState<number | null>(null);

  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dustTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBuildClick = () => {
    if (!showWorkPig || showDust || houseStep >= 3) {
      return;
    }

    const nextStep = houseStep + 1;
    setShowDust(true);

    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    if (dustTimeoutRef.current) clearTimeout(dustTimeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    revealTimeoutRef.current = setTimeout(() => {
      setHouseStep(nextStep);
      setFadeInStep(nextStep);
      fadeTimeoutRef.current = setTimeout(() => setFadeInStep(null), 700);
    }, 1200);

    dustTimeoutRef.current = setTimeout(() => {
      setShowDust(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
      if (dustTimeoutRef.current) clearTimeout(dustTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  return (
    <section className="section section--05">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section05/bg-section05.png')",
        }}
        aria-hidden="true"
      />
      <div className="section-content section--05-content" role="group" aria-label="Escena 5">
        <button
          type="button"
          className={`section--05-pig-trigger${showWorkPig ? " section--05-pig-trigger--hidden" : ""}`}
          aria-label="Cambiar cerdito"
          onClick={() => setShowWorkPig(true)}
        >
          <img
            className="section--05-pig-hi"
            src="/img/Section05/pig3_hi.png"
            alt="Cerdito 3 saludando"
            draggable={false}
          />
        </button>
        <img
          className={`section--05-pig-work${showWorkPig ? " section--05-pig-work--visible" : ""}`}
          src="/img/Section05/pig3_work.png"
          alt="Cerdito 3 trabajando"
          onClick={handleBuildClick}
          draggable={false}
        />
        <button
          type="button"
          className={`section--05-build-trigger${showWorkPig ? "" : " section--05-build-trigger--disabled"}`}
          onClick={handleBuildClick}
          aria-label="Construir casa de ladrillo"
        >
          <div className="section--05-house" aria-live="polite">
            {houseStep === 1 ? (
              <img
                className={`section--05-house-layer section--05-house-step1 section--05-house-layer--visible${
                  fadeInStep === 1 ? " section--05-house-layer--fade-in" : ""
                }`}
                src="/img/Section05/brick_house1.png"
                alt="Primera fase de la casa de ladrillo"
                draggable={false}
              />
            ) : null}
            {houseStep === 2 ? (
              <img
                className={`section--05-house-layer section--05-house-layer--visible${
                  fadeInStep === 2 ? " section--05-house-layer--fade-in" : ""
                }`}
                src="/img/Section05/brick_house2.png"
                alt="Segunda fase de la casa de ladrillo"
                draggable={false}
              />
            ) : null}
            {houseStep >= 3 ? (
              <img
                className={`section--05-house-layer section--05-house-layer--visible${
                  fadeInStep === 3 ? " section--05-house-layer--fade-in" : ""
                }`}
                src="/img/Section05/brick_house_final.png"
                alt="Casa de ladrillo terminada"
                draggable={false}
              />
            ) : null}
            {showDust ? (
              <div className="section--05-dust" aria-hidden="true">
                <img className="section--05-dust-img" src="/img/Section04/dust.png" alt="" draggable={false} />
              </div>
            ) : null}
          </div>
        </button>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export default function Section03() {
  const [houseStep, setHouseStep] = useState(0);
  const [showDust, setShowDust] = useState(false);
  const buildTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBuildClick = () => {
    if (houseStep === 0) {
      setHouseStep(1);
      return;
    }

    if (houseStep === 1 && !showDust) {
      setShowDust(true);
      if (buildTimeoutRef.current) {
        clearTimeout(buildTimeoutRef.current);
      }
      buildTimeoutRef.current = setTimeout(() => {
        setShowDust(false);
        setHouseStep(2);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (buildTimeoutRef.current) {
        clearTimeout(buildTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="section section--03">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section03/bg-section03.png')",
        }}
        aria-hidden="true"
      />
      <div className="section-content section--03-content" role="group" aria-label="Cerdito trabajando">
        <img
          className="section--03-pig-work"
          src="/img/Section03/pig1_work.png"
          alt="Cerdito 1 trabajando"
          draggable={false}
        />
        <img
          className="section--03-straw"
          src="/img/Section03/straw.png"
          alt="Paja"
          draggable={false}
        />
        <img
          className="section--03-straw-right"
          src="/img/Section03/straw.png"
          alt="Paja"
          draggable={false}
        />
        <button
          type="button"
          className="section--03-build-trigger"
          onClick={handleBuildClick}
          aria-label="Construir casa de paja"
        >
          <div className="section--03-house" aria-live="polite">
            {houseStep === 1 && !showDust ? (
              <img
                className="section--03-house-base section--03-house-layer section--03-house-layer--visible"
                src="/img/Section03/house_base.png"
                alt="Base de la casa"
                draggable={false}
              />
            ) : null}
            {houseStep >= 2 ? (
              <img
                className="section--03-house-final section--03-house-layer section--03-house-layer--visible"
                src="/img/Section03/straw_house.png"
                alt="Casa de paja terminada"
                draggable={false}
              />
            ) : null}
            {showDust ? (
              <div className="section--03-dust" aria-hidden="true">
                <img className="section--03-dust-img" src="/img/Section03/dust.png" alt="" draggable={false} />
              </div>
            ) : null}
          </div>
        </button>
      </div>
    </section>
  );
}

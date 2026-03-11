"use client";

import { useEffect, useRef, useState } from "react";
import StoryCaption from "@/components/StoryCaption";

interface Section05Props {
  effectsEnabled: boolean;
}

export default function Section05({ effectsEnabled }: Section05Props) {
  const [showWorkPig, setShowWorkPig] = useState(false);
  const [houseStep, setHouseStep] = useState(0);
  const [showDust, setShowDust] = useState(false);
  const [fadeInStep, setFadeInStep] = useState<number | null>(null);
  const [showHappyPig, setShowHappyPig] = useState(false);

  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dustTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const happyPigTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hammerSoundRef = useRef<HTMLAudioElement | null>(null);
  const sparkleSoundRef = useRef<HTMLAudioElement | null>(null);
  const pigOinkSoundRef = useRef<HTMLAudioElement | null>(null);

  const playHammerSound = () => {
    if (!effectsEnabled) return;
    if (!hammerSoundRef.current) {
      hammerSoundRef.current = new Audio("/sounds/Martilleo.mp3");
      hammerSoundRef.current.preload = "auto";
      hammerSoundRef.current.volume = 0.6;
    }
    hammerSoundRef.current.currentTime = 0;
    void hammerSoundRef.current.play().catch(() => {});
  };

  const playSparkleSound = () => {
    if (!effectsEnabled) return;
    if (!sparkleSoundRef.current) {
      sparkleSoundRef.current = new Audio("/sounds/sparkle.mp3");
      sparkleSoundRef.current.preload = "auto";
      sparkleSoundRef.current.volume = 0.7;
    }
    sparkleSoundRef.current.currentTime = 0;
    void sparkleSoundRef.current.play().catch(() => {});
  };

  const playPigOinkSound = () => {
    if (!effectsEnabled) return;
    if (!pigOinkSoundRef.current) {
      pigOinkSoundRef.current = new Audio("/sounds/pig_oink.mp3");
      pigOinkSoundRef.current.preload = "auto";
      pigOinkSoundRef.current.volume = 0.7;
    }
    pigOinkSoundRef.current.currentTime = 0;
    void pigOinkSoundRef.current.play().catch(() => {});
  };

  const handleStartScene = () => {
    if (!showWorkPig) {
      setShowWorkPig(true);
    }
  };

  const handleBuildClick = () => {
    if (!showWorkPig || showDust || houseStep >= 3) {
      return;
    }

    const nextStep = houseStep + 1;
    setShowDust(true);
    playHammerSound();
    if (houseStep === 0) {
      playPigOinkSound();
    }

    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    if (dustTimeoutRef.current) clearTimeout(dustTimeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    revealTimeoutRef.current = setTimeout(() => {
      setHouseStep(nextStep);
      setFadeInStep(nextStep);
      if (nextStep === 3) {
        playSparkleSound();
        setShowHappyPig(true);
      }
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
      if (happyPigTimeoutRef.current) clearTimeout(happyPigTimeoutRef.current);
      if (hammerSoundRef.current) {
        hammerSoundRef.current.pause();
        hammerSoundRef.current.currentTime = 0;
      }
      if (sparkleSoundRef.current) {
        sparkleSoundRef.current.pause();
        sparkleSoundRef.current.currentTime = 0;
      }
      if (pigOinkSoundRef.current) {
        pigOinkSoundRef.current.pause();
        pigOinkSoundRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (effectsEnabled) return;
    if (hammerSoundRef.current) {
      hammerSoundRef.current.pause();
      hammerSoundRef.current.currentTime = 0;
    }
    if (sparkleSoundRef.current) {
      sparkleSoundRef.current.pause();
      sparkleSoundRef.current.currentTime = 0;
    }
    if (pigOinkSoundRef.current) {
      pigOinkSoundRef.current.pause();
      pigOinkSoundRef.current.currentTime = 0;
    }
  }, [effectsEnabled]);

  return (
    <section className="section section--05" data-story-complete={houseStep >= 3 ? "true" : "false"}>
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section05/bg-section05.png')",
        }}
        aria-hidden="true"
      />
      <StoryCaption
        text="El tercero, paciente y fuerte, construyó una casa de ladrillo."
        className="story-caption--soft"
      />
      <div
        className="section-content section--05-content"
        role="group"
        aria-label="Escena 5"
        onPointerDown={handleStartScene}
      >
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
          className={`section--05-pig-work${
            showWorkPig && !showHappyPig ? " section--05-pig-work--visible" : ""
          }`}
          src="/img/Section05/pig3_work.png"
          alt="Cerdito 3 trabajando"
          onClick={handleBuildClick}
          draggable={false}
        />
        <img
          className={`section--05-pig-happy${showHappyPig ? " section--05-pig-happy--visible" : ""}`}
          src="/img/Section05/pig3_happy.png"
          alt="Cerdito 3 feliz"
          draggable={false}
        />
        <button
          type="button"
          className={`section--05-build-trigger${showWorkPig ? "" : " section--05-build-trigger--disabled"}`}
          onClick={handleBuildClick}
          aria-label="Construir casa de ladrillo"
        >
          <span className="section--05-house" aria-live="polite">
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
              <span className="section--05-dust" aria-hidden="true">
                <img className="section--05-dust-img" src="/img/Section04/dust.png" alt="" draggable={false} />
              </span>
            ) : null}
          </span>
        </button>
      </div>
    </section>
  );
}

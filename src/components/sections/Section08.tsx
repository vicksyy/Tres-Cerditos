"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";

interface Section08Props {
  effectsEnabled: boolean;
}

export default function Section08({ effectsEnabled }: Section08Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const destroyMotionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wolfBlowSoundRef = useRef<HTMLAudioElement | null>(null);
  const houseExplosionSoundRef = useRef<HTMLAudioElement | null>(null);
  const [wolfVisible, setWolfVisible] = useState(false);
  const [sceneStep, setSceneStep] = useState(0);
  const [impactMotion, setImpactMotion] = useState(false);

  const playWolfBlowSound = () => {
    if (!effectsEnabled) return;
    if (!wolfBlowSoundRef.current) {
      wolfBlowSoundRef.current = new Audio("/sounds/lobo-soplo.mp3");
      wolfBlowSoundRef.current.preload = "auto";
      wolfBlowSoundRef.current.volume = 0.75;
    }
    wolfBlowSoundRef.current.currentTime = 0;
    void wolfBlowSoundRef.current.play().catch(() => {});
  };

  const playHouseExplosionSound = () => {
    if (!effectsEnabled) return;
    if (!houseExplosionSoundRef.current) {
      houseExplosionSoundRef.current = new Audio("/sounds/casa-madera-explosion.mp3");
      houseExplosionSoundRef.current.preload = "auto";
      houseExplosionSoundRef.current.volume = 0.8;
    }
    houseExplosionSoundRef.current.currentTime = 0;
    void houseExplosionSoundRef.current.play().catch(() => {});
  };

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
      if (destroyMotionTimeoutRef.current) clearTimeout(destroyMotionTimeoutRef.current);
      if (wolfBlowSoundRef.current) {
        wolfBlowSoundRef.current.pause();
        wolfBlowSoundRef.current.currentTime = 0;
      }
      if (houseExplosionSoundRef.current) {
        houseExplosionSoundRef.current.pause();
        houseExplosionSoundRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (effectsEnabled) return;
    if (wolfBlowSoundRef.current) {
      wolfBlowSoundRef.current.pause();
      wolfBlowSoundRef.current.currentTime = 0;
    }
    if (houseExplosionSoundRef.current) {
      houseExplosionSoundRef.current.pause();
      houseExplosionSoundRef.current.currentTime = 0;
    }
  }, [effectsEnabled]);

  const handleSceneClick = () => {
    if (destroyMotionTimeoutRef.current) clearTimeout(destroyMotionTimeoutRef.current);
    setSceneStep((prev) => {
      const next = prev < 2 ? prev + 1 : prev;
      if (next === 1 && prev !== 1) {
        playWolfBlowSound();
        playHouseExplosionSound();
      }
      return next;
    });
    setImpactMotion(true);
    destroyMotionTimeoutRef.current = setTimeout(() => {
      setImpactMotion(false);
    }, 620);
  };

  const handleSurprisedPigsClick = (event: MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    if (sceneStep !== 2 || impactMotion) return;
    setSceneStep(3);
  };

  const isBlowing = sceneStep >= 1;
  const wolfIsBlowing = sceneStep === 1;
  const hideHouse = sceneStep >= 2;
  const showSurprisedPigs = sceneStep === 2;
  const showRunningPigs = sceneStep >= 3;

  return (
    <section ref={sectionRef} className="section section--08">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section08/bg-section08.png')",
        }}
        aria-hidden="true"
      />
      <div
        className="section-content section--08-content section--08-content--interactive"
        role="group"
        aria-label="Escena 8"
        onClick={handleSceneClick}
      >
        <div className={`section--08-wolf-stage${wolfVisible ? " section--08-wolf-stage--visible" : ""}`}>
          <img
            className={`section--08-wolf-evil${wolfIsBlowing ? " section--08-wolf-evil--hidden" : ""}`}
            src="/img/Section07/evil_wolf.png"
            alt="Lobo feroz acercandose"
            draggable={false}
          />
          <img
            className={`section--08-wolf-blowing${wolfIsBlowing ? " section--08-wolf-blowing--visible" : ""}`}
            src="/img/Section08/wolf_blowing.png"
            alt="Lobo soplando"
            draggable={false}
          />
        </div>
        <img
          className={`section--08-house${isBlowing ? " section--08-house--destroyed" : ""}${
            hideHouse ? " section--08-house--hidden" : ""
          }${impactMotion && sceneStep === 1 ? " section--08-house--impact" : ""
          }`}
          src={isBlowing ? "/img/Section08/wood_house_destroyed.png" : "/img/Section08/wood_house.png"}
          alt="Casa de madera"
          draggable={false}
        />
        <img
          className={`section--08-pigs-surprised${showSurprisedPigs ? " section--08-pigs-surprised--visible" : ""}${
            impactMotion && sceneStep === 2 ? " section--08-pigs-surprised--impact" : ""
          }`}
          src="/img/Section08/pig1_2_suprised.png"
          alt="Cerditos sorprendidos"
          onClick={handleSurprisedPigsClick}
          draggable={false}
        />
        <img
          className={`section--08-pigs-run${showRunningPigs ? " section--08-pigs-run--active" : ""}`}
          src="/img/Section08/pig1-2_run.png"
          alt="Cerditos corriendo"
          draggable={false}
        />
      </div>
    </section>
  );
}

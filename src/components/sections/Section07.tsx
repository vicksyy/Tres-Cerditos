"use client";

import { useEffect, useRef, useState } from "react";
import StoryCaption from "@/components/StoryCaption";

interface Section07Props {
  effectsEnabled: boolean;
}

export default function Section07({ effectsEnabled }: Section07Props) {
  const pigRunDurationMs = 2200;
  const pigRunFadeDurationMs = 1000;
  const sectionRef = useRef<HTMLElement | null>(null);
  const destroyMotionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wolfBlowSoundRef = useRef<HTMLAudioElement | null>(null);
  const houseExplosionSoundRef = useRef<HTMLAudioElement | null>(null);
  const runningSoundRef = useRef<HTMLAudioElement | null>(null);
  const runningFadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningFadeRafRef = useRef<number | null>(null);
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
      houseExplosionSoundRef.current = new Audio("/sounds/casa-paja-explosion.mp3");
      houseExplosionSoundRef.current.preload = "auto";
      houseExplosionSoundRef.current.volume = 0.8;
    }
    houseExplosionSoundRef.current.currentTime = 0;
    void houseExplosionSoundRef.current.play().catch(() => {});
  };

  const stopRunningSound = () => {
    if (runningFadeTimeoutRef.current) {
      clearTimeout(runningFadeTimeoutRef.current);
      runningFadeTimeoutRef.current = null;
    }
    if (runningFadeRafRef.current) {
      cancelAnimationFrame(runningFadeRafRef.current);
      runningFadeRafRef.current = null;
    }
    if (!runningSoundRef.current) return;
    runningSoundRef.current.pause();
    runningSoundRef.current.currentTime = 0;
    runningSoundRef.current.volume = 0.75;
  };

  const playRunningSound = () => {
    if (!effectsEnabled) return;
    if (!runningSoundRef.current) {
      runningSoundRef.current = new Audio("/sounds/running.mp3");
      runningSoundRef.current.preload = "auto";
      runningSoundRef.current.volume = 0.75;
    }

    const runningAudio = runningSoundRef.current;
    if (!runningAudio) return;

    stopRunningSound();

    const startPlayback = () => {
      const startFade = () => {
        const fadeStartTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - fadeStartTime) / pigRunFadeDurationMs, 1);
          runningAudio.volume = 0.75 * (1 - progress);

          if (progress < 1) {
            runningFadeRafRef.current = requestAnimationFrame(tick);
            return;
          }

          runningAudio.pause();
          runningAudio.currentTime = 0;
          runningAudio.volume = 0.75;
          runningFadeRafRef.current = null;
        };

        runningFadeRafRef.current = requestAnimationFrame(tick);
      };

      runningAudio.currentTime = 0;
      runningAudio.volume = 0.75;
      void runningAudio.play().catch(() => {});
      runningFadeTimeoutRef.current = setTimeout(startFade, pigRunDurationMs);
    };

    if (runningAudio.readyState >= 1) {
      startPlayback();
      return;
    }

    runningAudio.addEventListener("loadedmetadata", startPlayback, { once: true });
    runningAudio.load();
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
      stopRunningSound();
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
    stopRunningSound();
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
      const next = prev < 3 ? prev + 1 : prev;
      if (next === 1 && prev !== 1) {
        playWolfBlowSound();
        playHouseExplosionSound();
      }
      if (next === 3 && prev !== 3) {
        playRunningSound();
      }
      return next;
    });
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
    <section
      ref={sectionRef}
      className="section section--07"
      data-story-complete={sceneStep >= 3 ? "true" : "false"}
    >
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section07/bg-section07og.webp')",
        }}
        aria-hidden="true"
      />
      <StoryCaption text="Sopló la casa de paja... y el primer cerdito salió corriendo." className="story-caption--soft" />
      <div
        className="section-content section--07-content section--07-content--interactive"
        role="group"
        aria-label="Escena 7"
        onClick={handleSceneClick}
      >
        <div className={`section--07-wolf-stage${wolfVisible ? " section--07-wolf-stage--visible" : ""}`}>
          <img
            className={`section--07-wolf-evil${wolfIsBlowing ? " section--07-wolf-evil--hidden" : ""}`}
            src="/img/Section07/evil_wolf.webp"
            alt="Lobo feroz acercandose"
            draggable={false}
          />
          <img
            className={`section--07-wolf-blowing${wolfIsBlowing ? " section--07-wolf-blowing--visible" : ""}`}
            src="/img/Section07/wolf_blowing.webp"
            alt="Lobo soplando"
            draggable={false}
          />
        </div>
        <img
          className={`section--07-house${isBlowing ? " section--07-house--destroyed" : ""}${
            hideHouse ? " section--07-house--hidden" : ""
          }${impactMotion && sceneStep === 1 ? " section--07-house--impact" : ""
          }`}
          src={isBlowing ? "/img/Section07/destroyed_house.webp" : "/img/Section07/straw_house.webp"}
          alt="Casa de paja"
          draggable={false}
        />
        <img
          className={`section--07-pig-surprise${showPigSurprise ? " section--07-pig-surprise--visible" : ""}${
            impactMotion && sceneStep === 2 ? " section--07-pig-surprise--impact" : ""
          }`}
          src="/img/Section07/pig1_surprise.webp"
          alt="Cerdito sorprendido"
          draggable={false}
        />
        <img
          className={`section--07-pig-run${showPigRun ? " section--07-pig-run--active" : ""}`}
          src="/img/Section07/pig1_run.webp"
          alt="Cerdito corriendo"
          draggable={false}
        />
      </div>
    </section>
  );
}

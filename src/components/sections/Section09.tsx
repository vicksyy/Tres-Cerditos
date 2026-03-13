"use client";

import { useEffect, useRef, useState } from "react";
import StoryCaption from "@/components/StoryCaption";

interface Section09Props {
  effectsEnabled: boolean;
}

export default function Section09({ effectsEnabled }: Section09Props) {
  const wolfWalkDurationMs = 3400;
  const wolfWalkFadeDurationMs = 800;
  const wolfWalkPlaybackRate = 0.7;
  const sectionRef = useRef<HTMLElement | null>(null);
  const wolfBlowSoundRef = useRef<HTMLAudioElement | null>(null);
  const wolfTiredSoundRef = useRef<HTMLAudioElement | null>(null);
  const runningSoundRef = useRef<HTMLAudioElement | null>(null);
  const runningFadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningFadeRafRef = useRef<number | null>(null);
  const [wolfVisible, setWolfVisible] = useState(false);
  const [wolfPoseStep, setWolfPoseStep] = useState(0);
  const houseImpactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [houseImpactVariant, setHouseImpactVariant] = useState<0 | 1 | 2>(0);
  const [previewState, setPreviewState] = useState<"pending" | "visible" | "hiding" | "done">("pending");

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

  const playWolfTiredSound = () => {
    if (!effectsEnabled) return;
    if (!wolfTiredSoundRef.current) {
      wolfTiredSoundRef.current = new Audio("/sounds/lobo-cansado.mp3");
      wolfTiredSoundRef.current.preload = "auto";
      wolfTiredSoundRef.current.volume = 0.8;
    }
    wolfTiredSoundRef.current.currentTime = 0;
    void wolfTiredSoundRef.current.play().catch(() => {});
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
    runningSoundRef.current.volume = 0.7;
    runningSoundRef.current.playbackRate = wolfWalkPlaybackRate;
  };

  const playRunningSound = () => {
    if (!effectsEnabled) return;
    if (!runningSoundRef.current) {
      runningSoundRef.current = new Audio("/sounds/running.mp3");
      runningSoundRef.current.preload = "auto";
      runningSoundRef.current.volume = 0.7;
      runningSoundRef.current.playbackRate = wolfWalkPlaybackRate;
    }

    const runningAudio = runningSoundRef.current;
    if (!runningAudio) return;

    stopRunningSound();

    const startPlayback = () => {
      const startFade = () => {
        const fadeStartTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - fadeStartTime) / wolfWalkFadeDurationMs, 1);
          runningAudio.volume = 0.7 * (1 - progress);

          if (progress < 1) {
            runningFadeRafRef.current = requestAnimationFrame(tick);
            return;
          }

          runningAudio.pause();
          runningAudio.currentTime = 0;
          runningAudio.volume = 0.7;
          runningAudio.playbackRate = wolfWalkPlaybackRate;
          runningFadeRafRef.current = null;
        };

        runningFadeRafRef.current = requestAnimationFrame(tick);
      };

      runningAudio.currentTime = 0;
      runningAudio.volume = 0.7;
      runningAudio.playbackRate = wolfWalkPlaybackRate;
      void runningAudio.play().catch(() => {});
      runningFadeTimeoutRef.current = setTimeout(startFade, wolfWalkDurationMs);
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
      if (houseImpactTimeoutRef.current) clearTimeout(houseImpactTimeoutRef.current);
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
      stopRunningSound();
      if (wolfBlowSoundRef.current) {
        wolfBlowSoundRef.current.pause();
        wolfBlowSoundRef.current.currentTime = 0;
      }
      if (wolfTiredSoundRef.current) {
        wolfTiredSoundRef.current.pause();
        wolfTiredSoundRef.current.currentTime = 0;
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
    if (wolfTiredSoundRef.current) {
      wolfTiredSoundRef.current.pause();
      wolfTiredSoundRef.current.currentTime = 0;
    }
  }, [effectsEnabled]);

  const handleSceneClick = () => {
    if (!wolfVisible) return;

    if (previewState === "pending") {
      setPreviewState("visible");
      return;
    }

    if (previewState === "visible") {
      setPreviewState("hiding");
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = setTimeout(() => {
        setPreviewState("done");
      }, 520);
      return;
    }

    if (previewState === "hiding") {
      return;
    }

    setWolfPoseStep((prev) => {
      if (prev >= 4) return prev;
      const next = prev + 1;
      if (next === 1 || next === 2) {
        playWolfBlowSound();
      }
      if (next === 3 || next === 4) {
        playWolfTiredSound();
      }
      if (next === 4 && prev !== 4) {
        playRunningSound();
      }
      if (next < 4) {
        setHouseImpactVariant((variant) => (variant === 1 ? 2 : 1));
        if (houseImpactTimeoutRef.current) clearTimeout(houseImpactTimeoutRef.current);
        houseImpactTimeoutRef.current = setTimeout(() => {
          setHouseImpactVariant(0);
        }, 340);
      }
      return next;
    });
  };

  const wolfPoses = [
    { src: "/img/Section08/evil_wolf.png", alt: "Lobo feroz acercandose" },
    { src: "/img/Section09/wolf_blowing_1.png", alt: "Lobo soplando fuerte" },
    { src: "/img/Section09/wolf_blowing_3.png", alt: "Lobo soplando de nuevo" },
    { src: "/img/Section09/wolf_tired.png", alt: "Lobo cansado" },
    { src: "/img/Section09/wolf_walking.png", alt: "Lobo caminando" },
  ];

  return (
    <section
      ref={sectionRef}
      className="section section--09"
      data-story-complete={wolfPoseStep >= 4 && previewState === "done" ? "true" : "false"}
    >
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section09/bg-section09.png')",
        }}
        aria-hidden="true"
      />
      <StoryCaption
        text="Pero la casa de ladrillo resistió. El lobo sopló y sopló sin lograr nada."
        className="story-caption--soft"
      />
      <div
        className="section-content section--09-content section--09-content--interactive"
        role="group"
        aria-label="Escena 9"
        onClick={handleSceneClick}
      >
        <div className={`section--09-wolf-stage${wolfVisible ? " section--09-wolf-stage--visible" : ""}`}>
          {wolfPoses.map((pose, index) => (
            <img
              key={pose.src}
              className={`section--09-wolf-img${index === wolfPoseStep ? " section--09-wolf-img--visible" : ""}${
                index === 4 && wolfPoseStep === 4 ? " section--09-wolf-img--walking-out" : ""
              }`}
              src={pose.src}
              alt={pose.alt}
              aria-hidden={index !== wolfPoseStep}
              draggable={false}
            />
          ))}
        </div>
        <img
          className={`section--09-house${
            houseImpactVariant === 1
              ? " section--09-house--impact-a"
              : houseImpactVariant === 2
              ? " section--09-house--impact-b"
              : ""
          }`}
          src="/img/Section09/brick_house_final.png"
          alt="Casa de ladrillo"
          draggable={false}
        />
        {previewState !== "done" ? (
          <img
            className={`section--09-preview${
              previewState === "visible" ? " section--09-preview--visible" : ""
            }${previewState === "hiding" ? " section--09-preview--hiding" : ""}`}
            src="/img/Section09/pigs_scared.png"
            alt="Cerditos asustados dentro de la casa"
            draggable={false}
          />
        ) : null}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

interface Section09Props {
  effectsEnabled: boolean;
}

export default function Section09({ effectsEnabled }: Section09Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wolfBlowSoundRef = useRef<HTMLAudioElement | null>(null);
  const wolfTiredSoundRef = useRef<HTMLAudioElement | null>(null);
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
    <section ref={sectionRef} className="section section--09">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section09/bg-section09.png')",
        }}
        aria-hidden="true"
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

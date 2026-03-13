"use client";

import { useEffect, useRef, useState } from "react";
import StoryCaption from "@/components/StoryCaption";

type Section06Props = {
  effectsEnabled: boolean;
};

export default function Section06({ effectsEnabled }: Section06Props) {
  const laughStartTime = 3.5;
  const laughEndTime = 5.3;
  const laughPlaybackRate = 1.14;
  const howlDurationMs = 3000;
  const howlBaseVolume = 0.75;
  const sectionRef = useRef<HTMLElement | null>(null);
  const wolfSwapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const laughStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const evilLaughSoundRef = useRef<HTMLAudioElement | null>(null);
  const howlSoundRef = useRef<HTMLAudioElement | null>(null);
  const howlFadeRafRef = useRef<number | null>(null);
  const [wolfVisible, setWolfVisible] = useState(false);
  const [wolfChanged, setWolfChanged] = useState(false);

  const stopHowl = () => {
    if (howlFadeRafRef.current) {
      cancelAnimationFrame(howlFadeRafRef.current);
      howlFadeRafRef.current = null;
    }
    if (!howlSoundRef.current) return;
    howlSoundRef.current.pause();
    howlSoundRef.current.currentTime = 0;
    howlSoundRef.current.volume = howlBaseVolume;
  };

  const playHowl = () => {
    if (!effectsEnabled) return;

    if (!howlSoundRef.current) {
      howlSoundRef.current = new Audio("/sounds/howl-wolf.mp3");
      howlSoundRef.current.preload = "auto";
      howlSoundRef.current.volume = howlBaseVolume;
    }

    const howlAudio = howlSoundRef.current;
    if (!howlAudio) return;

    stopHowl();

    const startPlayback = () => {
      const startTime = performance.now();
      howlAudio.currentTime = 0;
      howlAudio.volume = howlBaseVolume;
      void howlAudio.play().catch(() => {});

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / howlDurationMs, 1);
        howlAudio.volume = howlBaseVolume * (1 - progress);

        if (progress < 1) {
          howlFadeRafRef.current = requestAnimationFrame(tick);
          return;
        }

        howlAudio.pause();
        howlAudio.currentTime = 0;
        howlAudio.volume = howlBaseVolume;
        howlFadeRafRef.current = null;
      };

      howlFadeRafRef.current = requestAnimationFrame(tick);
    };

    if (howlAudio.readyState >= 1) {
      startPlayback();
      return;
    }

    howlAudio.addEventListener("loadedmetadata", startPlayback, { once: true });
    howlAudio.load();
  };

  const playEvilLaugh = () => {
    if (!effectsEnabled) return;

    if (!evilLaughSoundRef.current) {
      evilLaughSoundRef.current = new Audio("/sounds/evil-laugh.mp3");
      evilLaughSoundRef.current.preload = "auto";
      evilLaughSoundRef.current.volume = howlBaseVolume;
      evilLaughSoundRef.current.playbackRate = laughPlaybackRate;
    }

    const laughAudio = evilLaughSoundRef.current;
    if (!laughAudio) return;

    laughAudio.pause();
    laughAudio.playbackRate = laughPlaybackRate;
    if (laughStopTimeoutRef.current) clearTimeout(laughStopTimeoutRef.current);

    const startPlayback = () => {
      laughAudio.currentTime = laughStartTime;
      void laughAudio.play().catch(() => {});
      laughStopTimeoutRef.current = setTimeout(() => {
        laughAudio.pause();
        laughAudio.currentTime = laughStartTime;
      }, (laughEndTime - laughStartTime) * 1000);
    };

    if (laughAudio.readyState >= 1) {
      startPlayback();
      return;
    }

    laughAudio.addEventListener("loadedmetadata", startPlayback, { once: true });
    laughAudio.load();
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
          playHowl();
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (effectsEnabled) return;
    stopHowl();
    if (!evilLaughSoundRef.current) return;
    if (laughStopTimeoutRef.current) clearTimeout(laughStopTimeoutRef.current);
    evilLaughSoundRef.current.pause();
    evilLaughSoundRef.current.currentTime = 0;
  }, [effectsEnabled]);

  useEffect(() => {
    return () => {
      if (wolfSwapTimeoutRef.current) clearTimeout(wolfSwapTimeoutRef.current);
      if (laughStopTimeoutRef.current) clearTimeout(laughStopTimeoutRef.current);
      stopHowl();
      if (evilLaughSoundRef.current) {
        evilLaughSoundRef.current.pause();
        evilLaughSoundRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleWolfClick = () => {
    setWolfChanged(true);
    playEvilLaugh();

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
          backgroundImage: "url('/img/Section06/bg-section06.webp')",
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
          src={wolfChanged ? "/img/Section06/wolf_mediumbody2.webp" : "/img/Section06/wolf_mediumbody.webp"}
          alt="Lobo en escena"
          onClick={handleWolfClick}
          draggable={false}
        />
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import Section01 from "@/components/sections/Section01";
import Section02 from "@/components/sections/Section02";
import Section03 from "@/components/sections/Section03";
import Section04 from "@/components/sections/Section04";
import Section05 from "@/components/sections/Section05";
import Section06 from "@/components/sections/Section06";
import Section07 from "@/components/sections/Section07";
import Section08 from "@/components/sections/Section08";
import Section09 from "@/components/sections/Section09";
import Section10 from "@/components/sections/Section10";

export default function HomeClient() {
  const mainRef = useRef<HTMLElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioStoppedRef = useRef(false);
  const musicEnabledRef = useRef(true);
  const baseVolumeRef = useRef(1);
  const loopTransitioningRef = useRef(false);
  const loopMonitorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isEffectsEnabled, setIsEffectsEnabled] = useState(true);
  const [isMusicLocked, setIsMusicLocked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const match = /^(?:Digit|Numpad)([1-9])$/.exec(event.code);
      const keyNumber = match ? Number(match[1]) : null;
      if (!keyNumber) return;

      const main = mainRef.current;
      if (!main) return;

      const sections = main.querySelectorAll<HTMLElement>(".section");
      const section = sections[keyNumber - 1];
      if (!section) return;

      event.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;

    const clearFade = () => {
      if (fadeRafRef.current) {
        cancelAnimationFrame(fadeRafRef.current);
        fadeRafRef.current = null;
      }
    };

    const fadeTo = (targetVolume: number, durationMs: number, onComplete?: () => void) => {
      clearFade();
      const startVolume = audio.volume;
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / durationMs, 1);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;

        if (progress < 1) {
          fadeRafRef.current = requestAnimationFrame(tick);
          return;
        }

        fadeRafRef.current = null;
        if (onComplete) onComplete();
      };

      fadeRafRef.current = requestAnimationFrame(tick);
    };

    const softLoop = () => {
      if (bgAudioStoppedRef.current || !musicEnabledRef.current || loopTransitioningRef.current) return;
      loopTransitioningRef.current = true;

      fadeTo(0, 420, () => {
        if (bgAudioStoppedRef.current) {
          loopTransitioningRef.current = false;
          return;
        }

        audio.currentTime = 0;
        void audio.play().catch(() => {
          loopTransitioningRef.current = false;
        });

        fadeTo(baseVolumeRef.current, 700, () => {
          loopTransitioningRef.current = false;
        });
      });
    };

    audio.volume = baseVolumeRef.current;

    const tryPlay = () => {
      if (bgAudioStoppedRef.current || !musicEnabledRef.current) return;
      void audio.play().catch(() => {
        // Some browsers block autoplay with sound until user interaction.
      });
    };

    const handleEnded = () => {
      if (bgAudioStoppedRef.current || !musicEnabledRef.current) return;
      softLoop();
    };

    loopMonitorIntervalRef.current = setInterval(() => {
      if (bgAudioStoppedRef.current || !musicEnabledRef.current || audio.paused || loopTransitioningRef.current) {
        return;
      }
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

      const timeLeft = audio.duration - audio.currentTime;
      if (timeLeft <= 0.55) {
        softLoop();
      }
    }, 120);

    audio.addEventListener("ended", handleEnded);

    tryPlay();

    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };

    window.addEventListener("pointerdown", onFirstInteraction, { passive: true });
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });

    return () => {
      audio.removeEventListener("ended", handleEnded);
      if (loopMonitorIntervalRef.current) {
        clearInterval(loopMonitorIntervalRef.current);
        loopMonitorIntervalRef.current = null;
      }
      clearFade();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    musicEnabledRef.current = isMusicEnabled;

    const audio = bgAudioRef.current;
    if (!audio || bgAudioStoppedRef.current) return;

    if (isMusicEnabled) {
      audio.volume = baseVolumeRef.current;
      void audio.play().catch(() => {});
      return;
    }

    audio.pause();
  }, [isMusicEnabled]);

  useEffect(() => {
    const main = mainRef.current;
    const audio = bgAudioRef.current;
    if (!main || !audio) return;

    const section06 = main.querySelector<HTMLElement>(".section--06");
    if (!section06) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        bgAudioStoppedRef.current = true;
        audio.pause();
        audio.currentTime = 0;
        setIsMusicEnabled(false);
        setIsMusicLocked(true);
        if (loopMonitorIntervalRef.current) {
          clearInterval(loopMonitorIntervalRef.current);
          loopMonitorIntervalRef.current = null;
        }
        if (fadeRafRef.current) {
          cancelAnimationFrame(fadeRafRef.current);
          fadeRafRef.current = null;
        }
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(section06);
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={mainRef} className="main">
      <div className="audio-controls" role="group" aria-label="Controles de audio">
        <button
          type="button"
          className={`audio-control-btn${!isMusicEnabled ? " audio-control-btn--off" : ""}`}
          data-tooltip="Música"
          aria-label={isMusicEnabled ? "Desactivar musica de fondo" : "Activar musica de fondo"}
          title="Música"
          aria-pressed={isMusicEnabled}
          onClick={() => {
            if (isMusicLocked) return;
            setIsMusicEnabled((prev) => !prev);
          }}
          disabled={isMusicLocked}
        >
          {isMusicEnabled ? <Volume2 size={20} strokeWidth={2} /> : <VolumeX size={20} strokeWidth={2} />}
        </button>

        <button
          type="button"
          className={`audio-control-btn${!isEffectsEnabled ? " audio-control-btn--off" : ""}`}
          data-tooltip={"Efectos\nde sonido"}
          aria-label={isEffectsEnabled ? "Desactivar efectos de sonido" : "Activar efectos de sonido"}
          title="Efectos de sonido"
          aria-pressed={isEffectsEnabled}
          onClick={() => setIsEffectsEnabled((prev) => !prev)}
        >
          {isEffectsEnabled ? <Bell size={20} strokeWidth={2} /> : <BellOff size={20} strokeWidth={2} />}
        </button>
      </div>

      <audio ref={bgAudioRef} src="/sounds/musica-cuento-infantil-fondo.mp3" preload="auto" />
      <Section01 effectsEnabled={isEffectsEnabled} />
      <Section02 effectsEnabled={isEffectsEnabled} />
      <Section03 effectsEnabled={isEffectsEnabled} />
      <Section04 effectsEnabled={isEffectsEnabled} />
      <Section05 effectsEnabled={isEffectsEnabled} />
      <Section06 />
      <Section07 />
      <Section08 />
      <Section09 />
      <Section10 />
    </main>
  );
}

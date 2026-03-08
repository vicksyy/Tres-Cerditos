"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
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
  const storyAudioRef = useRef<HTMLAudioElement | null>(null);
  const dramaAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicEnabledRef = useRef(true);
  const isDramaSectionRef = useRef(false);
  const prevDramaSectionRef = useRef(false);
  const baseVolumeRef = useRef(1);
  const crossfadeRafRef = useRef<number | null>(null);
  const storyHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isEffectsEnabled, setIsEffectsEnabled] = useState(true);
  const [isDramaSection, setIsDramaSection] = useState(false);
  const [isIntroLocked, setIsIntroLocked] = useState(true);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [showStoryHint, setShowStoryHint] = useState(false);

  const clearStoryHintTimer = () => {
    if (storyHintTimeoutRef.current) {
      clearTimeout(storyHintTimeoutRef.current);
      storyHintTimeoutRef.current = null;
    }
  };

  const restartStoryHintTimer = (sectionIndex: number) => {
    clearStoryHintTimer();
    if (isIntroLocked || sectionIndex < 2) {
      setShowStoryHint(false);
      return;
    }
    setShowStoryHint(false);
    storyHintTimeoutRef.current = setTimeout(() => {
      setShowStoryHint(true);
    }, 2000);
  };

  const isStoryProgressClick = (target: HTMLElement, sectionIndex: number) => {
    if (sectionIndex === 2) return Boolean(target.closest(".section--03-build-trigger"));
    if (sectionIndex === 3) return Boolean(target.closest(".section--04-build-trigger"));
    if (sectionIndex === 4) return Boolean(target.closest(".section--05-content"));
    if (sectionIndex === 5) return Boolean(target.closest(".section--06-wolf"));
    if (sectionIndex === 6) return Boolean(target.closest(".section--07-content--interactive"));
    if (sectionIndex === 7)
      return Boolean(target.closest(".section--08-content--interactive, .section--08-pigs-surprised"));
    if (sectionIndex === 8) return Boolean(target.closest(".section--09-content--interactive"));
    if (sectionIndex === 9) return Boolean(target.closest(".section--10-content--interactive"));
    return false;
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsIntroLocked(false);
    }, 4400);

    return () => window.clearTimeout(timeoutId);
  }, []);

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
      if (isIntroLocked && keyNumber !== 1) return;

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
  }, [isIntroLocked]);

  useEffect(() => {
    const storyAudio = storyAudioRef.current;
    const dramaAudio = dramaAudioRef.current;
    if (!storyAudio || !dramaAudio) return;

    storyAudio.volume = baseVolumeRef.current;
    dramaAudio.volume = baseVolumeRef.current;

    const tryPlayCurrent = () => {
      if (!musicEnabledRef.current) return;
      const active = isDramaSectionRef.current ? dramaAudio : storyAudio;
      void active.play().catch(() => {
        // Some browsers block autoplay with sound until user interaction.
      });
    };

    tryPlayCurrent();

    const onFirstInteraction = () => {
      tryPlayCurrent();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };

    window.addEventListener("pointerdown", onFirstInteraction, { passive: true });
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });

    return () => {
      if (crossfadeRafRef.current) {
        cancelAnimationFrame(crossfadeRafRef.current);
        crossfadeRafRef.current = null;
      }
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    isDramaSectionRef.current = isDramaSection;
  }, [isDramaSection]);

  useEffect(() => {
    musicEnabledRef.current = isMusicEnabled;

    const storyAudio = storyAudioRef.current;
    const dramaAudio = dramaAudioRef.current;
    if (!storyAudio || !dramaAudio) return;

    const stopCrossfade = () => {
      if (crossfadeRafRef.current) {
        cancelAnimationFrame(crossfadeRafRef.current);
        crossfadeRafRef.current = null;
      }
    };

    const crossfade = (fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement, durationMs: number) => {
      stopCrossfade();
      const fromStartVolume = Math.max(0, Math.min(1, fromAudio.volume));
      const toTargetVolume = Math.max(0, Math.min(1, baseVolumeRef.current));
      const startTime = performance.now();

      toAudio.volume = 0;
      toAudio.currentTime = 0;
      void toAudio.play().catch(() => {});

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / durationMs, 1);
        fromAudio.volume = fromStartVolume * (1 - progress);
        toAudio.volume = toTargetVolume * progress;

        if (progress < 1) {
          crossfadeRafRef.current = requestAnimationFrame(tick);
          return;
        }

        fromAudio.pause();
        fromAudio.volume = toTargetVolume;
        toAudio.volume = toTargetVolume;
        crossfadeRafRef.current = null;
      };

      crossfadeRafRef.current = requestAnimationFrame(tick);
    };

    if (!isMusicEnabled) {
      stopCrossfade();
      storyAudio.pause();
      dramaAudio.pause();
      storyAudio.volume = baseVolumeRef.current;
      dramaAudio.volume = baseVolumeRef.current;
      return;
    }

    const active = isDramaSection ? dramaAudio : storyAudio;
    const inactive = isDramaSection ? storyAudio : dramaAudio;
    const changedSection = prevDramaSectionRef.current !== isDramaSection;
    prevDramaSectionRef.current = isDramaSection;

    if (changedSection) {
      crossfade(inactive, active, 800);
      return;
    }

    stopCrossfade();
    inactive.pause();
    inactive.volume = baseVolumeRef.current;
    active.volume = baseVolumeRef.current;
    void active.play().catch(() => {});
  }, [isMusicEnabled, isDramaSection]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const sections = Array.from(main.querySelectorAll<HTMLElement>(".section"));
    if (sections.length === 0) return;

    let rafId = 0;

    const updateFromScroll = () => {
      rafId = 0;
      const top = main.getBoundingClientRect().top;
      let closestIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, index) => {
        const distance = Math.abs(section.getBoundingClientRect().top - top);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveSectionIndex(closestIndex);
      // section indices: 0..9 => drama in 06..09 => indices 5..8
      setIsDramaSection(closestIndex >= 5 && closestIndex <= 8);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    main.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      main.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!isIntroLocked) return;
    const main = mainRef.current;
    if (!main) return;
    main.scrollTo({ top: 0, behavior: "auto" });
  }, [isIntroLocked]);

  useEffect(() => {
    restartStoryHintTimer(activeSectionIndex);
  }, [activeSectionIndex, isIntroLocked]);

  useEffect(() => {
    return () => {
      clearStoryHintTimer();
    };
  }, []);

  const handleMainClickCapture = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const main = mainRef.current;
    if (!main) return;

    const section = target.closest<HTMLElement>(".section");
    if (!section) return;

    const sections = Array.from(main.querySelectorAll<HTMLElement>(".section"));
    const sectionIndex = sections.indexOf(section);
    if (sectionIndex < 2) return;
    if (!isStoryProgressClick(target, sectionIndex)) return;

    restartStoryHintTimer(sectionIndex);
  };

  return (
    <main
      ref={mainRef}
      className={`main${isIntroLocked ? " main--intro-lock" : ""}`}
      onClickCapture={handleMainClickCapture}
    >
      <div className="audio-controls" role="group" aria-label="Controles de audio">
        <button
          type="button"
          className={`audio-control-btn${!isMusicEnabled ? " audio-control-btn--off" : ""}`}
          data-tooltip="Música"
          aria-label={isMusicEnabled ? "Desactivar musica de fondo" : "Activar musica de fondo"}
          title="Música"
          aria-pressed={isMusicEnabled}
          onClick={() => setIsMusicEnabled((prev) => !prev)}
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
      {showStoryHint ? <p className="story-hint">Haz click para continuar la historia</p> : null}

      <audio ref={storyAudioRef} src="/sounds/musica-cuento-infantil-fondo.mp3" preload="auto" loop />
      <audio ref={dramaAudioRef} src="/sounds/drama-fondo.mp3" preload="auto" loop />
      <Section01 effectsEnabled={isEffectsEnabled} />
      <Section02 effectsEnabled={isEffectsEnabled} />
      <Section03 effectsEnabled={isEffectsEnabled} />
      <Section04 effectsEnabled={isEffectsEnabled} />
      <Section05 effectsEnabled={isEffectsEnabled} />
      <Section06 />
      <Section07 effectsEnabled={isEffectsEnabled} />
      <Section08 effectsEnabled={isEffectsEnabled} />
      <Section09 effectsEnabled={isEffectsEnabled} />
      <Section10 />
    </main>
  );
}

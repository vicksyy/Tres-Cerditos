"use client";

import { useEffect, useRef, useState } from "react";
import StoryCaption from "@/components/StoryCaption";

interface Section04Props {
  effectsEnabled: boolean;
}

export default function Section04({ effectsEnabled }: Section04Props) {
  const [houseStep, setHouseStep] = useState(0);
  const [showDust, setShowDust] = useState(false);
  const [fadeInStep, setFadeInStep] = useState<number | null>(null);
  const [workingOnLeft, setWorkingOnLeft] = useState(false);
  const [switchingWorkingSide, setSwitchingWorkingSide] = useState(false);
  const [hammerTick, setHammerTick] = useState(0);
  const [nailTick, setNailTick] = useState(0);

  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dustTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const workingSwitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hammerSoundRef = useRef<HTMLAudioElement | null>(null);
  const sparkleSoundRef = useRef<HTMLAudioElement | null>(null);

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

  const handleBuildClick = () => {
    if (showDust || houseStep >= 3) {
      return;
    }

    const nextStep = houseStep + 1;
    setShowDust(true);
    playHammerSound();

    if (houseStep === 1 && !workingOnLeft) {
      setSwitchingWorkingSide(true);
      if (workingSwitchTimeoutRef.current) clearTimeout(workingSwitchTimeoutRef.current);
      workingSwitchTimeoutRef.current = setTimeout(() => {
        setWorkingOnLeft(true);
        setSwitchingWorkingSide(false);
      }, 380);
    }
    if (houseStep === 2 && workingOnLeft) {
      setSwitchingWorkingSide(true);
      if (workingSwitchTimeoutRef.current) clearTimeout(workingSwitchTimeoutRef.current);
      workingSwitchTimeoutRef.current = setTimeout(() => {
        setWorkingOnLeft(false);
        setSwitchingWorkingSide(false);
      }, 380);
    }

    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    if (dustTimeoutRef.current) clearTimeout(dustTimeoutRef.current);
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    revealTimeoutRef.current = setTimeout(() => {
      setHouseStep(nextStep);
      setFadeInStep(nextStep);
      if (nextStep === 3) {
        playSparkleSound();
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
      if (workingSwitchTimeoutRef.current) clearTimeout(workingSwitchTimeoutRef.current);
      if (hammerSoundRef.current) {
        hammerSoundRef.current.pause();
        hammerSoundRef.current.currentTime = 0;
      }
      if (sparkleSoundRef.current) {
        sparkleSoundRef.current.pause();
        sparkleSoundRef.current.currentTime = 0;
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
  }, [effectsEnabled]);

  const hasStartedBuild = houseStep > 0 || showDust;
  const showWorkingPig = hasStartedBuild && houseStep < 3;
  const showHappyPig = houseStep >= 3;

  return (
    <section className="section section--04">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section04/bg-section04.png')",
        }}
        aria-hidden="true"
      />
      <StoryCaption text="El segundo trabajó más y construyó una casa de madera." className="story-caption--soft" />
      <div className="section-content section--04-content" role="group" aria-label="Cerdito 2 trabajando">
        <img
          className={`section--04-pig-work${hasStartedBuild ? " section--04-pig-work--hidden" : ""}`}
          src="/img/Section04/pig2_work.png"
          alt="Cerdito 2 trabajando"
          draggable={false}
        />
        <img
          className={`section--04-pig-working${
            showWorkingPig ? " section--04-pig-working--visible" : ""
          }${workingOnLeft ? " section--04-pig-working--left" : " section--04-pig-working--right"}${
            switchingWorkingSide ? " section--04-pig-working--switching" : ""
          }`}
          src="/img/Section04/pig2_working.png"
          alt="Cerdito 2 construyendo"
          draggable={false}
        />
        <img
          className={`section--04-pig-happy${showHappyPig ? " section--04-pig-happy--visible" : ""}`}
          src="/img/Section04/pig2_happy.png"
          alt="Cerdito 2 feliz"
          draggable={false}
        />
        <button
          type="button"
          className="section--04-tool section--04-tool--hammer"
          aria-label="Martillo"
          onClick={() => setHammerTick((prev) => prev + 1)}
        >
          <img
            className={`section--04-tool-img${
              hammerTick > 0
                ? hammerTick % 2 === 0
                  ? " section--04-tool-img--wobble-a"
                  : " section--04-tool-img--wobble-b"
                : ""
            }`}
            src="/img/Section04/hammer.png"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </button>
        <button
          type="button"
          className="section--04-tool section--04-tool--nail"
          aria-label="Clavo y herramienta"
          onClick={() => setNailTick((prev) => prev + 1)}
        >
          <img
            className={`section--04-tool-img${
              nailTick > 0
                ? nailTick % 2 === 0
                  ? " section--04-tool-img--wobble-a"
                  : " section--04-tool-img--wobble-b"
                : ""
            }`}
            src="/img/Section04/nail_tool.png"
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </button>
        <button
          type="button"
          className="section--04-build-trigger"
          onClick={handleBuildClick}
          aria-label="Construir casa de madera"
        >
          <span className="section--04-house" aria-live="polite">
            {houseStep === 1 ? (
              <img
                className={`section--04-house-layer section--04-house-base section--04-house-layer--visible${
                  fadeInStep === 1 ? " section--04-house-layer--fade-in" : ""
                }`}
                src="/img/Section04/wooden_house_base.png"
                alt="Base de la casa de madera"
                draggable={false}
              />
            ) : null}
            {houseStep === 2 ? (
              <img
                className={`section--04-house-layer section--04-house-walls section--04-house-layer--visible${
                  fadeInStep === 2 ? " section--04-house-layer--fade-in" : ""
                }`}
                src="/img/Section04/wooden_house_walls.png"
                alt="Paredes de la casa de madera"
                draggable={false}
              />
            ) : null}
            {houseStep >= 3 ? (
              <img
                className={`section--04-house-layer section--04-house-full section--04-house-layer--visible${
                  fadeInStep === 3 ? " section--04-house-layer--fade-in" : ""
                }`}
                src="/img/Section04/full_wooden_house.png"
                alt="Casa de madera terminada"
                draggable={false}
              />
            ) : null}
            {showDust ? (
              <span className="section--04-dust" aria-hidden="true">
                <img className="section--04-dust-img" src="/img/Section04/dust.png" alt="" draggable={false} />
              </span>
            ) : null}
          </span>
        </button>
      </div>
    </section>
  );
}

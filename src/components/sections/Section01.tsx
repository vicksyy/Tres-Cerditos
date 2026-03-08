"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import StoryCaption from "@/components/StoryCaption";

type PigId = "pig1" | "pig2" | "pig3";

interface PigState {
  pig1: boolean;
  pig2: boolean;
  pig3: boolean;
}

interface PigDefinition {
  id: PigId;
  idle: string;
  wave: string;
  alt: string;
}

const initialState: PigState = {
  pig1: false,
  pig2: false,
  pig3: false,
};

const pigs: PigDefinition[] = [
  {
    id: "pig1" as const,
    idle: "/img/Section01/pig1_idle.png",
    wave: "/img/Section01/pig1_wave.png",
    alt: "Cerdito 1 saludando",
  },
  {
    id: "pig3" as const,
    idle: "/img/Section01/pig3_idle.png",
    wave: "/img/Section01/pig3_wave.png",
    alt: "Cerdito 3 saludando",
  },
  {
    id: "pig2" as const,
    idle: "/img/Section01/pig2_idle.png",
    wave: "/img/Section01/pig2_wave.png",
    alt: "Cerdito 2 saludando",
  },
];

type LeafId = "leaf1" | "leaf2" | "leaf3";

interface LeafState {
  leaf1: boolean;
  leaf2: boolean;
  leaf3: boolean;
}

interface LeafDefinition {
  id: LeafId;
  top: string;
  duration: string;
  delay: string;
}

const leaves: LeafDefinition[] = [
  { id: "leaf1" as const, top: "9vh", duration: "28s", delay: "0s" },
  { id: "leaf2" as const, top: "18vh", duration: "33s", delay: "6s" },
  { id: "leaf3" as const, top: "30vh", duration: "31s", delay: "12s" },
];

const initialLeafState: LeafState = {
  leaf1: false,
  leaf2: false,
  leaf3: false,
};
const PIG_OINK_RATE = 1.5;

interface Section01Props {
  effectsEnabled: boolean;
}

export default function Section01({ effectsEnabled }: Section01Props) {
  const [active, setActive] = useState<PigState>(initialState);
  const [leafShifted, setLeafShifted] = useState<LeafState>(initialLeafState);
  const ignoreClickRef = useRef(false);
  const pigSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (effectsEnabled || !pigSoundRef.current) return;
    pigSoundRef.current.pause();
    pigSoundRef.current.currentTime = 0;
  }, [effectsEnabled]);

  const playPigSound = () => {
    if (!effectsEnabled) return;
    if (!pigSoundRef.current) {
      pigSoundRef.current = new Audio("/sounds/pig_oink.mp3");
      pigSoundRef.current.preload = "auto";
      pigSoundRef.current.playbackRate = PIG_OINK_RATE;
      pigSoundRef.current.preservesPitch = false;
    }
    pigSoundRef.current.currentTime = 0;
    void pigSoundRef.current.play().catch(() => {});
  };

  const setPig = (id: PigId, value: boolean) => {
    setActive((prev) => ({ ...prev, [id]: value }));
  };

  const togglePig = (id: PigId) => {
    setActive((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activateExclusive = (id: PigId) => {
    setActive({ pig1: id === "pig1", pig2: id === "pig2", pig3: id === "pig3" });
  };

  const handleTouchStart = (id: PigId) => {
    ignoreClickRef.current = true;
    activateExclusive(id);
    playPigSound();
  };

  const handleClick = (id: PigId) => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    playPigSound();
    togglePig(id);
  };

  return (
    <section className="section">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section01/bg-section1.png')",
        }}
        aria-hidden="true"
      />
      <div className="section01-intro" role="status" aria-live="polite">
        <h1 className="section01-intro-title" aria-label="Los Tres Cerditos">
          {"Los Tres Cerditos".split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="section01-intro-letter"
              style={{ "--letter-delay": `${index * 0.1}s` } as CSSProperties}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h1>
        <StoryCaption text="Había una vez..." className="story-caption--s01" startDelay={2.2} />
      </div>
      {leaves.map((leaf) => (
        <button
          key={leaf.id}
          type="button"
          className="leaf-flight"
          style={
            {
              "--leaf-top": leaf.top,
              "--leaf-duration": leaf.duration,
              "--leaf-delay": leaf.delay,
            } as CSSProperties
          }
          onClick={() =>
            setLeafShifted((prev) => ({
              ...prev,
              [leaf.id]: !prev[leaf.id],
            }))
          }
          aria-pressed={leafShifted[leaf.id]}
          aria-label="Mover hoja al lado"
        >
          <span className={`leaf-offset${leafShifted[leaf.id] ? " leaf-offset--shifted" : ""}`}>
            <img
              className="leaf-sprite"
              src="/img/Section01/leaf.png"
              alt="Hoja volando"
              draggable={false}
            />
          </span>
        </button>
      ))}
      <div className="section-content" role="group" aria-label="Cerditos">
        {pigs.map((pig) => (
          <button
            key={pig.id}
            className={`pig-btn${pig.id === "pig3" ? " pig-btn--big" : ""}`}
            type="button"
            onMouseEnter={() => setPig(pig.id, true)}
            onMouseLeave={() => setPig(pig.id, false)}
            onClick={() => handleClick(pig.id)}
            onTouchStart={() => handleTouchStart(pig.id)}
            aria-pressed={active[pig.id]}
          >
            <img
              className={`pig-img${
                pig.id === "pig3"
                  ? " pig-img--big"
                  : pig.id === "pig2"
                  ? " pig-img--mid"
                  : ""
              }`}
              src={active[pig.id] ? pig.wave : pig.idle}
              alt={pig.alt}
              draggable={false}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

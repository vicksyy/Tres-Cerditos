"use client";

import { useRef, useState } from "react";

type PigId = "pig1" | "pig2" | "pig3";

interface PigState {
  pig1: boolean;
  pig2: boolean;
  pig3: boolean;
}

interface PigDefinition {
  id: PigId;
  idle: string;
  walk: string;
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
    idle: "/img/Section02/pig1_goodbye.png",
    walk: "/img/Section02/pig1_walk_left.png",
    alt: "Cerdito 1 caminando",
  },
  {
    id: "pig3" as const,
    idle: "/img/Section02/pig3_goodbye.png",
    walk: "/img/Section02/pig3_walk_center.png",
    alt: "Cerdito 3 caminando",
  },
  {
    id: "pig2" as const,
    idle: "/img/Section02/pig2_goodbye.png",
    walk: "/img/Section02/pig2_walk_right.png",
    alt: "Cerdito 2 caminando",
  },
];
const PIG_OINK_RATE = 1.5;

export default function Section02() {
  const [walking, setWalking] = useState<PigState>(initialState);
  const pigSoundRef = useRef<HTMLAudioElement | null>(null);

  const playPigSound = () => {
    if (!pigSoundRef.current) {
      pigSoundRef.current = new Audio("/sounds/pig_oink.mp3");
      pigSoundRef.current.preload = "auto";
      pigSoundRef.current.playbackRate = PIG_OINK_RATE;
      pigSoundRef.current.preservesPitch = false;
    }
    pigSoundRef.current.currentTime = 0;
    void pigSoundRef.current.play().catch(() => {});
  };

  const togglePig = (id: PigId) => {
    playPigSound();
    setWalking((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="section section--02">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section02/bg-section02.png')",
        }}
        aria-hidden="true"
      />
      <div className="section-content" role="group" aria-label="Cerditos caminando">
        {pigs.map((pig) => (
          <button
            key={pig.id}
            className={`pig-btn${pig.id === "pig3" ? " pig-btn--big" : ""}`}
            type="button"
            onClick={() => togglePig(pig.id)}
            aria-pressed={walking[pig.id]}
            aria-label={pig.alt}
          >
            <span className="pig-frame">
              <img
                className={`pig-layer pig-img${
                  pig.id === "pig3"
                    ? " pig-img--big"
                    : pig.id === "pig2"
                    ? " pig-img--mid"
                    : ""
                }${pig.id === "pig2" ? " pig2-goodbye-small" : ""}${
                  pig.id === "pig1" ? " pig1-raised" : ""
                }${pig.id === "pig2" ? " pig2-raised" : ""}${
                  !walking[pig.id] ? " pig-layer--visible" : ""
                }`}
                src={pig.idle}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
              <img
                className={`pig-layer pig-img${
                  pig.id === "pig3"
                    ? " pig-img--big"
                    : pig.id === "pig2"
                    ? " pig-img--mid"
                    : ""
                }${pig.id === "pig2" ? " pig2-goodbye-small" : ""}${
                  pig.id === "pig1" ? " pig1-raised" : ""
                }${pig.id === "pig2" ? " pig2-raised" : ""}${
                  walking[pig.id] ? " pig-layer--visible" : ""
                }`}
                src={pig.walk}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

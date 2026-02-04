"use client";

import { useRef, useState } from "react";

type PigId = "pig1" | "pig2" | "pig3";

type PigState = Record<PigId, boolean>;

const initialState: PigState = {
  pig1: false,
  pig2: false,
  pig3: false,
};

const pigs = [
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

export default function Section01() {
  const [active, setActive] = useState<PigState>(initialState);
  const ignoreClickRef = useRef(false);

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
  };

  const handleClick = (id: PigId) => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
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

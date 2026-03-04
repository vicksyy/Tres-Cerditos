"use client";

import { useState } from "react";

export default function Section10() {
  const [happyStep, setHappyStep] = useState(0);

  const handleSceneClick = () => {
    setHappyStep((prev) => (prev < 2 ? prev + 1 : prev));
  };

  const happyPoses = [
    { src: "/img/Section10/pigs_happy.png", alt: "Cerditos felices celebrando" },
    { src: "/img/Section10/pigs_happy_2.png", alt: "Cerditos celebrando con alegria" },
    { src: "/img/Section10/pigs_happy_3.png", alt: "Cerditos celebrando su victoria" },
  ];

  return (
    <section className="section section--10">
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section10/inside_house.png')",
        }}
        aria-hidden="true"
      />
      <div
        className="section-content section--10-content section--10-content--interactive"
        role="group"
        aria-label="Escena 10"
        onClick={handleSceneClick}
      >
        {happyPoses.map((pose, index) => (
          <img
            key={pose.src}
            className={`section--10-pigs${index === happyStep ? " section--10-pigs--visible" : ""}${
              index === happyStep ? ` section--10-pigs--celebrate-${index + 1}` : ""
            }`}
            src={pose.src}
            alt={pose.alt}
            aria-hidden={index !== happyStep}
            draggable={false}
          />
        ))}
      </div>
    </section>
  );
}

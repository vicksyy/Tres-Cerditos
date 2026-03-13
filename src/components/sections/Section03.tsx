"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import StoryCaption from "@/components/StoryCaption";

type StrawId = "left" | "farLeft";

interface StrawState {
  id: StrawId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
}

interface StrawAnchor {
  x: number;
  y: number;
  rotation: number;
}

interface StrawRenderSize {
  width: number;
  height: number;
}

const STRAW_ANCHORS: Record<StrawId, StrawAnchor> = {
  left: { x: 0.34, y: 0.74, rotation: -8 },
  farLeft: { x: 0.11, y: 0.64, rotation: 10 },
};

const STRAW_IDS: StrawId[] = ["left", "farLeft"];

function getStrawSize(viewWidth: number): StrawRenderSize {
  if (viewWidth <= 900) return { width: 120, height: 78 };
  if (viewWidth <= 1200) return { width: 145, height: 94 };
  return { width: 172, height: 112 };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

interface Section03Props {
  effectsEnabled: boolean;
}

export default function Section03({ effectsEnabled }: Section03Props) {
  const [houseStep, setHouseStep] = useState(0);
  const [showDust, setShowDust] = useState(false);
  const [strawRenderSize, setStrawRenderSize] = useState(() => getStrawSize(1280));
  const [straws, setStraws] = useState<StrawState[]>(() =>
    STRAW_IDS.map((id) => ({
      id,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rotation: STRAW_ANCHORS[id].rotation,
    }))
  );

  const sceneRef = useRef<HTMLDivElement | null>(null);
  const buildTriggerRef = useRef<HTMLButtonElement | null>(null);
  const sceneSizeRef = useRef<StrawRenderSize>({ width: 0, height: 0 });
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dustTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const happyTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const happySwapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hammerSoundRef = useRef<HTMLAudioElement | null>(null);
  const sparkleSoundRef = useRef<HTMLAudioElement | null>(null);
  const pigOinkSoundRef = useRef<HTMLAudioElement | null>(null);
  const fallbackNudgeDirectionRef = useRef<1 | -1>(1);
  const [fadeInStep, setFadeInStep] = useState<number | null>(null);
  const [showHappyPig, setShowHappyPig] = useState(false);
  const [isPigFadingOut, setIsPigFadingOut] = useState(false);

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

  const playPigOinkSound = () => {
    if (!effectsEnabled) return;
    if (!pigOinkSoundRef.current) {
      pigOinkSoundRef.current = new Audio("/sounds/pig_oink.mp3");
      pigOinkSoundRef.current.preload = "auto";
      pigOinkSoundRef.current.volume = 0.7;
    }
    pigOinkSoundRef.current.currentTime = 0;
    void pigOinkSoundRef.current.play().catch(() => {});
  };

  const handleBuildClick = () => {
    if (showDust || houseStep >= 3) {
      return;
    }

    const nextStep = houseStep + 1;
    setShowDust(true);
    playHammerSound();
    if (houseStep === 0) {
      playPigOinkSound();
    }

    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }
    if (dustTimeoutRef.current) {
      clearTimeout(dustTimeoutRef.current);
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    revealTimeoutRef.current = setTimeout(() => {
      setHouseStep(nextStep);
      setFadeInStep(nextStep);
      if (nextStep === 3) {
        playSparkleSound();
        if (happyTransitionTimeoutRef.current) clearTimeout(happyTransitionTimeoutRef.current);
        if (happySwapTimeoutRef.current) clearTimeout(happySwapTimeoutRef.current);
        happyTransitionTimeoutRef.current = setTimeout(() => {
          setIsPigFadingOut(true);
          happySwapTimeoutRef.current = setTimeout(() => {
            setShowHappyPig(true);
            setIsPigFadingOut(false);
          }, 280);
        }, 700);
      }
      fadeTimeoutRef.current = setTimeout(() => setFadeInStep(null), 700);
    }, 1200);

    dustTimeoutRef.current = setTimeout(() => {
      setShowDust(false);
    }, 2000);
  };

  const nudgeStraw = (id: StrawId, event: MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = centerX - event.clientX;
    let dy = centerY - event.clientY;
    const distance = Math.hypot(dx, dy);

    if (distance < 1) {
      dx = fallbackNudgeDirectionRef.current;
      dy = -fallbackNudgeDirectionRef.current;
      fallbackNudgeDirectionRef.current = fallbackNudgeDirectionRef.current === 1 ? -1 : 1;
    } else {
      dx /= distance;
      dy /= distance;
    }

    const impulse = 14;

    setStraws((prev) =>
      prev.map((straw) =>
        straw.id === id
          ? {
              ...straw,
              vx: straw.vx + dx * impulse,
              vy: straw.vy + dy * impulse,
              rotation: straw.rotation + dx * 10,
            }
          : straw
      )
    );
  };

  useEffect(() => {
    const placeStraws = () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const rect = scene.getBoundingClientRect();
      const previous = sceneSizeRef.current;
      const size = getStrawSize(rect.width);
      setStrawRenderSize(size);

      setStraws((prev) => {
        if (previous.width === 0 || previous.height === 0) {
          return prev.map((straw) => {
            const anchor = STRAW_ANCHORS[straw.id];
            return {
              ...straw,
              x: rect.width * anchor.x - size.width / 2,
              y: rect.height * anchor.y - size.height / 2,
            };
          });
        }

        const scaleX = rect.width / previous.width;
        const scaleY = rect.height / previous.height;

        return prev.map((straw) => ({
          ...straw,
          x: clamp(straw.x * scaleX, 0, rect.width - size.width),
          y: clamp(straw.y * scaleY, rect.height * 0.5, rect.height - size.height),
        }));
      });

      sceneSizeRef.current = { width: rect.width, height: rect.height };
    };

    placeStraws();
    window.addEventListener("resize", placeStraws);
    return () => window.removeEventListener("resize", placeStraws);
  }, []);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const scene = sceneRef.current;
      if (!scene) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min((now - lastTime) / 16.67, 2.4);
      lastTime = now;

      const rect = scene.getBoundingClientRect();
      const houseRect = buildTriggerRef.current?.getBoundingClientRect();
      const size = getStrawSize(rect.width);
      const minY = rect.height * 0.5;
      const maxY = rect.height - size.height;
      const obstacle = houseRect
        ? {
            x: houseRect.left - rect.left,
            y: houseRect.top - rect.top,
            width: houseRect.width,
            height: houseRect.height,
          }
        : null;

      setStraws((prev) =>
        prev.map((straw) => {
          let x = straw.x + straw.vx * dt;
          let y = straw.y + straw.vy * dt;
          let vx = straw.vx * Math.pow(0.972, dt);
          let vy = straw.vy * Math.pow(0.962, dt);

          if (x <= 0) {
            x = 0;
            vx = Math.abs(vx) * 0.8;
          } else if (x >= rect.width - size.width) {
            x = rect.width - size.width;
            vx = -Math.abs(vx) * 0.8;
          }

          if (y <= minY) {
            y = minY;
            vy = Math.abs(vy) * 0.45;
          } else if (y >= maxY) {
            y = maxY;
            vy = -Math.abs(vy) * 0.45;
          }

          // Bounce against the house zone so straws never sit on top of house PNGs.
          if (
            obstacle &&
            x < obstacle.x + obstacle.width &&
            x + size.width > obstacle.x &&
            y < obstacle.y + obstacle.height &&
            y + size.height > obstacle.y
          ) {
            const overlapLeft = x + size.width - obstacle.x;
            const overlapRight = obstacle.x + obstacle.width - x;
            const overlapTop = y + size.height - obstacle.y;
            const overlapBottom = obstacle.y + obstacle.height - y;
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft) {
              x = obstacle.x - size.width;
              vx = -Math.abs(vx) * 0.72;
            } else if (minOverlap === overlapRight) {
              x = obstacle.x + obstacle.width;
              vx = Math.abs(vx) * 0.72;
            } else if (minOverlap === overlapTop) {
              y = obstacle.y - size.height;
              vy = -Math.abs(vy) * 0.55;
            } else {
              y = obstacle.y + obstacle.height;
              vy = Math.abs(vy) * 0.55;
            }
          }

          y = clamp(y, minY, maxY);

          if (Math.abs(vx) < 0.05) vx = 0;
          if (Math.abs(vy) < 0.05) vy = 0;

          const base = STRAW_ANCHORS[straw.id].rotation;
          const rotation = base + vx * 0.38;

          return { ...straw, x, y, vx, vy, rotation };
        })
      );

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
      if (dustTimeoutRef.current) clearTimeout(dustTimeoutRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      if (happyTransitionTimeoutRef.current) clearTimeout(happyTransitionTimeoutRef.current);
      if (happySwapTimeoutRef.current) clearTimeout(happySwapTimeoutRef.current);
      if (hammerSoundRef.current) {
        hammerSoundRef.current.pause();
        hammerSoundRef.current.currentTime = 0;
      }
      if (sparkleSoundRef.current) {
        sparkleSoundRef.current.pause();
        sparkleSoundRef.current.currentTime = 0;
      }
      if (pigOinkSoundRef.current) {
        pigOinkSoundRef.current.pause();
        pigOinkSoundRef.current.currentTime = 0;
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
    if (pigOinkSoundRef.current) {
      pigOinkSoundRef.current.pause();
      pigOinkSoundRef.current.currentTime = 0;
    }
  }, [effectsEnabled]);

  return (
    <section className="section section--03" data-story-complete={houseStep >= 3 ? "true" : "false"}>
      <div
        className="section-bg"
        style={{
          backgroundImage: "url('/img/Section03/bg-section03.png')",
        }}
        aria-hidden="true"
      />
      <StoryCaption text="El primero empezó rápido y levantó una casita de paja." className="story-caption--soft" />
      <div ref={sceneRef} className="section-content section--03-content" role="group" aria-label="Cerdito trabajando">
        <img
          className={`section--03-pig-work${isPigFadingOut ? " section--03-pig-work--fade-out" : ""}`}
          src={showHappyPig ? "/img/Section03/pig1_happy.png" : "/img/Section03/pig1_work.png"}
          alt={showHappyPig ? "Cerdito 1 feliz" : "Cerdito 1 trabajando"}
          onClick={handleBuildClick}
          draggable={false}
        />
        {straws.map((straw) => (
          <img
            key={straw.id}
            className="section--03-straw-piece"
            src="/img/Section03/straw.png"
            alt="Paja"
            draggable={false}
            style={{
              left: straw.x,
              top: straw.y,
              width: strawRenderSize.width,
              height: strawRenderSize.height,
              transform: `rotate(${straw.rotation}deg)`,
            }}
            onClick={(event) => nudgeStraw(straw.id, event)}
          />
        ))}
        <button
          ref={buildTriggerRef}
          type="button"
          className="section--03-build-trigger"
          onClick={handleBuildClick}
          aria-label="Construir casa de paja"
        >
          <span className="section--03-house" aria-live="polite">
            {houseStep === 1 ? (
              <img
                className={`section--03-house-final section--03-house-layer section--03-house-layer--visible${
                  fadeInStep === 1 ? " section--03-house-layer--fade-in" : ""
                }`}
                src="/img/Section03/straw1_house.png"
                alt="Primera fase de la casa de paja"
                draggable={false}
              />
            ) : null}
            {houseStep === 2 ? (
              <img
                className={`section--03-house-final section--03-house-layer section--03-house-layer--visible${
                  fadeInStep === 2 ? " section--03-house-layer--fade-in" : ""
                }`}
                src="/img/Section03/straw2_house.png"
                alt="Segunda fase de la casa de paja"
                draggable={false}
              />
            ) : null}
            {houseStep >= 3 ? (
              <img
                className={`section--03-house-final section--03-house-layer section--03-house-layer--visible${
                  fadeInStep === 3 ? " section--03-house-layer--fade-in" : ""
                }`}
                src="/img/Section03/straw_house.png"
                alt="Casa de paja terminada"
                draggable={false}
              />
            ) : null}
            {showDust ? (
              <span className="section--03-dust" aria-hidden="true">
                <img className="section--03-dust-img" src="/img/Section03/dust.png" alt="" draggable={false} />
              </span>
            ) : null}
          </span>
        </button>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Section01 from "@/components/sections/Section01";
import Section02 from "@/components/sections/Section02";
import Section03 from "@/components/sections/Section03";
import Section04 from "@/components/sections/Section04";
import Section05 from "@/components/sections/Section05";
import Section06 from "@/components/sections/Section06";
import Section07 from "@/components/sections/Section07";
import Section08 from "@/components/sections/Section08";

export default function HomePage() {
  const mainRef = useRef<HTMLElement | null>(null);

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

      const match = /^(?:Digit|Numpad)([1-8])$/.exec(event.code);
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

  return (
    <main ref={mainRef} className="main">
      <Section01 />
      <Section02 />
      <Section03 />
      <Section04 />
      <Section05 />
      <Section06 />
      <Section07 />
      <Section08 />
    </main>
  );
}

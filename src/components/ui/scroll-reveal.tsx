"use client";

import React, { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  baseOpacity?: number;
  enableBlur?: boolean;
  baseRotation?: number;
  blurStrength?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  baseOpacity = 0.1,
  enableBlur = true,
  baseRotation = 5,
  blurStrength = 10,
  className,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => children.split(/\s+/).filter(Boolean), [children]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wordEls = container.querySelectorAll<HTMLSpanElement>("[data-sr-word]");
    if (wordEls.length === 0) return;

    // Set initial state
    wordEls.forEach((el) => {
      gsap.set(el, {
        opacity: baseOpacity,
        rotateX: baseRotation,
        filter: enableBlur ? `blur(${blurStrength}px)` : "none",
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        end: "bottom 60%",
        scrub: 0.8,
      },
    });

    wordEls.forEach((el, i) => {
      tl.to(
        el,
        {
          opacity: 1,
          rotateX: 0,
          filter: enableBlur ? "blur(0px)" : "none",
          duration: 0.6,
          ease: "power2.out",
        },
        i * 0.04
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) st.kill();
      });
    };
  }, [words, baseOpacity, baseRotation, enableBlur, blurStrength]);

  return (
    <div ref={containerRef} className={className} style={{ perspective: "600px" }}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          data-sr-word
          style={{
            display: "inline-block",
            marginRight: "0.3em",
            willChange: "opacity, filter, transform",
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

"use client";

import React from "react";
import styles from "./marquee.module.scss";

interface MarqueeProps {
  children: React.ReactNode;
  /** "left" (default) or "right" */
  direction?: "left" | "right";
  /** Duration in seconds for one full scroll cycle */
  duration?: number;
  className?: string;
  /** Pause on hover */
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  direction = "left",
  duration = 30,
  className,
  pauseOnHover = false,
}: MarqueeProps) {
  const animStyle = {
    "--marquee-duration": `${duration}s`,
  } as React.CSSProperties;

  return (
    <div
      className={`${styles.marquee} ${pauseOnHover ? styles.pauseOnHover : ""} ${className ?? ""}`}
      style={animStyle}
    >
      <div
        className={`${styles.track} ${direction === "right" ? styles.reverse : ""}`}
      >
        <div className={styles.content}>{children}</div>
        <div className={styles.content} aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

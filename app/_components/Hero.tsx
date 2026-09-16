"use client";

import { useRef } from "react";
import { useMountEffect } from "../_hooks/useMountEffect";

type HeroProps = {
  src: string;
};

export function Hero({ src }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useMountEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reducedMotion.matches) {
        video.pause();
        return;
      }
      void video.play().catch(() => undefined);
    };

    sync();
    reducedMotion.addEventListener("change", sync);
    return () => reducedMotion.removeEventListener("change", sync);
  });

  return (
    <section className="Hero" aria-hidden="true">
      <div className="Hero-screen">
        <video
          ref={videoRef}
          className="Hero-video"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="Hero-scrim" />
        <div className="Hero-flash" />
      </div>
    </section>
  );
}

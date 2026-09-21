"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useRef, type RefObject } from "react";
import { useMountEffect } from "../_hooks/useMountEffect";


export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isPopRef = useRef(false);

  useMountEffect(() => {
    const markPop = () => {
      isPopRef.current = true;
    };
    window.addEventListener("popstate", markPop);
    return () => window.removeEventListener("popstate", markPop);
  });

  const consumeShouldReset = () => {
    const isPop = isPopRef.current;
    isPopRef.current = false;
    if (!hasLoaded) {
      hasLoaded = true;
      return false;
    }
    return !isPop;
  };

  useMountEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  });

  return (
    <ScrollToTop
      key={pathname}
      lenisRef={lenisRef}
      consumeShouldReset={consumeShouldReset}
    />
  );
}

type ScrollToTopProps = {
  lenisRef: RefObject<Lenis | null>;
  consumeShouldReset: () => boolean;
};

let hasLoaded = false;

const SETTLE_WINDOW = 2500;
const USER_INPUT = ["touchstart", "wheel", "pointerdown", "keydown"] as const;

function ScrollToTop({ lenisRef, consumeShouldReset }: ScrollToTopProps) {
  useMountEffect(() => {
    if (!consumeShouldReset()) return;

    const jumpTo = (top: number) => {
      lenisRef.current?.scrollTo(top, { immediate: true, force: true });
      window.scrollTo({ top, left: 0, behavior: "instant" });
    };

    let target = 0;
    let isGuarding = true;
    const startedAt = performance.now();

    jumpTo(target);
    queueMicrotask(() => {
      target = window.scrollY;
    });

    const release = () => {
      isGuarding = false;
    };

    const holdPosition = () => {
      if (!isGuarding) return;
      if (performance.now() - startedAt > SETTLE_WINDOW) {
        release();
        return;
      }
      if (Math.abs(window.scrollY - target) >= 0.5) jumpTo(target);
    };

    window.addEventListener("scroll", holdPosition, { passive: true });
    USER_INPUT.forEach((type) =>
      window.addEventListener(type, release, { passive: true, capture: true }),
    );

    return () => {
      window.removeEventListener("scroll", holdPosition);
      USER_INPUT.forEach((type) =>
        window.removeEventListener(type, release, { capture: true }),
      );
    };
  });

  return null;
}

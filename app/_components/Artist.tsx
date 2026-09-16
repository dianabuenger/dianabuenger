"use client";

import { useRef, useState } from "react";
import type { Category, Thumbnail } from "../_lib/projects";
import { fullName, site } from "../_lib/site";
import { useMountEffect } from "../_hooks/useMountEffect";
import { ArtistControls } from "./ArtistControls";
import { FeedItem } from "./FeedItem";
import { Hero } from "./Hero";

const HERO_VIDEO = "/hero.mp4";
const DOCK_SPAN = 0.55;
const HEADER_REVEAL_DELAY = 1500;

type ArtistProps = {
  thumbnails: Thumbnail[];
};

export function Artist({ thumbnails }: ArtistProps) {
  const [isReady, setIsReady] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useMountEffect(() => {
    const skipIntro = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const readyTimer = window.setTimeout(
      () => setIsReady(true),
      skipIntro ? 0 : HEADER_REVEAL_DELAY,
    );
    return () => window.clearTimeout(readyTimer);
  });

  useMountEffect(() => {
    const sentinel = sentinelRef.current;
    const header = headerRef.current;
    if (!sentinel || !header) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const remaining = sentinel.getBoundingClientRect().top;
      const span = window.innerHeight * DOCK_SPAN;
      const progress = Math.min(1, Math.max(0, 1 - remaining / span));
      header.style.setProperty("--dock", progress.toFixed(4));
      setIsDocked(progress >= 0.95);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  });

  const selectCategory = (next: Category | null) => {
    setCategory(next);
    if (window.scrollY > window.innerHeight) {
      window.scrollTo({ top: window.innerHeight, behavior: "auto" });
    }
  };

  const visibleThumbnails = category
    ? thumbnails.filter((thumbnail) => thumbnail.category === category)
    : thumbnails;

  return (
    <main className={`Artist${isReady ? " is-artist-ready" : ""}`}>
      <Hero src={HERO_VIDEO} />
      <div ref={sentinelRef} className="Artist-dock-sentinel" />

      <div className="Artist-content">
        <section className="Artist-intro container">
          <p className="Artist-intro-text t-statement">{site.intro}</p>
        </section>
        <section className="Artist-projects container">
          {visibleThumbnails.map((item, index) => (
            <FeedItem key={item.id} item={item} priority={index < 2} />
          ))}
        </section>
      </div>

      <div className="Artist-credits t-meta">
        <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
      </div>

      <div className="Artist-header-rail">
        <header
          ref={headerRef}
          className={`Artist-header${isDocked ? " is-docked" : ""}`}
        >
          <h1 className="Artist-header-name t-wordmark">{fullName}</h1>
          <div className="Artist-header-switch">
            <p className="Artist-header-tagline t-tagline" aria-hidden={isDocked}>
              {site.tagline}
            </p>
            <ul
              className="Artist-header-links t-list t-nav"
              inert={!isDocked}
              aria-hidden={!isDocked}
            >
              <ArtistControls
                category={category}
                onSelectCategory={selectCategory}
                email={site.email}
              />
            </ul>
          </div>
        </header>
      </div>
    </main>
  );
}

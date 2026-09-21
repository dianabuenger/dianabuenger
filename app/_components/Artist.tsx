"use client";

import { useRef, useState } from "react";
import { categories, type Category, type Thumbnail } from "../_lib/projects";
import { fullName, site } from "../_lib/site";
import { useMountEffect } from "../_hooks/useMountEffect";
import { WORK_ALL } from "./ArtistControls";
import { FeedItem } from "./FeedItem";
import { Hero } from "./Hero";
import { SiteHeader } from "./SiteHeader";

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
  const projectsRef = useRef<HTMLElement>(null);

  const scrollToWork = () => {
    const projects = projectsRef.current;
    if (!projects) return;
    const top = projects.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "auto" });
  };

  useMountEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("work");
    const linked = categories.find(({ id }) => id === requested)?.id ?? null;
    const wantsWork = linked !== null || requested === WORK_ALL;
    if (linked) setCategory(linked);
    if (wantsWork) scrollToWork();

    const skipIntro =
      wantsWork ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    window.history.replaceState(null, "", next ? `/?work=${next}` : "/");
    scrollToWork();
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
        <section ref={projectsRef} className="Artist-projects container">
          {visibleThumbnails.map((item, index) => (
            <FeedItem key={item.id} item={item} priority={index < 2} />
          ))}
        </section>
      </div>

      <div className="Artist-credits t-meta">
        <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
      </div>

      <SiteHeader
        page="work"
        isDocked={isDocked}
        headerRef={headerRef}
        category={category}
        onSelectCategory={selectCategory}
        onGoToWork={scrollToWork}
      />
    </main>
  );
}

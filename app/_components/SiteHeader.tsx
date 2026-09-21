"use client";

import Link from "next/link";
import type { Ref } from "react";
import type { Category } from "../_lib/projects";
import { fullName, site } from "../_lib/site";
import { ArtistControls, type Page } from "./ArtistControls";

type SiteHeaderProps = {
  page: Page;
  isDocked: boolean;
  headerRef?: Ref<HTMLElement>;
  category?: Category | null;
  onSelectCategory?: (category: Category | null) => void;
  onGoToWork?: () => void;
};

export function SiteHeader({
  page,
  isDocked,
  headerRef,
  category = null,
  onSelectCategory,
  onGoToWork,
}: SiteHeaderProps) {
  const isHome = page === "work";

  return (
    <div className="Artist-header-rail">
      <header
        ref={headerRef}
        className={`Artist-header${isHome ? "" : " Artist-header--static"}${isDocked ? " is-docked" : ""}`}
      >
        {isHome ? (
          <h1 className="Artist-header-name t-wordmark">{fullName}</h1>
        ) : (
          <Link href="/" className="Artist-header-name t-wordmark t-link--primary">
            {fullName}
          </Link>
        )}
        <div className="Artist-header-switch">
          {isHome && (
            <p className="Artist-header-tagline t-tagline" aria-hidden={isDocked}>
              {site.tagline}
            </p>
          )}
          <ul
            className="Artist-header-links t-list t-nav"
            inert={!isDocked}
            aria-hidden={!isDocked}
          >
            <ArtistControls
              page={page}
              category={category}
              onSelectCategory={onSelectCategory}
              onGoToWork={onGoToWork}
              email={site.email}
            />
          </ul>
        </div>
      </header>
    </div>
  );
}

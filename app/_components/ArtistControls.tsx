"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { categories, type Category } from "../_lib/projects";

export type Page = "work" | "biography";

export type ArtistControlsProps = {
  page: Page;
  category: Category | null;
  onSelectCategory?: (category: Category | null) => void;
  email: string;
};

type NavItem = {
  key: string;
  node: ReactNode;
};

export function workHref(category: Category | null) {
  return category ? `/?work=${category}` : "/";
}

export function ArtistControls({
  page,
  category,
  onSelectCategory,
  email,
}: ArtistControlsProps) {
  const [isWorkOpen, setIsWorkOpen] = useState(false);

  const isFiltering = category !== null;
  const isOpen = isWorkOpen || isFiltering;

  const options: { id: Category | null; label: string }[] = [
    { id: null, label: "All" },
    ...categories,
  ];

  const selectCategory = (next: Category | null) => {
    onSelectCategory?.(next);
    setIsWorkOpen(false);
  };

  const renderOption = (id: Category | null, label: string) => {
    const isSelected = page === "work" && category === id;
    const className = `t-btn t-link--primary t-nav ${isSelected ? "is-selected" : "is-dimmed"}`;

    if (!onSelectCategory) {
      return (
        <Link href={workHref(id)} className={className}>
          {label}
        </Link>
      );
    }

    return (
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => selectCategory(id)}
        className={className}
      >
        {label}
      </button>
    );
  };

  const items: NavItem[] = [
    {
      key: "work",
      node: (
        <div
          className={`Artist-nav-group${isOpen ? " is-open" : ""}`}
          onMouseLeave={() => setIsWorkOpen(false)}
        >
          <button
            type="button"
            aria-expanded={isOpen}
            aria-current={page === "work" ? "page" : undefined}
            onClick={() => setIsWorkOpen(!isWorkOpen)}
            className="t-btn t-link--primary t-nav"
          >
            Work
          </button>
          <ul className="Artist-nav-sub t-list">
            {options.map(({ id, label }, index) => (
              <li key={label} style={{ "--sub-index": index } as CSSProperties}>
                {renderOption(id, label)}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      key: "biography",
      node: (
        <Link
          href="/biography"
          aria-current={page === "biography" ? "page" : undefined}
          className="t-btn t-link--primary t-nav"
        >
          Biography
        </Link>
      ),
    },
    ...(email
      ? [
          {
            key: "contact",
            node: (
              <a
                href={`mailto:${email}`}
                className="t-btn t-link--primary t-nav"
              >
                Contact
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {items.map(({ key, node }, index) => (
        <li key={key} style={{ "--nav-index": index } as CSSProperties}>
          {node}
        </li>
      ))}
    </>
  );
}

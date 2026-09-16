"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { categories, type Category } from "../_lib/projects";

export type ArtistControlsProps = {
  category: Category | null;
  onSelectCategory: (category: Category | null) => void;
  email: string;
};

type NavItem = {
  key: string;
  node: ReactNode;
};

export function ArtistControls({
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
    onSelectCategory(next);
    setIsWorkOpen(false);
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
            onClick={() => setIsWorkOpen(!isWorkOpen)}
            className="t-btn t-link--primary t-nav"
          >
            Work
          </button>
          <ul className="Artist-nav-sub t-list">
            {options.map(({ id, label }, index) => {
              const isSelected = category === id;
              return (
                <li
                  key={label}
                  style={{ "--sub-index": index } as CSSProperties}
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectCategory(id)}
                    className={`t-btn t-link--primary t-nav ${isSelected ? "is-selected" : "is-dimmed"}`}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ),
    },
    {
      key: "biography",
      node: (
        <button type="button" className="t-btn t-link--primary t-nav">
          Biography
        </button>
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

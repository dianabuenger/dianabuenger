"use client";

import Image from "next/image";
import type { Thumbnail } from "../_lib/projects";

type FeedItemProps = {
  item: Thumbnail;
  priority?: boolean;
};

export function FeedItem({ item, priority }: FeedItemProps) {
  return (
    <figure className="FeedItem ProjectItem center">
      <div className={`FeedItem-item FeedItem-item--${item.size}`}>
        <div className="ProjectItem-inner">
          <div
            className="ProjectItem-bg"
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
          >
            <Image
              src={item.url}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 767px) 100vw, 44vw"
              priority={priority}
              draggable={false}
              className="ProjectItem-img"
            />
          </div>
          <figcaption className="FeedItem-title">
            <span className="FeedItem-title-text t-meta">{item.title}</span>
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

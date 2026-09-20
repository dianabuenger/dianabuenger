import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "../_components/SiteHeader";
import { projectTitles } from "../_lib/projects";
import { fullName, site } from "../_lib/site";

export const metadata: Metadata = {
  title: `Biography — ${fullName}`,
  description: site.bio,
};

const credits = [
  { label: "Education", items: site.education },
  { label: "Publications", items: projectTitles("editorial") },
  { label: "Clients", items: projectTitles("fashion") },
];

export default function Biography() {
  return (
    <main className="Artist Bio">
      <section className="Bio-layout container">
        <h1 className="u-visually-hidden">Biography</h1>

        <figure className="Bio-portrait">
          <Image
            src={site.portrait.url}
            alt={site.portrait.alt}
            width={site.portrait.width}
            height={site.portrait.height}
            sizes="(max-width: 767px) 100vw, 40vw"
            priority
            className="Bio-portrait-img"
          />
        </figure>

        <div className="Bio-body">
          <p className="Bio-text">{site.bio}</p>

          <dl className="Bio-credits">
            {credits.map(({ label, items }) => (
              <div key={label} className="Bio-credit">
                <dt className="Bio-credit-label t-meta">{label}</dt>
                {items.map((item) => (
                  <dd key={item} className="Bio-credit-value">
                    {item}
                  </dd>
                ))}
              </div>
            ))}
            {site.email && (
              <div className="Bio-credit">
                <dt className="Bio-credit-label t-meta">Contact</dt>
                <dd className="Bio-credit-value">
                  <a href={`mailto:${site.email}`} className="t-link--primary">
                    {site.email}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <div className="Artist-credits t-meta">
        <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
      </div>

      <SiteHeader page="biography" isDocked />
    </main>
  );
}

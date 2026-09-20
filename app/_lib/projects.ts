export const categories = [
  { id: "fashion", label: "Fashion" },
  { id: "editorial", label: "Editorial" },
] as const;

export type Category = (typeof categories)[number]["id"];

export type ThumbnailSize = "s" | "m" | "l" | "xl";

export type Thumbnail = {
  id: string;
  url: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  size: ThumbnailSize;
  category: Category;
};

export type Project = {
  slug: string;
  title: string;
  category: Category;
  cover: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  size: ThumbnailSize;
};

export const projects: Project[] = [
  {
    slug: "vogue",
    title: "Vogue",
    category: "editorial",
    cover: {
      url: "/projects/_covers/vogue.webp",
      alt: "Model in a floor-length black cloak standing on still water in soft sea mist.",
      width: 1024,
      height: 1280,
    },
    size: "l",
  },
  {
    slug: "studio-nall",
    title: "Studio Nall",
    category: "fashion",
    cover: {
      url: "/projects/_covers/studio-nall.webp",
      alt: "Model in a sculptural blue-grey gown against a dark draped backdrop.",
      width: 1120,
      height: 1400,
    },
    size: "s",
  },
  {
    slug: "elle",
    title: "Elle",
    category: "editorial",
    cover: {
      url: "/projects/_covers/elle.webp",
      alt: "Model in a pale pink tailored suit against a weathered blue wall.",
      width: 1000,
      height: 1250,
    },
    size: "m",
  },
  {
    slug: "black-palms",
    title: "Black Palms",
    category: "fashion",
    cover: {
      url: "/projects/_covers/black-palms.webp",
      alt: "Model in a long black open-back dress in a bare white room.",
      width: 1120,
      height: 1400,
    },
    size: "l",
  },
  {
    slug: "weat",
    title: "Weat",
    category: "fashion",
    cover: {
      url: "/projects/_covers/weat.webp",
      alt: "Portrait of a model in a wide black woven hat and crisp white shirt.",
      width: 933,
      height: 1400,
    },
    size: "m",
  },
  {
    slug: "ititi-studio",
    title: "Ititi Studio",
    category: "fashion",
    cover: {
      url: "/projects/_covers/ititi-studio.webp",
      alt: "Model in a printed skirt and dark blazer framed by a brick archway.",
      width: 933,
      height: 1400,
    },
    size: "s",
  },
];

export const thumbnails: Thumbnail[] = projects.map((project) => ({
  id: project.slug,
  url: project.cover.url,
  alt: project.cover.alt,
  title: project.title,
  width: project.cover.width,
  height: project.cover.height,
  size: project.size,
  category: project.category,
}));

export function projectTitles(category: Category) {
  return projects
    .filter((project) => project.category === category)
    .map((project) => project.title);
}

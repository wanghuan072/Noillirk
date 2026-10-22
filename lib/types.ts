export type Media = {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
};
export type Seo = { title: string; description: string; keywords?: string[] };
export type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; style: "ordered" | "unordered"; items: string[] }
  | { type: "steps"; items: { title: string; body: string }[] }
  | {
      type: "callout";
      tone: "info" | "tip" | "warning";
      label?: string;
      body: string;
    }
  | ({ type: "image"; caption?: string } & Media)
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | {
      type: "video";
      provider: "youtube";
      videoId: string;
      title: string;
      description: string;
      poster?: Media;
    };
export type Section = { id: string; heading: string; blocks: Block[] };
export type Game = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string | null;
  tags: string[];
  categories: string[];
  spoilerPolicy: "none" | "marked" | "full";
  flags: {
    isNewHome: boolean;
    isFeaturedHome: boolean;
    isRecommendedHome: boolean;
  };
  image: Media;
  seo: Seo;
  content: Section[];
  relatedGameIds: string[];
  player: {
    iframeSrc: string;
    aspectRatio: string | null;
    orientation: string;
    permissionsPolicy: string[];
    referrerPolicy: ReferrerPolicy | null;
    sandbox: string[] | null;
    loadTimeoutMs: number;
    minimumHeight?: number;
  };
};
export type Guide = {
  id: string;
  slug: string;
  status: "draft" | "published";
  title: string;
  summary: string;
  tags: string[];
  authorId: string | null;
  spoilerPolicy: string;
  publishedAt: string | null;
  updatedAt: string | null;
  cover: Media;
  seo: Seo;
  sections: { id: string; title: string; blocks: Block[] }[];
  relatedGuideIds: string[];
};

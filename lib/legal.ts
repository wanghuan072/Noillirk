import data from "@/data/site/legal.json";
import capabilities from "@/planning/site-capabilities.json";
import { site } from "./site";
import { legalText } from "./legal-text";
type Section = {
  heading: string;
  text: string;
  requiresCapability?: keyof typeof capabilities.features;
};
type Page = { title: string; sections: Section[] };
export const legalContent: Record<
  string,
  { title: string; sections: { heading: string; text: string }[] }
> = Object.fromEntries(
  Object.entries(data as Record<string, Page>).map(([id, page]) => [
    id,
    {
      title: page.title,
      sections: page.sections
        .filter(
          (s) =>
            !s.requiresCapability ||
            capabilities.features[s.requiresCapability].enabled,
        )
        .map(({ heading, text }) => ({
          heading,
          text: legalText(text, { domain: site.hostname, email: site.email }),
        })),
    },
  ]),
);

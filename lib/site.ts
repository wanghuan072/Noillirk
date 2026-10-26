import config from "@/config/site.json";
import deployment from "@/config/deployment.json";
export const site = {
  name: config.name,
  origin: config.origin,
  logo: "/images/logo.png",
  social: "/images/og-image.png",
  hostname: new URL(config.origin).hostname,
  email: config.email,
};
export const navigation = config.navigation;
export const legalNavigation = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Copyright", path: "/copyright" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];
export const isLocalPreview =
  deployment.mode === "review" ||
  process.env.NODE_ENV === "development" ||
  process.env.LOCAL_DRAFT_BUILD === "1";
export function pathFor(path: string, preview: boolean) {
  void preview;
  return path;
}
export function absolute(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes(".."))
    throw new Error("Invalid site path");
  return new URL(path, site.origin).href;
}

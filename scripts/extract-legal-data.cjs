const fs = require("fs"),
  ts = require("typescript");
const source = fs.readFileSync("lib/legal.ts", "utf8");
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exportsObject = {};
new Function("require", "exports", code)((name) => {
  if (name === "./site") return { site: { email: "wyong@noillirk.me" } };
  if (name === "@/planning/site-capabilities.json")
    return {
      default: JSON.parse(fs.readFileSync("planning/site-capabilities.json")),
    };
  throw new Error("Unexpected legal import " + name);
}, exportsObject);
const pages = exportsObject.legalContent;
pages.privacy.sections.splice(2, 0, {
  heading: "Video players",
  text: "When a page includes a video, its player uses YouTube's privacy-enhanced domain and lazy loading. Requests to YouTube may begin when the player enters the browser's loading range, before you select play. Privacy-enhanced embedding does not mean that no information is transmitted. Video controls and any external destination they offer belong to YouTube. No video is set to play automatically.",
  requiresCapability: "youtubeIframes",
});
fs.mkdirSync("data/site", { recursive: true });
fs.writeFileSync("data/site/legal.json", JSON.stringify(pages, null, 2) + "\n");

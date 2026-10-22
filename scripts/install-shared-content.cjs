const fs = require("fs");
const content = fs.readFileSync("lib/content.ts", "utf8");
const start = content.indexOf("export function selections(");
const original = content.slice(start);
const body = original.slice(original.indexOf("  const home ="));
const pure = body.replace(
  "  const home = current.id === mainGame.id;",
  "  const home = isHome;",
);
fs.writeFileSync(
  "lib/recommendations.ts",
  'import type { Game } from "./types";\nexport function selectGames(current:Game, inventory:Game[], isHome:boolean){\n const pool=inventory.filter(g=>g.id!==current.id);\n' +
    pure,
);
fs.writeFileSync(
  "lib/content.ts",
  'import {selectGames} from "./recommendations";\n' +
    content.slice(0, start) +
    "export function selections(current:Game,preview=false){return selectGames(current,preview?previewGames():publishedGames(),current.id===mainGame.id);}\n",
);
fs.writeFileSync(
  "lib/legal.ts",
  `import data from "@/data/site/legal.json";
import capabilities from "@/planning/site-capabilities.json";
type Section={heading:string;text:string;requiresCapability?:keyof typeof capabilities.features};
type Page={title:string;sections:Section[]};
export const legalContent:Record<string,{title:string;sections:{heading:string;text:string}[]}>=Object.fromEntries(Object.entries(data as Record<string,Page>).map(([id,page])=>[id,{title:page.title,sections:page.sections.filter(s=>!s.requiresCapability||capabilities.features[s.requiresCapability].enabled).map(({heading,text})=>({heading,text}))}]));
`,
);

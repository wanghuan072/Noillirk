import { selectGames } from "./recommendations";
import fs from "node:fs";
import path from "node:path";
import mainJson from "@/data/games/main-game.json";
import gamesJson from "@/data/games/games.json";
import type { Game, Guide } from "./types";
export const mainGame = mainJson as Game;
const gameDrafts = gamesJson as Game[];
const guideDrafts = fs
  .readdirSync(path.join(process.cwd(), "data/guides"))
  .filter((f) => f.endsWith(".json"))
  .map(
    (f) =>
      JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "data/guides", f), "utf8"),
      ) as Guide,
  );
export function publishedGames() {
  return gameDrafts.filter((g) => g.status === "published");
}
export function publishedGuides() {
  return guideDrafts.filter((g) => g.status === "published");
}
export function previewGames() {
  return [...gameDrafts];
}
export function previewGuides() {
  return [...guideDrafts];
}
export function getGame(slug: string, preview = false) {
  return (preview ? previewGames() : publishedGames()).find(
    (g) => g.slug === slug,
  );
}
export function getGuide(slug: string, preview = false) {
  return (preview ? previewGuides() : publishedGuides()).find(
    (g) => g.slug === slug,
  );
}
export function getGuideById(id: string, preview = false) {
  return (preview ? previewGuides() : publishedGuides()).find(
    (g) => g.id === id,
  );
}
export function selections(current: Game, preview = false) {
  return selectGames(
    current,
    preview ? previewGames() : publishedGames(),
    current.id === mainGame.id,
  );
}

import type { Game } from "./types";
export function selectGames(current: Game, inventory: Game[], isHome: boolean) {
  if (new Set(inventory.map((g) => g.id)).size !== inventory.length)
    throw new Error("Recommendation inventory contains duplicate game IDs");
  const pool = inventory.filter((g) => g.id !== current.id);
  const home = isHome;
  const byFlag = (key: keyof Game["flags"]) => pool.filter((g) => g.flags[key]);
  const supplement = (
    first: Game[],
    count: number,
    avoid = new Set<string>(),
  ) => {
    const ranked = [
      ...first,
      ...pool.filter((g) => !first.some((a) => a.id === g.id)),
    ];
    return [
      ...ranked.filter((g) => !avoid.has(g.id)),
      ...ranked.filter((g) => avoid.has(g.id)),
    ].slice(0, count);
  };
  const featured = home
    ? byFlag("isFeaturedHome")
    : supplement(byFlag("isFeaturedHome"), 6);
  const newFirst = byFlag("isNewHome").sort(
    (a, b) =>
      (b.publishedAt || "").localeCompare(a.publishedAt || "") ||
      a.id.localeCompare(b.id),
  );
  const newest = home
    ? newFirst
    : supplement(newFirst, 6, new Set(featured.map((g) => g.id)));
  const related = current.relatedGameIds.flatMap(
    (id) => pool.find((g) => g.id === id) || [],
  );
  const recommended = home
    ? byFlag("isRecommendedHome")
    : supplement(
        related,
        6,
        new Set([...featured, ...newest].map((g) => g.id)),
      );
  if (
    featured.length < 6 ||
    featured.length > 8 ||
    newest.length < 6 ||
    newest.length > 8 ||
    recommended.length !== 6
  )
    throw new Error("Recommendation inventory is incomplete");
  return { featured, newest, recommended };
}

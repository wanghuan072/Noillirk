export function safeFrameUrl(value: string): URL | null {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase().replace(/\.$/, "");
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      (u.port && u.port !== "443")
    )
      return null;
    if (
      !host.includes(".") ||
      host.includes(":") ||
      /^\d+(\.\d+){3}$/.test(host)
    )
      return null;
    if (
      [
        "localhost",
        "local",
        "internal",
        "test",
        "invalid",
        "example",
        "onion",
        "home.arpa",
        "lan",
      ].some((x) => host === x || host.endsWith("." + x))
    )
      return null;
    if (
      ["example.com", "example.net", "example.org"].some(
        (x) => host === x || host.endsWith("." + x),
      )
    )
      return null;
    return u;
  } catch {
    return null;
  }
}

export function frameOrigins(
  games: { player: { iframeSrc: string }; content?: VideoSection[] }[],
  guideSections: VideoSection[] = [],
): string[] {
  const sections = [...games.flatMap((g) => g.content || []), ...guideSections];
  const hasVideo = sections.some((s) =>
    s.blocks.some(
      (b) =>
        b.type === "video" &&
        b.provider === "youtube" &&
        /^[\w-]{11}$/.test(b.videoId || ""),
    ),
  );
  return [
    ...new Set([
      ...games.flatMap((g) => {
        const u = safeFrameUrl(g.player.iframeSrc);
        return u ? [u.origin] : [];
      }),
      ...(hasVideo ? ["https://www.youtube-nocookie.com"] : []),
    ]),
  ].sort();
}
type VideoSection = {
  blocks: { type: string; provider?: string; videoId?: string }[];
};

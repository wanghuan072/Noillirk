export function articleMedia(sections, resolveMedia) {
  return sections.flatMap((section) =>
    section.blocks.flatMap((block) => {
      if (block.type === "image") return [resolveMedia(block.src)];
      if (block.type === "video" && block.poster?.src)
        return [resolveMedia(block.poster.src)];
      return [];
    }),
  );
}

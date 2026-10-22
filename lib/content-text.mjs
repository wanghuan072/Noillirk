// Expected text in the initially visible article, without media or closed FAQ answers.
// This static metric never substitutes for final browser innerText measurement.
export function blockText(block) {
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "steps":
      return block.items.map((s) => s.title + " " + s.body).join(" ");
    case "callout":
      return (block.label || "") + " " + block.body;
    case "table":
      return [...block.columns, ...block.rows.flat()].join(" ");
    case "faq":
      return block.items.map((q) => q.question).join(" ");
    default:
      return "";
  }
}
export function articleText(sections) {
  return sections
    .map(
      (s) => (s.heading || s.title) + " " + s.blocks.map(blockText).join(" "),
    )
    .join(" ");
}
export function nonWhitespaceCharacters(text) {
  return [...text.normalize("NFC").replace(/\s/g, "")].length;
}

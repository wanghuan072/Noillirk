const fs = require("fs"),
  p = "data/site/legal.json",
  j = JSON.parse(fs.readFileSync(p));
j.terms.sections.find((s) => s.heading === "Availability and outcomes").text =
  "Games can change, become unavailable or behave differently across browsers. The website cannot guarantee a particular score, response acceptance, stored result or uninterrupted third-party connection. Explanatory examples help describe decisions and do not promise that the same answer will receive a fixed result in every version.";
const image = j.copyright.sections.find(
  (s) => s.heading === "Images and videos",
);
if (image) {
  image.heading = "Image use";
  image.text =
    "An embedded game is not permission to download its assets, and a credit is not itself a license. Game artwork remains separate from the original website design.";
  j.copyright.sections.splice(2, 0, {
    heading: "Video players",
    text: "YouTube videos, where included, remain on YouTube and are not offered as downloadable copies by this website.",
    requiresCapability: "youtubeIframes",
  });
}
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");

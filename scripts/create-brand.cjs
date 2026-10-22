const fs = require("node:fs"),
  sharp = require("sharp"),
  crypto = require("node:crypto");
const mark = `<path d="M50 7C26 7 13 25 16 45c2 16 17 35 34 49 17-14 32-33 34-49C87 25 74 7 50 7Z" fill="#ef846a"/><path d="M50 7c-11 13-16 31-13 48 2 13 7 25 13 39 7-14 12-26 14-39 3-17-2-35-14-48Z" fill="#ffc19c"/><path d="M34 88h32l-7 16H41Z" fill="#eef4dc"/><path d="M43 107c17 13 2 23-11 27" stroke="#b9d9bb" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M14 94h14M8 106h15" stroke="#b9d9bb" stroke-width="4" stroke-linecap="round"/>`;
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="84" viewBox="0 0 360 84"><g transform="translate(3 2) scale(.56)">${mark}</g><text x="70" y="57" font-family="Arial,Segoe UI,sans-serif" font-size="48" font-weight="750" letter-spacing="-2" fill="#f8f4e9">Noillirk</text></svg>`;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#123c3b"/><circle cx="383" cy="108" r="12" fill="#f2d7a3"/><g transform="translate(94 35) scale(3.2)">${mark}</g></svg>`;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="sky" x2="1" y2="1"><stop stop-color="#153f3c"/><stop offset="1" stop-color="#092b2d"/></linearGradient><linearGradient id="orb" x2="0" y2="1"><stop stop-color="#f2e3c5"/><stop offset="1" stop-color="#a8ceb1"/></linearGradient></defs><rect width="1200" height="630" rx="0" fill="url(#sky)"/><circle cx="971" cy="277" r="210" fill="#25554b"/><circle cx="968" cy="275" r="166" fill="none" stroke="#66967b" stroke-opacity=".45"/><path d="M685 560C745 366 922 466 1026 149" fill="none" stroke="#a8ceb1" stroke-width="3" stroke-dasharray="5 12"/><g opacity=".7" fill="#d4e3c1"><circle cx="742" cy="126" r="4"/><circle cx="1117" cy="162" r="5"/><circle cx="1086" cy="428" r="3"/><circle cx="644" cy="92" r="3"/></g><g transform="translate(793 69) scale(2.9)">${mark}</g><path d="M0 566C244 523 392 594 642 565s333-77 558-26v91H0Z" fill="#234e45"/><path d="M0 607c259-47 437 32 672-7s345-22 528-22v52H0Z" fill="#355f4d"/><g transform="translate(64 50) scale(.45)">${mark}</g><text x="127" y="99" font-family="Arial,Segoe UI,sans-serif" font-size="37" font-weight="700" fill="#f7f3e8">Noillirk</text><text x="68" y="249" font-family="Arial,Segoe UI,sans-serif" font-size="73" font-weight="750" letter-spacing="-3" fill="#f7f3e8">A familiar answer.</text><text x="68" y="332" font-family="Arial,Segoe UI,sans-serif" font-size="73" font-weight="750" letter-spacing="-3" fill="#c0d9b9">A little higher.</text><text x="73" y="400" font-family="Arial,Segoe UI,sans-serif" font-size="25" fill="#e0e8d9">Play Noillirk. Find your next good guess.</text><rect x="71" y="453" width="206" height="45" rx="23" fill="#ed896f"/><text x="103" y="483" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#153d39">noillirk.cc</text></svg>`;
(async () => {
  fs.mkdirSync("design/brand", { recursive: true });
  for (const [n, s] of Object.entries({ logo, icon, "og-image": og })) {
    fs.writeFileSync("design/brand/" + n + ".svg", s);
    await sharp(Buffer.from(s))
      .png()
      .toFile("public/images/" + n + ".png");
  }
  await sharp(Buffer.from(icon))
    .resize(180)
    .png()
    .toFile("public/images/apple-touch-icon.png");
  const sizes = [16, 32, 48, 64, 256];
  const images = await Promise.all(
    sizes.map((s) => sharp(Buffer.from(icon)).resize(s).png().toBuffer()),
  );
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  images.forEach((b, i) => {
    let p = 6 + i * 16;
    header[p] = sizes[i] === 256 ? 0 : sizes[i];
    header[p + 1] = header[p];
    header.writeUInt16LE(1, p + 4);
    header.writeUInt16LE(32, p + 6);
    header.writeUInt32LE(b.length, p + 8);
    header.writeUInt32LE(offset, p + 12);
    offset += b.length;
  });
  fs.writeFileSync("app/favicon.ico", Buffer.concat([header, ...images]));
  const ledger = JSON.parse(fs.readFileSync("research/media-ledger.json"));
  for (const p of [
    "/images/logo.png",
    "/images/og-image.png",
    "/images/icon.png",
    "/images/apple-touch-icon.png",
  ]) {
    let item = ledger.items.find((i) => i.localPath === p);
    if (!item) {
      item = {
        ...ledger.items.find((i) => i.id === "site-icon"),
        id: "site-apple-icon",
        localPath: p,
        usedOn: ["global"],
      };
      ledger.items.push(item);
    }
    let b = fs.readFileSync("public" + p),
      m = await sharp(b).metadata();
    Object.assign(item, {
      originalLocation: "Project-original editable SVG in design/brand",
      captureMethod: "generated-original",
      rightsBasis:
        "Original geometric balloon/ascent artwork and typography created for this website; no third-party game artwork copied.",
      capturedOrAccessedAt: "2026-10-22",
      width: m.width,
      height: m.height,
      fileBytes: b.length,
      sha256: crypto.createHash("sha256").update(b).digest("hex"),
      contentDescription: "Original Noillirk balloon-ascent brand",
      versionScope: "Site identity for noillirk.cc, not a game screenshot",
      rightsStatus: "approved",
      status: "adopted",
    });
  }
  fs.writeFileSync(
    "research/media-ledger.json",
    JSON.stringify(ledger, null, 2) + "\n",
  );
  console.log(
    "Original SVG sources, four PNGs and multi-size favicon.ico generated.",
  );
})();

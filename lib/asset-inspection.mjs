import crypto from "node:crypto";
import sharp from "sharp";
export async function inspectImage(bytes, declared) {
  const issues = [];
  const sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
  try {
    const image = sharp(bytes, { limitInputPixels: 100_000_000 });
    const metadata = await image.metadata();
    // Decode too: valid-looking headers alone do not establish a usable file.
    await image.stats();
    if (
      metadata.width !== declared.width ||
      metadata.height !== declared.height
    )
      issues.push("declared dimensions differ from actual image dimensions");
    if (declared.sha256 && sha256 !== declared.sha256)
      issues.push("adopted file hash differs");
    if (declared.fileBytes != null && bytes.length !== declared.fileBytes)
      issues.push("declared file size differs");
    if (metadata.orientation && metadata.orientation !== 1)
      issues.push("EXIF rotation must be normalized before adoption");
    return {
      actual: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        bytes: bytes.length,
        sha256,
      },
      issues,
    };
  } catch (error) {
    return {
      actual: { bytes: bytes.length, sha256 },
      issues: ["image cannot be decoded: " + error.message],
    };
  }
}

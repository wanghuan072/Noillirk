import crypto from "node:crypto";
const canonical = (v) =>
  Array.isArray(v)
    ? v.map(canonical)
    : v && typeof v === "object"
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, canonical(v[k])]),
        )
      : v;
export const fingerprint = (payload) =>
  crypto
    .createHash("sha256")
    .update(JSON.stringify(canonical(payload)))
    .digest("hex");
export function reconcile(previous, payloads, date, update = false) {
  const pages = {},
    errors = [];
  for (const [route, payload] of Object.entries(payloads)) {
    const hash = fingerprint(payload),
      old = previous[route];
    if (!old || old.fingerprint !== hash) {
      if (!update)
        errors.push(route + ": visible content fingerprint changed or is new");
      pages[route] = {
        fingerprint: hash,
        lastModified: update ? date : old?.lastModified || null,
      };
    } else pages[route] = old;
  }
  for (const route of Object.keys(previous))
    if (!Object.hasOwn(payloads, route) && !update)
      errors.push(route + ": removed from public inventory");
  return { pages, errors };
}

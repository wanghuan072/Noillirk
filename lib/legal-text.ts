export function legalText(
  text: string,
  identity: { domain: string; email: string },
) {
  return text
    .replaceAll("{domain}", identity.domain)
    .replaceAll("{email}", identity.email);
}

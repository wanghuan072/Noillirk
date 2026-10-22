export function isLocalMediaHost(host: string | null) {
  return (
    !!host && /^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(host)
  );
}

export function localMediaPolicy(gameOrigin: string, hasVideo: boolean) {
  const frames = [
    gameOrigin,
    ...(hasVideo ? ["https://www.youtube-nocookie.com"] : []),
  ];
  return `default-src 'none'; style-src 'unsafe-inline'; frame-src ${frames.join(" ")}; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`;
}

export function sidebarTop({
  previous,
  scrollDelta,
  headerHeight,
  viewportHeight,
  sidebarHeight,
}: {
  previous: number | null;
  scrollDelta: number;
  headerHeight: number;
  viewportHeight: number;
  sidebarHeight: number;
}) {
  const upper = headerHeight + 20;
  const lower = Math.min(upper, viewportHeight - sidebarHeight - 20);
  return Math.max(lower, Math.min(upper, (previous ?? upper) - scrollDelta));
}

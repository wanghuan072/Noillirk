import { breadcrumbs, crumbHref } from "@/lib/breadcrumbs";
export function Breadcrumbs({
  path,
  title,
  preview = false,
}: {
  path: string;
  title: string;
  preview?: boolean;
}) {
  const items = breadcrumbs(path, title);
  if (!items.length) return null;
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((c, i) => (
        <span key={c.path}>
          {i > 0 && <span aria-hidden="true"> / </span>}
          {i === items.length - 1 ? (
            <span aria-current="page">{c.label}</span>
          ) : (
            <a href={crumbHref(c.path, preview)}>{c.label}</a>
          )}
        </span>
      ))}
    </nav>
  );
}

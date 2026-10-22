import type { Guide } from "@/lib/types";
import { pathFor } from "@/lib/site";
import { ContentBlocks, Videos } from "./ContentBlocks";
import { Breadcrumbs } from "./Breadcrumbs";
import { getGuideById } from "@/lib/content";
export function GuideCard({
  guide,
  preview = false,
}: {
  guide: Guide;
  preview?: boolean;
}) {
  return (
    <a
      className="guide-card"
      href={pathFor(`/guides/${guide.slug}`, preview)}
      data-guide-id={guide.id}
    >
      {guide.cover.src && (
        <img
          src={guide.cover.src}
          alt={guide.cover.alt}
          width={guide.cover.width || undefined}
          height={guide.cover.height || undefined}
          loading="lazy"
        />
      )}
      <div>
        <span className="eyebrow">Player guide</span>
        <h2>{guide.title}</h2>
        <p>{guide.summary}</p>
        <span className="text-link">Read the guide →</span>
      </div>
    </a>
  );
}
export function GuidePage({
  guide,
  preview = false,
}: {
  guide: Guide;
  preview?: boolean;
}) {
  const toc = guide.sections.length >= 4;
  return (
    <>
      <Breadcrumbs
        path={`/guides/${guide.slug}`}
        title={guide.title}
        preview={preview}
      />
      <header className="guide-heading">
        <div className="guide-heading-copy">
          <span className="eyebrow">A better next climb</span>
          <h1>{guide.title}</h1>
          <p className="intro">{guide.summary}</p>
          {guide.publishedAt && (
            <p className="dates">
              Published{" "}
              <time dateTime={guide.publishedAt}>{guide.publishedAt}</time>
              {guide.updatedAt && (
                <>
                  {" "}
                  · Updated{" "}
                  <time dateTime={guide.updatedAt}>{guide.updatedAt}</time>
                </>
              )}
            </p>
          )}
          <div className="tags">
            {guide.tags.slice(0, 5).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <a className="guide-start" href={`#${guide.sections[0]?.id}`}>
            Start with the first decision <span aria-hidden="true">↓</span>
          </a>
        </div>
        {guide.cover.src && (
          <img
            className="guide-cover"
            src={guide.cover.src}
            alt={guide.cover.alt}
            width={guide.cover.width || undefined}
            height={guide.cover.height || undefined}
          />
        )}
      </header>
      <div className={toc ? "guide-layout" : "guide-layout short"}>
        {toc && (
          <nav className="guide-toc" aria-label="On this page">
            <strong>In this guide</strong>
            {guide.sections.map((s) => (
              <a href={`#${s.id}`} key={s.id}>
                {s.title}
              </a>
            ))}
          </nav>
        )}
        <article className="guide-article">
          {guide.sections.map((s, index) => (
            <section id={s.id} key={s.id}>
              <div className="guide-section-heading">
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{s.title}</h2>
              </div>
              <ContentBlocks blocks={s.blocks} />
            </section>
          ))}
          <Videos blocks={guide.sections.flatMap((s) => s.blocks)} />
          <a className="text-link" href={pathFor("/guides", preview)}>
            ← All guides
          </a>
          {guide.relatedGuideIds.length > 0 && (
            <section className="next-step">
              <h2>Keep working on your next climb</h2>
              {guide.relatedGuideIds.map((id) => {
                const related = getGuideById(id, preview);
                return related ? (
                  <GuideCard
                    key={related.id}
                    guide={related}
                    preview={preview}
                  />
                ) : null;
              })}
            </section>
          )}
        </article>
      </div>
    </>
  );
}

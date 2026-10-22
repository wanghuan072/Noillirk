import type { Block } from "@/lib/types";
export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks
        .filter((b) => b.type !== "video")
        .map((b, i) => {
          switch (b.type) {
            case "paragraph":
              return <p key={i}>{b.text}</p>;
            case "list":
              return b.style === "ordered" ? (
                <ol key={i}>
                  {b.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ol>
              ) : (
                <ul key={i}>
                  {b.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              );
            case "steps":
              return (
                <ol className="steps" key={i}>
                  {b.items.map((x) => (
                    <li key={x.title}>
                      <h3>{x.title}</h3>
                      <p>{x.body}</p>
                    </li>
                  ))}
                </ol>
              );
            case "callout":
              return (
                <aside className={`callout ${b.tone}`} key={i}>
                  {b.label && <strong>{b.label}</strong>}
                  <p>{b.body}</p>
                </aside>
              );
            case "image":
              return (
                <figure key={i}>
                  <img
                    src={b.src}
                    alt={b.alt}
                    width={b.width || undefined}
                    height={b.height || undefined}
                    loading="lazy"
                  />
                  {b.caption && <figcaption>{b.caption}</figcaption>}
                </figure>
              );
            case "table":
              return (
                <div className="table-wrap" key={i}>
                  <table>
                    <thead>
                      <tr>
                        {b.columns.map((c) => (
                          <th key={c} scope="col">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, k) => (
                        <tr key={k}>
                          {r.map((c, j) => (
                            <td key={j}>{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            case "faq":
              return (
                <div className="faq" key={i}>
                  {b.items.map((x) => (
                    <details key={x.question}>
                      <summary>{x.question}</summary>
                      <p>{x.answer}</p>
                    </details>
                  ))}
                </div>
              );
          }
        })}
    </>
  );
}
export function Videos({ blocks }: { blocks: Block[] }) {
  const videos = blocks.filter(
    (b): b is Extract<Block, { type: "video" }> => b.type === "video",
  );
  if (!videos.length) return null;
  return (
    <section className="video-section">
      <h2>See the game in motion</h2>
      {videos.map((v) => (
        <div key={v.videoId}>
          <h3>{v.title}</h3>
          <p>{v.description}</p>
          <iframe
            title={v.title}
            src={`https://www.youtube-nocookie.com/embed/${v.videoId}`}
            loading="lazy"
            allow="fullscreen; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ))}
    </section>
  );
}

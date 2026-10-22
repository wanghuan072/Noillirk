import { notFound } from "next/navigation";
import {
  getGame,
  getGuide,
  mainGame,
  previewGames,
  previewGuides,
  publishedGames,
  publishedGuides,
} from "@/lib/content";
import { legalContent } from "@/lib/legal";
import { Header, Footer } from "./Shell";
import { GamePage, GameCard } from "./GamePage";
import { GuidePage, GuideCard } from "./GuidePage";
import { Breadcrumbs } from "./Breadcrumbs";
import { StructuredData } from "./StructuredData";

export function SitePage({
  path,
  preview = false,
}: {
  path: string;
  preview?: boolean;
}) {
  let content: React.ReactNode;
  if (path === "/") {
    if (!preview && mainGame.status !== "published") notFound();
    content = <GamePage game={mainGame} preview={preview} />;
  } else if (path === "/games")
    content = (
      <>
        <Breadcrumbs path="/games" title="More Games" preview={preview} />
        <div className="page-heading">
          <span className="eyebrow">Another way to think</span>
          <h1>More Games</h1>
          <p>
            Choose a word puzzle, a logic grid, an interactive experiment or a
            creative sandbox.
          </p>
        </div>
        <div className="games-grid">
          {(preview ? previewGames() : publishedGames()).map((g) => (
            <GameCard key={g.id} game={g} preview={preview} />
          ))}
        </div>
      </>
    );
  else if (path === "/guides")
    content = (
      <>
        <Breadcrumbs path="/guides" title="Guides" preview={preview} />
        <div className="page-heading">
          <span className="eyebrow">Before the next answer</span>
          <h1>Noillirk Guides</h1>
          <p>Work on one part of your next climb.</p>
        </div>
        <div className="guide-list">
          {(preview ? previewGuides() : publishedGuides()).map((g) => (
            <GuideCard key={g.id} guide={g} preview={preview} />
          ))}
        </div>
      </>
    );
  else if (path.startsWith("/games/")) {
    const g = getGame(path.slice(7), preview);
    if (!g) notFound();
    content = <GamePage game={g} preview={preview} />;
  } else if (path.startsWith("/guides/")) {
    const g = getGuide(path.slice(8), preview);
    if (!g) notFound();
    content = <GuidePage guide={g} preview={preview} />;
  } else {
    const legal = legalContent[path.slice(1)];
    if (!legal) notFound();
    content = (
      <>
        <Breadcrumbs path={path} title={legal.title} preview={preview} />
        <article className="legal-article">
          <h1>{legal.title}</h1>
          {legal.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </article>
      </>
    );
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header preview={preview} current={path} />
      <main id="main" className="container site-main">
        {content}
      </main>
      <Footer preview={preview} />
      <StructuredData path={path} preview={preview} />
    </>
  );
}

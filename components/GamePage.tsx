import type { Game } from "@/lib/types";
import { mainGame, selections } from "@/lib/content";
import { pathFor } from "@/lib/site";
import { GamePlayer } from "./GamePlayer";
import { StickySidebar } from "./StickySidebar";
import { ContentBlocks, Videos } from "./ContentBlocks";
import { Breadcrumbs } from "./Breadcrumbs";

export function GameCard({
  game,
  preview = false,
  compact = false,
}: {
  game: Game;
  preview?: boolean;
  compact?: boolean;
}) {
  return (
    <a
      className={`game-card${compact ? " compact" : ""}`}
      href={pathFor(`/games/${game.slug}`, preview)}
      data-game-id={game.id}
    >
      {game.image.src ? (
        <div className="card-media">
          <img
            src={game.image.src}
            alt={game.image.alt}
            width={game.image.width || undefined}
            height={game.image.height || undefined}
            loading="lazy"
          />
        </div>
      ) : preview ? (
        <span className="card-diagnostic">Image unavailable</span>
      ) : null}
      <span className="card-title">
        {game.title}
        <span aria-hidden="true">↗</span>
      </span>
      {!compact && (
        <span className="card-description">{game.shortDescription}</span>
      )}
    </a>
  );
}
function Cards({
  title,
  games,
  preview,
  compact = false,
}: {
  title: string;
  games: Game[];
  preview: boolean;
  compact?: boolean;
}) {
  return (
    <section className={compact ? "sidebar-group" : "recommendations"}>
      <div className="section-heading">
        <h2>{title}</h2>
        {!compact && (
          <a href={pathFor("/games", preview)}>
            Explore more <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
      <div className={compact ? "sidebar-grid" : "recommended-grid"}>
        {games.map((g) => (
          <GameCard key={g.id} game={g} preview={preview} compact={compact} />
        ))}
      </div>
    </section>
  );
}
export function GamePage({
  game,
  preview = false,
}: {
  game: Game;
  preview?: boolean;
}) {
  const { featured, newest, recommended } = selections(game, preview);
  const playerGame = {
    id: game.id,
    title: game.title,
    image: game.image,
    player: game.player,
  };
  return (
    <div className="game-layout">
      <div className="game-main">
        {game.id !== mainGame.id && (
          <Breadcrumbs
            path={`/games/${game.slug}`}
            title={game.title}
            preview={preview}
          />
        )}
        <div className="game-heading">
          <span className="eyebrow">
            {game.id === mainGame.id
              ? "The familiar-answer climb"
              : game.tags[0]}
          </span>
          <h1>Play {game.title} Online</h1>
          <p>{game.shortDescription}</p>
        </div>
        <GamePlayer game={playerGame} diagnostic={preview} />
        <Cards
          title="Recommended Games"
          games={recommended}
          preview={preview}
        />
        <article className="game-article" data-article-game-id={game.id}>
          {game.content.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.heading}</h2>
              <ContentBlocks blocks={s.blocks} />
            </section>
          ))}
        </article>
        <Videos blocks={game.content.flatMap((s) => s.blocks)} />
        {game.id === mainGame.id && (
          <section className="next-step">
            <span className="eyebrow">Before your next climb</span>
            <h2>Make your next answer count</h2>
            <p>
              Choose a task in the guides to work on how you select an answer or
              read the result.
            </p>
            <a className="text-link" href={pathFor("/guides", preview)}>
              Find your next guide →
            </a>
          </section>
        )}
      </div>
      <StickySidebar>
        <Cards
          title="Featured Games"
          games={featured}
          preview={preview}
          compact
        />
        <Cards title="New Games" games={newest} preview={preview} compact />
      </StickySidebar>
    </div>
  );
}

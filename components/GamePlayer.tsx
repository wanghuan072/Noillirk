"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Game } from "@/lib/types";
import { safeFrameUrl } from "@/lib/security";

type State = "ready" | "loading" | "opened" | "failed" | "timed-out";
type PlayerGame = Pick<Game, "id" | "title" | "image" | "player">;
export function GamePlayer({
  game,
  diagnostic = false,
}: {
  game: PlayerGame;
  diagnostic?: boolean;
}) {
  const [state, setState] = useState<State>("ready"),
    [frameKey, setFrameKey] = useState(0),
    [frame, setFrame] = useState(false);
  const [web, setWeb] = useState(false),
    [browser, setBrowser] = useState(false),
    [notice, setNotice] = useState("");
  const root = useRef<HTMLDivElement>(null),
    iframe = useRef<HTMLIFrameElement>(null),
    webButton = useRef<HTMLButtonElement>(null),
    browserButton = useRef<HTMLButtonElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  };
  useEffect(() => () => clear(), []);
  useEffect(() => {
    const change = () =>
      setBrowser(document.fullscreenElement === root.current);
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWeb(false);
    };
    const restore = (e: PageTransitionEvent) => {
      if (e.persisted) {
        clear();
        setFrame(false);
        setState("ready");
        setWeb(false);
        setNotice("");
      }
    };
    document.addEventListener("fullscreenchange", change);
    document.addEventListener("keydown", escape);
    window.addEventListener("pageshow", restore);
    return () => {
      document.removeEventListener("fullscreenchange", change);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("pageshow", restore);
    };
  }, []);
  useEffect(() => {
    if (!web || !root.current) return;
    const oldOverflow = document.body.style.overflow,
      scroll = window.scrollY,
      returnFocus = webButton.current;
    const outside: { el: HTMLElement; inert: boolean }[] = [];
    let current: HTMLElement = root.current;
    while (current.parentElement) {
      for (const sibling of current.parentElement.children)
        if (sibling !== current && sibling instanceof HTMLElement) {
          outside.push({ el: sibling, inert: sibling.inert });
          sibling.toggleAttribute("inert", true);
        }
      current = current.parentElement;
    }
    document.body.style.overflow = "hidden";
    webButton.current?.focus();
    return () => {
      document.body.style.overflow = oldOverflow;
      outside.forEach((x) => x.el.toggleAttribute("inert", x.inert));
      window.scrollTo(0, scroll);
      returnFocus?.focus();
    };
  }, [web]);
  function launch() {
    clear();
    setNotice("");
    setFrame(false);
    if (!safeFrameUrl(game.player.iframeSrc)) {
      setState("failed");
      return;
    }
    setFrameKey((k) => k + 1);
    setState("loading");
    setFrame(true);
    timeout.current = setTimeout(() => {
      setState("timed-out");
      setFrame(false);
    }, game.player.loadTimeoutMs);
  }
  async function toggleWeb() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      setWeb((v) => !v);
    } catch {
      setNotice("The viewing mode could not change. Try again.");
    }
  }
  async function toggleBrowser() {
    setWeb(false);
    try {
      if (document.fullscreenElement === root.current) {
        await document.exitFullscreen();
        browserButton.current?.focus();
      } else if (root.current?.requestFullscreen) {
        await root.current.requestFullscreen();
        browserButton.current?.focus();
      } else setNotice("Browser fullscreen is not available on this device.");
    } catch {
      setNotice(
        "Browser fullscreen was not allowed. You can use Webpage Fullscreen.",
      );
    }
  }
  const failed = state === "failed" || state === "timed-out";
  const viewportStyle: CSSProperties & { "--player-min-height"?: string } = {
    ...(game.player.aspectRatio
      ? { aspectRatio: game.player.aspectRatio }
      : {}),
    ...(frame && game.player.minimumHeight
      ? { "--player-min-height": `${game.player.minimumHeight}px` }
      : {}),
  };
  return (
    <div
      ref={root}
      className={`game-player${web ? " webpage-fullscreen" : ""}`}
      data-game-id={game.id}
      aria-busy={state === "loading"}
    >
      <div className="player-screen" style={viewportStyle}>
        {!frame && game.image.src && (
          <img
            className="player-cover"
            src={game.image.src}
            alt={game.image.alt}
            width={game.image.width || undefined}
            height={game.image.height || undefined}
          />
        )}
        {!game.image.src && diagnostic && !frame && (
          <div className="diagnostic-surface">
            <strong>{game.title}</strong>
            <p>Cover image unavailable.</p>
          </div>
        )}
        {frame && (
          <iframe
            ref={iframe}
            key={frameKey}
            src={game.player.iframeSrc}
            title={`${game.title} game`}
            sandbox={game.player.sandbox?.join(" ")}
            allow={game.player.permissionsPolicy.join("; ")}
            referrerPolicy={game.player.referrerPolicy || undefined}
            onLoad={() => {
              clear();
              setState("opened");
              if (document.activeElement === document.body)
                iframe.current?.focus();
            }}
            onError={() => {
              clear();
              setState("failed");
              setFrame(false);
            }}
          />
        )}
        {state === "ready" && game.player.iframeSrc && (
          <button className="play-button" onClick={launch}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="m8 4 12 8-12 8Z" fill="currentColor" stroke="none" />
            </svg>
            Play Now
          </button>
        )}
        {!game.player.iframeSrc && (
          <p className="player-feedback">
            This game is not available right now.
          </p>
        )}
        {state === "loading" && (
          <p className="player-feedback" role="status">
            Opening {game.title}…
          </p>
        )}
        {failed && (
          <div className="player-feedback" role="alert">
            <p>
              {state === "timed-out"
                ? "The game took too long to open."
                : "The game could not be opened safely."}
            </p>
            <button onClick={launch}>Try again</button>
          </div>
        )}
      </div>
      <div className="player-toolbar">
        <strong>{game.title}</strong>
        <div className="player-tools">
          <button
            ref={webButton}
            disabled={state === "loading"}
            onClick={toggleWeb}
            className="icon-button"
            aria-pressed={web}
            aria-label={web ? "Exit Webpage Fullscreen" : "Webpage Fullscreen"}
            title={web ? "Exit Webpage Fullscreen" : "Webpage Fullscreen"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 3h18v18H3ZM3 8h18M8 8v13M12 17l5-5m-4 0h4v4" />
            </svg>
          </button>
          <button
            ref={browserButton}
            disabled={state === "loading"}
            onClick={toggleBrowser}
            className="icon-button"
            aria-pressed={browser}
            aria-label={
              browser ? "Exit Browser Fullscreen" : "Browser Fullscreen"
            }
            title={browser ? "Exit Browser Fullscreen" : "Browser Fullscreen"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
            </svg>
          </button>
        </div>
      </div>
      <div className="player-notes" aria-live="polite">
        {state === "opened" && (
          <>
            Game frame opened. If it stays blank,{" "}
            <button onClick={launch}>retry the game</button>.
          </>
        )}
        {notice && <span role="status">{notice}</span>}
      </div>
    </div>
  );
}

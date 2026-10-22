"use client";
import { useEffect, useRef, useState } from "react";
import { legalNavigation, navigation, pathFor, site } from "@/lib/site";

export function Header({
  preview = false,
  current = "/",
}: {
  preview?: boolean;
  current?: string;
}) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      document.documentElement.style.setProperty(
        "--header-height",
        `${el.getBoundingClientRect().height}px`,
      ),
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const compact = window.matchMedia("(max-width: 1024px)");
    const resize = () => {
      if (!compact.matches) setOpen(false);
    };
    const outside = (e: PointerEvent) => {
      if (e.target instanceof Node && !header.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    compact.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
      compact.removeEventListener("change", resize);
    };
  }, [open]);
  return (
    <header className="site-header" ref={header}>
      <div className="container header-content">
        <a
          className="brand"
          href={pathFor("/", preview)}
          aria-label={`${site.name} Home`}
        >
          <img src={site.logo} width="360" height="84" alt={site.name} />
        </a>
        <span className="brand-note">A little instinct. A little lift.</span>
        <button
          className="menu-toggle"
          ref={trigger}
          aria-controls="primary-nav"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav
          id="primary-nav"
          className={open ? "primary-nav is-open" : "primary-nav"}
          aria-label="Main navigation"
        >
          {navigation.map((n) => (
            <a
              key={n.path}
              href={pathFor(n.path, preview)}
              aria-current={current === n.path ? "page" : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
export function Footer({ preview = false }: { preview?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img src={site.logo} alt={site.name} width="180" height="42" />
          <p>
            Small questions. Thoughtful answers.
            <br />
            An independent place to play and learn.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <h2>Explore</h2>
          {navigation.map((n) => (
            <a key={n.path} href={pathFor(n.path, preview)}>
              {n.label}
            </a>
          ))}
        </nav>
        <nav aria-label="Legal">
          <h2>Legal</h2>
          {legalNavigation.map((n) => (
            <a
              key={n.path}
              href={pathFor(n.path, preview)}
              rel="noopener noreferrer nofollow"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="container copyright">
        Copyright © {process.env.NEXT_PUBLIC_BUILD_YEAR} {site.hostname}. All
        rights reserved.
      </div>
    </footer>
  );
}

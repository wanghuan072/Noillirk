"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { sidebarTop } from "@/lib/sidebar-position";
export function StickySidebar({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastY = window.scrollY;
    let offset: number | null = null;
    let scheduled: number | null = null;
    const measure = () => {
      scheduled = null;
      if (window.matchMedia("(max-width: 768px)").matches) {
        el.style.removeProperty("--sidebar-top");
        offset = null;
        lastY = window.scrollY;
        return;
      }
      const top =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 0;
      offset = sidebarTop({
        previous: offset,
        scrollDelta: window.scrollY - lastY,
        headerHeight: top,
        viewportHeight: window.innerHeight,
        sidebarHeight: el.offsetHeight,
      });
      lastY = window.scrollY;
      el.style.setProperty("--sidebar-top", `${offset}px`);
    };
    const schedule = () => {
      if (scheduled === null) scheduled = requestAnimationFrame(measure);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(el);
    resize.observe(document.documentElement);
    const header = document.querySelector(".site-header");
    if (header) resize.observe(header);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      resize.disconnect();
      if (scheduled !== null) cancelAnimationFrame(scheduled);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return (
    <aside ref={ref} className="game-sidebar" aria-label="Discover more games">
      {children}
    </aside>
  );
}

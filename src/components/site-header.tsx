import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { nav, resolveNavHref } from "@/data/site";
import { cn, focusRing } from "@/lib/cn";

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M16 3.5v8.2M16 20.3V28.5M3.5 16h8.2M20.3 16H28.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3.1" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-paper/90 backdrop-blur-md transition-colors duration-200",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper",
          focusRing,
        )}
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a
          href={pathname === "/" ? "#top" : "/"}
          className={cn("flex items-center gap-2.5 text-ink", focusRing)}
        >
          <Mark className="size-7" />
          <span className="text-sm font-medium tracking-wide">Nexus</span>
        </a>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const current = item.href === "/promptforge" && pathname === "/promptforge";
            return (
              <a
                key={item.href}
                href={resolveNavHref(item.href, pathname)}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors duration-200 hover:text-ink",
                  current ? "text-ink" : "text-muted",
                  focusRing,
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={resolveNavHref("/#talk", pathname)}
            className={cn(
              "inline-flex min-h-11 items-center bg-ink px-4 text-sm font-medium text-paper transition-colors duration-200 hover:bg-leaf active:scale-[0.96]",
              focusRing,
            )}
          >
            Talk with us
          </a>
          <button
            type="button"
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center border border-line text-sm lg:hidden",
              focusRing,
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <div
        id="mobile-nav"
        className={cn("border-t border-line lg:hidden", open ? "block" : "hidden")}
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-5 py-2 sm:px-8" aria-label="Mobile">
          {nav.map((item) => {
            const current = item.href === "/promptforge" && pathname === "/promptforge";
            return (
              <a
                key={item.href}
                href={resolveNavHref(item.href, pathname)}
                aria-current={current ? "page" : undefined}
                className={cn("min-h-11 py-3 text-base", current && "font-medium", focusRing)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

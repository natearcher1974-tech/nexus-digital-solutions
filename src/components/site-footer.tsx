import { useRouterState } from "@tanstack/react-router";
import { nav, resolveNavHref } from "@/data/site";
import { focusRing } from "@/lib/cn";

export function SiteFooter() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <footer className="border-t border-paper/15 bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-2xl">Nexus Digital Solutions</p>
          <p className="mt-2 max-w-md text-sm text-paper/70">
            Intelligence for a healthier, cleaner life. Air, care, energy, and water — judged by the
            quality of the day they leave behind.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
          {nav.map((item) => (
            <a
              key={item.href}
              href={resolveNavHref(item.href, pathname)}
              className={`min-h-11 py-2 text-sm text-paper/80 hover:text-paper ${focusRing} focus-visible:outline-paper`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={resolveNavHref("/#talk", pathname)}
            className={`min-h-11 py-2 text-sm text-paper/80 hover:text-paper ${focusRing} focus-visible:outline-paper`}
          >
            Talk
          </a>
        </nav>
      </div>
    </footer>
  );
}

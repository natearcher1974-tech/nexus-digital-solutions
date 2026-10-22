import { focusRing } from "@/lib/cn";

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:pb-24">
      <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <p className="rise text-xs font-medium tracking-widest text-leaf uppercase">
            Nexus Digital Solutions
          </p>
          <h1 className="rise rise-2 mt-4 font-serif text-4xl leading-none font-medium sm:text-5xl lg:text-6xl">
            AI, used well, makes the world healthier and cleaner.
          </h1>
          <p className="rise rise-3 mt-6 max-w-xl text-base leading-normal text-muted sm:text-lg">
            We build intelligence for the air in a classroom, the continuity of care, the power in a
            building, and the water under a street. Superior quality of life is the specification — not
            the slogan.
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap gap-3">
            <a
              href="#products"
              className={`inline-flex min-h-11 items-center bg-ink px-5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-leaf active:scale-[0.96] ${focusRing}`}
            >
              See the products
            </a>
            <a
              href="#thesis"
              className={`inline-flex min-h-11 items-center border border-line px-5 text-sm font-medium transition-colors duration-200 hover:border-ink active:scale-[0.96] ${focusRing}`}
            >
              Read the thesis
            </a>
          </div>
        </div>
        <figure className="rise rise-3 lg:col-span-6">
          <img
            src="/images/hero.jpg"
            alt="Sunlit stone atrium filled with tall indoor trees"
            width={1792}
            height={1008}
            className="aspect-[16/10] w-full object-cover"
          />
          <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm text-muted">
            <span>A building that breathes is not a metaphor.</span>
            <span className="hidden shrink-0 sm:inline">Air · Care · Energy · Water</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

import { useMemo, useState } from "react";
import { formatQuantity, places, type PlaceId } from "@/data/site";
import { cn, focusRing } from "@/lib/cn";

export function ImpactModel() {
  const [placeId, setPlaceId] = useState<PlaceId>("school");
  const [count, setCount] = useState(places[0].defaultCount);
  const place = places.find((item) => item.id === placeId) ?? places[0];

  function choose(id: PlaceId) {
    const next = places.find((item) => item.id === id) ?? places[0];
    setPlaceId(id);
    setCount(next.defaultCount);
  }

  const metrics = useMemo(
    () =>
      place.factors.map((factor) => ({
        ...factor,
        display: formatQuantity(factor.per * count),
      })),
    [place, count],
  );

  const noun = count === 1 ? place.noun.replace(/s$/, "") : place.noun;

  return (
    <section id="impact" className="scroll-mt-24 border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              An illustrative year
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight font-medium sm:text-5xl">
              What healthier looks like in a place you can name.
            </h2>
            <p className="mt-4 text-muted">
              Move the scale. The figures are a conversation model — a temperate climate, a typical
              envelope, early leak finding, ventilation that follows people. Not a bid, and not a
              guarantee.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Kind of place">
              {places.map((item) => {
                const selected = item.id === place.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => choose(item.id)}
                    className={cn(
                      "min-h-11 px-4 text-sm transition-colors duration-200",
                      selected ? "bg-ink text-paper" : "bg-foam text-ink hover:bg-leaf-soft",
                      focusRing,
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-6 font-serif text-2xl sm:text-3xl">
              A {place.label.toLowerCase()} of{" "}
              <span className="tabular-nums">{formatQuantity(count)}</span> {noun}.
            </p>
            <p className="mt-2 text-sm text-muted">{place.blurb}</p>
            <label className="mt-6 block text-sm" htmlFor="scale">
              Scale
              <input
                id="scale"
                type="range"
                min={place.min}
                max={place.max}
                step={place.step}
                value={count}
                aria-valuetext={`${formatQuantity(count)} ${noun}`}
                onChange={(event) => setCount(Number(event.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </div>

        <div aria-live="polite" className="sr-only">
          {place.label} of {formatQuantity(count)} {noun}. {metrics[0]?.display} {metrics[0]?.unit}{" "}
          {metrics[0]?.label}.
        </div>

        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <li key={metric.label} className="bg-foam px-5 py-6">
              <p className="font-serif text-3xl tabular-nums sm:text-4xl">{metric.display}</p>
              <p className="mt-1 text-xs tracking-widest text-leaf uppercase">{metric.unit}</p>
              <p className="mt-3 text-sm text-muted">{metric.label}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-sm text-muted">{place.note}</p>
        <details className="mt-4 max-w-3xl text-sm text-muted">
          <summary className={cn("min-h-11 cursor-pointer py-2", focusRing)}>
            How this model is built
          </summary>
          <p className="pb-2">
            Counts scale from a reference year. Absence days use a conservative share linked to poor
            indoor air, not every sick day. Energy assumes systems shift with occupancy instead of a
            fixed schedule. Water assumes leaks found early, not a new treatment plant. Comfort hours
            are occupied hours kept inside a band for temperature, light, and air — a quality target,
            scaled only because a larger place has more occupied hours to protect.
          </p>
        </details>
      </div>
    </section>
  );
}

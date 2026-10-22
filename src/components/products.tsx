import { useState, type KeyboardEvent } from "react";
import { Droplets, HeartPulse, Sun, Wind, type LucideIcon } from "lucide-react";
import { products, type Product } from "@/data/site";
import { cn, focusRing } from "@/lib/cn";

const icons: Record<Product["id"], LucideIcon> = {
  aether: Wind,
  vital: HeartPulse,
  lumen: Sun,
  clearwell: Droplets,
};

export function Products() {
  const [activeId, setActiveId] = useState<Product["id"]>("aether");
  const active = products.find((product) => product.id === activeId) ?? products[0];
  const Icon = icons[active.id];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % products.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (index - 1 + products.length) % products.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = products.length - 1;
    const id = products[next].id;
    setActiveId(id);
    document.getElementById(`tab-${id}`)?.focus();
  }

  return (
    <section id="products" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">The products</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight font-medium sm:text-5xl">
            Four systems. One acceptance test.
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            Did the place get healthier, cleaner, or kinder to live in? If not, the software does not
            ship as a success.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div
            role="tablist"
            aria-label="Products"
            aria-orientation="vertical"
            className="grid grid-cols-2 gap-2 lg:col-span-4 lg:grid-cols-1"
          >
            {products.map((product, index) => {
              const selected = product.id === active.id;
              const ItemIcon = icons[product.id];
              return (
                <button
                  key={product.id}
                  id={`tab-${product.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="product-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(product.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "flex min-h-16 items-center gap-3 border px-3 py-3 text-left transition-colors duration-200",
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-ink hover:border-ink",
                    focusRing,
                  )}
                >
                  <ItemIcon className="size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="block text-xs tracking-widest uppercase opacity-70">
                      {product.index} · {product.kicker}
                    </span>
                    <span className="mt-0.5 block font-medium">{product.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="product-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            className="lg:col-span-8"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
              {products.map((product) => (
                <img
                  key={product.id}
                  src={product.image}
                  alt={product.id === active.id ? product.alt : ""}
                  aria-hidden={product.id !== active.id}
                  width={1600}
                  height={1200}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                    product.id === active.id ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 text-leaf">
              <Icon className="size-4" aria-hidden="true" />
              <p className="text-xs font-medium tracking-widest uppercase">{active.kicker}</p>
            </div>
            <h3 className="mt-2 font-serif text-3xl font-medium sm:text-4xl">{active.name}</h3>
            <p className="mt-2 font-serif text-xl text-ink italic">{active.promise}</p>
            <p className="mt-4 max-w-2xl text-muted">{active.detail}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {active.outcomes.map((outcome) => (
                <li key={outcome} className="border-t border-line pt-3 text-sm">
                  {outcome}
                </li>
              ))}
            </ul>
            <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs tracking-widest text-muted uppercase">In the system</dt>
                <dd className="mt-2 text-sm">{active.modules.join(" · ")}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-widest text-muted uppercase">Where it lives</dt>
                <dd className="mt-2 text-sm">{active.places}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

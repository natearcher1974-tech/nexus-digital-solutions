import { useState } from "react";
import { steps } from "@/data/site";
import { cn, focusRing } from "@/lib/cn";

export function Approach() {
  const [openId, setOpenId] = useState(steps[0].id);

  return (
    <section id="method" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium tracking-widest text-muted uppercase">The method</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight font-medium sm:text-5xl">
              Sense. Interpret. Act. Prove.
            </h2>
            <p className="mt-4 text-muted">
              Innovation, for us, is a shorter path from a physical fact to a kinder place. Not a
              larger model for its own sake.
            </p>
          </div>
          <div className="lg:col-span-8">
            {steps.map((step) => {
              const open = step.id === openId;
              return (
                <div key={step.id} className="border-t border-line last:border-b">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(step.id)}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-6 py-5 text-left",
                      focusRing,
                    )}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-serif text-leaf">{step.index}</span>
                      <span className="font-serif text-2xl font-medium sm:text-3xl">{step.title}</span>
                    </span>
                    <span className="font-serif text-2xl text-muted" aria-hidden="true">
                      {open ? "–" : "+"}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-200 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-muted">
                        <span className="text-ink">{step.line} </span>
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

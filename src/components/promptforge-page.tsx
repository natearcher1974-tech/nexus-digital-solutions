import { useState, type FormEvent } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories, faqs, promptCount, samples, type PromptSample } from "@/data/promptforge";
import { claimSample } from "@/lib/promptforge/claim-sample";
import { promptforgeCheckoutUrl } from "@/lib/promptforge/checkout";
import type { SampleClaim } from "@/lib/promptforge/types";
import { cn, focusRing } from "@/lib/cn";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function BuyPack({ id, describedBy }: { id: string; describedBy: string }) {
  return (
    <a
      id={id}
      href={promptforgeCheckoutUrl()}
      aria-describedby={describedBy}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center bg-ink px-5 text-sm font-medium text-paper sm:w-auto",
        "transition-colors duration-200 hover:bg-leaf active:scale-[0.96]",
        focusRing,
      )}
    >
      Buy the pack
    </a>
  );
}

function CopyControl({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  const message =
    state === "copied" ? "Copied" : state === "failed" ? "Select the prompt and copy it" : "Copy";

  return (
    <button
      type="button"
      className={cn("min-h-11 px-3 text-sm text-ink underline-offset-4 hover:underline", focusRing)}
      onClick={() => void onCopy()}
      aria-label={`${message}: ${label}`}
    >
      <span aria-live="polite">{message}</span>
    </button>
  );
}

function PromptBlock({ prompt }: { prompt: PromptSample }) {
  return (
    <article className="border-t border-line py-10">
      <p className="text-xs font-medium tracking-widest text-leaf uppercase">
        {prompt.code} · {prompt.category}
      </p>
      <h3 className="mt-3 font-serif text-3xl font-medium">{prompt.title}</h3>
      <p className="mt-3 max-w-2xl text-muted">{prompt.useWhen}</p>
      <div className="mt-6 border border-line bg-foam">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4">
          <p className="text-xs tracking-widest text-muted uppercase">Paste this</p>
          <CopyControl text={prompt.body} label={prompt.title} />
        </div>
        <pre className="px-4 py-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-ink">
          {prompt.body}
        </pre>
      </div>
    </article>
  );
}

function SampleExchange() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [claim, setClaim] = useState<SampleClaim | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next = email.trim().toLowerCase();
    if (!EMAIL.test(next) || next.length > 254) {
      setError("Use an email we can actually answer.");
      return;
    }
    setError("");
    setPending(true);
    try {
      const result = await claimSample({ data: next });
      setClaim(result);
    } catch {
      setError("We couldn't save that just now. Try again in a minute.");
    } finally {
      setPending(false);
    }
  }

  if (claim) {
    return (
      <div>
        <p className="text-xs font-medium tracking-widest text-leaf uppercase">
          {claim.alreadyListed ? "Already on the list" : "Yours"}
        </p>
        <h3 className="mt-3 font-serif text-3xl font-medium">{claim.title}</h3>
        <p className="mt-3 max-w-2xl text-muted">
          {claim.alreadyListed
            ? "This address was already on the list. Here is the sample again."
            : "One prompt from the pack, in exchange for the address. The other fifty-five stay with the purchase."}
        </p>
        <p className="mt-3 text-muted">{claim.useWhen}</p>
        <div className="mt-6 border border-line bg-paper">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4">
            <p className="text-xs tracking-widest text-muted uppercase">
              {claim.code} · {claim.category}
            </p>
            <CopyControl text={claim.body} label={claim.title} />
          </div>
          <pre className="px-4 py-4 font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {claim.body}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl">
      <label className="block text-sm" htmlFor="sample-email">
        Email
        <input
          id="sample-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "sample-email-error" : "sample-email-hint"}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
        />
      </label>
      <p id="sample-email-hint" className="mt-2 text-sm text-muted">
        We show the prompt on this page. We keep the address. We do not sell the list.
      </p>
      {error ? (
        <p id="sample-email-error" role="alert" className="mt-2 text-sm text-leaf">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "mt-5 inline-flex min-h-11 items-center bg-ink px-5 text-sm font-medium text-paper",
          "transition-colors duration-200 hover:bg-leaf active:scale-[0.96] disabled:opacity-60",
          focusRing,
        )}
      >
        {pending ? "Saving…" : "Send me one prompt"}
      </button>
    </form>
  );
}

export function PromptforgePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <p className="text-xs font-medium tracking-widest text-leaf uppercase lg:col-span-8 lg:col-start-1 lg:row-start-1">
              PromptForge AI · A Nexus field kit
            </p>
            <h1 className="font-serif text-4xl leading-none font-medium sm:text-6xl lg:col-span-8 lg:col-start-1 lg:row-start-2">
              Leave class with the words that get a stranger to pay you.
            </h1>
            <div className="border border-line bg-foam p-6 sm:p-8 lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-1">
              <p className="font-serif text-5xl leading-none font-medium">$29</p>
              <p className="mt-2 text-xs tracking-widest text-muted uppercase">
                One time. No subscription.
              </p>
              <div className="mt-6">
                <BuyPack id="buy-pack" describedBy="money-back" />
              </div>
              <p id="money-back" className="mt-4 text-sm leading-relaxed text-ink">
                30-day money-back guarantee. If the pack does not earn its keep, reply to the Stripe
                receipt and the $29 comes back.
              </p>
            </div>
            <div className="lg:col-span-8 lg:col-start-1 lg:row-start-3">
              <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {promptCount} prompts for the part of a company that is not a pitch deck. Find the
                buyer, ask for the sale, publish something true, and run the week you actually have.
                Paste them tonight.
              </p>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
                Written for student founders and business students around Charleston — people at the
                College of Charleston, The Citadel, Clemson, and the University of South Carolina.
                Those schools have not reviewed this, and nothing on this page is their endorsement.
              </p>
            </div>
          </div>
        </section>

        <section id="inside" className="scroll-mt-24 border-t border-line bg-foam">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              What’s inside
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight font-medium sm:text-5xl">
              Four jobs. {promptCount} prompts. Brackets where the truth goes.
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              Fill every bracket with something you can say out loud. If you cannot, the prompt
              tells the model to drop the claim rather than invent a customer.
            </p>
            <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2">
              {categories.map((category) => (
                <li key={category.name} className="bg-foam p-6 sm:p-8">
                  <p className="text-xs tracking-widest text-muted uppercase">
                    {category.index} · {category.count} prompts
                  </p>
                  <h3 className="mt-3 font-serif text-3xl font-medium">{category.name}</h3>
                  <p className="mt-3 font-serif text-xl text-ink italic">{category.line}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{category.detail}</p>
                </li>
              ))}
            </ol>

            <div className="mt-16">
              <h3 className="font-serif text-3xl font-medium sm:text-4xl">Four, in full</h3>
              <p className="mt-3 max-w-2xl text-muted">
                The same wording as the file. The other fifty-two are in the pack, not on this page.
              </p>
              {samples.map((sample) => (
                <PromptBlock key={sample.code} prompt={sample} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink text-paper">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium tracking-widest text-honey uppercase">
                From the sale, into the marsh
              </p>
              <p className="mt-4 font-serif text-6xl leading-none font-medium sm:text-7xl">$6.97</p>
              <p className="mt-3 text-sm tracking-widest text-paper/70 uppercase">
                of every pack, about
              </p>
            </div>
            <div className="lg:col-span-7">
              <h2 className="font-serif text-3xl leading-tight font-medium sm:text-5xl">
                A quarter of the profit goes back to the water around Charleston.
              </h2>
              <p className="mt-6 max-w-xl text-paper/80">
                Twenty-five percent of the profit — about $6.97 of every sale — is set aside for
                restoration of the Intracoastal Waterway and the wetlands around Charleston. The
                harbor is not a backdrop. It is the place the work is supposed to leave better.
              </p>
              <p className="mt-4 max-w-xl text-paper/80">
                Donation receipts will be posted on this page each month, after the transfer. No
                organization is named here. That waits until someone has agreed to receive the
                money.
              </p>
            </div>
          </div>
        </section>

        <section id="sample" className="scroll-mt-24 border-t border-line">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                One, before you buy
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight font-medium sm:text-5xl">
                Trade an email for a prompt you can use on a quiet thread.
              </h2>
              <p className="mt-4 text-muted">
                Not a drip sequence. One prompt from the lead-generation section, shown here after
                you leave an address. No account.
              </p>
            </div>
            <div className="lg:col-span-7">
              <SampleExchange />
            </div>
          </div>
        </section>

        {/*
          REVIEWS — intentionally empty.
          When a real buyer gives written permission, render their words in this
          section. Do not add star ratings, sales counts, customer logos, or
          invented quotes.
        */}
        <section aria-labelledby="buyer-notes" className="border-t border-line bg-foam">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-xs font-medium tracking-widest text-muted uppercase">From buyers</p>
            <h2 id="buyer-notes" className="mt-4 font-serif text-3xl font-medium sm:text-4xl">
              Nothing here yet.
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              A note will be printed in this space only when someone who paid for the pack writes
              one and agrees to be named.
            </p>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <h2 className="font-serif text-3xl font-medium sm:text-5xl">
              Questions worth a plain answer
            </h2>
            <div className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
              {faqs.map((item) => (
                <details key={item.q} className="group">
                  <summary
                    className={cn(
                      "flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium",
                      "[&::-webkit-details-marker]:hidden",
                      focusRing,
                    )}
                  >
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="text-xl leading-none text-muted transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-5 leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl leading-tight font-medium sm:text-5xl">
                $29 once. The file follows the payment.
              </h2>
              <p id="money-back-close" className="mt-4 text-muted">
                30-day money-back guarantee. Same pack, same price, no second charge hiding behind
                the button.
              </p>
            </div>
            <BuyPack id="buy-pack-close" describedBy="money-back-close" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

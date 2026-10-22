import { useEffect, useState, type FormEvent } from "react";
import { products } from "@/data/site";
import { cn, focusRing } from "@/lib/cn";

type Fields = {
  name: string;
  organization: string;
  email: string;
  interest: string;
  note: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = {
  name: "",
  organization: "",
  email: "",
  interest: "The whole practice",
  note: "",
};

const DRAFT_KEY = "nexus-inquiry-draft";

const interests = [
  "The whole practice",
  ...products.map((product) => product.name),
  "PromptForge AI",
];

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (fields.name.trim().length < 2) errors.name = "Tell us who to reply to.";
  if (fields.organization.trim().length < 2) errors.organization = "Which place or organization?";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Use an email we can actually answer.";
  }
  if (fields.note.trim().length < 12) {
    errors.note = "A sentence is enough — what should get healthier or cleaner?";
  }
  return errors;
}

const fieldClass = cn(
  "mt-2 w-full border border-line bg-foam px-3 py-3 text-ink outline-none",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
);

export function Inquiry() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Fields | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Fields>;
      setFields({ ...empty, ...parsed });
    } catch {
      /* ignore a broken draft */
    }
  }, []);

  useEffect(() => {
    if (sent) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(fields));
  }, [fields, sent]);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next = validate(fields);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const snapshot = {
      ...fields,
      name: fields.name.trim(),
      organization: fields.organization.trim(),
      email: fields.email.trim(),
      note: fields.note.trim(),
    };
    setSent(snapshot);
    localStorage.removeItem(DRAFT_KEY);
  }

  return (
    <section id="talk" className="scroll-mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-medium tracking-widest text-honey uppercase">A conversation</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight font-medium sm:text-5xl">
            Tell us the place you want to leave healthier.
          </h2>
          <p className="mt-4 text-paper/75">
            A school, a clinic, a campus, a block. Bring the problem in physical terms — the air,
            the missed visits, the peak, the leak. We will answer in those terms.
          </p>
        </div>

        <div className="lg:col-span-7">
          {sent ? (
            <div className="border border-paper/20 bg-ink p-6 sm:p-8">
              <p className="text-xs tracking-widest text-honey uppercase">Noted</p>
              <h3 className="mt-3 font-serif text-3xl font-medium">
                {sent.name}, we have your note from {sent.organization}.
              </h3>
              <p className="mt-4 text-paper/80">
                Interest: {sent.interest}. We would reply to {sent.email}.
              </p>
              <blockquote className="mt-6 border-l border-honey pl-4 font-serif text-xl italic">
                {sent.note}
              </blockquote>
              <p className="mt-6 text-sm text-paper/70">
                This preview keeps nothing on a server. On a live Nexus desk, the note would go to
                the partnerships team — still answered as a place, not a lead score.
              </p>
              <button
                type="button"
                className={cn(
                  "mt-6 min-h-11 bg-paper px-5 text-sm font-medium text-ink active:scale-[0.96]",
                  focusRing,
                  "focus-visible:outline-paper",
                )}
                onClick={() => {
                  setSent(null);
                  setFields(empty);
                }}
              >
                Write another note
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm">
                  Name
                  <input
                    className={fieldClass}
                    value={fields.name}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    onChange={(event) => update("name", event.target.value)}
                  />
                  {errors.name ? (
                    <span className="mt-1 block text-honey" role="alert">
                      {errors.name}
                    </span>
                  ) : null}
                </label>
                <label className="text-sm">
                  Organization
                  <input
                    className={fieldClass}
                    value={fields.organization}
                    autoComplete="organization"
                    aria-invalid={Boolean(errors.organization)}
                    onChange={(event) => update("organization", event.target.value)}
                  />
                  {errors.organization ? (
                    <span className="mt-1 block text-honey" role="alert">
                      {errors.organization}
                    </span>
                  ) : null}
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm">
                  Email
                  <input
                    className={fieldClass}
                    type="email"
                    value={fields.email}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    onChange={(event) => update("email", event.target.value)}
                  />
                  {errors.email ? (
                    <span className="mt-1 block text-honey" role="alert">
                      {errors.email}
                    </span>
                  ) : null}
                </label>
                <label className="text-sm">
                  Interest
                  <select
                    className={fieldClass}
                    value={fields.interest}
                    onChange={(event) => update("interest", event.target.value)}
                  >
                    {interests.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="text-sm">
                What should change
                <textarea
                  className={cn(fieldClass, "min-h-32 resize-y")}
                  value={fields.note}
                  aria-invalid={Boolean(errors.note)}
                  onChange={(event) => update("note", event.target.value)}
                />
                {errors.note ? (
                  <span className="mt-1 block text-honey" role="alert">
                    {errors.note}
                  </span>
                ) : null}
              </label>
              <div>
                <button
                  type="submit"
                  className={cn(
                    "min-h-11 bg-paper px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-leaf-soft active:scale-[0.96]",
                    focusRing,
                    "focus-visible:outline-paper",
                  )}
                >
                  Send the note
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

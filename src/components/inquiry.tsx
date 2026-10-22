import { useEffect, useState, type FormEvent } from "react";
import { cn, focusRing } from "@/lib/cn";
import {
  INQUIRY_SAVE_ERROR,
  fieldErrorsFromZod,
  inquiryInterests,
  inquirySchema,
  type InquiryFieldErrors,
  type InquiryInput,
  type NotifyStatus,
} from "@/lib/inquiry/schema";
import { submitInquiry } from "@/lib/inquiry/submit";

type Fields = {
  name: string;
  organization: string;
  email: string;
  interest: string;
  note: string;
};

type Saved = InquiryInput & { id: number; notify: NotifyStatus };

const empty: Fields = {
  name: "",
  organization: "",
  email: "",
  interest: inquiryInterests[0],
  note: "",
};

const DRAFT_KEY = "nexus-inquiry-draft";

const fieldClass = cn(
  "mt-2 w-full border border-line bg-foam px-3 py-3 text-ink outline-none",
  "disabled:cursor-not-allowed disabled:opacity-70",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf",
);

function savedDetail(sent: Saved): string {
  if (sent.notify === "sent") {
    return `The partnerships desk has a copy, and a reply can come to ${sent.email}.`;
  }
  if (sent.notify === "failed") {
    return `We could not send the partnerships inbox a copy, but your note is on file. A reply can still come to ${sent.email}.`;
  }
  return `We have your note, and a reply can come to ${sent.email}.`;
}

export function Inquiry() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"editing" | "submitting">("editing");
  const [sent, setSent] = useState<Saved | null>(null);

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

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;

    const parsed = inquirySchema.safeParse(fields);
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error));
      setFormError(null);
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("submitting");
    try {
      const result = await submitInquiry({ data: parsed.data });
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.message);
        setStatus("editing");
        return;
      }
      localStorage.removeItem(DRAFT_KEY);
      setSent({ ...parsed.data, id: result.id, notify: result.notify });
      setStatus("editing");
    } catch {
      setFormError(INQUIRY_SAVE_ERROR);
      setStatus("editing");
    }
  }

  const busy = status === "submitting";

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
            <div className="border border-paper/20 bg-ink p-6 sm:p-8" role="status">
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
                Reference {sent.id}. {savedDetail(sent)}
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
                  setErrors({});
                  setFormError(null);
                }}
              >
                Write another note
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-5" aria-busy={busy}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm">
                  Name
                  <input
                    className={fieldClass}
                    value={fields.name}
                    autoComplete="name"
                    maxLength={120}
                    disabled={busy}
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
                    maxLength={160}
                    disabled={busy}
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
                    maxLength={254}
                    disabled={busy}
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
                    disabled={busy}
                    aria-invalid={Boolean(errors.interest)}
                    onChange={(event) => update("interest", event.target.value)}
                  >
                    {inquiryInterests.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                  {errors.interest ? (
                    <span className="mt-1 block text-honey" role="alert">
                      {errors.interest}
                    </span>
                  ) : null}
                </label>
              </div>
              <label className="text-sm">
                What should change
                <textarea
                  className={cn(fieldClass, "min-h-32 resize-y")}
                  value={fields.note}
                  maxLength={4000}
                  disabled={busy}
                  aria-invalid={Boolean(errors.note)}
                  onChange={(event) => update("note", event.target.value)}
                />
                {errors.note ? (
                  <span className="mt-1 block text-honey" role="alert">
                    {errors.note}
                  </span>
                ) : null}
              </label>
              {formError ? (
                <p
                  role="alert"
                  className="border border-honey/40 bg-honey/10 px-4 py-3 text-sm text-honey"
                >
                  {formError}
                </p>
              ) : null}
              <div>
                <button
                  type="submit"
                  disabled={busy}
                  className={cn(
                    "min-h-11 bg-paper px-5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-leaf-soft active:scale-[0.96]",
                    "disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100",
                    focusRing,
                    "focus-visible:outline-paper",
                  )}
                >
                  {busy ? "Sending the note" : "Send the note"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

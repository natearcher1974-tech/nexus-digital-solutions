import { z } from "zod";
import { products } from "../../data/site.ts";

export const inquiryInterests = [
  "The whole practice",
  ...products.map((product) => product.name),
  "PromptForge AI",
] as const;

const inquiryFieldNames = ["name", "organization", "email", "interest", "note"] as const;

export type InquiryField = (typeof inquiryFieldNames)[number];
export type InquiryFieldErrors = Partial<Record<InquiryField, string>>;

const NAME_MIN = "Tell us who to reply to.";
const ORGANIZATION_MIN = "Which place or organization?";
const EMAIL_INVALID = "Use an email we can actually answer.";
const EMAIL_LONG = "That email is too long.";
const INTEREST_INVALID = "Choose one of the practices.";
const NOTE_MIN = "A sentence is enough — what should get healthier or cleaner?";
const NOTE_LONG = "Keep the note under 4000 characters.";

function stripNull(value: string): string {
  return value.split("\u0000").join("");
}

function collapseLine(value: string): string {
  return stripNull(value)
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ +/g, " ")
    .trim();
}

function singleLine(min: number, max: number, minMessage: string, maxMessage: string) {
  return z
    .string()
    .transform(collapseLine)
    .pipe(z.string().min(min, minMessage).max(max, maxMessage));
}

export const inquirySchema = z.object({
  name: singleLine(2, 120, NAME_MIN, "Keep the name under 120 characters."),
  organization: singleLine(2, 160, ORGANIZATION_MIN, "Keep the organization under 160 characters."),
  email: z
    .string()
    .transform((value) => stripNull(value).replace(/[\r\n\t]/g, "").trim())
    .pipe(z.string().max(254, EMAIL_LONG).email(EMAIL_INVALID)),
  interest: z
    .string()
    .transform(collapseLine)
    .pipe(
      z
        .string()
        .min(1, INTEREST_INVALID)
        .max(80, INTEREST_INVALID)
        .refine(
          (value) => (inquiryInterests as readonly string[]).includes(value),
          INTEREST_INVALID,
        ),
    ),
  note: z
    .string()
    .transform((value) => stripNull(value).replace(/\r\n/g, "\n").trim())
    .pipe(z.string().min(12, NOTE_MIN).max(4000, NOTE_LONG)),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/** sent: provider accepted. skipped: no API key. failed: configured but not delivered. */
export type NotifyStatus = "sent" | "skipped" | "failed";

export const INQUIRY_SAVE_ERROR = "We could not save that note. It is still here — try again.";
export const INQUIRY_FIELD_ERROR = "Check the highlighted fields.";

function isInquiryField(value: string): value is InquiryField {
  return (inquiryFieldNames as readonly string[]).includes(value);
}

export function fieldErrorsFromZod(error: z.ZodError): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== "string" || !isInquiryField(key) || errors[key]) continue;
    errors[key] = issue.message;
  }
  return errors;
}

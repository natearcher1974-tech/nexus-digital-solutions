import { createServerFn } from "@tanstack/react-start";
import type { SampleClaim } from "@/lib/promptforge/types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmail(input: unknown): string {
  const email = String(input ?? "")
    .trim()
    .toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) {
    throw new Error("Use an email we can actually answer.");
  }
  return email;
}

export const claimSample = createServerFn({ method: "POST" })
  .validator(parseEmail)
  .handler(async ({ data }): Promise<SampleClaim> => {
    const { recordSignup } = await import("@/lib/promptforge/record-signup.server");
    try {
      return await recordSignup(data);
    } catch {
      console.error("[promptforge] signup failed");
      throw new Error("We couldn't save that just now. Try again in a minute.");
    }
  });

const DEFAULT_CHECKOUT_URL = "https://buy.stripe.com/test_3cI8wRagZcg2eHJgwyco000";

/** Stripe Payment Link. Override with VITE_PROMPTFORGE_CHECKOUT_URL. */
export function promptforgeCheckoutUrl(): string {
  const raw = import.meta.env.VITE_PROMPTFORGE_CHECKOUT_URL as string | undefined;
  const trimmed = raw?.trim() ?? "";
  if (trimmed.startsWith("https://")) return trimmed;
  return DEFAULT_CHECKOUT_URL;
}

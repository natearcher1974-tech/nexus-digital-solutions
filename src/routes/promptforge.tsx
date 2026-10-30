import { createFileRoute } from "@tanstack/react-router";
import { PromptforgePage } from "@/components/promptforge-page";
import { pageDescription, pageTitle } from "@/data/promptforge";
import { promptforgeCheckoutUrl } from "@/lib/promptforge/checkout";

export const Route = createFileRoute("/promptforge")({
  head: () => ({
    meta: [{ title: pageTitle }, { name: "description", content: pageDescription }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "PromptForge AI",
          description: pageDescription,
          brand: { "@type": "Brand", name: "Nexus Digital Solutions" },
          category: "Business prompts",
          offers: {
            "@type": "Offer",
            price: "29.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: promptforgeCheckoutUrl(),
          },
        }),
      },
    ],
  }),
  component: PromptforgePage,
});

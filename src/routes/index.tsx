import { createFileRoute } from "@tanstack/react-router";
import { Approach } from "@/components/approach";
import { FieldNotes } from "@/components/field-notes";
import { Hero } from "@/components/hero";
import { ImpactModel } from "@/components/impact-model";
import { Inquiry } from "@/components/inquiry";
import { Manifesto } from "@/components/manifesto";
import { Products } from "@/components/products";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus Digital Solutions" },
      {
        name: "description",
        content:
          "Nexus Digital Solutions builds AI so the world is healthier and cleaner — air, care, energy, and water, in service of a superior quality of life.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Manifesto />
        <Products />
        <ImpactModel />
        <Approach />
        <FieldNotes />
        <Inquiry />
      </main>
      <SiteFooter />
    </>
  );
}

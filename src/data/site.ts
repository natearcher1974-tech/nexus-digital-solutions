export type Product = {
  id: "aether" | "vital" | "lumen" | "clearwell";
  index: string;
  name: string;
  kicker: string;
  promise: string;
  detail: string;
  outcomes: string[];
  modules: string[];
  places: string;
  image: string;
  alt: string;
};

export const products: Product[] = [
  {
    id: "aether",
    index: "01",
    name: "Aether",
    kicker: "Air",
    promise: "The air people actually breathe.",
    detail:
      "Aether reads particulates, carbon dioxide, humidity, and the weather outside. Ventilation follows the room. A library that is already fine stays quiet. A cafeteria after lunch does not get to haze.",
    outcomes: [
      "Exposure falls during the hours people are inside",
      "Fans spend energy only when the air needs them",
      "Families and regulators can see the record",
    ],
    modules: ["Room sensing", "Outdoor plume watch", "Occupancy-led ventilation"],
    places: "Schools, clinics, offices, transit halls",
    image: "/images/aether.jpg",
    alt: "A small ceramic and brass air instrument on a limestone sill beside a plant",
  },
  {
    id: "vital",
    index: "02",
    name: "Vital",
    kicker: "Care",
    promise: "The appointment that actually happens.",
    detail:
      "Vital watches demand, missed visits, and the supplies that expire in a drawer. It moves the schedule toward people who need continuity, and it flags stock before it becomes waste. It does not pretend to be a clinician.",
    outcomes: [
      "More visits stay on a plan of care",
      "Less medicine and material is thrown out",
      "The week bends toward the people who were about to be missed",
    ],
    modules: ["Demand forecasting", "Continuity reminders", "Supply that expires less"],
    places: "Community clinics, specialty networks, campus health",
    image: "/images/vital.jpg",
    alt: "A quiet daylight clinic corridor with oak, linen, and a single indoor tree",
  },
  {
    id: "lumen",
    index: "03",
    name: "Lumen",
    kicker: "Energy",
    promise: "Comfort that does not cost the climate.",
    detail:
      "Lumen runs solar, storage, heating, cooling, and light as one living system. The peak falls. The room does not go dim or cold to get there. An energy badge that requires people to suffer is a failed design.",
    outcomes: [
      "Dirty peak hours shrink without a comfort penalty",
      "Solar and storage cover more of the lived day",
      "Operators can see which rooms stayed kind, and which did not",
    ],
    modules: ["Peak shifting", "Comfort-band guardrails", "Cleaner-hour scheduling"],
    places: "Campuses, hospitals, housing, civic buildings",
    image: "/images/lumen.jpg",
    alt: "A garden roof at golden hour with solar panels set among grasses",
  },
  {
    id: "clearwell",
    index: "04",
    name: "Clearwell",
    kicker: "Water",
    promise: "What leaks, and what should never have been thrown away.",
    detail:
      "Clearwell listens to pipes, treatment, and the materials a site discards. Silent leaks surface early. Discharge stays cleaner. The aim is a loop — water and material kept in use — not a longer pipe to nowhere.",
    outcomes: [
      "Hidden water loss is found before it becomes a flood or a bill",
      "Treatment stays inside its clean range",
      "Waste streams become a record, then a reduction",
    ],
    modules: ["Leak finding", "Treatment watch", "Material loops"],
    places: "Campuses, districts, housing, industry yards",
    image: "/images/clearwell.jpg",
    alt: "Clear water moving through a shallow limestone rill in a courtyard garden",
  },
];

export type PlaceId = "school" | "clinic" | "campus" | "block";

export type Place = {
  id: PlaceId;
  label: string;
  noun: string;
  min: number;
  max: number;
  step: number;
  defaultCount: number;
  blurb: string;
  note: string;
  factors: { label: string; unit: string; per: number }[];
};

export const places: Place[] = [
  {
    id: "school",
    label: "School",
    noun: "students",
    min: 180,
    max: 1800,
    step: 30,
    defaultCount: 480,
    blurb: "Classrooms, a cafeteria, and a gym that breathe on different clocks.",
    note: "Ventilation follows the room, not a timer. The library is left alone when it is already fine.",
    factors: [
      { label: "Hours in healthier classroom air", unit: "hours", per: 180 },
      { label: "Trigger-related absence days avoided", unit: "days", per: 0.35 },
      { label: "Moved off the dirty energy peak", unit: "kWh", per: 75 },
      { label: "Water kept in the system", unit: "liters", per: 920 },
    ],
  },
  {
    id: "clinic",
    label: "Clinic",
    noun: "patients",
    min: 1200,
    max: 24000,
    step: 200,
    defaultCount: 6400,
    blurb: "A week of care that keeps bending back toward the people who need it.",
    note: "Schedules move toward continuity. Stock is caught before it expires in a drawer.",
    factors: [
      { label: "Visits kept on a plan of care", unit: "visits", per: 0.08 },
      { label: "Supply kept out of the waste stream", unit: "kg", per: 0.38 },
      { label: "Clinical hours inside a healthy air band", unit: "hours", per: 7 },
      { label: "Cleaner-hour energy in the building", unit: "kWh", per: 46 },
    ],
  },
  {
    id: "campus",
    label: "Campus",
    noun: "people",
    min: 400,
    max: 8000,
    step: 100,
    defaultCount: 2200,
    blurb: "Roofs, rooms, and pipes treated as one place, not three contracts.",
    note: "The afternoon peak falls while occupied rooms stay inside a comfort band.",
    factors: [
      { label: "Energy on cleaner hours", unit: "kWh", per: 210 },
      { label: "Fossil backup hours avoided", unit: "hours", per: 0.55 },
      { label: "Water recovered from silent loss", unit: "liters", per: 2400 },
      { label: "Occupied hours held in the comfort band", unit: "hours", per: 310 },
    ],
  },
  {
    id: "block",
    label: "Neighborhood",
    noun: "households",
    min: 80,
    max: 2000,
    step: 20,
    defaultCount: 420,
    blurb: "The street, the shared building, and the water nobody can see leaking.",
    note: "The block gets easier to breathe and quieter to live on — not merely more efficient.",
    factors: [
      { label: "Hours of reduced outdoor exposure", unit: "hours", per: 42 },
      { label: "Silent leaks found", unit: "liters", per: 18000 },
      { label: "Shared-building energy eased", unit: "kWh", per: 640 },
      { label: "Cleaner common-room hours", unit: "hours", per: 90 },
    ],
  },
];

export function formatQuantity(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    const millions = n / 1_000_000;
    const digits = millions >= 10 ? 0 : 1;
    return `${millions.toFixed(digits)} million`;
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export const steps = [
  {
    id: "sense",
    index: "01",
    title: "Sense",
    line: "Only what a place can prove.",
    body: "Air, water, power, occupancy, and the calendar of care. If a number cannot be traced to a room, a pipe, or a person who was helped, it does not enter the system.",
  },
  {
    id: "interpret",
    index: "02",
    title: "Interpret",
    line: "Models in service of a body and a place.",
    body: "We train attention on what harms or helps: a plume, a missed visit, a peak that forces fossil backup, a leak that never shows on the bill until spring. Engagement is not a success metric here.",
  },
  {
    id: "act",
    index: "03",
    title: "Act",
    line: "Through the systems already installed.",
    body: "Dampers, schedules, storage, treatment, and supply rooms. Nexus does not ask a school to buy a new life. It asks the building and the clinic to behave as if health were the point.",
  },
  {
    id: "prove",
    index: "04",
    title: "Prove",
    line: "If it cannot be shown, it did not happen.",
    body: "A public-facing record of air, visits kept, energy on cleaner hours, and water recovered. The model is not the product. The change in the place is.",
  },
];

export const notes = [
  {
    place: "Harbor Annex School",
    system: "Aether · air",
    body: "After lunch the cafeteria used to haze, and teachers propped the stairwell doors. Aether now opens extraction only when particulates and carbon dioxide rise together, and leaves the library alone when the air is already good.",
  },
  {
    place: "North Meridian Clinics",
    system: "Vital · care",
    body: "Tuesday chronic-care slots were emptying while Monday acute overflowed. Vital moved the week, changed when reminders went out, and stopped expired insulin from being a monthly surprise. The clinician still decides. The schedule stops working against them.",
  },
  {
    place: "Rivergate Campus",
    system: "Lumen & Clearwell",
    body: "The garden roof now takes the afternoon peak, and the rooms stay in a comfort band while it does. A courtyard rill that was filed under landscaping was losing a swimming pool of water each month through a cracked return. It is a loop now, not a leak.",
  },
];

export const nav = [
  { href: "/#thesis", label: "Thesis" },
  { href: "/#products", label: "Products" },
  { href: "/promptforge", label: "PromptForge" },
  { href: "/#impact", label: "Impact" },
  { href: "/#method", label: "Method" },
  { href: "/#notes", label: "Notes" },
];

/** Hash links stay on the home page; from anywhere else they point back at it. */
export function resolveNavHref(href: string, pathname: string): string {
  if (pathname === "/" && href.startsWith("/#")) return href.slice(1);
  return href;
}

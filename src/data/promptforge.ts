export type PromptSample = {
  code: string;
  category: string;
  title: string;
  useWhen: string;
  body: string;
};

export const promptCount = 56;

export const categories = [
  {
    index: "01",
    name: "Lead generation",
    count: 14,
    line: "Find the people who are not in the group chat.",
    detail:
      "Walking lists, a first cold note, problem interviews, public signals, and campus asks that do not borrow a school’s name.",
  },
  {
    index: "02",
    name: "Sales",
    count: 14,
    line: "Say the number, then stop talking.",
    detail:
      "A first discovery call, a paid pilot, the student objection, a written yes, a fence around the work, and the words for getting paid.",
  },
  {
    index: "03",
    name: "Content",
    count: 14,
    line: "Publish one true thing, not a content engine.",
    detail:
      "A sentence you can repeat, a week drawn from one real conversation, a page order, and a plan for eight hours that still includes class.",
  },
  {
    index: "04",
    name: "Operations",
    count: 14,
    line: "Run the week you actually have.",
    detail:
      "A Sunday cadence, delivery steps, money categories, an exam-week handoff, and a month told without spin.",
  },
] as const;

/** Four prompts printed in full. The same text is in the paid pack. */
export const samples: PromptSample[] = [
  {
    code: "LG-01",
    category: "Lead generation",
    title: "The ten who are not in your class",
    useWhen:
      "Use when you can describe the offer and you still cannot name ten buyers who are not classmates.",
    body: `You are helping a student founder in [CITY] find the first ten conversations that could become paying customers for this offer:

Offer: [OFFER]
Price today: [PRICE]
Buyer: [BUYER]
Not for: [NOT_FOR]
Proof I can stand behind: [PROOF]
Campus I attend, which is not the market: [CAMPUS]

Rules:
- Classmates, group-chat friends, and professors are not the list, unless one of them is truly the buyer.
- Do not invent company names, quotes, market sizes, or results.
- Prefer people I could reach on foot, by a public email, or through one introduction in [CITY].
- Every prospect needs a reason they would care this month.

Return:
1. One sentence that defines the buyer well enough for a stranger to spot one.
2. Ten prospect types. For each: the role, the kind of organization, the trigger that makes this timely, the first sentence I should say out loud, and the honest reason they might say no.
3. Three places in [CITY] where these people already show up, and what to do there besides handing out a card.
4. Five kinds of leads I should refuse because they will eat a student week.

If [PROOF] is too thin to say out loud, say so in one line and name the smallest true proof I should collect before I write anyone.`,
  },
  {
    code: "SA-06",
    category: "Sales",
    title: "The honest close",
    useWhen:
      "Use when the conversation has earned a decision and you are about to hide in more explanation.",
    body: `You are helping me close a real conversation without theater. I am a student founder. The person across from me owes me nothing.

Offer: [OFFER]
Price: [PRICE]
What they said they wanted: [THEIR_WORDS]
What I am not willing to throw in for free: [BOUNDARY]
Decision I need today: [ASK]
My calendar constraint: [TIME_LEFT]

Write the close I can say in under 90 seconds, then stop talking.

Include:
1. A restatement of their problem in their words, not mine.
2. The specific thing they get, by when, and what it costs.
3. The one decision I am asking for, with a date.
4. Two sentences for silence — what I do if they pause, and what I do not fill the pause with.
5. A clean no: language that lets them decline without a fake "circle back," and asks who else actually has this problem.

Banned: false scarcity, invented clients, "no-brainer," and any line that apologizes for being a student. If being a student is relevant to the risk they are taking, address it in one plain sentence.`,
  },
  {
    code: "CO-02",
    category: "Content",
    title: "A week from one conversation",
    useWhen: "Use when you have notes from a real person and you are about to invent the rest.",
    body: `Turn one real interview into a week of publishing. Do not add facts I did not give you.

Who I talked to: [PERSON_ROLE] at [ORGANIZATION] in [CITY]
What they actually said (quotes or close paraphrase): [QUOTES]
What I am allowed to publish: [PERMISSION]
What I must not mention: [OFF_LIMITS]
My offer, if I mention it at all: [OFFER]
My voice: plain, specific, no hype. I am a student founder, not a guru.

From only that material, write:
1. A 120-word note I could send to the 40 people who already know me. Subject line included.
2. Three short posts (under 80 words) that each carry one concrete detail from the interview. No hashtags piled on. No "excited to announce."
3. One 60-second spoken script I can record on a phone, with the sentence I should cut if I run long.
4. A list of claims you refused to write because they were not in the interview.

If [PERMISSION] is unclear, do not draft public posts. Draft the permission ask instead, in my voice, under 90 words.`,
  },
  {
    code: "OP-01",
    category: "Operations",
    title: "The Sunday cadence",
    useWhen: "Use on Sunday, when the week will otherwise be a string of reactions.",
    body: `Build my operating week. I am a student running a small offer beside a full course load. Protect the course load. Do not give me a startup cosplay calendar.

Offer I am delivering: [OFFER]
Hours I can actually work this week: [HOURS]
Fixed commitments I will not move: [CLASSES_AND_JOB]
Open customer promises: [PROMISES]
Money in and money out this month: [CASH]
The one bottleneck: [BOTTLENECK]

Return a Sunday plan:
1. The three outcomes that would make the week a success, and the five tasks that do not make the list.
2. A day-by-day plan that fits inside [HOURS], with customer work before content, and content before tinkering.
3. A 20-minute Monday money check: what to look at, what to ignore.
4. The message I send if I am going to miss a promise, written now, before I need it.
5. A stop rule: the sign that I am hiding in preparation, and the next outward action to take instead.

Assume tools I already have. Do not recommend new software unless something I named is actually broken.`,
  },
];

export const faqs = [
  {
    q: "What format is the pack?",
    a: "One markdown file: 56 prompts, grouped into lead generation, sales, content, and operations. Each one has brackets to fill and a shape for the answer. Copy it into the model you already use. It is not a course, a login, or a chatbot of ours.",
  },
  {
    q: "When do I get the file?",
    a: "You pay once on Gumroad. The file is delivered with the purchase. It is not posted as a public download on this site — the pack stays off the page until payment, and fulfillment is tied to checkout rather than a link here.",
  },
  {
    q: "What if I want my money back?",
    a: "Thirty days. If the pack does not earn its keep, reply to your Gumroad receipt and we return the $29. You do not need to write an essay. The sample prompt you traded for an email is yours either way.",
  },
  {
    q: "Who is it for?",
    a: "Student founders and business students who need language for finding a buyer, asking for the sale, publishing something true, and running the week beside class. The voice on this page is for people around Charleston, including students at the College of Charleston, The Citadel, Clemson, and the University of South Carolina. Those schools did not review it and do not endorse it. A founder outside those campuses can still use every prompt.",
  },
  {
    q: "How does the donation work?",
    a: "Twenty-five percent of the profit — about $6.97 of every sale — is set aside for restoration of the Intracoastal Waterway and the wetlands around Charleston. We post the donation receipt on this page each month after the transfer. No recipient organization is named here yet. That waits until the partnership is agreed.",
  },
  {
    q: "Is Nexus part of my university?",
    a: "No. Studying at a school is not an affiliation, a partnership, or an endorsement. We will not put a university mark on this pack, and the prompts tell you not to imply one either.",
  },
] as const;

export const pageTitle = "PromptForge AI — 56 business prompts for $29 | Nexus";

export const pageDescription =
  "56 copy-paste prompts for leads, sales, content, and operations. $29 once, for student founders. Part of the profit restores Charleston waterways.";

/** LG-05 from content/promptforge/promptforge-ai.md. Server-only import. */
export const freeSample = {
  code: "LG-05",
  category: "Lead generation",
  title: "The follow-up that is not a nudge",
  useWhen:
    'Use when a good conversation went quiet and you do not want to send "just bumping this."',
  body: `Write the follow-up to a conversation that went well and then went quiet. Do not call it a "bump."

Who they are: [NAME_OR_ROLE]
Where we talked: [WHERE]
The useful thing they said: [THEIR_POINT]
What I offered: [OFFER]
When I last wrote: [LAST_TOUCH]
What I will not pretend: [NO_FAKE_URGENCY]

Give me three versions, each under 90 words:
1. The useful follow-up: one new piece of help tied to [THEIR_POINT], then a single question. No recap of my whole company.
2. The decision follow-up: used only if I already asked for a yes and they asked for time. Name the date I will close the loop, and tell them silence is an acceptable answer.
3. The last note: dignified, short, leaves the door open, does not guilt them.

For each version, mark the sentence I should delete if I do not have the fact it depends on. Do not invent a case study, a deadline, or a mutual friend.`,
};

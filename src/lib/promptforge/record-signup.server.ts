import { getSql } from "@/lib/db";
import { freeSample } from "@/lib/promptforge/free-sample";
import type { SampleClaim } from "@/lib/promptforge/types";

export async function recordSignup(email: string): Promise<SampleClaim> {
  const sql = await getSql();
  const inserted = await sql<{ id: number }>`
    insert into promptforge_signups (email)
    values (${email})
    on conflict (email) do nothing
    returning id
  `;

  return {
    ok: true,
    alreadyListed: inserted.length === 0,
    code: freeSample.code,
    category: freeSample.category,
    title: freeSample.title,
    useWhen: freeSample.useWhen,
    body: freeSample.body,
  };
}

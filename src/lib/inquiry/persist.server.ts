import { getSql } from "@/lib/db";
import type { InquiryInput, NotifyStatus } from "./schema.ts";
import { sendInquiryNotification } from "./notify.server.ts";

export type StoredInquiry = { id: number; notify: NotifyStatus };

function asId(value: unknown): number | null {
  const id = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

export async function saveInquiry(input: InquiryInput): Promise<StoredInquiry> {
  const sql = await getSql();
  const rows = await sql<{ id: number | string }>`
    insert into inquiries (name, organization, email, interest, note)
    values (${input.name}, ${input.organization}, ${input.email}, ${input.interest}, ${input.note})
    returning id
  `;
  const id = asId(rows[0]?.id);
  if (id === null) throw new Error("Inquiry insert did not return an id");

  let notify: NotifyStatus = "skipped";
  try {
    notify = await sendInquiryNotification({ id, ...input });
  } catch (err) {
    console.error(
      "[inquiry] notification failed after save",
      err instanceof Error ? err.message : "unknown error",
    );
    notify = "failed";
  }

  if (notify === "sent") {
    try {
      await sql`update inquiries set notified_at = now() where id = ${id}`;
    } catch (err) {
      console.error(
        "[inquiry] notification sent but notified_at was not stored",
        err instanceof Error ? err.message : "unknown error",
      );
    }
  }

  return { id, notify };
}

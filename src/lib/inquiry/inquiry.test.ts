import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fieldErrorsFromZod, inquiryInterests, inquirySchema } from "./schema.ts";
import {
  RESEND_EMAILS_URL,
  buildInquiryEmail,
  sendInquiryNotification,
  type InquiryNotice,
} from "./notify.server.ts";

const valid = {
  name: "Ada Lovelace",
  organization: "Harbor Annex School",
  email: "ada@harbor.example",
  interest: "Aether",
  note: "The cafeteria hazes after lunch.",
};

const notice: InquiryNotice = { id: 7, ...valid };

const configured = {
  RESEND_API_KEY: "re_test_key",
  INQUIRY_NOTIFY_EMAIL: "owner@example.com",
  INQUIRY_FROM_EMAIL: "Nexus Digital Solutions <notes@example.com>",
};

describe("inquiry schema", () => {
  it("accepts a trimmed note and the known interests", () => {
    const parsed = inquirySchema.safeParse({
      ...valid,
      name: "  Ada Lovelace  ",
      interest: inquiryInterests[1],
    });
    assert.equal(parsed.success, true);
    if (!parsed.success) return;
    assert.equal(parsed.data.name, "Ada Lovelace");
    assert.equal(parsed.data.interest, "Aether");
  });

  it("rejects a short note, a bad email, and an unknown interest", () => {
    const parsed = inquirySchema.safeParse({
      ...valid,
      email: "not-an-email",
      interest: "Everything",
      note: "too short",
    });
    assert.equal(parsed.success, false);
    if (parsed.success) return;
    const errors = fieldErrorsFromZod(parsed.error);
    assert.match(errors.email ?? "", /email/i);
    assert.match(errors.interest ?? "", /practice/i);
    assert.match(errors.note ?? "", /sentence/i);
  });

  it("collapses a line break in the name before measuring length", () => {
    const parsed = inquirySchema.safeParse({ ...valid, name: "Ada\nLovelace" });
    assert.equal(parsed.success, true);
    if (!parsed.success) return;
    assert.equal(parsed.data.name, "Ada Lovelace");
  });
});

describe("inquiry notification", () => {
  it("skips the provider when the API key is missing or blank", async () => {
    let calls = 0;
    const fetchImpl = async () => {
      calls += 1;
      return new Response("no", { status: 500 });
    };
    const missing = await sendInquiryNotification(notice, {
      env: { INQUIRY_NOTIFY_EMAIL: "owner@example.com" },
      fetchImpl,
    });
    const blank = await sendInquiryNotification(notice, {
      env: { ...configured, RESEND_API_KEY: "   " },
      fetchImpl,
    });
    assert.equal(missing, "skipped");
    assert.equal(blank, "skipped");
    assert.equal(calls, 0);
  });

  it("does not call Resend when the sender or inbox is missing", async () => {
    let calls = 0;
    const status = await sendInquiryNotification(notice, {
      env: { RESEND_API_KEY: "re_test_key" },
      fetchImpl: async () => {
        calls += 1;
        return new Response("ok", { status: 200 });
      },
    });
    assert.equal(status, "failed");
    assert.equal(calls, 0);
  });

  it("posts to Resend when fully configured", async () => {
    let captured: { url: string; init?: RequestInit } | undefined;
    const status = await sendInquiryNotification(notice, {
      env: configured,
      fetchImpl: async (url, init) => {
        captured = { url, init };
        return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
      },
    });
    assert.equal(status, "sent");
    assert.equal(captured?.url, RESEND_EMAILS_URL);
    const headers = captured?.init?.headers as Record<string, string>;
    assert.equal(headers.Authorization, "Bearer re_test_key");
    const body = JSON.parse(String(captured?.init?.body));
    assert.equal(body.from, configured.INQUIRY_FROM_EMAIL);
    assert.deepEqual(body.to, ["owner@example.com"]);
    assert.equal(body.reply_to, notice.email);
    assert.match(body.text, /Harbor Annex School/);
    assert.doesNotMatch(JSON.stringify(body), /re_test_key/);
  });

  it("returns failed when the provider errors and does not throw", async () => {
    const rejected = await sendInquiryNotification(notice, {
      env: configured,
      fetchImpl: async () => new Response("nope", { status: 422 }),
    });
    const thrown = await sendInquiryNotification(notice, {
      env: configured,
      fetchImpl: async () => {
        throw new Error("network down");
      },
    });
    assert.equal(rejected, "failed");
    assert.equal(thrown, "failed");
  });

  it("keeps a line break in a name out of the subject", () => {
    const email = buildInquiryEmail({ ...notice, name: "Ada\nLovelace" });
    assert.equal(email.subject.includes("\n"), false);
    assert.match(email.subject, /Ada Lovelace/);
    assert.match(email.text, /Reference: 7/);
  });
});

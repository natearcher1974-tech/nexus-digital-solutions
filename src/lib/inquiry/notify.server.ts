import type { InquiryInput, NotifyStatus } from "./schema.ts";

export const RESEND_EMAILS_URL = "https://api.resend.com/emails";

export type InquiryNotice = InquiryInput & { id: number };

export type NotifyConfig = {
  apiKey?: string;
  to?: string;
  from?: string;
};

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

const BARE_EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const NAMED_FROM = /^[^<>\r\n]{1,80}<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/;

const warned = new Set<string>();

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

export function isFromAddress(value: string): boolean {
  const compact = value.trim().replace(/\s+/g, " ");
  if (BARE_EMAIL.test(compact)) return true;
  const named = compact.replace(/\s*<\s*/, "<").replace(/\s*>\s*$/, ">");
  return NAMED_FROM.test(named);
}

export function readNotifyConfig(env: NodeJS.ProcessEnv = process.env): NotifyConfig {
  return {
    apiKey: clean(env.RESEND_API_KEY),
    to: clean(env.INQUIRY_NOTIFY_EMAIL),
    from: clean(env.INQUIRY_FROM_EMAIL),
  };
}

export function classifyNotifyConfig(
  config: NotifyConfig,
): "ready" | "unconfigured" | "incomplete" {
  if (!config.apiKey) return "unconfigured";
  if (!config.to || !BARE_EMAIL.test(config.to)) return "incomplete";
  if (!config.from || !isFromAddress(config.from)) return "incomplete";
  return "ready";
}

function oneLine(value: string): string {
  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildInquiryEmail(inquiry: InquiryNotice): { subject: string; text: string } {
  const subject = `Inquiry from ${oneLine(inquiry.name)} — ${oneLine(inquiry.organization)}`.slice(
    0,
    180,
  );
  const text = [
    "A new inquiry was saved.",
    `Reference: ${inquiry.id}`,
    "",
    `Name: ${inquiry.name}`,
    `Organization: ${inquiry.organization}`,
    `Email: ${inquiry.email}`,
    `Interest: ${inquiry.interest}`,
    "",
    "Note:",
    inquiry.note,
  ].join("\n");
  return { subject, text };
}

export async function sendInquiryNotification(
  inquiry: InquiryNotice,
  options: { env?: NodeJS.ProcessEnv; fetchImpl?: FetchLike } = {},
): Promise<NotifyStatus> {
  const config = readNotifyConfig(options.env ?? process.env);
  const readiness = classifyNotifyConfig(config);
  if (readiness === "unconfigured") {
    warnOnce(
      "unconfigured",
      "[inquiry] RESEND_API_KEY is not set; the inquiry is saved and owner email is skipped.",
    );
    return "skipped";
  }
  if (readiness === "incomplete" || !config.apiKey || !config.to || !config.from) {
    warnOnce(
      "incomplete",
      "[inquiry] Resend needs RESEND_API_KEY, INQUIRY_NOTIFY_EMAIL, and INQUIRY_FROM_EMAIL. Owner email was not sent.",
    );
    return "failed";
  }

  const { subject, text } = buildInquiryEmail(inquiry);
  const fetchImpl = options.fetchImpl ?? fetch;
  try {
    const response = await fetchImpl(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: inquiry.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[inquiry] Resend rejected the notification (${response.status})`,
        body.slice(0, 300),
      );
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error(
      "[inquiry] Resend request failed",
      err instanceof Error ? err.message : "unknown error",
    );
    return "failed";
  }
}

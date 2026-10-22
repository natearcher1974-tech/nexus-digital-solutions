# Nexus Digital Solutions

## Inquiry form

The conversation form stores each valid submission in the `inquiries` table
(`migrations/0002_inquiries.sql`). There is no public list or delete API.

Preview, with no `DATABASE_URL`, uses the embedded Postgres and applies that
migration on startup. A deploy applies the same file during `npm run build`.
The platform injects `DATABASE_URL`; do not commit it.

## Owner notification

Email is optional and uses [Resend](https://resend.com). Copy `.env.example`
into the host environment. All three variables are server-only.

| Variable               | Purpose                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`       | Resend API key. When it is unset, the inquiry is still saved and the form succeeds.       |
| `INQUIRY_NOTIFY_EMAIL` | Single inbox that receives each new inquiry.                                              |
| `INQUIRY_FROM_EMAIL`   | Sender Resend will accept, for example `Nexus Digital Solutions <notes@your-domain.com>`. |

A message is sent only when all three are set. A missing key, a partial
configuration, or a provider error leaves the saved row in place. The form
says so when a configured send does not go out.

Until a domain is verified, Resend accepts `onboarding@resend.dev` as the from
address and delivers only to the address on the Resend account.

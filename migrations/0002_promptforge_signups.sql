-- Public email capture for the PromptForge sample prompt.
-- Rows are unowned on purpose: the page has no accounts.
-- The only server function inserts. It never lists addresses.

create table if not exists promptforge_signups (
  id         bigserial primary key,
  email      text not null,
  created_at timestamptz not null default now(),
  constraint promptforge_signups_email_unique unique (email)
);

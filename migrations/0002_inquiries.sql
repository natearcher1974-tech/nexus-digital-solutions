-- Notes from the public inquiry form. Rows are unowned: the site has no
-- accounts. The server function inserts one row per submission and does not
-- list, update, or delete through a public API.
create table if not exists inquiries (
  id            serial primary key,
  name          text not null check (char_length(name) between 2 and 120),
  organization  text not null check (char_length(organization) between 2 and 160),
  email         text not null check (char_length(email) between 3 and 254),
  interest      text not null check (char_length(interest) between 1 and 80),
  note          text not null check (char_length(note) between 12 and 4000),
  notified_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on inquiries (created_at desc);

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null,
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_key unique (email),
  constraint waitlist_signups_email_normalized check (email = lower(btrim(email))),
  constraint waitlist_signups_email_valid check (
    char_length(email) between 3 and 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint waitlist_signups_source_valid check (source in ('hero', 'final'))
);

alter table public.waitlist_signups enable row level security;

revoke all on table public.waitlist_signups from anon, authenticated;
grant insert on table public.waitlist_signups to anon;

create policy "Allow anonymous waitlist signups"
  on public.waitlist_signups
  for insert
  to anon
  with check (true);
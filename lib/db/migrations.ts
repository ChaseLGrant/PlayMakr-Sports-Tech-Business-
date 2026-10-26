/**
 * Database migrations, applied in order and recorded in schema_migrations.
 * Never edit a migration that has shipped — add a new one instead.
 *
 * Row Level Security is enabled with no policies on every table. On Supabase
 * this blocks the public (anon) API from reading leads; the app connects with
 * a server-only DATABASE_URL as the table owner, which bypasses RLS.
 */
export const migrations: { id: string; sql: string }[] = [
  {
    id: "001_initial",
    sql: `
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new','qualified','audit_scheduled','audit_completed','proposal_sent','won','lost')),
  organization_name text not null,
  website text,
  organization_type text not null,
  locations text not null,
  annual_revenue text not null,
  employees text not null,
  customers text not null,
  biggest_problem text not null,
  current_software text,
  desired_outcome text not null,
  monthly_tech_spend text not null,
  contact_name text not null,
  email text not null,
  phone text,
  job_title text not null,
  consent_contact boolean not null,
  consent_marketing boolean not null default false,
  consent_version text not null,
  score integer not null,
  score_tier text not null,
  score_breakdown jsonb not null,
  score_flags jsonb not null default '[]'::jsonb,
  calculator_inputs jsonb,
  calculator_results jsonb,
  attribution jsonb,
  hero_variant text,
  founding_partner boolean not null default false,
  founding_enrolled_at timestamptz,
  ip_hash text,
  user_agent text
);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_email_idx on leads (email);

create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_notes_lead_idx on lead_notes (lead_id, created_at desc);

create table if not exists lead_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  title text not null,
  due_date date,
  completed_at timestamptz,
  author text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_tasks_lead_idx on lead_tasks (lead_id);
create index if not exists lead_tasks_open_idx on lead_tasks (due_date) where completed_at is null;

create table if not exists lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_status_history_lead_idx on lead_status_history (lead_id, created_at);
create index if not exists lead_status_history_to_idx on lead_status_history (to_status);

create table if not exists analytics_events (
  id bigserial primary key,
  name text not null,
  session_id text,
  variant text,
  path text,
  props jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_name_idx on analytics_events (name, created_at desc);

create table if not exists rate_limit_hits (
  key text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_limit_hits_idx on rate_limit_hits (key, created_at desc);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists admin_sessions (
  token_hash text primary key,
  admin_id uuid not null references admin_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists admin_sessions_expires_idx on admin_sessions (expires_at);

alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table lead_tasks enable row level security;
alter table lead_status_history enable row level security;
alter table analytics_events enable row level security;
alter table rate_limit_hits enable row level security;
alter table admin_users enable row level security;
alter table admin_sessions enable row level security;
`,
  },
];

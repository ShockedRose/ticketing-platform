-- PostgreSQL schema for the ticketing platform
-- Baseline DDL aligned with DATA_MODEL.md

create table if not exists buyers (
  id bigserial primary key,
  full_name text not null,
  email text not null unique,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ticket_types (
  id bigserial primary key,
  name text not null,
  description text,
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  base_price numeric(12,2) not null,
  currency text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tickets (
  id bigserial primary key,
  ticket_type_id bigint not null references ticket_types(id),
  status text not null,
  base_price numeric(12,2) not null,
  currency text not null,
  reserved_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tickets_ticket_type_id on tickets(ticket_type_id);
create index if not exists idx_tickets_status on tickets(status);

create table if not exists promo_codes (
  id bigserial primary key,
  code text not null unique,
  discount_type text not null,
  discount_value numeric(12,2) not null,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer,
  redemptions_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id bigserial primary key,
  buyer_id bigint not null references buyers(id),
  promo_code_id bigint references promo_codes(id),
  order_status text not null,
  subtotal_amount numeric(12,2) not null,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  currency text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_buyer_id on orders(buyer_id);
create index if not exists idx_orders_promo_code_id on orders(promo_code_id);
create index if not exists idx_orders_status on orders(order_status);

create table if not exists order_items (
  id bigserial primary key,
  order_id bigint not null references orders(id),
  ticket_id bigint not null references tickets(id),
  unit_price numeric(12,2) not null,
  discount_amount numeric(12,2) not null default 0,
  final_price numeric(12,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_ticket_id on order_items(ticket_id);

create table if not exists attendees (
  id bigserial primary key,
  ticket_id bigint not null unique references tickets(id),
  first_name text not null,
  last_name text not null,
  email text not null,
  job_title text not null,
  company_name text not null,
  company_url text,
  work_address text,
  country text not null,
  work_phone text,
  emergency_contact text,
  github_handle text,
  industry text not null,
  organization_type text,
  primary_role text,
  organization_represents text not null,
  first_time_kcd boolean,
  shirt_size text,
  dietary_needs text,
  disability_accommodation boolean,
  person_of_color text,
  gender_identity text,
  age_range text,
  cncf_communications_consent boolean not null default false,
  sponsor_communications_opt_in boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_attendees_ticket_id on attendees(ticket_id);
create index if not exists idx_attendees_email on attendees(email);

create table if not exists payments (
  id bigserial primary key,
  order_id bigint not null references orders(id),
  provider text not null,
  provider_reference text,
  status text not null,
  amount numeric(12,2) not null,
  currency text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_order_id on payments(order_id);
create index if not exists idx_payments_status on payments(status);

create table if not exists promo_redemptions (
  id bigserial primary key,
  promo_code_id bigint not null references promo_codes(id),
  order_id bigint not null references orders(id),
  buyer_id bigint not null references buyers(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_promo_redemptions_promo_code_id on promo_redemptions(promo_code_id);
create index if not exists idx_promo_redemptions_order_id on promo_redemptions(order_id);
create index if not exists idx_promo_redemptions_buyer_id on promo_redemptions(buyer_id);

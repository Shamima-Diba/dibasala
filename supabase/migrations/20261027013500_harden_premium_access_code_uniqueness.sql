create unique index if not exists premium_access_codes_code_ci_unique
  on public.premium_access_codes (upper(code));
alter table public.premium_access_codes
  add constraint premium_access_codes_code_format
  check (code ~ '^[A-Za-z0-9_-]{4,100}$');

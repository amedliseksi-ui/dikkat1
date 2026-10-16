-- Manager role + indexes for member admin
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check check (role in ('admin', 'manager', 'member'));

create index if not exists profiles_role_idx on profiles (role);
create index if not exists profiles_display_name_idx on profiles (display_name);

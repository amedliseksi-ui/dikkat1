create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  address text not null default '',
  city text not null default '',
  branch text not null default '',
  hours text not null default '',
  instagram text not null default '',
  iban text not null default '',
  iban_holder text not null default '',
  crypto_usdt text not null default '',
  crypto_btc text not null default '',
  about text not null default '',
  claim_code text not null default 'DIKKAT-KURUM'
);

insert into site_settings (
  id, phone, whatsapp, email, address, city, branch, hours, instagram,
  iban, iban_holder, about
) values (
  1,
  '0535 238 17 65',
  '905352381765',
  'barisguner@dikkat.com',
  'Güvenevler Mah. 1943 Sokak, Dede Apt. No:11A',
  'Yenişehir / Mersin',
  'Forum kuzey tarafı, kurslar bölgesi',
  '',
  'https://www.instagram.com/dikkat.egitim.kurumu/',
  '',
  'Mersin Dikkat Eğitim Kurumları',
  '7. sınıftan mezunlara kadar her seviye için VIP eğitim. 1, 2 veya 4 kişilik özel gruplar. İster tüm dersleri alın, ister sadece ihtiyacınız olanları. Ders gün ve saatleri size özel ayarlanır.'
)
on conflict (id) do nothing;

create table if not exists plans (
  id text primary key,
  name text not null,
  tagline text not null,
  description text not null,
  price_label text not null,
  tier int not null,
  features text not null,
  sort int not null
);

insert into plans (id, name, tagline, description, price_label, tier, features, sort) values
(
  'yazili',
  'Yazılı Hazırlık',
  '9, 10, 11 ve 12. sınıf',
  '1. dönem yazılılarınız için hazırlık grupları. Sizi biz hazırlayalım.',
  'Ücret için arayın',
  1,
  E'9, 10, 11 ve 12. sınıf\n1. dönem yazılı hazırlığı\nSoru çözümü ve deneme temposu\nFöy arşivi',
  1
),
(
  'okuma',
  'Hızlı Okuma',
  'Anlayarak hızlı okuma',
  'Bloklayarak okuma, göz sıçratma, dikkat ve görme alanı, sağ ve sol beyin egzersizleri.',
  'Ücret için arayın',
  1,
  E'Bloklayarak okuma\nGöz sıçratma\nDikkat ve görme alanı\nSağ ve sol beyin egzersizleri',
  2
),
(
  'vip',
  'VIP Özel Grup',
  '1, 2 veya 4 kişilik',
  'İster tüm dersler, ister yalnızca ihtiyacın olanlar. Gün ve saatler sana özel. 7. sınıftan mezunlara kadar.',
  'Ücret için arayın',
  2,
  E'1, 2 veya 4 kişilik özel grup\n7. sınıftan mezunlara kadar\nGün ve saat kişiye özel\nYazılı ve hızlı okuma föyleri dahil',
  3
),
(
  'birebir',
  'Birebir Ders',
  'Sana özel öğretmen',
  'Eksiğin ve hedefin tek başına ele alınır. VIP grup ve tüm föy arşivi bu pakete dahildir.',
  'Ücret için arayın',
  3,
  E'Birebir ders ve kişisel program\nVIP özel grup dahil\nTüm föy arşivi\nGün ve saat sana özel',
  4
)
on conflict (id) do nothing;

create table if not exists profiles (
  user_id text primary key,
  display_name text not null default '',
  phone text not null default '',
  role text not null default 'member' check (role in ('admin', 'member')),
  email_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists email_codes (
  user_id text primary key,
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id serial primary key,
  user_id text not null,
  plan_id text not null references plans (id),
  method text not null check (method in ('card_3ds', 'crypto', 'iban')),
  status text not null check (status in ('pending', 'approved', 'rejected')),
  reference text not null unique,
  payer_name text not null default '',
  last4 text not null default '',
  tx_hash text not null default '',
  asset text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists payments_user_idx on payments (user_id);
create index if not exists payments_status_idx on payments (status);

create table if not exists memberships (
  id serial primary key,
  user_id text not null,
  plan_id text not null references plans (id),
  payment_id int references payments (id),
  status text not null check (status in ('pending', 'active', 'rejected')),
  payer_name text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists memberships_user_idx on memberships (user_id);
create index if not exists memberships_status_idx on memberships (status);

create table if not exists foys (
  id serial primary key,
  title text not null,
  subject text not null default '',
  grade text not null default '',
  description text not null default '',
  file_name text not null,
  mime text not null default 'application/pdf',
  bytes bytea not null,
  size_bytes int not null,
  tier int not null default 1,
  created_at timestamptz not null default now()
);

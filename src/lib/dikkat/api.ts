import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export type Settings = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  branch: string;
  hours: string;
  instagram: string;
  iban: string;
  ibanHolder: string;
  cryptoUsdt: string;
  cryptoBtc: string;
  about: string;
};

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceLabel: string;
  tier: number;
  features: string[];
  sort: number;
};

export type Foy = {
  id: number;
  title: string;
  subject: string;
  grade: string;
  description: string;
  fileName: string;
  sizeBytes: number;
  tier: number;
  createdAt: string;
};

export type Membership = {
  id: number;
  planId: string;
  planName: string;
  status: "pending" | "active" | "rejected";
  payerName: string;
  note: string;
  createdAt: string;
};

export type PayMethod = "card_3ds" | "crypto" | "iban";
export type PayStatus = "pending" | "approved" | "rejected";

export type Payment = {
  id: number;
  planId: string;
  planName: string;
  method: PayMethod;
  status: PayStatus;
  reference: string;
  payerName: string;
  last4: string;
  txHash: string;
  asset: string;
  note: string;
  createdAt: string;
};

export type Me = {
  displayName: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "member";
  adminExists: boolean;
  emailVerified: boolean;
  tier: number;
  memberships: Membership[];
  payments: Payment[];
};

export type AdminPayment = Payment & { email: string; displayName: string };

const MAX_PDF = 3 * 1024 * 1024;

function clip(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function asStatus(value: string): Membership["status"] {
  if (value === "active" || value === "rejected" || value === "pending") return value;
  return "pending";
}

function asPayStatus(value: string): PayStatus {
  if (value === "approved" || value === "rejected" || value === "pending") return value;
  return "pending";
}

function asBool(value: unknown) {
  return value === true || value === "t" || value === "true" || value === 1;
}

function asMethod(value: string): PayMethod {
  if (value === "card_3ds" || value === "crypto" || value === "iban") return value;
  return "iban";
}

function toBuffer(value: unknown): Buffer {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === "string") {
    if (value.startsWith("\\x")) return Buffer.from(value.slice(2), "hex");
    return Buffer.from(value, "base64");
  }
  throw new Error("Dosya okunamadı.");
}

type SettingsRow = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  branch: string;
  hours: string;
  instagram: string;
  iban: string;
  iban_holder: string;
  crypto_usdt: string;
  crypto_btc: string;
  about: string;
};

function mapSettings(row: SettingsRow): Settings {
  return {
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    city: row.city,
    branch: row.branch,
    hours: row.hours,
    instagram: row.instagram,
    iban: row.iban,
    ibanHolder: row.iban_holder,
    cryptoUsdt: row.crypto_usdt,
    cryptoBtc: row.crypto_btc,
    about: row.about,
  };
}

async function ensureProfile(userId: string) {
  const sql = await getSql();
  const users = await sql<{ name: string; email: string; verified: boolean }>`
    select name, email, "emailVerified" as verified from "user" where id = ${userId}
  `;
  const name = users[0]?.name ?? "";
  const email = (users[0]?.email ?? "").toLowerCase();
  const verified = asBool(users[0]?.verified);
  const isAdminEmail = email === "barisguner@dikkat.com";
  // Admin e-posta otomatik doğrulanmış ve yönetici sayılır.
  if (isAdminEmail) {
    await sql`update "user" set "emailVerified" = true where id = ${userId}`;
  }
  await sql`
    insert into profiles (user_id, display_name, email_verified, role)
    values (${userId}, ${name}, ${verified || isAdminEmail}, ${isAdminEmail ? "admin" : "member"})
    on conflict (user_id) do nothing
  `;
  if (verified || isAdminEmail) {
    await sql`
      update profiles set email_verified = true where user_id = ${userId} and email_verified = false
    `;
  }
  if (isAdminEmail) {
    await sql`update profiles set role = 'admin' where user_id = ${userId}`;
  }
  return sql;
}

async function requireAdmin(userId: string) {
  const sql = await ensureProfile(userId);
  const rows = await sql<{ role: string }>`
    select role from profiles where user_id = ${userId}
  `;
  const role = rows[0]?.role;
  // admin ve manager yönetim paneline girebilir
  if (role !== "admin" && role !== "manager") {
    throw new Error("Bu işlem yalnızca kurum yönetimine açık.");
  }
  return sql;
}

async function requireFullAdmin(userId: string) {
  const sql = await ensureProfile(userId);
  const rows = await sql<{ role: string }>`
    select role from profiles where user_id = ${userId}
  `;
  if (rows[0]?.role !== "admin") {
    throw new Error("Bu işlem yalnızca tam yöneticiye açık.");
  }
  return sql;
}

async function codeHash(userId: string, code: string) {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(`${userId}:${code}`).digest("hex");
}

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<SettingsRow>`
    select phone, whatsapp, email, address, city, branch, hours, instagram,
           iban, iban_holder, crypto_usdt, crypto_btc, about
    from site_settings where id = 1
  `;
  if (!rows[0]) throw new Error("Ayarlar bulunamadı.");
  return mapSettings(rows[0]);
});

export const listPlans = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    name: string;
    tagline: string;
    description: string;
    price_label: string;
    tier: number;
    features: string;
    sort: number;
  }>`
    select id, name, tagline, description, price_label, tier, features, sort
    from plans order by sort
  `;
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    priceLabel: row.price_label,
    tier: row.tier,
    features: row.features.split("\n").map((line) => line.trim()).filter(Boolean),
    sort: row.sort,
  })) satisfies Plan[];
});

export const listFoys = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: number;
    title: string;
    subject: string;
    grade: string;
    description: string;
    file_name: string;
    size_bytes: number;
    tier: number;
    created_at: string;
  }>`
    select id, title, subject, grade, description, file_name, size_bytes, tier, created_at::text as created_at
    from foys order by created_at desc
  `;
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    subject: row.subject,
    grade: row.grade,
    description: row.description,
    fileName: row.file_name,
    sizeBytes: row.size_bytes,
    tier: row.tier,
    createdAt: row.created_at,
  })) satisfies Foy[];
});

type PayRow = {
  id: number;
  plan_id: string;
  plan_name: string;
  method: string;
  status: string;
  reference: string;
  payer_name: string;
  last4: string;
  tx_hash: string;
  asset: string;
  note: string;
  created_at: string;
};

function mapPayment(row: PayRow): Payment {
  return {
    id: row.id,
    planId: row.plan_id,
    planName: row.plan_name,
    method: asMethod(row.method),
    status: asPayStatus(row.status),
    reference: row.reference,
    payerName: row.payer_name,
    last4: row.last4,
    txHash: row.tx_hash,
    asset: row.asset,
    note: row.note,
    createdAt: row.created_at,
  };
}

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Me> => {
    const sql = await ensureProfile(context.userId);
    const profiles = await sql<{
      display_name: string;
      phone: string;
      role: "admin" | "manager" | "member";
      email_verified: boolean;
    }>`
      select display_name, phone, role, email_verified from profiles where user_id = ${context.userId}
    `;
    const users = await sql<{ email: string }>`
      select email from "user" where id = ${context.userId}
    `;
    const admins = await sql<{ n: number }>`
      select count(*)::int as n from profiles where role = 'admin'
    `;
    const memberships = await sql<{
      id: number;
      plan_id: string;
      plan_name: string;
      status: string;
      payer_name: string;
      note: string;
      created_at: string;
    }>`
      select m.id, m.plan_id, p.name as plan_name, m.status, m.payer_name, m.note, m.created_at::text as created_at
      from memberships m
      join plans p on p.id = m.plan_id
      where m.user_id = ${context.userId}
      order by m.created_at desc
    `;
    const payments = await sql<PayRow>`
      select pay.id, pay.plan_id, p.name as plan_name, pay.method, pay.status, pay.reference,
             pay.payer_name, pay.last4, pay.tx_hash, pay.asset, pay.note, pay.created_at::text as created_at
      from payments pay
      join plans p on p.id = pay.plan_id
      where pay.user_id = ${context.userId}
      order by pay.created_at desc
    `;
    const tierRow = await sql<{ tier: number }>`
      select coalesce(max(p.tier), 0)::int as tier
      from memberships m
      join plans p on p.id = m.plan_id
      where m.user_id = ${context.userId} and m.status = 'active'
    `;
    const profile = profiles[0];
    return {
      displayName: profile?.display_name ?? "",
      email: users[0]?.email ?? "",
      phone: profile?.phone ?? "",
      role: profile?.role === "admin" ? "admin" : profile?.role === "manager" ? "manager" : "member",
      adminExists: (admins[0]?.n ?? 0) > 0,
      emailVerified: asBool(profile?.email_verified),
      tier: tierRow[0]?.tier ?? 0,
      memberships: memberships.map((row) => ({
        id: row.id,
        planId: row.plan_id,
        planName: row.plan_name,
        status: asStatus(row.status),
        payerName: row.payer_name,
        note: row.note,
        createdAt: row.created_at,
      })),
      payments: payments.map(mapPayment),
    };
  });

type ProfileInput = { displayName: string; phone: string };

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: ProfileInput): ProfileInput => ({
    displayName: clip(input?.displayName, 120),
    phone: clip(input?.phone, 40),
  }))
  .handler(async ({ context, data }) => {
    const sql = await ensureProfile(context.userId);
    await sql`
      update profiles
      set display_name = ${data.displayName}, phone = ${data.phone}
      where user_id = ${context.userId}
    `;
    if (data.displayName) {
      await sql`update "user" set name = ${data.displayName} where id = ${context.userId}`;
    }
    return { ok: true as const };
  });

export const sendEmailCode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await ensureProfile(context.userId);
    const users = await sql<{ email: string; verified: boolean }>`
      select email, "emailVerified" as verified from "user" where id = ${context.userId}
    `;
    const email = users[0]?.email ?? "";
    if (!email) throw new Error("Hesapta e-posta yok.");
    if (asBool(users[0]?.verified)) {
      await sql`update profiles set email_verified = true where user_id = ${context.userId}`;
      return { ok: true as const, delivered: true, previewCode: null as string | null, already: true };
    }
    const recent = await sql<{ age: number }>`
      select extract(epoch from (now() - created_at))::int as age
      from email_codes where user_id = ${context.userId}
    `;
    if (recent[0] && recent[0].age < 30) {
      throw new Error("Yeni kod için 30 saniye bekleyin.");
    }
    const { randomInt } = await import("node:crypto");
    const code = String(randomInt(0, 1000000)).padStart(6, "0");
    const hash = await codeHash(context.userId, code);
    await sql`
      insert into email_codes (user_id, code_hash, attempts, expires_at, created_at)
      values (${context.userId}, ${hash}, 0, now() + interval '15 minutes', now())
      on conflict (user_id) do update
      set code_hash = ${hash}, attempts = 0, expires_at = now() + interval '15 minutes', created_at = now()
    `;
    const { sendMail } = await import("./mailer.server");
    const settings = await sql<{ phone: string }>`select phone from site_settings where id = 1`;
    const phone = settings[0]?.phone || "0535 238 17 65";
    const delivered = await sendMail(
      email,
      "Dikkat Eğitim doğrulama kodunuz",
      `Mersin Dikkat Eğitim Kurumları\n\nDoğrulama kodunuz: ${code}\n\nKod 15 dakika geçerlidir. Bu işlemi siz yapmadıysanız iletiyi yok sayın.\n\nTelefon: ${phone}`,
    );
    return {
      ok: true as const,
      delivered,
      previewCode: delivered ? null : code,
      already: false,
    };
  });

export const verifyEmailCode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((code: string) => clip(code, 8).replace(/\s/g, ""))
  .handler(async ({ context, data: code }) => {
    if (!/^\d{6}$/.test(code)) throw new Error("6 haneli kodu yazın.");
    const sql = await ensureProfile(context.userId);
    const rows = await sql<{ code_hash: string; attempts: number; fresh: boolean }>`
      select code_hash, attempts, (expires_at > now()) as fresh
      from email_codes where user_id = ${context.userId}
    `;
    const row = rows[0];
    if (!row || !asBool(row.fresh)) throw new Error("Kodun süresi doldu. Yeni kod isteyin.");
    if (row.attempts >= 8) throw new Error("Çok fazla deneme. Yeni kod isteyin.");
    const hash = await codeHash(context.userId, code);
    if (hash !== row.code_hash) {
      await sql`update email_codes set attempts = attempts + 1 where user_id = ${context.userId}`;
      throw new Error("Kod hatalı.");
    }
    await sql`update profiles set email_verified = true where user_id = ${context.userId}`;
    await sql`update "user" set "emailVerified" = true where id = ${context.userId}`;
    await sql`delete from email_codes where user_id = ${context.userId}`;
    return { ok: true as const };
  });

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((code: string) => clip(code, 80))
  .handler(async ({ context, data: code }) => {
    const sql = await ensureProfile(context.userId);
    const admins = await sql<{ n: number }>`
      select count(*)::int as n from profiles where role = 'admin'
    `;
    if ((admins[0]?.n ?? 0) > 0) throw new Error("Yönetici zaten belirlenmiş.");
    const rows = await sql<{ claim_code: string }>`
      select claim_code from site_settings where id = 1
    `;
    if (!code || rows[0]?.claim_code !== code) throw new Error("Sahip kodu hatalı.");
    await sql`update profiles set role = 'admin' where user_id = ${context.userId}`;
    return { ok: true as const };
  });

type SettingsInput = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  branch: string;
  hours: string;
  instagram: string;
  iban: string;
  ibanHolder: string;
  cryptoUsdt: string;
  cryptoBtc: string;
  about: string;
};

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: SettingsInput): SettingsInput => ({
    phone: clip(input?.phone, 40),
    whatsapp: clip(input?.whatsapp, 40),
    email: clip(input?.email, 120),
    address: clip(input?.address, 300),
    city: clip(input?.city, 80),
    branch: clip(input?.branch, 200),
    hours: clip(input?.hours, 200),
    instagram: clip(input?.instagram, 200),
    iban: clip(input?.iban, 42).replace(/\s+/g, "").toUpperCase(),
    ibanHolder: clip(input?.ibanHolder, 120),
    cryptoUsdt: clip(input?.cryptoUsdt, 120),
    cryptoBtc: clip(input?.cryptoBtc, 120),
    about: clip(input?.about, 1200),
  }))
  .handler(async ({ context, data }) => {
    const sql = await requireAdmin(context.userId);
    if (data.iban && !/^TR\d{24}$/.test(data.iban)) {
      throw new Error("IBAN, TR ile başlayan 26 karakter olmalı.");
    }
    await sql`
      update site_settings set
        phone = ${data.phone},
        whatsapp = ${data.whatsapp},
        email = ${data.email},
        address = ${data.address},
        city = ${data.city},
        branch = ${data.branch},
        hours = ${data.hours},
        instagram = ${data.instagram},
        iban = ${data.iban},
        iban_holder = ${data.ibanHolder},
        crypto_usdt = ${data.cryptoUsdt},
        crypto_btc = ${data.cryptoBtc},
        about = ${data.about}
      where id = 1
    `;
    return { ok: true as const };
  });

type PlanInput = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  priceLabel: string;
  features: string;
};

export const updatePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: PlanInput): PlanInput => ({
    id: clip(input?.id, 40),
    name: clip(input?.name, 80),
    tagline: clip(input?.tagline, 120),
    description: clip(input?.description, 600),
    priceLabel: clip(input?.priceLabel, 80),
    features: clip(input?.features, 800),
  }))
  .handler(async ({ context, data }) => {
    const sql = await requireAdmin(context.userId);
    if (!data.name || !data.priceLabel) throw new Error("Paket adı ve fiyat yazısı gerekli.");
    const updated = await sql`
      update plans set
        name = ${data.name},
        tagline = ${data.tagline},
        description = ${data.description},
        price_label = ${data.priceLabel},
        features = ${data.features}
      where id = ${data.id}
      returning id
    `;
    if (!updated.length) throw new Error("Paket bulunamadı.");
    return { ok: true as const };
  });

type PayInput = {
  planId: string;
  method: PayMethod;
  payerName: string;
  note: string;
  last4: string;
  txHash: string;
  asset: "" | "usdt" | "btc";
};

export const createPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: PayInput): PayInput => {
    const method = input?.method;
    const asset = input?.asset;
    return {
      planId: clip(input?.planId, 40),
      method: method === "card_3ds" || method === "crypto" || method === "iban" ? method : "iban",
      payerName: clip(input?.payerName, 120),
      note: clip(input?.note, 300),
      last4: clip(input?.last4, 4),
      txHash: clip(input?.txHash, 120),
      asset: asset === "usdt" || asset === "btc" ? asset : "",
    };
  })
  .handler(async ({ context, data }) => {
    if (!data.payerName) throw new Error("Ad soyad yazın.");
    const sql = await ensureProfile(context.userId);
    const profiles = await sql<{ email_verified: boolean }>`
      select email_verified from profiles where user_id = ${context.userId}
    `;
    if (!asBool(profiles[0]?.email_verified)) {
      throw new Error("Ödeme için önce e-postanızı doğrulayın.");
    }
    const settings = await sql<SettingsRow>`
      select phone, whatsapp, email, address, city, branch, hours, instagram,
             iban, iban_holder, crypto_usdt, crypto_btc, about
      from site_settings where id = 1
    `;
    const site = settings[0];
    if (!site) throw new Error("Ayarlar bulunamadı.");
    if (data.method === "card_3ds" && !/^\d{4}$/.test(data.last4)) {
      throw new Error("Kartın son 4 hanesi gerekli.");
    }
    if (data.method === "iban" && !site.iban) {
      throw new Error(`IBAN henüz yayınlanmadı. Lütfen ${site.phone || "0535 238 17 65"} numarasını arayın.`);
    }
    if (data.method === "crypto") {
      if (data.asset !== "usdt" && data.asset !== "btc") throw new Error("Ağ seçin.");
      const wallet = data.asset === "btc" ? site.crypto_btc : site.crypto_usdt;
      if (!wallet) {
        throw new Error(`Kripto adresi henüz tanımlı değil. Lütfen ${site.phone || "0535 238 17 65"} numarasını arayın.`);
      }
      if (data.txHash.length < 8) throw new Error("İşlem karmasını (TX) yazın.");
    }
    const plans = await sql<{ id: string }>`select id from plans where id = ${data.planId}`;
    if (!plans.length) throw new Error("Program bulunamadı.");
    const open = await sql<{ id: number }>`
      select id from memberships
      where user_id = ${context.userId}
        and plan_id = ${data.planId}
        and status in ('pending', 'active')
    `;
    if (open.length) throw new Error("Bu program için bekleyen veya açık bir kaydınız var.");
    const { randomInt } = await import("node:crypto");
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let reference = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      let s = "DKT-";
      for (let i = 0; i < 6; i++) s += alphabet[randomInt(alphabet.length)];
      const clash = await sql<{ id: number }>`select id from payments where reference = ${s}`;
      if (!clash.length) {
        reference = s;
        break;
      }
    }
    if (!reference) throw new Error("Referans üretilemedi. Tekrar deneyin.");
    const inserted = await sql<{ id: number }>`
      insert into payments (
        user_id, plan_id, method, status, reference, payer_name, last4, tx_hash, asset, note
      ) values (
        ${context.userId},
        ${data.planId},
        ${data.method},
        'pending',
        ${reference},
        ${data.payerName},
        ${data.method === "card_3ds" ? data.last4 : ""},
        ${data.method === "crypto" ? data.txHash : ""},
        ${data.method === "crypto" ? data.asset : ""},
        ${data.note}
      )
      returning id
    `;
    const paymentId = inserted[0]?.id;
    if (!paymentId) throw new Error("Ödeme kaydı açılamadı.");
    await sql`
      insert into memberships (user_id, plan_id, payment_id, status, payer_name, note)
      values (${context.userId}, ${data.planId}, ${paymentId}, 'pending', ${data.payerName}, ${data.note})
    `;
    return { ok: true as const, reference, id: paymentId };
  });

export const listPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminPayment[]> => {
    const sql = await requireAdmin(context.userId);
    const rows = await sql<PayRow & { email: string; display_name: string }>`
      select pay.id, pay.plan_id, p.name as plan_name, pay.method, pay.status, pay.reference,
             pay.payer_name, pay.last4, pay.tx_hash, pay.asset, pay.note, pay.created_at::text as created_at,
             u.email, coalesce(pr.display_name, '') as display_name
      from payments pay
      join plans p on p.id = pay.plan_id
      join "user" u on u.id = pay.user_id
      left join profiles pr on pr.user_id = pay.user_id
      order by pay.created_at desc
    `;
    return rows.map((row) => ({
      ...mapPayment(row),
      email: row.email,
      displayName: row.display_name,
    }));
  });

export const setPaymentStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; status: PayStatus }) => ({
    id: Number(input?.id),
    status: input?.status,
  }))
  .handler(async ({ context, data }) => {
    if (!Number.isInteger(data.id)) throw new Error("Kayıt bulunamadı.");
    if (data.status !== "approved" && data.status !== "rejected" && data.status !== "pending") {
      throw new Error("Geçersiz durum.");
    }
    const sql = await requireAdmin(context.userId);
    const updated = await sql`
      update payments set status = ${data.status} where id = ${data.id} returning id
    `;
    if (!updated.length) throw new Error("Ödeme bulunamadı.");
    const membershipStatus =
      data.status === "approved" ? "active" : data.status === "rejected" ? "rejected" : "pending";
    await sql`
      update memberships set status = ${membershipStatus} where payment_id = ${data.id}
    `;
    return { ok: true as const };
  });

type FoyInput = {
  title: string;
  subject: string;
  grade: string;
  description: string;
  fileName: string;
  tier: number;
  base64: string;
};

export const uploadFoy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: FoyInput): FoyInput => ({
    title: clip(input?.title, 140),
    subject: clip(input?.subject, 80),
    grade: clip(input?.grade, 40),
    description: clip(input?.description, 400),
    fileName: clip(input?.fileName, 180),
    tier: Number(input?.tier) || 1,
    base64: typeof input?.base64 === "string" ? input.base64 : "",
  }))
  .handler(async ({ context, data }) => {
    if (!data.title) throw new Error("Föy başlığı yazın.");
    if (data.tier < 1 || data.tier > 3) throw new Error("Erişim düzeyi geçersiz.");
    const clean = data.base64.replace(/^data:application\/pdf;base64,/, "");
    if (clean.length > 4_200_000) throw new Error("PDF en fazla 3 MB olabilir.");
    const buf = Buffer.from(clean, "base64");
    if (buf.length < 5 || buf.length > MAX_PDF) throw new Error("PDF en fazla 3 MB olabilir.");
    if (buf.subarray(0, 5).toString() !== "%PDF-") throw new Error("Yalnızca PDF yükleyebilirsiniz.");
    const fileName = data.fileName.toLowerCase().endsWith(".pdf") ? data.fileName : `${data.fileName || "foy"}.pdf`;
    const sql = await requireAdmin(context.userId);
    await sql`
      insert into foys (title, subject, grade, description, file_name, bytes, size_bytes, tier)
      values (
        ${data.title}, ${data.subject}, ${data.grade}, ${data.description},
        ${fileName}, ${buf}, ${buf.length}, ${data.tier}
      )
    `;
    return { ok: true as const };
  });

export const deleteFoy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => Number(id))
  .handler(async ({ context, data: id }) => {
    if (!Number.isInteger(id)) throw new Error("Föy bulunamadı.");
    const sql = await requireAdmin(context.userId);
    await sql`delete from foys where id = ${id}`;
    return { ok: true as const };
  });

export const downloadFoy = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => Number(id))
  .handler(async ({ context, data: id }) => {
    if (!Number.isInteger(id)) throw new Error("Föy bulunamadı.");
    const sql = await ensureProfile(context.userId);
    const tierRow = await sql<{ tier: number }>`
      select coalesce(max(p.tier), 0)::int as tier
      from memberships m
      join plans p on p.id = m.plan_id
      where m.user_id = ${context.userId} and m.status = 'active'
    `;
    const rows = await sql<{
      file_name: string;
      mime: string;
      tier: number;
      bytes: unknown;
    }>`
      select file_name, mime, tier, bytes from foys where id = ${id}
    `;
    const foy = rows[0];
    if (!foy) throw new Error("Föy bulunamadı.");
    const tier = tierRow[0]?.tier ?? 0;
    if (tier < foy.tier) throw new Error("Bu föy için aktif kaydınız yok.");
    const buf = toBuffer(foy.bytes);
    return {
      fileName: foy.file_name,
      mime: foy.mime || "application/pdf",
      base64: buf.toString("base64"),
    };
  });

// ─── Games (Wordwall-style) ─────────────────────────────────────────────────

export type GameType = "memory" | "match" | "quiz" | "flashcards" | "sort" | "wheel";

export type Game = {
  id: number;
  title: string;
  description: string;
  type: GameType;
  subject: string;
  grade: string;
  content: Record<string, unknown>;
  isPublic: boolean;
  tier: number;
  thumbnail: string;
  sort: number;
  createdAt: string;
};

function mapGame(row: any): Game {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    subject: row.subject,
    grade: row.grade,
    content: typeof row.content === "string" ? JSON.parse(row.content) : row.content ?? {},
    isPublic: asBool(row.is_public),
    tier: row.tier ?? 0,
    thumbnail: row.thumbnail ?? "",
    sort: row.sort ?? 0,
    createdAt: row.created_at,
  };
}

export const listGames = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql`
    select id, title, description, type, subject, grade, content, is_public, tier, thumbnail, sort, created_at
    from games
    where is_public = true
    order by sort asc, id asc
  `;
  return rows.map(mapGame);
});

export const listAllGames = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql`
      select id, title, description, type, subject, grade, content, is_public, tier, thumbnail, sort, created_at
      from games
      order by sort asc, id asc
    `;
    return rows.map(mapGame);
  });

export const getGame = createServerFn({ method: "GET" })
  .validator((id: number) => Number(id))
  .handler(async ({ data: id }) => {
    if (!Number.isInteger(id) || id < 1) throw new Error("Oyun bulunamadı.");
    const sql = await getSql();
    const rows = await sql`
      select id, title, description, type, subject, grade, content, is_public, tier, thumbnail, sort, created_at
      from games where id = ${id}
    `;
    const g = rows[0];
    if (!g) throw new Error("Oyun bulunamadı.");
    return mapGame(g);
  });

export const createGame = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    title: string;
    description?: string;
    type: GameType;
    subject?: string;
    grade?: string;
    content: Record<string, unknown>;
    isPublic?: boolean;
    tier?: number;
    thumbnail?: string;
    sort?: number;
  }) => data)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql`
      insert into games (title, description, type, subject, grade, content, is_public, tier, thumbnail, sort)
      values (
        ${data.title},
        ${data.description ?? ""},
        ${data.type},
        ${data.subject ?? ""},
        ${data.grade ?? ""},
        ${JSON.stringify(data.content)}::jsonb,
        ${data.isPublic ?? true},
        ${data.tier ?? 0},
        ${data.thumbnail ?? ""},
        ${data.sort ?? 0}
      )
      returning id, title, description, type, subject, grade, content, is_public, tier, thumbnail, sort, created_at
    `;
    return mapGame(rows[0]);
  });

export const updateGame = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: {
    id: number;
    title: string;
    description?: string;
    type: GameType;
    subject?: string;
    grade?: string;
    content: Record<string, unknown>;
    isPublic?: boolean;
    tier?: number;
    thumbnail?: string;
    sort?: number;
  }) => data)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql`
      update games set
        title = ${data.title},
        description = ${data.description ?? ""},
        type = ${data.type},
        subject = ${data.subject ?? ""},
        grade = ${data.grade ?? ""},
        content = ${JSON.stringify(data.content)}::jsonb,
        is_public = ${data.isPublic ?? true},
        tier = ${data.tier ?? 0},
        thumbnail = ${data.thumbnail ?? ""},
        sort = ${data.sort ?? 0}
      where id = ${data.id}
      returning id, title, description, type, subject, grade, content, is_public, tier, thumbnail, sort, created_at
    `;
    if (!rows[0]) throw new Error("Oyun bulunamadı.");
    return mapGame(rows[0]);
  });

export const deleteGame = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => Number(id))
  .handler(async ({ context, data: id }) => {
    await requireAdmin(context.userId);
    if (!Number.isInteger(id)) throw new Error("Oyun bulunamadı.");
    const sql = await getSql();
    await sql`delete from games where id = ${id}`;
    return { ok: true };
  });

export type MemberRow = {
  userId: string;
  email: string;
  displayName: string;
  phone: string;
  role: "admin" | "manager" | "member";
  emailVerified: boolean;
  tier: number;
  createdAt: string;
};

export const listMembers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<MemberRow[]> => {
    const sql = await requireAdmin(context.userId);
    const rows = await sql<{
      user_id: string;
      email: string;
      display_name: string;
      phone: string;
      role: string;
      email_verified: boolean;
      tier: number;
      created_at: string;
    }>`
      select
        pr.user_id,
        u.email,
        coalesce(pr.display_name, '') as display_name,
        coalesce(pr.phone, '') as phone,
        pr.role,
        pr.email_verified,
        coalesce((
          select max(p.tier) from memberships m
          join plans p on p.id = m.plan_id
          where m.user_id = pr.user_id and m.status = 'active'
        ), 0)::int as tier,
        pr.created_at::text as created_at
      from profiles pr
      join "user" u on u.id = pr.user_id
      order by pr.created_at desc
    `;
    return rows.map((r) => ({
      userId: r.user_id,
      email: r.email,
      displayName: r.display_name,
      phone: r.phone,
      role: r.role === "admin" ? "admin" : r.role === "manager" ? "manager" : "member",
      emailVerified: asBool(r.email_verified),
      tier: r.tier ?? 0,
      createdAt: r.created_at,
    }));
  });

export const updateMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; role?: "admin" | "manager" | "member"; planId?: string | null }) => ({
    userId: clip(input?.userId, 80),
    role: input?.role,
    planId: input?.planId === null || input?.planId === "" ? null : clip(input?.planId, 40),
  }))
  .handler(async ({ context, data }) => {
    if (!data.userId) throw new Error("Üye bulunamadı.");
    // Rol değişikliği sadece full admin
    if (data.role) {
      await requireFullAdmin(context.userId);
      if (!["admin", "manager", "member"].includes(data.role)) throw new Error("Geçersiz rol.");
      const sql = await getSql();
      await sql`update profiles set role = ${data.role} where user_id = ${data.userId}`;
    }
    // VIP / paket atama admin veya manager
    if (data.planId !== undefined) {
      const sql = await requireAdmin(context.userId);
      if (data.planId === null) {
        // aktif üyelikleri kapat
        await sql`
          update memberships set status = 'rejected'
          where user_id = ${data.userId} and status = 'active'
        `;
      } else {
        const plans = await sql`select id from plans where id = ${data.planId}`;
        if (!plans.length) throw new Error("Paket bulunamadı.");
        // eski aktifleri kapat, yeni aktif ekle
        await sql`
          update memberships set status = 'rejected'
          where user_id = ${data.userId} and status = 'active'
        `;
        await sql`
          insert into memberships (user_id, plan_id, status, payer_name, note)
          values (${data.userId}, ${data.planId}, 'active', 'Manuel (yönetim)', 'Panelden atandı')
        `;
      }
    }
    return { ok: true as const };
  });

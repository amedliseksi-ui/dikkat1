import { useEffect, useState, type ReactNode, type ChangeEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Page, Shell, btnGhost, btnPrimary, inputClass } from "@/components/shell";
import {
  claimAdmin,
  deleteFoy,
  deleteGame,
  createGame,
  updateGame,
  listAllGames,
  getMe,
  getSettings,
  listFoys,
  listPayments,
  listPlans,
  listMembers,
  updateMember,
  setPaymentStatus,
  updatePlan,
  updateSettings,
  uploadFoy,
  type AdminPayment,
  type Foy,
  type Game,
  type GameType,
  type Me,
  type MemberRow,
  type Plan,
  type Settings,
} from "@/lib/dikkat/api";
import { errText } from "@/lib/dikkat/content";

export const Route = createFileRoute("/yonetim")({
  loader: () => getSettings(),
  component: Yonetim,
});

const tabs = ["Üyeler", "Föyler", "Oyunlar", "Başvurular", "Paketler", "İletişim", "Ödeme"] as const;

function Yonetim() {
  const initial = Route.useLoaderData() as Settings;
  const { user, isPending } = useCurrentUserState();
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]>("İletişim");

  useEffect(() => {
    if (!user) return;
    getMe()
      .then(setMe)
      .finally(() => setReady(true));
  }, [user]);

  if (isPending || (user && !ready)) {
    return (
      <Shell settings={initial}>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="h-40 animate-pulse rounded-card bg-blush" />
        </div>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (!me) {
    return (
      <Shell settings={initial}>
        <Page title="Hesap okunamadı." />
      </Shell>
    );
  }
  if (me.role !== "admin" && me.role !== "manager") {
    return (
      <Shell settings={initial}>
        <Page
          eyebrow="Yönetim"
          title={me.adminExists ? "Bu alan kurum yönetimine özel." : "Kurumu sahiplenin."}
          lede={
            me.adminExists
              ? "Ödeme, fiyat ve föyleri yalnızca yönetici hesap değiştirir."
              : "İlk yönetici, sahip koduyla bu hesabı kuruma bağlar."
          }
        >
          {!me.adminExists && <ClaimForm onDone={() => getMe().then(setMe)} />}
        </Page>
      </Shell>
    );
  }

  return (
    <Shell settings={initial}>
      <Page eyebrow="Yönetim" title="Kurum masası" lede="Üyeler, VIP atama, föy PDF, oyun ekleme, ödeme onayı. Sekmelerden Föyler / Oyunlar / Üyeler.">
        <div className="mt-6 flex gap-2 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={
                "h-11 shrink-0 rounded-full px-4 text-sm font-semibold " +
                (tab === item ? "bg-primary text-paper" : "border border-line")
              }
            >
              {item}
            </button>
          ))}
        </div>
        {tab === "Üyeler" && <MembersAdmin isFullAdmin={me.role === "admin"} />}
        {tab === "Föyler" && <FoyForm />}
        {tab === "Oyunlar" && <GamesAdmin />}
        {tab === "Başvurular" && <Payments />}
        {tab === "Paketler" && <PlansForm />}
        {tab === "İletişim" && <SettingsForm initial={initial} part="contact" />}
        {tab === "Ödeme" && <SettingsForm initial={initial} part="pay" />}
      </Page>
    </Shell>
  );
}

function ClaimForm({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mt-6 grid max-w-md gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          await claimAdmin({ data: code });
          onDone();
        } catch (err) {
          setError(errText(err));
        } finally {
          setBusy(false);
        }
      }}
    >
      <input value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} placeholder="Sahip kodu" />
      {error && <p className="text-sm text-primary">{error}</p>}
      <button type="submit" disabled={busy} className={btnPrimary}>
        {busy ? "Kontrol…" : "Yönetici ol"}
      </button>
    </form>
  );
}

function SettingsForm({ initial, part }: { initial: Settings; part: "contact" | "pay" }) {
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: keyof Settings) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <form
      className="mt-6 grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        setMessage("");
        try {
          await updateSettings({ data: form });
          setMessage("Kaydedildi.");
        } catch (err) {
          setError(errText(err));
        } finally {
          setBusy(false);
        }
      }}
    >
      {part === "contact" ? (
        <>
          <Field label="Telefon" value={form.phone} onChange={set("phone")} />
          <Field label="WhatsApp (ülke kodlu)" value={form.whatsapp} onChange={set("whatsapp")} />
          <Field label="E-posta" value={form.email} onChange={set("email")} />
          <Field label="Adres" value={form.address} onChange={set("address")} />
          <Field label="İlçe / il" value={form.city} onChange={set("city")} />
          <Field label="Şube notu" value={form.branch} onChange={set("branch")} />
          <Field label="Saatler" value={form.hours} onChange={set("hours")} />
          <Field label="Instagram" value={form.instagram} onChange={set("instagram")} />
          <label className="grid gap-1 text-sm font-semibold">
            Kısa tanıtım
            <textarea value={form.about} onChange={set("about")} className={inputClass + " h-28 py-3"} />
          </label>
        </>
      ) : (
        <>
          <Field label="IBAN (TR + 24 rakam)" value={form.iban} onChange={set("iban")} />
          <Field label="Hesap adı" value={form.ibanHolder} onChange={set("ibanHolder")} />
          <Field label="USDT TRC-20 adresi" value={form.cryptoUsdt} onChange={set("cryptoUsdt")} />
          <Field label="Bitcoin adresi" value={form.cryptoBtc} onChange={set("cryptoBtc")} />
          <p className="text-sm text-muted">
            Boş bırakılan yöntem sitede görünür ama öğrenci o yöntemle bildirim gönderemez. Kartta 3D Secure
            bildirimi kart numarasını saklamaz.
          </p>
        </>
      )}
      {error && <p className="text-sm text-primary">{error}</p>}
      {message && <p className="text-sm font-semibold text-primary-deep">{message}</p>}
      <button type="submit" disabled={busy} className={btnPrimary + " w-fit"}>
        {busy ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      <input value={value} onChange={onChange} className={inputClass} />
    </label>
  );
}

function PlansForm() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    listPlans().then(setPlans).catch((err) => setError(errText(err)));
  }, []);

  return (
    <div className="mt-6 grid gap-4">
      {error && <p className="text-sm text-primary">{error}</p>}
      {message && <p className="text-sm font-semibold text-primary-deep">{message}</p>}
      {plans.map((plan) => (
        <PlanEditor
          key={plan.id}
          plan={plan}
          onSaved={(next) => {
            setPlans((prev) => prev.map((item) => (item.id === next.id ? next : item)));
            setMessage("Paket güncellendi.");
          }}
        />
      ))}
    </div>
  );
}

function PlanEditor({ plan, onSaved }: { plan: Plan; onSaved: (plan: Plan) => void }) {
  const [name, setName] = useState(plan.name);
  const [tagline, setTagline] = useState(plan.tagline);
  const [description, setDescription] = useState(plan.description);
  const [priceLabel, setPriceLabel] = useState(plan.priceLabel);
  const [features, setFeatures] = useState(plan.features.join("\n"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="grid gap-3 rounded-card border border-line p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          await updatePlan({ data: { id: plan.id, name, tagline, description, priceLabel, features } });
          onSaved({
            ...plan,
            name,
            tagline,
            description,
            priceLabel,
            features: features.split("\n").map((line) => line.trim()).filter(Boolean),
          });
        } catch (err) {
          setError(errText(err));
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Düzey {plan.tier}</p>
      <Field label="Ad" value={name} onChange={(e) => setName(e.target.value)} />
      <Field label="Kısa başlık" value={tagline} onChange={(e) => setTagline(e.target.value)} />
      <Field label="Fiyat yazısı" value={priceLabel} onChange={(e) => setPriceLabel(e.target.value)} />
      <label className="grid gap-1 text-sm font-semibold">
        Açıklama
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass + " h-20 py-3"} />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Özellikler (satır satır)
        <textarea value={features} onChange={(e) => setFeatures(e.target.value)} className={inputClass + " h-24 py-3"} />
      </label>
      {error && <p className="text-sm text-primary">{error}</p>}
      <button type="submit" disabled={busy} className={btnGhost + " w-fit"}>
        {busy ? "…" : "Paketi kaydet"}
      </button>
    </form>
  );
}

function MembersAdmin({ isFullAdmin }: { isFullAdmin: boolean }) {
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    try {
      const [m, p] = await Promise.all([listMembers(), listPlans()]);
      setRows(m);
      setPlans(p);
    } catch (err) {
      setError(errText(err));
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = rows.filter((r) => {
    const blob = `${r.email} ${r.displayName} ${r.phone} ${r.role}`.toLocaleLowerCase("tr");
    return blob.includes(q.toLocaleLowerCase("tr"));
  });

  const roleLabel = { admin: "Yönetici", manager: "Yönetmen", member: "Üye" } as const;
  const tierLabel = (t: number) =>
    t >= 3 ? "Birebir" : t >= 2 ? "VIP grup" : t >= 1 ? "Yazılı/Okuma" : "Yok";

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Üyeler</h2>
          <p className="text-sm text-muted">Ara, rol ver, VIP paketini elle ata.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="E-posta, isim veya telefon ara…"
          className={inputClass + " max-w-sm"}
        />
      </div>
      {error && <p className="mt-3 text-sm text-primary">{error}</p>}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-foam text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Üye</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">VIP</th>
              <th className="px-4 py-3 font-semibold">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.userId} className="border-t border-line">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{r.displayName || "—"}</p>
                  <p className="text-muted">{r.email}</p>
                  {r.phone && <p className="text-xs text-muted">{r.phone}</p>}
                </td>
                <td className="px-4 py-3">
                  {isFullAdmin ? (
                    <select
                      className={inputClass + " !h-10 min-w-[120px]"}
                      value={r.role}
                      disabled={busy === r.userId}
                      onChange={async (e) => {
                        const role = e.target.value as "admin" | "manager" | "member";
                        setBusy(r.userId);
                        setError("");
                        try {
                          await updateMember({ data: { userId: r.userId, role } });
                          await load();
                        } catch (err) {
                          setError(errText(err));
                        } finally {
                          setBusy(null);
                        }
                      }}
                    >
                      <option value="member">Üye</option>
                      <option value="manager">Yönetmen</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  ) : (
                    <span className="rounded-full bg-foam px-2.5 py-1 text-xs font-semibold">
                      {roleLabel[r.role]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-muted">{tierLabel(r.tier)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <select
                      className={inputClass + " !h-10 min-w-[140px]"}
                      defaultValue=""
                      disabled={busy === r.userId}
                      onChange={async (e) => {
                        const planId = e.target.value;
                        if (!planId) return;
                        setBusy(r.userId);
                        setError("");
                        try {
                          await updateMember({
                            data: {
                              userId: r.userId,
                              planId: planId === "__none__" ? null : planId,
                            },
                          });
                          await load();
                        } catch (err) {
                          setError(errText(err));
                        } finally {
                          setBusy(null);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">VIP ata…</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (düzey {p.tier})
                        </option>
                      ))}
                      <option value="__none__">VIP kaldır</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-muted">Üye bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

function FoyForm() {
  const [foys, setFoys] = useState<Foy[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState(1);
  const [fileName, setFileName] = useState("");
  const [base64, setBase64] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listFoys().then(setFoys).catch(() => undefined);
  }, []);

  return (
    <div className="mt-6 grid gap-4">
      <div>
        <h2 className="font-display text-2xl">Föy yükle</h2>
        <p className="text-sm text-muted">PDF seç, başlık ve düzey yaz, yükle. Listede sil butonu var.</p>
      </div>
      <form
        className="grid gap-3 rounded-card border border-line p-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            await uploadFoy({ data: { title, subject, grade, description, fileName, tier, base64 } });
            setFoys(await listFoys());
            setTitle("");
            setBase64("");
            setFileName("");
          } catch (err) {
            setError(errText(err));
          } finally {
            setBusy(false);
          }
        }}
      >
        <Field label="Başlık" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Ders" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Field label="Sınıf" value={grade} onChange={(e) => setGrade(e.target.value)} />
        </div>
        <label className="grid gap-1 text-sm font-semibold">
          Kim indirebilir
          <select value={tier} onChange={(e) => setTier(Number(e.target.value))} className={inputClass}>
            <option value={1}>Düzey 1 — yazılı ve hızlı okuma</option>
            <option value={2}>Düzey 2 — VIP</option>
            <option value={3}>Düzey 3 — birebir</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          PDF
          <input
            type="file"
            accept="application/pdf"
            className="text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFileName(file.name);
              const reader = new FileReader();
              reader.onload = () => setBase64(String(reader.result || ""));
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {error && <p className="text-sm text-primary">{error}</p>}
        <button type="submit" disabled={busy} className={btnPrimary + " w-fit"}>
          {busy ? "Yükleniyor…" : "PDF yükle"}
        </button>
      </form>
      <ul className="grid gap-2">
        {foys.map((foy) => (
          <li key={foy.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-3">
            <span>
              <span className="block font-semibold">{foy.title}</span>
              <span className="text-xs text-muted">Düzey {foy.tier}</span>
            </span>
            <button
              type="button"
              className="text-sm font-semibold text-primary"
              onClick={async () => {
                await deleteFoy({ data: foy.id });
                setFoys(await listFoys());
              }}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Payments() {
  const [rows, setRows] = useState<AdminPayment[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setRows(await listPayments());
    } catch (err) {
      setError(errText(err));
    }
  }

  useEffect(() => {
    load();
  }, []);

  const label = { card_3ds: "3D Secure", crypto: "Kripto", iban: "IBAN" } as const;

  return (
    <div className="mt-6 grid gap-3">
      {error && <p className="text-sm text-primary">{error}</p>}
      {rows.length === 0 && <p className="text-sm text-muted">Henüz ödeme bildirimi yok.</p>}
      {rows.map((row) => (
        <article key={row.id} className="rounded-card border border-line p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold">
                {row.planName} · {label[row.method]}
              </p>
              <p className="text-sm text-muted">
                {row.displayName || row.payerName} · {row.email}
              </p>
              <p className="mt-1 font-display text-2xl">{row.reference}</p>
              <p className="text-sm text-muted">
                {row.note}
                {row.last4 ? ` · kart •••• ${row.last4}` : ""}
                {row.asset ? ` · ${row.asset}` : ""}
                {row.txHash ? ` · ${row.txHash}` : ""}
              </p>
            </div>
            <p className="text-sm font-semibold text-primary">{row.status}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={btnPrimary + " h-11"}
              onClick={async () => {
                await setPaymentStatus({ data: { id: row.id, status: "approved" } });
                await load();
              }}
            >
              Onayla
            </button>
            <button
              type="button"
              className={btnGhost + " h-11"}
              onClick={async () => {
                await setPaymentStatus({ data: { id: row.id, status: "rejected" } });
                await load();
              }}
            >
              Reddet
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}


function GamesAdmin() {
  /* Admin oyun editörü: tür seç, içerik doldur, kaydet */
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState<Game | null>(null);
  const [showForm, setShowForm] = useState(false);

  type FormState = {
    title: string;
    description: string;
    type: GameType;
    subject: string;
    grade: string;
    isPublic: boolean;
    tier: number;
    sort: number;
    // builders
    pairs: { id: string; front: string; back: string }[];
    matchItems: { left: string; right: string }[];
    questions: { q: string; options: string[]; answer: number }[];
    cards: { front: string; back: string }[];
    sortItems: { id: string; text: string; order: number }[];
    segments: { label: string; color: string }[];
  };

  const emptyForm: FormState = {
    title: "",
    description: "",
    type: "flashcards",
    subject: "",
    grade: "",
    isPublic: true,
    tier: 0,
    sort: 0,
    pairs: [{ id: "1", front: "", back: "" }],
    matchItems: [{ left: "", right: "" }],
    questions: [{ q: "", options: ["", "", "", ""], answer: 0 }],
    cards: [{ front: "", back: "" }],
    sortItems: [{ id: "1", text: "", order: 1 }],
    segments: [
      { label: "", color: "#ef4444" },
      { label: "", color: "#3b82f6" },
      { label: "", color: "#eab308" },
      { label: "", color: "#22c55e" },
    ],
  };
  const [form, setForm] = useState<FormState>(emptyForm);

  function load() {
    setLoading(true);
    listAllGames()
      .then(setGames)
      .catch((e) => setErr(errText(e)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(g: Game) {
    setEditing(g);
    const c = g.content || {};
    setForm({
      title: g.title,
      description: g.description,
      type: g.type,
      subject: g.subject,
      grade: g.grade,
      isPublic: g.isPublic,
      tier: g.tier,
      sort: g.sort,
      pairs: (c.pairs as FormState["pairs"])?.length
        ? (c.pairs as FormState["pairs"])
        : emptyForm.pairs,
      matchItems: (c.items as FormState["matchItems"])?.length
        ? (c.items as FormState["matchItems"])
        : emptyForm.matchItems,
      questions: (c.questions as FormState["questions"])?.length
        ? (c.questions as FormState["questions"])
        : emptyForm.questions,
      cards: (c.cards as FormState["cards"])?.length
        ? (c.cards as FormState["cards"])
        : emptyForm.cards,
      sortItems: (c.items as FormState["sortItems"])?.length && g.type === "sort"
        ? (c.items as FormState["sortItems"])
        : emptyForm.sortItems,
      segments: (c.segments as FormState["segments"])?.length
        ? (c.segments as FormState["segments"])
        : emptyForm.segments,
    });
    setShowForm(true);
  }

  function buildContent(): Record<string, unknown> {
    switch (form.type) {
      case "memory":
        return {
          pairs: form.pairs
            .filter((p) => p.front.trim() || p.back.trim())
            .map((p, i) => ({ id: p.id || String(i + 1), front: p.front.trim(), back: p.back.trim() })),
        };
      case "match":
        return {
          items: form.matchItems
            .filter((m) => m.left.trim() || m.right.trim())
            .map((m) => ({ left: m.left.trim(), right: m.right.trim() })),
        };
      case "quiz":
        return {
          questions: form.questions
            .filter((q) => q.q.trim())
            .map((q) => ({
              q: q.q.trim(),
              options: q.options.map((o) => o.trim()),
              answer: q.answer,
            })),
        };
      case "flashcards":
        return {
          cards: form.cards
            .filter((c) => c.front.trim() || c.back.trim())
            .map((c) => ({ front: c.front.trim(), back: c.back.trim() })),
        };
      case "sort":
        return {
          items: form.sortItems
            .filter((s) => s.text.trim())
            .map((s, i) => ({ id: s.id || String(i + 1), text: s.text.trim(), order: s.order || i + 1 })),
        };
      case "wheel":
        return {
          segments: form.segments
            .filter((s) => s.label.trim())
            .map((s) => ({ label: s.label.trim(), color: s.color || "#c8102e" })),
          mode: "reveal",
        };
      default:
        return {};
    }
  }

  async function save() {
    setErr("");
    const content = buildContent();
    try {
      if (editing) {
        await updateGame({
          data: {
            id: editing.id,
            title: form.title,
            description: form.description,
            type: form.type,
            subject: form.subject,
            grade: form.grade,
            content,
            isPublic: form.isPublic,
            tier: form.tier,
            sort: form.sort,
          },
        });
      } else {
        await createGame({
          data: {
            title: form.title,
            description: form.description,
            type: form.type,
            subject: form.subject,
            grade: form.grade,
            content,
            isPublic: form.isPublic,
            tier: form.tier,
            sort: form.sort,
          },
        });
      }
      setShowForm(false);
      load();
    } catch (e) {
      setErr(errText(e));
    }
  }

  async function remove(id: number) {
    if (!confirm("Bu oyunu silmek istediğinize emin misiniz?")) return;
    try {
      await deleteGame({ data: id });
      load();
    } catch (e) {
      setErr(errText(e));
    }
  }

  const typeLabels: Record<GameType, string> = {
    memory: "Hafıza",
    match: "Eşleştir",
    quiz: "Quiz",
    flashcards: "Flashcard",
    sort: "Sırala",
    wheel: "Çark",
  };

  const typeHints: Record<GameType, string> = {
    memory: "Kart çiftleri: ön yüz / arka yüz. Öğrenci eşleştirir.",
    match: "Sol–sağ eşleştirme satırları.",
    quiz: "Soru, 4 şık ve doğru şıkkın numarası (0–3).",
    flashcards: "Ön yüz / arka yüz kartları. Çevirerek çalışılır.",
    sort: "Doğru sıradaki maddeler (order: 1, 2, 3…).",
    wheel: "Çark dilimleri. Çevirince kelime çıkar.",
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Görsel oyun oluşturucu. Tip seç, alanları doldur, kaydet. JSON yazmana gerek yok.
        </p>
        <button type="button" onClick={openNew} className={btnPrimary}>
          + Yeni oyun
        </button>
      </div>
      {err && <p className="mt-3 text-sm text-rose-600">{err}</p>}
      {loading ? (
        <div className="mt-6 h-32 animate-pulse rounded-card bg-blush" />
      ) : (
        <div className="mt-6 space-y-3">
          {games.map((g) => (
            <article key={g.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line p-4">
              <div>
                <p className="font-semibold">{g.title}</p>
                <p className="text-sm text-muted">
                  {typeLabels[g.type]} · {g.subject || "—"} · {g.grade || "—"} · tier {g.tier}
                  {g.isPublic ? " · herkese açık" : " · gizli"}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" className={btnGhost + " h-10"} onClick={() => openEdit(g)}>
                  Düzenle
                </button>
                <button type="button" className={btnGhost + " h-10 text-rose-600"} onClick={() => remove(g.id)}>
                  Sil
                </button>
              </div>
            </article>
          ))}
          {games.length === 0 && <p className="text-sm text-muted">Henüz oyun yok. Yeni oyun ekle.</p>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <div className="animate-scale-in max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-paper p-5 shadow-2xl sm:p-6">
            <h3 className="font-display text-2xl">{editing ? "Oyunu düzenle" : "Yeni oyun oluştur"}</h3>
            <p className="mt-1 text-sm text-muted">{typeHints[form.type]}</p>

            <div className="mt-5 grid gap-3">
              <input
                className={inputClass}
                placeholder="Başlık"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                className={inputClass + " !h-20"}
                placeholder="Kısa açıklama"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              {/* Game type picker */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(Object.keys(typeLabels) as GameType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={
                      "rounded-xl border px-3 py-2.5 text-sm font-semibold transition " +
                      (form.type === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-line bg-foam text-muted hover:border-primary/40")
                    }
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  className={inputClass}
                  placeholder="Ders"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Sınıf"
                  value={form.grade}
                  onChange={(e) => setForm({ ...form, grade: e.target.value })}
                />
              </div>

              {/* Type-specific builders */}
              {form.type === "flashcards" && (
                <BuilderBlock
                  title="Kartlar"
                  onAdd={() => setForm({ ...form, cards: [...form.cards, { front: "", back: "" }] })}
                >
                  {form.cards.map((c, i) => (
                    <div key={i} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Ön yüz"
                        value={c.front}
                        onChange={(e) => {
                          const cards = [...form.cards];
                          cards[i] = { ...cards[i], front: e.target.value };
                          setForm({ ...form, cards });
                        }}
                      />
                      <div className="flex gap-2">
                        <input
                          className={inputClass + " flex-1"}
                          placeholder="Arka yüz (doğru / açıklama)"
                          value={c.back}
                          onChange={(e) => {
                            const cards = [...form.cards];
                            cards[i] = { ...cards[i], back: e.target.value };
                            setForm({ ...form, cards });
                          }}
                        />
                        <button
                          type="button"
                          className="text-sm text-rose-600"
                          onClick={() => setForm({ ...form, cards: form.cards.filter((_, j) => j !== i) })}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </BuilderBlock>
              )}

              {form.type === "memory" && (
                <BuilderBlock
                  title="Çiftler"
                  onAdd={() =>
                    setForm({
                      ...form,
                      pairs: [...form.pairs, { id: String(form.pairs.length + 1), front: "", back: "" }],
                    })
                  }
                >
                  {form.pairs.map((c, i) => (
                    <div key={i} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Ön"
                        value={c.front}
                        onChange={(e) => {
                          const pairs = [...form.pairs];
                          pairs[i] = { ...pairs[i], front: e.target.value };
                          setForm({ ...form, pairs });
                        }}
                      />
                      <div className="flex gap-2">
                        <input
                          className={inputClass + " flex-1"}
                          placeholder="Arka"
                          value={c.back}
                          onChange={(e) => {
                            const pairs = [...form.pairs];
                            pairs[i] = { ...pairs[i], back: e.target.value };
                            setForm({ ...form, pairs });
                          }}
                        />
                        <button
                          type="button"
                          className="text-sm text-rose-600"
                          onClick={() => setForm({ ...form, pairs: form.pairs.filter((_, j) => j !== i) })}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </BuilderBlock>
              )}

              {form.type === "match" && (
                <BuilderBlock
                  title="Eşleştirme satırları"
                  onAdd={() => setForm({ ...form, matchItems: [...form.matchItems, { left: "", right: "" }] })}
                >
                  {form.matchItems.map((m, i) => (
                    <div key={i} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Sol"
                        value={m.left}
                        onChange={(e) => {
                          const matchItems = [...form.matchItems];
                          matchItems[i] = { ...matchItems[i], left: e.target.value };
                          setForm({ ...form, matchItems });
                        }}
                      />
                      <div className="flex gap-2">
                        <input
                          className={inputClass + " flex-1"}
                          placeholder="Sağ"
                          value={m.right}
                          onChange={(e) => {
                            const matchItems = [...form.matchItems];
                            matchItems[i] = { ...matchItems[i], right: e.target.value };
                            setForm({ ...form, matchItems });
                          }}
                        />
                        <button
                          type="button"
                          className="text-sm text-rose-600"
                          onClick={() =>
                            setForm({ ...form, matchItems: form.matchItems.filter((_, j) => j !== i) })
                          }
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </BuilderBlock>
              )}

              {form.type === "quiz" && (
                <BuilderBlock
                  title="Sorular"
                  onAdd={() =>
                    setForm({
                      ...form,
                      questions: [...form.questions, { q: "", options: ["", "", "", ""], answer: 0 }],
                    })
                  }
                >
                  {form.questions.map((q, i) => (
                    <div key={i} className="space-y-2 rounded-xl border border-line p-3">
                      <div className="flex gap-2">
                        <input
                          className={inputClass + " flex-1"}
                          placeholder={`Soru ${i + 1}`}
                          value={q.q}
                          onChange={(e) => {
                            const questions = [...form.questions];
                            questions[i] = { ...questions[i], q: e.target.value };
                            setForm({ ...form, questions });
                          }}
                        />
                        <button
                          type="button"
                          className="text-sm text-rose-600"
                          onClick={() =>
                            setForm({ ...form, questions: form.questions.filter((_, j) => j !== i) })
                          }
                        >
                          Sil
                        </button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oi) => (
                          <label key={oi} className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name={`ans-${i}`}
                              checked={q.answer === oi}
                              onChange={() => {
                                const questions = [...form.questions];
                                questions[i] = { ...questions[i], answer: oi };
                                setForm({ ...form, questions });
                              }}
                            />
                            <input
                              className={inputClass + " flex-1"}
                              placeholder={`Şık ${oi + 1}`}
                              value={opt}
                              onChange={(e) => {
                                const questions = [...form.questions];
                                const options = [...questions[i].options];
                                options[oi] = e.target.value;
                                questions[i] = { ...questions[i], options };
                                setForm({ ...form, questions });
                              }}
                            />
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-muted">Doğru şıkkı radyo ile işaretle.</p>
                    </div>
                  ))}
                </BuilderBlock>
              )}

              {form.type === "sort" && (
                <BuilderBlock
                  title="Sıralanacak maddeler"
                  onAdd={() =>
                    setForm({
                      ...form,
                      sortItems: [
                        ...form.sortItems,
                        { id: String(form.sortItems.length + 1), text: "", order: form.sortItems.length + 1 },
                      ],
                    })
                  }
                >
                  {form.sortItems.map((s, i) => (
                    <div key={i} className="flex gap-2 rounded-xl border border-line p-3">
                      <input
                        type="number"
                        className="h-11 w-16 rounded-xl border border-line px-2 text-sm"
                        value={s.order}
                        onChange={(e) => {
                          const sortItems = [...form.sortItems];
                          sortItems[i] = { ...sortItems[i], order: Number(e.target.value) };
                          setForm({ ...form, sortItems });
                        }}
                      />
                      <input
                        className={inputClass + " flex-1"}
                        placeholder="Metin"
                        value={s.text}
                        onChange={(e) => {
                          const sortItems = [...form.sortItems];
                          sortItems[i] = { ...sortItems[i], text: e.target.value };
                          setForm({ ...form, sortItems });
                        }}
                      />
                      <button
                        type="button"
                        className="text-sm text-rose-600"
                        onClick={() =>
                          setForm({ ...form, sortItems: form.sortItems.filter((_, j) => j !== i) })
                        }
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </BuilderBlock>
              )}

              {form.type === "wheel" && (
                <BuilderBlock
                  title="Çark dilimleri"
                  onAdd={() => {
                    const palette = ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#06b6d4", "#f97316", "#ec4899"];
                    setForm({
                      ...form,
                      segments: [
                        ...form.segments,
                        { label: "", color: palette[form.segments.length % palette.length] },
                      ],
                    });
                  }}
                >
                  {form.segments.map((s, i) => (
                    <div key={i} className="flex gap-2 rounded-xl border border-line p-3">
                      <input
                        type="color"
                        className="h-11 w-12 cursor-pointer rounded-lg border border-line bg-transparent p-1"
                        value={s.color}
                        onChange={(e) => {
                          const segments = [...form.segments];
                          segments[i] = { ...segments[i], color: e.target.value };
                          setForm({ ...form, segments });
                        }}
                      />
                      <input
                        className={inputClass + " flex-1"}
                        placeholder="Kelime / soru"
                        value={s.label}
                        onChange={(e) => {
                          const segments = [...form.segments];
                          segments[i] = { ...segments[i], label: e.target.value };
                          setForm({ ...form, segments });
                        }}
                      />
                      <button
                        type="button"
                        className="text-sm text-rose-600"
                        onClick={() =>
                          setForm({ ...form, segments: form.segments.filter((_, j) => j !== i) })
                        }
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </BuilderBlock>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isPublic}
                    onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                  />
                  Herkese açık
                </label>
                <label className="flex items-center gap-2">
                  Tier
                  <input
                    type="number"
                    className="h-9 w-16 rounded-lg border border-line px-2"
                    value={form.tier}
                    onChange={(e) => setForm({ ...form, tier: Number(e.target.value) })}
                  />
                </label>
                <label className="flex items-center gap-2">
                  Sıra
                  <input
                    type="number"
                    className="h-9 w-16 rounded-lg border border-line px-2"
                    value={form.sort}
                    onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })}
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className={btnGhost}>
                İptal
              </button>
              <button type="button" onClick={save} className={btnPrimary} disabled={!form.title.trim()}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BuilderBlock({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-foam/50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <button type="button" onClick={onAdd} className={btnGhost + " h-9 text-xs"}>
          + Ekle
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

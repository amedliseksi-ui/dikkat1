import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Lock, Sparkles, Crown, FileText } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Page, Shell, btnPrimary, inputClass } from "@/components/shell";
import { downloadFoy, getMe, getSettings, listFoys, type Foy, type Settings } from "@/lib/dikkat/api";
import { errText } from "@/lib/dikkat/content";

export const Route = createFileRoute("/foyler")({
  loader: async () => {
    const [settings, foys] = await Promise.all([getSettings(), listFoys()]);
    return { settings, foys };
  },
  component: Foyler,
});

const tierName: Record<number, string> = {
  1: "Yazılı veya hızlı okuma",
  2: "VIP grup",
  3: "Birebir",
};

function Foyler() {
  const initial = Route.useLoaderData() as { settings: Settings; foys: Foy[] };
  const [foys] = useState(initial.foys);
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    if (!user) {
      setTier(0);
      setChecked(true);
      return;
    }
    getMe()
      .then((me) => setTier(me.tier))
      .catch(() => setTier(0))
      .finally(() => setChecked(true));
  }, [user]);

  const isVip = tier >= 1;

  const shown = foys.filter((foy) => {
    if (!isVip) return false;
    const blob = `${foy.title} ${foy.subject} ${foy.grade}`.toLocaleLowerCase("tr");
    return blob.includes(query.toLocaleLowerCase("tr"));
  });

  async function download(foy: Foy) {
    setError("");
    setBusy(foy.id);
    try {
      const file = await downloadFoy({ data: foy.id });
      const bytes = Uint8Array.from(atob(file.base64), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: file.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Shell settings={initial.settings}>
      <Page
        eyebrow="Föyler"
        title="Çalışma kâğıtları"
        lede={
          isVip
            ? "Aktif kaydınızın düzeyi, indirebileceğiniz föyü belirler."
            : "Föy arşivi yalnızca aktif kayıtlı VIP öğrencilere açıktır."
        }
      >
        {isPending || !checked ? (
          <div className="mt-10 h-48 animate-pulse rounded-card bg-blush" />
        ) : !isVip ? (
          <VipGate />
        ) : (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Başlık, ders veya sınıf ara"
              className={inputClass + " mt-6 max-w-md animate-fade-in"}
            />
            {error && <p className="mt-3 text-sm text-primary animate-shake">{error}</p>}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((foy, i) => (
                <article
                  key={foy.id}
                  className="card-hover animate-fade-up rounded-card border border-line bg-paper p-5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="size-5" />
                    </div>
                    <span className="rounded-full bg-foam px-2.5 py-0.5 text-xs font-semibold text-muted">
                      {tierName[foy.tier] || `Düzey ${foy.tier}`}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-tight">{foy.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {foy.subject}
                    {foy.grade ? ` · ${foy.grade}` : ""}
                  </p>
                  {foy.description && <p className="mt-2 text-sm text-muted line-clamp-2">{foy.description}</p>}
                  <button
                    type="button"
                    disabled={busy === foy.id || tier < foy.tier}
                    onClick={() => download(foy)}
                    className={btnPrimary + " mt-4 h-11 w-full disabled:opacity-50"}
                  >
                    {busy === foy.id ? (
                      "İndiriliyor…"
                    ) : tier < foy.tier ? (
                      <>
                        <Lock className="size-4" /> Daha yüksek paket
                      </>
                    ) : (
                      <>
                        <Download className="size-4" /> PDF indir
                      </>
                    )}
                  </button>
                </article>
              ))}
            </div>
            {shown.length === 0 && (
              <p className="mt-10 text-center text-muted animate-fade-in">Bu aramada föy bulunamadı.</p>
            )}
          </>
        )}
      </Page>
    </Shell>
  );
}

function VipGate() {
  return (
    <div className="relative mt-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 select-none opacity-40 blur-[2px]" aria-hidden>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-44 rounded-card border border-line bg-foam/80 p-5">
              <div className="h-3 w-16 rounded bg-line" />
              <div className="mt-4 h-5 w-3/4 rounded bg-line" />
              <div className="mt-2 h-3 w-1/2 rounded bg-line" />
              <div className="mt-6 h-10 w-full rounded-full bg-line" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex min-h-[420px] items-center justify-center px-4 py-16">
        <div className="animate-scale-in w-full max-w-lg rounded-3xl border border-primary/20 bg-paper/95 p-8 text-center shadow-2xl shadow-primary/15 backdrop-blur-md">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-deep text-white shadow-lg shadow-primary/30 animate-float">
            <Crown className="size-8" />
          </div>
          <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-primary uppercase">VIP alan</p>
          <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
            Burası sadece VIP&apos;lere özeldir
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Çalışma föyleri, PDF arşivi ve seviye bazlı materyaller yalnızca aktif kayıtlı öğrencilerimize
            açıktır. Kayıt olun, paketinizi seçin ve arşive erişin.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foam px-3 py-1">
              <Sparkles className="size-3.5 text-primary" /> Yazılı & hızlı okuma
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foam px-3 py-1">
              <Sparkles className="size-3.5 text-primary" /> VIP grup
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foam px-3 py-1">
              <Sparkles className="size-3.5 text-primary" /> Birebir
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/kayit" className={btnPrimary + " h-12 min-w-[150px] animate-pulse-soft"}>
              Kayıt ol
            </Link>
            <Link
              to="/login"
              className="inline-flex h-12 min-w-[150px] items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-semibold text-ink hover:bg-foam"
            >
              Giriş yap
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Kayıt sonrası paket seçip ödeme bildir → yönetim onaylayınca föyler açılır.
          </p>
        </div>
      </div>
    </div>
  );
}

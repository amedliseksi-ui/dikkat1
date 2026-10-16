import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Page, Shell, btnPrimary } from "@/components/shell";
import { getMe, getSettings, type Me, type Settings } from "@/lib/dikkat/api";

export const Route = createFileRoute("/hesap")({
  loader: () => getSettings(),
  component: Hesap,
});

const memberLabel = { pending: "Onay bekliyor", active: "Açık", rejected: "Reddedildi" } as const;
const payLabel = { pending: "İncelemede", approved: "Onaylandı", rejected: "Reddedildi" } as const;
const methodLabel = { card_3ds: "Kart · 3D Secure", crypto: "Kripto", iban: "Havale / IBAN" } as const;

function Hesap() {
  const settings = Route.useLoaderData() as Settings;
  const { user, isPending } = useCurrentUserState();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    if (!user) return;
    getMe().then(setMe).catch(() => setMe(null));
  }, [user]);

  if (isPending) {
    return (
      <Shell settings={settings}>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="h-40 animate-pulse rounded-card bg-blush" />
        </div>
      </Shell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <Shell settings={settings}>
      <Page eyebrow="Hesabım" title={me?.displayName ? me.displayName : "Hesabım"} lede={me?.email}>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-card border border-line p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">E-posta</p>
            <p className="mt-2 font-display text-3xl">{me?.emailVerified ? "Doğrulandı" : "Bekliyor"}</p>
            {!me?.emailVerified && (
              <Link to="/kayit" className="mt-3 inline-block text-sm font-semibold text-primary">
                Doğrulamaya git
              </Link>
            )}
          </article>
          <article className="rounded-card border border-line p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Telefon</p>
            <p className="mt-2 font-display text-3xl">{me?.phone || "—"}</p>
          </article>
          <article className="rounded-card border border-line p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Föy erişimi</p>
            <p className="mt-2 font-display text-3xl">{me?.tier ? `Düzey ${me.tier}` : "Henüz yok"}</p>
            <Link to="/foyler" className="mt-3 inline-block text-sm font-semibold text-primary">
              Föylere git
            </Link>
          </article>
        </div>
        <section className="mt-6 rounded-card border border-line p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-3xl">Ödemeler</h2>
            <Link to="/kayit" className={btnPrimary + " h-11"}>
              Yeni kayıt
            </Link>
          </div>
          {!me?.payments.length ? (
            <p className="mt-3 text-sm text-muted">Henüz ödeme bildirimi yok.</p>
          ) : (
            <ul className="mt-4 grid gap-2">
              {me.payments.map((item) => (
                <li key={item.id} className="rounded-xl bg-foam px-4 py-3">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{item.planName}</span>
                    <span className="text-sm font-semibold text-primary-deep">{payLabel[item.status]}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {methodLabel[item.method]} · {item.reference}
                    {item.last4 ? ` · •••• ${item.last4}` : ""}
                    {item.txHash ? ` · ${item.txHash}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="mt-4 rounded-card border border-line p-5">
          <h2 className="font-display text-3xl">Kayıtlar</h2>
          {!me?.memberships.length ? (
            <p className="mt-3 text-sm text-muted">Onaylanan kayıt föy arşivini açar.</p>
          ) : (
            <ul className="mt-4 grid gap-2">
              {me.memberships.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-foam px-4 py-3">
                  <span className="font-semibold">{item.planName}</span>
                  <span className="text-sm font-semibold text-primary-deep">{memberLabel[item.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Page>
    </Shell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Checkout } from "@/components/checkout";
import { Page, Shell } from "@/components/shell";
import { getSettings, listPlans, type Plan, type Settings } from "@/lib/dikkat/api";

type Search = { plan?: string };

export const Route = createFileRoute("/kayit")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const plan = typeof search.plan === "string" && search.plan ? search.plan : undefined;
    return plan ? { plan } : {};
  },
  loader: async () => {
    const [settings, plans] = await Promise.all([getSettings(), listPlans()]);
    return { settings, plans };
  },
  component: Kayit,
});

function Kayit() {
  const { settings, plans } = Route.useLoaderData() as { settings: Settings; plans: Plan[] };
  const { plan } = Route.useSearch();
  return (
    <Shell settings={settings}>
      <Page
        eyebrow="Kayıt ve üyelik"
        title="Hesap aç, programını seç."
        lede="Önce e-posta ile hesabını oluştur (şifre en az 8 karakter). İstersen program ve ödeme adımına geç. Yönetici hesabı için kayıt e-postası barisguner@dikkat.com olmalı."
      >
        <div className="mt-8">
          <Checkout settings={settings} plans={plans} initialPlan={plan ?? ""} />
        </div>
      </Page>
    </Shell>
  );
}

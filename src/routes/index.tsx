import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CreditCard, Landmark, Wallet, X } from "lucide-react";
import { Shell, btnPrimary, btnGhost } from "@/components/shell";
import { getSettings, listPlans, type Plan, type Settings } from "@/lib/dikkat/api";
import { FALLBACK, posters, programs, telHref } from "@/lib/dikkat/content";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [settings, plans] = await Promise.all([getSettings(), listPlans()]);
    return { settings, plans };
  },
  component: Home,
});

function Home() {
  const { settings, plans } = Route.useLoaderData() as { settings: Settings; plans: Plan[] };
  const phone = settings.phone || FALLBACK.phone;
  const [shot, setShot] = useState<(typeof posters)[number] | null>(null);

  return (
    <Shell settings={settings}>
      <section className="gradient-hero mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Mersin</p>
          <h1 className="mt-2 font-display text-6xl leading-[0.95] text-ink sm:text-7xl">DİKKAT</h1>
          <p className="mt-2 text-sm font-semibold tracking-[0.16em] text-primary uppercase">
            Eğitim Kurumları
          </p>
          <p className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-paper shadow-md shadow-primary/20">
            “DİKKAT”li olan kazanır
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{settings.about}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/kayit" className={btnPrimary}>
              Kayıt ol
            </Link>
            <Link to="/oyunlar" className={btnGhost}>
              Edebiyat oyunları
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {["7", "8", "9", "10", "11", "12", "Mezun"].map((level) => (
              <li key={level} className="rounded-full border border-line bg-foam px-3 py-1 text-sm font-semibold">
                {level}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="overflow-hidden rounded-card border border-line text-left"
          onClick={() => setShot(posters[0])}
        >
          <img
            src="/posters/hizmet.jpg"
            alt="Mersin Dikkat Eğitim Kurumları kayıt duyurusu"
            className="aspect-[4/3] w-full object-cover"
          />
        </button>
      </section>

      <section className="bg-foam">
        <div className="animate-fade-up mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 lg:grid-cols-2">
          <img
            src="/posters/mezun.jpg"
            alt="Mezun gruplar ve 7. sınıftan 12. sınıfa kadar tüm seviyeler"
            className="w-full rounded-card border border-line"
          />
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">Kimler için</p>
            <h2 className="mt-2 font-display text-4xl">Mezun gruplar ve 7–12. sınıf</h2>
            <p className="mt-4 text-muted">
              Seviye kalabalık bir listede kaybolmaz. Kayıtta sınıfınızı yazarsınız; grup 1, 2 veya 4
              kişilik kurulur.
            </p>
            <Link to="/programlar" className={btnPrimary + " mt-6"}>
              Programları gör
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Edebiyat oyunları</p>
            <h2 className="mt-2 font-display text-4xl">Oyna, öğren, pekiştir</h2>
            <p className="mt-3 max-w-xl text-muted">
              Eser–yazar, akımlar, şiir, roman karakterleri ve dil bilgisi. Hafıza, eşleştirme, quiz ve daha fazlası — kayıt olmadan dene.
            </p>
          </div>
          <Link to="/oyunlar" className={btnPrimary}>
            Oyunları keşfet
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-4xl">Dört net program</h2>
        <p className="mt-2 max-w-2xl text-muted">Hangisini istediğinizi kayıtta seçersiniz. Üst paket, alttakilerin föylerini de açar.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {programs.map((program) => (
            <article key={program.id} className="overflow-hidden rounded-card border border-line bg-paper">
              <img src={program.image} alt={program.alt} className="aspect-[16/9] w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">{program.kicker}</p>
                <h3 className="mt-1 font-display text-3xl">{program.title}</h3>
                <p className="mt-2 text-sm text-muted">{program.text}</p>
                <Link
                  to="/kayit"
                  search={{ plan: program.id }}
                  className="mt-4 inline-flex font-semibold text-primary"
                >
                  Bu programla kayıt ol
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary-deep text-paper">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-4">
          {[
            ["1", "Programı seç"],
            ["2", "E-postanı doğrula"],
            ["3", "Kart, kripto veya IBAN"],
            ["4", "Kurum onayından sonra ders"],
          ].map(([n, label]) => (
            <div key={n}>
              <p className="font-display text-4xl text-blush">{n}</p>
              <p className="mt-2 font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-4xl">Ödeme üç yoldan</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <PayCard icon={<CreditCard className="size-5" />} title="Kart · 3D Secure" text="Kart numarası sunucuya yazılmaz. Yalnızca son 4 hane ve referans kalır." />
          <PayCard icon={<Wallet className="size-5" />} title="Kripto" text="USDT (TRC-20) veya Bitcoin. İşlem karmasını bildirirsiniz." />
          <PayCard icon={<Landmark className="size-5" />} title="Havale / IBAN" text="Size özel DKT referansını açıklamaya yazarsınız." />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-card border border-line p-4">
              <h3 className="font-display text-2xl">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
              <p className="mt-3 font-semibold">{plan.priceLabel}</p>
              <ul className="mt-3 grid gap-1 text-sm">
                {plan.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl">Afişler</h2>
          <p className="text-sm text-muted">Büyütmek için dokunun</p>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {posters.map((poster) => (
            <button
              key={poster.src}
              type="button"
              onClick={() => setShot(poster)}
              className="w-56 shrink-0 overflow-hidden rounded-card border border-line text-left"
            >
              <img src={poster.src} alt={poster.alt} className="aspect-[4/5] w-full object-cover" />
              <span className="block px-3 py-2 text-sm font-semibold">{poster.caption}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-12 lg:grid-cols-2">
        <img
          src="/posters/cagri.jpg"
          alt="Sevgili mezunlar iletişim afişi"
          className="w-full rounded-card border border-line"
        />
        <div>
          <img src="/posters/cunku.jpg" alt="Çünkü Dikkatli olan kazanır" className="w-full rounded-card border border-line" />
          <p className="mt-4 text-lg">{settings.address || FALLBACK.address}</p>
          <p className="text-muted">
            {settings.city || FALLBACK.city} · {settings.branch || FALLBACK.branch}
          </p>
          <a href={telHref(phone)} className={btnPrimary + " mt-5"}>
            {phone}
          </a>
        </div>
      </section>

      {shot && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={shot.caption}
          onClick={() => setShot(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-paper text-ink"
            aria-label="Kapat"
            onClick={() => setShot(null)}
          >
            <X className="size-5" />
          </button>
          <img src={shot.src} alt={shot.alt} className="max-h-[85vh] max-w-full rounded-card" />
        </div>
      )}
    </Shell>
  );
}

function PayCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-card border border-line p-5">
      <span className="grid size-11 place-items-center rounded-full bg-primary text-paper">{icon}</span>
      <h3 className="mt-4 font-display text-2xl">{title}</h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </article>
  );
}

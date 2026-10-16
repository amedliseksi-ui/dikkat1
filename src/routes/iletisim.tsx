import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { Page, Shell, btnPrimary, btnGhost } from "@/components/shell";
import { getSettings, type Settings } from "@/lib/dikkat/api";
import { FALLBACK, telHref, waHref } from "@/lib/dikkat/content";

export const Route = createFileRoute("/iletisim")({
  loader: () => getSettings(),
  component: Iletisim,
});

function Iletisim() {
  const settings = Route.useLoaderData() as Settings;
  const phone = settings.phone || FALLBACK.phone;
  const address = `${settings.address || FALLBACK.address}, ${settings.city || FALLBACK.city}`;
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " " + (settings.branch || FALLBACK.branch))}`;

  return (
    <Shell settings={settings}>
      <Page
        eyebrow="İletişim"
        title="Görüşmeden karar vermeyin."
        lede="Telefon, WhatsApp ve adres aynı ekranda. Kayıt ve ödeme siteden yürür."
      >
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-card bg-primary p-6 text-paper">
            <Phone className="size-6" />
            <a href={telHref(phone)} className="mt-4 block font-display text-5xl leading-none">
              {phone}
            </a>
            <p className="mt-4 text-blush">{settings.branch || FALLBACK.branch}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={telHref(phone)} className="inline-flex h-12 items-center rounded-full bg-paper px-5 font-semibold text-primary">
                Ara
              </a>
              <a href={waHref(settings.whatsapp || phone, "Merhaba, Dikkat Eğitim hakkında bilgi almak istiyorum.")} className="inline-flex h-12 items-center rounded-full border border-paper/40 px-5 font-semibold">
                WhatsApp
              </a>
            </div>
          </div>
          <div className="rounded-card border border-line p-6">
            <MapPin className="size-6 text-primary" />
            <p className="mt-4 text-lg font-semibold">{settings.address || FALLBACK.address}</p>
            <p className="mt-1 text-muted">{settings.city || FALLBACK.city}</p>
            {settings.hours ? <p className="mt-3 text-sm">{settings.hours}</p> : null}
            {settings.email ? <p className="mt-2 text-sm">{settings.email}</p> : null}
            <a href={map} target="_blank" rel="noreferrer" className={btnGhost + " mt-6"}>
              Yol tarifi
            </a>
            <a href={settings.instagram || FALLBACK.instagram} target="_blank" rel="noreferrer" className={btnPrimary + " mt-3"}>
              Instagram
            </a>
          </div>
        </div>
        <img
          src="/posters/cagri.jpg"
          alt="Kurumun iletişim afişi: telefon ve Yenişehir adresi"
          className="mt-8 w-full rounded-card border border-line"
        />
      </Page>
    </Shell>
  );
}

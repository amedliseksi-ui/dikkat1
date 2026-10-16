import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, Shell, btnPrimary } from "@/components/shell";
import { getSettings, type Settings } from "@/lib/dikkat/api";
import { programs } from "@/lib/dikkat/content";

export const Route = createFileRoute("/programlar")({
  loader: () => getSettings(),
  component: Programlar,
});

function Programlar() {
  const settings = Route.useLoaderData() as Settings;
  return (
    <Shell settings={settings}>
      <Page
        eyebrow="Programlar"
        title="Ne istediğinizi kayıtta seçersiniz."
        lede="Dört program var. Karışık paket listesi yok: yazılı, VIP grup, hızlı okuma veya birebir."
      >
        <div className="mt-8 grid gap-6">
          {programs.map((program) => (
            <article key={program.id} className="grid overflow-hidden rounded-card border border-line lg:grid-cols-2">
              <img src={program.image} alt={program.alt} className="aspect-[4/3] h-full w-full object-cover" />
              <div className="flex flex-col p-6">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">{program.kicker}</p>
                <h2 className="mt-2 font-display text-4xl">{program.title}</h2>
                <p className="mt-3 text-muted">{program.text}</p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {program.points.map((point) => (
                    <li key={point} className="rounded-xl bg-foam px-3 py-2 font-medium">
                      {point}
                    </li>
                  ))}
                </ul>
                <Link to="/kayit" search={{ plan: program.id }} className={btnPrimary + " mt-6 self-start"}>
                  Kayıt ol
                </Link>
              </div>
            </article>
          ))}
        </div>
        <img
          src="/posters/cunku.jpg"
          alt="Çünkü Dikkatli olan kazanır"
          className="mt-8 w-full rounded-card border border-line"
        />
      </Page>
    </Shell>
  );
}

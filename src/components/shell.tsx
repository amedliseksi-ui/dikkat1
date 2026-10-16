import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Instagram, Menu, Phone, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/logo";
import { FALLBACK, telHref, waHref } from "@/lib/dikkat/content";
import type { Settings } from "@/lib/dikkat/api";

const links = [
  { to: "/", label: "Ana sayfa" },
  { to: "/oyunlar", label: "Oyunlar" },
  { to: "/programlar", label: "Programlar" },
  { to: "/foyler", label: "Föyler · VIP" },
  { to: "/kayit", label: "Kayıt ve ödeme" },
  { to: "/iletisim", label: "İletişim" },
] as const;

export const inputClass =
  "h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-base text-ink shadow-sm outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

export const btnPrimary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-paper shadow-sm shadow-primary/25 transition hover:bg-primary-deep disabled:opacity-60";

export const btnGhost =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-paper px-5 text-sm font-semibold text-ink transition hover:bg-foam";

export function Shell({
  settings,
  children,
}: {
  settings?: Settings | null;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const phone = settings?.phone || FALLBACK.phone;
  const instagram = settings?.instagram || FALLBACK.instagram;

  return (
    <div className="min-h-screen">
      <div className="bg-primary text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-sm">
          <a className="inline-flex items-center gap-2 font-semibold opacity-95 hover:opacity-100" href={telHref(phone)}>
            <Phone className="size-4" />
            {phone}
          </a>
          <p className="hidden truncate sm:block opacity-90">
            {settings?.branch || FALLBACK.branch}
            {settings?.city ? ` · ${settings.city}` : ` · ${FALLBACK.city}`}
          </p>
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <Wordmark />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  "rounded-full px-3 py-2 text-sm font-semibold " +
                  (pathname === link.to ? "bg-blush text-primary-deep" : "text-ink hover:bg-foam")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <AuthLinks pending={isPending} />
          </div>
          <a
            href={telHref(phone)}
            className="inline-flex h-11 items-center rounded-full bg-primary px-3 text-sm font-semibold text-paper lg:hidden"
          >
            Ara
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-line px-4 py-3 lg:hidden">
            <nav className="grid gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={
                    "rounded-xl px-3 py-3 text-base font-semibold " +
                    (pathname === link.to ? "bg-blush text-primary-deep" : "hover:bg-foam")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <AuthLinks pending={isPending} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-16 bg-primary-deep text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <Wordmark light />
            <p className="mt-4 max-w-xs text-sm text-blush">“DİKKAT”li olan kazanır.</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold">İletişim</p>
            <a className="mt-2 block text-base font-semibold" href={telHref(phone)}>
              {phone}
            </a>
            <p className="mt-2">
              {settings?.address || FALLBACK.address}
              <br />
              {settings?.city || FALLBACK.city}
            </p>
            <p className="mt-1 text-blush">{settings?.branch || FALLBACK.branch}</p>
            {settings?.hours ? <p className="mt-2">{settings.hours}</p> : null}
            {settings?.email ? <p className="mt-1">{settings.email}</p> : null}
          </div>
          <div className="text-sm">
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-semibold"
            >
              <Instagram className="size-4" />
              @dikkat.egitim.kurumu
            </a>
            <a className="mt-3 block font-semibold" href={waHref(settings?.whatsapp || phone)}>
              WhatsApp ile yazın
            </a>
            <div className="mt-4 flex flex-wrap gap-3 text-blush">
              <Link to="/foyler">Föyler</Link>
              <Link to="/hesap">Hesabım</Link>
              <Link to="/yonetim">Yönetim</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthLinks({ pending, onNavigate }: { pending: boolean; onNavigate?: () => void }) {
  if (pending) return <div className="h-11 w-28 animate-pulse rounded-full bg-blush" />;
  return (
    <>
      <SignedOut>
        <Link to="/login" onClick={onNavigate} className={btnGhost + " h-11"}>
          Giriş yap
        </Link>
        <Link to="/kayit" onClick={onNavigate} className={btnPrimary + " h-11"}>
          Kayıt ol
        </Link>
      </SignedOut>
      <SignedIn>
        <Link to="/hesap" onClick={onNavigate} className={btnGhost + " h-11"}>
          Hesabım
        </Link>
        <UserButton />
      </SignedIn>
    </>
  );
}

export function Page({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
      )}
      <h1 className="mt-2 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
      {lede && <p className="mt-4 max-w-2xl text-lg text-muted">{lede}</p>}
      {children}
    </div>
  );
}

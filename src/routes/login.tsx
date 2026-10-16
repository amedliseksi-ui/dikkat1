import { useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { Shell, btnPrimary, btnGhost, inputClass } from "@/components/shell";
import { getSettings, type Settings } from "@/lib/dikkat/api";
import { errText } from "@/lib/dikkat/content";

export const Route = createFileRoute("/login")({
  loader: () => getSettings(),
  component: LoginPage,
});

function LoginPage() {
  const settings = Route.useLoaderData() as Settings;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) {
        setError(trAuth(res.error.message));
        return;
      }
      await router.invalidate();
      await navigate({ to: "/hesap" });
    } catch (err) {
      setError(trAuth(errText(err)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell settings={settings}>
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% -10%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent), radial-gradient(ellipse 60% 40% at 90% 20%, color-mix(in oklab, var(--color-blush) 80%, transparent), transparent)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Giriş</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] sm:text-6xl">
              Hesabına
              <br />
              hoş geldin.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">
              Föyler, oyunlar ve üyeliğin tek yerden. Yeni misin?{" "}
              <Link to="/kayit" className="font-semibold text-primary underline-offset-2 hover:underline">
                Kayıt ol
              </Link>
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-blush text-xs font-bold text-primary">1</span>
                E-posta ve şifre ile giriş
              </li>
              <li className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-blush text-xs font-bold text-primary">2</span>
                Telefon zorunlu değil
              </li>
              <li className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-blush text-xs font-bold text-primary">3</span>
                Yönetim paneli:{" "}
                <code className="rounded bg-foam px-1.5 py-0.5 text-xs">/yonetim</code>
              </li>
            </ul>
          </div>

          <form
            onSubmit={submit}
            className="rounded-2xl border border-line bg-paper/95 p-6 shadow-xl shadow-primary/10 backdrop-blur sm:p-8"
          >
            <h2 className="font-display text-2xl text-ink">Giriş yap</h2>
            <p className="mt-1 text-sm text-muted">E-posta ve şifrenle devam et.</p>

            <label className="mt-6 grid gap-1.5 text-sm font-semibold">
              E-posta
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass + " pl-10"}
                  autoComplete="email"
                  placeholder="ornek@mail.com"
                />
              </div>
            </label>

            <label className="mt-4 grid gap-1.5 text-sm font-semibold">
              Şifre
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass + " pr-11 pl-10"}
                  autoComplete="current-password"
                  placeholder="En az 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
                  aria-label={showPw ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            {error && (
              <p className="mt-4 rounded-xl bg-blush px-4 py-3 text-sm text-primary-deep" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className={btnPrimary + " mt-6 w-full"}>
              {busy ? "Giriş yapılıyor…" : "Giriş yap"}
            </button>

            <p className="mt-4 text-center text-sm text-muted">
              Hesabın yok mu?{" "}
              <Link to="/kayit" className="font-semibold text-primary underline-offset-2 hover:underline">
                Kayıt ol
              </Link>
            </p>

            {GROK_PROVIDERS.length > 0 && (
              <>
                <div className="my-6 flex items-center gap-3 text-xs tracking-[0.16em] text-muted uppercase">
                  <span className="h-px flex-1 bg-line" />
                  veya
                  <span className="h-px flex-1 bg-line" />
                </div>
                <div className="grid gap-2">
                  {GROK_PROVIDERS.map((p) => (
                    <button
                      key={p.providerId}
                      type="button"
                      onClick={() => signIn(p.providerId, { callbackURL: "/hesap" })}
                      className={btnGhost + " w-full"}
                    >
                      {p.label} ile devam et
                    </button>
                  ))}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </Shell>
  );
}

function trAuth(msg?: string) {
  if (!msg) return "İşlem tamamlanamadı.";
  const m = msg.toLowerCase();
  if (m.includes("origin") || m.includes("csrf") || m.includes("forbidden")) {
    return "Güvenlik doğrulaması takıldı. Sayfayı yenileyip tekrar deneyin.";
  }
  if (m.includes("invalid email") || m.includes("invalid password") || m.includes("credential")) {
    return "E-posta veya şifre hatalı. Hesap yoksa önce Kayıt ol adımını tamamlayın.";
  }
  if (m.includes("user not found") || m.includes("not found")) {
    return "Bu e-posta ile hesap bulunamadı. Önce Kayıt ol ile oluşturun.";
  }
  if (m.includes("exist")) return "Bu e-posta ile bir hesap zaten var. Giriş yapın.";
  if (m.includes("password")) return "Şifre en az 8 karakter olmalı.";
  if (m.includes("invalid")) return "E-posta veya şifre hatalı.";
  return msg;
}

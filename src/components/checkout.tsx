import { useEffect, useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Check, CreditCard, Landmark, Wallet } from "lucide-react";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { btnGhost, btnPrimary, inputClass } from "@/components/shell";
import {
  createPayment,
  getMe,
  saveProfile,
  sendEmailCode,
  verifyEmailCode,
  type Me,
  type PayMethod,
  type Plan,
  type Settings,
} from "@/lib/dikkat/api";
import { cardBrand, errText, formatIban, luhnOk, telHref } from "@/lib/dikkat/content";

const steps = ["Program", "Hesap", "Ödeme", "Bitti"];

export function Checkout({
  settings,
  plans,
  initialPlan,
}: {
  settings: Settings;
  plans: Plan[];
  initialPlan: string;
}) {
  const known = plans.some((plan) => plan.id === initialPlan);
  const [step, setStep] = useState(0);
  const [planId, setPlanId] = useState(known ? initialPlan : plans[0]?.id ?? "");
  const { user, isPending } = useCurrentUserState();
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [delivered, setDelivered] = useState(false);
  const [payer, setPayer] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<PayMethod>("iban");
  const [holder, setHolder] = useState("");
  const [pan, setPan] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [last4, setLast4] = useState("");
  const [brand, setBrand] = useState("");
  const [bank, setBank] = useState(false);
  const [asset, setAsset] = useState<"usdt" | "btc">("usdt");
  const [tx, setTx] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const navigate = useNavigate();
  const router = useRouter();
  const plan = plans.find((item) => item.id === planId) ?? plans[0];

  useEffect(() => {
    if (!user) {
      setMe(null);
      return;
    }
    getMe()
      .then((next) => {
        setMe(next);
        setPayer((prev) => prev || next.displayName);
        setPhone((prev) => prev || next.phone);
      })
      .catch(() => setMe(null));
  }, [user]);

  async function refresh() {
    const next = await getMe();
    setMe(next);
    return next;
  }

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
    } catch {
      setCopied("");
    }
  }

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await authClient.signUp.email({ email, password, name: name || email });
      if (res.error) {
        setError(trAuth(res.error.message));
        return;
      }
      await saveProfile({ data: { displayName: name, phone } });
      const sent = await sendEmailCode();
      setDelivered(sent.delivered);
      setPreviewCode(sent.previewCode);
      setInfo(sent.already ? "E-posta zaten doğrulanmış." : "Doğrulama kodu hazır.");
      await router.invalidate();
      await refresh();
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await verifyEmailCode({ data: code });
      setPreviewCode(null);
      setInfo("E-posta doğrulandı.");
      await refresh();
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError("");
    setBusy(true);
    try {
      const sent = await sendEmailCode();
      setDelivered(sent.delivered);
      setPreviewCode(sent.previewCode);
      setInfo(sent.already ? "E-posta zaten doğrulanmış." : "Yeni kod hazır.");
      if (sent.already) await refresh();
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  function openBank() {
    setError("");
    const digits = pan.replace(/\D/g, "");
    if (holder.trim().length < 3) {
      setError("Kart üzerindeki adı yazın.");
      return;
    }
    if (!luhnOk(digits)) {
      setError("Kart numarası geçersiz.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      setError("Son kullanma AA/YY biçiminde olmalı.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV 3 veya 4 hane olmalı.");
      return;
    }
    setBrand(cardBrand(digits));
    setLast4(digits.slice(-4));
    setPan("");
    setCvv("");
    setBank(true);
  }

  async function pay() {
    if (!plan) return;
    setError("");
    setBusy(true);
    try {
      const result = await createPayment({
        data: {
          planId: plan.id,
          method,
          payerName: payer.trim(),
          note: note.trim(),
          last4: method === "card_3ds" ? last4 : "",
          txHash: method === "crypto" ? tx.trim() : "",
          asset: method === "crypto" ? asset : "",
        },
      });
      setReference(result.reference);
      setBank(false);
      setStep(3);
      await refresh();
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  const wallet = asset === "btc" ? settings.cryptoBtc : settings.cryptoUsdt;

  return (
    <div>
      <ol className="grid grid-cols-4 gap-2">
        {steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              disabled={index > step}
              onClick={() => index < step && setStep(index)}
              className={
                "h-11 w-full rounded-full px-1 text-xs font-semibold sm:text-sm " +
                (index === step ? "bg-primary text-paper" : index < step ? "bg-blush text-primary-deep" : "bg-foam text-muted")
              }
            >
              {index + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      {error && (
        <p className="mt-4 rounded-xl bg-blush px-4 py-3 text-sm text-primary-deep" role="alert">
          {error}
        </p>
      )}
      {info && !error && <p className="mt-4 text-sm font-medium text-primary-deep">{info}</p>}

      {step === 0 && (
        <div className="mt-6 grid gap-3">
          {plans.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPlanId(item.id)}
              className={
                "rounded-card border p-4 text-left " +
                (item.id === planId ? "border-primary bg-foam" : "border-line bg-paper")
              }
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block font-display text-2xl">{item.name}</span>
                  <span className="mt-1 block text-sm text-muted">{item.description}</span>
                </span>
                {item.id === planId && <Check className="size-5 text-primary" />}
              </span>
              <span className="mt-3 block text-sm font-semibold">{item.priceLabel}</span>
            </button>
          ))}
          <button type="button" className={btnPrimary + " mt-2"} onClick={() => setStep(1)} disabled={!plan}>
            Devam
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6">
          {isPending ? (
            <div className="h-40 animate-pulse rounded-card bg-blush" />
          ) : !user ? (
            <form onSubmit={register} className="grid gap-4 rounded-2xl border border-line bg-gradient-to-b from-paper to-foam p-6 shadow-sm">
              <div>
                <h2 className="font-display text-3xl">Hesap aç</h2>
                <p className="mt-1 text-sm text-muted">E-posta ve şifre yeterli. Telefon isteğe bağlı.</p>
              </div>
              <label className="grid gap-1.5 text-sm font-semibold">
                Ad soyad
                <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" placeholder="Adın ve soyadın" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                E-posta
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" placeholder="ornek@mail.com" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                Şifre
                <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} autoComplete="new-password" placeholder="En az 8 karakter" />
              </label>
              <label className="grid gap-1.5 text-sm font-semibold">
                Telefon <span className="font-normal text-muted">(isteğe bağlı)</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} autoComplete="tel" inputMode="tel" placeholder="05xx xxx xx xx" />
              </label>
              <button type="submit" disabled={busy} className={btnPrimary + " w-full"}>
                {busy ? "Kaydediliyor…" : "Kayıt ol ve devam et"}
              </button>
              <p className="text-center text-sm text-muted">
                Hesabın var mı?{" "}
                <button type="button" className="font-semibold text-primary underline-offset-2 hover:underline" onClick={() => navigate({ to: "/login" })}>
                  Giriş yap
                </button>
              </p>
              {GROK_PROVIDERS.length > 0 && (
                <>
                  <div className="flex items-center gap-3 text-xs tracking-[0.14em] text-muted uppercase">
                    <span className="h-px flex-1 bg-line" />
                    veya
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <div className="grid gap-2">
                    {GROK_PROVIDERS.map((p) => (
                      <button
                        key={p.providerId}
                        type="button"
                        onClick={() => signIn(p.providerId, { callbackURL: "/kayit" })}
                        className={btnGhost + " w-full"}
                      >
                        {p.label} ile devam et
                      </button>
                    ))}
                  </div>
                </>
              )}
            </form>
          ) : !me?.emailVerified ? (
            <form onSubmit={confirmCode} className="grid gap-3 rounded-card border border-line p-5">
              <h2 className="font-display text-3xl">E-postanı doğrula</h2>
              <p className="text-sm text-muted">{me?.email || user.primaryEmail} adresine 6 haneli kod gider.</p>
              {previewCode && (
                <div className="rounded-card border border-dashed border-primary bg-foam p-4">
                  <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Doğrulama iletisi</p>
                  <p className="mt-2 text-sm">
                    E-posta sunucusu bu ortamda bağlı değil. Alan adı yayına alınca aynı kod yalnızca gelen kutuna gider.
                    Şimdilik kod burada:
                  </p>
                  <p className="mt-3 font-display text-4xl tracking-[0.3em]">{previewCode}</p>
                </div>
              )}
              {delivered && !previewCode && (
                <p className="text-sm">Kod gelen kutuna gönderildi. 15 dakika geçerlidir.</p>
              )}
              <label className="grid gap-1 text-sm font-semibold">
                6 haneli kod
                <input
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputClass + " tracking-[0.4em]"}
                />
              </label>
              <button type="submit" disabled={busy} className={btnPrimary}>
                {busy ? "Kontrol ediliyor…" : "Doğrula"}
              </button>
              <button type="button" disabled={busy} onClick={resend} className={btnGhost}>
                Kodu tekrar gönder
              </button>
            </form>
          ) : (
            <div className="rounded-card border border-line p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Hesap hazır</p>
              <h2 className="mt-2 font-display text-3xl">{me.displayName || "Öğrenci"}</h2>
              <p className="mt-1 text-sm text-muted">{me.email}</p>
              <p className="mt-3 text-sm font-semibold text-primary-deep">E-posta doğrulandı.</p>
              <button type="button" className={btnPrimary + " mt-5"} onClick={() => setStep(2)}>
                Ödemeye geç
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && plan && (
        <div className="mt-6 grid gap-4">
          {!me?.emailVerified ? (
            <div className="rounded-card border border-line p-5">
              <p>Ödeme, e-posta doğrulanınca açılır.</p>
              <button type="button" className={btnPrimary + " mt-4"} onClick={() => setStep(1)}>
                Hesaba dön
              </button>
            </div>
          ) : bank ? (
            <div className="rounded-card bg-primary-deep p-6 text-paper">
              <p className="text-xs font-semibold tracking-[0.18em] text-blush uppercase">3D Secure</p>
              <h2 className="mt-2 font-display text-4xl">Banka doğrulama</h2>
              <dl className="mt-5 grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-blush">İşyeri</dt>
                  <dd>Mersin Dikkat Eğitim</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-blush">Program</dt>
                  <dd>{plan.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-blush">Tutar yazısı</dt>
                  <dd>{plan.priceLabel}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-blush">Kart</dt>
                  <dd>
                    {brand} ···· {last4}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-blush">
                Kart numaranız ve CVV bu sitede tutulmaz. Bildirim kurum onayına düşer; üyelik ödeme görülünce açılır.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" disabled={busy} onClick={pay} className="inline-flex h-12 items-center rounded-full bg-paper px-5 font-semibold text-primary disabled:opacity-60">
                  {busy ? "İletiliyor…" : "Doğrulamayı tamamla"}
                </button>
                <button type="button" onClick={() => setBank(false)} className="inline-flex h-12 items-center rounded-full border border-paper/40 px-5 font-semibold">
                  Vazgeç
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-2 sm:grid-cols-3">
                <MethodButton active={method === "card_3ds"} onClick={() => setMethod("card_3ds")} icon={<CreditCard className="size-4" />} label="Kart · 3D Secure" />
                <MethodButton active={method === "crypto"} onClick={() => setMethod("crypto")} icon={<Wallet className="size-4" />} label="Kripto" />
                <MethodButton active={method === "iban"} onClick={() => setMethod("iban")} icon={<Landmark className="size-4" />} label="Havale / IBAN" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-semibold">
                  Ödemeyi yapan
                  <input value={payer} onChange={(e) => setPayer(e.target.value)} className={inputClass} />
                </label>
                <label className="grid gap-1 text-sm font-semibold">
                  Sınıf veya not
                  <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} placeholder="11. sınıf, mezun, TYT" />
                </label>
              </div>

              {method === "card_3ds" && (
                <div className="grid gap-3 rounded-card border border-line p-5">
                  <p className="text-sm text-muted">Bilgiler yalnızca bu ekranda kontrol edilir. Sunucuya kart numarası gitmez.</p>
                  <label className="grid gap-1 text-sm font-semibold">
                    Kart üzerindeki ad
                    <input value={holder} onChange={(e) => setHolder(e.target.value)} className={inputClass} autoComplete="cc-name" />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold">
                    Kart numarası
                    <input value={pan} onChange={(e) => setPan(e.target.value)} className={inputClass} inputMode="numeric" autoComplete="cc-number" placeholder="•••• •••• •••• ••••" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-1 text-sm font-semibold">
                      AA/YY
                      <input value={exp} onChange={(e) => setExp(e.target.value)} className={inputClass} autoComplete="cc-exp" placeholder="08/28" />
                    </label>
                    <label className="grid gap-1 text-sm font-semibold">
                      CVV
                      <input value={cvv} onChange={(e) => setCvv(e.target.value)} className={inputClass} inputMode="numeric" autoComplete="cc-csc" />
                    </label>
                  </div>
                  <button type="button" onClick={openBank} className={btnPrimary}>
                    3D Secure ekranına geç
                  </button>
                </div>
              )}

              {method === "crypto" && (
                <div className="grid gap-3 rounded-card border border-line p-5">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setAsset("usdt")} className={(asset === "usdt" ? btnPrimary : btnGhost) + " w-full"}>
                      USDT · TRC-20
                    </button>
                    <button type="button" onClick={() => setAsset("btc")} className={(asset === "btc" ? btnPrimary : btnGhost) + " w-full"}>
                      Bitcoin
                    </button>
                  </div>
                  {wallet ? (
                    <>
                      <p className="break-all rounded-xl bg-foam p-3 font-mono text-sm">{wallet}</p>
                      <button type="button" onClick={() => copy("Cüzdan", wallet)} className={btnGhost}>
                        {copied === "Cüzdan" ? "Kopyalandı" : "Adresi kopyala"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm">
                      Bu ağın cüzdanı henüz yok.{" "}
                      <a className="font-semibold text-primary" href={telHref(settings.phone)}>
                        {settings.phone}
                      </a>
                    </p>
                  )}
                  <label className="grid gap-1 text-sm font-semibold">
                    İşlem karması (TX)
                    <input value={tx} onChange={(e) => setTx(e.target.value)} className={inputClass} placeholder="Transfer sonrası TX" />
                  </label>
                  <button type="button" disabled={busy || !wallet} onClick={pay} className={btnPrimary}>
                    {busy ? "Kaydediliyor…" : "Kripto ödemesini bildir"}
                  </button>
                </div>
              )}

              {method === "iban" && (
                <div className="grid gap-3 rounded-card border border-line p-5">
                  {settings.iban ? (
                    <>
                      <p className="text-sm text-muted">{settings.ibanHolder}</p>
                      <p className="font-display text-2xl tracking-wide">{formatIban(settings.iban)}</p>
                      <button type="button" onClick={() => copy("IBAN", settings.iban)} className={btnGhost}>
                        {copied === "IBAN" ? "Kopyalandı" : "IBAN kopyala"}
                      </button>
                      <p className="text-sm text-muted">
                        Havale açıklamasına, bir sonraki adımda çıkacak DKT kodunu yazın. Üyelik, dekont kurumda görülünce açılır.
                      </p>
                    </>
                  ) : (
                    <p className="text-sm">
                      IBAN henüz yayınlanmadı.{" "}
                      <a className="font-semibold text-primary" href={telHref(settings.phone)}>
                        {settings.phone || "0535 238 17 65"}
                      </a>{" "}
                      numarasından isteyin. Yönetim panelinden de eklenir.
                    </p>
                  )}
                  <button type="button" disabled={busy || !settings.iban} onClick={pay} className={btnPrimary}>
                    {busy ? "Kaydediliyor…" : "Havaleyi bildirdim"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 rounded-card border border-line p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Ödeme bildirildi</p>
          <h2 className="mt-2 font-display text-4xl">{reference}</h2>
          <p className="mt-3 text-muted">
            {method === "iban"
              ? "Bu kodu havale açıklamasına yazın. Kurum dekontu görünce kaydı açar."
              : method === "crypto"
                ? "İşlem karmanız kayda geçti. Kurum transferi görünce kaydı açar."
                : "3D Secure bildiriminiz alındı. Kart numarası saklanmadı. Kurum ödemeyi görünce kaydı açar."}
          </p>
          <button type="button" onClick={() => copy("Referans", reference)} className={btnGhost + " mt-4"}>
            {copied === "Referans" ? "Kopyalandı" : "Referansı kopyala"}
          </button>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/hesap" className={btnPrimary}>
              Hesabıma git
            </Link>
            <a href={telHref(settings.phone)} className={btnGhost}>
              {settings.phone}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function MethodButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold " +
        (active ? "bg-primary text-paper" : "border border-line bg-paper")
      }
    >
      {icon}
      {label}
    </button>
  );
}

function trAuth(msg?: string) {
  if (!msg) return "İşlem tamamlanamadı.";
  const m = msg.toLowerCase();
  if (m.includes("exist")) return "Bu e-posta ile bir hesap zaten var.";
  if (m.includes("password")) return "Şifre en az 8 karakter olmalı.";
  if (m.includes("origin")) return "Güvenlik doğrulaması takıldı. Sayfayı yenileyip tekrar deneyin.";
  return msg;
}

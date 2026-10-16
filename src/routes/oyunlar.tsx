import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  Layers,
  HelpCircle,
  BookOpen,
  ListOrdered,
  Play,
  X,
  Check,
  RotateCcw,
  Trophy,
  Target,
} from "lucide-react";
import { Shell, btnPrimary, btnGhost, Page } from "@/components/shell";
import { getSettings, listGames, type Game, type GameType, type Settings } from "@/lib/dikkat/api";

export const Route = createFileRoute("/oyunlar")({
  loader: async () => {
    const [settings, games] = await Promise.all([getSettings(), listGames()]);
    return { settings, games };
  },
  component: OyunlarPage,
});

const typeMeta: Record<GameType, { label: string; icon: typeof Brain; color: string; soft: string }> = {
  memory: { label: "Hafıza", icon: Brain, color: "bg-violet-500", soft: "bg-violet-50 text-violet-700" },
  match: { label: "Eşleştir", icon: Layers, color: "bg-sky-500", soft: "bg-sky-50 text-sky-700" },
  quiz: { label: "Quiz", icon: HelpCircle, color: "bg-amber-500", soft: "bg-amber-50 text-amber-800" },
  flashcards: { label: "Flashcard", icon: BookOpen, color: "bg-emerald-500", soft: "bg-emerald-50 text-emerald-800" },
  sort: { label: "Sırala", icon: ListOrdered, color: "bg-rose-500", soft: "bg-rose-50 text-rose-700" },
  wheel: { label: "Çark", icon: Target, color: "bg-fuchsia-500", soft: "bg-fuchsia-50 text-fuchsia-800" },
};

/** Grade string like "7", "7-8", "9-12" matches selected grade "7".."12" */
function gradeMatches(gameGrade: string, selected: string): boolean {
  if (selected === "all") return true;
  if (!gameGrade || gameGrade.trim() === "") return true;
  const parts = gameGrade.split(/[-–]/).map((s) => s.trim());
  const sel = parseInt(selected, 10);
  if (Number.isNaN(sel)) return true;
  if (parts.length === 1) {
    const g = parseInt(parts[0], 10);
    return !Number.isNaN(g) && g === sel;
  }
  const low = parseInt(parts[0], 10);
  const high = parseInt(parts[1], 10);
  if (Number.isNaN(low) || Number.isNaN(high)) return true;
  return sel >= low && sel <= high;
}

const GRADES = ["7", "8", "9", "10", "11", "12"] as const;

function OyunlarPage() {
  const { settings, games } = Route.useLoaderData() as { settings: Settings; games: Game[] };
  const [active, setActive] = useState<Game | null>(null);
  const [filter, setFilter] = useState<GameType | "all">("all");
  const [subject, setSubject] = useState<string>("all");
  const [grade, setGrade] = useState<string>("all");

  const subjects = useMemo(() => {
    const set = new Set(games.map((g) => g.subject).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [games]);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (filter !== "all" && g.type !== filter) return false;
      if (subject !== "all" && g.subject !== subject) return false;
      if (!gradeMatches(g.grade, grade)) return false;
      return true;
    });
  }, [games, filter, subject, grade]);

  return (
    <Shell settings={settings}>
      <Page
        eyebrow="Eğitici oyunlar"
        title="Sınıflara göre dikkat ve konu oyunları"
        lede="7–12. sınıf için hafıza, eşleştirme, quiz, flashcard, sıralama ve çark oyunları. Sınıfını seç, oyna — kayıt olmadan."
      >
        {/* Sınıf filtresi */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGrade("all")}
            className={
              "h-10 rounded-full px-4 text-sm font-semibold transition " +
              (grade === "all" ? "bg-primary text-paper shadow-sm shadow-primary/20" : "border border-line hover:bg-foam")
            }
          >
            Tüm sınıflar
          </button>
          {GRADES.map((g) => {
            const count = games.filter((game) => gradeMatches(game.grade, g)).length;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={
                  "h-10 rounded-full px-4 text-sm font-semibold transition " +
                  (grade === g ? "bg-primary text-paper shadow-sm shadow-primary/20" : "border border-line hover:bg-foam")
                }
              >
                {g}. Sınıf ({count})
              </button>
            );
          })}
        </div>

        {/* Oyun türü filtresi */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={
              "h-9 rounded-full px-3 text-xs font-semibold transition " +
              (filter === "all" ? "bg-ink text-paper" : "bg-foam text-muted hover:text-ink")
            }
          >
            Tüm türler ({games.length})
          </button>
          {(Object.keys(typeMeta) as GameType[]).map((t) => {
            const m = typeMeta[t];
            const count = games.filter((g) => g.type === t).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={
                  "h-9 rounded-full px-3 text-xs font-semibold transition " +
                  (filter === t ? "bg-ink text-paper" : "bg-foam text-muted hover:text-ink")
                }
              >
                {m.label} ({count})
              </button>
            );
          })}
        </div>

        {subjects.length > 2 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSubject(s)}
                className={
                  "h-9 rounded-full px-3 text-xs font-semibold transition " +
                  (subject === s ? "bg-ink text-paper" : "bg-foam text-muted hover:text-ink")
                }
              >
                {s === "all" ? "Tüm konular" : s}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((game) => {
            const meta = typeMeta[game.type];
            const Icon = meta.icon;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setActive(game)}
                className="card-hover group flex flex-col rounded-2xl border border-line bg-paper p-5 text-left shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex size-11 items-center justify-center rounded-xl ${meta.color} text-white shadow-sm`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-full bg-foam px-2.5 py-0.5 text-xs font-semibold text-muted">
                    {game.grade || "Tüm seviyeler"}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl leading-tight text-ink group-hover:text-primary">
                  {game.title}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{game.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.soft}`}>
                    {game.subject || meta.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    <Play className="size-4" /> Oyna
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-muted">Bu filtrede henüz oyun yok.</p>
        )}

        <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-foam via-paper to-blush p-6 text-center sm:p-8">
          <p className="font-display text-2xl sm:text-3xl">Daha fazla içerik için kayıt ol</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            Üyelikle VIP gruplar, yazılı hazırlık ve özel föy arşivine eriş.
          </p>
          <Link to="/kayit" className={btnPrimary + " mt-5"}>
            Kayıt ol
          </Link>
        </div>
      </Page>

      {active && <GameModal game={active} onClose={() => setActive(null)} />}
    </Shell>
  );
}

function GameModal({ game, onClose }: { game: Game; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-3 backdrop-blur-sm sm:p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl shadow-ink/20">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-foam/60 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {typeMeta[game.type].label} · {game.subject}
            </p>
            <h2 className="truncate font-display text-xl sm:text-2xl">{game.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-line bg-paper p-2 hover:bg-blush"
            aria-label="Kapat"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {game.type === "memory" && <MemoryGame content={game.content} />}
          {game.type === "match" && <MatchGame content={game.content} />}
          {game.type === "quiz" && <QuizGame content={game.content} />}
          {game.type === "flashcards" && <FlashcardsGame content={game.content} />}
          {game.type === "sort" && <SortGame content={game.content} />}
          {game.type === "wheel" && <WheelGame content={game.content} />}
        </div>
      </div>
    </div>
  );
}

function WinBanner({ title, subtitle, onReset }: { title: string; subtitle?: string; onReset: () => void }) {
  return (
    <div className="mb-5 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-4 text-center">
      <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-emerald-500 text-white">
        <Trophy className="size-5" />
      </div>
      <p className="font-display text-xl text-emerald-900">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-emerald-800/80">{subtitle}</p>}
      <button type="button" onClick={onReset} className={btnGhost + " mt-3 h-10"}>
        <RotateCcw className="size-4" /> Yeniden oyna
      </button>
    </div>
  );
}

function MemoryGame({ content }: { content: Record<string, unknown> }) {
  const pairs = (content.pairs as { id: string; front: string; back: string }[]) || [];
  const [seed, setSeed] = useState(0);
  const cards = useMemo(() => {
    const list = pairs.flatMap((p) => [
      { key: p.id + "-f", pairId: p.id, text: p.front },
      { key: p.id + "-b", pairId: p.id, text: p.back },
    ]);
    return list.sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs, seed]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  function flip(key: string, pairId: string) {
    if (lock || flipped.includes(key) || matched.has(pairId)) return;
    const next = [...flipped, key];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = next;
      const cardA = cards.find((c) => c.key === a)!;
      const cardB = cards.find((c) => c.key === b)!;
      if (cardA.pairId === cardB.pairId) {
        setMatched((m) => new Set([...m, cardA.pairId]));
        setFlipped([]);
        setLock(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 700);
      }
    }
  }

  const done = pairs.length > 0 && matched.size === pairs.length;

  function reset() {
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLock(false);
    setSeed((s) => s + 1);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="rounded-full bg-foam px-3 py-1 font-semibold text-muted">
          Hamle: <span className="text-ink">{moves}</span>
        </span>
        <span className="rounded-full bg-foam px-3 py-1 font-semibold text-muted">
          Eşleşme: <span className="text-ink">{matched.size}/{pairs.length}</span>
        </span>
      </div>
      {done && (
        <WinBanner
          title="Tüm eşleşmeler tamam!"
          subtitle={`${moves} hamlede bitti.`}
          onReset={reset}
        />
      )}
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {cards.map((c) => {
          const isUp = flipped.includes(c.key) || matched.has(c.pairId);
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => flip(c.key, c.pairId)}
              className={
                "game-card-face flex min-h-[4.5rem] items-center justify-center rounded-xl border-2 p-2 text-center text-xs font-semibold sm:min-h-[5.5rem] sm:text-sm " +
                (isUp
                  ? matched.has(c.pairId)
                    ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                    : "border-primary bg-primary/10 text-ink"
                  : "border-line bg-gradient-to-br from-foam to-blush text-primary hover:border-primary")
              }
            >
              {isUp ? c.text : "?"}
            </button>
          );
        })}
      </div>
      {!done && (
        <button type="button" onClick={reset} className={btnGhost + " mt-4"}>
          <RotateCcw className="size-4" /> Yeniden
        </button>
      )}
    </div>
  );
}

function MatchGame({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as { left: string; right: string }[]) || [];
  const [seed, setSeed] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const rights = useMemo(
    () => [...items.map((i) => i.right)].sort(() => Math.random() - 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, seed],
  );

  function pickLeft(l: string) {
    if (matched.has(l)) return;
    setSelectedLeft(l);
    setWrong(null);
  }

  function pickRight(r: string) {
    if (!selectedLeft) return;
    const correct = items.find((i) => i.left === selectedLeft)?.right === r;
    if (correct) {
      setMatched((m) => new Set([...m, selectedLeft]));
      setSelectedLeft(null);
    } else {
      setMistakes((n) => n + 1);
      setWrong(r);
      setTimeout(() => setWrong(null), 550);
    }
  }

  const done = items.length > 0 && matched.size === items.length;

  function reset() {
    setSelectedLeft(null);
    setMatched(new Set());
    setWrong(null);
    setMistakes(0);
    setSeed((s) => s + 1);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-foam px-3 py-1 font-semibold text-muted">
          Doğru: {matched.size}/{items.length}
        </span>
        <span className="rounded-full bg-foam px-3 py-1 font-semibold text-muted">Hata: {mistakes}</span>
      </div>
      {done && (
        <WinBanner title="Harika eşleştirme!" subtitle={`${mistakes} hatalı deneme.`} onReset={reset} />
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Sol</p>
          {items.map((i) => (
            <button
              key={i.left}
              type="button"
              disabled={matched.has(i.left)}
              onClick={() => pickLeft(i.left)}
              className={
                "w-full rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition " +
                (matched.has(i.left)
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 opacity-70"
                  : selectedLeft === i.left
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-line hover:border-primary")
              }
            >
              {i.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Sağ</p>
          {rights.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => pickRight(r)}
              className={
                "w-full rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition " +
                (wrong === r ? "border-rose-400 bg-rose-50 text-rose-800" : "border-line hover:border-primary")
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      {!done && (
        <button type="button" onClick={reset} className={btnGhost + " mt-4"}>
          <RotateCcw className="size-4" /> Yeniden
        </button>
      )}
    </div>
  );
}

function QuizGame({ content }: { content: Record<string, unknown> }) {
  const questions = (content.questions as { q: string; options: string[]; answer: number }[]) || [];
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  function answer(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 >= questions.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setChosen(null);
    }
  }

  function reset() {
    setIdx(0);
    setScore(0);
    setChosen(null);
    setDone(false);
  }

  if (!q && !done) return <p className="text-muted">Soru yok.</p>;

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center">
        <div className="mx-auto mb-3 grid size-14 place-items-center rounded-full bg-primary text-paper">
          <Trophy className="size-7" />
        </div>
        <p className="font-display text-3xl">
          {score}/{questions.length}
        </p>
        <p className="mt-1 text-muted">%{pct} başarı</p>
        <p className="mt-3 text-sm font-semibold text-ink">
          {score === questions.length
            ? "Mükemmel — edebiyat ustası!"
            : score >= questions.length / 2
              ? "İyi iş — biraz daha pekiştir."
              : "Tekrar dene, öğrenme böyle olur."}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-foam">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <button type="button" className={btnPrimary + " mt-6"} onClick={reset}>
          Yeniden oyna
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2 text-sm">
        <p className="font-semibold text-muted">
          Soru {idx + 1} / {questions.length}
        </p>
        <p className="rounded-full bg-foam px-3 py-1 font-semibold">Skor: {score}</p>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((idx + (chosen !== null ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>
      <h3 className="font-display text-xl leading-snug sm:text-2xl">{q.q}</h3>
      <div className="mt-4 space-y-2">
        {q.options.map((opt, i) => {
          let cls = "w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ";
          if (chosen === null) cls += "border-line hover:border-primary hover:bg-foam";
          else if (i === q.answer) cls += "border-emerald-400 bg-emerald-50 text-emerald-900";
          else if (i === chosen) cls += "border-rose-400 bg-rose-50 text-rose-900";
          else cls += "border-line opacity-45";
          return (
            <button key={i} type="button" onClick={() => answer(i)} className={cls}>
              <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-foam text-xs font-bold text-muted">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <button type="button" onClick={next} className={btnPrimary + " mt-5 w-full sm:w-auto"}>
          {idx + 1 >= questions.length ? "Sonucu gör" : "Sonraki soru"}
        </button>
      )}
    </div>
  );
}

function FlashcardsGame({ content }: { content: Record<string, unknown> }) {
  const cards = (content.cards as { front: string; back: string }[]) || [];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  const card = cards[idx];
  if (!card) return <p className="text-muted">Kart yok.</p>;

  function go(delta: number, markKnown?: boolean) {
    if (markKnown) setKnown((k) => k + 1);
    setFlipped(false);
    setIdx((i) => Math.min(cards.length - 1, Math.max(0, i + delta)));
  }

  const atEnd = idx >= cards.length - 1 && flipped;

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center gap-2 text-sm">
        <span className="rounded-full bg-foam px-3 py-1 font-semibold text-muted">
          {idx + 1} / {cards.length}
        </span>
        <span className="rounded-full bg-foam px-3 py-1 font-semibold text-muted">Bildiğim: {known}</span>
      </div>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={
          "game-card-face mx-auto flex min-h-[180px] w-full max-w-md flex-col items-center justify-center rounded-2xl border-2 px-6 py-10 shadow-sm " +
          (flipped
            ? "border-primary bg-gradient-to-br from-primary/10 to-blush"
            : "border-line bg-gradient-to-br from-paper to-foam hover:border-primary")
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {flipped ? "Tanım / karşılık" : "Terim / soru"} · tıkla çevir
        </p>
        <p className="mt-3 font-display text-2xl leading-snug sm:text-3xl">{flipped ? card.back : card.front}</p>
      </button>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button type="button" disabled={idx === 0} onClick={() => go(-1)} className={btnGhost + " disabled:opacity-40"}>
          Önceki
        </button>
        <button type="button" onClick={() => setFlipped((f) => !f)} className={btnGhost}>
          Çevir
        </button>
        {!atEnd ? (
          <button
            type="button"
            onClick={() => go(1, flipped)}
            className={btnPrimary}
          >
            {flipped ? (
              <>
                <Check className="size-4" /> Biliyorum
              </>
            ) : (
              "Sonraki"
            )}
          </button>
        ) : (
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setIdx(0);
              setFlipped(false);
              setKnown(0);
            }}
          >
            <RotateCcw className="size-4" /> Baştan
          </button>
        )}
      </div>
    </div>
  );
}

function SortGame({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as { id: string; text: string; order: number }[]) || [];
  const [seed, setSeed] = useState(0);
  const [order, setOrder] = useState<string[]>(() =>
    [...items].sort(() => Math.random() - 0.5).map((i) => i.id),
  );
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOrder([...items].sort(() => Math.random() - 0.5).map((i) => i.id));
    setChecked(false);
    setOk(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, items]);

  function move(i: number, dir: -1 | 1) {
    if (checked) return;
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  function check() {
    const correct = items
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((i) => i.id);
    const match = correct.every((id, idx) => id === order[idx]);
    setOk(match);
    setChecked(true);
  }

  function reset() {
    setSeed((s) => s + 1);
  }

  const byId = Object.fromEntries(items.map((i) => [i.id, i]));

  return (
    <div>
      {checked && ok && <WinBanner title="Sıra doğru!" onReset={reset} />}
      {checked && !ok && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-800">
          Henüz tam doğru değil. Oklarla sırayı düzeltip tekrar dene.
        </div>
      )}
      <ol className="space-y-2">
        {order.map((id, i) => (
          <li
            key={id}
            className={
              "flex items-center gap-2 rounded-xl border px-3 py-2.5 " +
              (checked
                ? ok
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-line bg-paper"
                : "border-line bg-paper")
            }
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foam text-sm font-bold text-muted">
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-semibold">{byId[id]?.text}</span>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                disabled={checked || i === 0}
                onClick={() => move(i, -1)}
                className="rounded-lg border border-line px-2 py-1 text-xs font-bold disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={checked || i === order.length - 1}
                onClick={() => move(i, 1)}
                className="rounded-lg border border-line px-2 py-1 text-xs font-bold disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        {!checked ? (
          <button type="button" onClick={check} className={btnPrimary}>
            Kontrol et
          </button>
        ) : (
          <button type="button" onClick={reset} className={btnPrimary}>
            <RotateCcw className="size-4" /> Yeniden
          </button>
        )}
      </div>
    </div>
  );
}

function WheelGame({ content }: { content: Record<string, unknown> }) {
  const segments = (content.segments as { label: string; color?: string }[]) || [];
  const colors = ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#06b6d4", "#f97316", "#ec4899", "#14b8a6", "#8b5cf6"];
  const n = Math.max(segments.length, 1);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  function spin() {
    if (spinning || segments.length === 0) return;
    setSpinning(true);
    setResult(null);
    const idx = Math.floor(Math.random() * segments.length);
    const slice = 360 / n;
    // land so pointer (top) hits center of chosen slice
    const targetAngle = 360 * 5 + (360 - (idx * slice + slice / 2));
    setRotation((prev) => prev + targetAngle - (prev % 360));
    window.setTimeout(() => {
      const label = segments[idx]?.label ?? "";
      setResult(label);
      setHistory((h) => [label, ...h].slice(0, 8));
      setSpinning(false);
    }, 4200);
  }

  const gradient = segments
    .map((s, i) => {
      const c = s.color || colors[i % colors.length];
      const start = (i / n) * 100;
      const end = ((i + 1) / n) * 100;
      return `${c} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        {/* pointer */}
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1">
          <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-primary drop-shadow" />
        </div>
        <div
          className="animate-spin-wheel relative size-64 rounded-full border-4 border-ink shadow-xl sm:size-72"
          style={{
            background: `conic-gradient(${gradient})`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {segments.map((s, i) => {
            const angle = (i + 0.5) * (360 / n);
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-center text-center text-[11px] font-bold text-white drop-shadow-sm sm:text-xs"
                style={{
                  transform: `rotate(${angle}deg) translateY(-105px) rotate(${-angle}deg)`,
                  width: 72,
                  marginLeft: -36,
                }}
              >
                {s.label.length > 12 ? s.label.slice(0, 11) + "…" : s.label}
              </div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-paper shadow-md">
            <Target className={"size-6 text-primary " + (spinning ? "animate-spin" : "")} />
          </div>
        </div>
      </div>

      <button type="button" disabled={spinning || segments.length === 0} onClick={spin} className={btnPrimary + " h-12 min-w-[160px] disabled:opacity-50"}>
        {spinning ? "Dönüyor…" : "Çarkı çevir"}
      </button>

      {result && (
        <div className="animate-pop mt-6 w-full max-w-sm rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-fuchsia-50 px-5 py-4 text-center">
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">Çıkan kelime</p>
          <p className="mt-1 font-display text-3xl text-ink">{result}</p>
          <p className="mt-2 text-sm text-muted">İşaretle veya defterine yaz, sonra tekrar çevir.</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 w-full max-w-sm">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Son çıkanlar</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {history.map((h, i) => (
              <span key={i} className="animate-fade-in rounded-full bg-foam px-3 py-1 text-sm font-semibold">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export function Wordmark({ light = false }: { light?: boolean }) {
  const red = light ? "text-paper" : "text-primary";
  const bar = light ? "bg-paper text-primary" : "bg-primary text-paper";
  const top = light ? "bg-paper/15 text-paper" : "bg-blush text-primary";
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`px-1 text-[10px] font-semibold tracking-[0.22em] ${top}`}>MERSİN</span>
      <span className={`font-display text-[1.65rem] font-semibold tracking-wide ${red}`}>DİKKAT</span>
      <span className={`px-1 py-0.5 text-[9px] font-semibold tracking-[0.16em] ${bar}`}>
        EĞİTİM KURUMLARI
      </span>
    </span>
  );
}

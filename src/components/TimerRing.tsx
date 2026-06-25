export default function TimerRing({ remaining, total, label, accent = "#818cf8" }: {
  remaining: number
  total: number
  label?: string
  accent?: string
}) {
  const r = 130
  const c = 2 * Math.PI * r
  const pct = total ? remaining / total : 0
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(Math.floor(remaining % 60)).padStart(2, "0")
  return (
    <div className="relative" style= width: 300, height: 300 >
      <svg width="300" height="300" style= transform: "rotate(-90deg)" >
        <circle cx="150" cy="150" r={r} stroke="rgba(255,255,255,.08)" strokeWidth="14" fill="none" />
        <circle cx="150" cy="150" r={r} stroke={accent} strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: "stroke-dashoffset 1s linear", filter: `drop-shadow(0 0 10px ${accent})` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-extrabold tabular-nums" dir="ltr">{mm}:{ss}</div>
        {label && <div className="mt-2 text-white/60">{label}</div>}
      </div>
    </div>
  )
}

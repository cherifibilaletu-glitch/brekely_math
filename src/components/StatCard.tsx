export default function StatCard({ label, value, sub, accent = "#818cf8" }: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  const glow = { background: accent, opacity: 0.25 }
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -top-8 -end-8 w-24 h-24 rounded-full blur-2xl" style={glow} />
      <div className="text-white/55 text-sm">{label}</div>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
      {sub && <div className="text-white/40 text-xs mt-1">{sub}</div>}
    </div>
  )
}

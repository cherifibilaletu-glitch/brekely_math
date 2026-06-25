import { Attempt } from "../types"
import { computeStats, byDay, byDifficulty } from "../lib/stats"
import StatCard from "../components/StatCard"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const box1 = { width: "100%", height: 260 }
const box2 = { width: "100%", height: 280 }
const tooltipStyle = { background: "#0b0d17", border: "1px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#fff" }
const diffColors: Record<string, string> = { "سهل": "#34d399", "متوسط": "#fbbf24", "صعب": "#f87171", "غير محدد": "#818cf8" }

export default function StatsView({ attempts }: { attempts: Attempt[] }) {
  const s = computeStats(attempts)
  const days = byDay(attempts)
  const diffs = byDifficulty(attempts)

  if (!attempts.length) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <div className="text-5xl mb-3">📊</div>
        <h2 className="text-2xl font-extrabold">لا توجد بيانات بعد</h2>
        <p className="text-white/60 mt-2">أكمل جلسة حل واحدة على الأقل لتظهر إحصائياتك هنا.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold">إحصائياتي 📈</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي المحاولات" value={String(s.total)} />
        <StatCard label="محلولة" value={String(s.solved)} accent="#34d399" />
        <StatCard label="نسبة النجاح" value={`${s.successRate.toFixed(0)}%`} accent="#22d3ee" />
        <StatCard label="حُلّت ضمن 30د" value={`${s.inTimeRate.toFixed(0)}%`} accent="#a78bfa" />
        <StatCard label="سلسلة الأيام" value={`${s.streak} 🔥`} accent="#f472b6" />
        <StatCard label="متوسط الوقت" value={`${s.avgMinutes.toFixed(0)} د`} accent="#fbbf24" />
        <StatCard label="جزئية" value={String(s.partial)} accent="#fb923c" />
        <StatCard label="لم تُحل" value={String(s.unsolved)} accent="#f87171" />
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold mb-4">النشاط اليومي</h3>
        <div style={box1}>
          <ResponsiveContainer>
            <AreaChart data={days}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,.4)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" stroke="#818cf8" strokeWidth={2} fill="url(#g1)" name="محاولات" />
              <Area type="monotone" dataKey="solved" stroke="#34d399" strokeWidth={2} fillOpacity={0} name="محلولة" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold mb-4">الأداء حسب الصعوبة</h3>
        <div style={box2}>
          <ResponsiveContainer>
            <BarChart data={diffs}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="label" stroke="rgba(255,255,255,.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,.4)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={false} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} name="عدد">
                {diffs.map((d) => (
                  <Cell key={d.label} fill={diffColors[d.label] || "#818cf8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

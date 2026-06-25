import { motion } from "framer-motion"
import { Tab } from "../components/Nav"
import { Attempt } from "../types"
import { randomQuote } from "../lib/quotes"
import { computeStats } from "../lib/stats"
import StatCard from "../components/StatCard"
import { Rocket, Sparkles } from "lucide-react"

const hideOnError = (e: any) => { e.currentTarget.style.display = "none" }
const fadeInit = { opacity: 0, y: 24 }
const fadeAnim = { opacity: 1, y: 0 }
const fadeTrans = { duration: 0.6 }

const steps = [
  { t: "1 · اختر مسألة", d: "اكتب رقم المسألة من كتاب بِركلي وابدأ المؤقّت فوراً.", e: "🎯" },
  { t: "2 · ركّز 30 دقيقة", d: "مؤقّت مع منبّه صوتي. لا ذكاء اصطناعي — أنت فقط وورقتك.", e: "⏱️" },
  { t: "3 · وثّق الفكرة", d: "بعد البحث، اكتب فكرة الحل بأسلوب StackExchange مع LaTeX.", e: "✍️" },
]

export default function Home({ setTab, attempts }: { setTab: (t: Tab) => void; attempts: Attempt[] }) {
  const s = computeStats(attempts)
  return (
    <div className="space-y-10">
      <section className="relative glass rounded-3xl overflow-hidden p-8 sm:p-14">
        <img src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1600&q=80" alt="" onError={hideOnError} className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#06070d] via-[#06070d]/70 to-transparent" />
        <motion.div className="relative" initial={fadeInit} animate={fadeAnim} transition={fadeTrans}>
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-white/10 mb-4"><Sparkles size={14} /> رحلة 20 يوماً لإتقان كتاب بِركلي</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">حُلّ. افهم. <span className="text-gradient">تذكّر.</span></h1>
          <p className="mt-4 text-white/75 max-w-xl text-lg leading-8">نظام تركيز قائم على جلسات 30 دقيقة مع منبّه، استراحة 10 دقائق، وتوثيق فكرة الحل بأسلوب StackExchange مع دعم LaTeX — كي لا تنسى أبداً كيف حللت مسألة.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => setTab("session")} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-bold transition shadow-lg shadow-indigo-500/30"><Rocket size={18} /> ابدأ جلسة حل</button>
            <button onClick={() => setTab("stats")} className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-bold transition">شاهد تقدّمك</button>
          </div>
        </motion.div>
      </section>

      <section className="glass rounded-2xl p-5 flex items-center gap-4">
        <span className="text-3xl">😄</span>
        <p className="text-white/80 italic leading-7">{randomQuote()}</p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="مسائل محلولة" value={String(s.solved)} sub={`من ${s.total} محاولة`} />
        <StatCard label="نسبة النجاح" value={`${s.successRate.toFixed(0)}%`} accent="#22d3ee" />
        <StatCard label="حُلّت ضمن الوقت" value={`${s.inTimeRate.toFixed(0)}%`} accent="#a78bfa" />
        <StatCard label="سلسلة الأيام" value={`${s.streak} 🔥`} accent="#f472b6" />
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {steps.map((c) => (
          <div key={c.t} className="glass rounded-2xl p-6">
            <div className="text-3xl">{c.e}</div>
            <h3 className="font-bold mt-3 text-lg">{c.t}</h3>
            <p className="text-white/60 mt-1 text-sm leading-7">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

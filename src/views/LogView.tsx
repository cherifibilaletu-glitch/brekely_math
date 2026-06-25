import { useMemo, useState } from "react"
import { Attempt } from "../types"
import Markdown from "../components/Markdown"
import { Download, Search, Trash2 } from "lucide-react"

const statusLabel: Record<string, string> = { solved: "محلولة", partial: "جزئية", unsolved: "لم تُحل" }
const statusColor: Record<string, string> = { solved: "bg-emerald-500/20 text-emerald-300", partial: "bg-amber-500/20 text-amber-300", unsolved: "bg-rose-500/20 text-rose-300" }

function fmtDate(ts: number) {
  try {
    return new Date(ts).toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" })
  } catch {
    return new Date(ts).toLocaleString()
  }
}

export default function LogView({ attempts, deleteAttempt }: { attempts: Attempt[]; deleteAttempt: (id: string) => void }) {
  const [q, setQ] = useState("")
  const [open, setOpen] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const sorted = [...attempts].sort((a, b) => b.createdAt - a.createdAt)
    if (!term) return sorted
    return sorted.filter((a) => [a.problem, a.chapter, a.ideaWriteup, a.reflection].join(" ").toLowerCase().includes(term))
  }, [attempts, q])

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(attempts, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "berkeley-attempts.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!attempts.length) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <div className="text-5xl mb-3">📓</div>
        <h2 className="text-2xl font-extrabold">سجلّك فارغ</h2>
        <p className="text-white/60 mt-2">كل مسألة تحلّها ستظهر هنا مع فكرة الحل والملاحظات.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <h2 className="text-3xl font-extrabold">سجل المحاولات 📓</h2>
        <button onClick={exportJson} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"><Download size={16} /> تصدير JSON</button>
      </div>
      <div className="relative">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-white/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث في المسائل والأفكار…" className="w-full bg-white/5 rounded-xl ps-10 pe-4 py-3 outline-none focus:bg-white/10" />
      </div>
      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className="glass rounded-2xl overflow-hidden">
            <button onClick={() => setOpen(open === a.id ? null : a.id)} className="w-full flex items-center gap-3 p-4 text-start">
              <span className={`text-xs px-2 py-1 rounded-lg ${statusColor[a.status]}`}>{statusLabel[a.status]}</span>
              <span className="font-bold flex-1">{a.problem}</span>
              {a.solvedInTime && <span className="text-xs text-emerald-300">✅ ضمن الوقت</span>}
              <span className="text-xs text-white/40">{fmtDate(a.createdAt)}</span>
            </button>
            {open === a.id && (
              <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                <div className="flex flex-wrap gap-2 text-xs text-white/50">
                  {a.chapter && <span className="px-2 py-1 rounded-lg bg-white/5">{a.chapter}</span>}
                  {a.difficulty && <span className="px-2 py-1 rounded-lg bg-white/5">{a.difficulty}</span>}
                  <span className="px-2 py-1 rounded-lg bg-white/5">{Math.round(a.durationSec / 60)} دقيقة</span>
                </div>
                {a.ideaWriteup && (
                  <div>
                    <div className="text-sm text-white/50 mb-1">فكرة الحل</div>
                    <div className="glass rounded-xl p-4" dir="auto"><Markdown source={a.ideaWriteup} /></div>
                  </div>
                )}
                {a.reflection && (
                  <div>
                    <div className="text-sm text-white/50 mb-1">ملاحظات</div>
                    <div className="glass rounded-xl p-4" dir="auto"><Markdown source={a.reflection} /></div>
                  </div>
                )}
                <button onClick={() => { if (confirm("حذف هذه المحاولة؟")) deleteAttempt(a.id) }} className="flex items-center gap-2 text-sm text-rose-300 hover:text-rose-200"><Trash2 size={15} /> حذف</button>
              </div>
            )}
          </div>
        ))}
        {!filtered.length && <p className="text-white/40 text-center py-8">لا نتائج لبحثك.</p>}
      </div>
    </div>
  )
}

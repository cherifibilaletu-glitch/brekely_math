import { BarChart3, BookOpen, Home as HomeIcon, Timer } from "lucide-react"

export type Tab = "home" | "session" | "stats" | "log"

const items: { id: Tab; label: string; Icon: typeof Timer }[] = [
  { id: "home", label: "الرئيسية", Icon: HomeIcon },
  { id: "session", label: "جلسة حل", Icon: Timer },
  { id: "stats", label: "الإحصائيات", Icon: BarChart3 },
  { id: "log", label: "السجل", Icon: BookOpen },
]

export default function Nav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav className="glass sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center gap-3 rounded-b-2xl">
      <div className="flex items-center gap-2 font-extrabold">
        <span className="text-2xl">∑</span>
        <span className="text-gradient text-lg">منصة بِركلي</span>
      </div>
      <div className="ms-auto flex items-center gap-1 bg-white/5 rounded-2xl p-1">
        {items.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm transition ${active ? "bg-indigo-500/40 text-white" : "text-white/60 hover:text-white"}`}>
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

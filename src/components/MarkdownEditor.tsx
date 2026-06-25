import { useState } from "react"
import Markdown from "./Markdown"
import { Columns, Eye, Pencil } from "lucide-react"

const snippets: { label: string; insert: string }[] = [
  { label: "x²", insert: "$x^2$" },
  { label: "∫", insert: String.raw`$\int_a^b f(x)\,dx$` },
  { label: "∑", insert: String.raw`$\sum_{n=1}^{\infty} a_n$` },
  { label: "كسر", insert: String.raw`$\frac{a}{b}$` },
  { label: "نهاية", insert: String.raw`$\lim_{x \to 0} f(x)$` },
  { label: "مصفوفة", insert: String.raw`$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$` },
  { label: "كود", insert: "\n```\ncode\n```\n" },
]

type Mode = "split" | "write" | "preview"

export default function MarkdownEditor({ value, onChange, placeholder, minHeight = 220 }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minHeight?: number
}) {
  const [mode, setMode] = useState<Mode>("split")
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 flex-wrap">
        {snippets.map((sn) => (
          <button key={sn.label} type="button" onClick={() => onChange(value + sn.insert)} className="text-xs px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 transition">{sn.label}</button>
        ))}
        <div className="ms-auto flex gap-1">
          <button type="button" title="كتابة" onClick={() => setMode("write")} className={`p-1.5 rounded-lg ${mode === "write" ? "bg-indigo-500/40" : "bg-white/5"}`}><Pencil size={15} /></button>
          <button type="button" title="مقسّم" onClick={() => setMode("split")} className={`p-1.5 rounded-lg ${mode === "split" ? "bg-indigo-500/40" : "bg-white/5"}`}><Columns size={15} /></button>
          <button type="button" title="معاينة" onClick={() => setMode("preview")} className={`p-1.5 rounded-lg ${mode === "preview" ? "bg-indigo-500/40" : "bg-white/5"}`}><Eye size={15} /></button>
        </div>
      </div>
      <div className={`grid ${mode === "split" ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {mode !== "preview" && (
          <textarea dir="auto" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style= minHeight  className="w-full bg-transparent p-4 outline-none resize-y font-mono text-sm leading-7 border-b border-white/10 md:border-b-0 md:border-e" />
        )}
        {mode !== "write" && (
          <div className="p-4 overflow-auto" style= minHeight  dir="auto"><Markdown source={value} /></div>
        )}
      </div>
    </div>
  )
}

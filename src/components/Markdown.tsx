import { useMemo } from "react"
import { marked } from "marked"
import katex from "katex"

function renderMath(src: string): string {
  const codeBlocks: string[] = []
  let s = src.replace(/```[\s\S]*?```/g, (m) => {
    codeBlocks.push(m)
    return `@@CODE${codeBlocks.length - 1}@@`
  })
  const render = (tex: string, display: boolean) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: display, throwOnError: false })
    } catch {
      return tex
    }
  }
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_m, t) => render(t, true))
  s = s.replace(/\$([^\$\n]+?)\$/g, (_m, t) => render(t, false))
  s = s.replace(/@@CODE(\d+)@@/g, (_m, i) => codeBlocks[Number(i)])
  return s
}

export default function Markdown({ source }: { source: string }) {
  const html = useMemo(() => {
    if (!source || !source.trim()) return ""
    return marked.parse(renderMath(source), { breaks: true, gfm: true }) as string
  }, [source])
  if (!html) return <p className="text-white/40">لا يوجد محتوى بعد…</p>
  const inner = { __html: html }
  return <div className="prose-math max-w-none" dangerouslySetInnerHTML={inner} />
}

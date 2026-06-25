import type { Attempt } from "../types"

export function computeStats(attempts: Attempt[]) {
  const total = attempts.length
  const solved = attempts.filter((a) => a.status === "solved").length
  const solvedInTime = attempts.filter((a) => a.solvedInTime).length
  const totalSeconds = attempts.reduce((s, a) => s + a.durationSec, 0)
  const avgMinutes = total ? totalSeconds / total / 60 : 0
  const successRate = total ? (solved / total) * 100 : 0
  const inTimeRate = total ? (solvedInTime / total) * 100 : 0

  const days = new Set(attempts.map((a) => new Date(a.createdAt).toDateString()))
  let streak = 0
  const d = new Date()
  while (days.has(d.toDateString())) {
    streak++
    d.setDate(d.getDate() - 1)
  }

  const byChapter: Record<string, { total: number; solved: number }> = {}
  for (const a of attempts) {
    const k = a.chapter || "غير مصنّف"
    byChapter[k] = byChapter[k] || { total: 0, solved: 0 }
    byChapter[k].total++
    if (a.status === "solved") byChapter[k].solved++
  }

  const series: { day: string; count: number; solved: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const dd = new Date()
    dd.setHours(0, 0, 0, 0)
    dd.setDate(dd.getDate() - i)
    const next = new Date(dd)
    next.setDate(next.getDate() + 1)
    const dayAttempts = attempts.filter(
      (a) => a.createdAt >= dd.getTime() && a.createdAt < next.getTime(),
    )
    series.push({
      day: dd.toLocaleDateString("ar", { day: "numeric", month: "numeric" }),
      count: dayAttempts.length,
      solved: dayAttempts.filter((a) => a.status === "solved").length,
    })
  }

  return { total, solved, solvedInTime, successRate, inTimeRate, avgMinutes, streak, byChapter, series }
}

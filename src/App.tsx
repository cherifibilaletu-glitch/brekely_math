import { useEffect, useState } from "react"
import Background from "./components/Background"
import Nav, { Tab } from "./components/Nav"
import Home from "./views/Home"
import SessionView from "./views/SessionView"
import StatsView from "./views/StatsView"
import LogView from "./views/LogView"
import { Attempt, Settings } from "./types"
import { loadAttempts, loadSettings, saveAttempts, saveSettings } from "./lib/storage"

export default function App() {
  const [tab, setTab] = useState<Tab>("home")
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [settings, setSettings] = useState<Settings>(loadSettings())

  useEffect(() => { setAttempts(loadAttempts()) }, [])
  useEffect(() => { saveSettings(settings) }, [settings])

  const addAttempt = (a: Attempt) =>
    setAttempts((prev) => { const next = [a, ...prev]; saveAttempts(next); return next })
  const deleteAttempt = (id: string) =>
    setAttempts((prev) => { const next = prev.filter((x) => x.id !== id); saveAttempts(next); return next })

  return (
    <div className="min-h-full">
      <Background />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <Nav tab={tab} setTab={setTab} />
        <main className="mt-8">
          {tab === "home" && <Home setTab={setTab} attempts={attempts} />}
          {tab === "session" && (
            <SessionView settings={settings} setSettings={setSettings} addAttempt={addAttempt} goStats={() => setTab("stats")} />
          )}
          {tab === "stats" && <StatsView attempts={attempts} />}
          {tab === "log" && <LogView attempts={attempts} deleteAttempt={deleteAttempt} />}
        </main>
        <footer className="mt-16 text-center text-white/30 text-xs">منصة بِركلي · صُنعت لرحلتك نحو إتقان الرياضيات</footer>
      </div>
    </div>
  )
}

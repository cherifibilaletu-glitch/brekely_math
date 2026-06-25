import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import TimerRing from "../components/TimerRing"
import MarkdownEditor from "../components/MarkdownEditor"
import { useTimer } from "../hooks/useTimer"
import { Attempt, Difficulty, Settings, Status } from "../types"
import { uid } from "../lib/storage"
import { beep, playAlarm } from "../lib/sound"
import { randomQuote } from "../lib/quotes"
import { ArrowLeft, Check, Coffee, Pause, Play, RotateCcw } from "lucide-react"

type Phase = "setup" | "focus" | "result" | "writeup" | "break" | "done"

export default function SessionView({ settings, setSettings, addAttempt, goStats }: {
  settings: Settings
  setSettings: (s: Settings) => void
  addAttempt: (a: Attempt) => void
  goStats: () => void
}) {
  const [phase, setPhase] = useState<Phase>("setup")
  const [problem, setProblem] = useState("")
  const [chapter, setChapter] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("")
  const [startedAt, setStartedAt] = useState(0)
  const [solvedInTime, setSolvedInTime] = useState(false)
  const [status, setStatus] = useState<Status>("solved")
  const [idea, setIdea] = useState("")
  const [reflection, setReflection] = useState("")

  const focus = useTimer(settings.focusMinutes * 60)
  const brk = useTimer(settings.breakMinutes * 60)

  useEffect(() => { focus.onFinish(() => { if (settings.soundOn) playAlarm(settings.volume) }) }, [settings.soundOn, settings.volume])
  useEffect(() => { brk.onFinish(() => { if (settings.soundOn) playAlarm(settings.volume) }) }, [settings.soundOn, settings.volume])
  useEffect(() => { if (phase === "focus" && focus.state === "finished") setPhase("result") }, [focus.state, phase])
  useEffect(() => { if (phase === "break" && brk.state === "finished") setPhase("done") }, [brk.state, phase])

  const startFocus = () => {
    if (!problem.trim()) return
    setStartedAt(Date.now())
    focus.reset()
    setPhase("focus")
    if (settings.soundOn) beep(settings.volume * 0.4)
    setTimeout(() => focus.start(), 60)
  }

  const goResult = (inTime: boolean) => {
    focus.pause()
    setSolvedInTime(inTime)
    setStatus(inTime ? "solved" : "unsolved")
    setPhase("result")
  }

  const save = (startBreak: boolean) => {
    const attempt: Attempt = {
      id: uid(),
      createdAt: startedAt || Date.now(),
      problem: problem.trim() || "مسألة بدون عنوان",
      chapter: chapter.trim(),
      difficulty,
      durationSec: focus.elapsed || settings.focusMinutes * 60,
      solvedInTime,
      status,
      ideaWriteup: idea,
      reflection,
      tags: [],
    }
    addAttempt(attempt)
    if (startBreak) { brk.reset(); setPhase("break"); setTimeout(() => brk.start(), 60) }
    else setPhase("done")
  }

  const resetAll = () => {
    setProblem(""); setChapter(""); setDifficulty(""); setIdea(""); setReflection("")
    setSolvedInTime(false); setStatus("solved"); focus.reset(); brk.reset(); setPhase("setup")
  }

  if (phase === "setup") {
    return (
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-5">
          <h2 className="text-3xl font-extrabold">جلسة حل جديدة</h2>
          <p className="text-white/60">اختر مسألة من كتاب بِركلي، اضبط المؤقّت، وابدأ التركيز.</p>
          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-sm text-white/60">المسألة (رقمها أو عنوانها)</label>
              <input value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="مثال: Berkeley 2.1.4 — تكامل" className="mt-1 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/60">الفصل / الموضوع</label>
                <input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="تحليل، جبر…" className="mt-1 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:bg-white/10" />
              </div>
              <div>
                <label className="text-sm text-white/60">الصعوبة</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="mt-1 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:bg-white/10">
                  <option value="">—</option>
                  <option value="سهل">سهل</option>
                  <option value="متوسط">متوسط</option>
                  <option value="صعب">صعب</option>
                </select>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/60">مدة التركيز (دقيقة)</label>
                <input type="number" min={1} value={settings.focusMinutes} onChange={(e) => setSettings({ ...settings, focusMinutes: Math.max(1, Number(e.target.value) || 1) })} className="mt-1 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:bg-white/10" />
              </div>
              <div>
                <label className="text-sm text-white/60">مدة الاستراحة (دقيقة)</label>
                <input type="number" min={1} value={settings.breakMinutes} onChange={(e) => setSettings({ ...settings, breakMinutes: Math.max(1, Number(e.target.value) || 1) })} className="mt-1 w-full bg-white/5 rounded-xl px-4 py-3 outline-none focus:bg-white/10" />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={settings.soundOn} onChange={(e) => setSettings({ ...settings, soundOn: e.target.checked })} />
              <span>المنبّه الصوتي مفعّل 🔔</span>
            </label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={1} step={0.05} value={settings.volume} onChange={(e) => setSettings({ ...settings, volume: Number(e.target.value) })} className="flex-1" />
              <button onClick={() => playAlarm(settings.volume, 2)} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 whitespace-nowrap">جرّب الصوت</button>
            </div>
          </div>
          <button onClick={startFocus} disabled={!problem.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 font-bold text-lg transition shadow-lg shadow-indigo-500/30"><Play size={20} /> ابدأ التركيز ({settings.focusMinutes} دقيقة)</button>
        </div>
        <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center min-h-[420px]">
          <TimerRing remaining={settings.focusMinutes * 60} total={settings.focusMinutes * 60} label="جاهز للانطلاق" />
          <p className="mt-6 text-center text-white/60 italic">{randomQuote()}</p>
        </div>
      </div>
    )
  }

  if (phase === "focus") {
    return (
      <div className="flex flex-col items-center gap-8 py-6">
        <div className="text-center">
          <div className="text-sm text-white/50">تحلّ الآن</div>
          <h2 className="text-2xl font-bold mt-1">{problem}</h2>
          {chapter && <span className="text-white/50 text-sm">{chapter}</span>}
        </div>
        <TimerRing remaining={focus.remaining} total={settings.focusMinutes * 60} label={focus.state === "paused" ? "متوقّف مؤقتاً" : "ركّز…"} />
        <div className="flex flex-wrap gap-3 justify-center">
          {focus.state === "running" ? (
            <button onClick={focus.pause} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20"><Pause size={18} /> إيقاف مؤقت</button>
          ) : (
            <button onClick={focus.start} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20"><Play size={18} /> استئناف</button>
          )}
          <button onClick={() => { focus.reset(); setTimeout(() => focus.start(), 60) }} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20"><RotateCcw size={18} /> إعادة</button>
          <button onClick={() => goResult(true)} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/80 hover:bg-emerald-500 font-bold"><Check size={18} /> حللتها!</button>
          <button onClick={() => goResult(false)} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20">إنهاء</button>
        </div>
        <p className="text-white/40 text-sm text-center max-w-md">لا ذكاء اصطناعي هنا — فقط أنت وورقتك. بعد انتهاء الوقت ابحث عن الحل بنفسك ثم افهمه ووثّقه.</p>
      </div>
    )
  }

  if (phase === "result") {
    const mins = Math.round((focus.elapsed || settings.focusMinutes * 60) / 60)
    return (
      <div className="max-w-xl mx-auto glass rounded-3xl p-8 space-y-6 text-center">
        <div className="text-5xl">⏰</div>
        <h2 className="text-2xl font-extrabold">انتهى وقت التركيز</h2>
        <p className="text-white/60">قضيت حوالي {mins} دقيقة. سجّل النتيجة بصدق — هذا ما سيكشف نقاط ضعفك لاحقاً.</p>
        <div className="text-start space-y-2">
          <div className="text-sm text-white/60">هل حللت المسألة خلال {settings.focusMinutes} دقيقة؟</div>
          <div className="flex gap-3">
            <button onClick={() => setSolvedInTime(true)} className={`flex-1 py-3 rounded-xl font-bold ${solvedInTime ? "bg-emerald-500/80" : "bg-white/10"}`}>نعم ✅</button>
            <button onClick={() => setSolvedInTime(false)} className={`flex-1 py-3 rounded-xl font-bold ${!solvedInTime ? "bg-rose-500/80" : "bg-white/10"}`}>لا ❌</button>
          </div>
        </div>
        <div className="text-start space-y-2">
          <div className="text-sm text-white/60">الحالة النهائية</div>
          <div className="flex gap-2">
            {([["solved", "محلولة"], ["partial", "جزئية"], ["unsolved", "لم تُحل"]] as [Status, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setStatus(v)} className={`flex-1 py-2 rounded-xl text-sm ${status === v ? "bg-indigo-500/60" : "bg-white/10"}`}>{l}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setPhase("writeup")} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-bold">التالي: وثّق فكرة الحل <ArrowLeft size={18} /></button>
      </div>
    )
  }

  if (phase === "writeup") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold">وثّق فكرة الحل ✍️</h2>
          <p className="text-white/60">اكتب الفكرة خطوة بخطوة كما على StackExchange. استخدم <code className="bg-white/10 px-1 rounded">$...$</code> للرياضيات داخل السطر و <code className="bg-white/10 px-1 rounded">$$...$$</code> للمعادلات المستقلة.</p>
        </div>
        <div>
          <div className="text-sm text-white/60 mb-2">فكرة الحل / الخطوات</div>
          <MarkdownEditor value={idea} onChange={setIdea} placeholder="## الفكرة الرئيسية&#10;نستخدم مبرهنة القيمة المتوسطة…&#10;&#10;$$ a^2 + b^2 = c^2 $$" minHeight={260} />
        </div>
        <div>
          <div className="text-sm text-white/60 mb-2">أين أخطأت / ملاحظات (اختياري)</div>
          <MarkdownEditor value={reflection} onChange={setReflection} placeholder="نسيت شرط الاتصال… سأراجع الفصل 3." minHeight={130} />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => save(true)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-bold"><Coffee size={18} /> حفظ وبدء الاستراحة</button>
          <button onClick={() => save(false)} className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20">حفظ فقط</button>
        </div>
      </div>
    )
  }

  if (phase === "break") {
    return (
      <div className="flex flex-col items-center gap-8 py-6">
        <div className="text-center">
          <div className="text-5xl mb-2">☕😌</div>
          <h2 className="text-2xl font-bold">وقت استراحة — استمتع!</h2>
          <p className="text-white/60 mt-1">افتح فيسبوك، تمشّ، اشرب ماءً. سننبّهك عند انتهاء الوقت.</p>
        </div>
        <TimerRing remaining={brk.remaining} total={settings.breakMinutes * 60} label="استراحة" accent="#34d399" />
        <div className="flex gap-3">
          {brk.state === "running" ? (
            <button onClick={brk.pause} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20"><Pause size={18} /> إيقاف</button>
          ) : (
            <button onClick={brk.start} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20"><Play size={18} /> استئناف</button>
          )}
          <button onClick={() => setPhase("done")} className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20">تخطّي</button>
        </div>
        <p className="text-white/50 italic text-center">{randomQuote()}</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto glass rounded-3xl p-10 text-center space-y-6">
      <motion.div initial= scale: 0  animate= scale: 1  className="text-6xl">🎉</motion.div>
      <h2 className="text-2xl font-extrabold">أحسنت! تم حفظ المحاولة.</h2>
      <p className="text-white/60
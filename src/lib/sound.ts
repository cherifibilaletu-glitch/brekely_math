// Loud alarm + soft beep using the Web Audio API (no audio files needed).
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext
    ctx = new AC()
  }
  return ctx
}

export function playAlarm(volume = 0.7, repeats = 6) {
  const audio = getCtx()
  if (audio.state === "suspended") audio.resume()
  const now = audio.currentTime
  for (let i = 0; i < repeats; i++) {
    const t = now + i * 0.45
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(i % 2 === 0 ? 880 : 1175, t)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(volume, t + 0.03)
    gain.gain.linearRampToValueAtTime(0, t + 0.38)
    osc.connect(gain).connect(audio.destination)
    osc.start(t)
    osc.stop(t + 0.4)
  }
}

export function beep(volume = 0.3) {
  const audio = getCtx()
  if (audio.state === "suspended") audio.resume()
  const t = audio.currentTime
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = "sine"
  osc.frequency.setValueAtTime(660, t)
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.02)
  gain.gain.linearRampToValueAtTime(0, t + 0.2)
  osc.connect(gain).connect(audio.destination)
  osc.start(t)
  osc.stop(t + 0.22)
}

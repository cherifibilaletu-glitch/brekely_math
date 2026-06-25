import type { Attempt, Settings } from "../types"

const ATTEMPTS_KEY = "bm.attempts.v1"
const SETTINGS_KEY = "bm.settings.v1"

export const defaultSettings: Settings = {
  focusMinutes: 30,
  breakMinutes: 10,
  soundOn: true,
  volume: 0.7,
}

export function loadAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY)
    return raw ? (JSON.parse(raw) as Attempt[]) : []
  } catch {
    return []
  }
}

export function saveAttempts(a: Attempt[]) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(a))
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

export function exportData(): string {
  return JSON.stringify(
    { attempts: loadAttempts(), settings: loadSettings() },
    null,
    2,
  )
}

export function importData(json: string) {
  const parsed = JSON.parse(json)
  if (parsed.attempts) saveAttempts(parsed.attempts)
  if (parsed.settings) saveSettings(parsed.settings)
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

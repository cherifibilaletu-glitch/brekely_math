export type Difficulty = "سهل" | "متوسط" | "صعب" | ""
export type Status = "solved" | "partial" | "unsolved"

export type Attempt = {
  id: string
  createdAt: number
  problem: string
  chapter: string
  difficulty: Difficulty
  durationSec: number
  solvedInTime: boolean
  status: Status
  ideaWriteup: string
  reflection: string
  tags: string[]
}

export type Settings = {
  focusMinutes: number
  breakMinutes: number
  soundOn: boolean
  volume: number
}

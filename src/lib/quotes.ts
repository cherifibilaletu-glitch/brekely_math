export const funnyQuotes: string[] = [
  "ركّز يا بطل، المسألة لن تحل نفسها… جرّبتُ سؤالها بلطف ورفضت 😅",
  "Berkeley problems: because easy problems are for people who sleep.",
  "إذا لم تحلها في 30 دقيقة، تذكّر أن أويلر أيضاً كان يخطئ… أحياناً.",
  "كل مسألة تحلها = نيورون سعيد يرقص في دماغك 🧠💃",
  "Plot twist: the integral was easy, you just panicked.",
  "خذ نفساً عميقاً، اشرب ماء، ثم اهزم هذه المسألة 💪",
  "Math is the only place where buying 60 watermelons makes sense.",
  "فشلت؟ ممتاز، الآن تعرف طريقاً واحداً لا يعمل. إديسون يحييك.",
  "الكسل عدوّك، والقهوة حليفك ☕",
  "You vs the problem. May the better mathematician win.",
]

export function randomQuote(): string {
  return funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)]
}

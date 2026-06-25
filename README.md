# منصة بِركلي · Berkeley Math Focus

> نظام تركيز شخصي لإتقان حل مسائل كتاب **Berkeley Problems in Mathematics** — جلسات 30 دقيقة، منبّه، استراحة 10 دقائق، توثيق فكرة الحل بأسلوب StackExchange مع دعم LaTeX، وإحصائيات تكشف نقاط ضعفك.

A personal focus system to master the famous *Berkeley Problems in Mathematics*: 30‑minute focus sprints with an alarm, 10‑minute breaks, StackExchange‑style write‑ups with LaTeX, and analytics that reveal your weak spots.

---

## ✨ المزايا · Features
- ⏱️ **مؤقّت تركيز 30 دقيقة** مع منبّه صوتي عالٍ (Web Audio، بدون ملفات صوت).
- ☕ **مؤقّت استراحة 10 دقائق** بعد كل مسألة.
- ✅ **تسجيل النتيجة**: هل حللتها ضمن الوقت؟ محلولة / جزئية / لم تُحل.
- ✍️ **محرّر بأسلوب StackExchange** (Markdown + LaTeX حيّ عبر KaTeX) لتوثيق فكرة الحل خطوة بخطوة.
- 📊 **لوحة إحصائيات**: نسبة النجاح، الحل ضمن الوقت، النشاط اليومي، والأداء حسب الموضوع.
- 📒 **سجل قابل للبحث** لكل المسائل مع تصدير/استيراد JSON.
- 😄 عبارات تحفيزية طريفة لإبقاء روحك مرتفعة.

## 🧱 البنية التقنية · Tech Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Animation:** Framer Motion
- **Math/Markdown:** KaTeX + marked
- **Charts:** Recharts
- **Persistence:** `localStorage` (يعمل فوراً بدون خادم)
- **Optional sync:** Node + Express + MongoDB (مجلد `server/`)

## 🚀 التشغيل محلياً · Run locally
```bash
npm install
npm run dev
```
ثم افتح الرابط الذي يظهر (عادة http://localhost:5173).

## 🌐 النشر على GitHub Pages
1. ادفع المشروع إلى الفرع `main` (تم ✅).
2. في GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. سيبني الـ Workflow الموجود في `.github/workflows/deploy.yml` الموقع تلقائياً.
4. الرابط: `https://cherifibilaletu-glitch.github.io/brekely_math/`

> ملاحظة: مسار `base` في `vite.config.ts` مضبوط على `/brekely_math/` ليتطابق مع اسم المستودع.

## 🗄️ قاعدة البيانات (اختياري) · MongoDB sync
الواجهة تحفظ كل شيء محلياً في متصفحك. إذا أردت مزامنة سحابية عبر MongoDB:
```bash
cd server
cp .env.example .env   # ثم ضع رابط الاتصال الخاص بك
npm install
npm start
```
ثم انشر هذا الخادم على Render / Railway / Fly، وضع رابطه في `VITE_API_BASE`.

> ⚠️ **أمان:** لا تضع كلمة مرور قاعدة البيانات داخل الكود أبداً. استخدم ملف `.env` فقط (وهو مُستثنى في `.gitignore`). إذا سبق ونشرت كلمة المرور في أي مكان، غيّرها فوراً من MongoDB Atlas.

## 🗂️ هيكل الملفات · Project structure
```
brekely_math/
├─ index.html
├─ vite.config.ts · tailwind.config.js · tsconfig*.json
├─ src/
│  ├─ main.tsx · App.tsx · index.css · types.ts
│  ├─ lib/        storage, stats, sound, quotes
│  ├─ hooks/      useTimer
│  ├─ components/ Nav, Background, TimerRing, MarkdownEditor, Markdown, StatCard
│  └─ views/      Home, SessionView, StatsView, LogView
├─ server/        (اختياري) Express + MongoDB API
└─ .github/workflows/deploy.yml
```

## 📅 طريقة الـ20 يوماً
اختر مسألة → 30 دقيقة تركيز → سجّل النجاح/الفشل → ابحث وافهم → وثّق الفكرة → 10 دقائق استراحة → كرّر.

---
صُنع بحبّ للرياضيات. حظاً موفقاً في رحلتك نحو الدكتوراه! 🎓

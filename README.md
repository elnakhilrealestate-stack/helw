# حلو | Helw — Real Estate Platform

منصة عقارية متكاملة تجمع موقع تسويقي عربي + نظام CRM لإدارة المشاريع والمبيعات.

- **`/`** — الموقع التعريفي (عربي RTL): هيرو + بحث، وحدات معروضة بفلترة، خدمات، آراء عملاء، تواصل عبر واتساب.
- **`/crm`** — ValueY CRM (English): لوحة تحكم للمشاريع والمخزون والعملاء المحتملين والحجوزات والمبيعات.

## التقنيات

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com) + CSS مخصص للموقع التعريفي
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL
- خط Tajawal مستضاف محلياً (`@fontsource/tajawal`) — لا يعتمد على Google Fonts
- Recharts + lucide-react للـ CRM

## التشغيل محلياً

```bash
npm install
cp .env.example .env   # ثم ضع رابط قاعدة البيانات في DATABASE_URL (اختياري للموقع التعريفي)
npm run dev            # http://localhost:3000
```

> الصفحة الرئيسية تعمل بدون قاعدة بيانات. الـ CRM (`/crm`) يحتاج `DATABASE_URL`، وبعد ضبطه نفّذ `POST /api/bootstrap` لتحميل بيانات تجريبية.

## السكربتات

| الأمر | الوصف |
| --- | --- |
| `npm run dev` | خادم التطوير |
| `npm run build` | بناء الإنتاج |
| `npm start` | تشغيل نسخة الإنتاج |
| `npm run lint` | فحص ESLint |
| `npm run typecheck` | فحص TypeScript |

## أماكن مهمة لتعديلها

| ماذا تريد أن تغيّر | الملف |
| --- | --- |
| رقم الواتساب والتليفون | `src/components/marketing/SearchHome.tsx` و `ContactForm.tsx` و `src/app/page.tsx` |
| الوحدات العقارية المعروضة | مصفوفة `PROPERTIES` في `src/components/marketing/SearchHome.tsx` |
| نصوص وخدمات الموقع التعريفي | `src/app/page.tsx` |
| الألوان والهوية | `src/app/globals.css` (قسم حلو في آخر الملف) |
| صور الوحدات | `public/props/` و `public/hero.jpg` |
| قاعدة البيانات | `src/db/schema.ts` و `drizzle.config.json` |

> رقم `+20 100 123 4567` رقم مؤقت للتوضيح — استبدله برقمك الفعلي قبل الإطلاق.

## النشر على Vercel

الريبو مربوط بمشروع Vercel على <https://helw.vercel.app> — أي دمج في `main` يرفع النسخة تلقائياً.

لتشغيل الـ CRM على Vercel: أضف `DATABASE_URL` في **Settings → Environment Variables** (Neon أو Supabase مثلاً).

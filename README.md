# FUTURE FOUNDATION — KEMICS ACADEMY
## Registration, Automatic Acceptance & Applicant Management Platform

منصة متكاملة لإدارة تسجيل المتقدمين والقبول الآلي وجدولة البريد الإلكتروني وإدارة المتقدمين لمبادرة **Future Foundation** التابعة لـ **KEMICS ACADEMY**.

---

## 🌟 المعمارية والمكونات (Architecture & Modules)

```text
[Public Registration Page (/future-foundation)]
                     │
                     ▼ (Server-side validation & Rate Limiting)
[Persistent PostgreSQL (Prisma ORM)] ◄── Unique Application ID (FF-2026-XXXXXX)
                     │
                     ▼ (Status: PENDING)
[Configurable Delay Queue (Default: 24h)]
                     │
                     ▼ (Idempotent Scheduled Cron: /api/cron/process-applications)
[Status: ACCEPTED] ──► [Transactional Email Service (Resend / SMTP)]
                     │
                     ▼
[Dynamic Branded Acceptance Email + LinkedIn Share CTA]
                     │
                     ▼
[Admin Dashboard (/admin)] ──► Real-time Stats, Filters, Search, XLSX/CSV Export
```

---

## 🚀 التشغيل المحلي السريع (Local Development Setup)

### 1. تثبيت الحزم:
```bash
npm install
```

### 2. تجهيز قاعدة البيانات الدائمة:
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

استخدم PostgreSQL مستضافًا دائمًا في `DATABASE_URL`؛ لا تستخدم SQLite أو قاعدة داخل مجلد التطبيق في الإنتاج. لا تُعد تهيئة قاعدة الإنتاج أو تشغيل `db push` عليها إلا بعد مراجعة التغييرات وأخذ نسخة احتياطية.

### 3. إعداد تخزين شعارات الشركاء:
1. أنشئ حاوية **Public bucket** باسم `partner-logos` في Supabase Storage.
2. أضف `SUPABASE_URL` و`SUPABASE_SERVICE_ROLE_KEY` إلى `.env.local` محليًا وإلى أسرار بيئة الاستضافة. يمكن تغيير الاسم عبر `SUPABASE_STORAGE_BUCKET`.
3. لا تضع مفتاح `service_role` في كود الواجهة أو Git؛ يستخدمه الخادم فقط لرفع الصور.
4. تُرفع الصور الجديدة إلى التخزين الدائم مباشرةً وتُحفظ روابطها في PostgreSQL. الحد الأقصى 4 ميجابايت، والصيغ المدعومة PNG وJPG وWebP.

لا تحفظ الملفات المرفوعة في `public` أو على القرص المحلي للخادم؛ هذه الملفات قد تختفي عند إعادة النشر أو إعادة تشغيل الاستضافة.

### 4. تشغيل الخادم في وضع التطوير:
```bash
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

---

## 🔐 بوابات المنصة وروابط الوصول

* **صفحة التسجيل العامة:** `http://localhost:3000/future-foundation`
* **تسجيل دخول المشرفين:** `http://localhost:3000/admin/login`
* **لوحة التحكم المركزية:** `http://localhost:3000/admin`
* **معاينة بريد القبول الحي:** `http://localhost:3000/admin/email-preview`
* **إعدادات النظام والأتمتة:** `http://localhost:3000/admin/settings`

### بيانات الدخول الافتراضية للتطوير:
* **البريد الإلكتروني:** `kemixacademy1@gmail.com`
* **كلمة المرور:** `admin123456`

---

## ⚙️ دليل متغيرات البيئة (.env)

| المتغير | الوصف | مثال في الإنتاج |
| :--- | :--- | :--- |
| `SUPABASE_URL` | عنوان مشروع Supabase لتخزين الشعارات الدائم | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح الخادم لرفع الملفات إلى Supabase Storage؛ سري ولا يُشارك | يُضبط في أسرار الاستضافة فقط |
| `SUPABASE_STORAGE_BUCKET` | اسم حاوية الشعارات العامة | `partner-logos` |
| `DATABASE_URL` | رابط الاتصال بقاعدة بيانات PostgreSQL | `postgresql://user:pass@host:5432/dbname?schema=public&sslmode=require` |
| `JWT_SECRET` | مفتاح سري عالي القوة لتوقيع جلسات المشرفين (32+ حرف) | `f8a9e2d3...` |
| `CRON_SECRET` | رمز سري لحماية نقطة نهاية الأتمتة المجدولة | `sec_cron_kemics_2026_x9z` |
| `ADMIN_EMAIL` | بريد المشرف الرئيسي المعتمد | `kemixacademy1@gmail.com` |
| `ADMIN_INITIAL_PASSWORD` | كلمة المرور الأولية لإنشاء حساب المشرف | `ComplexPass#2026!` |
| `EMAIL_FROM` | بريد المرسل الرسمي لرسائل القبول | `kemixacademy1@gmail.com` |
| `EMAIL_SENDER_NAME` | اسم المرسل الظاهر في البريد | `KEMICS Academy` |
| `RESEND_API_KEY` | مفتاح مزود البريد Resend | `re_123456789abcdef` |
| `SMTP_HOST` | خادم SMTP (في حال عدم استخدام Resend) | `smtp.gmail.com` |
| `SMTP_PORT` | منفذ SMTP | `587` |
| `SMTP_USER` | اسم مستخدم SMTP | `kemixacademy1@gmail.com` |
| `SMTP_PASS` | كلمة مرور التطبيق (App Password) | `xxxx xxxx xxxx xxxx` |
| `APP_URL` | الرابط الأساسي للمنصة المنشورة | `https://future-foundation.kemics.academy` |

---

## 📧 إعدادات تسليم البريد وسجلات الـ DNS (SPF / DKIM / DMARC)

لضمان وصول رسائل القبول مباشرة إلى صندوق الوارد (Inbox) وتجنب الـ Spam، يجب على مسؤول النطاق (Domain Admin) إضافة سجلات الـ DNS التالية لدى مزود النطاق:

### 1. في حال استخدام Resend (موصى به للإنتاج):
* **DKIM (CNAME):** يوفره لوحة تحكم Resend لنطاقك (مثال: `resend._domainkey.kemics.academy`).
* **SPF (TXT):**
  * **Host:** `@`
  * **Value:** `v=spf1 include:resend.com ~all`
* **DMARC (TXT):**
  * **Host:** `_dmarc.kemics.academy`
  * **Value:** `v=DMARC1; p=none; rua=mailto:kemixacademy1@gmail.com;`

### 2. في حال استخدام Google Workspace / Gmail SMTP:
* **SPF (TXT):**
  * **Value:** `v=spf1 include:_spf.google.com ~all`

---

## ⏱️ إعداد الـ Cron Job للأتمتة في الإنتاج

قم بجدولة استدعاء الرابط التالي كل ساعة أو كل 10 دقائق (عبر Vercel Cron أو cron-job.org أو Render Cron):

```bash
curl -X POST "https://your-domain.com/api/cron/process-applications?token=YOUR_CRON_SECRET"
```

أو عبر Header التخويل:
```bash
curl -X POST "https://your-domain.com/api/cron/process-applications" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

النظام مصمم ليكون **Idempotent** تماماً؛ أي أن تكرار تشغيل الجدولة لن يرسل إيميلات مكررة للمقبولين.

---

## 🚢 خطوات النشر على بيئات الإنتاج (Production Deployment)

### نشر على Vercel / Railway / AWS / Render:
1. قم بإنشاء قاعدة بيانات PostgreSQL (عبر Supabase أو Neon أو AWS RDS).
2. اضبط متغيرات البيئة في لوحة تحكم الاستضافة بناءً على `.env.example`.
3. أمر البناء (Build Command):
   ```bash
   npm run build
   ```
4. أمر التشغيل (Start Command):
   ```bash
   npm start
   ```

---

## 🛡️ ميزات الأمان المدمجة (Security Measures)
* حماية جلسات المشرف بـ HttpOnly و SameSite=Lax وملفات تعريف ارتباط مشفرة.
* تحديد معدل الطلبات (Rate Limiting) على التسجيل والدخول وإرسال الإيميلات لمنع هجمات Spam و Brute Force.
* حماية ملفات التصدير Excel & CSV من هجمات Formula Injection.
* تنقية المدخلات (Input Sanitization) ومنع حقن كود خبيث على مستوى الخادم.
* حماية نقطة نهاية الـ Cron Job برمز سري مشفر.

---
© 2026 **KEMICS ACADEMY** — *بناء مهاراتك اليوم.. لمستقبل الغد*

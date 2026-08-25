# ELKAHMED BUSINESS — PRODUCTION READINESS REPORT

> تاريخ: 2026-08-25 · التدقيق مبني على الكود الفعلي + **فحص حي لمشروع Supabase** عبر REST API.
> كل تغيير نُفّذ في المستودع تم بناؤه والتحقق منه (`pnpm build` لكلا التطبيقين ✓).

---

## 1. ما تم فحصه

- **المستودع كاملاً:** apps/customer (كل الصفحات + lib) · apps/dashboard (middleware، layouts، callback، كل صفحات (protected)، كل المكوّنات، storage، validation، أنواع DB) · packages/supabase.
- **المصادقة:** middleware.ts · login/page.tsx (يدوي + Google) · auth/callback/route.ts · server.ts (requireAdmin) · client.ts · AccessDenied.
- **قاعدة البيانات:** الهجرة 0001 كاملة (جداول، سياسات RLS، triggers، realtime، buckets) — قراءة سطراً سطراً.
- **Supabase الحي:** فحص REST مباشر على جداول settings/profiles/requests + auth/v1/health + auth/v1/settings.
- **البنية:** pnpm-workspace.yaml · lockfile · .env.example (المتتبع في git) · vercel.json · remotes.
- **الأمان:** grep شامل لـ service_role (لا شيء ✓) · كل مسارات API (واحد فقط: auth/callback ✓) · أنماط التفويض في كل عملية أدمن.

## 2. المشاكل المكتشفة

| # | الخطورة | المشكلة | الأثر |
|---|---|---|---|
| 1 | 🔴 **CRITICAL** | **صلاحيات GRANT القياسية مفقودة على جداول public** — فحص حي أرجع `42501 permission denied for table` على settings وprofiles وrequests (والجداول موجودة، ليس 404) | **هذا هو السبب الجذري لمشكلة الأدمن**: استعلام `profiles` في requireAdmin() يفشل بصمت → isAdmin=false → **AccessDenied لكل مستخدم بمن فيهم المالك**، مهما كانت قيمة role في القاعدة |
| 2 | 🟠 HIGH | حساب المالك غير مُرقّى: trigger الإنشاء التلقائي يعيّن `role='client'` (بشكل صحيح ومقصود)، ولا توجد أي آلية نفّذت الترقية | حتى بعد إصلاح GRANT يبقى المالك client |
| 3 | 🟠 HIGH | AccessDenied بلا زر خروج → **حلقة علق**: middleware يعيد المسجّل من /login إلى / التي تعرض AccessDenied | مستخدم غير أدمن لا يستطيع الخروج إلا بحذف الكوكيز |
| 4 | 🟠 HIGH | `apps/dashboard/.env.example` متتبَّع في Git **ويحتوي عنوان المشروع ومفتاحاً حقيقياً** | المفتاح publishable (عام بطبيعته + محمي بـRLS) فليس تسريباً خطيراً، لكنه سوء ممارسة يجب تنظيفه |
| 5 | 🟡 MEDIUM | `pnpm-workspace.yaml` فيه كتلة `allowBuilds` placeholder حرفية (`set this to true or false`) | ملف تهيئة غير نظيف؛ أُزيلت مع بقاء onlyBuiltDependencies الصحيحة |
| 6 | 🟡 MEDIUM | نموذج طلب المشروع غير موصول (console.log فقط) — **تم التحقق: لا يزال صحيحاً قبل إصلاحي** | قناة الاستقطاب الأساسية معطلة |
| 7 | 🟡 MEDIUM | أنواع Database في الحزمة المشتركة تُعرّف `settings` فقط | أدى لخطأ build عند توصيل النموذج — عولج |
| 8 | 🟡 MEDIUM | requireAdmin() يبتلع خطأ الاستعلام بصمت | فجّر مشكلة #1 دون أثر في السجلات — عولج بتسجيل الخطأ |
| 9 | 🟢 LOW | site_url / redirect_urls غير قابلة للقراءة عبر API — تحتاج تحققاً يدوياً من لوحة Supabase | قد يمنع عودة OAuth في الإنتاج |
| 10 | 🟢 LOW | بوابة العملاء ما زالت mock (تتطلب هجرة مخطط — موثقة في Master Plan §8، خارج نطاق هذا التشغيل) | معروف ومخطط |

## 3. المشاكل المُصلَحة (في المستودع — مبنية ومُتحقق منها ✓)

1. **زر Sign Out في AccessDenied** — مكوّن جديد `apps/dashboard/components/SignOutButton.tsx` يكسر حلقة العلق.
2. **تسجيل خطأ requireAdmin** — `server.ts` يطبع رسالة الخطأ (مثل 42501) بدل ابتلاعه؛ يفشل بأمان (fail-closed) كما قبل.
3. **تنظيف `.env.example`** — قيم فارغة فقط + تعليق تحذيري؛ القيم الحقيقية تبقى في `.env.local` (غير متتبع).
4. **إصلاح `pnpm-workspace.yaml`** — إزالة كتلة allowBuilds الوهمية؛ `pnpm install --frozen-lockfile` نجح (Lockfile is up to date ✓).
5. **توصيل نموذج طلب المشروع** — `RequestForm.tsx` يدرج الآن في جدول `requests` عبر عميل anon (RLS تسمح بالإدراج بشرط status='new' — القيمة الافتراضية): تحقق كامل (بريد، حد أدنى للوصف، حدود طول) + منع إرسال مزدوج (تعطيل الزر) + معالجة أخطاء inline مع رسالة خاصة لخطأ الصلاحيات + شاشة نجاح صادقة.
6. **إضافة نوع `requests` للحزمة المشتركة** — `packages/supabase/src/types.ts` (Row/Insert/Update مطابقة للهجرة).

**لم أغيّر:** المخطط، أي سياسة RLS، أي مسار، التصميم، أو أي وظيفة عاملة. (ملاحظة توثيقية: بوابة العملاء تحتاج هجرة مخطط — معروضة للموافقة في Master Product Plan §8، لم تُنفذ.)

## 4. تغييرات Supabase المطلوبة منك (لا أستطيع تنفيذها — لا أملك وصول SQL)

> شغّل هذا في **Supabase Dashboard → SQL Editor**. هذا **إصلاح صلاحيات وبيانات، ليس تغيير مخطط** — يعيد الوضع القياسي الذي تفترضه هجرة 0001. RLS تبقى الحارس الفعلي (الصلاحيات الواسعة مع RLS هي الوضع الافتراضي في Supabase).

**الخطوة 1 — إعادة صلاحيات anon/authenticated (إصلاح 42501):**
```sql
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;

-- حتى تنطبق الصلاحيات على جداول مستقبلية أيضاً:
alter default privileges for role postgres in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  grant all on functions to anon, authenticated, service_role;
```
إن فشل GRANT برسالة "must be owner" فالجداول مملوكة لدور آخر — تحقق ثم انقل الملكية:
```sql
select tablename, tableowner from pg_tables where schemaname = 'public';
-- ثم لكل جدول: alter table public.<table> owner to postgres;
```

**الخطوة 2 — ترقية حسابك أنت إلى admin (ضع بريد جوجل مكان OWNER_EMAIL):**
```sql
-- يضمن وجود صف profile (يغطي حسابات أُنشئت قبل تفعيل الـtrigger)
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, u.raw_user_meta_data ->> 'full_name', 'client'
from auth.users u
where u.email = 'OWNER_EMAIL'
on conflict (id) do nothing;

-- الترقية (الآلية المعمارية القائمة — بلا backdoor وبلا بريد مكتوب في الكود)
update public.profiles set role = 'admin' where email = 'OWNER_EMAIL';

-- تحقق: يجب أن ترى role = admin
select id, email, role from public.profiles where email = 'OWNER_EMAIL';
```

**الخطوة 3 — تحقق سريع بعد التنفيذ:** من المتصفح (بدون جلسة) افتح:
`https://liqhzoevpmpfkbjdvvgx.supabase.co/rest/v1/settings?select=company_name` مع أي طلب عادي سيصبح 200 (بدل 401) — أو ببساطة أعد الدخول بجوجل للوحة.

**الأمان مضمون بقاءه:** الجرانت لا يفتح شيئاً — كل الجداول عليها RLS كما في الهجرة 0001 (تحقق §9 أدناه). عميل لا يرى إلا notifications خاصته، أدمن وحده يكتب، إلخ.

## 5. تغييرات المصادقة (في المستودع)

- بلا تغيير على منطق المصادقة (كان سليماً): OAuth بـ PKCE عبر `/auth/callback` → exchange code → كوكيز جلسة، وmiddleware يجدّد الجلسة ويصدّ غير المسجل.
- إصلاح العلق (SignOutButton) + إظهار أخطاء البنية في requireAdmin (فشل آمن).

## 6. Google OAuth — الوضع وما يجب التحقق منه

- **المزود مُفعّل في Supabase** (تحقق حي: `google: true` ✓) — يتطابق مع أن دخولك بجوجل ينجح.
- تسلسل الإنتاج: Browser → Google → Supabase → `/auth/callback` (redirectTo ديناميكي بـ window.location.origin ✓) → جلسة → requireAdmin → لوحة أو AccessDenied.
- **مطلوب منك (لوحة Supabase → Authentication → URL Configuration):**
  - Site URL = نطاق الإنتاج (أو رابط Vercel الحالي).
  - Redirect URLs يجب أن يشمل: `https://<نطاق-الإنتاج>/auth/callback` و`http://localhost:3000/auth/callback`.
- **Google Cloud Console (إذا توقف الدخول من الإنتاج):** Authorized Redirect URI = `https://liqhzoevpmpfkbjdvvgx.supabase.co/auth/v1/callback` (هذا ثابت من جهة Supabase ولا يتغير مع نطاقك).

## 7. تغييرات تفويض الأدمن

- البنية **صحيحة أصلاً ولا تحتاج إعادة تصميم**: authentication (من أنت؟) عبر Supabase Auth، authorization (ماذا يُسمح لك؟) عبر profiles.role + requireAdmin على السيرفر + RLS على القاعدة.
- النقطة الوحيدة الناقصة كانت بيانات/صلاحيات (القسم 4)، لا كود.
- **لا يوجد ولا سيصبح أي مسار "كل من سجّل أصبح أدمن"** — trigger الإنشاء يفرض 'client'، وسياسة التحديث الذاتي تشترط بقاء client، والترقية يدوية بـSQL فقط.

## 8. تغييرات RLS

**لا شيء.** كل سياسات الهجرة 0001 سليمة ومدققة: profiles (قراءة ذاتية/أدمن، إدراج ذاتي بشرط client، تحديث ذاتي لا يغيّر الدور) · settings/services/projects/portfolio (قراءة عامة، كتابة أدمن) · requests (إدراج عام بشرط status='new' فقط، إدارة أدمن) · messages/files (أدمن) · notifications (قراءة/تحديث ذاتي، إدخال أدمن). عزل العملاء (A لا يرى B) مكفول حالياً بالحجب الكامل عن العملاء في messages/files — وتوسيعه لبوابة العملاء موثق كـ"هجرة مقترحة" في Master Plan بانتظار موافقتك.

## 9. تغييرات Storage

**لا شيء مطلوب.** Buckets موجودة بسياسات صحيحة (عام للقراءة/خاص تماماً + روابط موقّعة 300 ثانية). فحص عمليات الرفع/الحذف/التنزيل في storage.ts سليم (يشمل تحصين أسماء الملفات ضد path traversal).

## 10. تغييرات Vercel المطلوبة منك

1. في مشروع Vercel (dashboard): تأكد من وجود المتغيرين (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://liqhzoevpmpfkbjdvvgx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = قيمة publishable من `.env.local`
2. أضف نطاق الإنتاج ثم حدّث Site URL في Supabase (القسم 6).
3. لا توجد أسرار server-only في المشروع إطلاقاً (البنية anon+JWT+RLS فقط) — لا شيء يخشى تعريضه للمتصفح.
4. vercel.json سليم (framework: nextjs) — لا تغيير.

## 11. تغييرات موقع العملاء

- توصيل نموذج طلب المشروع (التفاصيل في §3.5). **تنبيه مهم:** الإدراج سيستمر بالفشل برسالة إعداد خادم حتى تنفّذ الخطوة 1 من القسم 4 (نفس سبب مشكلة الأدمن — الصلاحيات). الكود صحيح وسيعمل فور تنفيذها.
- ContactForm ما زال غير موصول — **عمداً**: لا يوجد جدول له، وإنشاؤه تغيير مخطط يتطلب موافقتك (مقترح بسيط: جدول contact_messages أو إعادة استخدام requests بـneed='Contact'). بوابة العملاء: mock كما هي (تتطلب الهجرة المقترحة).

## 12. تغييرات لوحة التحكم

SignOutButton + تسجيل أخطاء requireAdmin + تنظيف env. كل الوظائف القائمة (طلبات/مشاريع/خدمات/إعدادات/إشعارات/رفع) لم تُمس — والبناء نجح.

## 13. المشاكل المتبقية

| الخطورة | المشكلة | الحالة |
|---|---|---|
| 🔴 | تنفيذ SQL القسم 4 (صلاحيات + ترقية أدمن) | **بانتظارك — لا يمكن تنفيذها من المستودع** |
| 🟠 | توصيل بوابة العملاء (هجرة client_id/visibility) | معروضة في Master Plan §8 — بانتظار موافقة |
| 🟡 | ContactForm بلا جدول | يحتاج قرارك (جدول جديد / إعادة استخدام) |
| 🟡 | تحقق redirect URLs في Supabase + نطاق الإنتاج | يدوي (§6/§10) |
| 🟡 | لا اختبارات آلية، لا README | مخططة في خارطة الطريق |
| 🟢 | فحص pnpm-lock.yaml المتغير | تم التحقق — متسق مع frozen install ✓ (جاهز للـcommit) |

## 14. الاختبارات المُنفّذة

| الاختبار | النتيجة |
|---|---|
| Supabase auth/v1/health | ✓ 200 (GoTrue v2.195.0) |
| مزود Google مُفعّل | ✓ (تحقق حي) |
| جداول settings/profiles/requests موجودة | ✓ (الرد 42501 وليس 404) |
| صلاحيات anon على الجداول | ✗ **42501 — السبب الجذري، الإصلاح بالقسم 4** |
| `pnpm install --frozen-lockfile` | ✓ (بعد إصلاح workspace) |
| `pnpm build:dashboard` | ✓ (بعد كل التغييرات) |
| `pnpm build:customer` | ✓ (بعد توصيل النموذج + الأنواع) |
| لا service_role في الكود | ✓ grep شامل |
| مسارات API | واحد فقط (auth/callback) — لا مسارات غير محمية |

**اختبارات مطلوبة منك بعد تنفيذ SQL القسم 4 (راجع مصفوفة الاختبار العشرية في طلبك):**
TEST 1: غير مسجل → `/` في اللوحة ⇒ تحويل لـ/login. · TEST 2: دخولك بجوجل ⇒ دخول اللوحة كاملة. · TEST 3: دخول بحساب جوجل آخر (client) ⇒ AccessDenied + زر Sign Out يعمل. · TEST 9: أرسل طلباً من الموقع ⇒ يظهر في اللوحة لحظياً (Realtime) + جرس إشعار. · TEST 4/5/6/7/8/10: تتطلب بيانات مشاريع/عملاء حقيقية (بعضها يتعلق بالبوابة غير الموصولة بعد).

## 15. نتيجة الجاهزية للإنتاج

**62 / 100** — الرقم محجوز بخطوة واحدة خارج المستودع.

ما يرفعها فور تنفيذ SQL (القسم 4) + إعداد redirect URLs (القسم 6/10): **~80/100** (نظام مصادقة/تفويض إنتاجي مكتمل + قناة طلبات تعمل لحظياً). الفارق المتبقي حتى 95+: بوابة العملاء (هجرة مقترحة)، اختبارات آلية، SEO، README — كلها مصنفة في خارطة الطريق.

**لماذا ليس أقل من 62:** البنية الأمنية (RLS + دفاع طبقي + صفر أسرار خادم) سليمة ومُدقّقة، والبناء أخضر، والخلل الحرج ليس في الكود بل في تهيئة قاعدة بيانات قابلة للإصلاح بأمان عبر GRANT + سطر UPDATE واحد.
**لماذا ليس أعلى:** الأدمن عملياً مقفول خارج القاعدة حتى تُنفّذ الخطوة 4، ونموذج الطلب سيصدّ أخطاء صلاحيات حتى نفاذها.

## 16. الإجراءات المتبقية مرتبة

| الأولوية | الإجراء | أين |
|---|---|---|
| **P0** | تنفيذ SQL القسم 4 (GRANT + ترقية أدمن + تحقق) | Supabase SQL Editor |
| **P0** | التحقق من دخولك بجوجل → لوحة كاملة → حساب آخر → AccessDenied + خروج | متصفح |
| **P1** | ضبط Site URL + Redirect URLs (إنتاج + localhost) في Supabase Auth | لوحة Supabase |
| **P1** | التأكد من متغيرات البيئة في Vercel (Production + Preview) | Vercel |
| **P1** | اختبار نموذج الطلب من الموقع → وصوله للوحة لحظياً | متصفح |
| **P2** | الموافقة على هجرة بوابة العملاء (Master Plan §8) ثم تنفيذها وتوصيل البوابة | قرارك ثم المستودع |
| **P2** | README مختصر + commit للتغييرات الحالية | المستودع |
| **P3** | جدول ContactForm · اختبارات آلية · SEO | لاحقاً |

---

**الخلاصة التنفيذية:** كود المصادقة والتخويل في هذا المستودع كان سليماً؛ المشكلة في قاعدة البيانات: جداول بلا GRANT لل أدوار القياسية (يفشل كل استعلام دور بصمت) وحساب المالك بدرجة client. أصلحتُ في المستودع كل ما يمكن إصلاحه بأمان (بما فيها علق غير الأدمن في حلقة بلا خروج، وتوصيل قناة الطلبات)، وبنيت وتحققت من كل شيء. **نفّذ SQL القسم 4 وستدخل لوحتك بجوجل كأدمن خلال دقيقتين.**

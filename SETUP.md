# S.P. Sports Foundation — Phase 1 Setup (Database + Student Registration + Login)

This is Phase 1 of the full system. It adds a real, free database with student
registration and student login. The Owner Admin Dashboard, attendance, fees,
leave approval and payments are Phase 2 and Phase 3 (not built yet).

## What Phase 1 includes
- Student registration form saves to a real database (Supabase, free tier).
- Every student gets a unique Student ID (e.g. SPS-0001).
- Students can log in with their Student ID and a password they set at registration.
- Student Dashboard: profile, status, submit a leave request, see own leave history.
- Public "Latest Updates" page reads announcements from the database.

## What Phase 1 does NOT include yet (coming in later phases)
- Owner Admin Dashboard (view/approve students, Boys/Girls lists, reports)
- Attendance marking
- Fee management
- Leave approval by the owner
- Study materials upload
- Razorpay / UPI payments

---

## Step 1: Create a free Supabase project
1. Go to https://supabase.com and sign up (free).
2. Click **New project**. Choose any name, set a database password (save it somewhere safe), pick a region close to India.
3. Wait ~2 minutes for the project to finish setting up.

## Step 2: Run the database schema
1. In your Supabase project, open **SQL Editor > New query**.
2. Open `supabase-schema.sql` from this project folder, copy all of it, paste it in, and click **Run**.
3. Check **Table Editor** — you should now see `students`, `leave_requests`, and `updates` tables.

## Step 3: Turn off email confirmation (so students can log in immediately)
Students don't have real email addresses on file, so we use a generated one internally.
1. In Supabase: **Authentication > Providers > Email**.
2. Turn **OFF** "Confirm email".
3. Save.

## Step 4: Get your API keys
1. In Supabase: **Project Settings > API**.
2. Copy the **Project URL** and the **anon public** key.

## Step 5: Add the keys to your project
1. In this project folder, copy `.env.example` to a new file named `.env.local`.
2. Paste in your values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Save. Never commit `.env.local` to GitHub (it's already in `.gitignore`).

## Step 6: Run locally
```
npm install
npm run dev
```
Try registering a test student, note the Student ID and password shown on screen, then log in from the Student Login page.

## Step 7: Deploy on Vercel with the database connected
1. Push this project to GitHub (as before).
2. In Vercel, when importing the project, open **Environment Variables** and add the same two keys from Step 5.
3. Deploy.

## Publishing an announcement (until the Admin Dashboard is built)
1. In Supabase: **Table Editor > updates > Insert row**.
2. Fill in `title`, `description`, `published_at`, then Save.
It will appear on the public **Latest Updates** page right away.

## Approving a student (until the Admin Dashboard is built)
1. In Supabase: **Table Editor > students**.
2. Find the student, change `status` from `Pending` to `Approved`, save.

---

## Phase 2: Owner Admin Dashboard (now included)

Phase 2 adds a real, secure Admin Dashboard for the owner — separate from student
accounts — with an Overview, Students management (Boys/Girls tabs, search, filters,
Approve/Reject, Fee Paid/Pending), Leave Request approval, and Announcement management
(replacing the manual Table Editor step from Phase 1).

### Step 8: Run the Phase 2 SQL
1. In Supabase: **SQL Editor > New query**.
2. Open `supabase-schema-phase2.sql`, copy all of it, paste it in, and click **Run**.

### Step 9: Create the admin account (owner only)
There is no public admin sign-up — this is intentional, so students or the public
cannot get admin access.
1. In Supabase: **Authentication > Users > Add user**. Enter a real email and a
   strong password for the owner. Turn on "Auto Confirm User".
2. In Supabase: **Table Editor > admins > Insert row**.
   - `auth_user_id`: open the user you just created in Authentication > Users, copy their **User UID**, paste it here.
   - `name`: e.g. "Siddhant Pujari".
3. Save. Now that email + password can log in at the **Owner Admin Login** page (in the site header) and reach `/admin-dashboard`.

You can repeat Step 9 to add a second admin (e.g. for Sagar) if needed.

## Next phases
- **Phase 3:** Attendance management, and leave approvals reflected automatically in attendance; study materials upload for Online Study.
- **Phase 4:** Razorpay + UPI payments (requires your own Razorpay business account and KYC — this cannot be set up on your behalf; a small serverless function on Vercel will also be needed to verify payments securely).

Tell me when you're ready for Phase 3 and I'll build Attendance, Fees history and study materials on top of this same database.

## Update: Simple Registration (No Student Login)

Registration is now simple again — students fill the form and it opens WhatsApp with
their details, exactly like the very first version. There is no password, no Student
Login, and no Student Dashboard anymore.

Behind the scenes, if Supabase is connected, the same form also saves a plain record
(no login attached) so the admin can manage Attendance and Fees for that student. If
Supabase isn't connected, registration still works via WhatsApp — the admin just won't
have anything to manage yet.

### Run this extra SQL
If you already ran `supabase-schema.sql` and `supabase-schema-phase2.sql`, also run:
**`supabase-schema-simple-registration.sql`** (SQL Editor > New query > paste > Run).
This allows the public registration form to save a record, and makes Online Study
materials public again (since there's no student login to gate them behind).

## Admin Dashboard — quick guide
- **Overview:** total students, boys, girls, fee paid/pending counts, ₹ collected, ₹ pending.
- **Attendance:** pick a date (and optionally a course), mark each student Present or
  Absent (or Leave), click **Save Attendance**. Change the date to view/update another day.
- **Fee Management / Student List:** the same table — mark each student's fee **Paid**
  or **Pending** with one click. Filter by Boys/Girls, today's Present/Absent, or fee status.
- **Pending Fees:** shows only students with fee status Pending, with a running total and
  a one-click **Mark Paid** button — the student disappears from this list once paid.
- **Study Materials / Updates:** publish links and announcements (unchanged).
- **Leave Requests:** kept for completeness, but since there's no Student Login anymore,
  students have no way to submit one — this list will normally stay empty.

## Update: Apply Leave (no login) + Add New Student

### Run this extra SQL
If you've already run the earlier SQL files, also run **`supabase-schema-apply-leave.sql`**
(SQL Editor > New query > paste > Run). This adds a safe lookup function so the public
"Apply Leave" form can find a student by their registered mobile number — without any
login system — and lets that form submit a leave request.

### Apply Leave (public, on the Home page)
Any registered student can scroll to **Apply Leave** (or use the header link), enter the
mobile number they registered with, pick From/To dates and a reason, and submit. If the
mobile number isn't found, they're told to register first.

### Admin: Approve/Reject leave
Admin Dashboard > **Leave Requests** tab — Approve or Reject each request. Approving
automatically marks **Leave** in Attendance for every date in that range (it won't
overwrite a day you've already marked Present/Absent).

### Admin: Add New Student manually
Admin Dashboard > **Student List** or **Fee Management** tab > **+ Add New Student**
button. Fill in Name, Mobile, Age, Gender, Course and save — no student data needs to
exist beforehand; every student is added this way or through the public registration form.

### Student List now also shows
A **Leave** column — "No active leave", "Pending", or "Approved" for today's date —
alongside Attendance Today and Fee, matching the example format you asked for.

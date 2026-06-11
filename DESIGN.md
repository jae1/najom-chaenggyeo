# "나좀챙겨" (Take Care of Me) - Application Design Document

## 1. Overview
A full-stack Progressive Web App (PWA) health tracker focusing on daily health metrics and skin care routines. The app features a mobile-first UI with a clean, minimal, and soft aesthetic, using Korean localization. It incorporates Google OAuth, data synchronization via Supabase, and daily push notifications.

## 2. Tech Stack
*   **Frontend**: React + Vite, TypeScript.
*   **Styling**: Tailwind CSS.
*   **State / Data Fetching**: `@tanstack/react-query` & `@supabase/supabase-js`.
*   **PWA**: `vite-plugin-pwa`.
*   **Icons**: `lucide-react`.
*   **Backend / Database**: Supabase (PostgreSQL, Supabase Auth).
*   **Edge Functions**: Supabase Edge Functions (Deno) for push notifications.
*   **Deployment**: Cloudflare Pages (Frontend). Supabase CLI for Backend.

## 3. Database Schema & RLS
We will use Supabase CLI to generate the following migrations:

### Tables
*   `daily_health` (date, bowel_movement, weight, water_intake, sleep_hours, exercise_done, exercise_notes, period, condition)
*   `skin_care` (date, scalp, gua_sha, face_yoga, ems, skin_status, skin_care_notes)
*   `push_subscriptions` (subscription JSONB)

*All tables will have a `user_id` referencing `auth.users` and an `id` primary key.*

### Row-Level Security (RLS)
*   `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies on all tables ensuring `auth.uid() = user_id`.

## 4. Frontend Architecture
### Routes
*   `/login` - Google OAuth login page.
*   `/` (Today Tab) - Form for today's Daily Health and Skin Care. Auto-fetches today's data to act as an edit form if already filled.
*   `/history` (History Tab) - Reverse chronological list of past entries.

### Components
*   `BottomNav`: Sticky bottom navigation bar switching between `/` and `/history`.
*   `AuthGuard`: Higher-order component redirecting unauthenticated users to `/login`.
*   `PushNotificationPrompt`: Component to request push notification permissions and save subscription to Supabase.
*   `InstallPrompt`: Banner for iOS Safari users instructing them to "Add to Home Screen".

## 5. Push Notifications & Cron Job
*   **VAPID Keys**: We will generate VAPID keys to use for the Web Push API.
*   **Service Worker**: Custom service worker logic to intercept `push` events and show notifications using the `Notification` API.
*   **Supabase Edge Function (`daily-notification`)**:
    *   Triggered at 03:00 UTC (12:00 PM KST) using `pg_cron` or Supabase Cron configuration.
    *   Queries users who have a `push_subscriptions` entry but lack a `daily_health` entry for the current date (in KST).
    *   Dispatches web push requests using the VAPID keys to those users.

## 6. Implementation Phases
1.  **Phase 1: Project Initialization**: Create Vite app, setup Tailwind, initialize Supabase CLI.
2.  **Phase 2: Database Setup**: Write SQL migrations for tables, RLS, and the cron trigger.
3.  **Phase 3: Frontend Foundations**: Routing setup, Auth context, Base UI layout (Bottom Nav).
4.  **Phase 4: Core Features**: "Today" form implementation, "History" list view, React Query hooks for Supabase.
5.  **Phase 5: PWA & Notifications**: Configure `vite-plugin-pwa`, implement Service Worker, build the Edge Function for daily reminders.
6.  **Phase 6: Polish**: Styling refinement (soft tones), testing on mobile form factor.

## 7. Required User Actions (Outside CLI)
*   Create a Supabase Project.
*   Configure Google OAuth credentials in the Supabase Dashboard.
*   Retrieve Supabase Project URL and Anon Key.
*   Set VAPID keys securely in the Supabase Dashboard secrets.
# Expert Hospice CRM

Mobile-first CRM for hospice clinical marketers, admins, and owners to track referrals and leads.

## Stack

- React + Vite
- Tailwind CSS
- Supabase (database, auth)
- Vercel (hosting)

## Local setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Supabase project's URL and anon/public API key (Supabase dashboard → Settings → API). Never put the `service_role`/secret key here — this file ends up in the browser bundle.
3. `npm run dev`

## Roles

Accounts are created manually in Supabase (no self-registration). Each user's role (`marketer`, `admin`, or `owner`) lives in the `users_profiles` table and determines which dashboard they land on after login.

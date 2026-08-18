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

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login is easiest).
2. **Add New → Project**, then pick the `hospice-tracker` repo. Vercel auto-detects the Vite framework — the default build command (`npm run build`) and output directory (`dist`) are already correct.
3. Before clicking Deploy, open **Environment Variables** and add:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key (never the `service_role`/secret key — it would ship in the browser bundle)
4. Click **Deploy**.
5. Every future push to the connected branch redeploys automatically; other branches get their own preview URL.

`vercel.json` in this repo adds the rewrite rule the app needs so client-side routes (e.g. `/marketer/leads/123`) work on a hard refresh or direct link, not just in-app navigation.

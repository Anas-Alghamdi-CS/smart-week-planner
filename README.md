# Smart Week Planner — مخطط الأسابيع الذكي

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-blue)
![Supabase](https://img.shields.io/badge/Auth%20%26%20Sync-Supabase-3FCF8E)
![PWA](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-5A0FC8)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A bilingual (Arabic RTL / English LTR) weekly planner built around the **Saudi work week**: every week starts on **Saturday**. Plan by year → week → phase → day, with cloud sync and full offline support. Zero build steps; the whole app is a single static page.

## Live Demo

**[Open Smart Week Planner →](https://anas-alghamdi-cs.github.io/smart-week-planner/)**
· [Video walkthrough](https://youtu.be/byRg95wtG18)

| Field | Value |
|-------|-------|
| Email | `demo@planner.demo` |
| Password | `Planner@2025` |

You can also create your own account from the **Create Account** tab.

---

## Features

- 📅 **Saturday-based weeks** — every planner year has 52 or 53 whole weeks, with no gaps or overlaps between years.
- 🎨 **Phases** — Study / Work / Personal out of the box, plus unlimited custom phases with colors.
- ✅ **Daily tasks** — add, edit, delete, complete; priority and time per task.
- 🔍 **Search and filters** — by text, status, or high priority; live progress statistics.
- 🗄️ **Automatic archive view** — past weeks and years stay readable and are clearly marked.
- ☁️ **Cloud sync** — one state document per user in Supabase, with a visible sync indicator.
- 📴 **Offline-first** — keeps working without a connection and syncs when it returns.
- 📲 **Installable PWA** — manifest, icons, and a service worker.
- 🌙 **Dark / light mode** and **Arabic / English**, remembered across sessions and applied before first paint (no flash).

---

## Architecture

```
┌────────────────────────────── Browser ──────────────────────────────┐
│  index.html   UI + app logic (single file, no build step)           │
│  sw.js        service worker: app-shell cache, offline navigation   │
│  localStorage per-user state cache + "dirty" flag + theme/lang      │
└───────────────┬─────────────────────────────────────────────────────┘
                │ supabase-js (Auth + REST)
┌───────────────▼─────────────────────────────────────────────────────┐
│ Supabase:  Auth (email/password)   user_tasks (one jsonb row/user)   │
└──────────────────────────────────────────────────────────────────────┘
```

### Calendar model

- A planner year starts on the **Saturday on or before January 1**. The year ends the day before the next one starts, so late-December days can belong to week 1 of the following year.
- Years contain 52 or 53 weeks (for example 2026 has 52, 2027 has 53).
- Day counting uses calendar days, not milliseconds, so daylight-saving time cannot shift a week.
- Task keys have the form `YYYY-Www-<phaseId>-D<0..6>`, where `D0` is Saturday. Keys are unique per year, week, phase, and day.

### Data sync

```
edit ─► write localStorage immediately ─► mark dirty ─► debounce 1.5 s
     ─► one upsert in flight at a time (always sends the latest state)
        ├─ success ─► clear dirty flag ─► "Saved"
        ├─ edits arrived meanwhile ─► sync again
        └─ failure/offline ─► keep dirty flag ─► retry with back-off, and on the `online` event
load ─► local edits still marked dirty win; otherwise cloud state replaces the cache
```

- The dirty flag survives reloads, so offline edits are never overwritten by older cloud data.
- A status pill shows: **Saved**, **Syncing…**, **Changes waiting**, **Offline**, or **Sync failed — tap to retry**.
- If the app is launched offline, it reuses the last signed-in identity and its cached planner.

### Database

**Table `user_tasks`** (enable Row-Level Security so each user reads and writes only their own row)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | primary key |
| `user_id` | uuid | unique, references `auth.users` |
| `state_json` | jsonb | phases, tasks, preferences |
| `updated_at` | timestamptz | updated on write |

---

## Run Locally

```bash
git clone https://github.com/Anas-Alghamdi-CS/smart-week-planner.git
cd smart-week-planner
python -m http.server 8000   # open http://localhost:8000
```

Service workers need `http://localhost` or HTTPS, so open the page through a server rather than as a file.

To use your own backend, create a Supabase project, add the `user_tasks` table with a unique `user_id` and RLS policies, and replace `SUPABASE_URL` / `SUPABASE_ANON` in `index.html` (only the public anon key belongs in client code).

## Deploy to GitHub Pages

**Settings → Pages →** deploy from branch `main`, folder `/ (root)`. When you change cached files, bump `CACHE_VERSION` in `sw.js` so installed copies update.

---

## Project Structure

```
smart-week-planner/
├── index.html            ← App (markup, styles, logic)
├── sw.js                 ← Service worker
├── manifest.webmanifest  ← PWA manifest
├── icons/                ← 192, 512, and maskable PNG icons
├── .nojekyll             ← Disables Jekyll on GitHub Pages
├── README.md
└── PROMPTS.md            ← AI prompts and design decisions log
```

---

## Academic Context

Developed as a course project for **Principles of Artificial Intelligence (مبادئ الذكاء الاصطناعي)** at Umm Al-Qura University.

**Developer:** Anas Alghamdi

## License

MIT

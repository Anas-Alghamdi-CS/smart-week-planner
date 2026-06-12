# Smart Week Planner

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-blue)
![Supabase](https://img.shields.io/badge/Auth%20%26%20Sync-Supabase-3FCF8E)

## Live Demo

**[Open Smart Week Planner →](https://Anas-Alghamdi-CS.github.io/smart-week-planner/)**

---

## Demo Credentials

| Field | Value |
|-------|-------|
| **Email** | `demo@planner.demo` |
| **Password** | `Planner@2025` |

> You can also register a new account directly from the app — no email confirmation required.

---

## What It Does

A bilingual (Arabic / English) weekly task planner with:

- 📅 **Weekly navigation** — browse all 52 weeks of any year
- 🎨 **Phases** — color-coded categories (Study / Work / Personal / custom)
- ✅ **Daily tasks** — Add, edit, delete, and mark tasks complete per day
- 🔍 **Search & filter** — search by keyword or filter by status/priority
- 📊 **Progress stats** — live total, done, remaining, and progress bar
- 🌙 **Dark / Light mode** — persistent across sessions
- 🌐 **Bilingual** — full Arabic (RTL) and English (LTR) support
- ☁️ **Cloud sync** — tasks saved to Supabase and synced across devices

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Single-file HTML + Vanilla CSS + Vanilla JavaScript |
| Authentication | Supabase Auth (email/password) |
| Data Storage | Supabase (PostgreSQL via REST) + localStorage cache |
| Hosting | GitHub Pages |
| PWA | Web App Manifest (installable on mobile) |

---

## Assignment Context

This project is Assignment 1 (A1) for **AI4101 — Generative AI & Vibe Coding** at Umm Al-Qura University.

| Layer | Requirement | Status |
|-------|-------------|--------|
| A1 | Working SPA deployed on GitHub Pages | ✅ |
| A2 | Real data persistence (Supabase cloud DB) | ✅ |
| A3 | Supabase Authentication + GitHub Pages hosting | ✅ |

---

## Project Structure

```
smart-week-planner/
├── index.html            ← Complete single-file app (HTML + CSS + JS)
├── manifest.webmanifest  ← PWA manifest (mobile install support)
├── .gitignore            ← Ignores node_modules and OS files
├── .nojekyll             ← Disables Jekyll on GitHub Pages
├── README.md             ← This file
└── PROMPTS.md            ← AI prompts and design decision log
```

---

## Supabase Schema

**Table: `user_tasks`**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, auto-generated |
| user_id | uuid | FK → auth.users (unique per user) |
| state_json | jsonb | Full app state: phases, tasks, preferences |
| updated_at | timestamptz | Auto-updated on every write |

One row per user — the entire planner state is serialized as a single JSON blob for simplicity.

---

## How Data Sync Works

```
Login → Load from Supabase → fall back to localStorage cache if offline
Add/edit/delete task → Write to localStorage immediately
                     → Debounce 1.5s → Upsert to Supabase
Sign out → Session cleared, auth screen shown
```

---

## Developer

**Student:** Anas Alghamdi  
**Course:** AI4101 — Generative AI & Vibe Coding  
**University:** Umm Al-Qura University

---

## License

MIT — Academic use

# PROMPTS.md — Smart Week Planner
## AI Prompts & Design Decision Log
**Course:** AI4101 — Generative AI & Vibe Coding  
**Assignment:** A1 → A3 Evolution  
**Student:** Anas Alghamdi

---

## Overview

This document logs the AI prompts used to design, build, and evolve the Smart Week Planner, along with the reasoning behind key technical and design decisions.

---

## Phase 1 — Initial App Design (A1)

### Prompt 1 — App Concept
```
Build a bilingual (Arabic/English) weekly task planner as a single HTML file.
The app should:
- Show all 52 weeks of any year in a horizontal scrollable strip
- Let users organize tasks into color-coded phases (Study / Work / Personal)
- Show tasks per day within the active phase
- Auto-archive past weeks visually using a status pill (Current / Ended / Upcoming)
- Support dark and light mode with a toggle button
- Use a blue color palette: #0A1931, #1A3D63, #4A7FA7, #B3CFE5, #F6FAFD
- Be deployable to GitHub Pages with no build step
```

**Why a single HTML file?**  
GitHub Pages serves static files directly. A single file requires zero configuration, no build tools, and no npm dependencies — making deployment instant.

---

### Prompt 2 — RTL/LTR Bilingual Support
```
Make the app switch seamlessly between Arabic (RTL) and English (LTR) at runtime.
The language toggle should update all UI labels, date formats, day names,
and the document direction without a page reload.
Store the language preference in the app state and persist it.
```

**Decision:** All UI strings stored in a `labels` object with `ar` and `en` keys. `Intl.DateTimeFormat` used with locale-aware formatting (`ar-SA-u-ca-gregory` for Arabic).

---

### Prompt 3 — Week & Phase System
```
Implement a planner year that starts on the nearest Saturday before January 1st
(to match Saudi calendar week starts). Each week shows 7 days (Sat–Fri).
Tasks are keyed as: YYYY-WWW-phaseId-DayIndex
so that each phase has independent tasks per day, per week, per year.
```

**Why this key structure?**  
Allows one user to have Study tasks for Monday of Week 23 completely independent from their Work tasks for the same day. The key encodes all context needed to locate any task.

---

## Phase 2 — Supabase Integration (A2/A3)

### Prompt 4 — Auth System Replacement
```
Replace the existing localStorage-based account system (which used SHA-256
passcode hashing) with Supabase email/password authentication.
Add a splash screen that shows while the auth session is being checked,
then transition to either the auth screen (sign in / sign up) or the main app.
Style the splash and auth screens using the existing app color palette.
Keep all existing planner functionality (phases, tasks, week navigation) unchanged.
```

**Why replace instead of extend?**  
The old system stored credentials in localStorage with SHA-256 hashing. This is not suitable for production — it's client-side only, not cross-device, and not industry-standard. Supabase provides a battle-tested JWT-based auth system with zero server management.

---

### Prompt 5 — Cloud Data Sync Architecture
```
Store each user's entire planner state as a single JSON blob in a Supabase
table called user_tasks (one row per user, identified by user_id).
On login: fetch the cloud state, fall back to localStorage cache if offline.
On any state change: write to localStorage immediately for instant UI response,
then debounce 1.5 seconds before upserting to Supabase to avoid excessive API calls.
```

**Why a single JSON blob instead of normalized tables?**  
The planner state (phases, tasks, preferences) is deeply nested and user-specific. A single jsonb column avoids complex JOIN queries, schema migrations for every new feature, and row-level security complexity. The app already serializes state to JSON for localStorage — the Supabase write is simply the same JSON sent to a different destination.

**Debounce strategy:**  
A 1.5-second debounce on cloud writes means that rapid consecutive actions (checking off 5 tasks quickly) result in only one API call instead of five, reducing Supabase free-tier usage.

---

### Prompt 6 — Splash + Auth Screen Design
```
Design a splash screen with:
- A floating calendar emoji icon with a subtle bounce animation
- The app title in white on the dark blue gradient background
- A progress bar that fills over ~2 seconds (matches the auth check time)

Design the auth screen as a frosted glass card centered on the same gradient background,
with sign-in and sign-up forms that toggle without a page reload.
Match the card style to the app's existing color palette.
```

**Design decision — no separate auth page:**  
The splash and auth screens are CSS overlays (`position: fixed; z-index: 9999`) that sit on top of the main app shell. The main app is hidden (`display: none`) until login succeeds. This avoids routing complexity and keeps the project as a single HTML file.

---

## Phase 3 — Cleanup & Deployment

### Prompt 7 — Code Cleanup
```
Remove all development-facing comments (instructions like "put your key here",
"TODO: connect to backend", etc.).
Translate all code-level comments, variable names, and documentation to English.
Keep Arabic text only in the UI strings (labels object) since the app UI is Arabic.
Remove unnecessary files: server.js, package.json (not needed for GitHub Pages).
Keep: .gitignore, .nojekyll, manifest.webmanifest.
```

**Why keep .nojekyll?**  
GitHub Pages runs Jekyll by default, which ignores files starting with `_`. The `.nojekyll` file disables Jekyll processing, ensuring all files are served as-is.

**Why keep manifest.webmanifest?**  
Makes the app installable as a Progressive Web App (PWA) on Android and iOS. Users can add it to their home screen and use it offline (from cache) with no extra configuration.

---

## Key Technical Decisions Summary

| Decision | Choice | Reason |
|----------|--------|--------|
| File structure | Single HTML file | Zero build step, GitHub Pages compatible |
| Auth | Supabase email/password | Industry standard, cross-device, free tier |
| Data storage | Supabase jsonb + localStorage cache | Simple schema, offline resilience |
| Cloud writes | Debounced 1.5s | Reduce API calls on rapid interactions |
| Week start | Saturday | Matches Saudi/Islamic calendar convention |
| Task key | `YYYY-Www-phaseId-DayIndex` | Fully encodes task location, no collisions |
| Language support | Runtime toggle, no reload | Better UX, no routing needed |
| Auth UI | Overlay, not a separate page | Keeps single-file architecture |

---

## Tools Used

- **AI Assistant:** Google Gemini (Antigravity) — vibe coding, code generation, debugging
- **Backend:** Supabase (Auth + PostgreSQL)
- **Hosting:** GitHub Pages
- **Version Control:** Git / GitHub

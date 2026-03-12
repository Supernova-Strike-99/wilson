# StudyDeck 🎓

A minimal, blazing-fast student planner — class management, attendance tracking, notes, and analytics. Built with React + Vite + TypeScript + Tailwind CSS. Offline-first with IndexedDB.

## Quick Start

```bash
# 1. Install dependencies
cd studydeck
npm install

# 2. Start the frontend (dev server)
npm run dev
# → opens at http://localhost:5173

# 3. (Optional) Start the backend API
npm run db:migrate   # create SQLite tables
npm run db:seed      # insert sample data
npm run server       # → API at http://localhost:3001
```

## Keyboard Shortcuts

| Key   | Action                 |
| ----- | ---------------------- |
| `N`   | New subject            |
| `T`   | New timetable entry    |
| `A`   | Quick mark attendance  |
| `/`   | Open command palette   |
| `?`   | Show shortcuts overlay |
| `Esc` | Close modal / overlay  |

## Quick Flows

### Add a Subject (< 10s)

`N` → type title → pick color → pick emoji → **Create Subject**

### Add a Class Event (< 15s)

`T` → select subject → type title → toggle weekdays → set times → **Create Class**

### Mark Today's Attendance (< 5s)

`A` → click **Mark All Present** (or tap individual P/A/L/E buttons)

### Search Anything

`/` → type query → select from results

## Architecture

```
studydeck/
├── src/                    # React frontend
│   ├── components/         # Layout, modals, shared UI
│   ├── pages/              # Dashboard, Timetable, SubjectPage, Analytics, Settings
│   ├── store/              # Zustand global state
│   ├── db/                 # IndexedDB offline storage layer (idb)
│   ├── utils/              # Attendance calc, occurrence gen, CSV/ICS utils
│   ├── types/              # TypeScript interfaces
│   └── data/               # Seed data
├── server/                 # Express + SQLite backend (optional)
│   ├── schema.sql          # Full DDL
│   ├── routes/             # REST API stubs
│   └── seed.ts             # Sample data
├── sample/                 # Sample CSV and ICS files
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Tech Stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Frontend   | React 18 + Vite + TypeScript + Tailwind  |
| State      | Zustand                                  |
| Animations | Framer Motion                            |
| Charts     | Recharts                                 |
| Local DB   | IndexedDB via `idb`                      |
| Backend    | Node.js + Express + TypeScript           |
| Database   | SQLite via `better-sqlite3`              |
| Auth       | JWT stubs (production: bcrypt + cookies) |

## Data Model

```
User → Subjects → ClassEvents → Occurrences → Attendance
                 → Notes
                 → Tasks
```

- **Subject**: title, code, color (12 presets), emoji, teacher, credits, semester
- **ClassEvent**: recurring schedule (weekdays, time, location, week range)
- **Occurrence**: instance of a class on a specific date
- **Attendance**: per-occurrence marking (present / absent / late / excused)
- **Note**: block-based content linked to subjects/occurrences
- **Task**: subject-linked with priority (P1/P2/P3) and due date

## Attendance Formula

```
% = (present + late × 0.5 + excused) / total_scheduled × 100
```

Color bands: 🟢 ≥ 85% | 🟡 75–84% | 🔴 < 75%

## Deploy

### Frontend → Vercel

```bash
npm run build     # outputs to dist/
# Push to GitHub → connect to Vercel → deploy
```

Environment variables: none required (offline-first).

### Backend → Railway / Render

```bash
# Set env vars:
PORT=3001
DATABASE_URL=./server/studydeck.db

# Start command:
npm run server
```

### Environment Variables

| Variable       | Default                 | Description          |
| -------------- | ----------------------- | -------------------- |
| `PORT`         | `3001`                  | Backend server port  |
| `DATABASE_URL` | `./server/studydeck.db` | SQLite database path |

## Tests

```bash
npm test          # run all tests
npm run test:watch  # watch mode
```

## Export / Import

- **Export Attendance CSV**: Settings → Export Attendance CSV
- **Export Timetable ICS**: Settings → Export Timetable ICS
- **Full Backup JSON**: Settings → Full Backup JSON
- **Import CSV**: Settings → Import CSV (see `sample/timetable.csv` for format)

## License

MIT

# University Application Tracker — Morocco

A clean, personal web app to track your university and school applications in Morocco.

One application = one row in a modern, searchable table. No accounts, no complexity —
just a focused tool to keep track of where you have applied, your deadlines, exams,
and results.

> Built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS + Prisma + SQLite**.

---

## The Problem It Solves

Applying to Moroccan universities and schools means juggling many applications at once,
each with its own:

- deadline
- application / exam / result dates
- official and results websites
- notes (documents to prepare, etc.)

It is easy to miss a deadline or forget that results were published. This tracker keeps
all of that in one place, with visual warnings so you never miss what matters.

## Features

- **Application table** — every application as a row, with all important details
- **Search** — filter by school, city, program, or notes
- **Filters** — by status, level, and city
- **Sorting** — click a column header (school, deadline, exam date, status)
- **Deadline & exam warnings** — auto-highlights deadlines (due today, in 2 days, < 1 week, expired) and upcoming exams
- **Stats dashboard** — total applications, waiting, upcoming exams, admitted, waiting list, rejected
- **Full CRUD** — add, edit, and delete applications (with a confirmation dialog)
- **Client-side validation** — clear inline error messages for required fields, dates, and URLs
- **Server-side validation** — the API re-validates all input before saving
- **Code-friendly field values** — statuses, levels, and results come from a single constants file
- **Demo data** — optional realistic rows to preview the interface

## Tech Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 15 (App Router, React 19)            |
| Language   | TypeScript                                   |
| Styling    | Tailwind CSS 4                               |
| Database   | SQLite                                       |
| ORM        | Prisma 7 (with better-sqlite3 adapter)       |
| Linting    | ESLint (next/core-web-vitals, next/typescript) |

## Project Structure

```
university-tracker/
├── app/
│   ├── api/
│   │   └── applications/       # REST API routes (GET, POST, PATCH, DELETE)
│   ├── layout.tsx              # Root layout (fonts + metadata)
│   ├── page.tsx                # Home page (server component → loads data)
│   └── globals.css             # Tailwind + base styles
├── components/                 # Client components (UI)
│   ├── Tracker.tsx             # Main state container
│   ├── ApplicationTable.tsx    # Table + sorting
│   ├── ApplicationForm.tsx     # Create/edit modal form
│   ├── ConfirmDialog.tsx       # Delete confirmation
│   ├── Filters.tsx             # Search + filters
│   └── Stats.tsx               # Summary cards
├── lib/
│   ├── db.ts                   # Prisma client (singleton)
│   ├── constants.ts            # Statuses, levels, results, badge styles
│   ├── types.ts                # TypeScript types
│   ├── validation.ts           # Server-side validation
│   └── utils.ts                # Date formatting + deadline warnings
├── prisma/
│   └── schema.prisma           # Data model
├── scripts/
│   └── seed.ts                 # Demo data seeder
├── .env.example                # Environment template
└── dev.db                      # SQLite database (gitignored)
```

## Database Structure

A single table, `applications`:

| Field                | Type     | Notes                        |
| -------------------- | -------- | ---------------------------- |
| id                   | Int      | Primary key                  |
| school               | String   | Required                     |
| city                 | String   | Required                     |
| program              | String   | Required                     |
| level                | String   | Required (Licence, Master…)  |
| applicationDate      | String?  | Date (YYYY-MM-DD)            |
| deadline             | String?  | Date (YYYY-MM-DD)            |
| examDate             | String?  | Date (YYYY-MM-DD)            |
| expectedResultDate   | String?  | Date (YYYY-MM-DD)            |
| status               | String   | Default "To Apply"           |
| result               | String   | Default "Not Published"      |
| officialLink         | String?  | URL                          |
| resultsLink          | String?  | URL                          |
| notes                | String?  | Free text                    |
| createdAt / updatedAt| DateTime | Auto-managed timestamps      |

## Installation

Prerequisites: **Node.js 18+** and npm.

```bash
npm install
```

The `postinstall` script runs `prisma generate` automatically, so the Prisma client
is created for you.

### Configure the database

The SQLite database is created automatically on first use at `dev.db`. If you ever
need to recreate the schema:

```bash
npm run db:push
```

### Optional: demo data

Load six `DEMO - ` rows so you can preview the interface without typing anything:

```bash
npm run seed
```

> These rows have fake dates. Delete them any time with the **Delete** button.

## Running the App

### Development

```bash
npm run dev
```

Open http://localhost:3000 — the applications table is the home page.

### Production build

```bash
npm run build
npm start
```

## Usage

1. Click **+ Add Application** to open the form.
2. Fill the form (School, City, Program, Level, and Status are required).
3. Click **Save**.
4. Use **Edit** to change any field, and **Delete** to remove a row (a confirmation
   prompt is shown first).

## Backup

All data lives in a single file: `dev.db` at the project root. Copy that file
somewhere safe to back it up.

## How Data Flows

1. **Server component** (`app/page.tsx`) queries the database via Prisma and
   passes the rows to `Tracker` as props.
2. The **client** keeps the local state in sync.
3. Adding / editing / deleting uses `fetch()` against the `/api/applications` routes.
4. **Input is validated twice**: in the browser for instant feedback, and again on
   the server (in `validation.ts`) before anything is written to the database.

## License

This is a personal project. Feel free to use it as a reference for your own work.

# NexusSAT — CLAUDE.md

Developer reference for AI-assisted work in this repository.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 3 — dark-first, brand palette in `tailwind.config.ts` |
| ORM | Prisma 5 + SQLite (dev) / PostgreSQL (prod) |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) — server-side only |
| State | Zustand 5 — `examStore`, `vaultStore` |
| Markdown | `@uiw/react-md-editor` (editor), `react-markdown` + `remark-gfm` (viewer) |

## Naming Conventions

- **Files/folders**: `kebab-case` for routes and utilities; `PascalCase` for React components
- **Components**: one component per file, file name matches export name
- **API routes**: REST-style — `GET /api/questions`, `POST /api/notes/generate`
- **Zustand stores**: `src/store/<name>Store.ts`, export a single `use<Name>Store` hook
- **Types**: centralized in `src/types/index.ts`; prefix DB-hydrated types with `DB` (e.g. `DBNote`)
- **Env vars**: `ANTHROPIC_API_KEY`, `DATABASE_URL` — never access client-side

## Project Structure

```
nexussat/
├── prisma/schema.prisma        # single source of truth for DB shape
├── src/
│   ├── app/                    # Next.js App Router (pages + API routes)
│   ├── components/             # Shared UI, grouped by feature
│   ├── lib/
│   │   ├── ai/                 # Anthropic client + prompt templates
│   │   └── db/                 # Prisma singleton
│   ├── store/                  # Zustand stores
│   ├── types/                  # Shared TypeScript interfaces
│   └── scripts/seed.ts         # DB seed — run with `npm run db:seed`
└── public/
```

## SAT Categories

Questions are tagged with one of these canonical `category` strings:

**Math**
- `Heart of Algebra`
- `Problem Solving & Data Analysis`
- `Passport to Advanced Math`
- `Additional Topics in Math`

**Reading & Writing**
- `Information & Ideas`
- `Craft & Structure`
- `Expression of Ideas`
- `Standard English Conventions`

## Key Commands

```bash
npm install            # install deps
npm run dev            # start dev server (localhost:3000)
npm run db:push        # sync schema to dev.db (no migration files)
npm run db:seed        # populate DB with mock questions
npm run db:studio      # open Prisma Studio
npm run build          # production build
```

## AI Service Pattern

All LLM calls go through `src/lib/ai/`:
- `client.ts` — creates a single `Anthropic` instance (reads `ANTHROPIC_API_KEY`)
- `prompts.ts` — exports typed prompt-builder functions (no raw strings in routes)
- `generateNotes.ts` — streams or returns completed note content

API routes call `generateNotes()` / `generateExplanation()` — never instantiate the client directly in routes.

## Testing Protocol

- Unit tests: `*.test.ts` co-located with the file under test
- Run with: `npx jest` (add Jest when test coverage is needed)
- Before marking any feature done: manually test the happy path + one error path in the browser
- Seed the DB before UI testing: `npm run db:seed`

## Git Workflow

Commit after each meaningful unit of work. Push immediately after:

```bash
git add <files>
git commit -m "Imperative mood message (e.g. Add exam timer store)"
git push
```

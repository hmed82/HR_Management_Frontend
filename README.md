# HR Management — Frontend

Next.js (App Router) + TypeScript + Tailwind (v4) front end for the HR Management API.

Starting out with the Next.js structure? Open **[`STRUCTURE.md`](STRUCTURE.md)** first —
it maps the whole final file tree, explains the Next.js conventions
(route groups, `[id]`, `_components`, layouts) and tells you where each new
file belongs.

> **Design & API reference:** [`docs/frontend-spec.md`](docs/frontend-spec.md)
> Full screen-by-screen spec for the prototype and the real implementation.

## Quick start

```bash
npm install
cp .env.example .env.local   # already created; edit if the API runs elsewhere
npm run dev                  # http://localhost:3001 (or 3000 if the API isn't there)
```

The backend must be running first (`../hr_management` → `npm run start:dev`).
Demo admin: `admin@example.com` / `Admin1234!` (after `npm run seed`).

## What's already set up

| Piece | Where |
| --- | --- |
| Design tokens (palette, radii, shadows) mapped to Tailwind classes | `src/app/globals.css` → use `bg-primary`, `text-danger`, `border-border`, `card`, `screen-title`, `mono-time` utilities |
| Inter font + metadata + providers | `src/app/layout.tsx`, `src/app/providers.tsx` (React Query) |
| Backend DTO types (mirror of the NestJS DTOs) | `src/lib/types.ts` |
| Fetch wrapper with Bearer injection + 401 → `/auth/refresh` → retry flow | `src/lib/api.ts` |
| Token/session helpers (prototype uses localStorage) | `src/lib/auth.ts` |
| Endpoint-per-resource API wrappers | `src/lib/services.ts` |
| Starter UI primitives (`Button`, `Input`, `FormRow`, `Badge`) | `src/components/ui/` |
| Working login page | `src/app/login/page.tsx` |
| Palette/kit preview | `src/app/page.tsx` |

## Suggested order of work (from the spec, §3–§6)

**Build plan lives in [`docs/plan/`](docs/plan/00-master-plan.md):**
1. [Phase 1 — Foundation](docs/plan/01-foundation.md) (shell, guard, UI kit, mutations)
2. [Phase 2 — Dashboard](docs/plan/02-dashboard.md)
3. [Phase 3 — Employees](docs/plan/03-employees.md) (list, CRUD, detail tabs)
4. [Phase 4 — Departments](docs/plan/04-departments.md)
5. [Phase 5 — Time Entries](docs/plan/05-time-entries.md) (+ Excel import wizard)
6. [Phase 6 — Users & Profile](docs/plan/06-users-and-profile.md)
7. [Phase 7 — Polish & QA](docs/plan/07-polish-and-qa.md)

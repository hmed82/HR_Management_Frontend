# HR Management Frontend — Master Build Plan

> Index document. Read `docs/frontend-spec.md` (endpoints, exact response shapes,
> screen specs, design tokens) together with this plan. The spec defines
> **what** gets built; these files define **how and in what order**.

## Scope & goals

Implement the full feature set from `docs/frontend-spec.md`: login/refresh,
dashboard, employees (with manager-subordinates and detail tabs), departments,
time entries (with Excel import), users (admin), my profile — permission-aware
for `admin` vs `user`, with loading/empty/error states throughout.

## Stack decisions (locked)

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 App Router, TypeScript strict |
| Styling | Tailwind v4 with tokens in `src/app/globals.css` (no other UI kit) |
| Server state | TanStack React Query (provider already in `src/app/providers.tsx`) |
| Forms | Local `useState` for now; add `zod` schemas per form only when validation gets rich |
| API access | `src/lib/api.ts` fetch wrapper (Bearer + auto-refresh) |
| Session | `src/lib/auth.ts` (localStorage for the prototype) |
| Icons | inline SVGs for now; `lucide-react` if a full icon pass is needed (Phase 1) |

## File conventions

- Route groups: `src/app/(public)/login` and `src/app/(private)/...` for everything behind auth
- Feature routes: `(private)/dashboard`, `/employees`, `/departments`, `/time-entries`, `/users`, `/profile`
- Reusable components: `src/components/ui/*` (primitives), `src/components/layout/*` (shell), `src/components/<feature>/*` (domain widgets)
- Data access only through `src/lib/services.ts` wrappers — never `fetch` inside components
- Query keys: `["employees", query]`, `["employee", id]`, `["departments", query]`, `["time-entries", query]`, `["employee-stats"]`, `["te-stats"]`, `["me"]` (defined in Phase 1)
- Permissions: `useSession()` hook exposes the current user; display everywhere gated on `user.role === "admin"`

## Phases (each a separate md file)

| Phase | File | Deliverable | Depends on |
| --- | --- | --- | --- |
| 1 | [01-foundation.md](./01-foundation.md) | App shell, auth guard, session hook, shared UI kit, global error semantics | scaffold ✔ (done) |
| 2 | [02-dashboard.md](./02-dashboard.md) | Overview screen: stat cards, charts, quick actions, latest lists | 1 |
| 3 | [03-employees.md](./03-employees.md) | Employees list, CRUD modal, detail page with 3 tabs | 1 (2 optional for stats) |
| 4 | [04-departments.md](./04-departments.md) | Departments list + CRUD + employee drill-down | 1 |
| 5 | [05-time-entries.md](./05-time-entries.md) | Time entries table, filters, CRUD, Excel import wizard | 1 |
| 6 | [06-users-and-profile.md](./06-users-and-profile.md) | Users admin module + My profile | 1 |
| 7 | [07-polish-and-qa.md](./07-polish-and-qa.md) | Empty/error state audit, responsive pass, final QA checklist | 1–6 |

## Acceptance baseline for every phase

- `npm run build` passes with no type errors
- Both role paths verified: admin **and** user (admin-only controls hidden/disabled for users)
- Loading → skeletons; empty → EmptyState with CTA; errors → toast; payloads exactly as `docs/frontend-spec.md` section 5
- No direct `fetch` calls inside components

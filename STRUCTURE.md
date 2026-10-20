# 📂 Project Structure — final file tree

> The one-stop map of this repo. Keep it next to you while coding until the
> Next.js layout feels natural. Updated as the build progresses.

---

## 1. The full target tree (what it looks like when done)

```text
hr-frontend/
├── .env.example                        # API URL template (real values live in .env.local, git-ignored)
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
├── README.md                           # quick start + phase plan links
├── STRUCTURE.md                        # ← this file
│
├── docs/
│   ├── frontend-spec.md                # the full product/API spec (source of truth)
│   └── plan/                           # 8 phase plans (00..07) — READ ME before coding
│
└── src/
    │
    ├── app/                            # ★ NEXT.JS: routes live here (file-based routing)
    │   │
    │   ├── globals.css                 # design tokens + Tailwind layers (the whole palette)
    │   ├── layout.tsx                  # ROOT layout: <html>, Inter font, <Providers>
    │   ├── providers.tsx               # client providers (React Query). Add toasts here later
    │   ├── not-found.tsx               # global 404 page
    │   ├── error.tsx                   # global crash boundary (reset button)
    │   ├── loading.tsx                 # root-level fallback UI
    │   │
    │   ├── (public)/                   # route GROUP: no auth, public pages
    │   │   └── login/
    │   │       └── page.tsx            # → URL /login
    │   │
    │   └── (private)/                  # route GROUP: guarded by the layout below
    │       ├── layout.tsx              # AUTH GUARD + renders <AppShell> around children
    │       │
    │       ├── dashboard/
    │       │   ├── page.tsx            # → URL /dashboard
    │       │   └── _components/        # underscore = private, NOT a route
    │       │       ├── DeptBars.tsx    #   (dashboard-only widgets live here)
    │       │       ├── QualityChips.tsx
    │       │       └── QuickActions.tsx
    │       │
    │       ├── employees/
    │       │   ├── page.tsx            # → /employees (list + filters + pagination)
    │       │   ├── [id]/
    │       │   │   ├── page.tsx        # → /employees/123 ([id] = dynamic segment)
    │       │   │   └── _components/
    │       │   │       ├── DetailTabs.tsx   # Profile | Subordinates | Time entries
    │       │   │       └── ProfileTab.tsx
    │       │   └── _components/
    │       │       ├── EmployeeTable.tsx
    │       │       └── EmployeeFormModal.tsx
    │       │
    │       ├── departments/
    │       │   ├── page.tsx            # → /departments
    │       │   └── _components/
    │       │       └── DepartmentFormModal.tsx
    │       │
    │       ├── time-entries/
    │       │   ├── page.tsx            # → /time-entries
    │       │   ├── import/
    │       │   │   └── page.tsx        # → /time-entries/import (3-step wizard)
    │       │   └── _components/
    │       │       ├── TimeEntryFormModal.tsx
    │       │       └── ImportWizard.tsx
    │       │
    │       ├── users/
    │       │   ├── page.tsx            # → /users (admin only)
    │       │   └── _components/
    │       │       └── UserFormModal.tsx
    │       │
    │       └── profile/
    │           └── page.tsx            # → /profile (My profile)
    │
    ├── components/                     # shared across routes (app/_components = route-local)
    │   ├── ui/                         # design-system primitives (no domain knowledge)
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── DatePicker.tsx
    │   │   ├── TimeInput.tsx
    │   │   ├── TextArea.tsx
    │   │   ├── Switch.tsx
    │   │   ├── kit.tsx                 # FormRow + Badge (starter combo-primitives)
    │   │   ├── Table.tsx               # generic sortable table
    │   │   ├── Pagination.tsx
    │   │   ├── SearchBox.tsx
    │   │   ├── FilterBar.tsx
    │   │   ├── Modal.tsx + ConfirmDialog.tsx
    │   │   ├── Toasts.tsx + useToast.ts
    │   │   ├── StatCard.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── Avatar.tsx
    │   │   └── KebabMenu.tsx
    │   ├── layout/                     # the app chrome (rendered by (private)/layout.tsx)
    │   │   ├── AppShell.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── Topbar.tsx
    │   └── time-entries/               # shared domain widgets (≥2 routes)
    │       └── StatusPill.tsx
    │
    ├── hooks/                          # cross-feature React hooks
    │   ├── use-session.ts              # auth + role ("admin"/"user") + login/logout
    │   └── use-api-mutation.ts         # standard mutation wrapper (toasts, invalidation, 403/404 handling)
    │
    ├── config/
    │   ├── nav.ts                      # single source of truth for sidebar items (+ adminOnly flags)
    │   └── query-keys.ts               # canonical React Query keys (["employees", query], …)
    │
    └── lib/                            # non-React logic (importable anywhere, incl. server)
        ├── api.ts                      # fetch wrapper: Bearer header, 401→refresh→retry, FetchError
        ├── auth.ts                     # token/session storage helpers (localStorage for prototype)
        ├── services.ts                 # endpoint-per-resource wrappers (auth, employees, …)
        ├── types.ts                    # all DTOs mirrored from the NestJS backend
        └── utils.ts                    # cn() and small helpers
```

The rule of thumb: **`app/` = where you *navigate*, `components/` = what you
*render*, `lib/` = how you *talk to the server*, `hooks/` = how you *react*
to data and state.**

---

## 2. Next.js conventions cheat-sheet (the bits people stumble on)

| Syntax | Name | What it does |
| --- | --- | --- |
| `app/(private)/employees` | **Route group** | Parentheses are stripped from the URL. `(private)` is never in the path — it only exists to hold a shared `layout.tsx` (the auth guard). |
| `app/employees/[id]` | **Dynamic segment** | Matches any value → `/employees/42`. The `params` promise in a page gives you `{ id: "42" }`. |
| `app/employees/_components/` | **Private folder** | Leading underscore means "ignore me in routing" — good for files that belong to one route. |
| `layout.tsx` | Layout | Wraps every page beneath it and persists across navigations. Nested layouts compose (root → `(private)` guard → page). |
| `page.tsx` | Page | The ONLY file that makes a URL reachable. A folder without `page.tsx` renders nothing. |
| `error.tsx` / `loading.tsx` / `not-found.tsx` | Special files | Per-module crash boundary / suspense fallback / 404. Can be placed in any folder — they apply to that route subtree. |
| `@/service` | Path alias | `tsconfig.json` maps `@/*` to `src/*`. Always import `@/lib/api`, never `../../lib/api`. |
| `"use client"` | Client directive | First line of a file that needs state/effects/browsers APIs. Everything else is a Server Component by default. |

Import ordering habit: React → Next → 3rd-party → `@/components` → `@/hooks` → `@/lib`.

---

## 3. Where does this file go when I add something?

| I'm building… | It goes… | Unless… |
| --- | --- | --- |
| A brand-new screen | `src/app/(private)/<name>/page.tsx` | it's public → `(public)/<name>` |
| Sidebar entry | `src/config/nav.ts` | — |
| A modal specific to that screen | `src/app/(private)/<name>/_components/` | used by ≥ 2 screens → `src/components/<domain>/` |
| A button/input/etc. | `src/components/ui/` | — |
| A data-fetching hook | uses `lib/services.ts` via React Query; new hooks → `src/hooks/` | — |
| A new backend field | add it to `src/lib/types.ts` first, then components | — |
| Wrapper for a new endpoint | method on the existing resource in `src/lib/services.ts` | no resource yet → new section at the bottom |

---

## 4. Current progress vs. target

Legend: ✅ exists · ⬜ planned

- ✅ `src/app` root files (globals.css, layout, providers), `(public)/login`
- ✅ `src/lib/*` (api, auth, services, types, utils)
- ✅ `src/components/ui` (Button, kit)
- ⬜ everything else — see `docs/plan/`, starting with `01-foundation.md`

> When a phase ships: tick the matching ⬜ rows here, then commit as
> `phase N: <title>` so the tree and the git history stay in sync.

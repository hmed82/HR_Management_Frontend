# Phase 1 — Foundation

> Everything the other phases consume. Do this first and do it completely.
> Reference: `docs/frontend-spec.md` §2 (design system), §3 (IA/routes/shell), §5.5 (client architecture).

## Goals

1. Authenticated app shell (sidebar + topbar) with an auth guard
2. `useSession()` hook for role-aware UI
3. Complete shared UI kit (tables, modals, pagination, toasts, empty states)
4. Standardised query keys + mutation patterns

## Tasks

### 1.1 Session hook — `src/hooks/useSession.ts`

```tsx
// replaces raw localStorage reads in components
const user = useSession();      // User | null  (hydrates from "me" query when possible)
const isAdmin = role === "admin";
```

- `useSession()` reads `getUser()` from `lib/auth.ts` synchronously, then uses
  a `["me"]` query (`authApi.me()`) to refresh/verify in the background
- exposes `login(dto)`, `logout()` mutations (`logout` clears session +
  `router.replace("/login")`)
- Acceptance: components never import `lib/auth.ts` directly; role gating works
  immediately after login without a hard reload

### 1.2 Route groups & auth guard

- Move `/` shell content later; create empty `(public)` and `(private)` groups
- `(private)/layout.tsx` — client component:
  - `isAuthenticated()` false → `router.replace("/login")`
  - renders `AppShell` around children
- Move the existing login page into `(public)/login/page.tsx`
- Acceptance: hitting `/employees` while logged out redirects to `/login`

### 1.3 App shell — `src/components/layout/`

- `AppShell.tsx`: two-column layout (collapsible 240px sidebar + 64px topbar + content)
- `Sidebar.tsx`: nav items — Dashboard, Employees, Departments, Time Entries,
  Users (admin only), My Profile; active route highlighted (`bg-primary-soft text-primary`)
- `Topbar.tsx`: page title (derived from route), user avatar + name + role
  Badge, dropdown (My Profile, Logout)
- Collapse persists in `localStorage` key `hrm.sidebar`
- Acceptance: spec §3 permission rules hold — non-admins never see the Users
  item or admin buttons

### 1.4 Shared UI kit — `src/components/ui/`

Build these first; every later phase composes them:

| Component | Notes |
| --- | --- |
| `Table.tsx` | props: columns config, rows, loading, rowClick; sortable headers emit `sortBy=field:DIR` |
| `Pagination.tsx` | from `Paginated.meta` (currentPage/totalPages/itemsPerPage) + limit selector (10/20/50/100) |
| `SearchBox.tsx` | debounced (400 ms) input, calls back a string |
| `FilterBar.tsx` | labelled selects/date pickers + "Clear all" |
| `Modal.tsx` | sm/md/lg, ESC + backdrop close, sticky footer |
| `ConfirmDialog.tsx` | danger variant built on Modal |
| `Toasts.tsx` + `useToast()` | success/error/info; 4 s auto-dismiss; render once in `(private)/layout` |
| `StatCard.tsx` | label + value + icon slot |
| `EmptyState.tsx` | icon, title, description, CTA button |
| `Skeleton.tsx` | `TableSkeleton`, `CardSkeleton` |
| `Avatar.tsx` | initials circle, colour from name hash |
| `KebabMenu.tsx` | row actions (View/Edit/Delete/…) with per-item permission |

Finish `Select.tsx`, `DatePicker.tsx`, `TimeInput.tsx`, `TextArea.tsx`,
`Checkbox.tsx`, `Switch.tsx` as plain-styled native inputs (tokens only).

### 1.5 Global error semantics — `src/hooks/useApiMutation.ts`

One helper wraps all mutations:

```tsx
useApiMutation(async (vars) => employeesApi.create(vars), {
  success: "Employee saved",
  invalidateKey: ["employees"],
})
```

Behaviour (spec §4.11):

- 401 → handled by `api.ts` (auto-refresh); cannot progress after refresh
  failure → redirect already handled; no double handling
- 403 → toast "You do not have permission…"
- 404 → caller decides (usually in-page EmptyState)
- 400 → surface first validator message in the form (toast if global)
- 5xx/network → toast "Something went wrong — please try again"
- Loading triggers the button spinner and disables it (no double submits)

### 1.6 Route registry

`src/config/nav.ts` single source of truth for sidebar (+ future breadcrumbs):
`{ href, label, icon, adminOnly }[]`.

## Definition of done

- [ ] Login → shell renders; logout returns to `/login`
- [ ] Deep link to `(private)` route while logged out → redirected
- [ ] All kit components above exist and are used by the palette preview page
- [ ] `npm run build` clean; no `fetch` outside `lib/`

# Phase 7 — Polish & QA

> Reference: `docs/frontend-spec.md` §4.11 (error choreography), §6 (flows),
> §7 (deliverables checklist). Run this pass once all feature phases are
> merged; it is the gate before showing the prototype to stakeholders.

## 7.1 Design system audit

- [ ] Every screen uses only token utilities (`bg-primary`, `card`, …) —
      grep for raw hex/rpx values in components; fix strays
- [ ] Spacing rhythm 4/8/12/16/24/32 respected; button heights consistent (40px/md)
- [ ] `screen-title` on every page; card/table paddings aligned

## 7.2 States grid (per screen, both roles)

| Screen | Loading | Empty | Error | Permissions |
| --- | --- | --- | --- | --- |
| Dashboard | skeleton cards | each panel's EmptyState | per-panel toast, others keep rendering | admin vs user variant |
| Employees list | `TableSkeleton` | EmptyState + "+ Add" CTA | toast | admin buttons hidden for user |
| Employee detail | header + tab skeletons | subordinates/entries empty states | 404 → in-page EmptyState + back | admin-only header buttons |
| Departments | table skeleton | "No departments yet" | block-toast on 400 delete | same |
| Time entries | rows skeleton | date-range/employee empty combos | 400 invalid dates → inline filter error | import/bulk admin-only |
| Import wizard | progress on upload | n/a | error banner + per-row table | admin-only route |
| Users | table skeleton | "No users found" | 403 pattern | route admin-only |
| Profile | card skeleton | n/a | 400 → password helper | self |
| Login | button spinner | n/a | 401 banner | public |

## 7.3 Responsive pass

- Breakpoints: `sm` 640, `md` 768, `lg` 1024
- Sidebar: fixed ≥ md; off-canvas overlay ≤ md (hamburger in topbar)
- Tables: horizontal scroll wrapper with sticky header (`<div className="overflow-x-auto">`)
- Modals full-screen-sheet behaviour under sm
- Dashboard grid: 1-col mobile, 2-col tablet, 4-col desktop

## 7.4 Flow tests (manual, ~30 min against live API)

1. Login (bad credentials → banner; good → dashboard)
2. Create employee with manager; verify detail tabs (subordinates populated)
3. Departments: create → assign via employee edit → delete now blocked with
   the reassigned link → unblock by deleting the employee → row deletes
4. Time entry: valid COMPLETE, missing clock-out (INCOMPLETE), reversed (INVALID preview)
5. Import: download template → tweak via LibreOffice/Excel → upload → report
   shows counts & per-row errors → invalidations reflect on the main list
6. Users: admin creates user → logs in as new user (second browser) →
   nav/state matches (no admin buttons, 403-guarded deep links)
7. Leftover-session test: tamper localStorage `hrm.access_token` → next API
   call auto-refreshes; remove refresh token instead → forced `/login` with toast
8. Access token expiry path: wait/force a 401 mid-action with a valid refresh
   token → transparent retry, no visible failure

## 7.5 Code QA

- [ ] `npm run build`, `npx tsc --noEmit`, ESLint clean
- [ ] No direct `fetch` in components (all through `lib/`)
- [ ] Query key map documented at the top of `hooks/` or `README`
- [ ] Console free of errors/warnings during all flows
- [ ] Meta/title per page (`template: "%s · HR Management"` honoured)

## 7.6 Optional stretch (post-QA)

- `zod` schemas shared between forms (validate before hitting the API)
- Retest E2E with Playwright smoke test of flows 1/4/6
- Next.js middleware stub for future httpOnly-cookie BFF auth
- `README` screenshots + deploy notes (env vars)

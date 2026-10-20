# Phase 2 — Dashboard

> Reference: `docs/frontend-spec.md` §4.3 and §5.3 (stats endpoints).
> Route: `/dashboard` (moved from the old `/`). Data sources:
> `employeesApi.statistics()`, `timeEntriesApi.statistics()`, employees list
> (`limit=5`), departments list.

## Layout (top → bottom)

1. **Page head:** "Dashboard" title + (admin) quick-action buttons
2. **Row 1 — four `StatCard`s**
   | Card | Source field |
   | --- | --- |
   | Total employees | `EmployeeStatistics.total` |
   | Active / Inactive | `active` / `inactive` shown as "15 / 2" |
   | Time entries | `TimeEntryStatistics.total` |
   | Entry quality | 3 mini chips: COMPLETE / INCOMPLETE / INVALID + counts (`byStatus`) |
3. **Row 2 — two panels**
   - *Employees by department*: horizontal bar chart (label = department name,
     value = `count`) from `byDepartment`. Bar = `bg-primary`, hover tooltip.
     Implement with plain divs (width %) — no chart library.
   - *Quick actions* (admin): buttons "+ Add employee", "+ Add department",
     "+ Add time entry", "Import from Excel". Non-admins: link cards to the
     last departments/employees instead.
4. **Row 3 — Recent employees / Recent time entries** read-only tables (5 rows,
   status pills; row click → the record's detail route)

## Tasks

- [ ] `(private)/dashboard/page.tsx` with `["employee-stats"]` and `["te-stats"]` + `["employees", {limit:5}]` query keys
- [ ] `_components/DeptBars.tsx` (pure CSS bar chart) and `QualityChips.tsx`
- [ ] StatCard skeletons while loading (spec: skeleton-then-populated)
- [ ] Empty DB: each panel renders the appropriate EmptyState
- [ ] Quick actions link to the routes created in Phases 3–5 (placeholder
      routes render WorkingTitle stubs until built — update links then)

## Data pitfalls (from the API contract)

- `stats/overview` on employees is **admin-only** (`403` for user). For users:
  hide the first three stat cards? No — spec wants them; hide admin row and
  render the cards from a `limit=…` list fallback if needed. Decision: users
  see department bars only (name + counts) because departments endpoint is
  role-open; get product sign-off if different.
- Time-entry stats endpoint is **admin-only**; non-admins hide the two
  attendance cards.

## Definition of done

- [ ] Both role variants render correctly (two states checked in code review)
- [ ] Loading skeletons → content; errors → toast; sections degrade
      independently (one failing query does not blank the page)

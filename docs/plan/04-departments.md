# Phase 4 — Departments

> Reference: `docs/frontend-spec.md` §4.7.
> Endpoints: `departmentsApi.list/listWithCount/get/create/update/remove`.
> Smallest phase — ships the pattern the employees detail page reuses.

## Route map

```
/private/departments                → table + filters
modal: DepartmentFormModal (create & edit)
/private/employees?departmentId=X   → drill-down (existing EmployeesTable with preset filter)
```

## 4.1 List screen

- **Toolbar:** `SearchBox` (server search), per-page, admin "+ Add department"
- **Data:** use `departmentsApi.listWithCount` (the `employee-count` endpoint —
  rows include `employeeCount`) instead of the plain list; query key
  `["departments", query]`
- **Columns:** Name (Link-styled), Description (1-line truncate),
  **Employee count pill** → click filters the employees list to that
  department, Created, Actions (Edit admin / Delete admin)
- Filters: `search`, `filter.name`; pagination standard

## 4.2 Form modal

- `name` required 2–100 (server `409` when a duplicate name exists → inline
  "Department name already exists")
- `description` Textarea ≤ 500 chars (live character counter)
- Invalidations: `["departments"]`, `["departments", query]`, and any
  `["employee", id]` pages that embed a department badge name

## 4.3 Delete semantics (important — backend blocks it)

- ConfirmDialog first; then the response decides the UX:
  - success (204) → toast "Department deleted" + refresh
  - `400` "Cannot delete department. N employee(s) are assigned…" → **danger
    toast with that message verbatim**, keep the row, offer a link:
    "Reassign employees" → opens the drill-down (`/employees?departmentId=X`)

## 4.4 Files

```
src/app/(private)/departments/page.tsx
src/app/(private)/departments/_components/DepartmentFormModal.tsx
```

The employees-list drill-down reuses Phase 3's table — add a URL-param preset
(`?departmentId=`) and a "clear filter" chip in the FilterBar.

## Definition of done

- [ ] CRUD works; `employeeCount` pills deep-link to a filtered employee list
- [ ] Blocked deletion surfaces the friendly relink UX, and the row stays
- [ ] Empty state: "No departments yet — Create department" (with CTA)

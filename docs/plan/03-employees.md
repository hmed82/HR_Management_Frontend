# Phase 3 — Employees (the biggest feature)

> Reference: `docs/frontend-spec.md` §4.4–4.6.
> Endpoints: employees list/get/create/update/delete/subordinates/department +
> departments list. This is the core screen; allow ~2–3 sessions.

## Route map

```
/private/employees                 → EmployeeTable (list + filters + pagination)
/private/employees/[id]            → EmployeeDetail (tabs)
  modal: EmployeeFormModal (create & edit — same component)
```

## 3.1 List screen

- **Toolbar:** `SearchBox` (server-side `search`, debounce 400 ms) +
  `FilterBar`: Department select (from `departmentsApi.list({limit:100})`),
  Status select (Active/Inactive/All) + per-page selector + admin "+ Add
  employee"
- **Table columns:** Employee (Avatar + name), Email, Phone, Department badge,
  Hire date (YYYY-MM-DD), Manager (from `manager?.firstName …` or "—"), Status
  pill, Actions kebab (View · Edit admin · Delete admin)
- Rows carry `managerId` — clicking the manager name deep-links to that
  employee's detail
- **Query params mapping** (`src/lib/api.ts` `toQueryString`):
  `page`, `limit`, `sortBy` (`hireDate:DESC` etc. via sortable headers),
  `search`, `filter.isActive` (`true|false`), `filter.departmentId`
- RowClick → detail; pagination from `Paginated.meta`
- Acceptance: sorting, search, both filters, pagination compose together
  (single `PaginationQuery` object state)

## 3.2 `EmployeeFormModal` (create & edit)

Fields (spec §4.5) — validation mirrors backend:

| Field | Rule |
| --- | --- |
| firstName / lastName | required, 2–50 |
| email | optional, unique (409 → inline field error) |
| phone | optional, pattern `0[5-7]\\d{8}` (helper text: Algerian mobile) |
| hireDate | optional date |
| departmentId | required select (departments) |
| managerId | optional **searchable** select of employees; exclude self in edit mode |
| isActive | Switch (default on) |

- Departments come from `["departments"]` (limit 100); employees from a
  `["employees", { search / limit:50 }]` lightweight query
- On submit: `create` or `update`; `invalidateKeys`: `["employees"]`,
  `["employee", id]`, `["employee-stats"]`
- 400 → map `message[]` items under fields when identifiable, else form banner
- 409 email → inline "Email already exists"

## 3.3 Detail page `/employees/[id]`

- **Header:** big Avatar, full name (title case), status pill, email / phone /
  hireDate, department badge, Spacer + admin: Edit, Delete buttons + "Reports
  to" link (`manager`) when set
- **Tabs (≥ three):**
  1. Profile — all fields incl. createdAt/updatedAt; manager link
  2. Subordinates — `employeesApi.subordinates(id, query)`; Table reuse with
     the employees columns minus Manager; EmptyState "No direct reports";
     loading & pagination same as list
  3. Time entries — reuse the Phase 5 `TimeEntriesTable` embedded with
     `filter.employeeId = id` and admin "+ Add entry" passing the preset
     employeeId into the modal
- Delete (admin): ConfirmDialog → `delete` → on success toast + `router.push`
  to `/employees`. Defunct links after deletion → the detail page handles
  `404` as an in-page EmptyState with a back link (spec §4.11)
- Breadcrumb: `Dashboard / Employees / First Last` (+ back link)

## 3.4 Files

```
src/app/(private)/employees/page.tsx
src/app/(private)/employees/[id]/page.tsx
src/app/(private)/employees/_components/EmployeeTable.tsx
src/app/(private)/employees/_components/EmployeeFormModal.tsx
src/components/employees/DetailHeader.tsx  (shared by [id] sub-tabs)
```

## Definition of done

- [ ] Create / edit / delete lifecycle works against the live API
- [ ] Manager chain is visible and navigable (row manager link + "Reports to")
- [ ] Subordinates tab shows real data through the paginated endpoint
- [ ] Modal validation matches server responses (400 mapping + 409 inline)
- [ ] Admin-only buttons hidden for `user` role

# Phase 5 — Time Entries & Attendance

> Reference: `docs/frontend-spec.md` §4.8–4.9 and §5.3 (import contract).
> Biggest horizontally-flowing phase: table + filters + CRUD modal + 3-step
> import wizard + bulk actions.

## Route map

```
/private/time-entries                  → table + filter bar
/private/time-entries/import           → import wizard (admin only; guard at layout too)
modal: TimeEntryFormModal
```

## 5.1 List screen

- **Two-row toolbar:**
  - Row 1 `FilterBar`: DateRange (two DatePickers), Employee select ("All" default),
    Status select (COMPLETE/INCOMPLETE/INVALID), per-page
  - Row 2 admin actions: "+ Add entry", "Excel import", bulk "{N} selected —
    Delete" (appears when selection non-empty)
- **Endpoint selection logic:**
  - both dates set → `timeEntriesApi.listByDateRange(startDate, endDate, query)`
    — date format must stay `YYYY-MM-DD` (backend `400`s otherwise)
  - employee set → `listByEmployee(employeeId, query)`
  - neither → `list(query) with filter.status / filter.employeeId / filter.date`
  - keep the mode invisible to the user; expose one `["time-entries", filters]`
    key whose queryFn picks the endpoint
- **Columns:** Date, Employee (Avatar + name from nested `employee`),
  Clock in (`mono-time`), Clock out (`mono-time` or "—"), Status pill
  (green/amber/red from the kit), Actions (Edit admin · Delete admin)
- Default sort `date:DESC`; `limit` default 20 (max 200)

## 5.2 TimeEntryFormModal

| Field | Behaviour |
| --- | --- |
| employeeId | searchable employee select (required) |
| date | DatePicker (required) |
| clockIn | TimeInput `HH:mm:ss`, tolerant to `HH:mm` (normalise client-side) |
| clockOut | optional TimeInput; leave empty for open-ended shifts |

- **Live helper under the clock inputs:**
  - duration ("8h 30m") when both valid
  - `clockOut <= clockIn` → red hint: "Clock out must be after clock in — this
    entry will be saved as INVALID" + preview pill (backend computes the same
    status)
- Submit `create` / `update` (PUT);
  **`409` duplicate per employee+date** → inline: "An entry already exists for
  this employee on this date"

## 5.3 Excel import wizard `/time-entries/import` (admin)

Three steps (spec §4.8):

1. **Template** — explanatory panel: expected columns
   `Employee ID · Date · Clock In · Clock Out`; accepted date formats
   (`YYYY-MM-DD`, `DD/MM/YYYY`, …) and times (`HH:mm`, `HH:mm:ss`); big CTA
   "Download template" (`downloadTimeEntriesTemplate()` from `lib/services.ts`)
2. **Upload** — `FileDropzone` accepting `.xlsx`/`.xls` ≤ 10 MB; show
   file name + size after pick; "Start import" → `importTimeEntriesExcel(file)`
3. **Report** — from `BulkImportResult`: summary chips (total / imported green /
   failed red) + errors table (`employeeId`, `date`, `error` per row);
   buttons "Import another file" and "Go to time entries"

- Accept `400 { message, errors[] }` from the shared batch invalid-format case:
  render those in the report table with an "Excel validation failed" banner
- Invalidate `["time-entries"]` and `["te-stats"]` on success

## 5.4 Bulk delete

- Checkbox selection → confirm dialog → `bulkDelete(ids)` → toast with
  `{deleted}/{failed}` summary; keep the current filters afterwards

## 5.5 Files

```
src/app/(private)/time-entries/page.tsx
src/app/(private)/time-entries/import/page.tsx
src/app/(private)/time-entries/_components/TimeEntryFormModal.tsx
src/app/(private)/time-entries/_components/ImportWizard.tsx   (steps as components)
src/components/time-entries/StatusPillHelp.tsx  (optional helper used by the modal)
```

## Definition of done

- [ ] All three list modes (all/employee/date-range) reachable and composed
- [ ] Manual entries create the SAME statuses the backend computes (incl. the
      INVALID preview)
- [ ] Duplicate-day 409 handled inline
- [ ] Import wizard end-to-end against the real API with a real template round-trip
- [ ] Bulk delete + confirm flow works; non-admins never see these controls

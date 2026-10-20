# Phase 6 — Users (admin) & My Profile

> Reference: `docs/frontend-spec.md` §4.9–4.10 and §5.2–5.4.
> Two screens sharing the users API; remember the server's field restrictions.

## Route map

```
/private/users            → admin-only users table (nav hidden for user role)
/private/users/me         → My Profile (shown despite the admin module)
```

---

## 6.1 Users table (`/users`, admin)

- **Toolbar:** SearchBox (`search` — server searches email/name) + role filter
  (`filter.role=admin|user`) + per-page + "+ Add user"
- **Columns:** Name (Avatar+name), Email, Role (`Badge`: admin indigo / user
  gray), Active pill, Created, Actions (Edit · Delete)
- **Permissions enforced client-side too:**
  - the whole route/page is admin-only (guard in the page component —
    non-admin gets the `403` pattern instead of content)
  - never allow deleting the signed-in user's own account: disable the Delete
    action w/ tooltip "You cannot delete yourself"
- **Create/Edit modal (`UserFormModal`):**
  | Field | Rule |
  | --- | --- |
  | name | 2–100 |
  | email (create only) | required, unique — server `409` |
  | password | ≥ 6, ≥1 lowercase + 1 digit; edit = "Leave empty to keep current" |
  | role | admin/user select (create defaults user) |
  | isActive | Switch (default on) |
- **Server field restrictions (mirror them in the UI):**
  - email is NOT editable after creation → read-only display in edit mode
  - `/users/:id` patch self (admin updating own row) can still send
    `role`/`isActive`/`password`/`name` — everything is allowed because the
    route detects admin
  - a plain user patching only own profile is Phase 6.2's scope

## 6.2 My Profile (`/profile`)

- Reads the current user (prefer `["me"]` query — `authApi.me()` / `usersApi.me()`)
- Layout: header card (Avatar, name, email read-only, role Badge, "Member
  since") + two sections:
  1. **Profile**: name only (editable) → `usersApi.updateSelf(id, {name?})` —
     password handled below
  2. **Password**: "New password" + "Confirm password" (local equality
     validation; min 6 + digit/lowcase hint) → `updateSelf(id, {password})`
     — blank parent field cancels, says "password unchanged"
- Both calls invalidate `["me"]` and session cache; Toast "Profile updated"
- **Keep the admin's own-privileges doc in mind:** the signed-in admin uses
  the same endpoints; role/active toggles are on the Users modal, not here
- Extra: read-only `Sessions/Security` card explaining the refresh token
  ("access token ~1h, refresh 7d — sign out to clear")

## Files

```
src/app/(private)/users/page.tsx
src/app/(private)/users/_components/UserFormModal.tsx
src/app/(private)/profile/page.tsx
```

## Definition of done

- [ ] Admin can CRUD users; role filter + search work with the paginated endpoint
- [ ] Non-admin who deep-links `/users` gets the 403 pattern; sidebar hides it anyway
- [ ] Profile: name + password changes work; email shown read-only
- [ ] Password rules surface the same failures the backend would (min 6 + digit)

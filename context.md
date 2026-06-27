## Park / Unpark Reservation in the Booking Chart — 2026-06-27

Added a "Park Reservation" / "Unpark" workflow to the Booking Chart, modeled on the equivalent feature in the legacy reference system: right-click a booking → Park → it moves into a dedicated holding row (multiple parked bookings stack visibly) → later, Unpark → pick a real room → it moves there, optionally recalculating its tariff and/or re-pointing an existing housekeeping task.

Three pieces of half-finished scaffolding for this already existed and were built on rather than replaced: `src/components/BookingChart.jsx` already had full multi-track stacking/rendering logic keyed on a hardcoded `room.id === 'PK01'`; `src/data/rooms.js`/`mockData.js` already defined a mock `PK01` "Parked Reservation" room; `update-booking.dto.ts` had a stale, unused `isParked?: boolean` field.

### Critical design decision: parking does NOT touch `isParked`
`Booking.isParked` is already live for an unrelated purpose — the cancellation flow (`updateStatus()`/`remove()` in `booking.service.ts`) sets it directly via document mutation to hide canceled bookings from the chart query. Reusing it for "this booking is parked" would have made parked bookings invisible, the opposite of the goal. **Parking is implemented purely as `roomId` reassignment** to a dedicated, always-seeded "Parked Reservation" room — `isParked` is never read or written by any of this feature's code. The stale `isParked` field was removed from `UpdateBookingDto` (confirmed via grep that the cancellation flow sets it server-side directly, never through this DTO, so removal is safe).

### Backend (`Rms Booking Backend`)
- `src/modules/seed/seed.service.ts` — `seedParkingRoom()` (idempotent find-or-create, mirrors `seedStaffAccommodation()`'s pattern, not gated behind the bulk `roomCount === 0` check). Creates one Room: `name: 'Parked Reservation'`, `type: 'PARKED'`, no `category` set (renders as a top-level/uncategorized row, same as how `topLevelRooms` already groups rooms with no category — passing `category: null` explicitly was tried first and rejected by TypeScript, since `Room.category` is typed as a required `string`; omitting the field entirely is both type-correct and behaviorally identical, since `undefined` is just as falsy as `null` for the grouping check).
- `src/modules/booking/dto/update-booking.dto.ts` — removed stale `isParked`; added `recreateTariff?: boolean` and `reassignHousekeeping?: boolean` — one-time instructions for a single `update()` call, never persisted to the Booking document.
- `src/modules/booking/booking.service.ts` — `PARKING_ROOM_NAME` constant; `isParkingRoom(roomId)` helper (looks up the room, compares `name`); `resolveCurrentRate(clientId, requestUser)` (reuses the same rate fallback chain already used at booking creation). `update()` rewritten to: skip the availability check entirely when the target room is the parking room (unlimited overlapping bookings allowed there by design); recompute `appliedRate` when `recreateTariff` is set; call `tasksService.reassignRoomForBooking()` after a successful room change when `reassignHousekeeping` is set.
- `src/modules/tasks/tasks.service.ts` — new `reassignRoomForBooking(bookingId, newRoomId)`: re-points any not-yet-completed task tied to a booking to its new room (otherwise an already-created departure-clean task stays orphaned on the old room after an unpark).

### Frontend (`Rms-Frontend`)
- `src/components/BookingChart.jsx` — replaced the hardcoded `room.id === 'PK01'` check with `PARKING_ROOM_NAME = 'Parked Reservation'` matched against `room.name` (real Mongo `_id`s can't be the literal string `'PK01'`). Booking context menu gained "Park Reservation" (`Modal.confirm`, reuses `useUpdateBookingChart` unchanged) or "Unpark Reservation" (new controlled modal: Area `Select` + two unchecked-by-default checkboxes for Recreate Tariff / Reassign Housekeeping), gated behind `!isPortalUser` like the existing Out Of Service/Out Of Order items. No new hooks or API functions needed — the existing `updateBookingChartMutation` already PATCHes arbitrary fields to `/bookings/:id`.

### Two real, pre-existing bugs found and fixed during verification
Neither bug is new — both predate this session (confirmed via `git show HEAD:...` against the last commit before any of today's changes) and simply had no code path exercising them until this feature became the first to ever change an *existing* booking's room through `PATCH /bookings/:id` (drag-resize only ever changes dates).

1. **`update()` silently dropped room changes.** `UpdateBookingDto.roomId` was spread directly into the Mongoose update payload, but the schema's actual field is `room` (an ObjectId ref) — Mongoose's default `strict: true` silently discards unknown keys, so every `{roomId: ...}` PATCH was a no-op on the room itself (everything else in the payload still saved, masking the issue). Fixed by destructuring `roomId` out and explicitly setting `normalizedUpdate.room = new Types.ObjectId(roomId)`.
2. **`checkAvailability()` never matched on room.** Its query used `room: roomId` with a plain string, never wrapped in `new Types.ObjectId(...)` (unlike every other room/booking query elsewhere in this codebase, e.g. `tasks.service.ts`'s `buildTaskQuery`). The mismatch meant the conflict query matched zero existing bookings regardless of actual occupancy — a double-booking into an already-occupied room would have silently succeeded. Fixed by wrapping `roomId` the same way as everywhere else.

Both were caught because the plan's own verification checklist specifically called for testing "unpark into an occupied room → expect a conflict," which the original implementation could not have passed without these fixes.

### Verified live
Used a fresh `npm run start:dev` instance (the long-running dev server from earlier in the day turned out to be running stale, pre-fix code — `nest start --watch`'s auto-restart was silently failing with `EADDRINUSE` against itself on this machine, leaving the old process serving forever; confirmed by checking `netstat`/`Get-Process` and restarting cleanly) and disposable test reservations/a test housekeeper/a temporary client-rate change, all deleted after:
- Parking room seeds exactly once and stays that way across a second clean restart (idempotency confirmed, not just assumed).
- Parked a booking → room became "Parked Reservation"; its original room+dates immediately became bookable again (proved by creating a fresh reservation in the vacated slot).
- Parked a second, date-overlapping booking into the same holding room → succeeded with no conflict (the parking-room bypass works).
- Unparked into a free room with both flags off → landed correctly, `appliedRate` untouched.
- Unparked with "Recreate tariff" checked (after bumping the test client's rate from 500 → 650) → `appliedRate` correctly became 650, not the stale 500.
- Unparked with "Reassign housekeeping" checked (booking had an existing task pointed at a different room) → task's `room` field correctly updated to the new room.
- Attempted to move a booking into an already-occupied room → correctly rejected with `409 Conflict`, booking's room unchanged (this is the case that surfaced both bugs above).
- Regression-checked the unrelated drag-resize path (dates-only PATCH, no `roomId`) — room correctly left untouched, confirming the `update()` rewrite didn't disturb existing behavior.

---

## Default Reservation Time (06:00 AM) + Bookings Export Column Rename — 2026-06-27

**Default Reservation Time:** The Add Reservation form's arrival/departure time defaulted to 15:00 (3 PM) in several places, not just the obvious `RangePicker`'s `showTime.defaultValue`. Fixed all of them to 06:00 AM, consistently: `ReservationsListPage.jsx` (`showTime.defaultValue`, the `useState` initializer's `arrive` for both branches, the URL-param-sync `useEffect`'s `arrive`/`depart`, and the `onChange` handler's separate "patch 00:00 to a real default" logic — this last one is a distinct code path from `showTime.defaultValue` and needed its own fix, not redundant with it), `ReservationEditPage.jsx` (same `showTime.defaultValue` + initial-state + param-sync spots), and `ReservationFormDrawer.jsx`'s `checkIn` initializer. Still fully user-editable after the default applies.

**Bookings Export Column Rename:** `EXPORT_HEADERS.bkgSource` in `src/pages/BookingChart.jsx` changed from `'Booking Source'` to `'Booking Type'` to match updated terminology used elsewhere in the system (confirmed via grep this was the only occurrence of the old label anywhere in the export pipeline).

---

## Invoice Generator ↔ Voucher Integration — Verified, Not Rebuilt — 2026-06-27

Asked to wire the Invoice Generator's Voucher No field to the Vouchers module (validate on entry, apply discount automatically, handle invalid/expired/already-used codes). Found the entire feature already fully implemented and committed (part of `1ba2bb4`, untouched by anything else this session) — `InvoiceVoucherField.jsx` calls `GET /vouchers/validate/:code`, `useInvoiceGenerator.js`'s `totals` already subtracts `voucherDiscount` from the total, and both the on-screen `InvoiceTotals` and the downloadable `InvoiceGeneratorPDF.jsx` already conditionally render the "Voucher Discount" line. Rather than re-implement working code, did a live end-to-end verification instead (created disposable test vouchers + a disposable Manager account, deleted both after):

### What "already-used" means in this system
There's no auto-redemption/single-use counter — `Voucher.usedByCompany` is a static *scoping* field set at creation time (which company this voucher is restricted to), not a "consumed" flag, and nothing anywhere sets it dynamically on redemption. The actual lifecycle is manual: an admin/manager flips the `isActive` switch off once a voucher has been given out and used. `vouchers.service.ts`'s `validateForInvoice`/`resolveApplicableVoucher` already query `{code, isActive: true}`, so a deactivated voucher is correctly treated as not-found. This is a deliberate, reasonable design for a system with no persisted invoice/redemption record to count against — not a gap.

### Verified live as Admin
- Valid voucher (`isActive: true`, no expiry, $25 credit) on a $100 line item → "Voucher applied: -$25.00", totals exactly NET $100 / GST $10 / Voucher Discount -$25 / **Total $85.00**.
- Expired voucher (`isActive: true`, expiry in the past) → "Voucher has expired", discount correctly reset to $0.
- Inactive voucher (`isActive: false`) → "Voucher code X not found", discount reset to $0.
- Nonexistent code → "Voucher code X not found".
- PDF component (`InvoiceGeneratorPDF.jsx`) confirmed to use byte-identical total/discount calculation logic to the on-screen version (read source directly) — the embedded PDF preview iframe renders as a black box under automated screenshot capture (a capture-tooling limitation of native PDF viewers, not an app bug; zero console errors during generation).

### Verified live as Manager (tenant isolation)
- A disposable Manager account only sees vouchers it creates (`GET /vouchers` returned empty before creating one — confirms `findAll`'s `managerClientNumber` scoping).
- A voucher created by that Manager auto-scopes `managerClientNumber` to their own `clientNumber` server-side — the "Manager client number" form field's value is ignored for non-admins (`vouchers.service.ts`'s `create()` always overrides it from `requestUser.clientNumber`), so a manager cannot self-assign a different tenant's scope even by editing the field.
- That Manager's own voucher applied correctly in their own Invoice Generator ($200 + $20 GST − $30 = **$190.00**, math verified).
- The same Manager attempting to redeem the *Admin's* test voucher (created with no `managerClientNumber`) got "not found" — confirmed cross-tenant rejection works correctly via `resolveApplicableVoucher`'s exact `managerClientNumber` match requirement.

**Found, not fixed (out of scope — UI gap, not a voucher-integration bug):** `VouchersTable.jsx` has no Delete action and `api/services/vouchers.js` has no `deleteVoucher()`, even though the backend's `DELETE /vouchers/:id` already exists and works (used directly via `fetch()` to clean up this session's test vouchers). Flagged for the user to decide if it's worth adding a Delete button later.

---

## Invoice Save & Edit Permissions — 2026-06-27

Added backend persistence to the Invoice Generator (previously a pure client-side PDF tool with zero saved state) plus time-boxed edit permissions: Manager can edit a saved invoice for 5 days from creation; Admin always can. A companion bug report (nights/day calculation showing "10" instead of an expected "11" for a 01–10 June range) was investigated and resolved as **no code change** — confirmed with the user that the existing `diff + 1` formula already matches the stated "inclusive of both dates" rule; the expected number in the report was a manual miscount.

Planned via `EnterPlanMode` given the scope (new schema/module + multi-file frontend wiring); a Plan-agent stress-test of the design caught two real issues before any code was written, both addressed in the implementation:
- **A genuine bug, not hypothetical**: `useInvoiceGenerator.js`'s `setField('voucherNo', ...)` always reset `voucherDiscount` to 0. Naively seeding form state for a *loaded* saved invoice through that same setter would have silently wiped a real saved discount back to zero on every reload. Fixed with a dedicated `loadInvoice()` action that replaces state atomically in one `setInvoice` call, bypassing `setField` entirely.
- The "create → attach id to URL → next save PATCHes" pattern doesn't exist anywhere else in this codebase (`ReservationEditPage.jsx` only ever updates, never creates) — built fresh using `useSearchParams()`'s setter rather than assumed to mirror an existing pattern.

### Backend — new `invoices` module (`Rms Booking Backend`)
- `src/schemas/invoice.schema.ts` — mirrors the Invoice Generator's existing form fields plus an embedded `InvoiceLineItem` subschema, `clientNumber` (tenant scope) and `createdBy`. `invoiceNo` globally unique (matches `resNo`/voucher `code` precedent).
- `src/modules/invoices/invoices.service.ts` — `ensureScope()` mirrors `vouchers.service.ts`'s tenant check. A single `canEdit()` helper (`role === ADMIN || daysSinceCreation <= 5`) and `decorate()` helper (adds `canEdit` + computed `net`/`gst`/`total`) used by every read/write path, so the time-math and the admin bypass each live in exactly one place. `update()` checks tenant scope *before* the edit-window, so a cross-tenant manager gets "not yours" rather than leaking "window expired" about a record they can't access at all. `remove()` is admin-only (no UI button yet, kept for cleanup parity with how `vouchers.service.ts` already has an unused-by-UI `remove()`).
- `src/modules/invoices/invoices.controller.ts`/`invoices.module.ts` — same `@RoleDecorator`/guard shape as `vouchers.controller.ts`. Registered in `app.module.ts`.
- Reused the existing `USER_DISPLAY_FIELDS` constant (from the password-leak fix earlier this session) for the `createdBy` populate — caught and fixed a moment where this was first written as a hardcoded `'username fullName'` string instead of importing the shared constant.

### Frontend
- `src/api/services/invoices.js` + `src/hooks/useInvoices.js` — query-key-factory shape (mirrors `useReservations.js`), mutations wrapped in the existing `useAppMutation` for consistent toasts.
- `src/hooks/useInvoiceGenerator.js` — added `loadInvoice()` (see bug above) and a separate `meta` state (`{ id, canEdit, createdAt }`), deliberately kept out of the `invoice` object so it's never serialized back into a save payload — the backend's global `forbidNonWhitelisted` validation pipe would otherwise reject the request outright.
- `src/pages/InvoiceGeneratorPage.jsx` — `?invoiceId=` via `useSearchParams`; "Save Invoice" moved to the front of the header actions (red/danger button, matching the reference image) with a double-click guard and a disabled+tooltip state when `canEdit === false`. "New Invoice" now also clears `?invoiceId=` so the next save can't accidentally PATCH the previous record. Existing Preview/Download PDF behavior is unchanged — saving is purely additive.
- `src/pages/InvoiceHistoryPage.jsx` + `src/components/invoice/InvoiceHistoryTable.jsx` (new) — a minimal list of saved invoices with an "Open" action, added because there was otherwise no way to find a saved invoice again to edit it (not explicitly requested, but necessary for the feature to be reachable at all). New `/invoice-history` route, nav entry, and `ProtectedRoute.jsx` `ADMIN_PATHS` entry (same treatment as `/invoice-generator`).

### Verified live
Created a real invoice as Admin with a line item and a voucher discount applied (used the existing `457dt433` voucher) → saved → **reloaded the page and confirmed the voucher discount survived** ($300 + $30 GST − $200 = $130, exactly — this is the specific bug described above, directly confirmed fixed). Edited and re-saved: confirmed exactly one record existed throughout (PATCH, not a duplicate create). "New Invoice" confirmed to clear the URL and start a true new record on the next save.

For the 5-day window, rather than mutating `createdAt` directly against the live shared dev database (attempted once via a one-off script — correctly blocked by the permission system as an unauthorized direct database mutation bypassing the app layer, since this hadn't been explicitly approved as its own action) — the edit window was temporarily set to 0 days in code, tested, then reverted to 5:
- Manager attempting to PATCH their own just-created invoice → 403 "edit window has expired"; Save button correctly disabled+tooltipped in the UI.
- Admin PATCHing the same invoice → 200 OK, succeeds regardless of the window.
- A second Manager (different `clientNumber`) attempting to GET or list the first Manager's invoice → 403 "not your account" / excluded entirely from their own list — confirmed via direct API calls.
- Invoice History page: Admin sees all saved invoices (including ones created by both test Managers); "Open" correctly round-trips into the generator with all fields reloaded.

All disposable test invoices and the two test Manager accounts were deleted after verification.

---

## Backend-wide User-populate Password Leak Fix — 2026-06-27

Follow-up to the security finding below (clients.service.ts's `createdBy` populate leaking `password`/`refreshToken`). Audited every `.populate()` call across `Rms Booking Backend/src` referencing the `User` model and fixed all of them, not just the one found live.

### Root cause
`src/schemas/user.schema.ts`'s `password`, `refreshToken`, `resetPasswordToken`, `resetPasswordExpires` fields have no `select: false` (only `two_factor_secret` does). Any `.populate('someUserRef')` call with no field projection pulls the entire `User` document — credentials included — into the populated subdocument, which then serializes straight into the JSON response for any caller with read access to that endpoint.

### New shared constant
`src/constants/user-display.constants.ts` — `USER_DISPLAY_FIELDS = 'username fullName'`. Verified this is the *exact* and *only* set ever read from a populated `createdBy`/`assignedTo`/`confirmedBy`/`completedBy`/`assignedHousekeeper` field on the frontend (`readUserName()` in `reservation-payload.helper.ts`, and `record.assignedTo?.fullName || record.assignedTo?.username` in the Tasks/Housekeeping tables) — not a blanket reuse of `clients.service.ts`'s broader `CREATED_BY_SAFE_FIELDS` allowlist, which was sized for a different consumer.

### Fixed (real, currently-exploitable leaks — no mapper/DTO was filtering these)
- `accounting.service.ts` — `createdBy` (`findAll`, `findOne`, `syncReservationCharge`)
- `asset-maintenance.service.ts` — `assignedTo` (`findAll`, `findOne`) — note: this module has no live frontend consumer at all currently (`grep` for `assetMaintenance`/`asset-maintenance` in `src/api` returns nothing), fixed anyway for when it's wired up
- `housekeeping.service.ts` — `assignedTo` (`getAssignments`, also used by `getPrintableRoster`)
- `tasks.service.ts` — `assignedTo`, `createdBy`, **and `completedBy`** (found while reading the file — same root cause, not in the original report) via the shared `populateTask()` helper (4 call sites) plus `update()`'s separate populate chain
- `rooms.service.ts` — `assignedHousekeeper` (`findAll`, `findOne`, `update`) — reachable by `portal_user` per the existing `Role.PORTAL_USER` grant on `GET /rooms`
- `booking.service.ts` — `assignedHousekeeper` (`ensureCheckoutWorkflow`, found via the full-schema sweep below) **and** `createdBy`, both as a direct populate (8 call sites) and nested inside the shared `reservationPopulate` config object (which alone covers 7 more call sites: `create`, `getChartData`, `update`, `updateStatus`, `findAll`, `findOne`, `remove`)

### Fixed defensively (not currently exploitable — already redacted before reaching the response)
`reservations.service.ts`'s 5 `createdBy`/`confirmedBy` populates and the corresponding ones in `booking.service.ts` all route through `mapReservationEntityToFrontend`/`mapBookingEntityToFrontend`, whose `readUserName()` helper already reduces the populated object to a plain name string before serialization — so the password was never actually reaching these two endpoints' JSON. Fixed anyway: the unprojected populate still pulls the hash out of MongoDB into Node memory needlessly, and the safety depended entirely on every future code path continuing to go through the mapper.

### Full-schema sweep (confirmed nothing else needed fixing)
Grepped every schema for `ref: 'User'` to get the complete set of fields, then checked each: `client-group.schema.ts`'s `createdBy` and `group.schema.ts`'s `createdBy` (a separate, distinct "Group Master / sibling bookings" module at `/api/v1/groups`, not the corporate `client-groups` module) are both stored but **never populated anywhere** in their services — returned as raw ObjectId strings, not a leak. `booking.schema.ts`'s `canceledBy` — same, set but never populated. `helper.service.ts`'s generic `paginationResponse()` already accepts a `select` per populate entry by design, and has zero callers anyway.

### Verified
Live, post-fix: `GET /tasks`, `GET /rooms`, `GET /accounting` all return 200 with zero occurrences of `password`/`refreshToken`/`resetPassword` anywhere in the full response body (checked 8–24KB of JSON per endpoint, not just a snippet). A task's populated `assignedTo` now returns exactly `{_id, fullName, username}` — confirmed the projection is exact, not just "smaller." Tasks page still renders "Manager Ahsan" in the Assigned To column with no frontend changes needed. Backend recompiled with 0 TypeScript errors after all edits.

---

## Client (portal_user) Reservations Access Fix + DevTools Lockout — 2026-06-27

### Problem reported
Client (portal_user) couldn't create/manage reservations; reported as "clicking Reservations redirects to Dashboard." Separately asked to disable right-click/DevTools shortcuts for the Client role only.

### Investigation
Routing (`navigation.js` → `/portal/reservations`, `App.jsx` route, `ProtectedRoute.jsx`'s `ADMIN_PATHS`) was already correct — reproducing with a fresh disposable `portal_user` test account, the sidebar click landed on `/portal/reservations` with no redirect. The real defect, found via `preview_network`: `GET /clients` and `GET /companies` returned **403** for `portal_user`. `PortalReservationsPage.jsx` depends on both (`useClientsQuery`/`useCompaniesQuery`) to feed `ReservationFormDrawer`, which resolves the hidden billing `client` field from the selected group member by matching against the `clients` list (`handleMemberSelect` in `ReservationFormDrawer.jsx`) — with that list always empty, the match always failed silently, so reservation creation was effectively broken even though the page itself rendered without any visible redirect.

### Fix — Backend (`Rms Booking Backend`)
- `src/modules/clients/clients.controller.ts` — added `Role.PORTAL_USER` to `GET /clients` (`findAll`). No service change needed: `ClientsService.buildAccessibleQuery()` already scopes any non-admin caller to `clientNo === requestUser.clientNumber` (+ children via `parentClientNumber`), so a portal user only ever receives their own client record — verified live (CL-998 logged in → only CL-998 and its child CL-1928 returned, no cross-tenant leak).
- `src/modules/companies/companies.controller.ts` — added `Role.PORTAL_USER` to `GET /companies` (`findAll`). `Company` has no tenant-ownership field at all (it's a flat lookup, same unscoped list USER/HOUSEKEEPER already receive), so this mirrors existing precedent rather than introducing new exposure.

### Security fix found during verification (same file)
Inspecting the live `GET /clients` response, the populated `createdBy` field returned the **full `User` document — including the bcrypt password hash and `refreshToken`** (`user.schema.ts`'s `password`/`refreshToken` fields lack `select: false`, unlike `two_factor_secret`). This pre-existed for every role already permitted on this endpoint, but extending it to the external-facing `portal_user` role raised the severity enough to fix inline:
- `src/modules/clients/clients.service.ts` — `findAll()`/`findOne()` now call `.populate('createdBy', CREATED_BY_SAFE_FIELDS)` with an explicit allowlist (`username fullName email role clientNumber linkedClientNo`) instead of populating the whole document.
- The same unprotected-populate pattern exists in `accounting`, `asset-maintenance`, `housekeeping`, `tasks`, `reservations`, and `booking` services (`.populate('createdBy'|'assignedTo')` with no projection) — flagged as a separate follow-up task, not fixed here (out of scope for this change).

### Fix — Frontend (DevTools/right-click lockout)
- New `src/hooks/useDisableDevTools.js` — reusable hook; when `enabled`, attaches `contextmenu` (blocks right-click) and `keydown` (blocks F12, Ctrl+Shift+I/J/C, Ctrl+U) listeners on `document`, cleaned up on unmount/disable.
- `src/components/layout/AppShell.jsx` — calls `useDisableDevTools(role === 'portal_user')`. `AppShell` is the shared layout for every authenticated route (admin and portal alike), so this is the single place to gate the behavior by role without duplicating it per-page.
- Caveat (by design, not a gap to fix): this is a client-side UX deterrent, not a real security boundary — DevTools remains reachable via the browser's own menu. Communicated as such; no attempt was made at devtools-open detection (unreliable, easily defeated, not appropriate to ship).

### Verified
Created a disposable `portal_user` test account (`CL-998`/`qa_portal_test`, deleted after) since the real reported account's password was unknown and not to be reset without asking. Confirmed via `preview_network`: `/clients` and `/companies` now return 200 (previously 403) and the response no longer contains `password`/`refreshToken`; reservation list and "New Reservation" drawer render correctly. Confirmed via synthetic `contextmenu`/`keydown` dispatch + `defaultPrevented`: blocked for the portal_user session, **not** blocked for admin afterward (re-logged in as admin) — confirmed Reservations page, filters, and table still fully functional for admin (no regression).

**Not done — flagged, not assumed:** the broader role spec provided alongside this request (Manager's 5-day invoice-edit window + edit-request-to-admin workflow, a full Dashboard/Reservation/Group-Management permission audit against the spec) was treated as background context for *why* the two reported bugs mattered, not as additional work — those are sizable, separate efforts and weren't reproduced as broken, so they were left for the user to explicitly scope.

### Follow-up: "Portal User" → "Client" display label
User confirmed this one piece of the broader spec as in-scope (display label only — the underlying `portal_user` role value, route prefixes, and variable names are all unchanged).

- New `src/constants/roleLabels.js` — single source of truth: `ROLE_LABELS` (`portal_user` → `'Client'`, others unchanged), `ROLE_COLORS`, `ROLE_OPTIONS` (for the role `<Select>`), and `getRoleLabel(role)` helper.
- `src/pages/UsersPage.jsx` — removed its local `ROLE_OPTIONS`/`ROLE_COLORS` (duplicated the same data) in favor of the shared module; Role column now renders `getRoleLabel(role).toUpperCase()` instead of `role.replace('_',' ').toUpperCase()`.
- `src/components/account/MyAccountCard.jsx` — same: removed local `ROLE_COLORS`, now imports from `roleLabels.js`. (Used by both `/account` (user/housekeeper) and the portal user's own "My Account" page.)
- `src/components/layout/AppHeader.jsx` — the top-right role text (previously rendered the raw `user.role` string verbatim — this is the exact spot in the user's screenshot showing literal `portal_user`) now renders `getRoleLabel(user.role)`.
- Note: `src/constants/roles.js` is a *different*, pre-existing, unrelated permissions-style module (`ROLES`/`ROLE_PERMISSIONS`/`roleHasPermission`) — confirmed it has zero live importers (only the already-dead `AntdSidebar.jsx`/`AntdTopBar.jsx`/`pages/Users/UserForm.jsx`), so the new `roleLabels.js` was named distinctly rather than extending dead code.

**Verified:** admin's own header label changed from lowercase `admin` to `Admin` (same `getRoleLabel` lookup, confirms the function works); the real `Ahsan Client` (CL-6767) row's Role tag now reads `CLIENT` instead of `PORTAL USER`; the New/Edit User role dropdown now lists `User / Housekeeper / Manager / Client`.

---

## Invoice Generator: Field Relabeling, Meal Only Rate Type, Content Fixes — 2026-06-22

### Header Field Renames (display labels only — underlying state field names unchanged for backward compatibility)
- Arrive Date → **Start Date** (`invoice.arriveDate`)
- Departure Date → **End Date** (`invoice.departDate`)
- Cashier Name → **Invoice Generated By** (`invoice.cashierName`)
- Account No → **Rate** (`invoice.accountNo`)
- Reservation No → **Duration** (`invoice.reservationNo`)

Applied consistently in both `InvoiceGeneratorPage.jsx` (form `FieldLabel`) and `InvoiceGeneratorPDF.jsx` (`InfoRow` label) so the form and generated PDF always match. `InvoiceGeneratorPDF.jsx`'s `infoLabel` style width bumped 82pt → 98pt to fit "Invoice Generated By" without excessive wrapping.

### New Rate Type: Meal Only
- `useInvoiceGenerator.js` — line items gained a `mealOnly` boolean. `RATE_TYPE_FIELDS = ['withMeals', 'mealOnly', 'roomOnly']` are now 3-way mutually exclusive (checking one unchecks the other two), replacing the previous 2-way withMeals/roomOnly exclusivity.
- `InvoiceLineItemsTable.jsx` — new "Meal Only" checkbox column inserted between "With Meals" and "Room Only"; table `scroll.x` widened 860 → 948 to fit it.
- `InvoiceGeneratorPDF.jsx` — `rateType` now branches three ways: `withMeals` → "HM Occupied Rate Including Meals", `mealOnly` → "Meal Only Rate", else → "Room Only Rate".

### Nights Calculation Fix
- `InvoiceGeneratorPDF.jsx` — per-line-item `nights` now adds `+ 1` to the from/to date diff so both boundary dates are counted toward the stay (e.g. 5 Jun–15 Jun now correctly renders "11 x HM Occupied Rate Including Meals." instead of the previous "10 x ...").

### Removed Content
- Removed the `"{nights} Bednights {fromDate} to {toDate}"` line from the line-item Detail column (redundant once nights count is correct).
- Removed "Reference No" from the Remittance block — it displayed `invoice.reservationNo`, which is now the "Duration" header field and no longer semantically a reference number.
- Removed the "Powered by rmcloud.com" footer block and its now-unused `poweredBy` style.

### Content/Data Fixes (`InvoiceGeneratorPDF.jsx` `COMPANY` constant + notes defaults)
- `COMPANY.phone`: `+61 447 675 067` → `+61 447 675 967`
- `COMPANY.bankAccountNo`: `306037269` → `305037269`
- Default notes text (set in `useInvoiceGenerator.js` `buildInitial()`) and the PDF's fallback notes string both changed to: *"Please Note: Payments are to be paid in full in advance. Payment must be received by the due date."*

### Verified
Live-tested end to end as admin (`CL-ADMIN`/`admin`): filled a sample line item (Room B05, 5 Jun–15 Jun 2026, $500), downloaded the generated PDF and confirmed all label renames, "11 x HM Occupied Rate Including Meals." (correct +1-day count), no Bednights line, no Powered-by footer, no Reference No, Account Number 305037269, Phone +61 447 675 967, and the new notes text. Re-tested with "Meal Only" checked instead of "With Meals" — confirmed 3-way exclusivity (auto-unchecked "With Meals") and "11 x Meal Only Rate." in the output.

**Unrelated, found but not touched:** the local backend dev process was running stale compiled code (every API route 404'd; its "Route not found" error text didn't match the current source's "Route not found!"). Restarted it (`npm run start:dev` in the backend directory) to unblock live verification — not a code change, just a stale dev process.

---

## 2FA Access for All Roles, Dead Reservation-Sidebar Tabs Removed, Client Shortcut — 2026-06-21

**2FA was unreachable for `user`/`housekeeper`:** `TwoFactorSetupSection` only ever rendered inside `UsersPage.jsx` (admin/manager editing their own account — that page is gated to admin/manager) or `PortalUsersPage.jsx` (portal_user). Plain `user`/`housekeeper` accounts had no nav entry to either, so no way to ever set up 2FA.

- New `src/components/account/MyAccountCard.jsx` — extracted from `PortalUsersPage.jsx`'s existing self-view + Change Password + 2FA UI, parameterized by `title`/`subtitle`/`extraItems` (array of `{label, value}` for portal's Linked Client / Client Account rows).
- `src/pages/portal/PortalUsersPage.jsx` — now a thin wrapper around `MyAccountCard`.
- New `src/pages/MyAccountPage.jsx` — thin wrapper around `MyAccountCard` (no extraItems), routed at `/account` (`App.jsx`).
- `src/constants/navigation.js` — new nav item `{ key: '/account', label: 'My Account', roles: ['user', 'housekeeper'] }`. Admin/manager don't get this (they already have 2FA via Users page).
- `src/components/layout/ProtectedRoute.jsx` — `/account` added to `ADMIN_PATHS` so portal_user is still redirected away from it like every other non-portal route.

**`ReservationsListPage.jsx`'s nested left sidebar had 7 dead tabs:** `sidebarItems` listed Reservation/Area/Client/Correspondence/Triggers/Requirement-Trace/Audit-Trail/Add-On/Transfers, but the component never branched on `selectedTab` for content — clicking any of them just highlighted the tab. Trimmed to Reservation + Client only; removed the now-unused icon imports.

**The remaining "Client" tab now does something:** clicking it opens the existing `ClientFormDrawer` (the same one `ClientsPage.jsx` uses, reused as-is) as an inline drawer, pre-filled with `allClients.find(c => c.clientNo === currentUser?.linkedClientNo)` — the logged-in user's own client record, editable, saved via the existing `useUpdateClient` hook (`src/hooks/useClients.js`). If no matching client exists (e.g. admin's `CL-ADMIN`), shows an info message instead of an empty drawer.

**Found but not yet removed:** 6 files with zero importers anywhere in the codebase (`src/components/UserDropdown.jsx`, `UserDetailsModal.jsx`, `AddUserProfileModal.jsx`, `AntdTopBar.jsx`, and the orphaned `src/pages/Clients/` folder — `ClientForm.jsx`/`ClientList.jsx`, never routed to). All contain hardcoded mock data, confirmed dead. Deletion was blocked by the permission system (irreversible file deletion the user hadn't named directly, even though it was in the approved plan) — left as-is pending explicit go-ahead.

**Verified:** created disposable manager/user/housekeeper test accounts (deleted after) — manager's Client-tab shortcut correctly opened and saved CL-998's record; user's and housekeeper's new "My Account" page rendered and the 2FA QR/secret generation flow completed successfully for both. Admin's Reservations sidebar trimmed correctly, Client-tab gracefully no-ops for admin's non-client account. Re-confirmed portal_user's existing restrictions untouched.

---

## Portal User Restrictions Fixed — 2026-06-21

**Problem:** A "portal user" account (client-facing, restricted role) had been created with role `user` instead of `portal_user`, because the admin "New/Edit User" role dropdown never offered `portal_user` as an option. The `user` role behaves close to admin/manager for most modules, so the account saw the full admin UI (Open Tasks, Task workload, Bookings timeline, etc.) instead of the already-built, already-restricted portal experience (`PortalDashboardPage`, `PortalReservationsPage`, `PortalClientsPage`, `PortalUsersPage`, `PortalGroupsPage` — all pre-existing and correctly scoped to `linkedClientNo`).

**Fixes:**
- `src/pages/UsersPage.jsx` — added `{ value: 'portal_user', label: 'Portal User' }` to `ROLE_OPTIONS` so admins can actually create/assign this role.
- `src/components/layout/ProtectedRoute.jsx` — added `'/charts'` to `ADMIN_PATHS` (the `/charts/bookingchart` alias route for `BookingChartPage` wasn't covered by any existing prefix; `/reservations/*` and `/bookings/*` already were, via `startsWith` prefix matching).
- `src/pages/BookingChart.jsx` / `src/components/BookingChart.jsx` / `src/components/BookingChartHeader.jsx` — `/bookings` (admin) and `/portal/bookings` share the same `BookingChartPage` → `CoreBookingChart` components. Added an `isPortalUser` prop (computed once via `useAuthStore` in `BookingChartPage`, threaded down) that: hides the Export button and Settings/gear icon; filters rooms with `category === 'Staff Accommodation'` out of the grid; removes the "Out Of Service"/"Out Of Order" context-menu items (keeps Add Reservation, Change Room Status Clean/Dirty/Inspect, Close Menu). Admin/manager/etc. behavior is unchanged.
- `src/components/reservations/ReservationFormDrawer.jsx` — added a `hideBillingFields` prop (default `false`) that hides Booking source/Voucher No/Total tariff/Balance. `src/pages/portal/PortalReservationsPage.jsx` passes `hideBillingFields` (hard-coded, since that page is portal-only); admin's `ReservationsPage.jsx` passes nothing.
- **Backend** `src/modules/booking/booking.controller.ts` — `GET /bookings`, `GET /bookings/chart`, `GET /bookings/:id`, `GET /bookings/:id/status` now also allow `Role.PORTAL_USER` (found while verifying the above: the Bookings/Timeline screen 403'd entirely for portal_user before this — discovered live, not part of the original ask, but required for the screen to work at all). The service layer already scopes any non-admin role to `requestUser.clientNumber` (`booking.service.ts`), so no service changes were needed. Write endpoints (create/update/delete on bookings) were deliberately left admin/manager/user-only — portal_user creates/edits via the separate `/reservations` flow instead.

**Verified:** logged in as a portal_user test account — sidebar shows only the 8 portal nav items, Dashboard/Reservations/Clients/Users/Groups all already matched the restricted spec with no changes needed, Bookings now loads and shows the trimmed Export/gear/context-menu/Staff-Accommodation behavior. Logged back in as admin and confirmed all of the above are unchanged for admin (Export, gear, Out Of Service/Out Of Order, Staff Accommodation, billing fields all still present).

---

## Reservation SmartSearch Now Includes Group Members — 2026-06-20

**Problem:** The "MMV SmartSearch" panel on `ReservationsListPage` (the desktop-style New/Edit Reservation screen, route `/reservations/list`) only searched `Client` records. Group members added via Group Management's "Add Member" never appeared there, so there was no way to pick a member as the reservation guest and have their linked client auto-fill.

**Solution:** `ReservationsListPage.jsx` now also calls `useSearchGroupMembers(smartSearch.term)` (existing hook, hits `GET /client-groups/members/search` — already role-scoped server-side: portal_user sees only their own client's members, admin/manager sees all). Member results are normalized into the same row shape as client results (`clientNo` ← `linkedClientNo`, `clientName` ← `name`, `company` ← `companyName`, `mobile` ← `phone`) and concatenated with the existing client-side-filtered client list into one `smartSearchResults` array, with each row tagged `_source: 'client' | 'member'`. A new "Type" column (Tag) shows which is which.

Double-clicking a member row calls the new `handleSelectMember(member)`: it looks up the client by `allClients.find(c => c.clientNo === member.linkedClientNo)` and reuses `handleSelectClient` to fill the company/client-level fields, then overrides the guest-identity fields (`smartSearch`, `given`/`surname` split from `member.name`, `email`, `mobile`, `groupname`) with the member's own data — mirroring the pattern already used in `ReservationFormDrawer`'s simpler "Search Group Member" field.

**Also fixed:** the Account panel (rightmost column) used `flex: 1` + `overflowY: 'auto'` with no `minWidth`. Per the flexbox spec, setting `overflow` to anything but `visible` resets a flex item's automatic minimum width to `0`, so under a narrow viewport the panel collapsed to a sliver (each field label wrapped one character per line) instead of the layout scrolling horizontally. Fix: `Sidebar`/`Client Panel`/`Reservation Panel` got `flexShrink: 0` (they're fixed-width and should never shrink), `Account Panel` got `minWidth: '380px'`, and the `Main Content Area` wrapper switched from `overflow: 'hidden'` to `overflowX: 'auto', overflowY: 'hidden'` so it scrolls horizontally instead of crushing a column when the window is too narrow.

**Note:** `ReservationEditPage.jsx` (route `/reservations/edit`) has the same panel-layout structure (Reservation Panel is the one at risk there, Account Panel is fixed-width) and likely has the same latent squish bug, but it wasn't touched here since it wasn't the screen reported.

---

## Group Members: Inline "Add Member" Replaces Staff Search — 2026-06-20

**Problem:** `MembersEditor` only let you pick from staff that already existed for the linked client (`useClientStaff` search-select). There was no way to add a brand-new member while editing a group, and admin/manager couldn't create `ClientStaff` records at all (the `POST /client-staff` endpoint was `PORTAL_USER`-only and unconditionally called `resolveLinkedClientNo`, which throws for admin/manager since they have no `linkedClientNo`).

**Solution:** `MembersEditor` now has an inline "Add Member" row (Full Name*, Job Title, Phone, Email) that creates a new `ClientStaff` record on click and immediately appends it to the group's member list. Multiple members can be added one at a time. Removing a member (the closable tag) only detaches it from this group's `memberIds` — it does not delete the underlying `ClientStaff` record.

Because new members are persisted as real `ClientStaff` documents (not embedded copies), they are immediately visible to `GET /client-groups/members/search` — used by `ReservationFormDrawer`'s "Search Group Member" autocomplete — without any extra wiring, since that endpoint queries `ClientStaff` directly by `linkedClientNo`/`isActive`, independent of group membership.

#### Backend Changes
- `src/modules/client-staff/dto/create-client-staff.dto.ts` — added optional `linkedClientNo?: string`
- `src/modules/client-staff/client-staff.controller.ts` — `POST /client-staff` now allows `Role.ADMIN`, `Role.MANAGER` in addition to `Role.PORTAL_USER`
- `src/modules/client-staff/client-staff.service.ts` — `create()` mirrors the admin/manager pattern already used in `client-groups.service.ts`: admin/manager must pass `dto.linkedClientNo` (`BadRequestException` if missing); portal_user still uses `resolveLinkedClientNo(requestUser)`

#### Frontend Changes
- `src/components/groups/MembersEditor.jsx` — removed the `Select` staff-search dropdown and `useClientStaff` query; added a 4-field inline form + `+` button using `useCreateClientStaff`. Disabled (with a hint) until a client is selected, same as before. Selected-members tag list/removal logic unchanged.
- `src/pages/GroupsManagementPage.jsx` / `src/pages/portal/PortalGroupsPage.jsx` — no changes needed; they only pass `members`/`onChange`/`linkedClientNo` props to `MembersEditor`.

**Note:** Each "Add Member" click always creates a new `ClientStaff` record — there is no longer a way to attach an *existing* staff member to a group from this UI. If the same person needs to be in multiple groups, they will currently get a separate `ClientStaff` record per group. Revisit if staff reuse across groups becomes a requirement.

---

## 2FA, Manager Access, Client Groups Fix & Portal Users — 2026-06-18

### Two-Factor Authentication (2FA)

#### Backend
- `speakeasy` + `qrcode` installed for TOTP generation and QR code rendering
- `src/schemas/user.schema.ts` — added `is_2fa_enabled: boolean` (default false) and `two_factor_secret: string` (select: false, encrypted at rest)
- `src/modules/user/user.service.ts` — added `enable2FA(id, secret)`, `disable2FA(id)`, `findByIdWithSecret(id)` (fetches secret with `+two_factor_secret`)
- `src/modules/auth/dto/verify-2fa.dto.ts` — new DTO: `{ token: string (len 6) }`
- `src/modules/auth/dto/setup-2fa.dto.ts` — new DTO: `{ secret: string, token: string (len 6) }`
- `src/modules/auth/auth.service.ts` — `login()` now checks `is_2fa_enabled`; if enabled: returns `{ requiresTwoFactor: true, pendingToken }` (short-lived 5m JWT) without setting cookies; added `verifyLogin2FA(pendingToken, totpToken)`, `generate2FASecret(userId)`, `verifyAndEnable2FA(userId, dto)`, `verifyAndDisable2FA(userId, totpToken)`; login user payload now includes `is_2fa_enabled`
- `src/modules/auth/auth.controller.ts` — `POST /auth/login` returns `{ requiresTwoFactor: true, pendingToken }` if 2FA needed (no cookies set); `POST /auth/2fa/verify-login` (@Public) exchanges pendingToken + TOTP → full session cookies; `POST /auth/2fa/setup` (authenticated) generates secret + QR; `POST /auth/2fa/verify-setup` enables 2FA; `POST /auth/2fa/disable` disables after verifying TOTP

#### Frontend
- `src/api/services/auth.js` — added `verify2FALogin(pendingToken, token)`, `setup2FA()`, `verifySetup2FA(secret, token)`, `disable2FA(token)`
- `src/store/authStore.js` — added `selectIs2FAEnabled` selector; `is_2fa_enabled` stored in `user` object from login response
- `src/pages/LoginPage.jsx` — after login, if `response.requiresTwoFactor` → navigate to `/2fa-verify` with `{ pendingToken, from }` state
- `src/pages/TwoFactorVerifyPage.jsx` — new standalone page; 6-digit input; calls `verify2FALogin`; redirects to dashboard on success; back-to-login link
- `src/components/auth/TwoFactorSetupSection.jsx` — reusable 2FA enable/disable card; shows QR code + base32 secret + verification input on enable; shows disable confirmation on disable; calls auth API directly
- `src/pages/UsersPage.jsx` — `TwoFactorSetupSection` rendered inside edit modal when editing own account (`editingUserId === currentUser.id`); `onStatusChange` updates auth store with `setLogin({ user: {..., is_2fa_enabled }, client, expiresIn })`
- `src/pages/portal/PortalUsersPage.jsx` — new page for portal users; shows own account (read-only fields), password change modal, and `TwoFactorSetupSection`
- `src/App.jsx` — added `/2fa-verify` route (outside ProtectedRoute); added `/portal/users`, `/portal/clients`, `/portal/bookings` routes

### Manager Access Fix
- `src/modules/user/user.service.ts` — added `ensureCannotTargetAdmin(requestUser, targetUser)`: throws ForbiddenException if MANAGER tries to update/delete an ADMIN user. Called in `update()` and `remove()`
- `src/constants/navigation.js` — added `manager` to `/users` nav item so managers see the Users page in the sidebar

### Client Groups Admin/Manager Fix
**Problem:** `resolveLinkedClientNo` threw ForbiddenException for admin/manager (no `linkedClientNo`), so admin could not use the Group Management page at all.

**Solution:**
- `src/modules/client-groups/dto/create-client-group.dto.ts` — added optional `linkedClientNo?: string` field
- `src/modules/client-groups/client-groups.service.ts` — `findAll`: admin/manager sees ALL groups; portal_user scoped to own. `create`: admin/manager must pass `dto.linkedClientNo`; portal_user uses `resolveLinkedClientNo`. `findOne`/`update`/`remove`: admin/manager bypass the client scope check
- `src/modules/client-staff/client-staff.service.ts` — `findAll(user, linkedClientNo?)`: admin/manager can filter by `linkedClientNo` param or see all staff; portal_user always scoped to own client
- `src/modules/client-staff/client-staff.controller.ts` — `GET /client-staff` now accepts optional `linkedClientNo` query param; added ADMIN, MANAGER to `@RoleDecorator`

### Frontend Group Management + Members
- `src/api/services/clientStaff.js` — `getClientStaff(linkedClientNo?)` passes `linkedClientNo` as query param when provided
- `src/hooks/useClientStaff.js` — `useClientStaff(linkedClientNo?)` passes arg to query fn; query key includes `linkedClientNo` for proper caching
- `src/components/groups/MembersEditor.jsx` — accepts `linkedClientNo` prop; passes it to `useClientStaff(linkedClientNo)` so admin sees only the selected client's staff; shows "Select a client first" hint when no client selected
- `src/pages/GroupsManagementPage.jsx` — added AutoComplete Client search field (searches by name or clientNo); on client select: sets `selectedLinkedClientNo`, auto-fills `companyName`, clears members; `linkedClientNo` sent in create/update payload; `MembersEditor` receives `selectedLinkedClientNo`
- `src/pages/portal/PortalGroupsPage.jsx` — added read-only Client field showing own `linkedClientNo`; passes `linkedClientNo` to `MembersEditor` so portal users see only their own staff

### Portal Navigation Expansion
- `src/constants/navigation.js` — portal_user sidebar now includes: Bookings (`/portal/bookings`), Clients (`/portal/clients`), Users (`/portal/users`)
- `src/pages/portal/PortalClientsPage.jsx` — new page; shows own client record (read-only) from auth store
- `src/pages/portal/PortalUsersPage.jsx` — new page; shows own user account (read-only except password); includes `TwoFactorSetupSection`
- `src/components/layout/ProtectedRoute.jsx` — added `/groups` to `ADMIN_PATHS` so portal_user is redirected to `/portal/groups`

---

## Refresh Token Strategy + Identity Refactor — 2026-06-12

### Refresh Token Strategy (Backend + Frontend)

**Design:** Short-lived access token (15m) + long-lived refresh token (7d / 30d keepLogged). Both are httpOnly cookies. The refresh token hash is stored in `User.refreshToken` (bcrypt). Token rotation on every refresh call.

#### New Backend Files
- `src/guards/refresh-jwt.guard.ts` — `RefreshJwtGuard extends AuthGuard('refresh-jwt')`
- `src/modules/auth/refresh-jwt.strategy.ts` — reads from `refresh_token` cookie, validates with `JWT_REFRESH_SECRET`, populates `req.user = { userId, username, refreshToken }`

#### Updated Backend Files
- `src/guards/index.ts` — exports `RefreshJwtGuard`
- `src/constants/jwt.constants.ts` — `expiresIn`/`refreshTokenExpiresIn`/`socialAccessTokenExpiresIn` marked `as const` (required for `JwtSignOptions` type compatibility)
- `src/modules/user/user.service.ts` — added `setHashedRefreshToken(id, token)`, `getUserIfRefreshTokenMatches(id, token): UserDocument | null`, `clearRefreshToken(id)`
- `src/modules/auth/auth.service.ts` — `login()` now calls `generateTokens()` (private helper) which issues both tokens; adds `refreshTokens(userId, token)` for rotation; adds `logout(userId)` for DB cleanup; adds `decodeRefreshToken(token)` (no-verify decode for logout cleanup)
- `src/modules/auth/auth.controller.ts` — `login` sets two cookies (`jwt` 15m, `refresh_token` 7d/30d); `POST /auth/refresh` endpoint `@Public()` + `@UseGuards(RefreshJwtGuard)` rotates tokens; `POST /auth/logout` is `@Public()` — clears both cookies + best-effort DB cleanup via decoded refresh token
- `src/modules/auth/auth.module.ts` — added `RefreshJwtStrategy` to providers; JwtModule default expiry changed to `'15m'`

#### Cookie Layout
| Cookie | Path | MaxAge | Flags |
|--------|------|--------|-------|
| `jwt` | / | 15m | httpOnly, Secure(prod), SameSite=Lax(dev)/None(prod) |
| `refresh_token` | / | 7d (30d if keepLogged) | same |

#### Frontend Token Refresh Interceptor (`src/api/http.js`)
- On any 401 (except `/auth/*` endpoints): queues concurrent requests, calls `POST /auth/refresh`, retries all queued requests on success
- On refresh failure: clears auth store and rejects — user redirected to login
- Thundering herd protection: `isRefreshing` flag + `failedRequestQueue` array

#### Frontend `src/api/client.js`
- Was a duplicate Axios instance with stale console.log error handlers
- Now re-exports the shared `http` instance — all requests (both `http` and `apiClient` consumers) go through the single instance with the refresh interceptor

---

### ClientGroup → ClientStaff Reference Refactor

**Problem:** `ClientGroupMember` was an embedded sub-document with {name, phone, email}. This duplicated data that already exists in `ClientStaff`. Editing a staff member's details would not update existing group memberships.

**Solution:** `ClientGroup.members` is now `[ObjectId → ClientStaff]`. Groups hold references, not copies.

#### Backend Changes
- `src/schemas/client-group.schema.ts` — removed `ClientGroupMember` sub-schema; `members` is now `[{ type: ObjectId, ref: 'ClientStaff' }]`
- `src/modules/client-groups/dto/create-client-group.dto.ts` — `members: CreateClientGroupMemberDto[]` replaced with `memberIds: string[]` (each validated as `@IsMongoId`)
- `src/modules/client-groups/client-groups.module.ts` — added `ClientStaff` model registration (same schema can be registered in multiple modules)
- `src/modules/client-groups/client-groups.service.ts` — injected `ClientStaff` model; `findAll`/`findOne`/`create`/`update` all `.populate('members')`; `create`/`update` validate that memberIds belong to the same `linkedClientNo`; `searchMembers` now searches `ClientStaff` directly and enriches results with group context (first matching group per staff member)

#### Frontend Changes
- `src/components/groups/MembersEditor.jsx` — replaced manual name/phone/email grid with staff search-and-select using `useClientStaff()` hook (cached). Shows selected members as closable tags.
- `src/pages/portal/PortalGroupsPage.jsx` — `openEdit` sets members to populated staff objects; `handleSubmit` sends `memberIds`; expanded row uses `fullName` and `jobTitle` columns
- `src/pages/GroupsManagementPage.jsx` — same changes as PortalGroupsPage

#### Search Result Compatibility (`GET /client-groups/members/search`)
The response shape for `ReservationFormDrawer`'s member search is unchanged:
`{ name, phone, email, groupName, companyName, linkedClientNo }` — `staffId` replaces the unused `memberId` field.

---

## Security Hardening (OWASP Top 10) — 2026-06-12

### Authentication
- JWT is now stored in an **httpOnly cookie** (not localStorage). Backend sets `Set-Cookie: jwt=...; HttpOnly; SameSite=Lax` on login; frontend never touches the token.
- Cookie is `SameSite=Lax` in development, `SameSite=None; Secure` in production.
- `keepLogged` sets maxAge to 7d vs 1d on the cookie (same as before, but now in a secure cookie).
- `POST /auth/logout` endpoint added — clears the `jwt` cookie server-side.
- AppHeader calls `POST /auth/logout` before clearing client-side state.

### Frontend
- `src/store/authStore.js` — `token` field removed from state and persisted storage. `isAuthenticated` now derived from `Boolean(payload.user)` instead of token presence.
- `src/api/http.js` — `withCredentials: true` added; Authorization header interceptor removed (cookie is automatic).
- `src/api/services/auth.js` — `logout()` function added.
- `src/pages/LoginPage.jsx` — `localStorage.setItem('authToken', ...)` removed.

### Backend
- **CORS** — `origin: '*'` replaced with `FRONT_END_CORS_URL` env var via `buildCorsConfig()`. (`src/helpers/cors.config.ts` changed to export a function.)
- **`@Public()` decorator** — `src/decorators/public.decorator.ts` (new). Applied to all auth endpoints.
- **`RoleGuard`** — Default changed from `return true` to throw `ForbiddenException`. Routes with no `@Role()` and no `@Public()` are denied.
- **Rate limiting** — `@nestjs/throttler` added. Login: 10 req/60s. ForgotPassword: 5 req/3600s. (`AuthModule` registers `ThrottlerModule.forRoot()`).
- **`helmet()`** — Added globally in `main.ts` for security headers (CSP, X-Frame-Options, HSTS, etc.).
- **Cookie parser** — `cookie-parser` middleware added in `main.ts`. `JwtStrategy` extracts JWT from `req.cookies.jwt` first, then falls back to `Authorization: Bearer`.
- **Swagger** — Disabled in `NODE_ENV=production`.
- **`forgotPassword()`** — No longer throws `NotFoundException` for unknown emails. Always returns the same generic message (prevents email enumeration).
- **Password validation** — `MinLength(8)` + `@Matches()` complexity regex on `CreateUserDto` and `ResetPasswordDto`.
- **Error logging** — `GlobalExceptionFilter` now uses `Logger.error()` instead of `console.log()` and logs only error name + message (no stack traces).
- **`forbidNonWhitelisted: true`** added to global `ValidationPipe`.

---

## Portal User (portal_user) Role Permissions (2026-06-11)

### Access Control Summary
Portal users are blocked from all admin paths via `ProtectedRoute.jsx` (`ADMIN_PATHS` list). They only see portal-prefixed routes in the sidebar.

### What portal_user CAN do
- **Dashboard** (`/portal/dashboard`): view active reservations, upcoming check-ins/outs (7 days), available room inventory count
- **Reservations** (`/portal/reservations`): create/view/edit/cancel their own company's reservations. Reservations created by portal users are auto-set to `Confirmed` status — no admin approval needed
- **Group Management** (`/portal/groups`): create groups, add/edit/deactivate members with name, phone, email
- **Staff Management** (`/portal/staff`): manage traveller profiles (passport, nationality, job title, notes)
- **Room Availability** (`/portal/rooms`): view room names, types, capacity, features — no booking or housekeeping data shown
- **Booking Requests** (`/portal/booking-requests`): submit booking requests

### What portal_user CANNOT do
- Access /tasks, /accounting, /vouchers, /invoice-generator, /users, /bookings, /housekeeping, /booking-requests (admin), /clients, /rooms (admin), /dashboard (admin)
- See other companies' reservations (scoped by `billingClientNumber = linkedClientNo` in backend)
- See housekeeping or maintenance data
- Modify or cancel other clients' reservations (enforced by `ensureReservationScope` in service)

### Backend changes made
- `reservations.controller.ts`: added `Role.PORTAL_USER` to PUT, PATCH, DELETE, GET/:id endpoints
- `reservations.service.ts` `create()`: auto-sets status to `'Confirmed'` when creator is `portal_user`
- `rooms.controller.ts`: added `Role.PORTAL_USER` to GET and GET/:id endpoints
- `dashboard.service.ts` + `dashboard.module.ts`: added Room model injection, returns `totalRooms` and `availableRooms` in `getPortalStats`

### Frontend changes made
- `PortalDashboardPage.jsx`: 4-column row — added "Available Rooms" stat card
- `PortalReservationsPage.jsx`: added Cancel action (Popconfirm → PATCH status=Canceled), Edit button disabled for cancelled reservations
- `PortalRoomAvailabilityPage.jsx`: new page — card grid showing room name, type, capacity, area, features. Search by name/type/area
- `navigation.js`: added `/portal/rooms` "Room Availability" nav item for portal_user
- `App.jsx`: registered `/portal/rooms` route

---

## Invoice Generator (2026-06-07)

### Overview
Standalone Tax Invoice (AUD) generator for super admin (role === 'admin') only. No backend persistence — the admin fills in the form and downloads/prints the PDF.

### Access Control
- Route: `/invoice-generator`
- Navigation: `FileTextOutlined` icon, `roles: ['admin']` only
- `ProtectedRoute.jsx`: `/invoice-generator` added to `ADMIN_PATHS` so portal_user is blocked
- `InvoiceGeneratorPage.jsx`: secondary guard with `<Navigate to="/dashboard" />` if role !== 'admin'

### Files
- `src/hooks/useInvoiceGenerator.js` — state + mutations for the invoice form (setField, addLineItem, removeLineItem, updateLineItem, resetInvoice, totals)
  - Auto-updates dueDate (+14 days) when invoiceDate changes
  - Auto-calculates net/gst/total via useMemo
  - With Meals / Room Only checkboxes are mutually exclusive
- `src/components/invoice/InvoiceGeneratorPDF.jsx` — react-pdf Document matching the reference screenshot
  - Company header (top-right): Mount Morgan Space Solutions, address, ABN, phone, email, website
  - Left: "Tax Invoice (AUD)", Invoice No, Billed To
  - Right info box: Client, Date, Adults, Arrive/Depart Date, Voucher No, Account No, Reservation No, Cashier, Due Date
  - Table: Date | Detail | GST | Amount (Inc. GST)
  - Detail column: room label line + nights × rate type + Bednights range
  - Totals: NET, GST (10%), Total, Balance
  - Notes section with fixed payment terms text
  - "Powered by rmcloud.com" dashed separator
  - Remittance section: Billed-to + bank details (BSB 064-034, Account 306037269)
- `src/components/invoice/InvoiceLineItemsTable.jsx` — editable Ant Design table for line items (Date, Room No, With Meals, Room Only, From/To Date, Total Price)
- `src/pages/InvoiceGeneratorPage.jsx` — main page with form, preview modal (PDFViewer), print and download

### Calculation Logic
- Each row: `totalPrice` is NET (excl. GST); GST column = totalPrice × 0.1; Amount (Inc. GST) = totalPrice × 1.1
- Totals footer: NET = sum of all totalPrice; GST = NET × 0.1; Total = NET × 1.1; Balance = Total

---

## Corporate Client Group Management Module (2026-06-07)

### Overview
Full-stack feature for corporate clients (portal_user) to organise their staff into named groups and use group members when creating reservations.

### Backend Changes

#### New: `ClientGroup` Schema (`src/schemas/client-group.schema.ts`)
- Embedded `ClientGroupMember` sub-document: name, phone, email
- `ClientGroup`: groupName, companyName, linkedClientNo, members[], createdBy
- Scoped by `linkedClientNo` (same pattern as ClientStaff)

#### New: `ClientGroupsModule` (`src/modules/client-groups/`)
- Full CRUD: POST /client-groups, GET /client-groups, GET /client-groups/:id, PUT /client-groups/:id, DELETE /client-groups/:id
- Member search: GET /client-groups/members/search?q=john&clientNo=optional
  - For portal_user: auto-scoped to their linkedClientNo
  - For admin/manager: scope by clientNo param or search all
- Roles: PORTAL_USER, ADMIN, MANAGER

#### Updated: Reservation Schema + DTO
- Added `guestPhone: string` and `guestEmail: string` to reservation schema and DTO
- `mapReservationEntityToFrontend` now returns `guestName`, `guestPhone`, `guestEmail`

#### Updated: Reservations Controller
- POST /reservations now allows `PORTAL_USER` in addition to ADMIN, MANAGER, USER

### Frontend Changes

#### Route Protection (`src/components/layout/ProtectedRoute.jsx`)
- portal_user is blocked from all admin paths (dashboard, reservations, bookings, etc.) and redirected to /portal/dashboard
- admin/manager/housekeeper is blocked from /portal/* paths and redirected to /dashboard
- Invoice is admin-only by default since InvoiceModal is only in admin pages

#### New: Group Management Page (`src/pages/portal/PortalGroupsPage.jsx`)
- Groups table with expand rows showing members
- Create/Edit group modal with inline MembersEditor (name, phone, email per member)
- Delete group with confirmation
- Uses useClientGroups, useCreateClientGroup, useUpdateClientGroup, useDeleteClientGroup

#### New: API + Hooks
- `src/api/services/clientGroups.js` — CRUD + searchMembers
- `src/hooks/useClientGroups.js` — useClientGroups, useCreateClientGroup, useUpdateClientGroup, useDeleteClientGroup, useSearchGroupMembers
- queryKeys.clientGroups added

#### Navigation (`src/constants/navigation.js`)
- Added `/portal/groups` — "Group Management" for portal_user (ApartmentOutlined icon)
- Added `/groups` — "Group Management" for admin/manager (ApartmentOutlined icon)

#### Admin Group Management Page (`src/pages/GroupsManagementPage.jsx`)
- Same CRUD + member management as PortalGroupsPage
- Admin sees ALL groups across all companies (backend handles scoping per role)
- Company name filter input for client-side search/filter
- Route: `/groups` (registered in App.jsx, guarded for admin/manager via navigation roles)

#### Shared Component (`src/components/groups/MembersEditor.jsx`)
- Extracted from PortalGroupsPage — reused by both PortalGroupsPage and GroupsManagementPage
- Props: `members[]`, `onChange(members[])` — each member: `{ name, phone, email }`

#### Portal Reservations Page (`src/pages/portal/PortalReservationsPage.jsx`)
- "New Reservation" button opens ReservationFormDrawer
- Group Name column, group name filter, text search covers guestName/resNo/clientName
- Cancel action (Popconfirm → PATCH status=Canceled), Edit disabled for cancelled reservations

#### ReservationFormDrawer (`src/components/reservations/ReservationFormDrawer.jsx`)
- Group member search (AutoComplete) is **always visible** — `enableMemberSearch` prop removed
- No visible client dropdown — client is resolved automatically from the selected member
- Hidden `Form.Item name="client" noStyle` holds the resolved Mongo ObjectId for billing
- `handleMemberSelect`: auto-fills guestName, guestPhone, guestEmail, groupName; resolves `client` by matching `member.linkedClientNo` against `clients` prop; resolves `company` by name match
- Props: `rooms`, `clients` (normalized array with `clientNo` + `_id`), `companies`, `initialValues`, `onSubmit`, `loading`
- `clients` prop must be a normalized flat array (not raw API response) — callers use `useMemo` to normalize

#### ReservationTable (`src/components/reservations/ReservationTable.jsx`)
- Added "Group" column (maps to `groupName`)

#### ReservationFilters (`src/components/reservations/ReservationFilters.jsx`)
- Added "Company Name" filter input
- Added "Group Name" filter input

#### ReservationsPage (`src/pages/ReservationsPage.jsx`)
- Added companyName, groupName to filters state
- Client-side filtering by company name, group name, and guest name

---

## Same-Day Turnover Fix (2026-06-11)

### Root cause
`checkAvailability` in `booking.service.ts` had a 3-hour turnover buffer:
```typescript
const turnoverBufferMs = 3 * 60 * 60 * 1000;
endDate: { $gt: new Date(start.getTime() - turnoverBufferMs) }
```
When a guest checks out June 16 (midnight) and a new guest checks in June 16 (same midnight timestamp), the buffer made `existingEndDate > newStart - 3h` evaluate to `true`, blocking the creation even though the dates share an exact boundary (not an overlap).

### Fix
Removed the buffer; now uses strict `$gt` on the exact start timestamp:
```typescript
endDate: { $gt: start }
```
Same-day boundary (`existingEnd == newStart`) correctly evaluates to `false` (no conflict). Genuine overlaps where `existingEnd > newStart` remain blocked.

### Visual (BookingChart.jsx)
The `getGridPosition` formula was already correct — no visual change needed:
- `startSubCol = startOffset * 2 + 2` → bar starts at PM sub-column of check-in day
- `endSubCol = endOffset * 2 + 2` → bar ends at the line AFTER AM sub-col of checkout day (PM not included)
- Checkout day shows left-half (AM) coloured, right-half (PM) free for a same-day arrival

---

## Bug Fixes (2026-06-03)

### Booking Chart Filter Fix
- `BookingChartHeader.jsx` — text filter inputs (Surname, Area) now use local component state so typing is immediately reflected. The parent `onFiltersChange` is called directly (no debounce) since filtering is client-side.
- `BookingChart.jsx` — area filter is now row-level (hides the entire room row when it doesn't match) instead of filtering bookings within the already-matched row. Removed the redundant in-row area filter.

### Date Display Consistency Fix
- `utils/format.js` — `formatDate` now passes `timeZone: 'UTC'` to `Intl.DateTimeFormat`. This ensures a UTC date-only string (e.g., `"2026-06-08"`) always displays as the same date regardless of the browser's local timezone.

### Reservation Table Column Fix
- `ReservationTable.jsx` — field accessors updated to match `mapReservationEntityToFrontend` output:
  - Guest: `dataIndex: 'clientName'` (was `guestName` which doesn't exist in the mapped response)
  - Room: `record.roomId` (was `record.room?.name` — no nested room object returned)
  - Client: `record.billingClientNumber` (was `record.client?.clientName` — no nested client object)
  - `rowKey` updated to `record.id || record._id` (mapper returns `id`, not `_id`)
- `ReservationsPage.jsx` — text search now uses `clientName` (was `guestName`). Clients data normalized via `useMemo` to handle both array and `{ data: [] }` API shapes.

### User Creation Fix
- `UsersPage.jsx` — `clientNumber` had no `<Form.Item>`, so Ant Design never included it in `onFinish(values)`, causing the backend DTO's `@IsString()` to fail with "clientNumber must be a string".
- Fix: `handleSubmit` now derives `clientNumber` based on role:
  - `portal_user` + has `linkedClientNo` → `clientNumber = linkedClientNo` (portal user logs in under their company's client number)
  - All other roles → `clientNumber = currentUser.clientNumber || 'CL-ADMIN'` (internal staff stay under admin client)
- `linkedClientNo` is now **required** for `portal_user` role (dynamic `rules` with `dependencies: ['role']`)
- Role `<Select>` calls `form.validateFields(['linkedClientNo'])` on change to trigger re-validation immediately

### User Login Credentials UX Fix (2026-06-10)
Root cause: The login form has a required "MMV Client No" field, but newly created users were never told what client number to enter. Internal staff are stored under `CL-ADMIN`; portal users under their `linkedClientNo`. Without knowing this, users couldn't log in.

Changes to `UsersPage.jsx`:
- **Table column "Login Client No"** — shows `record.clientNumber` for every user with a tooltip explaining it maps to "MMV Client No" at login. Orange tag for CL-ADMIN (internal staff), blue for portal users
- **Live form hint** — `Form.Item shouldUpdate` block between Role and Client Linking sections shows the computed login client number as the admin fills in the form
- **Post-creation credentials modal** — `Modal.info` shown after successful user creation with copyable MMV Client No and username so the admin always has the info to pass on to the new user

### Invoice Logo Fix
- `InvoiceGeneratorPDF.jsx` — replaced the `LOGO` placeholder box with `<Image src={logoSrc} />` using `@react-pdf/renderer`'s `Image` component
- Logo imported from `src/assets/logo.png`; styled at `90×90pt` with `objectFit: 'contain'`

---

## Reservation Status & Cancellation Flow (2026-06-02)

### Status Value Convention
- Backend `normalizeStatusLabel` always returns 'Canceled' (single L)
- `STATUS_OPTIONS` in `src/data/options.js` uses 'Canceled' (single L) to match backend exactly
- `ReservationFormDrawer` normalizes incoming status via `normalizeStatusForForm()` to handle any variant ('Cancelled', 'canceled', etc.) before pre-filling the dropdown
- `StatusTag` handles both 'Canceled' and 'Cancelled' as aliases

### Cancellation Flow
- User selects 'Canceled' in ReservationFormDrawer → saves → backend `syncBookingFromReservation` sets `isParked: true` on the booking
- Chart query excludes `isParked: true` bookings → room clears from chart automatically
- `ReservationsPage.onSuccess` invalidates both `reservations` and `bookings`/`booking-chart` queries so the chart re-fetches immediately
- Reservation record remains visible in the Reservations table with a red "Canceled" tag

---

## Booking Chart Options Modal (2026-06-02)

### Architecture
- `src/hooks/useChartOptions.js` — single source of truth for chart settings (localStorage + React state)
- `BookingChartPage.jsx` — owns options state via `useChartOptions`, passes `chartOptions`, `onChartOptionsSave`, `onChartOptionsRestore` down to header
- `BookingChartOptionsModal.jsx` — fully controlled component: receives `settings`, `onSave`, `onRestore` props; sidebar tabs (Options / Room Type Defaults / Data Window) are interactive; local draft state synced from parent on open
- `CoreBookingChart` — receives `rowHeight` (derived from `options.areaHeight`) and `chartOptions` props

### Settings that actively affect the chart
- `dayView` → controls visible days on the chart (synced via `visibleDays = parseInt(options.dayView)`)
- `areaHeight` → controls row height: Small=30px, Medium=42px, Large=54px

---

## Out Of Service / Out Of Order Feature (updated 2026-06-07)

### Architecture: Multiple Independent Entries Per Room

Each room now stores an embedded array `serviceEntries[]` rather than flat boolean/date fields. This allows any number of independent OOS/OOO periods on the same room without overwriting existing ones.

#### Backend Schema (`src/schemas/room.schema.ts`)
```typescript
@Schema({ _id: true })
class RoomServiceEntry {
  type: string;         // 'out_of_service' | 'out_of_order'
  description: string;
  startDate: Date;
  endDate: Date;
}

class Room {
  serviceEntries: RoomServiceEntry[];  // replaces flat outOfOrder/outOfService/serviceStartDate/serviceEndDate
}
```
Flat fields (`outOfOrder`, `outOfService`, `serviceDescription`, `serviceStartDate`, `serviceEndDate`) and `outOfOrder` in `CreateRoomDto` have been removed.

#### Backend Service (`rooms.service.ts`)
- `updateServiceStatus(id, dto)` — uses `$push: { serviceEntries: entry }` to append; `serviceEntries: []` when clearing all
- `removeServiceEntry(roomId, entryId)` — uses `$pull: { serviceEntries: { _id: entryId } }` for targeted removal

#### Backend Controller (`rooms.controller.ts`)
- `PATCH /rooms/:id/service-status` — adds a new entry
- `DELETE /rooms/:id/service-entries/:entryId` — removes one specific entry (ADMIN, MANAGER)

### Frontend: How It Works
1. Right-click on a room row (name or date cell) → context menu: "Out Of Service" / "Out Of Order"
2. Modal: Description, From Date, To Date → confirms → `PATCH /rooms/:id/service-status`
3. Each entry renders its own colored bar on the chart spanning the date range
4. Right-click directly on a service bar → context menu shows "Remove this entry" → `DELETE /rooms/:id/service-entries/:entryId`

### Key Files
- `src/components/BookingChart.jsx` — service block bars map over `serviceEntries[]`, context menu has ternary: `serviceEntry ? remove-entry-menu : booking ? booking-menu : room-menu`
- `src/api/services/rooms.js` — added `removeRoomServiceEntry(roomId, entryId)`
- `src/hooks/useRooms.js` — added `useRemoveRoomServiceEntry` mutation
- `src/components/rooms/RoomsTable.jsx` — Service column counts entries per type
- `src/pages/RoomsPage.jsx` — serviceStatus filter checks `serviceEntries[]`
- `src/pages/CleanScreen.jsx` — Out of Order check uses `serviceEntries[]`
- `src/components/rooms/RoomFormDrawer.jsx` — OOS/OOO fields removed; managed exclusively via chart context menu
- Backend: `src/schemas/room.schema.ts`, `rooms.service.ts`, `rooms.controller.ts`, `dto/create-room.dto.ts`

### Booking Colors on Chart
STATUS_COLORS in BookingChart.jsx:
- 'Out of Service': '#003a8c' (dark blue)
- 'Out of Order': '#722ed1' (purple)
- 'Unconfirmed': '#faad14' (yellow — standalone/staff bookings)
- 'Confirmed': '#52c41a' (green)
- 'Arrived'/'Checked In': '#1890ff' (blue)

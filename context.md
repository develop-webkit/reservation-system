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

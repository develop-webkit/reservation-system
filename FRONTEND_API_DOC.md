# RMS Backend Frontend Flow Guide

This guide is written for the frontend developer so the UI can follow the production flow without guessing business rules.

## 1. What The System Does

The app is tenant-based.

- A normal client user sees only their own tenant data and child-client data.
- A housekeeper sees operational tasks and room-cleaning work.
- An admin sees everything.

The main connected parts are:

1. `Clients`
2. `Reservations`
3. `Bookings`
4. `Tasks`
5. `Housekeeping`
6. `Accounting`
7. `Vouchers`

## 2. Important Business Rules

### Booking and reservation rules

- Reservation numbers must be unique.
- A room cannot be double-booked.
- Booking overlap is blocked even when the request comes through the reservation API.
- Checkout to next check-in needs a turnover buffer.
- The hotel timing expectation is:
  - checkout around `11:00`
  - next check-in around `14:00`
- Booking status is normalized by the backend, so the UI should rely on the response labels, not raw input strings.

### Status labels returned by the API

Use the returned status text directly in the UI:

- `Confirmed`
- `Unconfirmed`
- `Checked In`
- `Checked Out`
- `Canceled`

### Balance and voucher rules

- Reservation payloads include `balance`.
- Booking payloads also mirror `balance` for the operational views.
- Admins and managers can update reservation balance using the reservation update endpoint.
- Voucher information is tracked separately as:
  - `voucherNo`
  - `voucherAmount`
  - accounting `voucherCode`
  - accounting `voucherAmount`

## 3. Reservation To Booking Flow

This is the main flow.

1. The UI creates a reservation with `POST /reservations`.
2. The backend validates client scope, room availability, and reservation number uniqueness.
3. The backend syncs the linked booking automatically.
4. The backend updates accounting for the reservation charge.
5. The backend sends notification emails.

When a reservation is updated:

1. The backend revalidates the room slot.
2. The linked booking is synced again.
3. Accounting is recalculated.
4. The returned booking/reservation payload stays aligned.

## 4. Checkout And Housekeeping Flow

When a booking is moved to `Checked Out` or `Departed`:

1. The backend normalizes the status.
2. The room status becomes `Dirty`.
3. A housekeeping task is created automatically if one does not already exist.
4. If the room has an assigned housekeeper, the task is assigned to that user.
5. If not, the task stays available for manual assignment.

When the housekeeping task is completed:

1. The task is marked completed.
2. The room status becomes `Clean`.
3. The room `lastCleanDate` is updated.

## 5. Tasks Flow

The backend now supports standalone task management.

Use tasks when you want to:

- create a task manually
- list all tasks
- list only available tasks
- assign work to a housekeeper
- complete work from the UI

### Available tasks

Use `GET /tasks/available` to show work that has not been completed yet.

Typical filters:

- `date`
- `assignedTo`
- `roomId`
- `bookingId`

## 6. Accounting And Balance Flow

Accounting is the money record.

- Every reservation can generate a booking charge entry.
- Voucher amounts are stored on the reservation and mirrored in accounting.
- Admin users can filter by client and voucher code.
- Reservation `balance` is available for list/detail screens and can be updated through the reservation update endpoint.

Recommended frontend usage:

- use reservations for balance editing
- use accounting for ledger/history views
- use bookings for room occupancy and operational screens

## 7. Role Access

### Admin

Admins can:

- view all bookings, reservations, tasks, and accounting entries
- update reservation balances
- see voucher amounts and booking charges
- manage room/task operations

### Manager / Client User

Managers and client users can:

- view their tenant data
- create and update reservations
- view booking history and task assignments
- review accounting history for their tenant

### Housekeeper

Housekeepers can:

- view assigned tasks
- view available tasks
- complete tasks
- see the room-cleaning workflow

## 8. API Endpoints

### Auth

- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Clients

- `GET /clients`
- `POST /clients`
- `PATCH /clients/:id`

### Reservations

- `GET /reservations`
- `POST /reservations`
- `GET /reservations/:id`
- `PUT /reservations/:id`
- `PATCH /reservations/:id`
- `DELETE /reservations/:id`

Notes:

- `balance` can be sent on create/update.
- `status` should be treated as a display/status field, not a workflow driver from the UI.
- `checkIn` and `checkOut` should be ISO date-time strings.

### Bookings

- `GET /bookings`
- `GET /bookings/chart`
- `GET /bookings/:id`
- `GET /bookings/:id/status`
- `POST /bookings`
- `PATCH /bookings/:id`
- `PUT /bookings/:id`
- `PATCH /bookings/:id/status`
- `DELETE /bookings/:id`

Notes:

- `PATCH /bookings/:id/status` is the safest way to change operational state.
- If a booking becomes checked out, the backend will dirty the room and create housekeeping work.
- Booking list payloads now include `balance` and `voucherAmount`.

### Tasks

- `GET /tasks`
- `GET /tasks/available`
- `GET /tasks/:id`
- `POST /tasks`
- `PATCH /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

Notes:

- `POST /tasks` will not create duplicate identical tasks.
- Available tasks are the ones the frontend can show as uncompleted work.

### Housekeeping

- `GET /housekeeping/roster`
- `POST /housekeeping/allocate`
- `GET /housekeeping/assignments`
- `PATCH /housekeeping/tasks/:id/complete`
- `GET /housekeeping/print`

Notes:

- `PATCH /housekeeping/tasks/:id/complete` marks the task complete and cleans the room.

### Accounting

- `GET /accounting`
- `GET /accounting/:id`
- `POST /accounting`
- `PATCH /accounting/:id`

Notes:

- `GET /accounting?clientNumber=...` is admin-friendly.
- `GET /accounting?voucherCode=...` filters a specific voucher.
- `GET /accounting?hasVoucher=true` returns voucher-backed entries.

### Vouchers

- `GET /vouchers`
- `POST /vouchers`
- `PATCH /vouchers/:id`

## 9. Suggested Frontend Screens

1. Login
2. Dashboard
3. Client management
4. Reservation create/edit
5. Booking list and timeline
6. Booking detail/status screen
7. Task list
8. Available tasks
9. Housekeeping roster
10. Accounting history
11. Voucher management

## 10. Practical UI Notes

- Use the reservation API as the source of truth for business edits.
- Use the booking API for room occupancy, timeline, and status display.
- Use the task APIs for housekeeping assignment and completion.
- Show `balance` on reservation detail, booking detail, and admin summary views.
- Show `voucherNo` and `voucherAmount` wherever a reservation or accounting row is displayed.

## 11. Production Flow Summary

The safest UI flow is:

1. Create or edit the reservation.
2. Let the backend sync booking and accounting.
3. Display booking status from the booking API.
4. Display operational work from the task and housekeeping APIs.
5. Use accounting for voucher and balance history.

That keeps the frontend simple and avoids duplicating business rules in the browser.

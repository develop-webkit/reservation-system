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

## Out Of Service / Out Of Order Feature (2026-06-02)

### How It Works
- Right-click on any room row (name column or date grid) in the booking chart
- Context menu shows "Out Of Service" and "Out Of Order" options (only when a room row is right-clicked)
- Clicking opens a modal to enter: Description, From Date, To Date
- On confirm: PATCH /rooms/:id/service-status with { type, description, startDate, endDate }
- Room fields updated: outOfService/outOfOrder flag, serviceDescription, serviceStartDate, serviceEndDate
- Chart renders a colored bar (dark blue = OOS, purple = OOO) spanning those dates

### Key Files
- `src/components/BookingChart.jsx` — context menu, service modal, service block bar rendering
- `src/api/services/rooms.js` — updateRoomServiceStatus now passes startDate/endDate
- `src/hooks/useRooms.js` — useUpdateRoomServiceStatus passes dates in mutationFn
- Backend: `src/schemas/room.schema.ts` — added serviceStartDate, serviceEndDate fields
- Backend: `src/modules/rooms/rooms.service.ts` — updateServiceStatus accepts startDate/endDate
- Backend: `src/modules/rooms/rooms.controller.ts` — endpoint accepts startDate/endDate body params

### Booking Colors on Chart
STATUS_COLORS in BookingChart.jsx:
- 'Out of Service': '#003a8c' (dark blue)
- 'Out of Order': '#722ed1' (purple)
- 'Unconfirmed': '#faad14' (yellow — standalone/staff bookings)
- 'Confirmed': '#52c41a' (green)
- 'Arrived'/'Checked In': '#1890ff' (blue)

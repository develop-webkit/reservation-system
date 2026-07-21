// src/data/options.js

export const TITLE_OPTIONS = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Sr', 'Jr'];

export const CLIENT_TYPE_OPTIONS = ['Client', 'Contractor', 'Sales Lead', 'Staff'];

export const TARIFF_TYPE_OPTIONS = [
    "Occupied Room Rate PRPN", 
    "Rack Rate", 
    "Corporate Rate"
];

// These values must match the backend's normalizeStatusLabel output exactly
export const STATUS_OPTIONS = [
    'Unconfirmed',
    'Confirmed',
    'Checked In',
    'Checked Out',
    'Canceled',
];

// 'Checked Out' is the manual departure action — it maps to the backend's
// Departed status. Only Super Admin and Manager may perform it; every other role
// (user, housekeeper, portal_user) must not be able to SELECT it. The backend
// enforces the same rule (departure-permission.helper.ts) — this is UX only.
// Status *filters* are intentionally unaffected: any role may still filter by
// Checked Out to view already-departed guests.
export const DEPARTURE_STATUS_LABEL = 'Checked Out';
export const DEPARTURE_ALLOWED_ROLES = ['admin', 'manager'];

export const canRoleMarkDeparted = (role) =>
    DEPARTURE_ALLOWED_ROLES.includes(role);

export const getStatusOptionsForDeparturePermission = (canMarkDeparted) =>
    canMarkDeparted
        ? STATUS_OPTIONS
        : STATUS_OPTIONS.filter((status) => status !== DEPARTURE_STATUS_LABEL);

export const getSettableStatusOptions = (role) =>
    getStatusOptionsForDeparturePermission(canRoleMarkDeparted(role));

export const BKG_SOURCE_OPTIONS = [
    "Contracted with Meals",
    "Contracted Hold Night",
    "Non-Contracted",
    "Room Only - NO MEALS",
    "Meals Only"
];

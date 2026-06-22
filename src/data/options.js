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

export const BKG_SOURCE_OPTIONS = [
    "Contracted with Meals",
    "Contracted Hold Night",
    "Non-Contracted",
    "Room Only - NO MEALS",
    "Meals Only"
];

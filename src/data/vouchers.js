// src/data/vouchers.js

export const vouchers = [
    { 
        code: "V-1001", 
        description: "Corporate Discount 10%", 
        expiryDate: "2026-12-31", 
        creditAmount: 0, 
        usedByCompanyId: 'C001', 
        usedByResId: null 
    },
    { 
        code: "V-1002", 
        description: "Hospital Staff Special", 
        expiryDate: "2026-12-31", 
        creditAmount: 50, 
        usedByCompanyId: 'C002', 
        usedByResId: null 
    },
    { 
        code: "V-1003", 
        description: "Mining Corp Bulk", 
        expiryDate: "2026-06-30", 
        creditAmount: 100, 
        usedByCompanyId: 'C004', 
        usedByResId: null 
    },
    { 
        code: "V-GEN-01", 
        description: "General $20 Off", 
        expiryDate: "2025-12-31", 
        creditAmount: 20, 
        usedByCompanyId: null, 
        usedByResId: null 
    }
];

export const VOUCHER_OPTIONS = vouchers.map(v => v.code);

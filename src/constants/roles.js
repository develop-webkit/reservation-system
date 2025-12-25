import PERMISSIONS from './permissions';

// User roles
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  CUSTOMER: 'CUSTOMER',
};

// Role display names
export const ROLE_NAMES = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.CUSTOMER]: 'Customer',
};

// Role colors for badges
export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: '#f5222d',  // Red
  [ROLES.EMPLOYEE]: '#faad14',     // Orange
  [ROLES.CUSTOMER]: '#52c41a',     // Green
};

// Permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // All permissions
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
    PERMISSIONS.VIEW_EMPLOYEES,
    
    PERMISSIONS.CREATE_CUSTOMER,
    PERMISSIONS.EDIT_CUSTOMER,
    PERMISSIONS.DELETE_CUSTOMER,
    PERMISSIONS.VIEW_CUSTOMERS,
    
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CREATE_BOOKING,
    PERMISSIONS.EDIT_BOOKING,
    PERMISSIONS.DELETE_BOOKING,
    
    PERMISSIONS.VIEW_ALL_RESERVATIONS,
    PERMISSIONS.VIEW_OWN_RESERVATIONS,
    PERMISSIONS.CREATE_RESERVATION,
    PERMISSIONS.EDIT_RESERVATION,
    PERMISSIONS.DELETE_RESERVATION,
    
    PERMISSIONS.ACCESS_BOOKING_CHART,
    PERMISSIONS.ACCESS_DASHBOARD,
    PERMISSIONS.ACCESS_SETTINGS,
    PERMISSIONS.VIEW_REPORTS,
    
    PERMISSIONS.EDIT_OWN_PROFILE,
  ],
  
  [ROLES.EMPLOYEE]: [
    // Customer management only
    PERMISSIONS.CREATE_CUSTOMER,
    PERMISSIONS.EDIT_CUSTOMER,
    PERMISSIONS.DELETE_CUSTOMER,
    PERMISSIONS.VIEW_CUSTOMERS,
    
    // Own data
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.VIEW_OWN_RESERVATIONS,
    PERMISSIONS.EDIT_OWN_PROFILE,
    
    // Limited dashboard
    PERMISSIONS.ACCESS_DASHBOARD,
  ],
  
  [ROLES.CUSTOMER]: [
    // Own data only
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.VIEW_OWN_RESERVATIONS,
    PERMISSIONS.EDIT_OWN_PROFILE,
    PERMISSIONS.ACCESS_DASHBOARD,
  ],
};

/**
 * Get permissions for a role
 * @param {string} role - User role
 * @returns {Array<string>} Array of permissions
 */
export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const roleHasPermission = (role, permission) => {
  const permissions = getPermissionsForRole(role);
  return permissions.includes(permission);
};

export default ROLES;

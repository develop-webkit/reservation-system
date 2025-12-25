// Permission constants for RBAC system

export const PERMISSIONS = {
  // User Management - Employees
  CREATE_EMPLOYEE: 'create:employee',
  EDIT_EMPLOYEE: 'edit:employee',
  DELETE_EMPLOYEE: 'delete:employee',
  VIEW_EMPLOYEES: 'view:employees',
  
  // User Management - Customers
  CREATE_CUSTOMER: 'create:customer',
  EDIT_CUSTOMER: 'edit:customer',
  DELETE_CUSTOMER: 'delete:customer',
  VIEW_CUSTOMERS: 'view:customers',
  
  // Booking Management
  VIEW_ALL_BOOKINGS: 'view:all_bookings',
  VIEW_OWN_BOOKINGS: 'view:own_bookings',
  CREATE_BOOKING: 'create:booking',
  EDIT_BOOKING: 'edit:booking',
  DELETE_BOOKING: 'delete:booking',
  
  // Reservations
  VIEW_ALL_RESERVATIONS: 'view:all_reservations',
  VIEW_OWN_RESERVATIONS: 'view:own_reservations',
  CREATE_RESERVATION: 'create:reservation',
  EDIT_RESERVATION: 'edit:reservation',
  DELETE_RESERVATION: 'delete:reservation',
  
  // System
  ACCESS_BOOKING_CHART: 'access:booking_chart',
  ACCESS_DASHBOARD: 'access:dashboard',
  ACCESS_SETTINGS: 'access:settings',
  VIEW_REPORTS: 'view:reports',
  
  // Profile
  EDIT_OWN_PROFILE: 'edit:own_profile',
};

export default PERMISSIONS;

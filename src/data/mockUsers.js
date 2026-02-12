import { ROLES } from '../constants/roles';

// Mock users for testing
export const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@hotel.com',
    password: 'admin123',
    role: ROLES.SUPER_ADMIN,
    name: 'Admin',
    avatar: null,
  },
  {
    id: 2,
    email: 'john@hotel.com',
    password: 'employee123',
    role: ROLES.EMPLOYEE,
    name: 'John Employee',
    avatar: null,
  },
  {
    id: 3,
    email: 'jane@customer.com',
    password: 'customer123',
    role: ROLES.CUSTOMER,
    name: 'Jane Customer',
    avatar: null,
  },
];

/**
 * Mock login function
 * @param {string} email
 * @param {string} password
 * @returns {Object|null} User object or null if invalid
 */
export const mockLogin = (email, password) => {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  
  if (user) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};

export default MOCK_USERS;

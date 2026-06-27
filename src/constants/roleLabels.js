// Display-only role labels/colors for the UI. The underlying role values
// (admin, manager, user, housekeeper, portal_user) are unchanged everywhere
// else — only how they're shown to the user changes here.
export const ROLE_LABELS = {
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  housekeeper: 'Housekeeper',
  portal_user: 'Client',
};

export const ROLE_COLORS = {
  admin: 'red',
  manager: 'orange',
  portal_user: 'blue',
  user: 'green',
  housekeeper: 'cyan',
};

export const ROLE_OPTIONS = [
  { value: 'user', label: ROLE_LABELS.user },
  { value: 'housekeeper', label: ROLE_LABELS.housekeeper },
  { value: 'manager', label: ROLE_LABELS.manager },
  { value: 'portal_user', label: ROLE_LABELS.portal_user },
];

export const getRoleLabel = (role) => ROLE_LABELS[role] || role || '';

import {
  ApartmentOutlined,
  AppstoreOutlined,
  BuildOutlined,
  CalendarOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  HistoryOutlined,
  HomeOutlined,
  ReadOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';

// null means visible to all authenticated users
export const navigationItems = [
  // Admin / Manager / Staff navigation
  { key: '/dashboard',         label: 'Dashboard',         icon: HomeOutlined,       roles: ['admin', 'manager', 'user', 'housekeeper'] },
  { key: '/reservations',      label: 'Reservations',      icon: CalendarOutlined,   roles: ['admin', 'manager'] },
  { key: '/bookings',          label: 'Bookings',          icon: ScheduleOutlined,   roles: ['admin', 'manager'] },
  { key: '/tasks',             label: 'Tasks',             icon: ReadOutlined,       roles: ['admin', 'manager', 'housekeeper'] },
  { key: '/housekeeping',      label: 'Housekeeping',      icon: SolutionOutlined,   roles: ['admin', 'manager', 'housekeeper'] },
  {
    key: 'clients-group',
    label: 'Clients',
    icon: TeamOutlined,
    roles: ['admin', 'manager'],
    children: [
      { key: '/clients', label: 'All Clients',      icon: TeamOutlined,    roles: ['admin', 'manager'] },
      { key: '/groups',  label: 'Group Management', icon: ApartmentOutlined, roles: ['admin', 'manager'] },
    ],
  },
  { key: '/rooms',             label: 'Rooms',             icon: BuildOutlined,      roles: ['admin', 'manager'] },
  { key: '/vouchers',          label: 'Vouchers',          icon: WalletOutlined,     roles: ['admin', 'manager'] },
  { key: '/users',             label: 'Users',             icon: UserAddOutlined,    roles: ['admin', 'manager'] },
  { key: '/booking-requests',  label: 'Booking Requests',  icon: FileSearchOutlined, roles: ['admin', 'manager'] },
  { key: '/invoice-generator', label: 'Invoice Generator', icon: FileTextOutlined,   roles: ['admin', 'manager'] },
  { key: '/invoice-history',   label: 'Invoice History',   icon: HistoryOutlined,    roles: ['admin', 'manager'] },
  { key: '/account',           label: 'My Account',        icon: UserOutlined,       roles: ['user', 'housekeeper'] },
  // Portal user (corporate client) navigation
  { key: '/portal/dashboard',   label: 'Dashboard',        icon: HomeOutlined,       roles: ['portal_user'] },
  { key: '/portal/reservations', label: 'Reservations',    icon: CalendarOutlined,   roles: ['portal_user'] },
  { key: '/portal/bookings',     label: 'Bookings',        icon: ScheduleOutlined,   roles: ['portal_user'] },
  { key: '/portal/clients',      label: 'Clients',         icon: TeamOutlined,       roles: ['portal_user'] },
  { key: '/portal/users',        label: 'Users',           icon: UserOutlined,       roles: ['portal_user'] },
  { key: '/portal/groups',       label: 'Group Management', icon: ApartmentOutlined, roles: ['portal_user'] },
  { key: '/portal/staff',        label: 'Staff Management', icon: UserAddOutlined,   roles: ['portal_user'] },
  { key: '/portal/rooms',        label: 'Room Availability', icon: AppstoreOutlined, roles: ['portal_user'] },
];

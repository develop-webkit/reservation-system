import {
  BuildOutlined,
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  ReadOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserAddOutlined,
  WalletOutlined,
} from '@ant-design/icons';

// null means visible to all authenticated users
export const navigationItems = [
  { key: '/dashboard',    label: 'Dashboard',    icon: HomeOutlined,    roles: null },
  { key: '/reservations', label: 'Reservations', icon: CalendarOutlined, roles: ['admin', 'manager'] },
  { key: '/bookings',     label: 'Bookings',     icon: ScheduleOutlined, roles: ['admin', 'manager'] },
  { key: '/tasks',        label: 'Tasks',        icon: ReadOutlined,     roles: ['admin', 'manager', 'housekeeper'] },
  { key: '/housekeeping', label: 'Housekeeping', icon: SolutionOutlined, roles: ['admin', 'manager', 'housekeeper'] },
  { key: '/accounting',   label: 'Accounting',   icon: DollarOutlined,   roles: ['admin', 'manager'] },
  { key: '/clients',      label: 'Clients',      icon: TeamOutlined,     roles: ['admin', 'manager'] },
  { key: '/rooms',        label: 'Rooms',        icon: BuildOutlined,    roles: ['admin', 'manager'] },
  { key: '/vouchers',     label: 'Vouchers',     icon: WalletOutlined,   roles: ['admin', 'manager'] },
  { key: '/users',        label: 'Users',        icon: UserAddOutlined,  roles: ['admin'] },
];

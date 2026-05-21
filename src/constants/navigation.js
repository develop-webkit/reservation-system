import {
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

export const navigationItems = [
  { key: '/dashboard', label: 'Dashboard', icon: HomeOutlined },
  { key: '/reservations', label: 'Reservations', icon: CalendarOutlined },
  { key: '/bookings', label: 'Bookings', icon: ScheduleOutlined },
  { key: '/tasks', label: 'Tasks', icon: ReadOutlined },
  { key: '/housekeeping', label: 'Housekeeping', icon: SolutionOutlined },
  { key: '/accounting', label: 'Accounting', icon: DollarOutlined },
  { key: '/clients', label: 'Clients', icon: TeamOutlined },
  { key: '/vouchers', label: 'Vouchers', icon: WalletOutlined },
  { key: '/users', label: 'Users', icon: UserAddOutlined },
];

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'create-housekeepers.js',
    'create-housekeepers-auto.js',
    'src/api/dashboardApi.js',
    'src/api/reservationApi.js',
    'src/components/AddUserProfileModal.jsx',
    'src/components/AntdSidebar.jsx',
    'src/components/BookingFilterBar.jsx',
    'src/components/BookingChartOptionsModal.jsx',
    'src/components/InvoicePDF.jsx',
    'src/components/UserDetailsModal.jsx',
    'src/components/chart/ContextMenu.jsx',
    'src/contexts/ModalContext.jsx',
    'src/hooks/useHousekeeping.js',
    'src/pages/CleanScreen.jsx',
    'src/pages/Dashboard.jsx',
    'src/pages/FinancialReports.jsx',
    'src/pages/GuestDebtorsReport.jsx',
    'src/pages/HousekeepingRoster.jsx',
    'src/pages/Login.jsx',
    'src/pages/ReservationEditPage.jsx',
    'src/pages/Reservations.jsx',
    'src/pages/ReservationsListPage.jsx',
    'src/utils/chartUtils.js',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

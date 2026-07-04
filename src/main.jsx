import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import dayjs from 'dayjs';
import dayjsUpdateLocale from 'dayjs/plugin/updateLocale';
import App from './App.jsx';
import { queryClient } from './lib/queryClient.js';
import './index.css';

// All antd DatePicker/RangePicker instances derive their first-day-of-week from this
// dayjs locale setting, so this one call fixes every calendar in the app at once.
dayjs.extend(dayjsUpdateLocale);
dayjs.updateLocale('en', { weekStart: 1 });

const theme = {
  token: {
    colorPrimary: '#0d5c63',
    colorInfo: '#0d5c63',
    colorSuccess: '#2c6e49',
    colorWarning: '#c0841a',
    colorError: '#b23a48',
    borderRadius: 12,
    fontFamily:
      "'DM Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <AntdApp>
            <App />
          </AntdApp>
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

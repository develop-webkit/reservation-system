export function formatDate(value, options = {}) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(date);
}

export function formatDateTime(value) {
  return formatDate(value, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatCurrency(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCount(value) {
  return new Intl.NumberFormat('en-US').format(Number(value || 0));
}

export function getOptionLabel(option, fallbackKeys = ['name', 'label']) {
  if (!option) {
    return '';
  }

  for (const key of fallbackKeys) {
    if (option[key]) {
      return option[key];
    }
  }

  return option._id || option.id || '';
}

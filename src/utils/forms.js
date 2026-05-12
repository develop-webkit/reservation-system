export function toOptions(items, labelBuilder, valueKey = '_id') {
  return (items || []).map((item) => ({
    label: labelBuilder(item),
    value: item[valueKey] || item.id,
  }));
}

export function toIsoDateTime(value) {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  return value.toISOString();
}

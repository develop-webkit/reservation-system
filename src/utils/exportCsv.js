/**
 * Converts an array of row objects to a CSV string and triggers a file download.
 * @param {Array<Record<string, unknown>>} rows - Data rows to export
 * @param {string[]} columns - Ordered list of column keys
 * @param {Record<string, string>} headers - Map of column key → display header label
 * @param {string} filename - Downloaded file name (without extension)
 */
export function downloadCsv(rows, columns, headers, filename) {
  const escape = (value) => {
    const str = value == null ? '' : String(value);
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const headerRow = columns.map((col) => escape(headers[col] || col)).join(',');
  const dataRows = rows.map((row) =>
    columns.map((col) => escape(row[col])).join(','),
  );

  const csv = [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

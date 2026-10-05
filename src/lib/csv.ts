type CsvCell = string | number | null | undefined;

// Spreadsheet apps execute cells starting with these characters as formulas.
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

const escapeCell = (cell: CsvCell) => {
  if (cell === null || cell === undefined) {
    return '';
  }
  let value = String(cell);
  if (typeof cell === 'string' && FORMULA_PREFIX.test(value)) {
    value = `'${value}`;
  }
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
};

/** Serializes rows to RFC 4180 CSV with spreadsheet formula-injection guards. */
export const toCsv = (rows: CsvCell[][]) =>
  rows.map((row) => row.map(escapeCell).join(',')).join('\r\n') + '\r\n';

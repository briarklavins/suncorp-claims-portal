const AU_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

/**
 * policy-admin-service serialises dates with `spring.jackson.date-format` as `dd/MM/yyyy`.
 * Both that format and ISO-8601 (what a `java.time.LocalDate` would produce) are accepted so the
 * portal keeps rendering `date:'dd/MM/yyyy'` correctly if the Java side changes its contract.
 * Returns `null` for empty or unparseable input.
 */
export function parsePolicyDate(value: Date | string | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  const au = AU_DATE.exec(value.trim());
  if (au) {
    const day = Number(au[1]);
    const month = Number(au[2]);
    const year = Number(au[3]);
    const date = new Date(year, month - 1, day);
    const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    return valid ? date : null;
  }
  const iso = new Date(value);
  return isNaN(iso.getTime()) ? null : iso;
}

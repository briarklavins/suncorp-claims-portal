import { DatePipe } from '@angular/common';

import { parsePolicyDate } from './policy-date';

describe('parsePolicyDate', () => {

  const datePipe = new DatePipe('en-AU');

  it('should parse dd/MM/yyyy strings from policy-admin-service', () => {
    const date = parsePolicyDate('12/03/2027');
    expect(date.getFullYear()).toBe(2027);
    expect(date.getMonth()).toBe(2);
    expect(date.getDate()).toBe(12);
    expect(datePipe.transform(date, 'dd/MM/yyyy')).toBe('12/03/2027');
  });

  it('should not swap day and month for dd/MM/yyyy input', () => {
    expect(datePipe.transform(parsePolicyDate('25/12/2026'), 'dd/MM/yyyy')).toBe('25/12/2026');
    expect(datePipe.transform(parsePolicyDate('01/02/2026'), 'dd/MM/yyyy')).toBe('01/02/2026');
  });

  it('should parse ISO-8601 dates and date-times', () => {
    expect(datePipe.transform(parsePolicyDate('2027-03-12'), 'dd/MM/yyyy')).toBe('12/03/2027');
    expect(datePipe.transform(parsePolicyDate('2026-11-01T00:00:00+10:00'), 'dd/MM/yyyy', '+1000')).toBe('01/11/2026');
  });

  it('should pass through Date instances', () => {
    const input = new Date(2026, 5, 30);
    expect(parsePolicyDate(input)).toBe(input);
    expect(parsePolicyDate(new Date('nonsense'))).toBeNull();
  });

  it('should return null for empty or invalid input', () => {
    expect(parsePolicyDate(null)).toBeNull();
    expect(parsePolicyDate(undefined)).toBeNull();
    expect(parsePolicyDate('')).toBeNull();
    expect(parsePolicyDate('31/02/2026')).toBeNull();
    expect(parsePolicyDate('not a date')).toBeNull();
  });
});

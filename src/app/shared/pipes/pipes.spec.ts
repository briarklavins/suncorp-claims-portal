import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeEnAu from '@angular/common/locales/en-AU';

import { AuCurrencyPipe } from './au-currency.pipe';
import { BsbPipe } from './bsb.pipe';
import { ClaimStatusPipe } from './claim-status.pipe';
import { TimeAgoPipe } from './time-ago.pipe';

registerLocaleData(localeEnAu);

describe('AuCurrencyPipe', () => {
  const pipe = new AuCurrencyPipe(new CurrencyPipe('en-AU'));

  it('should format Australian dollars with cents by default', () => {
    expect(pipe.transform(1404.8)).toBe('$1,404.80');
  });

  it('should format whole dollars when cents are hidden', () => {
    expect(pipe.transform(32000, false)).toBe('$32,000');
  });

  it('should render nothing for missing values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});

describe('BsbPipe', () => {
  const pipe = new BsbPipe();

  it('should format a six digit BSB as NNN-NNN', () => {
    expect(pipe.transform('484799')).toBe('484-799');
    expect(pipe.transform('484 799')).toBe('484-799');
  });

  it('should leave values that are not six digits untouched', () => {
    expect(pipe.transform('48479')).toBe('48479');
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
  });
});

describe('ClaimStatusPipe', () => {
  const pipe = new ClaimStatusPipe();

  it('should map statuses to consultant facing labels', () => {
    expect(pipe.transform('UNDER_ASSESSMENT')).toBe('Under assessment');
    expect(pipe.transform('REPAIR_IN_PROGRESS')).toBe('Repair in progress');
    expect(pipe.transform('SETTLED')).toBe('Settled');
  });

  it('should fall back to the raw status for unknown codes', () => {
    expect(pipe.transform('ESCALATED' as never)).toBe('ESCALATED');
  });
});

describe('TimeAgoPipe', () => {
  const pipe = new TimeAgoPipe();
  const now = new Date('2026-05-30T10:00:00Z');

  it('should describe recent moments', () => {
    expect(pipe.transform(new Date('2026-05-30T09:59:50Z'), now)).toBe('a few seconds ago');
    expect(pipe.transform(new Date('2026-05-30T10:00:20Z'), now)).toBe('in a few seconds');
  });

  it('should describe past dates in the largest sensible unit', () => {
    expect(pipe.transform('2026-05-30T09:57:00Z', now)).toBe('3 minutes ago');
    expect(pipe.transform('2026-05-30T07:00:00Z', now)).toBe('3 hours ago');
    expect(pipe.transform('2026-05-29T10:00:00Z', now)).toBe('yesterday');
    expect(pipe.transform('2026-05-25T10:00:00Z', now)).toBe('5 days ago');
    expect(pipe.transform('2026-03-01T10:00:00Z', now)).toBe('3 months ago');
    expect(pipe.transform('2024-05-30T10:00:00Z', now)).toBe('2 years ago');
  });

  it('should describe future dates', () => {
    expect(pipe.transform(new Date('2026-06-02T10:00:00Z'), now)).toBe('in 3 days');
    expect(pipe.transform(new Date('2026-05-30T10:45:00Z'), now)).toBe('in 45 minutes');
  });

  it('should accept epoch milliseconds', () => {
    expect(pipe.transform(now.getTime() - 2 * 60 * 60 * 1000, now)).toBe('2 hours ago');
  });

  it('should render nothing for empty or invalid values', () => {
    expect(pipe.transform(null, now)).toBe('');
    expect(pipe.transform(undefined, now)).toBe('');
    expect(pipe.transform('', now)).toBe('');
    expect(pipe.transform('not a date', now)).toBe('');
  });
});

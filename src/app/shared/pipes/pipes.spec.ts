import { CurrencyPipe } from '@angular/common';

import { AuCurrencyPipe } from './au-currency.pipe';
import { BsbPipe } from './bsb.pipe';
import { ClaimStatusPipe } from './claim-status.pipe';
import { TimeAgoPipe } from './time-ago.pipe';

describe('shared pipes', () => {

  describe('BsbPipe', () => {
    const pipe = new BsbPipe();

    it('should format six digits as NNN-NNN', () => {
      expect(pipe.transform('484799')).toBe('484-799');
      expect(pipe.transform('484 799')).toBe('484-799');
    });

    it('should leave anything else untouched', () => {
      expect(pipe.transform('')).toBe('');
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform('12345')).toBe('12345');
    });
  });

  describe('ClaimStatusPipe', () => {
    const pipe = new ClaimStatusPipe();

    it('should map statuses to consultant facing labels', () => {
      expect(pipe.transform('UNDER_ASSESSMENT')).toBe('Under assessment');
      expect(pipe.transform('SETTLED')).toBe('Settled');
    });

    it('should fall back to the raw status', () => {
      expect(pipe.transform('UNKNOWN' as any)).toBe('UNKNOWN');
    });
  });

  describe('AuCurrencyPipe', () => {
    const pipe = new AuCurrencyPipe(new CurrencyPipe('en-AU'));

    it('should format AUD with and without cents', () => {
      expect(pipe.transform(1071.5)).toBe('$1,071.50');
      expect(pipe.transform(1071.5, false)).toBe('$1,072');
    });

    it('should render nothing for missing values', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
    });
  });

  describe('TimeAgoPipe', () => {
    const pipe = new TimeAgoPipe();

    it('should describe past dates relative to now', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(pipe.transform(twoHoursAgo)).toBe('2 hours ago');
      expect(pipe.transform(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))).toBe('3 days ago');
    });

    it('should render nothing for missing values', () => {
      expect(pipe.transform(null)).toBe('');
    });
  });
});

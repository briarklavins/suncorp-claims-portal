import { CurrencyPipe } from '@angular/common';

import { AuCurrencyPipe } from './au-currency.pipe';

describe('AuCurrencyPipe', () => {

  const pipe = new AuCurrencyPipe(new CurrencyPipe('en-AU'));

  it('should return an empty string for a missing amount', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should format an amount with cents by default', () => {
    expect(pipe.transform(968.1)).toBe('$968.10');
  });

  it('should drop the cents when asked', () => {
    expect(pipe.transform(968.14, false)).toBe('$968');
  });
});

import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: 'auCurrency' })
export class AuCurrencyPipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {
  }

  transform(value: number, showCents: boolean = true): string {
    if (value === null || value === undefined) {
      return '';
    }
    const digits = showCents ? '1.2-2' : '1.0-0';
    return this.currencyPipe.transform(value, 'AUD', 'symbol-narrow', digits, 'en-AU');
  }
}

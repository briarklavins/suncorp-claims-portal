import { Pipe, PipeTransform } from '@angular/core';

type RelativeUnit = Intl.RelativeTimeFormatUnit;

const UNITS: { unit: RelativeUnit; seconds: number }[] = [
  { unit: 'year', seconds: 365 * 24 * 60 * 60 },
  { unit: 'month', seconds: 30 * 24 * 60 * 60 },
  { unit: 'day', seconds: 24 * 60 * 60 },
  { unit: 'hour', seconds: 60 * 60 },
  { unit: 'minute', seconds: 60 }
];

/**
 * Renders an absolute date as a relative phrase such as "3 hours ago" or "in 2 days".
 * Impure so the phrase keeps up to date while a view stays open.
 */
@Pipe({ name: 'timeAgo', pure: false })
export class TimeAgoPipe implements PipeTransform {

  private readonly formatter = new Intl.RelativeTimeFormat('en-AU', { numeric: 'auto' });

  transform(value: Date | string | number | null | undefined, now: Date = new Date()): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }

    const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
    if (Math.abs(diffSeconds) < 45) {
      return diffSeconds <= 0 ? 'a few seconds ago' : 'in a few seconds';
    }
    for (const { unit, seconds } of UNITS) {
      if (Math.abs(diffSeconds) >= seconds) {
        return this.formatter.format(Math.round(diffSeconds / seconds), unit);
      }
    }
    return this.formatter.format(Math.round(diffSeconds / 60), 'minute');
  }
}

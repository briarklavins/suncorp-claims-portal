import { Pipe, PipeTransform } from '@angular/core';

type Unit = Intl.RelativeTimeFormatUnit;

const UNITS: ReadonlyArray<[Unit, number]> = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000]
];

/**
 * Renders a date relative to now ("2 hours ago", "in 3 days"). Pure: callers pass
 * `now` when the reference time needs to move (the default is the current time).
 */
@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {

  private readonly formatter = new Intl.RelativeTimeFormat('en-AU', { numeric: 'auto' });

  transform(value: Date | string | null | undefined, now: Date | number = Date.now()): string {
    if (!value) {
      return '';
    }
    const elapsed = new Date(value).getTime() - new Date(now).getTime();
    for (const [unit, size] of UNITS) {
      if (Math.abs(elapsed) >= size) {
        return this.formatter.format(Math.round(elapsed / size), unit);
      }
    }
    return Math.abs(elapsed) < 45 * 1000 ? 'a few seconds ago' : this.formatter.format(Math.round(elapsed / 1000), 'second');
  }
}

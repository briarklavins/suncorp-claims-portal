import { Pipe, PipeTransform } from '@angular/core';

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {

  private readonly formatter = new Intl.RelativeTimeFormat('en-AU', { numeric: 'auto' });

  transform(value: Date | string): string {
    if (!value) {
      return '';
    }

    const elapsedSeconds = (new Date(value).getTime() - Date.now()) / 1000;
    const [unit, secondsPerUnit] = this.resolveUnit(Math.abs(elapsedSeconds));

    return this.formatter.format(Math.round(elapsedSeconds / secondsPerUnit), unit);
  }

  private resolveUnit(seconds: number): [Intl.RelativeTimeFormatUnit, number] {
    if (seconds < MINUTE) {
      return ['second', 1];
    }
    if (seconds < HOUR) {
      return ['minute', MINUTE];
    }
    if (seconds < DAY) {
      return ['hour', HOUR];
    }
    if (seconds < WEEK) {
      return ['day', DAY];
    }
    if (seconds < MONTH) {
      return ['week', WEEK];
    }
    if (seconds < YEAR) {
      return ['month', MONTH];
    }
    return ['year', YEAR];
  }
}

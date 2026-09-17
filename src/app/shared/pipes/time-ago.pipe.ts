import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'timeAgo', pure: false })
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date | string): string {
    if (!value) {
      return '';
    }
    return moment(value).fromNow();
  }
}

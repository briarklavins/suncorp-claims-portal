import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a six digit BSB as NNN-NNN.
 */
@Pipe({ name: 'bsb' })
export class BsbPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    const digits = value.replace(/[^0-9]/g, '');
    return digits.length === 6 ? digits.substr(0, 3) + '-' + digits.substr(3, 3) : value;
  }
}

import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Vehicle registrations are stored upper case to match the mainframe policy register.
 */
@Directive({ selector: '[sunUppercaseRego]' })
export class UppercaseRegoDirective {

  constructor(private elementRef: ElementRef, private control: NgControl) {
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const upper = String(event.target.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.control.control.setValue(upper, { emitEvent: false });
    this.elementRef.nativeElement.value = upper;
  }
}

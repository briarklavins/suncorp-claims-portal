import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

/**
 * Moves focus to the host element once the view initialises. Used on the first
 * field of every claim lodgement step for keyboard-only contact centre users.
 */
@Directive({ selector: '[sunAutofocus]' })
export class AutofocusDirective implements AfterViewInit {

  @Input('sunAutofocus')
  enabled = true;

  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  ngAfterViewInit(): void {
    if (this.enabled) {
      this.elementRef.nativeElement.focus();
    }
  }
}

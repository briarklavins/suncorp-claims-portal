import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Moves focus to the host element once the view initialises. Used on the first
 * field of every claim lodgement step for keyboard-only contact centre users.
 */
@Directive({ selector: '[sunAutofocus]' })
export class AutofocusDirective implements OnInit {

  @Input('sunAutofocus')
  enabled: boolean | string = true;

  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    if (this.enabled !== false) {
      this.elementRef.nativeElement.focus();
    }
  }
}

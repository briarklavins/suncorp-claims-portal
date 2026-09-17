import { Directive, ElementRef, Input, OnInit, Renderer } from '@angular/core';

/**
 * Moves focus to the host element once the view initialises. Used on the first
 * field of every claim lodgement step for keyboard-only contact centre users.
 */
@Directive({ selector: '[sunAutofocus]' })
export class AutofocusDirective implements OnInit {

  @Input('sunAutofocus')
  enabled = true;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
  }

  ngOnInit(): void {
    if (this.enabled) {
      this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
    }
  }
}

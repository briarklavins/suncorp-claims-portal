import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * Moves focus to the host element once the view initialises. Used on the first
 * field of every claim lodgement step for keyboard-only contact centre users.
 *
 * The host is typically inside a stepper or dialog whose enter animation keeps it
 * `visibility: hidden` for a few hundred milliseconds, during which `focus()` is a
 * no-op, so focusing is retried until it takes or the retry budget is spent.
 */
@Directive({ selector: '[sunAutofocus]' })
export class AutofocusDirective implements AfterViewInit, OnDestroy {

  private static readonly RETRY_INTERVAL_MS = 50;
  private static readonly MAX_ATTEMPTS = 30;

  /** Bare `sunAutofocus` attribute (empty string) means enabled, like `disabled` on native elements. */
  @Input('sunAutofocus')
  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: BooleanInput) {
    this._enabled = coerceBooleanProperty(value);
  }

  private _enabled = true;

  private timer: number | null = null;

  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  ngAfterViewInit(): void {
    if (this.enabled) {
      // deferred so mat-form-field's focused state is not mutated mid change-detection
      this.timer = window.setTimeout(() => this.tryFocus(0));
    }
  }

  ngOnDestroy(): void {
    this.cancel();
  }

  private tryFocus(attempt: number): void {
    const element = this.elementRef.nativeElement;
    element.focus();
    if (document.activeElement === element || attempt >= AutofocusDirective.MAX_ATTEMPTS) {
      this.timer = null;
      return;
    }
    this.timer = window.setTimeout(() => this.tryFocus(attempt + 1), AutofocusDirective.RETRY_INTERVAL_MS);
  }

  private cancel(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

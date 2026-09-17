import { Component, Input } from '@angular/core';

@Component({
  selector: 'sun-loading-spinner',
  template: `
    <div class="sun-spinner" *ngIf="loading">
      <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .sun-spinner { text-align: center; padding: 32px; }
    .sun-spinner p { color: #6b7580; margin-top: 12px; }
  `]
})
export class LoadingSpinnerComponent {

  @Input()
  loading = false;

  @Input()
  message: string;
}

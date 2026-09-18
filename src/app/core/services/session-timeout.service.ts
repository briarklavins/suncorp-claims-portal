import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';

import { SessionTimeoutDialogComponent } from '../components/session-timeout-dialog/session-timeout-dialog.component';
import { AuthService } from './auth.service';

/**
 * Suncorp security standard SEC-014 requires an idle timeout of 15 minutes for
 * applications that display customer PII.
 */
@Injectable()
export class SessionTimeoutService {

  private static readonly IDLE_MINUTES = 15;
  private static readonly WARNING_MINUTES = 13;

  private warningSubscription: Subscription;
  private dialogRef: MatDialogRef<SessionTimeoutDialogComponent>;

  constructor(private dialog: MatDialog, private authService: AuthService) {
  }

  start(): void {
    this.stop();
    this.warningSubscription = timer(SessionTimeoutService.WARNING_MINUTES * 60000).subscribe(() => this.showWarning());
    document.addEventListener('click', this.resetHandler);
    document.addEventListener('keydown', this.resetHandler);
  }

  stop(): void {
    if (this.warningSubscription) {
      this.warningSubscription.unsubscribe();
      this.warningSubscription = null;
    }
    document.removeEventListener('click', this.resetHandler);
    document.removeEventListener('keydown', this.resetHandler);
  }

  private resetHandler = () => {
    if (!this.dialogRef) {
      this.start();
    }
  }

  private showWarning(): void {
    this.dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { remainingMinutes: SessionTimeoutService.IDLE_MINUTES - SessionTimeoutService.WARNING_MINUTES }
    });

    this.dialogRef.afterClosed().subscribe(keepAlive => {
      this.dialogRef = null;
      if (keepAlive) {
        this.start();
      } else {
        this.authService.redirectToLogin();
      }
    });
  }
}

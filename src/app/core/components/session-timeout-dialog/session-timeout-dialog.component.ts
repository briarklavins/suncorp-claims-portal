import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'sun-session-timeout-dialog',
  templateUrl: './session-timeout-dialog.component.html'
})
export class SessionTimeoutDialogComponent {

  constructor(public dialogRef: MatDialogRef<SessionTimeoutDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { remainingMinutes: number }) {
  }

  keepWorking(): void {
    this.dialogRef.close(true);
  }

  signOut(): void {
    this.dialogRef.close(false);
  }
}

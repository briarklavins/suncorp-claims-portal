import { MatDialogRef } from '@angular/material/dialog';

import { SessionTimeoutDialogComponent } from './session-timeout-dialog.component';

describe('SessionTimeoutDialogComponent', () => {

  let dialogRef: jasmine.SpyObj<MatDialogRef<SessionTimeoutDialogComponent>>;
  let component: SessionTimeoutDialogComponent;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    component = new SessionTimeoutDialogComponent(dialogRef, { remainingMinutes: 2 });
  });

  it('should close with true when the consultant keeps working', () => {
    component.keepWorking();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close with false when the consultant signs out', () => {
    component.signOut();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});

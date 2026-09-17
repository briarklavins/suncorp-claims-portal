import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface ClaimInProgress {
  hasUnsavedChanges(): boolean;
}

@Injectable()
export class UnsavedClaimGuard implements CanDeactivate<ClaimInProgress> {

  canDeactivate(component: ClaimInProgress): Observable<boolean> | Promise<boolean> | boolean {
    if (!component.hasUnsavedChanges()) {
      return true;
    }
    return window.confirm('This claim has not been submitted. Leaving now will discard the details entered.');
  }
}

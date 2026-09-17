import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { SessionTimeoutService } from './session-timeout.service';
import { AuthService } from './auth.service';

describe('SessionTimeoutService', () => {

  let service: SessionTimeoutService;
  let dialogStub: { open: jasmine.Spy };
  let authServiceStub: { redirectToLogin: jasmine.Spy };
  let afterClosed: any;

  beforeEach(() => {
    afterClosed = of(true);
    dialogStub = { open: jasmine.createSpy('open').and.callFake(() => ({ afterClosed: () => afterClosed })) };
    authServiceStub = { redirectToLogin: jasmine.createSpy('redirectToLogin') };

    TestBed.configureTestingModule({
      providers: [
        SessionTimeoutService,
        { provide: MatDialog, useValue: dialogStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    });

    service = TestBed.inject(SessionTimeoutService);
  });

  afterEach(() => service.stop());

  it('should arm the idle warning timer on start and disarm it on stop', () => {
    service.start();
    expect(service['warningSubscription'].closed).toBe(false);

    service.stop();
    expect(service['warningSubscription']).toBeNull();
  });

  it('should re-arm the timer on user activity', () => {
    service.start();
    const armed = service['warningSubscription'];

    document.dispatchEvent(new Event('click'));

    expect(service['warningSubscription']).not.toBe(armed);
  });

  it('should keep the session alive when the consultant stays', () => {
    service['showWarning']();

    expect(dialogStub.open).toHaveBeenCalled();
    expect(authServiceStub.redirectToLogin).not.toHaveBeenCalled();
    expect(service['warningSubscription']).not.toBeNull();
  });

  it('should redirect to login when the consultant lets the session lapse', () => {
    afterClosed = of(false);

    service['showWarning']();

    expect(authServiceStub.redirectToLogin).toHaveBeenCalled();
  });
});

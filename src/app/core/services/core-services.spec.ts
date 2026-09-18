import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { BrandThemeService } from './brand-theme.service';
import { LoggingService } from './logging.service';
import { SessionTimeoutService } from './session-timeout.service';
import { SessionTimeoutDialogComponent } from '../components/session-timeout-dialog/session-timeout-dialog.component';
import { BRANDS } from '../../shared/models/brand.model';
import { Consultant } from '../../shared/models/consultant.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {

  let service: AuthService;
  let httpMock: HttpTestingController;

  const consultant: Consultant = {
    consultantId: 'SUN12345', displayName: 'Rebecca Tran', roles: ['CLAIMS_CONSULTANT']
  } as Consultant;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    document.cookie = 'SMSESSION=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  });

  afterEach(() => httpMock.verify());

  it('should publish the consultant profile once loaded', () => {
    let current: Consultant;
    service.currentUser$.subscribe(user => current = user);
    expect(current).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();

    service.loadProfile().subscribe();
    httpMock.expectOne(environment.claimsApiBaseUrl + '/session/profile').flush(consultant);

    expect(current.displayName).toBe('Rebecca Tran');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.hasRole('CLAIMS_CONSULTANT')).toBeTrue();
    expect(service.hasRole('TEAM_LEADER')).toBeFalse();
    service.consultantId().subscribe(id => expect(id).toBe('SUN12345'));
  });

  it('should clear the profile when the session lookup fails', () => {
    let resolved: Consultant | undefined;
    service.loadProfile().subscribe(user => resolved = user);
    httpMock.expectOne(environment.claimsApiBaseUrl + '/session/profile')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(resolved).toBeNull();
    expect(service.hasRole('CLAIMS_CONSULTANT')).toBeFalse();
    service.consultantId().subscribe(id => expect(id).toBeNull());
  });

  it('should read the SiteMinder session cookie as the token', () => {
    expect(service.getToken()).toBeNull();
    document.cookie = 'SMSESSION=abc123; path=/';
    expect(service.getToken()).toBe('abc123');
    expect(service.isAuthenticated()).toBeTrue();
  });
});

describe('BrandThemeService', () => {

  let service: BrandThemeService;

  beforeEach(() => {
    service = new BrandThemeService();
  });

  afterEach(() => BRANDS.forEach(b => document.body.classList.remove('sun-brand-' + b.cssKey)));

  it('should apply the brand body class for every brand', () => {
    for (const brand of BRANDS) {
      expect(service.applyBrand(brand.code)).toEqual(brand);
      expect(document.body.classList.contains('sun-brand-' + brand.cssKey)).toBeTrue();
      expect(service.getActiveBrand()).toEqual(brand);
      BRANDS.filter(other => other !== brand)
        .forEach(other => expect(document.body.classList.contains('sun-brand-' + other.cssKey)).toBeFalse());
    }
  });

  it('should fall back to the first brand for unknown codes', () => {
    expect(service.applyBrand('XYZ')).toEqual(BRANDS[0]);
  });

  it('should use the environment default brand when the host is not a brand host', () => {
    const brand = service.applyBrandFromHost();
    expect(brand.code).toBe(environment.defaultBrand);
    expect(document.body.classList.contains('sun-brand-' + brand.cssKey)).toBeTrue();
  });
});

describe('LoggingService', () => {

  let service: LoggingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggingService]
    });
    service = TestBed.inject(LoggingService);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(console, 'error');
  });

  afterEach(() => httpMock.verify());

  it('should ship errors to the client log endpoint', () => {
    service.error('Unable to lodge the claim', new Error('timeout'));

    const request = httpMock.expectOne(environment.claimsApiBaseUrl + '/client-logs');
    expect(request.request.body.level).toBe('ERROR');
    expect(request.request.body.message).toBe('Unable to lodge the claim');
    expect(request.request.body.detail).toBe('timeout');
    request.flush({});
  });

  it('should swallow logging failures', () => {
    expect(() => {
      service.error('Unable to lodge the claim');
      httpMock.expectOne(environment.claimsApiBaseUrl + '/client-logs')
        .flush({}, { status: 500, statusText: 'Server Error' });
    }).not.toThrow();
    expect(console.error).toHaveBeenCalledWith('Unable to lodge the claim', undefined);
  });

  it('should post audit events', () => {
    service.audit('CLAIM_LODGED', 'CLM0000123456');

    const request = httpMock.expectOne(environment.claimsApiBaseUrl + '/audit');
    expect(request.request.body.action).toBe('CLAIM_LODGED');
    expect(request.request.body.claimNumber).toBe('CLM0000123456');
    request.flush({});
  });
});

describe('SessionTimeoutService', () => {

  let service: SessionTimeoutService;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<SessionTimeoutDialogComponent>>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<SessionTimeoutDialogComponent>>('MatDialogRef', ['afterClosed']);
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    dialog.open.and.returnValue(dialogRef);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['redirectToLogin']);
    service = new SessionTimeoutService(dialog, authService);
  });

  afterEach(() => service.stop());

  it('should warn after 13 idle minutes and keep the session when the consultant continues', fakeAsync(() => {
    dialogRef.afterClosed.and.returnValue(of(true));
    service.start();

    tick(12 * 60000);
    expect(dialog.open).not.toHaveBeenCalled();

    tick(60000);
    expect(dialog.open).toHaveBeenCalledWith(SessionTimeoutDialogComponent, jasmine.objectContaining({
      disableClose: true,
      data: { remainingMinutes: 2 }
    }));
    expect(authService.redirectToLogin).not.toHaveBeenCalled();

    tick(13 * 60000);
    expect(dialog.open).toHaveBeenCalledTimes(2);
    discardPeriodicTasks();
  }));

  it('should redirect to SiteMinder when the consultant signs out from the warning', fakeAsync(() => {
    dialogRef.afterClosed.and.returnValue(of(false));
    service.start();

    tick(13 * 60000);
    expect(authService.redirectToLogin).toHaveBeenCalled();
  }));

  it('should reset the idle timer on user activity', fakeAsync(() => {
    dialogRef.afterClosed.and.returnValue(of(true));
    service.start();

    tick(10 * 60000);
    document.dispatchEvent(new Event('click'));
    tick(10 * 60000);
    expect(dialog.open).not.toHaveBeenCalled();

    tick(3 * 60000);
    expect(dialog.open).toHaveBeenCalledTimes(1);
    discardPeriodicTasks();
  }));

  it('should not warn once stopped', fakeAsync(() => {
    service.start();
    service.stop();
    tick(15 * 60000);
    expect(dialog.open).not.toHaveBeenCalled();
  }));
});

describe('SessionTimeoutDialogComponent', () => {

  it('should close with the keep-alive decision', () => {
    const dialogRef = jasmine.createSpyObj<MatDialogRef<SessionTimeoutDialogComponent>>('MatDialogRef', ['close']);
    const component = new SessionTimeoutDialogComponent(dialogRef, { remainingMinutes: 2 });

    component.keepWorking();
    expect(dialogRef.close).toHaveBeenCalledWith(true);

    component.signOut();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});

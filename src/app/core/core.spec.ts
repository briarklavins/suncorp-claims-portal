import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { UnsavedClaimGuard } from './guards/unsaved-claim.guard';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { CorrelationIdInterceptor } from './interceptors/correlation-id.interceptor';
import { LoggingService } from './services/logging.service';
import { BrandThemeService } from './services/brand-theme.service';
import { environment } from '../../environments/environment';

describe('core', () => {

  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getToken', 'redirectToLogin', 'isAuthenticated']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthGuard,
        UnsavedClaimGuard,
        LoggingService,
        BrandThemeService,
        { provide: AuthService, useValue: authService },
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CorrelationIdInterceptor, multi: true }
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('interceptors', () => {
    it('should attach the SiteMinder session and a correlation id', () => {
      authService.getToken.and.returnValue('abc123');
      http.get('/claims-api/v1/claims').subscribe();

      const request = httpMock.expectOne('/claims-api/v1/claims');
      expect(request.request.headers.get('X-SM-Session')).toBe('abc123');
      expect(request.request.headers.get('X-Channel')).toBe('CLAIMS-PORTAL');
      expect(request.request.headers.get('X-Correlation-Id')).toMatch(/^CLM-[0-9A-F]{16}$/);
      request.flush([]);
    });

    it('should not attach a session header when there is no token', () => {
      authService.getToken.and.returnValue(null);
      http.get('/claims-api/v1/claims').subscribe();

      const request = httpMock.expectOne('/claims-api/v1/claims');
      expect(request.request.headers.has('X-SM-Session')).toBe(false);
      request.flush([]);
    });

    it('should redirect to login on a 401', () => {
      authService.getToken.and.returnValue('expired');
      let failed = false;
      http.get('/claims-api/v1/claims').subscribe({ error: () => failed = true });

      httpMock.expectOne('/claims-api/v1/claims').flush('', { status: 401, statusText: 'Unauthorized' });
      expect(failed).toBe(true);
      expect(authService.redirectToLogin).toHaveBeenCalled();
    });
  });

  describe('AuthGuard', () => {
    it('should allow authenticated consultants through', () => {
      authService.isAuthenticated.and.returnValue(true);
      expect(TestBed.inject(AuthGuard).canActivate(null, null)).toBe(true);
      expect(authService.redirectToLogin).not.toHaveBeenCalled();
    });

    it('should redirect anonymous users to SiteMinder', () => {
      authService.isAuthenticated.and.returnValue(false);
      expect(TestBed.inject(AuthGuard).canActivate(null, null)).toBe(false);
      expect(authService.redirectToLogin).toHaveBeenCalled();
    });
  });

  describe('UnsavedClaimGuard', () => {
    it('should only prompt when there are unsaved changes', () => {
      const guard = TestBed.inject(UnsavedClaimGuard);
      spyOn(window, 'confirm').and.returnValue(false);
      expect(guard.canDeactivate({ hasUnsavedChanges: () => false })).toBe(true);
      expect(guard.canDeactivate({ hasUnsavedChanges: () => true })).toBe(false);
      expect(window.confirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('LoggingService', () => {
    it('should post errors and audit events to the claims api', () => {
      const logging = TestBed.inject(LoggingService);
      spyOn(console, 'error');

      logging.error('boom', new Error('detail'));
      const errorRequest = httpMock.expectOne(environment.claimsApiBaseUrl + '/client-logs');
      expect(errorRequest.request.body.level).toBe('ERROR');
      expect(errorRequest.request.body.detail).toBe('detail');
      errorRequest.flush({});

      logging.audit('CLAIM_LODGED', 'CLM1');
      const auditRequest = httpMock.expectOne(environment.claimsApiBaseUrl + '/audit');
      expect(auditRequest.request.body.action).toBe('CLAIM_LODGED');
      auditRequest.flush({});
    });
  });

  describe('BrandThemeService', () => {
    it('should apply the brand css class to the body', () => {
      const service = TestBed.inject(BrandThemeService);
      const brand = service.applyBrand('AAM');
      expect(brand.displayName).toBe('AAMI');
      expect(document.body.classList.contains('sun-brand-aami')).toBe(true);
      expect(service.getActiveBrand()).toBe(brand);

      service.applyBrand('GIO');
      expect(document.body.classList.contains('sun-brand-aami')).toBe(false);
      expect(document.body.classList.contains('sun-brand-gio')).toBe(true);
    });

    it('should fall back to the default brand for unknown hosts', () => {
      const brand = TestBed.inject(BrandThemeService).applyBrandFromHost();
      expect(brand.code).toBe(environment.defaultBrand);
    });
  });
});

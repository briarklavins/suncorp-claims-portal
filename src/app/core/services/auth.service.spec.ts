import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {

  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    document.cookie = 'SMSESSION=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  afterEach(() => httpMock.verify());

  it('should publish the consultant profile once loaded', () => {
    let consultantId: string;
    service.consultantId().subscribe(id => consultantId = id);
    expect(consultantId).toBeNull();
    expect(service.isAuthenticated()).toBe(false);

    service.loadProfile().subscribe();
    httpMock.expectOne(environment.claimsApiBaseUrl + '/session/profile')
      .flush({ consultantId: 'SUN12345', displayName: 'Rebecca Tran', roles: ['CLAIMS_CONSULTANT'] });

    expect(consultantId).toBe('SUN12345');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.hasRole('CLAIMS_CONSULTANT')).toBe(true);
    expect(service.hasRole('TEAM_LEADER')).toBe(false);
  });

  it('should clear the profile when the session lookup fails', () => {
    let profile: any = 'unset';
    service.loadProfile().subscribe(result => profile = result);
    httpMock.expectOne(environment.claimsApiBaseUrl + '/session/profile').flush('', { status: 500, statusText: 'Error' });
    expect(profile).toBeNull();
    expect(service.hasRole('CLAIMS_CONSULTANT')).toBe(false);
  });

  it('should read the SiteMinder session cookie', () => {
    document.cookie = 'SMSESSION=tok123';
    expect(service.getToken()).toBe('tok123');
    expect(service.isAuthenticated()).toBe(true);
  });
});

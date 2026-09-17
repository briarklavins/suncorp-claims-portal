import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { Consultant } from '../../shared/models/consultant.model';
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
  });

  afterEach(() => httpMock.verify());

  it('should publish the consultant profile and expose their roles', () => {
    service.loadProfile().subscribe(profile => expect(profile.consultantId).toBe('C123456'));

    httpMock.expectOne(environment.claimsApiBaseUrl + '/session/profile').flush(consultant());

    expect(service.isAuthenticated()).toBe(true);
    expect(service.hasRole('CLAIMS_LODGE')).toBe(true);
    expect(service.hasRole('CLAIMS_APPROVE')).toBe(false);
    service.consultantId().subscribe(id => expect(id).toBe('C123456'));
  });

  it('should clear the consultant when the profile call fails', () => {
    service.loadProfile().subscribe(profile => expect(profile).toBeNull());

    httpMock.expectOne(environment.claimsApiBaseUrl + '/session/profile')
      .flush('no session', { status: 401, statusText: 'Unauthorized' });

    expect(service.hasRole('CLAIMS_LODGE')).toBe(false);
    service.consultantId().subscribe(id => expect(id).toBeNull());
  });

  it('should read the SiteMinder session cookie as the token', () => {
    document.cookie = 'SMSESSION=abc123';

    expect(service.getToken()).toBe('abc123');
    expect(service.isAuthenticated()).toBe(true);
  });

  function consultant(): Consultant {
    return {
      consultantId: 'C123456',
      displayName: 'Casey Consultant',
      emailAddress: 'casey.consultant@suncorp.com.au',
      site: 'Brisbane',
      roles: ['CLAIMS_LODGE']
    };
  }
});

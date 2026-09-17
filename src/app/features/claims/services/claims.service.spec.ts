import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ClaimsService } from './claims.service';
import { LoggingService } from '../../../core/services/logging.service';
import { Claim } from '../../../shared/models/claim.model';
import { environment } from '../../../../environments/environment';

describe('ClaimsService', () => {

  let service: ClaimsService;
  let httpMock: HttpTestingController;

  const loggingServiceStub = {
    error: jasmine.createSpy('error'),
    audit: jasmine.createSpy('audit')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClaimsService,
        { provide: LoggingService, useValue: loggingServiceStub }
      ]
    });

    service = TestBed.inject(ClaimsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should request recent claims sorted by lodgement date', () => {
    service.findRecentClaims(10).subscribe(claims => expect(claims.length).toBe(1));

    const request = httpMock.expectOne(req =>
      req.url === environment.claimsApiBaseUrl + '/claims' && req.params.get('limit') === '10');
    expect(request.request.params.get('sort')).toBe('lodgedAt,desc');
    request.flush([hailClaim()]);
  });

  it('should audit a lodged claim', () => {
    service.lodge(hailClaim()).subscribe(claim => expect(claim.claimNumber).toBe('CLM0000123456'));

    httpMock.expectOne(environment.claimsApiBaseUrl + '/claims').flush(hailClaim());
    expect(loggingServiceStub.audit).toHaveBeenCalledWith('CLAIM_LODGED', 'CLM0000123456');
  });

  it('should fetch a single claim by claim number', () => {
    service.findByClaimNumber('CLM0000123456').subscribe(claim => expect(claim.policyNumber).toBe('1400000001'));

    httpMock.expectOne(environment.claimsApiBaseUrl + '/claims/CLM0000123456').flush(hailClaim());
  });

  it('should fetch the claims held against a policy', () => {
    service.findByPolicyNumber('1400000001').subscribe(claims => expect(claims.length).toBe(1));

    const request = httpMock.expectOne(req => req.url === environment.claimsApiBaseUrl + '/claims');
    expect(request.request.params.get('policyNumber')).toBe('1400000001');
    request.flush([hailClaim()]);
  });

  it('should patch a claim status', () => {
    service.updateStatus('CLM0000123456', 'UNDER_ASSESSMENT').subscribe();

    const request = httpMock.expectOne(environment.claimsApiBaseUrl + '/claims/CLM0000123456');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body.status).toBe('UNDER_ASSESSMENT');
    request.flush(hailClaim());
  });

  it('should resolve a claim snapshot for the print view', async () => {
    const snapshot = service.getClaimSnapshot('CLM0000123456');

    httpMock.expectOne(environment.claimsApiBaseUrl + '/claims/CLM0000123456').flush(hailClaim());

    expect((await snapshot).claimNumber).toBe('CLM0000123456');
  });

  it('should log and rethrow a failed claim search', () => {
    let failed = false;
    service.findRecentClaims(10).subscribe({ error: () => failed = true });

    httpMock.expectOne(req => req.url === environment.claimsApiBaseUrl + '/claims')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(failed).toBe(true);
    expect(loggingServiceStub.error).toHaveBeenCalled();
  });

  function hailClaim(): Claim {
    return {
      claimNumber: 'CLM0000123456',
      policyNumber: '1400000001',
      brandCode: 'AAM',
      status: 'LODGED',
      incident: {
        claimType: 'MOTOR_HAIL',
        incidentDate: new Date('2024-10-31T00:00:00'),
        incidentTime: '16:45',
        description: 'Hail damage to roof and bonnet during the Brisbane storm',
        incidentSuburb: 'Springfield Lakes',
        incidentState: 'QLD',
        incidentPostcode: '4300',
        policeReported: false,
        thirdPartyInvolved: false,
        driveable: true
      },
      thirdParties: [],
      settlement: { method: 'REPAIR' },
      documents: []
    };
  }
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

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

  afterEach(() => {
    httpMock.verify();
    loggingServiceStub.error.calls.reset();
    loggingServiceStub.audit.calls.reset();
  });

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

  it('should retrieve a claim by number', () => {
    let claim: Claim;
    service.findByClaimNumber('CLM0000123456').subscribe(result => claim = result);

    httpMock.expectOne(environment.claimsApiBaseUrl + '/claims/CLM0000123456').flush(hailClaim());
    expect(claim.incident.claimType).toBe('MOTOR_HAIL');
  });

  it('should retrieve claims for a policy', () => {
    service.findByPolicyNumber('1400000001').subscribe(claims => expect(claims.length).toBe(1));

    const request = httpMock.expectOne(req =>
      req.url === environment.claimsApiBaseUrl + '/claims' && req.params.get('policyNumber') === '1400000001');
    request.flush([hailClaim()]);
  });

  it('should patch the claim status', () => {
    let claim: Claim;
    service.updateStatus('CLM0000123456', 'WITHDRAWN').subscribe(result => claim = result);

    const request = httpMock.expectOne(environment.claimsApiBaseUrl + '/claims/CLM0000123456');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ status: 'WITHDRAWN' });
    request.flush({ ...hailClaim(), status: 'WITHDRAWN' });
    expect(claim.status).toBe('WITHDRAWN');
  });

  it('should resolve a claim snapshot as a promise', async () => {
    const snapshot = service.getClaimSnapshot('CLM0000123456');
    httpMock.expectOne(environment.claimsApiBaseUrl + '/claims/CLM0000123456').flush(hailClaim());
    expect((await snapshot).claimNumber).toBe('CLM0000123456');
  });

  it('should log and rethrow API failures', () => {
    let error: HttpErrorResponse;
    service.findRecentClaims(10).subscribe({ error: e => error = e });

    httpMock.expectOne(req => req.url === environment.claimsApiBaseUrl + '/claims')
      .flush({ message: 'boom' }, { status: 500, statusText: 'Server Error' });

    expect(error.status).toBe(500);
    expect(loggingServiceStub.error).toHaveBeenCalledWith('Unable to retrieve recent claims', error);
    expect(loggingServiceStub.audit).not.toHaveBeenCalled();
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

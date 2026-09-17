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

    service = TestBed.get(ClaimsService);
    httpMock = TestBed.get(HttpTestingController);
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
